import { NextResponse } from "next/server";

type Row = {
  teamName: string;
  captainName: string;
  members: string[];
  escapeTimeRaw: string;
  escapeTimeSeconds: number;
};

function parseTimeToSeconds(s: string): number {
  // supports "mm:ss" or "hh:mm:ss"
  const raw = (s || "").trim();
  if (!raw) return Number.POSITIVE_INFINITY;

  const parts = raw.split(":").map((p) => p.trim());
  if (parts.some((p) => p === "" || Number.isNaN(Number(p)))) return Number.POSITIVE_INFINITY;

  if (parts.length === 2) {
    const [mm, ss] = parts.map(Number);
    return mm * 60 + ss;
  }
  if (parts.length === 3) {
    const [hh, mm, ss] = parts.map(Number);
    return hh * 3600 + mm * 60 + ss;
  }
  return Number.POSITIVE_INFINITY;
}

function splitCsvLine(line: string): string[] {
  const raw = line ?? "";

  // Auto-detect delimiter when there are no quotes involved (common with Sheets exports)
  // Prefer comma, else tab, else semicolon.
  const hasQuotes = raw.includes('"');
  if (!hasQuotes) {
    let delim = ",";
    if (!raw.includes(",") && raw.includes("\t")) delim = "\t";
    else if (!raw.includes(",") && raw.includes(";")) delim = ";";
    return raw.split(delim).map((v) => v.trim());
  }

  // Quoted CSV parser (commas inside quotes)
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (ch === '"' && raw[i + 1] === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);

  return out.map((v) => v.trim());
}

function csvToRows(csv: string): Row[] {
  const lines = csv
    .split("\n")
    .map((l) => l.replace(/\r/g, "").trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const header = splitCsvLine(lines[1]).map((h) => h.toLowerCase());
  const idx = (name: string) => header.indexOf(name.toLowerCase());

  const iTeam = idx("team name");
  const iCaptain = idx("captain name");
  const iM1 = idx("member 1");
  const iM2 = idx("member 2");
  const iM3 = idx("member 3");
  const iM4 = idx("member 4");
  const iM5 = idx("member 5");
  const iTime = idx("escape time");

  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);

    const teamName = (cols[iTeam] || "").trim();
    const captainName = (cols[iCaptain] || "").trim();
    const members = [cols[iM1], cols[iM2], cols[iM3], cols[iM4], cols[iM5]]
      .map((x) => (x || "").trim())
      .filter(Boolean);

    const escapeTimeRaw = (cols[iTime] || "").trim();
    const escapeTimeSeconds = parseTimeToSeconds(escapeTimeRaw);

    return { teamName, captainName, members, escapeTimeRaw, escapeTimeSeconds };
  })
  .filter((r) => r.teamName && Number.isFinite(r.escapeTimeSeconds));
}

export async function GET() {
  const SHEET_ID = process.env.LEADERBOARD_SHEET_ID;
  const GID = process.env.LEADERBOARD_GID;

  if (!SHEET_ID || !GID) {
    return NextResponse.json(
      { error: "Missing LEADERBOARD_SHEET_ID or LEADERBOARD_GID env vars." },
      { status: 500 }
    );
  }

  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

  const res = await fetch(csvUrl, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: `Failed to fetch sheet: ${res.status}` }, { status: 500 });
  }

  const csv = await res.text();
  const rows = csvToRows(csv)
    .sort((a, b) => a.escapeTimeSeconds - b.escapeTimeSeconds);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    rows,
    top3: rows.slice(0, 3),
  });
}

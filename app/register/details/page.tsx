"use client";

import RegisterShell from "@/components/register/RegisterShell";
import { useRegister } from "@/components/register/RegisterProvider";
import { StepNavButtons } from "@/components/register/StepNavButtons";
import { canGoDetails } from "@/components/register/routeGuards";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function DetailsPage() {
  const router = useRouter();
  const { state, setState, hydrated } = useRegister();

  useEffect(() => {
    if (!hydrated) return;
    if (!canGoDetails(state)) router.replace("/register");
  }, [hydrated, state, router]);

  const initial = useMemo(
    () => ({
      groupName: (state.details as any)?.groupName ?? "",
      captainName: (state.details as any)?.captainName ?? "",
      email: state.details?.email ?? "",
      phone: state.details?.phone ?? "",
      telegram: state.details?.telegram ?? "",
      member1: (state.details as any)?.member1 ?? "",
      member2: (state.details as any)?.member2 ?? "",
      member3: (state.details as any)?.member3 ?? "",
      member4: (state.details as any)?.member4 ?? "",
      member5: (state.details as any)?.member5 ?? "",
    }),
    [state.details]
  );

  const [groupName, setGroupName] = useState(initial.groupName);
  const [captainName, setCaptainName] = useState(initial.captainName);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [telegram, setTelegram] = useState(initial.telegram);
  const [member1, setMember1] = useState(initial.member1);
  const [member2, setMember2] = useState(initial.member2);
  const [member3, setMember3] = useState(initial.member3);
  const [member4, setMember4] = useState(initial.member4);
  const [member5, setMember5] = useState(initial.member5);

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    // when state loads from localStorage, sync inputs once
    setGroupName(initial.groupName);
    setCaptainName(initial.captainName);
    setEmail(initial.email);
    setPhone(initial.phone);
    setTelegram(initial.telegram);
    setMember1(initial.member1);
    setMember2(initial.member2);
    setMember3(initial.member3);
    setMember4(initial.member4);
    setMember5(initial.member5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const phoneOk = phone.trim().length >= 8;
  const telegramOk = telegram.trim().startsWith("@") && telegram.trim().length >= 2;
  const groupOk = groupName.trim().length >= 2;
  const captainOk = captainName.trim().length >= 2;

  const member1Ok = member1.trim().length >= 2;
  const member2Ok = member2.trim().length >= 2;
  const member3Ok = member3.trim().length >= 2;
  const member4Ok = member4.trim().length >= 2;
  // member5 optional: ok if empty OR >= 2 chars
  const member5Ok = member5.trim().length === 0 || member5.trim().length >= 2;

  const ok =
    groupOk &&
    captainOk &&
    emailOk &&
    phoneOk &&
    telegramOk &&
    member1Ok &&
    member2Ok &&
    member3Ok &&
    member4Ok &&
    member5Ok;

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder:text-gray-300 outline-none focus:border-gray-900";

  const errClass = "mt-2 text-xs text-red-600";

  return (
    <RegisterShell title="Register • Booking details">
      <p className="text-[20px] text-gray-800">Fill in your details for the booking.</p>

      <p className="mt-2 text-[16px] text-gray-700">
        We highly encourage to register <span className="font-semibold text-[#961818]">6 people</span> in one group.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Group name */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-800">Group name</label>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="Group Name"
          />
          {touched && !groupOk && <p className={errClass}>Please enter a group name.</p>}
        </div>

        {/* Captain name */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-800">Captain’s name</label>
          <input
            value={captainName}
            onChange={(e) => setCaptainName(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="e.g. Agatha Via"
          />
          {touched && !captainOk && <p className={errClass}>Please enter the captain’s name.</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-800">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="name@gmail.com"
          />
          {touched && !emailOk && <p className={errClass}>Please enter a valid email.</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-gray-800">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="e.g. 9123 4567"
          />
          {touched && !phoneOk && (
            <p className={errClass}>Please enter a phone number (min 8 chars).</p>
          )}
        </div>
        
        {/* Telegram */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-800">Telegram Handle</label>
          <input
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="e.g. @agathavia"
          />
          {touched && !telegramOk && (
            <p className={errClass}>Please enter a valid Telegram handle (e.g. @agathavia).</p>
          )}
        </div>

        {/* Members */}
        <div>
          <label className="text-sm font-medium text-gray-800">Member 1</label>
          <input
            value={member1}
            onChange={(e) => setMember1(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="Member 1 name"
          />
          {touched && !member1Ok && <p className={errClass}>Please enter Member 1.</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800">Member 2</label>
          <input
            value={member2}
            onChange={(e) => setMember2(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="Member 2 name"
          />
          {touched && !member2Ok && <p className={errClass}>Please enter Member 2.</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800">Member 3</label>
          <input
            value={member3}
            onChange={(e) => setMember3(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="Member 3 name"
          />
          {touched && !member3Ok && <p className={errClass}>Please enter Member 3.</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800">Member 4</label>
          <input
            value={member4}
            onChange={(e) => setMember4(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="Member 4 name"
          />
          {touched && !member4Ok && <p className={errClass}>Please enter Member 4.</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800">
            Member 5 <span className="text-gray-500">(optional)</span>
          </label>
          <input
            value={member5}
            onChange={(e) => setMember5(e.target.value)}
            onBlur={() => setTouched(true)}
            className={inputClass}
            placeholder="Member 5 name (optional)"
          />
          {touched && !member5Ok && (
            <p className={errClass}>If provided, Member 5 must be at least 2 characters.</p>
          )}
        </div>
      </div>

      <StepNavButtons
        backHref="/register"
        nextLabel="Next"
        nextDisabled={!ok}
        onNext={() => {
          setTouched(true);
          if (!ok) return;

          setState((prev) => ({
            ...prev,
            details: {
              // keep existing keys if you want, but adding these is fine
              groupName: groupName.trim(),
              captainName: captainName.trim(),
              email: email.trim(),
              phone: phone.trim(),
              telegram: telegram.trim(),
              member1: member1.trim(),
              member2: member2.trim(),
              member3: member3.trim(),
              member4: member4.trim(),
              member5: member5.trim(),
            } as any,
          }));

          router.push("/register/slot");
        }}
      />
    </RegisterShell>
  );
}

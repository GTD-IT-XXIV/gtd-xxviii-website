import { RegisterProvider } from "@/components/register/RegisterProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RegisterProvider>{children}</RegisterProvider>;
}
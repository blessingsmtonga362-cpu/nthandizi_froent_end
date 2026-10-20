import { redirect } from "next/navigation";

export default function LegacyVerifyPage() {
  redirect("/verify-email");
}

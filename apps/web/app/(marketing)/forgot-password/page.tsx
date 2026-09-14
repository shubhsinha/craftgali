import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { currentUser } from "@/lib/auth";
import { mailIsConfigured } from "@/lib/mail";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Send yourself a link to choose a new CraftGali password.",
};

export default async function ForgotPasswordPage() {
  if (await currentUser()) redirect("/settings");

  return (
    <AuthPanel
      title="Forgot your password?"
      lede="Give us the email on the account and we'll send a link to set a new password. The link is good for an hour."
      footer={
        <>
          Remembered it? <Link href="/sign-in">Sign in</Link>.
        </>
      }
    >
      {/* Read on the server: whether a mail provider exists is an operator's
          business, not something to hand to every visitor. */}
      <ForgotPasswordForm mailConfigured={mailIsConfigured()} />
    </AuthPanel>
  );
}

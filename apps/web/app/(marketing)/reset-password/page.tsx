import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password",
  /* A reset link must never be indexed or previewed by a link-scanner. */
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    return (
      <AuthPanel
        title="That link is incomplete"
        lede="The address is missing its token, which usually means the link wrapped onto two lines in an email. Ask for a fresh one."
        footer={
          <>
            <Link href="/forgot-password">Send another link</Link>.
          </>
        }
      >
        <div />
      </AuthPanel>
    );
  }

  return (
    <AuthPanel
      title="Set a new password"
      lede="Choose something you don't use anywhere else. Every other device signed into this account will be signed out."
      footer={
        <>
          Changed your mind? <Link href="/sign-in">Sign in</Link>.
        </>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthPanel>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { currentUser } from "@/lib/auth";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  if (await currentUser()) redirect("/discover");

  return (
    <AuthPanel
      title="Welcome back"
      lede="Sign in to keep up with your saved pieces, your conversations and the makers near you."
      footer={
        <>
          By signing in you agree to our <Link href="/guidelines">guidelines</Link>.
        </>
      }
    >
      <SignInForm next={searchParams.next} />
    </AuthPanel>
  );
}

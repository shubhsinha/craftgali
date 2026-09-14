import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { currentUser } from "@/lib/auth";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  if (await currentUser()) redirect("/discover");

  return (
    <AuthPanel
      title="Create your account"
      lede="One account buys and sells. Open a storefront whenever you're ready — it stays free for five pieces at a time."
      footer={
        <>
          By creating an account you agree to our{" "}
          <Link href="/guidelines">guidelines</Link>.
        </>
      }
    >
      <RegisterForm next={searchParams.next} />
    </AuthPanel>
  );
}

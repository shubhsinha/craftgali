import { LandingPage } from "@/components/marketing/LandingPage";
import type { Stream } from "@/lib/types";

export default function HomePage({ searchParams }: { searchParams: { stream?: string } }) {
  const stream: Stream = searchParams.stream === "decor" ? "decor" : "art";
  return <LandingPage stream={stream} />;
}

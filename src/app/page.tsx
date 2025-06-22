import CTA from "@/components/cta";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Pricing from "@/components/pricing";
import Stats from "@/components/status";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

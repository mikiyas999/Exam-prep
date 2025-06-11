import CTA from "@/components/cta";
import Features from "@/components/features";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Pricing from "@/components/pricing";
import Stats from "@/components/status";

export default function Home() {
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

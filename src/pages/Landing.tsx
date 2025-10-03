import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { WorkflowSteps } from "@/components/landing/WorkflowSteps";
import { AgentShowcase } from "@/components/landing/AgentShowcase";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Testimonials } from "@/components/landing/Testimonials";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <ProblemSolution />
        <FeaturesGrid />
        <WorkflowSteps />
        <AgentShowcase />
        <Testimonials />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
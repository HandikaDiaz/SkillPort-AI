import BYOCSection from "../landing/BYOCSection";
import CTASection from "../landing/CTASection";
import FAQSection from "../landing/FAQSection";
import FooterSection from "../landing/FooterSection";
import HeroSection from "../landing/HeroSection";
import HowItWorksSection from "../landing/HowItWorksSection";
import PricingComparisonSection from "../landing/PricingComparisonSection";
import ProblemSolutionsSection from "../landing/ProblemSolutionsSection";
import TrustStatsSection from "../landing/TrustStateAction";
import VerifiedTalentsSection from "../landing/VerifiedTalentsSection";
import NavbarLandingPage from "../navbar/NavbarLandingPage";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <NavbarLandingPage />
            <HeroSection />
            <TrustStatsSection />
            <HowItWorksSection />
            <ProblemSolutionsSection />
            <BYOCSection />
            <VerifiedTalentsSection />
            <PricingComparisonSection />
            <FAQSection />
            <CTASection />
            <FooterSection />
        </div>
    );
}
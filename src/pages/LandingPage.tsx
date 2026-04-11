import ComparisonSection from "../components/Comparison";
import TestimonialsAndFAQ from "../components/FAQ";
import FeaturesStack from "../components/Feature";
import StickyFooter from "../components/footer";
import HBelow from "../components/HBelow";
import HeroSection from "../components/HeroSection";
import PlanGate from "../components/PlanGate";
import PricingSection from "../components/PricingSection";
const LandingPage = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <HBelow></HBelow>
      <FeaturesStack></FeaturesStack>
      <ComparisonSection></ComparisonSection>
      <PlanGate hideFor="PRO">
        <PricingSection></PricingSection>
      </PlanGate>
      <TestimonialsAndFAQ></TestimonialsAndFAQ>
      <StickyFooter></StickyFooter>
    </div>
  );
};
export default LandingPage;

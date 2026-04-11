import ComparisonSection from "../components/Comparison";
import TestimonialsAndFAQ from "../components/FAQ";
import FeaturesStack from "../components/Feature";
import HBelow from "../components/HBelow";
import HeroSection from "../components/HeroSection";
import PricingSection from "../components/PricingSection";
import StickyFooter from "../components/footer";
const LandingPage = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <HBelow></HBelow>
      <FeaturesStack></FeaturesStack>
      <ComparisonSection></ComparisonSection>
      <PricingSection></PricingSection>
      <TestimonialsAndFAQ></TestimonialsAndFAQ>
      <StickyFooter></StickyFooter>
    </div>
  );
};
export default LandingPage;

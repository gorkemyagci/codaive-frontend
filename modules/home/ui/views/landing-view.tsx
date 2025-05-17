import Header from "../components/header";
import Hero from "../sections/landing/hero";
import Features from "../sections/landing/features";
import Trusted from "../sections/landing/trusted";
import BuildSoftware from "../sections/landing/build-software";
import AutoCommit from "../sections/landing/auto-commit";
import Reviews from "../sections/landing/reviews";
import Footer from "../components/footer";
import Pricing from "../sections/landing/pricing";

const LandingView = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Header />
      <Hero />
      <Features />
      <Trusted />
      <BuildSoftware />
      <AutoCommit />
      <Reviews />
      <Pricing />
      <Footer />
    </div>
  );
};
export default LandingView;

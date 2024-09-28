import Header from './Header';
import HeroSection from './Hero'
import FeatureCard from './Features'
import PAOCards from './PAOSlides'
import Faq from "./Faq"
import NewsLetter from "./NewsLetter"
import Footer from "./Footer"
import HowItWorks from "./HowItWorks"
export default function LandingPage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <FeatureCard />
      <PAOCards />
      <HowItWorks />
      <Faq />
      <NewsLetter />
      <Footer />
      {/* Other sections will go here */}
    </div>
  );
}
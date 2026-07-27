import GrainBackground from "./Grain";
import HeroSection from "./HeroSection";
import ProjectPart from "./ProjectPart";
import About from "./About/About";
import Clients from "./Clients";
import Services from "./Services";
import Testimonials from "./Testimonials/Testimonials";
import CtaBanner from "./CtaBanner";
import Footer from "./Footer/Footer";

const Main = () => {
  return (
    <main className="bg-[#FFF0DC] relative overflow-clip">
      <GrainBackground />
      <HeroSection />
      <Clients />
      <Services />
      <ProjectPart />
      <About />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  );
};

export default Main;

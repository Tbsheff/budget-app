import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import TranslationWidget from "@/components/Translation";
const Index = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />

      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
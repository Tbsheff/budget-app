import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

const Hero = () => {
  const features = [
    "Smart AI-powered budget tracking",
    "Student-specific expense categories",
    "Financial aid & scholarship planning",
  ];

  // Animation for individual sections
  const fadeInUp = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // REFS for tracking in-view state
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

  // CHECKS if each section is in view
  const heroInView = useInView(heroRef, { once: false, margin: "-20%" });
  const featuresInView = useInView(featuresRef, {
    once: false,
    margin: "-20%",
  });
  const imageInView = useInView(imageRef, { once: false, margin: "-20%" });
  const buttonInView = useInView(buttonRef, { once: false, margin: "-20%" });

  return (
    <header className="container-padding relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="max-w-7xl mx-auto relative z-10 pt-32 pb-16">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* LEFT TEXT SECTION */}
          <motion.div
            ref={heroRef}
            className="text-left"
            variants={fadeInUp}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <motion.h1
              className="text-6xl font-bold leading-[1.1] mb-12 tracking-tight"
              variants={fadeInUp}
            >
              Smart budgeting,
              <br />
              made for students.
            </motion.h1>
          </motion.div>

          {/* RIGHT IMAGE SECTION */}
          <motion.div
            ref={imageRef}
            className="relative flex justify-center"
            variants={fadeInUp}
            initial="hidden"
            animate={imageInView ? "visible" : "hidden"}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Card className="glass-panel p-6 rounded-2xl overflow-hidden w-fit">
              <img
                src="/images/NewBudget.png"
                alt="Student budget planning illustration"
                className="max-w-full h-auto rounded-lg"
              />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* FEATURES LIST */}
      <div className="max-w-7xl mx-auto mt-16">
        <motion.div
          ref={featuresRef}
          className="space-y-4 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              variants={fadeInUp}
              transition={{ delay: index * 0.2 }}
            >
              <Check className="w-5 h-5 text-accent-purple shrink-0" />
              <span className="text-lg text-neutral-800">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA BUTTON */}
      <motion.div
        ref={buttonRef}
        className="text-center mt-12"
        variants={fadeInUp}
        initial="hidden"
        animate={buttonInView ? "visible" : "hidden"}
        transition={{ delay: 0.2 }}
      >
        <button className="px-8 py-4 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary/90 transition-colors">
          Start budgeting smarter
          <span className="ml-2">→</span>
        </button>
      </motion.div>
    </header>
  );
};

export default Hero;

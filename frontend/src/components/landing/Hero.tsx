import { motion } from "framer-motion";
import { Check } from "lucide-react";

const Hero = () => {
  const features = [
    "Smart AI-powered budget tracking",
    "Student-specific expense categories",
    "Financial aid & scholarship planning"
  ];

  return (
    <header className="container-padding relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto relative z-10 pt-32 pb-16">
        <div className="grid grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-6xl font-bold leading-[1.1] mb-12 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Smart budgeting,<br />
              made for students.
            </motion.h1>

            <motion.div
              className="space-y-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent-purple shrink-0" />
                  <span className="text-lg text-neutral-800">{feature}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button className="px-8 py-4 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary/90 transition-colors">
                Start budgeting smarter
                <span className="ml-2">→</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="/placeholder.svg"
              alt="Student budget planning illustration" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden pt-24 pb-12">
        <motion.div 
          className="text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl font-bold leading-tight mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Smart budgeting,<br />
            made for students.
          </motion.h1>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="/placeholder.svg"
              alt="Student budget planning illustration" 
              className="w-full h-auto max-w-[280px] mx-auto mb-8"
            />
          </motion.div>

          <motion.div
            className="space-y-3 mb-8 max-w-[280px] mx-auto text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent-purple shrink-0" />
                <span className="text-sm text-neutral-800">{feature}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button className="w-full max-w-[280px] px-6 py-4 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary/90 transition-colors">
              Start budgeting smarter
              <span className="ml-2">→</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;
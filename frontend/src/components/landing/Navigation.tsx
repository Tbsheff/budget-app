import { useState } from "react";
import { Menu, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-neutral-200">
      <div className="container-padding">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-7 h-7 text-primary" />
            <span className="text-xl font-semibold">Walit</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-neutral-600 hover:text-primary transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-neutral-600 hover:text-primary transition-colors font-medium">Pricing</a>
            <a href="#about" className="text-neutral-600 hover:text-primary transition-colors font-medium">About</a>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button className="px-4 py-2 text-primary hover:text-primary/80 transition-colors font-medium">
              Log in
            </button>
            <button className="button-secondary">
              Start Free Trial
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-neutral-200/50 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white border-t border-neutral-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container-padding py-4 flex flex-col gap-4">
            <a href="#features" className="text-neutral-600 hover:text-primary transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg">Features</a>
            <a href="#pricing" className="text-neutral-600 hover:text-primary transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg">Pricing</a>
            <a href="#about" className="text-neutral-600 hover:text-primary transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg">About</a>
            <hr className="border-neutral-200" />
            <button className="text-primary hover:text-primary/80 transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg text-left">
              Log in
            </button>
            <button className="button-secondary w-full">
              Start Free Trial
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;
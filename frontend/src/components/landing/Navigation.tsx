import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWallet } from "react-icons/fa"; // Import the specific icon you need

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-neutral-200">
      <div className="container-padding">
        <div className="h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <FaWallet className="w-7 h-7 text-primary" />
            <span className="text-xl font-semibold">Walit</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-neutral-600 hover:text-primary transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-neutral-600 hover:text-primary transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-neutral-600 hover:text-primary transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg"
            >
              About
            </a>
            <hr className="border-neutral-200" />
            <button
              className="text-primary hover:text-primary/80 transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg text-left"
              onClick={handleLoginClick}
            >
              Log in
            </button>
            <button className="button-secondary w-full">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

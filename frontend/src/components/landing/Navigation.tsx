import { useState } from "react";
import { Menu, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-neutral-200">
      <div className="container-padding">
        <div className="h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Wallet className="w-7 h-7 text-primary" />
            <span className="text-xl font-semibold">Walit</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button
              className="px-4 py-2 text-primary hover:text-primary/80 transition-colors font-medium"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="button-secondary"
            >
              Create Account
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
            <hr className="border-neutral-200" />

            {/* Log In Button */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
              className="text-primary hover:text-primary/80 transition-colors font-medium px-4 py-2 hover:bg-neutral-200/50 rounded-lg text-left"
            >
              Log in
            </button>

            {/* Create Account Button */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/register");
              }}
              className="button-secondary w-full"
            >
              Create Account
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;

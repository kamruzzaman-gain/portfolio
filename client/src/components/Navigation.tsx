import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-primary">
              JD
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="hover:text-primary transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-primary transition-colors duration-200 font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("experience")}
                className="hover:text-primary transition-colors duration-200 font-medium"
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="hover:text-primary transition-colors duration-200 font-medium"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("blog")}
                className="hover:text-primary transition-colors duration-200 font-medium"
              >
                Blog
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-primary transition-colors duration-200 font-medium"
              >
                Contact
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection("home")}
              className="block px-3 py-2 hover:text-primary transition-colors duration-200 font-medium w-full text-left"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block px-3 py-2 hover:text-primary transition-colors duration-200 font-medium w-full text-left"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className="block px-3 py-2 hover:text-primary transition-colors duration-200 font-medium w-full text-left"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="block px-3 py-2 hover:text-primary transition-colors duration-200 font-medium w-full text-left"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("blog")}
              className="block px-3 py-2 hover:text-primary transition-colors duration-200 font-medium w-full text-left"
            >
              Blog
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block px-3 py-2 hover:text-primary transition-colors duration-200 font-medium w-full text-left"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

import { Link } from "wouter";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">John Developer</h3>
            <p className="text-slate-400 mb-6 max-w-md">
              Full Stack Developer passionate about creating exceptional digital experiences and solving complex problems through elegant code.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection("home")} className="hover:text-primary transition-colors duration-200">Home</button></li>
              <li><button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors duration-200">About</button></li>
              <li><button onClick={() => scrollToSection("experience")} className="hover:text-primary transition-colors duration-200">Experience</button></li>
              <li><button onClick={() => scrollToSection("projects")} className="hover:text-primary transition-colors duration-200">Projects</button></li>
              <li><button onClick={() => scrollToSection("blog")} className="hover:text-primary transition-colors duration-200">Blog</button></li>
              <li><button onClick={() => scrollToSection("contact")} className="hover:text-primary transition-colors duration-200">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-400">Web Development</span></li>
              <li><span className="text-slate-400">Mobile Apps</span></li>
              <li><span className="text-slate-400">UI/UX Design</span></li>
              <li><span className="text-slate-400">Consulting</span></li>
              <li><span className="text-slate-400">Code Review</span></li>
              <li><span className="text-slate-400">Technical Writing</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 John Developer. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors duration-200">Terms of Service</a>
            <Link href="/admin" className="text-slate-400 hover:text-primary text-sm transition-colors duration-200">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

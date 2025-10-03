import React from "react";
import { Link } from "react-router-dom";
import { Brain, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Agents", href: "#agents" },
      { name: "Pricing", href: "#pricing" },
      { name: "Roadmap", href: "/roadmap" }
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" }
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Community", href: "/community" },
      { name: "Support", href: "/support" }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6" />
                <span className="font-semibold text-lg">Vibe Business</span>
              </Link>
              <p className="text-sm text-gray-600 mb-4">
                Build your SaaS 10x faster with AI-powered agents.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>
              © {currentYear} Vibe Business. All rights reserved.
            </div>
            <div className="flex items-center gap-2">
              Made with <span className="text-red-500">❤️</span> for SaaS builders
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
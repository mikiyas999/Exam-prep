import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-100 to-emerald-100 dark:from-slate-900 dark:to-emerald-900 border-t border-emerald-200 dark:border-emerald-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg"></div>
              <span className="text-xl font-bold text-foreground">
                Ethiopian Airlines Exam Prep
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Empowering Ethiopian students to achieve their aviation dreams
              through comprehensive, expert-designed exam preparation courses
              for AMT, Hostess, and Pilot positions.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-emerald-600 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-teal-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-emerald-600 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-emerald-700 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Practice Tests
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Study Materials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Success Stories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>support@etairlines-prep.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+251 911 123 456</span>
              </li>
            </ul>
            <Badge
              variant="secondary"
              className="mt-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
            >
              Available 24/7
            </Badge>
          </div>
        </div>

        <Separator className="mb-8 bg-emerald-200 dark:bg-emerald-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2024 Ethiopian Airlines Exam Prep. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-emerald-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-emerald-600 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-emerald-600 transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

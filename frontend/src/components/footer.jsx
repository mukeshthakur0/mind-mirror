import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <div className="max-w-6xl mx-auto">
        <div className="mt-4 flex justify-center space-x-8">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
          >
            <Facebook size={20} /> Facebook
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-blue-300 transition-colors"
          >
            <Twitter size={20} /> Twitter
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-pink-500 transition-colors"
          >
            <Instagram size={20} /> Instagram
          </a>

        </div>
          <p className="text-sm mt-4">&copy; {new Date().getFullYear()} MindMirror. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

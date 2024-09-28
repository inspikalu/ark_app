"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start col-span-1 md:col-span-2 lg:col-span-1 px-4">
            <Image
              src="/images/ark.jpg"
              alt="ARK Logo"
              width={isMobile ? 80 : 120}
              height={isMobile ? 80 : 120}
              className="rounded-full mb-4"
            />
            <p className="text-center md:text-left">
              <span className="text-xl md:text-2xl font-bold">ARK</span>
              <br />
              Innovating a reliable future
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-8 col-span-1 md:col-span-2 lg:col-span-3 pl-12">
            <div className="text-left">
              <h6 className="footer-title text-lg font-semibold mb-3">Services</h6>
              <ul className="space-y-2 cursor-pointer">
                <li><a className="hover:text-teal-400 transition-colors">Branding</a></li>
                <li><a className="hover:text-teal-400 transition-colors">Design</a></li>
                <li><a className="hover:text-teal-400 transition-colors">Marketing</a></li>
                <li><a className="hover:text-teal-400 transition-colors">Advertisement</a></li>
              </ul>
            </div>
            <div className="text-left">
              <h6 className="footer-title text-lg font-semibold mb-3">Company</h6>
              <ul className="space-y-2 cursor-pointer">
                <li><a className="hover:text-teal-400 transition-colors">About us</a></li>
                <li><a className="hover:text-teal-400 transition-colors">Contact</a></li>
                <li><a className="hover:text-teal-400 transition-colors">Jobs</a></li>
                <li><a className="hover:text-teal-400 transition-colors">Press kit</a></li>
              </ul>
            </div>
            <div className="text-left col-span-2 md:col-span-1">
              <h6 className="footer-title text-lg font-semibold mb-3">Legal</h6>
              <ul className="space-y-2 cursor-pointer">
                <li><a className="hover:text-teal-400 transition-colors">Terms of use</a></li>
                <li><a className="hover:text-teal-400 transition-colors">Privacy policy</a></li>
                <li><a className="hover:text-teal-400 transition-colors">Cookie policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-sm md:text-base">
          <p>&copy; 2024 ARK Labs</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
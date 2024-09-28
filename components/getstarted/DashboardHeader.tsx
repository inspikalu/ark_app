"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiBell, FiGlobe, FiCheck } from 'react-icons/fi';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const navItems = [
  { name: 'Notifications', href: '/notifications', icon: FiBell },
  { name: 'Language', href: '#', icon: FiGlobe },
];

const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
};

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    setIsLanguageDropdownOpen(false);
    // Language change functionality to be implemented later
    console.log(`Language changed to ${lang}`);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/ark.jpg"
            alt="ARK Logo"
            width={60}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold font-heading text-white">ARK</h1>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <WalletMultiButton
            style={{
              color: 'white',
              background: "linear-gradient(to bottom right,#14b8a6,#134e4a )"
            }} />
          {navItems.map((item) => (
            <div key={item.name} className="relative">
              {item.name === 'Language' ? (
                <button
                  onClick={toggleLanguageDropdown}
                  className="text-white hover:text-gray-300 transition-colors duration-300"
                >
                  <item.icon className="w-6 h-6" />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="text-white hover:text-gray-300 transition-colors duration-300"
                >
                  <item.icon className="w-6 h-6" />
                </Link>
              )}
              {item.name === 'Language' && isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  {Object.entries(languages).map(([langCode, langName]) => (
                    <button
                      key={langCode}
                      onClick={() => changeLanguage(langCode)}
                      className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {langName}
                      {currentLanguage === langCode && (
                        <FiCheck className="w-4 h-4 text-teal-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Wallet comes in here */}
        </nav>
      </div>

      {/* Mobile navigation */}
      <nav className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-black`}>
        <ul className="px-4 py-2">
          {navItems.map((item) => (
            <li key={item.name} className="py-2">
              {item.name === 'Language' ? (
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center w-full px-3 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors duration-300"
                >
                  <item.icon className="w-6 h-6 mr-2" />
                  {item.name}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center px-3 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  <item.icon className="w-6 h-6 mr-2" />
                  {item.name}
                </Link>
              )}
              {item.name === 'Language' && isLanguageDropdownOpen && (
                <div className="ml-6 mt-2">
                  {Object.entries(languages).map(([langCode, langName]) => (
                    <button
                      key={langCode}
                      onClick={() => changeLanguage(langCode)}
                      className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg"
                    >
                      {langName}
                      {currentLanguage === langCode && (
                        <FiCheck className="w-4 h-4 text-teal-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li className="py-2">
           <WalletMultiButton
            style={{
              color: 'white',
              background: "linear-gradient(to bottom right,#14b8a6,#134e4a )"
            }} /> 
          </li>
        </ul>
      </nav>
    </header>
  );
}

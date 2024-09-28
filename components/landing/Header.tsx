"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { name: 'Docs', href: 'https://your-gitbook-docs-url.com', external: true },
  { name: 'Blog', href: 'https://arkonsol.substack.com/', external: true },
  { name: 'About', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`fixed top-0 left-0 bg-black right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black shadow-lg' : 'bg-transparent'}`}>
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
        <nav className="hidden md:block">
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ease-in-out text-white
                      ${pathname === item.href ? 'bg-[#008080]' : 'hover:bg-black hover:text-white'}
                      relative overflow-hidden group`}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008080] transition-all duration-300 ease-in-out group-hover:w-full"></span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ease-in-out text-white
                      ${pathname === item.href ? 'bg-[#008080]' : 'hover:bg-black hover:text-white'}
                      relative overflow-hidden group`}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#008080] transition-all duration-300 ease-in-out group-hover:w-full"></span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        <Link href="/create" className="hidden md:block bg-[#008080] font-semibold text-white px-8 py-2 rounded-lg border-2 border-[#008080] hover:bg-black hover:text-[#008080] transition-colors duration-300">
          Create PAO
        </Link>
      </div>

      {/* Mobile navigation */}
      <nav className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-black`}>
        <ul className="px-4 py-2">
          {navItems.map((item) => (
            <li key={item.name} className="py-2">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-white hover:bg-[#008080] rounded-lg transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-white hover:bg-[#008080] rounded-lg transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
          <li className="py-2">
            <Link
              href="/create"
              className="block px-3 py-2 bg-[#008080] text-white rounded-lg transition-colors duration-300 hover:bg-[#006666]"
              onClick={toggleMenu}
            >
              Create PAO
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

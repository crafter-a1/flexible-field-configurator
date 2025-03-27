
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'py-4 bg-white/80 backdrop-blur-lg shadow-subtle' 
          : 'py-6 bg-transparent'
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <a 
          href="/" 
          className="text-2xl font-semibold text-apple-gray-800 transition-transform duration-300 hover:scale-105"
        >
          minimalist.
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {['Products', 'Features', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-apple-gray-600 hover:text-apple-blue-500 transition-all duration-300 text-sm font-medium"
            >
              {item}
            </a>
          ))}
          <button className="btn-primary">
            Get Started
          </button>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <button 
          onClick={toggleMenu}
          className="md:hidden flex items-center text-apple-gray-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-white shadow-elevated overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container-custom py-6 space-y-6">
          {['Products', 'Features', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="block text-apple-gray-600 hover:text-apple-blue-500 py-2 text-lg font-medium transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <button 
            className="btn-primary w-full"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

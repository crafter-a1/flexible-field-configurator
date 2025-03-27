
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Instagram, Twitter, Linkedin, GitHub, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  const ref = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });

  return (
    <footer ref={ref} className="relative py-20 bg-apple-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1 reveal delayed-100">
            <a href="/" className="text-2xl font-semibold text-apple-gray-800 mb-6 inline-block">
              minimalist.
            </a>
            <p className="text-apple-gray-500 mb-6">
              Creating elegant digital experiences inspired by timeless design principles.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Instagram, Linkedin, GitHub].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-apple-gray-400 hover:text-apple-blue-500 transition-colors duration-300"
                  aria-label="Social media"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick links */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                title: 'Products',
                links: ['Overview', 'Features', 'Solutions', 'Tutorials', 'Pricing'],
              },
              {
                title: 'Company',
                links: ['About us', 'Careers', 'Press', 'News', 'Contact'],
              },
              {
                title: 'Resources',
                links: ['Blog', 'Newsletter', 'Events', 'Help center', 'Tutorials'],
              },
            ].map((column, columnIndex) => (
              <div key={columnIndex} className={`reveal ${columnIndex === 0 ? 'delayed-100' : columnIndex === 1 ? 'delayed-200' : 'delayed-300'}`}>
                <h3 className="text-apple-gray-800 font-medium mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-apple-gray-500 hover:text-apple-blue-500 transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-apple-gray-200 reveal delayed-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-apple-gray-800 text-xl font-medium mb-2">Stay updated</h3>
              <p className="text-apple-gray-500">Subscribe to our newsletter for updates and insights.</p>
            </div>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 pr-12 rounded-full border border-apple-gray-200 focus:border-apple-blue-500 focus:ring focus:ring-apple-blue-100 focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-apple-blue-500 text-white p-2 rounded-full hover:bg-apple-blue-600 transition-colors duration-300">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-16 text-center text-apple-gray-400 text-sm reveal delayed-200">
          <p>© {new Date().getFullYear()} minimalist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import React, { useEffect } from 'react';
import { useParallaxEffect } from '@/hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  useParallaxEffect();
  
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    setTimeout(() => {
      revealElements.forEach((el) => {
        el.classList.add('active');
      });
    }, 100);
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-apple-blue-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-apple-blue-200 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-apple-blue-600 bg-apple-blue-50 rounded-full reveal">
              Simplicity is the ultimate sophistication
            </span>
            <h1 className="mb-6 reveal delayed-100">
              <span className="text-apple-gray-800">Design that makes</span>
              <br />
              <span className="text-apple-blue-500">complexity feel simple</span>
            </h1>
            <p className="text-lg mb-8 reveal delayed-200">
              Inspired by the design philosophies of the world's most thoughtful creators, we craft experiences that blend form and function in perfect harmony.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start reveal delayed-300">
              <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                Explore Products <ArrowRight size={16} />
              </button>
              <button className="btn-secondary w-full sm:w-auto">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative reveal delayed-200">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/80 z-10 rounded-3xl opacity-40"></div>
            <div className="glass-card rounded-3xl overflow-hidden shadow-elevated">
              <div className="relative aspect-[4/3] bg-apple-gray-50 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.1),transparent)] z-10"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 aspect-square">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-32 h-32 bg-apple-white rounded-full shadow-elevated flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-apple-blue-400 to-apple-blue-600 animate-float"></div>
                      </div>
                      <div className="space-y-2 px-8">
                        <h3 className="text-apple-gray-800 text-xl font-medium">Elegant Design</h3>
                        <p className="text-apple-gray-500 text-sm">Minimalism that speaks volumes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 right-12 glass-card px-5 py-3 rounded-full shadow-elevated z-20 animate-float">
              <span className="text-sm font-medium text-apple-gray-800">Premium Quality</span>
            </div>
            
            <div className="absolute -bottom-6 left-12 glass-card px-5 py-3 rounded-full shadow-elevated z-20" style={{animationDelay: '1s'}}>
              <span className="text-sm font-medium text-apple-gray-800">Intuitive Interface</span>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-sm text-apple-gray-400 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-apple-gray-300 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-apple-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

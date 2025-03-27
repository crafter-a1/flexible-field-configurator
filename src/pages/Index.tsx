
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, Layers, Zap, Sparkles, Shield, Clock, Users } from 'lucide-react';

const Index = () => {
  const ref = useScrollAnimation<HTMLDivElement>();
  
  useEffect(() => {
    // Preload animations
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      
      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-apple-gray-50"></div>
        </div>
        
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-apple-blue-600 bg-apple-blue-50 rounded-full reveal">
              What we offer
            </span>
            <h2 className="mb-6 text-apple-gray-800 reveal delayed-100">
              Elegance through thoughtful design
            </h2>
            <p className="text-lg reveal delayed-200">
              Our approach combines minimalist aesthetics with functional design, creating products that are both beautiful and intuitive to use.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Intuitive Interface"
              description="Thoughtfully designed interactions that feel natural and effortless to use."
              icon={Layers}
              delay="delayed-100"
            />
            <FeatureCard
              title="Lightning Fast"
              description="Optimized performance ensures a smooth experience with no waiting."
              icon={Zap}
              delay="delayed-200"
            />
            <FeatureCard
              title="Stunning Visuals"
              description="Carefully crafted visual elements that create a premium experience."
              icon={Sparkles}
              delay="delayed-300"
            />
            <FeatureCard
              title="Robust Security"
              description="Advanced protection measures keep your data safe and secure."
              icon={Shield}
              delay="delayed-100"
            />
            <FeatureCard
              title="Time Saving"
              description="Streamlined workflows that help you accomplish more in less time."
              icon={Clock}
              delay="delayed-200"
            />
            <FeatureCard
              title="Collaborative"
              description="Built for teams with seamless sharing and collaboration features."
              icon={Users}
              delay="delayed-300"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-apple-gray-50">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-apple-blue-500 to-apple-blue-600 rounded-3xl overflow-hidden">
            <div className="relative px-8 py-16 md:px-16 md:py-20">
              {/* Background visual elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-80 h-80 bg-white/10 rounded-full"></div>
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/5 rounded-full"></div>
              </div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
                <div className="lg:col-span-3 text-center lg:text-left">
                  <h2 className="text-white mb-6 reveal">Ready to experience true minimalism?</h2>
                  <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto lg:mx-0 reveal delayed-100">
                    Join thousands of users who have elevated their digital experience with our thoughtfully designed products.
                  </p>
                </div>
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-end reveal delayed-200">
                  <button className="btn-secondary bg-white hover:bg-gray-50 text-apple-blue-600">
                    Learn More
                  </button>
                  <button className="btn-primary bg-apple-gray-900 hover:bg-black text-white flex items-center justify-center gap-2">
                    Get Started <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-apple-blue-600 bg-apple-blue-50 rounded-full reveal">
              What people say
            </span>
            <h2 className="mb-6 text-apple-gray-800 reveal delayed-100">
              Loved by designers and creators
            </h2>
            <p className="text-lg reveal delayed-200">
              See what our users are saying about their experience with our products.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The attention to detail is extraordinary. Every interaction feels considered and purposeful.",
                author: "Alex Chen",
                role: "UX Designer"
              },
              {
                quote: "Finally, a product that values simplicity without compromising on functionality or aesthetics.",
                author: "Sarah Johnson",
                role: "Creative Director"
              },
              {
                quote: "The minimalist approach has transformed how I work. Less clutter, more productivity.",
                author: "Michael Davis",
                role: "Product Manager"
              }
            ].map((testimonial, index) => (
              <div key={index} className={`glass-card rounded-2xl p-8 hover:shadow-elevated transition-all duration-300 reveal ${index === 0 ? 'delayed-100' : index === 1 ? 'delayed-200' : 'delayed-300'}`}>
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-apple-blue-500 mr-1">★</span>
                  ))}
                </div>
                <p className="text-apple-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-apple-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="text-apple-gray-800 font-medium">{testimonial.author}</h4>
                    <p className="text-apple-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

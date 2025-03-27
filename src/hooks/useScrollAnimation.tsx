
import { useEffect, useRef, RefObject } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
): RefObject<T> {
  const { threshold = 0.1, root = null, rootMargin = '0px' } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [threshold, root, rootMargin]);

  return ref;
}

export function useParallaxEffect(): void {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach((element) => {
        const speed = element.getAttribute('data-speed') || '0.1';
        const y = scrollPosition * parseFloat(speed);
        element.setAttribute('style', `transform: translateY(${y}px)`);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

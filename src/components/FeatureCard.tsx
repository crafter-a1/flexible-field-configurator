
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  delay = '',
  className,
}) => {
  const ref = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div 
      ref={ref}
      className={cn(
        'group glass-card rounded-2xl p-8 transition-all duration-500 hover:shadow-elevated reveal',
        delay,
        className
      )}
    >
      <div className="bg-apple-blue-50 text-apple-blue-600 p-3 rounded-xl inline-flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-apple-blue-500 group-hover:text-white">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      
      <h3 className="text-apple-gray-800 text-xl font-medium mb-3">{title}</h3>
      <p className="text-apple-gray-500">{description}</p>
    </div>
  );
};

export default FeatureCard;

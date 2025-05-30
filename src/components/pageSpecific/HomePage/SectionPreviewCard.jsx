import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const SectionPreviewCard = ({ section }) => {
  const Icon = section.icon;
  return (
    <Link to={`/${section.slug}`} className="block group">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col border border-transparent hover:border-primary/50">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
            {section.heading}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
          {section.description || `Explore my ${section.heading.toLowerCase()}.`}
        </p>
        <div className="mt-auto">
           <Button variant="link" className="p-0 text-primary group-hover:underline">
            View {section.heading} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default SectionPreviewCard;
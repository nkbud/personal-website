import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CategoryTabs = ({ sections, activeSlug, onTabChange }) => {
  return (
    <motion.div 
      className="container mx-auto px-4 py-2 overflow-x-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <div className="flex space-x-2 pb-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.slug}
              variant={activeSlug === section.slug ? 'default' : 'outline'}
              onClick={() => onTabChange(section.slug)}
              className={`whitespace-nowrap transition-all duration-200 ease-in-out transform hover:scale-105 ${activeSlug === section.slug ? 'bg-primary text-primary-foreground shadow-md' : 'border-border hover:bg-accent'}`}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {section.heading}
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryTabs;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain } from 'lucide-react';
import { siteConfig } from '@/config/site';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 dark:from-purple-800 dark:via-pink-700 dark:to-red-700 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img  class="w-full h-full object-cover" alt="Abstract background of neural networks and code" src="https://images.unsplash.com/photo-1549925245-f20a1bac6454" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 container mx-auto px-4 py-16"
      >
        <motion.div 
          className="inline-block p-3 mb-6 bg-white/20 rounded-full backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.4 }}
        >
          <Brain className="h-12 w-12 md:h-16 md:w-16 text-white" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {siteConfig.hero.headline}
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl text-purple-100 dark:text-purple-200 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {siteConfig.hero.subheadline}
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link to={siteConfig.hero.mainAction.href}>
              {siteConfig.hero.mainAction.label}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link to={siteConfig.hero.secondaryAction.href}>
              {siteConfig.hero.secondaryAction.label}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Brain } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-800 dark:to-pink-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Brain className="mx-auto h-12 w-12 md:h-16 md:w-16 mb-6 text-white/80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Connect & Innovate
          </h2>
          <p className="text-lg md:text-xl text-purple-100 dark:text-purple-200 mb-10 max-w-2xl mx-auto">
            Have a project in mind, a question about my research, or interested in my services? I'm always open to new ideas and collaborations.
          </p>
          <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Link to="/contact">
              <MessageSquare className="mr-2 h-5 w-5" />
              Get in Touch
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFoundPage = ({ onNavigate }) => {
  return (
    <div id="notfound" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-red-100 dark:from-gray-900 dark:via-gray-950 dark:to-black text-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="bg-white dark:bg-gray-800 p-8 md:p-16 rounded-xl shadow-2xl max-w-lg w-full"
      >
        <AlertTriangle className="mx-auto h-16 w-16 md:h-20 md:w-20 text-yellow-500 mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Content Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Oops! The content you're looking for doesn't seem to exist or you may not have selected a category.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
          <Button onClick={() => onNavigate ? onNavigate('home') : window.location.reload()} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Button>
          <Button onClick={() => onNavigate ? onNavigate('contact') : window.location.reload()} size="lg" variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Brain className="mr-2 h-5 w-5" />
            Contact Me
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
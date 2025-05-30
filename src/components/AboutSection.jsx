import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Users, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { siteConfig } from '@/config/site';

const AboutSection = () => {
  const authorName = siteConfig.title.split('—')[0].trim();
  const authorRole = siteConfig.title.split('—')[1]?.trim() || "Innovator & Builder";

  const skills = [
    { name: "AI & Machine Learning", icon: Brain, level: 90 },
    { name: "Software Development", icon: Code, level: 95 },
    { name: "System Architecture", icon: Zap, level: 85 },
    { name: "Team Leadership", icon: Users, level: 80 },
  ];

  return (
    <motion.section 
      id="about" 
      className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            About Me
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {siteConfig.hero.headline}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
          <motion.div 
            className="md:col-span-1 flex flex-col items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Avatar className="w-40 h-40 md:w-48 md:h-48 mb-6 border-4 border-primary shadow-xl">
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={authorName} />
              <AvatarFallback className="text-5xl">{authorName.substring(0,1)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{authorName}</h2>
            <p className="text-primary">{authorRole}</p>
          </motion.div>

          <motion.div 
            className="md:col-span-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">My Philosophy</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              I believe in the power of technology to create simple, general, and elegant solutions to complex problems. My work focuses on exploring what's possible at the intersection of AI, software engineering, and human-centric design. I'm driven by the idea that "What can exist, shall exist," pushing boundaries and constantly learning.
            </p>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Core Skills</h3>
            <div className="space-y-5">
              {skills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <skill.icon className="h-5 w-5 mr-2 text-primary" />
                      {skill.name}
                    </span>
                    <span className="text-sm font-medium text-primary">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
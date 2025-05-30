import React from 'react';
import { Github, Linkedin, Twitter, Mail, Brain } from 'lucide-react';
import { siteConfig, sectionsConfig } from '@/config/site';
import { Button } from '@/components/ui/button';

const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (sectionId) => {
    onNavigate(sectionId);
  };

  const mainContentLinks = sectionsConfig.map(section => ({
    name: section.heading,
    id: section.slug,
  }));

  const utilityLinks = [
    { name: 'About Me', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 dark:bg-gray-950 border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10">
          {/* Site Info */}
          <div className="md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={() => handleNav('home')}>
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {siteConfig.title.split('—')[0].trim()}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              {siteConfig.hero.subheadline}
            </p>
          </div>

          {/* Content Sections */}
          <div className="md:col-span-1 lg:col-span-1">
            <p className="text-base font-semibold text-gray-100 mb-4">Content</p>
            <ul className="space-y-2">
              {mainContentLinks.map(link => (
                <li key={link.id}>
                  <button onClick={() => handleNav(link.id)} className="text-sm hover:text-primary transition-colors text-left w-full">
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Utility & Socials */}
          <div className="md:col-span-1 lg:col-span-1">
            <p className="text-base font-semibold text-gray-100 mb-4">More</p>
            <ul className="space-y-2 mb-6">
              {utilityLinks.map(link => (
                <li key={link.id}>
                   <button onClick={() => handleNav(link.id)} className="text-sm hover:text-primary transition-colors text-left w-full">
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
             <p className="text-base font-semibold text-gray-100 mb-3">Connect</p>
            <div className="flex space-x-4">
              <a href={siteConfig.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={siteConfig.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
               <button onClick={() => handleNav('contact')} aria-label="Contact" className="text-gray-400 hover:text-primary transition-colors">
                <Mail size={20} />
              </button>
            </div>
          </div>
          
          {/* Quick Contact */}
           <div className="md:col-span-3 lg:col-span-1">
             <p className="text-base font-semibold text-gray-100 mb-4">Get In Touch</p>
             <p className="text-sm text-gray-400 mb-4">
              Interested in collaborating or have a question?
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary w-full md:w-auto"
              onClick={() => handleNav('contact')}
            >
              Send a Message
            </Button>
          </div>

        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center">
          <p className="text-xs text-gray-500">
            © {currentYear} {siteConfig.title}. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Powered by AI, built with passion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
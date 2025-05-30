import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Edit3, Trash2, EyeOff, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Badge } from '@/components/ui/badge'; 

const PostCard = ({ post, onSelectPost, isAdmin, onEdit, onDelete }) => {
  const { title, blurb, content, image_url, alt_text, is_published } = post;
  
  const MAX_PREVIEW_LENGTH = 250; 
  const contentPreview = content ? (content.length > MAX_PREVIEW_LENGTH ? content.substring(0, MAX_PREVIEW_LENGTH) + "..." : content) : "No content preview available.";

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    onSelectPost(post);
  };

  return (
    <motion.div
      layout
      className={`bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300 cursor-pointer relative ${!is_published && isAdmin ? 'opacity-70 border-yellow-500 border-2' : ''}`}
      onClick={handleCardClick}
      whileHover={{ y: isAdmin ? 0 : -5 }} // Disable y-shift for admin to avoid button misclicks
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex space-x-2">
          {!is_published && <Badge variant="outline" className="bg-yellow-400/20 border-yellow-500 text-yellow-700 dark:text-yellow-300">Draft</Badge>}
          <Button variant="outline" size="icon" className="h-8 w-8 bg-card hover:bg-accent" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="destructiveOutline" size="icon" className="h-8 w-8 bg-card hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="md:flex">
        <div className="md:w-1/2 p-6 flex flex-col">
          {image_url && (
            <div className="aspect-video rounded-lg overflow-hidden mb-4 shadow-md">
              <img 
                className="w-full h-full object-cover"
                alt={alt_text || title}
                src="https://images.unsplash.com/photo-1698335550600-329cd66ec101" />
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2 text-primary flex items-center">
            {title}
            {isAdmin && !is_published && <EyeOff className="ml-2 h-5 w-5 text-yellow-600" title="This post is a draft" />}
          </h2>
          <p className="text-muted-foreground text-sm mb-4 flex-grow">{blurb}</p>
          <Button 
            variant="link" 
            className="p-0 self-start text-primary hover:underline"
            onClick={(e) => { e.stopPropagation(); onSelectPost(post); }}
          >
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="md:w-1/2 p-6 relative">
          <div className="max-h-60 overflow-hidden relative">
            <MarkdownRenderer markdown={contentPreview} />
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Clock, Edit3, Trash2, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const PostDetailModal = ({ post, onClose, isAdmin, onEdit, onDelete }) => {
  if (!post) return null;

  const formattedDate = post.created_at ? format(new Date(post.created_at), 'MMMM dd, yyyy') : 'N/A';
  const authorName = post.author || "Nicholas Budzban";
  const authorAvatarUrl = post.author_avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";


  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          variants={modalVariants}
          className="bg-background text-foreground rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold text-primary">{post.title}</h2>
              {isAdmin && !post.is_published && (
                <Badge variant="outline" className="ml-3 bg-yellow-400/20 border-yellow-500 text-yellow-700 dark:text-yellow-300">
                  <EyeOff className="mr-1 h-3 w-3"/>Draft
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <>
                  <Button variant="outline" size="icon" onClick={onEdit} aria-label="Edit post">
                    <Edit3 className="h-5 w-5" />
                  </Button>
                  <Button variant="destructiveOutline" size="icon" onClick={onDelete} aria-label="Delete post">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 md:p-6">
            {post.image_url && (
              <div className="aspect-video rounded-lg overflow-hidden mb-6 shadow-md">
                <img 
                  className="w-full h-full object-cover"
                  alt={post.alt_text || post.title}
                  src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
              </div>
            )}
            
            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2 mb-6">
              <div className="flex items-center">
                <Avatar className="h-7 w-7 mr-2">
                  <AvatarImage src={authorAvatarUrl} alt={authorName} />
                  <AvatarFallback>{authorName.substring(0,1)}</AvatarFallback>
                </Avatar>
                <span>{authorName}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>{formattedDate}</span>
              </div>
              {post.read_time_minutes && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" />
                  <span>{post.read_time_minutes} min read</span>
                </div>
              )}
            </div>
            
            <p className="text-base text-muted-foreground mb-6 italic">{post.blurb}</p>

            <MarkdownRenderer markdown={post.content || "No content available."} />
          </div>
          
          <div className="p-4 md:p-6 border-t border-border flex justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostDetailModal;
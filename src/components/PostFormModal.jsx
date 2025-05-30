import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Image as ImageIcon, Eye, EyeOff, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PostFormModal = ({ post: existingPost, onClose, onSaved, sections }) => {
  const [post, setPost] = useState({
    title: '',
    slug: '',
    section_slug: sections[0]?.slug || '',
    blurb: '',
    content: '',
    image_url: '',
    alt_text: '',
    author: 'Nicholas Budzban',
    read_time_minutes: 0,
    tags: [],
    is_published: true,
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (existingPost) {
      setPost({
        ...existingPost,
        tags: existingPost.tags || [], 
        read_time_minutes: existingPost.read_time_minutes || 0,
      });
    } else {
       setPost({
        title: '',
        slug: '',
        section_slug: sections[0]?.slug || '',
        blurb: '',
        content: '',
        image_url: '',
        alt_text: '',
        author: 'Nicholas Budzban',
        read_time_minutes: 0,
        tags: [],
        is_published: true,
      });
    }
  }, [existingPost, sections]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'read_time_minutes' ? parseInt(value) || 0 : value),
    }));

    if (name === 'title' && !existingPost) {
      setPost(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      }));
    }
  };
  
  const handleSectionChange = (value) => {
    setPost(prev => ({...prev, section_slug: value }));
  };

  const handleTagAdd = () => {
    if (currentTag && !post.tags.includes(currentTag.trim())) {
      setPost(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
      setCurrentTag('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setPost(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { data, error } = await supabase.storage
      .from('post-images') 
      .upload(fileName, file);

    if (error) {
      toast({ title: "Image Upload Error", description: error.message, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(data.path);
    setPost(prev => ({ ...prev, image_url: publicUrl }));
    setIsLoading(false);
    toast({ title: "Image Uploaded", description: "Image successfully uploaded and URL set." });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const postData = { ...post };
    if (!postData.slug) {
        postData.slug = postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    if (postData.tags && !Array.isArray(postData.tags)) {
        postData.tags = postData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    } else if (!postData.tags) {
        postData.tags = [];
    }


    try {
      let response;
      if (existingPost?.id) {
        // Update existing post
        const { id, created_at, ...updateData } = postData; // created_at should not be updated
        response = await supabase.from('posts').update(updateData).eq('id', existingPost.id).select().single();
      } else {
        // Create new post
        response = await supabase.from('posts').insert(postData).select().single();
      }

      if (response.error) throw response.error;

      toast({
        title: `Post ${existingPost ? 'Updated' : 'Created'}`,
        description: `"${response.data.title}" has been successfully saved.`,
      });
      onSaved(response.data);
    } catch (error) {
      toast({
        title: `Error ${existingPost ? 'Updating' : 'Creating'} Post`,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-background text-foreground rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              {existingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close form">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={post.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL friendly identifier)</Label>
              <Input id="slug" name="slug" value={post.slug} onChange={handleChange} required />
            </div>
             <div>
                <Label htmlFor="section_slug">Section</Label>
                <Select onValueChange={handleSectionChange} defaultValue={post.section_slug}>
                    <SelectTrigger id="section_slug">
                        <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                        {sections.map(section => (
                            <SelectItem key={section.slug} value={section.slug}>
                                {section.heading}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
              <Label htmlFor="blurb">Blurb (Short summary)</Label>
              <Textarea id="blurb" name="blurb" value={post.blurb} onChange={handleChange} rows={2} />
            </div>
            <div>
              <Label htmlFor="content">Content (Markdown supported)</Label>
              <Textarea id="content" name="content" value={post.content} onChange={handleChange} rows={10} />
              <p className="text-xs text-muted-foreground mt-1">Use Markdown for formatting. Images can be added via URLs or uploaded.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <div className="flex items-center space-x-2">
                <Input id="image_url" name="image_url" value={post.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg"/>
                <Button type="button" variant="outline" size="icon" asChild>
                  <Label htmlFor="image_upload_input" className="cursor-pointer">
                    <ImageIcon className="h-5 w-5"/>
                    <Input id="image_upload_input" type="file" accept="image/*" className="sr-only" onChange={handleImageUpload}/>
                  </Label>
                </Button>
              </div>
              {post.image_url && <img  src={post.image_url} alt="Preview" className="mt-2 rounded-md max-h-40 object-contain border border-border"/>}
            </div>

            <div>
              <Label htmlFor="alt_text">Image Alt Text</Label>
              <Input id="alt_text" name="alt_text" value={post.alt_text} onChange={handleChange} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={post.author} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="read_time_minutes">Read Time (minutes)</Label>
                <Input id="read_time_minutes" name="read_time_minutes" type="number" value={post.read_time_minutes} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="currentTag" 
                  name="currentTag" 
                  value={currentTag} 
                  onChange={(e) => setCurrentTag(e.target.value)} 
                  placeholder="Add a tag"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleTagAdd();}}}
                />
                <Button type="button" variant="outline" onClick={handleTagAdd}><PlusCircle className="h-4 w-4 mr-1"/> Add</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                    {tag}
                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5 ml-1" onClick={() => handleTagRemove(tag)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="is_published"
                name="is_published"
                checked={post.is_published}
                onCheckedChange={(checked) => setPost(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="is_published" className="flex items-center cursor-pointer">
                {post.is_published ? <Eye className="h-4 w-4 mr-1 text-green-500"/> : <EyeOff className="h-4 w-4 mr-1 text-yellow-500"/>}
                {post.is_published ? 'Published' : 'Draft'}
              </Label>
            </div>
          </form>

          <div className="p-4 md:p-6 border-t border-border flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <motion.div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {isLoading ? (existingPost ? 'Saving...' : 'Creating...') : (existingPost ? 'Save Changes' : 'Create Post')}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostFormModal;
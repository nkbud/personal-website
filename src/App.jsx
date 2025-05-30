import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import CategoryTabs from '@/components/CategoryTabs';
import PostCard from '@/components/PostCard';
import PostDetailModal from '@/components/PostDetailModal';
import PostFormModal from '@/components/PostFormModal';
import AuthModal from '@/components/AuthModal';
import { supabase } from '@/lib/supabaseClient';
import { sectionsConfig, siteConfig } from '@/config/site';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const POSTS_PER_PAGE = 3;

function AppContent() {
  const { session, isAdmin, authModalOpen, setAuthModalOpen } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const observer = useRef();

  const activeCategorySlug = sectionsConfig.find(s => s.slug === activeSection)?.slug || 'services';

  const fetchPosts = useCallback(async (currentPage, currentSearchTerm, categorySlug, reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;
    setIsLoading(true);

    try {
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('section_slug', categorySlug)
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        query = query.eq('is_published', true);
      }
      
      query = query.range((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE - 1);


      if (currentSearchTerm) {
        query = query.or(`title.ilike.%${currentSearchTerm}%,blurb.ilike.%${currentSearchTerm}%,tags.cs.{${currentSearchTerm}}`);
      }
      
      const { data, error, count } = await query;

      if (error) throw error;

      setPosts(prevPosts => reset ? data : [...prevPosts, ...data]);
      setHasMore(data.length > 0 && (reset ? data.length : posts.length + data.length) < count);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error fetching posts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, posts.length, toast, isAdmin]);

  const refreshPosts = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    if (sectionsConfig.some(s => s.slug === activeSection) || activeSection === 'home') {
       const slugToFetch = activeSection === 'home' ? (sectionsConfig.find(s => s.slug === 'services')?.slug || sectionsConfig[0]?.slug) : activeSection;
       if (slugToFetch) {
         fetchPosts(1, searchTerm, slugToFetch, true);
       }
    }
  };
  
  useEffect(() => {
    refreshPosts();
  }, [activeSection, searchTerm, isAdmin]); 


  const lastPostElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && sectionsConfig.some(s => s.slug === activeSection)) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, activeSection]);

 useEffect(() => {
    if (page > 1 && sectionsConfig.some(s => s.slug === activeSection)) {
      fetchPosts(page, searchTerm, activeSection, false);
    }
  }, [page, fetchPosts, searchTerm, activeSection]);


  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleOpenPostForm = (postToEdit = null) => {
    if (!isAdmin) {
      setAuthModalOpen(true); // Prompt login if not admin
      return;
    }
    setEditingPost(postToEdit);
    setIsPostFormOpen(true);
  };

  const handleClosePostForm = () => {
    setEditingPost(null);
    setIsPostFormOpen(false);
  };

  const handlePostSaved = () => {
    handleClosePostForm();
    refreshPosts(); 
  };
  
  const handleDeletePost = async (postId) => {
    if (!isAdmin) {
       toast({ title: "Unauthorized", description: "You must be an admin to delete posts.", variant: "destructive"});
       setAuthModalOpen(true);
       return;
    }
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
      toast({ title: "Post Deleted", description: "The post has been successfully deleted." });
      refreshPosts();
      if (selectedPost?.id === postId) setSelectedPost(null);
    } catch (error) {
      toast({ title: "Error Deleting Post", description: error.message, variant: "destructive" });
    }
  };


  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleTabChange = (newSlug) => {
    setActiveSection(newSlug); 
  };
  
  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'about' || sectionId === 'contact' || sectionId === 'admin') { // Added admin for potential admin page
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId !== 'admin') { // Don't scroll if admin page doesn't exist yet
        const mainContentArea = document.querySelector('#main-content'); 
        if (mainContentArea) mainContentArea.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const mainContentArea = document.querySelector('#main-content');
      if (mainContentArea) mainContentArea.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const renderHero = () => (
    <div className="py-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10 text-center">
        <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
            {siteConfig.hero.headline}
        </motion.h1>
        <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
            {siteConfig.hero.subheadline}
        </motion.p>
    </div>
  );

  const renderContent = () => {
    if (activeSection === 'home' || sectionsConfig.some(s => s.slug === activeSection)) {
      const currentSlugForTabs = activeSection === 'home' 
        ? (sectionsConfig.find(s => s.slug === 'services')?.slug || sectionsConfig[0]?.slug) 
        : activeSection;
      const currentSectionConfig = sectionsConfig.find(s => s.slug === currentSlugForTabs) || sectionsConfig[0];
      
      return (
        <>
          {activeSection === 'home' && renderHero()}
          <div className="sticky top-16 bg-background/80 backdrop-blur-md z-30 py-4 shadow-sm">
            <SearchBar onSearch={handleSearch} />
            <div className="container mx-auto px-4 flex items-center justify-between">
              <CategoryTabs 
                sections={sectionsConfig} 
                activeSlug={currentSlugForTabs} 
                onTabChange={handleTabChange} 
              />
              {isAdmin && sectionsConfig.some(s => s.slug === currentSlugForTabs) && (
                <motion.button
                  onClick={() => handleOpenPostForm()}
                  className="ml-4 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="ml-2 hidden sm:inline text-sm font-medium">New Post</span>
                </motion.button>
              )}
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            {posts.length === 0 && !isLoading && (
              <p className="text-center text-muted-foreground py-6">No posts found for "{currentSectionConfig.heading}". {isAdmin && "Try creating one!"}</p>
            )}
            <div className="space-y-8">
              {posts.map((post, index) => {
                const card = (
                  <PostCard 
                    post={post} 
                    onSelectPost={handleSelectPost} 
                    isAdmin={isAdmin}
                    onEdit={() => handleOpenPostForm(post)}
                    onDelete={() => handleDeletePost(post.id)}
                  />
                );
                if (posts.length === index + 1 && posts.length > POSTS_PER_PAGE -1) { // Only attach ref if there might be more
                  return (
                    <motion.div
                      key={post.id}
                      ref={lastPostElementRef}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {card}
                    </motion.div>
                  );
                }
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {card}
                  </motion.div>
                );
              })}
            </div>
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </>
      );
    }
    if (activeSection === 'about') return <AboutSection id="about" />;
    if (activeSection === 'contact') return <ContactSection id="contact"/>;
    // Add placeholder for admin page if you create one
    // if (activeSection === 'admin' && isAdmin) return <AdminDashboard id="admin" />; 
    
    // If home is selected and it's not a category slug, default to services
    if (activeSection === 'home') {
       const defaultSlug = sectionsConfig.find(s => s.slug === 'services')?.slug || sectionsConfig[0]?.slug;
       if(defaultSlug) {
         setActiveSection(defaultSlug); 
         return null; 
       }
    }
    return <p className="text-center text-muted-foreground py-10">Select a category or section to view content.</p>;
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar onNavigate={navigateToSection} siteTitle={siteConfig.title.split('—')[0].trim()} />
      
      <main className="flex-grow pt-16" id="main-content">
         {renderContent()}
      </main>

      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal 
            post={selectedPost} 
            onClose={handleCloseModal} 
            isAdmin={isAdmin}
            onEdit={() => {
              handleCloseModal(); 
              handleOpenPostForm(selectedPost);
            }}
            onDelete={() => handleDeletePost(selectedPost.id)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isPostFormOpen && isAdmin && ( // Ensure only admin can see form
          <PostFormModal
            post={editingPost}
            onClose={handleClosePostForm}
            onSaved={handlePostSaved}
            sections={sectionsConfig}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {authModalOpen && !session && (
          <AuthModal onClose={() => setAuthModalOpen(false)} />
        )}
      </AnimatePresence>
      <Footer onNavigate={navigateToSection} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
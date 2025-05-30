import React from 'react';
import { Navigate } from 'react-router-dom';

const BlogPostPage = () => {
  // This page is no longer used directly.
  // Individual posts are handled by /:sectionSlug/:postSlug via PostPage.
  // Redirecting to home or a default section.
  return <Navigate to="/" replace />;
};

export default BlogPostPage;
import React from 'react';
import { Navigate } from 'react-router-dom';

const BlogPage = () => {
  // This page is no longer used directly.
  // Users will navigate to /:sectionSlug which is handled by SectionPage.
  // If a generic /blog route is needed, it can be redirected or handled differently.
  // For now, redirecting to home or a default section.
  return <Navigate to="/" replace />;
};

export default BlogPage;
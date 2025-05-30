import React from 'react';
import { Navigate } from 'react-router-dom';

const AcademyPage = () => {
  // This page is no longer used directly.
  // Users will navigate to /academics (or other sections) which is handled by SectionPage.
  return <Navigate to="/academics" replace />;
};

export default AcademyPage;
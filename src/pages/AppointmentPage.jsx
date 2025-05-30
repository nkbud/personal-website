import React from 'react';
import { Navigate } from 'react-router-dom';

const AppointmentPage = () => {
  // This page is no longer used in the new structure.
  // Contact functionality is handled by ContactPage.
  return <Navigate to="/contact" replace />;
};

export default AppointmentPage;
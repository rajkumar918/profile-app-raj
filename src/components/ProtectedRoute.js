import React from 'react';

// ProtectedRoute is now a passthrough — authentication is no longer required.
const ProtectedRoute = ({ children }) => {
  return children;
};

export default ProtectedRoute;

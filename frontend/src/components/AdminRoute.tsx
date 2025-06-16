import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // TODO: Implementirati provjeru admin prava
  return <Outlet />;
};

export default AdminRoute; 
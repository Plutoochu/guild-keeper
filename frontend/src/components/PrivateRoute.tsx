import React from 'react';
import { Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // TODO: Implementirati provjeru autentifikacije
  return <Outlet />;
};

export default PrivateRoute; 
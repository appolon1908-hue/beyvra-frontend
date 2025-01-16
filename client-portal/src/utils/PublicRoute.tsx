import { useAppSelector } from '@store/hooks';

import { Navigate, Outlet } from 'react-router-dom';


const PublicRoute = () => {
    const { user } = useAppSelector((state) => state.user);

  if (user) {
    return <Navigate to="/platform" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
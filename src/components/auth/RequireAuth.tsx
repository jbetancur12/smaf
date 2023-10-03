import { useAppSelector } from '@app/hooks/reduxHooks'
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface RequireAuthProps {
  allowedRoles: string[]
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const user = useAppSelector((state) => state.user.user)
  const token = useAppSelector((state) => state.auth.accessToken)
  const location = useLocation();

  return (user?.roles.find(role => allowedRoles?.includes(role.name))
  ? <Outlet />
  : token
      ? <Navigate to="/unauthorized" state={{ from: location }} replace />
      : <Navigate to="/auth/login" state={{ from: location }} replace />)

  // return token ? <>{children}</> : <Navigate to="/auth/login" replace />
}

export default RequireAuth

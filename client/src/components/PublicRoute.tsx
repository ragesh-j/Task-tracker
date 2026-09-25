import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PageLoader } from "./Skeleton";


export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const ProtectedRoute = ({ component: Component, adminOnly, ...rest }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }
  return <Component {...rest} />;
};

export default ProtectedRoute;

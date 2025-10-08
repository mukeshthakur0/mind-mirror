// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>; // jab tak firebase check karega
  }

  if (!user) {
    return <Navigate to="/login" replace />; // bina login redirect
  }

  return children; // agar login hai toh page dikhado
}

export default ProtectedRoute;


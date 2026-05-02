import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import useAuthStore from "./store/authStore";
import Chat from "./pages/Chat";
import CreateOffer from "./pages/CreateOffer";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Matches from "./pages/Matches";
import Register from "./pages/Register";

function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/offers/new" element={<CreateOffer />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat/:matchId" element={<Chat />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

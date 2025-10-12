import { Route, Routes } from "react-router";
import { Home } from "./pages/Home.tsx";
import { Nav } from "./layout/Nav.tsx";
import { Topic } from "./pages/Topic.tsx";
import { Register } from "./pages/Register.tsx";
import { Login } from "./pages/Login.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute.tsx";

export const App = () => {
  return (
    <AuthProvider>
      <div className="overflow-visible">
        <Nav />
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topic/:id" element={<Topic />} />
            <Route path="/topic/:id/:lectionCode" element={<Topic />} />
            <Route path="/register" element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            } />
            <Route path="/login" element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

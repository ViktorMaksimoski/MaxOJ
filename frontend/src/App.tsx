import { Route, Routes } from "react-router";
import { Home } from "./pages/Home.tsx";
import { Topic } from "./pages/Topic.tsx";
import { Register } from "./pages/Register.tsx";
import { Login } from "./pages/Login.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute.tsx";
import { UsersOnlyRoute } from "./routes/UsersOnlyRoute.tsx";
import "katex/dist/katex.min.css";
import { MainLayout } from "./layout/MainLayout.tsx";
import { JudgeLayout } from "./layout/JudgeLayout.tsx";
import { JudgeHome } from "./pages/JudgeHome.tsx";
import { Competiton } from "./pages/Competiton.tsx";
import { Submit } from "./pages/Submit.tsx";
import { Submission } from "./pages/Submission.tsx";
import { GetSubmissions } from "./pages/GetSubmissions.tsx";
import { Profile } from "./pages/Profile.tsx";

export const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:id" element={<Topic />} />
          <Route path="/topic/:id/:lectionCode" element={<Topic />} />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
        </Route>

        <Route element={<JudgeLayout />}>
            <Route element={<JudgeHome />} path="/judge" />
            <Route path="/judge/:year/:compId/:taskId"
            element={
                <Competiton />
            } />
            <Route path="/judge/:year/:compId/:taskId/submit"
            element={
              <UsersOnlyRoute>
                <Submit />
              </UsersOnlyRoute>
            } />
            <Route path="/judge/:year/:compId/:taskId/view/:page"
            element={
              <UsersOnlyRoute>
                <GetSubmissions />
              </UsersOnlyRoute>
            } />
            <Route path="/judge/submission/:id"
            element={
              <Submission />
            } />
            <Route path="/judge/profile"
            element={
              <UsersOnlyRoute>
                <Profile />
              </UsersOnlyRoute>
            } />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

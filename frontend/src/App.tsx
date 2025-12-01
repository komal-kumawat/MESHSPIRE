import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./Pages/Auth";
import Dashboard from "./Pages/Dashboard";
import Room from "./Pages/RoomPage";
import Meeting from "./Pages/Meeting";
import Profile from "./Pages/Profile";
import UpdateProfile from "./Pages/UpdateProfile";
import ProtectedRoute from "./Components/PrivateRoute";
import NotFound from "./Pages/NotFound";
import DashboardLayout from "./Pages/DashboardLayout";
import TutorDashboard from "./Pages/TutorDashboard";
import TutorUpdateProfile from "./Pages/TutorUpdateProfile";
import TutorProfile from "./Pages/TutorProfile";
import PublicTutorProfile from "./Pages/PublicTutorProfile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthPage />} />
        {/* Protected Routes */}
        {/* Layout wrapper without protection; child routes enforce role */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Meeting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <TutorDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/room/:roomid"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor-profile/:id"
          element={
            <ProtectedRoute>
              <TutorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-tutor-profile"
          element={
            <ProtectedRoute>
              <TutorUpdateProfile/>
            </ProtectedRoute>
          }
        />
        <Route path="/tutor/:id" element={<PublicTutorProfile />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public pages
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";

// Job Seeker pages
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";
import JobDetails from "./pages/JobSeeker/JobDetails";
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";

// Employer pages
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import ManageJobs from "./pages/Employer/ManageJobs";
import JobPostingForm from "./pages/Employer/JobPostingForm";

// Routes
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Job Seeker routes */}
        <Route path="/find-jobs" element={<JobSeekerDashboard />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/job/:jobId" element={<JobDetails />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Employer protected routes */}
        <Route element={<ProtectedRoutes requiredRole="employer" />}>
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<JobPostingForm />} />
          <Route path="/manage-jobs" element={<ManageJobs />} />
          <Route path="/applicants" element={<ApplicationViewer />} />
          <Route path="/company-profile" element={<EmployerProfilePage />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>

    {/* Toast notifications */}
    <Toaster
      toastOptions={{
        className: "",
        style: {
          fontSize: "13px",
        },
      }}
    />
 
  </AuthProvider>
);

export default App;

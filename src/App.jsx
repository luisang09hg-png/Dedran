import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Landing from './pages/Landing/Landing';
import Feed from './pages/Feed/Feed';
import Profile from './pages/Profile/Profile';
import Applications from './pages/Applications/Applications';
import Settings from './pages/Settings/Settings';
import Messages from './pages/Messages/Messages';
import Courses from './pages/Courses/Courses';
import Galaxy from './pages/Galaxy/Galaxy';
import CosmicBackground from './components/ui/CosmicBackground';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import { SectionErrorBoundary } from './components/error/SectionErrorBoundary';

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen antialiased relative">
      <CosmicBackground />
      <Sidebar />
      <main className="relative z-10 md:ml-72 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <GlobalErrorBoundary>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/feed" element={<SectionErrorBoundary section="Feed"><Feed /></SectionErrorBoundary>} />
            <Route path="/profile" element={<SectionErrorBoundary section="Profile"><Profile /></SectionErrorBoundary>} />
            <Route path="/messages" element={<SectionErrorBoundary section="Messages"><Messages /></SectionErrorBoundary>} />
            <Route path="/applications" element={<SectionErrorBoundary section="Applications"><Applications /></SectionErrorBoundary>} />
            <Route path="/settings" element={<SectionErrorBoundary section="Settings"><Settings /></SectionErrorBoundary>} />

            {/* New celestial nav pages */}
            <Route path="/galaxy" element={<SectionErrorBoundary section="Galaxy"><Galaxy /></SectionErrorBoundary>} />
            <Route path="/star-systems" element={<SectionErrorBoundary section="Courses"><Courses /></SectionErrorBoundary>} />
          </Route>
        </Routes>
      </Router>
    </GlobalErrorBoundary>
  );
};

export default App;
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
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/settings" element={<Settings />} />

          {/* New celestial nav pages */}
          <Route path="/galaxy" element={<Galaxy />} />
          <Route path="/star-systems" element={<Courses />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
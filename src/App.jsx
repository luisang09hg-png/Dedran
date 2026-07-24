import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Feed from './pages/Feed/Feed';
import Profile from './pages/Profile/Profile';
import Applications from './pages/Applications/Applications';
import Network from './pages/Network/Network';
import Settings from './pages/Settings/Settings';
import Messages from './pages/Messages/Messages';
import CosmicBackground from './components/ui/CosmicBackground';

const Logo = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle cx="18" cy="18" r="2" fill="#D9D9D6" />
    <path
      d="M18 4 C26 4 32 10 32 18"
      stroke="#D9D9D6"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M18 32 C10 32 4 26 4 18"
      stroke="#D9D9D6"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M18 4 C10 4 4 10 4 18"
      stroke="#53565A"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
    <path
      d="M18 32 C26 32 32 26 32 18"
      stroke="#53565A"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

const Navbar = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-black-bg/80 backdrop-blur-md border-b border-muted-gray/20">
    <div className="flex items-center justify-between px-4 md:px-8 h-16 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="text-off-white text-lg font-semibold tracking-tight">Dedran</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm text-muted-gray">
        <a href="/feed" className="hover:text-off-white transition-colors duration-200">Feed</a>
        <a href="/network" className="hover:text-off-white transition-colors duration-200">Network</a>
        <a href="/messages" className="hover:text-off-white transition-colors duration-200">Messages</a>
      </nav>
      <button className="md:hidden text-off-white p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>
    </div>
  </header>
);

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen antialiased relative">
      <CosmicBackground />
      <Navbar />
      <Sidebar />
      <main className="relative z-10 pt-16 md:pl-64">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/courses" element={<div className="text-off-white text-center py-20">Courses (Coming Soon)</div>} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/network" element={<Network />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
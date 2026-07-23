import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Feed from './pages/Feed/Feed';
import Profile from './pages/Profile/Profile';
import Applications from './pages/Applications/Applications';
import Network from './pages/Network/Network';
import Settings from './pages/Settings/Settings';

// Mock protected layout
const ProtectedLayout = () => {
  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex starry-bg selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full pt-24 md:pt-margin-desktop overflow-x-hidden">
        <Outlet />
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
        
        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/courses" element={<div>Courses (Coming Soon)</div>} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/network" element={<Network />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

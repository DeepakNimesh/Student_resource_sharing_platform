import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Upload from './pages/Upload';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/upload" element={<Upload />} />
              </Route>
            </Routes>
          </main>
          <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Student Resource Sharing Platform. Built with Appwrite & React.
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

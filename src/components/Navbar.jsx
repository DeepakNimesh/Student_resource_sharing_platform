import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Upload, User, LogIn, LayoutGrid, Sparkles } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: BookOpen },
        { name: 'Resources', path: '/resources', icon: LayoutGrid },
        { name: 'AI Lab', path: '/ai-hub', icon: Sparkles },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-900/20 group-hover:scale-105 transition-transform">
                            <BookOpen className="text-white w-6 h-6" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-white uppercase italic">SRSP</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    isActive(link.path)
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <link.icon className="w-4 h-4" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link 
                                    to="/upload" 
                                    className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                        isActive('/upload')
                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'border-white/10 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-400'
                                    }`}
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload</span>
                                </Link>
                                
                                <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-slate-200 hidden lg:inline">{user.name}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="p-2.5 text-slate-500 hover:text-red-400 transition-colors rounded-xl hover:bg-red-950/30 border border-transparent hover:border-red-900/20"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/auth" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/40 hover:-translate-y-0.5 active:scale-95">
                                <LogIn className="w-4 h-4" />
                                <span>Sign In</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Upload, User, LogIn } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-500 transition-colors">
                            <BookOpen className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">SRSP</span>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {user ? (
                            <>
                                <Link to="/upload" className="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-colors font-medium">
                                    <Upload className="w-4 h-4" />
                                    <span className="hidden sm:inline">Upload</span>
                                </Link>
                                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-sm font-semibold hidden md:inline">{user.name}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-950/30"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link to="/auth" className="flex items-center gap-2 btn-primary !py-1.5 !px-4">
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

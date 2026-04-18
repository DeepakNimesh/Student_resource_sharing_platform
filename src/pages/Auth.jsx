import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, BookOpen, Sparkles, Github } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password || (!isLogin && !name)) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        try {
            let result;
            if (isLogin) {
                result = await login(email, password);
            } else {
                result = await signup(email, password, name);
            }

            if (result.success) {
                navigate('/resources');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Authentication failed. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-900/40 backdrop-blur-2xl rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">

                <div className="hidden lg:flex flex-col justify-between p-12 bg-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-white mb-12">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="font-black text-2xl tracking-tighter uppercase italic">SRSP</span>
                        </div>
                        
                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter">
                                {isLogin ? "Welcome Back to the Collective." : "Join the Elite Circle of Learners."}
                            </h2>
                            <p className="text-indigo-100 text-lg font-medium opacity-80 leading-relaxed">
                                Access premium resources, share your expertise, and elevate your academic journey with thousands of peers.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 pt-12 border-t border-white/10 flex items-center justify-between">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center text-[10px] font-black text-indigo-600">
                                +1k
                            </div>
                        </div>
                        <span className="text-white text-xs font-black uppercase tracking-widest opacity-60">Members joined this week</span>
                    </div>
                </div>


                <div className="p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Sparkles className="w-3 h-3" />
                            <span>Security First</span>
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight">
                            {isLogin ? "Sign In" : "Create Account"}
                        </h3>
                        <p className="text-slate-500 font-medium mt-2">
                            {isLogin ? "Enter your credentials to continue." : "Fill in the details to get started."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold rounded-2xl animate-shake">
                                {error}
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors z-10" />
                                    <input 
                                        type="text" 
                                        className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white font-bold focus:border-indigo-500/50 transition-all" 
                                        placeholder="John Doe" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors z-10" />
                                <input 
                                    type="email" 
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white font-bold focus:border-indigo-500/50 transition-all" 
                                    placeholder="name@university.edu" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 group-focus-within:text-indigo-500 transition-colors z-10" />
                                <input 
                                    type="password" 
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white font-bold focus:border-indigo-500/50 transition-all" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 active:scale-95 group"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Join Platform'}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-200 hover:text-indigo-400 font-black uppercase tracking-widest text-[10px] transition-colors"
                        >
                            {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

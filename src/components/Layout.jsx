import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import ColorBends from './ColorBends';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';

    return (
        <div >
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <ColorBends
                    colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
                    rotation={90}
                    speed={0.2}
                    scale={1}
                    frequency={1}
                    warpStrength={1}
                    mouseInfluence={1}
                    noise={0.15}
                    parallax={0.5}
                    iterations={1}
                    intensity={1.5}
                    bandWidth={6}
                    transparent
                    autoRotate={0}
                    color="#A855F7"
                />
            </div>

            <Navbar />
            <main className="flex-grow relative z-10">
                {children}
            </main>
            {!isAuthPage && (
                <footer className="bg-slate-900 backdrop-blur-md border-t border-white/5 py-12 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-600 rounded-lg">
                                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">SRSP</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">
                                &copy; {new Date().getFullYear()} Student Resource Sharing Platform. All rights reserved.
                            </p>
                            <div className="flex gap-6 text-slate-500 text-sm font-semibold">
                                <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
                                <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
                                <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;

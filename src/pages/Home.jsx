import { Link } from 'react-router-dom';
import { BookOpen, Search, Upload, Download, ArrowRight, Sparkles, Users, FileText, Globe } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col">
          
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/2 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] mb-8 animate-pulse">
                        <Sparkles className="w-4 h-4" />
                        <span>The Future of Student Collaboration</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        Elevate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Learning Experience.</span>
                    </h1>
                    
                    <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
                        A premium platform for students to share, discover, and organize academic resources effortlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/resources" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-indigo-900/40 hover:-translate-y-1 flex items-center justify-center gap-3 group">
                            <span>Explore Resources</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/auth" className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-grey border border-white/10 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3">
                            Join Community
                        </Link>
                    </div>
                </div>
            </section>

           
            <section className="py-24 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Streamlined for Success</h2>
                        <p className="text-slate-500 font-medium text-lg">Three simple steps to mastery.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Upload', desc: 'Share your high-quality notes and guides with fellow students.', icon: Upload, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                            { title: 'Search', desc: 'Find exactly what you need with advanced semester and batch filtering.', icon: Search, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                            { title: 'Download', desc: 'Access study materials anytime, anywhere, and on any device.', icon: Download, color: 'text-purple-400', bg: 'bg-purple-400/10' }
                        ].map((step, idx) => (
                            <div key={idx} className="p-10 rounded-3xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 transition-all group">
                                <div className={`w-16 h-16 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <step.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

          
            <section className="py-24 border-y border-white/5 bg-slate-800/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: 'Resources', value: '500+', icon: FileText },
                            { label: 'Students', value: '1.2k+', icon: Users },
                            { label: 'Downloads', value: '10k+', icon: Download },
                            { label: 'Campuses', value: '15+', icon: Globe }
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-center mb-4">
                                    <stat.icon className="w-6 h-6 text-indigo-500/50" />
                                </div>
                                <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                                <div className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600 -z-10 opacity-[0.03]"></div>
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-5xl font-black text-white mb-8 tracking-tight">Ready to excel together?</h2>
                    <p className="text-slate-500 text-lg mb-12 font-medium">Join thousands of students who are already sharing and learning through our platform.</p>
                    <Link to="/auth" className="inline-flex px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-xl shadow-white/5">
                        Get Started Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;

import { Sparkles, Cpu, MessageSquare, Zap, BarChart3 } from 'lucide-react';

const AIHub = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden min-h-[80vh] flex flex-col items-center justify-center">
            <div className="text-center space-y-8 relative z-10">
                <div className="inline-flex p-6 bg-indigo-600 rounded-[32px] shadow-2xl shadow-indigo-900/40 animate-bounce">
                    <Cpu className="w-16 h-16 text-white" />
                </div>
                
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Zap className="w-3 h-3" />
                        <span>Advanced Analytics</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter">
                        AI Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Assistant</span>
                    </h1>
                    <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
                        We are training our neural networks to summarize your documents and provide instant answers to your questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-12">
                    {[
                        { title: 'Smart Summaries', desc: 'Get the core concepts of 50-page PDFs in seconds.', icon: MessageSquare },
                        { title: 'Instant Q&A', desc: 'Chat directly with your study materials.', icon: Sparkles },
                        { title: 'Study Analytics', desc: 'Track your learning progress with AI insights.', icon: BarChart3 }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
                            <feature.icon className="w-6 h-6 text-indigo-500 mb-4 mx-auto" />
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-500 text-sm font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-12">
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300 font-bold text-5xl">
                        <div className="w-5 h-5 bg-indigo-500 rounded-full animate-ping"></div>
                        <span>Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIHub;

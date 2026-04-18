import { useState, useEffect } from 'react';
import { databases, APPWRITE_CONFIG } from '../appwrite/config';
import ResourceCard from '../components/ResourceCard';
import { Search, Filter, Loader2, Sparkles, LayoutGrid } from 'lucide-react';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('All');
    const [batchFilter, setBatchFilter] = useState('All');

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId
            );
            setResources(response.documents);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = semesterFilter === 'All' || res.semester.toString() === semesterFilter;
        const matchesBatch = batchFilter === 'All' || res.batch.toString() === batchFilter;
        return matchesSearch && matchesSemester && matchesBatch;
    });

    const uniqueBatches = ['All', ...new Set(resources.map(res => res.batch))];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-16">
                <div className="flex items-center gap-2 text-indigo-400 font-black mb-4 tracking-[0.2em] uppercase text-xs">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Resource Explorer</span>
                </div>
                <h1 className="text-5xl font-black text-white mb-6 tracking-tight">
                    Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Repository</span>
                </h1>
                <p className="text-slate-500 max-w-2xl text-lg font-medium">
                    Discover a curated collection of study materials, notes, and guides shared by the student community.
                </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-6 mb-12 items-end">
                <div className="relative flex-grow w-full">
                    <label className="text-xs font-black text-slate-200 uppercase tracking-widest mb-2 block ml-1">Search Resources</label>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Keywords, titles, topics..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-slate-100 placeholder:text-slate-600 font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all backdrop-blur-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex gap-4 w-full lg:w-auto">
                    <div className="flex-1 lg:w-48">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Semester</label>
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <select
                                className="w-full pl-10 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-slate-300 font-bold focus:border-indigo-500/50 transition-all appearance-none cursor-pointer backdrop-blur-md"
                                value={semesterFilter}
                                onChange={(e) => setSemesterFilter(e.target.value)}
                            >
                                <option value="All">All Sems</option>
                                {["1", "2", "3", "4", "5", "6", "7", "8"].map(sem => (
                                    <option key={sem} value={sem}>Sem {sem}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 lg:w-48">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Batch</label>
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <select
                                className="w-full pl-10 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl outline-none text-slate-300 font-bold focus:border-indigo-500/50 transition-all appearance-none cursor-pointer backdrop-blur-md"
                                value={batchFilter}
                                onChange={(e) => setBatchFilter(e.target.value)}
                            >
                                {uniqueBatches.map(batch => (
                                    <option key={batch} value={batch}>{batch}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                    <p className="text-slate-500 font-black tracking-widest uppercase text-xs animate-pulse">Syncing Repository...</p>
                </div>
            ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredResources.map(resource => (
                        <ResourceCard
                            key={resource.$id}
                            resource={resource}
                            onUpdate={fetchResources}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-slate-900/20 rounded-[40px] border border-dashed border-white/5">
                    <Search className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">No results found</h3>
                    <p className="text-slate-600 font-medium max-w-xs mx-auto">Try adjusting your filters or search terms to find what you need.</p>
                </div>
            )}
        </div>
    );
};

export default Resources;

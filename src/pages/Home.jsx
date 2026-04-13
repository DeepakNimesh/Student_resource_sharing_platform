import { useState, useEffect } from 'react';
import { databases, APPWRITE_CONFIG } from '../appwrite/config';
import ResourceCard from '../components/ResourceCard';
import { Search, Filter, Loader2, Sparkles } from 'lucide-react';

const Home = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('All');

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
            console.log(response);
            setResources(response.documents);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.semester.toString().includes(searchTerm);
        const matchesSemester = semesterFilter === 'All' || res.semester.toString() === semesterFilter;
        return matchesSearch && matchesSemester;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <header className="mb-16 text-center">
                <div className="flex items-center justify-center gap-2 text-primary-400 font-bold mb-4 tracking-[0.2em] uppercase text-xs animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span>Academic Resources</span>
                    <Sparkles className="w-4 h-4" />
                </div>
                <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                    Student Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Platform</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Your one-stop destination for academic notes, PDFs, and study guides.
                    Empowered by the student community.
                </p>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-14 items-center justify-center bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl shadow-2xl shadow-black/40 border border-slate-800/50 max-w-4xl mx-auto">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500/50 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title, semester, or keyword..."
                        className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-slate-100 placeholder:text-slate-600 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto px-6 py-2 md:py-0 md:border-l border-slate-800">
                    <Filter className="text-primary-500/50 w-5 h-5" />
                    <select
                        className="bg-transparent outline-none py-2 font-bold text-slate-300 w-full cursor-pointer focus:text-primary-400 transition-colors"
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                    >
                        <option value="All" className="bg-slate-900 text-slate-200">All Semesters</option>
                        {["1", "2", "3", "4", "5", "6", "7", "8"].map(sem => (
                            <option key={sem} value={sem} className="bg-slate-900 text-slate-200">Semester {sem}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading amazing resources...</p>
                </div>
            ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResources.map(resource => (
                        <ResourceCard
                            key={resource.$id}
                            resource={resource}
                            onUpdate={fetchResources}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <div className="text-slate-700 mb-4 flex justify-center">
                        <Search className="w-16 h-16" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2">No resources found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default Home;

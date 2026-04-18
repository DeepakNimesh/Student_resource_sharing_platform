import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, FileText, Download, ExternalLink, Trash2, Loader2, User as UserIcon, Calendar, Bookmark } from 'lucide-react';
import { storage, databases, APPWRITE_CONFIG } from '../appwrite/config';
import { useAuth } from '../context/AuthContext';

const ResourceCard = ({ resource, onUpdate }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ratingHover, setRatingHover] = useState(0);
    const [isRating, setIsRating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = user && user.$id === resource.uploaderId;

    const handleRating = async (newRating) => {
        if (!user) {
            navigate('/auth');
            return;
        }
        if (isRating) return;
        setIsRating(true);
        try {
            const currentAvg = resource.avgRating || 0;
            const totalRatings = resource.totalRatings || 0;
            const updatedAvg = ((currentAvg * totalRatings) + newRating) / (totalRatings + 1);

            await databases.updateDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                resource.$id,
                {
                    avgRating: parseFloat(updatedAvg.toFixed(2)),
                    totalRatings: totalRatings + 1
                }
            );
            
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Rating failed:", error);
        } finally {
            setIsRating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) return;
        
        setIsDeleting(true);
        try {
            await databases.deleteDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                resource.$id
            );
            await storage.deleteFile(
                APPWRITE_CONFIG.bucketId,
                resource.pdfId
            );
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete resource: " + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAction = (type) => {
        if (!user) {
            navigate('/auth');
            return;
        }
        const url = type === 'view' 
            ? storage.getFileView(APPWRITE_CONFIG.bucketId, resource.pdfId)
            : storage.getFileDownload(APPWRITE_CONFIG.bucketId, resource.pdfId);
        window.open(url, '_blank');
    };

    return (
        <div className="group relative bg-slate-900 backdrop-blur-md rounded-[32px] border border-white/5 p-6 flex flex-col gap-6 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start relative z-10">
                <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <FileText className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 bg-amber-400/10 text-amber-500 px-3 py-1.5 rounded-full text-[10px] font-black border border-amber-500/10 shadow-lg shadow-amber-950/20">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{resource.avgRating?.toFixed(1) || "0.0"}</span>
                        <span className="text-amber-500/40">({resource.totalRatings || 0})</span>
                    </div>
                    {isOwner && (
                        <button 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <h3 className="font-black text-xl text-white tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors duration-300">
                    {resource.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 h-10">
                    {resource.description}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/5 relative z-10">
                <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sem {resource.semester}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{resource.batch}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-black text-indigo-400">
                    {resource.uploaderName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Uploaded by</span>
                    <span className="text-xs font-bold text-slate-300 truncate max-w-[120px]">{resource.uploaderName}</span>
                </div>
            </div>

            <div className="space-y-5 mt-auto relative z-10">
                {/* Rating UI */}
                <div className="flex justify-center gap-1 py-2 bg-white/5 rounded-2xl border border-white/5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setRatingHover(star)}
                            onMouseLeave={() => setRatingHover(0)}
                            className="p-1 transition-all hover:scale-125"
                        >
                            <Star 
                                className={`w-5 h-5 transition-all duration-300 ${
                                    star <= (ratingHover || Math.round(resource.avgRating || 0)) 
                                        ? 'fill-amber-500 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                                        : 'text-slate-800'
                                }`} 
                            />
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => handleAction('view')}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                    </button>
                    <button 
                        onClick={() => handleAction('download')}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                    >
                        <Download className="w-3 h-3" />
                        <span>Get PDF</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;

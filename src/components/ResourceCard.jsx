import { useState } from 'react';
import { Star, FileText, Download, ExternalLink, User, Trash2, Loader2 } from 'lucide-react';
import { storage, databases, APPWRITE_CONFIG } from '../appwrite/config';
import { useAuth } from '../context/AuthContext';

const ResourceCard = ({ resource, onUpdate }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [isRating, setIsRating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = user && user.$id === resource.uploaderId;

    const handleRating = async (newRating) => {
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
            // 1. Delete the document from the database
            await databases.deleteDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                resource.$id
            );

            // 2. Delete the file from storage
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

    const handleDownload = () => {
        const url = storage.getFileDownload(APPWRITE_CONFIG.bucketId, resource.pdfId);
        window.open(url, '_blank');
    };

    const handleView = () => {
        const url = storage.getFileView(APPWRITE_CONFIG.bucketId, resource.pdfId);
        window.open(url, '_blank');
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 flex flex-col gap-5 card-hover relative group overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-600/5 blur-3xl group-hover:bg-primary-600/10 transition-all"></div>

            {isOwner && (
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-4 right-4 p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-all z-10"
                    title="Delete Resource"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </button>
            )}

            <div className="flex justify-between items-start">
                <div className="p-4 bg-primary-600/10 text-primary-400 rounded-2xl border border-primary-500/10 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-7 h-7" />
                </div>
                {!isOwner && (
                    <div className="flex items-center gap-1.5 bg-yellow-400/10 text-yellow-500 px-3 py-1.5 rounded-full text-xs font-black border border-yellow-500/20 shadow-lg shadow-yellow-900/10">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{resource.avgRating?.toFixed(1) || "0.0"}</span>
                        <span className="text-yellow-500/40 text-[10px] ml-0.5">({resource.totalRatings || 0})</span>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <h3 className="font-bold text-xl text-white tracking-tight line-clamp-1 group-hover:text-primary-400 transition-colors">{resource.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem] font-medium">{resource.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 py-3 border-y border-slate-800/30">
                <span className="px-3 py-1 bg-slate-800/50 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-700/50">Sem {resource.semester}</span>
                <span className="px-3 py-1 bg-slate-800/50 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-700/50">{resource.batch}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-500 mt-1">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
                    {resource.uploaderName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold tracking-tight">By {resource.uploaderName}</span>
            </div>

            <div className="space-y-5 mt-auto pt-2">
                <div className="flex justify-center gap-2 py-1 bg-slate-950/30 rounded-xl border border-slate-800/50">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setRating(star)}
                            onMouseLeave={() => setRating(0)}
                            className={`transition-all duration-300 transform hover:scale-125 ${isRating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <Star 
                                className={`w-6 h-6 ${star <= (rating || Math.round(resource.avgRating || 0)) ? 'fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]' : 'text-slate-800'}`} 
                            />
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleView} className="btn-secondary flex items-center justify-center gap-2 !px-0 text-sm">
                        <ExternalLink className="w-4 h-4" />
                        <span>View</span>
                    </button>
                    <button onClick={handleDownload} className="btn-primary flex items-center justify-center gap-2 !px-0 text-sm">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;

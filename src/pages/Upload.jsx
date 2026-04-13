import { useState } from 'react';
import { storage, databases, APPWRITE_CONFIG } from '../appwrite/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ID } from 'appwrite';
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2, ArrowLeft, Plus } from 'lucide-react';

const Upload = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [semester, setSemester] = useState('');
    const [batch, setBatch] = useState('');
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !user) return;

        setUploading(true);
        try {
            // 1. Upload file to Storage
            const fileResponse = await storage.createFile(
                APPWRITE_CONFIG.bucketId,
                ID.unique(),
                file
            );

            // 2. Create document in Database
            await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                ID.unique(),
                {
                    title,
                    description,
                    semester: semester,
                    batch: batch,
                    pdfId: fileResponse.$id,
                    uploaderId: user.$id,
                    uploaderName: user.name,
                    avgRating: 0,
                    totalRatings: 0
                }
            );

            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="bg-slate-900 p-12 rounded-3xl shadow-2xl shadow-black/40 border border-slate-800 flex flex-col items-center gap-6 max-w-sm text-center">
                    <div className="w-20 h-20 bg-green-950/30 text-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Upload Successful!</h2>
                        <p className="text-slate-400 font-medium">Your resource has been shared with the community. Redirecting to home...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors font-bold mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
            </button>

            <div className="bg-slate-900 rounded-3xl shadow-xl shadow-black/20 border border-slate-800 overflow-hidden">
                <div className="bg-primary-600 p-8 text-white relative overflow-hidden">
                    <Plus className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
                    <h1 className="text-3xl font-extrabold mb-2 relative z-10">Upload Resource</h1>
                    <p className="text-primary-100 relative z-10 font-medium">Share your knowledge with fellow students.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Resource Title</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="e.g. Data Structures Notes" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
                            <textarea 
                                className="input-field min-h-[100px] resize-none" 
                                placeholder="Briefly describe what's inside..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Semester</label>
                            <select 
                                className="input-field appearance-none cursor-pointer" 
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                required
                            >
                                <option value="" className="bg-slate-900">Select Semester</option>
                                {["1", "2", "3", "4", "5", "6", "7", "8"].map(sem => (
                                    <option key={sem} value={sem} className="bg-slate-900">Semester {sem}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Batch</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="e.g. 2021-2025" 
                                value={batch}
                                onChange={(e) => setBatch(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">PDF Document</label>
                        <div className="relative group">
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                                id="pdf-upload"
                                required
                            />
                            <label 
                                htmlFor="pdf-upload"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-10 cursor-pointer group-hover:border-primary-500/50 group-hover:bg-primary-950/20 transition-all"
                            >
                                <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:bg-slate-700 transition-colors">
                                    {file ? <FileText className="w-8 h-8 text-primary-400" /> : <UploadIcon className="w-8 h-8 text-slate-600 group-hover:text-primary-400" />}
                                </div>
                                <span className="font-bold text-slate-300">{file ? file.name : 'Select PDF File'}</span>
                                <p className="text-slate-500 text-sm mt-1">Maximum file size: 10MB</p>
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={uploading || !file}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-primary-900/40"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                <span>Uploading Resource...</span>
                            </>
                        ) : (
                            <>
                                <UploadIcon className="w-5 h-5" />
                                <span>Share Resource</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;

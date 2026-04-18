import { useState } from 'react';
import { storage, databases, APPWRITE_CONFIG } from '../appwrite/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ID } from 'appwrite';
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2, ArrowLeft, Plus, X } from 'lucide-react';

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
            const fileResponse = await storage.createFile(
                APPWRITE_CONFIG.bucketId,
                ID.unique(),
                file
            );

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
            setTimeout(() => navigate('/resources'), 2000);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="bg-slate-900/50 backdrop-blur-xl p-12 rounded-[40px] border border-indigo-500/20 flex flex-col items-center gap-8 max-w-md text-center shadow-2xl shadow-indigo-900/20">
                    <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">Resource Shared!</h2>
                        <p className="text-slate-400 font-medium leading-relaxed">Your contribution has been successfully added to the repository. Redirecting to resources...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <button 
                onClick={() => navigate('/resources')}
                className="flex items-center gap-3 text-slate-500 hover:text-indigo-400 transition-all font-black uppercase tracking-widest text-[10px] mb-12 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Repository</span>
            </button>

            <div className="bg-slate-900/40 backdrop-blur-xl rounded-[48px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="bg-indigo-600 p-12 text-white relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                            <Plus className="w-3 h-3" />
                            <span>New Contribution</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight leading-none">Share Your Knowledge</h1>
                        <p className="text-indigo-100 font-medium">Contribute to the collective intelligence of your peers.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 block">Resource Title</label>
                            <input 
                                type="text" 
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white font-bold focus:border-indigo-500/50 transition-all" 
                                placeholder="e.g. Advanced Thermodynamics Notes" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 block">Description</label>
                            <textarea 
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white font-bold focus:border-indigo-500/50 transition-all min-h-[120px] resize-none" 
                                placeholder="Briefly explain what's covered in this resource..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 block">Semester</label>
                            <select 
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white font-bold focus:border-indigo-500/50 transition-all appearance-none cursor-pointer" 
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

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 block">Batch / Year</label>
                            <input 
                                type="text" 
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white font-bold focus:border-indigo-500/50 transition-all" 
                                placeholder="e.g. 2022-2026" 
                                value={batch}
                                onChange={(e) => setBatch(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 block">PDF Document</label>
                        <div className="relative group">
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                                id="pdf-upload"
                                required
                            />
                            {file ? (
                                <div className="flex items-center justify-between p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-600 rounded-xl">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</span>
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setFile(null)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <label 
                                    htmlFor="pdf-upload"
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[32px] p-16 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                                >
                                    <div className="p-6 bg-slate-900 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <UploadIcon className="w-10 h-10 text-indigo-500" />
                                    </div>
                                    <span className="text-lg font-bold text-white mb-2">Select your PDF</span>
                                    <p className="text-slate-500 text-sm font-medium">Click to browse or drag and drop (Max 10MB)</p>
                                </label>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={uploading || !file}
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[24px] font-black text-lg transition-all shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="uppercase tracking-widest text-sm">Publishing to Repository...</span>
                            </>
                        ) : (
                            <>
                                <UploadIcon className="w-6 h-6" />
                                <span className="uppercase tracking-widest text-sm">Upload Resource</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;

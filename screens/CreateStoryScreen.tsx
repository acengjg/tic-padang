import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, MapPin, Loader2, Play } from 'lucide-react';
import { apiService } from '../client';

interface CreateStoryScreenProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CreateStoryScreen: React.FC<CreateStoryScreenProps> = ({ onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('media', file);
            formData.append('caption', caption);
            if (location) formData.append('location', location);

            await apiService.createStory(formData);
            onSuccess();
        } catch (error) {
            alert('Gagal upload story');
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex justify-between items-center p-4 text-white z-10">
                <button onClick={onClose}><X size={24} /></button>
                <h2 className="font-bold text-lg">Buat Cerita</h2>
                <div className="w-6" /> {/* Spacer */}
            </div>

            {/* Preview Area */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
                {preview ? (
                    file?.type.startsWith('video') ? (
                        <video src={preview} className="w-full h-full object-contain" controls />
                    ) : (
                        <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                    )
                ) : (
                    <div className="text-center text-gray-500">
                        <Camera size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Ambil foto atau pilih dari galeri</p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-black p-6 pb-12 space-y-4">
                {!preview ? (
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="bg-gray-800 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon size={24} />
                            <span className="text-sm font-bold">Galeri</span>
                        </button>
                        <button className="bg-gray-800 text-white p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 opacity-50 cursor-not-allowed">
                            <Camera size={24} />
                            <span className="text-sm font-bold">Kamera</span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                        />
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-800 rounded-xl p-3 flex gap-2">
                            <MapPin className="text-padang-green flex-shrink-0" size={20} />
                            <input
                                type="text"
                                placeholder="Tambahkan lokasi..."
                                className="bg-transparent text-white placeholder-gray-500 text-sm outline-none flex-1"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="bg-gray-800 rounded-xl p-3">
                            <textarea
                                placeholder="Tulis caption..."
                                className="bg-transparent text-white placeholder-gray-500 text-sm outline-none w-full resize-none"
                                rows={3}
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={uploading}
                            className="w-full bg-padang-green text-white py-3 rounded-full font-bold text-lg shadow-lg shadow-padang-green/20 disabled:opacity-50"
                        >
                            {uploading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" /> Uploading...
                                </span>
                            ) : 'Bagikan Cerita'}
                        </button>

                        <button
                            onClick={() => { setFile(null); setPreview(null); }}
                            className="w-full text-gray-400 text-sm font-bold py-2"
                        >
                            Batalkan
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateStoryScreen;

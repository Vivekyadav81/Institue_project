import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Maximize2 } from 'lucide-react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        if (Array.isArray(data)) setImages(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Loading Gallery...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Our <span className="text-red-600">Gallery</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Take a look at our classrooms, events, and successful students.</p>
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 mb-12">
          <button onClick={() => setFilter('all')} className={`px-5 py-2 sm:px-6 rounded-full font-bold transition-all text-sm sm:text-base ${filter === 'all' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'}`}>All</button>
          <button onClick={() => setFilter('image')} className={`px-5 py-2 sm:px-6 rounded-full font-bold transition-all text-sm sm:text-base ${filter === 'image' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'}`}>Photos</button>
          <button onClick={() => setFilter('video')} className={`px-5 py-2 sm:px-6 rounded-full font-bold transition-all text-sm sm:text-base ${filter === 'video' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'}`}>Videos</button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <ImageIcon size={64} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400">No images have been added to the gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {images.filter(img => filter === 'all' || img.media_type === filter || (!img.media_type && filter === 'image')).map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  {img.media_type === 'video' ? (
                    <video
                      src={img.image_url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={img.image_url}
                      alt="Gallery item"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="text-white" size={24} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-6xl w-full flex justify-center">
            {selectedImage.media_type === 'video' ? (
              <video 
                src={selectedImage.image_url} 
                className="max-w-full max-h-[85vh] rounded-sm shadow-2xl" 
                controls 
                autoPlay 
                playsInline 
              />
            ) : (
              <img 
                src={selectedImage.image_url} 
                alt="Expanded view" 
                className="max-w-full max-h-[85vh] object-contain rounded-sm"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

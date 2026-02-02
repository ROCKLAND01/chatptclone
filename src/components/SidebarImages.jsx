import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';

// Mock data generator since we don't have real backend images yet
const MOCK_IMAGES = Array.from({ length: 12 }, (_, i) => ({
  id: `img-${i}`,
  url: `https://picsum.photos/seed/${i + 100}/800/800`,
  thumbnail: `https://picsum.photos/seed/${i + 100}/200/200`,
  caption: `Generated Image ${i + 1}`
}));

export default function SidebarImages() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images] = useState(MOCK_IMAGES); // In real app, this would come from props or context

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center gap-2">
        <ImageIcon size={16} className="text-[var(--accent-color)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Gallery</h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        {images.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-[var(--text-muted)]">No images yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img) => (
              <motion.button
                key={img.id}
                layoutId={`img-${img.id}`}
                onClick={() => setSelectedImage(img)}
                className="relative aspect-square rounded-md overflow-hidden bg-[var(--bg-secondary)] group focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={img.thumbnail}
                  alt={img.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 z-[110]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close preview"
              >
                <X size={24} />
              </button>
            </motion.div>

            <motion.div
              layoutId={`img-${selectedImage.id}`}
              className="relative max-w-5xl max-h-[90vh] p-4 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-white/90 text-sm font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-md"
              >
                {selectedImage.caption}
              </motion.p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

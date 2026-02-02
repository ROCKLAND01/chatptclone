import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function DeleteChatModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete chat history?", 
  description = "This action cannot be undone." 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-xl pointer-events-auto overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Warning Icon Wrapper */}
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <h2 
                      id="modal-title" 
                      className="text-lg font-semibold text-[var(--text-primary)] leading-none tracking-tight"
                    >
                      {title}
                    </h2>
                    <p 
                      id="modal-description" 
                      className="text-sm text-[var(--text-muted)]"
                    >
                      {description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      x: [0, -2, 2, -2, 2, 0],
                      transition: { duration: 0.4 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

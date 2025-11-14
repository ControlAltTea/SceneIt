// src/components/SearchSidebar.jsx
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import SearchInput from "./SearchInput";

export default function SearchSidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          
          <motion.aside
            className="fixed top-0 right-0 h-full w-96 p-6 bg-[#05000c] border-l-2 border-gray-700/50 text-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
          >
            <X onClick={onClose} size={32} className='self-end mb-8 cursor-pointer hover:scale-[1.15] transition-all duration-300 hover:text-green-400' />
            
            <div className="flex-1 overflow-y-auto">
              <SearchInput />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

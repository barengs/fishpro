import { motion } from "framer-motion";
import { roleCards, type Role } from "./types";

interface RoleSelectorProps {
  onSelect: (role: Role) => void;
}

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-220 mx-auto">
        {roleCards.map(({ key, title, desc, Icon, card, iconBox }, i) => (
          <motion.button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className={`flex sm:flex-col items-center sm:justify-center text-left sm:text-center gap-3.5 sm:gap-0 p-4 sm:py-6 sm:px-4 rounded-2xl text-white w-full cursor-pointer border-none shadow-lg transition-colors ${card}`}
          >
            <motion.span
              className={`w-12 h-12 rounded-xl sm:rounded-2xl ${iconBox} text-white flex items-center justify-center shrink-0 sm:mb-3`}
              whileHover={{ rotate: -6, scale: 1.08 }}
            >
              <Icon size={24} aria-hidden="true" />
            </motion.span>
            <span className="flex-1 min-w-0">
              <span className="block text-base sm:text-lg font-extrabold">
                {title}
              </span>
              <span className="block text-xs sm:text-sm text-white/85 mt-0.5">
                {desc}
              </span>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

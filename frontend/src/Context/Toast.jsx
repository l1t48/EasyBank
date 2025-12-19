import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faInfo
} from "@fortawesome/free-solid-svg-icons";
import { TOAST_AUTO_CLOSE_DELAY_MS, TOAST_ANIMATION_DURATION_SEC, TOAST_ANIMATION_OFFSET_Y } from "../Data/Global_variables";

function Toast({ message, show, type = "info", onClose }) {
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-[var(--bg)] text-[var(--nav-text-sec)] border border-[var(--nav-text-sec)]",
  };

  const icons = {
    success: faCircleCheck,
    error: faCircleXmark,
    info: faInfo,
  };

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, TOAST_AUTO_CLOSE_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: TOAST_ANIMATION_OFFSET_Y }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: TOAST_ANIMATION_OFFSET_Y }}
          transition={{ duration: TOAST_ANIMATION_DURATION_SEC, ease: "easeInOut" }}
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 
              ${typeStyles[type]} px-5 py-3 rounded-lg shadow-lg 
              text-sm sm:text-base md:text-lg
              flex items-center justify-center text-center z-[9999]`}
        >
          <FontAwesomeIcon icon={icons[type]} className="mr-2" />
          <span className="text-xs sm:text-base md:text-lg">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;

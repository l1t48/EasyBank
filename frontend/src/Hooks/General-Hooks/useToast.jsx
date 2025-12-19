import { useState, useCallback } from "react";

function useToast() {
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");

  const setToast = useCallback((message, type = "info") => {
    setToastMsg(message);
    setToastType(type);
    setShowToast(true);
  }, []);

  const closeToast = useCallback(() => {
    setShowToast(false);
  }, []);

  return { toastMsg, showToast, toastType, setToast, closeToast };
}

export default useToast;
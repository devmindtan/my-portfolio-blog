import { useCallback, useEffect, useState } from "react";

const COMPACT_VIEW_STORAGE_KEY = "compact-view";

export default function useCompactView() {
  const [compactView, setCompactView] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COMPACT_VIEW_STORAGE_KEY) === "1";
  });

  useEffect(() => {
    if (compactView) {
      window.localStorage.setItem(COMPACT_VIEW_STORAGE_KEY, "1");
      return;
    }
    window.localStorage.removeItem(COMPACT_VIEW_STORAGE_KEY);
  }, [compactView]);

  const toggleCompactView = useCallback(() => {
    setCompactView((prev) => !prev);
  }, []);

  return {
    compactView,
    toggleCompactView,
  };
}

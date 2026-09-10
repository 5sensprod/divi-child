// src/context/MenuContext.jsx
// Fournit le menu publié à l'en-tête. Remplace `WordPressContext`, qui ne
// portait plus, à la fin, que ce menu et un `site-data` WordPress.

import { createContext, useContext, useEffect, useState } from "react";
import { getCachedMenu, loadMenu } from "../services/menu";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [state, setState] = useState(() => {
    const cached = getCachedMenu();
    return { menu: cached, loading: !cached };
  });

  useEffect(() => {
    let cancelled = false;
    loadMenu().then((menu) => {
      if (!cancelled) setState({ menu, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <MenuContext.Provider value={state}>{children}</MenuContext.Provider>;
}

export function useSiteMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useSiteMenu doit être utilisé sous MenuProvider");
  }
  return context;
}

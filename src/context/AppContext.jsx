import { createContext, useContext, useMemo, useRef } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import {
  APP_KEYS,
  createDefaultData,
  normalizeImportData
} from "../utils/seedData.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const initialData = useRef(createDefaultData()).current;
  const [parts, setParts] = useLocalStorage(APP_KEYS.parts, initialData.parts);
  const [windowTypes, setWindowTypes] = useLocalStorage(
    APP_KEYS.windowTypes,
    initialData.windowTypes,
  );
  const [settings, setSettings] = useLocalStorage(
    APP_KEYS.settings,
    initialData.settings,
  );
  const [projects, setProjects] = useLocalStorage(APP_KEYS.projects, []);
  const [glassRates, setGlassRates] = useLocalStorage(
    APP_KEYS.glassRates,
    initialData.glassRates,
  );

  const resetData = () => {
    const defaults = createDefaultData();
    setParts(defaults.parts);
    setWindowTypes(defaults.windowTypes);
    setSettings(defaults.settings);
    setProjects([]);
    setGlassRates(defaults.glassRates);
    window.localStorage.removeItem(APP_KEYS.currentEstimate);
    window.sessionStorage.removeItem("al_admin_authenticated");
  };

  const exportData = () => {
    const snapshot = {};
    Object.values(APP_KEYS).forEach((key) => {
      const value = window.localStorage.getItem(key);
      if (value !== null) snapshot[key] = JSON.parse(value);
    });
    return snapshot;
  };

  const importData = (incoming) => {
    const normalized = normalizeImportData(incoming, createDefaultData());
    setParts(normalized[APP_KEYS.parts]);
    setWindowTypes(normalized[APP_KEYS.windowTypes]);
    setSettings(normalized[APP_KEYS.settings]);
    setProjects(normalized[APP_KEYS.projects]);
    setGlassRates(normalized[APP_KEYS.glassRates]);

    if (normalized[APP_KEYS.currentEstimate]) {
      window.localStorage.setItem(
        APP_KEYS.currentEstimate,
        JSON.stringify(normalized[APP_KEYS.currentEstimate]),
      );
    } else {
      window.localStorage.removeItem(APP_KEYS.currentEstimate);
    }
  };

  const value = useMemo(
    () => ({
      parts,
      setParts,
      windowTypes,
      setWindowTypes,
      settings,
      setSettings,
      projects,
      setProjects,
      glassRates,
      setGlassRates,
      resetData,
      exportData,
      importData
    }),
    [parts, windowTypes, settings, projects, glassRates],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}


import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { calculateEstimate } from "../utils/calculate.js";
import {
  APP_KEYS,
  createEmptyEstimate,
  createUuid
} from "../utils/seedData.js";
import { useLocalStorage } from "./useLocalStorage.js";

export function useEstimate() {
  const app = useApp();
  const [estimate, setEstimate] = useLocalStorage(
    APP_KEYS.currentEstimate,
    createEmptyEstimate(),
  );

  const totals = useMemo(
    () =>
      calculateEstimate(estimate, {
        parts: app.parts,
        windowTypes: app.windowTypes,
        glassRates: app.glassRates,
        settings: app.settings
      }),
    [estimate, app.parts, app.windowTypes, app.glassRates, app.settings],
  );

  const startNewEstimate = () => {
    setEstimate(createEmptyEstimate());
  };

  const updateField = (field, value) => {
    setEstimate((current) => ({
      ...current,
      [field]: value
    }));
  };

  const addWindow = (windowData) => {
    setEstimate((current) => ({
      ...current,
      windows: [
        ...current.windows,
        {
          id: createUuid(),
          ...normalizeWindow(windowData)
        }
      ]
    }));
  };

  const updateWindow = (windowId, windowData) => {
    setEstimate((current) => ({
      ...current,
      windows: current.windows.map((item) =>
        item.id === windowId ? { ...item, ...normalizeWindow(windowData) } : item,
      )
    }));
  };

  const deleteWindow = (windowId) => {
    setEstimate((current) => ({
      ...current,
      windows: current.windows.filter((item) => item.id !== windowId)
    }));
  };

  return {
    estimate,
    setEstimate,
    totals,
    startNewEstimate,
    updateField,
    addWindow,
    updateWindow,
    deleteWindow
  };
}

function normalizeWindow(windowData) {
  return {
    windowTypeId: windowData.windowTypeId,
    label: windowData.label?.trim() || "",
    widthFt: Number(windowData.widthFt) || 0,
    heightFt: Number(windowData.heightFt) || 0,
    quantity: Math.max(1, Number(windowData.quantity) || 1),
    glassType: windowData.glassType || "Clear",
    includeGlass: Boolean(windowData.includeGlass)
  };
}


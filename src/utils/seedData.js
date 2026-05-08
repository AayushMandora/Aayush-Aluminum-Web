export const APP_KEYS = {
  windowTypes: "al_window_types",
  parts: "al_parts",
  settings: "al_settings",
  projects: "al_projects",
  glassRates: "al_glass_rates",
  currentEstimate: "al_current_estimate"
};

export const FORMULA_TYPES = ["perimeter", "width", "height", "fixed"];
export const PART_UNITS = ["meter", "piece", "kg", "set", "unit"];
const FT_TO_METER = 0.3048;

export function createUuid() {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createEmptyEstimate() {
  return {
    id: createUuid(),
    clientName: "",
    clientPhone: "",
    date: new Date().toISOString(),
    windows: [],
    includeLabour: true,
    includeGst: true,
    notes: "",
    totalAmount: 0
  };
}

export function createDefaultData() {
  const domalTrack = createUuid();
  const domalSideFrame = createUuid();
  const zTrack = createUuid();
  const handle = createUuid();
  const woolPile = createUuid();
  const screwPack = createUuid();
  const cornerJoint = createUuid();

  const parts = [
    {
      id: domalTrack,
      name: "Domal top/bottom track",
      unit: "meter",
      costPerUnit: 85
    },
    {
      id: domalSideFrame,
      name: "Domal side frame",
      unit: "meter",
      costPerUnit: 70
    },
    {
      id: zTrack,
      name: "Z-section track",
      unit: "meter",
      costPerUnit: 65
    },
    { id: handle, name: "Handle", unit: "piece", costPerUnit: 120 },
    { id: woolPile, name: "Wool pile (weather strip)", unit: "meter", costPerUnit: 15 },
    { id: screwPack, name: "Screw pack", unit: "set", costPerUnit: 30 },
    { id: cornerJoint, name: "Corner joint", unit: "piece", costPerUnit: 25 }
  ];

  const windowTypes = [
    {
      id: createUuid(),
      name: "Domal 3 in 1",
      description: "3-track sliding window",
      parts: [
        {
          partId: domalTrack,
          formulaType: "width",
          multiplier: 2 * FT_TO_METER,
          label: "Top/Bottom Track"
        },
        {
          partId: domalSideFrame,
          formulaType: "height",
          multiplier: 2 * FT_TO_METER,
          label: "Side Frame"
        },
        {
          partId: woolPile,
          formulaType: "perimeter",
          multiplier: FT_TO_METER,
          label: "Wool Pile"
        },
        {
          partId: handle,
          formulaType: "fixed",
          quantity: 2,
          label: "Handles"
        },
        {
          partId: screwPack,
          formulaType: "fixed",
          quantity: 1,
          label: "Screws"
        },
        {
          partId: cornerJoint,
          formulaType: "fixed",
          quantity: 4,
          label: "Corner Joints"
        }
      ]
    },
    {
      id: createUuid(),
      name: "Z-Window",
      description: "2-track sliding window",
      parts: [
        {
          partId: zTrack,
          formulaType: "width",
          multiplier: 2 * FT_TO_METER,
          label: "Z Track"
        },
        {
          partId: domalSideFrame,
          formulaType: "height",
          multiplier: 2 * FT_TO_METER,
          label: "Side Frame"
        },
        {
          partId: woolPile,
          formulaType: "perimeter",
          multiplier: 0.75 * FT_TO_METER,
          label: "Wool Pile"
        },
        {
          partId: handle,
          formulaType: "fixed",
          quantity: 2,
          label: "Handles"
        },
        {
          partId: screwPack,
          formulaType: "fixed",
          quantity: 1,
          label: "Screws"
        },
        {
          partId: cornerJoint,
          formulaType: "fixed",
          quantity: 4,
          label: "Corner Joints"
        }
      ]
    },
    {
      id: createUuid(),
      name: "Fixed Window",
      description: "Fixed aluminium frame with glass",
      parts: [
        {
          partId: domalSideFrame,
          formulaType: "perimeter",
          multiplier: FT_TO_METER,
          label: "Outer Frame"
        },
        {
          partId: screwPack,
          formulaType: "fixed",
          quantity: 1,
          label: "Screws"
        },
        {
          partId: cornerJoint,
          formulaType: "fixed",
          quantity: 4,
          label: "Corner Joints"
        }
      ]
    }
  ];

  return {
    parts,
    windowTypes,
    settings: {
      shopName: "Aayush Aluminium & Glass Center",
      phone: "",
      gstPercent: 18,
      labourType: "perWindowFlat",
      labourValue: 300,
      adminPin: "1234",
      currency: "₹"
    },
    projects: [],
    glassRates: [
      { id: createUuid(), type: "Clear", costPerSqFt: 35 },
      { id: createUuid(), type: "Tinted", costPerSqFt: 55 },
      { id: createUuid(), type: "Frosted", costPerSqFt: 65 }
    ]
  };
}

export function normalizeImportData(data, defaults = createDefaultData()) {
  return {
    [APP_KEYS.parts]: Array.isArray(data?.[APP_KEYS.parts])
      ? data[APP_KEYS.parts]
      : defaults.parts,
    [APP_KEYS.windowTypes]: Array.isArray(data?.[APP_KEYS.windowTypes])
      ? data[APP_KEYS.windowTypes]
      : defaults.windowTypes,
    [APP_KEYS.settings]: {
      ...defaults.settings,
      ...(isObject(data?.[APP_KEYS.settings]) ? data[APP_KEYS.settings] : {}),
      labourType: "perWindowFlat"
    },
    [APP_KEYS.projects]: Array.isArray(data?.[APP_KEYS.projects])
      ? data[APP_KEYS.projects]
      : [],
    [APP_KEYS.glassRates]: Array.isArray(data?.[APP_KEYS.glassRates])
      ? data[APP_KEYS.glassRates]
      : defaults.glassRates,
    [APP_KEYS.currentEstimate]: isObject(data?.[APP_KEYS.currentEstimate])
      ? data[APP_KEYS.currentEstimate]
      : null
  };
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

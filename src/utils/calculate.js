export function calculateWindow(window, windowType, parts, glassRates) {
  const quantity = Math.max(1, Number(window.quantity) || 1);
  const widthFt = Number(window.widthFt) || 0;
  const heightFt = Number(window.heightFt) || 0;
  const partRows = [];
  let partsCostPerWindow = 0;

  if (windowType?.parts?.length) {
    for (const typePart of windowType.parts) {
      const part = parts.find((item) => item.id === typePart.partId);
      if (!part) continue;

      const qtyPerWindow = calculatePartQuantity(
        { ...window, widthFt, heightFt },
        typePart,
      );
      const totalQty = qtyPerWindow * quantity;
      const amount = totalQty * (Number(part.costPerUnit) || 0);
      partsCostPerWindow += qtyPerWindow * (Number(part.costPerUnit) || 0);
      partRows.push({
        id: `${window.id}-${part.id}-${typePart.label}`,
        label: typePart.label || part.name,
        partId: part.id,
        partName: part.name,
        formulaType: typePart.formulaType,
        qtyPerWindow,
        quantity: totalQty,
        unit: part.unit,
        rate: Number(part.costPerUnit) || 0,
        amount
      });
    }
  }

  const glassRate = findGlassRate(glassRates, window.glassType);
  const areaSqFt = widthFt * heightFt;
  const glassCost =
    window.includeGlass && glassRate
      ? areaSqFt * quantity * (Number(glassRate.costPerSqFt) || 0)
      : 0;
  const partsCost = partsCostPerWindow * quantity;

  return {
    window,
    windowType,
    typeName: windowType?.name || "Unknown type",
    label: window.label || "Window",
    widthFt,
    heightFt,
    quantity,
    areaSqFt,
    partRows,
    partsCost,
    glassType: window.glassType,
    glassRate: glassRate?.costPerSqFt || 0,
    glassCost,
    total: partsCost + glassCost
  };
}

export function calculatePartQuantity(window, typePart) {
  const widthFt = Number(window.widthFt) || 0;
  const heightFt = Number(window.heightFt) || 0;
  const multiplier = Number(typePart.multiplier ?? 1) || 0;

  if (typePart.formulaType === "perimeter") {
    return (widthFt + heightFt) * 2 * multiplier;
  }
  if (typePart.formulaType === "width") {
    return widthFt * multiplier;
  }
  if (typePart.formulaType === "height") {
    return heightFt * multiplier;
  }
  if (typePart.formulaType === "fixed") {
    return Number(typePart.quantity) || 0;
  }
  return 0;
}

export function calculateEstimate(estimate, data) {
  const windows = Array.isArray(estimate?.windows) ? estimate.windows : [];
  const windowBreakdowns = windows.map((window) => {
    const windowType = data.windowTypes.find((item) => item.id === window.windowTypeId);
    return calculateWindow(window, windowType, data.parts, data.glassRates);
  });

  const materialsSubtotal = sum(windowBreakdowns.map((item) => item.partsCost));
  const glassSubtotal = sum(windowBreakdowns.map((item) => item.glassCost));
  const totalWindowQuantity = sum(
    windows.map((item) => Math.max(1, Number(item.quantity) || 1)),
  );
  const labour = estimate?.includeLabour
    ? calculateLabour(
        data.settings,
        materialsSubtotal + glassSubtotal,
        totalWindowQuantity,
      )
    : 0;
  const gstBase = materialsSubtotal + glassSubtotal + labour;
  const gst = estimate?.includeGst
    ? gstBase * ((Number(data.settings.gstPercent) || 0) / 100)
    : 0;
  const grandTotal = gstBase + gst;

  return {
    windowBreakdowns,
    materialsSubtotal,
    glassSubtotal,
    totalWindowQuantity,
    labour,
    gst,
    grandTotal
  };
}

export function findGlassRate(glassRates, glassType) {
  const wanted = String(glassType || "").toLowerCase();
  return glassRates.find(
    (item) =>
      item.id === glassType || String(item.type || "").toLowerCase() === wanted,
  );
}

function calculateLabour(settings, subtotal, totalWindowQuantity) {
  const value = Number(settings.labourValue) || 0;
  if (settings.labourType === "perWindowFlat") {
    return value * totalWindowQuantity;
  }
  if (settings.labourType === "percent") {
    return subtotal * (value / 100);
  }
  return value;
}

function sum(values) {
  return values.reduce((total, value) => total + (Number(value) || 0), 0);
}


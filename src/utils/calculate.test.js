import { describe, expect, it } from "vitest";
import {
  calculateEstimate,
  calculatePartQuantity,
  calculateWindow
} from "./calculate.js";

const parts = [
  { id: "track", name: "Track", unit: "meter", costPerUnit: 100 },
  { id: "lock", name: "Lock", unit: "piece", costPerUnit: 150 }
];
const glassRates = [{ id: "clear", type: "Clear", costPerSqFt: 35 }];
const windowType = {
  id: "sliding",
  name: "Sliding",
  parts: [
    { partId: "track", formulaType: "perimeter", multiplier: 0.3048 },
    { partId: "lock", formulaType: "fixed", quantity: 2 }
  ]
};

describe("calculation logic", () => {
  it("calculates supported part formulas from feet base", () => {
    expect(
      calculatePartQuantity({ widthFt: 4, heightFt: 3 }, {
        formulaType: "perimeter",
        multiplier: 1
      }),
    ).toBe(14);
    expect(
      calculatePartQuantity({ widthFt: 4, heightFt: 3 }, {
        formulaType: "width",
        multiplier: 2
      }),
    ).toBe(8);
    expect(
      calculatePartQuantity({ widthFt: 4, heightFt: 3 }, {
        formulaType: "height",
        multiplier: 3
      }),
    ).toBe(9);
    expect(
      calculatePartQuantity({}, { formulaType: "fixed", quantity: 2 }),
    ).toBe(2);
  });

  it("multiplies parts and glass by window quantity", () => {
    const result = calculateWindow(
      {
        id: "w1",
        windowTypeId: "sliding",
        widthFt: 4,
        heightFt: 3,
        quantity: 2,
        includeGlass: true,
        glassType: "Clear"
      },
      windowType,
      parts,
      glassRates,
    );

    expect(result.partsCost).toBeCloseTo((14 * 0.3048 * 100 + 2 * 150) * 2);
    expect(result.glassCost).toBe(4 * 3 * 35 * 2);
  });

  it("applies per-window labour and GST to subtotal plus labour", () => {
    const estimate = {
      windows: [
        {
          id: "w1",
          windowTypeId: "sliding",
          widthFt: 4,
          heightFt: 3,
          quantity: 2,
          includeGlass: true,
          glassType: "Clear"
        }
      ],
      includeLabour: true,
      includeGst: true
    };
    const result = calculateEstimate(estimate, {
      parts,
      glassRates,
      windowTypes: [windowType],
      settings: {
        labourType: "perWindowFlat",
        labourValue: 300,
        gstPercent: 18
      }
    });

    const beforeTax = result.materialsSubtotal + result.glassSubtotal + 600;
    expect(result.labour).toBe(600);
    expect(result.gst).toBeCloseTo(beforeTax * 0.18);
    expect(result.grandTotal).toBeCloseTo(beforeTax * 1.18);
  });
});


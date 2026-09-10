import { R as React, j as jsxRuntimeExports } from "../ssr.js";
import { P as PropTypes } from "./index-h3QfXfrJ.js";
const DISCO_PRESETS = {
  lesco: { name: "LESCO", region: "Lahore & Kasur / Okara", multiplier: 1 },
  gepco: { name: "GEPCO", region: "Gujranwala & Sialkot", multiplier: 0.99 },
  fesco: { name: "FESCO", region: "Faisalabad & Sargodha", multiplier: 0.98 },
  iesco: { name: "IESCO", region: "Islamabad & Rawalpindi", multiplier: 1.01 },
  mepco: { name: "MEPCO", region: "Multan & South Punjab", multiplier: 1.02 },
  pesco: { name: "PESCO", region: "Peshawar & Khyber Pakhtunkhwa", multiplier: 1.03 },
  hesco: { name: "HESCO", region: "Hyderabad & Interior Sindh", multiplier: 1.04 },
  sepco: { name: "SEPCO", region: "Sukkur & Upper Sindh", multiplier: 1.04 },
  qesco: { name: "QESCO", region: "Quetta & Balochistan", multiplier: 1.02 }
};
const APPLIANCE_PRESETS = [
  {
    id: "inverter_ac_1_5",
    name: "Inverter AC (1.5 Ton)",
    category: "Cooling",
    kwPerHour: 1.2,
    defaultHours: 4,
    defaultQty: 1,
    maxHours: 24,
    maxQty: 4,
    stepHours: 0.5,
    unitLabel: "hrs/day",
    description: "Average continuous cooling load at 26°C setpoint"
  },
  {
    id: "non_inverter_ac_1_0",
    name: "Non-Inverter / 1.0 Ton AC",
    category: "Cooling",
    kwPerHour: 0.9,
    defaultHours: 0,
    defaultQty: 1,
    maxHours: 24,
    maxQty: 4,
    stepHours: 0.5,
    unitLabel: "hrs/day",
    description: "Compact bedroom unit running cycles"
  },
  {
    id: "refrigerator",
    name: "Refrigerator / Deep Freezer",
    category: "Refrigeration",
    kwPerDayFixed: 2.5,
    // 2.5 kWh fixed per day per unit
    defaultHours: 24,
    // Running cycles (fixed daily consumption)
    defaultQty: 1,
    maxHours: 24,
    maxQty: 3,
    isDailyFixed: true,
    unitLabel: "active",
    description: "Compressor cycling load (~75 units/month each)"
  },
  {
    id: "water_pump",
    name: "Water Pump (1 - 1.5 HP Induction)",
    category: "Motor",
    kwPerHour: 1.1,
    defaultHours: 1,
    defaultQty: 1,
    maxHours: 3,
    maxQty: 2,
    stepHours: 0.25,
    // 15-minute increments
    unitLabel: "hrs/day",
    description: "Donki pump or underground water motor fill time"
  },
  {
    id: "fans_lights",
    name: "Ceiling Fans & LED Lights",
    category: "Lighting & Fans",
    kwPerHour: 0.08,
    // ~80 Watts per active room set
    defaultHours: 24,
    // e.g. 2 rooms x 12 hrs
    defaultQty: 1,
    maxHours: 48,
    maxQty: 1,
    stepHours: 1,
    isRoomHours: true,
    unitLabel: "room hrs/day",
    description: "Combined 80W load (1 AC inverter fan + 2 LED bulbs)"
  }
];
function calculateApplianceMonthlyUnits(appliance, hours, qty) {
  const q = Math.max(0, Number(qty) || 0);
  const h = Math.max(0, Number(hours) || 0);
  if (q === 0) return 0;
  if (appliance.isDailyFixed) {
    return Math.round(q * (appliance.kwPerDayFixed || 2.5) * 30 * 10) / 10;
  }
  const kw = appliance.kwPerHour || 0;
  return Math.round(q * kw * h * 30 * 10) / 10;
}
function calculateTotalApplianceUnits(appliancesState) {
  let total = 0;
  APPLIANCE_PRESETS.forEach((preset) => {
    const state = appliancesState[preset.id] || { hours: preset.defaultHours, qty: preset.defaultQty };
    total += calculateApplianceMonthlyUnits(preset, state.hours, state.qty);
  });
  return Math.round(total);
}
function calculatePakistanElectricityBill(unitsInput, discoKey = "lesco", forceCategory = null) {
  const units = Math.max(1, Math.round(Number(unitsInput) || 0));
  const isProtected = forceCategory ? forceCategory === "protected" : units <= 200;
  let baseEnergyCost = 0;
  let slabBreakdown = [];
  if (isProtected) {
    if (units <= 50) {
      const cost = units * 3.95;
      baseEnergyCost = cost;
      slabBreakdown.push({ slab: "1 - 50 (Lifeline)", units, rate: 3.95, cost });
    } else {
      const firstSlabUnits = Math.min(units, 100);
      const firstSlabCost = firstSlabUnits * 7.74;
      baseEnergyCost += firstSlabCost;
      slabBreakdown.push({ slab: "1 - 100", units: firstSlabUnits, rate: 7.74, cost: firstSlabCost });
      if (units > 100) {
        const secondSlabUnits = units - 100;
        const secondSlabCost = secondSlabUnits * 14.16;
        baseEnergyCost += secondSlabCost;
        slabBreakdown.push({ slab: "101 - 200", units: secondSlabUnits, rate: 14.16, cost: secondSlabCost });
      }
    }
    const fcSurcharge2 = units * 1.25;
    const fpa2 = units * 2;
    const fixedCharges2 = 150;
    const duty2 = baseEnergyCost * 0.015;
    const tvFee2 = 35;
    const tariffBuffer = units * 7.75;
    const totalBill2 = Math.round(baseEnergyCost + fcSurcharge2 + fpa2 + fixedCharges2 + duty2 + tvFee2 + tariffBuffer);
    return {
      units,
      category: "protected",
      isProtected: true,
      baseEnergyCost: Math.round(baseEnergyCost),
      fcSurcharge: Math.round(fcSurcharge2),
      fpa: Math.round(fpa2),
      gst: 0,
      tvFee: tvFee2,
      totalBill: totalBill2,
      effectiveRatePerUnit: Math.round(totalBill2 / units * 100) / 100,
      slabBreakdown
    };
  }
  const u1 = Math.min(units, 100);
  const c1 = u1 * 16.48;
  baseEnergyCost += c1;
  slabBreakdown.push({ slab: "1 - 100", units: u1, rate: 16.48, cost: c1 });
  if (units > 100) {
    const u2 = Math.min(units - 100, 100);
    const c2 = u2 * 22.95;
    baseEnergyCost += c2;
    slabBreakdown.push({ slab: "101 - 200", units: u2, rate: 22.95, cost: c2 });
  }
  if (units > 200) {
    const u3 = Math.min(units - 200, 100);
    const c3 = u3 * 27.14;
    baseEnergyCost += c3;
    slabBreakdown.push({ slab: "201 - 300", units: u3, rate: 27.14, cost: c3 });
  }
  if (units > 300) {
    const u4 = Math.min(units - 300, 400);
    const c4 = u4 * 35.5;
    baseEnergyCost += c4;
    slabBreakdown.push({ slab: "301 - 700", units: u4, rate: 35.5, cost: c4 });
  }
  if (units > 700) {
    const u5 = units - 700;
    const c5 = u5 * 48.84;
    baseEnergyCost += c5;
    slabBreakdown.push({ slab: "701+", units: u5, rate: 48.84, cost: c5 });
  }
  const fixedCharges = units > 300 ? 600 : 400;
  const fcSurcharge = units * 3.23;
  const fpa = units * 3;
  const duty = baseEnergyCost * 0.015;
  const tvFee = 35;
  const qtaAndAdjustments = units * 6.5;
  const subtotalPreTax = baseEnergyCost + fcSurcharge + fpa + fixedCharges + duty + tvFee + qtaAndAdjustments;
  const gst = subtotalPreTax * 0.18;
  let advanceTax = 0;
  if (subtotalPreTax + gst > 25e3) {
    advanceTax = (subtotalPreTax + gst) * 0.075;
  }
  const totalBill = Math.round(subtotalPreTax + gst + advanceTax);
  return {
    units,
    category: "unprotected",
    isProtected: false,
    baseEnergyCost: Math.round(baseEnergyCost),
    fcSurcharge: Math.round(fcSurcharge),
    fpa: Math.round(fpa),
    gst: Math.round(gst),
    tvFee,
    totalBill,
    effectiveRatePerUnit: Math.round(totalBill / units * 100) / 100,
    slabBreakdown
  };
}
function evaluateSlabCliff(unitsInput, discoKey = "lesco") {
  const units = Math.max(1, Math.round(Number(unitsInput) || 0));
  const currentCalc = calculatePakistanElectricityBill(units, discoKey);
  if (units >= 201 && units <= 215) {
    const unitsOver = units - 200;
    const protectedCalcAt200 = calculatePakistanElectricityBill(200, discoKey, "protected");
    const savings = Math.max(0, currentCalc.totalBill - protectedCalcAt200.totalBill);
    return {
      type: "cliff_critical",
      level: "danger",
      title: "⚠️ Slab Cliff Alert",
      unitsOver,
      threshold: 200,
      currentBill: currentCalc.totalBill,
      targetBill: protectedCalcAt200.totalBill,
      savings,
      message: `You are ${unitsOver} unit${unitsOver > 1 ? "s" : ""} over the 200-unit protected threshold. Reducing just ${unitsOver} unit${unitsOver > 1 ? "s" : ""} drops your bill from ~Rs. ${currentCalc.totalBill.toLocaleString("en-PK")} to ~Rs. ${protectedCalcAt200.totalBill.toLocaleString("en-PK")} (Saving you ~Rs. ${savings.toLocaleString("en-PK")}!).`,
      ctaText: `See How to Cut ${unitsOver <= 10 ? 10 : unitsOver} Units →`,
      badge: "Unprotected Consumer (Cliff Passed)",
      badgeColor: "rose"
    };
  }
  if (units >= 185 && units <= 200) {
    const remainingBuffer = 200 - units;
    return {
      type: "buffer_warning",
      level: "warning",
      title: "⚡ Safe Buffer Alert",
      remainingBuffer,
      threshold: 200,
      currentBill: currentCalc.totalBill,
      message: remainingBuffer === 0 ? "You are at the exact 200-unit boundary. Just 1 additional unit will push your bill into the unprotected bracket, causing a 90%+ bill jump!" : `You have only ${remainingBuffer} unit${remainingBuffer > 1 ? "s" : ""} remaining before losing protected status. Keep usage under 200 units to avoid a 90%+ bill jump.`,
      ctaText: "Keep Your Buffer Safe →",
      badge: "Protected Consumer (Subsidized)",
      badgeColor: "emerald"
    };
  }
  if (units >= 301 && units <= 315) {
    const unitsOver = units - 300;
    const billAt300 = calculatePakistanElectricityBill(300, discoKey).totalBill;
    const savings = Math.max(0, currentCalc.totalBill - billAt300);
    return {
      type: "cliff_tier2",
      level: "warning",
      title: "⚠️ Tier 2 Slab Cliff Alert",
      unitsOver,
      threshold: 300,
      currentBill: currentCalc.totalBill,
      targetBill: billAt300,
      savings,
      message: `You are ${unitsOver} unit${unitsOver > 1 ? "s" : ""} over the 300-unit threshold. Reducing just ${unitsOver} unit${unitsOver > 1 ? "s" : ""} drops you back to the lower slab, saving ~Rs. ${savings.toLocaleString("en-PK")} on higher base tariffs & surcharges.`,
      ctaText: `See How to Cut ${unitsOver <= 10 ? 10 : unitsOver} Units →`,
      badge: "Unprotected Tier 2 (301-700)",
      badgeColor: "amber"
    };
  }
  if (units >= 701 && units <= 715) {
    const unitsOver = units - 700;
    const billAt700 = calculatePakistanElectricityBill(700, discoKey).totalBill;
    const savings = Math.max(0, currentCalc.totalBill - billAt700);
    return {
      type: "cliff_peak",
      level: "danger",
      title: "⚠️ Peak Slab Cliff Alert",
      unitsOver,
      threshold: 700,
      currentBill: currentCalc.totalBill,
      targetBill: billAt700,
      savings,
      message: `You are ${unitsOver} unit${unitsOver > 1 ? "s" : ""} over the 700-unit peak threshold. Reducing ${unitsOver} unit${unitsOver > 1 ? "s" : ""} prevents your bill entering Pakistan's highest peak tariff slab (Rs. 48.84+/unit), saving you ~Rs. ${savings.toLocaleString("en-PK")}!`,
      ctaText: `See How to Cut ${unitsOver <= 10 ? 10 : unitsOver} Units →`,
      badge: "Peak Tariff Tier (>700)",
      badgeColor: "rose"
    };
  }
  if (units < 185) {
    return {
      type: "safe_protected",
      level: "success",
      title: "✅ Protected Safe Zone",
      threshold: 200,
      currentBill: currentCalc.totalBill,
      message: `You are well within the protected category (${200 - units} units buffer below the 200 cutoff). You are enjoying NEPRA's lowest subsidized electricity rates.`,
      ctaText: "View Appliance Usage →",
      badge: "Protected Consumer (Subsidized)",
      badgeColor: "emerald"
    };
  }
  if (units > 215 && units <= 300) {
    const unitsToProtected = units - 200;
    const protectedBillAt200 = calculatePakistanElectricityBill(200, discoKey, "protected").totalBill;
    const potentialSavings = Math.max(0, currentCalc.totalBill - protectedBillAt200);
    return {
      type: "unprotected_tier1",
      level: "info",
      title: "ℹ️ Unprotected Tier 1 (201 - 300 Units)",
      unitsToProtected,
      threshold: 200,
      currentBill: currentCalc.totalBill,
      targetBill: protectedBillAt200,
      savings: potentialSavings,
      message: `You are currently paying unprotected tariffs. Reducing ${unitsToProtected} units down to 200 would save you ~Rs. ${potentialSavings.toLocaleString("en-PK")} per month.`,
      ctaText: "See Appliance Breakdown →",
      badge: "Unprotected Consumer (Cliff Passed)",
      badgeColor: "amber"
    };
  }
  if (units > 315 && units <= 700) {
    return {
      type: "unprotected_tier2",
      level: "info",
      title: "ℹ️ Unprotected Tier 2 (301 - 700 Units)",
      threshold: 700,
      currentBill: currentCalc.totalBill,
      message: "You are in NEPRA's intermediate domestic tier. Keep usage below 700 units to avoid the severe peak tariff jump at 701 units.",
      ctaText: "See Appliance Breakdown →",
      badge: "Unprotected Tier 2 (301-700)",
      badgeColor: "amber"
    };
  }
  return {
    type: "peak_bracket",
    level: "danger",
    title: "⚠️ Peak Residential Tariff",
    threshold: 700,
    currentBill: currentCalc.totalBill,
    message: "Your usage is in Pakistan's highest peak slab (> 700 units) at Rs. 48.84+/unit plus maximum commercial-grade surcharges.",
    ctaText: "See High-Load Appliances →",
    badge: "Peak Tariff Tier (>700)",
    badgeColor: "rose"
  };
}
function getMeterPercentage(units) {
  const u = Math.max(0, Math.min(800, Number(units) || 0));
  if (u <= 50) return u / 50 * 15;
  if (u <= 100) return 15 + (u - 50) / 50 * 15;
  if (u <= 200) return 30 + (u - 100) / 100 * 25;
  if (u <= 300) return 55 + (u - 200) / 100 * 20;
  if (u <= 700) return 75 + (u - 300) / 400 * 17;
  return Math.min(100, 92 + (u - 700) / 100 * 8);
}
function SlabCliffVisualizer({
  units,
  disco = "lesco",
  onScrollToAppliances
}) {
  const cliffData = React.useMemo(() => evaluateSlabCliff(units, disco), [units, disco]);
  const billData = React.useMemo(() => calculatePakistanElectricityBill(units, disco), [units, disco]);
  const meterPercent = getMeterPercentage(units);
  const handleCtaClick = (e) => {
    e.preventDefault();
    if (typeof onScrollToAppliances === "function") {
      onScrollToAppliances();
    } else {
      const el = document.getElementById("appliance-breakdown");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ring-4", "ring-amber-400");
        setTimeout(() => el.classList.remove("ring-4", "ring-amber-400"), 2e3);
      }
    }
  };
  const cardThemes = {
    danger: {
      bg: "bg-rose-50/80",
      border: "border-rose-300",
      glow: "ring-1 ring-rose-300 shadow-rose-100",
      titleText: "text-rose-900",
      bodyText: "text-rose-800",
      ctaBtn: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300"
    },
    warning: {
      bg: "bg-amber-50/80",
      border: "border-amber-300",
      glow: "ring-1 ring-amber-300 shadow-amber-100",
      titleText: "text-amber-950",
      bodyText: "text-amber-900",
      ctaBtn: "bg-[#001a4a] hover:bg-[#012261] text-white shadow-slate-200",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300"
    },
    success: {
      bg: "bg-emerald-50/70",
      border: "border-emerald-300",
      glow: "ring-1 ring-emerald-200",
      titleText: "text-emerald-950",
      bodyText: "text-emerald-900",
      ctaBtn: "bg-emerald-700 hover:bg-emerald-800 text-white",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    info: {
      bg: "bg-sky-50/80",
      border: "border-sky-300",
      glow: "ring-1 ring-sky-200",
      titleText: "text-sky-950",
      bodyText: "text-sky-900",
      ctaBtn: "bg-sky-700 hover:bg-sky-800 text-white",
      badgeClass: "bg-sky-100 text-sky-800 border-sky-300"
    }
  };
  const theme = cardThemes[cliffData.level] || cardThemes.info;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "aria-label": "NEPRA Slab Cliff Visualizer",
      className: "w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-slate-500", children: "NEPRA Tariff Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${theme.badgeClass}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `h-2 w-2 rounded-full ${cliffData.badgeColor === "emerald" ? "bg-emerald-500" : "bg-rose-500"}`
                      }
                    ),
                    cliffData.badge
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600 mt-1", children: [
              "Current Input: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-900 font-semibold", children: [
                units,
                " Units"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2 text-slate-300", children: "|" }),
              "Est. Bill:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-[#001a4a] font-bold", children: [
                "PKR ",
                billData.totalBill.toLocaleString("en-PK")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 font-normal ml-1", children: [
                "(~Rs. ",
                billData.effectiveRatePerUnit,
                "/unit avg)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 block", children: "Critical Cutoff" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5 inline-block", children: "200-Unit Cliff Wall" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-medium text-slate-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-700", children: "Protected Tier (1-200)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-rose-600", children: "⚡ 200 Slab Cliff" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Unprotected Tier (201+)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative h-7 w-full overflow-hidden rounded-xl bg-slate-100 p-1 border border-slate-200",
              role: "progressbar",
              "aria-label": "Units consumed relative to NEPRA slab thresholds",
              "aria-valuenow": units,
              "aria-valuemin": 0,
              "aria-valuemax": 800,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex h-full w-full opacity-70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-emerald-300", style: { width: "15%" }, title: "0-50 Lifeline" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-emerald-400", style: { width: "15%" }, title: "50-100 Protected Tier 1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-teal-400", style: { width: "25%" }, title: "100-200 Protected Tier 2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-amber-400", style: { width: "20%" }, title: "201-300 Unprotected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-orange-400", style: { width: "17%" }, title: "301-700 Upper Tier" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-rose-500", style: { width: "8%" }, title: "700+ Peak Rate" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute top-0 bottom-0 z-10 w-1 bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.8)] animate-pulse",
                    style: { left: "55%" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `absolute top-1 bottom-1 left-1 rounded-lg transition-all duration-300 ease-out ${units <= 200 ? "bg-emerald-600/60" : "bg-slate-900/65"}`,
                    style: { width: `calc(${Math.min(99, meterPercent)}% - 2px)` }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute top-0 bottom-0 z-20 flex -translate-x-1/2 items-center justify-center transition-all duration-300 ease-out",
                    style: { left: `${Math.max(2, Math.min(98, meterPercent))}%` },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-3 rounded-full border-2 border-white bg-slate-900 shadow-md ring-2 ring-slate-900/20" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-6 text-[11px] font-semibold text-slate-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-0 -translate-x-0", children: "0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute", style: { left: "15%", transform: "translateX(-50%)" }, children: "50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute", style: { left: "30%", transform: "translateX(-50%)" }, children: "100" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "absolute text-rose-600 font-extrabold flex flex-col items-center",
                style: { left: "55%", transform: "translateX(-50%)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "200" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute", style: { left: "75%", transform: "translateX(-50%)" }, children: "300" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute", style: { left: "92%", transform: "translateX(-50%)" }, children: "700" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            role: "status",
            "aria-live": "polite",
            className: `rounded-xl border p-4 sm:p-5 shadow-sm transition-all duration-300 ${theme.bg} ${theme.border} ${theme.glow}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `text-base sm:text-lg font-bold ${theme.titleText}`, children: cliffData.title }),
                  cliffData.savings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm", children: [
                    "Save ~Rs. ",
                    cliffData.savings.toLocaleString("en-PK")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm sm:text-base leading-relaxed ${theme.bodyText}`, children: cliffData.message }),
                cliffData.type === "cliff_critical" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-700 font-medium", children: "💡 Tip: Surcharges (FPA, FC Surcharge) and GST apply at full commercial/unprotected rates once 200 units are exceeded." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleCtaClick,
                  className: `inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 shadow ${theme.ctaBtn}`,
                  children: cliffData.ctaText
                }
              ) })
            ] })
          }
        )
      ]
    }
  );
}
SlabCliffVisualizer.propTypes = {
  units: PropTypes.number.isRequired,
  disco: PropTypes.string,
  onScrollToAppliances: PropTypes.func
};
function ApplianceBreakdown({
  appliancesState,
  onChange,
  onCutUnits,
  currentUnits
}) {
  const computedBreakdown = React.useMemo(() => {
    let total = 0;
    const details = APPLIANCE_PRESETS.map((appliance) => {
      const state = appliancesState[appliance.id] || {
        hours: appliance.defaultHours,
        qty: appliance.defaultQty
      };
      const monthlyUnits = calculateApplianceMonthlyUnits(appliance, state.hours, state.qty);
      total += monthlyUnits;
      return {
        ...appliance,
        hours: state.hours,
        qty: state.qty,
        monthlyUnits
      };
    });
    return {
      total: Math.round(total),
      details
    };
  }, [appliancesState]);
  const handleHoursChange = (id, newHours) => {
    const parsed = Math.max(0, Number(newHours) || 0);
    const nextState = {
      ...appliancesState,
      [id]: {
        ...appliancesState[id] || {},
        hours: parsed
      }
    };
    const newTotal = calculateTotalApplianceUnits(nextState);
    onChange(nextState, newTotal);
  };
  const handleQtyChange = (id, newQty, maxQty) => {
    const clamped = Math.max(0, Math.min(maxQty, Number(newQty) || 0));
    const nextState = {
      ...appliancesState,
      [id]: {
        ...appliancesState[id] || {},
        qty: clamped
      }
    };
    const newTotal = calculateTotalApplianceUnits(nextState);
    onChange(nextState, newTotal);
  };
  const handleQuickCut = () => {
    let nextState = { ...appliancesState };
    const ac15 = nextState.inverter_ac_1_5 || { hours: 4, qty: 1 };
    const ac10 = nextState.non_inverter_ac_1_0 || { hours: 0, qty: 1 };
    const pump = nextState.water_pump || { hours: 1, qty: 1 };
    if (ac15.qty > 0 && ac15.hours >= 0.5) {
      nextState.inverter_ac_1_5 = { ...ac15, hours: Math.max(0, ac15.hours - 0.5) };
    } else if (ac10.qty > 0 && ac10.hours >= 0.5) {
      nextState.non_inverter_ac_1_0 = { ...ac10, hours: Math.max(0, ac10.hours - 0.5) };
    } else if (pump.qty > 0 && pump.hours > 0.25) {
      nextState.water_pump = { ...pump, hours: Math.max(0, pump.hours - 0.25) };
    }
    const newTotal = calculateTotalApplianceUnits(nextState);
    onChange(nextState, newTotal);
    if (typeof onCutUnits === "function") {
      onCutUnits();
    }
  };
  const handleResetDefaults = () => {
    const defaults = {};
    APPLIANCE_PRESETS.forEach((preset) => {
      defaults[preset.id] = {
        hours: preset.defaultHours,
        qty: preset.defaultQty
      };
    });
    const newTotal = calculateTotalApplianceUnits(defaults);
    onChange(defaults, newTotal);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "appliance-breakdown",
      "aria-label": "Household Appliance Load Breakdown",
      className: "w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-6 transition-all",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-[#001a4a] flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚡ Appliance Load Breakdown" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5", children: "Real-time Load Sliders" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-slate-600 mt-1", children: "Slide operating hours down to trim units and drop below the protected slab cliff." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleQuickCut,
                className: "inline-flex items-center gap-1 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-2 text-xs font-bold text-amber-900 transition active:scale-95 min-h-[44px]",
                title: "Reduce high-draw load by ~10-15 units to escape slab penalty",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✂️ Quick Cut ~10-15 Units" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleResetDefaults,
                className: "inline-flex items-center rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition active:scale-95 min-h-[44px]",
                children: "Reset"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Monthly Appliance Share Breakdown" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-900 font-bold", children: [
              "Total Appliance Load: ",
              computedBreakdown.total,
              " Units"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200", children: computedBreakdown.details.map((item, idx) => {
            const pct = computedBreakdown.total > 0 ? item.monthlyUnits / computedBreakdown.total * 100 : 0;
            if (pct <= 0) return null;
            const colors = [
              "bg-sky-500",
              "bg-indigo-500",
              "bg-emerald-500",
              "bg-amber-500",
              "bg-teal-400"
            ];
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-full ${colors[idx % colors.length]} transition-all duration-300`,
                style: { width: `${pct}%` },
                title: `${item.name}: ${item.monthlyUnits} units (${Math.round(pct)}%)`
              },
              item.id
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-sky-500" }),
              " 1.5T AC"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-indigo-500" }),
              " 1.0T AC"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }),
              " Fridge / Freezer"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-amber-500" }),
              " Water Pump"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-teal-400" }),
              " Fans & Lights"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: computedBreakdown.details.map((item) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:bg-slate-50 hover:border-slate-300 flex flex-col justify-between space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-slate-900 leading-snug", children: item.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: item.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-extrabold text-[#001a4a] block", children: [
                      item.monthlyUnits,
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500", children: "units" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400", children: "/ month" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-600", children: "Quantity:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "aria-label": `Decrease ${item.name} quantity`,
                          disabled: item.qty <= 0,
                          onClick: () => handleQtyChange(item.id, item.qty - 1, item.maxQty),
                          className: "inline-flex h-11 w-11 items-center justify-center rounded-l-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-base active:bg-slate-200",
                          children: "−"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-9 text-center text-xs font-bold text-slate-900", children: item.qty }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "aria-label": `Increase ${item.name} quantity`,
                          disabled: item.qty >= item.maxQty,
                          onClick: () => handleQtyChange(item.id, item.qty + 1, item.maxQty),
                          className: "inline-flex h-11 w-11 items-center justify-center rounded-r-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-base active:bg-slate-200",
                          children: "+"
                        }
                      )
                    ] })
                  ] }),
                  !item.isDailyFixed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-600", children: "Daily Usage:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#001a4a] bg-white px-2 py-0.5 rounded border border-slate-200", children: [
                        item.hours,
                        " ",
                        item.unitLabel
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center h-11", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "range",
                        min: "0",
                        max: item.maxHours,
                        step: item.stepHours || 1,
                        value: item.hours,
                        disabled: item.qty === 0,
                        "aria-label": `${item.name} daily hours`,
                        "aria-valuemin": "0",
                        "aria-valuemax": item.maxHours,
                        "aria-valuenow": item.hours,
                        onChange: (e) => handleHoursChange(item.id, e.target.value),
                        className: "w-full cursor-pointer appearance-none bg-slate-200 h-2.5 rounded-lg accent-[#001a4a] disabled:opacity-40 disabled:cursor-not-allowed",
                        style: { touchAction: "manipulation" }
                      }
                    ) })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-white/80 border border-slate-200 px-3 py-2 text-xs text-slate-600 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "24-Hour Continuous Cycle" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-emerald-700", children: "~2.5 kWh / day" })
                  ] })
                ] })
              ]
            },
            item.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-900 flex items-center justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "🔄" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Two-way Synced:" }),
            " Sliding any appliance updates your total units (",
            computedBreakdown.total,
            " units) and instantly re-evaluates your NEPRA slab bill and cliff status above."
          ] })
        ] }) })
      ]
    }
  );
}
ApplianceBreakdown.propTypes = {
  appliancesState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCutUnits: PropTypes.func,
  currentUnits: PropTypes.number
};
export {
  APPLIANCE_PRESETS as A,
  DISCO_PRESETS as D,
  SlabCliffVisualizer as S,
  ApplianceBreakdown as a,
  calculatePakistanElectricityBill as b,
  calculateTotalApplianceUnits as c
};

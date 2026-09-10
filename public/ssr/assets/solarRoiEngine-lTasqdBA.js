const SOLAR_SYSTEM_BENCHMARKS = {
  "3kw": {
    key: "3kw",
    kw: 3,
    name: "3 kW System",
    turnkeyEpc: 45e4,
    greenMeterFee: 1e5,
    totalCapex: 55e4,
    monthlyGen: 350,
    // ~116.7 kWh/kW/mo
    recommendedUnitsMin: 1,
    recommendedUnitsMax: 350,
    recommendedBillMax: 18e3,
    requiredAreaSqFt: 210,
    inverterType: "On-Grid String Inverter",
    description: "Ideal for small apartments and basic single-phase households with 1 inverter AC."
  },
  "5kw": {
    key: "5kw",
    kw: 5,
    name: "5 kW System",
    turnkeyEpc: 75e4,
    greenMeterFee: 1e5,
    totalCapex: 85e4,
    // Matches Test Case 1
    monthlyGen: 600,
    // 120 kWh/kW/mo
    recommendedUnitsMin: 351,
    recommendedUnitsMax: 650,
    recommendedBillMax: 38e3,
    requiredAreaSqFt: 350,
    inverterType: "3-Phase / Single-Phase Hybrid Ready",
    description: "Most popular residential size in Pakistan. Powers 1-2 ACs, refrigerator, and lighting."
  },
  "10kw": {
    key: "10kw",
    kw: 10,
    name: "10 kW System",
    turnkeyEpc: 145e4,
    greenMeterFee: 15e4,
    totalCapex: 16e5,
    // Matches Test Case 2
    monthlyGen: 1200,
    // 120 kWh/kW/mo
    recommendedUnitsMin: 651,
    recommendedUnitsMax: 1100,
    recommendedBillMax: 75e3,
    requiredAreaSqFt: 700,
    inverterType: "3-Phase On-Grid / Hybrid Inverter",
    description: "Standard for 1-Kanal / 10-Marla homes with 3-4 ACs, water motor, and continuous daytime load."
  },
  "15kw": {
    key: "15kw",
    kw: 15,
    name: "15 kW System",
    turnkeyEpc: 215e4,
    greenMeterFee: 15e4,
    totalCapex: 23e5,
    monthlyGen: 1800,
    recommendedUnitsMin: 1101,
    recommendedUnitsMax: 1600,
    recommendedBillMax: 115e3,
    requiredAreaSqFt: 1050,
    inverterType: "3-Phase Industrial Grade Inverter",
    description: "For large duplexes, combined joint families, and daytime commercial loads."
  },
  "20kw": {
    key: "20kw",
    kw: 20,
    name: "20 kW System",
    turnkeyEpc: 285e4,
    greenMeterFee: 15e4,
    totalCapex: 3e6,
    monthlyGen: 2400,
    recommendedUnitsMin: 1601,
    recommendedUnitsMax: 5e4,
    recommendedBillMax: 99999999,
    requiredAreaSqFt: 1400,
    inverterType: "3-Phase Dual MPPT Inverter",
    description: "Full energy independence for high-consumption estates and multi-meter residential setups."
  }
};
const BATTERY_BENCHMARKS = {
  none: {
    key: "none",
    name: "On-Grid Only (No Batteries)",
    initialCost: 0,
    usableDod: 0,
    cycleLife: 0,
    expectedYears: 0,
    replacementYears: [],
    effectiveCostPerKwh: 0,
    tenYearTco: 0,
    description: "Maximum financial ROI. Feeds excess power into DISCO green meter under NEPRA Net Billing."
  },
  tubular: {
    key: "tubular",
    name: "Hybrid + Tubular Lead-Acid",
    initialCost: 14e4,
    // 48V bank (4x 200Ah 12V tall tubular)
    usableDod: 0.5,
    // 50% Depth of Discharge
    cycleLife: 912,
    // ~2.5 years @ 1 cycle/day (800-1,200 cycles)
    expectedYears: 2.5,
    replacementYears: [2.5, 5, 7.5],
    // Triggers replacements across 10 years
    hybridInverterAdder: 1e5,
    description: "Low initial Capex but high recurring replacement shocks every 2-3 years in Pakistani heat."
  },
  lifepo4: {
    key: "lifepo4",
    name: "Hybrid + LiFePO4 Lithium (5.12 kWh)",
    initialCost: 4e5,
    // 48V / 51.2V 100Ah (5.12 kWh server rack)
    usableDod: 0.9,
    // 85%-90% usable DoD
    cycleLife: 6e3,
    // 10+ years at 80% residual capacity
    expectedYears: 10,
    replacementYears: [],
    // Zero replacements in 10 years
    hybridInverterAdder: 1e5,
    description: "Higher upfront Capex with zero maintenance, 10-year lifespan, and 40% lower cost per stored kWh."
  }
};
const DEFAULT_NEPRA_BUYBACK_RATE = 11;
const DEFAULT_SELF_CONSUME_RATIO = 60;
function recommendSolarSystemSize(units, bill) {
  const cleanUnits = Number(units);
  const cleanBill = Number(bill);
  if (!Number.isNaN(cleanUnits) && cleanUnits > 0) {
    if (cleanUnits <= 350) return "3kw";
    if (cleanUnits <= 650) return "5kw";
    if (cleanUnits <= 1100) return "10kw";
    if (cleanUnits <= 1600) return "15kw";
    return "20kw";
  }
  if (!Number.isNaN(cleanBill) && cleanBill > 0) {
    if (cleanBill < 18e3) return "3kw";
    if (cleanBill <= 38e3) return "5kw";
    if (cleanBill <= 75e3) return "10kw";
    if (cleanBill <= 115e3) return "15kw";
    return "20kw";
  }
  return "5kw";
}
function estimateUnitsFromBill(bill) {
  const b = Math.max(0, Number(bill) || 0);
  if (b <= 0) return 0;
  if (b < 8e3) return Math.round(b / 25);
  if (b < 2e4) return Math.round(b / 38);
  if (b < 4e4) return Math.round(b / 50);
  if (b < 8e4) return Math.round(b / 60);
  return Math.round(b / 65);
}
function estimateBillFromUnits(units) {
  const u = Math.max(0, Number(units) || 0);
  if (u <= 0) return 0;
  if (u <= 200) return Math.round(u * 22);
  if (u <= 300) return Math.round(u * 38);
  if (u <= 700) return Math.round(u * 52);
  return Math.round(u * 63);
}
function getDefaultAvoidedTariff(units) {
  const u = Math.max(1, Number(units) || 250);
  if (u <= 300) return 38;
  if (u <= 700) return 48;
  return 58;
}
function calculateSolarRoi(options = {}) {
  var _a;
  const sanitized = sanitizeSolarInputs(options);
  const system = SOLAR_SYSTEM_BENCHMARKS[sanitized.systemSizeKey] || SOLAR_SYSTEM_BENCHMARKS["5kw"];
  const monthlyGen = system.monthlyGen;
  const selfConsumeRatio = sanitized.selfConsumeRatio;
  const exportRatio = 100 - selfConsumeRatio;
  const selfConsumedUnits = Math.round(monthlyGen * (selfConsumeRatio / 100) * 10) / 10;
  const exportedUnits = Math.round(monthlyGen * (exportRatio / 100) * 10) / 10;
  const retailTariff = sanitized.retailTariff;
  const buybackRate = sanitized.buybackRate;
  const avoidedCostSavings = selfConsumedUnits * retailTariff;
  const exportRevenue = exportedUnits * buybackRate;
  const monthlySavings = avoidedCostSavings + exportRevenue;
  const annualSavings = monthlySavings * 12;
  const baseSystemCapex = sanitized.capexOverride !== void 0 && sanitized.capexOverride !== null ? Number(sanitized.capexOverride) : system.totalCapex;
  const batteryInfo = calculateBatteryTco(sanitized.dailyStorageKwh, 10, sanitized.batteryType);
  const batteryCapex = sanitized.batteryType !== "none" ? batteryInfo.initialCapex + (((_a = BATTERY_BENCHMARKS[sanitized.batteryType]) == null ? void 0 : _a.hybridInverterAdder) || 0) : 0;
  const totalSystemCapex = baseSystemCapex + batteryCapex;
  const annualReserve = Number(sanitized.annualMaintenanceReserve) || 0;
  const netAnnualSavings = Math.max(1, annualSavings - annualReserve);
  const paybackYears = Math.round(totalSystemCapex / netAnnualSavings * 100) / 100;
  const wholeYears = Math.floor(paybackYears);
  const remainingMonths = Math.round((paybackYears - wholeYears) * 12);
  const lifetimeFactor = 23.44;
  const lifetimeGrossSavings = Math.round(annualSavings * lifetimeFactor);
  const inverterReplacementReserve = Math.round(system.turnkeyEpc * 0.15);
  const lifetimeNetValue = Math.round(
    lifetimeGrossSavings - totalSystemCapex - inverterReplacementReserve - annualReserve * 25
  );
  const lifetimeRoiPercent = totalSystemCapex > 0 ? Math.round(lifetimeNetValue / totalSystemCapex * 100) : 0;
  return {
    systemSizeKey: system.key,
    systemName: system.name,
    systemKw: system.kw,
    turnkeyEpc: system.turnkeyEpc,
    greenMeterFee: system.greenMeterFee,
    baseSystemCapex,
    batteryCapex,
    totalSystemCapex,
    monthlyGen,
    selfConsumeRatio,
    exportRatio,
    selfConsumedUnits,
    exportedUnits,
    retailTariff,
    buybackRate,
    avoidedCostSavings: Math.round(avoidedCostSavings),
    exportRevenue: Math.round(exportRevenue),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    annualReserve,
    netAnnualSavings: Math.round(netAnnualSavings),
    paybackYears,
    wholeYears,
    remainingMonths,
    paybackFormatted: `${wholeYears} yr${wholeYears === 1 ? "" : "s"}${remainingMonths > 0 ? ` ${remainingMonths} mo` : ""}`,
    lifetimeGrossSavings,
    lifetimeNetValue,
    lifetimeRoiPercent,
    batteryInfo
  };
}
function calculateBatteryTco(dailyStorageKwh = 5.12, years = 10, selectedType = "tubular") {
  const kwh = Math.max(1, Number(dailyStorageKwh) || 5.12);
  const totalDays = Math.round(years * 365);
  const totalDeliveredKwh = totalDays * kwh;
  const tubularInitialCapex = 14e4;
  const tubularCycleLife = 912;
  const tubularReplacementYears = [2.5, 5, 7.5];
  const tubularReplacementCostPerEvent = 14e4;
  const tubularTotalReplacementsCount = tubularReplacementYears.length;
  const tubularTotalReplacementCost = tubularTotalReplacementsCount * tubularReplacementCostPerEvent;
  const tubularYearlyMaintenance = 4e3;
  const tubularTotalMaintenance = tubularYearlyMaintenance * years;
  const tubular10YearTco = tubularInitialCapex + tubularTotalReplacementCost + tubularTotalMaintenance;
  const tubularCostPerStoredKwh = Math.round(tubular10YearTco / totalDeliveredKwh * 100) / 100;
  const lifepo4InitialCapex = 4e5;
  const lifepo4CycleLife = 6e3;
  const lifepo4ReplacementYears = [];
  const lifepo4TotalReplacementsCount = 0;
  const lifepo4TotalReplacementCost = 0;
  const lifepo4TotalMaintenance = 0;
  const lifepo410YearTco = lifepo4InitialCapex;
  const lifepo4CostPerStoredKwh = Math.round(lifepo410YearTco / totalDeliveredKwh * 100) / 100;
  const lifepo4ResidualHealthPercent = Math.round((1 - totalDays / lifepo4CycleLife * 0.2) * 1e3) / 10;
  const lifepo4SavingsOverTubular = tubular10YearTco - lifepo410YearTco;
  const lifepo4SavingsPercent = Math.round((tubularCostPerStoredKwh - lifepo4CostPerStoredKwh) / tubularCostPerStoredKwh * 100);
  const activeModel = selectedType === "lifepo4" ? {
    type: "lifepo4",
    name: BATTERY_BENCHMARKS.lifepo4.name,
    initialCapex: lifepo4InitialCapex,
    cycleLife: lifepo4CycleLife,
    replacementYears: lifepo4ReplacementYears,
    replacementsCount: lifepo4TotalReplacementsCount,
    totalReplacementCost: lifepo4TotalReplacementCost,
    totalMaintenance: lifepo4TotalMaintenance,
    tenYearTco: lifepo410YearTco,
    costPerStoredKwh: lifepo4CostPerStoredKwh,
    residualHealthPercent: lifepo4ResidualHealthPercent
  } : selectedType === "tubular" ? {
    type: "tubular",
    name: BATTERY_BENCHMARKS.tubular.name,
    initialCapex: tubularInitialCapex,
    cycleLife: tubularCycleLife,
    replacementYears: tubularReplacementYears,
    replacementsCount: tubularTotalReplacementsCount,
    totalReplacementCost: tubularTotalReplacementCost,
    totalMaintenance: tubularTotalMaintenance,
    tenYearTco: tubular10YearTco,
    costPerStoredKwh: tubularCostPerStoredKwh,
    residualHealthPercent: 0
    // completely depleted at 2.5 year intervals
  } : {
    type: "none",
    name: BATTERY_BENCHMARKS.none.name,
    initialCapex: 0,
    cycleLife: 0,
    replacementYears: [],
    replacementsCount: 0,
    totalReplacementCost: 0,
    totalMaintenance: 0,
    tenYearTco: 0,
    costPerStoredKwh: 0,
    residualHealthPercent: 100
  };
  return {
    dailyStorageKwh: kwh,
    timeframeYears: years,
    totalCycles: totalDays,
    totalDeliveredKwh,
    selectedType,
    ...activeModel,
    comparison: {
      tubular: {
        initialCapex: tubularInitialCapex,
        replacementYears: tubularReplacementYears,
        replacementsCount: tubularTotalReplacementsCount,
        totalReplacementCost: tubularTotalReplacementCost,
        totalMaintenance: tubularTotalMaintenance,
        tenYearTco: tubular10YearTco,
        costPerStoredKwh: tubularCostPerStoredKwh
      },
      lifepo4: {
        initialCapex: lifepo4InitialCapex,
        replacementYears: lifepo4ReplacementYears,
        replacementsCount: lifepo4TotalReplacementsCount,
        totalReplacementCost: lifepo4TotalReplacementCost,
        totalMaintenance: lifepo4TotalMaintenance,
        tenYearTco: lifepo410YearTco,
        costPerStoredKwh: lifepo4CostPerStoredKwh,
        residualHealthPercent: lifepo4ResidualHealthPercent
      },
      lifepo4SavingsOverTubular,
      lifepo4SavingsPercent
    }
  };
}
function sanitizeSolarInputs(inputs = {}) {
  let units = Number(inputs.monthlyUnits);
  let bill = Number(inputs.monthlyBill);
  if (Number.isNaN(units) || units < 0) {
    units = 650;
  }
  if (Number.isNaN(bill) || bill < 0) {
    bill = estimateBillFromUnits(units);
  }
  if (units === 0 && bill === 0) {
    units = 350;
    bill = 18e3;
  } else if (units === 0 && bill > 0) {
    units = estimateUnitsFromBill(bill);
  } else if (bill === 0 && units > 0) {
    bill = estimateBillFromUnits(units);
  }
  units = Math.min(units, 5e4);
  bill = Math.min(bill, 2e7);
  let systemSizeKey = inputs.systemSizeKey;
  if (!systemSizeKey || !SOLAR_SYSTEM_BENCHMARKS[systemSizeKey]) {
    systemSizeKey = recommendSolarSystemSize(units, bill);
  }
  let selfConsumeRatio = Number(inputs.selfConsumeRatio);
  if (Number.isNaN(selfConsumeRatio) || selfConsumeRatio < 0 || selfConsumeRatio > 100) {
    selfConsumeRatio = DEFAULT_SELF_CONSUME_RATIO;
  }
  let retailTariff = Number(inputs.retailTariff);
  if (Number.isNaN(retailTariff) || retailTariff <= 0) {
    retailTariff = getDefaultAvoidedTariff(units);
  }
  let buybackRate = Number(inputs.buybackRate);
  if (Number.isNaN(buybackRate) || buybackRate <= 0) {
    buybackRate = DEFAULT_NEPRA_BUYBACK_RATE;
  }
  let batteryType = inputs.batteryType;
  if (!batteryType || !BATTERY_BENCHMARKS[batteryType]) {
    batteryType = "none";
  }
  let dailyStorageKwh = Number(inputs.dailyStorageKwh);
  if (Number.isNaN(dailyStorageKwh) || dailyStorageKwh <= 0) {
    dailyStorageKwh = 5.12;
  }
  return {
    monthlyUnits: units,
    monthlyBill: bill,
    systemSizeKey,
    selfConsumeRatio,
    retailTariff,
    buybackRate,
    batteryType,
    dailyStorageKwh,
    capexOverride: inputs.capexOverride !== void 0 ? inputs.capexOverride : null,
    annualMaintenanceReserve: inputs.annualMaintenanceReserve || 0
  };
}
export {
  DEFAULT_SELF_CONSUME_RATIO as D,
  SOLAR_SYSTEM_BENCHMARKS as S,
  DEFAULT_NEPRA_BUYBACK_RATE as a,
  calculateBatteryTco as b,
  calculateSolarRoi as c,
  estimateUnitsFromBill as d,
  estimateBillFromUnits as e,
  getDefaultAvoidedTariff as g,
  recommendSolarSystemSize as r
};

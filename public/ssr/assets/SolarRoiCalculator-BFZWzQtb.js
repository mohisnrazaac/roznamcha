import { a as usePage, b as reactExports, j as jsxRuntimeExports, H as Head_default } from "../ssr.js";
import { P as PropTypes } from "./index-h3QfXfrJ.js";
import { T as ToolLayout, S as SaveWall, F as FinancialDisclaimer } from "./FinancialDisclaimer-DWLYvDU9.js";
import { S as SarkariTayariPromoCard } from "./SarkariTayariPromoCard-0LlZm_uy.js";
import { r as recommendSolarSystemSize, S as SOLAR_SYSTEM_BENCHMARKS, D as DEFAULT_SELF_CONSUME_RATIO, g as getDefaultAvoidedTariff, a as DEFAULT_NEPRA_BUYBACK_RATE, c as calculateSolarRoi, b as calculateBatteryTco, e as estimateBillFromUnits, d as estimateUnitsFromBill } from "./solarRoiEngine-lTasqdBA.js";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "assert";
import "tty";
import "zlib";
import "events";
import "process";
import "./PublicLayout-DNNm0DNE.js";
import "./ChatWidget-DFPdtWTT.js";
const faqItems = [
  {
    question: "How does NEPRA Net Billing differ from traditional Net Metering?",
    answer: "Under traditional Net Metering, exported solar units offset imported grid units 1-to-1 at retail slab rates. Under NEPRA's Net Billing (Buyback) framework, self-consumed solar power saves you the full DISCO retail tariff (Rs. 42–58+/unit), while exported excess units are credited at the National Average Energy Purchase Price (~Rs. 11.00/unit). Maximizing daytime self-consumption delivers the highest ROI."
  },
  {
    question: "Why does LiFePO4 battery storage cost less over 10 years than Tubular?",
    answer: "While Tall Tubular lead-acid batteries have a lower upfront cost (Rs. ~140,000 per 48V bank), they degrade rapidly in Pakistani summer temperatures with a cycle life of only 800–1,200 cycles (2–3 years at 50% DoD), requiring 3 to 4 complete bank replacements over 10 years. LiFePO4 lithium batteries last 5,000–6,000 cycles (10+ years at 90% DoD) with zero replacements, resulting in ~35%–40% lower cost per stored kWh."
  },
  {
    question: "How long does the DISCO Green Meter process take in Pakistan?",
    answer: "Typical processing time across LESCO, IESCO, GEPCO, and other DISCOs ranges from 45 to 90 days. The turnkey process includes NEPRA generation license application, distribution transformer load verification, third-party inspection, and bidirectional meter installation."
  },
  {
    question: "Can I run inverter air conditioners during grid load shedding?",
    answer: "Standard On-Grid string inverters shut down immediately during grid outages for lineman safety (anti-islanding). To run air conditioners during load shedding, you need a Hybrid inverter with either Tubular or LiFePO4 battery storage sized to handle compressor inrush currents."
  }
];
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Solar Net Metering & ROI Calculator Pakistan",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  url: "https://roznamcha.pk/tools/solar-net-metering-roi-calculator",
  description: "Calculate turnkey solar system payback, NEPRA buyback earnings, and battery TCO (Tubular vs LiFePO4) under current Pakistan DISCO tariffs."
};
function SolarRoiCalculator({
  defaults = {},
  initialUnits = 650,
  initialBill = 32e3,
  seo: seoProp,
  jsonLd: jsonLdProp
}) {
  var _a;
  const { url } = usePage();
  const queryParams = reactExports.useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      units: params.get("units") ? parseInt(params.get("units"), 10) : null,
      bill: params.get("bill") ? parseInt(params.get("bill"), 10) : null,
      size: params.get("size") || null
    };
  }, []);
  const [monthlyUnits, setMonthlyUnits] = reactExports.useState(
    queryParams.units || defaults.monthlyUnits || initialUnits
  );
  const [monthlyBill, setMonthlyBill] = reactExports.useState(
    queryParams.bill || defaults.monthlyBill || initialBill
  );
  const recommendedKey = reactExports.useMemo(
    () => recommendSolarSystemSize(monthlyUnits, monthlyBill),
    [monthlyUnits, monthlyBill]
  );
  const [selectedSystemKey, setSelectedSystemKey] = reactExports.useState(
    queryParams.size && SOLAR_SYSTEM_BENCHMARKS[queryParams.size] ? queryParams.size : recommendedKey
  );
  const [hasUserOverriddenSize, setHasUserOverriddenSize] = reactExports.useState(Boolean(queryParams.size));
  reactExports.useEffect(() => {
    if (!hasUserOverriddenSize) {
      setSelectedSystemKey(recommendedKey);
    }
  }, [recommendedKey, hasUserOverriddenSize]);
  const [selfConsumeRatio, setSelfConsumeRatio] = reactExports.useState(DEFAULT_SELF_CONSUME_RATIO);
  const [retailTariff, setRetailTariff] = reactExports.useState(() => getDefaultAvoidedTariff(monthlyUnits));
  const [isRetailTariffCustom, setIsRetailTariffCustom] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isRetailTariffCustom) {
      setRetailTariff(getDefaultAvoidedTariff(monthlyUnits));
    }
  }, [monthlyUnits, isRetailTariffCustom]);
  const [buybackRate, setBuybackRate] = reactExports.useState(DEFAULT_NEPRA_BUYBACK_RATE);
  const [batteryType, setBatteryType] = reactExports.useState("none");
  const [dailyStorageKwh, setDailyStorageKwh] = reactExports.useState(5.12);
  const [copiedShare, setCopiedShare] = reactExports.useState(false);
  const roiData = reactExports.useMemo(() => {
    return calculateSolarRoi({
      systemSizeKey: selectedSystemKey,
      monthlyUnits,
      monthlyBill,
      selfConsumeRatio,
      retailTariff,
      buybackRate,
      batteryType,
      dailyStorageKwh
    });
  }, [
    selectedSystemKey,
    monthlyUnits,
    monthlyBill,
    selfConsumeRatio,
    retailTariff,
    buybackRate,
    batteryType,
    dailyStorageKwh
  ]);
  const batteryComparison = reactExports.useMemo(() => {
    return calculateBatteryTco(dailyStorageKwh, 10, batteryType);
  }, [dailyStorageKwh, batteryType]);
  const handleUnitsChange = (e) => {
    const val = Math.max(1, Math.min(5e4, parseInt(e.target.value, 10) || 0));
    setMonthlyUnits(val);
    setMonthlyBill(estimateBillFromUnits(val));
  };
  const handleBillChange = (e) => {
    const val = Math.max(0, parseInt(e.target.value, 10) || 0);
    setMonthlyBill(val);
    setMonthlyUnits(estimateUnitsFromBill(val));
  };
  const handleSelectSize = (key) => {
    setSelectedSystemKey(key);
    setHasUserOverriddenSize(true);
  };
  const whatsappShareText = reactExports.useMemo(() => {
    const urlWithParams = typeof window !== "undefined" ? `${window.location.origin}/tools/solar-net-metering-roi-calculator?units=${monthlyUnits}&bill=${monthlyBill}&size=${selectedSystemKey}` : `https://roznamcha.pk/tools/solar-net-metering-roi-calculator?units=${monthlyUnits}&bill=${monthlyBill}`;
    return `My ${roiData.systemName} Solar Payback is ${roiData.paybackYears} years on Roznamcha.pk! Estimated monthly savings: PKR ${roiData.monthlySavings.toLocaleString("en-PK")}. Check yours: ${urlWithParams}`;
  }, [roiData, monthlyUnits, monthlyBill, selectedSystemKey]);
  const handleWhatsAppShare = () => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`;
    window.open(shareUrl, "_blank");
  };
  const handleCopySummary = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(whatsappShareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2e3);
    }
  };
  const currentSystem = SOLAR_SYSTEM_BENCHMARKS[selectedSystemKey] || SOLAR_SYSTEM_BENCHMARKS["5kw"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ToolLayout,
    {
      title: "Solar Net Metering & Financial ROI Calculator Pakistan",
      description: "Calculate turnkey solar payback, NEPRA buyback earnings, and battery TCO (Tubular vs LiFePO4) under real-world Pakistan DISCO tariffs.",
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Solar ROI Calculator", href: "/tools/solar-net-metering-roi-calculator" }
      ],
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Head_default, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Solar Net Metering & ROI Calculator Pakistan | Roznamcha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "meta",
            {
              name: "description",
              content: "Calculate residential turnkey solar system payback, NEPRA buyback earnings, and 10-year battery degradation (Tubular vs LiFePO4) in Pakistan."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("script", { type: "application/ld+json", children: JSON.stringify(webAppJsonLd) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("script", { type: "application/ld+json", children: JSON.stringify(faqJsonLd) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-8 pb-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-center max-w-3xl mx-auto pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 text-xs font-bold text-amber-900", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "☀️ NEPRA Net Billing & Payback Engine" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "2026 Turnkey EPC Benchmarks" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#001a4a]", children: "Solar Net Metering & Financial ROI Engine" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-slate-600 leading-relaxed", children: "Model exact financial breakeven periods under NEPRA's Net Billing framework, compare avoided retail tariffs against national export buyback rates, and analyze 10-year battery degradation." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-[#001a4a]", children: "Step 1: Consumption Load & System Sizing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Enter your monthly bill or units to auto-recommend the optimal residential capacity." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-extrabold text-emerald-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚡ Recommended for your load:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-lg bg-emerald-600 px-2 py-0.5 text-white uppercase tracking-wider font-black", children: (_a = SOLAR_SYSTEM_BENCHMARKS[recommendedKey]) == null ? void 0 : _a.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-2xl bg-slate-50 p-5 border border-slate-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "solar-units-input", className: "text-sm font-bold text-slate-700", children: "Monthly Units Consumed (kWh)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-500", children: [
                    monthlyUnits,
                    " units / month"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "solar-units-slider",
                    type: "range",
                    min: "100",
                    max: "2500",
                    step: "25",
                    value: monthlyUnits,
                    onChange: handleUnitsChange,
                    className: "w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "solar-units-input",
                      type: "number",
                      min: "1",
                      max: "50000",
                      value: monthlyUnits,
                      onChange: handleUnitsChange,
                      className: "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xl font-bold text-[#001a4a] focus:border-amber-500 focus:ring-amber-500"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400", children: "kWh / mo" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-2xl bg-slate-50 p-5 border border-slate-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "solar-bill-input", className: "text-sm font-bold text-slate-700", children: "Average Monthly Bill (PKR)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-500", children: [
                    "PKR ",
                    monthlyBill.toLocaleString("en-PK")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "solar-bill-slider",
                    type: "range",
                    min: "5000",
                    max: "150000",
                    step: "1000",
                    value: monthlyBill,
                    onChange: handleBillChange,
                    className: "w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "solar-bill-input",
                      type: "number",
                      min: "0",
                      max: "5000000",
                      value: monthlyBill,
                      onChange: handleBillChange,
                      className: "w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xl font-bold text-[#001a4a] focus:border-amber-500 focus:ring-amber-500"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400", children: "PKR" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-slate-500 block", children: "Explore Turnkey Capacity:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", children: Object.entries(SOLAR_SYSTEM_BENCHMARKS).map(([key, item]) => {
                const isSelected = selectedSystemKey === key;
                const isRec = recommendedKey === key;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSelectSize(key),
                    className: `relative flex flex-col items-start rounded-2xl p-4 text-left transition-all duration-150 border-2 ${isSelected ? "border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/30" : "border-slate-200 bg-white hover:border-slate-300"}`,
                    children: [
                      isRec && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-2.5 right-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm", children: "RECOMMENDED" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-extrabold text-[#001a4a]", children: item.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-slate-500 mt-0.5", children: [
                        "Outputs ~",
                        item.monthlyGen,
                        " units/mo"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-amber-700 mt-2", children: [
                        "PKR ",
                        (item.totalCapex / 1e5).toFixed(1),
                        " Lakhs EPC"
                      ] })
                    ]
                  },
                  key
                );
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border-2 border-[#001a4a] bg-gradient-to-br from-[#001a4a] via-[#02286b] to-[#011638] p-6 sm:p-8 text-white shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-amber-300 block", children: "Real-World Financial Return" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl sm:text-3xl font-black text-white mt-1", children: [
                  roiData.systemName,
                  " Payback & Savings Summary"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleWhatsAppShare,
                    className: "inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow transition active:scale-95",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📲 Share on WhatsApp" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleCopySummary,
                    className: "inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2.5 text-xs font-bold text-slate-200 transition",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: copiedShare ? "✓ Copied" : "Copy" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/5 backdrop-blur-md p-5 border border-white/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-blue-200 block", children: "Upfront Investment (Capex)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl sm:text-3xl font-black text-white block mt-1", children: [
                  "PKR ",
                  roiData.totalSystemCapex.toLocaleString("en-PK")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-1 text-[11px] text-blue-300", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "EPC: ",
                    (currentSystem.turnkeyEpc / 1e5).toFixed(1),
                    "L"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Meter: ",
                    (currentSystem.greenMeterFee / 1e3).toFixed(0),
                    "k"
                  ] }),
                  roiData.batteryCapex > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Bat: ",
                      (roiData.batteryCapex / 1e5).toFixed(1),
                      "L"
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/5 backdrop-blur-md p-5 border border-white/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-emerald-300 block", children: "Monthly Bill Reduction" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl sm:text-3xl font-black text-emerald-300 block mt-1", children: [
                  "PKR ",
                  roiData.monthlySavings.toLocaleString("en-PK")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-2 text-[11px] text-emerald-200/80 block", children: [
                  "Avoided: Rs. ",
                  roiData.avoidedCostSavings.toLocaleString("en-PK"),
                  " | Export: Rs. ",
                  roiData.exportRevenue.toLocaleString("en-PK")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-amber-500/20 backdrop-blur-md p-5 border border-amber-400/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-amber-300 block", children: "Estimated Payback Period" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl sm:text-3xl font-black text-amber-300 block mt-1", children: roiData.paybackFormatted }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-2 text-[11px] text-amber-200/90 block font-semibold", children: [
                  roiData.paybackYears,
                  " Years to Full Breakeven"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/5 backdrop-blur-md p-5 border border-white/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-blue-200 block", children: "25-Year Free Energy Value" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl sm:text-3xl font-black text-cyan-300 block mt-1", children: [
                  "PKR ",
                  (roiData.lifetimeGrossSavings / 1e5).toFixed(1),
                  " Lakhs"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-2 text-[11px] text-cyan-200/80 block", children: [
                  "Net Value: PKR ",
                  (roiData.lifetimeNetValue / 1e5).toFixed(1),
                  " Lakhs (",
                  roiData.lifetimeRoiPercent,
                  "% ROI)"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-[#001a4a]", children: "Self-Consumption vs. Grid Export Ratio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700", children: [
                  selfConsumeRatio,
                  "% Self / ",
                  100 - selfConsumeRatio,
                  "% Export"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 leading-relaxed", children: "Under NEPRA Net Billing, self-consumed solar energy directly offsets expensive DISCO retail tariffs, while exported energy is credited at the national buyback rate." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: "20",
                    max: "90",
                    step: "5",
                    value: selfConsumeRatio,
                    onChange: (e) => setSelfConsumeRatio(parseInt(e.target.value, 10)),
                    className: "w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] font-semibold text-slate-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "20% (Vacant / Low Daytime Load)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Default (60%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "90% (Daytime Commercial / ACs)" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-amber-50 border border-amber-200 p-3.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-amber-900 block", children: "☀️ Self-Consumed (Daytime Load)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-black text-amber-800 block mt-1", children: [
                    roiData.selfConsumedUnits,
                    " kWh / mo"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-amber-700 block mt-0.5", children: [
                    "Saves: Rs. ",
                    roiData.avoidedCostSavings.toLocaleString("en-PK"),
                    " @ Rs. ",
                    retailTariff,
                    "/kWh"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-sky-50 border border-sky-200 p-3.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-sky-900 block", children: "⚡ Exported to DISCO (Green Meter)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-black text-sky-800 block mt-1", children: [
                    roiData.exportedUnits,
                    " kWh / mo"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-sky-700 block mt-0.5", children: [
                    "Credits: Rs. ",
                    roiData.exportRevenue.toLocaleString("en-PK"),
                    " @ Rs. ",
                    buybackRate,
                    "/kWh"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-[#001a4a]", children: "Tariff Differential (Net Billing Parameters)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Adjust avoided retail import cost and NEPRA buyback export rates to match your utility profile." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "retail-tariff-input", className: "text-xs font-bold text-slate-700", children: "Avoided Retail Tariff (PKR/kWh)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 font-medium", children: "(DISCO Retail + Taxes)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "retail-tariff-input",
                        type: "number",
                        step: "0.5",
                        min: "20",
                        max: "100",
                        value: retailTariff,
                        onChange: (e) => {
                          setRetailTariff(parseFloat(e.target.value) || 0);
                          setIsRetailTariffCustom(true);
                        },
                        className: "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base font-bold text-slate-900 focus:border-amber-500 focus:ring-amber-500"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400", children: "Rs. / unit" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500 block", children: "Auto-calibrated based on slab consumption." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "buyback-rate-input", className: "text-xs font-bold text-slate-700", children: "NEPRA Buyback Rate (PKR/kWh)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] text-amber-700 font-semibold cursor-help",
                        title: "National Average Energy Purchase Price (EPP) calibrated under NEPRA SRO Net Billing framework",
                        children: "ℹ️ NEPRA SRO"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "buyback-rate-input",
                        type: "number",
                        step: "0.25",
                        min: "5",
                        max: "30",
                        value: buybackRate,
                        onChange: (e) => setBuybackRate(parseFloat(e.target.value) || 0),
                        className: "w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base font-bold text-slate-900 focus:border-amber-500 focus:ring-amber-500"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400", children: "Rs. / unit" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500 block", children: "National Average EPP buyback (~Rs. 11/unit)." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-600", children: "Turnkey Inverter & Panel Area" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-slate-800", children: [
                  "~",
                  currentSystem.requiredAreaSqFt,
                  " sq. ft. rooftop space"
                ] })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-indigo-100 text-indigo-900 px-2.5 py-0.5 text-xs font-bold", children: "Module C" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Battery Storage & Degradation Selector (Tubular vs. LiFePO4)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Analyze backup storage options, replacement shock timelines, and 10-year Total Cost of Ownership." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-2xl", children: ["none", "tubular", "lifepo4"].map((bType) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setBatteryType(bType),
                  className: `rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all ${batteryType === bType ? "bg-white text-[#001a4a] shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
                  children: [
                    bType === "none" && "On-Grid Only",
                    bType === "tubular" && "Hybrid + Tubular",
                    bType === "lifepo4" && "Hybrid + LiFePO4"
                  ]
                },
                bType
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `rounded-2xl p-5 border-2 transition-all ${batteryType === "tubular" ? "border-amber-400 bg-amber-50/50 shadow-md" : "border-slate-200 bg-slate-50/60"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-slate-800", children: "Tall Tubular Lead-Acid (48V Bank)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-bold", children: "50% DoD Max" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2 text-xs text-slate-600", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Initial 48V Bank Cost:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-900", children: "PKR 140,000" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cycle Life (1 cycle/day):" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-900", children: "~912 cycles (~2.5 Years)" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10-Year Replacement Schedule:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-rose-600", children: "Years 2.5, 5.0, 7.5 (3 Replacements)" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Replacement Capex:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-900", children: [
                          "PKR ",
                          batteryComparison.comparison.tubular.totalReplacementCost.toLocaleString("en-PK")
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10-Year TCO (incl. water/maintenance):" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-base font-black text-rose-700", children: [
                          "PKR ",
                          batteryComparison.comparison.tubular.tenYearTco.toLocaleString("en-PK")
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 pt-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Effective Cost per Stored kWh:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-sm font-bold text-slate-900", children: [
                          "Rs. ",
                          batteryComparison.comparison.tubular.costPerStoredKwh,
                          " / kWh"
                        ] })
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `rounded-2xl p-5 border-2 transition-all ${batteryType === "lifepo4" ? "border-emerald-500 bg-emerald-50/50 shadow-md" : "border-slate-200 bg-slate-50/60"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-[#001a4a]", children: "LiFePO4 Lithium (5.12 kWh Rack)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-bold", children: "90% Usable DoD" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2 text-xs text-slate-600", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Initial 5.12 kWh Rack Cost:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-900", children: "PKR 400,000" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cycle Life (1 cycle/day):" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-emerald-700 font-bold", children: "5,000–6,000 cycles (10+ Years)" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10-Year Replacement Schedule:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-emerald-700", children: "Zero Mid-Term Replacements" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cycle Health after 3,650 Cycles:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-emerald-700 font-bold", children: [
                          batteryComparison.comparison.lifepo4.residualHealthPercent,
                          "% Residual Health (>75%)"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 border-b border-slate-200/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10-Year Total TCO:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-base font-black text-emerald-700", children: [
                          "PKR ",
                          batteryComparison.comparison.lifepo4.tenYearTco.toLocaleString("en-PK")
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1 pt-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Effective Cost per Stored kWh:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-sm font-bold text-emerald-800 block", children: [
                            "Rs. ",
                            batteryComparison.comparison.lifepo4.costPerStoredKwh,
                            " / kWh"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-600 font-bold", children: [
                            "(",
                            batteryComparison.comparison.lifepo4SavingsPercent,
                            "% cheaper over 10 years)"
                          ] })
                        ] })
                      ] })
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Frequently Asked Questions (Solar Net Billing in Pakistan)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Essential facts about NEPRA SRO buyback rules, DISCO meter applications, and inverter warranties." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: faqItems.map((faq, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "details",
              {
                className: "group rounded-2xl border border-slate-200 bg-slate-50/50 p-4 open:bg-white open:border-amber-300 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "flex items-center justify-between cursor-pointer font-bold text-slate-800 group-open:text-[#001a4a] text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: faq.question }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 group-open:rotate-180 transition-transform font-black", children: "▼" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3", children: faq.answer })
                ]
              },
              idx
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SaveWall, { toolKey: "solar_roi_calculator", currentResults: roiData }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SarkariTayariPromoCard, { currentContext: "solar-net-metering" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialDisclaimer, {})
        ] })
      ]
    }
  );
}
SolarRoiCalculator.propTypes = {
  defaults: PropTypes.object,
  initialUnits: PropTypes.number,
  initialBill: PropTypes.number,
  seo: PropTypes.object,
  jsonLd: PropTypes.object
};
export {
  SolarRoiCalculator as default
};

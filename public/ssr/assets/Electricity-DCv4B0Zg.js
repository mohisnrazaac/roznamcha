import { b as reactExports, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { S as SeoLandingPage } from "./SeoLandingPage-D6RmTRz6.js";
import { P as PropTypes } from "./index-h3QfXfrJ.js";
import { A as APPLIANCE_PRESETS, c as calculateTotalApplianceUnits, b as calculatePakistanElectricityBill, D as DISCO_PRESETS, S as SlabCliffVisualizer, a as ApplianceBreakdown } from "./ApplianceBreakdown-C-9vVLt_.js";
import { c as calculateSolarRoi, S as SOLAR_SYSTEM_BENCHMARKS, r as recommendSolarSystemSize } from "./solarRoiEngine-lTasqdBA.js";
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
import "./SeoHead-Dkivr5Te.js";
import "./SarkariTayariPromoCard-0LlZm_uy.js";
function SolarTeaserCard({ units = 650, bill = 32e3 }) {
  const cleanUnits = Math.max(1, Number(units) || 250);
  const cleanBill = Math.max(0, Number(bill) || 0);
  const sizing = reactExports.useMemo(() => {
    const key = recommendSolarSystemSize(cleanUnits, cleanBill);
    const system = SOLAR_SYSTEM_BENCHMARKS[key] || SOLAR_SYSTEM_BENCHMARKS["5kw"];
    const roi = calculateSolarRoi({
      systemSizeKey: key,
      monthlyUnits: cleanUnits,
      monthlyBill: cleanBill
    });
    return { system, roi };
  }, [cleanUnits, cleanBill]);
  const destinationUrl = `/tools/solar-net-metering-roi-calculator?units=${cleanUnits}&bill=${cleanBill}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-yellow-300/20 blur-2xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-amber-700/30 blur-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 max-w-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-black uppercase tracking-wider text-yellow-100 border border-white/20", children: "☀️ Solar Net Billing Bridge" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center rounded-full bg-emerald-900/40 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30", children: [
            "⚡ Recommended: ",
            sizing.system.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl sm:text-2xl font-black tracking-tight text-white", children: "High DISCO Bill? Slash it by up to 90% with Solar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-amber-100/90 leading-relaxed", children: [
            "Under NEPRA's Net Billing framework, a ",
            sizing.system.name,
            " produces ~",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-white", children: [
              sizing.system.monthlyGen,
              " units/month"
            ] }),
            ", offsetting peak slab tariffs and exporting excess energy at national buyback rates."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-black/20 backdrop-blur-sm p-3 border border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-amber-200 block", children: "Est. Monthly Savings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg sm:text-xl font-black text-white block mt-0.5", children: [
              "PKR ",
              sizing.roi.monthlySavings.toLocaleString("en-PK")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-black/20 backdrop-blur-sm p-3 border border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-amber-200 block", children: "Est. Payback" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg sm:text-xl font-black text-white block mt-0.5", children: [
              "~",
              sizing.roi.paybackFormatted
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 sm:col-span-1 rounded-2xl bg-black/20 backdrop-blur-sm p-3 border border-white/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-amber-200 block", children: "25-Yr Free Energy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg sm:text-xl font-black text-emerald-200 block mt-0.5", children: [
              "PKR ",
              (sizing.roi.lifetimeGrossSavings / 1e5).toFixed(1),
              " Lakhs"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link_default,
          {
            href: destinationUrl,
            className: "group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-extrabold text-orange-600 shadow-lg transition-all duration-200 hover:bg-yellow-50 hover:shadow-xl active:scale-[0.98]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Calculate Solar ROI & Payback" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transition-transform group-hover:translate-x-1 font-black", children: "→" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-center text-xs font-medium text-amber-100/80", children: [
          "Pre-filled with your current ",
          cleanUnits,
          " units load"
        ] })
      ] })
    ] })
  ] });
}
SolarTeaserCard.propTypes = {
  units: PropTypes.number,
  bill: PropTypes.number
};
function ElectricityCalculatorSuite({
  initialUnits = 204,
  // Default to cliff demo to hook retention immediately
  initialDisco = "lesco",
  showDiscoSelector = true,
  onUnitsChangeExternal
}) {
  var _a;
  const [selectedDisco, setSelectedDisco] = reactExports.useState(initialDisco);
  const defaultAppliances = reactExports.useMemo(() => {
    const state = {};
    APPLIANCE_PRESETS.forEach((preset) => {
      state[preset.id] = {
        hours: preset.defaultHours,
        qty: preset.defaultQty
      };
    });
    return state;
  }, []);
  const [appliancesState, setAppliancesState] = reactExports.useState(defaultAppliances);
  const [units, setUnits] = reactExports.useState(initialUnits);
  reactExports.useMemo(
    () => calculateTotalApplianceUnits(appliancesState),
    [appliancesState]
  );
  const billData = reactExports.useMemo(
    () => calculatePakistanElectricityBill(units, selectedDisco),
    [units, selectedDisco]
  );
  reactExports.useRef(null);
  const handleManualUnitsChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setUnits("");
      return;
    }
    const num = Math.max(1, Math.min(5e3, parseInt(val, 10) || 0));
    setUnits(num);
    if (typeof onUnitsChangeExternal === "function") {
      onUnitsChangeExternal(num);
    }
  };
  const handleAppliancesChange = (newState, newTotal) => {
    setAppliancesState(newState);
    setUnits(newTotal);
    if (typeof onUnitsChangeExternal === "function") {
      onUnitsChangeExternal(newTotal);
    }
  };
  const scrollToAppliances = () => {
    const el = document.getElementById("appliance-breakdown");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-4", "ring-amber-400");
      setTimeout(() => {
        el.classList.remove("ring-4", "ring-amber-400");
      }, 1800);
    }
  };
  const currentUnitsNumber = Number(units) || 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "units-consumed-input", className: "text-sm font-bold text-[#001a4a]", children: "Units Consumed (kWh)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-semibold px-2.5 py-0.5 rounded-full ${currentUnitsNumber <= 200 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`,
                children: currentUnitsNumber <= 200 ? "🟢 Protected Status" : "🔴 Unprotected (Over 200)"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "units-consumed-input",
                type: "number",
                min: "1",
                max: "5000",
                value: units,
                onChange: handleManualUnitsChange,
                className: "w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-2xl font-extrabold text-[#001a4a] shadow-inner focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/20",
                placeholder: "e.g. 204"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase", children: "Units / Month" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 pt-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-medium", children: "Quick Test:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setUnits(194);
                  if (onUnitsChangeExternal) onUnitsChangeExternal(194);
                },
                className: "rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-1 font-semibold transition border border-emerald-200",
                children: "⚡ 194 (Safe Buffer)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setUnits(204);
                  if (onUnitsChangeExternal) onUnitsChangeExternal(204);
                },
                className: "rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 px-2 py-1 font-semibold transition border border-rose-200",
                children: "⚠️ 204 (Cliff Overhang)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setUnits(304);
                  if (onUnitsChangeExternal) onUnitsChangeExternal(304);
                },
                className: "rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-1 font-semibold transition border border-amber-200",
                children: "304 (Tier 2 Jump)"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6", children: [
          showDiscoSelector ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 min-w-[140px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "disco-select", className: "text-xs font-bold uppercase tracking-wider text-slate-500 block", children: "Distribution Company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "disco-select",
                value: selectedDisco,
                onChange: (e) => setSelectedDisco(e.target.value),
                className: "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-[#001a4a] focus:border-[#001a4a] focus:outline-none",
                children: Object.entries(DISCO_PRESETS).map(([key, item]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: key, children: [
                  item.name,
                  " (",
                  item.region.split("&")[0].trim(),
                  ")"
                ] }, key))
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[120px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-slate-500 block", children: "DISCO" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-[#001a4a]", children: ((_a = DISCO_PRESETS[selectedDisco]) == null ? void 0 : _a.name) || selectedDisco.toUpperCase() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-[#001a4a] to-[#012f85] p-4 text-white shadow-md min-w-[180px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase font-medium tracking-wider text-blue-200 block", children: "Estimated Total Bill" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-black block mt-0.5", children: [
              "PKR ",
              billData.totalBill.toLocaleString("en-PK")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-blue-200/80 block mt-0.5", children: "Incl. Surcharges & Taxes" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-slate-50 p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 block", children: "Base Energy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-slate-900 text-sm", children: [
            "PKR ",
            billData.baseEnergyCost.toLocaleString("en-PK")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-slate-50 p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 block", children: "FPA + FC Surcharge" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-slate-900 text-sm", children: [
            "PKR ",
            (billData.fcSurcharge + billData.fpa).toLocaleString("en-PK")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-slate-50 p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 block", children: "GST / Sales Tax" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold text-sm ${billData.gst === 0 ? "text-emerald-700" : "text-slate-900"}`, children: billData.gst === 0 ? "0% (Exempt)" : `PKR ${billData.gst.toLocaleString("en-PK")}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-slate-50 p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 block", children: "Effective Unit Rate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#001a4a] text-sm", children: [
            "Rs. ",
            billData.effectiveRatePerUnit,
            " / unit"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SlabCliffVisualizer,
      {
        units: currentUnitsNumber,
        disco: selectedDisco,
        onScrollToAppliances: scrollToAppliances
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SolarTeaserCard,
      {
        units: currentUnitsNumber,
        bill: billData.totalBill
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApplianceBreakdown,
      {
        appliancesState,
        onChange: handleAppliancesChange,
        onCutUnits: scrollToAppliances,
        currentUnits: currentUnitsNumber
      }
    )
  ] });
}
ElectricityCalculatorSuite.propTypes = {
  initialUnits: PropTypes.number,
  initialDisco: PropTypes.string,
  showDiscoSelector: PropTypes.bool,
  onUnitsChangeExternal: PropTypes.func
};
function Electricity(props) {
  const discoKey = (props.pageKey || "lesco").toLowerCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SeoLandingPage,
    {
      ...props,
      theme: {
        badgeClass: "bg-sky-100 text-sky-900 border-sky-200",
        heroClass: "from-white via-sky-50 to-cyan-100",
        accentClass: "text-sky-700",
        panelClass: "bg-white border-slate-200"
      },
      interactiveWidget: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ElectricityCalculatorSuite,
        {
          initialDisco: discoKey,
          initialUnits: 204,
          showDiscoSelector: true
        }
      )
    }
  );
}
export {
  Electricity as default
};

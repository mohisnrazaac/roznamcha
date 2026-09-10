import { b as reactExports, j as jsxRuntimeExports } from "../ssr.js";
import { S as SeoLandingPage } from "./SeoLandingPage-C_r3Vmdq.js";
import { P as PropTypes } from "./index-h3QfXfrJ.js";
import { A as APPLIANCE_PRESETS, c as calculateTotalApplianceUnits, b as calculatePakistanElectricityBill, D as DISCO_PRESETS, S as SlabCliffVisualizer, a as ApplianceBreakdown } from "./ApplianceBreakdown-C-9vVLt_.js";
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
import "./PublicLayout-Bdvybhnl.js";
import "./ChatWidget-DFPdtWTT.js";
import "./SeoHead-Dkivr5Te.js";
import "./SarkariTayariPromoCard-0LlZm_uy.js";
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

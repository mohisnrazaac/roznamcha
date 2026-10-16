import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-8f9iGZFn.js";
import { S as SeoHead } from "./SeoHead-BNXvUeLt.js";
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
import "./ChatWidget-DFPdtWTT.js";
function MethodologySources({ seo, jsonLd, contactEmail = "support@roznamcha.pk" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-[#001a4a]/70", children: "Mathematical Models & Baselines" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-extrabold text-[#001a4a]", children: "Methodology & Data Baseline Sources" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-slate-700 leading-relaxed", children: "Every tool and calculation engine on Roznamcha is built upon open, empirical formulas and officially recognized Pakistani economic baselines. This document details the mathematical logic, regulatory sources, and empirical assumptions powering our calculators." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "space-y-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "1. Electricity Bill Estimator & Slab Logic" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 leading-relaxed", children: "Residential electricity billing in Pakistan is structured under progressive tariff schedules administered by the National Electric Power Regulatory Authority (NEPRA). Our model reflects the exact tiered billing algorithm:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pl-4 border-l-2 border-[#001a4a]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900", children: "Progressive Slab Calculation Formula:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono bg-slate-50 p-3 rounded-lg text-slate-800", children: "Base Slab Cost = Σ [ min(Remaining Units, Slab Bracket Size) × Slab Per-Unit Rate ]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900", children: "Total Payable Bill Formula:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono bg-slate-50 p-3 rounded-lg text-slate-800", children: "Total Bill = (Base Slab Cost) + (Units × FPA Rate) + Financing Surcharge + Electricity Duty + GST (17%) + Fixed Meter Charges + TV Fee (Rs. 35)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-700 leading-relaxed text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Regulatory Sources:" }),
            " NEPRA Federal Tariff Notifications (SROs) for DISCOs (LESCO, K-Electric, IESCO, FESCO, MEPCO, GEPCO, PESCO, HESCO, SEPCO, QESCO). Our system explicitly distinguishes between ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Protected Consumers" }),
            " (under 200 kWh/month for 6 consecutive months) and ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Unprotected Consumers" }),
            ", dynamically simulating the financial cliff that occurs upon crossing unit thresholds."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "2. Kitchen Ration & Grocery Price Baselines" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 leading-relaxed", children: "Food budgeting requires isolating non-perishable staple carbohydrates and cooking fats from perishable daily items. The Ration Cost Estimator focuses exclusively on core non-perishable kitchen drivers:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm text-slate-700 border-collapse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-200 bg-slate-50 text-[#001a4a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3 font-semibold", children: "Commodity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3 font-semibold", children: "Standard Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3 font-semibold", children: "Primary Baseline Source" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3 font-semibold", children: "Review Cadence" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-medium", children: "Wheat Flour (Atta)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "20 kg bag / 10 kg bag" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "PBS Weekly SPI / Wholesale Grain Mandi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Monthly" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-medium", children: "Cooking Oil / Ghee" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "1 Litre / 5 Litre pouch" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Utility Stores Subsidy + Open Retail" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Monthly" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-medium", children: "Basmati & IRRI Rice" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Kilogram (kg)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Punjab & Sindh Mandi Rate Lists" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Monthly" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-medium", children: "Refined White Sugar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Kilogram (kg)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Ex-Mill & Retail Benchmark Reports" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Monthly" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-medium", children: "Pulses (Daal Da Chana, Moong, Masoor)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Kilogram (kg)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Importers Association & Wholesale Indices" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: "Monthly" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-700 leading-relaxed text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Why Fresh Produce is Separated:" }),
            " Perishables (tomatoes, onions, fresh milk, beef, and chicken) experience localized volatility of up to 40% in a single week based on fuel freight adjustments and seasonal monsoon cycles. Households should calculate dry staples first to anchor their non-negotiable kitchen baseline, then assign a distinct flexible line item for weekly bazaar shopping."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "3. Monthly Household Budgeting & Surplus/Deficit Metrics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 leading-relaxed", children: "Our Monthly Household Budget Calculator categorizes spending across 6 localized expenditure vectors: Rent, Ration, Utilities, Education, Transport, and Miscellaneous/Medical." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pl-4 border-l-2 border-[#001a4a]/20 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Net Surplus / Deficit:" }),
              " Monthly Take-Home Income − Total Categorized Expenses."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Savings Rate Percentage:" }),
              " (Surplus / Monthly Income) × 100."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Healthy Budget Thresholds:" }),
              " In urban Pakistan, a savings rate ≥15% represents strong resilience against unexpected shocks. A savings rate between 5%–14% indicates a compressed budget vulnerable to mid-month emergencies. A rate <0% represents an active deficit that compounds debt."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "4. Solar Net Metering ROI & 10-Year Battery TCO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 leading-relaxed", children: "Solar financial modeling operates under NEPRA’s Net Billing framework, distinguishing between daytime self-consumption and exported grid energy:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pl-4 border-l-2 border-[#001a4a]/20 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Avoided Grid Cost:" }),
              " Self-Consumed Solar Units × Avoided Retail Grid Slab Tariff (Rs. 42 to 71+/kWh)."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Export Credit Revenue:" }),
              " Exported Units × National Average Buyback Rate (~Rs. 11.00/kWh)."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Simple Payback Period (Years):" }),
              " Total Turnkey Installation Cost (CAPEX) / Annualized Total Net Financial Savings."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "10-Year Battery TCO Comparison:" }),
              " Tall Tubular lead-acid batteries (50% max Depth of Discharge, 900 cycles, 2.5-year replacement interval) incur 3 full bank replacements over a 10-year span. Lithium Iron Phosphate (LiFePO4) storage (90% usable DoD, 5,000–6,000 cycles, 10+ year lifespan) eliminates mid-term replacements, delivering an effective 35%–40% lower cost per stored kilowatt-hour."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "5. School Fees Planner & Annual Amortization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 leading-relaxed", children: "Education budgeting fails when families treat monthly school vouchers as their total cost, ignoring annual admission fees, activity charges, and examination registration deadlines." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pl-4 border-l-2 border-[#001a4a]/20 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Real Monthly Cost Formula:" }),
              " (Children Count × Monthly Tuition) + [(Annual Charges + Exam Fee × Exam Frequency) / 12]."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Inflation Planning Margin:" }),
              " Real Monthly Cost × (1 + Inflation Buffer % / 100). Private schools in Pakistan escalate tuition by an average of 10% to 15% each academic cycle."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { "aria-label": "Related transparency links", className: "border-t border-slate-200 pt-6 flex flex-wrap gap-4 text-sm font-medium text-[#001a4a]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/editorial-policy", className: "hover:underline", children: "Editorial Policy & Review Standards →" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/about", className: "hover:underline", children: "About the Founder →" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/contact", className: "hover:underline", children: "Contact Editorial Team →" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/tools/electricity-bill-estimator", className: "hover:underline", children: "Electricity Estimator →" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/tools/solar-net-metering-roi-calculator", className: "hover:underline", children: "Solar ROI Calculator →" })
      ] })
    ] })
  ] });
}
export {
  MethodologySources as default
};

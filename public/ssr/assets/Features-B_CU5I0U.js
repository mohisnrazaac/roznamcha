import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-Cax6I6Hr.js";
import { b as buildWebPageSchema, s as seoContent, S as SeoHead } from "./SeoHead-1rNy1Vsq.js";
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
const featureImages = {
  "kharcha-map": {
    src: "/media/features/kharcha-map-expense-tracking-pakistan.png",
    width: 599,
    height: 410
  },
  "ration-brain": {
    src: "/media/features/ration-brain-grocery-price-tracking-pakistan.png",
    width: 598,
    height: 366
  },
  reminders: {
    src: "/media/features/reminders-health-guard-bill-medicine-pakistan.png",
    width: 599,
    height: 358
  },
  reports: {
    src: "/media/features/reports-signals-monthly-survival-report-pakistan.png",
    width: 598,
    height: 325
  },
  "ai-insights": {
    src: "/media/features/ai-insights-urdu-financial-advice-pakistan.png",
    width: 598,
    height: 125
  },
  "daily-hooks": {
    src: "/media/features/daily-money-snapshot-daily-hooks.png",
    width: 450,
    height: 744
  }
};
const modules = [
  {
    key: "kharcha-map",
    title: "Kharcha Map",
    description: "Visualize every rupee in Urdu timelines so you know where to cut back before the 20th of the month.",
    bullets: ["خرچ کا فوری ریکارڈ", "کیٹیگری کی زبردست ٹوٹلنگ", "ماہانہ لیکیج پر نظر"]
  },
  {
    key: "ration-brain",
    title: "Ration Brain",
    description: "Track atta, ghee, chawal, and sabzi prices across bazaars so ration lists stay realistic.",
    bullets: ["مہنگائی کا لائیو الارم", "راشن لسٹ کی ذہین کاپی", "خریداری سے پہلے قیمت چیک"]
  },
  {
    key: "reminders",
    title: "Reminders / Health Guard",
    description: "Set medicine, school fee, rent, or zakkat nudges that ping the whole household workspace.",
    bullets: ["واٹس ایپ نوٹ کی جگہ ایک ٹائم لائن", "ہیلتھ گارڈ کے ساتھ دوا کی ٹریکنگ", "مشترکہ شیڈول ایک نظر میں"]
  },
  {
    key: "reports",
    title: "Reports & Signals",
    description: "Monthly survival reports and alert banners tell you whether you will make it to payday.",
    bullets: ["Survival Report اردو میں", "اوور اسپیندنگ الرٹس", "ماہانہ خلاصہ ڈاؤن لوڈ"]
  },
  {
    key: "daily-hooks",
    title: "Daily Money Snapshot (Daily Hooks)",
    description: "Daily snapshots surface relevant money changes without making users hunt through the app.",
    bullets: ["آج کا خرچ خلاصہ", "مہنگائی کا فوری ہیلپ لائن", "گھر کی سٹریکس سنبھالیں"]
  },
  {
    key: "ai-insights",
    title: "AI Insights",
    description: "Use Urdu prompts to ask Roznamcha AI about kharcha leaks, ration swaps, or next month projections.",
    bullets: ["Urdu AI coach", "Inflation stress test", "راشن پلاننگ تجاویز"]
  }
];
function Features({ seo: seoProp, jsonLd: jsonLdProp }) {
  const seo = seoProp ?? seoContent.features;
  const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-[#001a4a]/70", children: "Open preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#001a4a]", children: "See every Roznamcha module without logging in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-600", children: "Ration planning, kharcha logs, reminders, reports, and AI insights — all built for Pakistani homes running dark mode and yellow highlights." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/register",
              className: "inline-flex items-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-yellow-200 shadow hover:bg-[#012261]",
              children: "Sign up (Free)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/tools/ration-cost-estimator",
              className: "inline-flex items-center rounded-full border border-[#001a4a]/20 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5",
              children: "Try Ration Cost Estimator"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/tools/monthly-household-budget-calculator",
              className: "inline-flex items-center rounded-full border border-[#001a4a]/20 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5",
              children: "Household Budget Calculator"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/tools/school-fees-planner",
              className: "inline-flex items-center rounded-full border border-[#001a4a]/20 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5",
              children: "School Fees Planner"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/tools/electricity-bill-estimator",
              className: "inline-flex items-center rounded-full border border-[#001a4a]/20 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5",
              children: "Electricity Bill Estimator"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/templates",
              className: "inline-flex items-center rounded-full border border-yellow-300 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-[#8c5a00] hover:bg-yellow-100",
              children: "Browse Smart Budget Templates"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/login", className: "text-sm font-semibold text-[#001a4a] underline-offset-4 hover:underline", children: "Login" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "overflow-hidden rounded-[2rem] border border-[#001a4a]/10 bg-[linear-gradient(135deg,_#fff8ea_0%,_#ffffff_58%,_#eef4ff_100%)] p-6 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Public growth surface" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold text-[#001a4a]", children: "Smart Budget Templates turn curiosity into saved household habits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-7 text-slate-600", children: "These template pages are open to guests, built for practical planning, and let people preview a salary-based survival plan first before deciding whether to save it for next month." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[1.5rem] border border-[#001a4a]/10 bg-white p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-[#001a4a]", children: "Featured entry points" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 text-sm text-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/templates/50k-salary-survival-guide", className: "block rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-[#001a4a] hover:border-[#001a4a]/30 hover:bg-slate-50", children: "50k Salary Survival Guide" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/templates/student-budget", className: "block rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-[#001a4a] hover:border-[#001a4a]/30 hover:bg-slate-50", children: "Student Budget" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/templates/joint-family-budget", className: "block rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-[#001a4a] hover:border-[#001a4a]/30 hover:bg-slate-50", children: "Joint Family Budget" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "public-tools", className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-5 scroll-mt-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-[#001a4a]/70", children: "Public Tools" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "Guest-Mode Calculators (No Login Required)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToolCard,
            {
              title: "Ration Cost Estimator",
              description: "Estimate monthly ration costs in Pakistan using configurable base prices for essentials.",
              href: "/tools/ration-cost-estimator"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToolCard,
            {
              title: "Household Budget Calculator",
              description: "Plan rent, groceries, school fees, transport, and bills to see your surplus or deficit.",
              href: "/tools/monthly-household-budget-calculator"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToolCard,
            {
              title: "School Fees Planner",
              description: "Convert tuition, annual charges, and exam fees into a real monthly reserve target.",
              href: "/tools/school-fees-planner"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToolCard,
            {
              title: "Electricity Bill Estimator",
              description: "Estimate bills using progressive slab rates, GST, and tariff comparison against last year.",
              href: "/tools/electricity-bill-estimator"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ToolCard,
            {
              title: "Smart Budget Templates",
              description: "Preview salary-based Pakistani household budgets that guests can browse now and save after signup.",
              href: "/templates"
            }
          )
        ] })
      ] }),
      modules.map((module) => /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleCard, { module }, module.key))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-x-0 bottom-4 px-4 md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-[#001a4a] px-4 py-3 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link_default,
      {
        href: "/register",
        className: "inline-flex w-full items-center justify-center rounded-xl bg-yellow-300 px-4 py-2 text-base font-semibold text-[#001a4a]",
        children: "Sign up (Free)"
      }
    ) }) })
  ] });
}
function ModuleCard({ module }) {
  const imageMeta = featureImages[module.key];
  const aspectStyle = (imageMeta == null ? void 0 : imageMeta.width) && (imageMeta == null ? void 0 : imageMeta.height) ? { aspectRatio: `${imageMeta.width}/${imageMeta.height}` } : void 0;
  const imageWrapperClass = `w-full rounded-2xl border border-dashed border-yellow-300 bg-[#fff9ef] overflow-hidden ${imageMeta ? "" : "aspect-video"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: module.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-600", children: module.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: imageWrapperClass, style: aspectStyle, children: imageMeta ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: imageMeta.src,
        alt: `${module.title} screenshot`,
        loading: "lazy",
        className: "h-full w-full object-contain"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,_#fff6d8_0%,_#ffffff_100%)] px-6 text-center text-sm font-semibold text-[#001a4a]", children: "Roznamcha module preview" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-5 space-y-2 text-slate-700", children: module.bullets.map((bullet) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: bullet }, bullet)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link_default,
      {
        href: "/register",
        className: "inline-flex items-center font-semibold text-[#001a4a] hover:underline",
        children: "Try it — Sign up →"
      }
    )
  ] });
}
function ToolCard({ title, description, href }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-[#001a4a]", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href, className: "inline-flex items-center font-semibold text-[#001a4a] hover:underline", children: "Open the tool →" })
  ] });
}
export {
  Features as default
};

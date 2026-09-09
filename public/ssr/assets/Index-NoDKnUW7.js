import { u as useForm, j as jsxRuntimeExports } from "../ssr.js";
import { C as ControlRoomLayout } from "./ControlRoomLayout-BmJqwnTf.js";
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
function DailyReturnIndex({ snapshot = {}, history = [], preview = {}, flash = null, next_run_at: nextRunAt = null }) {
  const form = useForm({});
  const handleManualFetch = (event) => {
    event.preventDefault();
    form.post(route("admin.daily-return.snapshots.store"), {
      preserveScroll: true
    });
  };
  const fields = [
    { label: "آج کا خرچ خلاصہ", value: snapshot.expense_summary_text },
    { label: "آج مہنگائی کا حال", value: snapshot.inflation_status_text },
    { label: "آج کی بچت کا موقع", value: snapshot.saving_tip_text },
    { label: "آج کی تازہ صورتحال", value: snapshot.today_update_line },
    { label: "کل کیا بدلا", value: snapshot.yesterday_change_line }
  ];
  const metadataEntries = Object.entries(snapshot.source_metadata ?? {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "daily-hooks", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-slate-500", children: "Admin · Daily Hooks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold text-white", children: "Daily Money Snapshot Automation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "رات ۱۲ بجے کا خودکار اسنیپ شاٹ returning users کو تازہ پاکستان ڈیٹا دیتا ہے، اور یہی صفحہ دستی رن کیلئے سیفٹی وال ہے۔" })
    ] }),
    flash && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `rounded-xl border px-4 py-3 text-sm ${flash.type === "error" ? "border-red-400/40 bg-red-500/10 text-red-200" : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"}`,
        children: flash.message
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "کرون ہر رات 12:05 AM (PKT) پر یہی سروس چلاتا ہے تاکہ صبح کا Daily Return کارڈ تازہ ڈیٹا دکھائے۔" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleManualFetch, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: form.processing,
          className: "inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60",
          children: form.processing ? "Fetching…" : "Fetch Today’s Snapshot Now"
        }
      ) }),
      nextRunAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
        "Next auto run: ",
        nextRunAt,
        " (platform TZ)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white", children: "Latest Snapshot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "یہی لائنیں ہوم پیج پر جاتی ہیں؛ ہم انہیں ہاؤس ہولڈ اردو میں رکھتے ہیں تاکہ روزانہ واپسی آسان رہے۔" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: fields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-xl border border-slate-800/70 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: field.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-100", children: field.value ?? "—" })
        ] }, field.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-800/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Source metadata" }),
          metadataEntries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-400", children: "No data captured yet." }),
          metadataEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "mt-2 space-y-1 text-xs text-slate-400", children: metadataEntries.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "uppercase tracking-wide text-slate-500", children: key }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-right text-slate-300", children: typeof value === "object" ? JSON.stringify(value) : value })
          ] }, key)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white", children: "Live Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "یہی کارڈ عوامی Daily Return widget میں رینڈر ہوتا ہے۔" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewCard, { preview })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white", children: "Recent History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "کرون روزانہ ایک ہی ریکارڈ اپ ڈیٹ کرتا ہے لہٰذا یہ فہرست ڈپلیکیشن سے محفوظ رہتی ہے۔" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-2", children: [
        history.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-xl border border-slate-800/70 p-4 text-sm text-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: [
            item.snapshot_date,
            " · Updated ",
            item.last_updated_at ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-semibold text-white", children: item.expense_summary_text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-slate-400", children: item.inflation_status_text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-slate-400", children: item.saving_tip_text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-slate-300", children: item.today_update_line }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500", children: item.yesterday_change_line })
        ] }, item.id)),
        history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "No automation runs captured yet." })
      ] })
    ] })
  ] }) });
}
function PreviewCard({ preview }) {
  const snapshot = (preview == null ? void 0 : preview.snapshot) ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-800/70 bg-gradient-to-b from-slate-900 to-slate-950 p-6 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-slate-500", children: "Daily Return" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-semibold text-white", children: snapshot.expense_summary_text ?? "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: snapshot.inflation_status_text ?? "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: snapshot.saving_tip_text ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-slate-400", children: snapshot.today_update_line ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500", children: snapshot.yesterday_change_line ?? "—" })
    ] })
  ] });
}
export {
  DailyReturnIndex as default
};

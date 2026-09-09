import { R as React, j as jsxRuntimeExports, a as usePage, u as useForm, r as router3 } from "../ssr.js";
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
const presets = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "custom", label: "Custom cron" }
];
const weekDays = [
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
  { value: "0", label: "Sunday" }
];
function CronPresetPicker({ value, onChange, error, hint }) {
  const [preset, setPreset] = React.useState("custom");
  const [time, setTime] = React.useState("20:00");
  const [weekday, setWeekday] = React.useState("1");
  const [monthday, setMonthday] = React.useState("1");
  const [customValue, setCustomValue] = React.useState(value ?? "0 20 * * *");
  React.useEffect(() => {
    if (!value) {
      return;
    }
    const matchDaily = value.match(/^(\d{1,2})\s+(\d{1,2})\s+\*\s+\*\s+\*$/);
    const matchWeekly = value.match(/^(\d{1,2})\s+(\d{1,2})\s+\*\s+\*\s+([0-6])$/);
    const matchMonthly = value.match(/^(\d{1,2})\s+(\d{1,2})\s+([1-9]|[12]\d|3[01])\s+\*\s+\*$/);
    if (matchDaily) {
      setPreset("daily");
      setTime(padTime(matchDaily[2], matchDaily[1]));
    } else if (matchWeekly) {
      setPreset("weekly");
      setWeekday(matchWeekly[3]);
      setTime(padTime(matchWeekly[2], matchWeekly[1]));
    } else if (matchMonthly) {
      setPreset("monthly");
      setMonthday(matchMonthly[3]);
      setTime(padTime(matchMonthly[2], matchMonthly[1]));
    } else {
      setPreset("custom");
      setCustomValue(value);
    }
  }, [value]);
  const handlePresetChange = (newPreset) => {
    setPreset(newPreset);
    const cron = buildCron({
      preset: newPreset,
      time,
      weekday,
      monthday,
      customValue
    });
    onChange(cron);
  };
  const handleTimeChange = (newTime) => {
    setTime(newTime);
    if (preset === "custom") {
      return;
    }
    const cron = buildCron({
      preset,
      time: newTime,
      weekday,
      monthday,
      customValue
    });
    onChange(cron);
  };
  const handleWeekdayChange = (value2) => {
    setWeekday(value2);
    if (preset !== "weekly") {
      return;
    }
    onChange(buildCron({ preset, time, weekday: value2, monthday, customValue }));
  };
  const handleMonthdayChange = (value2) => {
    setMonthday(value2);
    if (preset !== "monthly") {
      return;
    }
    onChange(buildCron({ preset, time, weekday, monthday: value2, customValue }));
  };
  const handleCustomChange = (event) => {
    setCustomValue(event.target.value);
    onChange(event.target.value);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: presets.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => handlePresetChange(item.id),
        className: `rounded-lg px-3 py-1 text-xs font-semibold border ${preset === item.id ? "border-yellow-300 bg-yellow-200/20 text-yellow-100" : "border-slate-600 text-slate-300 hover:border-yellow-200"}`,
        children: item.label
      },
      item.id
    )) }),
    preset !== "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-slate-400 mb-1", children: "Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "time",
            value: time,
            onChange: (event) => handleTimeChange(event.target.value),
            className: "w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
          }
        )
      ] }),
      preset === "weekly" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-slate-400 mb-1", children: "Day of week" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: weekday,
            onChange: (event) => handleWeekdayChange(event.target.value),
            className: "w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white",
            children: weekDays.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: day.value, children: day.label }, day.value))
          }
        )
      ] }),
      preset === "monthly" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-slate-400 mb-1", children: "Day of month" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: "1",
            max: "31",
            value: monthday,
            onChange: (event) => handleMonthdayChange(event.target.value),
            className: "w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
          }
        )
      ] })
    ] }),
    preset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-slate-400 mb-1", children: "Cron expression" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: customValue,
          onChange: handleCustomChange,
          className: "w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
        }
      )
    ] }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: hint }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: error })
  ] });
}
function buildCron({ preset, time, weekday, monthday, customValue }) {
  if (preset === "custom") {
    return customValue || "0 20 * * *";
  }
  const [hours, minutes] = parseTime(time);
  if (preset === "daily") {
    return `${minutes} ${hours} * * *`;
  }
  if (preset === "weekly") {
    return `${minutes} ${hours} * * ${weekday}`;
  }
  if (preset === "monthly") {
    return `${minutes} ${hours} ${monthday} * *`;
  }
  return customValue || "0 20 * * *";
}
function parseTime(time) {
  if (!time || !time.includes(":")) {
    return ["20", "0"];
  }
  const [hh, mm] = time.split(":");
  return [Number(hh) || 0, Number(mm) || 0];
}
function padTime(hours, minutes) {
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm}`;
}
function ReminderCreate({ types = [], reminder = null }) {
  var _a, _b, _c, _d, _e;
  const { props } = usePage();
  const translations = props.translations ?? {};
  const rem = translations.reminders ?? {};
  const commons = translations.commons ?? {};
  const form = useForm({
    title: (reminder == null ? void 0 : reminder.title) ?? "",
    type: (reminder == null ? void 0 : reminder.type) ?? types[0] ?? "finance",
    schedule_cron: (reminder == null ? void 0 : reminder.schedule_cron) ?? "0 20 * * *",
    starts_on: (reminder == null ? void 0 : reminder.starts_on) ?? "",
    ends_on: (reminder == null ? void 0 : reminder.ends_on) ?? "",
    timezone: (reminder == null ? void 0 : reminder.timezone) ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    is_active: (reminder == null ? void 0 : reminder.is_active) ?? true,
    notes: (reminder == null ? void 0 : reminder.notes) ?? ""
  });
  const submit = (event) => {
    event.preventDefault();
    const routeName = reminder ? "panel.reminders.update" : "panel.reminders.store";
    const method = reminder ? form.put : form.post;
    method(route(routeName, reminder == null ? void 0 : reminder.id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "reminders", user: (_a = props.auth) == null ? void 0 : _a.user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-6 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Panel › Reminders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: reminder ? rem.edit_reminder ?? "Edit reminder" : rem.new_reminder }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: rem.subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: commons.title,
          value: form.data.title,
          onChange: (event) => form.setData("title", event.target.value),
          error: form.errors.title
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: commons.type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: form.data.type,
              onChange: (event) => form.setData("type", event.target.value),
              className: "w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white",
              children: types.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: type, children: type }, type))
            }
          ),
          form.errors.type && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-1", children: form.errors.type })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: commons.timezone,
            value: form.data.timezone,
            onChange: (event) => form.setData("timezone", event.target.value),
            error: form.errors.timezone
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: commons.cron }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CronPresetPicker,
          {
            value: form.data.schedule_cron,
            onChange: (cron) => form.setData("schedule_cron", cron),
            error: form.errors.schedule_cron,
            hint: rem.schedule_hint
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: commons.starts_on,
            type: "date",
            value: form.data.starts_on,
            onChange: (event) => form.setData("starts_on", event.target.value),
            error: form.errors.starts_on
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: commons.ends_on,
            type: "date",
            value: form.data.ends_on,
            onChange: (event) => form.setData("ends_on", event.target.value),
            error: form.errors.ends_on
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: commons.note }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            rows: 3,
            value: form.data.notes,
            onChange: (event) => form.setData("notes", event.target.value),
            className: "w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
          }
        ),
        form.errors.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-1", children: form.errors.notes })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: form.data.is_active,
            onChange: (event) => form.setData("is_active", event.target.checked),
            className: "rounded border-slate-400 text-[#003a8c] focus:ring-0"
          }
        ),
        form.data.is_active ? (_b = translations.commons) == null ? void 0 : _b.status_active : (_c = translations.commons) == null ? void 0 : _c.status_inactive
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: form.processing,
            className: "rounded-xl bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50",
            children: form.processing ? "…" : (_d = translations.actions) == null ? void 0 : _d.save
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "text-sm text-slate-400 hover:text-white",
            onClick: () => router3.visit(route("panel.reminders.index")),
            children: (_e = translations.actions) == null ? void 0 : _e.cancel
          }
        )
      ] })
    ] }) })
  ] }) });
}
function Field({ label, error, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white",
        ...rest
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-1", children: error })
  ] });
}
export {
  ReminderCreate as default
};

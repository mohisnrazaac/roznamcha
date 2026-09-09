import { a as usePage, u as useForm, b as reactExports, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-BbACMio2.js";
import { S as SeoHead } from "./SeoHead-BMukc1fW.js";
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
const contactReasons = [
  "Feedback about the product or user experience",
  "Corrections to content, tools, or public information on the site",
  "Support questions about using Roznamcha features",
  "Partnership inquiries from communities, NGOs, or media teams",
  "Bug reports, billing issues, or suspected data problems"
];
function Contact({ seo, jsonLd, contactEmail = "support@roznamcha.pk" }) {
  const { props } = usePage();
  const { formTimestamp, flash = {} } = props;
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
    timestamp: formTimestamp ?? ""
  });
  reactExports.useEffect(() => {
    setData("timestamp", formTimestamp ?? "");
  }, [formTimestamp]);
  const submit = (event) => {
    event.preventDefault();
    post(route("public.contact.send"), {
      onSuccess: () => {
        reset("subject", "message");
        setData("website", "");
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#001a4a]", children: "Contact Roznamcha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "For questions, feedback, corrections, partnership inquiries, or support, please contact Roznamcha using the form below or by email. We keep this page straightforward so people can reach a real contact point without guessing where to ask for help." })
      ] }),
      (flash == null ? void 0 : flash.status) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800", children: flash.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Full name",
            name: "name",
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            error: errors.name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Email",
            name: "email",
            type: "email",
            value: data.email,
            onChange: (e) => setData("email", e.target.value),
            error: errors.email
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            label: "Subject",
            name: "subject",
            type: "text",
            value: data.subject,
            onChange: (e) => setData("subject", e.target.value),
            error: errors.subject
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "message", className: "text-sm font-medium text-slate-700", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "message",
              rows: "5",
              className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/30",
              placeholder: "Share your request or feedback",
              value: data.message,
              onChange: (e) => setData("message", e.target.value)
            }
          ),
          errors.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: errors.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            name: "website",
            value: data.website,
            onChange: (e) => setData("website", e.target.value),
            className: "hidden",
            autoComplete: "off",
            tabIndex: "-1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "timestamp", value: data.timestamp }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "w-full rounded-lg bg-[#001a4a] px-4 py-3 text-sm font-semibold text-yellow-300 shadow hover:bg-[#112e66]",
            disabled: processing,
            children: processing ? "Sending…" : "Send message"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "How to reach us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base text-slate-700", children: [
          "Email",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${contactEmail}`, className: "text-[#001a4a] font-semibold", children: contactEmail }),
          " ",
          "for direct help. The same team reviews the contact form submissions, so use whichever option is easier for you."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "We review messages and try to respond within a reasonable time." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "Where we operate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base text-slate-700", children: [
          "Roznamcha is developed and managed remotely by a team based in ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Karachi, Pakistan" }),
          ". As an online service catering to Pakistani household budgets, our primary focus is helping families navigate regional inflation and utility slab adjustments nationwide."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "When to contact us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-5 space-y-1 text-slate-700", children: contactReasons.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item }, item)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "Response time and privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "We reply within two working days, often sooner. Your email, phone, or message content stays private and is used only to solve your request. We do not share support conversations with third parties." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Do not send sensitive personal financial information through this page or form." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-600 text-center space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Need more context first? Visit the",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.about"), className: "font-semibold text-[#001a4a] hover:underline", children: "About" }),
        " ",
        "page and read the",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.privacy"), className: "font-semibold text-[#001a4a] hover:underline", children: "Privacy Policy" }),
        "."
      ] }) })
    ] })
  ] });
}
function Field({ label, name, type = "text", value, onChange, error }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: name, className: "text-sm font-medium text-slate-700", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id: name,
        name,
        type,
        className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/30",
        value,
        onChange,
        placeholder: label
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: error })
  ] });
}
export {
  Contact as default
};

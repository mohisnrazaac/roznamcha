import { b as reactExports, R as React, t as t$2 } from "../ssr.js";
var i$1 = Object.defineProperty;
var d = (t2, e, n2) => e in t2 ? i$1(t2, e, { enumerable: true, configurable: true, writable: true, value: n2 }) : t2[e] = n2;
var r = (t2, e, n2) => (d(t2, typeof e != "symbol" ? e + "" : e, n2), n2);
let o$2 = class o {
  constructor() {
    r(this, "current", this.detect());
    r(this, "handoffState", "pending");
    r(this, "currentId", 0);
  }
  set(e) {
    this.current !== e && (this.handoffState = "pending", this.currentId = 0, this.current = e);
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
  }
  handoff() {
    this.handoffState === "pending" && (this.handoffState = "complete");
  }
  get isHandoffComplete() {
    return this.handoffState === "complete";
  }
};
let s$3 = new o$2();
function t$1(e) {
  typeof queueMicrotask == "function" ? queueMicrotask(e) : Promise.resolve().then(e).catch((o3) => setTimeout(() => {
    throw o3;
  }));
}
function o$1() {
  let s2 = [], r2 = { addEventListener(e, t2, n2, i2) {
    return e.addEventListener(t2, n2, i2), r2.add(() => e.removeEventListener(t2, n2, i2));
  }, requestAnimationFrame(...e) {
    let t2 = requestAnimationFrame(...e);
    return r2.add(() => cancelAnimationFrame(t2));
  }, nextFrame(...e) {
    return r2.requestAnimationFrame(() => r2.requestAnimationFrame(...e));
  }, setTimeout(...e) {
    let t2 = setTimeout(...e);
    return r2.add(() => clearTimeout(t2));
  }, microTask(...e) {
    let t2 = { current: true };
    return t$1(() => {
      t2.current && e[0]();
    }), r2.add(() => {
      t2.current = false;
    });
  }, style(e, t2, n2) {
    let i2 = e.style.getPropertyValue(t2);
    return Object.assign(e.style, { [t2]: n2 }), this.add(() => {
      Object.assign(e.style, { [t2]: i2 });
    });
  }, group(e) {
    let t2 = o$1();
    return e(t2), this.add(() => t2.dispose());
  }, add(e) {
    return s2.includes(e) || s2.push(e), () => {
      let t2 = s2.indexOf(e);
      if (t2 >= 0) for (let n2 of s2.splice(t2, 1)) n2();
    };
  }, dispose() {
    for (let e of s2.splice(0)) e();
  } };
  return r2;
}
function p() {
  let [e] = reactExports.useState(o$1);
  return reactExports.useEffect(() => () => e.dispose(), [e]), e;
}
let n$1 = (e, t2) => {
  s$3.isServer ? reactExports.useEffect(e, t2) : reactExports.useLayoutEffect(e, t2);
};
function s$2(e) {
  let r2 = reactExports.useRef(e);
  return n$1(() => {
    r2.current = e;
  }, [e]), r2;
}
let o2 = function(t2) {
  let e = s$2(t2);
  return React.useCallback((...r2) => e.current(...r2), [e]);
};
function t(...r2) {
  return Array.from(new Set(r2.flatMap((n2) => typeof n2 == "string" ? n2.split(" ") : []))).filter(Boolean).join(" ");
}
function u$2(r2, n2, ...a) {
  if (r2 in n2) {
    let e = n2[r2];
    return typeof e == "function" ? e(...a) : e;
  }
  let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e) => `"${e}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t2, u$2), t2;
}
var A$1 = ((a) => (a[a.None = 0] = "None", a[a.RenderStrategy = 1] = "RenderStrategy", a[a.Static = 2] = "Static", a))(A$1 || {}), C$1 = ((e) => (e[e.Unmount = 0] = "Unmount", e[e.Hidden = 1] = "Hidden", e))(C$1 || {});
function K() {
  let n2 = $();
  return reactExports.useCallback((r2) => U({ mergeRefs: n2, ...r2 }), [n2]);
}
function U({ ourProps: n2, theirProps: r2, slot: e, defaultTag: a, features: s2, visible: t2 = true, name: l2, mergeRefs: i2 }) {
  i2 = i2 != null ? i2 : I;
  let o3 = P(r2, n2);
  if (t2) return F(o3, e, a, l2, i2);
  let y2 = s2 != null ? s2 : 0;
  if (y2 & 2) {
    let { static: f2 = false, ...u2 } = o3;
    if (f2) return F(u2, e, a, l2, i2);
  }
  if (y2 & 1) {
    let { unmount: f2 = true, ...u2 } = o3;
    return u$2(f2 ? 0 : 1, { [0]() {
      return null;
    }, [1]() {
      return F({ ...u2, hidden: true, style: { display: "none" } }, e, a, l2, i2);
    } });
  }
  return F(o3, e, a, l2, i2);
}
function F(n2, r2 = {}, e, a, s2) {
  let { as: t$12 = e, children: l2, refName: i2 = "ref", ...o3 } = h(n2, ["unmount", "static"]), y2 = n2.ref !== void 0 ? { [i2]: n2.ref } : {}, f2 = typeof l2 == "function" ? l2(r2) : l2;
  "className" in o3 && o3.className && typeof o3.className == "function" && (o3.className = o3.className(r2)), o3["aria-labelledby"] && o3["aria-labelledby"] === o3.id && (o3["aria-labelledby"] = void 0);
  let u2 = {};
  if (r2) {
    let d2 = false, p2 = [];
    for (let [c2, T2] of Object.entries(r2)) typeof T2 == "boolean" && (d2 = true), T2 === true && p2.push(c2.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`));
    if (d2) {
      u2["data-headlessui-state"] = p2.join(" ");
      for (let c2 of p2) u2[`data-${c2}`] = "";
    }
  }
  if (b(t$12) && (Object.keys(m(o3)).length > 0 || Object.keys(m(u2)).length > 0)) if (!reactExports.isValidElement(f2) || Array.isArray(f2) && f2.length > 1 || D$1(f2)) {
    if (Object.keys(m(o3)).length > 0) throw new Error(['Passing props on "Fragment"!', "", `The current component <${a} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(m(o3)).concat(Object.keys(m(u2))).map((d2) => `  - ${d2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((d2) => `  - ${d2}`).join(`
`)].join(`
`));
  } else {
    let d2 = f2.props, p2 = d2 == null ? void 0 : d2.className, c2 = typeof p2 == "function" ? (...R) => t(p2(...R), o3.className) : t(p2, o3.className), T2 = c2 ? { className: c2 } : {}, g = P(f2.props, m(h(o3, ["ref"])));
    for (let R in u2) R in g && delete u2[R];
    return reactExports.cloneElement(f2, Object.assign({}, g, u2, y2, { ref: s2(H(f2), y2.ref) }, T2));
  }
  return reactExports.createElement(t$12, Object.assign({}, h(o3, ["ref"]), !b(t$12) && y2, !b(t$12) && u2), f2);
}
function $() {
  let n2 = reactExports.useRef([]), r2 = reactExports.useCallback((e) => {
    for (let a of n2.current) a != null && (typeof a == "function" ? a(e) : a.current = e);
  }, []);
  return (...e) => {
    if (!e.every((a) => a == null)) return n2.current = e, r2;
  };
}
function I(...n2) {
  return n2.every((r2) => r2 == null) ? void 0 : (r2) => {
    for (let e of n2) e != null && (typeof e == "function" ? e(r2) : e.current = r2);
  };
}
function P(...n2) {
  if (n2.length === 0) return {};
  if (n2.length === 1) return n2[0];
  let r2 = {}, e = {};
  for (let s2 of n2) for (let t2 in s2) t2.startsWith("on") && typeof s2[t2] == "function" ? (e[t2] != null || (e[t2] = []), e[t2].push(s2[t2])) : r2[t2] = s2[t2];
  if (r2.disabled || r2["aria-disabled"]) for (let s2 in e) /^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(s2) && (e[s2] = [(t2) => {
    var l2;
    return (l2 = t2 == null ? void 0 : t2.preventDefault) == null ? void 0 : l2.call(t2);
  }]);
  for (let s2 in e) Object.assign(r2, { [s2](t2, ...l2) {
    let i2 = e[s2];
    for (let o3 of i2) {
      if ((t2 instanceof Event || (t2 == null ? void 0 : t2.nativeEvent) instanceof Event) && t2.defaultPrevented) return;
      o3(t2, ...l2);
    }
  } });
  return r2;
}
function Y(n2) {
  var r2;
  return Object.assign(reactExports.forwardRef(n2), { displayName: (r2 = n2.displayName) != null ? r2 : n2.name });
}
function m(n2) {
  let r2 = Object.assign({}, n2);
  for (let e in r2) r2[e] === void 0 && delete r2[e];
  return r2;
}
function h(n2, r2 = []) {
  let e = Object.assign({}, n2);
  for (let a of r2) a in e && delete e[a];
  return e;
}
function H(n2) {
  return React.version.split(".")[0] >= "19" ? n2.props.ref : n2.ref;
}
function b(n2) {
  return n2 === reactExports.Fragment || n2 === Symbol.for("react.fragment");
}
function D$1(n2) {
  return b(n2.type);
}
let u$1 = Symbol();
function T$1(t2, n2 = true) {
  return Object.assign(t2, { [u$1]: n2 });
}
function y(...t2) {
  let n2 = reactExports.useRef(t2);
  reactExports.useEffect(() => {
    n2.current = t2;
  }, [t2]);
  let c2 = o2((e) => {
    for (let o3 of n2.current) o3 != null && (typeof o3 == "function" ? o3(e) : o3.current = e);
  });
  return t2.every((e) => e == null || (e == null ? void 0 : e[u$1])) ? void 0 : c2;
}
function c$1(u2 = 0) {
  let [r2, a] = reactExports.useState(u2), g = reactExports.useCallback((e) => a(e), []), s2 = reactExports.useCallback((e) => a((l2) => l2 | e), []), m2 = reactExports.useCallback((e) => (r2 & e) === e, [r2]), n2 = reactExports.useCallback((e) => a((l2) => l2 & ~e), []), F2 = reactExports.useCallback((e) => a((l2) => l2 ^ e), []);
  return { flags: r2, setFlag: g, addFlag: s2, hasFlag: m2, removeFlag: n2, toggleFlag: F2 };
}
var T, S;
typeof process != "undefined" && typeof globalThis != "undefined" && typeof Element != "undefined" && ((T = process == null ? void 0 : process.env) == null ? void 0 : T["NODE_ENV"]) === "test" && typeof ((S = Element == null ? void 0 : Element.prototype) == null ? void 0 : S.getAnimations) == "undefined" && (Element.prototype.getAnimations = function() {
  return console.warn(["Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.", "Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.", "", "Example usage:", "```js", "import { mockAnimationsApi } from 'jsdom-testing-mocks'", "mockAnimationsApi()", "```"].join(`
`)), [];
});
var A = ((i2) => (i2[i2.None = 0] = "None", i2[i2.Closed = 1] = "Closed", i2[i2.Enter = 2] = "Enter", i2[i2.Leave = 4] = "Leave", i2))(A || {});
function x(e) {
  let r2 = {};
  for (let t2 in e) e[t2] === true && (r2[`data-${t2}`] = "");
  return r2;
}
function N(e, r2, t2, n2) {
  let [i2, a] = reactExports.useState(t2), { hasFlag: s2, addFlag: o3, removeFlag: l2 } = c$1(e && i2 ? 3 : 0), u2 = reactExports.useRef(false), f2 = reactExports.useRef(false), E = p();
  return n$1(() => {
    var d2;
    if (e) {
      if (t2 && a(true), !r2) {
        t2 && o3(3);
        return;
      }
      return (d2 = n2 == null ? void 0 : n2.start) == null || d2.call(n2, t2), C(r2, { inFlight: u2, prepare() {
        f2.current ? f2.current = false : f2.current = u2.current, u2.current = true, !f2.current && (t2 ? (o3(3), l2(4)) : (o3(4), l2(2)));
      }, run() {
        f2.current ? t2 ? (l2(3), o3(4)) : (l2(4), o3(3)) : t2 ? l2(1) : o3(1);
      }, done() {
        var p2;
        f2.current && D(r2) || (u2.current = false, l2(7), t2 || a(false), (p2 = n2 == null ? void 0 : n2.end) == null || p2.call(n2, t2));
      } });
    }
  }, [e, t2, r2, E]), e ? [i2, { closed: s2(1), enter: s2(2), leave: s2(4), transition: s2(2) || s2(4) }] : [t2, { closed: void 0, enter: void 0, leave: void 0, transition: void 0 }];
}
function C(e, { prepare: r2, run: t2, done: n2, inFlight: i2 }) {
  let a = o$1();
  return j(e, { prepare: r2, inFlight: i2 }), a.nextFrame(() => {
    t2(), a.requestAnimationFrame(() => {
      a.add(M$1(e, n2));
    });
  }), a.dispose;
}
function M$1(e, r2) {
  var a, s2;
  let t2 = o$1();
  if (!e) return t2.dispose;
  let n2 = false;
  t2.add(() => {
    n2 = true;
  });
  let i2 = (s2 = (a = e.getAnimations) == null ? void 0 : a.call(e).filter((o3) => o3 instanceof CSSTransition)) != null ? s2 : [];
  return i2.length === 0 ? (r2(), t2.dispose) : (Promise.allSettled(i2.map((o3) => o3.finished)).then(() => {
    n2 || r2();
  }), t2.dispose);
}
function j(e, { inFlight: r2, prepare: t2 }) {
  if (r2 != null && r2.current) {
    t2();
    return;
  }
  let n2 = e.style.transition;
  e.style.transition = "none", t2(), e.offsetHeight, e.style.transition = n2;
}
function D(e) {
  var t2, n2;
  return ((n2 = (t2 = e.getAnimations) == null ? void 0 : t2.call(e)) != null ? n2 : []).some((i2) => i2 instanceof CSSTransition && i2.playState !== "finished");
}
let n = reactExports.createContext(null);
n.displayName = "OpenClosedContext";
var i = ((e) => (e[e.Open = 1] = "Open", e[e.Closed = 2] = "Closed", e[e.Closing = 4] = "Closing", e[e.Opening = 8] = "Opening", e))(i || {});
function u() {
  return reactExports.useContext(n);
}
function c({ value: o3, children: t2 }) {
  return React.createElement(n.Provider, { value: o3 }, t2);
}
function s$1({ children: o3 }) {
  return React.createElement(n.Provider, { value: null }, o3);
}
function s() {
  let r2 = typeof document == "undefined";
  return "useSyncExternalStore" in t$2 ? ((o3) => o3.useSyncExternalStore)(t$2)(() => () => {
  }, () => false, () => !r2) : false;
}
function l() {
  let r2 = s(), [e, n2] = reactExports.useState(s$3.isHandoffComplete);
  return e && s$3.isHandoffComplete === false && n2(false), reactExports.useEffect(() => {
    e !== true && n2(true);
  }, [e]), reactExports.useEffect(() => s$3.handoff(), []), r2 ? false : e;
}
function f() {
  let e = reactExports.useRef(false);
  return n$1(() => (e.current = true, () => {
    e.current = false;
  }), []), e;
}
function ue(e) {
  var t2;
  return !!(e.enter || e.enterFrom || e.enterTo || e.leave || e.leaveFrom || e.leaveTo) || !b((t2 = e.as) != null ? t2 : de) || React.Children.count(e.children) === 1;
}
let V = reactExports.createContext(null);
V.displayName = "TransitionContext";
var De = ((n2) => (n2.Visible = "visible", n2.Hidden = "hidden", n2))(De || {});
function He() {
  let e = reactExports.useContext(V);
  if (e === null) throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e;
}
function Ae() {
  let e = reactExports.useContext(w);
  if (e === null) throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e;
}
let w = reactExports.createContext(null);
w.displayName = "NestingContext";
function M(e) {
  return "children" in e ? M(e.children) : e.current.filter(({ el: t2 }) => t2.current !== null).filter(({ state: t2 }) => t2 === "visible").length > 0;
}
function Te(e, t2) {
  let n2 = s$2(e), l2 = reactExports.useRef([]), S2 = f(), R = p(), d2 = o2((o3, i2 = C$1.Hidden) => {
    let a = l2.current.findIndex(({ el: s2 }) => s2 === o3);
    a !== -1 && (u$2(i2, { [C$1.Unmount]() {
      l2.current.splice(a, 1);
    }, [C$1.Hidden]() {
      l2.current[a].state = "hidden";
    } }), R.microTask(() => {
      var s2;
      !M(l2) && S2.current && ((s2 = n2.current) == null || s2.call(n2));
    }));
  }), y2 = o2((o3) => {
    let i2 = l2.current.find(({ el: a }) => a === o3);
    return i2 ? i2.state !== "visible" && (i2.state = "visible") : l2.current.push({ el: o3, state: "visible" }), () => d2(o3, C$1.Unmount);
  }), C2 = reactExports.useRef([]), p$1 = reactExports.useRef(Promise.resolve()), h2 = reactExports.useRef({ enter: [], leave: [] }), g = o2((o3, i2, a) => {
    C2.current.splice(0), t2 && (t2.chains.current[i2] = t2.chains.current[i2].filter(([s2]) => s2 !== o3)), t2 == null || t2.chains.current[i2].push([o3, new Promise((s2) => {
      C2.current.push(s2);
    })]), t2 == null || t2.chains.current[i2].push([o3, new Promise((s2) => {
      Promise.all(h2.current[i2].map(([r2, f2]) => f2)).then(() => s2());
    })]), i2 === "enter" ? p$1.current = p$1.current.then(() => t2 == null ? void 0 : t2.wait.current).then(() => a(i2)) : a(i2);
  }), v = o2((o3, i2, a) => {
    Promise.all(h2.current[i2].splice(0).map(([s2, r2]) => r2)).then(() => {
      var s2;
      (s2 = C2.current.shift()) == null || s2();
    }).then(() => a(i2));
  });
  return reactExports.useMemo(() => ({ children: l2, register: y2, unregister: d2, onStart: g, onStop: v, wait: p$1, chains: h2 }), [y2, d2, l2, g, v, h2, p$1]);
}
let de = reactExports.Fragment, fe = A$1.RenderStrategy;
function Fe(e, t$12) {
  var ee, te;
  let { transition: n2 = true, beforeEnter: l$1, afterEnter: S2, beforeLeave: R, afterLeave: d2, enter: y$1, enterFrom: C2, enterTo: p2, entered: h2, leave: g, leaveFrom: v, leaveTo: o$12, ...i$12 } = e, [a, s2] = reactExports.useState(null), r2 = reactExports.useRef(null), f2 = ue(e), U2 = y(...f2 ? [r2, t$12, s2] : t$12 === null ? [] : [t$12]), H2 = (ee = i$12.unmount) == null || ee ? C$1.Unmount : C$1.Hidden, { show: u2, appear: z, initial: K$1 } = He(), [m$1, j2] = reactExports.useState(u2 ? "visible" : "hidden"), Q = Ae(), { register: A2, unregister: F2 } = Q;
  n$1(() => A2(r2), [A2, r2]), n$1(() => {
    if (H2 === C$1.Hidden && r2.current) {
      if (u2 && m$1 !== "visible") {
        j2("visible");
        return;
      }
      return u$2(m$1, { ["hidden"]: () => F2(r2), ["visible"]: () => A2(r2) });
    }
  }, [m$1, r2, A2, F2, u2, H2]);
  let G = l();
  n$1(() => {
    if (f2 && G && m$1 === "visible" && r2.current === null) throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
  }, [r2, m$1, G, f2]);
  let ce = K$1 && !z, Y2 = z && u2 && K$1, B = reactExports.useRef(false), I2 = Te(() => {
    B.current || (j2("hidden"), F2(r2));
  }, Q), Z = o2((W) => {
    B.current = true;
    let L = W ? "enter" : "leave";
    I2.onStart(r2, L, (_) => {
      _ === "enter" ? l$1 == null || l$1() : _ === "leave" && (R == null || R());
    });
  }), $2 = o2((W) => {
    let L = W ? "enter" : "leave";
    B.current = false, I2.onStop(r2, L, (_) => {
      _ === "enter" ? S2 == null || S2() : _ === "leave" && (d2 == null || d2());
    }), L === "leave" && !M(I2) && (j2("hidden"), F2(r2));
  });
  reactExports.useEffect(() => {
    f2 && n2 || (Z(u2), $2(u2));
  }, [u2, f2, n2]);
  let pe = /* @__PURE__ */ (() => !(!n2 || !f2 || !G || ce))(), [, T2] = N(pe, a, u2, { start: Z, end: $2 }), Ce = m({ ref: U2, className: ((te = t(i$12.className, Y2 && y$1, Y2 && C2, T2.enter && y$1, T2.enter && T2.closed && C2, T2.enter && !T2.closed && p2, T2.leave && g, T2.leave && !T2.closed && v, T2.leave && T2.closed && o$12, !T2.transition && u2 && h2)) == null ? void 0 : te.trim()) || void 0, ...x(T2) }), N$1 = 0;
  m$1 === "visible" && (N$1 |= i.Open), m$1 === "hidden" && (N$1 |= i.Closed), u2 && m$1 === "hidden" && (N$1 |= i.Opening), !u2 && m$1 === "visible" && (N$1 |= i.Closing);
  let he = K();
  return React.createElement(w.Provider, { value: I2 }, React.createElement(c, { value: N$1 }, he({ ourProps: Ce, theirProps: i$12, defaultTag: de, features: fe, visible: m$1 === "visible", name: "Transition.Child" })));
}
function Ie(e, t2) {
  let { show: n2, appear: l$1 = false, unmount: S2 = true, ...R } = e, d2 = reactExports.useRef(null), y$1 = ue(e), C2 = y(...y$1 ? [d2, t2] : t2 === null ? [] : [t2]);
  l();
  let p2 = u();
  if (n2 === void 0 && p2 !== null && (n2 = (p2 & i.Open) === i.Open), n2 === void 0) throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
  let [h2, g] = reactExports.useState(n2 ? "visible" : "hidden"), v = Te(() => {
    n2 || g("hidden");
  }), [o$12, i$12] = reactExports.useState(true), a = reactExports.useRef([n2]);
  n$1(() => {
    o$12 !== false && a.current[a.current.length - 1] !== n2 && (a.current.push(n2), i$12(false));
  }, [a, n2]);
  let s2 = reactExports.useMemo(() => ({ show: n2, appear: l$1, initial: o$12 }), [n2, l$1, o$12]);
  n$1(() => {
    n2 ? g("visible") : !M(v) && d2.current !== null && g("hidden");
  }, [n2, v]);
  let r2 = { unmount: S2 }, f2 = o2(() => {
    var u2;
    o$12 && i$12(false), (u2 = e.beforeEnter) == null || u2.call(e);
  }), U2 = o2(() => {
    var u2;
    o$12 && i$12(false), (u2 = e.beforeLeave) == null || u2.call(e);
  }), H2 = K();
  return React.createElement(w.Provider, { value: v }, React.createElement(V.Provider, { value: s2 }, H2({ ourProps: { ...r2, as: reactExports.Fragment, children: React.createElement(me, { ref: C2, ...r2, ...R, beforeEnter: f2, beforeLeave: U2 }) }, theirProps: {}, defaultTag: reactExports.Fragment, features: fe, visible: h2 === "visible", name: "Transition" })));
}
function Le(e, t2) {
  let n2 = reactExports.useContext(V) !== null, l2 = u() !== null;
  return React.createElement(React.Fragment, null, !n2 && l2 ? React.createElement(X, { ref: t2, ...e }) : React.createElement(me, { ref: t2, ...e }));
}
let X = Y(Ie), me = Y(Fe), Oe = Y(Le), Ke = Object.assign(X, { Child: Oe, Root: X });
export {
  A$1 as A,
  Ke as K,
  Oe as O,
  T$1 as T,
  Y,
  K as a,
  o$1 as b,
  s$2 as c,
  u as d,
  s$1 as e,
  f,
  i,
  l,
  n$1 as n,
  o2 as o,
  p,
  s$3 as s,
  t$1 as t,
  u$2 as u,
  y
};

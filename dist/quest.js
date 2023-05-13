const Ui = 1, ji = 2, $i = 3, Z = function() {
}, R = {};
R.testing = !1;
const z = console.log, Hi = (t) => {
  (l.playMode === "dev" || l.playMode === "beta") && z(t);
}, Wi = (t) => {
  f.debug && z(t);
};
function ce(t) {
  u.msgInputText(t), f.parse(t);
}
function Bi(t, e) {
  return e === void 0 && (e = "unspecifiedDoOnceFlag"), t[e] ? !1 : (t[e] = !0, !0);
}
function qi(t) {
  return I.transcript ? (gn("Comment: " + t), "Comment added to transcript") : "This function is designed for adding comments whilst recording a transcript. You have are not currently recording a transcript.";
}
function me(t, e, n, s) {
  if (s === void 0 && (s = {}), s.char || (s.char = t), s.item || (s.item = e), typeof e[n] == "string") {
    let r = e[n];
    return e[n + "Addendum"] && (r += e[n + "Addendum"](t)), x(r, s), !0;
  } else {
    if (typeof e[n] == "function")
      return e[n](s);
    {
      const r = "Unsupported type for printOrRun (" + n + " is a " + typeof e[n] + ").";
      throw _(r), new Error(r);
    }
  }
}
function fn(t) {
  return t.toLowerCase().replace(/[^a-zA-Z0-9_]/g, "");
}
const M = {
  buffer: []
};
M.int = function(t, e) {
  return this.buffer.length > 0 ? this.buffer.shift() : (e === void 0 && (e = t, t = 0), Math.floor(Math.random() * (e - t + 1)) + t);
};
M.chance = function(t) {
  return M.int(99) < t;
};
M.fromArray = function(t, e) {
  if (typeof t == "string" && t.split("|"), t.length === 0)
    return null;
  const n = M.int(t.length - 1), s = t[n];
  return e && t.splice(n, 1), s;
};
M.shuffle = function(t) {
  typeof t == "number" && (t = [...Array(t).keys()]);
  const e = [];
  for (; t.length > 0; )
    e.push(M.fromArray(t, !0));
  return e;
};
M.dice = function(t, e) {
  if (typeof t == "number")
    return t;
  t = t.replace(/ /g, "").replace(/\-/g, "+-");
  let n = 0;
  M.diceLog = [];
  for (let s of t.split("+")) {
    if (s === "")
      continue;
    let r = 1;
    /^\-/.test(s) && (s = s.substring(1), r = -1), n += r * M.diceSubPart(s, e);
  }
  return n;
};
M.diceSubPart = function(t, e) {
  if (/^\d+$/.test(t))
    return parseInt(t);
  /^d/.test(t) && (t = "1" + t);
  const n = /^(\d+)[dD]([0-9\:]+)([hHlLeErRcC])?(\d+)?/.exec(t);
  if (!n)
    return _("Can't parse dice type: " + t);
  let s = [];
  const r = parseInt(n[1]), o = n[2];
  for (let d = 0; d < r; d++) {
    const p = M.diceRoll(o, e);
    s.push(p);
  }
  if (n[3] === "h" || n[3] === "H") {
    const d = n[4] ? parseInt(n[4]) : 1;
    s = s.sort(function(p, v) {
      return v - p;
    }).slice(0, d);
  }
  if (n[3] === "l" || n[3] === "L") {
    const d = n[4] ? parseInt(n[4]) : 1;
    s = s.sort(function(p, v) {
      return p - v;
    }).slice(0, d);
  }
  if (n[3] === "e" || n[3] === "E") {
    const d = n[4] ? parseInt(n[4]) : parseInt(o);
    if (d < 2)
      return _("Bad exploding dice will crash the game: " + t);
    let p = s.filter((v) => v >= d).length;
    for (let v = 0; v < p; v++) {
      const N = M.diceRoll(o, e);
      s.push(N), n[3] === "E" && N >= d && p++;
    }
  }
  if (n[3] === "r") {
    const d = n[4] ? parseInt(n[4]) : 1;
    for (let p = 0; p < s.length; p++)
      s[p] <= d && (s[p] = M.diceRoll(o, e));
  }
  if (n[3] === "R") {
    const d = n[4] ? parseInt(n[4]) : 1;
    for (let p = 0; p < s.length; p++)
      for (; s[p] <= d; )
        s[p] = M.diceRoll(o, e);
  }
  if (n[3] === "C") {
    const d = parseInt(n[4]);
    for (let p = 0; p < s.length; p++)
      s[p] = s[p] >= d ? 1 : 0;
  }
  if (n[3] === "c") {
    const d = parseInt(n[4]);
    for (let p = 0; p < s.length; p++)
      s[p] = s[p] <= d ? 1 : 0;
  }
  let c = 0;
  for (const d of s)
    c += d;
  return c;
};
M.diceRoll = function(t, e) {
  if (e) {
    if (/^\d+$/.test(t))
      return parseInt(t) / 2 + 0.5;
    let s = 0;
    const r = t.split(":");
    for (const o of r)
      z(s), s += parseInt(o);
    return z(s), s / r.length;
  }
  const n = /^\d+$/.test(t) ? M.int(1, parseInt(t)) : parseInt(M.fromArray(t.split(":")));
  return M.diceLog.push(n), n;
};
M.prime = function(t) {
  typeof t == "number" && (t = [t]), this.buffer = t;
};
function B(t) {
  return t.length === 0 ? "" : t.replace(t[0], t[0].toUpperCase());
}
function Gi(t) {
  return t.toLowerCase().split(" ").map((e) => e.replace(e[0], e[0].toUpperCase())).join(" ");
}
function bs(t) {
  const e = document.createElement("template");
  e.innerHTML = t.trim();
  let n = e.content;
  for (; n.hasChildNodes(); )
    n = n.firstChild;
  return n.textContent = B(n.textContent), e.innerHTML;
}
function ws(t) {
  return '<span style="text-transform: capitalize;">' + t + "</span>";
}
function Vi(t) {
  return "&nbsp;".repeat(t);
}
function zi(t, e) {
  return e.multiple ? B(t.alias) + ": " : "";
}
function V(t, e) {
  z("Warning for " + t.name + ": " + e);
}
function K(t, e) {
  if (e === void 0 && (e = {}), e.lastJoiner && !e.lastSep && (e.lastSep = e.lastJoiner), t.length === 0)
    return e.nothing ? e.nothing : "";
  if (e.sep || (e.sep = ","), !e.separateEnsembles) {
    const r = [], o = [];
    for (let c of t)
      c.ensembleMaster && c.ensembleMaster.isAllTogether() && (r.push(c), o.includes(c.ensembleMaster) || o.push(c.ensembleMaster));
    t = U.subtract(t, r), t = t.concat(o);
  }
  e.doNotSort || t.sort(function(r, o) {
    return r.name && (r = r.name), o.name && (o = o.name), r.localeCompare(o);
  });
  const n = t.map((r) => typeof r == "string" ? r : a.getName(r, e));
  let s = "";
  if (l.oxfordComma && n.length === 2 && e.lastSep)
    return n[0] + " " + e.lastSep + " " + n[1];
  do
    s += n.shift(), n.length === 1 && e.lastSep ? (l.oxfordComma && (s += e.sep), s += " " + e.lastSep + " ") : n.length > 0 && (s += e.sep + " ");
  while (n.length > 0);
  return s;
}
function Qi(t) {
  return Object.keys(t).join(", ");
}
const Ht = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1], Ss = "M;CM;D;CD;C;XC;L;XL;X;IX;V;IV;I".split(";");
function Ki(t) {
  if (typeof t != "number")
    return _("toRoman can only handle numbers"), t;
  let e = "";
  for (let n = 0; n < 13; n++)
    for (; t >= Ht[n]; )
      e = e + Ss[n], t = t - Ht[n];
  return e;
}
function ie(t) {
  if (typeof l.moneyFormat > "u")
    return _("No format for money set (set settings.moneyFormat in settings.js)."), "" + t;
  const e = l.moneyFormat.split("!");
  if (e.length === 2)
    return l.moneyFormat.replace("!", "" + t);
  if (e.length === 3) {
    const n = t < 0;
    t = Math.abs(t);
    let s = e[1];
    const r = s.startsWith("+");
    r && (s = s.substring(1));
    let o = Wt(t, s);
    return n ? o = "-" + o : t !== 0 && r && (o = "+" + o), e[0] + o + e[2];
  } else if (e.length === 4) {
    const n = t < 0 ? e[2] : e[1];
    return e[0] + Wt(t, n) + e[3];
  } else
    return _("settings.moneyFormat in settings.js expected to have either 1, 2 or 3 exclamation marks."), "" + t;
}
function Wt(t, e) {
  t = Math.abs(t);
  const n = /^(\D*)(\d+)(\D)(\d*)(\D*)$/;
  if (!n.test(e))
    return _("Unexpected format in displayNumber (" + e + "). Should be a number, followed by a single character separator, followed by a number."), "" + t;
  const s = n.exec(e), r = parseInt(s[4]);
  let o = parseInt(s[2]);
  r > 0 && (o = o + 1 + r);
  const c = Math.pow(10, r), p = (t / c).toFixed(r).replace(".", s[3]);
  return s[1] + p.padStart(o, "0") + s[5];
}
function hn(t) {
  for (let e of a.exit_list)
    if (e.type !== "nocmd" && (e.name === t || e.abbrev.toLowerCase() === t || new RegExp("^(" + e.alt + ")$").test(t)))
      return e.name;
  return !1;
}
function Yi(t, e) {
  t = t.toString();
  const n = [];
  for (; t; ) {
    const s = t.slice(-e);
    t = t.slice(0, -e), n.unshift(s);
  }
  return n;
}
const U = {};
U.subtract = function(t, e) {
  Array.isArray(e) || (e = [e]);
  const n = [];
  for (let s = 0; s < t.length; s++)
    e.includes(t[s]) || n.push(t[s]);
  return n;
};
U.compare = function(t, e) {
  if (!Array.isArray(e) || t.length !== e.length)
    return !1;
  for (let n = 0; n < t.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
};
U.compareUnordered = function(t, e) {
  if (!Array.isArray(e) || t.length !== e.length)
    return !1;
  for (let n of t)
    if (!e.includes(n))
      return !1;
  return !0;
};
U.remove = function(t, ...e) {
  if (e.length === 0)
    return;
  let n = t.indexOf(e.shift());
  n !== -1 && t.splice(n, 1), U.remove(t, ...e);
};
U.intersection = function(t, e) {
  return t.filter(function(n) {
    return e.indexOf(n) !== -1;
  });
};
U.filterByAttribute = function(t, e, n) {
  return t.filter((s) => s[e] === n);
};
U.next = function(t, e, n) {
  let s = t.indexOf(e) + 1;
  return s === 0 ? !1 : s === t.length ? n ? t[0] : !1 : t[s];
};
U.nextFlagged = function(t, e, n, s) {
  let r = e, o = t.length;
  for (; r && !r[n] && o > 0; )
    r = U.next(t, r, s), o = o - 1;
  return !r || !r[n] ? !1 : r;
};
U.clone = function(t, e) {
  e || (e = {});
  let n = e.compress ? [...new Set(t)] : [...t];
  return e.value && (n = n.map((s) => s[e.value])), e.function && (n = n.map((s) => s[e.function]())), e.attribute && (n = n.map((s) => typeof s[e.attribute] == "function" ? s[e.attribute]() : s[e.attribute])), e.reverse ? n.reverse() : n;
};
U.hasMatch = function(t, e) {
  for (let n of t)
    if (typeof n == "string" && n === e || n instanceof RegExp && e.match(n))
      return !0;
  return !1;
};
U.combos = function(t, e = " ") {
  const n = [];
  for (let s = 0; s < t.length; s++) {
    n.push(t[s]);
    for (let r = s + 1; r < t.length; r++) {
      n.push(t[s] + e + t[r]);
      for (let o = r + 1; o < t.length; o++)
        n.push(t[s] + e + t[r] + e + t[o]);
    }
  }
  return n;
};
U.fromTokens = function(t, e, n) {
  const s = [];
  for (; t.length > 0; ) {
    const r = U.oneFromTokens(t, e, n);
    if (!r)
      return null;
    s.push(r);
  }
  return s;
};
U.oneFromTokens = function(t, e, n = {}) {
  for (let s = t.length; s > 0; s--) {
    const r = t.slice(0, s).join(" "), o = f.findInList(r, e, n);
    if (o.length > 0) {
      for (let c = 0; c < s; c++)
        t.shift();
      return o;
    }
  }
  return null;
};
U.value = function(t, e, n) {
  if (e >= t.length || e < 0) {
    if (n === "none")
      return "";
    if (n === "wrap")
      return t[e % t.length];
    if (n === "end")
      return t[t.length - 1];
    if (n === "start")
      return t[0];
  }
  return t[e];
};
function Ct() {
  const t = [];
  for (let e in m)
    m[e].scopeStatus.canReach && h.ifNotDark(m[e]) && t.push(m[e]);
  return t;
}
function Ji(t = g(), e = h.PARSER) {
  return t.getContents(e);
}
function dn() {
  const t = [];
  for (let e in m) {
    const n = m[e];
    !n.player && n.isAtLoc(g().loc, h.LOOK) && h.ifNotDark(n) && t.push(n);
  }
  return t;
}
function _s() {
  const t = [];
  for (let e in m) {
    const n = m[e];
    !n.player && n.isAtLoc(g().loc, h.PARSER) && t.push(n);
  }
  return t;
}
function Xi(t) {
  const e = [];
  for (let n in m) {
    const s = m[n];
    s.isAtLoc(g().loc, h.LOOK) && s.npc && (h.ifNotDark(s) || t) && e.push(s);
  }
  return e;
}
function Zi(t) {
  const e = [];
  for (let n in m) {
    const s = m[n];
    s.isAtLoc(g().loc, h.PARSER) && s.npc && (h.ifNotDark(s) || t) && e.push(s);
  }
  return e;
}
function mn(t) {
  const e = [];
  for (let n in m)
    t(m[n]) && e.push(m[n]);
  return e;
}
const T = {};
T.getContents = function(t) {
  const e = [];
  for (let n in m)
    m[n].isAtLoc(this.name, t) && e.push(m[n]);
  return e;
};
T.testForRecursion = function(t, e) {
  let n = this.name;
  for (; m[n]; ) {
    if (m[n].loc === e.name)
      return L(a.container_recursion, { char: t, container: this, item: e });
    n = m[n].loc;
  }
  return !0;
};
T.nameModifierFunctionForContainer = function(t, e) {
  t.getContents(h.LOOK).length > 0 && (!t.closed || t.transparent) && e.push(a.contentsForData[t.contentsType].prefix + t.listContents(h.LOOK) + a.contentsForData[t.contentsType].suffix);
};
T.clamp = function(t, e, n) {
  return t <= e ? e : t >= n ? n : t;
};
T.registerTimerFunction = function(t, e) {
  if (h.isCreated && !l.saveDisabled) {
    _("Attempting to use registerEvent after set up.");
    return;
  }
  l.eventFunctions[t] = e;
};
T.registerTimerEvent = function(t, e, n) {
  l.eventFunctions[t] || _("A timer is trying to call event '" + t + "' but no such function is registered."), O.timerEventNames.push(t), O.timerEventTriggerTimes.push(e), O.timerEventIntervals.push(n || -1);
};
T.findTopic = function(t, e, n = 1) {
  if (m[t])
    return m[t];
  for (const s in m) {
    const r = m[s];
    if (r.conversationTopic && (!e || r.belongsTo(e.name)) && r.alias === t && (n--, n === 0))
      return r;
  }
  _(e ? "Trying to find topic " + n + ' called "' + t + '" for ' + e.name + " and came up empty-handed!" : "Trying to find topic " + n + ' called "' + t + '" for anyone and came up empty-handed!');
};
T.giveItem = function(t) {
  t.item.moveToFrom(t, t.npc, t.char);
};
T.changeListeners = [];
T.handleChangeListeners = function() {
  for (let t of T.changeListeners)
    t.test(t.object, t.object[t.attName], t.oldValue, t.attName) && t.func(t.object, t.object[t.attName], t.oldValue, t.attName), t.oldValue = t.object[t.attName];
};
T.defaultChangeListenerTest = function(t, e, n, s) {
  return e !== n;
};
T.addChangeListener = function(t, e, n, s = T.defaultChangeListenerTest) {
  if (h.isCreated && !l.saveDisabled) {
    _("Attempting to use addChangeListener after set up.");
    return;
  }
  T.changeListeners.push({ object: t, attName: e, func: n, test: s, oldValue: t[e] });
};
T.getChangeListenersSaveString = function() {
  if (T.changeListeners.length === 0)
    return "NoChangeListeners";
  const t = T.changeListeners.map((e) => e.oldValue.toString());
  return "ChangeListenersUsedStrings=" + I.encodeArray(t);
};
T.setChangeListenersLoadString = function(t) {
  if (t === "NoChangeListeners")
    return;
  const e = t.split("=");
  if (e.length !== 2)
    return _("Bad format in saved data (" + t + ")");
  if (e[0] !== "ChangeListenersUsedStrings")
    return _("Expected ChangeListenersUsedStrings to be first");
  const n = I.decodeArray(e[1]);
  for (let s = 0; s < n.length; s++)
    T.changeListeners[s].oldValue = n[s].match(/^\d+$/) ? parseInt(n[s]) : n[s];
};
function le(t, e) {
  l.responseDebug && z(t), t.char || _('A call to "respond" does not have "char" set in the params.');
  const n = T.findResponse(t, e, t.extraTest);
  return n ? (t.beforeScript && t.beforeScript.bind(t.char)(t, n), n.script && n.script.bind(t.char)(t, n), n.msg && (t.char ? t.char.msg(n.msg, t) : x(n.msg, t)), !n.script && !n.msg && !n.failed && (_("No script or msg for response"), console.log(n)), t.afterScript && t.afterScript.bind(t.char)(t, n), !n.failed) : (t.afterScript && t.afterScript(t), t.noResponseNotError || (_("Failed to find a response. ASK/TELL or some other system using the respond function was given a list of options that did not have a default. Below the stack trace, you should see the parameters sent and the list of responses. The last response should have no test function (or a test function that always returns true)."), z(t), z(e)), !1);
}
function pn(t, e, n) {
  n || (n = []);
  for (let s of e)
    s.name && (t.text = s.name.toLowerCase(), s.test ? !n.includes(s) && s.test.bind(t.char)(t, s) && n.push(s) : n.includes(s) || n.push(s)), s.responses && (n = pn(t, s.responses, n));
  return n;
}
T.findResponse = function(t, e, n) {
  for (let s of e)
    if (!(n && !n.bind(t.char)(t, s)) && !(s.test && !s.test.bind(t.char)(t, s)) && !(s.regex && !t.text.match(s.regex)))
      return s.responses ? T.findResponse(t, s.responses) : s;
  return !1;
};
T.addResponse = function(t, e, n) {
  T.addResponseToList(t, e, n);
};
T.addResponseToList = function(t, e, n) {
  T.getResponseSubList(t, n).unshift(e);
};
T.getResponseSubList = function(t, e) {
  const n = t.shift();
  if (n) {
    const s = e.find((r) => r.name === n);
    if (!s)
      throw "Failed to add sub-list with " + n;
    return T.getResponseSubList(t, s.responses);
  } else
    return e;
};
T.verifyResponses = function(t, e) {
  e === void 0 && (e = 1), t[t.length - 1].test && (console.log("WARNING: Last entry at depth " + e + " has a test condition:"), console.log(t));
  for (let n of t)
    n.responses && (n.responses.length === 0 ? console.log("Zero responses at depth " + e + " for: " + n.name) : T.verifyResponses(n.responses, e + 1));
};
T.listContents = function(t, e = !0) {
  return K(this.getContents(t), { article: 1, lastSep: a.list_and, modified: e, nothing: a.list_nothing, loc: this.name });
};
T.getByInterval = function(t, e) {
  let n = 0;
  for (; n < t.length; ) {
    if (e < t[n])
      return n;
    e -= t[n], n++;
  }
  return !1;
};
T.guessMyType = function(t) {
  return t.match(/^\d+$/) && (t = parseInt(t)), t === "true" && (t = !0), t === "false" && (t = !1), t === "undefined" && (t = void 0), t;
};
T.dictionaryToCss = function(t, e) {
  const n = [];
  for (let s in t)
    n.push(s + ":" + t[s]);
  return e ? "{" + n.join(";") + "}" : n.join(";");
};
T.getNameModifiers = function(t, e) {
  if (!e.modified)
    return "";
  const n = [];
  for (let s of t.nameModifierFunctions)
    s(t, n, e);
  return t.nameModifierFunction && t.nameModifierFunction(n, e), n.length === 0 ? "" : e.noBrackets ? " " + n.join("; ") : " (" + n.join("; ") + ")";
};
T.getDateTime = function(t) {
  return l.dateTime.formats ? T.getCustomDateTime(t) : new Date(O.elapsedTime * 1e3 + O.startTime.getTime()).toLocaleString(l.dateTime.locale, l.dateTime);
};
T.getDateTimeDict = function(t) {
  return t || (t = {}), l.dateTime.formats ? T.getCustomDateTimeDict(t) : T.getStdDateTimeDict(t);
};
T.getStdDateTimeDict = function(t) {
  const e = {};
  let n = O.elapsedTime;
  t.add && (n += t.add);
  const s = new Date(n * 1e3 + O.startTime.getTime());
  return e.second = s.getSeconds(), e.minute = s.getMinutes(), e.hour = s.getHours(), e.date = s.getDate(), e.weekday = s.toLocaleString("default", { weekday: "long" }), e.month = s.toLocaleString("default", { month: "long" }), e.year = s.getFullYear(), e;
};
T.getCustomDateTimeDict = function(t) {
  const e = {};
  let n = l.dateTime.startTime + O.elapsedTime;
  t.is && (n = l.dateTime.startTime + t.is), t.add && (n += t.add);
  for (let s of l.dateTime.data)
    e[s.name] = n % s.number, n = Math.floor(n / s.number);
  return e;
};
T.getCustomDateTime = function(t) {
  t || (t = {});
  const e = T.getCustomDateTimeDict(t);
  let n = t.format ? l.dateTime.formats[t.format] : l.dateTime.formats.def;
  for (let s in l.dateTime.functions)
    n = n.replace("%" + s + "%", l.dateTime.functions[s](e));
  return n;
};
T.seconds = function(t, e = 0, n = 0, s = 0) {
  return l.dateTime.convertSeconds ? l.dateTime.convertSeconds(t, e, n, s) : ((s * 24 + n) * 60 + e) * 60 + t;
};
T.elapsed = function(t, e = 0, n = 0, s = 0) {
  return T.seconds(t, e, n, s) >= O.elapsedTime;
};
T.isAfter = function(t) {
  if (typeof t == "number")
    return O.elapsedTime > t;
  if (t.match(/^\d\d\d\d$/)) {
    const s = T.getDateTimeDict(), r = parseInt(t.substring(0, 2)), o = parseInt(t.substring(2, 4));
    return r < s.hour ? !0 : r > s.hour ? !1 : o < s.minute;
  }
  const e = new Date(O.elapsedTime * 1e3 + O.startTime.getTime()), n = Date.parse(t);
  return n ? e > n : _("Failed to parse date-time string: " + t);
};
T.changePOV = function(t, e) {
  if (typeof t == "string") {
    if (!m[t])
      return _("Failed to change POV, no object called '" + t + "'");
    t = m[t];
  } else
    t || _("Failed to change POV, char not defined.");
  g() && (g().player = !1, g().pronouns = g().npcPronouns, g().regex = new RegExp("^(" + (t.npcAlias ? t.npcAlias : t.alias) + ")$")), t.player = !0, t.npcPronouns = t.pronouns, t.pronouns = e || a.pronouns.secondperson, t.regex = new RegExp("^(me|myself|player|" + (t.npcAlias ? t.npcAlias : t.alias) + ")$"), Tt(t), Tt(t), h.update();
};
T.getObj = function(t) {
  if (!t)
    return _("Trying to find an object in util.getObj, but name is " + t);
  if (typeof t == "string") {
    const e = m[t];
    if (e === void 0)
      throw new Error("Failed to find room: " + t + ".");
    return e;
  } else {
    if (t.name === void 0)
      throw "Not sure what to do with this room: " + t + " (a " + typeof t + ").";
    return t;
  }
};
T.findUniqueName = function(t) {
  if (m[t]) {
    const e = /(\d+)$/.exec(t);
    if (!e)
      return T.findUniqueName(t + "0");
    const n = parseInt(e[0]) + 1;
    return T.findUniqueName(t.replace(/(\d+)$/, "" + n));
  } else
    return t;
};
T.findSource = function(t) {
  const e = t.fluid ? [t.fluid] : l.fluids, n = t.char ? t.char : g();
  if (n.isSourceOf) {
    for (const r of e)
      if (n.isSourceOf(r))
        return t.source = n, t.fluid = r, !0;
  }
  if (m[n.loc].isSourceOf) {
    for (const r of e)
      if (m[n.loc].isSourceOf(r))
        return t.source = m[n.loc], t.fluid = r, !0;
  }
  const s = Ct();
  for (const r of e)
    for (let o of s)
      if (o.isSourceOf && o.isSourceOf(r) || o.containedFluidName && o.containedFluidName === r)
        return t.source = o, t.fluid = r, !0;
  return !1;
};
T.multiIsUltimatelyHeldBy = function(t, e) {
  for (const n of e) {
    if (!n)
      continue;
    let s = m[n];
    if (s === t)
      return !0;
    for (; s.loc; ) {
      if (s.loc === t.name)
        return !0;
      s = m[s.loc];
    }
  }
  return !1;
};
T.testAttribute = function(t, e) {
  return typeof t[e] == "function" ? t[e]() : t[e];
};
T.getLoc = function(t, e, n) {
  e && (typeof e == "object" ? t[n] = e.name : e === "char" || e === "name" ? t[n] = t.char.name : e === "loc" && t.container ? t[n] = t.container.name : e === "loc" && t.holder ? t[n] = t.holder.name : e === "loc" ? t[n] = t.char.loc : l.placeholderLocations.includes(e) || m[e] ? t[n] = e : _("Unexpected location in util.setToFrom/util.getLoc: " + e));
};
T.setToFrom = function(t, e, n) {
  return T.getLoc(t, e, "toLoc"), T.getLoc(t, n, "fromLoc"), t;
};
T.defaultExitIsGuarded = function() {
  return !1;
};
T.defaultExitUse = function(t, e) {
  if (e || (e = this), t.testMove && !t.testMove(e) || e.isGuarded())
    return !1;
  if (e.isLocked())
    return L(e.lockedmsg ? e.lockedmsg : a.locked_exit, { char: t, exit: e });
  if (e.testExit && !e.testExit(t, e))
    return !1;
  for (const n of t.getCarrying())
    if (n.testCarry && !n.testCarry({ char: t, item: n, exit: e }))
      return !1;
  return this.simpleUse ? this.simpleUse(t) : T.defaultSimpleExitUse(t, e);
};
T.defaultSimpleExitUse = function(t, e) {
  return e.name === "_" ? _('Trying to move character to location "_" from room ' + e.origin.name + '. This is probably a bug, as "_" is used to flag a destination that cannot be reached.') : (e === void 0 && (e = this), t.msg(a.stop_posture(t)), t.movingMsg(e), t.moveChar(e), !0);
};
T.useWithDoor = function(t) {
  const e = m[this.door];
  e === void 0 && _("Not found an object called '" + this.door + "'. Any exit that uses the 'util.useWithDoor' function must also set a 'door' attribute.");
  const n = { char: t, doorName: this.doorName ? this.doorName : "door" };
  return e.closed ? e.locked ? e.testKeys(t) ? (e.closed = !1, e.locked = !1, x(a.unlock_and_enter, n), t.moveChar(this), !0) : (x(a.try_but_locked, n), !1) : (e.closed = !1, x(a.open_and_enter, n), t.moveChar(this), !0) : (t.moveChar(this), !0);
};
T.cannotUse = function(t, e) {
  const n = { char: t };
  return x(this.msg ? this.msg : a.try_but_locked, n), !1;
};
T.hiddenIfNoTransit = function() {
  return m[this.name].transitCurrentLocation !== this.origin.name;
};
T.commandsToTest = [
  // saying
  {
    name: "say",
    withText: !0
  },
  {
    name: "cry",
    withText: !0,
    onOwn: !0
  },
  {
    name: "shout",
    withText: !0,
    onOwn: !0
  },
  {
    name: "scream",
    withText: !0,
    onOwn: !0
  },
  {
    name: "pray",
    onOwn: !0
  },
  {
    name: "sing",
    onOwn: !0
  },
  {
    name: "dance",
    onOwn: !0
  },
  // resting
  {
    name: "rest",
    onOwn: !0
  },
  {
    name: "sit",
    onOwn: !0,
    withItem: !0
  },
  {
    name: "sleep",
    onOwn: !0
  },
  // attacking
  {
    name: "hit",
    withItem: !0
  },
  {
    name: "attack",
    withItem: !0
  },
  {
    name: "punch",
    withItem: !0
  },
  {
    name: "pick",
    withItem: !0
  },
  {
    name: "scratch",
    withItem: !0
  },
  // moving
  {
    name: "swim",
    onOwn: !0,
    withItem: !0
  },
  {
    name: "dive"
  },
  {
    name: "climb",
    onOwn: !0,
    withItem: !0
  },
  {
    name: "jump",
    onOwn: !0,
    withItem: !0
  },
  // sensing
  {
    name: "touch",
    withItem: !0
  },
  {
    name: "look behind",
    withItem: !0
  },
  {
    name: "look under",
    withItem: !0
  },
  {
    name: "search",
    onOwn: !0,
    withItem: !0
  },
  {
    name: "hear",
    onOwn: !0,
    withItem: !0
  },
  {
    name: "smell",
    onOwn: !0,
    withItem: !0
  },
  // mental
  {
    name: "think",
    onOwn: !0
  },
  {
    name: "think about",
    withText: !0
  },
  {
    name: "remember",
    onOwn: !0,
    withItem: !0,
    withText: !0
  },
  // rude (beause some people will try it)
  {
    name: "piss",
    onOwn: !0,
    rude: "p***"
  },
  {
    name: "fuck",
    onOwn: !0,
    withItem: !0,
    rude: "f***"
  },
  {
    name: "fart",
    onOwn: !0,
    rude: "p***"
  },
  // misc
  {
    name: "dig"
  },
  {
    name: "undress",
    onOwn: !0,
    withItem: !0
  },
  {
    name: "kiss",
    withItem: !0
  },
  {
    name: "comfort",
    withItem: !0
  },
  {
    name: "hints",
    onOwn: !0
  },
  {
    name: "plugh",
    onOwn: !0
  },
  {
    name: "xyzzy",
    onOwn: !0
  },
  // check the scenery
  {
    name: "x sky",
    onOwn: !0
  },
  {
    name: "x floor",
    onOwn: !0
  },
  {
    name: "x wall",
    onOwn: !0
  }
];
T.testme = function(t) {
  z("-------------------------------------"), z("Testing implementation of odd commands, using " + t.name), R.testing = !0;
  for (const e of T.commandsToTest)
    e.onOwn && (R.testOutput = [], f.parse(e.name), R.testOutput[0] === a.not_known_msg && z("No command to handle " + e.name.toUpperCase())), e.withText && (R.testOutput = [], f.parse(e.name + " some text"), R.testOutput[0] === a.not_known_msg && z("No command to handle " + e.name.toUpperCase() + " <text>")), e.withItem && (R.testOutput = [], f.parse(e.name + " " + t.alias), R.testOutput[0] === a.not_known_msg && z("No command to handle " + e.name.toUpperCase() + " <item>"));
  R.testing = !1;
};
function eo() {
  h.init(), l.performanceLog("World initiated"), u.init(), l.performanceLog("io.init completed");
}
const l = {
  performanceLogStartTime: performance.now(),
  // Also title, author, thanks (option; array)
  // Files
  lang: "lang-en",
  // Set to the language file of your choice
  customExits: !1,
  // Set to true to use custom exits, in exits.js
  // files:["code", "data"], // Additional files to load
  // libraries:[
  //     "_file_saver",
  //     "_saveload",
  //     "_text",
  //     "_io",
  //     "_command",
  //     "_defaults",
  //     "_templates",
  //     "_world",
  //     "_npc",
  //     "_parser",
  //     "_commands"
  // ],  // util already loaded
  // customLibraries:[],
  imagesFolder: "assets/images/",
  iconsFolder: "assets/icons/",
  soundsFolder: "assets/audio/",
  videosFolder: "assets/video/",
  cssFolder: "assets/css/",
  themes: ["sans-serif"],
  styleFile: "style",
  soundsFileExt: ".mp3",
  // The side panes
  panes: "left",
  //Can be set to Left, Right or None (setting PANES to None will more than double the speed of your game!)
  panesCollapseAt: 700,
  compassPane: !0,
  // Set to true to have a compass world.
  symbolsForCompass: !0,
  statusPane: "Status",
  // Title of the panel; set to false to turn off
  statusWidthLeft: 120,
  // How wide the left column is in the status pane
  statusWidthRight: 40,
  // How wide the right column is in the status pane
  status: [
    function() {
      return "<td>Health points:</td><td>" + g().hitpoints + "</td>";
    }
  ],
  customPaneFunctions: {},
  // Functions for the side panes lists
  isHeldNotWorn: function(t) {
    return t.isAtLoc(g().name, h.SIDE_PANE) && h.ifNotDark(t) && !t.getWorn();
  },
  isHere: function(t) {
    return t.isAtLoc(g().loc, l.sceneryInSidePane ? h.PARSER : h.SIDE_PANE) && h.ifNotDark(t);
  },
  isWorn: function(t) {
    return t.isAtLoc(g().name, h.SIDE_PANE) && h.ifNotDark(t) && t.getWorn();
  },
  // Other UI settings
  textInput: !0,
  // Allow the player to type commands
  cursor: ">",
  // The cursor, obviously
  cmdEcho: !0,
  // Commands are printed to the screen
  textEffectDelay: 25,
  roomTemplate: [
    "#{cap:{hereName}}",
    "{terse:{hereDesc}}",
    "{objectsHere:You can see {objects} here.}",
    "{exitsHere:You can go {exits}.}",
    "{ifNot:settings:playMode:play:{ifExists:currentLocation:todo:{class:todo:{show:currentLocation:todo}}}}"
  ],
  silent: !1,
  walkthroughMenuResponses: [],
  startingDialogEnabled: !1,
  darkModeActive: !1,
  // setting to true is a bad idea (use io.toggleDarkMode)
  plainFontModeActive: !1,
  // setting to true is a bad idea (use io.togglePlainFontMode)
  narrowMode: 0,
  mapAndImageCollapseAt: 1200,
  funcForDisambigMenu: "showMenuWithNumbers",
  eventFunctions: {},
  timerInterval: 1e3,
  // For timer events, in milliseconds
  // Conversations settings
  noTalkTo: "TALK TO is not a feature in this game.",
  noAskTell: "ASK/TELL ABOUT is not a feature in this game.",
  npcReactionsAlways: !1,
  turnsQuestionsLast: 5,
  givePlayerSayMsg: !0,
  givePlayerAskTellMsg: !0,
  funcForDynamicConv: "showMenu",
  // Other game play settings
  failCountsAsTurn: !1,
  lookCountsAsTurn: !1,
  beforeEnter: function() {
  },
  afterEnter: function() {
  },
  // When save is disabled, objects can be created during game play
  saveDisabled: !1,
  // Date and time settings
  dateTime: {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    secondsPerTurn: 60,
    locale: "en-GB",
    start: /* @__PURE__ */ new Date("February 14, 2019 09:43:00")
  },
  // Other settings
  // The parser will convert "two" to 2" in player input (can slow down the game)
  convertNumbersInParser: !0,
  tests: !1,
  maxUndo: 10,
  moneyFormat: "$!",
  questVersion: "1.4.0",
  mapStyle: { right: "0", top: "200px", width: "300px", height: "300px", "background-color": "beige" },
  openQuotation: "'",
  closeQuotation: "'",
  fluids: [],
  getDefaultRoomHeading: function(t) {
    return B(a.addDefiniteArticle(t, { ignorePossessive: "noLink" }) + t.alias);
  },
  afterFinish: [],
  roomSetList: {},
  placeholderLocations: [],
  modulesToEndTurn: [],
  saveLoadExcludedAtts: [
    "name",
    "ensembleMembers",
    "clonePrototype",
    "saveLoadExcludedAtts",
    "startTime",
    "verbFunctions",
    "pronouns",
    "nameModifierFunctions",
    "afterEnterIf",
    "askOptions",
    "tellOptions",
    "regex",
    "reactions",
    "receiveItems",
    "scopeStatus"
  ],
  getLocationDescriptionAttName: function() {
    return O.dark ? "darkDesc" : "desc";
  },
  statsData: [
    { name: "Objects", test: function(t) {
      return !0;
    } },
    { name: "Locations", test: function(t) {
      return t.room;
    } },
    { name: "Items", test: function(t) {
      return !t.room;
    } },
    { name: "Takeables", test: function(t) {
      return t.takeable;
    } },
    { name: "Scenery", test: function(t) {
      return t.scenery;
    } },
    { name: "NPCs", test: function(t) {
      return t.npc && !t.player;
    } }
  ],
  performanceLog: function() {
  },
  // This is split out for io.showInTab to use
  loadCssFiles: function(t = document, e = "") {
    l.loadCssFile(l.cssFolder + "default.css", t, e);
    for (let n of l.themes)
      l.loadCssFile(l.cssFolder + n + ".css", t, e);
    l.loadCssFile(l.folder + l.styleFile + ".css", t, e);
  },
  loadCssFile: function(t, e = document, n = "") {
    const s = document.createElement("link");
    s.href = n + t, s.type = "text/css", s.rel = "stylesheet", s.media = "screen,print", e.head.appendChild(s);
  }
};
l.performanceLogStart = function() {
  l.performanceLogStartTime = performance.now();
};
l.performanceLog = function(t) {
  if (!l.performanceLogging)
    return;
  const e = Math.round(performance.now() - l.performanceLogStartTime).toString().padStart(4);
  console.log(t.padEnd(32) + e);
};
l.inventoryPane = [
  { name: "Items Held", alt: "itemsHeld", test: l.isHeldNotWorn, getLoc: function() {
    return g().name;
  } },
  { name: "Items Worn", alt: "itemsWorn", test: l.isWorn, getLoc: function() {
    return g().name;
  } },
  { name: "Items Here", alt: "itemsHere", test: l.isHere, getLoc: function() {
    return g().loc;
  } }
];
l.setUpDialogClick = function() {
  l.startingDialogEnabled = !1, u.enable(), l.startingDialogOnClick(), h.begin(), l.textInput && document.querySelector("#textbox").focus(), document.querySelector("#dialog").style.display = "none";
};
l.setUpDialog = function() {
  const t = document.querySelector("#dialog");
  document.querySelector("#dialog-title").innerHTML = l.startingDialogTitle, document.querySelector("#dialog-content").innerHTML = l.startingDialogHtml, l.startingDialogButton && (document.querySelector("#dialog-button").innerHTML = l.startingDialogButton), document.querySelector("#dialog-button").addEventListener("click", l.setUpDialogClick), u.disable(), t.show(), t.style.display = "block", t.style.width = l.startingDialogWidth + "px", t.style.height = "auto", t.style.top = "100px";
};
const a = {
  regex: {
    //----------------------------------------------------------------------------------------------
    // Regular Expressions for Commands
    // Meta commands
    MetaUnfinish: /^unfinish?$/,
    MetaHello: /^(?:hello|hi|yo)$|^\?$/,
    MetaHelp: /^help$|^\?$/,
    MetaHint: /^(?:hint|clue)s?$/,
    MetaCredits: /^(?:about|credits|version|info)$/,
    MetaDarkMode: /^(?:dark|dark mode|toggle dark|toggle dark mode)$/,
    MetaAutoScrollMode: /^(?:scroll|autoscroll|toggle scroll|toggle autoscroll)$/,
    MetaNarrowMode: /^(?:narrow|narrow mode|toggle narrow|toggle narrow mode|mobile|mobile mode|toggle mobile|toggle mobile mode)$/,
    MetaPlainFontMode: /^(?:font|plain font|plain fonts|fonts)$/,
    MetaWarnings: /^warn(?:ing|ings|)$/,
    MetaImages: /^images$/,
    MetaSilent: /^(?:sh|silent)$/,
    MetaSpoken: /^spoken$/,
    MetaIntro: /^intro$/,
    MetaBrief: /^brief$/,
    MetaTerse: /^terse$/,
    MetaVerbose: /^verbose$/,
    MetaTranscript: /^transcript$|^script$/,
    MetaTranscriptStart: /^transcript on$|^script start$/,
    MetaTranscriptOn: /^transcript on$|^script on$/,
    MetaTranscriptOff: /^transcript off$|^script off$/,
    MetaTranscriptClear: /^transcript clear$|^script clear$|^transcript delete$|^script delete$/,
    MetaTranscriptShow: /^transcript show$|^script show$|^show script$|^show transcript$|^showscript$/,
    MetaTranscriptWalkthrough: /^(?:transcript|script) walk$/,
    MetaUserComment: /^(?:\*|\;)(.+)$/,
    MetaSave: /^save$/,
    MetaSaveGame: /^(?:save) (.+)$/,
    MetaFileSaveGame: /^(?:fsave) (.+)$/,
    MetaSaveOverwriteGame: /^(?:save) (.+) (?:overwrite|ow)$/,
    MetaLoad: /^(?:load|reload|restore)$/,
    MetaLoadGame: /^(?:load|reload|restore) (.+)$/,
    MetaFileLoadGame: /^(?:fload|freload|frestore)$/,
    MetaDir: /^(?:reload|load|restore|dir|directory|ls|save ls|save dir)$/,
    MetaDeleteGame: /^(?:delete|del) (.+)$/,
    MetaUndo: /^undo$/,
    MetaAgain: /^(?:again|g)$/,
    MetaOops: /^(?:oops)$/,
    MetaRestart: /^restart$/,
    MetaScore: /^score$/,
    MetaPronouns: /^pronouns$/,
    MetaTopicsNote: /^topics?$/,
    // Kind of meta
    Look: /^l$|^look$|^describe (?:room|the room|location|the location|where i am|here)$/,
    Exits: /^exits$/,
    Map: /^map$/,
    Inv: /^inventory$|^inv$|^i$/,
    // Misc
    Wait: /^wait$|^z$/,
    Smell: /^smell$|^sniff$/,
    Listen: /^listen$/,
    PurchaseFromList: /^buy$|^purchase$/,
    // Use item
    Examine: /^(?:examine|exam|ex|x|describe) (.+)$/,
    LookAt: /^(?:look at|look|l) (.+)$/,
    LookOut: /^(?:look out of|look out) (.+)$/,
    LookBehind: /^(?:look behind|check behind) (.+)$/,
    LookUnder: /^(?:look under|check under) (.+)$/,
    LookInside: /^(?:look inside|look in) (.+)$/,
    LookThrough: /^(?:look|peek|peer) (?:down|through) (.+)$/,
    Search: /^(?:search) (.+)$/,
    Take: /^(?:take|get|pick up|pick|t|grab) (.+)$/,
    Drop: /^(?:drop|d|discard) (.+)$/,
    Wear2: /^put (?:my |your |his |her |)(.+) on$/,
    Wear: /^(?:wear|don|put on) (?:my |your |his |her |)(.+)$/,
    Remove: /^(?:remove|doff|take off|unwear) (?:my |your |his |her |)(.+)$/,
    Remove2: /^take (?:my |your |his |her |)(.+) off$/,
    Read: /^(?:read|r) (.+)$/,
    SmellItem: /^(?:smell|sniff) (.+)$/,
    ListenToItem: /^(?:listen to|listen) (.+)$/,
    Purchase: /^(?:purchase|buy) (.+)$/,
    Sell: /^(?:sell) (.+)$/,
    Smash: /^(?:smash|break|destroy|burst|pierce|puncture|bust) (.+)$/,
    Turn: /^(?:turn|rotate|twist) (.+)$/,
    TurnLeft: /^(?:turn|rotate|twist) (.+) (?:left|anticlockwise|anti-clockwise|widdershins)$/,
    TurnRight: /^(?:turn|rotate|twist) (.+) (?:right|clockwise)$/,
    SwitchOn: /^(?:turn on|switch on|active|enable) (.+)$/,
    SwitchOn2: /^(?:turn|switch) (.+) on$/,
    SwitchOff2: /^(?:turn|switch|deactivate|disable) (.+) off$/,
    SwitchOff: /^(?:turn off|switch off) (.+)$/,
    Open: /^(?:open) (.+)$/,
    OpenWith: [
      /^(?:open) (.+) (?:with|using) (.+)$/,
      { regex: /^(?:use|with|using) (.+?) (?:to open|open) (.+)$/, mod: { reverse: !0 } }
    ],
    Close: /^(?:close) (.+)$/,
    Lock: /^(?:lock) (.+)$/,
    LockWith: [
      /^(?:lock) (.+) (?:with|using) (.+)$/,
      { regex: /^(?:use|with|using) (.+?) (?:to lock|lock) (.+)$/, mod: { reverse: !0 } }
    ],
    Unlock: /^(?:unlock) (.+)$/,
    UnlockWith: [
      /^(?:unlock) (.+) (?:with|using) (.+)$/,
      { regex: /^(?:use|with|using) (.+?) (?:to unlock|unlock) (.+)$/, mod: { reverse: !0 } }
    ],
    Push: /^(?:push|press) (.+)$/,
    Pull: /^(?:pull|drag) (.+)$/,
    Fill: /^(?:fill) (.+)$/,
    Empty: /^(?:empty|discharge|decant|pour out|pour) (.+)$/,
    Eat: /^(eat|feed on|feed|partake of|partake|dine on|dine) (.+)$/,
    Drink: /^(drink|imbibe|quaff|guzzle|knock back|swig|swill|sip|down|chug) (.+)$/,
    Ingest: /^(consume|swallow|ingest) (.+)$/,
    Sit: /^(?:sit down|sit)$/,
    Recline: /^(?:recline|lie down|lie)$/,
    SitOn: /^(?:sit on|sit upon|sit) (.+)$/,
    StandOn: /^(?:stand on|stand upon|stand) (.+)$/,
    ReclineOn: /^(?:recline on|recline upon|recline|lie on|lie upon|lie) (.+)$/,
    GetOff: /^(?:get off|off) (.+)$/,
    Use: /^(?:use) (.+)$/,
    TalkTo: /^(?:talk to|talk|speak to|speak|converse with|converse) (.+)$/,
    Topics: /^topics? (?:for )?(.+)$/,
    Make: /^(?:make|build|construct) (.+)$/,
    MakeWith: [
      /^(?:make|build|construct) (.+) (?:with|from|using) (.+)$/,
      { regex: /^(?:with:from|using) (.+) (?:make|build|construct) (.+)$/, mod: { reverse: !0 } },
      { regex: /^(?:use) (.+) to (?:make|build|construct) (.+)$/, mod: { reverse: !0 } }
    ],
    NpcMake: [
      /^(.+), ?(?:make|build|construct) (.+)$/,
      /^(?:tell|ask|instruct) (.+) to (?:make|build|construct) (.+)$/
    ],
    NpcMakeWith: [
      /^(.+), ?(?:make|build|construct) (.+) (?:with|from|using) (.+)$/,
      /^(?:tell|ask|instruct) (.+) to (?:make|build|construct) (.+) (?:with|from|using) (.+)$/,
      { regex: /^(.+), ?(?:with:from|using) (.+) (?:make|build|construct) (.+)$/, mod: { reverse: !0 } },
      { regex: /^(?:tell|ask|instruct) (.+) to (?:with:from|using) (.+) (?:make|build|construct) (.+)$/, mod: { reverse: !0 } },
      { regex: /^(.+), ?(?:use) (.+) to (?:make|build|construct) (.+)$/, mod: { reverse: !0 } },
      { regex: /^(?:tell|ask|instruct) (.+) to (?:use) (.+) to (?:make|build|construct) (.+)$/, mod: { reverse: !0 } }
    ],
    GoInItem: /^(?:enter|go in|in|inside|go inside|climb in|climb inside|get in|get inside) (.+)$/,
    GoOutItem: /^(?:exit|go out|out|outside|go outide|leave) (.+)$/,
    GoUpItem: /^(?:go up|up|climb up|climb|ascend) (.+)$/,
    GoDownItem: /^(?:go down|down|climb down|descend) (.+)$/,
    GoThroughItem: /^(?:go through|walk through) (.+)$/,
    NpcGoInItem: [
      /^(.+), ?(?:enter|go in|in|inside|go inside|climb in|climb inside|get in|get inside) (.+)$/,
      /^(?:tell|ask|instruct) (.+) to (?:enter|go in|in|inside|go inside|climb in|climb inside|get in|get inside) (.+)$/
    ],
    NpcGoOutItem: [
      /^(.+), ?(?:exit|go out|out|outside|go outide|leave) (.+)$/,
      /^(?:tell|ask|instruct) (.+) to (?:exit|go out|out|outside|go outide|leave) (.+)$/
    ],
    NpcGoUpItem: [
      /^(.+), ?(?:go up|up|climb up|climb|ascend) (.+)$/,
      /^(?:tell|ask|instruct) (.+) to (?:go up|up|climb up|climb|ascend) (.+)$/
    ],
    NpcGoDownItem: [
      /^(.+), ?(?:go down|down|climb down|descend) (.+)$/,
      /^(?:tell|ask|instruct) (.+) to (?:go down|down|climb down|descend) (.+)$/
    ],
    NpcGoThroughItem: [
      /^(.+), ?(?:go through|walk through) (.+)$/,
      /^(?:tell|ask|instruct) (.+) to (?:go through|walk through) (.+)$/
    ],
    // Misc again
    Say: /^(say|shout|whisper|holler|scream|yell) (.+)$/,
    Stand: /^stand$|^stand up$|^get up$/,
    NpcStand: [/^(.+), ?(?:stand|stand up|get up)$/, /^(?:tell|ask|instruct) (.+) to (?:stand|stand up|get up)$/],
    GetFluid: /^(?:get|take|scoop|pick|grab)(?:| up) (.+)$/,
    FillWith: /^(?:fill) (.+) (?:with) (.+)$/,
    NpcFillWith: [/^(.+), ?(?:fill) (.+) (?:with) (.+)$/, /^(?:tell|ask|instruct) (.+) to (?:fill) (.+) (?:with) (.+)$/],
    EmptyInto: /^(?:empty|pour out|pour|discharge|decant) (.+) (?:into|in to|in|down|onto|on to|on) (.+)$/,
    NpcEmptyInto: [/^(.+), ?(?:empty|pour|discharge|decant) (.+) (?:into|in to|in|down|onto|on to|on) (.+)$/, /^(?:tell|ask|instruct) (.+) to (?:empty|pour|discharge) (.+) (?:into|in to|in|down|onto|on to|on) (.+)$/],
    EmptyFluidInto: /^(?:empty|pour out|pour|discharge|decant) (.+) (?:into|in to|in|down|onto|on to|on) (.+)$/,
    NpcEmptyFluidInto: [/^(.+), ?(?:empty|pour|discharge|decant) (.+) (?:into|in to|in|down|onto|on to|on) (.+)$/, /^(?:tell|ask|instruct) (.+) to (?:empty|pour|discharge) (.+) (?:into|in to|in|down|onto|on to|on) (.+)$/],
    PutFluidIn: /^(?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
    PutIn: /^(?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
    NpcPutIn: [/^(.+), ?(?:put|place|drop|insert) (.+) (?:in to|into|in|on to|onto|on) (.+)$/, /^(?:tell|ask|instruct) (.+) to (?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/],
    TakeOut: /^(?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/,
    NpcTakeOut: [/^(.+), ?(?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/, /^(?:tell|ask|instruct) (.+) to (?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/],
    GiveTo: /^(?:give|offer|proffer) (.+) (?:to) (.+)$/,
    NpcGiveTo: [/^(.+), ?(?:give|offer|proffer) (.+) (?:to) (.+)$/, /^(?:tell|ask|instruct) (.+) to ?(?:give|offer|proffer) (.+) (?:to) (.+)$/],
    Give: /^(?:give|offer|proffer) (.+)$/,
    NpcGive: [/^(.+), ?(?:give|offer|proffer) (.+)$/, /^(?:tell|ask|instruct) (.+) to ?(?:give|offer|proffer) (.+)$/],
    //NpcGiveToMe:[/^(.+), ?(?:give) me (.+)$/, /^(?:tell|ask|instruct) (.+) to ?(?:give) me (.+)$/],
    TieUp: /^(?:tie|fasten|attach|connect|hook) (.+)$/,
    TieTo: /^(?:tie|fasten|attach|connect|hook) (.+) (?:to) (.+)$/,
    NpcTieUp: [/^(.+), ?(?:tie|fasten|attach|connect|hook) (.+)$/, /^(?:tell|ask|instruct) (.+) to ?(?:tie|fasten|attach) (.+)$/],
    NpcTieTo: [/^(.+), ?(?:tie|fasten|attach|connect|hook) (.+) (?:to) (.+)$/, /^(?:tell|ask|instruct) (.+) to ?(?:tie|fasten|attach) (.+) (?:to) (.+)$/],
    Untie: /^(?:untie|unfasten|detach|disconnect|unhook) (.+)$/,
    NpcUntie: [/^(.+), ?(?:untie|unfasten|detach|disconnect|unhook) (.+)$/, /^(?:tell|ask|instruct) (.+) to ?(?:untie|unfasten|detach) (.+)$/],
    UntieFrom: /^(?:untie|unfasten|detach) (.+) (?:from) (.+)$/,
    NpcUntieFrom: [/^(.+), ?(?:untie|unfasten|detach) (.+) (?:frm) (.+)$/, /^(?:tell|ask|instruct) (.+) to ?(?:untie|unfasten|detach) (.+) (?:from) (.+)$/],
    UseWith: /^(?:use) (.+) (?:with|on) (.+)$/,
    LookExit: /^(?:look|peer|l|glance) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
    PushExit: /^(push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
    NpcPushExit: [
      /^(.+), ?(push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
      /^(?:tell|ask|instruct) (.+) to (push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/
    ],
    AskAbout: /^(?:ask) (.+?) (about|what|who|how|why|where|when) (.+)$/,
    TellAbout: /^(?:tell) (.+?) (about|what|who|how|why|where|when) (.+)$/,
    TalkAbout: [
      /^(?:talk to|talk with|talk|speak to|speak with|speak) (.+?) about (what|who|how|why|where|when) (.+)$/,
      /^(?:talk to|talk with|talk|speak to|speak with|speak) (.+?) (about|what|who|how|why|where|when) (.+)$/
    ],
    FollowMe: [/^(.+), ?(?:follow|follow me)$/, /^(?:tell|ask|instruct) (.+) to (?:follow|follow me)$/],
    WaitHere: [
      /^(.+), ?(?:stop follow|stop following|stop follow me|stop following me|wait|wait here|stay|stay here)$/,
      /^(?:tell|ask|instruct) (.+) to (?:stop follow|stop following|stop follow me|stop following me|wait|wait here|stay|stay here)$/
    ],
    //Debug
    DebugWalkThrough: /^wt (.+)$/,
    DebugInspect: /^inspect (.+)$/,
    DebugInspectByName: /^inspect2 (.+)$/,
    DebugWarpName: /^warp (.+)$/,
    DebugTest: /^test$/,
    DebugInspectCommand: /^(?:cmd|command) (.+)$/,
    DebugListCommands: /^(?:cmd|command)s$/,
    DebugListCommands2: /^(?:cmd|command)s2$/,
    DebugParserToggle: /^parser$/,
    DebugStats: /^stats?$/,
    DebugHighlight: /^highlight$/
  },
  // This will be added to the start of the regex of a command to make an NPC command
  // The saved capture group is the NPC's name
  tell_to_prefixes: {
    1: "(?:tell|ask|instruct) (.+) to ",
    // TELL KYLE TO GET SPOON
    2: "(.+), ?"
    // KYLE, GET SPOON
  },
  //----------------------------------------------------------------------------------------------
  // Standard Responses
  // TAKEABLE
  take_successful: "{nv:char:take:true} {nm:item:the}{ifIs:params:excess:true:, that is all there is}.",
  take_successful_counted: "{nv:char:take:true} {number:count} {nm:item}.",
  drop_successful: "{nv:char:drop:true} {nm:item:the}{ifIs:params:excess:true:, that is all {nv:char:have}}.",
  drop_successful_counted: "{nv:char:drop:true} {number:count} {nm:item}.",
  cannot_take: "{multi}{pv:char:can't:true} take {ob:item}.",
  cannot_drop: "{multi}{pv:char:can't:true} drop {ob:item}.",
  not_carrying: "{multi}{pv:char:don't:true} have {if:item:countable:any:{ob:item}}.",
  already_have: "{multi}{pv:char:'ve:true} got {ob:item} already.",
  cannot_take_component: "{multi}{pv:char:can't:true} take {ob:item}; {pv:item:be} part of {nm:whole:the}.",
  // EDIBLE
  eat_successful: "{nv:char:eat:true} {nm:item:the}.",
  drink_successful: "{nv:char:drink:true} {nm:item:the}.",
  cannot_eat: "{nv:item:be:true} not something {nv:char:can} eat.",
  cannot_drink: "{nv:item:be:true} not something {nv:char:can} drink.",
  cannot_ingest: "{nv:item:be:true} not something {nv:char:can} ingest.",
  // WEARABLE
  wear_successful: "{nv:char:put:true} on {nm:item:the}.",
  remove_successful: "{nv:char:take:true} {nm:item:the-pa::char} off.",
  cannot_wear: "{multi}{nv:char:can't:true} wear {ob:item}.",
  cannot_wear_ensemble: "{multi}Individual parts of an ensemble must be worn and removed separately.",
  not_wearing: "{multi}{nv:char:be:true} not wearing {ob:item}.",
  cannot_wear_over: "{nv:char:can't:true} put {nm:item:the} on over {pa:char} {nm:outer}.",
  cannot_remove_under: "{nv:char:can't:true} take off {pa:char} {nm:item} whilst wearing {pa:char} {nm:outer}.",
  already_wearing: "{multi}{nv:char:be:true} already wearing {ob:item}.",
  invWearingPrefix: "wearing",
  invHoldingPrefix: "holding",
  // CONTAINER, etc.
  open_successful: "{nv:char:open:true} {nm:container:the}.",
  close_successful: "{nv:char:close:true} {nm:container:the}.",
  lock_successful: "{nv:char:lock:true} {nm:container:the}.",
  unlock_successful: "{nv:char:unlock:true} {nm:container:the}.",
  close_and_lock_successful: "{nv:char:close:true} {nm:container:the} and {cj:char:lock} {sb:container}.",
  cannot_open: "{nv:item:can't:true} be opened.",
  cannot_open_with: "{nv:player:can't:true} open that with {nm:secondItem:the}.",
  cannot_lock_with: "{nv:player:can't:true} lock that with {nm:secondItem:the}.",
  cannot_unlock_with: "{nv:player:can't:true} unlock that with {nm:secondItem:the}.",
  cannot_close: "{nv:item:can't:true} be closed.",
  cannot_lock: "{nv:char:can't:true} lock {ob:item}.",
  cannot_unlock: "{nv:char:can't:true} unlock {ob:item}.",
  not_container: "{nv:container:be:true} not a container.",
  not_container_not_vessel: "{nv:container:be:true} not a container. It is a vessel, they are different, alright?",
  container_recursion: "What? {nv:char:want:true} to put {nm:item:the} in {nm:container:the} when {nm:container:the} is already in {nm:item:the}? That's just too freaky for me.",
  not_inside: "{nv:item:be:true} not inside that.",
  locked: "{nv:container:be:true} locked.",
  no_key: "{nv:char:do:true} not have the right key.",
  locked_exit: "That way is locked.",
  open_and_enter: "{nv:char:open:true} the {show:doorName} and walk through.",
  unlock_and_enter: "{nv:char:unlock:true} the {show:doorName}, open it and walk through.",
  try_but_locked: "{nv:char:try:true} the {show:doorName}, but it is locked.",
  container_closed: "{nv:container:be:true} closed.",
  inside_container: "{nv:item:be:true} inside {nm:container:the}.",
  look_inside: "Inside {nm:container:the} {nv:char:can} see {show:list}.",
  look_inside_it: "Inside {sb:container} {nv:char:can} see {show:list}.",
  // MECHANDISE
  purchase_successful: "{nv:char:buy:true} {nm:item:the} for {money:money}.",
  sell_successful: "{nv:char:sell:true} {nm:item:the} for {money:money}.",
  cannot_purchase_again: "{nv:char:can't:true} buy {nm:item:the} here - probably because {pv:char:be} already holding {ob:item}.",
  cannot_purchase_here: "{nv:char:can't:true} buy {nm:item:the} here.",
  cannot_afford: "{nv:char:can't:true} afford {nm:item:the} (need {money:money}).",
  cannot_sell_here: "{nv:char:can't:true} sell {nm:item:the} here.",
  // BACKDROP
  default_scenery: "It's just part of the scenery, nothing to worry abot.",
  // FURNITURE
  sit_on_successful: "{nv:char:sit:true} on {nm:item:the}.",
  stand_on_successful: "{nv:char:stand:true} on {nm:item:the}.",
  recline_on_successful: "{nv:char:lie:true} down on {nm:item:the}.",
  cannot_stand_on: "{nv:item:be:true} not something {nv:char:can} stand on.",
  cannot_sit_on: "{nv:item:be:true} not something {nv:char:can} sit on.",
  cannot_recline_on: "{nv:item:be:true} not something {nv:char:can} lie on.",
  no_sit_object: "There is nothing to sit on here.",
  no_recline_object: "There is nothing to lie down on here.",
  // SWITCHABLE
  switch_on_successful: "{nv:char:switch:true} {nm:item:the} on.",
  switch_off_successful: "{nv:char:switch:true} {nm:item:the} off.",
  cannot_switch_on: "{nv:char:can't:true} turn {ob:item} on.",
  cannot_switch_off: "{nv:char:can't:true} turn {ob:item} off.",
  // VESSEL
  fill_successful: "{nv:char:fill:true} {nm:item:the}.",
  empty_into_successful: "{nv:char:empty:true} {nm:source:the} into {nm:item:the}.",
  empty_onto_successful: "{nv:char:empty:true} {nm:source:the} over {nm:item:the}, and then watch it all run down on to the ground.",
  empty_successful: "{nv:char:empty:true} {nm:source:the} onto the ground, and it soaks away.",
  already_empty: "{nv:source:be:true} already empty.",
  cannot_fill: "{nv:item:be:true} not something {nv:char:can} fill.",
  cannot_mix: "{nv:item:be:true} not something {nv:char:can} mix liquids in.",
  not_vessel: "{pv:item:be:true} not a vessel.",
  not_sink: "Trying to put a liquid (or similar substance) in {nm:item:the} is just going to cause a mess.",
  not_source: "{pv:source:be:true} not something {nv:char:can} get a liquid (or similar substance) out of.",
  cannot_get_fluid: "{nv:char:try:true} to scoop up {show:fluid} but it all slips through {pa:char} fingers. Perhaps {pv:char:need} some kind of vessel.",
  no_fluid_here: "There's no {show:fluid} here.",
  no_fluid_here_at_all: "There's nothing to fill anything with here.",
  not_a_fluid_here: "I don't know of a liquid (or similar substance) called {show:text}.",
  already_full: "{pv:item:be:true} already full of {show:fluid}.",
  pour_into_self: "It is not possible to pour from a vessel into the same vessel!",
  no_generic_fluid_here: "There's nothing to fill {sb:item} with here.",
  not_carrying_fluid: "{nv:char:be:true} not carrying anything with {show:fluid} in it.",
  // VESSEL (but source is referred to as "item" as it is caught by the general item handling)
  cannot_empty: "{nv:item:be:true} not something {nv:char:can} empty.",
  // CONSTRUCTION
  component_wrong: "{nv:char:cannot:true} make {nm:item:a} from {nm:wrong:a}.",
  component_missing: "{nv:char:need:true} {nm:missing:a} to build {nm:item:a}.",
  construction_done: "{nv:char:build:true} {nm:item:a} from {show:list}.",
  construction_already: "{nm:item:the:true} has already been made.",
  // NPC
  not_npc: "{nv:char:can:true} tell {nm:item:the} to do anything {pv:char:like}, but there is no way {pv:item:'ll} do it.",
  not_npc_for_give: "Realistically, {nv:item:be} not interested in anything {sb:char} might give {ob:item}.",
  not_interested_for_give: "{nv:npc:be:true} not interested in {nm:item:the}.",
  cannot_follow: "'Follow me,' {nv:char:say} to {nm:npc:the}. Being an inanimate object, {nv:char:be} not too optimistic it will do as it is told.",
  cannot_wait: "'Wait here,' {nv:char:say} to {nm:item:the}. Being an inanimate object, {nv:char:feel} pretty confident it will do as it is told.",
  already_following: "'I'm already following you!'",
  already_waiting: "'I'm already waiting!'",
  cannot_ask_about: "{nv:char:can:true} ask {ob:item} about {show:text} all {pv:char:like}, but {pv:item:be} not about to reply.",
  cannot_tell_about: "{nv:char:can:true} tell {ob:item} about {show:text} all {pv:char:like}, but {pv:item:be} not interested.",
  cannot_talk_about: "{nv:char:can:true} talk to {ob:item} about {show:text} all {pv:char:like}, but {pv:item:be} not interested.",
  topics_no_ask_tell: "This character has no ASK/ABOUT or TELL/ABOUT options set up.",
  topics_none_found: "No suggestions for what to ask or tell {nm:item:the} available.",
  topics_ask_list: "Some suggestions for what to ask {nm:item:the} about: {show:list}.",
  topics_tell_list: "Some suggestions for what to tell {nm:item:the} about: {show:list}.",
  cannot_talk_to: "{nv:char:chat:true} to {nm:item:the} for a few moments, before realizing that {pv:item:be} not about to reply.",
  no_topics: "{nv:char:have:true} nothing to talk to {nm:item:the} about.",
  not_able_to_hear: "Doubtful {nv:item:will} be interested in anything {sb:char} has to say.",
  npc_no_interest_in: "{nv:char:have:true} no interest in that subject.",
  npc_dead: "{nv:char:be:true} dead.",
  // BUTTON
  press_button_successful: "{nv:char:push:true} {nm:item:the}.",
  // SHIFTABLE
  push_exit_successful: "{nv:char:push:true} {nm:item:the} {show:dir}.",
  cannot_push: "{pv:item:be:true} not something {nv:char:can} move around like that.",
  cannot_push_up: "{pv:char:be:true} not getting {nm:item:the} up there!",
  take_not_push: "Just pick the thing up already!",
  // ROPE
  rope_examine_attached_both_ends: " It is {item.attachedVerb} to both {nm:obj1:the} and {nm:obj2:the}.",
  rope_examine_attached_one_end: " It is {item.attachedVerb} to {nm:obj1:the}.",
  rope_attach_verb: "tie",
  rope_attached_verb: "tied",
  rope_detach_verb: "untie",
  rope_one_end: "One end",
  rope_other_end: "The other end",
  rope_examine_end_attached: "is {item.attachedVerb} to {nm:obj:the}.",
  rope_examine_end_held: "is held by {nm:holder:the}.",
  rope_examine_end_headed: "heads into {nm:loc:the}.",
  rope_no_attachable_here: "There is nothing here {nv:char:can} attach {nm:item:the} to.",
  rope_not_attachable_to: "That is not something {nv:char:can} attach {nm:item:the} to.",
  rope_not_detachable: "{nv:char:cannot:true} attach that to - or detach it from - anything.",
  rope_tied_both_ends_already: "{pv:item:be:true} already attached to {nm:obj1:the} and {nm:obj12:the}.",
  rope_not_attachable: "{nv:char:cannot:true} attach that to anything.",
  rope_not_attached: "{nv:item:be:true} not {item.attachedVerb} to anything.",
  rope_detach_end_ambig: "Which end of {nm:item:the} do you want to detach?",
  rope_not_attached_to: "{nv:item:be:true} not attached to {nm:obj:the}.",
  rope_tethered: "{nv:char:can:true} not detach {nm:item:the} from {nm:obj:the}.",
  rope_attach_success: "{nv:char:attach:true} {nm:item:the} to {nm:obj:the}.",
  rope_detach_success: "{nv:char:detach:true} {nm:item:the} from {nm:obj:the}.",
  rope_cannot_move: "{nv:item:be:true} not long enough, {nv:char:cannot} go any further.",
  rope_wind: "{nv:char:wind:true} in {nm:item:the}.",
  rope_unwind: "{nv:item:unwind:true} behind {nm:char:the}.",
  rope_tied_both_end: "It is tied to something.",
  rope_tied_one_end: "It is tied up at this end.",
  rope_no_end: "{nv:char:cannot:true} see either end of {nm:item:the}.",
  // TRANSIT
  transit_already_here: "{nv:char:press:true} the button; nothing happens.",
  transit_go_to_dest: "{nv:char:press:true} the button; the door closes...",
  // Movement
  go_successful: "{nv:char:head:true} {show:dir}.",
  not_that_way: "{nv:char:can't:true} go {show:dir}.",
  no_look_that_way: "{nv:char:can't:true} see anything of interest {show:dir}.",
  default_look_exit: "{nv:char:look:true} {show:dir}; definitely an exit that way.",
  can_go: "{nv:char:think:true} {pv:char:can} go {exits}.",
  cannot_go_in: "{pv:item:be:true} not something {nv:char:can} get inside.",
  cannot_go_out: "{pv:item:be:true} not something from which {nv:char:can} go out.",
  cannot_go_up: "{pv:item:be:true} not something {nv:char:can} go up.",
  cannot_go_down: "{pv:item:be:true} not something {nv:char:can} go down.",
  cannot_go_through: "{pv:item:be:true} not something {nv:char:can} get through.",
  // General cannot Messages
  cannot_read: "Nothing worth reading there.",
  cannot_use: "No obvious way to use {ob:item}.",
  cannot_smash: "{nv:item:be:true} not something {nv:char:can} break.",
  cannot_turn: "{nv:item:be:true} not something {nv:char:can} turn.",
  cannot_look_out: "Not something {nv:char:can} look out of.",
  cannot_smell: "{nv:item:have:true} no smell.",
  cannot_listen: "{nv:item:be:true} not making any noise.",
  // General command messages
  not_known_msg: "I don't even know where to begin with that.",
  disambig_msg: "Which do you mean?",
  no_multiples_msg: "You cannot use multiple objects with that command.",
  nothing_msg: "Nothing there to do that with.",
  general_obj_error: "So I kind of get what you want to do, but not what you want to do it with.",
  done_msg: "{multi}Done.",
  nothing_for_sale: "Nothing for sale here.",
  wait_msg: "Time passes...",
  no_map: "Sorry, no map available.",
  inventory_prefix: "{nv:char:be:true} carrying",
  no_receiver: "There's no one here to give things to.",
  // General command fails
  no_smell: "{pv:char:can't:true} smell anything here.",
  no_listen: "{pv:char:can't:true} hear anything of note here.",
  nothing_there: "{nv:char:be:true} sure there's nothing there.",
  nothing_inside: "There's nothing to see inside.",
  not_open: "You have to open it first.",
  it_is_empty: "{pv:container:be:true} empty.",
  not_here: "{pv:item:be:true} not here.",
  char_has_it: "{multi}{nv:holder:have:true} {ob:item}.",
  none_here: "There's no {nm:item} here.",
  none_held: "{nv:char:have:true} no {nm:item}.",
  //none_here_countable:"There's no {nm:item} here.",
  //none_held_countable:"{nv:char:have:true} no {nm:item}.",
  nothing_useful: "That's not going to do anything useful.",
  already: "{sb:item:true} already {cj:item:be}.",
  default_examine: "{pv:item:be:true} just your typical, every day {nm:item}.",
  not_enough: "There {ifMoreThan:count:1:are:is} only {show:count} {nm:item}.",
  it_is_dark: "It is dark.",
  abort_cmds: "Abandoning later commands",
  error: "Oh dear, I seem to have hit an error trying to handle that (F12 for more details).",
  //----------------------------------------------------------------------------------------------
  // Complex responses (requiring functions)
  // Used deep in the parser, so prefer to use function, rather than string
  object_unknown_msg: function(t) {
    return "There doesn't seem to be anything you might call '" + t + "' here.";
  },
  // For furniture
  stop_posture: function(t) {
    if (!t.posture || !t.postureFurniture && t.posture === "standing")
      return "";
    const e = { char: t };
    return w[t.postureFurniture] && (e.item = w[t.postureFurniture]), t.posture = !1, t.postureFurniture = !1, processText(e.item ? "{nv:char:get:true} off {nm:item:the}." : "{nv:char:stand:true} up.", e);
  },
  // use (or potentially use) different verbs in the responses, so not simple strings
  say_no_one_here: "{nv:char:say:true}, '{show:text},' but no one notices.",
  say_no_response: "No one seems interested in what {nv:char:say}.",
  say_no_response_full: "{nv:char:say:true}, '{show:text},' but no one seem interested.",
  say_something: "{nv:char:say:true}, '{show:text}.'",
  // If the player does SPEAK TO MARY and Mary has some topics, this will be the menu title.
  speak_to_menu_title: function(t) {
    return "Talk to " + a.getName(t, { article: DEFINITE }) + " about:";
  },
  // If the player does TELL MARY ABOUT HOUSE this will appear before the response.
  tell_about_intro: function(t, e, n) {
    return "{nv:char:tell:true} " + a.getName(t, { article: DEFINITE }) + " " + n + " " + e + ".";
  },
  // If the player does ASK MARY ABOUT HOUSE this will appear before the response.
  ask_about_intro: function(t, e, n) {
    return "{nv:char:ask:true} " + a.getName(t, { article: DEFINITE }) + " " + n + " " + e + ".";
  },
  // If the player does TALK TO MARY ABOUT HOUSE this will appear before the response.
  talk_about_intro: function(t, e, n) {
    return "{nv:char:talk:true} to " + a.getName(t, { article: DEFINITE }) + " " + n + " " + e + ".";
  },
  // Use when the NPC leaves a room; will give a message if the player can observe it
  npc_leaving_msg: function(t, e) {
    let n = t.inSight(e.origin);
    if (!n)
      return;
    if (e.npcLeaveMsg)
      return e.npcLeaveMsg(t);
    let s = typeof n == "string" ? n + " {nv:npc:leave}" : "{nv:npc:leave:true}";
    s += " {nm:room:the}, heading {show:dir}.", x(s, { room: e.origin, npc: t, dir: e.dir });
  },
  // the NPC has already been moved, so npc.loc is the destination
  npc_entering_msg: function(t, e) {
    let n = t.inSight(w[e.name]);
    if (!n)
      return;
    if (e.npcEnterMsg)
      return e.npcEnterMsg(t);
    let s = typeof n == "string" ? n + " {nv:npc:enter}" : "{nv:npc:enter:true}";
    s += " {nm:room:the} from {show:dir}.", x(s, { room: w[e.name], npc: t, dir: e.reverseNice() });
  },
  //----------------------------------------------------------------------------------------------
  // Meta-command responses
  // Save/load messages
  sl_dir_headings: ["Filename", "Game", "Ver", "Timestamp", "Comment"],
  sl_dir_msg: "Ver is the version of the game that was being played when saved. Loading a save game from a different version may or may not work. You can delete a file with the DEL command. Type SAVE for general instructions on saving and loading.",
  sl_no_filename: "Trying to save with no filename.",
  sl_saved: 'Saved file "{filename}" {if:toFile:to file:to LocalStorage}.',
  sl_already_exists: "File already exists. To overwrite an existing file, use SAVE [filename] OVERWRITE or SAVE [filename] OW.",
  sl_file_not_found: "Load failed: File not found.",
  sl_deleted: "Deleted.",
  sl_file_loaded: 'Loaded file "{filename}"',
  sl_bad_format: 'Improperly formatted file. Looks like this might be for a game called "{show:title}"?',
  // Achievements
  ach_none_yet: "No achievements yet!",
  ach_list_intro: "You got {if:count:1:this single, solitary achievement:these achievements}!",
  ach_list_item: "{show:text} ({date:date})",
  ach_got_one: "You got an achievement!|{show:text}",
  spoken_on: "Game mode is now 'spoken'. Type INTRO to hear the introductory text.",
  spoken_off: "Game mode is now 'unspoken'.",
  mode_brief: "Game mode is now 'brief'; no room descriptions (except with LOOK).",
  mode_terse: "Game mode is now 'terse'; room descriptions only shown on first entering and with LOOK.",
  mode_verbose: "Game mode is now 'verbose'; room descriptions shown every time you enter a room.",
  mode_silent_on: "Game is now in silent mode.",
  mode_silent_off: "Silent mode off.",
  transcript_on: "Transcript is now on.",
  transcript_off: "Transcript is now off.",
  transcript_cleared: "Transcript cleared.",
  transcript_none: "Cannot show transcript, nothing has been recorded.",
  transcript_already_on: "Transcript is already turned on.",
  transcript_already_off: "Transcript is already turned off.",
  transcript_finish: "To see the transcript, click {cmd:SCRIPT SHOW:here}.",
  finish_options: "You might like to {cmd:UNFINISH THEN UNDO:UNDO} your last action, or {cmd:UNFINISH THEN RESTART:RESTART} (and perhaps load a saved game).",
  new_tab_failed: "I am unable to create a new tab. This is probably because your browser is blocking me! There may be a banner across the top of the screen where you can give permission. You will need to do the command again.",
  undo_disabled: "Sorry, UNDO is not enabled in this game.",
  undo_not_available: "There are no saved game-states to UNDO back to.",
  undo_done: "Undoing...",
  again_not_available: "There are no previous commands to repeat.",
  scores_not_implemented: "Scores are not a part of this game.",
  restart_are_you_sure: "Do you really want to restart the game? {b:[Y/N]}",
  restart_no: "Restart cancelled",
  yes_regex: /^(y|yes)$/i,
  helloScript: function() {
    return C("Hi!"), C("If you are wondering what to do, typing HELP will give you a quick guide at how to get going. In fact, we can do that now..."), C(">HELP"), xs(), a.helpScript();
  },
  helpScript: function() {
    if (settings.textInput) {
      C("Type commands at the prompt to interact with the world."), C('{b:Movement:} To move, use the eight compass directions (or just {class:help-eg:N}, {class:help-eg:NE}, etc.). When "Num Lock" is on, you can use the number pad for all eight compass directions. Also try - and + for {class:help-eg:UP} and {class:help-eg:DOWN}, / and * for {class:help-eg:IN} and {class:help-eg:OUT}.'), C("{b:Other commands:} You can also {class:help-eg:LOOK} (or just {class:help-eg:L} or 5 on the number pad), {class:help-eg:HELP} (or {class:help-eg:?}) or {class:help-eg:WAIT} (or {class:help-eg:Z} or the dot on the number pad). Other commands are generally of the form {class:help-eg:GET HAT} or {class:help-eg:PUT THE BLUE TEAPOT IN THE ANCIENT CHEST}. Experiment and see what you can do!"), C("{b:Using items: }You can use {class:help-eg:ALL} and {class:help-eg:ALL BUT} with some commands, for example {class:help-eg:TAKE ALL}, and {class:help-eg:PUT ALL BUT SWORD IN SACK}. You can also use pronouns, so {class:help-eg:LOOK AT MARY}, then {class:help-eg:TALK TO HER}. The pronoun will refer to the last subject in the last successful command, so after {class:help-eg:PUT HAT AND FUNNY STICK IN THE DRAWER}, '{class:help-eg:IT}' will refer to the funny stick (the hat and the stick are subjects of the sentence, the drawer was the object)."), C("{b:Characters: }If you come across another character, you can ask him or her to do something. Try things like {class:help-eg:MARY,PUT THE HAT IN THE BOX}, or {class:help-eg:TELL MARY TO GET ALL BUT THE KNIFE}. Depending on the game you may be able to {class:help-eg:TALK TO} a character, to {class:help-eg:ASK} or {class:help-eg:TELL} a character {class:help-eg:ABOUT} a topic, or just {class:help-eg:SAY} something and they will respond.."), C("{b:Meta-commands:} Type {class:help-eg:ABOUT} to find out about the author, {class:help-eg:SCRIPT} to learn about transcripts or {class:help-eg:SAVE} to learn about saving games. Use {class:help-eg:WARNINGS} to see any applicable sex, violence or trigger warnings.");
      let t = "You can also use {class:help-eg:BRIEF/TERSE/VERBOSE} to control room descriptions. Use {class:help-eg:SILENT} to toggle sounds and music (if implemented).";
      typeof map < "u" && (t += " Use {class:help-eg:MAP} to toggle/show the map."), typeof imagePane < "u" && (t += " Use {class:help-eg:IMAGES} to toggle/show the image pane."), C(t), C("{b:Accessibility:} Type {class:help-eg:DARK} to toggle dark mode or {class:help-eg:SPOKEN} to toggle the text being read out. Use {class:help-eg:FONT} to toggle replacing all the fonts the author carefully chose to a standard sans-serif font. Use {class:help-eg:SCROLL} to toggle whether the text automatically scrolling."), C("{b:Mobile:} If you are on a mobile phone, type {class:help-eg:NARROW} to reduce the width of the text. Type it again to reduce it even more, and a third time to go back to standard width."), C("{b:Shortcuts:} You can often just type the first few characters of an item's name and Quest will guess what you mean.  If fact, if you are in a room with Brian, who is holding a ball, and a box, Quest should be able to work out that {class:help-eg:B,PUT B IN B} mean you want Brian to put the ball in the box."), C("You can use the up and down arrows to scroll back though your previous typed commands - especially useful if you realise you spelled something wrong. If you do not have arrow keys, use {class:help-eg:OOPS} to retrieve the last typed command so you can edit it. Use {class:help-eg:AGAIN} or just {class:help-eg:G} to repeat the last typed command."), C("See also {link:here:https://github.com/ThePix/QuestJS/wiki/How-To-Play} for more details, which will open in a new tab.");
    }
    if (settings.panes !== "none" && (settings.inventoryPane && C("{b:User Interface:} To interact with an object, click on its name in the side pane, and a set of possible actions will appear under it. Click on the appropriate action."), settings.compassPane && (settings.symbolsForCompass ? C("You can also use the compass rose at the top to move around. Click the eye symbol, &#128065;, to look at you current location, the clock symbol to wait or &#128712; for help.") : C("You can also use the compass rose at the top to move around. Click 'Lk' to look at you current location, 'Z' to wait or '?' for help.")), settings.collapsibleSidePanes && C("You can click on the eye symbol by the pane titles to toggle them being visible. This may be useful if there is a lot there, and entries are disappearing off the bottom of your screen, though you may miss that something is here if you are not careful!")), settings.additionalHelp !== void 0)
      for (const t of settings.additionalHelp)
        C(t);
    return world.SUCCESS_NO_TURNSCRIPTS;
  },
  hintScript: function() {
    return C("Sorry, no hints available."), world.SUCCESS_NO_TURNSCRIPTS;
  },
  aboutScript: function() {
    if (C("{i:{show:settings:title} version {show:settings:version}} was written by {show:settings:author} using QuestJS (Quest 6) version {show:settings:questVersion}.", { settings }), settings.ifdb && C("IFDB number: " + settings.ifdb), settings.thanks && settings.thanks.length > 0 && C("{i:Thanks to:} " + formatList(settings.thanks, { lastSep: a.list_and }) + "."), settings.additionalAbout !== void 0)
      for (const t in settings.additionalAbout)
        C("{i:" + t + ":} " + settings.additionalAbout[t]);
    return settings.ifid && C("{i:IFDB number:} " + settings.ifid), world.SUCCESS_NO_TURNSCRIPTS;
  },
  warningsScript: function() {
    switch (typeof settings.warnings) {
      case "undefined":
        C("No warning have been set for this game.");
        break;
      case "string":
        C(settings.warnings);
        break;
      default:
        for (const t of settings.warnings)
          C(t);
    }
    return world.SUCCESS_NO_TURNSCRIPTS;
  },
  saveLoadScript: function() {
    return settings.localStorageDisabled || (C("QuestJS offers players two ways to save your progress - to LocalStorage or to file."), C("{b:Saving To LocalStorage}"), C("LocalStorage is a part of your computer the browser has set aside; this is the easier way to save."), C("Note, however, that if you clear your browsing data (or have your browser set to do so automatically when the browser is closed) you will lose your saved games. There is also a limit to how much can be saved to LocalStorage, and if this is a big game, you may not be allowed to save to LocalStorage."), C("To save your progress to LocalStorage, type {class:help-eg:SAVE [filename]}. By default, if you have already saved the game, you will not be permitted to save with the same filename, to prevent you accidentally saving when you meant to load. However, you can overwrite a file with the same name by using {class:help-eg:SAVE [filename] OVERWRITE} or just {class:help-eg:SAVE [filename] OW}."), C("To load your game, refresh/reload this page in your browser, then type {class:help-eg:LOAD [filename]}."), C("To see a list of all your QuestJS save games, type {class:help-eg:DIR} or {class:help-eg:LS}. You can delete a saved file with {class:help-eg:DELETE [filename]} or {class:help-eg:DEL [filename]}."), C("{b:Saving To File}"), C("Alternatively you can save the game as a file on your computer. It is a little more hassle, but probably more reliable.")), C("To save your progress to file, type {class:help-eg:FSAVE [filename]}. The file will be saved to wherever downloaded files get saved on your computer. If there is already a file with that name, the browser will probably append a number to the name."), C("To load your game, refresh/reload this page in your browser, then type {class:help-eg:FLOAD}. A dialog will open up, allowing you to navigate to the downloads folder and select your file."), C("There is no built-in facility to list or delete games saved as files, though you can delete through your normal file manager."), world.SUCCESS_NO_TURNSCRIPTS;
  },
  hintSheet: "Hint Sheet",
  hintSheetIntro: "To use this hint sheet, start to read through the list of questions to see if there is one dealing with the place where you're stuck in the game. To decode a hint, substitute the numbers in the hint for the numbered words in the 'dictionary' at the bottom of the hint sheet. <i>To get back to your game, just go to its tab.</i>",
  // linkHintInvisiClues:"Hints can be found on {link:this page:" + folder + "/hints.html}, in the form of InvisiClues, so you can avoid seeing spoilers you do want to see. The page will open in a new tab, so will not affect your playing of the game.",
  transcriptScript: function() {
    return C("The TRANSCRIPT or SCRIPT commands can be used to handle recording the input and output. This can be very useful when testing a game, as the author can go back through it and see exactly what happened, and how the user got there."), C("Use SCRIPT ON to turn on recording and SCRIPT OFF to turn it off. To clear the stored data, use SCRIPT CLEAR. To clear the old data and turn recording on in one step, use SCRIPT START."), C("Use SCRIPT SHOW to display it - it will appear in a new tab; you will not lose your place in the game. Some browsers (Firefox especially) may block the new tab, but will probably give the option to allow it in a banner at the top. You will probably need to do the command again."), C("You can add a comment to the transcript by starting your text with an asterisk, {code:*}, or semi-colon, {code:;}, - Quest will record it, but otherwise just ignore it."), C('Everything gets saved to "LocalStorage", so will be saved between sessions. If you complete the game the text input will disappear, however if you have a transcript recording, a link will be available to access it.'), C("Transcript is currently: " + (u.transcript ? "on" : "off")), world.SUCCESS_NO_TURNSCRIPTS;
  },
  transcriptTitle: function() {
    let t = "";
    return t += '<h2>QuestJS Transcript for "', t += settings.title + '" (version ' + settings.version, t += ")</h2>", t += '<p><a onclick="document.download()" style="cursor:pointer;border:black solid 1px;border-radius:5px;background:silver;line-height:1em">Click here</a> to save this file to your downloads folder as "transcript.html".</p>', t += "<hr/>", t;
  },
  transcriptStart: function() {
    const t = /* @__PURE__ */ new Date();
    return "<p><i>Transcript started at " + t.toLocaleTimeString() + " on " + t.toDateString() + "</i></p>";
  },
  transcriptEnd: function() {
    const t = /* @__PURE__ */ new Date();
    return "<p><i>Transcript ended at " + t.toLocaleTimeString() + " on " + t.toDateString() + "</i></p>";
  },
  topicsScript: function() {
    return C("Use TOPICS FOR [name] to see a list of topic suggestions to ask a character about (if implemented in this game)."), world.SUCCESS_NO_TURNSCRIPTS;
  },
  betaTestIntro: function() {
    C("This version is for beta-testing (" + settings.version + "); the browser reports that it is running on: " + navigator.userAgent), settings.textInput ? (C("A transcript will be automatically recorded. When you finish, do Ctrl-Enter or type SCRIPT SHOW to open the transcript in a new tab, or click the link if you reach the end of the game; it can then be saved (you should see a save button at the top) and attached to an e-mail. Alternatively, copy-and-pasted into an e-mail."), C("You can add your own comments to the transcript by starting a command with *.")) : C('A transcript will be automatically recorded. As this game has no text input, you will need to access the transcript through the developer tools. Press F12 to show the tools, and click on the "Console" tab. Type <code>io.scriptShow()</code> and press return. the transcript should appear in a new tab.'), C("If you have not already done so, I recommend checking to ensure you can see the transcript before progressing too far though the game."), C("PLEASE NOTE: Transcripts and save games are saved in LocalStorage; if you have this set to be deleted when you close your browser, you will lose all progress!"), saveLoad.transcriptStart();
  },
  game_over_html: "<p>G<br/>A<br/>M<br/>E<br/>/<br/>O<br/>V<br/>E<br/>R</p>",
  //----------------------------------------------------------------------------------------------
  //  Language Data
  // Misc
  list_and: "and",
  list_nothing: "nothing",
  list_or: "or",
  list_nowhere: "nowhere",
  never_mind: "Never mind.",
  default_description: "It's just scenery.",
  click_to_continue: "Click to continue...",
  buy: "Buy",
  // used in the command link in the purchase table
  buy_headings: ["Item", "Cost", ""],
  current_money: "Current money",
  inside: "inside",
  on_top: "on top",
  carrying: "carrying",
  command_split_regex: /\.| then |, then |,then |, and then |,and then /i,
  // case insenstive as used early
  article_filter_regex: /^(?:the |an |a )?(.+)$/,
  joiner_regex: /\band\b|\, ?and\b|\,/,
  all_regex: /^(all|everything)$/,
  all_exclude_regex: /^((all|everything) (but|bar|except)\b)/,
  go_pre_regex: "go to |goto |go |head |",
  yesNo: ["Yes", "No"],
  tp_false: "false",
  tp_true: "true",
  // Use this to stop commands getting saved to the walkthrough - note the space at the end
  noWalkthroughRegex: /^(script|transcript) /,
  //----------------------------------------------------------------------------------------------
  // Language constructs
  pronouns: {
    thirdperson: { subjective: "it", objective: "it", possessive: "its", possAdj: "its", reflexive: "itself" },
    massnoun: { subjective: "it", objective: "it", possessive: "its", possAdj: "its", reflexive: "itself" },
    male: { subjective: "he", objective: "him", possessive: "his", possAdj: "his", reflexive: "himself" },
    female: { subjective: "she", objective: "her", possessive: "hers", possAdj: "her", reflexive: "herself" },
    nonbinary: { subjective: "they", objective: "them", possessive: "theirs", possAdj: "their", reflexive: "themselves" },
    plural: { subjective: "they", objective: "them", possessive: "theirs", possAdj: "their", reflexive: "themselves" },
    firstperson: { subjective: "I", objective: "me", possessive: "mine", possAdj: "my", reflexive: "myself" },
    secondperson: { subjective: "you", objective: "you", possessive: "yours", possAdj: "your", reflexive: "yourself" }
  },
  // Display verbs used in the side panel
  verbs: {
    examine: "Examine",
    use: "Use",
    take: "Take",
    drop: "Drop",
    open: "Open",
    close: "Close",
    switchon: "Switch on",
    switchoff: "Switch off",
    wear: "Wear",
    remove: "Remove",
    lookat: "Look at",
    talkto: "Talk to",
    eat: "Eat",
    drink: "Drink",
    read: "Read",
    push: "Push",
    equip: "Equip",
    unequip: "Unequip",
    attack: "Attack",
    sitOn: "Sit on",
    standOn: "Stand on",
    reclineOn: "Lie on",
    getOff: "Get off",
    fill: "Fill",
    empty: "Empty",
    turn: "Turn"
  },
  // Flag the state of an item in a list
  invModifiers: {
    worn: "worn",
    open: "open",
    equipped: "equipped",
    dead: "dead"
  },
  // Change the abbrev values to suit your game (or language)
  // You may want to do that in settings, which is loaded first
  exit_list: [
    { name: "northwest", abbrev: "NW", niceDir: "the northwest", type: "compass", key: 103, x: -1, y: 1, z: 0, opp: "southeast", symbol: "fa-arrow-left", rotate: 45 },
    { name: "north", abbrev: "N", niceDir: "the north", type: "compass", key: 104, x: 0, y: 1, z: 0, opp: "south", symbol: "fa-arrow-up" },
    { name: "northeast", abbrev: "NE", niceDir: "the northeast", type: "compass", key: 105, x: 1, y: 1, z: 0, opp: "southwest", symbol: "fa-arrow-up", rotate: 45 },
    { name: "in", abbrev: "In", alt: "enter", niceDir: "inside", type: "inout", key: 111, opp: "out", symbol: "fa-sign-in-alt" },
    { name: "up", abbrev: "U", niceDir: "above", type: "vertical", key: 109, x: 0, y: 0, z: 1, opp: "down", symbol: "fa-arrow-up" },
    { name: "west", abbrev: "W", niceDir: "the west", type: "compass", key: 100, x: -1, y: 0, z: 0, opp: "east", symbol: "fa-arrow-left" },
    { name: "Look", abbrev: "L", type: "nocmd", key: 101, symbol: "fa-eye" },
    { name: "east", abbrev: "E", niceDir: "the east", type: "compass", key: 102, x: 1, y: 0, z: 0, opp: "west", symbol: "fa-arrow-right" },
    { name: "out", abbrev: "Out", alt: "exit|o|leave", niceDir: "outside", type: "inout", key: 106, opp: "in", symbol: "fa-sign-out-alt" },
    { name: "down", abbrev: "Dn", alt: "d", niceDir: "below", type: "vertical", key: 107, x: 0, y: 0, z: -1, opp: "up", symbol: "fa-arrow-down" },
    { name: "southwest", abbrev: "SW", niceDir: "the southwest", type: "compass", key: 97, x: -1, y: -1, z: 0, opp: "northeast", symbol: "fa-arrow-down", rotate: 45 },
    { name: "south", abbrev: "S", niceDir: "the south", type: "compass", key: 98, x: 0, y: -1, z: 0, opp: "north", symbol: "fa-arrow-down" },
    { name: "southeast", abbrev: "SE", niceDir: "the southeast", type: "compass", key: 99, x: 1, y: -1, z: 0, opp: "northwest", symbol: "fa-arrow-right", rotate: 45 },
    { name: "Wait", abbrev: "Z", type: "nocmd", key: 110, symbol: "fa-clock" },
    { name: "Help", abbrev: "?", type: "nocmd", symbol: "fa-info" }
  ],
  numberUnits: "zero;one;two;three;four;five;six;seven;eight;nine;ten;eleven;twelve;thirteen;fourteen;fifteen;sixteen;seventeen;eighteen;nineteen;twenty".split(";"),
  numberTens: "twenty;thirty;forty;fifty;sixty;seventy;eighty;ninety".split(";"),
  ordinalReplacements: [
    { regex: /one$/, replace: "first" },
    { regex: /two$/, replace: "second" },
    { regex: /three$/, replace: "third" },
    { regex: /five$/, replace: "fifth" },
    { regex: /eight$/, replace: "eighth" },
    { regex: /nine$/, replace: "ninth" },
    { regex: /twelve$/, replace: "twelfth" },
    { regex: /y$/, replace: "ieth" }
  ],
  conjugations: {
    i: [
      { name: "be", value: "am" },
      { name: "'be", value: "'m" },
      { name: "were", value: "was" }
      // Used in present tense for, eg "I was going to do that"
    ],
    you: [
      { name: "be", value: "are" },
      { name: "'be", value: "'re" }
    ],
    we: [
      { name: "be", value: "are" },
      { name: "'be", value: "'re" }
    ],
    they: [
      { name: "be", value: "are" },
      { name: "'be", value: "'re" }
    ],
    it: [
      { name: "be", value: "is" },
      { name: "were", value: "was" },
      { name: "have", value: "has" },
      { name: "can", value: "can" },
      { name: "will", value: "will" },
      { name: "mould", value: "moulds" },
      { name: "*ould", value: "ould" },
      { name: "must", value: "must" },
      { name: "don't", value: "doesn't" },
      { name: "can't", value: "can't" },
      { name: "won't", value: "won't" },
      { name: "cannot", value: "cannot" },
      { name: "@n't", value: "n't" },
      { name: "'ve", value: "'s" },
      { name: "'be", value: "'s" },
      { name: "'ll", value: "'ll" },
      { name: "*ay", value: "ays" },
      { name: "*uy", value: "uys" },
      { name: "*oy", value: "oys" },
      { name: "*ey", value: "eys" },
      { name: "*y", value: "ies" },
      { name: "*ss", value: "sses" },
      { name: "*s", value: "sses" },
      { name: "*sh", value: "shes" },
      { name: "*ch", value: "ches" },
      { name: "*o", value: "oes" },
      { name: "*x", value: "xes" },
      { name: "*z", value: "zes" },
      { name: "*", value: "s" }
    ]
  },
  contentsForData: {
    surface: { prefix: "with ", suffix: " on it" },
    container: { prefix: "containing ", suffix: "" }
  },
  //----------------------------------------------------------------------------------------------
  //                                   LANGUAGE FUNCTIONS
  //@DOC
  // ## Language Functions
  //@UNDOC
  //@DOC
  // Returns "the " if appropriate for this item.
  // If the item has 'defArticle' it returns that; if it has a proper name, returns an empty string.
  addDefiniteArticle: function(t, e) {
    return a.addArticle(t, DEFINITE, e);
  },
  //@DOC
  // Returns "a " or "an " if appropriate for this item.
  // If the item has 'indefArticle' it returns that; if it has a proper name, returns an empty string.
  // If it starts with a vowel, it returns "an ", otherwise "a ".
  addIndefiniteArticle: function(t, e) {
    return a.addArticle(t, INDEFINITE, e);
  },
  addArticle: function(t, e, n = {}) {
    if (e === "the" && (e = DEFINITE), e === "a" && (e = INDEFINITE), !(!e || e !== DEFINITE && e !== INDEFINITE)) {
      if (g() && t.owner === g().name)
        return g().pronouns.possAdj + " ";
      if (typeof n.possAdj == "string") {
        if (!w[n.possAdj])
          throw "Oh dear... I am looking to create a possessive in lang.addArticle (probably from lang.getName or formatList), and I cannot find " + n.possAdj + ". This will not end well.";
        n.possAdj = w[n.possAdj];
      }
      if (n.possAdj === !0 && (n.possAdj = t.owner ? w[t.owner] : void 0), t.owner && n.possAdj && n.possAdj === w[t.owner])
        return n.possAdj.pronouns.possAdj + " ";
      if (t.owner && n.ignorePossessive !== !0) {
        const s = {
          possessive: !0,
          noLink: n.ignorePossessive === "noLink"
        };
        return a.getName(w[t.owner], s) + " ";
      }
      return e === DEFINITE ? t.defArticle ? t.defArticle + " " : t.properNoun ? "" : "the " : t.indefArticle ? t.indefArticle + " " : t.properNoun ? "" : t.pronouns === a.pronouns.plural || t.pronouns === a.pronouns.massnoun ? "some " : /^[aeiou]/i.test(t.alias) ? "an " : "a ";
    }
  },
  getName: function(t, e) {
    e || (e = {}), t.alias || (t.alias = t.name);
    let n = "", s = e[t.name + "_count"] ? e[t.name + "_count"] : !1;
    return e.count_this && (s = t[e.count_this]), !s && e.suppressCount && (s = t[e.suppressCount]), !s && e.loc && t.countable && (s = t.countAtLoc(e.loc)), t.getDisplayName ? (e.count = s, n = t.getDisplayName(e)) : t.pronouns === a.pronouns.firstperson || t.pronouns === a.pronouns.secondperson ? n = e.possessive ? t.pronouns.possAdj : t.pronouns.subjective : (s === "infinity" ? n += t.infinity ? t.infinity + " " : "a lot of " : e.article === DEFINITE && e.suppressCount ? n += a.addDefiniteArticle(t) : !e.suppressCount && s && s > 1 ? n += a.toWords(s) + " " : e.article === DEFINITE ? n += a.addDefiniteArticle(t) : e.article === INDEFINITE ? n += a.addIndefiniteArticle(t, e) : e.article === COUNT && (n += "one "), t.getAdjective && (n += t.getAdjective()), !s || s === 1 ? n += e.enhanced && t.enhancedAlias ? t.enhancedAlias : t.alias : n += t.pluralAlias, e.possessive && (n.endsWith("s") ? n += "'" : n += "'s")), e.capital && (n = sentenceCase(n)), settings.nameTransformer && (n = settings.nameTransformer(n, t, e)), n += util.getNameModifiers(t, e), n;
  },
  //@DOC
  // Returns the given number in words, so 19 would be returned as 'nineteen'.
  // Numbers uner -2000 and over 2000 are returned as a string of digits,
  // so 2001 is returned as '2001'.
  toWordsMax: 1e4,
  toWordsMillions: ["", " thousand", " million", " billion", " trillion", " quadrillion", " quintillion", " sextillion", "s eptillion", " octillion", " nonillion", " decillion", " undecillion", " duodecillion"],
  toWords: function(t, e) {
    if (typeof t != "number")
      return _("toWords can only handle numbers");
    t = Math.round(t);
    let n = !1;
    if (t === 0)
      return e ? "zero " + a.getPlural(e) : "zero";
    t < 0 && (n = !0, t = -t);
    const s = rChunkString(t, 3);
    let r = 0;
    const o = [];
    for (; s.length; ) {
      const p = a._toWords1000(s.pop());
      p !== "zero" && o.unshift(p + a.toWordsMillions[r]), r++;
    }
    let c = formatList(o, { lastJoiner: "and", doNotSort: !0 });
    const d = c.match(/ and /g);
    if (d && d.length > 1) {
      const p = c.lastIndexOf(" and ");
      c = c.substring(0, p) + "," + c.substring(p);
    }
    return n && (c = "minus " + c), e ? c + " " + (t === 1 ? e : a.getPlural(e)) : c;
  },
  // For internal use, handles integers from 1 to 999 only
  _toWords1000: function(t) {
    let e = "", n = Math.floor(t / 100);
    if (t = t % 100, n > 0 && (e = e + a.numberUnits[n] + " hundred", t > 0 && (e = e + " and ")), t < 20)
      (t !== 0 || e === "") && (e = e + a.numberUnits[t]);
    else {
      let s = t % 10, r = Math.floor(t / 10) % 10;
      e = e + a.numberTens[r - 2], s !== 0 && (e = e + "-" + a.numberUnits[s]);
    }
    return e;
  },
  //@DOC
  // Returns the given number in words, as is conventionally said for a year,
  // so 1924 with return "nineteen twenty-three".
  // Throws an error if not a number and rounds to the nearest whole number.
  // Does not properly handle zero - there was no year zero
  toYear: function(t) {
    if (typeof t != "number")
      return _("toYear can only handle numbers"), t;
    t = Math.round(t);
    let e = "", n = !1;
    if (t < 0 && (n = !0, t = -t), t < 1e4) {
      let s = Math.floor(t / 100);
      if (log(s), t = t % 100, s > 0 && (e += a.numberUnits[s], t > 0 && (e += " ")), log(e), t < 20)
        (t !== 0 || e === "") && (e = e + a.numberUnits[t]);
      else {
        let r = t % 10, o = Math.floor(t / 10) % 10;
        e = e + a.numberTens[o - 2], r !== 0 && (e = e + "-" + a.numberUnits[r]);
      }
    } else
      e = t.toString();
    return n && (e += " BCE"), e;
  },
  //@DOC
  // Returns the given number in words as the ordinal, so 19 would be returned as 'nineteenth'.
  // Numbers uner -2000 and over 2000 are returned as a string of digits with 'th' appended,
  // so 2001 is returned as '2001th'.
  toOrdinal: function(t) {
    if (typeof t != "number")
      return _("toOrdinal can only handle numbers"), t;
    let e = a.toWords(t);
    for (let n of a.ordinalReplacements)
      if (n.regex.test(e))
        return e.replace(n.regex, n.replace);
    return e + "th";
  },
  convertNumbers: function(t) {
    for (let e = 0; e < a.numberUnits.length; e++) {
      let n = new RegExp("\\b" + a.numberUnits[e] + "\\b");
      n.test(t) && (t = t.replace(n, "" + e));
    }
    return t;
  },
  getPlural: function(t) {
    return t.match(/o$/) ? t + "es" : t.match(/on$/) ? t + "a" : t.match(/us$/) ? t.replace(/us$/, "i") : t.match(/um$/) ? t.replace(/um$/, "a") : t.match(/[aeiou]y$/) ? t + "s" : t.match(/y$/) ? t.replace(/y$/, "ies") : t.match(/sis$/) ? t.replace(/sis$/, "ses") : t.match(/(s|ss|sh|ch|z|x)$/) ? t + "es" : t + "s";
  },
  // Conjugating
  //@DOC
  // Returns the verb properly conjugated for the item, so "go" with a ball would return
  // "goes", but "go" with the player (if using second person pronouns).
  conjugate: function(t, e, n = {}) {
    let s = t.pronouns.subjective;
    (s === "he" || s === "she") && (s = "it");
    const r = a.conjugations[s.toLowerCase()];
    if (!r)
      return _("No conjugations found: conjugations_" + s.toLowerCase()), e;
    for (let o of r)
      if (o.name === e)
        return o.value;
    for (let o of r) {
      const c = o.name, d = o.value;
      if (c.startsWith("@") && e.endsWith(c.substring(1)))
        return a.conjugate(t, e.substring(0, e.length - c.length + 1)) + d;
      if (c.startsWith("*") && e.endsWith(c.substring(1)))
        return e.substring(0, e.length - c.length + 1) + d;
    }
    return n.capitalise ? sentenceCase(e) : e;
  },
  //@DOC
  // Returns the pronoun for the item, followed by the conjugated verb,
  // so "go" with a ball would return "it goes", but "go" with the player (if using second person pronouns)
  // would return "you go".
  // The first letter is capitalised if 'capitalise' is true.
  pronounVerb: function(t, e, n) {
    let s = t.pronouns.subjective + " " + a.conjugate(t, e);
    return s = s.replace(/ +\'/, "'"), n.capitalise ? sentenceCase(s) : s;
  },
  pronounVerbForGroup: function(t, e, n) {
    let s = t.groupPronouns().subjective + " " + a.conjugate(t.group(), e);
    return s = s.replace(/ +\'/, "'"), n.capitalise ? sentenceCase(s) : s;
  },
  verbPronoun: function(t, e, n) {
    let s = a.conjugate(t, e) + " " + t.pronouns.subjective;
    return s = s.replace(/ +\'/, "'"), n.capitalise ? sentenceCase(s) : s;
  },
  //@DOC
  // Returns the name for the item, followed by the conjugated verb,
  // so "go" with a ball would return "the ball goes", but "go" with
  // a some bees would return "the bees go". For the player, (if using second person pronouns)
  // would return the pronoun "you go".
  // The first letter is capitalised if 'capitalise' is true.
  nounVerb: function(t, e, n) {
    if (t === g() && !g().useproperNoun)
      return a.pronounVerb(t, e, n);
    n.article === void 0 && (n.article = DEFINITE);
    let s = a.getName(t, n) + " " + a.conjugate(t, e);
    return s = s.replace(/ +\'/, "'"), n.capitalise ? sentenceCase(s) : s;
  },
  verbNoun: function(t, e, n) {
    if (t === g())
      return a.pronounVerb(t, e, n);
    n.article === void 0 && (n.article = DEFINITE);
    let s = a.conjugate(t, e) + " " + a.getName(t, n);
    return s = s.replace(/ +\'/, "'"), n.capitalise ? sentenceCase(s) : s;
  }
};
a.createVerb = function(t, e = {}) {
  e.words === void 0 && (e.words = t.toLowerCase()), e.ing === void 0 && (e.ing = t + "ing"), e.defmsg === void 0 && (e.defmsg = e.ing + " {nm:item:the} is not going to achieve much."), e.defmsg === !0 && (e.defmsg = "{pv:item:'be:true} not something you can do that with."), new Cmd(t, {
    regex: new RegExp("^(?:" + e.words + ") (.+)$"),
    objects: [
      { scope: e.held ? parser.isHeld : parser.isHere }
    ],
    npcCmd: !0,
    defmsg: e.defmsg
  });
};
a.createVerbWith = function(t, e = {}) {
  e.words === void 0 && (e.words = t.toLowerCase()), e.ing === void 0 && (e.ing = t + "ing"), e.defmsg === void 0 && (e.defmsg = e.ing + " {nm:item:the} is not going to achieve much."), e.defmsg === !0 && (e.defmsg = "{pv:item:'be:true} not something you can do that with."), new Cmd(t + "With", {
    regexes: [
      new RegExp("^(?:" + e.words + ") (.+) (?:using|with) (.+)$"),
      { regex: new RegExp("^(?:use|with|using) (.+) to (?:" + e.words + ") (.+)$"), mod: { reverse: !0 } },
      { regex: new RegExp("^(?:use|with|using) (.+) (?:" + e.words + ") (.+)$"), mod: { reverse: !0 } }
    ],
    objects: [
      { scope: e.held ? parser.isHeld : parser.isHere },
      { scope: parser.isHeld }
    ],
    attName: t.toLowerCase(),
    npcCmd: !0,
    withScript: !0,
    defmsg: e.defmsg
  });
};
a.questions = [
  { q: "who am i", script: function() {
    return parser.parse("look me"), world.SUCCESS_NO_TURNSCRIPTS;
  } },
  { q: "who are (?:u|you)", script: function() {
    return C("Me? I am the parser. I am going to try to understand your commands, and then hopefully the protagonist will act on them in the game world."), world.SUCCESS_NO_TURNSCRIPTS;
  } },
  { q: "who is (?:|the )(?:player|protagonist)", script: function() {
    return C("The protagonist is a character in the game world, but a special one - one that you control directly. He or she is your proxy, acting on your behalf, so if you want to know what he or she is like, try WHO AM I?."), world.SUCCESS_NO_TURNSCRIPTS;
  } },
  { q: "what am i", script: function() {
    return parser.parse("look me"), world.SUCCESS_NO_TURNSCRIPTS;
  } },
  { q: "what (?:(?:have i got|do i have)(?:| on me| with me)|am i (?:carry|hold)ing)", script: function() {
    return parser.parse("inv"), world.SUCCESS_NO_TURNSCRIPTS;
  } },
  { q: "where am i", script: function() {
    return parser.parse("look"), world.SUCCESS_NO_TURNSCRIPTS;
  } },
  { q: "what do i do", script: function() {
    return parser.parse("help"), world.SUCCESS_NO_TURNSCRIPTS;
  } },
  { q: "(?:what do i do now|where do i go)", script: function() {
    return parser.parse("hint"), world.SUCCESS_NO_TURNSCRIPTS;
  } }
];
const X = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof global == "object" && global.global === global ? global : globalThis;
function vs(t, e) {
  return typeof e > "u" ? e = { autoBom: !1 } : typeof e != "object" && (console.warn("Deprecated: Expected third argument to be a object"), e = { autoBom: !e }), e.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type) ? new Blob([String.fromCharCode(65279), t], { type: t.type }) : t;
}
function et(t, e, n) {
  let s = new XMLHttpRequest();
  s.open("GET", t), s.responseType = "blob", s.onload = function() {
    Me(s.response, e, n);
  }, s.onerror = function() {
    console.error("could not download file");
  }, s.send();
}
function Bt(t) {
  let e = new XMLHttpRequest();
  e.open("HEAD", t, !1);
  try {
    e.send();
  } catch {
  }
  return e.status >= 200 && e.status <= 299;
}
function xe(t) {
  try {
    t.dispatchEvent(new MouseEvent("click"));
  } catch {
    let n = document.createEvent("MouseEvents");
    n.initMouseEvent(
      "click",
      !0,
      !0,
      window,
      0,
      0,
      0,
      80,
      20,
      !1,
      !1,
      !1,
      !1,
      0,
      null
    ), t.dispatchEvent(n);
  }
}
const qt = X.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent), Me = X.saveAs || // probably in some web worker
(typeof window != "object" || window !== X ? function() {
} : "download" in HTMLAnchorElement.prototype && !qt ? function(e, n, s) {
  let r = X.URL || X.webkitURL, o = document.createElement("a");
  n = n || e.name || "download", o.download = n, o.rel = "noopener", typeof e == "string" ? (o.href = e, o.origin !== location.origin ? Bt(o.href) ? et(e, n, s) : xe(o, o.target = "_blank") : xe(o)) : (o.href = r.createObjectURL(e), setTimeout(function() {
    r.revokeObjectURL(o.href);
  }, 4e4), setTimeout(function() {
    xe(o);
  }, 0));
} : "msSaveOrOpenBlob" in navigator ? function(e, n, s) {
  if (n = n || e.name || "download", typeof e == "string")
    if (Bt(e))
      et(e, n, s);
    else {
      let r = document.createElement("a");
      r.href = e, r.target = "_blank", setTimeout(function() {
        xe(r);
      });
    }
  else
    navigator.msSaveOrOpenBlob(vs(e, s), n);
} : function(e, n, s, r) {
  if (r = r || open("", "_blank"), r && (r.document.title = r.document.body.innerText = "downloading..."), typeof e == "string")
    return et(e, n, s);
  let o = e.type === "application/octet-stream", c = /constructor/i.test(X.HTMLElement) || X.safari, d = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((d || o && c || qt) && typeof FileReader < "u") {
    let p = new FileReader();
    p.onloadend = function() {
      let v = p.result;
      v = d ? v : v.replace(/^data:[^;]*;/, "data:attachment/file;"), r ? r.location.href = v : location = v, r = null;
    }, p.readAsDataURL(e);
  } else {
    let p = X.URL || X.webkitURL, v = p.createObjectURL(e);
    r ? r.location = v : location.href = v, r = null, setTimeout(function() {
      p.revokeObjectURL(v);
    }, 4e4);
  }
});
X.saveAs = Me.saveAs = Me;
const I = {
  getName: function(t) {
    return "QJS:" + l.title + ":" + t;
  },
  saveGame: function(t, e) {
    if (t === void 0)
      return _(a.sl_no_filename), !1;
    if (localStorage.getItem(this.getName(t)) && !e) {
      C(a.sl_already_exists);
      return;
    }
    const n = l.saveComment ? l.saveComment() : "-", s = I.saveTheWorld(n);
    return localStorage.setItem(this.getName(t), s), C(a.sl_saved, { filename: t, toFile: !1 }), l.afterSave && l.afterSave(t), !0;
  },
  saveGameAsFile: function(t) {
    const e = l.saveComment ? l.saveComment() : "-", n = I.saveTheWorld(e), s = new File([n], t + ".q6save", { type: "text/plain;charset=utf-8" });
    return Me(s), C(a.sl_saved, { filename: t, toFile: !0 }), l.afterSave && l.afterSave(t, !0), !0;
  },
  saveTheWorld: function(t) {
    return I.getSaveHeader(t) + I.getSaveBody();
  },
  getHeader: function(t) {
    const e = t.split("!");
    return { title: I.decodeString(e[0]), version: I.decodeString(e[1]), comment: I.decodeString(e[2]), timestamp: e[3] };
  },
  getSaveHeader: function(t) {
    const e = /* @__PURE__ */ new Date();
    let n = I.encodeString(l.title) + "!";
    return n += I.encodeString(l.version) + "!", n += I.encodeString(t) + "!", n += e.toLocaleString() + "!", n;
  },
  getSaveBody: function() {
    const t = [y.getSaveString(), O.getSaveString(), T.getChangeListenersSaveString()];
    for (let e in w)
      t.push(e + "=" + w[e].getSaveString());
    return t.join("!");
  },
  // LOAD
  // This function will be attached to #fileDialog as its "onchange" event
  loadGameAsFile: function() {
    const e = document.querySelector("#fileDialog").files, n = new FileReader();
    n.readAsText(e[0]), n.onload = function() {
      I.loadGame(e[0].name, n.result), document.querySelector("#fileDialogForm").reset();
    }, n.onerror = function() {
      log(n.error);
    };
  },
  loadGameFromLS: function(t) {
    const e = localStorage.getItem(this.getName(t));
    this.loadGame(t, e);
  },
  loadGame: function(t, e) {
    if (!e)
      C(a.sl_file_not_found);
    else if (e.startsWith(l.title + "!"))
      I.loadTheWorld(e, 4), yn(), C(a.sl_file_loaded, { filename: t }), l.afterLoad && l.afterLoad(t), loc().description();
    else {
      const n = e.substr(0, e.indexOf("!"));
      C(a.sl_bad_format, { title: I.decodeString(n) });
    }
  },
  loadTheWorld: function(t, e) {
    const n = t.split("!");
    e !== void 0 && n.splice(0, e);
    for (let s in w)
      w[s].clonePrototype && delete w[s];
    y.setLoadString(n.shift()), O.setLoadString(n.shift()), T.setChangeListenersLoadString(n.shift());
    for (let s of n)
      this.setLoadString(s);
    h.update(), ue(!0);
  },
  setLoadString: function(t) {
    const e = t.split("=");
    if (e.length !== 3) {
      _("Bad format in saved data (" + t + ")");
      return;
    }
    const n = e[0], s = e[1], r = e[2].split(";");
    if (s.startsWith("Clone")) {
      const o = s.split(":")[1];
      if (!w[o]) {
        _("Cannot find prototype '" + o + "'");
        return;
      }
      const c = as(w[o]);
      this.setFromArray(c, r), w[c.name] = c, c.afterLoadForTemplate();
      return;
    }
    if (s === "Object") {
      if (!w[n]) {
        _("Cannot find object '" + n + "'");
        return;
      }
      const o = w[n];
      this.setFromArray(o, r), o.afterLoadForTemplate();
      return;
    }
    _("Unknown save type for object '" + n + "' (" + hash.saveType + ")");
  },
  // UTILs
  decode: function(t, e) {
    if (e.length === 0)
      return !1;
    const n = e.split(":"), s = n[0], r = n[1], o = n[2];
    return r === "boolean" ? t[s] = o === "true" : r === "number" ? t[s] = parseFloat(o) : r === "string" ? t[s] = I.decodeString(o) : r === "array" ? t[s] = I.decodeArray(o) : r === "numberarray" ? t[s] = I.decodeNumberArray(o) : r === "emptyarray" ? t[s] = [] : r === "emptystring" ? t[s] = "" : r === "qobject" && (t[s] = w[o]), s;
  },
  encode: function(t, e) {
    if (e === 0)
      return t + ":number:0;";
    if (e === !1)
      return t + ":boolean:false;";
    if (e === "")
      return t + ":emptystring;";
    if (!e)
      return "";
    let n = typeof e;
    if (Array.isArray(e))
      try {
        return e.length === 0 ? t + ":emptyarray;" : typeof e[0] == "string" ? t + ":array:" + I.encodeArray(e) + ";" : typeof e[0] == "number" ? t + ":numberarray:" + I.encodeNumberArray(e) + ";" : "";
      } catch (s) {
        throw log(e), 'Error encountered with attribute "' + t + '": ' + s + ". More here: https://github.com/ThePix/QuestJS/wiki/Save-Load#save-errors";
      }
    return e instanceof ne ? "" : n === "object" ? e.name ? t + ":qobject:" + e.name + ";" : "" : n === "string" ? t + ":string:" + I.encodeString(e) + ";" : t + ":" + n + ":" + e + ";";
  },
  replacements: [
    { unescaped: ":", escaped: "cln" },
    { unescaped: ";", escaped: "scln" },
    { unescaped: "!", escaped: "exm" },
    { unescaped: "=", escaped: "eqs" },
    { unescaped: "~", escaped: "tld" }
  ],
  encodeString: function(t) {
    for (let e of I.replacements) {
      if (typeof t != "string")
        throw 'Found type "' + typeof t + '" in array - should be only strings.';
      t = t.replace(new RegExp(e.unescaped, "g"), "@@@" + e.escaped + "@@@");
    }
    return t;
  },
  decodeString: function(t) {
    for (let e of I.replacements)
      t = t.replace(new RegExp("@@@" + e.escaped + "@@@", "g"), e.unescaped);
    return t;
  },
  encodeArray: function(t) {
    return t.map((e) => I.encodeString(e)).join("~");
  },
  decodeArray: function(t) {
    return t.split("~").map((e) => I.decodeString(e));
  },
  encodeNumberArray: function(t) {
    return t.map((e) => {
      if (typeof e != "number")
        throw 'Found type "' + typeof e + '" in array - should be only numbers.';
      return e.toString();
    }).join("~");
  },
  decodeNumberArray: function(t) {
    return t.split("~").map((e) => parseFloat(e));
  },
  decodeExit: function(t) {
    return t.split("~").map((e) => I.decodeString(e));
  },
  lsTest: function() {
    const t = "test";
    try {
      return localStorage.setItem(t, t), localStorage.removeItem(t), !0;
    } catch {
      return !1;
    }
  },
  // Other functions
  deleteGame: function(t) {
    localStorage.removeItem(this.getName(t)), C(a.sl_deleted);
  },
  dirGame: function() {
    const t = a.sl_dir_headings.map((n) => "<th>" + n + "</th>");
    l.saveComment || t.pop();
    let e = t.join("");
    for (let n in localStorage) {
      if (!n.startsWith("QJS:"))
        continue;
      const s = n.split(":"), r = localStorage[n].split("!");
      log(r.slice(1, 4)), e += "<tr>", e += "<td>" + s[2] + "</td>", e += "<td>" + s[1] + "</td>", e += "<td>" + r[1] + "</td>", e += "<td>" + r[3] + "</td>", l.saveComment && (e += "<td>" + r[2] + "</td>"), e += "</tr>";
    }
    $(e, {}, { cssClass: "meta", tag: "table" }), C(a.sl_dir_msg);
  },
  testExistsGame: function(t) {
    return localStorage[this.getName(t)] !== void 0;
  },
  getSummary: function(t) {
    const e = localStorage[this.getName(t)];
    return e ? e.split("!").slice(1, 4) : null;
  },
  setFromArray: function(t, e) {
    const n = Object.keys(t).filter((s) => !t.saveLoadExclude(s));
    for (let s of n)
      delete t[s];
    for (let s of e)
      I.decode(t, s);
  },
  // ------------------------------------------------------------------------------------------
  //    TRANSCRIPTS
  //
  // Here because it uses localStorage. That said, there are two independant systems, the second
  // records commands to create a walk-through, and is saved in an array, this.transcriptWalkthrough
  // because only the author should ever use it.
  transcript: !1,
  // Set to true when recording
  transcriptName: "QJST:" + l.title + ":transcript",
  transcriptStart: function() {
    this.transcript = !0, this.transcriptWalkthrough = [], C(a.transcript_on), this.transcriptWrite(a.transcriptStart());
  },
  transcriptEnd: function() {
    this.transcriptWrite(a.transcriptEnd()), this.transcript = !1, C(a.transcript_off);
  },
  transcriptAppend: function(t) {
    if (this.transcript) {
      if (t.cssClass === "menu") {
        let e = this.transcriptWalkthrough.pop();
        e && (e = e.replace(/\,$/, "").trim(), this.transcriptWalkthrough.push("    {cmd:" + e + ", menu:" + t.n + "},"));
      }
      this.transcriptWrite('<p class="' + t.cssClass + '">' + t.text + "</p>");
    }
  },
  // Used internally to write to the file, appending it to the existing text.
  transcriptWrite: function(t) {
    let e = localStorage.getItem(this.transcriptName);
    e || (e = ""), e += `

` + t, localStorage.setItem(this.transcriptName, e);
  },
  transcriptClear: function(t) {
    localStorage.removeItem(this.transcriptName), C(a.transcript_cleared);
  },
  // Is there a transcript saved?
  transcriptExists: function(t) {
    return localStorage.getItem(this.transcriptName) !== void 0;
  },
  transcriptShow: function() {
    const t = localStorage.getItem(this.transcriptName);
    if (!t)
      return C(a.transcript_none), !1;
    let e = "";
    e += '<div id="main"><div id="inner"><div id="output">', e += a.transcriptTitle(), e += t, e += "</div></div></div>", u.showInTab(e, "QuestJS Transcript: " + l.title), C(a.done_msg);
  },
  transcriptWalk: function() {
    let t = "";
    t += '<div id="main"><div id="inner"><div id="output">', t += "<br/><h2>Generated QuestJS Walk-through</h2><br/><br/>", t += "<p>Copy-and-paste the code below into code.js. You can quickly run the walk-though with [Ctrl][Enter].</p>", t += "<p>If you already have a walk-through, you will need to just copy-and-paste the right bit - probably all but the first and last lines, and insert just before the curly brace at the end. You may need to rename it too.</p>", t += `<pre>


const walkthroughs = {
  c:[
`, t += this.transcriptWalkthrough.join(`
`), t += `
  ],
}</pre>`, t += "</div></div></div>", u.showInTab(t, "QuestJS Transcript: " + l.title);
  },
  achievementsKey: "__achievement__list__for__this__game__",
  setAchievement(t) {
    const e = localStorage.getItem(this.achievementsKey), n = e ? JSON.parse(e) : {};
    n[t] || (n[t] = Date.now(), $(a.ach_got_one, { text: t, date: n[t] }, { cssClass: "meta achieve", tag: "p" }), localStorage.setItem(this.achievementsKey, JSON.stringify(n)));
  },
  listAchievements() {
    const t = localStorage.getItem(this.achievementsKey), e = t ? JSON.parse(t) : {};
    if (Object.keys(e).length === 0) {
      $(a.ach_none_yet, {}, { cssClass: "meta achieve", tag: "p" });
      return;
    }
    $(a.ach_list_intro, { count: Object.keys(e).length }, { cssClass: "meta achieve", tag: "p" });
    for (const n in e)
      $(a.ach_list_item, { text: n, date: e[n] }, { cssClass: "meta achieve", tag: "p" });
  },
  resetAchievements() {
    localStorage.removeItem(this.achievementsKey);
  }
};
function Q(t, e) {
  return e === void 0 && (e = { tpNoParamsPassed: !0 }), typeof t != "string" && (t = "" + t), e.tpOriginalString = t, e.count && (e.item_count = e.count), y.usedStrings.includes(t) ? e.tpFirstTime = !1 : (y.usedStrings.push(t), e.tpFirstTime = !0), y.processText(t, e);
}
const y = {
  text_processors: {},
  setLoadString: function(t) {
    const e = t.split("=");
    if (e.length !== 2)
      return _("Bad format in saved data (" + t + ")");
    if (e[0] !== "TPUsedStrings")
      return _("Expected TP to be first");
    y.usedStrings = I.decodeArray(e[1]);
  },
  getSaveString: function() {
    return "TPUsedStrings=" + I.encodeArray(y.usedStrings);
  }
};
y.usedStrings = [];
y.colours = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe", "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000", "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080", "#ffffff", "#000000"];
y.addDirective = function(t, e) {
  y.text_processors[t] = e;
};
y.comparisons = {
  "=": "if",
  "==": "if",
  "!=": "ifNot",
  "!==": "ifNot",
  "<>": "ifNot",
  "<": "ifLessThan",
  ">": "ifMoreThan",
  "<=": "ifLessThanOrEqual",
  ">=": "ifMoreThanOrEqual"
};
y.processText = function(t, e) {
  const n = y.findFirstToken(t);
  if (n) {
    let s = n.split(":"), r = s.shift();
    if (typeof y.text_processors[r] != "function")
      if (r.startsWith("if ")) {
        const o = /if (not |)(\w+)\.(\w+) *([<>=!]{0,3}) *(.*)/.exec(r);
        o[4] === "" ? (s.unshift(o[3]), s.unshift(o[2]), r = o[1] === "not " ? "ifNot" : "if") : (s.unshift(o[5]), s.unshift(o[3]), s.unshift(o[2]), r = y.comparisons[o[4]]);
      } else if (r.match(/^(not)?here /)) {
        const o = r.split(" ");
        o.shift(), r = r.startsWith("here") ? "ifHere" : "ifNotHere";
        for (const c of o.reverse())
          s.unshift(c);
      } else if (r === "player")
        s.unshift(g().name), r = "show";
      else if (r === "currentLocation")
        s.unshift(E().name), r = "show";
      else if (m[r])
        s.unshift(r), r = "show";
      else if (s.length === 0)
        s = r.split("."), r = "show";
      else
        return _("Attempting to use unknown text processor directive '" + r + "' (" + e.tpOriginalString + ")"), t;
    t = t.replace("{" + n + "}", y.text_processors[r](s, e)), t = y.processText(t, e);
  }
  return t;
};
y.findFirstToken = function(t) {
  const e = t.indexOf("}");
  if (e === -1)
    return !1;
  const n = t.lastIndexOf("{", e);
  return n === -1 ? (_("Failed to find starting curly brace in text processor (<i>" + t + "</i>)"), !1) : t.substring(n + 1, e);
};
y.text_processors.i = function(t, e) {
  return "<i>" + t.join(":") + "</i>";
};
y.text_processors.b = function(t, e) {
  return "<b>" + t.join(":") + "</b>";
};
y.text_processors.u = function(t, e) {
  return "<u>" + t.join(":") + "</u>";
};
y.text_processors.s = function(t, e) {
  return "<strike>" + t.join(":") + "</strike>";
};
y.text_processors.code = function(t, e) {
  return "<code>" + t.join(":") + "</code>";
};
y.text_processors.sup = function(t, e) {
  return "<sup>" + t.join(":") + "</sup>";
};
y.text_processors.sub = function(t, e) {
  return "<sub>" + t.join(":") + "</sub>";
};
y.text_processors.huge = function(t, e) {
  return '<span style="font-size:2em">' + t.join(":") + "</span>";
};
y.text_processors.big = function(t, e) {
  return '<span style="font-size:1.5em">' + t.join(":") + "</span>";
};
y.text_processors.small = function(t, e) {
  return '<span style="font-size:0.8em">' + t.join(":") + "</span>";
};
y.text_processors.tiny = function(t, e) {
  return '<span style="font-size:0.6em">' + t.join(":") + "</span>";
};
y.text_processors.smallcaps = function(t, e) {
  return '<span style="font-variant:small-caps">' + t.join(":") + "</span>";
};
y.text_processors.cap = function(t, e) {
  return bs(t.join(":"));
};
y.text_processors.title = function(t, e) {
  return ws(t.join(":"));
};
y.text_processors.upper = function(t, e) {
  return t.join(":").toUpperCase();
};
y.text_processors.lower = function(t, e) {
  return t.join(":").toLowerCase();
};
y.text_processors.rainbow = function(t, e) {
  const n = t.pop(), s = t.length === 0 ? y.colours : t;
  let r = "";
  for (let o = 0; o < n.length; o++)
    r += '<span style="color:' + M.fromArray(s) + '">' + n.charAt(o) + "</span>";
  return r;
};
y._charSwap = function(t, e, n) {
  return t.match(/[A-Z]/) ? String.fromCharCode(t.charCodeAt(0) - "A".charCodeAt(0) + e) : t.match(/[a-z]/) ? String.fromCharCode(t.charCodeAt(0) - "a".charCodeAt(0) + n) : t;
};
y.text_processors.encode = function(t, e) {
  const n = parseInt(t.shift(), 16), s = parseInt(t.shift(), 16), r = t.shift();
  let o = "";
  for (let c = 0; c < r.length; c++)
    o += y._charSwap(r.charAt(c), n, s);
  return o;
};
y.text_processors.blur = function(t, e) {
  return '<span style="color:transparent;text-shadow: 0 0 ' + t.shift() + 'px rgba(0,0,0,1);">' + t.join(":") + "</span>";
};
y.text_processors.font = function(t, e) {
  return '<span style="font-family:' + t.shift() + '">' + t.join(":") + "</span>";
};
y.text_processors.class = function(t, e) {
  return '<span class="' + t.shift() + '">' + t.join(":") + "</span>";
};
y.text_processors.colour = function(t, e) {
  return '<span style="color:' + t.shift() + '">' + t.join(":") + "</span>";
};
y.text_processors.color = y.text_processors.colour;
y.text_processors.back = function(t, e) {
  return '<span style="background-color:' + t.shift() + '">' + t.join(":") + "</span>";
};
y.text_processors.dialogue = function(t, e) {
  let n = "<span";
  const s = t.shift();
  if (t.length < 1 && _("Failed to find enough parts in text processor 'dialog' (" + e.tpOriginalString + ")"), s.startsWith("."))
    n += ' class="' + s.replace(".", "") + '"';
  else if (e[s])
    n += ' style="' + e[s].dialogueStyle + '"';
  else {
    t.length < 2 && _("Failed to find enough parts in text processor 'dialog' without a class (" + e.tpOriginalString + ")");
    const r = t.shift();
    n += ' style="', s.includes("i") && (n += "font-style:italic;"), s.includes("b") && (n += "font-weight:bold;"), s.includes("u") && (n += "text-decoration:underline;"), r && (n += "color:" + r), n += '"';
  }
  return n += ">", n + l.openQuotation + t.join() + l.closeQuotation + "</span>";
};
y.text_processors.random = function(t, e) {
  return t[M.int(0, t.length - 1)];
};
y.text_processors.select = function(t, e) {
  return y.select(t, e, "none");
};
y.text_processors.selectNone = function(t, e) {
  return y.select(t, e, "none");
};
y.text_processors.selectWrap = function(t, e) {
  return y.select(t, e, "wrap");
};
y.text_processors.selectStart = function(t, e) {
  return y.select(t, e, "start");
};
y.text_processors.selectEnd = function(t, e) {
  return y.select(t, e, "end");
};
y.text_processors.cycle = function(t, e) {
  return y.select(t, e, "none", !0);
};
y.text_processors.cycleNone = function(t, e) {
  return y.select(t, e, "none", !0);
};
y.text_processors.cycleWrap = function(t, e) {
  return y.select(t, e, "wrap", !0);
};
y.text_processors.cycleStart = function(t, e) {
  return y.select(t, e, "start", !0);
};
y.text_processors.cycleEnd = function(t, e) {
  return y.select(t, e, "end", !0);
};
y.select = function(t, e, n, s) {
  let r = t.shift();
  if (r.match(/\./)) {
    const d = r.split(".");
    r = d[0], t.unshift(d[1]);
  }
  const o = y._findObject(r, e, t);
  o || _('Failed to find an object called "' + r + '" in text processor select.');
  const c = o[t[0]];
  if (c === void 0 && !s && _('Failed to find an attribute called "' + t[0] + '" for "' + r + '" in text processor "select" directive.'), Array.isArray(c)) {
    let d = o[t[1]];
    return s && (typeof d != "number" && (d = 0, o[t[1]] = 0), o[t[1]]++), c || _('Failed to find a secondary attribute called "' + t[1] + '" for "' + r + '" in text processor "select" directive.'), U.value(c, Math.round(d), n);
  }
  if (typeof c == "number")
    return s && o[t[0]]++, t.shift(), U.value(t, Math.round(c), n);
  if (c === void 0 && s)
    return o[t[0]] = 1, t.shift(), U.value(t, 0, n);
  _('Failed to do anything with the attribute called "' + t[1] + '" for "' + r + '" in text processor select - neither an array or an integer.');
};
y._findObject = function(t, e, n) {
  if (e && e[t])
    return typeof e[t] == "string" ? m[e[t]] : e[t];
  if (t === "player")
    return g();
  if (t === "currentLocation")
    return E();
  if (t === "settings")
    return l;
  if (t === "params")
    return e;
  if (m[t])
    return m[t];
  const s = t.split(".");
  if (s.length !== 1) {
    if (s.length > 2) {
      console.log("The text process cannot handle attributes of attributes, so failed to deal with: " + t), console.log(s);
      return;
    }
    return n.unshift(s[1]), m[s[0]];
  }
};
y.text_processors.multi = function(t, e) {
  return e.multiple ? B(e.item.alias) + ": " : "";
};
y.text_processors.show = function(t, e) {
  let n = t.shift();
  return y.handleShow(t, n, null, e);
};
y.text_processors.showOrNot = function(t, e) {
  let n = t.shift(), s = t.shift();
  return y.handleShow(t, n, s, e);
};
y.handleShow = function(t, e, n, s) {
  if (s[e] !== void 0)
    return typeof s[e] == "object" ? y.getWhatever(s[e][t[0]], s, s[e], n, t) : y.getWhatever(s[e], s, void 0, n, t);
  const r = y._findObject(e, s, t);
  return r ? y.getWhatever(r[t[0]], s, r, n, t) : _("Failed to find object '" + e + "' in text processor 'show' (" + s.tpOriginalString + ")");
};
y.text_processors.object = y.text_processors.show;
y.getWhatever = function(t, e, n, s, r) {
  if (t == null)
    return s || "";
  if (t === !1)
    return a.tp_false;
  if (t === !0)
    return a.tp_true;
  if (t === void 0)
    return "";
  if (typeof t == "string")
    return t;
  if (typeof t == "number")
    return t.toString();
  if (t && typeof t == "object")
    return r[0] ? t[r[0]] ? t[r[0]].toString() : _("Got an object, but no attribute valled " + r[0] + " in show for: " + t.name) : _("Got an object, but no attribute in show for: " + t.name);
  if (typeof t != "function")
    return _("Got a value of a type I was not expecting in show: " + typeof t);
  const o = t.bind(n);
  return r.shift(), y.getWhatever(o(e), e, n, s, r);
};
y.text_processors.contents = function(t, e) {
  let n = t.shift();
  const s = typeof e[n] == "object" ? e[n] : y._findObject(n, e, t);
  return s ? K(s.getContents(h.LOOK), { article: 1, sep: t[0], lastSep: t[1], nothing: t[2] }) : _("Failed to find object '" + n + "' in text processor 'contents' (" + e.tpOriginalString + ")");
};
y.text_processors.rndalt = function(t, e) {
  let n = t.shift();
  if (e[n]) {
    if (typeof e[n] == "string")
      return e[n];
    if (typeof e[n] == "number")
      return e[n].toString();
    if (t.length > 0)
      return e[n][t[0]];
  }
  const s = y._findObject(n, e, t);
  return s ? s.alt ? M.fromArray(s.alt) : s.alias : _("Failed to find object '" + n + "' in text processor 'show' (" + e.tpOriginalString + ")");
};
y.text_processors.number = function(t, e) {
  let n = t.shift();
  if (n.match(/^\d+$/))
    return a.toWords(parseInt(n));
  if (typeof e[n] == "number")
    return a.toWords(e[n], t[0]);
  const s = y._findObject(n, e, t);
  if (!s)
    return _("Failed to find object '" + n + "' in text processor 'number' (" + e.tpOriginalString + ")");
  const r = t.shift();
  return typeof s[r] == "number" ? a.toWords(s[r], t[0]) : _("Failed to find a number for object '" + n + "' in text processor (" + e.tpOriginalString + ")");
};
y.text_processors.ordinal = function(t, e) {
  let n = t.shift();
  if (n.match(/^\d+$/))
    return a.toOrdinal(parseInt(n));
  if (typeof e[n] == "number")
    return a.toOrdinal(e[n]);
  const s = y._findObject(n, e, t);
  return s ? typeof s[t[0]] == "number" ? a.toOrdinal(s[t[0]]) : _("Failed to find a number for object '" + n + "' in text processor (" + e.tpOriginalString + ")") : _("Failed to find object '" + n + "' in text processor 'number' (" + e.tpOriginalString + ")");
};
y.text_processors.money = function(t, e) {
  let n = t.shift();
  if (n.match(/^\d+$/))
    return ie(parseInt(n));
  if (typeof e[n] == "number")
    return ie(e[n]);
  const s = y._findObject(n, e, t);
  return s ? s.loc === g().name && s.getSellingPrice ? ie(s.getSellingPrice(g())) : s.loc === g().name && s.getBuyingPrice ? ie(s.getBuyingPrice(g())) : s.getPrice ? ie(s.getPrice()) : s.price ? ie(s.price) : s.money ? ie(s.money) : _("Failed to find a price for object '" + n + "' in text processor (" + e.tpOriginalString + ")") : _("Failed to find object '" + n + "' in text processor 'money' (" + e.tpOriginalString + ")");
};
y.text_processors.$ = y.text_processors.money;
y.text_processors.dateTime = function(t, e) {
  const n = { format: t[0] };
  return isNaN(t[1]) || (n.is = parseInt(t[1])), isNaN(t[2]) || (n.add = parseInt(t[2])), T.getDateTime(n);
};
y.text_processors.date = function(t, e) {
  return new Date(e[t[0]]).toLocaleString();
};
y.text_processors.transitDest = function(t, e) {
  const n = t[0] ? m[t[0]] : m[g().loc];
  if (!n.transitDoorDir)
    return _("Trying to use the 'transitDest' text process directive when the player is not in a transit location (" + e.tpOriginalString + ").");
  if (n.currentButtonName) {
    const r = m[n.currentButtonName];
    if (r.title)
      return r.title;
  }
  const s = n[n.transitDoorDir].name;
  return a.getName(m[s], { capital: !0 });
};
y.text_processors.img = function(t, e) {
  return '<img src="' + (t[0].includes("/") ? t[0] : l.imagesFolder + t[0]) + '" title="' + t[1] + '" alt="' + t[2] + '"/>';
};
y.once = function(t, e, n) {
  return t.tpFirstTime && e ? e : !t.tpFirstTime && n ? n : "";
};
y.text_processors.once = function(t, e) {
  return y.once(e, t[0], t[1]);
};
y.text_processors.first = y.text_processors.once;
y.text_processors.notOnce = function(t, e) {
  return y.once(e, t[1], t[0]);
};
y.text_processors.notfirst = y.text_processors.notOnce;
y.text_processors.cmd = function(t, e) {
  return t.length === 1 ? u.cmdlink(t[0], t[0]) : u.cmdlink(t[0], t[1]);
};
y.text_processors.command = function(t, e) {
  return t.length === 1 ? u.cmdlink(t[0], t[0]) : u.cmdlink(t[0], t[1]);
};
y.text_processors.exit = y.text_processors.command;
y.text_processors.page = y.text_processors.command;
y.text_processors.hour = function(t, e) {
  const n = T.getDateTimeDict().hour;
  return n < t[0] || n >= t[1] ? "" : t[2];
};
y.text_processors.link = function(t, e) {
  let n = t.shift();
  return '<a href="' + t.join(":") + '" target="_blank">' + n + "</a>";
};
y.text_processors.popup = function(t, e) {
  let n = t.shift(), s = t.join(":"), r = n.replace(/[^a-zA-Z_]/, "") + M.int(0, 999999999);
  const o = '<div id="' + r + `" class="popup" onclick="io.toggleDisplay('` + r + `')"><p>` + s + "</p></div>";
  return document.querySelector("#main").innerHTML += o, `<span class="popup-link" onclick="io.toggleDisplay('#` + r + `')">` + n + "</span>";
};
y.text_processors.roomSet = function(t, e) {
  const n = E().roomSetOrder - 1;
  return n < t.length ? t[n] : "";
};
y.text_processors.if = function(t, e) {
  return y.handleIf(t, e, !1);
};
y.text_processors.ifNot = function(t, e) {
  return y.handleIf(t, e, !0);
};
y.handleIf = function(t, e, n) {
  let s = t.shift(), r;
  if (typeof e[s] == "boolean")
    return e[s] ? t[0] : t[1] ? t[1] : "";
  const o = y._findObject(s, e, t);
  if (!o)
    return _("Failed to find object '" + s + "' in text processor 'if/ifNot' (" + e.tpOriginalString + ")");
  s = t.shift();
  let c = typeof o[s] == "function" ? o[s](e) : o[s];
  if (typeof c == "object" && (c = c.name), c === void 0 && (c = !1), typeof c == "boolean")
    r = c;
  else {
    let d = t.shift();
    if (typeof c == "number") {
      if (isNaN(d))
        return _("Trying to compare a numeric attribute, '" + s + "' with a string (" + e.tpOriginalString + ").");
      d = parseInt(d);
    }
    r = c === d;
  }
  return n && (r = !r), r ? t[0] : t[1] ? t[1] : "";
};
y.text_processors.ifIs = function(t, e) {
  return y.handleIfIs(t, e, !1);
};
y.text_processors.ifNotIs = function(t, e) {
  return y.handleIfIs(t, e, !0);
};
y.handleIfIs = function(t, e, n) {
  let s = t.shift(), r;
  const o = y._findObject(s, e, t);
  if (!o)
    return _("Failed to find object '" + s + "' in text processor 'if/ifNot' (" + e.tpOriginalString + ")");
  s = t.shift();
  let c = typeof o[s] == "function" ? o[s](e) : o[s];
  typeof c == "object" && (c = c.name);
  const d = T.guessMyType(t.shift());
  return r = c === d, n && (r = !r), r ? t[0] : t[1] ? t[1] : "";
};
y.text_processors.ifExists = function(t, e) {
  return y.handleIfExists(t, e, !1);
};
y.text_processors.ifNotExists = function(t, e) {
  return y.handleIfExists(t, e, !0);
};
y.handleIfExists = function(t, e, n) {
  let s = t.shift(), r;
  const o = y._findObject(s, e, t);
  return o ? (s = t.shift(), r = o[s] !== void 0, n && (r = !r), r ? t[0] : t[1] ? t[1] : "") : _("Failed to find object '" + s + "' in text processor 'if/ifNotExists' (" + e.tpOriginalString + ")");
};
y.text_processors.ifLessThan = function(t, e) {
  return y.handleIfLessMoreThan(t, e, !1, !1);
};
y.text_processors.ifMoreThan = function(t, e) {
  return y.handleIfLessMoreThan(t, e, !0, !1);
};
y.text_processors.ifLessThanOrEqual = function(t, e) {
  return y.handleIfLessMoreThan(t, e, !1, !0);
};
y.text_processors.ifMoreThanOrEqual = function(t, e) {
  return y.handleIfLessMoreThan(t, e, !0, !0);
};
y.handleIfLessMoreThan = function(t, e, n, s) {
  let r = t.shift(), o;
  const c = y._findObject(r, e, t);
  if (!c)
    return _("Failed to find object '" + r + "' in text processor 'ifLessMoreThan' (" + e.tpOriginalString + ")");
  r = t.shift();
  let d = typeof c[r] == "function" ? c[r](e) : c[r];
  if (typeof d != "number")
    return _("Trying to use ifLessThan with a non-numeric (or nonexistent) attribute, '" + r + "' (" + e.tpOriginalString + ").");
  let p = t.shift();
  return isNaN(p) ? _("Trying to compare a numeric attribute, '" + r + "' with a string (" + e.tpOriginalString + ").") : (p = parseInt(p), o = n ? s ? d >= p : d > p : s ? d <= p : d < p, o ? t[0] : t[1] ? t[1] : "");
};
y.text_processors.ifHere = function(t, e) {
  return y.handleIfHere(t, e, !1, "loc");
};
y.text_processors.ifNotHere = function(t, e) {
  return y.handleIfHere(t, e, !0, "loc");
};
y.text_processors.ifHeld = function(t, e) {
  return y.handleIfHere(t, e, !1, "name");
};
y.text_processors.ifNotHeld = function(t, e) {
  return y.handleIfHere(t, e, !0, "name");
};
y.handleIfHere = function(t, e, n, s) {
  const r = t.shift(), o = y._findObject(r, e, t);
  if (!o)
    return _("Failed to find object '" + r + "' in text processor 'ifHere' (" + e.tpOriginalString + ")");
  let c = o.isAtLoc(g()[s], h.ALL);
  return n && (c = !c), c ? t[0] : t[1] ? t[1] : "";
};
y.text_processors.ifPlayer = function(t, e) {
  return y.handleIfPlayer(t, e, !1);
};
y.text_processors.ifNotPlayer = function(t, e) {
  return y.handleIfPlayer(t, e, !0);
};
y.handleIfPlayer = function(t, e, n) {
  let s = t.shift(), r;
  const o = y._findObject(s, e, t);
  return o ? (r = o === g(), n && (r = !r), r ? t[0] : t[1] ? t[1] : "") : _("Failed to find object '" + s + "' in text processor 'if/ifNotPlayer' (" + e.tpOriginalString + ")");
};
y.text_processors.terse = function(t, e) {
  return l.verbosity === h.TERSE && E().visited === 0 || l.verbosity === h.VERBOSE || e.fullDescription ? B(t.join(":")) : "";
};
y.text_processors.hereDesc = function(t, e) {
  let n;
  const s = l.getLocationDescriptionAttName();
  if (typeof E()[s] == "string")
    n = E()[s];
  else if (typeof E()[s] == "function") {
    if (n = E()[s](), n === void 0)
      return log("This location description is not set up properly. It has a '" + s + `' function that does not return a string. The location is "` + E().name + '".'), "[Bad description, F12 for details]";
  } else
    n = "This is a location in dire need of a description.";
  for (const r of _s())
    typeof r.scenery == "string" && (n += (l.sceneryOnNewLine ? "|" : " ") + r.scenery);
  return delete e.tpFirstTime, Q(n, e);
};
y.text_processors.hereName = function(t, e) {
  return E().headingAlias;
};
y.text_processors.objectsHere = function(t, e) {
  return dn().length === 0 ? "" : t.join(":");
};
y.text_processors.exitsHere = function(t, e) {
  return E().getExitDirs().length === 0 ? "" : t.join(":");
};
y.text_processors.objects = function(t, e) {
  const n = dn();
  return K(n, {
    article: 1,
    lastSep: a.list_and,
    modified: !0,
    nothing: a.list_nothing,
    loc: g().loc
  });
};
y.text_processors.exits = function(t, e) {
  const n = E().getExitDirs();
  return K(n, { lastSep: a.list_or, nothing: a.list_nowhere });
};
y.text_processors.nm = function(t, e) {
  return y.nameFunction(t, e, !1);
};
y.text_processors.nms = function(t, e) {
  return y.nameFunction(t, e, !0);
};
y.text_processors.list = function(t, e) {
  return y.nameFunction(t, e, !1, !0);
};
y.nameFunction = function(t, e, n, s) {
  const r = t.shift();
  let o;
  if (s) {
    if (o = e[r], !o)
      return _("Cannot find parameter for list text processor directive:" + r), !1;
    if (!Array.isArray(o))
      return _("Parameter for list text processor directive is not a list:" + r), !1;
  } else if (o = y._findObject(r, e, t), !o)
    return !1;
  const c = { possessive: n };
  t[0] === "THE" && (c.article = 2, c.ignorePossessive = !0), t[0] === "the" && (c.article = 2), t[0] === "the-pa" && (c.article = 2, c.possAdj = !0), t[0] === "A" && (c.article = 1, c.ignorePossessive = !0), t[0] === "a" && (c.article = 1), t[0] === "a-pa" && (c.article = 1, c.possAdj = !0), t[2] && c.possAdj && (c.possAdj = y._findObject(t[2], e, [])), t[0] === "count" && (c.article = 3), e[o.name + "_count"] && (c[o.name + "_count"] = e[o.name + "_count"]), e[r + "_count"] && (c[o.name + "_count"] = e[r + "_count"]), e[o.name + "_count_loc"] && (c.loc = e[o.name + "_count_loc"]);
  let d = 2;
  for (; t[d]; )
    c[t[d]] = e[t[d]], d++;
  c.lastSep = a.list_and, c.othing = a.list_nothing;
  const p = s ? K(o, c) : a.getName(o, c);
  return t[1] === "true" ? B(p) : p;
};
y.text_processors.nv = function(t, e) {
  return y.conjugations(a.nounVerb, t, e);
};
y.text_processors.pv = function(t, e) {
  return y.conjugations(a.pronounVerb, t, e);
};
y.text_processors.vn = function(t, e) {
  return y.conjugations(a.verbNoun, t, e);
};
y.text_processors.vp = function(t, e) {
  return y.conjugations(a.verbPronoun, t, e);
};
y.text_processors.cj = function(t, e) {
  return y.conjugations(a.conjugate, t, e);
};
y.conjugations = function(t, e, n) {
  const s = e.shift(), r = y._findObject(s, n, e);
  if (!r)
    return !1;
  const o = { capitalise: e[1] === "true" };
  let c = 2;
  for (; e[c]; )
    o[e[c]] = n[e[c]], c++;
  return t(r, e[0], o);
};
y.handlePronouns = function(t, e, n) {
  const s = t.shift(), r = y._findObject(s, e, t);
  return r ? t[0] === "true" ? B(r.pronouns[n]) : r.pronouns[n] : !1;
};
y.text_processors.pa = function(t, e) {
  return y.handlePronouns(t, e, "possAdj");
};
y.text_processors.ob = function(t, e) {
  return y.handlePronouns(t, e, "objective");
};
y.text_processors.sb = function(t, e) {
  return y.handlePronouns(t, e, "subjective");
};
y.text_processors.ps = function(t, e) {
  return y.handlePronouns(t, e, "possessive");
};
y.text_processors.rf = function(t, e) {
  return y.handlePronouns(t, e, "reflexive");
};
y.text_processors.pa2 = function(t, e) {
  const n = t.shift(), s = y._findObject(n, e, t);
  if (!s)
    return !1;
  const r = t.shift(), o = y._findObject(r, e, t);
  if (!o)
    return !1;
  if (s.pronouns === o.pronouns && s !== o) {
    const c = { article: 2, possessive: !0 };
    return t[0] === "true" ? B(a.getName(s, c)) : a.getName(s, c);
  }
  return t[0] === "true" ? B(s.pronouns.possAdj) : s.pronouns.possAdj;
};
y.text_processors.pa3 = function(t, e) {
  const n = t.shift(), s = y._findObject(n, e, t);
  if (!s)
    return !1;
  const r = t.shift(), o = y._findObject(r, e, t);
  if (!o)
    return !1;
  if (s !== o) {
    const c = { article: 2, possessive: !0 };
    return t[0] === "true" ? B(a.getName(subject, c)) : a.getName(subject, c);
  }
  return t[0] === "true" ? B(s.pronouns.possAdj) : s.pronouns.possAdj;
};
const ot = function(t, e, n) {
  return console.error("ERROR: " + t), h.isCreated && (u.print({ tag: "p", cssClass: "error", text: a.error }), I.transcriptAppend({ cssClass: "error", text: t, stack: e.stack }), u.reset()), n || (console.log('Look through the trace below to find the offending code. The first entry in the list may be "errormsg" in the file "_io.js", which is me so can be ignored. The next will the code that detected the error and called the "errormsg" message. You may need to look further down to find the root cause, especially for a text process issue.'), l.playMode !== "dev" && console.log("If this is uploaded, it might be worth doing [Crtl]-[Shft]-R to reload the page. You will lose any progress, but it will clear the browser cache and ensure you are using the latest version of the game files."), console.log(e)), !1;
};
l.playMode !== "dev" && (window.onbeforeunload = function(t) {
  t.returnValue = "Are you sure?";
});
l.mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
l.autoscroll = !l.mediaQuery.matches;
function $(t, e, n) {
  n.tag === void 0 && (n.tag = "p"), n.cssClass === void 0 && (n.cssClass = "default-" + n.tag.toLowerCase());
  let s = e ? Q(t, e).trim() : t.trim();
  if (!(s === "" && !n.printBlank))
    for (let r of s.split("|")) {
      for (const c in u.escapeCodes)
        r = r.replace(RegExp("@@@" + c + "@@@", "ig"), u.escapeCodes[c]);
      l.convertDoubleDash && !R.testing && (r = r.replace(/ -- /g, " &mdash; "));
      const o = {};
      Object.assign(o, n), o.text = r, o.action || (o.action = "output"), R.testing ? (R.ignoreHTML && (r = r.replace(/(<([^>]+)>)/gi, "")), R.fullOutputData ? R.testOutput.push(o) : R.testOutput.push(r)) : u.addToOutputQueue(o);
    }
}
function xt(t) {
  $(t, !1, {});
}
function x(t, e, n) {
  if (e || (e = {}), typeof t != "string") {
    console.error('Trying to print with "msg", but got this instead of a string:'), console.error(t);
    const s = new Error();
    throw log(s.stack), "Bad string for msg()";
  }
  /^#/.test(t) && !n ? (t = t.replace(/^#/, ""), $(t, e, { cssClass: "default-h default-h4", tag: "h4" })) : $(t, e, { cssClass: n, tag: "p" });
}
function to(t, e, n) {
  if (e || (e = {}), typeof t != "string")
    throw console.error('Trying to print with "msgPre", but got this instead of a string:'), console.error(t), console.trace(), "Bad string for msgPre()";
  $(t, e, { cssClass: n, tag: "pre" });
}
function no(t, e, n) {
  t.startsWith(" ") && (t = "&nbsp;" + t.substring(1, t.length)), t.endsWith(" ") && (t = t.substring(0, t.length - 1) + "&nbsp;"), x("@@OUTPUTTEXTNOBR@@" + t, e, n);
}
function so() {
  $("", !1, { tag: "p", printBlank: !0 });
}
function ro(t, e, n) {
  let s = "";
  for (let r of t)
    s += "  <p>" + r + `</p>
`;
  $(s, e || {}, { cssClass: n, tag: "div" });
}
function io(t, e, n, s) {
  let r = "";
  for (let o of t)
    r += "  <li>" + o + `</li>
`;
  $(r, n || {}, { cssClass: s, tag: e ? "ol" : "ul" });
}
function Ts(t, e, n, s) {
  let r = "";
  if (e) {
    r += `  <tr>
`;
    for (let o of e)
      r += "    <th>" + o + `</th>
`;
    r += `  </tr>
`;
  }
  for (let o of t) {
    r += `  <tr>
`;
    for (let c of o)
      r += "    <td>" + Q(c, n).trim() + `</td>
`;
    r += `  </tr>
`;
  }
  $(r, n || {}, { cssClass: s, tag: "table" });
}
function Gt(t, e, n) {
  $(t, n || {}, { tag: "h" + e, cssClass: "default-h default-h" + e });
}
function oo(t, e, n) {
  const s = t.includes("/") ? t : l.imagesFolder + t;
  $("", {}, { action: "output", width: e, height: n, tag: "img", src: s, printBlank: !0 });
}
function ao(t, e, n) {
  const s = t.includes("/") ? t : l.imagesFolder + t;
  $("", {}, { action: "output", width: e, height: n, tag: "img", src: s, cssClass: "centred", printBlank: !0, destination: "quest-image" });
}
function co(t) {
  $("Your browser does not support the <code>audio</code> element.", {}, { action: "sound", name: t });
}
function Cs(t, e) {
  $("Your browser does not support the <code>audio</code> element.", {}, { action: "ambient", name: t, volume: e });
}
function lo(t) {
  $("Your browser does not support the <code>video</code> element.", {}, { action: "output", autoplay: !0, tag: "video", src: l.videoFolder + "/" + t });
}
function uo(t, e, n, s) {
  s || (s = {});
  let r = '<svg width="' + t + '" height="' + e + '" viewBox="';
  r += s.x !== void 0 ? "" + s.x + " " + s.y : "0 0", r += " " + t + " " + e + '" ', s.background && (r += 'style="background:' + s.background + '" '), r += 'xmlns="http://www.w3.org/2000/svg">', r += n.join("") + "</svg>", l.reportAllSvg && console.log(r.replace(/></g, `>
<`)), s.destination ? document.querySelector("#" + s.destination).innerHTML = r : xt(r);
}
function k(t, e) {
  return $(t, e || {}, { cssClass: "default-p failed", tag: "p" }), h.FAILED;
}
function L(t, e) {
  return $(t, e || {}, { cssClass: "default-p failed", tag: "p" }), !1;
}
function C(t, e) {
  $(t, e || {}, { cssClass: "meta", tag: "p" });
}
function at(t) {
  return $(t, !1, { cssClass: "parser", tag: "p" }), !1;
}
function gn(t) {
  return $(t, !1, { cssClass: "comment", tag: "p" }), !1;
}
function _(t, e) {
  if (R.errorOutput !== void 0)
    return R.errorOutput.push(t), !1;
  ot(t, new Error("error state caught by QuestJS runtime"), e);
}
function W(t) {
  (l.playMode === "dev" || l.playMode === "meta") && (u.print({ tag: "pre", cssClass: "debug", text: t, id: u.nextid }), u.nextid++);
}
function fo() {
  xt("&nbsp;");
}
function ho() {
  xt("<hr/>");
}
function yn() {
  u.addToOutputQueue({ action: "clear" });
}
function xs(t, e, n) {
  R.testing || l.walkthroughInProgress || (t === void 0 ? u.addToOutputQueue({ action: "wait", text: e, cssClass: "continue", func: n }) : u.addToOutputQueue({ action: "delay", delay: t, text: e, cssClass: "continue", func: n }));
}
function mo(t) {
  u.addToOutputQueue({ action: "func", func: t });
}
function kt(t, e, n) {
  const s = { article: 2, capital: !0, noLinks: !0 };
  u.input(t, e, !1, n, function(r) {
    for (let o = 0; o < r.length; o++) {
      let c = '<a class="menu-option" onclick="io.menuResponse(' + o + ')">';
      c += typeof r[o] == "string" ? r[o] : a.getName(r[o], s), c += "</a>", x(c);
    }
  });
}
function ks(t, e, n) {
  const s = { article: 2, capital: !0, noLinks: !0 };
  f.overrideWith(function(o) {
    u.menuResponse(o);
  });
  const r = function(o) {
    o ? (u.disable(3), u.keydownFunctions.push(u.keydownForMenuFunction)) : u.enable();
  };
  u.input(t, e, r, n, function(o) {
    for (let c = 0; c < o.length; c++) {
      let d = c + 1 + '. <a class="menu-option" onclick="io.menuResponse(' + c + ')">';
      d += typeof o[c] == "string" ? o[c] : a.getName(o[c], s), d += "</a>", x(d);
    }
  });
}
function bn(t, e, n) {
  const s = { article: 2, capital: !0, noLinks: !0 };
  f.overrideWith(function(c) {
    u.menuResponse(c);
  });
  const r = function(c) {
    c ? u.disable(2) : (u.enable(), u.doNotSaveInput = !1);
  }, o = function(c) {
    x("I do not understand: " + c), ce(c), u.savedCommands.push(c);
  };
  u.doNotSaveInput = !0, u.input(t, e, r, n, function(c) {
    for (let d = 0; d < c.length; d++) {
      let p = d + 1 + '. <a class="menu-option" onclick="io.menuResponse(' + d + ')">';
      p += typeof c[d] == "string" ? c[d] : a.getName(c[d], s), p += "</a>", x(p);
    }
  }, o);
}
function wn(t, e, n) {
  const s = { article: 2, capital: !0, noLinks: !0 };
  u.input(t, e, !1, n, function(r) {
    let o = '<select id="menu-select" class="custom-select" style="width:400px;" ';
    o += `onchange="io.menuResponse(io.getDropDownText('menu-select'))">`, o += '<option value="-1">-- Select one --</option>';
    for (let c = 0; c < r.length; c++)
      o += '<option value="' + (c + 1) + '">', o += typeof r[c] == "string" ? r[c] : a.getName(r[c], s), o += "</option>";
    x(o + "</select>"), document.querySelector("#menu-select").focus();
  });
}
function Es(t, e, n, s) {
  u.showMenuDiagTitle = t;
  const r = { article: 2, capital: !0, noLinks: !0 }, o = function(d) {
    if (d)
      u.disable(3);
    else if (u.enable(), !R.testing) {
      const p = document.querySelector("#sidepane-menu");
      p && p.remove();
    }
  }, c = function(d) {
    let p = '<div id="sidepane-menu"';
    s && (p += ' class="' + s + '"'), p += ">", typeof u.showMenuDiagTitle == "string" ? p += '<p class="sidepane-menu-title">' + u.showMenuDiagTitle + "</p>" : (p += '<h4 class="sidepane-menu-title">' + u.showMenuDiagTitle.title + "</h4>", p += '<p class="sidepane-menu-title">' + u.showMenuDiagTitle.text + "</p>");
    for (let v = 0; v < d.length; v++)
      p += '<p value="' + v + '" onclick="io.menuResponse(' + v + ')" class="sidepane-menu-option">', p += typeof d[v] == "string" ? d[v] : a.getName(d[v], r), p += "</p>";
    p += "</div>", document.querySelector("body").innerHTML += p;
  };
  return u.input(!1, e, o, n, c), h.SUCCESS_NO_TURNSCRIPTS;
}
function po(t, e) {
  kt(t, a.yesNo, e);
}
function go(t, e) {
  bn(t, a.yesNo, e);
}
function yo(t, e) {
  wn(t, a.yesNo, e);
}
function Ns(t, e) {
  u.menuFns.push(e), x(t), u.disable(2), document.querySelector("#input").style.display = "block", f.overrideWith(function(n) {
    u.enable(), l.textInput || (document.querySelector("#input").style.display = "none"), u.savedCommands.pop(), u.savedCommandsPos > u.savedCommands.length && (u.savedCommandsPos = u.savedCommands.length), u.menuFns.pop()(n);
  });
}
function bo(t, e, n) {
  if (!n)
    return _("Trying to use showDiag with no button");
  Is({ title: t, text: e, width: 400, height: "auto" }, null, n);
}
function Is(t, e, n) {
  u.menuFns.push(e), u.showMenuDiagTitle = t, u.showMenuDiagSubmit = n;
  const s = function(o) {
    if (o)
      u.disable(3);
    else {
      u.enable();
      const c = document.querySelector("#sidepane-text");
      c && c.remove();
    }
  }, r = function() {
    let o = '<div id="sidepane-menu"';
    if (t.width && (o += ' style="width:' + t.width + 'px;top:100px;"'), o += ">", typeof t == "string" ? o += '<p class="sidepane-menu-title">' + u.showMenuDiagTitle + "</p>" : (o += '<h4 class="sidepane-menu-title">' + u.showMenuDiagTitle.title + "</h4>", o += '<p class="sidepane-menu-title">' + u.showMenuDiagTitle.text + "</p>"), e && (o += '<input type="text" id="text-dialog" class="sidepane-menu-option">'), u.showMenuDiagSubmit && (o += '<div id="dialog-footer" style="text-align:right"><hr>', o += '<input type="button" onclick="io.textResponse()" value="' + u.showMenuDiagSubmit + '" class="sidepane-menu-button"></div>'), o += "</div>", document.querySelector("body").innerHTML += o, e) {
      const c = document.getElementById("text-dialog");
      c.addEventListener("keydown", function(d) {
        d.keyCode === 13 && (d.preventDefault(), u.textResponse());
      }), c.focus(), u.menuFns.pop();
    }
  };
  return u.input(!1, [], s, e, r), h.SUCCESS_NO_TURNSCRIPTS;
}
function ue(t) {
  if (!E())
    return _("currentLocation not set (" + (g() ? "but player is" : "nor is player") + ")");
  if (l.panes !== "none" && t) {
    for (let e of a.exit_list) {
      const n = document.querySelector("#exit-" + e.name);
      n && (E().hasExit(e.name, { excludeScenery: !0 }) || e.type === "nocmd" ? n.style.display = "block" : n.style.display = "none");
    }
    u.updateStatus();
  }
  for (let e of u.modulesToUpdate)
    e.update(t);
  u.updateUIItems(), l.updateCustomUI && l.updateCustomUI(), u.scrollToEnd(), l.textInput && document.querySelector("#textbox").focus();
}
function wo(t, e, n, s) {
  const r = document.querySelector("#panes"), o = document.createElement("div");
  o.id = n + "-outer", o.classList.add("pane-div"), o.innerHTML = u.getSidePaneHeadingHTML(e) + '<div id="' + n + '">' + s() + "</div>", r.insertBefore(o, r.children[t]), l.customPaneFunctions[n] = s;
}
const u = {
  // Each line that is output is given an id, n plus an id number.
  nextid: 0,
  // A list of names for items currently world. in the inventory panes
  currentItemList: [],
  modulesToUpdate: [],
  modulesToInit: [],
  modulesToDisable: [],
  modulesToEnable: [],
  spoken: !1,
  //False for normal function, true if things should be printed to the same paragraph
  otnb: !1,
  sameLine: !1,
  slID: "output",
  menuFns: [],
  keydownFunctions: [],
  escapeCodes: {
    colon: ":",
    lcurly: "{",
    rcurly: "}",
    lsquare: "[",
    rsquare: "]",
    vert: "|",
    hash: "#"
  },
  menuFunctions: {
    showMenu: kt,
    showDropDown: wn,
    showMenuNumbersOnly: ks,
    showMenuWithNumbers: bn,
    showMenuDiag: Es
  },
  showInTab: function(t, e = "Quest JS Tab") {
    const n = location.protocol + "//" + location.pathname.replace("index.html", ""), s = window.open("about:blank", "_blank");
    if (!s)
      return C(a.new_tab_failed), !1;
    l.loadCssFiles(s.document, n);
    const r = s.document.createElement("script");
    r.setAttribute("src", n + "lib/_transcript.js"), s.document.head.appendChild(r), s.document.body.innerHTML = t, s.document.title = e, s.document.head.setAttribute("data-favicon", l.favicon), s.document.head.setAttribute("data-path", n);
    const o = s.document.createElement("link");
    o.id = "dynamic-favicon", o.rel = "shortcut icon", o.href = n + l.favicon, s.document.head.appendChild(o);
  }
};
u.input = function(t, e, n, s, r, o) {
  if (u.menuStartId = u.nextid, u.menuFns.push(s), u.menuFailFn = o, u.menuOptions = e, u.disableTextFunction = n || function(c) {
    c && u.disable(3), c || u.enable();
  }, R.testing) {
    if (R.menuResponseNumber === void 0)
      W("Error when testing menu (possibly due to disambiguation?), test.menuResponseNumber = " + R.menuResponseNumber);
    else {
      let c;
      Array.isArray(R.menuResponseNumber) ? (c = R.menuResponseNumber.shift(), R.menuResponseNumber.length === 0 && delete R.menuResponseNumber) : (c = R.menuResponseNumber, delete R.menuResponseNumber), u.menuResponse(c);
    }
    return;
  }
  if (l.walkthroughMenuResponses.length > 0) {
    const c = l.walkthroughMenuResponses.shift();
    typeof c == "number" ? u.menuResponse(c) : u.textResponse(c);
    return;
  }
  u.disableTextFunction(!0), t && x(t, {}, "menu-title"), r(e);
};
u.outputQueue = [];
u.outputSuspended = !1;
u.unpause = function() {
  document.querySelector(".continue").remove(), u.textBecamesOld(), u.outputSuspended = !1, u.outputFromQueue(), l.textInput && document.querySelector("#textbox").focus();
};
u.addToOutputQueue = function(t) {
  t.id = u.nextid, u.outputQueue.push(t), u.nextid++, u.outputFromQueue();
};
u.forceOutputFromQueue = function() {
  u.outputSuspended = !1, u.outputFromQueue();
};
u.outputFromQueue = function() {
  if (u.outputSuspended)
    return;
  if (u.outputQueue.length === 0) {
    u.disableTextFunction || u.enable();
    return;
  }
  const t = u.outputQueue.shift();
  if (t.action === "wait" && (!l.disableWaitInDevMode || l.playMode !== "dev") && (u.disable(), u.outputSuspended = !0, t.tag = "p", t.onclick = "io.unpause()", t.text || (t.text = a.click_to_continue), u.print(t)), t.action === "delay" && (!l.disableWaitInDevMode || l.playMode !== "dev") && (log("here"), u.disable(), u.outputSuspended = !0, t.text && (t.tag = "p", u.print(t)), setTimeout(u.unpause, t.delay * 1e3)), t.action === "output" && (u.print(t), u.speak(t.text), I.transcriptAppend(t), u.outputFromQueue()), t.action === "func" && t.func() && u.outputFromQueue(), t.action === "effect" && (u.disable(), t.effect(t)), t.action === "clear" && (document.querySelector("#output").textContent = "", u.outputFromQueue()), t.action === "sound" && !l.silent) {
    const e = document.getElementById(t.name);
    e.currentTime = 0, e.play();
  }
  if (t.action === "ambient") {
    for (let e of document.getElementsByTagName("audio"))
      e.pause();
    if (!l.silent && t.name) {
      const e = document.getElementById(t.name);
      e.currentTime = 0, e.loop = !0, e.play(), t.volume && (e.volume = t.volume / 10);
    }
  }
  u.scrollToEnd(), l.textInput && document.querySelector("#textbox").focus();
};
u.allowedHtmlAttrs = ["width", "height", "onclick", "src", "autoplay"];
u.print = function(t) {
  let e;
  if (typeof t == "string" && (e = t), t.html)
    e = t.html;
  else if (u.sameLine)
    e = t.text;
  else {
    e = "<" + t.tag + ' id="n' + t.id + '"', t.cssClass && (e += ' class="' + t.cssClass + '"');
    for (let n of u.allowedHtmlAttrs)
      t[n] && (e += " " + n + '="' + t[n] + '"');
    e += ">" + t.text + "</" + t.tag + ">";
  }
  if (t.destination)
    document.querySelector("#" + t.destination).innerHTML = e;
  else {
    let n = e.indexOf("@@OUTPUTTEXTNOBR@@") > -1, s = "n" + (t.id - 1);
    if (n && (e = e.replace("@@OUTPUTTEXTNOBR@@", "")), u.sameLine) {
      let r = document.getElementById(s);
      r.innerHTML = r.innerHTML + e, u.sameLine = !1;
    } else
      document.querySelector("#output").innerHTML += e;
    u.sameLine = n;
  }
  return e;
};
u.typewriterEffect = function(t) {
  t.position || (document.querySelector("#output").innerHTML += "<" + t.tag + ' id="n' + t.id + '" class="typewriter"></' + t.tag + ">", t.position = 0, t.text = Q(t.text, t.params));
  const e = document.querySelector("#n" + t.id);
  e.innerHTML = t.text.slice(0, t.position) + '<span class="typewriter-active">' + t.text.slice(t.position, t.position + 1) + "</span>", t.position++, t.position <= t.text.length && (u.outputQueue.unshift(t), u.outputSuspended = !0), setTimeout(u.forceOutputFromQueue, l.textEffectDelay);
};
u.unscrambleEffect = function(t) {
  if (!t.count) {
    document.querySelector("#output").innerHTML += "<" + t.tag + ' id="n' + t.id + '" class="typewriter"></' + t.tag + ">", t.count = 0, t.text = Q(t.text, t.params), t.pick || (t.pick = u.unscamblePick), t.mask = "", t.scrambled = "";
    for (let e = 0; e < t.text.length; e++)
      t.text.charAt(e) === " " && !t.incSpaces ? (t.scrambled += " ", t.mask += " ") : (t.scrambled += t.pick(e), t.mask += "x", t.count++);
  }
  if (t.randomPlacing) {
    let e = M.int(0, t.count - 1), n = "";
    for (let s = 0; s < t.mask.length; s++)
      t.mask.charAt(s) === " " ? n += " " : e === 0 ? (n += " ", e--) : (n += "x", e--);
    t.mask = n;
  } else
    t.mask = t.mask.replace("x", " ");
  t.count--, document.querySelector("#n" + t.id).innerHTML = u.unscambleScramble(t), t.count > 0 && (u.outputQueue.unshift(t), u.outputSuspended = !0), setTimeout(u.forceOutputFromQueue, l.textEffectDelay);
};
u.unscamblePick = function() {
  let t = String.fromCharCode(M.int(33, 125));
  return t === "<" ? "~" : t;
};
u.unscambleScramble = function(t) {
  let e = "";
  for (let n = 0; n < t.text.length; n++)
    e += t.mask.charAt(n) === " " ? t.text.charAt(n) : t.pick(n);
  return e;
};
u.cmdlink = function(t, e) {
  return `<a class="cmd-link" onclick="runCmd('${t}')">${e}</a>`;
};
u.setTitleAndInit = function(t) {
  document.title = t;
  for (let e of u.modulesToInit)
    e.init();
  u.calcMargins();
};
u.calcMargins = function() {
  let t = 0;
  if (typeof map < "u" && (l.hideMap || (t = l.mapWidth)), typeof imagePane < "u" && !l.hideImagePane && l.imageWidth > t && (t = l.imageWidth), document.querySelector("#main").style.marginLeft = "40px", document.querySelector("#main").style.marginRight = "40px", l.panes !== "none") {
    const n = l.panes === "left" ? "margin-left" : "margin-right";
    u.resizePanesListener.matches ? (document.querySelector("#main").style[n] = u.mainGutter + "px", document.querySelector("#panes").style.display = "none") : (document.querySelector("#main").style[n] = u.panesWidth + u.mainGutter + "px", document.querySelector("#panes").style.display = "block");
  }
  let e = l.panes === "right" ? "margin-left" : "margin-right";
  l.mapImageSide && (e = l.mapImageSide === "left" ? "margin-left" : "margin-right"), u.resizeMapImageListener.matches || l.hideMap ? (document.querySelector("#main").style[e] = u.mainGutter + "px", document.querySelector("#quest-image").style.display = "none", document.querySelector("#quest-map").style.display = "none") : (document.querySelector("#main").style[e] = t + u.mainGutter + "px", document.querySelector("#quest-image").style.display = "block", document.querySelector("#quest-map").style.display = "block");
};
u.mainGutter = 20;
u.panesWidth = 160;
u.resizePanesListener = window.matchMedia("(max-width: " + l.panesCollapseAt + "px)");
u.resizeMapImageListener = window.matchMedia("(max-width: " + l.mapAndImageCollapseAt + "px)");
u.resizePanesListener.addListener(u.calcMargins);
u.resizeMapImageListener.addListener(u.calcMargins);
u.disableLevel = 0;
u.disable = function(t) {
  if (t || (t = 1), !(t <= u.disableLevel)) {
    u.disableLevel = t, t !== 2 && (document.querySelector("#input").style.display = "none"), u.setCssByClass("compass-button .dark-body", "color", "#808080"), u.setCssByClass("item", "color", "#808080"), u.setCssByClass("item-action", "color", "#808080");
    for (let e of u.modulesToDisable)
      e.ioDisable(t);
  }
};
u.enable = function() {
  if (u.disableLevel) {
    u.disableLevel = 0, document.querySelector("#input").style.display = "block", l.panes !== "none" && (u.setCssByClass("compass-button .dark-body", "color", u.textColour), u.setCssByClass("item", "color", u.textColour), u.setCssByClass("item-action", "color", u.textColour));
    for (let t of u.modulesToEnable)
      t.ioEnable();
  }
};
u.reset = function() {
  u.enable(), u.menuFns = [], u.keydownFunctions = [];
};
u.startCommand = function() {
  u.textBecamesOld();
};
u.textBecamesOld = function() {
  u.addClassForClass("default-p", "old-text"), u.addClassForClass("default-h", "old-text"), u.addClassForClass("meta", "old-text"), u.addClassForClass("parser", "old-text"), u.addClassForClass("error", "old-text");
};
u.addClassForClass = function(t, e) {
  const n = document.getElementsByClassName(t);
  for (const s of n)
    s.classList.add(e);
};
u.updateUIItems = function() {
  if (!(l.panes === "none" || !l.inventoryPane)) {
    for (let t of l.inventoryPane)
      document.querySelector("#" + t.alt).textContent = "", t.hasContent = !1;
    u.currentItemList = [];
    for (let t in m) {
      const e = m[t];
      for (let n of l.inventoryPane) {
        const s = n.getLoc ? n.getLoc() : null;
        n.test(e) && !e.inventorySkip && (u.appendItem(e, n.alt, s, !1, n.highlight ? n.highlight(e) : 0), n.hasContent = !0);
      }
    }
    l.additionalInv && l.additionalInv();
    for (let t of l.inventoryPane)
      if (!t.hasContent && t.noContent) {
        const e = Q(t.noContent);
        document.querySelector("#" + t.alt).innerHTML = '<div class="item-nothing">' + e + "</div>";
      }
    for (const t in l.customPaneFunctions) {
      const e = document.querySelector("#" + t);
      if (!e)
        return;
      e.innerHTML = l.customPaneFunctions[t]();
    }
    u.clickItem("");
  }
};
u.updateStatus = function() {
  if (l.panes !== "none" && l.statusPane) {
    let t = "";
    for (let e of l.status)
      typeof e == "string" ? g()[e] !== void 0 ? (t += '<tr><td width="' + l.statusWidthLeft + '">' + B(e) + "</td>", t += '<td width="' + l.statusWidthRight + '">' + g()[e] + "</td></tr>") : t += "<tr>" + Q(e) + "</tr>" : typeof e == "function" && (t += "<tr>" + e() + "</tr>");
    document.querySelector("#status-pane").innerHTML = t;
  }
  l.toolbar && u.createToolbar();
};
u.menuResponse = function(t) {
  let e = t;
  typeof t == "string" && t.match(/^\d+$/) && (t = parseInt(t) - 1), typeof t == "string" && (t = u.menuOptions.findIndex((n) => typeof n == "string" ? n.includes(t) : n.alias.includes(t))), u.disableTextFunction(!1), delete u.disableTextFunction, f.overrideWith();
  for (let n = u.menuStartId; n < u.nextid; n++)
    document.querySelector("#n" + n).remove();
  t === void 0 || t >= u.menuOptions[t] || t === -1 ? u.menuFailFn(e) : (I.transcriptAppend({ cssClass: "menu", text: u.menuOptions[t].alias ? u.menuOptions[t].alias : u.menuOptions[t], n: t }), u.menuFns.pop()(u.menuOptions[t])), ue(!0), l.textInput && document.querySelector("#textbox").focus();
};
u.textResponse = function(t) {
  if (t === void 0) {
    const n = document.querySelector("#text-dialog");
    n && (t = n.value);
  }
  const e = document.querySelector("#sidepane-menu");
  if (e && e.remove(), u.enable(), I.transcriptAppend({ cssClass: "menu", text: t }), u.menuFns.length) {
    const n = u.menuFns.pop();
    n && n(t);
  }
  ue(!0), l.textInput && document.querySelector("#textbox").focus();
};
u.keydownForMenuFunction = function(t) {
  const e = parseInt(t.key);
  !isNaN(e) && e <= u.menuOptions.length && e !== 0 && u.menuResponse(e - 1), setTimeout(function() {
    document.querySelector("#textbox").value = "", document.querySelector("#textbox").focus();
  }, 10);
};
u.clickExit = function(t) {
  u.disableLevel || ce(t);
};
u.clickItem = function(t) {
  if (u.disableLevel || !t)
    return;
  const e = m[t];
  if (e.sidebarButtonVerb) {
    ce(e.sidebarButtonVerb + " " + m[t].alias);
    return;
  }
  if (u.disableLevel)
    return;
  const n = [...new Set(u.currentItemList)];
  for (let s of n)
    for (const r of document.querySelectorAll("." + s + "-actions"))
      s === t ? r.style.display = r.style.display === "none" ? "block" : "none" : r.style.display = "none";
};
u.clickItemAction = function(t, e) {
  if (u.disableLevel)
    return;
  const n = m[t], s = e.includes("%") ? e.replace("%", n.alias) : e + " " + n.alias;
  ce(s);
};
u.appendItem = function(t, e, n, s, r) {
  const o = document.querySelector("#" + e);
  if (u.currentItemList.push(t.name), o.innerHTML += u.getItemHtml(t, n, s, r), t.container && !t.closed) {
    typeof t.getContents != "function" && (log("WARNING: item flagged as container but no getContents function:"), log(t));
    const c = t.getContents(h.SIDE_PANE);
    for (let d of c)
      u.appendItem(d, e, t.name, !0);
  }
};
u.getItemHtml = function(t, e, n, s) {
  if (typeof t.getVerbs != "function")
    return _("Item with bad getVerbs: " + t.name);
  const r = t.getVerbs(e);
  r === void 0 && (_("No verbs for " + t.name), console.log(t));
  let o = '<div id="' + t.name + '-item"><p class="item' + (n ? " sub-item" : "") + (s ? " highlight-item" + s : "") + `" onclick="io.clickItem('` + t.name + `')">` + u.getIcon(t) + t.getListAlias(e) + "</p></div>";
  for (let c of r)
    typeof c == "string" && (c = { name: c, action: c }), o += '<div class="' + t.name + "-actions item-action", c.style && (o += " " + c.style), o += `" onclick="io.clickItemAction('` + t.name + "', '" + c.action + `')" style="display: none;">`, o += c.name, o += "</div>";
  return o;
};
u.createPanes = function() {
  if (!["right", "left", "none"].includes(l.panes)) {
    console.error('ERROR: Your settings.panes value is "' + l.panes + '". It must be one of "right", "left" or "none" (all lower-case). It is probably set in the file setiings.js.');
    return;
  }
  if (document.querySelector("#input").innerHTML = '<span id="cursor">' + l.cursor + '</span><input type="text" name="textbox" id="textbox" autocomplete="off" />', l.textInput || (document.querySelector("#input").style.display = "none"), l.panes === "none")
    return;
  let t = "";
  if (l.compassPane) {
    t += '<div class="pane-div">', t += '<table id="compass-table">';
    for (let s = 0; s < 3; s++)
      t += "<tr>", t += u.writeExit(0 + 5 * s), t += u.writeExit(1 + 5 * s), t += u.writeExit(2 + 5 * s), t += "<td></td>", t += u.writeExit(3 + 5 * s), t += u.writeExit(4 + 5 * s), t += "</tr>";
    t += "</table>", t += "</div>";
  }
  if (l.statusPane && (t += '<div class="pane-div">', t += u.getSidePaneHeadingHTML(l.statusPane), t += '<table id="status-pane">', t += "</table>", t += "</div>"), l.inventoryPane)
    for (let s of l.inventoryPane)
      t += '<div class="pane-div">', t += u.getSidePaneHeadingHTML(s.name), t += '<div class="item-list" id="' + s.alt + '">', t += "</div>", t += "</div>";
  t += '<div class="pane-div-finished">', t += a.game_over_html, t += "</div>", t += "</div>";
  const e = document.createElement("div");
  e.innerHTML = t, e.setAttribute("id", "panes"), e.classList.add("side-panes"), e.classList.add("side-panes-" + l.panes), e.classList.add("panes-narrow");
  const n = document.querySelector("#main");
  n.parentNode.insertBefore(e, n.nextSibling), u.panesWidth = document.querySelector(".side-panes").clientWidth, l.customUI && l.customUI();
};
u.getSidePaneHeadingHTML = function(t) {
  if (!t)
    return "";
  const e = fn(t) + "-side-pane-heading";
  let n = '<h4 class="side-pane-heading" id=' + e + ">" + t;
  return l.collapsibleSidePanes && (n += ` <i class="fas fa-eye" onclick="io._clickSidePaneHeading('` + e + `')"></i>`), n += "</h4>", n;
};
u._clickSidePaneHeading = function(t) {
  const e = document.querySelector("#" + t).nextElementSibling;
  e.style.display === "none" ? e.style.display = "block" : e.style.display = "none";
};
u.writeExit = function(t) {
  let e = '<td class="compass-button" title="' + B(a.exit_list[t].name) + '">';
  return e += '<span class="compass-button" id="exit-' + a.exit_list[t].name, e += `" onclick="io.clickExit('` + a.exit_list[t].name + `')">`, e += l.symbolsForCompass ? u.displayIconsCompass(a.exit_list[t]) : a.exit_list[t].abbrev, e += "</span></td>", e;
};
u.getCommand = function(t) {
  return te.find(function(e) {
    return e.name === t;
  });
};
u.msgInputText = function(t) {
  I.transcript && !t.match(a.noWalkthroughRegex) && I.transcriptWalkthrough.push('    "' + t + '",'), !(!l.cmdEcho || t === "") && (document.querySelector("#output").innerHTML += '<p id="n' + u.nextid + '" class="input-text">&gt; ' + t + "</p>", u.nextid++, u.speak(t, !0));
};
u.savedCommands = ["help"];
u.savedCommandsPos = 0;
u.init = function() {
  l.performanceLog("Start io.onload"), u.createPanes(), l.playMode === "play" && (window.oncontextmenu = function() {
    return !1;
  }), document.querySelector("#fileDialog").onchange = I.loadGameAsFile, document.addEventListener("keydown", function(t) {
    if (u.keydownFunctions.length) {
      u.keydownFunctions.pop()(t);
      return;
    }
    const e = t.keyCode ? t.keyCode : t.which;
    if (e === 13)
      if (t.ctrlKey && (l.playMode === "dev" || l.playMode === "beta"))
        f.parse("script show");
      else {
        const n = document.querySelector("#textbox").value;
        u.msgInputText(n), n && (u.savedCommands[u.savedCommands.length - 1] !== n && !u.doNotSaveInput && u.savedCommands.push(n), u.savedCommandsPos = u.savedCommands.length, f.parse(n), u.doNotEraseLastCommand ? u.doNotEraseLastCommand = !1 : document.querySelector("#textbox").value = "");
      }
    if (e === 38) {
      u.savedCommandsPos -= 1, u.savedCommandsPos < 0 && (u.savedCommandsPos = 0), document.querySelector("#textbox").value = u.savedCommands[u.savedCommandsPos];
      const n = document.querySelector("#textbox");
      if (n.setSelectionRange)
        setTimeout(function() {
          n.setSelectionRange(9999, 9999);
        }, 0);
      else if (typeof n.selectionStart == "number")
        n.selectionStart = n.selectionEnd = n.value.length;
      else if (typeof n.createTextRange < "u") {
        n.focus();
        let s = n.createTextRange();
        s.collapse(!1), s.select();
      }
    }
    if (e === 40 && (u.savedCommandsPos += 1, u.savedCommandsPos >= u.savedCommands.length && (u.savedCommandsPos = u.savedCommands.length - 1), document.querySelector("#textbox").value = u.savedCommands[u.savedCommandsPos]), e === 27 && (document.querySelector("#textbox").value = ""), !u.disableLevel) {
      if (l.customKeyResponses && l.customKeyResponses(e, t))
        return !1;
      for (let n of a.exit_list)
        if (n.key && n.key === e)
          return u.msgInputText(n.name), f.parse(n.name), document.querySelector("#textbox").value = "", t.stopPropagation(), t.preventDefault(), !1;
      if (e === 123 && l.playMode === "play" || t.ctrlKey && t.shiftKey && e === 73 && l.playMode === "play" || t.ctrlKey && t.shiftKey && e === 74 && l.playMode === "play")
        return !1;
      e === 96 && (l.playMode === "dev" || l.playMode === "beta") && (t.ctrlKey && t.altKey ? f.parse("wt b") : t.altKey ? f.parse("wt a") : t.ctrlKey ? f.parse("wt c") : f.parse("test"), setTimeout(function() {
        document.querySelector("#textbox").value = "";
      }, 1)), e === 90 && t.ctrlKey && f.parse("undo");
    }
  }), l.panes !== "none" && (u.textColour = document.querySelector(".side-panes").style.color), l.performanceLog("UI built"), ue(!0), l.performanceLog("endTurnUI completed"), document.querySelector("#loading") && document.querySelector("#loading").remove(), l.suppressTitle || Gt(l.title, 2), l.subtitle && Gt(l.subtitle, 3), u.setTitleAndInit(l.title), l.playMode === "beta" && a.betaTestIntro(), l.performanceLog("Title/intro printed"), l.startingDialogEnabled ? (l.setUpDialog(), setTimeout(function() {
    l.startingDialogInit && l.startingDialogInit();
  }, 10)) : (l.startingDialogAlt && l.startingDialogAlt(), l.delayStart = !1, h.begin()), l.performanceLog("End io.onload");
};
u.synth = window.speechSynthesis;
u.voice = null;
u.voice2 = null;
u.speak = function(t, e) {
  if (!u.spoken)
    return;
  u.voice || (u.voice = u.synth.getVoices().find(function(s) {
    return /UK/.test(s.name) && /Female/.test(s.name);
  }), u.voice || (u.voice = u.synth.getVoices()[0])), u.voice2 || (u.voice2 = u.synth.getVoices().find(function(s) {
    return /UK/.test(s.name) && /Male/.test(s.name);
  }), u.voice2 || (u.voice2 = u.synth.getVoices()[0]));
  const n = new SpeechSynthesisUtterance(t);
  n.onend = function(s) {
  }, n.onerror = function(s) {
  }, n.voice = e ? u.voice2 : u.voice, n.pitch = 1, n.rate = 1, u.synth.speak(n);
};
u.dialogShowing = !1;
u.showHtml = function(t, e) {
  return u.dialogShowing ? !1 : (document.querySelector("body").innerHTML += '<div id="showHtml" title="' + t + '">' + e + "</div>", u.dialogShowing = !0, document.querySelector("#showHtml").dialog({
    width: 860,
    close: function() {
      document.querySelector("#showHtml").remove(), u.dialogShowing = !1;
    }
  }), !0);
};
u.finish = function(t) {
  if (l.finished = {
    textInput: l.textInput,
    inputDisplay: document.querySelector("#input").style.display
  }, u.finished = !0, l.textInput = !1, document.querySelector("#input").style.display = "none", l.panes !== "none") {
    for (const e of document.querySelectorAll(".pane-div"))
      e.style.display = "none";
    document.querySelector(".pane-div-finished").style.display = "block";
  }
  for (const e of l.afterFinish)
    e();
  l.finishMetaComment && C(l.finishMetaComment), I.transcriptExists() && C(a.transcript_finish), t && C(a.finish_options);
};
u.unfinish = function() {
  if (l.finished = {
    textInput: l.textInput,
    inputDisplay: document.querySelector("#input").style.display
  }, u.finished = !1, l.textInput = l.finished.textInput, document.querySelector("#input").style.display = l.finished.inputDisplay, l.panes !== "none") {
    for (const t of document.querySelectorAll(".pane-div"))
      t.style.display = "block";
    document.querySelector(".pane-div-finished").style.display = "none";
  }
  l.finished = !1;
};
u.toggleDarkMode = function() {
  return l.darkModeActive = !l.darkModeActive, l.darkModeActive ? document.querySelector("body").classList.add("dark-body") : document.querySelector("body").classList.remove("dark-body"), l.afterDarkToggle && l.afterDarkToggle(), l.panes !== "none" && (u.textColour = document.querySelector(".side-panes").style.color), C(a.done_msg), h.SUCCESS_NO_TURNSCRIPTS;
};
u.toggleAutoScrollMode = function() {
  return l.autoscroll = !l.autoscroll, l.afterAutoScrollToggle && l.afterAutoScrollToggle(), C(a.done_msg), h.SUCCESS_NO_TURNSCRIPTS;
};
u.toggleNarrowMode = function() {
  return l.narrowMode = (l.narrowMode + 1) % 3, document.querySelector("body").classList.remove("narrow-body"), document.querySelector("body").classList.remove("very-narrow-body"), l.narrowMode === 1 && document.querySelector("body").classList.add("narrow-body"), l.narrowMode === 2 && document.querySelector("body").classList.add("very-narrow-body"), l.afterNarrowChange && l.afterNarrowChange(), C(a.done_msg), h.SUCCESS_NO_TURNSCRIPTS;
};
u.togglePlainFontMode = function() {
  return l.plainFontModeActive = !l.plainFontModeActive, l.plainFontModeActive ? document.querySelector("body").classList.add("plain-font-body") : document.querySelector("body").classList.remove("plain-font-body"), l.afterPlainFontToggle && l.afterPlainFontToggle(), C(a.done_msg), h.SUCCESS_NO_TURNSCRIPTS;
};
u.toggleDisplay = function(t) {
  typeof t == "string" && (t = document.querySelector(t)), t.style.display = t.style.display === "block" ? "none" : "block";
};
u.copyTextToClipboard = function(t) {
  const e = document.createElement("textarea");
  e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style.width = "2em", e.style.height = "2em", e.style.padding = "0", e.style.border = "none", e.style.outline = "none", e.style.boxShadow = "none", e.style.background = "transparent", e.value = t, document.body.appendChild(e), e.focus(), e.select();
  try {
    const n = document.execCommand("copy");
    C("Copying text command was " + (n ? "successful" : "unsuccessful"));
  } catch {
    C("Oops, unable to copy");
  }
  document.body.removeChild(e);
};
u.getIcon = function(t) {
  return l.iconsFolder === !1 || !t.icon || t.icon() === "" ? "" : '<img src="' + l.iconsFolder + (l.darkModeActive ? "l_" : "d_") + t.icon() + '.png"  alt="Icon"/>';
};
u.againOrOops = function(t) {
  return u.savedCommands.length === 0 ? (C(a.again_not_available), h.FAILED) : (u.savedCommands.pop(), t ? f.parse(u.savedCommands[u.savedCommands.length - 1]) : (document.querySelector("#textbox").value = u.savedCommands[u.savedCommands.length - 1], u.doNotEraseLastCommand = !0), h.SUCCESS_NO_TURNSCRIPTS);
};
u.setCssByClass = function(t, e, n) {
  for (const s of document.querySelectorAll("." + t))
    s.style[e] = n;
};
u.displayIconsCompass = function(t) {
  const e = t.rotate ? ' style="transform: rotate(40deg)"' : "";
  return '<i class="fas ' + t.symbol + '"' + e + "></i>";
};
u.scrollToEnd = function() {
  l.autoscroll && window.scrollTo(0, document.getElementById("main").scrollHeight);
};
u.getDropDownText = function(t) {
  const e = document.querySelector("#" + t);
  return e.options[e.selectedIndex].text;
};
u.createToolbar = function() {
  let t = document.querySelector("#toolbar");
  if (!t) {
    const n = document.createElement("div");
    n.setAttribute("id", "toolbar"), n.classList.add("toolbar"), document.querySelector("body").insertBefore(n, document.querySelector("#main")), t = document.querySelector("#toolbar"), document.querySelector("#main").style.paddingTop = "30px", document.querySelector("#panes").style.top = "36px";
  }
  let e = "";
  e += '<div class="left">' + u.getToolbarHTML(l.toolbar[0]) + "</div>", e += '<div class="middle">' + u.getToolbarHTML(l.toolbar[1]) + "</div>", e += '<div class="right">' + u.getToolbarHTML(l.toolbar[2]) + "</div>", t.innerHTML = e;
};
u.getToolbarHTML = function(t = {}) {
  if (t.room)
    return B(a.getName(m[g().loc], { article: 2 }));
  if (t.title)
    return "<b><i>" + l.title + "</i></b>";
  if (t.content)
    return t.content();
  if (t.buttons) {
    let e = "";
    for (let n of t.buttons) {
      const s = n.cmd ? "runCmd('" + n.cmd + "')" : n.onclick;
      e += ` <a class="link" onclick="if (!io.disableLevel)${s}"><i class="fas ${n.icon}" title="${n.title}"></i></a>`;
    }
    return e;
  }
  return "";
};
u.focus = function(t) {
  typeof t == "string" && (t = document.querySelector("#" + t)), t !== document.activeElement && t.focus();
};
u.showHintSheet = function() {
  let t = '<div id="main"><div id="inner"><div id="output"><h2 class="default-h default-h2">' + a.hintSheet + "</h2>";
  t += '<p class="default-p">' + a.hintSheetIntro + "</p>";
  const e = [];
  for (const s of l.hintSheetData)
    e.push(...s.a.split(" "));
  const n = [...new Set(e)].sort();
  for (const s of l.hintSheetData)
    t += '<p class="default-p"><i>' + s.q + "</i>&nbsp;&nbsp;&nbsp; " + u.encodeWords(s.a, n) + "</p>";
  t += "<hr/><table><tr>";
  for (let s = 0; s < n.length; s++)
    t += "<td>" + s + " - " + n[s] + "</td>", s % 6 === 5 && (t += "</tr><tr>");
  t += "</tr><table></div></div></div>", u.showInTab(t, a.hintSheet);
};
u.encodeWords = function(t, e) {
  const n = [];
  for (const s of t.split(" "))
    n.push(e.indexOf(s));
  return n.map((s) => "" + s).join(" ");
};
let b = class {
  constructor(e, n) {
    this.name = e, this.objects = [], this.rules = [];
    for (let s in n)
      this[s] = n[s];
    this.attName = this.attName ? this.attName : this.name.toLowerCase();
    for (let s in this.objects)
      this.objects[s].attName || (this.objects[s].attName = this.attName);
    !this.regex && !this.regexes && (this.regexes = Array.isArray(a.regex[this.name]) ? a.regex[this.name] : [a.regex[this.name]]), this.withScript && (this.script = this.scriptWith), te.push(this);
  }
  default(e) {
    L(this.defmsg, e);
  }
  // Is this command a match at the most basic level (ignoring items, etc)
  // Also resets the command
  _test(e) {
    Array.isArray(this.regexes) || console.log(this);
    for (let n of this.regexes)
      if (n instanceof RegExp) {
        if (n.test(e))
          return this.tmp = { regex: n, mod: {} }, !0;
      } else if (n.regex.test(e))
        return this.tmp = { regex: n.regex, mod: n.mod }, !0;
    return this.tmp = { score: f.NO_MATCH }, !1;
  }
  // A command can have an array of regexs, "antiRegexes" that will stop the command getting matched
  _testNot(e) {
    if (!Array.isArray(this.antiRegexes))
      return !0;
    for (let n of this.antiRegexes)
      if (n instanceof RegExp) {
        if (n.test(e))
          return !1;
      } else if (n.regex.test(e))
        return !1;
    return !0;
  }
  // We want to see if this command is a good match to the string
  // This will involve trying to matching objects, according to the
  // values in the command
  //
  // The results go in an attribute, tmp, that should have alreadsy been set by test,
  // and is a dictionary containing:
  //
  // objectTexts - the matched object names from the player input
  // objects - the matched objects (lists of lists ready to be disabiguated)
  // score - a rating of how good the match is
  // error - a string to report why it failed, if it did!
  //
  // objects will be an array for each object role (so PUT HAT IN BOX is two),
  // of arrays for each object listed (so GET HAT, TEAPOT AND GUN is three),
  // of possible object matches (so GET HAT is four if there are four hats in the room)
  //
  // score is a rating for how well this command matches, based on the score attribute
  // of the command itself (defaults to 10); if zero or less, this is an error
  //
  // If this does give an error, it is only reported if no command is a success
  //
  // The parameter mod allows us to change how this is done, eg if the nouns are reversed
  // and will have been set in test
  matchItems(e) {
    if (!this._test(e) || !this._testNot(e))
      return;
    f.msg("---------------------------------------------------------"), f.msg("* Looking at candidate: " + this.name), this.tmp.objectTexts = [], this.tmp.objects = [], this.tmp.score = this.score ? this.score : 10, this.tmp.error = void 0;
    let n = this.tmp.regex.exec(e);
    if (n.shift(), this.tmp.mod.reverse && (n = n.reverse()), this.tmp.mod.reverseNotFirst) {
      const s = n.shift();
      n = n.reverse(), n.unshift(s);
    }
    this.tmp.mod.func && (n = this.tmp.mod.func(n)), f.msg("..Base score: " + this.tmp.score);
    for (let s = 0; s < n.length; s++) {
      const r = this.objects[s];
      if (!r)
        return _('The command "' + this.name + `" seems to have an error. It has more capture groups than there are elements in the 'objects' attribute.`, !0), !1;
      if (n[s] === void 0)
        return _('The command "' + this.name + `" seems to have an error. It has captured undefined. This is probably an issue with the command's regular expression.`, !0), !1;
      let o = 0;
      if (this.tmp.objectTexts.push(n[s]), r.special) {
        const c = f.specialText[r.special].error(n[s], r);
        if (c)
          return this.setError(f.BAD_SPECIAL, c);
        const d = f.specialText[r.special].exec(n[s], r);
        d !== !1 && this.tmp.objects.push(d), o = 1, d.name ? f.msg("-> special match object found: " + d.name) : f.msg("-> special match found: " + d);
      } else if (a.all_regex.test(n[s]) || a.all_exclude_regex.test(n[s])) {
        if (this.tmp.all = !0, !r.multiple)
          return this.setError(f.DISALLOWED_MULTIPLE, a.no_multiples_msg);
        r.scope || console.log("WARNING: Command without scope - " + this.name);
        let c = f.getScope(r), d = [g()];
        for (let p of c)
          (p.scenery || p.excludeFromAll) && d.push(p);
        if (a.all_exclude_regex.test(n[s])) {
          const v = n[s].replace(a.all_exclude_regex, "").trim().split(a.joiner_regex).map(function(N) {
            return N.trim();
          });
          for (let N in v) {
            const F = f.findInList(N, h.scope);
            F.length === 1 && d.push(F[0]);
          }
        }
        if (c = c.filter((p) => !d.includes(p)), c.length > 1 && !r.multiple)
          return this.setError(f.DISALLOWED_MULTIPLE, a.no_multiples_msg);
        if (c.length === 0)
          return this.setError(f.NONE_FOR_ALL, this.nothingForAll ? this.nothingForAll : a.nothing_msg);
        o = 2, this.tmp.objects.push(c.map((p) => [p]));
      } else {
        if (!r.scope)
          return console.warn("No scope found in command. This may be because the scope specified does not exist; check the spelling. The command in question is:"), log(this), f.msg("ERROR: No scope"), null;
        const c = f.getScopes(r);
        if (f.matchToNames(n[s], c, r, this.tmp), this.tmp.score === f.NO_OBJECT) {
          this.tmp.error = this.noobjecterror(this.tmp.error_s, s), this.objects.length > 1 && (this.tmp.score += 10), f.msg("Result score is (no object): " + this.tmp.score);
          return;
        }
      }
      f.msg("...Adding to the score: " + o), f.msg("Result score is: " + this.tmp.score), this.tmp.score += o;
    }
  }
  // If this has multiple parts the error probably takes priority
  // GET STUFF -> assume item
  // FILL JUG WITH WATER -> assume fluid
  setError(e, n) {
    this.tmp.error = n, this.tmp.score = e, this.objects.length > 1 && (this.tmp.score += 10), f.msg("Match failed: " + this.tmp.score + " (" + n + ")");
  }
  // This is the default script for commands
  // Assumes objects is:
  // optionally the verb, a string
  // an array of objects - each object will have the attribute indicated by attName called
  // optionally an array of one object
  script(e) {
    let n = !1, s = !1, r;
    typeof e[0] == "string" && (r = e.shift());
    let o;
    e.length > 1 && (o = e[1][0]);
    const c = e[0] && (e[0].length > 1 || f.currentCommand.all);
    if (e[0].length === 0)
      return C(a.nothing_msg), h.FAILED;
    for (let d = 0; d < e[0].length; d++) {
      const p = { multiple: c, verb: r, char: g(), item: e[0][d], secondItem: o }, v = e[0][d];
      if (v[this.attName + "_count"] || (v[this.attName + "_count"] = 0), !v[this.attName])
        this.default(p);
      else {
        let N = this.processCommand(p);
        N === h.SUCCESS_NO_TURNSCRIPTS && (s = !0, N = !0), N && v[this.attName + "_count"]++, n = N || n;
      }
    }
    return n ? this.noTurnscripts || s ? h.SUCCESS_NO_TURNSCRIPTS : h.SUCCESS : h.FAILED;
  }
  // This is the second script for commands
  // Assumes a verb and two objects; the verb may or may not be the first object
  scriptWith(e) {
    let n = !1, s = !1, r;
    e.length > 2 && (r = e.shift());
    const o = e[0] && (e[0].length > 1 || f.currentCommand.all);
    if (e[0].length === 0)
      return C(a.nothing_msg), h.FAILED;
    for (let c = 0; c < e[0].length; c++) {
      const d = { multiple: o, verb: r, char: g(), item: e[0][c], with: e[1][0] };
      if (!e[0][c][this.attName])
        this.default(d);
      else {
        let p = this.processCommand(d);
        p === h.SUCCESS_NO_TURNSCRIPTS && (s = !0, p = !0), n = p || n;
      }
    }
    return n ? this.noTurnscripts || s ? h.SUCCESS_NO_TURNSCRIPTS : h.SUCCESS : h.FAILED;
  }
  processCommand(e) {
    for (let s of this.rules)
      if (typeof s != "function" && (_("Failed to process command '" + this.name + "' as one of its rules is not a function."), console.log(this), console.log(s)), !s(this, e))
        return !1;
    let n = me(e.char, e.item, this.attName, e);
    return typeof n != "boolean" && n !== h.SUCCESS_NO_TURNSCRIPTS && (n = !0), n;
  }
  noobjecterror(e) {
    return a.object_unknown_msg(e);
  }
};
class Ls extends b {
  constructor(e, n) {
    super(e, n), this.cmdCategory || (this.cmdCategory = e);
  }
  script(e) {
    const n = e[0][0];
    if (!n.npc)
      return k(a.not_npc, { char: g(), item: n }), h.FAILED;
    let s = !1;
    if (e.length !== 2)
      return _("The command " + name + " is trying to use a facility for NPCs to do it, but there is no object list; this facility is only for commands in the form verb-object."), h.FAILED;
    const r = e[1].length > 1 || f.currentCommand.all;
    for (let o of e[1]) {
      const c = { multiple: r, char: n, item: o };
      if (n.getAgreement(this.cmdCategory, { item: o, cmd: this }))
        if (!o[this.attName])
          this.default(c);
        else {
          let d = this.processCommand({ multiple: r, char: n, item: o });
          d === h.SUCCESS_NO_TURNSCRIPTS && (d = !0), s = d || s;
        }
    }
    return s ? (n.pause(), this.noTurnscripts ? h.SUCCESS_NO_TURNSCRIPTS : h.SUCCESS) : h.FAILED;
  }
}
class As extends b {
  constructor(e, n, s) {
    super(e, s), this.exitCmd = !0, this.dir = n, this.objects = [{ special: "ignore" }, { special: "ignore" }];
  }
  script(e) {
    if (E().hasExit(this.dir)) {
      const n = E().getExit(this.dir);
      if (typeof n == "object") {
        if (!g().testMove(n))
          return h.FAILED;
        if (typeof n.use != "function")
          return _("Exit's 'use' attribute is not a function (or does not exist)."), console.log("Bad exit:"), console.log(n), h.FAILED;
        const s = n.use(g(), n);
        return typeof s != "boolean" ? (console.warn("Exit on " + E().name + " failed to return a Boolean value, indicating success or failure; assuming success"), h.SUCCESS) : (s && n.extraTime && (O.elapsedTime += n.extraTime), s ? h.SUCCESS : h.FAILED);
      } else
        return _("Unsupported type for direction"), h.FAILED;
    } else {
      const n = a.exit_list.find((s) => s.name === this.dir);
      return n.not_that_way ? k(n.not_that_way, { char: g(), dir: this.dir }) : l.customNoExitMsg ? k(l.customNoExitMsg(g(), this.dir)) : k(a.not_that_way, { char: g(), dir: this.dir });
    }
  }
}
class Os extends b {
  constructor(e, n, s) {
    super(e, s), this.exitCmd = !0, this.dir = n, this.objects = [{ scope: f.isHere, attName: "npc" }, { special: "ignore" }, { special: "ignore" }];
  }
  script(e) {
    const n = e[0][0];
    if (!n.npc)
      return k(a.not_npc, { char: g(), item: n });
    if (!E().hasExit(this.dir)) {
      const o = a.exit_list.find((c) => c.name === this.dir);
      return o.not_that_way ? k(o.not_that_way, { char: n, dir: this.dir }) : k(a.not_that_way, { char: n, dir: this.dir });
    }
    const s = E().getExit(this.dir);
    if (typeof s != "object")
      return _("Unsupported type for direction"), h.FAILED;
    if (n.testMove && !n.testMove(s) || !n.getAgreement("Go", { exit: s }))
      return h.FAILED;
    const r = s.use(n, s);
    return r && n.pause(), r ? h.SUCCESS : h.FAILED;
  }
}
function Rs() {
  for (let t of te)
    if (t.regexes || (t.regexes = [t.regex]), t.npcCmd) {
      Array.isArray(t.regexes) || console.log(t);
      const e = t.regexes[0].source.substr(1), n = t.objects.slice();
      n.unshift({ scope: f.isHere, attName: "npc" });
      const s = {
        objects: n,
        attName: t.attName,
        default: t.default,
        defmsg: t.defmsg,
        rules: t.rules,
        score: t.score,
        cmdCategory: t.cmdCategory ? t.cmdCategory : t.name,
        forNpc: !0
      }, r = new Ls("Npc" + t.name, s);
      r.regexes = [];
      for (let o in a.tell_to_prefixes)
        r.regexes.push(new RegExp("^" + a.tell_to_prefixes[o] + e));
      t.useThisScriptForNpcs && (r.script = t.script), r.scope = [];
      for (let o of t.objects)
        r.scope.push(o === f.isHeld ? f.isHeldByNpc : o), r.scope.push(o === f.isWorn ? f.isWornByNpc : o);
    }
  for (let t of a.exit_list)
    if (t.type !== "nocmd") {
      let e = "(" + a.go_pre_regex + ")(" + t.name + "|" + t.abbrev.toLowerCase();
      t.alt && (e += "|" + t.alt), e += ")$", new As("Go" + B(t.name), t.name, { regexes: [new RegExp("^" + e)] });
      const n = [];
      for (let s in a.tell_to_prefixes)
        n.push(new RegExp("^" + a.tell_to_prefixes[s] + e));
      new Os("NpcGo" + B(t.name) + "2", t.name, { regexes: n });
    }
}
function _o(t, e) {
  let n;
  if (t.forNpc) {
    if (n = e[0][0], !n.npc)
      return k(a.not_npc, { char: g(), item: n }), h.FAILED;
    e.shift();
  } else
    n = g();
  return n;
}
function Ue(t) {
  return te.find((e) => e.name === t);
}
function vo(t, e) {
  const n = Ue(t);
  n.matchItems(e), log(n.tmp), C("See results in console (F12)");
}
const S = {};
S.isHeldNotWorn = function(t, e) {
  return !e.item.getWorn() && e.item.isAtLoc(e.char.name, h.PARSER) ? !0 : e.item.isAtLoc(e.char.name, h.PARSER) ? L(a.already_wearing, e) : e.item.loc && (e.holder = m[e.item.loc], e.holder.npc || e.holder.player) ? L(a.char_has_it, e) : L(a.not_carrying, e);
};
S.isWorn = function(t, e) {
  return e.item.getWorn() && e.item.isAtLoc(e.char.name, h.PARSER) ? !0 : e.item.isAtLoc(e.char.name, h.PARSER) ? L(a.not_wearing, e) : e.item.loc && (e.holder = m[e.item.loc], e.holder.npc || e.holder.player) ? L(a.char_has_it, e) : L(a.not_carrying, e);
};
S.isHeld = function(t, e) {
  return e.item.isAtLoc(e.char.name, h.PARSER) ? !0 : e.item.loc && (e.holder = m[e.item.loc], e.holder.npc || e.holder.player) ? L(a.char_has_it, e) : L(a.not_carrying, e);
};
S.isPresent = function(t, e) {
  return e.item.isAtLoc(e.char.loc, h.PARSER) || e.item.isAtLoc(e.char.name, h.PARSER) ? !0 : e.item.loc && (e.holder = m[e.item.loc], e.holder.npc || e.holder.player) ? L(a.char_has_it, e) : e.item.scopeStatus.canReach ? !0 : L(a.not_here, e);
};
S.isHere = function(t, e) {
  if (e.item.isAtLoc(e.char.loc, h.PARSER))
    return !0;
  if (e.item.loc) {
    if (e.holder = m[e.item.loc], e.already && e.holder === e.char)
      return L(a.already_have, e);
    if (e.holder.npc || e.holder.player)
      return L(a.char_has_it, e);
  }
  return e.item.scopeStatus.canReach || e.item.multiLoc ? !0 : L(a.not_here, e);
};
S.isHereAlready = function(t, e) {
  return e.already = !0, S.isHere(t, e);
};
S.isPresentOrContained = function(t, e) {
  return e.item.isAtLoc || log(e.item.name), e.char || log(t.name), e.item.isAtLoc(e.char.name, h.PARSER) || f.isHere(e.item) ? !0 : e.item.loc && (e.holder = m[e.item.loc], e.holder && (e.holder.npc || e.holder.player)) ? L(a.char_has_it, e) : f.isContained(e.item) ? !0 : L(a.not_here, e);
};
S.testManipulate = function(t, e) {
  return e.char.testManipulate(e.item, t.name);
};
S.canTalkTo = function(t, e) {
  return e.char.testTalk(e.item) ? !e.item.npc && !e.item.talker && !e.item.player ? L(a.not_able_to_hear, e) : !0 : !1;
};
S.testPosture = function(t, e) {
  return e.char.testPosture(t.name);
};
const Fs = {
  pronouns: a.pronouns.thirdperson,
  isLocatedAt: function(t) {
    return t === this.loc;
  },
  isApparentTo: function(t) {
    return l.defaultIsApparentTo ? l.defaultIsApparentTo(t) : t === h.LOOK && this.scenery || t === h.SIDE_PANE && this.scenery && !l.showSceneryInSidePanes ? !1 : !(t === h.SIDE_PANE && this.player);
  },
  isAtLoc: function(t, e) {
    return typeof t != "string" && (t = t.name), !m[t] && !l.placeholderLocations.includes(t) && _("The location name `" + t + "`, does not match anything in the game."), this.isLocatedAt(t, e) ? this.isApparentTo(e) : !1;
  },
  isHere: function() {
    return this.isAtLoc(g().loc);
  },
  isHeld: function() {
    return this.isAtLoc(g().name);
  },
  isHeldBy: function(t) {
    return this.isAtLoc(t.name);
  },
  isUltimatelyHeldBy: function(t) {
    let e = this;
    for (; e.loc; ) {
      if (e.loc === t.name)
        return !0;
      if (!e.loc)
        return _('isUltimatelyHeldBy has found that the object "' + e.name + '" has no loc attribute (or it is set to undefined/false/null/0), and so has failed. If this is a takeable item you may need to give it a custom isUltimatelyHeldBy function. If this is a takeable container or surface, it needs a loc attribute set.');
      if (!m[e.loc] && !l.placeholderLocations.includes(e.loc))
        return _('isUltimatelyHeldBy has found that the object "' + e.name + '" has its "loc" attribute set to "' + e.loc + '"), which does not exist, and so has failed.');
      e = m[e.loc];
    }
    return !1;
  },
  isHereOrHeld: function() {
    return this.isHere() || this.isHeld();
  },
  isHereOrHeldBy: function(t) {
    return this.isHere() || this.isHeldBy(t);
  },
  countAtLoc: function(t) {
    return typeof t != "string" && (t = t.name), this.isAtLoc(t) ? 1 : 0;
  },
  scopeSnapshot: function(t) {
    if (this.scopeStatus["done" + t] || (Object.keys(this.scopeStatus).length === 0 && h.scope.push(this), this.scopeStatus["can" + t] = !0, this.scopeStatus["done" + t] = !0, !this.getContents && !this.componentHolder))
      return;
    let e;
    if (this.getContents) {
      if (!this["can" + t + "ThroughThis"]() && !this.scopeStatus["room" + t] && this !== g())
        return;
      e = this.getContents(h.PARSER);
    } else {
      e = [];
      for (let n in m)
        m[n].loc === this.name && e.push(m[n]);
    }
    for (let n of e)
      n.scopeSnapshot(t);
  },
  canReachThroughThis: () => !1,
  canSeeThroughThis: () => !1,
  afterTakeOut: Z,
  afterDropIn: Z,
  testTalkPlayer: () => !1,
  getExits: function() {
    return [];
  },
  hasExit: (t) => !1,
  getWorn: () => !1,
  saveLoadExcludedAtts: [],
  moveToFrom: function(t, e, n) {
    T.setToFrom(t, e, n), t.fromLoc === void 0 && (t.fromLoc = this.loc), t.fromLoc !== t.toLoc && (!m[t.fromLoc] && !l.placeholderLocations.includes(t.fromLoc) && _("The location name `" + t.fromLoc + "`, does not match anything in the game."), !m[t.toLoc] && !l.placeholderLocations.includes(t.toLoc) && _("The location name `" + t.toLoc + "`, does not match anything in the game."), this.loc = t.toLoc, t.item = this, l.placeholderLocations.includes(t.fromLoc) || m[t.fromLoc].afterTakeOut(t), l.placeholderLocations.includes(t.toLoc) || m[t.toLoc].afterDropIn(t), this.afterMove !== void 0 && this.afterMove(t), t.toLoc === g().name && this.afterTake !== void 0 && this.afterTake(t));
  },
  afterLoad: Z,
  afterLoadForTemplate: function() {
    this.afterLoad();
  },
  beforeSave: Z,
  beforeSaveForTemplate: function() {
    this.beforeSave();
  },
  getSaveString: function() {
    this.beforeSaveForTemplate();
    let t = this.getSaveStringPreamble();
    for (let e in this)
      typeof this[e] != "function" && (this.saveLoadExclude(e) || (t += I.encode(e, this[e])));
    return t;
  },
  getSaveStringPreamble: function(t) {
    return "Object=";
  },
  saveLoadExclude: function(t) {
    return typeof this[t] == "function" || typeof this[t] == "object" && !Array.isArray(this[t]) || this[t] instanceof ne || U.hasMatch(l.saveLoadExcludedAtts, t) ? !0 : U.hasMatch(this.saveLoadExcludedAtts, t);
  },
  setAlias: function(t, e = {}) {
    this.synonyms && this.alias && this.synonyms.push(this.alias), this.alias = t, this.listAlias = e.listAlias ? e.listAlias : B(t), this.properNoun = e.properNoun === void 0 ? /^[A-Z]/.test(this.alias) : e.properNoun, this.room && (this.headingAlias = e.headingAlias ? e.headingAlias : l.getDefaultRoomHeading(this)), this.parserOptionsSet = !1, this.pluralAlias = e.pluralAlias ? e.pluralAlias : a.getPlural(t), this.properNoun = e.properNoun === void 0 ? /^[A-Z]/.test(this.alias) : e.properNoun;
  },
  eventActive: !1,
  eventCountdown: 0,
  eventIsActive: function() {
    return this.eventActive;
  },
  endTurn: function(t) {
    this.doEvent(t);
  },
  doEvent: function(t) {
    if (this.eventIsActive()) {
      if (this.eventCountdown > 1) {
        this.eventCountdown--;
        return;
      }
      this.eventCondition && !this.eventCondition(t) || (typeof this.eventScript != "function" && log("About to call eventScrip on the object '" + this.name + "', but it will throw an exception because there is no such function!"), this.eventScript(t), typeof this.eventPeriod == "number" ? this.eventCountdown = this.eventPeriod : this.eventActive = !1);
    }
  }
}, Ps = {
  room: !0,
  beforeEnter: Z,
  beforeFirstEnter: Z,
  afterEnter: Z,
  afterEnterIf: {},
  afterEnterIfFlags: "",
  afterFirstEnter: Z,
  afterExit: Z,
  visited: 0,
  lightSource: () => h.LIGHT_FULL,
  isAtLoc: function(t, e) {
    return e === h.PARSER && t === this.name;
  },
  description: function() {
    for (let t of l.roomTemplate)
      x(t);
    return !0;
  },
  examine: function() {
    return x("{hereDesc}"), !0;
  },
  darkDesc: () => x(a.it_is_dark),
  getContents: T.getContents,
  getExit: function(t) {
    return this[t];
  },
  hasExit: function(t, e) {
    return e === void 0 && (e = {}), !this[t] || e.excludeAlsoDir && this[t].isAlsoDir || e.excludeLocked && this[t].isLocked() || e.excludeScenery && this[t].scenery || O.dark && !this[t].illuminated ? !1 : !this[t].isHidden();
  },
  getExitObjs: function(t) {
    t === void 0 && (t = {});
    const e = [];
    t.excludeAlsoDir === void 0 && (t.excludeAlsoDir = !0);
    for (let n of a.exit_list)
      this.hasExit(n.name, t) && e.push(n);
    return e;
  },
  getExits: function(t) {
    return this.getExitObjs(t).map((e) => this.getExit(e.name));
  },
  getExitDirs: function(t) {
    return this.getExits(t).map((e) => e.dir);
  },
  // returns null if there are no exits
  getRandomExit: function(t) {
    return M.fromArray(this.getExits(t));
  },
  findExit: function(t, e) {
    typeof t == "object" && (t = t.name);
    for (let n of a.exit_list)
      if (this.hasExit(n.name, e) && this[n.name].name === t)
        return this.getExit(n.name);
    return null;
  },
  // Lock or unlock the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  setExitLock: function(t, e) {
    return this[t] ? (this["exit_locked_" + t] = e, !0) : !1;
  },
  isExitLocked: function(t) {
    return this["exit_locked_" + t];
  },
  // Hide or unhide the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  setExitHide: function(t, e) {
    return this[t] ? (this["exit_hidden_" + t] = e, !0) : !1;
  },
  isExitHidden: function(t) {
    return this["exit_hidden_" + t];
  },
  // Returns an exit going TO this room. If sent "west", it will return the exit from the room to the west, to this room
  // which will probably be east, but may not
  getReverseExit: function(t) {
    return this[t].findExit(this);
  },
  // Used for GO IN HOUSE, CLIMB UP TREE, GO THROUGH PORTAL, etc.
  // dir should be one of 'In', 'Out', 'Up', 'Down', Through' - case sensitive
  goItem: function(t, e, n) {
    const s = "go" + e + "Direction";
    return n || (n = g()), t[s] ? this[t[s]] ? this[t[s]].use(n) ? h.SUCCESS : h.FAILED : _("Trying to 'go " + e.toLowerCase() + "' using unknown exit '" + t[s] + "' for " + this.name) : k(a["cannot_go_" + e.toLowerCase()], { item: t, char: n });
  }
  //
}, Ds = {
  lightSource: () => h.LIGHT_NONE,
  icon: () => "",
  testKeys: (t, e) => !1,
  getListAlias: function(t) {
    return this.listAlias;
  },
  getVerbs: function() {
    const t = [];
    for (let e of this.verbFunctions)
      e(this, t);
    if (g() && !this.isAtLoc(g().name)) {
      if (this.hereVerbs)
        for (let e of this.hereVerbs)
          t.push(e);
    } else if (this.getWorn()) {
      if (this.wornVerbs)
        for (let e of this.wornVerbs)
          t.push(e);
    } else if (this.heldVerbs)
      for (let e of this.heldVerbs)
        t.push(e);
    return this.verbFunction && this.verbFunction(t), t;
  },
  transform: function(t) {
    t.loc = this.loc, delete this.loc;
    for (const e in m)
      m[e].loc === this.name && (m[e].loc = t.name);
    for (const e in f.pronouns)
      f.pronouns[e] === this && (f.pronouns[e] = t);
  }
};
function Ms(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Us(t) {
  if (t.__esModule)
    return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function s() {
      if (this instanceof s) {
        var r = [null];
        r.push.apply(r, arguments);
        var o = Function.bind.apply(e, r);
        return new o();
      }
      return e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else
    n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(s) {
    var r = Object.getOwnPropertyDescriptor(t, s);
    Object.defineProperty(n, s, r.get ? r : {
      enumerable: !0,
      get: function() {
        return t[s];
      }
    });
  }), n;
}
var Et = { exports: {} }, j = String, Sn = function() {
  return { isColorSupported: !1, reset: j, bold: j, dim: j, italic: j, underline: j, inverse: j, hidden: j, strikethrough: j, black: j, red: j, green: j, yellow: j, blue: j, magenta: j, cyan: j, white: j, gray: j, bgBlack: j, bgRed: j, bgGreen: j, bgYellow: j, bgBlue: j, bgMagenta: j, bgCyan: j, bgWhite: j };
};
Et.exports = Sn();
Et.exports.createColors = Sn;
var js = Et.exports;
const $s = {}, Hs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $s
}, Symbol.toStringTag, { value: "Module" })), Y = /* @__PURE__ */ Us(Hs);
let Vt = js, zt = Y, ct = class _n extends Error {
  constructor(e, n, s, r, o, c) {
    super(e), this.name = "CssSyntaxError", this.reason = e, o && (this.file = o), r && (this.source = r), c && (this.plugin = c), typeof n < "u" && typeof s < "u" && (typeof n == "number" ? (this.line = n, this.column = s) : (this.line = n.line, this.column = n.column, this.endLine = s.line, this.endColumn = s.column)), this.setMessage(), Error.captureStackTrace && Error.captureStackTrace(this, _n);
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "", this.message += this.file ? this.file : "<css input>", typeof this.line < "u" && (this.message += ":" + this.line + ":" + this.column), this.message += ": " + this.reason;
  }
  showSourceCode(e) {
    if (!this.source)
      return "";
    let n = this.source;
    e == null && (e = Vt.isColorSupported), zt && e && (n = zt(n));
    let s = n.split(/\r?\n/), r = Math.max(this.line - 3, 0), o = Math.min(this.line + 2, s.length), c = String(o).length, d, p;
    if (e) {
      let { bold: v, red: N, gray: F } = Vt.createColors(!0);
      d = (P) => v(N(P)), p = (P) => F(P);
    } else
      d = p = (v) => v;
    return s.slice(r, o).map((v, N) => {
      let F = r + 1 + N, P = " " + (" " + F).slice(-c) + " | ";
      if (F === this.line) {
        let q = p(P.replace(/\d/g, " ")) + v.slice(0, this.column - 1).replace(/[^\t]/g, " ");
        return d(">") + p(P) + v + `
 ` + q + d("^");
      }
      return " " + p(P) + v;
    }).join(`
`);
  }
  toString() {
    let e = this.showSourceCode();
    return e && (e = `

` + e + `
`), this.name + ": " + this.message + e;
  }
};
var Nt = ct;
ct.default = ct;
var ve = {};
ve.isClean = Symbol("isClean");
ve.my = Symbol("my");
const Qt = {
  colon: ": ",
  indent: "    ",
  beforeDecl: `
`,
  beforeRule: `
`,
  beforeOpen: " ",
  beforeClose: `
`,
  beforeComment: `
`,
  after: `
`,
  emptyBody: "",
  commentLeft: " ",
  commentRight: " ",
  semicolon: !1
};
function Ws(t) {
  return t[0].toUpperCase() + t.slice(1);
}
let lt = class {
  constructor(e) {
    this.builder = e;
  }
  stringify(e, n) {
    if (!this[e.type])
      throw new Error(
        "Unknown AST node type " + e.type + ". Maybe you need to change PostCSS stringifier."
      );
    this[e.type](e, n);
  }
  document(e) {
    this.body(e);
  }
  root(e) {
    this.body(e), e.raws.after && this.builder(e.raws.after);
  }
  comment(e) {
    let n = this.raw(e, "left", "commentLeft"), s = this.raw(e, "right", "commentRight");
    this.builder("/*" + n + e.text + s + "*/", e);
  }
  decl(e, n) {
    let s = this.raw(e, "between", "colon"), r = e.prop + s + this.rawValue(e, "value");
    e.important && (r += e.raws.important || " !important"), n && (r += ";"), this.builder(r, e);
  }
  rule(e) {
    this.block(e, this.rawValue(e, "selector")), e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, "end");
  }
  atrule(e, n) {
    let s = "@" + e.name, r = e.params ? this.rawValue(e, "params") : "";
    if (typeof e.raws.afterName < "u" ? s += e.raws.afterName : r && (s += " "), e.nodes)
      this.block(e, s + r);
    else {
      let o = (e.raws.between || "") + (n ? ";" : "");
      this.builder(s + r + o, e);
    }
  }
  body(e) {
    let n = e.nodes.length - 1;
    for (; n > 0 && e.nodes[n].type === "comment"; )
      n -= 1;
    let s = this.raw(e, "semicolon");
    for (let r = 0; r < e.nodes.length; r++) {
      let o = e.nodes[r], c = this.raw(o, "before");
      c && this.builder(c), this.stringify(o, n !== r || s);
    }
  }
  block(e, n) {
    let s = this.raw(e, "between", "beforeOpen");
    this.builder(n + s + "{", e, "start");
    let r;
    e.nodes && e.nodes.length ? (this.body(e), r = this.raw(e, "after")) : r = this.raw(e, "after", "emptyBody"), r && this.builder(r), this.builder("}", e, "end");
  }
  raw(e, n, s) {
    let r;
    if (s || (s = n), n && (r = e.raws[n], typeof r < "u"))
      return r;
    let o = e.parent;
    if (s === "before" && (!o || o.type === "root" && o.first === e || o && o.type === "document"))
      return "";
    if (!o)
      return Qt[s];
    let c = e.root();
    if (c.rawCache || (c.rawCache = {}), typeof c.rawCache[s] < "u")
      return c.rawCache[s];
    if (s === "before" || s === "after")
      return this.beforeAfter(e, s);
    {
      let d = "raw" + Ws(s);
      this[d] ? r = this[d](c, e) : c.walk((p) => {
        if (r = p.raws[n], typeof r < "u")
          return !1;
      });
    }
    return typeof r > "u" && (r = Qt[s]), c.rawCache[s] = r, r;
  }
  rawSemicolon(e) {
    let n;
    return e.walk((s) => {
      if (s.nodes && s.nodes.length && s.last.type === "decl" && (n = s.raws.semicolon, typeof n < "u"))
        return !1;
    }), n;
  }
  rawEmptyBody(e) {
    let n;
    return e.walk((s) => {
      if (s.nodes && s.nodes.length === 0 && (n = s.raws.after, typeof n < "u"))
        return !1;
    }), n;
  }
  rawIndent(e) {
    if (e.raws.indent)
      return e.raws.indent;
    let n;
    return e.walk((s) => {
      let r = s.parent;
      if (r && r !== e && r.parent && r.parent === e && typeof s.raws.before < "u") {
        let o = s.raws.before.split(`
`);
        return n = o[o.length - 1], n = n.replace(/\S/g, ""), !1;
      }
    }), n;
  }
  rawBeforeComment(e, n) {
    let s;
    return e.walkComments((r) => {
      if (typeof r.raws.before < "u")
        return s = r.raws.before, s.includes(`
`) && (s = s.replace(/[^\n]+$/, "")), !1;
    }), typeof s > "u" ? s = this.raw(n, null, "beforeDecl") : s && (s = s.replace(/\S/g, "")), s;
  }
  rawBeforeDecl(e, n) {
    let s;
    return e.walkDecls((r) => {
      if (typeof r.raws.before < "u")
        return s = r.raws.before, s.includes(`
`) && (s = s.replace(/[^\n]+$/, "")), !1;
    }), typeof s > "u" ? s = this.raw(n, null, "beforeRule") : s && (s = s.replace(/\S/g, "")), s;
  }
  rawBeforeRule(e) {
    let n;
    return e.walk((s) => {
      if (s.nodes && (s.parent !== e || e.first !== s) && typeof s.raws.before < "u")
        return n = s.raws.before, n.includes(`
`) && (n = n.replace(/[^\n]+$/, "")), !1;
    }), n && (n = n.replace(/\S/g, "")), n;
  }
  rawBeforeClose(e) {
    let n;
    return e.walk((s) => {
      if (s.nodes && s.nodes.length > 0 && typeof s.raws.after < "u")
        return n = s.raws.after, n.includes(`
`) && (n = n.replace(/[^\n]+$/, "")), !1;
    }), n && (n = n.replace(/\S/g, "")), n;
  }
  rawBeforeOpen(e) {
    let n;
    return e.walk((s) => {
      if (s.type !== "decl" && (n = s.raws.between, typeof n < "u"))
        return !1;
    }), n;
  }
  rawColon(e) {
    let n;
    return e.walkDecls((s) => {
      if (typeof s.raws.between < "u")
        return n = s.raws.between.replace(/[^\s:]/g, ""), !1;
    }), n;
  }
  beforeAfter(e, n) {
    let s;
    e.type === "decl" ? s = this.raw(e, null, "beforeDecl") : e.type === "comment" ? s = this.raw(e, null, "beforeComment") : n === "before" ? s = this.raw(e, null, "beforeRule") : s = this.raw(e, null, "beforeClose");
    let r = e.parent, o = 0;
    for (; r && r.type !== "root"; )
      o += 1, r = r.parent;
    if (s.includes(`
`)) {
      let c = this.raw(e, null, "indent");
      if (c.length)
        for (let d = 0; d < o; d++)
          s += c;
    }
    return s;
  }
  rawValue(e, n) {
    let s = e[n], r = e.raws[n];
    return r && r.value === s ? r.raw : s;
  }
};
var vn = lt;
lt.default = lt;
let Bs = vn;
function ut(t, e) {
  new Bs(e).stringify(t);
}
var Be = ut;
ut.default = ut;
let { isClean: ke, my: qs } = ve, Gs = Nt, Vs = vn, zs = Be;
function ft(t, e) {
  let n = new t.constructor();
  for (let s in t) {
    if (!Object.prototype.hasOwnProperty.call(t, s) || s === "proxyCache")
      continue;
    let r = t[s], o = typeof r;
    s === "parent" && o === "object" ? e && (n[s] = e) : s === "source" ? n[s] = r : Array.isArray(r) ? n[s] = r.map((c) => ft(c, n)) : (o === "object" && r !== null && (r = ft(r)), n[s] = r);
  }
  return n;
}
let ht = class {
  constructor(e = {}) {
    this.raws = {}, this[ke] = !1, this[qs] = !0;
    for (let n in e)
      if (n === "nodes") {
        this.nodes = [];
        for (let s of e[n])
          typeof s.clone == "function" ? this.append(s.clone()) : this.append(s);
      } else
        this[n] = e[n];
  }
  error(e, n = {}) {
    if (this.source) {
      let { start: s, end: r } = this.rangeBy(n);
      return this.source.input.error(
        e,
        { line: s.line, column: s.column },
        { line: r.line, column: r.column },
        n
      );
    }
    return new Gs(e);
  }
  warn(e, n, s) {
    let r = { node: this };
    for (let o in s)
      r[o] = s[o];
    return e.warn(n, r);
  }
  remove() {
    return this.parent && this.parent.removeChild(this), this.parent = void 0, this;
  }
  toString(e = zs) {
    e.stringify && (e = e.stringify);
    let n = "";
    return e(this, (s) => {
      n += s;
    }), n;
  }
  assign(e = {}) {
    for (let n in e)
      this[n] = e[n];
    return this;
  }
  clone(e = {}) {
    let n = ft(this);
    for (let s in e)
      n[s] = e[s];
    return n;
  }
  cloneBefore(e = {}) {
    let n = this.clone(e);
    return this.parent.insertBefore(this, n), n;
  }
  cloneAfter(e = {}) {
    let n = this.clone(e);
    return this.parent.insertAfter(this, n), n;
  }
  replaceWith(...e) {
    if (this.parent) {
      let n = this, s = !1;
      for (let r of e)
        r === this ? s = !0 : s ? (this.parent.insertAfter(n, r), n = r) : this.parent.insertBefore(n, r);
      s || this.remove();
    }
    return this;
  }
  next() {
    if (!this.parent)
      return;
    let e = this.parent.index(this);
    return this.parent.nodes[e + 1];
  }
  prev() {
    if (!this.parent)
      return;
    let e = this.parent.index(this);
    return this.parent.nodes[e - 1];
  }
  before(e) {
    return this.parent.insertBefore(this, e), this;
  }
  after(e) {
    return this.parent.insertAfter(this, e), this;
  }
  root() {
    let e = this;
    for (; e.parent && e.parent.type !== "document"; )
      e = e.parent;
    return e;
  }
  raw(e, n) {
    return new Vs().raw(this, e, n);
  }
  cleanRaws(e) {
    delete this.raws.before, delete this.raws.after, e || delete this.raws.between;
  }
  toJSON(e, n) {
    let s = {}, r = n == null;
    n = n || /* @__PURE__ */ new Map();
    let o = 0;
    for (let c in this) {
      if (!Object.prototype.hasOwnProperty.call(this, c) || c === "parent" || c === "proxyCache")
        continue;
      let d = this[c];
      if (Array.isArray(d))
        s[c] = d.map((p) => typeof p == "object" && p.toJSON ? p.toJSON(null, n) : p);
      else if (typeof d == "object" && d.toJSON)
        s[c] = d.toJSON(null, n);
      else if (c === "source") {
        let p = n.get(d.input);
        p == null && (p = o, n.set(d.input, o), o++), s[c] = {
          inputId: p,
          start: d.start,
          end: d.end
        };
      } else
        s[c] = d;
    }
    return r && (s.inputs = [...n.keys()].map((c) => c.toJSON())), s;
  }
  positionInside(e) {
    let n = this.toString(), s = this.source.start.column, r = this.source.start.line;
    for (let o = 0; o < e; o++)
      n[o] === `
` ? (s = 1, r += 1) : s += 1;
    return { line: r, column: s };
  }
  positionBy(e) {
    let n = this.source.start;
    if (e.index)
      n = this.positionInside(e.index);
    else if (e.word) {
      let s = this.toString().indexOf(e.word);
      s !== -1 && (n = this.positionInside(s));
    }
    return n;
  }
  rangeBy(e) {
    let n = {
      line: this.source.start.line,
      column: this.source.start.column
    }, s = this.source.end ? {
      line: this.source.end.line,
      column: this.source.end.column + 1
    } : {
      line: n.line,
      column: n.column + 1
    };
    if (e.word) {
      let r = this.toString().indexOf(e.word);
      r !== -1 && (n = this.positionInside(r), s = this.positionInside(r + e.word.length));
    } else
      e.start ? n = {
        line: e.start.line,
        column: e.start.column
      } : e.index && (n = this.positionInside(e.index)), e.end ? s = {
        line: e.end.line,
        column: e.end.column
      } : e.endIndex ? s = this.positionInside(e.endIndex) : e.index && (s = this.positionInside(e.index + 1));
    return (s.line < n.line || s.line === n.line && s.column <= n.column) && (s = { line: n.line, column: n.column + 1 }), { start: n, end: s };
  }
  getProxyProcessor() {
    return {
      set(e, n, s) {
        return e[n] === s || (e[n] = s, (n === "prop" || n === "value" || n === "name" || n === "params" || n === "important" || /* c8 ignore next */
        n === "text") && e.markDirty()), !0;
      },
      get(e, n) {
        return n === "proxyOf" ? e : n === "root" ? () => e.root().toProxy() : e[n];
      }
    };
  }
  toProxy() {
    return this.proxyCache || (this.proxyCache = new Proxy(this, this.getProxyProcessor())), this.proxyCache;
  }
  addToError(e) {
    if (e.postcssNode = this, e.stack && this.source && /\n\s{4}at /.test(e.stack)) {
      let n = this.source;
      e.stack = e.stack.replace(
        /\n\s{4}at /,
        `$&${n.input.from}:${n.start.line}:${n.start.column}$&`
      );
    }
    return e;
  }
  markDirty() {
    if (this[ke]) {
      this[ke] = !1;
      let e = this;
      for (; e = e.parent; )
        e[ke] = !1;
    }
  }
  get proxyOf() {
    return this;
  }
};
var qe = ht;
ht.default = ht;
let Qs = qe, dt = class extends Qs {
  constructor(e) {
    e && typeof e.value < "u" && typeof e.value != "string" && (e = { ...e, value: String(e.value) }), super(e), this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
};
var Ge = dt;
dt.default = dt;
let Ks = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Ys = (t, e = 21) => (n = e) => {
  let s = "", r = n;
  for (; r--; )
    s += t[Math.random() * t.length | 0];
  return s;
}, Js = (t = 21) => {
  let e = "", n = t;
  for (; n--; )
    e += Ks[Math.random() * 64 | 0];
  return e;
};
var Xs = { nanoid: Js, customAlphabet: Ys };
let { SourceMapConsumer: Kt, SourceMapGenerator: Yt } = Y, { existsSync: Zs, readFileSync: er } = Y, { dirname: tt, join: tr } = Y;
function nr(t) {
  return Buffer ? Buffer.from(t, "base64").toString() : window.atob(t);
}
let mt = class {
  constructor(e, n) {
    if (n.map === !1)
      return;
    this.loadAnnotation(e), this.inline = this.startWith(this.annotation, "data:");
    let s = n.map ? n.map.prev : void 0, r = this.loadMap(n.from, s);
    !this.mapFile && n.from && (this.mapFile = n.from), this.mapFile && (this.root = tt(this.mapFile)), r && (this.text = r);
  }
  consumer() {
    return this.consumerCache || (this.consumerCache = new Kt(this.text)), this.consumerCache;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
  startWith(e, n) {
    return e ? e.substr(0, n.length) === n : !1;
  }
  getAnnotationURL(e) {
    return e.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  loadAnnotation(e) {
    let n = e.match(/\/\*\s*# sourceMappingURL=/gm);
    if (!n)
      return;
    let s = e.lastIndexOf(n.pop()), r = e.indexOf("*/", s);
    s > -1 && r > -1 && (this.annotation = this.getAnnotationURL(e.substring(s, r)));
  }
  decodeInline(e) {
    let n = /^data:application\/json;charset=utf-?8;base64,/, s = /^data:application\/json;base64,/, r = /^data:application\/json;charset=utf-?8,/, o = /^data:application\/json,/;
    if (r.test(e) || o.test(e))
      return decodeURIComponent(e.substr(RegExp.lastMatch.length));
    if (n.test(e) || s.test(e))
      return nr(e.substr(RegExp.lastMatch.length));
    let c = e.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + c);
  }
  loadFile(e) {
    if (this.root = tt(e), Zs(e))
      return this.mapFile = e, er(e, "utf-8").toString().trim();
  }
  loadMap(e, n) {
    if (n === !1)
      return !1;
    if (n) {
      if (typeof n == "string")
        return n;
      if (typeof n == "function") {
        let s = n(e);
        if (s) {
          let r = this.loadFile(s);
          if (!r)
            throw new Error(
              "Unable to load previous source map: " + s.toString()
            );
          return r;
        }
      } else {
        if (n instanceof Kt)
          return Yt.fromSourceMap(n).toString();
        if (n instanceof Yt)
          return n.toString();
        if (this.isMap(n))
          return JSON.stringify(n);
        throw new Error(
          "Unsupported previous source map format: " + n.toString()
        );
      }
    } else {
      if (this.inline)
        return this.decodeInline(this.annotation);
      if (this.annotation) {
        let s = this.annotation;
        return e && (s = tr(tt(e), s)), this.loadFile(s);
      }
    }
  }
  isMap(e) {
    return typeof e != "object" ? !1 : typeof e.mappings == "string" || typeof e._mappings == "string" || Array.isArray(e.sections);
  }
};
var Tn = mt;
mt.default = mt;
let { SourceMapConsumer: sr, SourceMapGenerator: rr } = Y, { fileURLToPath: Jt, pathToFileURL: Ee } = Y, { resolve: pt, isAbsolute: gt } = Y, { nanoid: ir } = Xs, nt = Y, Xt = Nt, or = Tn, st = Symbol("fromOffsetCache"), ar = !!(sr && rr), Zt = !!(pt && gt), je = class {
  constructor(e, n = {}) {
    if (e === null || typeof e > "u" || typeof e == "object" && !e.toString)
      throw new Error(`PostCSS received ${e} instead of CSS string`);
    if (this.css = e.toString(), this.css[0] === "\uFEFF" || this.css[0] === "￾" ? (this.hasBOM = !0, this.css = this.css.slice(1)) : this.hasBOM = !1, n.from && (!Zt || /^\w+:\/\//.test(n.from) || gt(n.from) ? this.file = n.from : this.file = pt(n.from)), Zt && ar) {
      let s = new or(this.css, n);
      if (s.text) {
        this.map = s;
        let r = s.consumer().file;
        !this.file && r && (this.file = this.mapResolve(r));
      }
    }
    this.file || (this.id = "<input css " + ir(6) + ">"), this.map && (this.map.file = this.from);
  }
  fromOffset(e) {
    let n, s;
    if (this[st])
      s = this[st];
    else {
      let o = this.css.split(`
`);
      s = new Array(o.length);
      let c = 0;
      for (let d = 0, p = o.length; d < p; d++)
        s[d] = c, c += o[d].length + 1;
      this[st] = s;
    }
    n = s[s.length - 1];
    let r = 0;
    if (e >= n)
      r = s.length - 1;
    else {
      let o = s.length - 2, c;
      for (; r < o; )
        if (c = r + (o - r >> 1), e < s[c])
          o = c - 1;
        else if (e >= s[c + 1])
          r = c + 1;
        else {
          r = c;
          break;
        }
    }
    return {
      line: r + 1,
      col: e - s[r] + 1
    };
  }
  error(e, n, s, r = {}) {
    let o, c, d;
    if (n && typeof n == "object") {
      let v = n, N = s;
      if (typeof v.offset == "number") {
        let F = this.fromOffset(v.offset);
        n = F.line, s = F.col;
      } else
        n = v.line, s = v.column;
      if (typeof N.offset == "number") {
        let F = this.fromOffset(N.offset);
        c = F.line, d = F.col;
      } else
        c = N.line, d = N.column;
    } else if (!s) {
      let v = this.fromOffset(n);
      n = v.line, s = v.col;
    }
    let p = this.origin(n, s, c, d);
    return p ? o = new Xt(
      e,
      p.endLine === void 0 ? p.line : { line: p.line, column: p.column },
      p.endLine === void 0 ? p.column : { line: p.endLine, column: p.endColumn },
      p.source,
      p.file,
      r.plugin
    ) : o = new Xt(
      e,
      c === void 0 ? n : { line: n, column: s },
      c === void 0 ? s : { line: c, column: d },
      this.css,
      this.file,
      r.plugin
    ), o.input = { line: n, column: s, endLine: c, endColumn: d, source: this.css }, this.file && (Ee && (o.input.url = Ee(this.file).toString()), o.input.file = this.file), o;
  }
  origin(e, n, s, r) {
    if (!this.map)
      return !1;
    let o = this.map.consumer(), c = o.originalPositionFor({ line: e, column: n });
    if (!c.source)
      return !1;
    let d;
    typeof s == "number" && (d = o.originalPositionFor({ line: s, column: r }));
    let p;
    gt(c.source) ? p = Ee(c.source) : p = new URL(
      c.source,
      this.map.consumer().sourceRoot || Ee(this.map.mapFile)
    );
    let v = {
      url: p.toString(),
      line: c.line,
      column: c.column,
      endLine: d && d.line,
      endColumn: d && d.column
    };
    if (p.protocol === "file:")
      if (Jt)
        v.file = Jt(p);
      else
        throw new Error("file: protocol is not available in this PostCSS build");
    let N = o.sourceContentFor(c.source);
    return N && (v.source = N), v;
  }
  mapResolve(e) {
    return /^\w+:\/\//.test(e) ? e : pt(this.map.consumer().sourceRoot || this.map.root || ".", e);
  }
  get from() {
    return this.file || this.id;
  }
  toJSON() {
    let e = {};
    for (let n of ["hasBOM", "css", "file", "id"])
      this[n] != null && (e[n] = this[n]);
    return this.map && (e.map = { ...this.map }, e.map.consumerCache && (e.map.consumerCache = void 0)), e;
  }
};
var Ve = je;
je.default = je;
nt && nt.registerInput && nt.registerInput(je);
let { SourceMapConsumer: Cn, SourceMapGenerator: Pe } = Y, { dirname: De, resolve: xn, relative: kn, sep: En } = Y, { pathToFileURL: en } = Y, cr = Ve, lr = !!(Cn && Pe), ur = !!(De && xn && kn && En), fr = class {
  constructor(e, n, s, r) {
    this.stringify = e, this.mapOpts = s.map || {}, this.root = n, this.opts = s, this.css = r, this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
  }
  isMap() {
    return typeof this.opts.map < "u" ? !!this.opts.map : this.previous().length > 0;
  }
  previous() {
    if (!this.previousMaps)
      if (this.previousMaps = [], this.root)
        this.root.walk((e) => {
          if (e.source && e.source.input.map) {
            let n = e.source.input.map;
            this.previousMaps.includes(n) || this.previousMaps.push(n);
          }
        });
      else {
        let e = new cr(this.css, this.opts);
        e.map && this.previousMaps.push(e.map);
      }
    return this.previousMaps;
  }
  isInline() {
    if (typeof this.mapOpts.inline < "u")
      return this.mapOpts.inline;
    let e = this.mapOpts.annotation;
    return typeof e < "u" && e !== !0 ? !1 : this.previous().length ? this.previous().some((n) => n.inline) : !0;
  }
  isSourcesContent() {
    return typeof this.mapOpts.sourcesContent < "u" ? this.mapOpts.sourcesContent : this.previous().length ? this.previous().some((e) => e.withContent()) : !0;
  }
  clearAnnotation() {
    if (this.mapOpts.annotation !== !1)
      if (this.root) {
        let e;
        for (let n = this.root.nodes.length - 1; n >= 0; n--)
          e = this.root.nodes[n], e.type === "comment" && e.text.indexOf("# sourceMappingURL=") === 0 && this.root.removeChild(n);
      } else
        this.css && (this.css = this.css.replace(/(\n)?\/\*#[\S\s]*?\*\/$/gm, ""));
  }
  setSourcesContent() {
    let e = {};
    if (this.root)
      this.root.walk((n) => {
        if (n.source) {
          let s = n.source.input.from;
          if (s && !e[s]) {
            e[s] = !0;
            let r = this.usesFileUrls ? this.toFileUrl(s) : this.toUrl(this.path(s));
            this.map.setSourceContent(r, n.source.input.css);
          }
        }
      });
    else if (this.css) {
      let n = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
      this.map.setSourceContent(n, this.css);
    }
  }
  applyPrevMaps() {
    for (let e of this.previous()) {
      let n = this.toUrl(this.path(e.file)), s = e.root || De(e.file), r;
      this.mapOpts.sourcesContent === !1 ? (r = new Cn(e.text), r.sourcesContent && (r.sourcesContent = r.sourcesContent.map(() => null))) : r = e.consumer(), this.map.applySourceMap(r, n, this.toUrl(this.path(s)));
    }
  }
  isAnnotation() {
    return this.isInline() ? !0 : typeof this.mapOpts.annotation < "u" ? this.mapOpts.annotation : this.previous().length ? this.previous().some((e) => e.annotation) : !0;
  }
  toBase64(e) {
    return Buffer ? Buffer.from(e).toString("base64") : window.btoa(unescape(encodeURIComponent(e)));
  }
  addAnnotation() {
    let e;
    this.isInline() ? e = "data:application/json;base64," + this.toBase64(this.map.toString()) : typeof this.mapOpts.annotation == "string" ? e = this.mapOpts.annotation : typeof this.mapOpts.annotation == "function" ? e = this.mapOpts.annotation(this.opts.to, this.root) : e = this.outputFile() + ".map";
    let n = `
`;
    this.css.includes(`\r
`) && (n = `\r
`), this.css += n + "/*# sourceMappingURL=" + e + " */";
  }
  outputFile() {
    return this.opts.to ? this.path(this.opts.to) : this.opts.from ? this.path(this.opts.from) : "to.css";
  }
  generateMap() {
    if (this.root)
      this.generateString();
    else if (this.previous().length === 1) {
      let e = this.previous()[0].consumer();
      e.file = this.outputFile(), this.map = Pe.fromSourceMap(e);
    } else
      this.map = new Pe({ file: this.outputFile() }), this.map.addMapping({
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>",
        generated: { line: 1, column: 0 },
        original: { line: 1, column: 0 }
      });
    return this.isSourcesContent() && this.setSourcesContent(), this.root && this.previous().length > 0 && this.applyPrevMaps(), this.isAnnotation() && this.addAnnotation(), this.isInline() ? [this.css] : [this.css, this.map];
  }
  path(e) {
    if (e.indexOf("<") === 0 || /^\w+:\/\//.test(e) || this.mapOpts.absolute)
      return e;
    let n = this.opts.to ? De(this.opts.to) : ".";
    return typeof this.mapOpts.annotation == "string" && (n = De(xn(n, this.mapOpts.annotation))), e = kn(n, e), e;
  }
  toUrl(e) {
    return En === "\\" && (e = e.replace(/\\/g, "/")), encodeURI(e).replace(/[#?]/g, encodeURIComponent);
  }
  toFileUrl(e) {
    if (en)
      return en(e).toString();
    throw new Error(
      "`map.absolute` option is not available in this PostCSS build"
    );
  }
  sourcePath(e) {
    return this.mapOpts.from ? this.toUrl(this.mapOpts.from) : this.usesFileUrls ? this.toFileUrl(e.source.input.from) : this.toUrl(this.path(e.source.input.from));
  }
  generateString() {
    this.css = "", this.map = new Pe({ file: this.outputFile() });
    let e = 1, n = 1, s = "<no source>", r = {
      source: "",
      generated: { line: 0, column: 0 },
      original: { line: 0, column: 0 }
    }, o, c;
    this.stringify(this.root, (d, p, v) => {
      if (this.css += d, p && v !== "end" && (r.generated.line = e, r.generated.column = n - 1, p.source && p.source.start ? (r.source = this.sourcePath(p), r.original.line = p.source.start.line, r.original.column = p.source.start.column - 1, this.map.addMapping(r)) : (r.source = s, r.original.line = 1, r.original.column = 0, this.map.addMapping(r))), o = d.match(/\n/g), o ? (e += o.length, c = d.lastIndexOf(`
`), n = d.length - c) : n += d.length, p && v !== "start") {
        let N = p.parent || { raws: {} };
        (!(p.type === "decl" || p.type === "atrule" && !p.nodes) || p !== N.last || N.raws.semicolon) && (p.source && p.source.end ? (r.source = this.sourcePath(p), r.original.line = p.source.end.line, r.original.column = p.source.end.column - 1, r.generated.line = e, r.generated.column = n - 2, this.map.addMapping(r)) : (r.source = s, r.original.line = 1, r.original.column = 0, r.generated.line = e, r.generated.column = n - 1, this.map.addMapping(r)));
      }
    });
  }
  generate() {
    if (this.clearAnnotation(), ur && lr && this.isMap())
      return this.generateMap();
    {
      let e = "";
      return this.stringify(this.root, (n) => {
        e += n;
      }), [e];
    }
  }
};
var Nn = fr;
let hr = qe, yt = class extends hr {
  constructor(e) {
    super(e), this.type = "comment";
  }
};
var ze = yt;
yt.default = yt;
let { isClean: In, my: Ln } = ve, An = Ge, On = ze, dr = qe, Rn, It, Lt, Fn;
function Pn(t) {
  return t.map((e) => (e.nodes && (e.nodes = Pn(e.nodes)), delete e.source, e));
}
function Dn(t) {
  if (t[In] = !1, t.proxyOf.nodes)
    for (let e of t.proxyOf.nodes)
      Dn(e);
}
let se = class Mn extends dr {
  push(e) {
    return e.parent = this, this.proxyOf.nodes.push(e), this;
  }
  each(e) {
    if (!this.proxyOf.nodes)
      return;
    let n = this.getIterator(), s, r;
    for (; this.indexes[n] < this.proxyOf.nodes.length && (s = this.indexes[n], r = e(this.proxyOf.nodes[s], s), r !== !1); )
      this.indexes[n] += 1;
    return delete this.indexes[n], r;
  }
  walk(e) {
    return this.each((n, s) => {
      let r;
      try {
        r = e(n, s);
      } catch (o) {
        throw n.addToError(o);
      }
      return r !== !1 && n.walk && (r = n.walk(e)), r;
    });
  }
  walkDecls(e, n) {
    return n ? e instanceof RegExp ? this.walk((s, r) => {
      if (s.type === "decl" && e.test(s.prop))
        return n(s, r);
    }) : this.walk((s, r) => {
      if (s.type === "decl" && s.prop === e)
        return n(s, r);
    }) : (n = e, this.walk((s, r) => {
      if (s.type === "decl")
        return n(s, r);
    }));
  }
  walkRules(e, n) {
    return n ? e instanceof RegExp ? this.walk((s, r) => {
      if (s.type === "rule" && e.test(s.selector))
        return n(s, r);
    }) : this.walk((s, r) => {
      if (s.type === "rule" && s.selector === e)
        return n(s, r);
    }) : (n = e, this.walk((s, r) => {
      if (s.type === "rule")
        return n(s, r);
    }));
  }
  walkAtRules(e, n) {
    return n ? e instanceof RegExp ? this.walk((s, r) => {
      if (s.type === "atrule" && e.test(s.name))
        return n(s, r);
    }) : this.walk((s, r) => {
      if (s.type === "atrule" && s.name === e)
        return n(s, r);
    }) : (n = e, this.walk((s, r) => {
      if (s.type === "atrule")
        return n(s, r);
    }));
  }
  walkComments(e) {
    return this.walk((n, s) => {
      if (n.type === "comment")
        return e(n, s);
    });
  }
  append(...e) {
    for (let n of e) {
      let s = this.normalize(n, this.last);
      for (let r of s)
        this.proxyOf.nodes.push(r);
    }
    return this.markDirty(), this;
  }
  prepend(...e) {
    e = e.reverse();
    for (let n of e) {
      let s = this.normalize(n, this.first, "prepend").reverse();
      for (let r of s)
        this.proxyOf.nodes.unshift(r);
      for (let r in this.indexes)
        this.indexes[r] = this.indexes[r] + s.length;
    }
    return this.markDirty(), this;
  }
  cleanRaws(e) {
    if (super.cleanRaws(e), this.nodes)
      for (let n of this.nodes)
        n.cleanRaws(e);
  }
  insertBefore(e, n) {
    let s = this.index(e), r = s === 0 ? "prepend" : !1, o = this.normalize(n, this.proxyOf.nodes[s], r).reverse();
    s = this.index(e);
    for (let d of o)
      this.proxyOf.nodes.splice(s, 0, d);
    let c;
    for (let d in this.indexes)
      c = this.indexes[d], s <= c && (this.indexes[d] = c + o.length);
    return this.markDirty(), this;
  }
  insertAfter(e, n) {
    let s = this.index(e), r = this.normalize(n, this.proxyOf.nodes[s]).reverse();
    s = this.index(e);
    for (let c of r)
      this.proxyOf.nodes.splice(s + 1, 0, c);
    let o;
    for (let c in this.indexes)
      o = this.indexes[c], s < o && (this.indexes[c] = o + r.length);
    return this.markDirty(), this;
  }
  removeChild(e) {
    e = this.index(e), this.proxyOf.nodes[e].parent = void 0, this.proxyOf.nodes.splice(e, 1);
    let n;
    for (let s in this.indexes)
      n = this.indexes[s], n >= e && (this.indexes[s] = n - 1);
    return this.markDirty(), this;
  }
  removeAll() {
    for (let e of this.proxyOf.nodes)
      e.parent = void 0;
    return this.proxyOf.nodes = [], this.markDirty(), this;
  }
  replaceValues(e, n, s) {
    return s || (s = n, n = {}), this.walkDecls((r) => {
      n.props && !n.props.includes(r.prop) || n.fast && !r.value.includes(n.fast) || (r.value = r.value.replace(e, s));
    }), this.markDirty(), this;
  }
  every(e) {
    return this.nodes.every(e);
  }
  some(e) {
    return this.nodes.some(e);
  }
  index(e) {
    return typeof e == "number" ? e : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e));
  }
  get first() {
    if (this.proxyOf.nodes)
      return this.proxyOf.nodes[0];
  }
  get last() {
    if (this.proxyOf.nodes)
      return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
  normalize(e, n) {
    if (typeof e == "string")
      e = Pn(Rn(e).nodes);
    else if (Array.isArray(e)) {
      e = e.slice(0);
      for (let r of e)
        r.parent && r.parent.removeChild(r, "ignore");
    } else if (e.type === "root" && this.type !== "document") {
      e = e.nodes.slice(0);
      for (let r of e)
        r.parent && r.parent.removeChild(r, "ignore");
    } else if (e.type)
      e = [e];
    else if (e.prop) {
      if (typeof e.value > "u")
        throw new Error("Value field is missed in node creation");
      typeof e.value != "string" && (e.value = String(e.value)), e = [new An(e)];
    } else if (e.selector)
      e = [new It(e)];
    else if (e.name)
      e = [new Lt(e)];
    else if (e.text)
      e = [new On(e)];
    else
      throw new Error("Unknown node type in node creation");
    return e.map((r) => (r[Ln] || Mn.rebuild(r), r = r.proxyOf, r.parent && r.parent.removeChild(r), r[In] && Dn(r), typeof r.raws.before > "u" && n && typeof n.raws.before < "u" && (r.raws.before = n.raws.before.replace(/\S/g, "")), r.parent = this.proxyOf, r));
  }
  getProxyProcessor() {
    return {
      set(e, n, s) {
        return e[n] === s || (e[n] = s, (n === "name" || n === "params" || n === "selector") && e.markDirty()), !0;
      },
      get(e, n) {
        return n === "proxyOf" ? e : e[n] ? n === "each" || typeof n == "string" && n.startsWith("walk") ? (...s) => e[n](
          ...s.map((r) => typeof r == "function" ? (o, c) => r(o.toProxy(), c) : r)
        ) : n === "every" || n === "some" ? (s) => e[n](
          (r, ...o) => s(r.toProxy(), ...o)
        ) : n === "root" ? () => e.root().toProxy() : n === "nodes" ? e.nodes.map((s) => s.toProxy()) : n === "first" || n === "last" ? e[n].toProxy() : e[n] : e[n];
      }
    };
  }
  getIterator() {
    this.lastEach || (this.lastEach = 0), this.indexes || (this.indexes = {}), this.lastEach += 1;
    let e = this.lastEach;
    return this.indexes[e] = 0, e;
  }
};
se.registerParse = (t) => {
  Rn = t;
};
se.registerRule = (t) => {
  It = t;
};
se.registerAtRule = (t) => {
  Lt = t;
};
se.registerRoot = (t) => {
  Fn = t;
};
var oe = se;
se.default = se;
se.rebuild = (t) => {
  t.type === "atrule" ? Object.setPrototypeOf(t, Lt.prototype) : t.type === "rule" ? Object.setPrototypeOf(t, It.prototype) : t.type === "decl" ? Object.setPrototypeOf(t, An.prototype) : t.type === "comment" ? Object.setPrototypeOf(t, On.prototype) : t.type === "root" && Object.setPrototypeOf(t, Fn.prototype), t[Ln] = !0, t.nodes && t.nodes.forEach((e) => {
    se.rebuild(e);
  });
};
let mr = oe, Un, jn, be = class extends mr {
  constructor(e) {
    super({ type: "document", ...e }), this.nodes || (this.nodes = []);
  }
  toResult(e = {}) {
    return new Un(new jn(), this, e).stringify();
  }
};
be.registerLazyResult = (t) => {
  Un = t;
};
be.registerProcessor = (t) => {
  jn = t;
};
var At = be;
be.default = be;
let tn = {};
var $n = function(e) {
  tn[e] || (tn[e] = !0, typeof console < "u" && console.warn && console.warn(e));
};
let bt = class {
  constructor(e, n = {}) {
    if (this.type = "warning", this.text = e, n.node && n.node.source) {
      let s = n.node.rangeBy(n);
      this.line = s.start.line, this.column = s.start.column, this.endLine = s.end.line, this.endColumn = s.end.column;
    }
    for (let s in n)
      this[s] = n[s];
  }
  toString() {
    return this.node ? this.node.error(this.text, {
      plugin: this.plugin,
      index: this.index,
      word: this.word
    }).message : this.plugin ? this.plugin + ": " + this.text : this.text;
  }
};
var Hn = bt;
bt.default = bt;
let pr = Hn, wt = class {
  constructor(e, n, s) {
    this.processor = e, this.messages = [], this.root = n, this.opts = s, this.css = void 0, this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(e, n = {}) {
    n.plugin || this.lastPlugin && this.lastPlugin.postcssPlugin && (n.plugin = this.lastPlugin.postcssPlugin);
    let s = new pr(e, n);
    return this.messages.push(s), s;
  }
  warnings() {
    return this.messages.filter((e) => e.type === "warning");
  }
  get content() {
    return this.css;
  }
};
var Ot = wt;
wt.default = wt;
const rt = "'".charCodeAt(0), nn = '"'.charCodeAt(0), Ne = "\\".charCodeAt(0), sn = "/".charCodeAt(0), Ie = `
`.charCodeAt(0), ge = " ".charCodeAt(0), Le = "\f".charCodeAt(0), Ae = "	".charCodeAt(0), Oe = "\r".charCodeAt(0), gr = "[".charCodeAt(0), yr = "]".charCodeAt(0), br = "(".charCodeAt(0), wr = ")".charCodeAt(0), Sr = "{".charCodeAt(0), _r = "}".charCodeAt(0), vr = ";".charCodeAt(0), Tr = "*".charCodeAt(0), Cr = ":".charCodeAt(0), xr = "@".charCodeAt(0), Re = /[\t\n\f\r "#'()/;[\\\]{}]/g, Fe = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g, kr = /.[\n"'(/\\]/, rn = /[\da-f]/i;
var Er = function(e, n = {}) {
  let s = e.css.valueOf(), r = n.ignoreErrors, o, c, d, p, v, N, F, P, q, G, jt = s.length, A = 0, Je = [], Ce = [];
  function ms() {
    return A;
  }
  function Xe(ae) {
    throw e.error("Unclosed " + ae, A);
  }
  function ps() {
    return Ce.length === 0 && A >= jt;
  }
  function gs(ae) {
    if (Ce.length)
      return Ce.pop();
    if (A >= jt)
      return;
    let Ze = ae ? ae.ignoreUnclosed : !1;
    switch (o = s.charCodeAt(A), o) {
      case Ie:
      case ge:
      case Ae:
      case Oe:
      case Le: {
        c = A;
        do
          c += 1, o = s.charCodeAt(c);
        while (o === ge || o === Ie || o === Ae || o === Oe || o === Le);
        G = ["space", s.slice(A, c)], A = c - 1;
        break;
      }
      case gr:
      case yr:
      case Sr:
      case _r:
      case Cr:
      case vr:
      case wr: {
        let $t = String.fromCharCode(o);
        G = [$t, $t, A];
        break;
      }
      case br: {
        if (P = Je.length ? Je.pop()[1] : "", q = s.charCodeAt(A + 1), P === "url" && q !== rt && q !== nn && q !== ge && q !== Ie && q !== Ae && q !== Le && q !== Oe) {
          c = A;
          do {
            if (N = !1, c = s.indexOf(")", c + 1), c === -1)
              if (r || Ze) {
                c = A;
                break;
              } else
                Xe("bracket");
            for (F = c; s.charCodeAt(F - 1) === Ne; )
              F -= 1, N = !N;
          } while (N);
          G = ["brackets", s.slice(A, c + 1), A, c], A = c;
        } else
          c = s.indexOf(")", A + 1), p = s.slice(A, c + 1), c === -1 || kr.test(p) ? G = ["(", "(", A] : (G = ["brackets", p, A, c], A = c);
        break;
      }
      case rt:
      case nn: {
        d = o === rt ? "'" : '"', c = A;
        do {
          if (N = !1, c = s.indexOf(d, c + 1), c === -1)
            if (r || Ze) {
              c = A + 1;
              break;
            } else
              Xe("string");
          for (F = c; s.charCodeAt(F - 1) === Ne; )
            F -= 1, N = !N;
        } while (N);
        G = ["string", s.slice(A, c + 1), A, c], A = c;
        break;
      }
      case xr: {
        Re.lastIndex = A + 1, Re.test(s), Re.lastIndex === 0 ? c = s.length - 1 : c = Re.lastIndex - 2, G = ["at-word", s.slice(A, c + 1), A, c], A = c;
        break;
      }
      case Ne: {
        for (c = A, v = !0; s.charCodeAt(c + 1) === Ne; )
          c += 1, v = !v;
        if (o = s.charCodeAt(c + 1), v && o !== sn && o !== ge && o !== Ie && o !== Ae && o !== Oe && o !== Le && (c += 1, rn.test(s.charAt(c)))) {
          for (; rn.test(s.charAt(c + 1)); )
            c += 1;
          s.charCodeAt(c + 1) === ge && (c += 1);
        }
        G = ["word", s.slice(A, c + 1), A, c], A = c;
        break;
      }
      default: {
        o === sn && s.charCodeAt(A + 1) === Tr ? (c = s.indexOf("*/", A + 2) + 1, c === 0 && (r || Ze ? c = s.length : Xe("comment")), G = ["comment", s.slice(A, c + 1), A, c], A = c) : (Fe.lastIndex = A + 1, Fe.test(s), Fe.lastIndex === 0 ? c = s.length - 1 : c = Fe.lastIndex - 2, G = ["word", s.slice(A, c + 1), A, c], Je.push(G), A = c);
        break;
      }
    }
    return A++, G;
  }
  function ys(ae) {
    Ce.push(ae);
  }
  return {
    back: ys,
    nextToken: gs,
    endOfFile: ps,
    position: ms
  };
};
let Wn = oe, $e = class extends Wn {
  constructor(e) {
    super(e), this.type = "atrule";
  }
  append(...e) {
    return this.proxyOf.nodes || (this.nodes = []), super.append(...e);
  }
  prepend(...e) {
    return this.proxyOf.nodes || (this.nodes = []), super.prepend(...e);
  }
};
var Rt = $e;
$e.default = $e;
Wn.registerAtRule($e);
let Bn = oe, qn, Gn, fe = class extends Bn {
  constructor(e) {
    super(e), this.type = "root", this.nodes || (this.nodes = []);
  }
  removeChild(e, n) {
    let s = this.index(e);
    return !n && s === 0 && this.nodes.length > 1 && (this.nodes[1].raws.before = this.nodes[s].raws.before), super.removeChild(e);
  }
  normalize(e, n, s) {
    let r = super.normalize(e);
    if (n) {
      if (s === "prepend")
        this.nodes.length > 1 ? n.raws.before = this.nodes[1].raws.before : delete n.raws.before;
      else if (this.first !== n)
        for (let o of r)
          o.raws.before = n.raws.before;
    }
    return r;
  }
  toResult(e = {}) {
    return new qn(new Gn(), this, e).stringify();
  }
};
fe.registerLazyResult = (t) => {
  qn = t;
};
fe.registerProcessor = (t) => {
  Gn = t;
};
var Te = fe;
fe.default = fe;
Bn.registerRoot(fe);
let we = {
  split(t, e, n) {
    let s = [], r = "", o = !1, c = 0, d = !1, p = "", v = !1;
    for (let N of t)
      v ? v = !1 : N === "\\" ? v = !0 : d ? N === p && (d = !1) : N === '"' || N === "'" ? (d = !0, p = N) : N === "(" ? c += 1 : N === ")" ? c > 0 && (c -= 1) : c === 0 && e.includes(N) && (o = !0), o ? (r !== "" && s.push(r.trim()), r = "", o = !1) : r += N;
    return (n || r !== "") && s.push(r.trim()), s;
  },
  space(t) {
    let e = [" ", `
`, "	"];
    return we.split(t, e);
  },
  comma(t) {
    return we.split(t, [","], !0);
  }
};
var Vn = we;
we.default = we;
let zn = oe, Nr = Vn, He = class extends zn {
  constructor(e) {
    super(e), this.type = "rule", this.nodes || (this.nodes = []);
  }
  get selectors() {
    return Nr.comma(this.selector);
  }
  set selectors(e) {
    let n = this.selector ? this.selector.match(/,\s*/) : null, s = n ? n[0] : "," + this.raw("between", "beforeOpen");
    this.selector = e.join(s);
  }
};
var Ft = He;
He.default = He;
zn.registerRule(He);
let Ir = Ge, Lr = Er, Ar = ze, Or = Rt, Rr = Te, on = Ft;
const an = {
  empty: !0,
  space: !0
};
function Fr(t) {
  for (let e = t.length - 1; e >= 0; e--) {
    let n = t[e], s = n[3] || n[2];
    if (s)
      return s;
  }
}
let Pr = class {
  constructor(e) {
    this.input = e, this.root = new Rr(), this.current = this.root, this.spaces = "", this.semicolon = !1, this.customProperty = !1, this.createTokenizer(), this.root.source = { input: e, start: { offset: 0, line: 1, column: 1 } };
  }
  createTokenizer() {
    this.tokenizer = Lr(this.input);
  }
  parse() {
    let e;
    for (; !this.tokenizer.endOfFile(); )
      switch (e = this.tokenizer.nextToken(), e[0]) {
        case "space":
          this.spaces += e[1];
          break;
        case ";":
          this.freeSemicolon(e);
          break;
        case "}":
          this.end(e);
          break;
        case "comment":
          this.comment(e);
          break;
        case "at-word":
          this.atrule(e);
          break;
        case "{":
          this.emptyRule(e);
          break;
        default:
          this.other(e);
          break;
      }
    this.endFile();
  }
  comment(e) {
    let n = new Ar();
    this.init(n, e[2]), n.source.end = this.getPosition(e[3] || e[2]);
    let s = e[1].slice(2, -2);
    if (/^\s*$/.test(s))
      n.text = "", n.raws.left = s, n.raws.right = "";
    else {
      let r = s.match(/^(\s*)([^]*\S)(\s*)$/);
      n.text = r[2], n.raws.left = r[1], n.raws.right = r[3];
    }
  }
  emptyRule(e) {
    let n = new on();
    this.init(n, e[2]), n.selector = "", n.raws.between = "", this.current = n;
  }
  other(e) {
    let n = !1, s = null, r = !1, o = null, c = [], d = e[1].startsWith("--"), p = [], v = e;
    for (; v; ) {
      if (s = v[0], p.push(v), s === "(" || s === "[")
        o || (o = v), c.push(s === "(" ? ")" : "]");
      else if (d && r && s === "{")
        o || (o = v), c.push("}");
      else if (c.length === 0)
        if (s === ";")
          if (r) {
            this.decl(p, d);
            return;
          } else
            break;
        else if (s === "{") {
          this.rule(p);
          return;
        } else if (s === "}") {
          this.tokenizer.back(p.pop()), n = !0;
          break;
        } else
          s === ":" && (r = !0);
      else
        s === c[c.length - 1] && (c.pop(), c.length === 0 && (o = null));
      v = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile() && (n = !0), c.length > 0 && this.unclosedBracket(o), n && r) {
      if (!d)
        for (; p.length && (v = p[p.length - 1][0], !(v !== "space" && v !== "comment")); )
          this.tokenizer.back(p.pop());
      this.decl(p, d);
    } else
      this.unknownWord(p);
  }
  rule(e) {
    e.pop();
    let n = new on();
    this.init(n, e[0][2]), n.raws.between = this.spacesAndCommentsFromEnd(e), this.raw(n, "selector", e), this.current = n;
  }
  decl(e, n) {
    let s = new Ir();
    this.init(s, e[0][2]);
    let r = e[e.length - 1];
    for (r[0] === ";" && (this.semicolon = !0, e.pop()), s.source.end = this.getPosition(
      r[3] || r[2] || Fr(e)
    ); e[0][0] !== "word"; )
      e.length === 1 && this.unknownWord(e), s.raws.before += e.shift()[1];
    for (s.source.start = this.getPosition(e[0][2]), s.prop = ""; e.length; ) {
      let v = e[0][0];
      if (v === ":" || v === "space" || v === "comment")
        break;
      s.prop += e.shift()[1];
    }
    s.raws.between = "";
    let o;
    for (; e.length; )
      if (o = e.shift(), o[0] === ":") {
        s.raws.between += o[1];
        break;
      } else
        o[0] === "word" && /\w/.test(o[1]) && this.unknownWord([o]), s.raws.between += o[1];
    (s.prop[0] === "_" || s.prop[0] === "*") && (s.raws.before += s.prop[0], s.prop = s.prop.slice(1));
    let c = [], d;
    for (; e.length && (d = e[0][0], !(d !== "space" && d !== "comment")); )
      c.push(e.shift());
    this.precheckMissedSemicolon(e);
    for (let v = e.length - 1; v >= 0; v--) {
      if (o = e[v], o[1].toLowerCase() === "!important") {
        s.important = !0;
        let N = this.stringFrom(e, v);
        N = this.spacesFromEnd(e) + N, N !== " !important" && (s.raws.important = N);
        break;
      } else if (o[1].toLowerCase() === "important") {
        let N = e.slice(0), F = "";
        for (let P = v; P > 0; P--) {
          let q = N[P][0];
          if (F.trim().indexOf("!") === 0 && q !== "space")
            break;
          F = N.pop()[1] + F;
        }
        F.trim().indexOf("!") === 0 && (s.important = !0, s.raws.important = F, e = N);
      }
      if (o[0] !== "space" && o[0] !== "comment")
        break;
    }
    e.some((v) => v[0] !== "space" && v[0] !== "comment") && (s.raws.between += c.map((v) => v[1]).join(""), c = []), this.raw(s, "value", c.concat(e), n), s.value.includes(":") && !n && this.checkMissedSemicolon(e);
  }
  atrule(e) {
    let n = new Or();
    n.name = e[1].slice(1), n.name === "" && this.unnamedAtrule(n, e), this.init(n, e[2]);
    let s, r, o, c = !1, d = !1, p = [], v = [];
    for (; !this.tokenizer.endOfFile(); ) {
      if (e = this.tokenizer.nextToken(), s = e[0], s === "(" || s === "[" ? v.push(s === "(" ? ")" : "]") : s === "{" && v.length > 0 ? v.push("}") : s === v[v.length - 1] && v.pop(), v.length === 0)
        if (s === ";") {
          n.source.end = this.getPosition(e[2]), this.semicolon = !0;
          break;
        } else if (s === "{") {
          d = !0;
          break;
        } else if (s === "}") {
          if (p.length > 0) {
            for (o = p.length - 1, r = p[o]; r && r[0] === "space"; )
              r = p[--o];
            r && (n.source.end = this.getPosition(r[3] || r[2]));
          }
          this.end(e);
          break;
        } else
          p.push(e);
      else
        p.push(e);
      if (this.tokenizer.endOfFile()) {
        c = !0;
        break;
      }
    }
    n.raws.between = this.spacesAndCommentsFromEnd(p), p.length ? (n.raws.afterName = this.spacesAndCommentsFromStart(p), this.raw(n, "params", p), c && (e = p[p.length - 1], n.source.end = this.getPosition(e[3] || e[2]), this.spaces = n.raws.between, n.raws.between = "")) : (n.raws.afterName = "", n.params = ""), d && (n.nodes = [], this.current = n);
  }
  end(e) {
    this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.semicolon = !1, this.current.raws.after = (this.current.raws.after || "") + this.spaces, this.spaces = "", this.current.parent ? (this.current.source.end = this.getPosition(e[2]), this.current = this.current.parent) : this.unexpectedClose(e);
  }
  endFile() {
    this.current.parent && this.unclosedBlock(), this.current.nodes && this.current.nodes.length && (this.current.raws.semicolon = this.semicolon), this.current.raws.after = (this.current.raws.after || "") + this.spaces;
  }
  freeSemicolon(e) {
    if (this.spaces += e[1], this.current.nodes) {
      let n = this.current.nodes[this.current.nodes.length - 1];
      n && n.type === "rule" && !n.raws.ownSemicolon && (n.raws.ownSemicolon = this.spaces, this.spaces = "");
    }
  }
  // Helpers
  getPosition(e) {
    let n = this.input.fromOffset(e);
    return {
      offset: e,
      line: n.line,
      column: n.col
    };
  }
  init(e, n) {
    this.current.push(e), e.source = {
      start: this.getPosition(n),
      input: this.input
    }, e.raws.before = this.spaces, this.spaces = "", e.type !== "comment" && (this.semicolon = !1);
  }
  raw(e, n, s, r) {
    let o, c, d = s.length, p = "", v = !0, N, F;
    for (let P = 0; P < d; P += 1)
      o = s[P], c = o[0], c === "space" && P === d - 1 && !r ? v = !1 : c === "comment" ? (F = s[P - 1] ? s[P - 1][0] : "empty", N = s[P + 1] ? s[P + 1][0] : "empty", !an[F] && !an[N] ? p.slice(-1) === "," ? v = !1 : p += o[1] : v = !1) : p += o[1];
    if (!v) {
      let P = s.reduce((q, G) => q + G[1], "");
      e.raws[n] = { value: p, raw: P };
    }
    e[n] = p;
  }
  spacesAndCommentsFromEnd(e) {
    let n, s = "";
    for (; e.length && (n = e[e.length - 1][0], !(n !== "space" && n !== "comment")); )
      s = e.pop()[1] + s;
    return s;
  }
  spacesAndCommentsFromStart(e) {
    let n, s = "";
    for (; e.length && (n = e[0][0], !(n !== "space" && n !== "comment")); )
      s += e.shift()[1];
    return s;
  }
  spacesFromEnd(e) {
    let n, s = "";
    for (; e.length && (n = e[e.length - 1][0], n === "space"); )
      s = e.pop()[1] + s;
    return s;
  }
  stringFrom(e, n) {
    let s = "";
    for (let r = n; r < e.length; r++)
      s += e[r][1];
    return e.splice(n, e.length - n), s;
  }
  colon(e) {
    let n = 0, s, r, o;
    for (let [c, d] of e.entries()) {
      if (s = d, r = s[0], r === "(" && (n += 1), r === ")" && (n -= 1), n === 0 && r === ":")
        if (!o)
          this.doubleColon(s);
        else {
          if (o[0] === "word" && o[1] === "progid")
            continue;
          return c;
        }
      o = s;
    }
    return !1;
  }
  // Errors
  unclosedBracket(e) {
    throw this.input.error(
      "Unclosed bracket",
      { offset: e[2] },
      { offset: e[2] + 1 }
    );
  }
  unknownWord(e) {
    throw this.input.error(
      "Unknown word",
      { offset: e[0][2] },
      { offset: e[0][2] + e[0][1].length }
    );
  }
  unexpectedClose(e) {
    throw this.input.error(
      "Unexpected }",
      { offset: e[2] },
      { offset: e[2] + 1 }
    );
  }
  unclosedBlock() {
    let e = this.current.source.start;
    throw this.input.error("Unclosed block", e.line, e.column);
  }
  doubleColon(e) {
    throw this.input.error(
      "Double colon",
      { offset: e[2] },
      { offset: e[2] + e[1].length }
    );
  }
  unnamedAtrule(e, n) {
    throw this.input.error(
      "At-rule without name",
      { offset: n[2] },
      { offset: n[2] + n[1].length }
    );
  }
  precheckMissedSemicolon() {
  }
  checkMissedSemicolon(e) {
    let n = this.colon(e);
    if (n === !1)
      return;
    let s = 0, r;
    for (let o = n - 1; o >= 0 && (r = e[o], !(r[0] !== "space" && (s += 1, s === 2))); o--)
      ;
    throw this.input.error(
      "Missed semicolon",
      r[0] === "word" ? r[3] + 1 : r[2]
    );
  }
};
var Dr = Pr;
let Mr = oe, Ur = Dr, jr = Ve;
function We(t, e) {
  let n = new jr(t, e), s = new Ur(n);
  try {
    s.parse();
  } catch (r) {
    throw process.env.NODE_ENV !== "production" && r.name === "CssSyntaxError" && e && e.from && (/\.scss$/i.test(e.from) ? r.message += `
You tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser` : /\.sass/i.test(e.from) ? r.message += `
You tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser` : /\.less$/i.test(e.from) && (r.message += `
You tried to parse Less with the standard CSS parser; try again with the postcss-less parser`)), r;
  }
  return s.root;
}
var Pt = We;
We.default = We;
Mr.registerParse(We);
let { isClean: J, my: $r } = ve, Hr = Nn, Wr = Be, Br = oe, qr = At, Gr = $n, cn = Ot, Vr = Pt, zr = Te;
const Qr = {
  document: "Document",
  root: "Root",
  atrule: "AtRule",
  rule: "Rule",
  decl: "Declaration",
  comment: "Comment"
}, Kr = {
  postcssPlugin: !0,
  prepare: !0,
  Once: !0,
  Document: !0,
  Root: !0,
  Declaration: !0,
  Rule: !0,
  AtRule: !0,
  Comment: !0,
  DeclarationExit: !0,
  RuleExit: !0,
  AtRuleExit: !0,
  CommentExit: !0,
  RootExit: !0,
  DocumentExit: !0,
  OnceExit: !0
}, Yr = {
  postcssPlugin: !0,
  prepare: !0,
  Once: !0
}, he = 0;
function ye(t) {
  return typeof t == "object" && typeof t.then == "function";
}
function Qn(t) {
  let e = !1, n = Qr[t.type];
  return t.type === "decl" ? e = t.prop.toLowerCase() : t.type === "atrule" && (e = t.name.toLowerCase()), e && t.append ? [
    n,
    n + "-" + e,
    he,
    n + "Exit",
    n + "Exit-" + e
  ] : e ? [n, n + "-" + e, n + "Exit", n + "Exit-" + e] : t.append ? [n, he, n + "Exit"] : [n, n + "Exit"];
}
function ln(t) {
  let e;
  return t.type === "document" ? e = ["Document", he, "DocumentExit"] : t.type === "root" ? e = ["Root", he, "RootExit"] : e = Qn(t), {
    node: t,
    events: e,
    eventIndex: 0,
    visitors: [],
    visitorIndex: 0,
    iterator: 0
  };
}
function St(t) {
  return t[J] = !1, t.nodes && t.nodes.forEach((e) => St(e)), t;
}
let _t = {}, de = class Kn {
  constructor(e, n, s) {
    this.stringified = !1, this.processed = !1;
    let r;
    if (typeof n == "object" && n !== null && (n.type === "root" || n.type === "document"))
      r = St(n);
    else if (n instanceof Kn || n instanceof cn)
      r = St(n.root), n.map && (typeof s.map > "u" && (s.map = {}), s.map.inline || (s.map.inline = !1), s.map.prev = n.map);
    else {
      let o = Vr;
      s.syntax && (o = s.syntax.parse), s.parser && (o = s.parser), o.parse && (o = o.parse);
      try {
        r = o(n, s);
      } catch (c) {
        this.processed = !0, this.error = c;
      }
      r && !r[$r] && Br.rebuild(r);
    }
    this.result = new cn(e, r, s), this.helpers = { ..._t, result: this.result, postcss: _t }, this.plugins = this.processor.plugins.map((o) => typeof o == "object" && o.prepare ? { ...o, ...o.prepare(this.result) } : o);
  }
  get [Symbol.toStringTag]() {
    return "LazyResult";
  }
  get processor() {
    return this.result.processor;
  }
  get opts() {
    return this.result.opts;
  }
  get css() {
    return this.stringify().css;
  }
  get content() {
    return this.stringify().content;
  }
  get map() {
    return this.stringify().map;
  }
  get root() {
    return this.sync().root;
  }
  get messages() {
    return this.sync().messages;
  }
  warnings() {
    return this.sync().warnings();
  }
  toString() {
    return this.css;
  }
  then(e, n) {
    return process.env.NODE_ENV !== "production" && ("from" in this.opts || Gr(
      "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
    )), this.async().then(e, n);
  }
  catch(e) {
    return this.async().catch(e);
  }
  finally(e) {
    return this.async().then(e, e);
  }
  async() {
    return this.error ? Promise.reject(this.error) : this.processed ? Promise.resolve(this.result) : (this.processing || (this.processing = this.runAsync()), this.processing);
  }
  sync() {
    if (this.error)
      throw this.error;
    if (this.processed)
      return this.result;
    if (this.processed = !0, this.processing)
      throw this.getAsyncError();
    for (let e of this.plugins) {
      let n = this.runOnRoot(e);
      if (ye(n))
        throw this.getAsyncError();
    }
    if (this.prepareVisitors(), this.hasListener) {
      let e = this.result.root;
      for (; !e[J]; )
        e[J] = !0, this.walkSync(e);
      if (this.listeners.OnceExit)
        if (e.type === "document")
          for (let n of e.nodes)
            this.visitSync(this.listeners.OnceExit, n);
        else
          this.visitSync(this.listeners.OnceExit, e);
    }
    return this.result;
  }
  stringify() {
    if (this.error)
      throw this.error;
    if (this.stringified)
      return this.result;
    this.stringified = !0, this.sync();
    let e = this.result.opts, n = Wr;
    e.syntax && (n = e.syntax.stringify), e.stringifier && (n = e.stringifier), n.stringify && (n = n.stringify);
    let r = new Hr(n, this.result.root, this.result.opts).generate();
    return this.result.css = r[0], this.result.map = r[1], this.result;
  }
  walkSync(e) {
    e[J] = !0;
    let n = Qn(e);
    for (let s of n)
      if (s === he)
        e.nodes && e.each((r) => {
          r[J] || this.walkSync(r);
        });
      else {
        let r = this.listeners[s];
        if (r && this.visitSync(r, e.toProxy()))
          return;
      }
  }
  visitSync(e, n) {
    for (let [s, r] of e) {
      this.result.lastPlugin = s;
      let o;
      try {
        o = r(n, this.helpers);
      } catch (c) {
        throw this.handleError(c, n.proxyOf);
      }
      if (n.type !== "root" && n.type !== "document" && !n.parent)
        return !0;
      if (ye(o))
        throw this.getAsyncError();
    }
  }
  runOnRoot(e) {
    this.result.lastPlugin = e;
    try {
      if (typeof e == "object" && e.Once) {
        if (this.result.root.type === "document") {
          let n = this.result.root.nodes.map(
            (s) => e.Once(s, this.helpers)
          );
          return ye(n[0]) ? Promise.all(n) : n;
        }
        return e.Once(this.result.root, this.helpers);
      } else if (typeof e == "function")
        return e(this.result.root, this.result);
    } catch (n) {
      throw this.handleError(n);
    }
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(e, n) {
    let s = this.result.lastPlugin;
    try {
      if (n && n.addToError(e), this.error = e, e.name === "CssSyntaxError" && !e.plugin)
        e.plugin = s.postcssPlugin, e.setMessage();
      else if (s.postcssVersion && process.env.NODE_ENV !== "production") {
        let r = s.postcssPlugin, o = s.postcssVersion, c = this.result.processor.version, d = o.split("."), p = c.split(".");
        (d[0] !== p[0] || parseInt(d[1]) > parseInt(p[1])) && console.error(
          "Unknown error from PostCSS plugin. Your current PostCSS version is " + c + ", but " + r + " uses " + o + ". Perhaps this is the source of the error below."
        );
      }
    } catch (r) {
      console && console.error && console.error(r);
    }
    return e;
  }
  async runAsync() {
    this.plugin = 0;
    for (let e = 0; e < this.plugins.length; e++) {
      let n = this.plugins[e], s = this.runOnRoot(n);
      if (ye(s))
        try {
          await s;
        } catch (r) {
          throw this.handleError(r);
        }
    }
    if (this.prepareVisitors(), this.hasListener) {
      let e = this.result.root;
      for (; !e[J]; ) {
        e[J] = !0;
        let n = [ln(e)];
        for (; n.length > 0; ) {
          let s = this.visitTick(n);
          if (ye(s))
            try {
              await s;
            } catch (r) {
              let o = n[n.length - 1].node;
              throw this.handleError(r, o);
            }
        }
      }
      if (this.listeners.OnceExit)
        for (let [n, s] of this.listeners.OnceExit) {
          this.result.lastPlugin = n;
          try {
            if (e.type === "document") {
              let r = e.nodes.map(
                (o) => s(o, this.helpers)
              );
              await Promise.all(r);
            } else
              await s(e, this.helpers);
          } catch (r) {
            throw this.handleError(r);
          }
        }
    }
    return this.processed = !0, this.stringify();
  }
  prepareVisitors() {
    this.listeners = {};
    let e = (n, s, r) => {
      this.listeners[s] || (this.listeners[s] = []), this.listeners[s].push([n, r]);
    };
    for (let n of this.plugins)
      if (typeof n == "object")
        for (let s in n) {
          if (!Kr[s] && /^[A-Z]/.test(s))
            throw new Error(
              `Unknown event ${s} in ${n.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
            );
          if (!Yr[s])
            if (typeof n[s] == "object")
              for (let r in n[s])
                r === "*" ? e(n, s, n[s][r]) : e(
                  n,
                  s + "-" + r.toLowerCase(),
                  n[s][r]
                );
            else
              typeof n[s] == "function" && e(n, s, n[s]);
        }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  visitTick(e) {
    let n = e[e.length - 1], { node: s, visitors: r } = n;
    if (s.type !== "root" && s.type !== "document" && !s.parent) {
      e.pop();
      return;
    }
    if (r.length > 0 && n.visitorIndex < r.length) {
      let [c, d] = r[n.visitorIndex];
      n.visitorIndex += 1, n.visitorIndex === r.length && (n.visitors = [], n.visitorIndex = 0), this.result.lastPlugin = c;
      try {
        return d(s.toProxy(), this.helpers);
      } catch (p) {
        throw this.handleError(p, s);
      }
    }
    if (n.iterator !== 0) {
      let c = n.iterator, d;
      for (; d = s.nodes[s.indexes[c]]; )
        if (s.indexes[c] += 1, !d[J]) {
          d[J] = !0, e.push(ln(d));
          return;
        }
      n.iterator = 0, delete s.indexes[c];
    }
    let o = n.events;
    for (; n.eventIndex < o.length; ) {
      let c = o[n.eventIndex];
      if (n.eventIndex += 1, c === he) {
        s.nodes && s.nodes.length && (s[J] = !0, n.iterator = s.getIterator());
        return;
      } else if (this.listeners[c]) {
        n.visitors = this.listeners[c];
        return;
      }
    }
    e.pop();
  }
};
de.registerPostcss = (t) => {
  _t = t;
};
var Yn = de;
de.default = de;
zr.registerLazyResult(de);
qr.registerLazyResult(de);
let Jr = Nn, Xr = Be, Zr = $n, ei = Pt;
const ti = Ot;
let vt = class {
  constructor(e, n, s) {
    n = n.toString(), this.stringified = !1, this._processor = e, this._css = n, this._opts = s, this._map = void 0;
    let r, o = Xr;
    this.result = new ti(this._processor, r, this._opts), this.result.css = n;
    let c = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return c.root;
      }
    });
    let d = new Jr(o, r, this._opts, n);
    if (d.isMap()) {
      let [p, v] = d.generate();
      p && (this.result.css = p), v && (this.result.map = v);
    }
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
  get processor() {
    return this.result.processor;
  }
  get opts() {
    return this.result.opts;
  }
  get css() {
    return this.result.css;
  }
  get content() {
    return this.result.css;
  }
  get map() {
    return this.result.map;
  }
  get root() {
    if (this._root)
      return this._root;
    let e, n = ei;
    try {
      e = n(this._css, this._opts);
    } catch (s) {
      this.error = s;
    }
    if (this.error)
      throw this.error;
    return this._root = e, e;
  }
  get messages() {
    return [];
  }
  warnings() {
    return [];
  }
  toString() {
    return this._css;
  }
  then(e, n) {
    return process.env.NODE_ENV !== "production" && ("from" in this._opts || Zr(
      "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
    )), this.async().then(e, n);
  }
  catch(e) {
    return this.async().catch(e);
  }
  finally(e) {
    return this.async().then(e, e);
  }
  async() {
    return this.error ? Promise.reject(this.error) : Promise.resolve(this.result);
  }
  sync() {
    if (this.error)
      throw this.error;
    return this.result;
  }
};
var ni = vt;
vt.default = vt;
let si = ni, ri = Yn, ii = At, oi = Te, Se = class {
  constructor(e = []) {
    this.version = "8.4.23", this.plugins = this.normalize(e);
  }
  use(e) {
    return this.plugins = this.plugins.concat(this.normalize([e])), this;
  }
  process(e, n = {}) {
    return this.plugins.length === 0 && typeof n.parser > "u" && typeof n.stringifier > "u" && typeof n.syntax > "u" ? new si(this, e, n) : new ri(this, e, n);
  }
  normalize(e) {
    let n = [];
    for (let s of e)
      if (s.postcss === !0 ? s = s() : s.postcss && (s = s.postcss), typeof s == "object" && Array.isArray(s.plugins))
        n = n.concat(s.plugins);
      else if (typeof s == "object" && s.postcssPlugin)
        n.push(s);
      else if (typeof s == "function")
        n.push(s);
      else if (typeof s == "object" && (s.parse || s.stringify)) {
        if (process.env.NODE_ENV !== "production")
          throw new Error(
            "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
          );
      } else
        throw new Error(s + " is not a PostCSS plugin");
    return n;
  }
};
var ai = Se;
Se.default = Se;
oi.registerProcessor(Se);
ii.registerProcessor(Se);
let ci = Ge, li = Tn, ui = ze, fi = Rt, hi = Ve, di = Te, mi = Ft;
function _e(t, e) {
  if (Array.isArray(t))
    return t.map((r) => _e(r));
  let { inputs: n, ...s } = t;
  if (n) {
    e = [];
    for (let r of n) {
      let o = { ...r, __proto__: hi.prototype };
      o.map && (o.map = {
        ...o.map,
        __proto__: li.prototype
      }), e.push(o);
    }
  }
  if (s.nodes && (s.nodes = t.nodes.map((r) => _e(r, e))), s.source) {
    let { inputId: r, ...o } = s.source;
    s.source = o, r != null && (s.source.input = e[r]);
  }
  if (s.type === "root")
    return new di(s);
  if (s.type === "decl")
    return new ci(s);
  if (s.type === "rule")
    return new mi(s);
  if (s.type === "comment")
    return new ui(s);
  if (s.type === "atrule")
    return new fi(s);
  throw new Error("Unknown node type: " + t.type);
}
var pi = _e;
_e.default = _e;
let gi = Nt, Jn = Ge, yi = Yn, bi = oe, Dt = ai, wi = Be, Si = pi, Xn = At, _i = Hn, Zn = ze, es = Rt, vi = Ot, Ti = Ve, Ci = Pt, xi = Vn, ts = Ft, ns = Te, ki = qe;
function D(...t) {
  return t.length === 1 && Array.isArray(t[0]) && (t = t[0]), new Dt(t);
}
D.plugin = function(e, n) {
  let s = !1;
  function r(...c) {
    console && console.warn && !s && (s = !0, console.warn(
      e + `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`
    ), process.env.LANG && process.env.LANG.startsWith("cn") && console.warn(
      e + `: 里面 postcss.plugin 被弃用. 迁移指南:
https://www.w3ctech.com/topic/2226`
    ));
    let d = n(...c);
    return d.postcssPlugin = e, d.postcssVersion = new Dt().version, d;
  }
  let o;
  return Object.defineProperty(r, "postcss", {
    get() {
      return o || (o = r()), o;
    }
  }), r.process = function(c, d, p) {
    return D([r(p)]).process(c, d);
  }, r;
};
D.stringify = wi;
D.parse = Ci;
D.fromJSON = Si;
D.list = xi;
D.comment = (t) => new Zn(t);
D.atRule = (t) => new es(t);
D.decl = (t) => new Jn(t);
D.rule = (t) => new ts(t);
D.root = (t) => new ns(t);
D.document = (t) => new Xn(t);
D.CssSyntaxError = gi;
D.Declaration = Jn;
D.Container = bi;
D.Processor = Dt;
D.Document = Xn;
D.Comment = Zn;
D.Warning = _i;
D.AtRule = es;
D.Result = vi;
D.Input = Ti;
D.Rule = ts;
D.Root = ns;
D.Node = ki;
yi.registerPostcss(D);
var Ei = D;
D.default = D;
const H = /* @__PURE__ */ Ms(Ei);
H.stringify;
H.fromJSON;
H.plugin;
H.parse;
const Ni = H.list;
H.document;
H.comment;
H.atRule;
H.rule;
H.decl;
H.root;
H.CssSyntaxError;
H.Declaration;
H.Container;
H.Processor;
H.Document;
H.Comment;
H.Warning;
H.AtRule;
H.Result;
H.Input;
H.Rule;
H.Root;
H.Node;
const pe = {
  afterCreation: function(t) {
    t.verbFunctions.push(function(e, n) {
      n.push(e.isAtLoc(g().name) ? a.verbs.drop : a.verbs.take);
    });
  },
  takeable: !0,
  msgDrop: a.drop_successful,
  msgDropIn: a.done_msg,
  msgTake: a.take_successful,
  msgTakeOut: a.done_msg,
  drop: function(t) {
    if (this.testDrop && !this.testDrop(t))
      return !1;
    const e = m[t.char.loc];
    return e.testDropIn && !e.testDropIn(t) ? !1 : (x(this.msgDrop, t), this.moveToFrom(t, "loc", "name"), !0);
  },
  take: function(t) {
    const e = t.char;
    return this.isAtLoc(e.name) ? L(a.already_have, t) : !e.testManipulate(this, "take") || this.testTake && !this.testTake(t) || m[e.loc].testTakeOut && !m[e.loc].testTakeOut(t) ? !1 : (x(this.msgTake, t), this.moveToFrom(t, "name", "loc"), this.scenery && (this.scenery = !1), !0);
  },
  // This returns the location from which the item is to be taken
  // (and does not do taking from a location).
  // This can be useful for weird objects, such as ropes
  takeFromLoc: function(t) {
    return this.loc;
  }
}, jo = () => pe, $o = function() {
  return {
    shiftable: !0
  };
}, Ho = function(t, e, n) {
  const s = Mt(t, n);
  s.ensemble = !0, s.ensembleMembers = e, s.parserPriority = 30, s.inventorySkip = !0, s.takeable = !0, s.getWorn = function(r) {
    return this.isAtLoc(this.ensembleMembers[0].loc, r) && this.ensembleMembers[0].getWorn();
  }, s.nameModifierFunctions = [function(r, o) {
    r.ensembleMembers[0].getWorn() && r.isAllTogether() && r.ensembleMembers[0].isAtLoc(g().name) && o.push(a.invModifiers.worn);
  }], s.isLocatedAt = function(r, o) {
    if (o !== h.PARSER)
      return !1;
    const c = this.ensembleMembers[0].getWorn();
    for (let d of this.ensembleMembers)
      if (d.loc !== r || d.getWorn() !== c)
        return !1;
    return !0;
  }, s.isAllTogether = function() {
    const r = this.ensembleMembers[0].getWorn(), o = this.ensembleMembers[0].loc;
    for (let c of this.ensembleMembers)
      if (c.loc !== o || c.breakEnsemble && c.breakEnsemble() || c.getWorn() !== r)
        return !1;
    return !0;
  }, s.msgDrop = a.drop_successful, s.msgTake = a.take_successful, s.drop = function(r) {
    const o = m[r.char.loc];
    if (o.testDrop && !o.testDrop(r) || o.testDropIn && !o.testDropIn(r))
      return !1;
    x(this.msgDrop, r);
    for (let c of this.ensembleMembers)
      c.moveToFrom(r, "loc");
    return !0;
  }, s.take = function(r) {
    const o = r.char;
    if (this.isAtLoc(o.name))
      return x(a.already_have, r), !1;
    if (!o.testManipulate(this, "take") || this.testTake && !this.testTake(r) || m[o.loc].testTakeOut && !m[o.loc].testTakeOut(r))
      return !1;
    x(this.msgTake, r);
    for (let c of this.ensembleMembers)
      c.moveToFrom(r, "name"), c.scenery && (c.scenery = !1);
    return !0;
  };
  for (let r of e)
    r.ensembleMaster = s;
  return s;
}, Wo = function(t, e) {
  const n = {
    price: t,
    getPrice: function() {
      return this.price;
    },
    msgPurchase: a.purchase_successful,
    msgSell: a.sell_successful,
    // The price when the player sells the item
    // By default, half the "list" price
    //
    getSellingPrice: function(s) {
      return m[s.loc].buyingValue ? Math.round(this.getPrice() * m[s.loc].buyingValue / 100) : Math.round(this.getPrice() / 2);
    },
    // The price when the player buys the item
    // Uses the sellingDiscount, as te shop is selling it!
    getBuyingPrice: function(s) {
      return m[s.loc].sellingDiscount ? Math.round(this.getPrice() * (100 - m[s.loc].sellingDiscount) / 100) : this.getPrice();
    },
    isLocatedAt: function(s, r) {
      return this.salesLoc || this.salesLocs ? (r === h.PURCHASE || r === h.PARSER) && this.isForSale(s) : this.loc === s;
    },
    isForSale: function(s) {
      return !this.salesLoc && !this.salesLocs ? !1 : this.doNotClone ? this.salesLoc === s : this.salesLocs.includes(s);
    },
    canBeSoldHere: function(s) {
      return m[s].willBuy && m[s].willBuy(this);
    },
    purchase: function(s) {
      if (this.testPurchase && !this.testPurchase(s))
        return !1;
      if (!this.isForSale(s.char.loc))
        return k(this.doNotClone && this.isAtLoc(s.char.name) ? a.cannot_purchase_again : a.cannot_purchase_here, s);
      const r = this.getBuyingPrice(s.char);
      return s.money = r, s.char.money < r ? k(a.cannot_afford, s) : this.purchaseScript(s, s.char, r);
    },
    purchaseScript: function(s, r, o) {
      if (r.money -= o, x(this.msgPurchase, s), this.doNotClone)
        this.loc = r.name, delete this.salesLoc, this.afterPurchase && this.afterPurchase(s);
      else {
        const c = as(this, r.name);
        c.loc = r.name, delete c.salesLocs, c.afterPurchase && c.afterPurchase(s);
      }
      return h.SUCCESS;
    },
    sell: function(s) {
      if (this.testSell && !this.testSell(s))
        return !1;
      if (!this.canBeSoldHere(s.char.loc))
        return k(a.cannot_sell_here, s);
      const r = this.getSellingPrice(s.char);
      return s.money = r, s.char.money += r, x(this.msgSell, s), this.doNotClone ? (this.salesLoc = s.char.loc, delete this.loc) : delete m[this.name], this.afterSell && this.afterSell(s), h.SUCCESS;
    }
  };
  return Array.isArray(e) ? n.salesLocs = e : (n.doNotClone = !0, n.salesLoc = e), n;
}, Bo = function(t) {
  const e = Object.assign({}, pe);
  return e.countable = !0, e.countableLocs = t || {}, e.multiLoc = !0, e.defaultToAll = !0, e.isUltimatelyHeldBy = function(n) {
    const s = [];
    for (const r in this.countableLocs)
      this.countableLocs[r] && s.push(r);
    return T.multiIsUltimatelyHeldBy(n, s);
  }, e.extractNumber = function() {
    const n = /^(\d+)/.exec(this.cmdMatch);
    return n ? parseInt(n[1]) : !1;
  }, e.beforeSaveForTemplate = function() {
    const n = [];
    for (let s in this.countableLocs)
      n.push(s + "=" + this.countableLocs[s]);
    this.customSaveCountableLocs = n.join(","), this.beforeSave();
  }, e.afterLoadForTemplate = function() {
    const n = this.customSaveCountableLocs.split(",");
    this.countableLocs = {};
    for (let s of n) {
      const r = s.split("=");
      this.countableLocs[r[0]] = parseInt(r[1]);
    }
    this.customSaveCountableLocs = !1, this.afterLoad();
  }, e.getListAlias = function(n) {
    return B(this.pluralAlias) + " (" + this.countAtLoc(n) + ")";
  }, e.isLocatedAt = function(n, s) {
    return this.countableLocs[n] ? this.countableLocs[n] > 0 || this.countableLocs[n] === "infinity" : !1;
  }, e.countAtLoc = function(n) {
    return typeof n != "string" && (n = n.name), this.countableLocs[n] ? this.countableLocs[n] : 0;
  }, e.moveToFrom = function(n, s, r) {
    T.setToFrom(n, s, r);
    let o = n.count ? n.count : this.extractNumber();
    o || (o = n.fromLoc === g().name ? 1 : this.countAtLoc(n.fromLoc)), o === "infinity" && (o = 1), this.takeFrom(n.fromLoc, o), this.giveTo(n.toLoc, o);
  }, e.takeFrom = function(n, s) {
    this.countableLocs[n] !== "infinity" && (this.countableLocs[n] -= s), this.countableLocs[n] <= 0 && (this.countableLocs[n] = !1), m[n].afterDropIn(g(), { item: this, count: s });
  }, e.giveTo = function(n, s) {
    this.countableLocs[n] || (this.countableLocs[n] = 0), this.countableLocs[n] !== "infinity" && (this.countableLocs[n] += s), m[n].afterDropIn(g(), { item: this, count: s });
  }, e.findSource = function(n, s) {
    if (this.isAtLoc(n))
      return n;
    if (s) {
      const r = Ct().filter((o) => o.container);
      for (let o of r)
        if (!o.closed && this.isAtLoc(o.name))
          return o.name;
    }
    return !1;
  }, e.getTakeDropCount = function(n, s) {
    n.excess = !1;
    let r = this.extractNumber(), o = this.countAtLoc(s);
    r || (o === "infinity" ? r = 1 : this.defaultToAll ? r = o : r = 1), r > o && (r = o, n.excess = !0), n.count = r;
  }, e.take = function(n) {
    const s = this.findSource(n.char.loc, !0);
    return s ? (this.getTakeDropCount(n, s), this.testTake && !this.testTake(n) || m[s].testTakeOut && !m[s].testTakeOut(n) ? !1 : (x(this.msgTake, n), this.takeFrom(s, n.count), this.giveTo(n.char.name, n.count), this.scenery && (this.scenery = !1), !0)) : L(a.none_here, n);
  }, e.drop = function(n) {
    if (this.countAtLoc(n.char.name) === 0)
      return L(a.none_held, n);
    const s = m[n.char.loc];
    return n.destination = s, this.getTakeDropCount(n, n.char.name), this.testDrop && !this.testDrop(n) || s.testDropIn && !s.testDropIn(n) ? !1 : (x(this.msgDrop, n), this.takeFrom(n.char.name, n.count), this.giveTo(n.char.loc, n.count), !0);
  }, e.afterCreation = function(n) {
    n.regex || (n.regex = new RegExp("^(\\d+ )?" + n.name + "s?$"));
  }, e;
}, qo = function(t, e) {
  const n = Object.assign({}, pe);
  return n.wearable = !0, n.armour = 0, n.wear_layer = t || !1, n.slots = e && t ? e : [], n.worn = !1, n.useDefaultsTo = function(s) {
    return s === g() ? "Wear" : "NpcWear";
  }, n.getSlots = function() {
    return this.slots;
  }, n.getWorn = function() {
    return this.worn;
  }, n.getArmour = function() {
    return this.armour;
  }, n.msgWear = a.wear_successful, n.msgRemove = a.remove_successful, n.afterCreation = function(s) {
    s.verbFunctions.push(function(r, o) {
      r.isAtLoc(g().name) ? r.getWorn() ? r.getWearRemoveBlocker(g(), !1) || o.push(a.verbs.remove) : (o.push(a.verbs.drop), r.getWearRemoveBlocker(g(), !0) || o.push(a.verbs.wear)) : o.push(a.verbs.take);
    }), s.nameModifierFunctions.push(function(r, o) {
      r.worn && r.isAtLoc(g().name) && o.push(a.invModifiers.worn);
    });
  }, n.icon = () => "garment12", n.getWearRemoveBlocker = function(s, r) {
    if (!this.wear_layer)
      return !1;
    const o = this.getSlots();
    for (let c of o) {
      let d = s.getOuterWearable(c);
      if (d && d !== this && (d.wear_layer >= this.wear_layer || d.wear_layer === 0))
        return d;
    }
    return !1;
  }, n.testWear = function() {
    return !0;
  }, n.testRemove = function() {
    return !0;
  }, n._canWearRemove = function(s, r) {
    if (s) {
      if (!this.testWear(r))
        return !1;
    } else if (!this.testRemove(r))
      return !1;
    const o = this.getWearRemoveBlocker(r.char, s);
    return o ? (r.outer = o, L(s ? a.cannot_wear_over : a.cannot_remove_under, r)) : !0;
  }, n.wear = function(s) {
    return !this._canWearRemove(!0, s) || !s.char.testManipulate(this, "wear") ? !1 : (x(this.msgWear, s), this.worn = !0, this.afterWear && this.afterWear(s), !0);
  }, n.remove = function(s) {
    return !this._canWearRemove(!1, s) || !s.char.testManipulate(this, "remove") ? !1 : (x(this.msgRemove, s), this.worn = !1, this.afterRemove && this.afterRemove(s), !0);
  }, n;
}, ss = {
  msgClose: a.close_successful,
  msgOpen: a.open_successful,
  msgLock: a.lock_successful,
  msgUnlock: a.unlock_successful,
  msgCloseAndLock: a.close_and_lock_successful,
  openMsg: function(t) {
    x(this.msgOpen, t);
  },
  open: function(t) {
    if (t.container = this, this.openable)
      if (this.closed) {
        if (this.testOpen && !this.testOpen(t))
          return !1;
      } else
        return x(a.already, { item: this }), !1;
    else
      return x(a.cannot_open, { item: this }), !1;
    return this.locked ? this.testKeys(t.char) ? (this.locked = !1, this.closed = !1, x(this.msgUnlock, t), this.openMsg(t), !0) : (x(a.locked, t), !1) : (this.closed = !1, this.openMsg(t), this.afterOpen && this.afterOpen(t), !0);
  },
  close: function(t) {
    if (t.container = this, this.openable) {
      if (this.closed)
        return x(a.already, { item: this }), !1;
      if (this.testClose && !this.testClose(t))
        return !1;
    } else
      return x(a.cannot_close, { item: this }), !1;
    return this.closed = !0, x(this.msgClose, t), this.afterClose && this.afterClose(t), !0;
  }
}, Go = function(t) {
  const e = Object.assign({}, ss);
  return e.container = !0, e.closed = t, e.openable = t, e.contentsType = "container", e.getContents = T.getContents, e.testForRecursion = T.testForRecursion, e.listContents = T.listContents, e.transparent = !1, e.afterCreation = function(n) {
    n.verbFunctions.push(function(s, r) {
      s.openable && r.push(s.closed ? a.verbs.open : a.verbs.close);
    }), n.nameModifierFunctions.push(T.nameModifierFunctionForContainer);
  }, e.lookinside = function(n) {
    return n.container = this, this.closed && !this.transparent ? (x(a.not_open, n), !1) : (n.list = this.listContents(h.LOOK, !0), x(a.look_inside, n), !0);
  }, e.openMsg = function(n) {
    n.list = this.listContents(h.LOOK), x(this.msgOpen + " " + (n.list === a.list_nothing ? a.it_is_empty : a.look_inside_it), n);
  }, e.icon = function() {
    return this.closed ? "closed12" : "opened12";
  }, e.canReachThroughThis = function() {
    return !this.closed;
  }, e.canSeeThroughThis = function() {
    return !this.closed || this.transparent;
  }, e;
}, Vo = function() {
  const t = {};
  return t.container = !0, t.getContents = T.getContents, t.testForRecursion = T.testForRecursion, t.listContents = T.listContents, t.afterCreation = function(e) {
    e.nameModifierFunctions.push(T.nameModifierFunctionForContainer);
  }, t.closed = !1, t.openable = !1, t.contentsType = "surface", t.canReachThroughThis = () => !0, t.canSeeThroughThis = () => !0, t;
}, Ii = function(t) {
  const e = Object.assign({}, ss);
  return e.closed = !t, e.openable = !0, e.afterCreation = function(n) {
    n.verbFunctions.push(function(s, r) {
      r.push(s.closed ? a.verbs.open : a.verbs.close);
    }), n.nameModifierFunctions.push(function(s, r) {
      s.closed || r.push(a.invModifiers.open);
    });
  }, e;
}, Li = function(t) {
  return typeof t == "string" && (t = [t]), t === void 0 && (t = []), {
    keyNames: t,
    locked: !0,
    lockwith: function(e) {
      this.lock(e);
    },
    unlockwith: function(e) {
      this.unlock(e);
    },
    lock: function(e) {
      return e.container = this, this.locked ? L(a.already, e) : this.testKeys(e.char, !0) ? (this.closed ? (this.locked = !0, x(this.msgLock, e)) : (this.closed = !0, this.locked = !0, x(this.msgCloseAndLock, e)), this.afterLock && this.afterLock(e), !0) : L(a.no_key, e);
    },
    unlock: function(e) {
      if (e.container = this, !this.locked)
        return L(a.already, { item: this });
      if (e.secondItem) {
        if (!this.keyNames.includes(e.secondItem.name))
          return L(a.cannot_unlock_with, e);
      } else if (!this.testKeys(e.char, !1))
        return L(a.no_key, e);
      return x(this.msgUnlock, e), this.locked = !1, this.afterUnlock && this.afterUnlock(e), !0;
    },
    testKeys: function(e, n) {
      for (let s of this.keyNames) {
        if (!m[s])
          return _("The key name for this container, `" + s + "`, does not match any key in the game.");
        if (m[s].isAtLoc(e.name))
          return !0;
      }
      return !1;
    }
  };
}, zo = function(t, e, n, s, r) {
  const o = Object.assign({}, Ii(!1), Li(t));
  return o.loc1 = e, o.loc2 = n, o.name1 = s, o.name2 = r, o.scenery = !0, o.afterCreation = function(c) {
    const d = m[c.loc1];
    if (!d)
      return _("Bad location name '" + c.loc1 + "' for door " + c.name);
    const p = d.findExit(c.loc2);
    if (!p)
      return _("No exit to '" + c.loc2 + "' for door " + c.name);
    if (c.dir1 = p.dir, !d[c.dir1])
      return _("Bad exit '" + c.dir1 + "' in location '" + d.name + "' for door: " + c.name + " (possibly because the room is defined after the door?)");
    const v = m[c.loc2];
    if (!v)
      return _("Bad location name '" + c.loc2 + "' for door " + c.name);
    const N = v.findExit(c.loc1);
    if (!N)
      return _("No exit to '" + c.loc1 + "' for door " + c.name);
    if (c.dir2 = N.dir, !v[c.dir2])
      return _("Bad exit '" + c.dir2 + "' in location '" + v.name + "' for door: " + c.name + " (possibly because the room is defined after the door?)");
    d[c.dir1].use = T.useWithDoor, d[c.dir1].door = c.name, d[c.dir1].doorName = c.name1 || "door to " + a.getName(m[c.loc2], { article: 2 }), v[c.dir2].use = T.useWithDoor, v[c.dir2].door = c.name, v[c.dir2].doorName = c.name2 || "door to " + a.getName(m[c.loc1], { article: 2 });
  }, o.isLocatedAt = function(c) {
    return c === this.loc1 || c === this.loc2;
  }, o.icon = () => "door12", o;
}, Qo = function() {
  const t = Object.assign({}, pe);
  return t.key = !0, t.icon = () => "key12", t;
}, Ko = function(t) {
  const e = {};
  return e.readable = !0, e.mustBeHeld = t, e.icon = () => "readable12", e.afterCreation = function(n) {
    n.verbFunctions.push(function(s, r) {
      (s.loc === g().name || !s.mustBeHeld) && r.push(a.verbs.read);
    });
  }, e;
}, Yo = function() {
  return {
    scenery: !0,
    parserPriority: -15,
    isLocatedAt: function(t, e) {
      if (!m[t].room)
        return !1;
      const n = m[t].locationType || m[t]._region;
      return !n || m[t + "_" + this.name] ? !1 : !!re[n][this.name];
    },
    examine_for_backscene: function() {
      if (!E())
        return;
      E().locationType || E()._region;
      const t = E()["addendum_examine_" + this.name] ? " " + E()["addendum_examine_" + this.name] : "";
      typeof E()["examine_" + this.name] == "function" ? E()["examine_" + this.name](t) : typeof E()["examine_" + this.name] == "string" ? x(E()["examine_" + this.name] + t) : E()._region && re[E()._region][this.name] ? x(re[E()._region][this.name] + t) : this.defaultExamine ? x(this.defaultExamine + t) : x(a.default_scenery);
    },
    afterCreation: function(t) {
      t.defaultExamine = t.examine, t.examine = t.examine_for_backscene;
    }
  };
}, Jo = function(t) {
  if (t === void 0)
    return _("No options for FURNITURE template. Look in the stack traces below for a reference to a file you are using to create objects, and see what the line number is.");
  const e = {
    testPostureOn: () => !0,
    getoff: function(n) {
      if (!n.char.posture)
        return n.char.msg(a.already, n), !1;
      if (n.char.posture)
        return n.char.msg(a.stop_posture(n.char)), !0;
    }
  };
  return e.useDefaultsTo = function(n) {
    const s = this.useCmd ? this.useCmd : this.reclineon ? "ReclineOn" : this.siton ? "SitOn" : "StandOn";
    return n === g() ? s : "Npc" + s;
  }, e.afterCreation = function(n) {
    n.verbFunctions.push(function(s, r) {
      if (g().posture && g().postureFurniture === s.name) {
        r.push(a.verbs.getOff);
        return;
      }
      g().posture && g().posture !== "standing" || (s.siton && r.push(a.verbs.sitOn), s.standon && r.push(a.verbs.standOn), s.reclineon && r.push(a.verbs.reclineOn));
    });
  }, e.assumePosture = function(n, s, r, o) {
    n.posture = s;
    const c = n.char;
    return c.posture === s && c.postureFurniture === this.name ? (c.msg(a.already, { item: c }), !1) : this.testPostureOn({ char: c, posture: s }) ? (c.posture && c.postureFurniture !== this.name ? (c.msg(a.stop_posture(c)), c.msg(a[r + "_on_successful"], n)) : c.posture && this[c.posture + "_to_" + s] && this.postureChangesImplemented ? c.msg(this[c.posture + "_to_" + s], n) : c.msg(a[r + "_on_successful"], n), c.posture = s, c.postureFurniture = this.name, c.postureAdverb = o === void 0 ? "on" : o, this.afterPostureOn && this.afterPostureOn(n), !0) : !1;
  }, t.sit && (e.siton = function(n) {
    return this.assumePosture(n, "sitting", "sit");
  }), t.stand && (e.standon = function(n) {
    return this.assumePosture(n, "standing", "stand");
  }), t.recline && (e.reclineon = function(n) {
    return this.assumePosture(n, "reclining", "recline");
  }), t.useCmd && (e.useCmd = t.useCmd), e.icon = () => "furniture12", e;
}, Xo = function(t, e) {
  const n = {};
  return n.switchedon = t, n.nameModifier = e, n.msgSwitchOff = a.switch_off_successful, n.msgSwitchOn = a.switch_on_successful, n.afterCreation = function(s) {
    s.verbFunctions.push(function(r, o) {
      (!r.mustBeHeldToOperate || r.isAtLoc(g())) && o.push(r.switchedon ? a.verbs.switchoff : a.verbs.switchon);
    }), s.nameModifierFunctions.push(function(r, o) {
      r.nameModifier && r.switchedon && o.push(r.nameModifier);
    });
  }, n.switchon = function(s) {
    return this.switchedon ? (s.char.msg(a.already, { item: this }), !1) : !this.testSwitchOn(s) || !s.char.getAgreement("SwitchOn", { item: this, switchOn: !0 }) ? !1 : (this.suppressMsgs || s.char.msg(this.msgSwitchOn, s), this.doSwitchon(s), !0);
  }, n.doSwitchon = function(s) {
    let r = O.dark;
    this.switchedon = !0, h.update(), r !== O.dark && E().description(), this.afterSwitchOn && this.afterSwitchOn(s);
  }, n.testSwitchOn = () => !0, n.testSwitchOff = () => !0, n.switchoff = function(s) {
    return this.switchedon ? !this.testSwitchOff(s) || !s.char.getAgreement("SwitchOn", { item: this }) ? !1 : (this.suppressMsgs || s.char.msg(this.msgSwitchOff, s), this.doSwitchoff(s), !0) : (s.char.msg(a.already, { item: this }), !1);
  }, n.doSwitchoff = function(s) {
    let r = O.dark;
    this.switchedon = !1, h.update(), r !== O.dark && E().description(), this.afterSwitchOff && this.afterSwitchOff(s);
  }, n.icon = function() {
    return this.switchedon ? "turnedon12" : "turnedoff12";
  }, n;
}, Zo = function(t) {
  const e = {
    scenery: !0,
    component: !0,
    loc: t,
    takeable: !0,
    // Set this as it has its own take attribute
    isLocatedAt: function(n, s) {
      return s !== h.PARSER && s !== h.ALL ? !1 : m[this.loc].isAtLoc(n);
    },
    take: function(n) {
      return n.whole = m[this.loc], x(a.cannot_take_component, n), !1;
    }
  };
  return m[t] || W("Whole is not define: " + t), m[t].componentHolder = !0, e;
}, ea = function(t) {
  const e = Object.assign({}, pe);
  return e.isLiquid = t, e.msgIngest = t ? a.drink_successful : a.eat_successful, e.eat = function(n) {
    return this.isLiquid ? (x(a.cannot_eat, n), !1) : (x(this.msgIngest, n), this.loc = null, this.afterIngest && this.afterIngest(n), !0);
  }, e.drink = function(n) {
    return this.isLiquid ? (x(this.msgIngest, n), this.loc = null, this.afterIngest && this.afterIngest(n), !0) : (x(a.cannot_drink, n), !1);
  }, e.ingest = function(n) {
    return this.isLiquid ? this.drink(n) : this.eat(n);
  }, e.icon = () => "edible12", e.afterCreation = function(n) {
    n.verbFunctions.push(function(s, r) {
      r.push(s.isAtLoc(g().name) ? a.verbs.drop : a.verbs.take), s.isAtLoc(g()) && r.push(s.isLiquid ? a.verbs.drink : a.verbs.eat);
    });
  }, e;
}, ta = function() {
  const t = {};
  return t.vessel = !0, t.afterCreation = function(e) {
    e.volumeContained && Ni.push("full of " + e.containedFluidName);
  }, t.findSource = function(e) {
    return T.findSource(e);
  }, t.fill = function(e) {
    return this.findSource(e) ? this.doFill(e) : L(a.no_generic_fluid_here, { item: this });
  }, t.doFill = function(e) {
    return e.item = this, this.testFill && !this.testFill(e) ? !1 : this.containedFluidName ? L(a.already_full, e) : (this.containedFluidName = e.fluid, e.source.vessel && delete e.source.containedFluidName, x(a.fill_successful, e), this.afterFill && this.afterFill(e), !0);
  }, t.empty = function(e) {
    return delete e.item, this.doEmpty(e);
  }, t.doEmpty = function(e) {
    if (e.source = this, e.fluid = this.containedFluidName, !this.containedFluidName)
      return L(a.already_empty, e);
    if (this.testEmpty && !this.testEmpty(e))
      return !1;
    if (!e.item)
      x(a.empty_successful, e), delete this.containedFluidName;
    else {
      if (e.item === e.source)
        return L(a.pour_into_self, e);
      if (e.item.vessel) {
        if (e.item.containedFluidName)
          return L(a.already_full, { char: e.char, item: e.sink, fluid: e.item.containedFluidName });
        x(a.empty_into_successful, e), e.item.containedFluidName = this.containedFluidName, delete this.containedFluidName;
      } else if (e.item.sink) {
        if (!e.item.sink(this.containedFluidName, e.char, this))
          return !1;
      } else
        x(a.empty_onto_successful, e), delete this.containedFluidName;
    }
    return this.afterEmpty && this.afterEmpty(e.char, { fluid: this.containedFluidName, sink: e.item }), delete this.containedFluidName, !0;
  }, t.handleInOutContainer = function(e, n) {
    let s = !1;
    for (const r of n) {
      if (!e.char.testManipulate(r, e.verb))
        return h.FAILED;
      e.count = r.countable ? r.extractNumber() : void 0, e.item = r, e.count && (e[r.name + "_count"] = e.count), this.container ? s = s || func(char, container, r, e) : x(a.not_container_not_vessel, e);
    }
    return s && e.char.pause(), s ? h.SUCCESS : h.FAILED;
  }, t.afterCreation = function(e) {
    e.verbFunctions.push(function(n, s) {
      n.isAtLoc(g().name) && s.push(n.containedFluidName ? a.verbs.empty : a.verbs.fill);
    });
  }, t;
}, na = function(t) {
  const e = {};
  return e.construction = !0, e.componentNames = t || [], e.destroyComponentsOnBuild = !0, e.msgConstruction = a.construction_done, e.testComponents = function(n, s) {
    for (const r of n)
      if (!e.componentNames.includes(r.name))
        return s.wrong = r, L(a.component_wrong, s);
    return !0;
  }, e.buildPrecheck = function(n) {
    if (this.loc)
      return L(a.construction_already, n);
    for (const s of n.components)
      if (s.loc !== g().name)
        return n.missing = s, L(a.component_missing, n);
    return !0;
  }, e.build = function(n) {
    const s = this.componentNames.map((r) => m[r]);
    if (n.components = s, !this.buildPrecheck(n) || this.testConstruction && !this.testConstruction(n))
      return !1;
    if (this.destroyComponentsOnBuild)
      for (const r of s)
        delete r.loc;
    return this.loc = this.buildAtLocation ? g().loc : g().name, n.list = K(s, { article: 2, lastSep: "and" }), x(this.msgConstruction, n), this.afterConstruction && this.afterConstruction(n), !0;
  }, e;
}, sa = function(t, e) {
  const n = Object.assign({
    rope: !0,
    ropeLength: t,
    tethered: e !== void 0,
    tiedTo1: e,
    locs: e ? [m[m[e].loc]] : [],
    attachVerb: a.rope_attach_verb,
    attachedVerb: a.rope_attached_verb,
    detachVerb: a.rope_detach_verb,
    msgDetach: a.rope_detach_success,
    msgAttach: a.rope_attach_success,
    msgWind: a.rope_wind,
    msgUnwind: a.rope_unwind,
    isLocatedAt: function(s, r) {
      return this.loc && (this.locs = [this.loc], this.loc = !1), typeof s != "string" && (s = s.name), r === h.SIDE_PANE && this.locs.includes(g().name) && s !== g().name ? !1 : this.locs.includes(s);
    },
    isUltimatelyHeldBy: function(s) {
      return T.multiIsUltimatelyHeldBy(s, this.locs);
    },
    isAttachedTo: function(s) {
      return this.tiedTo1 === s.name || this.tiedTo2 === s.name;
    },
    getAttached: function() {
      let s = this.tiedTo1 ? [this.tiedTo1] : [];
      return this.tiedTo2 && s.push(this.tiedTo2), s;
    },
    examineAddendum: function() {
      const s = this.tiedTo1 && m[this.tiedTo1].isHere() ? m[this.tiedTo1] : !1, r = this.tiedTo2 && m[this.tiedTo2].isHere() ? m[this.tiedTo2] : !1;
      if (this.locs.length === 1)
        return s && r ? Q(a.examineAddBothEnds, { item: this, obj1: s, obj2: r }) : s ? Q(a.rope_examine_attached_one_end, { item: this, obj1: s }) : r ? Q(a.rope_examine_attached_one_end, { item: this, obj1: r }) : "";
      const o = m[this.locs[0]], c = (o.npc || o.player) && o.isHere() ? o : !1, d = m[this.locs[this.locs.length - 1]], p = (d.npc || d.player) && d.isHere() ? d : !1, v = this.locs.findIndex((G) => G === g().loc), N = v > 0 && m[this.locs[v - 1]].room ? m[this.locs[v - 1]] : !1, F = v < this.locs.length - 1 && m[this.locs[v + 1]].room ? m[this.locs[v + 1]] : !1;
      let P = "", q = !1;
      return (s || c || N) && (P += " " + a.rope_one_end + " ", q = !0), s ? P += a.rope_examine_end_attached.replace("obj", "obj1") : c ? P += a.rope_examine_end_held.replace("holder", "holder1") : N && (P += a.rope_examine_end_headed.replace("loc", "loc1")), (r || p || F) && (P += " " + (q ? a.rope_other_end : a.rope_one_end) + " "), r ? P += a.rope_examine_end_attached.replace("obj", "obj2") : p ? P += a.rope_examine_end_held.replace("holder", "holder2") : F && (P += a.rope_examine_end_headed.replace("loc", "loc2")), Q(P, { item: this, obj1: s, obj2: r, holder1: c, holder2: p, loc1: N, loc2: F });
    },
    canAttachTo: function(s) {
      return s.attachable;
    },
    handleTieTo: function(s, r) {
      r === void 0 && (r = this.findAttachable(this));
      const o = { char: s, item: this, obj: r };
      return r === void 0 ? L(a.rope_no_attachable_here, o) : r.attachable ? this.tiedTo1 === r.name ? k(a.already, { item: this }) : this.tiedTo2 === r.name ? k(a.already, { item: this }) : this.tiedTo1 && this.tiedTo ? k(a.rope_tied_both_ends_already, { item: this, obj1: m[this.tiedTo1], obj2: m[this.tiedTo2] }) : r.testAttach && !r.testAttach(o) ? h.FAILED : (this.attachTo(s, r), this.suppessMsgs || x(this.msgAttach, o), h.SUCCESS) : k(a.rope_not_attachable_to, o);
    },
    handleUntieFrom: function(s, r) {
      const o = { char: s, item: this, obj: r };
      if (r === void 0) {
        if (!this.tiedTo1 && !this.tiedTo2)
          return k(a.rope_not_attached, o);
        if (this.tiedTo1 && !this.tiedTo2)
          r = m[this.tiedTo1];
        else if (!this.tiedTo1 && this.tiedTo2)
          r = m[this.tiedTo2];
        else if (m[this.tiedTo1].isHere() && !m[this.tiedTo2].isHere())
          r = m[this.tiedTo1];
        else if (!m[this.tiedTo1].isHere() && m[this.tiedTo2].isHere())
          r = m[this.tiedTo2];
        else
          return k(a.rope_detach_end_ambig, o);
        o.obj = r;
      } else if (this.tiedTo1 !== r.name && this.tiedTo2 !== r.name)
        return k(a.rope_not_attached_to, o);
      return r === this.tiedTo1 && this.tethered ? k(a.rope_tethered, o) : (this.detachFrom(s, r), this.suppessMsgs || x(this.msgDetach, o), h.SUCCESS);
    },
    useWith: function(s, r) {
      return this.handleTieTo(s, r) === h.SUCCESS;
    },
    attachTo: function(s, r) {
      const o = r.loc;
      this.tiedTo1 ? (this.locs.length > 1 && this.locs.pop(), this.locs[this.locs.length - 1] !== o && this.locs.push(o), this.tiedTo2 = r.name) : (this.locs.length > 1 && this.locs.shift(), this.locs[0] !== o && this.locs.unshift(o), this.tiedTo1 = r.name), this.afterAttach && this.afterAttach(s, { item: r });
    },
    detachFrom: function(s, r) {
      this.tiedTo1 === r.name ? (this.locs.length === 2 && this.locs.includes(s.name) && this.locs.shift(), this.locs[0] !== s.name && this.locs.unshift(s.name), this.tiedTo1 = !1) : (this.locs.length === 2 && this.locs.includes(s.name) && this.locs.pop(), this.locs[this.locs.length - 1] !== s.name && this.locs.push(s.name), this.tiedTo2 = !1), this.afterDetach && this.afterDetach(s, { item: r });
    },
    findAttachable: function() {
      const s = Ct();
      for (let r of s)
        if (r.attachable)
          return r;
    }
  }, pe);
  return n.moveToFrom = function() {
    _('You cannot use "moveToFrom" with a ROPE object, due to the complicated nature of these things. You should either prevent the user trying to do this, or look to implement some custom code as the ROPE template does for DROP and TAKE. Sorry I cannot be any more help than that!');
  }, n.drop = function(s) {
    const r = s.char;
    if (!this.isAtLoc(r.name))
      return L(a.not_carrying, s);
    let o;
    return this.locs.length === 1 ? (this.locs = [r.loc], o = 0) : this.locs[0] === r.name ? (this.locs.shift(), o = 1) : this.locs[this.locs.length - 1] === r.name && (this.locs.pop(), o = 2), s.end = o, s.toLoc = r.loc, s.fromLoc = r.name, x(this.msgDrop, s), m[r.loc].afterDropIn && m[r.loc].afterDropIn(s), m[r.name].afterTakeFrom && m[r.name].afterTakeFrom(s), this.afterMove !== void 0 && this.afterMove(s), !0;
  }, n.take = function(s) {
    const r = s.char;
    if (this.isAtLoc(r.name) && !this.isAtLoc(s.char.loc))
      return L(a.already_have, s);
    if (!r.testManipulate(this, "take"))
      return !1;
    if (this.tiedTo1 && this.tiedTo2)
      return L(a.rope_tied_both_end, s);
    let o;
    if (this.locs.length === 1 && !this.tiedTo1 && !this.tiedTo2)
      this.locs = [r.name], o = 0;
    else if (this.locs[0] === r.loc && !this.tiedTo1)
      this.locs.unshift(r.name), o = 1;
    else if (this.locs[this.locs.length - 1] === r.loc && !this.tiedTo2)
      this.locs.push(r.name), o = 2;
    else
      return this.locs[0] === r.loc || this.locs[this.locs.length - 1] === r.loc ? L(a.rope_tied_one_end, s) : L(a.rope_no_end, s);
    return s.end = o, s.toLoc = r.name, s.fromLoc = r.loc, x(this.msgTake, s), m[r.loc].afterTakeOut && m[r.loc].afterTakeOut(s), m[r.name].afterDropIn && m[r.name].afterDropIn(s), this.afterMove !== void 0 && this.afterMove(s), this.afterTake !== void 0 && this.afterTake(s), this.scenery && (this.scenery = !1), !0;
  }, n.testCarry = function(s) {
    if (this.ropeLength === void 0 || this.locs.length < 3 || !this.locs.includes(s.char.name))
      return !0;
    if (this.locs[0] === s.char.name) {
      if (this.locs[2] === s.exit.name)
        return !0;
    } else if (this.locs[this.locs.length - 3] === s.exit.name)
      return !0;
    return this.locs.length <= this.ropeLength ? !0 : (x(a.rope_cannot_move, s), !1);
  }, n.afterCarry = function(s) {
    const r = s.char;
    this.locs.length !== 1 && this.locs.includes(r.name) && (this.locs[0] === r.name ? (this.locs.shift(), this.locs[1] === r.loc ? (this.locs.shift(), r.msg(this.msgWind, { char: r, item: this })) : (this.locs.unshift(r.loc), r.msg(this.msgUnwind, { char: r, item: this })), this.locs.unshift(r.name)) : (this.locs.pop(), this.locs[this.locs.length - 2] === r.loc ? (this.locs.pop(), r.msg(this.msgWind, { char: r, item: this })) : (this.locs.push(r.loc), r.msg(this.msgUnwind, { char: r, item: this })), this.locs.push(r.name)));
  }, n;
}, rs = {
  button: !0,
  msgPress: a.press_button_successful,
  afterCreation: function(t) {
    t.verbFunctions.push(function(e, n) {
      n.push(a.verbs.push);
    });
  }
}, ra = function() {
  const t = Object.assign({}, rs);
  return t.push = function(e) {
    x(this.msgPress, e), this.afterPress && this.afterPress(e);
  }, t;
}, ia = function(t, e) {
  const n = Object.assign({}, rs);
  return n.loc = t, n.transitDest = e, n.transitButton = !0, n.transitAlreadyHere = a.transit_already_here, n.transitGoToDest = a.transit_go_to_dest, n.push = function(s) {
    const r = m[this.loc], o = r[r.transitDoorDir];
    return this.testTransitButton && !this.testTransitButton(s.char, { multiple: s.multiple, transit: r }) || r.testTransit && !r.testTransit(s.char, { multiple: s.multiple, button: this }) ? !1 : this.locked ? L(this.transitLocked) : o.name === this.transitDest ? L(this.transitAlreadyHere) : (r.transitAutoMove ? g().moveChar(r[r.transitDoorDir]) : (me(g(), this, "transitGoToDest"), r.transitUpdate(this, !0)), !0);
  }, n;
}, oa = function(t) {
  return { roomSet: t };
}, aa = function() {
  const t = {};
  return t.exit_attributes = ["msg", "npcLeaveMsg", "npcEnterMsg"], t.getExit = function(e) {
    if (this["exit_" + e] === void 0)
      return;
    const n = { origin: this, dir: e };
    this["exit_func_" + e] && (n.simpleUse = this[this["exit_func_" + e]]);
    for (const s of this.exit_attributes)
      this["exit_" + s + "_" + e] && (n[s] = this["exit_" + s + "_" + e]);
    return new ne(this["exit_" + e], n);
  }, t.hasExit = function(e, n) {
    return n === void 0 && (n = {}), !this["exit_" + e] || n.excludeLocked && this.isExitLocked(e) || n.excludeScenery && this["exit_scenery_" + e] || O.dark && !this["exit_illuminated_" + e] ? !1 : !this.isExitHidden(e);
  }, t;
}, ca = function(t) {
  return {
    saveExitDests: !0,
    transitDoorDir: t,
    mapMoveableLoc: !0,
    mapRedrawEveryTurn: !0,
    beforeEnter: function() {
      const e = this.findTransitButton(g().previousLoc);
      e && this.transitUpdate(e);
    },
    getTransitButtons: function(e, n) {
      return this.getContents(h.LOOK).filter(function(s) {
        return !s.transitButton || !e && s.hidden ? !1 : !(!n && s.locked);
      });
    },
    findTransitButton: function(e) {
      for (let n in m)
        if (m[n].loc === this.name && m[n].transitDest === e)
          return m[n];
      return null;
    },
    setTransitDest: function(e) {
      if (typeof e == "string" && (e = this.findTransitButton(e)), !e)
        return _("Trying to set a transit to an unfathomable destination.");
      this[this.transitDoorDir].name = e.transitDest, this.currentButtonName = e.name, this.transitCurrentLocation = e.transitDest;
    },
    getTransitDestLocation: function() {
      return m[this[this.transitDoorDir].name];
    },
    getTransitDestButton: function() {
      return m[this.currentButtonName];
    },
    transitUpdate: function(e, n) {
      if (!this[this.transitDoorDir])
        return _('The transit "' + this.name + '" is set to use "' + this.transitDoorDir + '" as the exit, but has no such exit.');
      const s = this[this.transitDoorDir].name;
      this.setTransitDest(e), typeof map < "u" && map.transitUpdate && map.transitUpdate(this, e, n), n && this.afterTransitMove && this.afterTransitMove(e.transitDest, s);
    },
    // The exit is not saved, so after a load, need to update the exit
    afterLoadForTemplate: function() {
      this.currentButtonName && this.setTransitDest(m[this.currentButtonName]), this.afterLoad && this.afterLoad();
    },
    isTransitHere: function(e = g()) {
      return log(this[this.transitDoorDir].name), log(e.loc), this[this.transitDoorDir].name === e.loc;
    },
    transitOfferMenu: function() {
      if (this.testTransit && !this.testTransit(g()))
        return this.transitAutoMove && g().moveChar(this[this.transitDoorDir]), !1;
      const e = this.getTransitButtons(!0, !1);
      this.transitDoorDir, kt(this.transitMenuPrompt, e.map((n) => n.transitDestAlias), function(n) {
        for (let s of e)
          e[i].transitDestAlias === n && e[i].push(!1, g());
      });
    }
  };
}, is = function() {
  return {
    // The following are used also both player and NPCs, so we can use the same functions for both
    canReachThroughThis: () => !0,
    canSeeThroughThis: () => !0,
    getContents: T.getContents,
    pause: Z,
    testManipulate: () => !0,
    testMove: () => !0,
    testPosture: () => !0,
    testTakeDrop: () => !0,
    mentionedTopics: [],
    testTalkFlag: !0,
    testTalk: function() {
      return this.testTalkFlag;
    },
    afterCarryList: [],
    followers: [],
    money: 0,
    getAgreement: function(t, e) {
      return this["getAgreement" + t] ? this["getAgreement" + t](e) : this.getAgreementDefault ? this.getAgreementDefault() : !0;
    },
    getHolding: function() {
      return this.getContents(h.LOOK).filter(function(t) {
        return !t.getWorn();
      });
    },
    getWearing: function() {
      return this.getContents(h.LOOK).filter(function(t) {
        return t.getWorn() && !t.ensemble;
      });
    },
    getCarrying: function() {
      const t = [];
      for (const e in m)
        m[e].isUltimatelyHeldBy && m[e].isUltimatelyHeldBy(this) && t.push(m[e]);
      return t;
    },
    getStatusDesc: function() {
      return this.posture ? this.posture + " " + this.postureAdverb + " " + a.getName(m[this.postureFurniture], { article: 2 }) : !1;
    },
    handleGiveTo: function(t) {
      return t.item.isAtLoc(t.char.name) ? !t.char.getAgreement("Give", t) || !t.char.testManipulate(t.item, "give") ? !1 : (t.extraTest = function(e, n) {
        return n.item ? (typeof n.item == "string" ? m[n.item] : n.item) === e.item : !0;
      }, le(t, this.receiveItems)) : L(a.not_carrying, t);
    },
    getOuterWearable: function(t) {
      const e = this.getWearing().filter(function(s) {
        return typeof s.getSlots != "function" && (console.log("Item with worn set to true, but no getSlots function"), console.log(s)), s.getSlots().includes(t);
      });
      if (e.length === 0)
        return !1;
      let n = e[0];
      for (let s of e)
        s.wear_layer > n.wear_layer && (n = s);
      return n;
    },
    // Also used by NPCs, so has to allow for that
    msg: function(t, e) {
      x(t, e);
    },
    afterCreation: function(t) {
      t.nameModifierFunctions.push(function(e, n) {
        const s = e.getStatusDesc(), r = e.getHolding(), o = e.getWearingVisible(), c = [];
        s && c.push(s), r.length > 0 && c.push(a.invHoldingPrefix + " " + K(r, {
          article: 1,
          lastSep: a.list_and,
          modified: !1,
          nothing: a.list_nothing,
          loc: e.name,
          npc: !0
        })), o.length > 0 && c.push(a.invWearingPrefix + " " + K(o, {
          article: 1,
          lastSep: a.list_and,
          modified: !1,
          nothing: a.list_nothing,
          loc: e.name,
          npc: !0
        })), c.length > 0 && n.push(c.join("; "));
      }), t.verbFunctions.push(function(e, n) {
        n.shift(), n.push(a.verbs.lookat), l.noTalkTo || n.push(a.verbs.talkto);
      });
    },
    // Use this to move the character. Describing it should be done elsewhere
    moveChar: function(t) {
      if (!(t instanceof ne))
        return _("Using moveChar for " + this.name + " but no exit sent.");
      const e = T.getObj(t.name);
      this.previousLoc = this.loc, this.player ? (l.clearScreenOnRoomEnter && yn(), E().afterExit(t), this.loc = e.name, h.update(), h.enterRoom(t)) : (this.loc = e.name, this.handleMovingFollowers(t)), this.afterMove && this.afterMove(t);
      for (const n of this.getCarrying())
        n.afterCarry && n.afterCarry({ char: this, item: n, exit: t });
    },
    // Use when the NPC changes rooms; will give a message if the player can observe it
    movingMsg: function(t) {
      this.player ? t.msg ? me(this, t, "msg") : a.go_successful && x(a.go_successful, { char: this, dir: t.dir }) : t.msgNPC ? t.msgNPC(this) : (a.npc_leaving_msg(this, t), a.npc_entering_msg(this, t));
    },
    handleMovingFollowers: function(t) {
      for (let e of this.followers) {
        const n = m[e];
        n.loc !== this.loc && (!n.testFollowTo || n.testFollowTo(m[t.name])) && (this.player && n.movingMsg(t, !0), n.moveChar(t));
      }
    }
  };
}, la = function() {
  const t = is();
  return t.pronouns = a.pronouns.secondperson, t.player = !0, t.receiveItems = [
    {
      test: function() {
        return !0;
      },
      f: function(e) {
        return x(a.done_msg, e), T.giveItem(e), !0;
      }
    }
  ], t;
}, m = {};
function Mt() {
  const t = Array.prototype.slice.call(arguments), e = os(t, Ds, l.itemCreateFunc);
  return e.convTopics && (e.convTopics.forEach(function(n, s) {
    n.loc = e.name, Mt(n.name ? n.name : e.name + "_convTopic_" + s, Di(), n);
  }), delete e.convTopics), e;
}
function ua() {
  const t = Array.prototype.slice.call(arguments), e = os(t, Ps, l.roomCreateFunc);
  if (e._region = cs, e.scenery) {
    for (const n of e.scenery) {
      const s = typeof n == "string" ? { alias: n } : n, r = Array.isArray(s.alias) ? s.alias.shift() : s.alias, o = Array.isArray(s.alias) ? s.alias : [];
      if (!r)
        throw "ERROR: Scenery item is missing an alias in room: " + e.name;
      const c = Mt(e.name + "_scenery_" + r.replace(/\W/g, ""), {
        loc: e.name,
        alias: r,
        synonyms: o,
        scenery: !0,
        examine: s.examine ? s.examine : a.default_description
      });
      delete s.alias, delete s.examine;
      for (const d in s)
        c[d] = s[d];
    }
    delete e.scenery;
  }
  return e;
}
function os(t, e, n) {
  const s = t.shift();
  t.unshift(e);
  const r = Ai(s, t);
  return n && n(r), r;
}
function as(t, e, n) {
  if (t === void 0)
    return _("Item is not defined.");
  if (typeof t == "string") {
    const r = m[t];
    if (r === void 0)
      return _("No item called '" + t + "' found in cloneObject.");
    t = r;
  }
  n || (n = t.name);
  const s = {};
  for (let r in t)
    s[r] = t[r];
  return s.name = T.findUniqueName(n), s.clonePrototype || (s.clonePrototype = t), e !== void 0 && (s.loc = e), s.getSaveStringPreamble = function(r) {
    return "Clone:" + this.clonePrototype.name + "=";
  }, m[s.name] = s, s;
}
function fa(t, e, n) {
  if (h.isCreated)
    return _("Attempting to copy item after the game has started");
  if (t === void 0)
    return _("Item is not defined.");
  if (typeof t == "string") {
    const r = m[t];
    if (r === void 0)
      return _("No item called '" + t + "' found in copyObject.");
    t = r;
  }
  n || (n = t.name);
  const s = {
    ...t,
    verbFunctions: [h.defaultVerbFunction],
    initialiserFunctions: [...t.initialiserFunctions]
  };
  return s.name = T.findUniqueName(n), e !== void 0 && (s.loc = e), m[s.name] = s, s;
}
function Ai(t, e) {
  if (h.isCreated && !l.saveDisabled)
    return _("Attempting to use createObject with `" + t + "` after set up. To ensure games save properly you should use cloneObject to create ites during play.");
  if (/\W/.test(t))
    return _("Attempting to use the prohibited name `" + t + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.");
  if (m[t])
    return _("Attempting to use the name `" + t + "` when there is already an item with that name in the world.");
  if (typeof e.unshift != "function")
    return _("The list of hashes for `" + t + "` is not what I was expecting. Maybe you meant to use createItem or createRoom?");
  e.unshift(Fs);
  const n = { name: t };
  for (let s of e)
    for (let r in s)
      n[r] = s[r];
  n.setAlias(n.alias ? n.alias : n.name.replace(/_/g, " "), n), n.verbFunctions = [h.defaultVerbFunction], n.nameModifierFunctions = [], n.initialiserFunctions = [];
  for (let s of e)
    s.afterCreation && n.initialiserFunctions.push(s.afterCreation);
  return m[t] = n, n;
}
let cs;
m._player = null;
m._loc = null;
function g() {
  return m._player ? m._player : _("No player object found. This is probably due to an error in the data file where the player object is defined, but could be because you have not set one.");
}
function Tt(t) {
  m._player = t;
}
function E() {
  return m._loc ? m._loc : _("Something wrong - current location not found!");
}
const h = {
  //VISIBLE:1,
  //REACHABLE:2,
  // constants for lighting levels
  LIGHT_NONE: 0,
  LIGHT_SELF: 1,
  LIGHT_MEAGRE: 2,
  LIGHT_FULL: 3,
  LIGHT_EXTREME: 4,
  // constants for verbosity of room descriptions
  BRIEF: 1,
  TERSE: 2,
  VERBOSE: 3,
  // constants for isAtLoc situations
  LOOK: 1,
  PARSER: 2,
  INVENTORY: 3,
  SIDE_PANE: 4,
  PURCHASE: 5,
  ALL: 6,
  // constants for command responses
  // (but a verb will return true or false, so the command that uses it
  // can in turn return one of these - a verb is an attribute of an object)
  SUCCESS: 1,
  SUCCESS_NO_TURNSCRIPTS: 2,
  FAILED: -1,
  PARSER_FAILURE: -2,
  isCreated: !1,
  //------------------------------------------------------------
  // Initialisation
  init: function() {
    l.performanceLog("Start world.init");
    for (let t in m)
      m[t].player && Tt(m[t]);
    g();
    for (let t in m)
      h.initItem(m[t]);
    Rs(), l.verbosity = h.VERBOSE, O.ticker = setInterval(h.gameTimer, l.timerInterval), m[g().loc].visited++, h.update(), h.saveGameState(), l.performanceLog("End world.init"), h.isCreated = !0;
  },
  // Every item or room should have this called for them.
  // That will be done at the start, but you need to do it yourself
  // if creating items on the fly (but you should not be doing that anyway!).
  initItem: function(t) {
    if (t.clonePrototype)
      return _("Trying to initiaslise a cloned object. This is not permitted, as the prototype will not have been initialised before it was cloned. Instead, clone the object in settings.setup.");
    for (const e of [...new Set(t.initialiserFunctions)])
      e(t);
    delete t.initialiserFunctions, delete t.afterCreation;
    for (let e of a.exit_list) {
      const n = t[e.name];
      if (n) {
        if (n.origin = t, n.dir = e.name, n.alsoDir)
          for (let s of n.alsoDir)
            t[s] = new ne(n.name, n), t[s].scenery = !0, t[s].isAlsoDir = !0, t[s].dir = s, delete t[s].alsoDir;
        if (n instanceof Oi) {
          const s = n.reverse(), r = m[n.name];
          if (r[s]) {
            log("WARNING: The returning Exit for the Link on " + t.name + ' goes to a direction that already has something set (conflicts with "' + s + '" on ' + r.name + ").");
            continue;
          }
          r[s] = new ne(n.origin.name), r[s].origin = r, r[s].dir = s;
        }
      }
    }
    if (t.roomSet && (l.roomSetList[t.roomSet] || (l.roomSetList[t.roomSet] = []), l.roomSetList[t.roomSet].push({ name: t.name, visited: !1 })), l.playMode === "dev" && !l.disableChecks && !t.abstract) {
      t.loc && !m[t.loc] && V(t, "In an unknown location (" + t.loc + ")"), t.consultable && !l.noAskTell && ((!t.tellOptions || t.tellOptions.length === 0) && V(t, "No tellOptions for consultable/NPC"), (!t.askOptions || t.askOptions.length === 0) && V(t, "No askOptions for consultable/NPC"));
      const e = a.exit_list.filter((n) => n.type !== "nocmd").map((n) => n.name);
      for (let n in t)
        e.includes(n) ? (!t[n] instanceof ne && V(t, "Exit " + n + " is not an Exit instance."), t[n].name !== "_" && !m[t[n].name] && V(t, "Exit " + n + " goes to an unknown location (" + t[n].name + ").")) : t[n] instanceof ne && V(t, "Attribute " + n + " is an Exit instance and probably should not.");
      if (t.abstract, t.room)
        if (typeof t.desc == "function")
          try {
            R.testing = !0, R.testOutput = [];
            const n = t.desc();
            R.testing = !1, R.testOutput.length > 0 && V(t, "The 'desc' attribute for this location is a function that prints directy to screen; should return a string only: " + t.name), typeof n != "string" && V(t, "The 'desc' function attribute does not return a string");
          } catch (n) {
            V(t, "The 'desc' function caused an error"), log(n.message), log(n.stack);
          }
        else
          typeof t.desc != "string" && V(t, "The 'desc' attribute for this location is neither a string nor a function");
      else if (t.conversationTopic)
        !t.msg && !t.script && V(t, "Topic has neither 'script' or 'msg' attribute"), t.msg && typeof t.msg != "string" && V(t, "The 'msg' attribute for this topic is not a string"), t.script && typeof t.script != "function" && V(t, "The 'script' attribute for this topic is not a function");
      else if (typeof t.examine == "function")
        try {
          R.testing = !0, R.testOutput = [];
          const n = t.examine({ char: g(), item: t });
          R.testing = !1, n !== void 0 && V(t, "The 'examine' function attribute returns a value; it probably should not");
        } catch (n) {
          V(t, "The 'examine' function caused an error"), log(n.message), log(n.stack);
        }
      else
        typeof t.examine != "string" && V(t, "The 'examine' attribute for this item is neither a string nor a function");
      l.customObjectChecks && l.customObjectChecks(t);
    }
  },
  // Start the game - could be called after the start up dialog, so not part of init
  begin: function() {
    if (l.performanceLog("Start begin"), !l.startingDialogEnabled) {
      if (typeof l.intro == "string")
        x(l.intro);
      else if (l.intro)
        for (let t of l.intro)
          x(t);
      typeof l.setup == "function" && l.setup(), h.enterRoom(), l.performanceLog("End begin");
    }
  },
  //------------------------------------------------------------
  // Turn taking
  // Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
  endTurn: function(t) {
    if (t === !0 && log("That command returned 'true', rather than the proper result code."), t === !1 && log("That command returned 'false', rather than the proper result code."), T.handleChangeListeners(), t === h.SUCCESS || l.failCountsAsTurn && t === h.FAILED) {
      O.turnCount++, O.elapsedTime += l.dateTime.secondsPerTurn;
      for (const e in m)
        m[e].endTurn();
      for (const e of l.modulesToEndTurn)
        e.endTurn();
      T.handleChangeListeners(), h.resetPauses(), h.update(), h.saveGameState(), ue(!0);
    } else
      ue(!1);
  },
  // Updates the game world, specifically...
  // Sets the scoping snapshot
  // Sets the light/dark
  update: function() {
    if (!g())
      return _("No player object found. This will not go well...");
    if (g().loc === g().name)
      return _("The location assigned to the player is the player itself.");
    if (!g().loc || !m[g().loc])
      return h.isCreated ? _((g().loc === void 0 ? "No player location set." : "Player location set to '" + g().loc + "', which does not exist.") + " Has the player just moved? This is likely to be because of an error in the exit being used.") : _((g().loc === void 0 ? "No player location set." : "Player location set to '" + g().loc + "', which does not exist.") + " This is may be because of an error in one of the .js files; the browser has hit the error and stopped at that point, before getting to where the player is set. Is there another error above this one? If so, that i the real problem.");
    m._loc = m[g().loc], h.scopeSnapshot();
  },
  resetPauses: function() {
    for (let t in m)
      m[t].paused && (m[t].paused = !1);
  },
  // Returns true if bad lighting is not obscuring the item
  ifNotDark: function(t) {
    return !O.dark || t.lightSource() > h.LIGHT_NONE;
  },
  // scopeStatus is used to track what the player can see and reach; it is a lot faster than working
  // it out each time, as the scope needs to be checked several times every turn.
  scopeSnapshot: function() {
    for (let e in m)
      m[e].scopeStatus = {};
    h.scope = [], h.takeScopeSnapshot("See"), h.takeScopeSnapshot("Reach"), h.scope.includes(E()) || h.scope.push(E()), g().onPhoneTo && !h.scope.includes(m[g().onPhoneTo]) && h.scope.push(m[g().onPhoneTo]);
    let t = h.LIGHT_NONE;
    for (const e of h.scope)
      e.lightSource || log(e.name), t < e.lightSource() && (t = e.lightSource());
    O.dark = t < h.LIGHT_MEAGRE;
  },
  // mode is either "Reach" or "See"
  takeScopeSnapshot: function(t) {
    let e = E();
    for (e.scopeStatus["room" + t] = !0; e.loc && e["can" + t + "ThroughThis"](); )
      e = m[e.loc], e.scopeStatus["room" + t] = !0;
    e.scopeSnapshot(t);
  },
  defaultVerbFunction: function(t, e) {
    e.push(a.verbs.examine), t.use !== void 0 && e.push(a.verbs.use);
  },
  //------------------------------------------------------------
  // Entering a new room
  // Runs the script and gives the description
  enterRoom: function(t) {
    if (E().beforeEnter === void 0)
      return _("This room, " + E().name + ", has no 'beforeEnter` function defined.  This is probably because it is not actually a room (it was not created with 'createRoom' and has not got the DEFAULT_ROOM template), but is an item. It is not clear what state the game will continue in.");
    if (l.beforeEnter(t), E().visited === 0) {
      if (E().roomSet) {
        E().roomSetOrder = 1;
        for (const e of l.roomSetList[E().roomSet])
          e.visited && E().roomSetOrder++, e.name === E().name && (e.visited = !0);
      }
      E().beforeFirstEnter(t);
    }
    E().beforeEnter(t), h.enterRoomAfterScripts(t);
  },
  // Called when entering a new room, after beforeEnter and beforeFirstEnter re done
  enterRoomAfterScripts: function(t) {
    E().description(), g().handleMovingFollowers(t), E().visited++, E().afterEnter(t), l.afterEnter(t), E().visited === 1 && E().afterFirstEnter(t);
    for (let e in E().afterEnterIf)
      E().afterEnterIfFlags.split(" ").includes(e) || E().afterEnterIf[e].test() && (E().afterEnterIf[e].action(), E().afterEnterIfFlags += " " + e);
  },
  //------------------------------------------------------------
  // Real time event handling
  gameTimer: function() {
    O.elapsedRealTime++;
    let t = !1;
    for (let e = 0; e < O.timerEventNames.length; e++)
      if (O.timerEventTriggerTimes[e] && O.timerEventTriggerTimes[e] < O.elapsedRealTime) {
        const n = l.eventFunctions[O.timerEventNames[e]]();
        O.timerEventIntervals[e] !== -1 && !n ? O.timerEventTriggerTimes[e] += O.timerEventIntervals[e] : O.timerEventTriggerTimes[e] = 0, t = !0;
      }
    t && T.handleChangeListeners();
  },
  //------------------------------------------------------------
  // UNDO Support
  gameState: [],
  saveGameState: function() {
    l.maxUndo > 0 && (h.gameState.push(I.getSaveBody()), h.gameState.length > l.maxUndo && h.gameState.shift());
  },
  find: function(t, e) {
    for (const n in m)
      if (t(m[n], e))
        return m[n];
    return null;
  }
}, O = {
  turnCount: 0,
  elapsedTime: 0,
  elapsedRealTime: 0,
  startTime: l.dateTime.start,
  name: "built-in_game_object",
  timerEventNames: [],
  timerEventTriggerTimes: [],
  timerEventIntervals: [],
  getSaveString: function() {
    let t = "GameState=";
    for (const e in this)
      this.saveLoadExclude(e) || (t += I.encode(e, this[e]));
    return t;
  },
  setLoadString: function(t) {
    const e = t.split("=");
    if (e.length !== 2)
      return _("Bad format in saved data (" + t + ")");
    if (e[0] !== "GameState")
      return _("Expected GameState to be second");
    I.setFromArray(this, e[1].split(";"));
  },
  saveLoadExclude: function(t) {
    return t === "player" || typeof this[t] == "function" || typeof this[t] == "object";
  }
};
class ne {
  constructor(e, n) {
    n || (n = {}), this.name = e, this.use = T.defaultExitUse, this.isGuarded = T.defaultExitIsGuarded, this.getExitObject = function() {
      return a.exit_list.find((s) => s.name === this.dir);
    }, this.nice = function() {
      const s = this.getExitObject();
      return s.niceDir ? s.niceDir : s.name;
    }, this.reverseNice = function() {
      const s = this.reverseObject();
      return s.niceDir ? s.niceDir : s.name;
    }, this.reverse = function() {
      return this.getExitObject().opp;
    }, this.reverseObject = function() {
      const s = this.getExitObject().opp;
      return a.exit_list.find((r) => r.name === s);
    }, this.isLocked = function() {
      return this.origin.isExitLocked(this.dir);
    }, this.setLock = function(s) {
      return this.origin.setExitLock(this.dir, s);
    }, this.isHidden = function() {
      return this.origin.isExitHidden(this.dir);
    }, this.setHide = function(s) {
      return this.origin.setExitHide(this.dir, s);
    };
    for (let s in n)
      s !== "name" && (this[s] = n[s]);
  }
}
class Oi extends ne {
  constructor(e, n) {
    super(e, n);
  }
}
const re = {}, ha = function(t, e) {
  cs = t, re[t] = e;
}, da = function(t) {
  const e = Object.assign({}, is(), Fi(), Ri());
  e.npc = !0, e.isFemale = t, e.pronouns = t ? a.pronouns.female : a.pronouns.male, e.askOptions = [], e.tellOptions = [], e.excludeFromAll = !0, e.reactions = [], e.receiveItems = [
    {
      msg: a.not_interested_for_give,
      failed: !0
    }
  ], e.followers = [], e.canReachThroughThis = () => !1, e.icon = () => "npc12", e.getWearingVisible = function() {
    return this.getWearing();
  }, e.isHere = function() {
    return this.isAtLoc(g().loc);
  }, e.msg = function(n, s) {
    this.isHere() && x(n, s);
  }, e.multiMsg = function(n) {
    if (!this.isHere())
      return;
    const s = n[0].replace(/[^a-z]/ig, "");
    this[s] === void 0 && (this[s] = -1), this[s]++, this[s] >= n.length && (this[s] = n.length - 1), n[this[s]] && x(n[this[s]]);
  }, e.inSight = function(n) {
    return this.loc ? (n || (n = m[this.loc]), g().loc === n.name ? !0 : n.visibleFrom === void 0 ? !1 : typeof n.visibleFrom == "function" ? n.visibleFrom(E()) : Array.isArray(n.visibleFrom) && n.visibleFrom.includes(E().name) ? n.visibleFromPrefix ? n.visibleFromPrefix : !0 : !1) : !1;
  }, e.setLeader = function(n) {
    typeof n == "string" && (n = m[n]), this.leaderName && U.remove(m[this.leaderName].followers, this.name), n ? (n.followers.push(this.name), this.leaderName = n.name) : delete this.leaderName;
  }, e.getFollowers = function() {
    return this.followers.map((n) => m[n]);
  }, e.startFollow = function() {
    return this.leaderName ? L(a.already_following, { npc: this }) : (this.setLeader(g()), x("{nv:npc:nod:true} his head.", { npc: this }), !0);
  }, e.endFollow = function() {
    return this.leaderName ? (this.setLeader(), x("{nv:npc:nod:true} his head.", { npc: this }), !0) : L(a.already_waiting, { npc: this });
  }, e.endTurn = function(n) {
    this.dead || (this.sayTakeTurn(), this.doReactions(), !this.paused && !this.suspended && this.agenda && this.agenda.length > 0 && this.doAgenda(), this.doEvent(n));
  }, e.doReactions = function() {
    if (this.player || !this.isHere() && !l.npcReactionsAlways)
      return;
    this.reactionFlags || (this.reactionFlags = []), le({
      char: this,
      noResponseNotError: !0,
      afterScript: function(s, r) {
        r && (r.name && s.char.reactionFlags.push(r.name), r.noPause || s.char.pause(), r.override && (s.char.reactionFlags = s.char.reactionFlags.concat(r.override)));
      },
      extraTest: function(s, r) {
        return !r.name || !s.char.reactionFlags.includes(r.name);
      }
    }, this.reactions);
  };
  for (const n in un)
    e[n] = un[n];
  return e.topics = function() {
    if (this.askOptions.length === 0 && this.tellOptions.length === 0)
      return C(a.topics_no_ask_tell), h.SUCCESS_NO_TURNSCRIPTS;
    let n = !1;
    for (let s of ["ask", "tell"]) {
      const r = pn({ char: this, action: s }, this[s + "Options"]), o = [];
      for (let c of r)
        c.silent && !g().mentionedTopics.includes(c.name) || o.push(c.name);
      o.length !== 0 && (C(a["topics_" + s + "_list"], { item: this, list: o.sort().join("; ") }), n = !0);
    }
    return n || C(a.topics_none_found, { item: this }), l.lookCountsAsTurn ? h.SUCCESS : h.SUCCESS_NO_TURNSCRIPTS;
  }, e.sayBonus = 0, e.sayPriority = 0, e.sayState = 0, e.sayUsed = " ", e.sayResponse = function(n) {
    return this.sayResponses ? le({
      text: n,
      char: this,
      extraTest: function(r, o) {
        return o.regex ? o.id && r.char.sayUsed.match(new RegExp("\\b" + o.id + "\\b")) ? !1 : o.regex.test(r.text) : !0;
      },
      afterScript: function(r, o) {
        o && (this.oldQuestion ? delete this.oldQuestion : (r.char.sayBonus = 0, r.char.sayQuestion = !1), o.id && (r.char.sayUsed += o.id + " "));
      },
      noResponseNotError: !0
    }, this.sayResponses) : !1;
  }, e.sayCanHear = function(n, s) {
    return n.loc === this.loc;
  }, e.askQuestion = function(n) {
    typeof n != "string" && (n = n.name), this.sayQuestion && (this.oldQuestion = this.sayQuestion);
    const s = T.questionList[n];
    if (!s)
      return _("Trying to set a question that does not exist, " + n + ", for " + this.name);
    this.sayQuestion = n, this.sayQuestionCountdown = s.countdown, this.sayBonus = 100;
  }, e.respondToAnswer = function(n) {
    return T.questionList[this.sayQuestion].sayResponse(this, n);
  }, e.sayTakeTurn = function() {
    if (!this.sayQuestion || (this.sayQuestionCountdown--, this.sayQuestionCountdown > 0))
      return;
    const n = T.questionList[this.sayQuestion];
    this.sayQuestion = !1, this.sayBonus = 0, n.expiredScript && n.expiredScript(this);
  }, e;
}, un = {
  findTopic: function(t, e = 1) {
    return T.findTopic(t, this, e);
  },
  showTopic: function(t, e = 1) {
    T.findTopic(t, this, e).show();
  },
  hideTopic: function(t, e = 1) {
    T.findTopic(t, this, e).hide();
  },
  talkto: function() {
    if (l.noTalkTo !== !1)
      return C(l.noTalkTo), !1;
    if (!g().testTalk(this) || this.testTalk && !this.testTalk())
      return !1;
    if (typeof this.talk == "string")
      return x(this.talk, { char: this }), !0;
    if (typeof this.talk == "function")
      return this.talk();
    const t = this.getTopics();
    if (g().conversingWithNpc = this, t.length === 0)
      return k(this.no_topics ? this.no_topics : a.no_topics, { char: g(), item: this });
    this.greeting && me(this, this, "greeting"), t.push(a.never_mind);
    const e = u.menuFunctions[l.funcForDynamicConv];
    return e(a.speak_to_menu_title(this), t, function(n) {
      n !== a.never_mind && n.runscript();
    }), h.SUCCESS_NO_TURNSCRIPTS;
  },
  askTopics: function(...t) {
    const e = t.shift(), n = u.menuFunctions[l.funcForDynamicConv];
    n(e, t, function(s) {
      s.runscript();
    });
  },
  getTopics: function() {
    const t = [];
    for (let e in m)
      m[e].isTopicVisible && m[e].isTopicVisible(this) && t.push(m[e]);
    return t;
  }
}, Ri = function() {
  const t = {};
  return t.agenda = [], t.suspended = !1, t.followers = [], t.inSight = function() {
    return !1;
  }, t.endTurn = function(e) {
    !this.paused && !this.suspended && this.agenda.length > 0 && this.doAgenda(), this.doEvent(e);
  }, t.setAgenda = function(e) {
    this.agenda = e, this.suspended = !1, this.agendaWaitCounter = !1, this.patrolCounter = !1;
  }, t.doAgenda = function() {
    if (this.followers.length !== 0 && (this.savedPronouns = this.pronouns, this.savedAlias = this.alias, this.pronouns = a.pronouns.plural, this.followers.unshift(this.name), this.alias = K(this.getFollowers(), { lastSep: a.list_and }), this.followers.shift()), !Array.isArray(this.agenda))
      throw "Agenda is not a list for " + this.name;
    if (typeof this.agenda[0] != "string")
      throw "Next agenda item is not a string for " + this.name;
    const e = this.agenda[0].split(":"), n = e.shift();
    if (typeof ee[n] != "function") {
      _("Unknown function `" + n + "' in agenda for " + this.name);
      return;
    }
    const s = ee[n](this, e);
    s && this.agenda.shift(), s === "next" && this.doAgenda(), this.savedPronouns && (this.pronouns = this.savedPronouns, this.alias = this.savedAlias, this.savedPronouns = !1);
  }, t.pause = function() {
    this.leaderName ? m[this.leaderName].pause() : this.paused = !0;
  }, t;
}, ee = {
  debug: function(t, e, n) {
    l.agendaDebugging && l.playMode === "dev" && W("AGENDA for " + e.name + ": " + t + "; " + K(n, { doNotSort: !0 }));
  },
  debugS: function(t) {
    l.agendaDebugging && l.playMode === "dev" && W("AGENDA comment: " + t);
  },
  // wait one turn
  pause: function(t, e) {
    return !0;
  },
  // print the array as text if the player is here
  // otherwise this will be skipped
  // Used by several other functions, so this applies to them too
  text: function(t, e) {
    if (typeof t[e[0]] == "function") {
      this.debug("text (function)", t, e);
      const n = e.shift(), s = t[n](e);
      return typeof s == "boolean" ? s : !0;
    }
    return this.debug("text (string)", t, e), t.inSight() && x(e.join(":")), !0;
  },
  msg: function(t, e) {
    return this.debug("msg (string)", t, e), x(e.join(":")), !0;
  },
  // Alias for text
  run: function(t, e) {
    return this.text(t, e);
  },
  // sets one attribute on the given item
  // it will guess if Boolean, integer or string
  setItemAtt: function(t, e) {
    return this._setItemAtt(t, e, !1);
  },
  // sets one attribute on the given item
  // it will guess if Boolean, integer or string
  setItemAttThen: function(t, e) {
    return this._setItemAtt(t, e, !0);
  },
  // sets one attribute on the given item
  // it will guess if Boolean, integer or string
  _setItemAtt: function(t, e, n) {
    this.debug("setItemAtt", t, e);
    const s = e.shift(), r = e.shift();
    let o = e.shift();
    return m[s] || _("Item '" + s + "' not recognised in the agenda of " + t.name), o === "true" && (o = !0), o === "false" && (o = !1), /^\d+$/.test(o) && (o = parseInt(o)), m[s][r] = o, this.text(t, e), n ? "next" : !0;
  },
  // delete one attribute on the given item
  deleteItemAtt: function(t, e) {
    this.debug("deleteItemAtt", t, e);
    const n = e.shift(), s = e.shift();
    return m[n] || _("Item '" + n + "' not recognised in the agenda of " + t.name), delete m[n][s], this.text(t, e), !0;
  },
  // Wait n turns
  wait: function(t, e) {
    if (this.debug("wait", t, e), e.length === 0)
      return !0;
    isNaN(e[0]) && _("Expected wait to be given a number in the agenda of '" + t.name + "'");
    const n = parseInt(e.shift());
    return t.agendaWaitCounter !== void 0 ? (t.agendaWaitCounter++, t.agendaWaitCounter >= n ? (this.debugS("Pass"), this.text(t, e), !0) : !1) : (t.agendaWaitCounter = 0, !1);
  },
  // Wait until ...
  // This may be repeated any number of times
  waitFor: function(t, e) {
    return this.handleWaitFor(t, e, !1);
  },
  waitForNow: function(t, e) {
    return this.handleWaitFor(t, e, !0);
  },
  handleWaitFor: function(t, e, n) {
    this.debug("waitFor", t, e);
    let s = e.shift();
    return typeof t[s] == "function" ? t[s](e) ? (this.text(t, e), this.debugS("Pass"), n ? "next" : !0) : !1 : (s === "player" && (s = g().name), t.loc === m[s].loc ? (this.text(t, e), this.debugS("Pass"), n ? "next" : !0) : !1);
  },
  waitUntil: function(t, e) {
    return ee.handleWaitUntilWhile(t, e, !0);
  },
  waitUntilNow: function(t, e) {
    return ee.handleWaitUntilWhile(t, e, !0, !0);
  },
  waitWhile: function(t, e) {
    return ee.handleWaitUntilWhile(t, e, !1);
  },
  waitWhileNow: function(t, e) {
    return ee.handleWaitUntilWhile(t, e, !1, !0);
  },
  handleWaitUntilWhile: function(t, e, n, s) {
    const r = e[0] === "player" ? g() : m[e[0]];
    e.shift();
    const o = e.shift(), c = T.guessMyType(e.shift());
    let d = r[o] === c;
    return n && (d = !d), d ? !1 : (x(e.join(":")), s ? "next" : !0);
  },
  joinedBy: function(t, e) {
    this.debug("joinedBy", t, e);
    const n = e.shift();
    return m[n].setLeader(t), this.text(t, e), !0;
  },
  joining: function(t, e) {
    this.debug("joining", t, e);
    const n = e.shift();
    return t.setLeader(m[n]), this.text(t, e), !0;
  },
  disband: function(t, e) {
    this.debug("disband", t, e);
    for (let n of t.followers) {
      const s = m[n];
      s.leader = !1;
    }
    return t.followers = [], this.text(t, e), !0;
  },
  // Move the given item directly to the given location, then print the rest of the array as text
  // Do not use for items with a funny location, such as COUNTABLES
  moveItem: function(t, e) {
    this.debug("moveItem", t, e);
    const n = e.shift();
    let s = e.shift();
    if (s === "player")
      s = g().name;
    else if (s === "_")
      s = !1;
    else if (!m[s])
      return _("Location '" + s + "' not recognized in the agenda of " + t.name);
    return m[n].moveToFrom({ char: t, toLoc: s, item: n }), this.text(t, e), !0;
  },
  // Move directly to the given location, then print the rest of the array as text
  // Use "player" to go directly to the room the player is in.
  // Use an item (i.e., an object not flagged as a room) to have the NPC move
  // to the room containing the item.
  // None of the usual reactions will be performed, so items carried with not react to
  // moving, any followers will be left behind, etc.
  jumpTo: function(t, e) {
    let n = e.shift();
    if (n === "player")
      n = g().loc;
    else if (n === "_")
      n = void 0, this.text(t, e);
    else {
      if (!m[n])
        return _("Location '" + n + "' not recognised in the agenda of " + t.name);
      if (m[n].room || (n = n.loc), !m[n])
        return _("Location '" + n + "' not recognized in the agenda of " + t.name);
    }
    return t.loc = n, this.text(t, e), !0;
  },
  // Move to the given location, then print the rest of the array as text.
  // There must be an exit from the current room to that room.
  moveTo: function(t, e) {
    let n = e.shift();
    if (!m[n])
      return _("Location '" + n + "' not recognised in the agenda of " + t.name);
    m[n].room || (n = n.loc);
    const s = m[t.loc].findExit(n);
    return s ? (t.movingMsg(s), t.moveChar(s), this.text(t, e), !0) : _("Could not find an exit to location '" + n + "' in the agenda of " + t.name);
  },
  patrol: function(t, e) {
    return this.debug("patrol", t, e), t.patrolCounter === void 0 && (t.patrolCounter = -1), t.patrolCounter = (t.patrolCounter + 1) % e.length, this.moveTo(t, [e[t.patrolCounter]]), !1;
  },
  // Move to another room via a random, unlocked exit, then print the rest of the array as text
  walkRandom: function(t, e) {
    this.debug("walkRandom", t, e);
    const n = m[t.loc].getRandomExit({ excludeLocked: !0, excludeScenery: !0 });
    return n === null ? (this.text(t, e), !0) : (m[n.name] || _("Location '" + n.name + "' not recognised in the agenda of " + t.name), t.movingMsg(n), t.moveChar(n), !1);
  },
  // Move to the given location, using available, unlocked exits, one room per turn
  // then print the rest of the array as text
  // Use "player" to go to the room the player is in (if the player moves, the NPC will head
  // to the new position, but will be omniscient!).
  // Use an item (i.e., an object not flagged as a room) to have the NPC move
  // to the room containing the item.
  // This may be repeated any number of turns
  leadTo: function(t, e) {
    return this.debug("leadTo", t, e), t.loc !== g().loc ? !1 : this.walkTo(t, e);
  },
  walkTo: function(t, e) {
    this.debug("walkTo", t, e);
    let n = e.shift();
    if (n === "player" && (n = g().loc), m[n] === void 0)
      return _("Location '" + n + "' not recognised in the agenda of " + t.name), !0;
    if (!m[n].room && (n = m[n].loc, m[n] === void 0))
      return _("Object location '" + n + "' not recognised in the agenda of " + t.name), !0;
    if (t.isAtLoc(n))
      return this.text(t, e), !0;
    {
      const s = ee.findPath(m[t.loc], m[n]);
      s || _("Location '" + n + "' not reachable in the agenda of " + t.name);
      const r = m[t.loc].findExit(s[0]);
      return t.movingMsg(r), t.moveChar(r), t.isAtLoc(n) ? (this.text(t, e), !0) : !1;
    }
  },
  // Initiate a conversation, with this topic
  showTopic: function(t, e) {
    let n = e.shift();
    return t.showTopic(n), this.text(t, e), !0;
  }
};
ee.findPath = function(t, e, n) {
  if (t === e)
    return [];
  O.pathID || (O.pathID = 0), n === void 0 && (n = 999), O.pathID++;
  let s = [t], r = 0, o, c, d;
  for (t.pathfinderNote = { id: O.pathID }; s.length > 0 && r < n; ) {
    o = [], r++;
    for (let p of s) {
      d = p.getExits({ npc: !0 });
      for (let v of d)
        if (v.name !== "_") {
          if (c = m[v.name], c === void 0)
            return _("Dest is undefined: " + v.name + " (room " + p.name + "). Giving up."), console.log(this), !1;
          if (!(c.pathfinderNote && c.pathfinderNote.id === O.pathID)) {
            if (c.pathfinderNote = { jumpFrom: p, id: O.pathID }, c === e)
              return ee.extractPath(t, e);
            o.push(c);
          }
        }
    }
    s = o;
  }
  return !1;
};
ee.extractPath = function(t, e) {
  let n = [e], s = e, r = 0;
  do
    s = s.pathfinderNote.jumpFrom, n.push(s), r++;
  while (s !== t && r < 99);
  return n.pop(), n.reverse();
};
const Fi = function() {
  const t = {};
  return t.consultable = !0, t.askabout = function(e, n) {
    return this.asktellabout(e, n, a.ask_about_intro, this.askOptions, "ask");
  }, t.tellabout = function(e, n) {
    return this.asktellabout(e, n, a.tell_about_intro, this.tellOptions, "tell");
  }, t.talkabout = function(e, n) {
    let s = this.talkOptions;
    return this.talkOptions || (s = this.tellOptions ? this.tellOptions.concat(this.askOptions) : this.askOptions), this.asktellabout(e, n, a.talk_about_intro, s, "talk");
  }, t.asktellabout = function(e, n, s, r, o) {
    if (l.noAskTell !== !1)
      return C(l.noAskTell), !1;
    if (!g().testTalk(this) || this.testTalk && !this.testTalk(e, o))
      return !1;
    if (!r || r.length === 0)
      return C(l.noAskTell), _("No " + o + "Options set for " + this.name + " and I think there should at least be default saying why.");
    l.givePlayerAskTellMsg && x(s(this, e, n), { char: g() });
    const c = {
      text: e,
      text2: n,
      char: this,
      action: o,
      extraTest: function(d, p) {
        return p.regex ? p.regex.test(d.text) : !0;
      },
      afterScript: this.askTellDone
    };
    return le(c, r);
  }, t.askTellDone = function(e, n) {
    if (!n) {
      x(a.npc_no_interest_in, e);
      return;
    }
    if (n.mentions)
      for (let s of n.mentions)
        g().mentionedTopics.includes(s) || g().mentionedTopics.push(s);
    e.char.pause && e.char.pause();
  }, t;
};
class Pi {
  constructor(e, n) {
    this.name = e, this.responses = n, this.countdown = l.turnsQuestionsLast;
  }
  sayResponse(e, n) {
    return le({
      text: n,
      char: e,
      question: this,
      extraTest: function(r, o) {
        return o.regex ? o.regex.test(r.text) : !0;
      },
      afterScript: function(r, o) {
        this.oldQuestion ? delete this.oldQuestion : (r.char.sayBonus = 0, r.char.sayQuestion = !1, delete r.char.questionExpiredFunction), r.question.afterScript && r.question.afterScript(r, o);
      },
      noResponseNotError: !0
    }, this.responses);
  }
}
T.questionList = {};
T.createQuestion = function(t, e, n = {}) {
  const s = new Pi(t, e);
  for (const r in n)
    s[r] = n[r];
  return T.questionList[t] = s, s;
};
const Di = function(t) {
  return {
    conversationTopic: !0,
    showTopic: t,
    hideTopic: !1,
    hideAfter: !0,
    properNoun: !0,
    // we do not want "the" prepended
    nowShow: [],
    nowHide: [],
    count: 0,
    isVisible: () => !0,
    isAtLoc: () => !1,
    belongsTo: function(e) {
      return this.loc === e;
    },
    eventPeriod: 1,
    eventIsActive: function() {
      return this.showTopic && !this.hideTopic && this.countdown;
    },
    eventScript: function() {
      this.countdown--, this.countdown < 0 && this.hide();
    },
    runscript: function() {
      let e = g().conversingWithNpc;
      if (e === void 0)
        return _("No conversing NPC called " + g().conversingWithNpc + " found.");
      if (e.pause(), this.hideTopic = this.hideAfter, !this.script && !this.msg)
        return _("Topic " + this.name + " has neither script nor msg attributes.");
      if (this.script) {
        if (typeof this.script != "function")
          return _("script for topic " + this.name + " is not a function.");
        this.script.bind(e)({ char: e, player: g(), topic: this });
      }
      if (this.msg) {
        if (typeof this.msg != "string")
          return _("msg for topic " + this.name + " is not a string.");
        x(this.msg, { char: e, topic: this });
      }
      this.showHideList(this.nowShow, !0), this.showHideList(this.nowHide, !1), this.count++, h.endTurn(h.SUCCESS);
    },
    isTopicVisible: function(e) {
      return this.showTopic && !this.hideTopic && this.belongsTo(e.name) && this.isVisible(e);
    },
    showHideList: function(e, n) {
      if (typeof e == "string") {
        log("WARNING: " + (n ? "nowShow" : "nowHide") + " for topic " + this.name + " is a string.");
        return;
      }
      for (let s of e) {
        const r = T.findTopic(s);
        r ? r[n ? "showTopic" : "hideTopic"] = !0 : log("WARNING: Topic " + this.name + " wants to now show/hide a non-existent topic, " + s);
      }
    },
    show: function() {
      return this.showTopic = !0;
    },
    hide: function() {
      return this.hideTopic = !0;
    }
  };
}, f = {};
f.currentCommand = null;
f.pronouns = {};
f.specialText = {};
f.debug = !1;
f.BAD_SPECIAL = -14;
f.DISALLOWED_MULTIPLE = -16;
f.NO_OBJECT = -13;
f.NONE_FOR_ALL = -12;
f.NO_MATCH = -100;
f.parse = function(t) {
  if (u.startCommand(), l.performanceLogStart(), l.performanceLog("Start command"), f.override) {
    f.msg("Parser overriden"), f.override(t), delete f.override;
    return;
  }
  for (l.parserPreprocessor && (t = l.parserPreprocessor(t)), f.inputTexts = f.keepTogether(t) ? [t] : t.split(a.command_split_regex); f.inputTexts.length > 0; ) {
    const e = f.inputTexts.shift();
    l.performanceLog('Start "' + e + '"'), f.parseSingle(e), l.performanceLog("Done");
  }
};
f.abort = function() {
  f.inputTexts.length !== 0 && (at(a.abort_cmds + ": " + f.inputTexts.join("; ")), f.inputTexts = []);
};
f.parseSingle = function(t) {
  if (f.msg("Input string: " + t), t) {
    const n = f.findCommand(t);
    if (typeof n == "string") {
      at(n), f.abort(), h.endTurn(h.PARSER_FAILURE);
      return;
    }
    if (n.tmp.score < 0) {
      at(n.tmp.error), f.abort(), h.endTurn(h.PARSER_FAILURE);
      return;
    }
    f.currentCommand = n;
  }
  l.performanceLog("Command found");
  let e = !1;
  for (let n = 0; n < f.currentCommand.tmp.objects.length; n++)
    if (Array.isArray(f.currentCommand.tmp.objects[n])) {
      for (let s = 0; s < f.currentCommand.tmp.objects[n].length; s++)
        if (f.currentCommand.tmp.objects[n][s] instanceof Array)
          if (f.currentCommand.tmp.objects[n][s].length === 1)
            f.currentCommand.tmp.objects[n][s] = f.currentCommand.tmp.objects[n][s][0];
          else {
            e = !0, f.currentCommand.tmp.disambiguate1 = n, f.currentCommand.tmp.disambiguate2 = s;
            const r = u.menuFunctions[l.funcForDisambigMenu];
            r(a.disambig_msg, f.currentCommand.tmp.objects[n][s], function(o) {
              f.currentCommand.tmp.objects[f.currentCommand.tmp.disambiguate1][f.currentCommand.tmp.disambiguate2] = o, f.parseSingle(null);
            }, function(o) {
              f.parse(o);
            });
          }
    }
  e || (l.performanceLog("About to execute"), f.execute());
};
f.overrideWith = function(t) {
  f.override = t;
};
f.execute = function() {
  f.inspect();
  let t = !1;
  try {
    if (f.currentCommand.tmp.objects.length > 0 && Array.isArray(f.currentCommand.tmp.objects[0]) && !f.currentCommand.all)
      for (let n of f.currentCommand.tmp.objects[0])
        f.pronouns[n.parserPronouns ? n.parserPronouns.objective : n.pronouns.objective] = n;
    l.performanceLog("About to run command script");
    const e = f.currentCommand.script(f.currentCommand.tmp.objects);
    e === void 0 && l.playMode === "dev" && log("WARNING: " + f.currentCommand.name + " command did not return a result to indicate success or failure."), t = !0, l.performanceLog("About to run world.endTurn"), h.endTurn(e);
  } catch (e) {
    ot(t ? "Hit a coding error trying to process world.endTurn after that command." : "Hit a coding error trying to process the command `" + f.currentCommand.cmdString + "'.", e);
  }
  l.performanceLog("All done");
};
f.findCommand = function(t) {
  let e = t.toLowerCase().trim().replace(/\s+/g, " ");
  l.convertNumbersInParser && (e = a.convertNumbers(e)), l.performanceLog("Numbers converted");
  let n;
  for (const s of te)
    s.matchItems(e, t), s.tmp.score > f.NO_MATCH && (!n || s.tmp.score > n.tmp.score) && (f.msg("Candidate accepted!"), n = s);
  return l.performanceLog("Best match found"), n ? (n.tmp.string = t, n.tmp.cmdString = e, f.msg("This is the one:" + n.name), n) : (u.reset(), l.playMode === "dev" && log("Command was [" + t + "]"), a.not_known_msg);
};
f.matchToNames = function(t, e, n, s) {
  const r = t.split(a.joiner_regex).map(function(d) {
    return d.trim();
  }).filter((d) => d);
  let o = [], c = 0;
  for (let d of r) {
    const p = f.matchToName(a.article_filter_regex.exec(d)[1], e, n, o);
    if (p < 0) {
      s.score = p, s.error_s = d;
      return;
    }
    p > c && (c = p);
  }
  if (o.length > 1 && !n.multiple) {
    s.error = a.no_multiples_msg, s.score = f.DISALLOWED_MULTIPLE;
    return;
  }
  s.objects.push(o), s.score += c;
};
f.matchToName = function(t, e, n, s) {
  let [r, o] = this.findInScope(t, e, n);
  if (o === 0)
    return f.NO_OBJECT;
  const c = [];
  for (const d of r) {
    let p = !1;
    for (const v of s)
      for (const N of v)
        N.name === d.name && (p = !0);
    p ? f.msg("..Skipping duplicate: " + d.name) : c.push(d);
  }
  return c.length > 0 && s.push(c), o;
};
f.findInScope = function(t, e, n) {
  f.msg("Now matching: " + t);
  for (const s in a.pronouns)
    if (t === a.pronouns[s].objective && f.pronouns[a.pronouns[s].objective])
      return [[f.pronouns[a.pronouns[s].objective]], 1];
  for (let s = 0; s < e.length; s++) {
    f.msg("..Looking for a match for: " + t + " (scope " + (s + 1) + ")");
    const r = this.findInList(t, e[s], n);
    if (r.length > 0)
      return [r, e.length - s];
  }
  return [[], 0];
};
f.findInList = function(t, e, n) {
  let s = [], r = 0, o;
  f.msg("-> Trying to match: " + t);
  for (let c of e)
    f.msg("-> Considering: " + c.name), o = this.scoreObjectMatch(t, c, n), o >= 0 && f.msg(c.name + " scores " + o), o > r && (s = [], r = o), o >= r && s.push(c);
  return f.msg(s.length > 1 ? "Cannot decide between: " + s.map((c) => c.name).join(", ") : s.length === 1 ? "..Going with: " + s[0].name : "Found no suitable objects"), s;
};
f.itemSetup = function(t) {
  if (t.parserOptionsSet = !0, t.parserItemName = t.alias.toLowerCase(), t.parserItemNameParts = U.combos(t.parserItemName.split(" ")), t.pattern && (t.regex || (t.regex = new RegExp("^(" + t.pattern + ")$")), t.synonyms || (t.synonyms = t.pattern.split("|"))), t.synonyms) {
    if (!Array.isArray(t.synonyms))
      throw 'Expected "synonyms" to be an array for ' + t.name;
    t.synonyms.forEach(function(e) {
      e.includes(" ") && (t.parserItemNameParts = t.parserItemNameParts.concat(e.split(" ")));
    });
  }
};
f.scoreObjectMatch = function(t, e, n) {
  e.parserOptionsSet || f.itemSetup(e), e.alias.toLowerCase();
  let s = -1;
  if (n.items && n.items.includes(e.name))
    f.msg("The command specifically mentions this item, so highest priority, score 100"), s = 100;
  else if (t === e.parserItemName)
    f.msg("The player has used the exact alias, score 60"), s = 60;
  else if (e.regex && e.regex.test(t))
    f.msg("The player has used the exact string allowed in the regex, score 55"), f.msg("" + e.regex), f.msg(">" + t + "<"), s = 55;
  else if (e.parserItemNameParts && e.parserItemNameParts.some(function(r) {
    return r === t;
  }))
    f.msg("The player has matched a complete word, but not the full phrase, score 50"), s = 50;
  else if (e.parserItemName.startsWith(t))
    f.msg("the player has used a string that matches the start of the alias, score length + 15"), s = t.length + 15;
  else if (e.synonyms && e.synonyms.some(function(r) {
    return r.startsWith(t);
  }))
    f.msg("the player has used a string that matches the start of an alt name, score length + 10"), s = t.length + 10;
  else if (e.parserItemNameParts && e.parserItemNameParts.some(function(r) {
    return r.startsWith(t);
  }))
    f.msg("the player has used a string that matches the start of an alt name, score length"), s = t.length;
  else
    return -1;
  return e[n.attName] && (f.msg("bonus 20 as item has attribute " + n.attName), s += 20), e.parserPriority && (f.msg("item.parserPriority is " + e.parserPriority), s += e.parserPriority), e.cmdMatch = t, s;
};
f.inspect = function() {
  if (!f.debug)
    return;
  let t = "PARSER RESULT:<br/>";
  t += "Input text: " + f.currentCommand.string + "<br/>", t += "Matched command: " + f.currentCommand.name + "<br/>", t += "Matched regex: " + f.currentCommand.tmp.regex + "<br/>", t += "Match score: " + f.currentCommand.tmp.score + "<br/>", f.currentCommand.all && (t += "Player typed ALL<br/>"), t += "Objects/texts (" + f.currentCommand.tmp.objects.length + "):<br/>";
  for (let e of f.currentCommand.tmp.objects)
    typeof e == "string" ? t += "&nbsp;&nbsp;&nbsp;&nbsp;Text: " + e + "<br/>" : Array.isArray(e) ? t += "&nbsp;&nbsp;&nbsp;&nbsp;Objects:" + e.map(function(n) {
      return n.name;
    }).join(", ") + "<br/>" : e.name ? t += "&nbsp;&nbsp;&nbsp;&nbsp;Something called :" + e + "<br/>" : t += "&nbsp;&nbsp;&nbsp;&nbsp;Something else:" + e + "<br/>";
  W(t);
};
f.specialText.ignore = {
  error: function(t) {
    return !1;
  },
  exec: function(t) {
    return !1;
  }
};
f.specialText.text = {
  error: function(t) {
    return !1;
  },
  exec: function(t) {
    return t;
  }
};
f.specialText.fluid = {
  error: function(t) {
    return l.fluids.includes(t) ? !1 : Q(a.not_a_fluid_here, { text: t });
  },
  exec: function(t) {
    return t;
  }
};
f.specialText.number = {
  error: function(t) {
    return t.match(/^\d+$/) ? !1 : !a.numberUnits.includes(t);
  },
  exec: function(t) {
    return t.match(/^\d+$/) ? parseInt(t) : a.numberUnits.indexOf(t);
  }
};
f.msg = function(...t) {
  if (f.debug)
    for (let e of t)
      W("P&gt; " + e);
};
f.getScope = function(t) {
  return t.scope ? t.extendedScope ? f.scopeFromWorld(t.allScope ? t.allScope : t.scope) : f.scopeFromScope(t.allScope ? t.allScope : t.scope) : (console.log("WARNING: No scope (or scope not found) in command"), h.scope);
};
f.getScopes = function(t) {
  return [t.extendedScope ? f.scopeFromWorld(t.scope) : f.scopeFromScope(t.scope), h.scope];
};
f.scopeFromScope = function(t, e) {
  const n = [];
  for (const s of h.scope)
    t(s, e) && n.push(s);
  return n;
};
f.scopeFromWorld = function(t, e) {
  const n = [];
  for (const s in m)
    t(m[s], e) && n.push(m[s]);
  return n;
};
f.keepTogether = function(t) {
  return a.regex.MetaUserComment.test(t);
};
f.isInWorld = function(t) {
  return !0;
};
f.isReachable = function(t) {
  return t.scopeStatus.canReach && h.ifNotDark(t);
};
f.isVisible = function(t) {
  return t.scopeStatus.visible && h.ifNotDark(t);
};
f.isPresent = function(t) {
  return f.isHere(t) || f.isHeld(t);
};
f.isPresentOrMe = function(t) {
  return f.isHere(t) || f.isHeld(t) || t === g();
};
f.isHeldNotWorn = function(t) {
  return t.isAtLoc(g().name, h.PARSER) && h.ifNotDark(t) && !t.getWorn();
};
f.isHeld = function(t) {
  return t.isAtLoc(g().name, h.PARSER) && h.ifNotDark(t);
};
f.isHeldByNpc = function(t) {
  const e = f.scopeFromScope(f.isReachable).filter((n) => n.npc);
  for (let n of e)
    if (t.isAtLoc(n.name, h.PARSER))
      return !0;
  return !1;
};
f.isWorn = function(t) {
  return t.isAtLoc(g().name, h.PARSER) && h.ifNotDark(t) && t.getWorn();
};
f.isWornByNpc = function(t) {
  const e = f.scopeFromScope(f.isReachable).filter((n) => n.npc);
  for (let n of e)
    if (t.isAtLoc(n.name, h.PARSER) && t.getWorn())
      return !0;
  return !1;
};
f.isNpcOrHere = function(t) {
  return t.isAtLoc(g().loc, h.PARSER) && h.ifNotDark(t) || t.npc || t.player;
};
f.isNpcAndHere = function(t) {
  return g().onPhoneTo === t.name || t.isAtLoc(g().loc, h.PARSER) && (t.npc || t.player);
};
f.isHere = function(t) {
  return t.isAtLoc(g().loc, h.PARSER) && h.ifNotDark(t);
};
f.isForSale = function(t) {
  return t.isForSale && t.isForSale(g().loc) && h.ifNotDark(t);
};
f.isContained = function(t) {
  const e = f.scopeFromScope(f.isReachable).filter((n) => n.container);
  for (let n of e)
    if (!n.closed && t.isAtLoc(n.name, h.PARSER))
      return !0;
  return !1;
};
f.isLocationContained = function(t) {
  const e = f.scopeFromScope(f.isReachable).filter((n) => n.container);
  for (let n of e)
    if (!n.closed && !n.isUltimatelyHeldBy(g()) && t.isAtLoc(n.name, h.PARSER))
      return !0;
  return !1;
};
f.isHereOrContained = function(t) {
  return f.isHere(t) ? !0 : f.isContained(t);
};
f.isHereOrLocationContained = function(t) {
  return t === E() ? !1 : f.isHere(t) ? !0 : f.isLocationContained(t);
};
f.isUnconstructed = function(t) {
  return !t.loc && t.construction;
};
const it = [];
for (let t of a.exit_list)
  t.type !== "nocmd" && (it.push(t.name), it.push(t.abbrev.toLowerCase()), t.alt && it.push(t.alt));
const te = [];
new b("MetaHello", {
  script: a.helloScript
});
new b("MetaHelp", {
  script: a.helpScript
});
new b("MetaHint", {
  script: function() {
    return l.hintResponses ? (le({ char: { msg: function(t) {
      l.hintResponsesInGame ? x(t) : C(t);
    } } }, l.hintResponses), h.SUCCESS_NO_TURNSCRIPTS) : l.hintSheetData ? (u.showHintSheet(), h.SUCCESS_NO_TURNSCRIPTS) : a.hintScript();
  }
});
new b("MetaCredits", {
  script: a.aboutScript
});
new b("MetaDarkMode", {
  script: u.toggleDarkMode
});
new b("MetaNarrowMode", {
  script: u.toggleNarrowMode
});
new b("MetaAutoScrollMode", {
  script: u.toggleAutoScrollMode
});
new b("MetaPlainFontMode", {
  script: u.togglePlainFontMode
});
new b("MetaSilent", {
  script: function() {
    return l.silent ? (C(a.mode_silent_off), l.silent = !1) : (C(a.mode_silent_on), l.silent = !0, Cs()), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaWarnings", {
  script: a.warningsScript
});
new b("MetaSpoken", {
  script: function() {
    return u.spoken ? (u.spoken = !1, C(a.spoken_off)) : (u.spoken = !0, C(a.spoken_on)), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaIntro", {
  script: function() {
    if (u.spoken = !0, typeof l.intro == "string")
      x(l.intro);
    else
      for (let t of l.intro)
        x(t);
    return h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaBrief", {
  script: function() {
    return l.verbosity = h.BRIEF, C(a.mode_brief), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaTerse", {
  script: function() {
    return l.verbosity = h.TERSE, C(a.mode_terse), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaVerbose", {
  script: function() {
    return l.verbosity = h.VERBOSE, C(a.mode_verbose), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaTranscript", {
  script: a.transcriptScript
});
new b("MetaTranscriptStart", {
  script: function() {
    return I.transcript ? (C(a.transcript_already_on), h.FAILED) : (I.transcriptClear(), I.transcriptStart(), h.SUCCESS_NO_TURNSCRIPTS);
  }
});
new b("MetaTranscriptOn", {
  script: function() {
    return I.transcript ? (C(a.transcript_already_on), h.FAILED) : (I.transcriptStart(), h.SUCCESS_NO_TURNSCRIPTS);
  }
});
new b("MetaTranscriptOff", {
  script: function() {
    return I.transcript ? (I.transcriptEnd(), h.SUCCESS_NO_TURNSCRIPTS) : (C(a.transcript_already_off), h.FAILED);
  }
});
new b("MetaTranscriptClear", {
  script: function() {
    return I.transcriptClear(), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaTranscriptShow", {
  script: function() {
    return I.transcriptShow(), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaUserComment", {
  script: function(t) {
    return gn("Comment: " + t[0]), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { special: "text" }
  ]
});
new b("MetaSave", {
  script: a.saveLoadScript
});
new b("MetaSaveOverwriteGame", {
  script: function(t) {
    return I.saveGame(t[0], !0), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { special: "text" }
  ]
});
new b("MetaSaveGame", {
  script: function(t) {
    return l.localStorageDisabled ? I.saveGameAsFile(t[0]) : I.saveGame(t[0]), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { special: "text" }
  ]
});
new b("MetaFileSaveGame", {
  script: function(t) {
    return I.saveGameAsFile(t[0]), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { special: "text" }
  ]
});
new b("MetaLoad", {
  script: function(t) {
    return l.localStorageDisabled ? document.getElementById("fileDialog").click() : a.saveLoadScript(), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: []
});
new b("MetaLoadGame", {
  script: function(t) {
    return I.loadGameFromLS(t[0]), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { special: "text" }
  ]
});
new b("MetaFileLoadGame", {
  script: function(t) {
    return document.getElementById("fileDialog").click(), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { special: "text" }
  ]
});
new b("MetaDir", {
  script: function() {
    return I.dirGame(), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaDeleteGame", {
  script: function(t) {
    return I.deleteGame(t[0]), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { special: "text" }
  ]
});
new b("MetaUndo", {
  script: function() {
    if (l.maxUndo === 0)
      return C(a.undo_disabled), h.FAILED;
    if (h.gameState.length < 2)
      return C(a.undo_not_available), h.FAILED;
    h.gameState.pop();
    const t = h.gameState[h.gameState.length - 1];
    return C(a.undo_done), I.loadTheWorld(t), m[g().loc].description(), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaAgain", {
  script: function() {
    return u.againOrOops(!0);
  }
});
new b("MetaOops", {
  script: function() {
    return u.againOrOops(!1);
  }
});
new b("MetaRestart", {
  script: function() {
    return Ns(a.restart_are_you_sure, function(t) {
      t.match(a.yes_regex) ? location.reload() : C(a.restart_no);
    }), h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("MetaPronouns", {
  script: function() {
    C("See the developer console (F12) for the current pronouns"), console.log(f.pronouns);
  }
});
new b("MetaScore", {
  script: function() {
    C(a.scores_not_implemented);
  }
});
new b("MetaTopicsNote", {
  script: a.topicsScript
});
new b("Look", {
  script: function() {
    return E().description(!0), l.lookCountsAsTurn ? h.SUCCESS : h.SUCCESS_NO_TURNSCRIPTS;
  },
  score: 50
});
new b("Exits", {
  script: function() {
    return x(a.can_go, { char: g() }), l.lookCountsAsTurn ? h.SUCCESS : h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("Inv", {
  script: function() {
    const t = g().getContents(h.INVENTORY);
    return x(a.inventory_prefix + " " + K(t, {
      article: 1,
      lastSep: a.list_and,
      modified: !0,
      nothing: a.list_nothing,
      loc: g().name
    }) + ".", { char: g() }), l.lookCountsAsTurn ? h.SUCCESS : h.SUCCESS_NO_TURNSCRIPTS;
  }
});
new b("Map", {
  script: function() {
    if (typeof showMap < "u")
      return showMap(), l.lookCountsAsTurn ? h.SUCCESS : h.SUCCESS_NO_TURNSCRIPTS;
    {
      const t = m[g().loc];
      return t.zone && t.drawMap() ? h.SUCCESS_NO_TURNSCRIPTS : k(a.no_map);
    }
  }
});
new b("Topics", {
  attName: "topics",
  objects: [
    { scope: f.isNpcAndHere }
  ],
  defmsg: a.no_topics
});
new b("Wait", {
  script: function() {
    return x(a.wait_msg), h.SUCCESS;
  }
});
new b("Smell", {
  script: function() {
    return E().smell ? me(g(), E(), "smell") : E()._region && re[E()._region].smell ? x(re[E()._region].smell) : x(a.no_smell, { char: g() }), h.SUCCESS;
  }
});
new b("Listen", {
  script: function() {
    return E().listen ? me(g(), E(), "listen") : E()._region && re[E()._region].listen ? x(re[E()._region].listen) : x(a.no_listen, { char: g() }), h.SUCCESS;
  }
});
new b("PurchaseFromList", {
  script: function() {
    const t = [];
    for (let e in m)
      if (f.isForSale(m[e])) {
        const n = m[e].getBuyingPrice(g()), s = [B(m[e].getName()), h.Money(n)];
        s.push(n > g().money ? "-" : "{cmd:buy " + m[e].alias + ":" + buy + "}"), t.push(s);
      }
    return t.length === 0 ? k(a.nothing_for_sale) : (x(a.current_money + ": " + h.Money(g().money)), Ts(t, a.buy_headings), h.SUCCESS_NO_TURNSCRIPTS);
  }
});
new b("GetFluid", {
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { special: "fluid" }
  ],
  score: 5,
  script: function(t) {
    const e = { char: g(), fluid: t[0] };
    return T.findSource(e) ? k(a.cannot_get_fluid, e) : k(a.no_fluid_here, e);
  }
});
new b("Examine", {
  npcCmd: !0,
  objects: [
    { scope: f.isPresent, multiple: !0 }
  ],
  defmsg: a.default_examine
});
new b("LookAt", {
  // used for NPCs
  npcCmd: !0,
  attName: "examine",
  objects: [
    { scope: f.isPresentOrMe }
  ],
  defmsg: a.default_examine
});
new b("LookOut", {
  npcCmd: !0,
  rules: [S.isPresent],
  objects: [
    { scope: f.isPresent }
  ],
  attName: "lookout",
  defmsg: a.cannot_look_out
});
new b("LookBehind", {
  npcCmd: !0,
  rules: [S.isPresent],
  attName: "lookbehind",
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.nothing_there
});
new b("LookUnder", {
  npcCmd: !0,
  rules: [S.isPresent],
  attName: "lookunder",
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.nothing_there
});
new b("LookThrough", {
  npcCmd: !0,
  rules: [S.isPresent],
  attName: "lookthrough",
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.nothing_there
});
new b("LookInside", {
  npcCmd: !0,
  rules: [S.isPresent],
  attName: "lookinside",
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.nothing_inside
});
new b("Search", {
  npcCmd: !0,
  rules: [S.isPresent],
  attName: "search",
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.nothing_there
});
new b("Take", {
  npcCmd: !0,
  rules: [S.isHereAlready, S.testManipulate],
  objects: [
    { scope: f.isHereOrContained, allScope: f.isHereOrLocationContained, multiple: !0 }
  ],
  defmsg: a.cannot_take
});
new b("Drop", {
  npcCmd: !0,
  rules: [S.isHeldNotWorn, S.testManipulate],
  objects: [
    { scope: f.isHeld, multiple: !0 }
  ],
  default: function(t) {
    L(t.item.isAtLoc(t.char) ? a.cannot_drop : a.not_carrying, t);
  }
});
new b("Wear2", {
  npcCmd: !0,
  rules: [S.isHeldNotWorn, S.isHeld, S.testManipulate],
  attName: "wear",
  objects: [
    { scope: f.isHeld, multiple: !0 }
  ],
  default: function(t) {
    L(t.item.ensemble ? a.cannot_wear_ensemble : a.cannot_wear, t);
  }
});
new b("Wear", {
  npcCmd: !0,
  rules: [S.isHeldNotWorn, S.testManipulate],
  objects: [
    { scope: f.isHeld, multiple: !0 }
  ],
  default: function(t) {
    L(t.item.ensemble ? a.cannot_wear_ensemble : a.cannot_wear, t);
  }
});
new b("Remove", {
  npcCmd: !0,
  rules: [S.isWorn, S.testManipulate],
  objects: [
    { scope: f.isWorn, multiple: !0 }
  ],
  default: function(t) {
    L(t.item.ensemble ? a.cannot_wear_ensemble : a.not_wearing, t);
  }
});
new b("Remove2", {
  npcCmd: !0,
  rules: [S.isWorn, S.testManipulate],
  attName: "remove",
  objects: [
    { scope: f.isWorn, multiple: !0 }
  ],
  default: function(t) {
    L(t.item.ensemble ? a.cannot_wear_ensemble : a.not_wearing, t);
  }
});
new b("Read", {
  npcCmd: !0,
  rules: [S.isPresent],
  objects: [
    { scope: f.isHeld, multiple: !0 }
  ],
  defmsg: a.cannot_read
});
new b("Purchase", {
  npcCmd: !0,
  rules: [S.testManipulate],
  objects: [
    { scope: f.isForSale }
  ],
  defmsg: a.cannot_purchase_here
});
new b("Sell", {
  npcCmd: !0,
  rules: [S.isHeldNotWorn, S.testManipulate],
  objects: [
    { scope: f.isHeld, multiple: !0 }
  ],
  defmsg: a.cannot_sell_here
});
new b("Smash", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresent],
  objects: [
    { scope: f.isHeld, multiple: !0 }
  ],
  defmsg: a.cannot_smash
});
new b("Turn", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isHere }
  ],
  defmsg: a.cannot_turn
});
new b("TurnLeft", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isHere }
  ],
  defmsg: a.cannot_turn
});
new b("TurnRight", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isHere }
  ],
  defmsg: a.cannot_turn
});
new b("SwitchOn", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  attName: "switchon",
  cmdCategory: "SwitchOn",
  objects: [
    { scope: f.isHeld, multiple: !0 }
  ],
  defmsg: a.cannot_switch_on
});
new b("SwitchOn2", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  attName: "switchon",
  cmdCategory: "SwitchOn",
  objects: [
    { scope: f.isHeld, multiple: !0 }
  ],
  defmsg: a.cannot_switch_on
});
new b("SwitchOff2", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  attName: "switchoff",
  cmdCategory: "SwitchOff",
  objects: [
    { scope: f.isHeld, multiple: !0, attName: "switchon" }
  ],
  defmsg: a.cannot_switch_off
});
new b("SwitchOff", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  attName: "switchoff",
  cmdCategory: "SwitchOff",
  objects: [
    { scope: f.isHeld, multiple: !0, attName: "switchoff" }
  ],
  defmsg: a.cannot_switch_off
});
new b("Open", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent, multiple: !0, attName: "open" }
  ],
  defmsg: a.cannot_open
});
new b("OpenWith", {
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent, multiple: !0, attName: "open" },
    { scope: f.isHeld, multiple: !0 }
  ],
  defmsg: a.cannot_open_with
});
new b("Close", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent, multiple: !0, attName: "close" }
  ],
  defmsg: a.cannot_close
});
new b("Lock", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent, multiple: !0, attName: "lock" }
  ],
  defmsg: a.cannot_lock
});
new b("LockWith", {
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent, attName: "lock" },
    { scope: f.isHeld, attName: "key" }
  ],
  defmsg: a.cannot_lock_with
});
new b("Unlock", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent, multiple: !0, attName: "unlock" }
  ],
  defmsg: a.cannot_unlock
});
new b("UnlockWith", {
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent, attName: "unlock" },
    { scope: f.isHeld, attName: "key" }
  ],
  defmsg: a.cannot_unlock_with
});
new b("Push", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.nothing_useful
});
new b("Pull", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.nothing_useful
});
new b("Fill", {
  npcCmd: !0,
  rules: [S.testManipulate],
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.cannot_fill
});
new b("Empty", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { scope: f.isPresent }
  ],
  defmsg: a.cannot_empty
});
new b("SmellItem", {
  npcCmd: !0,
  attName: "smell",
  objects: [
    { scope: f.isPresent, attName: "smell" }
  ],
  defmsg: a.cannot_smell
});
new b("ListenToItem", {
  npcCmd: !0,
  attName: "listen",
  objects: [
    { scope: f.isPresent, attName: "listen" }
  ],
  defmsg: a.cannot_listen
});
new b("Eat", {
  npcCmd: !0,
  rules: [S.isHeldNotWorn, S.testManipulate],
  objects: [
    { special: "text" },
    { scope: f.isHeld, multiple: !0, attName: "ingest" }
  ],
  defmsg: a.cannot_eat
});
new b("Drink", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { special: "text" },
    { scope: f.isPresent, attName: "ingest" }
  ],
  defmsg: a.cannot_drink
});
new b("Ingest", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { special: "text" },
    { scope: f.isPresent, attName: "ingest" }
  ],
  defmsg: a.cannot_ingest
});
new b("Sit", {
  npcCmd: !0,
  cmdCategory: "Posture",
  rules: [S.testPosture],
  attName: "siton",
  objects: [],
  script: function() {
    const t = mn((e) => e.siton && e.isAtLoc(g().loc));
    return log(t), t.length === 0 ? k(a.no_sit_object) : t[0].siton({ char: g(), item: t[0] }) ? h.SUCCESS : h.FAILED;
  }
});
new b("Recline", {
  npcCmd: !0,
  cmdCategory: "Posture",
  rules: [S.testPosture],
  attName: "reclineon",
  objects: [],
  script: function() {
    const t = mn((e) => e.reclineon && e.isAtLoc(g().loc));
    return log(t), t.length === 0 ? k(a.no_recline_object) : t[0].reclineon({ char: g(), item: t[0] }) ? h.SUCCESS : h.FAILED;
  }
});
new b("SitOn", {
  npcCmd: !0,
  cmdCategory: "Posture",
  rules: [S.testPosture, S.isHere],
  attName: "siton",
  objects: [
    { scope: f.isHere, attName: "assumePosture" }
  ],
  defmsg: a.cannot_sit_on
});
new b("StandOn", {
  npcCmd: !0,
  cmdCategory: "Posture",
  rules: [S.testPosture, S.isHere],
  attName: "standon",
  objects: [
    { scope: f.isHere, attName: "assumePosture" }
  ],
  defmsg: a.cannot_stand_on
});
new b("ReclineOn", {
  npcCmd: !0,
  cmdCategory: "Posture",
  rules: [S.testPosture, S.isHere],
  attName: "reclineon",
  objects: [
    { scope: f.isHere, attName: "assumePosture" }
  ],
  defmsg: a.cannot_recline_on
});
new b("GetOff", {
  npcCmd: !0,
  cmdCategory: "Posture",
  score: 5,
  // to give priority over TAKE
  rules: [S.testPosture, S.isHere],
  attName: "getoff",
  objects: [
    { scope: f.isHere, attName: "assumePosture" }
  ],
  defmsg: a.already
});
new b("Use", {
  npcCmd: !0,
  rules: [S.testManipulate, S.isPresentOrContained],
  objects: [
    { scope: f.isPresent }
  ],
  script: function(t) {
    const e = t[0][0], n = { char: g(), item: e, verb: "use" };
    if (e.useFunction)
      return e.useFunction(n) ? h.SUCCESS : h.FAILED;
    if (e.use)
      return this.processCommand(n) ? h.SUCCESS : h.FAILED;
    if (e.useDefaultsTo) {
      const s = Ue(e.useDefaultsTo(g()));
      if (s)
        return s.processCommand(n) ? h.SUCCESS : h.FAILED;
      throw new Error("USE command defaulting to unknown command " + e.useDefaultsTo());
    }
    return this.default({ char: g(), item: e }), h.FAILED;
  },
  defmsg: a.cannot_use
});
new b("TalkTo", {
  rules: [S.canTalkTo],
  attName: "talkto",
  objects: [
    { scope: f.isNpcAndHere }
  ],
  defmsg: a.cannot_talk_to
});
new b("Say", {
  script: function(t) {
    const e = [];
    for (let s in m)
      m[s].sayCanHear && m[s].sayCanHear(g(), t[0]) && e.push(m[s]);
    if (e.sort(function(s, r) {
      return r.sayPriority + r.sayBonus - (s.sayPriority + r.sayBonus);
    }), e.length === 0)
      return h.SUCCESS;
    const n = { char: g(), text: B(t[1]) };
    l.givePlayerSayMsg && x(a.say_something, n);
    for (let s of e)
      if (s.sayQuestion && s.respondToAnswer(t[1]) || s.sayResponse && s.sayResponse(t[1], t[0]))
        return h.SUCCESS;
    return l.givePlayerSayMsg ? x(a.say_no_response, n) : x(a.say_no_response_full, n), h.SUCCESS;
  },
  objects: [
    { special: "text" },
    { special: "text" }
  ]
});
new b("Stand", {
  rules: [S.testPosture],
  script: hs
});
new b("NpcStand", {
  rules: [S.testPosture],
  cmdCategory: "Posture",
  objects: [
    { scope: f.isHere, attName: "npc" }
  ],
  script: hs
});
new b("Make", {
  objects: [
    { scope: f.isUnconstructed, extendedScope: !0 }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.build({ char: g(), item: e }) ? h.SUCCESS : h.FAILED;
  }
});
new b("MakeWith", {
  objects: [
    { scope: f.isUnconstructed, extendedScope: !0 },
    { scope: f.isHere, multiple: !0 }
  ],
  script: function(t) {
    const e = t[0][0], n = { char: g(), item: e };
    return e.testComponents(t[1], n) && e.build(n) ? h.SUCCESS : h.FAILED;
  }
});
new b("NpcMake", {
  objects: [
    { scope: f.isUnconstructed }
  ],
  script: function(t) {
    const e = t[0][0];
    if (!e.npc)
      return k(a.not_npc, { char: g(), item: e });
    t.shift();
    const n = t[0][0];
    return n.build({ char: e, item: n }) ? h.SUCCESS : h.FAILED;
  }
});
new b("NpcMakeWith", {
  objects: [
    { scope: f.isUnconstructed },
    { scope: f.isHere, multiple: !0 }
  ],
  script: function(t) {
    const e = t[0][0];
    if (!e.npc)
      return k(a.not_npc, { char: g(), item: e });
    t.shift();
    const n = t[0][0], s = { char: e, item: n };
    return n.testComponents(t[1], s) && n.build(s) ? h.SUCCESS : h.FAILED;
  }
});
new b("FillWith", {
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { scope: f.isHeld },
    { special: "fluid" }
  ],
  script: function(t) {
    return Ut(g(), t[0][0], t[1]);
  }
});
new b("NpcFillWith", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Fill",
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isHeld },
    { special: "fluid" }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.npc ? (t.shift(), Ut(e, t[0][0], t[1])) : k(a.not_npc, { char: g(), item: e });
  }
});
new b("EmptyInto", {
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { scope: f.isHeld },
    { scope: f.isPresent }
  ],
  script: function(t) {
    return Qe(g(), t[0][0], t[1][0], void 0);
  }
});
new b("NpcEmptyInto", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Fill",
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isHeld },
    { scope: f.isPresent }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.npc ? (t.shift(), Qe(e, t[0][0], t[1][0], void 0)) : k(a.not_npc, { char: g(), item: e });
  }
});
new b("EmptyFluidInto", {
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { special: "fluid" },
    { scope: f.isPresent }
  ],
  script: function(t) {
    return ls(g(), t[1][0], t[0]);
  }
});
new b("NpcEmptyFluidInto", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Fill",
  objects: [
    { scope: f.isHere, attName: "npc" },
    { special: "fluid" },
    { scope: f.isPresent }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.npc ? (t.shift(), ls(e, t[1][0], t[0])) : k(a.not_npc, { char: g(), item: e });
  }
});
new b("PutFluidIn", {
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { special: "fluid" },
    { scope: f.isPresent, attName: "container" }
  ],
  script: function(t) {
    return Ut(g(), t[1][0], t[0]);
  }
});
new b("PutIn", {
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { scope: f.isHeld, multiple: !0 },
    { scope: f.isPresent, attName: "container" }
  ],
  script: function(t) {
    return Ke(g(), t, "drop", us);
  }
});
new b("NpcPutIn", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Drop/in",
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isHeldByNpc, multiple: !0 },
    { scope: f.isPresent, attName: "container" }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.npc ? (t.shift(), Ke(e, t, "drop", us)) : k(a.not_npc, { char: g(), item: e });
  }
});
new b("TakeOut", {
  rules: [S.testManipulate, S.isPresent],
  objects: [
    { scope: f.isContained, multiple: !0 },
    { scope: f.isPresent, attName: "container" }
  ],
  script: function(t) {
    return Ke(g(), t, "take", fs);
  }
});
new b("NpcTakeOut", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Take",
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isContained, multiple: !0 },
    { scope: f.isPresent, attName: "container" }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.npc ? (t.shift(), Ke(e, t, "take", fs)) : k(a.not_npc, { char: g(), item: e });
  }
});
new b("GiveTo", {
  rules: [S.testManipulate, S.isHeld],
  objects: [
    { scope: f.isHeld, multiple: !0 },
    { scope: f.isPresent, attName: "npc" }
  ],
  script: function(t) {
    return Ye(g(), t);
  }
});
new b("NpcGiveTo", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Give",
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isHeldByNpc, multiple: !0 },
    { scope: f.isPresentOrMe, attName: "npc" }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.npc ? (t.shift(), Ye(e, t)) : k(a.not_npc, { char: g(), item: e });
  }
});
new b("Give", {
  antiRegexes: [a.regex.GiveTo],
  matchItems: function(t) {
    if (!this._test(t) || !this._testNot(t))
      return;
    f.msg("---------------------------------------------------------"), f.msg("* Looking at candidate: " + this.name), this.tmp.objectTexts = [], this.tmp.objects = [], this.tmp.score = this.score ? this.score : 10, this.tmp.error = void 0;
    let e = this.tmp.regex.exec(t);
    e.shift();
    const n = h.scope, s = n.filter((o) => o.npc && o !== g()), r = U.fromTokens(e[0].split(" "), n);
    if (!r)
      return this.setError(f.NO_OBJECT, a.object_unknown_msg(e[0]));
    if (r[0].length === 1)
      if (r[0][0].npc)
        this.tmp.objects[1] = r[0], r.shift(), this.tmp.objects[0] = r;
      else {
        if (s.length === 0)
          return this.setError(f.NO_OBJECT, a.object_unknown_msg(e[0]));
        this.tmp.objects[1] = s, this.tmp.objects[0] = r;
      }
    else {
      const o = r[0].filter((c) => c.npc);
      if (o.length === 0) {
        if (s.length === 0)
          return this.setError(f.NO_OBJECT, a.no_receiver);
        this.tmp.objects[1] = s, this.tmp.objects[0] = r;
      } else
        o.length === 1 ? (this.tmp.objects[1] = [o[0]], r.shift(), this.tmp.objects[0] = r) : (this.tmp.objects[1] = [o], r.shift(), this.tmp.objects[0] = r);
    }
    for (let o = 0; o < this.tmp.objects[0].length; o++) {
      const c = this.tmp.objects[0][o];
      if (c.length === 1)
        this.tmp.objects[0][o] = c[0];
      else {
        const d = c.filter((p) => p.loc === g().name);
        d.length === 1 ? this.tmp.objects[0][o] = d[0] : d.length > 1 && (this.tmp.objects[0][o] = d);
      }
    }
    this.tmp.score = 10, f.msg("..Base score: " + this.tmp.score);
  },
  script: function(t) {
    return Ye(g(), t);
  }
});
new b("NpcGive", {
  antiRegexes: a.regex.NpcGiveTo,
  matchItems: function(t) {
    if (!this._test(t) || !this._testNot(t))
      return;
    f.msg("---------------------------------------------------------"), f.msg("* Looking at candidate: " + this.name), this.tmp.objectTexts = [], this.tmp.objects = [], this.tmp.score = this.score ? this.score : 10, this.tmp.error = void 0;
    let e = this.tmp.regex.exec(t);
    e.shift();
    const n = h.scope;
    let s;
    const r = e.shift(), o = f.findInList(r, n, {});
    if (o.length === 0)
      return this.setError(f.NO_OBJECT, a.object_unknown_msg(r));
    o.length === 1 ? s = o[0] : (o.filter((p) => (p.npc || p.player) && p !== s), o.length === 0 ? s = o : o.length === 1 ? s = o[0] : s = o);
    const c = n.filter((p) => (p.npc || p.player) && p !== s), d = U.fromTokens(e[0].split(" "), n);
    if (!d)
      return this.setError(f.NO_OBJECT, a.object_unknown_msg(e[0]));
    if (d[0].length === 1)
      if (d[0][0].npc || d[0][0] === g())
        this.tmp.objects[1] = d[0], d.shift(), this.tmp.objects[0] = d;
      else {
        if (c.length === 0)
          return this.setError(f.NO_OBJECT, a.object_unknown_msg(e[0]));
        this.tmp.objects[1] = c, this.tmp.objects[0] = d;
      }
    else {
      const p = d[0].filter((v) => v.npc || v.player);
      if (p.length === 0) {
        if (c.length === 0)
          return this.setError(f.NO_OBJECT, a.no_receiver);
        this.tmp.objects[1] = c, this.tmp.objects[0] = d;
      } else
        p.length === 1 ? (this.tmp.objects[1] = [p[0]], d.shift(), this.tmp.objects[0] = d) : (this.tmp.objects[1] = [p], d.shift(), this.tmp.objects[0] = d);
    }
    for (let p = 0; p < this.tmp.objects[0].length; p++) {
      const v = this.tmp.objects[0][p];
      if (v.length === 1)
        this.tmp.objects[0][p] = v[0];
      else {
        const N = v.filter((F) => F.loc === s.name);
        N.length === 1 ? this.tmp.objects[0][p] = N[0] : N.length > 1 && (this.tmp.objects[0][p] = N);
      }
    }
    this.tmp.objects.unshift([s]), this.tmp.score = 10, f.msg("..Base score: " + this.tmp.score);
  },
  script: function(t) {
    const e = t[0][0];
    return t.shift(), Ye(e, t);
  }
});
new b("LookExit", {
  script: function(t) {
    const e = hn(t[0]), n = "look_" + e, s = E()[e], r = { char: g(), dir: e, exit: s };
    if (typeof E()[n] == "function")
      return E()[n](r) ? h.SUCCESS : h.FAILED;
    if (!s || s.isHidden())
      return k(a.no_look_that_way, r);
    if (s.isLocked())
      return k(a.locked_exit, { char: g(), exit: s });
    if (r.dest = m[s.name], E()[n])
      x(E()[n], r);
    else {
      if (typeof s.look == "function")
        return s.look(r);
      if (s.look)
        x(s.look, r);
      else
        return x(a.default_look_exit, r), h.SUCCESS_NO_TURNSCRIPTS;
    }
    return h.SUCCESS;
  },
  objects: [
    { special: "text" }
  ]
});
new b("PushExit", {
  rules: [S.testManipulate, S.isHere],
  cmdCategory: "Push",
  script: function(t) {
    return ds(g(), t);
  },
  objects: [
    { special: "text" },
    { scope: f.isHere, attName: "shiftable" },
    { special: "text" }
  ]
});
new b("NpcPushExit", {
  rules: [S.testManipulate, S.isHere],
  cmdCategory: "Push",
  script: function(t) {
    const e = t[0][0];
    return e.npc ? (t.shift(), ds(e, t)) : k(a.not_npc, { char: g(), item: e });
  },
  objects: [
    { scope: f.isHere, attName: "npc" },
    { special: "text" },
    { scope: f.isHere, attName: "shiftable" },
    { special: "text" }
  ]
});
new b("TieUp", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Tie",
  objects: [
    { scope: f.isHeld, attName: "rope" }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.rope ? e.handleTieTo(g()) : k(a.rope_not_attachable, { rope: e, char: g() });
  }
});
new b("TieTo", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Tie",
  objects: [
    { scope: f.isHeld, attName: "rope" },
    { scope: f.isHere, attName: "attachable" }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.rope ? e.handleTieTo(g(), t[1][0]) : k(a.rope_not_attachable, { rope: e, char: g() });
  }
});
new b("NpcTieUp", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Tie",
  script: function(t) {
    const e = t[0][0];
    if (!e.npc)
      return k(a.not_npc, { char: g(), item: e });
    t.shift();
    const n = t[0][0];
    return n.rope ? n.handleTieTo(e) : k(a.rope_not_attachable, { rope: n, char: e });
  },
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isHeld, attName: "rope" }
  ]
});
new b("NpcTieTo", {
  rules: [S.testManipulate, S.isHeld],
  cmdCategory: "Tie",
  script: function(t) {
    const e = t[0][0];
    if (!e.npc)
      return k(a.not_npc, { char: g(), item: e });
    t.shift();
    const n = t[0][0];
    return n.rope ? n.handleTieTo(e, t[1][0]) : k(a.rope_not_attachable, { rope: n, char: e });
  },
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isHeld, attName: "rope" },
    { scope: f.isHere, attName: "attachable" }
  ]
});
new b("Untie", {
  rules: [S.testManipulate, S.isPresent],
  cmdCategory: "Untie",
  objects: [
    { scope: f.isHere, attName: "rope" }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.rope ? e.handleUntieFrom(g()) : k(a.rope_not_attachable, { rope: e, char: g() });
  }
});
new b("NpcUntie", {
  rules: [S.testManipulate, S.isPresent],
  cmdCategory: "Tie",
  script: function(t) {
    const e = t[0][0];
    if (!e.npc)
      return k(a.not_npc, { char: g(), item: e });
    t.shift();
    const n = t[0][0];
    return n.rope ? n.handleUntieFrom(e) : k(a.rope_not_attachable, { rope: n, char: e });
  },
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isHeld, attName: "rope" }
  ]
});
new b("UntieFrom", {
  rules: [S.testManipulate, S.isPresent],
  cmdCategory: "Untie",
  objects: [
    { scope: f.isHere, attName: "rope" },
    { scope: f.isHere, attName: "attachable" }
  ],
  script: function(t) {
    const e = t[0][0];
    return e.rope ? e.handleUntieFrom(g(), t[1][0]) : k(a.rope_not_attachable, { rope: e, char: npc });
  }
});
new b("NpcUntieFrom", {
  rules: [S.testManipulate, S.isPresent],
  cmdCategory: "Tie",
  script: function(t) {
    const e = t[0][0];
    if (!e.npc)
      return k(a.not_npc, { char: g(), item: e });
    t.shift();
    const n = t[0][0];
    return n.rope ? n.handleUntieFrom(e, t[1][0]) : k(a.rope_not_attachable, { rope: n, char: e });
  },
  objects: [
    { scope: f.isHere, attName: "npc" },
    { scope: f.isHere, attName: "rope" },
    { scope: f.isHere, attName: "attachable" }
  ]
});
new b("UseWith", {
  //npcCmd:true,
  rules: [S.testManipulate, S.isPresent],
  objects: [
    { scope: f.isPresent },
    { scope: f.isPresent }
  ],
  script: function(t) {
    const e = t[0][0], n = t[1][0];
    if (e.useWith)
      return e.useWith(g(), n) ? h.SUCCESS : h.FAILED;
    if (n.withUse)
      return n.withUse(g(), e) ? h.SUCCESS : h.FAILED;
    if (e.useWithDefaultsTo) {
      const s = Ue(e.useWithDefaultsTo());
      if (s)
        return s.script(t) ? h.SUCCESS : h.FAILED;
      throw new Error("USE command defaulting to unknown command " + e.useWithDefaultsTo);
    }
    if (n.withUseDefaultsTo) {
      const s = Ue(n.withUseDefaultsTo());
      if (s)
        return s.script(t) ? h.SUCCESS : h.FAILED;
      throw new Error("USE command defaulting to unknown command " + n.withUseDefaultsTo);
    }
    return this.default({ char: g(), item: e }), h.FAILED;
  },
  defmsg: a.cannot_use
});
new b("FollowMe", {
  objects: [
    { scope: f.isHere, attName: "npc" }
  ],
  script: function(t) {
    const e = t[0][0], n = { char: g(), npc: e };
    return e.npc ? e.getAgreement("Follow") && e.startFollow() ? h.SUCCESS : h.FAILED : k(a.cannot_follow, n);
  }
});
new b("WaitHere", {
  objects: [
    { scope: f.isHere, attName: "npc" }
  ],
  script: function(t) {
    const e = t[0][0], n = { item: e };
    return e.npc ? e.endFollow() ? h.SUCCESS : h.FAILED : L(a.cannot_wait, n);
  }
});
new b("AskAbout", {
  rules: [S.canTalkTo],
  script: function(t) {
    return g().testTalk() ? t[0][0].askabout ? t[0][0].askabout(t[2], t[1]) ? h.SUCCESS : h.FAILED : k(a.cannot_ask_about, { char: g(), item: t[0][0], text: t[2] }) : !1;
  },
  objects: [
    { scope: f.isNpcAndHere },
    { special: "text" },
    { special: "text" }
  ]
});
new b("TellAbout", {
  rules: [S.canTalkTo],
  script: function(t) {
    return g().testTalk() ? t[0][0].tellabout ? t[0][0].tellabout(t[2], t[1]) ? h.SUCCESS : h.FAILED : k(a.cannot_tell_about, { char: g(), item: t[0][0], text: t[1] }) : !1;
  },
  objects: [
    { scope: f.isNpcAndHere },
    { special: "text" },
    { special: "text" }
  ]
});
new b("TalkAbout", {
  rules: [S.canTalkTo],
  //score:1, // to override TALK TO
  script: function(t) {
    return g().testTalk() ? !t[0][0].tellabout && !t[0][0].askabout ? k(a.cannot_tell_about, { char: g(), item: t[0][0], text: t[1] }) : t[0][0].talkabout(t[2], t[1]) ? h.SUCCESS : h.FAILED : !1;
  },
  objects: [
    { scope: f.isNpcAndHere },
    { special: "text" },
    { special: "text" }
  ]
});
for (const t of ["In", "Out", "Up", "Down", "Through"])
  new b("Go" + t + "Item", {
    objects: [{ scope: f.isHere, attName: "go" + t + "Direction" }],
    dirType: t,
    script: function(e) {
      return typeof e[0][0]["go" + this.dirType + "Item"] == "string" ? k(e[0][0]["go" + this.dirType + "Item"], { char: g(), item: e[0][0] }) : E().goItem(e[0][0], this.dirType);
    }
  }), new b("NpcGo" + t + "Item", {
    objects: [
      { scope: f.isHere, attName: "npc" },
      { scope: f.isHere, attName: "go" + t + "Direction" }
    ],
    dirType: t,
    script: function(e) {
      return typeof e[1][0]["go" + this.dirType + "Item"] == "string" ? k(e[1][0]["go" + this.dirType + "Item"], { char: e[0][0], item: e[1][0] }) : E().goItem(e[1][0], this.dirType, e[0][0]);
    }
  });
for (const t of a.questions)
  new b("Question" + fn(t.q), {
    regex: new RegExp("^" + t.q + "\\??$"),
    objects: [],
    script: t.script
  });
l.playMode === "dev" && (new b("DebugWalkThrough", {
  objects: [
    { special: "text" }
  ],
  script: function(t) {
    if (typeof walkthroughs > "u")
      return C("No walkthroughs set"), h.FAILED;
    const e = walkthroughs[t[0]];
    if (e === void 0)
      return k("No walkthrough found called " + t[0]);
    l.walkthroughInProgress = !0;
    for (let n of e)
      typeof n == "string" ? ce(n) : typeof n == "function" ? n() : (l.walkthroughMenuResponses = Array.isArray(n.menu) ? n.menu : [n.menu], ce(n.cmd), l.walkthroughMenuResponses = []);
    return l.walkthroughInProgress = !1, h.SUCCESS_NO_TURNSCRIPTS;
  }
}), new b("DebugInspect", {
  script: function(t) {
    const e = t[0][0];
    return W("See the console for details on the object " + e.name + " (press F12 to world. the console)"), console.log(e), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { scope: f.isInWorld }
  ]
}), new b("DebugInspectByName", {
  script: function(t) {
    const e = t[0];
    return m[e] ? (W("See the console for details on the object " + e + " (press F12 to world. the console)"), console.log(m[e]), h.SUCCESS_NO_TURNSCRIPTS) : (W("No object called " + e), h.FAILED);
  },
  objects: [
    { special: "text" }
  ]
}), new b("DebugWarpName", {
  script: function(t) {
    const e = m[t[0]];
    return e ? (e.room ? (g().loc = e.name, W("Moved to " + e.name)) : (e.loc = g().name, delete e.scenery, W("Retrieved " + e.name + ' (as long as it uses the "loc" attribute normally)')), h.SUCCESS) : (W("No object called " + t[0]), h.FAILED);
  },
  objects: [
    { special: "text" }
  ]
}), new b("DebugTest", {
  script: function() {
    return l.tests ? typeof R.runTests != "function" ? (console.log(R), h.FAILED) : (R.runTests(), h.SUCCESS_NO_TURNSCRIPTS) : (C("The TEST command is for unit testing during game development, and is not activated (F12 for more)."), console.log("To activate testing in your game, set settings.tests to true. More details here: https://github.com/ThePix/QuestJS/wiki/Unit-testing"), h.SUCCESS_NO_TURNSCRIPTS);
  }
}), new b("DebugInspectCommand", {
  script: function(t) {
    W("Looking for " + t[0]);
    for (let e of te)
      if (e.name.toLowerCase() === t[0] || e.cmdCategory && e.cmdCategory.toLowerCase() === t[0]) {
        W("Name: " + e.name);
        for (let n in e)
          e.hasOwnProperty(n) && W("--" + n + ": " + e[n]);
      }
    return h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: [
    { special: "text" }
  ]
}), new b("DebugListCommands", {
  script: function(t) {
    let e = 0;
    for (let n of te)
      if (!n.name.match(/\d$/)) {
        let s = n.name + " (" + n.regex, r, o = 2;
        do
          r = te.find((d) => d.name === n.name + o), r && (s += " or " + r.regex), o++;
        while (r);
        s += ")", te.find((d) => d.name === "Npc" + n.name + "2") && (s += " - NPC too"), W(s), e++;
      }
    return W("... Found " + e + " commands."), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: []
}), new b("DebugListCommands2", {
  script: function(t) {
    let e = 0;
    for (let n of te) {
      let s = n.name + " (" + n.regex + ")";
      W(s), e++;
    }
    return W("... Found " + e + " commands."), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: []
}), new b("DebugParserToggle", {
  script: function(t) {
    return f.debug ? (f.debug = !1, W("Parser debugging messages are off.")) : (f.debug = !0, W("Parser debugging messages are on.")), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: []
}), new b("DebugStats", {
  script: function(t) {
    for (const e of l.statsData)
      e.count = 0;
    for (const e in m)
      for (const n of l.statsData) {
        const s = n.test(m[e]);
        s === !0 && n.count++, typeof s == "number" && (n.count += s);
      }
    for (const e of l.statsData)
      W(e.name + ": " + e.count);
    return h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: []
}), new b("DebugHighlight", {
  script: function(t) {
    for (const e of document.querySelectorAll(".parser"))
      e.style.color = "black", e.style.backgroundColor = "yellow";
    for (const e of document.querySelectorAll(".error"))
      e.style.backgroundColor = "yellow";
    for (const e of document.querySelectorAll(".meta"))
      e.style.color = "black", e.style.backgroundColor = "#8f8";
    return W("Previous parser and error messages are now highlighted."), h.SUCCESS_NO_TURNSCRIPTS;
  },
  objects: []
}), new b("MetaTranscriptWalkthrough", {
  script: function() {
    return I.transcriptWalk(), h.SUCCESS_NO_TURNSCRIPTS;
  }
}));
function Ut(t, e, n) {
  const s = { fluid: n };
  return T.findSource(s) ? s.source.vessel ? Qe(t, s.source, e, s.fluid) : Mi(t, s.source, e, s.fluid) : k(n ? a.no_fluid_here : a.no_fluid_here_at_all, s);
}
function Qe(t, e, n, s) {
  s || (s = e.containedFluidName);
  const r = { char: t, source: e, fluid: s, item: n };
  return e.vessel ? e.closed ? k(a.container_closed, r) : e.containedFluidName ? !n.vessel && !n.sink ? k(a.not_sink, r) : n.vessel && n.containedFluidName ? k(a.already_full, r) : !t.testManipulate(e, "fill") || !t.getAgreement("Fill", { source: e, sink: n, fluid: s }) ? h.FAILED : e.isAtLoc(t.name) ? e.containedFluidName !== s ? k(a.no_fluid_here, r) : e.doEmpty(r) ? h.SUCCESS : h.FAILED : k(a.not_carrying, r) : k(a.already_empty, r) : k(a.not_vessel, r);
}
function Mi(t, e, n, s) {
  const r = { char: t, source: e, fluid: s, item: n };
  return e.isSourceOf ? e.closed ? k(a.container_closed, r) : n.vessel ? n.containedFluidName ? k(a.already_full, r) : !t.testManipulate(n, "fill") || !t.getAgreement("Fill", { source: e, sink: n, fluid: s }) ? h.FAILED : !e.room && !e.isAtLoc(t.loc) ? k(a.not_here, r) : e.isSourceOf(s) ? n.doFill(r) ? h.SUCCESS : h.FAILED : k(a.no_fluid_here, r) : k(a.not_vessel, r) : k(a.not_source, r);
}
function ls(t, e, n) {
  for (const s in m) {
    const r = m[s];
    if (r.vessel && r.containedFluidName === n && r.loc === t.name)
      return Qe(t, r, e, n);
  }
  return k(a.not_carrying_fluid, { char: t, fluid: n });
}
function Ke(t, e, n, s) {
  let r = !1;
  const o = e[1][0], c = { char: t, container: o, verb: n, multiple: e[0].length > 1 || f.currentCommand.all };
  if (o.handleInOutContainer)
    return o.handleInOutContainer(c, e[0]);
  if (!o.container)
    return k(a.not_container, c);
  if (o.closed) {
    if (o.containerAutoOpen) {
      if (!o.open({ char: t, item: o }))
        return !1;
    } else if (!o.containerIgnoreClosed)
      return k(a.container_closed, c);
  }
  for (const d of e[0]) {
    if (!t.testManipulate(d, n))
      return h.FAILED;
    c.count = d.countable ? d.extractNumber() : void 0, c.item = d, c.count && (c[d.name + "_count"] = c.count);
    const p = s(t, o, d, c);
    r = r || p;
  }
  return r && t.pause(), r ? h.SUCCESS : h.FAILED;
}
function us(t, e, n, s) {
  if (s.fromLoc = t.name, s.toLoc = e.name, !!t.getAgreement("Drop/in", { item: n, container: e }))
    return !e.testForRecursion(t, n) || n.testDrop && !n.testDrop(s) ? !1 : n.msgDropIn ? e.testDropIn && !e.testDropIn(s) ? !1 : n.isAtLoc(t.name) ? (n.getTakeDropCount && n.getTakeDropCount(s, t.name), typeof n.msgDropIn == "function" ? n.msgDropIn(s) : x(n.msgDropIn, s), n.moveToFrom(s), !0) : k(a.not_carrying, { char: t, item: n }) : L(a.cannot_drop, s);
}
function fs(t, e, n, s) {
  return s.toLoc = t.name, s.fromLoc = e.name, t.getAgreement("Take", { item: n }) ? n.isAtLoc(e.name) ? (n.getTakeDropCount && n.getTakeDropCount(s, e.name), n.testTake && !n.testTake(s) || e.testTakeOut && !e.testTakeOut(s) ? !1 : (x(n.msgTakeOut, s), n.moveToFrom(s), !0)) : k(a.not_inside, { container: e, item: n }) : !1;
}
function Ye(t, e) {
  let n = !1;
  const s = e[1][0], r = e[0].length > 1 || f.currentCommand.all;
  if (!s.npc && s !== g())
    return k(a.not_npc_for_give, { char: t, item: s });
  s.handleGiveTo || log(s);
  for (const o of e[0]) {
    const c = s.handleGiveTo({ char: t, npc: s, multiple: r, item: o, toLoc: s.name, fromLoc: t.name });
    n = n || c;
  }
  return n == h.SUCCESS && t.pause(), n ? h.SUCCESS : h.FAILED;
}
function hs(t) {
  let e;
  if (t.length === 0)
    e = g();
  else {
    const n = t[0][0];
    if (!n.npc)
      return k(a.not_npc, { char: g(), item: n }), h.FAILED;
    if (!n.posture)
      return k(a.already, { item: n }), h.FAILED;
    if (!n.getAgreement("Posture", { posture: "stand" }))
      return h.FAILED;
    e = n;
  }
  if (!e.testPosture())
    return h.FAILED;
  if (e.posture)
    return x(a.stop_posture(e)), e.pause(), h.SUCCESS;
}
function ds(t, e) {
  const n = e[0], s = e[1][0], r = hn(e[2]), o = m[t.loc], c = { char: t, item: s, dir: r };
  if (!s.shiftable && s.takeable)
    return k(a.take_not_push, c);
  if (!s.shiftable)
    return k(a.cannot_push, c);
  if (!o[r] || o[r].isHidden())
    return k(a.not_that_way, c);
  if (o[r].isLocked())
    return k(a.locked_exit, { char: t, exit: o[r] });
  if (typeof o[r].noShiftingMsg == "function")
    return k(o[r].noShiftingMsg(t, item));
  if (typeof o[r].noShiftingMsg == "string")
    return k(o[r].noShiftingMsg);
  if (!t.getAgreement("Push", { item: s, dir: r }))
    return !1;
  if (typeof s.shift == "function")
    return s.shift(t, r, n) ? h.SUCCESS : h.FAILED;
  if (r === "up")
    return x(a.cannot_push_up, c), h.FAILED;
  const d = o[r].name;
  return s.moveToFrom({ char: t, toLoc: d, item: s }), t.loc = d, c.dest = m[d], x(a.push_exit_successful, c), h.SUCCESS;
}
export {
  Ri as AGENDA_FOLLOWER,
  Yo as BACKSCENE,
  ra as BUTTON,
  rs as BUTTON_DICTIONARY,
  is as CHARACTER,
  Zo as COMPONENT,
  na as CONSTRUCTION,
  Fi as CONSULTABLE,
  Go as CONTAINER,
  $i as COUNT,
  Bo as COUNTABLE,
  b as Cmd,
  Ds as DEFAULT_ITEM,
  Fs as DEFAULT_OBJECT,
  Ps as DEFAULT_ROOM,
  ji as DEFINITE,
  ea as EDIBLE,
  aa as EXIT_FAKER,
  ne as Exit,
  As as ExitCmd,
  Jo as FURNITURE,
  Ui as INDEFINITE,
  Qo as KEY,
  zo as LOCKED_DOOR,
  Li as LOCKED_WITH,
  Oi as Link,
  Wo as MERCH,
  da as NPC,
  Z as NULL_FUNC,
  Ls as NpcCmd,
  Os as NpcExitCmd,
  Ii as OPENABLE,
  ss as OPENABLE_DICTIONARY,
  no as OutputTextNoBr,
  la as PLAYER,
  Pi as Question,
  Ko as READABLE,
  oa as ROOM_SET,
  sa as ROPE,
  $o as SHIFTABLE,
  Vo as SURFACE,
  Xo as SWITCHABLE,
  jo as TAKEABLE,
  pe as TAKEABLE_DICTIONARY,
  Di as TOPIC,
  ca as TRANSIT,
  ia as TRANSIT_BUTTON,
  ta as VESSEL,
  qo as WEARABLE,
  $ as _msg,
  ee as agenda,
  Cs as ambient,
  U as array,
  Is as askDiag,
  Ns as askText,
  fo as blankLine,
  qi as c,
  yn as clearScreen,
  as as cloneObject,
  S as cmdRules,
  te as commands,
  gn as commentmsg,
  fa as copyObject,
  wo as createAdditionalPane,
  Ho as createEnsemble,
  Mt as createItem,
  os as createItemOrRoom,
  Ai as createObject,
  ua as createRoom,
  Hi as debuglog,
  W as debugmsg,
  ie as displayMoney,
  Wt as displayNumber,
  Bi as doOnce,
  uo as draw,
  ue as endTurnUI,
  _ as errormsg,
  _o as extractChar,
  k as failedmsg,
  L as falsemsg,
  Ue as findCmd,
  K as formatList,
  O as game,
  hn as getDir,
  pn as getResponseList,
  ls as handleEmptyFluidInto,
  Mi as handleFillFromSource,
  Ut as handleFillFromUnknown,
  Qe as handleFillFromVessel,
  Ye as handleGiveToNpc,
  Ke as handleInOutContainer,
  ds as handlePushExit,
  us as handleSingleDropInContainer,
  fs as handleSingleTakeOutContainer,
  hs as handleStandUp,
  ho as hr,
  ao as image,
  Rs as initCommands,
  u as io,
  a as lang,
  Qi as listProperties,
  E as loc,
  z as log,
  C as metamsg,
  x as msg,
  so as msgBlankLine,
  ro as msgDiv,
  Gt as msgHeading,
  io as msgList,
  to as msgPre,
  Ts as msgTable,
  un as npc_utilities,
  f as parser,
  Wi as parserlog,
  at as parsermsg,
  oo as picture,
  g as player,
  zi as prefix,
  ot as printError,
  me as printOrRun,
  Q as processText,
  Yi as rChunkString,
  M as random,
  xt as rawPrint,
  re as regions,
  le as respond,
  eo as run,
  ce as runCmd,
  Me as saveAs,
  I as saveLoad,
  Zi as scopeAllNpcHere,
  mn as scopeBy,
  Ji as scopeHeldBy,
  dn as scopeHereListed,
  _s as scopeHereParser,
  Xi as scopeNpcHere,
  Ct as scopeReachable,
  B as sentenceCase,
  bs as sentenceCaseForHTML,
  Tt as setPlayer,
  ha as setRegion,
  l as settings,
  bo as showDiag,
  wn as showDropDown,
  kt as showMenu,
  Es as showMenuDiag,
  ks as showMenuNumbersOnly,
  bn as showMenuWithNumbers,
  yo as showYesNoDropDown,
  po as showYesNoMenu,
  go as showYesNoMenuWithNumbers,
  co as sound,
  Vi as spaces,
  R as test,
  vo as testCmd,
  Gi as titleCase,
  ws as titleCaseForHTML,
  Ki as toRoman,
  y as tp,
  mo as trigger,
  T as util,
  fn as verbify,
  lo as video,
  m as w,
  xs as wait,
  V as warningFor,
  h as world
};
//# sourceMappingURL=quest.js.map

(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.quest = {}));
})(this, function(exports2) {
  "use strict";
  const INDEFINITE = 1;
  const DEFINITE = 2;
  const COUNT = 3;
  const NULL_FUNC = function() {
  };
  const test = {};
  test.testing = false;
  const log$1 = console.log;
  const debuglog = (s) => {
    if (settings.playMode === "dev" || settings.playMode === "beta") {
      log$1(s);
    }
  };
  const parserlog = (s) => {
    if (parser.debug) {
      log$1(s);
    }
  };
  function runCmd(cmd) {
    io.msgInputText(cmd);
    parser.parse(cmd);
  }
  function doOnce(o, s) {
    if (s === void 0)
      s = "unspecifiedDoOnceFlag";
    if (o[s])
      return false;
    o[s] = true;
    return true;
  }
  function c(str) {
    if (saveLoad.transcript) {
      commentmsg("Comment: " + str);
      return "Comment added to transcript";
    } else {
      return "This function is designed for adding comments whilst recording a transcript. You have are not currently recording a transcript.";
    }
  }
  function printOrRun(char2, item2, attname, options) {
    if (options === void 0)
      options = {};
    if (!options.char)
      options.char = char2;
    if (!options.item)
      options.item = item2;
    if (typeof item2[attname] === "string") {
      let s = item2[attname];
      if (item2[attname + "Addendum"])
        s += item2[attname + "Addendum"](char2);
      msg(s, options);
      return true;
    } else if (typeof item2[attname] === "function") {
      return item2[attname](options);
    } else {
      const s = "Unsupported type for printOrRun (" + attname + " is a " + typeof item2[attname] + ").";
      errormsg(s);
      throw new Error(s);
    }
  }
  function verbify(s) {
    return s.toLowerCase().replace(/[^a-zA-Z0-9_]/g, "");
  }
  const random = {
    buffer: []
  };
  random.int = function(n1, n2) {
    if (this.buffer.length > 0)
      return this.buffer.shift();
    if (n2 === void 0) {
      n2 = n1;
      n1 = 0;
    }
    return Math.floor(Math.random() * (n2 - n1 + 1)) + n1;
  };
  random.chance = function(percentile) {
    return random.int(99) < percentile;
  };
  random.fromArray = function(arr, deleteEntry) {
    if (typeof arr === "string")
      arr.split("|");
    if (arr.length === 0)
      return null;
    const index = random.int(arr.length - 1);
    const res = arr[index];
    if (deleteEntry)
      arr.splice(index, 1);
    return res;
  };
  random.shuffle = function(arr) {
    if (typeof arr === "number")
      arr = [...Array(arr).keys()];
    const res = [];
    while (arr.length > 0) {
      res.push(random.fromArray(arr, true));
    }
    return res;
  };
  random.dice = function(s, average) {
    if (typeof s === "number")
      return s;
    s = s.replace(/ /g, "").replace(/\-/g, "+-");
    let total = 0;
    random.diceLog = [];
    for (let dice of s.split("+")) {
      if (dice === "")
        continue;
      let negative = 1;
      if (/^\-/.test(dice)) {
        dice = dice.substring(1);
        negative = -1;
      }
      total += negative * random.diceSubPart(dice, average);
    }
    return total;
  };
  random.diceSubPart = function(dice, average) {
    if (/^\d+$/.test(dice))
      return parseInt(dice);
    if (/^d/.test(dice))
      dice = "1" + dice;
    const match = /^(\d+)[dD]([0-9\:]+)([hHlLeErRcC])?(\d+)?/.exec(dice);
    if (!match)
      return errormsg("Can't parse dice type: " + dice);
    let rolls = [];
    const number = parseInt(match[1]);
    const sides = match[2];
    for (let i2 = 0; i2 < number; i2++) {
      const n = random.diceRoll(sides, average);
      rolls.push(n);
    }
    if (match[3] === "h" || match[3] === "H") {
      const highestOf = match[4] ? parseInt(match[4]) : 1;
      rolls = rolls.sort(function(a, b) {
        return b - a;
      }).slice(0, highestOf);
    }
    if (match[3] === "l" || match[3] === "L") {
      const highestOf = match[4] ? parseInt(match[4]) : 1;
      rolls = rolls.sort(function(a, b) {
        return a - b;
      }).slice(0, highestOf);
    }
    if (match[3] === "e" || match[3] === "E") {
      const explodeOn = match[4] ? parseInt(match[4]) : parseInt(sides);
      if (explodeOn < 2)
        return errormsg("Bad exploding dice will crash the game: " + dice);
      let exploderCount = rolls.filter((el) => el >= explodeOn).length;
      for (let i2 = 0; i2 < exploderCount; i2++) {
        const n = random.diceRoll(sides, average);
        rolls.push(n);
        if (match[3] === "E" && n >= explodeOn)
          exploderCount++;
      }
    }
    if (match[3] === "r") {
      const rerollOn = match[4] ? parseInt(match[4]) : 1;
      for (let i2 = 0; i2 < rolls.length; i2++) {
        if (rolls[i2] <= rerollOn)
          rolls[i2] = random.diceRoll(sides, average);
      }
    }
    if (match[3] === "R") {
      const rerollOn = match[4] ? parseInt(match[4]) : 1;
      for (let i2 = 0; i2 < rolls.length; i2++) {
        while (rolls[i2] <= rerollOn)
          rolls[i2] = random.diceRoll(sides, average);
      }
    }
    if (match[3] === "C") {
      const countIf = parseInt(match[4]);
      for (let i2 = 0; i2 < rolls.length; i2++) {
        rolls[i2] = rolls[i2] >= countIf ? 1 : 0;
      }
    }
    if (match[3] === "c") {
      const countIf = parseInt(match[4]);
      for (let i2 = 0; i2 < rolls.length; i2++) {
        rolls[i2] = rolls[i2] <= countIf ? 1 : 0;
      }
    }
    let total = 0;
    for (const n of rolls)
      total += n;
    return total;
  };
  random.diceRoll = function(s, average) {
    if (average) {
      if (/^\d+$/.test(s))
        return parseInt(s) / 2 + 0.5;
      let total = 0;
      const ary = s.split(":");
      for (const s2 of ary) {
        log$1(total);
        total += parseInt(s2);
      }
      log$1(total);
      return total / ary.length;
    }
    const n = /^\d+$/.test(s) ? random.int(1, parseInt(s)) : parseInt(random.fromArray(s.split(":")));
    random.diceLog.push(n);
    return n;
  };
  random.prime = function(ary) {
    if (typeof ary === "number")
      ary = [ary];
    this.buffer = ary;
  };
  function sentenceCase(str) {
    if (str.length === 0)
      return "";
    return str.replace(str[0], str[0].toUpperCase());
  }
  function titleCase(str) {
    return str.toLowerCase().split(" ").map((el) => el.replace(el[0], el[0].toUpperCase())).join(" ");
  }
  function sentenceCaseForHTML(str) {
    const template = document.createElement("template");
    template.innerHTML = str.trim();
    let node2 = template.content;
    while (node2.hasChildNodes())
      node2 = node2.firstChild;
    node2.textContent = sentenceCase(node2.textContent);
    return template.innerHTML;
  }
  function titleCaseForHTML(str) {
    return '<span style="text-transform: capitalize;">' + str + "</span>";
  }
  function spaces(n) {
    return "&nbsp;".repeat(n);
  }
  function prefix(item2, options) {
    if (!options.multiple) {
      return "";
    }
    return sentenceCase(item2.alias) + ": ";
  }
  function warningFor(o, msg2) {
    log$1("Warning for " + o.name + ": " + msg2);
  }
  function formatList(itemArray, options) {
    if (options === void 0) {
      options = {};
    }
    if (options.lastJoiner && !options.lastSep)
      options.lastSep = options.lastJoiner;
    if (itemArray.length === 0) {
      return options.nothing ? options.nothing : "";
    }
    if (!options.sep)
      options.sep = ",";
    if (!options.separateEnsembles) {
      const toRemove = [];
      const toAdd = [];
      for (let item2 of itemArray) {
        if (item2.ensembleMaster && item2.ensembleMaster.isAllTogether()) {
          toRemove.push(item2);
          if (!toAdd.includes(item2.ensembleMaster))
            toAdd.push(item2.ensembleMaster);
        }
      }
      itemArray = array.subtract(itemArray, toRemove);
      itemArray = itemArray.concat(toAdd);
    }
    if (!options.doNotSort) {
      itemArray.sort(function(a, b) {
        if (a.name)
          a = a.name;
        if (b.name)
          b = b.name;
        return a.localeCompare(b);
      });
    }
    const l = itemArray.map((el) => {
      return typeof el === "string" ? el : lang.getName(el, options);
    });
    let s = "";
    if (settings.oxfordComma && l.length === 2 && options.lastSep)
      return l[0] + " " + options.lastSep + " " + l[1];
    do {
      s += l.shift();
      if (l.length === 1 && options.lastSep) {
        if (settings.oxfordComma)
          s += options.sep;
        s += " " + options.lastSep + " ";
      } else if (l.length > 0)
        s += options.sep + " ";
    } while (l.length > 0);
    return s;
  }
  function listProperties(obj) {
    return Object.keys(obj).join(", ");
  }
  const arabic = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const roman = "M;CM;D;CD;C;XC;L;XL;X;IX;V;IV;I".split(";");
  function toRoman(number) {
    if (typeof number !== "number") {
      errormsg("toRoman can only handle numbers");
      return number;
    }
    let result2 = "";
    for (let i2 = 0; i2 < 13; i2++) {
      while (number >= arabic[i2]) {
        result2 = result2 + roman[i2];
        number = number - arabic[i2];
      }
    }
    return result2;
  }
  function displayMoney(n) {
    if (typeof settings.moneyFormat === "undefined") {
      errormsg("No format for money set (set settings.moneyFormat in settings.js).");
      return "" + n;
    }
    const ary = settings.moneyFormat.split("!");
    if (ary.length === 2) {
      return settings.moneyFormat.replace("!", "" + n);
    } else if (ary.length === 3) {
      const negative = n < 0;
      n = Math.abs(n);
      let options = ary[1];
      const showsign = options.startsWith("+");
      if (showsign) {
        options = options.substring(1);
      }
      let number = displayNumber(n, options);
      if (negative) {
        number = "-" + number;
      } else if (n !== 0 && showsign) {
        number = "+" + number;
      }
      return ary[0] + number + ary[2];
    } else if (ary.length === 4) {
      const options = n < 0 ? ary[2] : ary[1];
      return ary[0] + displayNumber(n, options) + ary[3];
    } else {
      errormsg("settings.moneyFormat in settings.js expected to have either 1, 2 or 3 exclamation marks.");
      return "" + n;
    }
  }
  function displayNumber(n, control) {
    n = Math.abs(n);
    const regex = /^(\D*)(\d+)(\D)(\d*)(\D*)$/;
    if (!regex.test(control)) {
      errormsg("Unexpected format in displayNumber (" + control + "). Should be a number, followed by a single character separator, followed by a number.");
      return "" + n;
    }
    const options = regex.exec(control);
    const places = parseInt(options[4]);
    let padding = parseInt(options[2]);
    if (places > 0) {
      padding = padding + 1 + places;
    }
    const factor = Math.pow(10, places);
    const base = (n / factor).toFixed(places);
    const decimal = base.replace(".", options[3]);
    return options[1] + decimal.padStart(padding, "0") + options[5];
  }
  function getDir(s) {
    for (let exit of lang.exit_list) {
      if (exit.type === "nocmd")
        continue;
      if (exit.name === s)
        return exit.name;
      if (exit.abbrev.toLowerCase() === s)
        return exit.name;
      if (new RegExp("^(" + exit.alt + ")$").test(s))
        return exit.name;
    }
    return false;
  }
  function rChunkString(str, len) {
    str = str.toString();
    const r = [];
    while (str) {
      const chunk = str.slice(-len);
      str = str.slice(0, -len);
      r.unshift(chunk);
    }
    return r;
  }
  const array = {};
  array.subtract = function(a, b) {
    if (!Array.isArray(b))
      b = [b];
    const res = [];
    for (let i2 = 0; i2 < a.length; i2++) {
      if (!b.includes(a[i2]))
        res.push(a[i2]);
    }
    return res;
  };
  array.compare = function(a, b) {
    if (!Array.isArray(b))
      return false;
    if (a.length !== b.length)
      return false;
    for (let i2 = 0; i2 < a.length; i2++) {
      if (b[i2] !== a[i2])
        return false;
    }
    return true;
  };
  array.compareUnordered = function(a, b) {
    if (!Array.isArray(b))
      return false;
    if (a.length !== b.length)
      return false;
    for (let el of a) {
      if (!b.includes(el))
        return false;
    }
    return true;
  };
  array.remove = function(ary, ...el) {
    if (el.length === 0)
      return;
    let index = ary.indexOf(el.shift());
    if (index !== -1) {
      ary.splice(index, 1);
    }
    array.remove(ary, ...el);
  };
  array.intersection = function(ary1, ary2) {
    return ary1.filter(function(x2) {
      return ary2.indexOf(x2) !== -1;
    });
  };
  array.filterByAttribute = function(ary, attName, value) {
    return ary.filter((el) => el[attName] === value);
  };
  array.next = function(ary, el, circular) {
    let index = ary.indexOf(el) + 1;
    if (index === 0)
      return false;
    if (index === ary.length)
      return circular ? ary[0] : false;
    return ary[index];
  };
  array.nextFlagged = function(ary, el, att, circular) {
    let o = el;
    let count = ary.length;
    while (o && !o[att] && count > 0) {
      o = array.next(ary, o, circular);
      count = count - 1;
    }
    if (!o || !o[att])
      return false;
    return o;
  };
  array.clone = function(ary, options) {
    if (!options)
      options = {};
    let newary = options.compress ? [...new Set(ary)] : [...ary];
    if (options.value)
      newary = newary.map((el) => el[options.value]);
    if (options.function)
      newary = newary.map((el) => el[options.function]());
    if (options.attribute)
      newary = newary.map((el) => typeof el[options.attribute] === "function" ? el[options.attribute]() : el[options.attribute]);
    return options.reverse ? newary.reverse() : newary;
  };
  array.hasMatch = function(ary, s) {
    for (let e of ary) {
      if (typeof e === "string" && e === s)
        return true;
      if (e instanceof RegExp && s.match(e))
        return true;
    }
    return false;
  };
  array.combos = function(ary, sep2 = " ") {
    const res = [];
    for (let i2 = 0; i2 < ary.length; i2++) {
      res.push(ary[i2]);
      for (let j = i2 + 1; j < ary.length; j++) {
        res.push(ary[i2] + sep2 + ary[j]);
        for (let k = j + 1; k < ary.length; k++) {
          res.push(ary[i2] + sep2 + ary[j] + sep2 + ary[k]);
        }
      }
    }
    return res;
  };
  array.fromTokens = function(ary, scope, cmdParams) {
    const items = [];
    while (ary.length > 0) {
      const res = array.oneFromTokens(ary, scope, cmdParams);
      if (!res)
        return null;
      items.push(res);
    }
    return items;
  };
  array.oneFromTokens = function(ary, scope, cmdParams = {}) {
    for (let i2 = ary.length; i2 > 0; i2--) {
      const s = ary.slice(0, i2).join(" ");
      const items = parser.findInList(s, scope, cmdParams);
      if (items.length > 0) {
        for (let j = 0; j < i2; j++)
          ary.shift();
        return items;
      }
    }
    return null;
  };
  array.value = function(ary, index, opt) {
    if (index >= ary.length || index < 0) {
      if (opt === "none")
        return "";
      if (opt === "wrap")
        return ary[index % ary.length];
      if (opt === "end")
        return ary[ary.length - 1];
      if (opt === "start")
        return ary[0];
    }
    return ary[index];
  };
  function scopeReachable() {
    const list2 = [];
    for (let key in w$1) {
      if (w$1[key].scopeStatus.canReach && world.ifNotDark(w$1[key])) {
        list2.push(w$1[key]);
      }
    }
    return list2;
  }
  function scopeHeldBy(chr = player(), situation = world.PARSER) {
    return chr.getContents(situation);
  }
  function scopeHereListed() {
    const list2 = [];
    for (let key in w$1) {
      const o = w$1[key];
      if (!o.player && o.isAtLoc(player().loc, world.LOOK) && world.ifNotDark(o)) {
        list2.push(o);
      }
    }
    return list2;
  }
  function scopeHereParser() {
    const list2 = [];
    for (let key in w$1) {
      const o = w$1[key];
      if (!o.player && o.isAtLoc(player().loc, world.PARSER)) {
        list2.push(o);
      }
    }
    return list2;
  }
  function scopeNpcHere(ignoreDark) {
    const list2 = [];
    for (let key in w$1) {
      const o = w$1[key];
      if (o.isAtLoc(player().loc, world.LOOK) && o.npc && (world.ifNotDark(o) || ignoreDark)) {
        list2.push(o);
      }
    }
    return list2;
  }
  function scopeAllNpcHere(ignoreDark) {
    const list2 = [];
    for (let key in w$1) {
      const o = w$1[key];
      if (o.isAtLoc(player().loc, world.PARSER) && o.npc && (world.ifNotDark(o) || ignoreDark)) {
        list2.push(o);
      }
    }
    return list2;
  }
  function scopeBy(func2) {
    const list2 = [];
    for (let key in w$1) {
      if (func2(w$1[key])) {
        list2.push(w$1[key]);
      }
    }
    return list2;
  }
  const util = {};
  util.getContents = function(situation) {
    const list2 = [];
    for (let key in w$1) {
      if (w$1[key].isAtLoc(this.name, situation)) {
        list2.push(w$1[key]);
      }
    }
    return list2;
  };
  util.testForRecursion = function(char2, item2) {
    let contName = this.name;
    while (w$1[contName]) {
      if (w$1[contName].loc === item2.name)
        return falsemsg(lang.container_recursion, { char: char2, container: this, item: item2 });
      contName = w$1[contName].loc;
    }
    return true;
  };
  util.nameModifierFunctionForContainer = function(o, list2) {
    const contents = o.getContents(world.LOOK);
    if (contents.length > 0 && (!o.closed || o.transparent)) {
      list2.push(lang.contentsForData[o.contentsType].prefix + o.listContents(world.LOOK) + lang.contentsForData[o.contentsType].suffix);
    }
  };
  util.clamp = function(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  };
  util.registerTimerFunction = function(eventName, func2) {
    if (world.isCreated && !settings.saveDisabled) {
      errormsg("Attempting to use registerEvent after set up.");
      return;
    }
    settings.eventFunctions[eventName] = func2;
  };
  util.registerTimerEvent = function(eventName, triggerTime, interval) {
    if (!settings.eventFunctions[eventName])
      errormsg("A timer is trying to call event '" + eventName + "' but no such function is registered.");
    game.timerEventNames.push(eventName);
    game.timerEventTriggerTimes.push(triggerTime);
    game.timerEventIntervals.push(interval ? interval : -1);
  };
  util.findTopic = function(alias, char2, n = 1) {
    if (w$1[alias])
      return w$1[alias];
    for (const key in w$1) {
      const o = w$1[key];
      if (o.conversationTopic && (!char2 || o.belongsTo(char2.name)) && o.alias === alias) {
        n--;
        if (n === 0)
          return o;
      }
    }
    if (char2) {
      errormsg("Trying to find topic " + n + ' called "' + alias + '" for ' + char2.name + " and came up empty-handed!");
    } else {
      errormsg("Trying to find topic " + n + ' called "' + alias + '" for anyone and came up empty-handed!');
    }
  };
  util.giveItem = function(p) {
    p.item.moveToFrom(p, p.npc, p.char);
  };
  util.changeListeners = [];
  util.handleChangeListeners = function() {
    for (let el of util.changeListeners) {
      if (el.test(el.object, el.object[el.attName], el.oldValue, el.attName)) {
        el.func(el.object, el.object[el.attName], el.oldValue, el.attName);
      }
      el.oldValue = el.object[el.attName];
    }
  };
  util.defaultChangeListenerTest = function(object, currentValue, oldValue, attName) {
    return currentValue !== oldValue;
  };
  util.addChangeListener = function(object, attName, func2, test2 = util.defaultChangeListenerTest) {
    if (world.isCreated && !settings.saveDisabled) {
      errormsg("Attempting to use addChangeListener after set up.");
      return;
    }
    util.changeListeners.push({ object, attName, func: func2, test: test2, oldValue: object[attName] });
  };
  util.getChangeListenersSaveString = function() {
    if (util.changeListeners.length === 0)
      return "NoChangeListeners";
    const strings = util.changeListeners.map((el) => el.oldValue.toString());
    return "ChangeListenersUsedStrings=" + saveLoad.encodeArray(strings);
  };
  util.setChangeListenersLoadString = function(s) {
    if (s === "NoChangeListeners")
      return;
    const parts = s.split("=");
    if (parts.length !== 2)
      return errormsg("Bad format in saved data (" + s + ")");
    if (parts[0] !== "ChangeListenersUsedStrings")
      return errormsg("Expected ChangeListenersUsedStrings to be first");
    const strings = saveLoad.decodeArray(parts[1]);
    for (let i2 = 0; i2 < strings.length; i2++) {
      util.changeListeners[i2].oldValue = strings[i2].match(/^\d+$/) ? parseInt(strings[i2]) : strings[i2];
    }
  };
  function respond(params, list2) {
    if (settings.responseDebug)
      log$1(params);
    if (!params.char)
      errormsg('A call to "respond" does not have "char" set in the params.');
    const response = util.findResponse(params, list2, params.extraTest);
    if (!response) {
      if (params.afterScript)
        params.afterScript(params);
      if (!params.noResponseNotError) {
        errormsg("Failed to find a response. ASK/TELL or some other system using the respond function was given a list of options that did not have a default. Below the stack trace, you should see the parameters sent and the list of responses. The last response should have no test function (or a test function that always returns true).");
        log$1(params);
        log$1(list2);
      }
      return false;
    }
    if (params.beforeScript)
      params.beforeScript.bind(params.char)(params, response);
    if (response.script)
      response.script.bind(params.char)(params, response);
    if (response.msg) {
      if (params.char) {
        params.char.msg(response.msg, params);
      } else {
        msg(response.msg, params);
      }
    }
    if (!response.script && !response.msg && !response.failed) {
      errormsg("No script or msg for response");
      console.log(response);
    }
    if (params.afterScript)
      params.afterScript.bind(params.char)(params, response);
    return !response.failed;
  }
  function getResponseList(params, list2, result2) {
    if (!result2)
      result2 = [];
    for (let item2 of list2) {
      if (item2.name) {
        params.text = item2.name.toLowerCase();
        if (item2.test) {
          if (!result2.includes(item2) && item2.test.bind(params.char)(params, item2))
            result2.push(item2);
        } else {
          if (!result2.includes(item2))
            result2.push(item2);
        }
      }
      if (item2.responses)
        result2 = getResponseList(params, item2.responses, result2);
    }
    return result2;
  }
  util.findResponse = function(params, list2, extraTest) {
    for (let item2 of list2) {
      if (extraTest && !extraTest.bind(params.char)(params, item2))
        continue;
      if (item2.test && !item2.test.bind(params.char)(params, item2))
        continue;
      if (item2.regex && !params.text.match(item2.regex))
        continue;
      if (item2.responses)
        return util.findResponse(params, item2.responses);
      return item2;
    }
    return false;
  };
  util.addResponse = function(route, data, list2) {
    util.addResponseToList(route, data, list2);
  };
  util.addResponseToList = function(route, data, list2) {
    const sublist = util.getResponseSubList(route, list2);
    sublist.unshift(data);
  };
  util.getResponseSubList = function(route, list2) {
    const s = route.shift();
    if (s) {
      const sublist = list2.find((el) => el.name === s);
      if (!sublist)
        throw "Failed to add sub-list with " + s;
      return util.getResponseSubList(route, sublist.responses);
    } else {
      return list2;
    }
  };
  util.verifyResponses = function(list2, level) {
    if (level === void 0)
      level = 1;
    if (list2[list2.length - 1].test) {
      console.log("WARNING: Last entry at depth " + level + " has a test condition:");
      console.log(list2);
    }
    for (let item2 of list2) {
      if (item2.responses) {
        if (item2.responses.length === 0) {
          console.log("Zero responses at depth " + level + " for: " + item2.name);
        } else {
          util.verifyResponses(item2.responses, level + 1);
        }
      }
    }
  };
  util.listContents = function(situation, modified = true) {
    return formatList(this.getContents(situation), { article: INDEFINITE, lastSep: lang.list_and, modified, nothing: lang.list_nothing, loc: this.name });
  };
  util.getByInterval = function(intervals, n) {
    let count = 0;
    while (count < intervals.length) {
      if (n < intervals[count])
        return count;
      n -= intervals[count];
      count++;
    }
    return false;
  };
  util.guessMyType = function(value) {
    if (value.match(/^\d+$/))
      value = parseInt(value);
    if (value === "true")
      value = true;
    if (value === "false")
      value = false;
    if (value === "undefined")
      value = void 0;
    return value;
  };
  util.dictionaryToCss = function(d, includeCurlyBraces) {
    const ary = [];
    for (let key in d)
      ary.push(key + ":" + d[key]);
    return includeCurlyBraces ? "{" + ary.join(";") + "}" : ary.join(";");
  };
  util.getNameModifiers = function(item2, options) {
    if (!options.modified)
      return "";
    const list2 = [];
    for (let f of item2.nameModifierFunctions)
      f(item2, list2, options);
    if (item2.nameModifierFunction)
      item2.nameModifierFunction(list2, options);
    if (list2.length === 0)
      return "";
    if (options.noBrackets)
      return " " + list2.join("; ");
    return " (" + list2.join("; ") + ")";
  };
  util.getDateTime = function(options) {
    if (!settings.dateTime.formats) {
      const time = new Date(game.elapsedTime * 1e3 + game.startTime.getTime());
      return time.toLocaleString(settings.dateTime.locale, settings.dateTime);
    }
    return util.getCustomDateTime(options);
  };
  util.getDateTimeDict = function(options) {
    if (!options)
      options = {};
    return settings.dateTime.formats ? util.getCustomDateTimeDict(options) : util.getStdDateTimeDict(options);
  };
  util.getStdDateTimeDict = function(options) {
    const dict = {};
    let timeInSeconds = game.elapsedTime;
    if (options.add)
      timeInSeconds += options.add;
    const time = new Date(timeInSeconds * 1e3 + game.startTime.getTime());
    dict.second = time.getSeconds();
    dict.minute = time.getMinutes();
    dict.hour = time.getHours();
    dict.date = time.getDate();
    dict.weekday = time.toLocaleString("default", { weekday: "long" });
    dict.month = time.toLocaleString("default", { month: "long" });
    dict.year = time.getFullYear();
    return dict;
  };
  util.getCustomDateTimeDict = function(options) {
    const dict = {};
    let time = settings.dateTime.startTime + game.elapsedTime;
    if (options.is)
      time = settings.dateTime.startTime + options.is;
    if (options.add)
      time += options.add;
    for (let el of settings.dateTime.data) {
      dict[el.name] = time % el.number;
      time = Math.floor(time / el.number);
    }
    return dict;
  };
  util.getCustomDateTime = function(options) {
    if (!options)
      options = {};
    const dict = util.getCustomDateTimeDict(options);
    let s = options.format ? settings.dateTime.formats[options.format] : settings.dateTime.formats.def;
    for (let key in settings.dateTime.functions) {
      s = s.replace("%" + key + "%", settings.dateTime.functions[key](dict));
    }
    return s;
  };
  util.seconds = function(seconds, minutes = 0, hours = 0, days = 0) {
    if (settings.dateTime.convertSeconds)
      return settings.dateTime.convertSeconds(seconds, minutes, hours, days);
    return ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
  };
  util.elapsed = function(seconds, minutes = 0, hours = 0, days = 0) {
    return util.seconds(seconds, minutes, hours, days) >= game.elapsedTime;
  };
  util.isAfter = function(timeString) {
    if (typeof timeString === "number")
      return game.elapsedTime > timeString;
    if (timeString.match(/^\d\d\d\d$/)) {
      const dict = util.getDateTimeDict();
      const hour = parseInt(timeString.substring(0, 2));
      const minute = parseInt(timeString.substring(2, 4));
      if (hour < dict.hour)
        return true;
      if (hour > dict.hour)
        return false;
      return minute < dict.minute;
    }
    const nowTime = new Date(game.elapsedTime * 1e3 + game.startTime.getTime());
    const targetTime = Date.parse(timeString);
    if (targetTime)
      return nowTime > targetTime;
    return errormsg("Failed to parse date-time string: " + timeString);
  };
  util.changePOV = function(char2, pronouns) {
    if (typeof char2 === "string") {
      if (!w$1[char2])
        return errormsg("Failed to change POV, no object called '" + char2 + "'");
      char2 = w$1[char2];
    } else if (!char2)
      errormsg("Failed to change POV, char not defined.");
    if (player()) {
      player().player = false;
      player().pronouns = player().npcPronouns;
      player().regex = new RegExp("^(" + (char2.npcAlias ? char2.npcAlias : char2.alias) + ")$");
    }
    char2.player = true;
    char2.npcPronouns = char2.pronouns;
    char2.pronouns = pronouns ? pronouns : lang.pronouns.secondperson;
    char2.regex = new RegExp("^(me|myself|player|" + (char2.npcAlias ? char2.npcAlias : char2.alias) + ")$");
    setPlayer(char2);
    setPlayer(char2);
    world.update();
  };
  util.getObj = function(name2) {
    if (!name2)
      return errormsg("Trying to find an object in util.getObj, but name is " + name2);
    if (typeof name2 === "string") {
      const room = w$1[name2];
      if (room === void 0)
        throw new Error("Failed to find room: " + name2 + ".");
      return room;
    } else {
      if (name2.name === void 0) {
        throw "Not sure what to do with this room: " + name2 + " (a " + typeof name2 + ").";
      }
      return name2;
    }
  };
  util.findUniqueName = function(s) {
    if (!w$1[s]) {
      return s;
    } else {
      const res = /(\d+)$/.exec(s);
      if (!res) {
        return util.findUniqueName(s + "0");
      }
      const n = parseInt(res[0]) + 1;
      return util.findUniqueName(s.replace(/(\d+)$/, "" + n));
    }
  };
  util.findSource = function(options) {
    const fluids = options.fluid ? [options.fluid] : settings.fluids;
    const chr = options.char ? options.char : player();
    if (chr.isSourceOf) {
      for (const s of fluids) {
        if (chr.isSourceOf(s)) {
          options.source = chr;
          options.fluid = s;
          return true;
        }
      }
    }
    if (w$1[chr.loc].isSourceOf) {
      for (const s of fluids) {
        if (w$1[chr.loc].isSourceOf(s)) {
          options.source = w$1[chr.loc];
          options.fluid = s;
          return true;
        }
      }
    }
    const items = scopeReachable();
    for (const s of fluids) {
      for (let obj of items) {
        if (obj.isSourceOf && obj.isSourceOf(s)) {
          options.source = obj;
          options.fluid = s;
          return true;
        }
        if (obj.containedFluidName && obj.containedFluidName === s) {
          options.source = obj;
          options.fluid = s;
          return true;
        }
      }
    }
    return false;
  };
  util.multiIsUltimatelyHeldBy = function(obj, objNames) {
    for (const objName of objNames) {
      if (!objName)
        continue;
      let o = w$1[objName];
      if (o === obj)
        return true;
      while (o.loc) {
        if (o.loc === obj.name)
          return true;
        o = w$1[o.loc];
      }
    }
    return false;
  };
  util.testAttribute = function(o, attName) {
    if (typeof o[attName] === "function") {
      return o[attName]();
    } else {
      return o[attName];
    }
  };
  util.getLoc = function(options, loc2, name2) {
    if (!loc2)
      return;
    if (typeof loc2 === "object") {
      options[name2] = loc2.name;
    } else if (loc2 === "char" || loc2 === "name") {
      options[name2] = options.char.name;
    } else if (loc2 === "loc" && options.container) {
      options[name2] = options.container.name;
    } else if (loc2 === "loc" && options.holder) {
      options[name2] = options.holder.name;
    } else if (loc2 === "loc") {
      options[name2] = options.char.loc;
    } else if (settings.placeholderLocations.includes(loc2)) {
      options[name2] = loc2;
    } else if (w$1[loc2]) {
      options[name2] = loc2;
    } else {
      errormsg("Unexpected location in util.setToFrom/util.getLoc: " + loc2);
    }
  };
  util.setToFrom = function(options, toLoc, fromLoc) {
    util.getLoc(options, toLoc, "toLoc");
    util.getLoc(options, fromLoc, "fromLoc");
    return options;
  };
  util.defaultExitIsGuarded = function() {
    return false;
  };
  util.defaultExitUse = function(char2, exit) {
    if (!exit)
      exit = this;
    if (char2.testMove && !char2.testMove(exit))
      return false;
    if (exit.isGuarded())
      return false;
    if (exit.isLocked()) {
      return falsemsg(exit.lockedmsg ? exit.lockedmsg : lang.locked_exit, { char: char2, exit });
    }
    if (exit.testExit && !exit.testExit(char2, exit))
      return false;
    for (const el of char2.getCarrying()) {
      if (el.testCarry && !el.testCarry({ char: char2, item: el, exit }))
        return false;
    }
    return this.simpleUse ? this.simpleUse(char2) : util.defaultSimpleExitUse(char2, exit);
  };
  util.defaultSimpleExitUse = function(char2, exit) {
    if (exit.name === "_")
      return errormsg('Trying to move character to location "_" from room ' + exit.origin.name + '. This is probably a bug, as "_" is used to flag a destination that cannot be reached.');
    if (exit === void 0)
      exit = this;
    char2.msg(lang.stop_posture(char2));
    char2.movingMsg(exit);
    char2.moveChar(exit);
    return true;
  };
  util.useWithDoor = function(char2) {
    const obj = w$1[this.door];
    if (obj === void 0) {
      errormsg("Not found an object called '" + this.door + "'. Any exit that uses the 'util.useWithDoor' function must also set a 'door' attribute.");
    }
    const tpParams = { char: char2, doorName: this.doorName ? this.doorName : "door" };
    if (!obj.closed) {
      char2.moveChar(this);
      return true;
    }
    if (!obj.locked) {
      obj.closed = false;
      msg(lang.open_and_enter, tpParams);
      char2.moveChar(this);
      return true;
    }
    if (obj.testKeys(char2)) {
      obj.closed = false;
      obj.locked = false;
      msg(lang.unlock_and_enter, tpParams);
      char2.moveChar(this);
      return true;
    }
    msg(lang.try_but_locked, tpParams);
    return false;
  };
  util.cannotUse = function(char2, dir) {
    const tpParams = { char: char2 };
    msg(this.msg ? this.msg : lang.try_but_locked, tpParams);
    return false;
  };
  util.hiddenIfNoTransit = function() {
    return w$1[this.name].transitCurrentLocation !== this.origin.name;
  };
  util.commandsToTest = [
    // saying
    {
      name: "say",
      withText: true
    },
    {
      name: "cry",
      withText: true,
      onOwn: true
    },
    {
      name: "shout",
      withText: true,
      onOwn: true
    },
    {
      name: "scream",
      withText: true,
      onOwn: true
    },
    {
      name: "pray",
      onOwn: true
    },
    {
      name: "sing",
      onOwn: true
    },
    {
      name: "dance",
      onOwn: true
    },
    // resting
    {
      name: "rest",
      onOwn: true
    },
    {
      name: "sit",
      onOwn: true,
      withItem: true
    },
    {
      name: "sleep",
      onOwn: true
    },
    // attacking
    {
      name: "hit",
      withItem: true
    },
    {
      name: "attack",
      withItem: true
    },
    {
      name: "punch",
      withItem: true
    },
    {
      name: "pick",
      withItem: true
    },
    {
      name: "scratch",
      withItem: true
    },
    // moving
    {
      name: "swim",
      onOwn: true,
      withItem: true
    },
    {
      name: "dive"
    },
    {
      name: "climb",
      onOwn: true,
      withItem: true
    },
    {
      name: "jump",
      onOwn: true,
      withItem: true
    },
    // sensing
    {
      name: "touch",
      withItem: true
    },
    {
      name: "look behind",
      withItem: true
    },
    {
      name: "look under",
      withItem: true
    },
    {
      name: "search",
      onOwn: true,
      withItem: true
    },
    {
      name: "hear",
      onOwn: true,
      withItem: true
    },
    {
      name: "smell",
      onOwn: true,
      withItem: true
    },
    // mental
    {
      name: "think",
      onOwn: true
    },
    {
      name: "think about",
      withText: true
    },
    {
      name: "remember",
      onOwn: true,
      withItem: true,
      withText: true
    },
    // rude (beause some people will try it)
    {
      name: "piss",
      onOwn: true,
      rude: "p***"
    },
    {
      name: "fuck",
      onOwn: true,
      withItem: true,
      rude: "f***"
    },
    {
      name: "fart",
      onOwn: true,
      rude: "p***"
    },
    // misc
    {
      name: "dig"
    },
    {
      name: "undress",
      onOwn: true,
      withItem: true
    },
    {
      name: "kiss",
      withItem: true
    },
    {
      name: "comfort",
      withItem: true
    },
    {
      name: "hints",
      onOwn: true
    },
    {
      name: "plugh",
      onOwn: true
    },
    {
      name: "xyzzy",
      onOwn: true
    },
    // check the scenery
    {
      name: "x sky",
      onOwn: true
    },
    {
      name: "x floor",
      onOwn: true
    },
    {
      name: "x wall",
      onOwn: true
    }
  ];
  util.testme = function(item2) {
    log$1("-------------------------------------");
    log$1("Testing implementation of odd commands, using " + item2.name);
    test.testing = true;
    for (const d of util.commandsToTest) {
      if (d.onOwn) {
        test.testOutput = [];
        parser.parse(d.name);
        if (test.testOutput[0] === lang.not_known_msg)
          log$1("No command to handle " + d.name.toUpperCase());
      }
      if (d.withText) {
        test.testOutput = [];
        parser.parse(d.name + " some text");
        if (test.testOutput[0] === lang.not_known_msg)
          log$1("No command to handle " + d.name.toUpperCase() + " <text>");
      }
      if (d.withItem) {
        test.testOutput = [];
        parser.parse(d.name + " " + item2.alias);
        if (test.testOutput[0] === lang.not_known_msg)
          log$1("No command to handle " + d.name.toUpperCase() + " <item>");
      }
    }
    test.testing = false;
  };
  function run() {
    world.init();
    settings.performanceLog("World initiated");
    io.init();
    settings.performanceLog("io.init completed");
  }
  const settings = {
    performanceLogStartTime: performance.now(),
    // Also title, author, thanks (option; array)
    // Files
    lang: "lang-en",
    // Set to the language file of your choice
    customExits: false,
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
    compassPane: true,
    // Set to true to have a compass world.
    symbolsForCompass: true,
    statusPane: "Status",
    // Title of the panel; set to false to turn off
    statusWidthLeft: 120,
    // How wide the left column is in the status pane
    statusWidthRight: 40,
    // How wide the right column is in the status pane
    status: [
      function() {
        return "<td>Health points:</td><td>" + player().hitpoints + "</td>";
      }
    ],
    customPaneFunctions: {},
    // Functions for the side panes lists
    isHeldNotWorn: function(item2) {
      return item2.isAtLoc(player().name, world.SIDE_PANE) && world.ifNotDark(item2) && !item2.getWorn();
    },
    isHere: function(item2) {
      return item2.isAtLoc(player().loc, settings.sceneryInSidePane ? world.PARSER : world.SIDE_PANE) && world.ifNotDark(item2);
    },
    isWorn: function(item2) {
      return item2.isAtLoc(player().name, world.SIDE_PANE) && world.ifNotDark(item2) && item2.getWorn();
    },
    // Other UI settings
    textInput: true,
    // Allow the player to type commands
    cursor: ">",
    // The cursor, obviously
    cmdEcho: true,
    // Commands are printed to the screen
    textEffectDelay: 25,
    roomTemplate: [
      "#{cap:{hereName}}",
      "{terse:{hereDesc}}",
      "{objectsHere:You can see {objects} here.}",
      "{exitsHere:You can go {exits}.}",
      "{ifNot:settings:playMode:play:{ifExists:currentLocation:todo:{class:todo:{show:currentLocation:todo}}}}"
    ],
    silent: false,
    walkthroughMenuResponses: [],
    startingDialogEnabled: false,
    darkModeActive: false,
    // setting to true is a bad idea (use io.toggleDarkMode)
    plainFontModeActive: false,
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
    npcReactionsAlways: false,
    turnsQuestionsLast: 5,
    givePlayerSayMsg: true,
    givePlayerAskTellMsg: true,
    funcForDynamicConv: "showMenu",
    // Other game play settings
    failCountsAsTurn: false,
    lookCountsAsTurn: false,
    beforeEnter: function() {
    },
    afterEnter: function() {
    },
    // When save is disabled, objects can be created during game play
    saveDisabled: false,
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
    convertNumbersInParser: true,
    tests: false,
    maxUndo: 10,
    moneyFormat: "$!",
    questVersion: "1.4.0",
    mapStyle: { right: "0", top: "200px", width: "300px", height: "300px", "background-color": "beige" },
    openQuotation: "'",
    closeQuotation: "'",
    fluids: [],
    getDefaultRoomHeading: function(item2) {
      return sentenceCase(lang.addDefiniteArticle(item2, { ignorePossessive: "noLink" }) + item2.alias);
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
      return game.dark ? "darkDesc" : "desc";
    },
    statsData: [
      { name: "Objects", test: function(o) {
        return true;
      } },
      { name: "Locations", test: function(o) {
        return o.room;
      } },
      { name: "Items", test: function(o) {
        return !o.room;
      } },
      { name: "Takeables", test: function(o) {
        return o.takeable;
      } },
      { name: "Scenery", test: function(o) {
        return o.scenery;
      } },
      { name: "NPCs", test: function(o) {
        return o.npc && !o.player;
      } }
    ],
    performanceLog: function() {
    },
    // This is split out for io.showInTab to use
    loadCssFiles: function(doc = document, path = "") {
      settings.loadCssFile(settings.cssFolder + "default.css", doc, path);
      for (let file of settings.themes) {
        settings.loadCssFile(settings.cssFolder + file + ".css", doc, path);
      }
      settings.loadCssFile(settings.folder + settings.styleFile + ".css", doc, path);
    },
    loadCssFile: function(filename, doc = document, path = "") {
      const link = document.createElement("link");
      link.href = path + filename;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.media = "screen,print";
      doc.head.appendChild(link);
    }
  };
  settings.performanceLogStart = function() {
    settings.performanceLogStartTime = performance.now();
  };
  settings.performanceLog = function(s) {
    if (!settings.performanceLogging)
      return;
    const dur = Math.round(performance.now() - settings.performanceLogStartTime).toString().padStart(4);
    console.log(s.padEnd(32) + dur);
  };
  settings.inventoryPane = [
    { name: "Items Held", alt: "itemsHeld", test: settings.isHeldNotWorn, getLoc: function() {
      return player().name;
    } },
    { name: "Items Worn", alt: "itemsWorn", test: settings.isWorn, getLoc: function() {
      return player().name;
    } },
    { name: "Items Here", alt: "itemsHere", test: settings.isHere, getLoc: function() {
      return player().loc;
    } }
  ];
  settings.setUpDialogClick = function() {
    settings.startingDialogEnabled = false;
    io.enable();
    settings.startingDialogOnClick();
    world.begin();
    if (settings.textInput) {
      document.querySelector("#textbox").focus();
    }
    document.querySelector("#dialog").style.display = "none";
  };
  settings.setUpDialog = function() {
    const diag = document.querySelector("#dialog");
    document.querySelector("#dialog-title").innerHTML = settings.startingDialogTitle;
    document.querySelector("#dialog-content").innerHTML = settings.startingDialogHtml;
    if (settings.startingDialogButton)
      document.querySelector("#dialog-button").innerHTML = settings.startingDialogButton;
    document.querySelector("#dialog-button").addEventListener("click", settings.setUpDialogClick);
    io.disable();
    diag.show();
    diag.style.display = "block";
    diag.style.width = settings.startingDialogWidth + "px";
    diag.style.height = "auto";
    diag.style.top = "100px";
  };
  const lang = {
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
        { regex: /^(?:use|with|using) (.+?) (?:to open|open) (.+)$/, mod: { reverse: true } }
      ],
      Close: /^(?:close) (.+)$/,
      Lock: /^(?:lock) (.+)$/,
      LockWith: [
        /^(?:lock) (.+) (?:with|using) (.+)$/,
        { regex: /^(?:use|with|using) (.+?) (?:to lock|lock) (.+)$/, mod: { reverse: true } }
      ],
      Unlock: /^(?:unlock) (.+)$/,
      UnlockWith: [
        /^(?:unlock) (.+) (?:with|using) (.+)$/,
        { regex: /^(?:use|with|using) (.+?) (?:to unlock|unlock) (.+)$/, mod: { reverse: true } }
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
        { regex: /^(?:with:from|using) (.+) (?:make|build|construct) (.+)$/, mod: { reverse: true } },
        { regex: /^(?:use) (.+) to (?:make|build|construct) (.+)$/, mod: { reverse: true } }
      ],
      NpcMake: [
        /^(.+), ?(?:make|build|construct) (.+)$/,
        /^(?:tell|ask|instruct) (.+) to (?:make|build|construct) (.+)$/
      ],
      NpcMakeWith: [
        /^(.+), ?(?:make|build|construct) (.+) (?:with|from|using) (.+)$/,
        /^(?:tell|ask|instruct) (.+) to (?:make|build|construct) (.+) (?:with|from|using) (.+)$/,
        { regex: /^(.+), ?(?:with:from|using) (.+) (?:make|build|construct) (.+)$/, mod: { reverse: true } },
        { regex: /^(?:tell|ask|instruct) (.+) to (?:with:from|using) (.+) (?:make|build|construct) (.+)$/, mod: { reverse: true } },
        { regex: /^(.+), ?(?:use) (.+) to (?:make|build|construct) (.+)$/, mod: { reverse: true } },
        { regex: /^(?:tell|ask|instruct) (.+) to (?:use) (.+) to (?:make|build|construct) (.+)$/, mod: { reverse: true } }
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
    object_unknown_msg: function(name2) {
      return "There doesn't seem to be anything you might call '" + name2 + "' here.";
    },
    // For furniture
    stop_posture: function(char2) {
      if (!char2.posture)
        return "";
      if (!char2.postureFurniture && char2.posture === "standing")
        return "";
      const options = { char: char2 };
      if (w[char2.postureFurniture])
        options.item = w[char2.postureFurniture];
      char2.posture = false;
      char2.postureFurniture = false;
      return processText(options.item ? "{nv:char:get:true} off {nm:item:the}." : "{nv:char:stand:true} up.", options);
    },
    // use (or potentially use) different verbs in the responses, so not simple strings
    say_no_one_here: "{nv:char:say:true}, '{show:text},' but no one notices.",
    say_no_response: "No one seems interested in what {nv:char:say}.",
    say_no_response_full: "{nv:char:say:true}, '{show:text},' but no one seem interested.",
    say_something: "{nv:char:say:true}, '{show:text}.'",
    // If the player does SPEAK TO MARY and Mary has some topics, this will be the menu title.
    speak_to_menu_title: function(char2) {
      return "Talk to " + lang.getName(char2, { article: DEFINITE }) + " about:";
    },
    // If the player does TELL MARY ABOUT HOUSE this will appear before the response.
    tell_about_intro: function(char2, text1, text2) {
      return "{nv:char:tell:true} " + lang.getName(char2, { article: DEFINITE }) + " " + text2 + " " + text1 + ".";
    },
    // If the player does ASK MARY ABOUT HOUSE this will appear before the response.
    ask_about_intro: function(char2, text1, text2) {
      return "{nv:char:ask:true} " + lang.getName(char2, { article: DEFINITE }) + " " + text2 + " " + text1 + ".";
    },
    // If the player does TALK TO MARY ABOUT HOUSE this will appear before the response.
    talk_about_intro: function(char2, text1, text2) {
      return "{nv:char:talk:true} to " + lang.getName(char2, { article: DEFINITE }) + " " + text2 + " " + text1 + ".";
    },
    // Use when the NPC leaves a room; will give a message if the player can observe it
    npc_leaving_msg: function(npc2, exit) {
      let flag = npc2.inSight(exit.origin);
      if (!flag)
        return;
      if (exit.npcLeaveMsg) {
        return exit.npcLeaveMsg(npc2);
      }
      let s = typeof flag === "string" ? flag + " {nv:npc:leave}" : "{nv:npc:leave:true}";
      s += " {nm:room:the}, heading {show:dir}.";
      msg(s, { room: exit.origin, npc: npc2, dir: exit.dir });
    },
    // the NPC has already been moved, so npc.loc is the destination
    npc_entering_msg: function(npc2, exit) {
      let flag = npc2.inSight(w[exit.name]);
      if (!flag)
        return;
      if (exit.npcEnterMsg) {
        return exit.npcEnterMsg(npc2);
      }
      let s = typeof flag === "string" ? flag + " {nv:npc:enter}" : "{nv:npc:enter:true}";
      s += " {nm:room:the} from {show:dir}.";
      msg(s, { room: w[exit.name], npc: npc2, dir: exit.reverseNice() });
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
      metamsg("Hi!");
      metamsg("If you are wondering what to do, typing HELP will give you a quick guide at how to get going. In fact, we can do that now...");
      metamsg(">HELP");
      wait();
      return lang.helpScript();
    },
    helpScript: function() {
      if (settings.textInput) {
        metamsg("Type commands at the prompt to interact with the world.");
        metamsg('{b:Movement:} To move, use the eight compass directions (or just {class:help-eg:N}, {class:help-eg:NE}, etc.). When "Num Lock" is on, you can use the number pad for all eight compass directions. Also try - and + for {class:help-eg:UP} and {class:help-eg:DOWN}, / and * for {class:help-eg:IN} and {class:help-eg:OUT}.');
        metamsg("{b:Other commands:} You can also {class:help-eg:LOOK} (or just {class:help-eg:L} or 5 on the number pad), {class:help-eg:HELP} (or {class:help-eg:?}) or {class:help-eg:WAIT} (or {class:help-eg:Z} or the dot on the number pad). Other commands are generally of the form {class:help-eg:GET HAT} or {class:help-eg:PUT THE BLUE TEAPOT IN THE ANCIENT CHEST}. Experiment and see what you can do!");
        metamsg("{b:Using items: }You can use {class:help-eg:ALL} and {class:help-eg:ALL BUT} with some commands, for example {class:help-eg:TAKE ALL}, and {class:help-eg:PUT ALL BUT SWORD IN SACK}. You can also use pronouns, so {class:help-eg:LOOK AT MARY}, then {class:help-eg:TALK TO HER}. The pronoun will refer to the last subject in the last successful command, so after {class:help-eg:PUT HAT AND FUNNY STICK IN THE DRAWER}, '{class:help-eg:IT}' will refer to the funny stick (the hat and the stick are subjects of the sentence, the drawer was the object).");
        metamsg("{b:Characters: }If you come across another character, you can ask him or her to do something. Try things like {class:help-eg:MARY,PUT THE HAT IN THE BOX}, or {class:help-eg:TELL MARY TO GET ALL BUT THE KNIFE}. Depending on the game you may be able to {class:help-eg:TALK TO} a character, to {class:help-eg:ASK} or {class:help-eg:TELL} a character {class:help-eg:ABOUT} a topic, or just {class:help-eg:SAY} something and they will respond..");
        metamsg("{b:Meta-commands:} Type {class:help-eg:ABOUT} to find out about the author, {class:help-eg:SCRIPT} to learn about transcripts or {class:help-eg:SAVE} to learn about saving games. Use {class:help-eg:WARNINGS} to see any applicable sex, violence or trigger warnings.");
        let s = "You can also use {class:help-eg:BRIEF/TERSE/VERBOSE} to control room descriptions. Use {class:help-eg:SILENT} to toggle sounds and music (if implemented).";
        if (typeof map !== "undefined")
          s += " Use {class:help-eg:MAP} to toggle/show the map.";
        if (typeof imagePane !== "undefined")
          s += " Use {class:help-eg:IMAGES} to toggle/show the image pane.";
        metamsg(s);
        metamsg("{b:Accessibility:} Type {class:help-eg:DARK} to toggle dark mode or {class:help-eg:SPOKEN} to toggle the text being read out. Use {class:help-eg:FONT} to toggle replacing all the fonts the author carefully chose to a standard sans-serif font. Use {class:help-eg:SCROLL} to toggle whether the text automatically scrolling.");
        metamsg("{b:Mobile:} If you are on a mobile phone, type {class:help-eg:NARROW} to reduce the width of the text. Type it again to reduce it even more, and a third time to go back to standard width.");
        metamsg("{b:Shortcuts:} You can often just type the first few characters of an item's name and Quest will guess what you mean.  If fact, if you are in a room with Brian, who is holding a ball, and a box, Quest should be able to work out that {class:help-eg:B,PUT B IN B} mean you want Brian to put the ball in the box.");
        metamsg("You can use the up and down arrows to scroll back though your previous typed commands - especially useful if you realise you spelled something wrong. If you do not have arrow keys, use {class:help-eg:OOPS} to retrieve the last typed command so you can edit it. Use {class:help-eg:AGAIN} or just {class:help-eg:G} to repeat the last typed command.");
        metamsg("See also {link:here:https://github.com/ThePix/QuestJS/wiki/How-To-Play} for more details, which will open in a new tab.");
      }
      if (settings.panes !== "none") {
        if (settings.inventoryPane) {
          metamsg("{b:User Interface:} To interact with an object, click on its name in the side pane, and a set of possible actions will appear under it. Click on the appropriate action.");
        }
        if (settings.compassPane) {
          if (settings.symbolsForCompass) {
            metamsg("You can also use the compass rose at the top to move around. Click the eye symbol, &#128065;, to look at you current location, the clock symbol to wait or &#128712; for help.");
          } else {
            metamsg("You can also use the compass rose at the top to move around. Click 'Lk' to look at you current location, 'Z' to wait or '?' for help.");
          }
        }
        if (settings.collapsibleSidePanes) {
          metamsg("You can click on the eye symbol by the pane titles to toggle them being visible. This may be useful if there is a lot there, and entries are disappearing off the bottom of your screen, though you may miss that something is here if you are not careful!");
        }
      }
      if (settings.additionalHelp !== void 0) {
        for (const s of settings.additionalHelp)
          metamsg(s);
      }
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    hintScript: function() {
      metamsg("Sorry, no hints available.");
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    aboutScript: function() {
      metamsg("{i:{show:settings:title} version {show:settings:version}} was written by {show:settings:author} using QuestJS (Quest 6) version {show:settings:questVersion}.", { settings });
      if (settings.ifdb)
        metamsg("IFDB number: " + settings.ifdb);
      if (settings.thanks && settings.thanks.length > 0) {
        metamsg("{i:Thanks to:} " + formatList(settings.thanks, { lastSep: lang.list_and }) + ".");
      }
      if (settings.additionalAbout !== void 0) {
        for (const key in settings.additionalAbout)
          metamsg("{i:" + key + ":} " + settings.additionalAbout[key]);
      }
      if (settings.ifid)
        metamsg("{i:IFDB number:} " + settings.ifid);
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    warningsScript: function() {
      switch (typeof settings.warnings) {
        case "undefined":
          metamsg("No warning have been set for this game.");
          break;
        case "string":
          metamsg(settings.warnings);
          break;
        default:
          for (const el of settings.warnings)
            metamsg(el);
      }
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    saveLoadScript: function() {
      if (!settings.localStorageDisabled) {
        metamsg("QuestJS offers players two ways to save your progress - to LocalStorage or to file.");
        metamsg("{b:Saving To LocalStorage}");
        metamsg("LocalStorage is a part of your computer the browser has set aside; this is the easier way to save.");
        metamsg("Note, however, that if you clear your browsing data (or have your browser set to do so automatically when the browser is closed) you will lose your saved games. There is also a limit to how much can be saved to LocalStorage, and if this is a big game, you may not be allowed to save to LocalStorage.");
        metamsg("To save your progress to LocalStorage, type {class:help-eg:SAVE [filename]}. By default, if you have already saved the game, you will not be permitted to save with the same filename, to prevent you accidentally saving when you meant to load. However, you can overwrite a file with the same name by using {class:help-eg:SAVE [filename] OVERWRITE} or just {class:help-eg:SAVE [filename] OW}.");
        metamsg("To load your game, refresh/reload this page in your browser, then type {class:help-eg:LOAD [filename]}.");
        metamsg("To see a list of all your QuestJS save games, type {class:help-eg:DIR} or {class:help-eg:LS}. You can delete a saved file with {class:help-eg:DELETE [filename]} or {class:help-eg:DEL [filename]}.");
        metamsg("{b:Saving To File}");
        metamsg("Alternatively you can save the game as a file on your computer. It is a little more hassle, but probably more reliable.");
      }
      metamsg("To save your progress to file, type {class:help-eg:FSAVE [filename]}. The file will be saved to wherever downloaded files get saved on your computer. If there is already a file with that name, the browser will probably append a number to the name.");
      metamsg("To load your game, refresh/reload this page in your browser, then type {class:help-eg:FLOAD}. A dialog will open up, allowing you to navigate to the downloads folder and select your file.");
      metamsg("There is no built-in facility to list or delete games saved as files, though you can delete through your normal file manager.");
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    hintSheet: "Hint Sheet",
    hintSheetIntro: "To use this hint sheet, start to read through the list of questions to see if there is one dealing with the place where you're stuck in the game. To decode a hint, substitute the numbers in the hint for the numbered words in the 'dictionary' at the bottom of the hint sheet. <i>To get back to your game, just go to its tab.</i>",
    // linkHintInvisiClues:"Hints can be found on {link:this page:" + folder + "/hints.html}, in the form of InvisiClues, so you can avoid seeing spoilers you do want to see. The page will open in a new tab, so will not affect your playing of the game.",
    transcriptScript: function() {
      metamsg("The TRANSCRIPT or SCRIPT commands can be used to handle recording the input and output. This can be very useful when testing a game, as the author can go back through it and see exactly what happened, and how the user got there.");
      metamsg("Use SCRIPT ON to turn on recording and SCRIPT OFF to turn it off. To clear the stored data, use SCRIPT CLEAR. To clear the old data and turn recording on in one step, use SCRIPT START.");
      metamsg("Use SCRIPT SHOW to display it - it will appear in a new tab; you will not lose your place in the game. Some browsers (Firefox especially) may block the new tab, but will probably give the option to allow it in a banner at the top. You will probably need to do the command again.");
      metamsg("You can add a comment to the transcript by starting your text with an asterisk, {code:*}, or semi-colon, {code:;}, - Quest will record it, but otherwise just ignore it.");
      metamsg('Everything gets saved to "LocalStorage", so will be saved between sessions. If you complete the game the text input will disappear, however if you have a transcript recording, a link will be available to access it.');
      metamsg("Transcript is currently: " + (io.transcript ? "on" : "off"));
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    transcriptTitle: function() {
      let html = "";
      html += '<h2>QuestJS Transcript for "';
      html += settings.title + '" (version ' + settings.version;
      html += ")</h2>";
      html += '<p><a onclick="document.download()" style="cursor:pointer;border:black solid 1px;border-radius:5px;background:silver;line-height:1em">Click here</a> to save this file to your downloads folder as "transcript.html".</p>';
      html += "<hr/>";
      return html;
    },
    transcriptStart: function() {
      const now = /* @__PURE__ */ new Date();
      return "<p><i>Transcript started at " + now.toLocaleTimeString() + " on " + now.toDateString() + "</i></p>";
    },
    transcriptEnd: function() {
      const now = /* @__PURE__ */ new Date();
      return "<p><i>Transcript ended at " + now.toLocaleTimeString() + " on " + now.toDateString() + "</i></p>";
    },
    topicsScript: function() {
      metamsg("Use TOPICS FOR [name] to see a list of topic suggestions to ask a character about (if implemented in this game).");
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    betaTestIntro: function() {
      metamsg("This version is for beta-testing (" + settings.version + "); the browser reports that it is running on: " + navigator.userAgent);
      if (settings.textInput) {
        metamsg("A transcript will be automatically recorded. When you finish, do Ctrl-Enter or type SCRIPT SHOW to open the transcript in a new tab, or click the link if you reach the end of the game; it can then be saved (you should see a save button at the top) and attached to an e-mail. Alternatively, copy-and-pasted into an e-mail.");
        metamsg("You can add your own comments to the transcript by starting a command with *.");
      } else {
        metamsg('A transcript will be automatically recorded. As this game has no text input, you will need to access the transcript through the developer tools. Press F12 to show the tools, and click on the "Console" tab. Type <code>io.scriptShow()</code> and press return. the transcript should appear in a new tab.');
      }
      metamsg("If you have not already done so, I recommend checking to ensure you can see the transcript before progressing too far though the game.");
      metamsg("PLEASE NOTE: Transcripts and save games are saved in LocalStorage; if you have this set to be deleted when you close your browser, you will lose all progress!");
      saveLoad.transcriptStart();
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
    addDefiniteArticle: function(item2, options) {
      return lang.addArticle(item2, DEFINITE, options);
    },
    //@DOC
    // Returns "a " or "an " if appropriate for this item.
    // If the item has 'indefArticle' it returns that; if it has a proper name, returns an empty string.
    // If it starts with a vowel, it returns "an ", otherwise "a ".
    addIndefiniteArticle: function(item2, options) {
      return lang.addArticle(item2, INDEFINITE, options);
    },
    addArticle: function(item2, type, options = {}) {
      if (type === "the")
        type = DEFINITE;
      if (type === "a")
        type = INDEFINITE;
      if (!type || type !== DEFINITE && type !== INDEFINITE)
        return;
      if (player() && item2.owner === player().name)
        return player().pronouns.possAdj + " ";
      if (typeof options.possAdj === "string") {
        if (!w[options.possAdj]) {
          throw "Oh dear... I am looking to create a possessive in lang.addArticle (probably from lang.getName or formatList), and I cannot find " + options.possAdj + ". This will not end well.";
        }
        options.possAdj = w[options.possAdj];
      }
      if (options.possAdj === true) {
        options.possAdj = item2.owner ? w[item2.owner] : void 0;
      }
      if (item2.owner && options.possAdj && options.possAdj === w[item2.owner]) {
        return options.possAdj.pronouns.possAdj + " ";
      }
      if (item2.owner && options.ignorePossessive !== true) {
        const suboptions = {
          possessive: true,
          noLink: options.ignorePossessive === "noLink"
        };
        return lang.getName(w[item2.owner], suboptions) + " ";
      }
      if (type === DEFINITE) {
        if (item2.defArticle)
          return item2.defArticle + " ";
        return item2.properNoun ? "" : "the ";
      }
      if (item2.indefArticle)
        return item2.indefArticle + " ";
      if (item2.properNoun)
        return "";
      if (item2.pronouns === lang.pronouns.plural)
        return "some ";
      if (item2.pronouns === lang.pronouns.massnoun)
        return "some ";
      if (/^[aeiou]/i.test(item2.alias))
        return "an ";
      return "a ";
    },
    getName: function(item2, options) {
      if (!options)
        options = {};
      if (!item2.alias)
        item2.alias = item2.name;
      let s = "";
      let count = options[item2.name + "_count"] ? options[item2.name + "_count"] : false;
      if (options.count_this)
        count = item2[options.count_this];
      if (!count && options.suppressCount)
        count = item2[options.suppressCount];
      if (!count && options.loc && item2.countable)
        count = item2.countAtLoc(options.loc);
      if (item2.getDisplayName) {
        options.count = count;
        s = item2.getDisplayName(options);
      } else if (item2.pronouns === lang.pronouns.firstperson || item2.pronouns === lang.pronouns.secondperson) {
        s = options.possessive ? item2.pronouns.possAdj : item2.pronouns.subjective;
      } else {
        if (count === "infinity") {
          s += item2.infinity ? item2.infinity + " " : "a lot of ";
        } else if (options.article === DEFINITE && options.suppressCount) {
          s += lang.addDefiniteArticle(item2);
        } else if (!options.suppressCount && count && count > 1) {
          s += lang.toWords(count) + " ";
        } else if (options.article === DEFINITE) {
          s += lang.addDefiniteArticle(item2);
        } else if (options.article === INDEFINITE) {
          s += lang.addIndefiniteArticle(item2, options);
        } else if (options.article === COUNT) {
          s += "one ";
        }
        if (item2.getAdjective) {
          s += item2.getAdjective();
        }
        if (!count || count === 1) {
          s += options.enhanced && item2.enhancedAlias ? item2.enhancedAlias : item2.alias;
        } else {
          s += item2.pluralAlias;
        }
        if (options.possessive) {
          if (s.endsWith("s")) {
            s += "'";
          } else {
            s += "'s";
          }
        }
      }
      if (options.capital)
        s = sentenceCase(s);
      if (settings.nameTransformer)
        s = settings.nameTransformer(s, item2, options);
      s += util.getNameModifiers(item2, options);
      return s;
    },
    //@DOC
    // Returns the given number in words, so 19 would be returned as 'nineteen'.
    // Numbers uner -2000 and over 2000 are returned as a string of digits,
    // so 2001 is returned as '2001'.
    toWordsMax: 1e4,
    toWordsMillions: ["", " thousand", " million", " billion", " trillion", " quadrillion", " quintillion", " sextillion", "s eptillion", " octillion", " nonillion", " decillion", " undecillion", " duodecillion"],
    toWords: function(number, noun) {
      if (typeof number !== "number")
        return errormsg("toWords can only handle numbers");
      number = Math.round(number);
      let negative = false;
      if (number === 0)
        return noun ? "zero " + lang.getPlural(noun) : "zero";
      if (number < 0) {
        negative = true;
        number = -number;
      }
      const parts = rChunkString(number, 3);
      let count = 0;
      const result2 = [];
      while (parts.length) {
        const bit = lang._toWords1000(parts.pop());
        if (bit !== "zero") {
          result2.unshift(bit + lang.toWordsMillions[count]);
        }
        count++;
      }
      let s = formatList(result2, { lastJoiner: "and", doNotSort: true });
      const md = s.match(/ and /g);
      if (md && md.length > 1) {
        const pos = s.lastIndexOf(" and ");
        s = s.substring(0, pos) + "," + s.substring(pos);
      }
      if (negative)
        s = "minus " + s;
      if (!noun)
        return s;
      return s + " " + (number === 1 ? noun : lang.getPlural(noun));
    },
    // For internal use, handles integers from 1 to 999 only
    _toWords1000: function(number) {
      let s = "";
      let hundreds = Math.floor(number / 100);
      number = number % 100;
      if (hundreds > 0) {
        s = s + lang.numberUnits[hundreds] + " hundred";
        if (number > 0) {
          s = s + " and ";
        }
      }
      if (number < 20) {
        if (number !== 0 || s === "") {
          s = s + lang.numberUnits[number];
        }
      } else {
        let units = number % 10;
        let tens = Math.floor(number / 10) % 10;
        s = s + lang.numberTens[tens - 2];
        if (units !== 0) {
          s = s + "-" + lang.numberUnits[units];
        }
      }
      return s;
    },
    //@DOC
    // Returns the given number in words, as is conventionally said for a year,
    // so 1924 with return "nineteen twenty-three".
    // Throws an error if not a number and rounds to the nearest whole number.
    // Does not properly handle zero - there was no year zero
    toYear: function(number) {
      if (typeof number !== "number") {
        errormsg("toYear can only handle numbers");
        return number;
      }
      number = Math.round(number);
      let s = "";
      let negative = false;
      if (number < 0) {
        negative = true;
        number = -number;
      }
      if (number < 1e4) {
        let hundreds = Math.floor(number / 100);
        log(hundreds);
        number = number % 100;
        if (hundreds > 0) {
          s += lang.numberUnits[hundreds];
          if (number > 0) {
            s += " ";
          }
        }
        log(s);
        if (number < 20) {
          if (number !== 0 || s === "") {
            s = s + lang.numberUnits[number];
          }
        } else {
          let units = number % 10;
          let tens = Math.floor(number / 10) % 10;
          s = s + lang.numberTens[tens - 2];
          if (units !== 0) {
            s = s + "-" + lang.numberUnits[units];
          }
        }
      } else {
        s = number.toString();
      }
      if (negative)
        s += " BCE";
      return s;
    },
    //@DOC
    // Returns the given number in words as the ordinal, so 19 would be returned as 'nineteenth'.
    // Numbers uner -2000 and over 2000 are returned as a string of digits with 'th' appended,
    // so 2001 is returned as '2001th'.
    toOrdinal: function(number) {
      if (typeof number !== "number") {
        errormsg("toOrdinal can only handle numbers");
        return number;
      }
      let s = lang.toWords(number);
      for (let or of lang.ordinalReplacements) {
        if (or.regex.test(s)) {
          return s.replace(or.regex, or.replace);
        }
      }
      return s + "th";
    },
    convertNumbers: function(s) {
      for (let i2 = 0; i2 < lang.numberUnits.length; i2++) {
        let regex = new RegExp("\\b" + lang.numberUnits[i2] + "\\b");
        if (regex.test(s))
          s = s.replace(regex, "" + i2);
      }
      return s;
    },
    getPlural: function(s) {
      if (s.match(/o$/))
        return s + "es";
      if (s.match(/on$/))
        return s + "a";
      if (s.match(/us$/))
        return s.replace(/us$/, "i");
      if (s.match(/um$/))
        return s.replace(/um$/, "a");
      if (s.match(/[aeiou]y$/))
        return s + "s";
      if (s.match(/y$/))
        return s.replace(/y$/, "ies");
      if (s.match(/sis$/))
        return s.replace(/sis$/, "ses");
      if (s.match(/(s|ss|sh|ch|z|x)$/))
        return s + "es";
      return s + "s";
    },
    // Conjugating
    //@DOC
    // Returns the verb properly conjugated for the item, so "go" with a ball would return
    // "goes", but "go" with the player (if using second person pronouns).
    conjugate: function(item2, verb, options = {}) {
      let gender = item2.pronouns.subjective;
      if (gender === "he" || gender === "she") {
        gender = "it";
      }
      const arr = lang.conjugations[gender.toLowerCase()];
      if (!arr) {
        errormsg("No conjugations found: conjugations_" + gender.toLowerCase());
        return verb;
      }
      for (let conj of arr) {
        if (conj.name === verb) {
          return conj.value;
        }
      }
      for (let conj of arr) {
        const name2 = conj.name;
        const value = conj.value;
        if (name2.startsWith("@") && verb.endsWith(name2.substring(1))) {
          return lang.conjugate(item2, verb.substring(0, verb.length - name2.length + 1)) + value;
        } else if (name2.startsWith("*") && verb.endsWith(name2.substring(1))) {
          return verb.substring(0, verb.length - name2.length + 1) + value;
        }
      }
      return options.capitalise ? sentenceCase(verb) : verb;
    },
    //@DOC
    // Returns the pronoun for the item, followed by the conjugated verb,
    // so "go" with a ball would return "it goes", but "go" with the player (if using second person pronouns)
    // would return "you go".
    // The first letter is capitalised if 'capitalise' is true.
    pronounVerb: function(item2, verb, options) {
      let s = item2.pronouns.subjective + " " + lang.conjugate(item2, verb);
      s = s.replace(/ +\'/, "'");
      return options.capitalise ? sentenceCase(s) : s;
    },
    pronounVerbForGroup: function(item2, verb, options) {
      let s = item2.groupPronouns().subjective + " " + lang.conjugate(item2.group(), verb);
      s = s.replace(/ +\'/, "'");
      return options.capitalise ? sentenceCase(s) : s;
    },
    verbPronoun: function(item2, verb, options) {
      let s = lang.conjugate(item2, verb) + " " + item2.pronouns.subjective;
      s = s.replace(/ +\'/, "'");
      return options.capitalise ? sentenceCase(s) : s;
    },
    //@DOC
    // Returns the name for the item, followed by the conjugated verb,
    // so "go" with a ball would return "the ball goes", but "go" with
    // a some bees would return "the bees go". For the player, (if using second person pronouns)
    // would return the pronoun "you go".
    // The first letter is capitalised if 'capitalise' is true.
    nounVerb: function(item2, verb, options) {
      if (item2 === player() && !player().useproperNoun) {
        return lang.pronounVerb(item2, verb, options);
      }
      if (options.article === void 0)
        options.article = DEFINITE;
      let s = lang.getName(item2, options) + " " + lang.conjugate(item2, verb);
      s = s.replace(/ +\'/, "'");
      return options.capitalise ? sentenceCase(s) : s;
    },
    verbNoun: function(item2, verb, options) {
      if (item2 === player()) {
        return lang.pronounVerb(item2, verb, options);
      }
      if (options.article === void 0)
        options.article = DEFINITE;
      let s = lang.conjugate(item2, verb) + " " + lang.getName(item2, options);
      s = s.replace(/ +\'/, "'");
      return options.capitalise ? sentenceCase(s) : s;
    }
  };
  lang.createVerb = function(name2, options = {}) {
    if (options.words === void 0)
      options.words = name2.toLowerCase();
    if (options.ing === void 0)
      options.ing = name2 + "ing";
    if (options.defmsg === void 0)
      options.defmsg = options.ing + " {nm:item:the} is not going to achieve much.";
    if (options.defmsg === true)
      options.defmsg = "{pv:item:'be:true} not something you can do that with.";
    new Cmd(name2, {
      regex: new RegExp("^(?:" + options.words + ") (.+)$"),
      objects: [
        { scope: options.held ? parser.isHeld : parser.isHere }
      ],
      npcCmd: true,
      defmsg: options.defmsg
    });
  };
  lang.createVerbWith = function(name2, options = {}) {
    if (options.words === void 0)
      options.words = name2.toLowerCase();
    if (options.ing === void 0)
      options.ing = name2 + "ing";
    if (options.defmsg === void 0)
      options.defmsg = options.ing + " {nm:item:the} is not going to achieve much.";
    if (options.defmsg === true)
      options.defmsg = "{pv:item:'be:true} not something you can do that with.";
    new Cmd(name2 + "With", {
      regexes: [
        new RegExp("^(?:" + options.words + ") (.+) (?:using|with) (.+)$"),
        { regex: new RegExp("^(?:use|with|using) (.+) to (?:" + options.words + ") (.+)$"), mod: { reverse: true } },
        { regex: new RegExp("^(?:use|with|using) (.+) (?:" + options.words + ") (.+)$"), mod: { reverse: true } }
      ],
      objects: [
        { scope: options.held ? parser.isHeld : parser.isHere },
        { scope: parser.isHeld }
      ],
      attName: name2.toLowerCase(),
      npcCmd: true,
      withScript: true,
      defmsg: options.defmsg
    });
  };
  lang.questions = [
    { q: "who am i", script: function() {
      parser.parse("look me");
      return world.SUCCESS_NO_TURNSCRIPTS;
    } },
    { q: "who are (?:u|you)", script: function() {
      metamsg("Me? I am the parser. I am going to try to understand your commands, and then hopefully the protagonist will act on them in the game world.");
      return world.SUCCESS_NO_TURNSCRIPTS;
    } },
    { q: "who is (?:|the )(?:player|protagonist)", script: function() {
      metamsg("The protagonist is a character in the game world, but a special one - one that you control directly. He or she is your proxy, acting on your behalf, so if you want to know what he or she is like, try WHO AM I?.");
      return world.SUCCESS_NO_TURNSCRIPTS;
    } },
    { q: "what am i", script: function() {
      parser.parse("look me");
      return world.SUCCESS_NO_TURNSCRIPTS;
    } },
    { q: "what (?:(?:have i got|do i have)(?:| on me| with me)|am i (?:carry|hold)ing)", script: function() {
      parser.parse("inv");
      return world.SUCCESS_NO_TURNSCRIPTS;
    } },
    { q: "where am i", script: function() {
      parser.parse("look");
      return world.SUCCESS_NO_TURNSCRIPTS;
    } },
    { q: "what do i do", script: function() {
      parser.parse("help");
      return world.SUCCESS_NO_TURNSCRIPTS;
    } },
    { q: "(?:what do i do now|where do i go)", script: function() {
      parser.parse("hint");
      return world.SUCCESS_NO_TURNSCRIPTS;
    } }
  ];
  const _global = typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : globalThis;
  function bom(blob, opts) {
    if (typeof opts === "undefined")
      opts = { autoBom: false };
    else if (typeof opts !== "object") {
      console.warn("Deprecated: Expected third argument to be a object");
      opts = { autoBom: !opts };
    }
    if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name2, opts) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name2, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node2) {
    try {
      node2.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      let evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        80,
        20,
        false,
        false,
        false,
        false,
        0,
        null
      );
      node2.dispatchEvent(evt);
    }
  }
  const isMacOSWebView = _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent);
  const saveAs = _global.saveAs || // probably in some web worker
  (typeof window !== "object" || window !== _global ? function saveAs2() {
  } : "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? function saveAs2(blob, name2, opts) {
    let URL2 = _global.URL || _global.webkitURL;
    let a = document.createElement("a");
    name2 = name2 || blob.name || "download";
    a.download = name2;
    a.rel = "noopener";
    if (typeof blob === "string") {
      a.href = blob;
      if (a.origin !== location.origin) {
        corsEnabled(a.href) ? download(blob, name2, opts) : click(a, a.target = "_blank");
      } else {
        click(a);
      }
    } else {
      a.href = URL2.createObjectURL(blob);
      setTimeout(function() {
        URL2.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function() {
        click(a);
      }, 0);
    }
  } : "msSaveOrOpenBlob" in navigator ? function saveAs2(blob, name2, opts) {
    name2 = name2 || blob.name || "download";
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name2, opts);
      } else {
        let a = document.createElement("a");
        a.href = blob;
        a.target = "_blank";
        setTimeout(function() {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name2);
    }
  } : function saveAs2(blob, name2, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name2, opts);
    let force = blob.type === "application/octet-stream";
    let isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari;
    let isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      let reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else
          location = url;
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      let URL2 = _global.URL || _global.webkitURL;
      let url = URL2.createObjectURL(blob);
      if (popup)
        popup.location = url;
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL2.revokeObjectURL(url);
      }, 4e4);
    }
  });
  _global.saveAs = saveAs.saveAs = saveAs;
  const saveLoad = {
    getName: function(filename) {
      return "QJS:" + settings.title + ":" + filename;
    },
    saveGame: function(filename, overwrite) {
      if (filename === void 0) {
        errormsg(lang.sl_no_filename);
        return false;
      }
      if (localStorage.getItem(this.getName(filename)) && !overwrite) {
        metamsg(lang.sl_already_exists);
        return;
      }
      const comment2 = settings.saveComment ? settings.saveComment() : "-";
      const s = saveLoad.saveTheWorld(comment2);
      localStorage.setItem(this.getName(filename), s);
      metamsg(lang.sl_saved, { filename, toFile: false });
      if (settings.afterSave)
        settings.afterSave(filename);
      return true;
    },
    saveGameAsFile: function(filename) {
      const comment2 = settings.saveComment ? settings.saveComment() : "-";
      const s = saveLoad.saveTheWorld(comment2);
      const myFile = new File([s], filename + ".q6save", { type: "text/plain;charset=utf-8" });
      saveAs(myFile);
      metamsg(lang.sl_saved, { filename, toFile: true });
      if (settings.afterSave)
        settings.afterSave(filename, true);
      return true;
    },
    saveTheWorld: function(comment2) {
      return saveLoad.getSaveHeader(comment2) + saveLoad.getSaveBody();
    },
    getHeader: function(s) {
      const arr = s.split("!");
      return { title: saveLoad.decodeString(arr[0]), version: saveLoad.decodeString(arr[1]), comment: saveLoad.decodeString(arr[2]), timestamp: arr[3] };
    },
    getSaveHeader: function(comment2) {
      const currentdate = /* @__PURE__ */ new Date();
      let s = saveLoad.encodeString(settings.title) + "!";
      s += saveLoad.encodeString(settings.version) + "!";
      s += saveLoad.encodeString(comment2) + "!";
      s += currentdate.toLocaleString() + "!";
      return s;
    },
    getSaveBody: function() {
      const l = [tp.getSaveString(), game.getSaveString(), util.getChangeListenersSaveString()];
      for (let key in w$1) {
        l.push(key + "=" + w$1[key].getSaveString());
      }
      return l.join("!");
    },
    // LOAD
    // This function will be attached to #fileDialog as its "onchange" event
    loadGameAsFile: function() {
      const fileInput = document.querySelector("#fileDialog");
      const fileIn = fileInput.files;
      const reader = new FileReader();
      reader.readAsText(fileIn[0]);
      reader.onload = function() {
        saveLoad.loadGame(fileIn[0].name, reader.result);
        const el = document.querySelector("#fileDialogForm");
        el.reset();
      };
      reader.onerror = function() {
        log(reader.error);
      };
    },
    loadGameFromLS: function(filename) {
      const contents = localStorage.getItem(this.getName(filename));
      this.loadGame(filename, contents);
    },
    loadGame: function(filename, contents) {
      if (!contents) {
        metamsg(lang.sl_file_not_found);
      } else if (!contents.startsWith(settings.title + "!")) {
        const encodedTitle = contents.substr(0, contents.indexOf("!"));
        metamsg(lang.sl_bad_format, { title: saveLoad.decodeString(encodedTitle) });
      } else {
        saveLoad.loadTheWorld(contents, 4);
        clearScreen();
        metamsg(lang.sl_file_loaded, { filename });
        if (settings.afterLoad)
          settings.afterLoad(filename);
        loc().description();
      }
    },
    loadTheWorld: function(s, removeHeader) {
      const arr = s.split("!");
      if (removeHeader !== void 0) {
        arr.splice(0, removeHeader);
      }
      for (let key in w$1) {
        if (w$1[key].clonePrototype)
          delete w$1[key];
      }
      tp.setLoadString(arr.shift());
      game.setLoadString(arr.shift());
      util.setChangeListenersLoadString(arr.shift());
      for (let el of arr) {
        this.setLoadString(el);
      }
      world.update();
      endTurnUI(true);
    },
    setLoadString: function(s) {
      const parts = s.split("=");
      if (parts.length !== 3) {
        errormsg("Bad format in saved data (" + s + ")");
        return;
      }
      const name2 = parts[0];
      const saveType = parts[1];
      const arr = parts[2].split(";");
      if (saveType.startsWith("Clone")) {
        const clonePrototype = saveType.split(":")[1];
        if (!w$1[clonePrototype]) {
          errormsg("Cannot find prototype '" + clonePrototype + "'");
          return;
        }
        const obj = cloneObject(w$1[clonePrototype]);
        this.setFromArray(obj, arr);
        w$1[obj.name] = obj;
        obj.afterLoadForTemplate();
        return;
      }
      if (saveType === "Object") {
        if (!w$1[name2]) {
          errormsg("Cannot find object '" + name2 + "'");
          return;
        }
        const obj = w$1[name2];
        this.setFromArray(obj, arr);
        obj.afterLoadForTemplate();
        return;
      }
      errormsg("Unknown save type for object '" + name2 + "' (" + hash.saveType + ")");
    },
    // UTILs
    decode: function(hash2, str) {
      if (str.length === 0)
        return false;
      const parts = str.split(":");
      const key = parts[0];
      const attType = parts[1];
      const s = parts[2];
      if (attType === "boolean") {
        hash2[key] = s === "true";
      } else if (attType === "number") {
        hash2[key] = parseFloat(s);
      } else if (attType === "string") {
        hash2[key] = saveLoad.decodeString(s);
      } else if (attType === "array") {
        hash2[key] = saveLoad.decodeArray(s);
      } else if (attType === "numberarray") {
        hash2[key] = saveLoad.decodeNumberArray(s);
      } else if (attType === "emptyarray") {
        hash2[key] = [];
      } else if (attType === "emptystring") {
        hash2[key] = "";
      } else if (attType === "qobject") {
        hash2[key] = w$1[s];
      }
      return key;
    },
    encode: function(key, value) {
      if (value === 0)
        return key + ":number:0;";
      if (value === false)
        return key + ":boolean:false;";
      if (value === "")
        return key + ":emptystring;";
      if (!value)
        return "";
      let attType = typeof value;
      if (Array.isArray(value)) {
        try {
          if (value.length === 0)
            return key + ":emptyarray;";
          if (typeof value[0] === "string")
            return key + ":array:" + saveLoad.encodeArray(value) + ";";
          if (typeof value[0] === "number")
            return key + ":numberarray:" + saveLoad.encodeNumberArray(value) + ";";
          return "";
        } catch (error) {
          log(value);
          throw 'Error encountered with attribute "' + key + '": ' + error + ". More here: https://github.com/ThePix/QuestJS/wiki/Save-Load#save-errors";
        }
      }
      if (value instanceof Exit) {
        return "";
      }
      if (attType === "object") {
        if (value.name)
          return key + ":qobject:" + value.name + ";";
        return "";
      }
      if (attType === "string") {
        return key + ":string:" + saveLoad.encodeString(value) + ";";
      }
      return key + ":" + attType + ":" + value + ";";
    },
    replacements: [
      { unescaped: ":", escaped: "cln" },
      { unescaped: ";", escaped: "scln" },
      { unescaped: "!", escaped: "exm" },
      { unescaped: "=", escaped: "eqs" },
      { unescaped: "~", escaped: "tld" }
    ],
    encodeString: function(s) {
      for (let d of saveLoad.replacements) {
        if (typeof s !== "string")
          throw 'Found type "' + typeof s + '" in array - should be only strings.';
        s = s.replace(new RegExp(d.unescaped, "g"), "@@@" + d.escaped + "@@@");
      }
      return s;
    },
    decodeString: function(s) {
      for (let d of saveLoad.replacements) {
        s = s.replace(new RegExp("@@@" + d.escaped + "@@@", "g"), d.unescaped);
      }
      return s;
    },
    encodeArray: function(ary) {
      return ary.map((el) => saveLoad.encodeString(el)).join("~");
    },
    decodeArray: function(s) {
      return s.split("~").map((el) => saveLoad.decodeString(el));
    },
    encodeNumberArray: function(ary) {
      return ary.map((el) => {
        if (typeof el !== "number")
          throw 'Found type "' + typeof el + '" in array - should be only numbers.';
        return el.toString();
      }).join("~");
    },
    decodeNumberArray: function(s) {
      return s.split("~").map((el) => parseFloat(el));
    },
    decodeExit: function(s) {
      return s.split("~").map((el) => saveLoad.decodeString(el));
    },
    lsTest: function() {
      const test2 = "test";
      try {
        localStorage.setItem(test2, test2);
        localStorage.removeItem(test2);
        return true;
      } catch (e) {
        return false;
      }
    },
    // Other functions
    deleteGame: function(filename) {
      localStorage.removeItem(this.getName(filename));
      metamsg(lang.sl_deleted);
    },
    dirGame: function() {
      const arr0 = lang.sl_dir_headings.map((el) => "<th>" + el + "</th>");
      if (!settings.saveComment)
        arr0.pop();
      let s = arr0.join("");
      for (let key in localStorage) {
        if (!key.startsWith("QJS:"))
          continue;
        const arr1 = key.split(":");
        const arr2 = localStorage[key].split("!");
        log(arr2.slice(1, 4));
        s += "<tr>";
        s += "<td>" + arr1[2] + "</td>";
        s += "<td>" + arr1[1] + "</td>";
        s += "<td>" + arr2[1] + "</td>";
        s += "<td>" + arr2[3] + "</td>";
        if (settings.saveComment)
          s += "<td>" + arr2[2] + "</td>";
        s += "</tr>";
      }
      _msg(s, {}, { cssClass: "meta", tag: "table" });
      metamsg(lang.sl_dir_msg);
    },
    testExistsGame: function(filename) {
      const data = localStorage[this.getName(filename)];
      return data !== void 0;
    },
    getSummary: function(filename) {
      const data = localStorage[this.getName(filename)];
      if (!data)
        return null;
      const arr = data.split("!");
      return arr.slice(1, 4);
    },
    setFromArray: function(obj, arr) {
      const keys = Object.keys(obj).filter((e) => !obj.saveLoadExclude(e));
      for (let el of keys)
        delete obj[el];
      for (let el of arr)
        saveLoad.decode(obj, el);
    },
    // ------------------------------------------------------------------------------------------
    //    TRANSCRIPTS
    //
    // Here because it uses localStorage. That said, there are two independant systems, the second
    // records commands to create a walk-through, and is saved in an array, this.transcriptWalkthrough
    // because only the author should ever use it.
    transcript: false,
    // Set to true when recording
    transcriptName: "QJST:" + settings.title + ":transcript",
    transcriptStart: function() {
      this.transcript = true;
      this.transcriptWalkthrough = [];
      metamsg(lang.transcript_on);
      this.transcriptWrite(lang.transcriptStart());
    },
    transcriptEnd: function() {
      this.transcriptWrite(lang.transcriptEnd());
      this.transcript = false;
      metamsg(lang.transcript_off);
    },
    transcriptAppend: function(data) {
      if (!this.transcript)
        return;
      if (data.cssClass === "menu") {
        let previous = this.transcriptWalkthrough.pop();
        if (previous) {
          previous = previous.replace(/\,$/, "").trim();
          this.transcriptWalkthrough.push("    {cmd:" + previous + ", menu:" + data.n + "},");
        }
      }
      this.transcriptWrite('<p class="' + data.cssClass + '">' + data.text + "</p>");
    },
    // Used internally to write to the file, appending it to the existing text.
    transcriptWrite: function(html) {
      let s = localStorage.getItem(this.transcriptName);
      if (!s)
        s = "";
      s += "\n\n" + html;
      localStorage.setItem(this.transcriptName, s);
    },
    transcriptClear: function(data) {
      localStorage.removeItem(this.transcriptName);
      metamsg(lang.transcript_cleared);
    },
    // Is there a transcript saved?
    transcriptExists: function(data) {
      return localStorage.getItem(this.transcriptName) !== void 0;
    },
    transcriptShow: function() {
      const s = localStorage.getItem(this.transcriptName);
      if (!s) {
        metamsg(lang.transcript_none);
        return false;
      }
      let html = "";
      html += '<div id="main"><div id="inner"><div id="output">';
      html += lang.transcriptTitle();
      html += s;
      html += "</div></div></div>";
      io.showInTab(html, "QuestJS Transcript: " + settings.title);
      metamsg(lang.done_msg);
    },
    transcriptWalk: function() {
      let html = "";
      html += '<div id="main"><div id="inner"><div id="output">';
      html += "<br/><h2>Generated QuestJS Walk-through</h2><br/><br/>";
      html += "<p>Copy-and-paste the code below into code.js. You can quickly run the walk-though with [Ctrl][Enter].</p>";
      html += "<p>If you already have a walk-through, you will need to just copy-and-paste the right bit - probably all but the first and last lines, and insert just before the curly brace at the end. You may need to rename it too.</p>";
      html += "<pre>\n\n\nconst walkthroughs = {\n  c:[\n";
      html += this.transcriptWalkthrough.join("\n");
      html += "\n  ],\n}</pre>";
      html += "</div></div></div>";
      io.showInTab(html, "QuestJS Transcript: " + settings.title);
    },
    achievementsKey: "__achievement__list__for__this__game__",
    setAchievement(s) {
      const achievementsJSON = localStorage.getItem(this.achievementsKey);
      const achievements = achievementsJSON ? JSON.parse(achievementsJSON) : {};
      if (achievements[s])
        return;
      achievements[s] = Date.now();
      _msg(lang.ach_got_one, { text: s, date: achievements[s] }, { cssClass: "meta achieve", tag: "p" });
      localStorage.setItem(this.achievementsKey, JSON.stringify(achievements));
    },
    listAchievements() {
      const achievementsJSON = localStorage.getItem(this.achievementsKey);
      const achievements = achievementsJSON ? JSON.parse(achievementsJSON) : {};
      if (Object.keys(achievements).length === 0) {
        _msg(lang.ach_none_yet, {}, { cssClass: "meta achieve", tag: "p" });
        return;
      }
      _msg(lang.ach_list_intro, { count: Object.keys(achievements).length }, { cssClass: "meta achieve", tag: "p" });
      for (const key in achievements) {
        _msg(lang.ach_list_item, { text: key, date: achievements[key] }, { cssClass: "meta achieve", tag: "p" });
      }
    },
    resetAchievements() {
      localStorage.removeItem(this.achievementsKey);
    }
  };
  function processText(str, params) {
    if (params === void 0) {
      params = { tpNoParamsPassed: true };
    }
    if (typeof str !== "string") {
      str = "" + str;
    }
    params.tpOriginalString = str;
    if (params.count)
      params.item_count = params.count;
    if (tp.usedStrings.includes(str)) {
      params.tpFirstTime = false;
    } else {
      tp.usedStrings.push(str);
      params.tpFirstTime = true;
    }
    return tp.processText(str, params);
  }
  const tp = {
    text_processors: {},
    setLoadString: function(s) {
      const parts = s.split("=");
      if (parts.length !== 2)
        return errormsg("Bad format in saved data (" + s + ")");
      if (parts[0] !== "TPUsedStrings")
        return errormsg("Expected TP to be first");
      tp.usedStrings = saveLoad.decodeArray(parts[1]);
    },
    getSaveString: function() {
      return "TPUsedStrings=" + saveLoad.encodeArray(tp.usedStrings);
    }
  };
  tp.usedStrings = [];
  tp.colours = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe", "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000", "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080", "#ffffff", "#000000"];
  tp.addDirective = function(name2, fn) {
    tp.text_processors[name2] = fn;
  };
  tp.comparisons = {
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
  tp.processText = function(str, params) {
    const s = tp.findFirstToken(str);
    if (s) {
      let arr = s.split(":");
      let left = arr.shift();
      if (typeof tp.text_processors[left] !== "function") {
        if (left.startsWith("if ")) {
          const data = /if (not |)(\w+)\.(\w+) *([<>=!]{0,3}) *(.*)/.exec(left);
          if (data[4] === "") {
            arr.unshift(data[3]);
            arr.unshift(data[2]);
            left = data[1] === "not " ? "ifNot" : "if";
          } else {
            arr.unshift(data[5]);
            arr.unshift(data[3]);
            arr.unshift(data[2]);
            left = tp.comparisons[data[4]];
          }
        } else if (left.match(/^(not)?here /)) {
          const ary = left.split(" ");
          ary.shift();
          left = left.startsWith("here") ? "ifHere" : "ifNotHere";
          for (const el of ary.reverse())
            arr.unshift(el);
        } else if (left === "player") {
          arr.unshift(player().name);
          left = "show";
        } else if (left === "currentLocation") {
          arr.unshift(loc$1().name);
          left = "show";
        } else if (w$1[left]) {
          arr.unshift(left);
          left = "show";
        } else if (arr.length === 0) {
          arr = left.split(".");
          left = "show";
        } else {
          errormsg("Attempting to use unknown text processor directive '" + left + "' (" + params.tpOriginalString + ")");
          return str;
        }
      }
      str = str.replace("{" + s + "}", tp.text_processors[left](arr, params));
      str = tp.processText(str, params);
    }
    return str;
  };
  tp.findFirstToken = function(s) {
    const end = s.indexOf("}");
    if (end === -1) {
      return false;
    }
    const start = s.lastIndexOf("{", end);
    if (start === -1) {
      errormsg("Failed to find starting curly brace in text processor (<i>" + s + "</i>)");
      return false;
    }
    return s.substring(start + 1, end);
  };
  tp.text_processors.i = function(arr, params) {
    return "<i>" + arr.join(":") + "</i>";
  };
  tp.text_processors.b = function(arr, params) {
    return "<b>" + arr.join(":") + "</b>";
  };
  tp.text_processors.u = function(arr, params) {
    return "<u>" + arr.join(":") + "</u>";
  };
  tp.text_processors.s = function(arr, params) {
    return "<strike>" + arr.join(":") + "</strike>";
  };
  tp.text_processors.code = function(arr, params) {
    return "<code>" + arr.join(":") + "</code>";
  };
  tp.text_processors.sup = function(arr, params) {
    return "<sup>" + arr.join(":") + "</sup>";
  };
  tp.text_processors.sub = function(arr, params) {
    return "<sub>" + arr.join(":") + "</sub>";
  };
  tp.text_processors.huge = function(arr, params) {
    return '<span style="font-size:2em">' + arr.join(":") + "</span>";
  };
  tp.text_processors.big = function(arr, params) {
    return '<span style="font-size:1.5em">' + arr.join(":") + "</span>";
  };
  tp.text_processors.small = function(arr, params) {
    return '<span style="font-size:0.8em">' + arr.join(":") + "</span>";
  };
  tp.text_processors.tiny = function(arr, params) {
    return '<span style="font-size:0.6em">' + arr.join(":") + "</span>";
  };
  tp.text_processors.smallcaps = function(arr, params) {
    return '<span style="font-variant:small-caps">' + arr.join(":") + "</span>";
  };
  tp.text_processors.cap = function(arr, params) {
    return sentenceCaseForHTML(arr.join(":"));
  };
  tp.text_processors.title = function(arr, params) {
    return titleCaseForHTML(arr.join(":"));
  };
  tp.text_processors.upper = function(arr, params) {
    return arr.join(":").toUpperCase();
  };
  tp.text_processors.lower = function(arr, params) {
    return arr.join(":").toLowerCase();
  };
  tp.text_processors.rainbow = function(arr, params) {
    const s = arr.pop();
    const colours = arr.length === 0 ? tp.colours : arr;
    let result2 = "";
    for (let i2 = 0; i2 < s.length; i2++) {
      result2 += '<span style="color:' + random.fromArray(colours) + '">' + s.charAt(i2) + "</span>";
    }
    return result2;
  };
  tp._charSwap = function(c2, upper, lower) {
    if (c2.match(/[A-Z]/))
      return String.fromCharCode(c2.charCodeAt(0) - "A".charCodeAt(0) + upper);
    if (c2.match(/[a-z]/))
      return String.fromCharCode(c2.charCodeAt(0) - "a".charCodeAt(0) + lower);
    return c2;
  };
  tp.text_processors.encode = function(arr, params) {
    const upper = parseInt(arr.shift(), 16);
    const lower = parseInt(arr.shift(), 16);
    const s = arr.shift();
    let result2 = "";
    for (let i2 = 0; i2 < s.length; i2++) {
      result2 += tp._charSwap(s.charAt(i2), upper, lower);
    }
    return result2;
  };
  tp.text_processors.blur = function(arr, params) {
    const n = arr.shift();
    return '<span style="color:transparent;text-shadow: 0 0 ' + n + 'px rgba(0,0,0,1);">' + arr.join(":") + "</span>";
  };
  tp.text_processors.font = function(arr, params) {
    const f = arr.shift();
    return '<span style="font-family:' + f + '">' + arr.join(":") + "</span>";
  };
  tp.text_processors.class = function(arr, params) {
    const c2 = arr.shift();
    return '<span class="' + c2 + '">' + arr.join(":") + "</span>";
  };
  tp.text_processors.colour = function(arr, params) {
    const c2 = arr.shift();
    return '<span style="color:' + c2 + '">' + arr.join(":") + "</span>";
  };
  tp.text_processors.color = tp.text_processors.colour;
  tp.text_processors.back = function(arr, params) {
    const c2 = arr.shift();
    return '<span style="background-color:' + c2 + '">' + arr.join(":") + "</span>";
  };
  tp.text_processors.dialogue = function(arr, params) {
    let prefix2 = "<span";
    const style = arr.shift();
    if (arr.length < 1)
      errormsg("Failed to find enough parts in text processor 'dialog' (" + params.tpOriginalString + ")");
    if (style.startsWith(".")) {
      prefix2 += ' class="' + style.replace(".", "") + '"';
    } else if (params[style]) {
      prefix2 += ' style="' + params[style].dialogueStyle + '"';
    } else {
      if (arr.length < 2)
        errormsg("Failed to find enough parts in text processor 'dialog' without a class (" + params.tpOriginalString + ")");
      const colour = arr.shift();
      prefix2 += ' style="';
      if (style.includes("i"))
        prefix2 += "font-style:italic;";
      if (style.includes("b"))
        prefix2 += "font-weight:bold;";
      if (style.includes("u"))
        prefix2 += "text-decoration:underline;";
      if (colour) {
        prefix2 += "color:" + colour;
      }
      prefix2 += '"';
    }
    prefix2 += ">";
    return prefix2 + settings.openQuotation + arr.join() + settings.closeQuotation + "</span>";
  };
  tp.text_processors.random = function(arr, params) {
    return arr[random.int(0, arr.length - 1)];
  };
  tp.text_processors.select = function(arr, params) {
    return tp.select(arr, params, "none");
  };
  tp.text_processors.selectNone = function(arr, params) {
    return tp.select(arr, params, "none");
  };
  tp.text_processors.selectWrap = function(arr, params) {
    return tp.select(arr, params, "wrap");
  };
  tp.text_processors.selectStart = function(arr, params) {
    return tp.select(arr, params, "start");
  };
  tp.text_processors.selectEnd = function(arr, params) {
    return tp.select(arr, params, "end");
  };
  tp.text_processors.cycle = function(arr, params) {
    return tp.select(arr, params, "none", true);
  };
  tp.text_processors.cycleNone = function(arr, params) {
    return tp.select(arr, params, "none", true);
  };
  tp.text_processors.cycleWrap = function(arr, params) {
    return tp.select(arr, params, "wrap", true);
  };
  tp.text_processors.cycleStart = function(arr, params) {
    return tp.select(arr, params, "start", true);
  };
  tp.text_processors.cycleEnd = function(arr, params) {
    return tp.select(arr, params, "end", true);
  };
  tp.select = function(arr, params, opt, cycling) {
    let name2 = arr.shift();
    if (name2.match(/\./)) {
      const ary = name2.split(".");
      name2 = ary[0];
      arr.unshift(ary[1]);
    }
    const o = tp._findObject(name2, params, arr);
    if (!o)
      errormsg('Failed to find an object called "' + name2 + '" in text processor select.');
    const l = o[arr[0]];
    if (l === void 0 && !cycling)
      errormsg('Failed to find an attribute called "' + arr[0] + '" for "' + name2 + '" in text processor "select" directive.');
    if (Array.isArray(l)) {
      let n = o[arr[1]];
      if (cycling) {
        if (typeof n !== "number") {
          n = 0;
          o[arr[1]] = 0;
        }
        o[arr[1]]++;
      }
      if (!l)
        errormsg('Failed to find a secondary attribute called "' + arr[1] + '" for "' + name2 + '" in text processor "select" directive.');
      return array.value(l, Math.round(n), opt);
    }
    if (typeof l === "number") {
      if (cycling)
        o[arr[0]]++;
      arr.shift();
      return array.value(arr, Math.round(l), opt);
    }
    if (l === void 0 && cycling) {
      o[arr[0]] = 1;
      arr.shift();
      return array.value(arr, 0, opt);
    }
    errormsg('Failed to do anything with the attribute called "' + arr[1] + '" for "' + name2 + '" in text processor select - neither an array or an integer.');
  };
  tp._findObject = function(name2, params, arr) {
    if (params && params[name2])
      return typeof params[name2] === "string" ? w$1[params[name2]] : params[name2];
    if (name2 === "player")
      return player();
    if (name2 === "currentLocation")
      return loc$1();
    if (name2 === "settings")
      return settings;
    if (name2 === "params")
      return params;
    if (w$1[name2])
      return w$1[name2];
    const ary = name2.split(".");
    if (ary.length === 1)
      return void 0;
    if (ary.length > 2) {
      console.log("The text process cannot handle attributes of attributes, so failed to deal with: " + name2);
      console.log(ary);
      return void 0;
    }
    arr.unshift(ary[1]);
    return w$1[ary[0]];
  };
  tp.text_processors.multi = function(arr, params) {
    if (!params.multiple)
      return "";
    return sentenceCase(params.item.alias) + ": ";
  };
  tp.text_processors.show = function(arr, params) {
    let name2 = arr.shift();
    return tp.handleShow(arr, name2, null, params);
  };
  tp.text_processors.showOrNot = function(arr, params) {
    let name2 = arr.shift();
    let def = arr.shift();
    return tp.handleShow(arr, name2, def, params);
  };
  tp.handleShow = function(arr, name2, def, params) {
    if (params[name2] !== void 0) {
      if (typeof params[name2] === "object")
        return tp.getWhatever(params[name2][arr[0]], params, params[name2], def, arr);
      return tp.getWhatever(params[name2], params, void 0, def, arr);
    }
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'show' (" + params.tpOriginalString + ")");
    return tp.getWhatever(obj[arr[0]], params, obj, def, arr);
  };
  tp.text_processors.object = tp.text_processors.show;
  tp.getWhatever = function(val, params, obj, def, arr) {
    if (val === void 0 || val === null)
      return def ? def : "";
    if (val === false)
      return lang.tp_false;
    if (val === true)
      return lang.tp_true;
    if (val === void 0)
      return "";
    if (typeof val === "string")
      return val;
    if (typeof val === "number")
      return val.toString();
    if (val && typeof val === "object") {
      if (!arr[0])
        return errormsg("Got an object, but no attribute in show for: " + val.name);
      if (!val[arr[0]])
        return errormsg("Got an object, but no attribute valled " + arr[0] + " in show for: " + val.name);
      return val[arr[0]].toString();
    }
    if (typeof val !== "function")
      return errormsg("Got a value of a type I was not expecting in show: " + typeof val);
    const func2 = val.bind(obj);
    arr.shift();
    return tp.getWhatever(func2(params), params, obj, def, arr);
  };
  tp.text_processors.contents = function(arr, params) {
    let name2 = arr.shift();
    const obj = typeof params[name2] === "object" ? params[name2] : tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'contents' (" + params.tpOriginalString + ")");
    return formatList(obj.getContents(world.LOOK), { article: INDEFINITE, sep: arr[0], lastSep: arr[1], nothing: arr[2] });
  };
  tp.text_processors.rndalt = function(arr, params) {
    let name2 = arr.shift();
    if (params[name2]) {
      if (typeof params[name2] === "string")
        return params[name2];
      if (typeof params[name2] === "number")
        return params[name2].toString();
      if (arr.length > 0)
        return params[name2][arr[0]];
    }
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'show' (" + params.tpOriginalString + ")");
    if (obj.alt)
      return random.fromArray(obj.alt);
    return obj.alias;
  };
  tp.text_processors.number = function(arr, params) {
    let name2 = arr.shift();
    if (name2.match(/^\d+$/))
      return lang.toWords(parseInt(name2));
    if (typeof params[name2] === "number")
      return lang.toWords(params[name2], arr[0]);
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'number' (" + params.tpOriginalString + ")");
    const att = arr.shift();
    if (typeof obj[att] === "number")
      return lang.toWords(obj[att], arr[0]);
    return errormsg("Failed to find a number for object '" + name2 + "' in text processor (" + params.tpOriginalString + ")");
  };
  tp.text_processors.ordinal = function(arr, params) {
    let name2 = arr.shift();
    if (name2.match(/^\d+$/))
      return lang.toOrdinal(parseInt(name2));
    if (typeof params[name2] === "number")
      return lang.toOrdinal(params[name2]);
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'number' (" + params.tpOriginalString + ")");
    if (typeof obj[arr[0]] === "number")
      return lang.toOrdinal(obj[arr[0]]);
    return errormsg("Failed to find a number for object '" + name2 + "' in text processor (" + params.tpOriginalString + ")");
  };
  tp.text_processors.money = function(arr, params) {
    let name2 = arr.shift();
    if (name2.match(/^\d+$/))
      return displayMoney(parseInt(name2));
    if (typeof params[name2] === "number")
      return displayMoney(params[name2]);
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'money' (" + params.tpOriginalString + ")");
    if (obj.loc === player().name && obj.getSellingPrice) {
      return displayMoney(obj.getSellingPrice(player()));
    }
    if (obj.loc === player().name && obj.getBuyingPrice) {
      return displayMoney(obj.getBuyingPrice(player()));
    }
    if (obj.getPrice) {
      return displayMoney(obj.getPrice());
    }
    if (obj.price) {
      return displayMoney(obj.price);
    }
    if (obj.money) {
      return displayMoney(obj.money);
    }
    return errormsg("Failed to find a price for object '" + name2 + "' in text processor (" + params.tpOriginalString + ")");
  };
  tp.text_processors["$"] = tp.text_processors.money;
  tp.text_processors.dateTime = function(arr, params) {
    const options = { format: arr[0] };
    if (!isNaN(arr[1]))
      options.is = parseInt(arr[1]);
    if (!isNaN(arr[2]))
      options.add = parseInt(arr[2]);
    return util.getDateTime(options);
  };
  tp.text_processors.date = function(arr, params) {
    return new Date(params[arr[0]]).toLocaleString();
  };
  tp.text_processors.transitDest = function(arr, params) {
    const transit = arr[0] ? w$1[arr[0]] : w$1[player().loc];
    if (!transit.transitDoorDir)
      return errormsg("Trying to use the 'transitDest' text process directive when the player is not in a transit location (" + params.tpOriginalString + ").");
    if (transit.currentButtonName) {
      const button = w$1[transit.currentButtonName];
      if (button.title)
        return button.title;
    }
    const destName = transit[transit.transitDoorDir].name;
    return lang.getName(w$1[destName], { capital: true });
  };
  tp.text_processors.img = function(arr, params) {
    const src = arr[0].includes("/") ? arr[0] : settings.imagesFolder + arr[0];
    return '<img src="' + src + '" title="' + arr[1] + '" alt="' + arr[2] + '"/>';
  };
  tp.once = function(params, s1, s2) {
    if (params.tpFirstTime && s1)
      return s1;
    if (!params.tpFirstTime && s2)
      return s2;
    return "";
  };
  tp.text_processors.once = function(arr, params) {
    return tp.once(params, arr[0], arr[1]);
  };
  tp.text_processors.first = tp.text_processors.once;
  tp.text_processors.notOnce = function(arr, params) {
    return tp.once(params, arr[1], arr[0]);
  };
  tp.text_processors.notfirst = tp.text_processors.notOnce;
  tp.text_processors.cmd = function(arr, params) {
    if (arr.length === 1) {
      return io.cmdlink(arr[0], arr[0]);
    } else {
      return io.cmdlink(arr[0], arr[1]);
    }
  };
  tp.text_processors.command = function(arr, params) {
    if (arr.length === 1) {
      return io.cmdlink(arr[0], arr[0]);
    } else {
      return io.cmdlink(arr[0], arr[1]);
    }
  };
  tp.text_processors.exit = tp.text_processors.command;
  tp.text_processors.page = tp.text_processors.command;
  tp.text_processors.hour = function(arr, params) {
    const hour = util.getDateTimeDict().hour;
    if (hour < arr[0])
      return "";
    if (hour >= arr[1])
      return "";
    return arr[2];
  };
  tp.text_processors.link = function(arr, params) {
    let s1 = arr.shift();
    let s2 = arr.join(":");
    return '<a href="' + s2 + '" target="_blank">' + s1 + "</a>";
  };
  tp.text_processors.popup = function(arr, params) {
    let s1 = arr.shift();
    let s2 = arr.join(":");
    let id = s1.replace(/[^a-zA-Z_]/, "") + random.int(0, 999999999);
    const html = '<div id="' + id + `" class="popup" onclick="io.toggleDisplay('` + id + `')"><p>` + s2 + "</p></div>";
    document.querySelector("#main").innerHTML += html;
    return `<span class="popup-link" onclick="io.toggleDisplay('#` + id + `')">` + s1 + "</span>";
  };
  tp.text_processors.roomSet = function(arr, params) {
    const n = loc$1().roomSetOrder - 1;
    return n < arr.length ? arr[n] : "";
  };
  tp.text_processors.if = function(arr, params) {
    return tp.handleIf(arr, params, false);
  };
  tp.text_processors.ifNot = function(arr, params) {
    return tp.handleIf(arr, params, true);
  };
  tp.handleIf = function(arr, params, reverse) {
    let name2 = arr.shift(), flag;
    if (typeof params[name2] === "boolean")
      return params[name2] ? arr[0] : arr[1] ? arr[1] : "";
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'if/ifNot' (" + params.tpOriginalString + ")");
    name2 = arr.shift();
    let attValue = typeof obj[name2] === "function" ? obj[name2](params) : obj[name2];
    if (typeof attValue === "object")
      attValue = attValue.name;
    if (attValue === void 0)
      attValue = false;
    if (typeof attValue === "boolean") {
      flag = attValue;
    } else {
      let value = arr.shift();
      if (typeof attValue === "number") {
        if (isNaN(value))
          return errormsg("Trying to compare a numeric attribute, '" + name2 + "' with a string (" + params.tpOriginalString + ").");
        value = parseInt(value);
      }
      flag = attValue === value;
    }
    if (reverse)
      flag = !flag;
    return flag ? arr[0] : arr[1] ? arr[1] : "";
  };
  tp.text_processors.ifIs = function(arr, params) {
    return tp.handleIfIs(arr, params, false);
  };
  tp.text_processors.ifNotIs = function(arr, params) {
    return tp.handleIfIs(arr, params, true);
  };
  tp.handleIfIs = function(arr, params, reverse) {
    let name2 = arr.shift(), flag;
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'if/ifNot' (" + params.tpOriginalString + ")");
    name2 = arr.shift();
    let attValue = typeof obj[name2] === "function" ? obj[name2](params) : obj[name2];
    if (typeof attValue === "object")
      attValue = attValue.name;
    const value = util.guessMyType(arr.shift());
    flag = attValue === value;
    if (reverse)
      flag = !flag;
    return flag ? arr[0] : arr[1] ? arr[1] : "";
  };
  tp.text_processors.ifExists = function(arr, params) {
    return tp.handleIfExists(arr, params, false);
  };
  tp.text_processors.ifNotExists = function(arr, params) {
    return tp.handleIfExists(arr, params, true);
  };
  tp.handleIfExists = function(arr, params, reverse) {
    let name2 = arr.shift(), flag;
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'if/ifNotExists' (" + params.tpOriginalString + ")");
    name2 = arr.shift();
    flag = obj[name2] !== void 0;
    if (reverse)
      flag = !flag;
    return flag ? arr[0] : arr[1] ? arr[1] : "";
  };
  tp.text_processors.ifLessThan = function(arr, params) {
    return tp.handleIfLessMoreThan(arr, params, false, false);
  };
  tp.text_processors.ifMoreThan = function(arr, params) {
    return tp.handleIfLessMoreThan(arr, params, true, false);
  };
  tp.text_processors.ifLessThanOrEqual = function(arr, params) {
    return tp.handleIfLessMoreThan(arr, params, false, true);
  };
  tp.text_processors.ifMoreThanOrEqual = function(arr, params) {
    return tp.handleIfLessMoreThan(arr, params, true, true);
  };
  tp.handleIfLessMoreThan = function(arr, params, moreThan, orEqual) {
    let name2 = arr.shift(), flag;
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'ifLessMoreThan' (" + params.tpOriginalString + ")");
    name2 = arr.shift();
    let attValue = typeof obj[name2] === "function" ? obj[name2](params) : obj[name2];
    if (typeof attValue !== "number")
      return errormsg("Trying to use ifLessThan with a non-numeric (or nonexistent) attribute, '" + name2 + "' (" + params.tpOriginalString + ").");
    let value = arr.shift();
    if (isNaN(value))
      return errormsg("Trying to compare a numeric attribute, '" + name2 + "' with a string (" + params.tpOriginalString + ").");
    value = parseInt(value);
    flag = moreThan ? orEqual ? attValue >= value : attValue > value : orEqual ? attValue <= value : attValue < value;
    return flag ? arr[0] : arr[1] ? arr[1] : "";
  };
  tp.text_processors.ifHere = function(arr, params) {
    return tp.handleIfHere(arr, params, false, "loc");
  };
  tp.text_processors.ifNotHere = function(arr, params) {
    return tp.handleIfHere(arr, params, true, "loc");
  };
  tp.text_processors.ifHeld = function(arr, params) {
    return tp.handleIfHere(arr, params, false, "name");
  };
  tp.text_processors.ifNotHeld = function(arr, params) {
    return tp.handleIfHere(arr, params, true, "name");
  };
  tp.handleIfHere = function(arr, params, reverse, locAtt) {
    const name2 = arr.shift();
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'ifHere' (" + params.tpOriginalString + ")");
    let flag = obj.isAtLoc(player()[locAtt], world.ALL);
    if (reverse)
      flag = !flag;
    return flag ? arr[0] : arr[1] ? arr[1] : "";
  };
  tp.text_processors.ifPlayer = function(arr, params) {
    return tp.handleIfPlayer(arr, params, false);
  };
  tp.text_processors.ifNotPlayer = function(arr, params) {
    return tp.handleIfPlayer(arr, params, true);
  };
  tp.handleIfPlayer = function(arr, params, reverse) {
    let name2 = arr.shift(), flag;
    const obj = tp._findObject(name2, params, arr);
    if (!obj)
      return errormsg("Failed to find object '" + name2 + "' in text processor 'if/ifNotPlayer' (" + params.tpOriginalString + ")");
    flag = obj === player();
    if (reverse)
      flag = !flag;
    return flag ? arr[0] : arr[1] ? arr[1] : "";
  };
  tp.text_processors.terse = function(arr, params) {
    if (settings.verbosity === world.TERSE && loc$1().visited === 0 || settings.verbosity === world.VERBOSE || params.fullDescription) {
      return sentenceCase(arr.join(":"));
    } else {
      return "";
    }
  };
  tp.text_processors.hereDesc = function(arr, params) {
    let s;
    const attName = settings.getLocationDescriptionAttName();
    if (typeof loc$1()[attName] === "string") {
      s = loc$1()[attName];
    } else if (typeof loc$1()[attName] === "function") {
      s = loc$1()[attName]();
      if (s === void 0) {
        log("This location description is not set up properly. It has a '" + attName + `' function that does not return a string. The location is "` + loc$1().name + '".');
        return "[Bad description, F12 for details]";
      }
    } else {
      s = "This is a location in dire need of a description.";
    }
    for (const el of scopeHereParser()) {
      if (typeof el.scenery === "string")
        s += (settings.sceneryOnNewLine ? "|" : " ") + el.scenery;
    }
    delete params.tpFirstTime;
    return processText(s, params);
  };
  tp.text_processors.hereName = function(arr, params) {
    return loc$1().headingAlias;
  };
  tp.text_processors.objectsHere = function(arr, params) {
    const listOfOjects = scopeHereListed();
    return listOfOjects.length === 0 ? "" : arr.join(":");
  };
  tp.text_processors.exitsHere = function(arr, params) {
    const list2 = loc$1().getExitDirs();
    return list2.length === 0 ? "" : arr.join(":");
  };
  tp.text_processors.objects = function(arr, params) {
    const listOfOjects = scopeHereListed();
    return formatList(listOfOjects, {
      article: INDEFINITE,
      lastSep: lang.list_and,
      modified: true,
      nothing: lang.list_nothing,
      loc: player().loc
    });
  };
  tp.text_processors.exits = function(arr, params) {
    const list2 = loc$1().getExitDirs();
    return formatList(list2, { lastSep: lang.list_or, nothing: lang.list_nowhere });
  };
  tp.text_processors.nm = function(arr, params) {
    return tp.nameFunction(arr, params, false);
  };
  tp.text_processors.nms = function(arr, params) {
    return tp.nameFunction(arr, params, true);
  };
  tp.text_processors.list = function(arr, params) {
    return tp.nameFunction(arr, params, false, true);
  };
  tp.nameFunction = function(arr, params, isPossessive, isList) {
    const name2 = arr.shift();
    let subject2;
    if (isList) {
      subject2 = params[name2];
      if (!subject2) {
        errormsg("Cannot find parameter for list text processor directive:" + name2);
        return false;
      }
      if (!Array.isArray(subject2)) {
        errormsg("Parameter for list text processor directive is not a list:" + name2);
        return false;
      }
    } else {
      subject2 = tp._findObject(name2, params, arr);
      if (!subject2)
        return false;
    }
    const options = { possessive: isPossessive };
    if (arr[0] === "THE") {
      options.article = DEFINITE;
      options.ignorePossessive = true;
    }
    if (arr[0] === "the")
      options.article = DEFINITE;
    if (arr[0] === "the-pa") {
      options.article = DEFINITE;
      options.possAdj = true;
    }
    if (arr[0] === "A") {
      options.article = INDEFINITE;
      options.ignorePossessive = true;
    }
    if (arr[0] === "a")
      options.article = INDEFINITE;
    if (arr[0] === "a-pa") {
      options.article = INDEFINITE;
      options.possAdj = true;
    }
    if (arr[2] && options.possAdj) {
      options.possAdj = tp._findObject(arr[2], params, []);
    }
    if (arr[0] === "count")
      options.article = COUNT;
    if (params[subject2.name + "_count"])
      options[subject2.name + "_count"] = params[subject2.name + "_count"];
    if (params[name2 + "_count"])
      options[subject2.name + "_count"] = params[name2 + "_count"];
    if (params[subject2.name + "_count_loc"])
      options["loc"] = params[subject2.name + "_count_loc"];
    let n = 2;
    while (arr[n]) {
      options[arr[n]] = params[arr[n]];
      n++;
    }
    options.lastSep = lang.list_and;
    options.othing = lang.list_nothing;
    const s = isList ? formatList(subject2, options) : lang.getName(subject2, options);
    return arr[1] === "true" ? sentenceCase(s) : s;
  };
  tp.text_processors.nv = function(arr, params) {
    return tp.conjugations(lang.nounVerb, arr, params);
  };
  tp.text_processors.pv = function(arr, params) {
    return tp.conjugations(lang.pronounVerb, arr, params);
  };
  tp.text_processors.vn = function(arr, params) {
    return tp.conjugations(lang.verbNoun, arr, params);
  };
  tp.text_processors.vp = function(arr, params) {
    return tp.conjugations(lang.verbPronoun, arr, params);
  };
  tp.text_processors.cj = function(arr, params) {
    return tp.conjugations(lang.conjugate, arr, params);
  };
  tp.conjugations = function(func2, arr, params) {
    const name2 = arr.shift();
    const subject2 = tp._findObject(name2, params, arr);
    if (!subject2)
      return false;
    const options = { capitalise: arr[1] === "true" };
    let n = 2;
    while (arr[n]) {
      options[arr[n]] = params[arr[n]];
      n++;
    }
    return func2(subject2, arr[0], options);
  };
  tp.handlePronouns = function(arr, params, pronoun) {
    const name2 = arr.shift();
    const subject2 = tp._findObject(name2, params, arr);
    if (!subject2)
      return false;
    return arr[0] === "true" ? sentenceCase(subject2.pronouns[pronoun]) : subject2.pronouns[pronoun];
  };
  tp.text_processors.pa = function(arr, params) {
    return tp.handlePronouns(arr, params, "possAdj");
  };
  tp.text_processors.ob = function(arr, params) {
    return tp.handlePronouns(arr, params, "objective");
  };
  tp.text_processors.sb = function(arr, params) {
    return tp.handlePronouns(arr, params, "subjective");
  };
  tp.text_processors.ps = function(arr, params) {
    return tp.handlePronouns(arr, params, "possessive");
  };
  tp.text_processors.rf = function(arr, params) {
    return tp.handlePronouns(arr, params, "reflexive");
  };
  tp.text_processors.pa2 = function(arr, params) {
    const name1 = arr.shift();
    const chr1 = tp._findObject(name1, params, arr);
    if (!chr1)
      return false;
    const name2 = arr.shift();
    const chr2 = tp._findObject(name2, params, arr);
    if (!chr2)
      return false;
    if (chr1.pronouns === chr2.pronouns && chr1 !== chr2) {
      const opt = { article: DEFINITE, possessive: true };
      return arr[0] === "true" ? sentenceCase(lang.getName(chr1, opt)) : lang.getName(chr1, opt);
    }
    return arr[0] === "true" ? sentenceCase(chr1.pronouns.possAdj) : chr1.pronouns.possAdj;
  };
  tp.text_processors.pa3 = function(arr, params) {
    const name1 = arr.shift();
    const chr1 = tp._findObject(name1, params, arr);
    if (!chr1)
      return false;
    const name2 = arr.shift();
    const chr2 = tp._findObject(name2, params, arr);
    if (!chr2)
      return false;
    if (chr1 !== chr2) {
      const opt = { article: DEFINITE, possessive: true };
      return arr[0] === "true" ? sentenceCase(lang.getName(subject, opt)) : lang.getName(subject, opt);
    }
    return arr[0] === "true" ? sentenceCase(chr1.pronouns.possAdj) : chr1.pronouns.possAdj;
  };
  const printError = function(msg2, err, suppressTrace) {
    console.error("ERROR: " + msg2);
    if (world.isCreated) {
      io.print({ tag: "p", cssClass: "error", text: lang.error });
      saveLoad.transcriptAppend({ cssClass: "error", text: msg2, stack: err.stack });
      io.reset();
    }
    if (suppressTrace)
      return false;
    console.log('Look through the trace below to find the offending code. The first entry in the list may be "errormsg" in the file "_io.js", which is me so can be ignored. The next will the code that detected the error and called the "errormsg" message. You may need to look further down to find the root cause, especially for a text process issue.');
    if (settings.playMode !== "dev")
      console.log("If this is uploaded, it might be worth doing [Crtl]-[Shft]-R to reload the page. You will lose any progress, but it will clear the browser cache and ensure you are using the latest version of the game files.");
    console.log(err);
    return false;
  };
  if (settings.playMode !== "dev") {
    window.onbeforeunload = function(event) {
      event.returnValue = "Are you sure?";
    };
  }
  settings.mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  settings.autoscroll = !settings.mediaQuery.matches;
  function _msg(s, params, options) {
    if (options.tag === void 0)
      options.tag = "p";
    if (options.cssClass === void 0)
      options.cssClass = "default-" + options.tag.toLowerCase();
    let processed = params ? processText(s, params).trim() : s.trim();
    if (processed === "" && !options.printBlank)
      return;
    for (let line of processed.split("|")) {
      for (const el in io.escapeCodes) {
        line = line.replace(RegExp("@@@" + el + "@@@", "ig"), io.escapeCodes[el]);
      }
      if (settings.convertDoubleDash && !test.testing)
        line = line.replace(/ -- /g, " &mdash; ");
      const data = {};
      Object.assign(data, options);
      data.text = line;
      if (!data.action)
        data.action = "output";
      if (test.testing) {
        if (test.ignoreHTML)
          line = line.replace(/(<([^>]+)>)/gi, "");
        if (test.fullOutputData) {
          test.testOutput.push(data);
        } else {
          test.testOutput.push(line);
        }
      } else {
        io.addToOutputQueue(data);
      }
    }
  }
  function rawPrint(s) {
    _msg(s, false, {});
  }
  function msg(s, params, cssClass) {
    if (!params)
      params = {};
    if (typeof s !== "string") {
      console.error('Trying to print with "msg", but got this instead of a string:');
      console.error(s);
      const err = new Error();
      log(err.stack);
      throw "Bad string for msg()";
    }
    if (/^#/.test(s) && !cssClass) {
      s = s.replace(/^#/, "");
      _msg(s, params, { cssClass: "default-h default-h4", tag: "h4" });
    } else {
      _msg(s, params, { cssClass, tag: "p" });
    }
  }
  function msgPre(s, params, cssClass) {
    if (!params)
      params = {};
    if (typeof s !== "string") {
      console.error('Trying to print with "msgPre", but got this instead of a string:');
      console.error(s);
      console.trace();
      throw "Bad string for msgPre()";
    }
    _msg(s, params, { cssClass, tag: "pre" });
  }
  function OutputTextNoBr(s, params, cssClass) {
    if (s.startsWith(" ")) {
      s = "&nbsp;" + s.substring(1, s.length);
    }
    if (s.endsWith(" ")) {
      s = s.substring(0, s.length - 1) + "&nbsp;";
    }
    msg("@@OUTPUTTEXTNOBR@@" + s, params, cssClass);
  }
  function msgBlankLine() {
    _msg("", false, { tag: "p", printBlank: true });
  }
  function msgDiv(arr, params, cssClass) {
    let s = "";
    for (let item2 of arr) {
      s += "  <p>" + item2 + "</p>\n";
    }
    _msg(s, params || {}, { cssClass, tag: "div" });
  }
  function msgList(arr, ordered, params, cssClass) {
    let s = "";
    for (let item2 of arr) {
      s += "  <li>" + item2 + "</li>\n";
    }
    _msg(s, params || {}, { cssClass, tag: ordered ? "ol" : "ul" });
  }
  function msgTable(arr, headings, params, cssClass) {
    let s = "";
    if (headings) {
      s += "  <tr>\n";
      for (let item2 of headings) {
        s += "    <th>" + item2 + "</th>\n";
      }
      s += "  </tr>\n";
    }
    for (let row of arr) {
      s += "  <tr>\n";
      for (let item2 of row) {
        s += "    <td>" + processText(item2, params).trim() + "</td>\n";
      }
      s += "  </tr>\n";
    }
    _msg(s, params || {}, { cssClass, tag: "table" });
  }
  function msgHeading(s, level, params) {
    _msg(s, params || {}, { tag: "h" + level, cssClass: "default-h default-h" + level });
  }
  function picture(filename, width, height) {
    const src = filename.includes("/") ? filename : settings.imagesFolder + filename;
    _msg("", {}, { action: "output", width, height, tag: "img", src, printBlank: true });
  }
  function image(filename, width, height) {
    const src = filename.includes("/") ? filename : settings.imagesFolder + filename;
    _msg("", {}, { action: "output", width, height, tag: "img", src, cssClass: "centred", printBlank: true, destination: "quest-image" });
  }
  function sound(filename) {
    _msg("Your browser does not support the <code>audio</code> element.", {}, { action: "sound", name: filename });
  }
  function ambient(filename, volume) {
    _msg("Your browser does not support the <code>audio</code> element.", {}, { action: "ambient", name: filename, volume });
  }
  function video(filename) {
    _msg("Your browser does not support the <code>video</code> element.", {}, { action: "output", autoplay: true, tag: "video", src: settings.videoFolder + "/" + filename });
  }
  function draw(width, height, data, options) {
    if (!options)
      options = {};
    let s = '<svg width="' + width + '" height="' + height + '" viewBox="';
    s += options.x !== void 0 ? "" + options.x + " " + options.y : "0 0";
    s += " " + width + " " + height + '" ';
    if (options.background)
      s += 'style="background:' + options.background + '" ';
    s += 'xmlns="http://www.w3.org/2000/svg">';
    s += data.join("") + "</svg>";
    if (settings.reportAllSvg)
      console.log(s.replace(/></g, ">\n<"));
    if (options.destination) {
      document.querySelector("#" + options.destination).innerHTML = s;
    } else {
      rawPrint(s);
    }
  }
  function failedmsg(s, params) {
    _msg(s, params || {}, { cssClass: "default-p failed", tag: "p" });
    return world.FAILED;
  }
  function falsemsg(s, params) {
    _msg(s, params || {}, { cssClass: "default-p failed", tag: "p" });
    return false;
  }
  function metamsg(s, params) {
    _msg(s, params || {}, { cssClass: "meta", tag: "p" });
  }
  function parsermsg(s) {
    _msg(s, false, { cssClass: "parser", tag: "p" });
    return false;
  }
  function commentmsg(s) {
    _msg(s, false, { cssClass: "comment", tag: "p" });
    return false;
  }
  function errormsg(s, suppressTrace) {
    if (test.errorOutput !== void 0) {
      test.errorOutput.push(s);
      return false;
    }
    printError(s, new Error("error state caught by QuestJS runtime"), suppressTrace);
  }
  function debugmsg(s) {
    if (settings.playMode === "dev" || settings.playMode === "meta") {
      io.print({ tag: "pre", cssClass: "debug", text: s, id: io.nextid });
      io.nextid++;
    }
  }
  function blankLine() {
    rawPrint("&nbsp;");
  }
  function hr() {
    rawPrint("<hr/>");
  }
  function clearScreen() {
    io.addToOutputQueue({ action: "clear" });
  }
  function wait(delay, text, func2) {
    if (test.testing || settings.walkthroughInProgress)
      return;
    if (delay === void 0) {
      io.addToOutputQueue({ action: "wait", text, cssClass: "continue", func: func2 });
    } else {
      io.addToOutputQueue({ action: "delay", delay, text, cssClass: "continue", func: func2 });
    }
  }
  function trigger(func2) {
    io.addToOutputQueue({ action: "func", func: func2 });
  }
  function showMenu(title, options, fn) {
    const opts = { article: DEFINITE, capital: true, noLinks: true };
    io.input(title, options, false, fn, function(options2) {
      for (let i2 = 0; i2 < options2.length; i2++) {
        let s = '<a class="menu-option" onclick="io.menuResponse(' + i2 + ')">';
        s += typeof options2[i2] === "string" ? options2[i2] : lang.getName(options2[i2], opts);
        s += "</a>";
        msg(s);
      }
    });
  }
  function showMenuNumbersOnly(title, options, fn) {
    const opts = { article: DEFINITE, capital: true, noLinks: true };
    parser.overrideWith(function(s) {
      io.menuResponse(s);
    });
    const disableTextFunction = function(disable) {
      if (disable) {
        io.disable(3);
        io.keydownFunctions.push(io.keydownForMenuFunction);
      } else {
        io.enable();
      }
    };
    io.input(title, options, disableTextFunction, fn, function(options2) {
      for (let i2 = 0; i2 < options2.length; i2++) {
        let s = i2 + 1 + '. <a class="menu-option" onclick="io.menuResponse(' + i2 + ')">';
        s += typeof options2[i2] === "string" ? options2[i2] : lang.getName(options2[i2], opts);
        s += "</a>";
        msg(s);
      }
    });
  }
  function showMenuWithNumbers(title, options, fn) {
    const opts = { article: DEFINITE, capital: true, noLinks: true };
    parser.overrideWith(function(s) {
      io.menuResponse(s);
    });
    const disableTextFunction = function(disable) {
      if (disable) {
        io.disable(2);
      } else {
        io.enable();
        io.doNotSaveInput = false;
      }
    };
    const failFunction = function(input2) {
      msg("I do not understand: " + input2);
      runCmd(input2);
      io.savedCommands.push(input2);
    };
    io.doNotSaveInput = true;
    io.input(title, options, disableTextFunction, fn, function(options2) {
      for (let i2 = 0; i2 < options2.length; i2++) {
        let s = i2 + 1 + '. <a class="menu-option" onclick="io.menuResponse(' + i2 + ')">';
        s += typeof options2[i2] === "string" ? options2[i2] : lang.getName(options2[i2], opts);
        s += "</a>";
        msg(s);
      }
    }, failFunction);
  }
  function showDropDown(title, options, fn) {
    const opts = { article: DEFINITE, capital: true, noLinks: true };
    io.input(title, options, false, fn, function(options2) {
      let s = '<select id="menu-select" class="custom-select" style="width:400px;" ';
      s += `onchange="io.menuResponse(io.getDropDownText('menu-select'))">`;
      s += '<option value="-1">-- Select one --</option>';
      for (let i2 = 0; i2 < options2.length; i2++) {
        s += '<option value="' + (i2 + 1) + '">';
        s += typeof options2[i2] === "string" ? options2[i2] : lang.getName(options2[i2], opts);
        s += "</option>";
      }
      msg(s + "</select>");
      document.querySelector("#menu-select").focus();
    });
  }
  function showMenuDiag(title, options, fn, cssClass) {
    io.showMenuDiagTitle = title;
    const opts = { article: DEFINITE, capital: true, noLinks: true };
    const disableTextFunction = function(disable) {
      if (disable) {
        io.disable(3);
      } else {
        io.enable();
        if (!test.testing) {
          const el = document.querySelector("#sidepane-menu");
          if (el)
            el.remove();
        }
      }
    };
    const displayFunction = function(options2) {
      let s = '<div id="sidepane-menu"';
      if (cssClass)
        s += ' class="' + cssClass + '"';
      s += ">";
      if (typeof io.showMenuDiagTitle === "string") {
        s += '<p class="sidepane-menu-title">' + io.showMenuDiagTitle + "</p>";
      } else {
        s += '<h4 class="sidepane-menu-title">' + io.showMenuDiagTitle.title + "</h4>";
        s += '<p class="sidepane-menu-title">' + io.showMenuDiagTitle.text + "</p>";
      }
      for (let i2 = 0; i2 < options2.length; i2++) {
        s += '<p value="' + i2 + '" onclick="io.menuResponse(' + i2 + ')" class="sidepane-menu-option">';
        s += typeof options2[i2] === "string" ? options2[i2] : lang.getName(options2[i2], opts);
        s += "</p>";
      }
      s += "</div>";
      document.querySelector("body").innerHTML += s;
    };
    io.input(false, options, disableTextFunction, fn, displayFunction);
    return world.SUCCESS_NO_TURNSCRIPTS;
  }
  function showYesNoMenu(title, fn) {
    showMenu(title, lang.yesNo, fn);
  }
  function showYesNoMenuWithNumbers(title, fn) {
    showMenuWithNumbers(title, lang.yesNo, fn);
  }
  function showYesNoDropDown(title, fn) {
    showDropDown(title, lang.yesNo, fn);
  }
  function askText(title, fn) {
    io.menuFns.push(fn);
    msg(title);
    io.disable(2);
    document.querySelector("#input").style.display = "block";
    parser.overrideWith(function(result2) {
      io.enable();
      if (!settings.textInput)
        document.querySelector("#input").style.display = "none";
      io.savedCommands.pop();
      if (io.savedCommandsPos > io.savedCommands.length)
        io.savedCommandsPos = io.savedCommands.length;
      const fn2 = io.menuFns.pop();
      fn2(result2);
    });
  }
  function showDiag(title, text, submitButton) {
    if (!submitButton)
      return errormsg("Trying to use showDiag with no button");
    askDiag({ title, text, width: 400, height: "auto" }, null, submitButton);
  }
  function askDiag(title, fn, submitButton) {
    io.menuFns.push(fn);
    io.showMenuDiagTitle = title;
    io.showMenuDiagSubmit = submitButton;
    const disableTextFunction = function(disable) {
      if (disable) {
        io.disable(3);
      } else {
        io.enable();
        const el = document.querySelector("#sidepane-text");
        if (el)
          el.remove();
      }
    };
    const displayFunction = function() {
      let s = '<div id="sidepane-menu"';
      if (title.width)
        s += ' style="width:' + title.width + 'px;top:100px;"';
      s += ">";
      if (typeof title === "string") {
        s += '<p class="sidepane-menu-title">' + io.showMenuDiagTitle + "</p>";
      } else {
        s += '<h4 class="sidepane-menu-title">' + io.showMenuDiagTitle.title + "</h4>";
        s += '<p class="sidepane-menu-title">' + io.showMenuDiagTitle.text + "</p>";
      }
      if (fn)
        s += '<input type="text" id="text-dialog" class="sidepane-menu-option">';
      if (io.showMenuDiagSubmit) {
        s += '<div id="dialog-footer" style="text-align:right"><hr>';
        s += '<input type="button" onclick="io.textResponse()" value="' + io.showMenuDiagSubmit + '" class="sidepane-menu-button"></div>';
      }
      s += "</div>";
      document.querySelector("body").innerHTML += s;
      if (fn) {
        const el = document.getElementById("text-dialog");
        el.addEventListener("keydown", function(event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            io.textResponse();
          }
        });
        el.focus();
        io.menuFns.pop();
      }
    };
    io.input(false, [], disableTextFunction, fn, displayFunction);
    return world.SUCCESS_NO_TURNSCRIPTS;
  }
  function endTurnUI(update) {
    if (!loc$1())
      return errormsg("currentLocation not set (" + (player() ? "but player is" : "nor is player") + ")");
    if (settings.panes !== "none" && update) {
      for (let exit of lang.exit_list) {
        const el = document.querySelector("#exit-" + exit.name);
        if (!el)
          continue;
        if (loc$1().hasExit(exit.name, { excludeScenery: true }) || exit.type === "nocmd") {
          el.style.display = "block";
        } else {
          el.style.display = "none";
        }
      }
      io.updateStatus();
    }
    for (let o of io.modulesToUpdate) {
      o.update(update);
    }
    io.updateUIItems();
    if (settings.updateCustomUI)
      settings.updateCustomUI();
    io.scrollToEnd();
    if (settings.textInput) {
      document.querySelector("#textbox").focus();
    }
  }
  function createAdditionalPane(position, title, id, func2) {
    const el = document.querySelector("#panes");
    const div = document.createElement("div");
    div.id = id + "-outer";
    div.classList.add("pane-div");
    div.innerHTML = io.getSidePaneHeadingHTML(title) + '<div id="' + id + '">' + func2() + "</div>";
    el.insertBefore(div, el.children[position]);
    settings.customPaneFunctions[id] = func2;
  }
  const io = {
    // Each line that is output is given an id, n plus an id number.
    nextid: 0,
    // A list of names for items currently world. in the inventory panes
    currentItemList: [],
    modulesToUpdate: [],
    modulesToInit: [],
    modulesToDisable: [],
    modulesToEnable: [],
    spoken: false,
    //False for normal function, true if things should be printed to the same paragraph
    otnb: false,
    sameLine: false,
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
      showMenu,
      showDropDown,
      showMenuNumbersOnly,
      showMenuWithNumbers,
      showMenuDiag
    },
    showInTab: function(html, title = "Quest JS Tab") {
      const path = location.protocol + "//" + location.pathname.replace("index.html", "");
      const tab = window.open("about:blank", "_blank");
      if (!tab) {
        metamsg(lang.new_tab_failed);
        return false;
      }
      settings.loadCssFiles(tab.document, path);
      const myScript = tab.document.createElement("script");
      myScript.setAttribute("src", path + "lib/_transcript.js");
      tab.document.head.appendChild(myScript);
      tab.document.body.innerHTML = html;
      tab.document.title = title;
      tab.document.head.setAttribute("data-favicon", settings.favicon);
      tab.document.head.setAttribute("data-path", path);
      const link = tab.document.createElement("link");
      link.id = "dynamic-favicon";
      link.rel = "shortcut icon";
      link.href = path + settings.favicon;
      tab.document.head.appendChild(link);
    }
  };
  io.input = function(title, options, disableTextFunction, reactFunction, displayFunction, failFunction) {
    io.menuStartId = io.nextid;
    io.menuFns.push(reactFunction);
    io.menuFailFn = failFunction;
    io.menuOptions = options;
    io.disableTextFunction = disableTextFunction ? disableTextFunction : function(disable) {
      if (disable)
        io.disable(3);
      if (!disable)
        io.enable();
    };
    if (test.testing) {
      if (test.menuResponseNumber === void 0) {
        debugmsg("Error when testing menu (possibly due to disambiguation?), test.menuResponseNumber = " + test.menuResponseNumber);
      } else {
        let n;
        if (Array.isArray(test.menuResponseNumber)) {
          n = test.menuResponseNumber.shift();
          if (test.menuResponseNumber.length === 0) {
            delete test.menuResponseNumber;
          }
        } else {
          n = test.menuResponseNumber;
          delete test.menuResponseNumber;
        }
        io.menuResponse(n);
      }
      return;
    }
    if (settings.walkthroughMenuResponses.length > 0) {
      const response = settings.walkthroughMenuResponses.shift();
      if (typeof response === "number") {
        io.menuResponse(response);
      } else {
        io.textResponse(response);
      }
      return;
    }
    io.disableTextFunction(true);
    if (title)
      msg(title, {}, "menu-title");
    displayFunction(options);
  };
  io.outputQueue = [];
  io.outputSuspended = false;
  io.unpause = function() {
    document.querySelector(".continue").remove();
    io.textBecamesOld();
    io.outputSuspended = false;
    io.outputFromQueue();
    if (settings.textInput)
      document.querySelector("#textbox").focus();
  };
  io.addToOutputQueue = function(data) {
    data.id = io.nextid;
    io.outputQueue.push(data);
    io.nextid++;
    io.outputFromQueue();
  };
  io.forceOutputFromQueue = function() {
    io.outputSuspended = false;
    io.outputFromQueue();
  };
  io.outputFromQueue = function() {
    if (io.outputSuspended)
      return;
    if (io.outputQueue.length === 0) {
      if (!io.disableTextFunction)
        io.enable();
      return;
    }
    const data = io.outputQueue.shift();
    if (data.action === "wait" && (!settings.disableWaitInDevMode || settings.playMode !== "dev")) {
      io.disable();
      io.outputSuspended = true;
      data.tag = "p";
      data.onclick = "io.unpause()";
      if (!data.text)
        data.text = lang.click_to_continue;
      io.print(data);
    }
    if (data.action === "delay" && (!settings.disableWaitInDevMode || settings.playMode !== "dev")) {
      log("here");
      io.disable();
      io.outputSuspended = true;
      if (data.text) {
        data.tag = "p";
        io.print(data);
      }
      setTimeout(io.unpause, data.delay * 1e3);
    }
    if (data.action === "output") {
      io.print(data);
      io.speak(data.text);
      saveLoad.transcriptAppend(data);
      io.outputFromQueue();
    }
    if (data.action === "func") {
      if (data.func())
        io.outputFromQueue();
    }
    if (data.action === "effect") {
      io.disable();
      data.effect(data);
    }
    if (data.action === "clear") {
      document.querySelector("#output").textContent = "";
      io.outputFromQueue();
    }
    if (data.action === "sound") {
      if (!settings.silent) {
        const el = document.getElementById(data.name);
        el.currentTime = 0;
        el.play();
      }
    }
    if (data.action === "ambient") {
      for (let el of document.getElementsByTagName("audio"))
        el.pause();
      if (!settings.silent && data.name) {
        const el = document.getElementById(data.name);
        el.currentTime = 0;
        el.loop = true;
        el.play();
        if (data.volume)
          el.volume = data.volume / 10;
      }
    }
    io.scrollToEnd();
    if (settings.textInput)
      document.querySelector("#textbox").focus();
  };
  io.allowedHtmlAttrs = ["width", "height", "onclick", "src", "autoplay"];
  io.print = function(data) {
    let html;
    if (typeof data === "string") {
      html = data;
    }
    if (data.html) {
      html = data.html;
    } else if (!io.sameLine) {
      html = "<" + data.tag + ' id="n' + data.id + '"';
      if (data.cssClass)
        html += ' class="' + data.cssClass + '"';
      for (let s of io.allowedHtmlAttrs)
        if (data[s])
          html += " " + s + '="' + data[s] + '"';
      html += ">" + data.text + "</" + data.tag + ">";
    } else {
      html = data.text;
    }
    if (data.destination) {
      document.querySelector("#" + data.destination).innerHTML = html;
    } else {
      let keepSL = html.indexOf("@@OUTPUTTEXTNOBR@@") > -1;
      let slID = "n" + (data.id - 1);
      if (keepSL) {
        html = html.replace("@@OUTPUTTEXTNOBR@@", "");
      }
      if (io.sameLine) {
        let last = document.getElementById(slID);
        last.innerHTML = last.innerHTML + html;
        io.sameLine = false;
      } else {
        document.querySelector("#output").innerHTML += html;
      }
      io.sameLine = keepSL;
    }
    return html;
  };
  io.typewriterEffect = function(data) {
    if (!data.position) {
      document.querySelector("#output").innerHTML += "<" + data.tag + ' id="n' + data.id + '" class="typewriter"></' + data.tag + ">";
      data.position = 0;
      data.text = processText(data.text, data.params);
    }
    const el = document.querySelector("#n" + data.id);
    el.innerHTML = data.text.slice(0, data.position) + '<span class="typewriter-active">' + data.text.slice(data.position, data.position + 1) + "</span>";
    data.position++;
    if (data.position <= data.text.length) {
      io.outputQueue.unshift(data);
      io.outputSuspended = true;
    }
    setTimeout(io.forceOutputFromQueue, settings.textEffectDelay);
  };
  io.unscrambleEffect = function(data) {
    if (!data.count) {
      document.querySelector("#output").innerHTML += "<" + data.tag + ' id="n' + data.id + '" class="typewriter"></' + data.tag + ">";
      data.count = 0;
      data.text = processText(data.text, data.params);
      if (!data.pick)
        data.pick = io.unscamblePick;
      data.mask = "";
      data.scrambled = "";
      for (let i2 = 0; i2 < data.text.length; i2++) {
        if (data.text.charAt(i2) === " " && !data.incSpaces) {
          data.scrambled += " ";
          data.mask += " ";
        } else {
          data.scrambled += data.pick(i2);
          data.mask += "x";
          data.count++;
        }
      }
    }
    if (data.randomPlacing) {
      let pos = random.int(0, data.count - 1);
      let newMask = "";
      for (let i2 = 0; i2 < data.mask.length; i2++) {
        if (data.mask.charAt(i2) === " ") {
          newMask += " ";
        } else if (pos === 0) {
          newMask += " ";
          pos--;
        } else {
          newMask += "x";
          pos--;
        }
      }
      data.mask = newMask;
    } else {
      data.mask = data.mask.replace("x", " ");
    }
    data.count--;
    document.querySelector("#n" + data.id).innerHTML = io.unscambleScramble(data);
    if (data.count > 0) {
      io.outputQueue.unshift(data);
      io.outputSuspended = true;
    }
    setTimeout(io.forceOutputFromQueue, settings.textEffectDelay);
  };
  io.unscamblePick = function() {
    let c2 = String.fromCharCode(random.int(33, 125));
    return c2 === "<" ? "~" : c2;
  };
  io.unscambleScramble = function(data) {
    let s = "";
    for (let i2 = 0; i2 < data.text.length; i2++) {
      s += data.mask.charAt(i2) === " " ? data.text.charAt(i2) : data.pick(i2);
    }
    return s;
  };
  io.cmdlink = function(command, str) {
    return `<a class="cmd-link" onclick="runCmd('${command}')">${str}</a>`;
  };
  io.setTitleAndInit = function(s) {
    document.title = s;
    for (let o of io.modulesToInit) {
      o.init();
    }
    io.calcMargins();
  };
  io.calcMargins = function() {
    let mapImageWidth = 0;
    if (typeof map !== "undefined") {
      if (!settings.hideMap)
        mapImageWidth = settings.mapWidth;
    }
    if (typeof imagePane !== "undefined") {
      if (!settings.hideImagePane && settings.imageWidth > mapImageWidth)
        mapImageWidth = settings.imageWidth;
    }
    document.querySelector("#main").style.marginLeft = "40px";
    document.querySelector("#main").style.marginRight = "40px";
    if (settings.panes !== "none") {
      const margin2 = settings.panes === "left" ? "margin-left" : "margin-right";
      if (io.resizePanesListener.matches) {
        document.querySelector("#main").style[margin2] = io.mainGutter + "px";
        document.querySelector("#panes").style.display = "none";
      } else {
        document.querySelector("#main").style[margin2] = io.panesWidth + io.mainGutter + "px";
        document.querySelector("#panes").style.display = "block";
      }
    }
    let margin = settings.panes === "right" ? "margin-left" : "margin-right";
    if (settings.mapImageSide)
      margin = settings.mapImageSide === "left" ? "margin-left" : "margin-right";
    if (io.resizeMapImageListener.matches || settings.hideMap) {
      document.querySelector("#main").style[margin] = io.mainGutter + "px";
      document.querySelector("#quest-image").style.display = "none";
      document.querySelector("#quest-map").style.display = "none";
    } else {
      document.querySelector("#main").style[margin] = mapImageWidth + io.mainGutter + "px";
      document.querySelector("#quest-image").style.display = "block";
      document.querySelector("#quest-map").style.display = "block";
    }
  };
  io.mainGutter = 20;
  io.panesWidth = 160;
  io.resizePanesListener = window.matchMedia("(max-width: " + settings.panesCollapseAt + "px)");
  io.resizeMapImageListener = window.matchMedia("(max-width: " + settings.mapAndImageCollapseAt + "px)");
  io.resizePanesListener.addListener(io.calcMargins);
  io.resizeMapImageListener.addListener(io.calcMargins);
  io.disableLevel = 0;
  io.disable = function(level) {
    if (!level)
      level = 1;
    if (level <= io.disableLevel)
      return;
    io.disableLevel = level;
    if (level !== 2)
      document.querySelector("#input").style.display = "none";
    io.setCssByClass("compass-button .dark-body", "color", "#808080");
    io.setCssByClass("item", "color", "#808080");
    io.setCssByClass("item-action", "color", "#808080");
    for (let o of io.modulesToDisable) {
      o.ioDisable(level);
    }
  };
  io.enable = function() {
    if (!io.disableLevel)
      return;
    io.disableLevel = 0;
    document.querySelector("#input").style.display = "block";
    if (settings.panes !== "none") {
      io.setCssByClass("compass-button .dark-body", "color", io.textColour);
      io.setCssByClass("item", "color", io.textColour);
      io.setCssByClass("item-action", "color", io.textColour);
    }
    for (let o of io.modulesToEnable) {
      o.ioEnable();
    }
  };
  io.reset = function() {
    io.enable();
    io.menuFns = [];
    io.keydownFunctions = [];
  };
  io.startCommand = function() {
    io.textBecamesOld();
  };
  io.textBecamesOld = function() {
    io.addClassForClass("default-p", "old-text");
    io.addClassForClass("default-h", "old-text");
    io.addClassForClass("meta", "old-text");
    io.addClassForClass("parser", "old-text");
    io.addClassForClass("error", "old-text");
  };
  io.addClassForClass = function(oldClass, newClass) {
    const collection = document.getElementsByClassName(oldClass);
    for (const el of collection)
      el.classList.add(newClass);
  };
  io.updateUIItems = function() {
    if (settings.panes === "none" || !settings.inventoryPane) {
      return;
    }
    for (let inv of settings.inventoryPane) {
      document.querySelector("#" + inv.alt).textContent = "";
      inv.hasContent = false;
    }
    io.currentItemList = [];
    for (let key in w$1) {
      const item2 = w$1[key];
      for (let inv of settings.inventoryPane) {
        const loc2 = inv.getLoc ? inv.getLoc() : null;
        if (inv.test(item2) && !item2.inventorySkip) {
          io.appendItem(item2, inv.alt, loc2, false, inv.highlight ? inv.highlight(item2) : 0);
          inv.hasContent = true;
        }
      }
    }
    if (settings.additionalInv)
      settings.additionalInv();
    for (let inv of settings.inventoryPane) {
      if (!inv.hasContent && inv.noContent) {
        const s = processText(inv.noContent);
        document.querySelector("#" + inv.alt).innerHTML = '<div class="item-nothing">' + s + "</div>";
      }
    }
    for (const key in settings.customPaneFunctions) {
      const el = document.querySelector("#" + key);
      if (!el)
        return;
      el.innerHTML = settings.customPaneFunctions[key]();
    }
    io.clickItem("");
  };
  io.updateStatus = function() {
    if (settings.panes !== "none" && settings.statusPane) {
      let s = "";
      for (let st of settings.status) {
        if (typeof st === "string") {
          if (player()[st] !== void 0) {
            s += '<tr><td width="' + settings.statusWidthLeft + '">' + sentenceCase(st) + "</td>";
            s += '<td width="' + settings.statusWidthRight + '">' + player()[st] + "</td></tr>";
          } else {
            s += "<tr>" + processText(st) + "</tr>";
          }
        } else if (typeof st === "function") {
          s += "<tr>" + st() + "</tr>";
        }
      }
      document.querySelector("#status-pane").innerHTML = s;
    }
    if (settings.toolbar) {
      io.createToolbar();
    }
  };
  io.menuResponse = function(n) {
    let input2 = n;
    if (typeof n === "string" && n.match(/^\d+$/))
      n = parseInt(n) - 1;
    if (typeof n === "string") {
      n = io.menuOptions.findIndex((el) => typeof el === "string" ? el.includes(n) : el.alias.includes(n));
    }
    io.disableTextFunction(false);
    delete io.disableTextFunction;
    parser.overrideWith();
    for (let i2 = io.menuStartId; i2 < io.nextid; i2++)
      document.querySelector("#n" + i2).remove();
    if (n === void 0 || n >= io.menuOptions[n] || n === -1) {
      io.menuFailFn(input2);
    } else {
      saveLoad.transcriptAppend({ cssClass: "menu", text: io.menuOptions[n].alias ? io.menuOptions[n].alias : io.menuOptions[n], n });
      const fn = io.menuFns.pop();
      fn(io.menuOptions[n]);
    }
    endTurnUI(true);
    if (settings.textInput)
      document.querySelector("#textbox").focus();
  };
  io.textResponse = function(s) {
    if (s === void 0) {
      const el2 = document.querySelector("#text-dialog");
      if (el2)
        s = el2.value;
    }
    const el = document.querySelector("#sidepane-menu");
    if (el)
      el.remove();
    io.enable();
    saveLoad.transcriptAppend({ cssClass: "menu", text: s });
    if (io.menuFns.length) {
      const fn = io.menuFns.pop();
      if (fn)
        fn(s);
    }
    endTurnUI(true);
    if (settings.textInput)
      document.querySelector("#textbox").focus();
  };
  io.keydownForMenuFunction = function(e) {
    const n = parseInt(e.key);
    if (!isNaN(n) && n <= io.menuOptions.length && n !== 0) {
      io.menuResponse(n - 1);
    }
    setTimeout(function() {
      document.querySelector("#textbox").value = "";
      document.querySelector("#textbox").focus();
    }, 10);
  };
  io.clickExit = function(dir) {
    if (io.disableLevel)
      return;
    runCmd(dir);
  };
  io.clickItem = function(itemName) {
    if (io.disableLevel)
      return;
    if (!itemName)
      return;
    const o = w$1[itemName];
    if (o.sidebarButtonVerb) {
      runCmd(o.sidebarButtonVerb + " " + w$1[itemName].alias);
      return;
    }
    if (io.disableLevel)
      return;
    const uniq = [...new Set(io.currentItemList)];
    for (let item2 of uniq) {
      for (const el of document.querySelectorAll("." + item2 + "-actions")) {
        if (item2 === itemName) {
          el.style.display = el.style.display === "none" ? "block" : "none";
        } else {
          el.style.display = "none";
        }
      }
    }
  };
  io.clickItemAction = function(itemName, action) {
    if (io.disableLevel)
      return;
    const item2 = w$1[itemName];
    const cmd = action.includes("%") ? action.replace("%", item2.alias) : action + " " + item2.alias;
    runCmd(cmd);
  };
  io.appendItem = function(item2, htmlDiv, loc2, isSubItem, highlight) {
    const el = document.querySelector("#" + htmlDiv);
    io.currentItemList.push(item2.name);
    el.innerHTML += io.getItemHtml(item2, loc2, isSubItem, highlight);
    if (item2.container && !item2.closed) {
      if (typeof item2.getContents !== "function") {
        log("WARNING: item flagged as container but no getContents function:");
        log(item2);
      }
      const l = item2.getContents(world.SIDE_PANE);
      for (let el2 of l) {
        io.appendItem(el2, htmlDiv, item2.name, true);
      }
    }
  };
  io.getItemHtml = function(item2, loc2, isSubItem, highlight) {
    if (typeof item2.getVerbs !== "function")
      return errormsg("Item with bad getVerbs: " + item2.name);
    const verbList = item2.getVerbs(loc2);
    if (verbList === void 0) {
      errormsg("No verbs for " + item2.name);
      console.log(item2);
    }
    let s = '<div id="' + item2.name + '-item"><p class="item' + (isSubItem ? " sub-item" : "") + (highlight ? " highlight-item" + highlight : "") + `" onclick="io.clickItem('` + item2.name + `')">` + io.getIcon(item2) + item2.getListAlias(loc2) + "</p></div>";
    for (let verb of verbList) {
      if (typeof verb === "string")
        verb = { name: verb, action: verb };
      s += '<div class="' + item2.name + "-actions item-action";
      if (verb.style)
        s += " " + verb.style;
      s += `" onclick="io.clickItemAction('` + item2.name + "', '" + verb.action + `')" style="display: none;">`;
      s += verb.name;
      s += "</div>";
    }
    return s;
  };
  io.createPanes = function() {
    if (!["right", "left", "none"].includes(settings.panes)) {
      console.error('ERROR: Your settings.panes value is "' + settings.panes + '". It must be one of "right", "left" or "none" (all lower-case). It is probably set in the file setiings.js.');
      return;
    }
    document.querySelector("#input").innerHTML = '<span id="cursor">' + settings.cursor + '</span><input type="text" name="textbox" id="textbox" autocomplete="off" />';
    if (!settings.textInput)
      document.querySelector("#input").style.display = "none";
    if (settings.panes === "none")
      return;
    let html = "";
    if (settings.compassPane) {
      html += '<div class="pane-div">';
      html += '<table id="compass-table">';
      for (let i2 = 0; i2 < 3; i2++) {
        html += "<tr>";
        html += io.writeExit(0 + 5 * i2);
        html += io.writeExit(1 + 5 * i2);
        html += io.writeExit(2 + 5 * i2);
        html += "<td></td>";
        html += io.writeExit(3 + 5 * i2);
        html += io.writeExit(4 + 5 * i2);
        html += "</tr>";
      }
      html += "</table>";
      html += "</div>";
    }
    if (settings.statusPane) {
      html += '<div class="pane-div">';
      html += io.getSidePaneHeadingHTML(settings.statusPane);
      html += '<table id="status-pane">';
      html += "</table>";
      html += "</div>";
    }
    if (settings.inventoryPane) {
      for (let inv of settings.inventoryPane) {
        html += '<div class="pane-div">';
        html += io.getSidePaneHeadingHTML(inv.name);
        html += '<div class="item-list" id="' + inv.alt + '">';
        html += "</div>";
        html += "</div>";
      }
    }
    html += '<div class="pane-div-finished">';
    html += lang.game_over_html;
    html += "</div>";
    html += "</div>";
    const el = document.createElement("div");
    el.innerHTML = html;
    el.setAttribute("id", "panes");
    el.classList.add("side-panes");
    el.classList.add("side-panes-" + settings.panes);
    el.classList.add("panes-narrow");
    const referenceNode = document.querySelector("#main");
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    io.panesWidth = document.querySelector(".side-panes").clientWidth;
    if (settings.customUI)
      settings.customUI();
  };
  io.getSidePaneHeadingHTML = function(title) {
    if (!title)
      return "";
    const id = verbify(title) + "-side-pane-heading";
    let s = '<h4 class="side-pane-heading" id=' + id + ">" + title;
    if (settings.collapsibleSidePanes) {
      s += ` <i class="fas fa-eye" onclick="io._clickSidePaneHeading('` + id + `')"></i>`;
    }
    s += "</h4>";
    return s;
  };
  io._clickSidePaneHeading = function(id) {
    const el = document.querySelector("#" + id).nextElementSibling;
    if (el.style.display === "none") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  };
  io.writeExit = function(n) {
    let html = '<td class="compass-button" title="' + sentenceCase(lang.exit_list[n].name) + '">';
    html += '<span class="compass-button" id="exit-' + lang.exit_list[n].name;
    html += `" onclick="io.clickExit('` + lang.exit_list[n].name + `')">`;
    html += settings.symbolsForCompass ? io.displayIconsCompass(lang.exit_list[n]) : lang.exit_list[n].abbrev;
    html += "</span></td>";
    return html;
  };
  io.getCommand = function(name2) {
    return commands.find(function(el) {
      return el.name === name2;
    });
  };
  io.msgInputText = function(s) {
    if (saveLoad.transcript && !s.match(lang.noWalkthroughRegex))
      saveLoad.transcriptWalkthrough.push('    "' + s + '",');
    if (!settings.cmdEcho || s === "")
      return;
    document.querySelector("#output").innerHTML += '<p id="n' + io.nextid + '" class="input-text">&gt; ' + s + "</p>";
    io.nextid++;
    io.speak(s, true);
  };
  io.savedCommands = ["help"];
  io.savedCommandsPos = 0;
  io.init = function() {
    settings.performanceLog("Start io.onload");
    io.createPanes();
    if (settings.playMode === "play")
      window.oncontextmenu = function() {
        return false;
      };
    document.querySelector("#fileDialog").onchange = saveLoad.loadGameAsFile;
    document.addEventListener("keydown", function(event) {
      if (io.keydownFunctions.length) {
        const fn = io.keydownFunctions.pop();
        fn(event);
        return;
      }
      const keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode === 13) {
        if (event.ctrlKey && (settings.playMode === "dev" || settings.playMode === "beta")) {
          parser.parse("script show");
        } else {
          const s = document.querySelector("#textbox").value;
          io.msgInputText(s);
          if (s) {
            if (io.savedCommands[io.savedCommands.length - 1] !== s && !io.doNotSaveInput) {
              io.savedCommands.push(s);
            }
            io.savedCommandsPos = io.savedCommands.length;
            parser.parse(s);
            if (io.doNotEraseLastCommand) {
              io.doNotEraseLastCommand = false;
            } else {
              document.querySelector("#textbox").value = "";
            }
          }
        }
      }
      if (keycode === 38) {
        io.savedCommandsPos -= 1;
        if (io.savedCommandsPos < 0) {
          io.savedCommandsPos = 0;
        }
        document.querySelector("#textbox").value = io.savedCommands[io.savedCommandsPos];
        const el = document.querySelector("#textbox");
        if (el.setSelectionRange) {
          setTimeout(function() {
            el.setSelectionRange(9999, 9999);
          }, 0);
        } else if (typeof el.selectionStart == "number") {
          el.selectionStart = el.selectionEnd = el.value.length;
        } else if (typeof el.createTextRange != "undefined") {
          el.focus();
          let range = el.createTextRange();
          range.collapse(false);
          range.select();
        }
      }
      if (keycode === 40) {
        io.savedCommandsPos += 1;
        if (io.savedCommandsPos >= io.savedCommands.length) {
          io.savedCommandsPos = io.savedCommands.length - 1;
        }
        document.querySelector("#textbox").value = io.savedCommands[io.savedCommandsPos];
      }
      if (keycode === 27) {
        document.querySelector("#textbox").value = "";
      }
      if (!io.disableLevel) {
        if (settings.customKeyResponses) {
          if (settings.customKeyResponses(keycode, event))
            return false;
        }
        for (let exit of lang.exit_list) {
          if (exit.key && exit.key === keycode) {
            io.msgInputText(exit.name);
            parser.parse(exit.name);
            document.querySelector("#textbox").value = "";
            event.stopPropagation();
            event.preventDefault();
            return false;
          }
        }
        if (keycode === 123 && settings.playMode === "play")
          return false;
        if (event.ctrlKey && event.shiftKey && keycode === 73 && settings.playMode === "play")
          return false;
        if (event.ctrlKey && event.shiftKey && keycode === 74 && settings.playMode === "play")
          return false;
        if (keycode === 96 && (settings.playMode === "dev" || settings.playMode === "beta")) {
          if (event.ctrlKey && event.altKey) {
            parser.parse("wt b");
          } else if (event.altKey) {
            parser.parse("wt a");
          } else if (event.ctrlKey) {
            parser.parse("wt c");
          } else {
            parser.parse("test");
          }
          setTimeout(function() {
            document.querySelector("#textbox").value = "";
          }, 1);
        }
        if (keycode === 90 && event.ctrlKey) {
          parser.parse("undo");
        }
      }
    });
    if (settings.panes !== "none")
      io.textColour = document.querySelector(".side-panes").style.color;
    settings.performanceLog("UI built");
    endTurnUI(true);
    settings.performanceLog("endTurnUI completed");
    if (document.querySelector("#loading"))
      document.querySelector("#loading").remove();
    if (!settings.suppressTitle)
      msgHeading(settings.title, 2);
    if (settings.subtitle)
      msgHeading(settings.subtitle, 3);
    io.setTitleAndInit(settings.title);
    if (settings.playMode === "beta")
      lang.betaTestIntro();
    settings.performanceLog("Title/intro printed");
    if (settings.startingDialogEnabled) {
      settings.setUpDialog();
      setTimeout(function() {
        if (settings.startingDialogInit)
          settings.startingDialogInit();
      }, 10);
    } else {
      if (settings.startingDialogAlt)
        settings.startingDialogAlt();
      settings.delayStart = false;
      world.begin();
    }
    settings.performanceLog("End io.onload");
  };
  io.synth = window.speechSynthesis;
  io.voice = null;
  io.voice2 = null;
  io.speak = function(str, altVoice) {
    if (!io.spoken)
      return;
    if (!io.voice) {
      io.voice = io.synth.getVoices().find(function(el) {
        return /UK/.test(el.name) && /Female/.test(el.name);
      });
      if (!io.voice)
        io.voice = io.synth.getVoices()[0];
    }
    if (!io.voice2) {
      io.voice2 = io.synth.getVoices().find(function(el) {
        return /UK/.test(el.name) && /Male/.test(el.name);
      });
      if (!io.voice2)
        io.voice2 = io.synth.getVoices()[0];
    }
    const utterThis = new SpeechSynthesisUtterance(str);
    utterThis.onend = function(event) {
    };
    utterThis.onerror = function(event) {
    };
    utterThis.voice = altVoice ? io.voice2 : io.voice;
    utterThis.pitch = 1;
    utterThis.rate = 1;
    io.synth.speak(utterThis);
  };
  io.dialogShowing = false;
  io.showHtml = function(title, html) {
    if (io.dialogShowing)
      return false;
    document.querySelector("body").innerHTML += '<div id="showHtml" title="' + title + '">' + html + "</div>";
    io.dialogShowing = true;
    document.querySelector("#showHtml").dialog({
      width: 860,
      close: function() {
        document.querySelector("#showHtml").remove();
        io.dialogShowing = false;
      }
    });
    return true;
  };
  io.finish = function(giveOptions) {
    settings.finished = {
      textInput: settings.textInput,
      inputDisplay: document.querySelector("#input").style.display
    };
    io.finished = true;
    settings.textInput = false;
    document.querySelector("#input").style.display = "none";
    if (settings.panes !== "none") {
      for (const el of document.querySelectorAll(".pane-div")) {
        el.style.display = "none";
      }
      document.querySelector(".pane-div-finished").style.display = "block";
    }
    for (const el of settings.afterFinish)
      el();
    if (settings.finishMetaComment)
      metamsg(settings.finishMetaComment);
    if (saveLoad.transcriptExists())
      metamsg(lang.transcript_finish);
    if (giveOptions)
      metamsg(lang.finish_options);
  };
  io.unfinish = function() {
    settings.finished = {
      textInput: settings.textInput,
      inputDisplay: document.querySelector("#input").style.display
    };
    io.finished = false;
    settings.textInput = settings.finished.textInput;
    document.querySelector("#input").style.display = settings.finished.inputDisplay;
    if (settings.panes !== "none") {
      for (const el of document.querySelectorAll(".pane-div")) {
        el.style.display = "block";
      }
      document.querySelector(".pane-div-finished").style.display = "none";
    }
    settings.finished = false;
  };
  io.toggleDarkMode = function() {
    settings.darkModeActive = !settings.darkModeActive;
    if (settings.darkModeActive) {
      document.querySelector("body").classList.add("dark-body");
    } else {
      document.querySelector("body").classList.remove("dark-body");
    }
    if (settings.afterDarkToggle)
      settings.afterDarkToggle();
    if (settings.panes !== "none")
      io.textColour = document.querySelector(".side-panes").style.color;
    metamsg(lang.done_msg);
    return world.SUCCESS_NO_TURNSCRIPTS;
  };
  io.toggleAutoScrollMode = function() {
    settings.autoscroll = !settings.autoscroll;
    if (settings.afterAutoScrollToggle)
      settings.afterAutoScrollToggle();
    metamsg(lang.done_msg);
    return world.SUCCESS_NO_TURNSCRIPTS;
  };
  io.toggleNarrowMode = function() {
    settings.narrowMode = (settings.narrowMode + 1) % 3;
    document.querySelector("body").classList.remove("narrow-body");
    document.querySelector("body").classList.remove("very-narrow-body");
    if (settings.narrowMode === 1)
      document.querySelector("body").classList.add("narrow-body");
    if (settings.narrowMode === 2)
      document.querySelector("body").classList.add("very-narrow-body");
    if (settings.afterNarrowChange)
      settings.afterNarrowChange();
    metamsg(lang.done_msg);
    return world.SUCCESS_NO_TURNSCRIPTS;
  };
  io.togglePlainFontMode = function() {
    settings.plainFontModeActive = !settings.plainFontModeActive;
    if (settings.plainFontModeActive) {
      document.querySelector("body").classList.add("plain-font-body");
    } else {
      document.querySelector("body").classList.remove("plain-font-body");
    }
    if (settings.afterPlainFontToggle)
      settings.afterPlainFontToggle();
    metamsg(lang.done_msg);
    return world.SUCCESS_NO_TURNSCRIPTS;
  };
  io.toggleDisplay = function(el) {
    if (typeof el === "string")
      el = document.querySelector(el);
    el.style.display = el.style.display === "block" ? "none" : "block";
  };
  io.copyTextToClipboard = function(text) {
    const textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      metamsg("Copying text command was " + (successful ? "successful" : "unsuccessful"));
    } catch (err) {
      metamsg("Oops, unable to copy");
    }
    document.body.removeChild(textArea);
  };
  io.getIcon = function(item2) {
    if (settings.iconsFolder === false)
      return "";
    if (!item2.icon)
      return "";
    if (item2.icon() === "")
      return "";
    return '<img src="' + settings.iconsFolder + (settings.darkModeActive ? "l_" : "d_") + item2.icon() + '.png"  alt="Icon"/>';
  };
  io.againOrOops = function(isAgain) {
    if (io.savedCommands.length === 0) {
      metamsg(lang.again_not_available);
      return world.FAILED;
    }
    io.savedCommands.pop();
    if (isAgain) {
      parser.parse(io.savedCommands[io.savedCommands.length - 1]);
    } else {
      document.querySelector("#textbox").value = io.savedCommands[io.savedCommands.length - 1];
      io.doNotEraseLastCommand = true;
    }
    return world.SUCCESS_NO_TURNSCRIPTS;
  };
  io.setCssByClass = function(name2, prop, val) {
    for (const el of document.querySelectorAll("." + name2))
      el.style[prop] = val;
  };
  io.displayIconsCompass = function(exit) {
    const datatransform = exit.rotate ? ' style="transform: rotate(40deg)"' : "";
    return '<i class="fas ' + exit.symbol + '"' + datatransform + "></i>";
  };
  io.scrollToEnd = function() {
    if (settings.autoscroll)
      window.scrollTo(0, document.getElementById("main").scrollHeight);
  };
  io.getDropDownText = function(name2) {
    const el = document.querySelector("#" + name2);
    return el.options[el.selectedIndex].text;
  };
  io.createToolbar = function() {
    let el = document.querySelector("#toolbar");
    if (!el) {
      const div = document.createElement("div");
      div.setAttribute("id", "toolbar");
      div.classList.add("toolbar");
      document.querySelector("body").insertBefore(div, document.querySelector("#main"));
      el = document.querySelector("#toolbar");
      document.querySelector("#main").style.paddingTop = "30px";
      document.querySelector("#panes").style.top = "36px";
    }
    let html = "";
    html += '<div class="left">' + io.getToolbarHTML(settings.toolbar[0]) + "</div>";
    html += '<div class="middle">' + io.getToolbarHTML(settings.toolbar[1]) + "</div>";
    html += '<div class="right">' + io.getToolbarHTML(settings.toolbar[2]) + "</div>";
    el.innerHTML = html;
  };
  io.getToolbarHTML = function(data = {}) {
    if (data.room)
      return sentenceCase(lang.getName(w$1[player().loc], { article: DEFINITE }));
    if (data.title)
      return "<b><i>" + settings.title + "</i></b>";
    if (data.content)
      return data.content();
    if (data.buttons) {
      let s = "";
      for (let el of data.buttons) {
        const js = el.cmd ? "runCmd('" + el.cmd + "')" : el.onclick;
        s += ` <a class="link" onclick="if (!io.disableLevel)${js}"><i class="fas ${el.icon}" title="${el.title}"></i></a>`;
      }
      return s;
    }
    return "";
  };
  io.focus = function(el) {
    if (typeof el === "string")
      el = document.querySelector("#" + el);
    if (el !== document.activeElement)
      el.focus();
  };
  io.showHintSheet = function() {
    let html = '<div id="main"><div id="inner"><div id="output"><h2 class="default-h default-h2">' + lang.hintSheet + "</h2>";
    html += '<p class="default-p">' + lang.hintSheetIntro + "</p>";
    const words = [];
    for (const el of settings.hintSheetData)
      words.push(...el.a.split(" "));
    const uniqueWords = [...new Set(words)].sort();
    for (const el of settings.hintSheetData) {
      html += '<p class="default-p"><i>' + el.q + "</i>&nbsp;&nbsp;&nbsp; " + io.encodeWords(el.a, uniqueWords) + "</p>";
    }
    html += "<hr/><table><tr>";
    for (let i2 = 0; i2 < uniqueWords.length; i2++) {
      html += "<td>" + i2 + " - " + uniqueWords[i2] + "</td>";
      if (i2 % 6 === 5)
        html += "</tr><tr>";
    }
    html += "</tr><table></div></div></div>";
    io.showInTab(html, lang.hintSheet);
  };
  io.encodeWords = function(s, words) {
    const numbers = [];
    for (const word of s.split(" "))
      numbers.push(words.indexOf(word));
    return numbers.map((el) => "" + el).join(" ");
  };
  class Cmd {
    constructor(name2, hash2) {
      this.name = name2;
      this.objects = [];
      this.rules = [];
      for (let key in hash2)
        this[key] = hash2[key];
      this.attName = this.attName ? this.attName : this.name.toLowerCase();
      for (let key in this.objects) {
        if (!this.objects[key].attName)
          this.objects[key].attName = this.attName;
      }
      if (!this.regex && !this.regexes) {
        this.regexes = Array.isArray(lang.regex[this.name]) ? lang.regex[this.name] : [lang.regex[this.name]];
      }
      if (this.withScript)
        this.script = this.scriptWith;
      commands.push(this);
    }
    default(options) {
      falsemsg(this.defmsg, options);
    }
    // Is this command a match at the most basic level (ignoring items, etc)
    // Also resets the command
    _test(s) {
      if (!Array.isArray(this.regexes))
        console.log(this);
      for (let regex of this.regexes) {
        if (regex instanceof RegExp) {
          if (regex.test(s)) {
            this.tmp = { regex, mod: {} };
            return true;
          }
        } else {
          if (regex.regex.test(s)) {
            this.tmp = { regex: regex.regex, mod: regex.mod };
            return true;
          }
        }
      }
      this.tmp = { score: parser.NO_MATCH };
      return false;
    }
    // A command can have an array of regexs, "antiRegexes" that will stop the command getting matched
    _testNot(s) {
      if (!Array.isArray(this.antiRegexes))
        return true;
      for (let regex of this.antiRegexes) {
        if (regex instanceof RegExp) {
          if (regex.test(s)) {
            return false;
          }
        } else {
          if (regex.regex.test(s)) {
            return false;
          }
        }
      }
      return true;
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
    matchItems(s) {
      if (!this._test(s))
        return;
      if (!this._testNot(s))
        return;
      parser.msg("---------------------------------------------------------");
      parser.msg("* Looking at candidate: " + this.name);
      this.tmp.objectTexts = [];
      this.tmp.objects = [];
      this.tmp.score = this.score ? this.score : 10;
      this.tmp.error = void 0;
      let arr = this.tmp.regex.exec(s);
      arr.shift();
      if (this.tmp.mod.reverse)
        arr = arr.reverse();
      if (this.tmp.mod.reverseNotFirst) {
        const first = arr.shift();
        arr = arr.reverse();
        arr.unshift(first);
      }
      if (this.tmp.mod.func)
        arr = this.tmp.mod.func(arr);
      parser.msg("..Base score: " + this.tmp.score);
      for (let i2 = 0; i2 < arr.length; i2++) {
        const cmdParams = this.objects[i2];
        if (!cmdParams) {
          errormsg('The command "' + this.name + `" seems to have an error. It has more capture groups than there are elements in the 'objects' attribute.`, true);
          return false;
        }
        if (arr[i2] === void 0) {
          errormsg('The command "' + this.name + `" seems to have an error. It has captured undefined. This is probably an issue with the command's regular expression.`, true);
          return false;
        }
        let score = 0;
        this.tmp.objectTexts.push(arr[i2]);
        if (cmdParams.special) {
          const specialError = parser.specialText[cmdParams.special].error(arr[i2], cmdParams);
          if (specialError)
            return this.setError(parser.BAD_SPECIAL, specialError);
          const special = parser.specialText[cmdParams.special].exec(arr[i2], cmdParams);
          if (special !== false)
            this.tmp.objects.push(special);
          score = 1;
          if (special.name) {
            parser.msg("-> special match object found: " + special.name);
          } else {
            parser.msg("-> special match found: " + special);
          }
        } else if (lang.all_regex.test(arr[i2]) || lang.all_exclude_regex.test(arr[i2])) {
          this.tmp.all = true;
          if (!cmdParams.multiple)
            return this.setError(parser.DISALLOWED_MULTIPLE, lang.no_multiples_msg);
          if (!cmdParams.scope)
            console.log("WARNING: Command without scope - " + this.name);
          let scope = parser.getScope(cmdParams);
          let exclude = [player()];
          for (let item2 of scope) {
            if (item2.scenery || item2.excludeFromAll)
              exclude.push(item2);
          }
          if (lang.all_exclude_regex.test(arr[i2])) {
            let s2 = arr[i2].replace(lang.all_exclude_regex, "").trim();
            const objectNames = s2.split(lang.joiner_regex).map(function(el) {
              return el.trim();
            });
            for (let s3 in objectNames) {
              const items = parser.findInList(s3, world.scope);
              if (items.length === 1)
                exclude.push(items[0]);
            }
          }
          scope = scope.filter((el) => !exclude.includes(el));
          if (scope.length > 1 && !cmdParams.multiple)
            return this.setError(parser.DISALLOWED_MULTIPLE, lang.no_multiples_msg);
          if (scope.length === 0)
            return this.setError(parser.NONE_FOR_ALL, this.nothingForAll ? this.nothingForAll : lang.nothing_msg);
          score = 2;
          this.tmp.objects.push(scope.map((el) => [el]));
        } else {
          if (!cmdParams.scope) {
            console.warn("No scope found in command. This may be because the scope specified does not exist; check the spelling. The command in question is:");
            log(this);
            parser.msg("ERROR: No scope");
            return null;
          }
          const scope = parser.getScopes(cmdParams);
          parser.matchToNames(arr[i2], scope, cmdParams, this.tmp);
          if (this.tmp.score === parser.NO_OBJECT) {
            this.tmp.error = this.noobjecterror(this.tmp.error_s, i2);
            if (this.objects.length > 1)
              this.tmp.score += 10;
            parser.msg("Result score is (no object): " + this.tmp.score);
            return;
          }
        }
        parser.msg("...Adding to the score: " + score);
        parser.msg("Result score is: " + this.tmp.score);
        this.tmp.score += score;
      }
    }
    // If this has multiple parts the error probably takes priority
    // GET STUFF -> assume item
    // FILL JUG WITH WATER -> assume fluid
    setError(score, msg2) {
      this.tmp.error = msg2;
      this.tmp.score = score;
      if (this.objects.length > 1)
        this.tmp.score += 10;
      parser.msg("Match failed: " + this.tmp.score + " (" + msg2 + ")");
    }
    // This is the default script for commands
    // Assumes objects is:
    // optionally the verb, a string
    // an array of objects - each object will have the attribute indicated by attName called
    // optionally an array of one object
    script(objects) {
      let success = false;
      let suppressEndturn = false;
      let verb;
      if (typeof objects[0] === "string")
        verb = objects.shift();
      let secondItem;
      if (objects.length > 1)
        secondItem = objects[1][0];
      const multiple = objects[0] && (objects[0].length > 1 || parser.currentCommand.all);
      if (objects[0].length === 0) {
        metamsg(lang.nothing_msg);
        return world.FAILED;
      }
      for (let i2 = 0; i2 < objects[0].length; i2++) {
        const options = { multiple, verb, char: player(), item: objects[0][i2], secondItem };
        const obj = objects[0][i2];
        if (!obj[this.attName + "_count"])
          obj[this.attName + "_count"] = 0;
        if (!obj[this.attName]) {
          this.default(options);
        } else {
          let result2 = this.processCommand(options);
          if (result2 === world.SUCCESS_NO_TURNSCRIPTS) {
            suppressEndturn = true;
            result2 = true;
          }
          if (result2)
            obj[this.attName + "_count"]++;
          success = result2 || success;
        }
      }
      if (success) {
        return this.noTurnscripts || suppressEndturn ? world.SUCCESS_NO_TURNSCRIPTS : world.SUCCESS;
      } else {
        return world.FAILED;
      }
    }
    // This is the second script for commands
    // Assumes a verb and two objects; the verb may or may not be the first object
    scriptWith(objects) {
      let success = false;
      let suppressEndturn = false;
      let verb;
      if (objects.length > 2)
        verb = objects.shift();
      const multiple = objects[0] && (objects[0].length > 1 || parser.currentCommand.all);
      if (objects[0].length === 0) {
        metamsg(lang.nothing_msg);
        return world.FAILED;
      }
      for (let i2 = 0; i2 < objects[0].length; i2++) {
        const options = { multiple, verb, char: player(), item: objects[0][i2], with: objects[1][0] };
        if (!objects[0][i2][this.attName]) {
          this.default(options);
        } else {
          let result2 = this.processCommand(options);
          if (result2 === world.SUCCESS_NO_TURNSCRIPTS) {
            suppressEndturn = true;
            result2 = true;
          }
          success = result2 || success;
        }
      }
      if (success) {
        return this.noTurnscripts || suppressEndturn ? world.SUCCESS_NO_TURNSCRIPTS : world.SUCCESS;
      } else {
        return world.FAILED;
      }
    }
    processCommand(options) {
      for (let rule2 of this.rules) {
        if (typeof rule2 !== "function") {
          errormsg("Failed to process command '" + this.name + "' as one of its rules is not a function.");
          console.log(this);
          console.log(rule2);
        }
        if (!rule2(this, options))
          return false;
      }
      let result2 = printOrRun(options.char, options.item, this.attName, options);
      if (typeof result2 !== "boolean" && result2 !== world.SUCCESS_NO_TURNSCRIPTS) {
        result2 = true;
      }
      return result2;
    }
    noobjecterror(s) {
      return lang.object_unknown_msg(s);
    }
  }
  class NpcCmd extends Cmd {
    constructor(name2, hash2) {
      super(name2, hash2);
      if (!this.cmdCategory)
        this.cmdCategory = name2;
    }
    script(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc) {
        failedmsg(lang.not_npc, { char: player(), item: npc2 });
        return world.FAILED;
      }
      let success = false;
      if (objects.length !== 2) {
        errormsg("The command " + name + " is trying to use a facility for NPCs to do it, but there is no object list; this facility is only for commands in the form verb-object.");
        return world.FAILED;
      }
      const multiple = objects[1].length > 1 || parser.currentCommand.all;
      for (let obj of objects[1]) {
        const options = { multiple, char: npc2, item: obj };
        if (!npc2.getAgreement(this.cmdCategory, { item: obj, cmd: this }))
          continue;
        if (!obj[this.attName]) {
          this.default(options);
        } else {
          let result2 = this.processCommand({ multiple, char: npc2, item: obj });
          if (result2 === world.SUCCESS_NO_TURNSCRIPTS) {
            result2 = true;
          }
          success = result2 || success;
        }
      }
      if (success) {
        npc2.pause();
        return this.noTurnscripts ? world.SUCCESS_NO_TURNSCRIPTS : world.SUCCESS;
      } else {
        return world.FAILED;
      }
    }
  }
  class ExitCmd extends Cmd {
    constructor(name2, dir, hash2) {
      super(name2, hash2);
      this.exitCmd = true;
      this.dir = dir;
      this.objects = [{ special: "ignore" }, { special: "ignore" }];
    }
    script(objects) {
      if (!loc$1().hasExit(this.dir)) {
        const exitObj = lang.exit_list.find((el) => el.name === this.dir);
        if (exitObj.not_that_way)
          return failedmsg(exitObj.not_that_way, { char: player(), dir: this.dir });
        if (settings.customNoExitMsg)
          return failedmsg(settings.customNoExitMsg(player(), this.dir));
        return failedmsg(lang.not_that_way, { char: player(), dir: this.dir });
      } else {
        const ex = loc$1().getExit(this.dir);
        if (typeof ex === "object") {
          if (!player().testMove(ex)) {
            return world.FAILED;
          }
          if (typeof ex.use !== "function") {
            errormsg("Exit's 'use' attribute is not a function (or does not exist).");
            console.log("Bad exit:");
            console.log(ex);
            return world.FAILED;
          }
          const flag = ex.use(player(), ex);
          if (typeof flag !== "boolean") {
            console.warn("Exit on " + loc$1().name + " failed to return a Boolean value, indicating success or failure; assuming success");
            return world.SUCCESS;
          }
          if (flag && ex.extraTime)
            game.elapsedTime += ex.extraTime;
          return flag ? world.SUCCESS : world.FAILED;
        } else {
          errormsg("Unsupported type for direction");
          return world.FAILED;
        }
      }
    }
  }
  class NpcExitCmd extends Cmd {
    constructor(name2, dir, hash2) {
      super(name2, hash2);
      this.exitCmd = true;
      this.dir = dir;
      this.objects = [{ scope: parser.isHere, attName: "npc" }, { special: "ignore" }, { special: "ignore" }];
    }
    script(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      if (!loc$1().hasExit(this.dir)) {
        const exitObj = lang.exit_list.find((el) => el.name === this.dir);
        if (exitObj.not_that_way)
          return failedmsg(exitObj.not_that_way, { char: npc2, dir: this.dir });
        return failedmsg(lang.not_that_way, { char: npc2, dir: this.dir });
      }
      const ex = loc$1().getExit(this.dir);
      if (typeof ex !== "object") {
        errormsg("Unsupported type for direction");
        return world.FAILED;
      }
      if (npc2.testMove && !npc2.testMove(ex))
        return world.FAILED;
      if (!npc2.getAgreement("Go", { exit: ex }))
        return world.FAILED;
      const flag = ex.use(npc2, ex);
      if (flag)
        npc2.pause();
      return flag ? world.SUCCESS : world.FAILED;
    }
  }
  function initCommands() {
    for (let el of commands) {
      if (!el.regexes) {
        el.regexes = [el.regex];
      }
      if (el.npcCmd) {
        if (!Array.isArray(el.regexes))
          console.log(el);
        const regexAsStr = el.regexes[0].source.substr(1);
        const objects = el.objects.slice();
        objects.unshift({ scope: parser.isHere, attName: "npc" });
        const data = {
          objects,
          attName: el.attName,
          default: el.default,
          defmsg: el.defmsg,
          rules: el.rules,
          score: el.score,
          cmdCategory: el.cmdCategory ? el.cmdCategory : el.name,
          forNpc: true
        };
        const cmd = new NpcCmd("Npc" + el.name, data);
        cmd.regexes = [];
        for (let key in lang.tell_to_prefixes) {
          cmd.regexes.push(new RegExp("^" + lang.tell_to_prefixes[key] + regexAsStr));
        }
        if (el.useThisScriptForNpcs)
          cmd.script = el.script;
        cmd.scope = [];
        for (let el2 of el.objects) {
          cmd.scope.push(el2 === parser.isHeld ? parser.isHeldByNpc : el2);
          cmd.scope.push(el2 === parser.isWorn ? parser.isWornByNpc : el2);
        }
      }
    }
    for (let el of lang.exit_list) {
      if (el.type !== "nocmd") {
        let regex = "(" + lang.go_pre_regex + ")(" + el.name + "|" + el.abbrev.toLowerCase();
        if (el.alt) {
          regex += "|" + el.alt;
        }
        regex += ")$";
        new ExitCmd("Go" + sentenceCase(el.name), el.name, { regexes: [new RegExp("^" + regex)] });
        const regexes = [];
        for (let key in lang.tell_to_prefixes) {
          regexes.push(new RegExp("^" + lang.tell_to_prefixes[key] + regex));
        }
        new NpcExitCmd("NpcGo" + sentenceCase(el.name) + "2", el.name, { regexes });
      }
    }
  }
  function extractChar(cmd, objects) {
    let char2;
    if (cmd.forNpc) {
      char2 = objects[0][0];
      if (!char2.npc) {
        failedmsg(lang.not_npc, { char: player(), item: char2 });
        return world.FAILED;
      }
      objects.shift();
    } else {
      char2 = player();
    }
    return char2;
  }
  function findCmd(name2) {
    return commands.find((el) => el.name === name2);
  }
  function testCmd(name2, s) {
    const cmd = findCmd(name2);
    cmd.matchItems(s);
    log(cmd.tmp);
    metamsg("See results in console (F12)");
  }
  const cmdRules = {};
  cmdRules.isHeldNotWorn = function(cmd, options) {
    if (!options.item.getWorn() && options.item.isAtLoc(options.char.name, world.PARSER))
      return true;
    if (options.item.isAtLoc(options.char.name, world.PARSER))
      return falsemsg(lang.already_wearing, options);
    if (options.item.loc) {
      options.holder = w$1[options.item.loc];
      if (options.holder.npc || options.holder.player)
        return falsemsg(lang.char_has_it, options);
    }
    return falsemsg(lang.not_carrying, options);
  };
  cmdRules.isWorn = function(cmd, options) {
    if (options.item.getWorn() && options.item.isAtLoc(options.char.name, world.PARSER))
      return true;
    if (options.item.isAtLoc(options.char.name, world.PARSER))
      return falsemsg(lang.not_wearing, options);
    if (options.item.loc) {
      options.holder = w$1[options.item.loc];
      if (options.holder.npc || options.holder.player)
        return falsemsg(lang.char_has_it, options);
    }
    return falsemsg(lang.not_carrying, options);
  };
  cmdRules.isHeld = function(cmd, options) {
    if (options.item.isAtLoc(options.char.name, world.PARSER))
      return true;
    if (options.item.loc) {
      options.holder = w$1[options.item.loc];
      if (options.holder.npc || options.holder.player)
        return falsemsg(lang.char_has_it, options);
    }
    return falsemsg(lang.not_carrying, options);
  };
  cmdRules.isPresent = function(cmd, options) {
    if (options.item.isAtLoc(options.char.loc, world.PARSER))
      return true;
    if (options.item.isAtLoc(options.char.name, world.PARSER))
      return true;
    if (options.item.loc) {
      options.holder = w$1[options.item.loc];
      if (options.holder.npc || options.holder.player)
        return falsemsg(lang.char_has_it, options);
    }
    if (options.item.scopeStatus.canReach)
      return true;
    return falsemsg(lang.not_here, options);
  };
  cmdRules.isHere = function(cmd, options) {
    if (options.item.isAtLoc(options.char.loc, world.PARSER))
      return true;
    if (options.item.loc) {
      options.holder = w$1[options.item.loc];
      if (options.already && options.holder === options.char)
        return falsemsg(lang.already_have, options);
      if (options.holder.npc || options.holder.player)
        return falsemsg(lang.char_has_it, options);
    }
    if (options.item.scopeStatus.canReach || options.item.multiLoc)
      return true;
    return falsemsg(lang.not_here, options);
  };
  cmdRules.isHereAlready = function(cmd, options) {
    options.already = true;
    return cmdRules.isHere(cmd, options);
  };
  cmdRules.isPresentOrContained = function(cmd, options) {
    if (!options.item.isAtLoc)
      log(options.item.name);
    if (!options.char)
      log(cmd.name);
    if (options.item.isAtLoc(options.char.name, world.PARSER))
      return true;
    if (parser.isHere(options.item))
      return true;
    if (options.item.loc) {
      options.holder = w$1[options.item.loc];
      if (options.holder && (options.holder.npc || options.holder.player))
        return falsemsg(lang.char_has_it, options);
    }
    if (parser.isContained(options.item))
      return true;
    return falsemsg(lang.not_here, options);
  };
  cmdRules.testManipulate = function(cmd, options) {
    return options.char.testManipulate(options.item, cmd.name);
  };
  cmdRules.canTalkTo = function(cmd, options) {
    if (!options.char.testTalk(options.item))
      return false;
    if (!options.item.npc && !options.item.talker && !options.item.player)
      return falsemsg(lang.not_able_to_hear, options);
    return true;
  };
  cmdRules.testPosture = function(cmd, options) {
    return options.char.testPosture(cmd.name);
  };
  const DEFAULT_OBJECT = {
    pronouns: lang.pronouns.thirdperson,
    isLocatedAt: function(loc2) {
      return loc2 === this.loc;
    },
    isApparentTo: function(situation) {
      if (settings.defaultIsApparentTo)
        return settings.defaultIsApparentTo(situation);
      if (situation === world.LOOK && this.scenery)
        return false;
      if (situation === world.SIDE_PANE && this.scenery && !settings.showSceneryInSidePanes)
        return false;
      return !(situation === world.SIDE_PANE && this.player);
    },
    isAtLoc: function(loc2, situation) {
      if (typeof loc2 !== "string")
        loc2 = loc2.name;
      if (!w$1[loc2] && !settings.placeholderLocations.includes(loc2)) {
        errormsg("The location name `" + loc2 + "`, does not match anything in the game.");
      }
      if (!this.isLocatedAt(loc2, situation))
        return false;
      return this.isApparentTo(situation);
    },
    isHere: function() {
      return this.isAtLoc(player().loc);
    },
    isHeld: function() {
      return this.isAtLoc(player().name);
    },
    isHeldBy: function(char2) {
      return this.isAtLoc(char2.name);
    },
    isUltimatelyHeldBy: function(obj) {
      let o = this;
      while (o.loc) {
        if (o.loc === obj.name)
          return true;
        if (!o.loc)
          return errormsg('isUltimatelyHeldBy has found that the object "' + o.name + '" has no loc attribute (or it is set to undefined/false/null/0), and so has failed. If this is a takeable item you may need to give it a custom isUltimatelyHeldBy function. If this is a takeable container or surface, it needs a loc attribute set.');
        if (!w$1[o.loc] && !settings.placeholderLocations.includes(o.loc)) {
          return errormsg('isUltimatelyHeldBy has found that the object "' + o.name + '" has its "loc" attribute set to "' + o.loc + '"), which does not exist, and so has failed.');
        }
        o = w$1[o.loc];
      }
      return false;
    },
    isHereOrHeld: function() {
      return this.isHere() || this.isHeld();
    },
    isHereOrHeldBy: function(char2) {
      return this.isHere() || this.isHeldBy(char2);
    },
    countAtLoc: function(loc2) {
      if (typeof loc2 !== "string")
        loc2 = loc2.name;
      return this.isAtLoc(loc2) ? 1 : 0;
    },
    scopeSnapshot: function(mode) {
      if (this.scopeStatus["done" + mode])
        return;
      if (Object.keys(this.scopeStatus).length === 0)
        world.scope.push(this);
      this.scopeStatus["can" + mode] = true;
      this.scopeStatus["done" + mode] = true;
      if (!this.getContents && !this.componentHolder)
        return;
      let l;
      if (this.getContents) {
        if (!this["can" + mode + "ThroughThis"]() && !this.scopeStatus["room" + mode] && this !== player())
          return;
        l = this.getContents(world.PARSER);
      } else {
        l = [];
        for (let key in w$1) {
          if (w$1[key].loc === this.name)
            l.push(w$1[key]);
        }
      }
      for (let el of l) {
        el.scopeSnapshot(mode);
      }
    },
    canReachThroughThis: () => false,
    canSeeThroughThis: () => false,
    afterTakeOut: NULL_FUNC,
    afterDropIn: NULL_FUNC,
    testTalkPlayer: () => false,
    getExits: function() {
      return [];
    },
    hasExit: (dir) => false,
    getWorn: () => false,
    saveLoadExcludedAtts: [],
    moveToFrom: function(options, toLoc, fromLoc) {
      util.setToFrom(options, toLoc, fromLoc);
      if (options.fromLoc === void 0)
        options.fromLoc = this.loc;
      if (options.fromLoc === options.toLoc)
        return;
      if (!w$1[options.fromLoc] && !settings.placeholderLocations.includes(options.fromLoc)) {
        errormsg("The location name `" + options.fromLoc + "`, does not match anything in the game.");
      }
      if (!w$1[options.toLoc] && !settings.placeholderLocations.includes(options.toLoc)) {
        errormsg("The location name `" + options.toLoc + "`, does not match anything in the game.");
      }
      this.loc = options.toLoc;
      options.item = this;
      if (!settings.placeholderLocations.includes(options.fromLoc))
        w$1[options.fromLoc].afterTakeOut(options);
      if (!settings.placeholderLocations.includes(options.toLoc))
        w$1[options.toLoc].afterDropIn(options);
      if (this.afterMove !== void 0)
        this.afterMove(options);
      if (options.toLoc === player().name && this.afterTake !== void 0)
        this.afterTake(options);
    },
    afterLoad: NULL_FUNC,
    afterLoadForTemplate: function() {
      this.afterLoad();
    },
    beforeSave: NULL_FUNC,
    beforeSaveForTemplate: function() {
      this.beforeSave();
    },
    getSaveString: function() {
      this.beforeSaveForTemplate();
      let s = this.getSaveStringPreamble();
      for (let key in this) {
        if (typeof this[key] !== "function") {
          if (!this.saveLoadExclude(key)) {
            s += saveLoad.encode(key, this[key]);
          }
        }
      }
      return s;
    },
    getSaveStringPreamble: function(item2) {
      return "Object=";
    },
    saveLoadExclude: function(att) {
      if (typeof this[att] === "function")
        return true;
      if (typeof this[att] === "object" && !Array.isArray(this[att]))
        return true;
      if (this[att] instanceof Exit)
        return true;
      if (array.hasMatch(settings.saveLoadExcludedAtts, att))
        return true;
      return array.hasMatch(this.saveLoadExcludedAtts, att);
    },
    setAlias: function(alias, options = {}) {
      if (this.synonyms && this.alias)
        this.synonyms.push(this.alias);
      this.alias = alias;
      this.listAlias = options.listAlias ? options.listAlias : sentenceCase(alias);
      this.properNoun = options.properNoun === void 0 ? /^[A-Z]/.test(this.alias) : options.properNoun;
      if (this.room)
        this.headingAlias = options.headingAlias ? options.headingAlias : settings.getDefaultRoomHeading(this);
      this.parserOptionsSet = false;
      this.pluralAlias = options.pluralAlias ? options.pluralAlias : lang.getPlural(alias);
      this.properNoun = options.properNoun === void 0 ? /^[A-Z]/.test(this.alias) : options.properNoun;
    },
    eventActive: false,
    eventCountdown: 0,
    eventIsActive: function() {
      return this.eventActive;
    },
    endTurn: function(turn) {
      this.doEvent(turn);
    },
    doEvent: function(turn) {
      if (!this.eventIsActive())
        return;
      if (this.eventCountdown > 1) {
        this.eventCountdown--;
        return;
      }
      if (this.eventCondition && !this.eventCondition(turn))
        return;
      if (typeof this.eventScript !== "function")
        log("About to call eventScrip on the object '" + this.name + "', but it will throw an exception because there is no such function!");
      this.eventScript(turn);
      if (typeof this.eventPeriod === "number") {
        this.eventCountdown = this.eventPeriod;
      } else {
        this.eventActive = false;
      }
    }
  };
  const DEFAULT_ROOM = {
    room: true,
    beforeEnter: NULL_FUNC,
    beforeFirstEnter: NULL_FUNC,
    afterEnter: NULL_FUNC,
    afterEnterIf: {},
    afterEnterIfFlags: "",
    afterFirstEnter: NULL_FUNC,
    afterExit: NULL_FUNC,
    visited: 0,
    lightSource: () => world.LIGHT_FULL,
    isAtLoc: function(loc2, situation) {
      return situation === world.PARSER && loc2 === this.name;
    },
    description: function() {
      for (let line of settings.roomTemplate) {
        msg(line);
      }
      return true;
    },
    examine: function() {
      msg("{hereDesc}");
      return true;
    },
    darkDesc: () => msg(lang.it_is_dark),
    getContents: util.getContents,
    getExit: function(dir) {
      return this[dir];
    },
    hasExit: function(dir, options) {
      if (options === void 0)
        options = {};
      if (!this[dir])
        return false;
      if (options.excludeAlsoDir && this[dir].isAlsoDir)
        return false;
      if (options.excludeLocked && this[dir].isLocked())
        return false;
      if (options.excludeScenery && this[dir].scenery)
        return false;
      if (game.dark && !this[dir].illuminated)
        return false;
      return !this[dir].isHidden();
    },
    getExitObjs: function(options) {
      if (options === void 0)
        options = {};
      const list2 = [];
      if (options.excludeAlsoDir === void 0)
        options.excludeAlsoDir = true;
      for (let exit of lang.exit_list) {
        if (this.hasExit(exit.name, options)) {
          list2.push(exit);
        }
      }
      return list2;
    },
    getExits: function(options) {
      return this.getExitObjs(options).map((el) => this.getExit(el.name));
    },
    getExitDirs: function(options) {
      return this.getExits(options).map((el) => el.dir);
    },
    // returns null if there are no exits
    getRandomExit: function(options) {
      return random.fromArray(this.getExits(options));
    },
    findExit: function(dest, options) {
      if (typeof dest === "object")
        dest = dest.name;
      for (let exit of lang.exit_list) {
        if (this.hasExit(exit.name, options) && this[exit.name].name === dest) {
          return this.getExit(exit.name);
        }
      }
      return null;
    },
    // Lock or unlock the exit indicated
    // Returns false if the exit does not exist or is not an Exit object
    // Returns true if successful
    setExitLock: function(dir, locked) {
      if (!this[dir])
        return false;
      this["exit_locked_" + dir] = locked;
      return true;
    },
    isExitLocked: function(dir) {
      return this["exit_locked_" + dir];
    },
    // Hide or unhide the exit indicated
    // Returns false if the exit does not exist or is not an Exit object
    // Returns true if successful
    setExitHide: function(dir, hidden) {
      if (!this[dir])
        return false;
      this["exit_hidden_" + dir] = hidden;
      return true;
    },
    isExitHidden: function(dir) {
      return this["exit_hidden_" + dir];
    },
    // Returns an exit going TO this room. If sent "west", it will return the exit from the room to the west, to this room
    // which will probably be east, but may not
    getReverseExit: function(dir) {
      const dest = this[dir];
      return dest.findExit(this);
    },
    // Used for GO IN HOUSE, CLIMB UP TREE, GO THROUGH PORTAL, etc.
    // dir should be one of 'In', 'Out', 'Up', 'Down', Through' - case sensitive
    goItem: function(obj, dir, char2) {
      const att = "go" + dir + "Direction";
      if (!char2)
        char2 = player();
      if (!obj[att])
        return failedmsg(lang["cannot_go_" + dir.toLowerCase()], { item: obj, char: char2 });
      if (!this[obj[att]])
        return errormsg("Trying to 'go " + dir.toLowerCase() + "' using unknown exit '" + obj[att] + "' for " + this.name);
      return this[obj[att]].use(char2) ? world.SUCCESS : world.FAILED;
    }
    //
  };
  const DEFAULT_ITEM = {
    lightSource: () => world.LIGHT_NONE,
    icon: () => "",
    testKeys: (char2, toLock) => false,
    getListAlias: function(loc2) {
      return this.listAlias;
    },
    getVerbs: function() {
      const verbList = [];
      for (let f of this.verbFunctions)
        f(this, verbList);
      if (player() && !this.isAtLoc(player().name)) {
        if (this.hereVerbs) {
          for (let s of this.hereVerbs)
            verbList.push(s);
        }
      } else if (this.getWorn()) {
        if (this.wornVerbs) {
          for (let s of this.wornVerbs)
            verbList.push(s);
        }
      } else {
        if (this.heldVerbs) {
          for (let s of this.heldVerbs)
            verbList.push(s);
        }
      }
      if (this.verbFunction)
        this.verbFunction(verbList);
      return verbList;
    },
    transform: function(item2) {
      item2.loc = this.loc;
      delete this.loc;
      for (const key in w$1) {
        if (w$1[key].loc === this.name)
          w$1[key].loc = item2.name;
      }
      for (const key in parser.pronouns) {
        if (parser.pronouns[key] === this)
          parser.pronouns[key] = item2;
      }
    }
  };
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  function getAugmentedNamespace(n) {
    if (n.__esModule)
      return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          var args = [null];
          args.push.apply(args, arguments);
          var Ctor = Function.bind.apply(f, args);
          return new Ctor();
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else
      a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var picocolors_browser = { exports: {} };
  var x = String;
  var create = function() {
    return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x };
  };
  picocolors_browser.exports = create();
  picocolors_browser.exports.createColors = create;
  var picocolors_browserExports = picocolors_browser.exports;
  const __viteBrowserExternal = {};
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$2 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  let pico = picocolors_browserExports;
  let terminalHighlight$1 = require$$2;
  let CssSyntaxError$3 = class CssSyntaxError2 extends Error {
    constructor(message, line, column, source, file, plugin) {
      super(message);
      this.name = "CssSyntaxError";
      this.reason = message;
      if (file) {
        this.file = file;
      }
      if (source) {
        this.source = source;
      }
      if (plugin) {
        this.plugin = plugin;
      }
      if (typeof line !== "undefined" && typeof column !== "undefined") {
        if (typeof line === "number") {
          this.line = line;
          this.column = column;
        } else {
          this.line = line.line;
          this.column = line.column;
          this.endLine = column.line;
          this.endColumn = column.column;
        }
      }
      this.setMessage();
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CssSyntaxError2);
      }
    }
    setMessage() {
      this.message = this.plugin ? this.plugin + ": " : "";
      this.message += this.file ? this.file : "<css input>";
      if (typeof this.line !== "undefined") {
        this.message += ":" + this.line + ":" + this.column;
      }
      this.message += ": " + this.reason;
    }
    showSourceCode(color) {
      if (!this.source)
        return "";
      let css = this.source;
      if (color == null)
        color = pico.isColorSupported;
      if (terminalHighlight$1) {
        if (color)
          css = terminalHighlight$1(css);
      }
      let lines = css.split(/\r?\n/);
      let start = Math.max(this.line - 3, 0);
      let end = Math.min(this.line + 2, lines.length);
      let maxWidth = String(end).length;
      let mark, aside;
      if (color) {
        let { bold, red, gray } = pico.createColors(true);
        mark = (text) => bold(red(text));
        aside = (text) => gray(text);
      } else {
        mark = aside = (str) => str;
      }
      return lines.slice(start, end).map((line, index) => {
        let number = start + 1 + index;
        let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
        if (number === this.line) {
          let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
          return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
        }
        return " " + aside(gutter) + line;
      }).join("\n");
    }
    toString() {
      let code = this.showSourceCode();
      if (code) {
        code = "\n\n" + code + "\n";
      }
      return this.name + ": " + this.message + code;
    }
  };
  var cssSyntaxError = CssSyntaxError$3;
  CssSyntaxError$3.default = CssSyntaxError$3;
  var symbols = {};
  symbols.isClean = Symbol("isClean");
  symbols.my = Symbol("my");
  const DEFAULT_RAW = {
    colon: ": ",
    indent: "    ",
    beforeDecl: "\n",
    beforeRule: "\n",
    beforeOpen: " ",
    beforeClose: "\n",
    beforeComment: "\n",
    after: "\n",
    emptyBody: "",
    commentLeft: " ",
    commentRight: " ",
    semicolon: false
  };
  function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
  let Stringifier$2 = class Stringifier {
    constructor(builder) {
      this.builder = builder;
    }
    stringify(node2, semicolon) {
      if (!this[node2.type]) {
        throw new Error(
          "Unknown AST node type " + node2.type + ". Maybe you need to change PostCSS stringifier."
        );
      }
      this[node2.type](node2, semicolon);
    }
    document(node2) {
      this.body(node2);
    }
    root(node2) {
      this.body(node2);
      if (node2.raws.after)
        this.builder(node2.raws.after);
    }
    comment(node2) {
      let left = this.raw(node2, "left", "commentLeft");
      let right = this.raw(node2, "right", "commentRight");
      this.builder("/*" + left + node2.text + right + "*/", node2);
    }
    decl(node2, semicolon) {
      let between = this.raw(node2, "between", "colon");
      let string = node2.prop + between + this.rawValue(node2, "value");
      if (node2.important) {
        string += node2.raws.important || " !important";
      }
      if (semicolon)
        string += ";";
      this.builder(string, node2);
    }
    rule(node2) {
      this.block(node2, this.rawValue(node2, "selector"));
      if (node2.raws.ownSemicolon) {
        this.builder(node2.raws.ownSemicolon, node2, "end");
      }
    }
    atrule(node2, semicolon) {
      let name2 = "@" + node2.name;
      let params = node2.params ? this.rawValue(node2, "params") : "";
      if (typeof node2.raws.afterName !== "undefined") {
        name2 += node2.raws.afterName;
      } else if (params) {
        name2 += " ";
      }
      if (node2.nodes) {
        this.block(node2, name2 + params);
      } else {
        let end = (node2.raws.between || "") + (semicolon ? ";" : "");
        this.builder(name2 + params + end, node2);
      }
    }
    body(node2) {
      let last = node2.nodes.length - 1;
      while (last > 0) {
        if (node2.nodes[last].type !== "comment")
          break;
        last -= 1;
      }
      let semicolon = this.raw(node2, "semicolon");
      for (let i2 = 0; i2 < node2.nodes.length; i2++) {
        let child = node2.nodes[i2];
        let before = this.raw(child, "before");
        if (before)
          this.builder(before);
        this.stringify(child, last !== i2 || semicolon);
      }
    }
    block(node2, start) {
      let between = this.raw(node2, "between", "beforeOpen");
      this.builder(start + between + "{", node2, "start");
      let after;
      if (node2.nodes && node2.nodes.length) {
        this.body(node2);
        after = this.raw(node2, "after");
      } else {
        after = this.raw(node2, "after", "emptyBody");
      }
      if (after)
        this.builder(after);
      this.builder("}", node2, "end");
    }
    raw(node2, own, detect) {
      let value;
      if (!detect)
        detect = own;
      if (own) {
        value = node2.raws[own];
        if (typeof value !== "undefined")
          return value;
      }
      let parent = node2.parent;
      if (detect === "before") {
        if (!parent || parent.type === "root" && parent.first === node2) {
          return "";
        }
        if (parent && parent.type === "document") {
          return "";
        }
      }
      if (!parent)
        return DEFAULT_RAW[detect];
      let root2 = node2.root();
      if (!root2.rawCache)
        root2.rawCache = {};
      if (typeof root2.rawCache[detect] !== "undefined") {
        return root2.rawCache[detect];
      }
      if (detect === "before" || detect === "after") {
        return this.beforeAfter(node2, detect);
      } else {
        let method = "raw" + capitalize(detect);
        if (this[method]) {
          value = this[method](root2, node2);
        } else {
          root2.walk((i2) => {
            value = i2.raws[own];
            if (typeof value !== "undefined")
              return false;
          });
        }
      }
      if (typeof value === "undefined")
        value = DEFAULT_RAW[detect];
      root2.rawCache[detect] = value;
      return value;
    }
    rawSemicolon(root2) {
      let value;
      root2.walk((i2) => {
        if (i2.nodes && i2.nodes.length && i2.last.type === "decl") {
          value = i2.raws.semicolon;
          if (typeof value !== "undefined")
            return false;
        }
      });
      return value;
    }
    rawEmptyBody(root2) {
      let value;
      root2.walk((i2) => {
        if (i2.nodes && i2.nodes.length === 0) {
          value = i2.raws.after;
          if (typeof value !== "undefined")
            return false;
        }
      });
      return value;
    }
    rawIndent(root2) {
      if (root2.raws.indent)
        return root2.raws.indent;
      let value;
      root2.walk((i2) => {
        let p = i2.parent;
        if (p && p !== root2 && p.parent && p.parent === root2) {
          if (typeof i2.raws.before !== "undefined") {
            let parts = i2.raws.before.split("\n");
            value = parts[parts.length - 1];
            value = value.replace(/\S/g, "");
            return false;
          }
        }
      });
      return value;
    }
    rawBeforeComment(root2, node2) {
      let value;
      root2.walkComments((i2) => {
        if (typeof i2.raws.before !== "undefined") {
          value = i2.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      });
      if (typeof value === "undefined") {
        value = this.raw(node2, null, "beforeDecl");
      } else if (value) {
        value = value.replace(/\S/g, "");
      }
      return value;
    }
    rawBeforeDecl(root2, node2) {
      let value;
      root2.walkDecls((i2) => {
        if (typeof i2.raws.before !== "undefined") {
          value = i2.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      });
      if (typeof value === "undefined") {
        value = this.raw(node2, null, "beforeRule");
      } else if (value) {
        value = value.replace(/\S/g, "");
      }
      return value;
    }
    rawBeforeRule(root2) {
      let value;
      root2.walk((i2) => {
        if (i2.nodes && (i2.parent !== root2 || root2.first !== i2)) {
          if (typeof i2.raws.before !== "undefined") {
            value = i2.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        }
      });
      if (value)
        value = value.replace(/\S/g, "");
      return value;
    }
    rawBeforeClose(root2) {
      let value;
      root2.walk((i2) => {
        if (i2.nodes && i2.nodes.length > 0) {
          if (typeof i2.raws.after !== "undefined") {
            value = i2.raws.after;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        }
      });
      if (value)
        value = value.replace(/\S/g, "");
      return value;
    }
    rawBeforeOpen(root2) {
      let value;
      root2.walk((i2) => {
        if (i2.type !== "decl") {
          value = i2.raws.between;
          if (typeof value !== "undefined")
            return false;
        }
      });
      return value;
    }
    rawColon(root2) {
      let value;
      root2.walkDecls((i2) => {
        if (typeof i2.raws.between !== "undefined") {
          value = i2.raws.between.replace(/[^\s:]/g, "");
          return false;
        }
      });
      return value;
    }
    beforeAfter(node2, detect) {
      let value;
      if (node2.type === "decl") {
        value = this.raw(node2, null, "beforeDecl");
      } else if (node2.type === "comment") {
        value = this.raw(node2, null, "beforeComment");
      } else if (detect === "before") {
        value = this.raw(node2, null, "beforeRule");
      } else {
        value = this.raw(node2, null, "beforeClose");
      }
      let buf = node2.parent;
      let depth = 0;
      while (buf && buf.type !== "root") {
        depth += 1;
        buf = buf.parent;
      }
      if (value.includes("\n")) {
        let indent = this.raw(node2, null, "indent");
        if (indent.length) {
          for (let step = 0; step < depth; step++)
            value += indent;
        }
      }
      return value;
    }
    rawValue(node2, prop) {
      let value = node2[prop];
      let raw = node2.raws[prop];
      if (raw && raw.value === value) {
        return raw.raw;
      }
      return value;
    }
  };
  var stringifier = Stringifier$2;
  Stringifier$2.default = Stringifier$2;
  let Stringifier$1 = stringifier;
  function stringify$4(node2, builder) {
    let str = new Stringifier$1(builder);
    str.stringify(node2);
  }
  var stringify_1 = stringify$4;
  stringify$4.default = stringify$4;
  let { isClean: isClean$2, my: my$2 } = symbols;
  let CssSyntaxError$2 = cssSyntaxError;
  let Stringifier = stringifier;
  let stringify$3 = stringify_1;
  function cloneNode(obj, parent) {
    let cloned = new obj.constructor();
    for (let i2 in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, i2)) {
        continue;
      }
      if (i2 === "proxyCache")
        continue;
      let value = obj[i2];
      let type = typeof value;
      if (i2 === "parent" && type === "object") {
        if (parent)
          cloned[i2] = parent;
      } else if (i2 === "source") {
        cloned[i2] = value;
      } else if (Array.isArray(value)) {
        cloned[i2] = value.map((j) => cloneNode(j, cloned));
      } else {
        if (type === "object" && value !== null)
          value = cloneNode(value);
        cloned[i2] = value;
      }
    }
    return cloned;
  }
  let Node$4 = class Node {
    constructor(defaults = {}) {
      this.raws = {};
      this[isClean$2] = false;
      this[my$2] = true;
      for (let name2 in defaults) {
        if (name2 === "nodes") {
          this.nodes = [];
          for (let node2 of defaults[name2]) {
            if (typeof node2.clone === "function") {
              this.append(node2.clone());
            } else {
              this.append(node2);
            }
          }
        } else {
          this[name2] = defaults[name2];
        }
      }
    }
    error(message, opts = {}) {
      if (this.source) {
        let { start, end } = this.rangeBy(opts);
        return this.source.input.error(
          message,
          { line: start.line, column: start.column },
          { line: end.line, column: end.column },
          opts
        );
      }
      return new CssSyntaxError$2(message);
    }
    warn(result2, text, opts) {
      let data = { node: this };
      for (let i2 in opts)
        data[i2] = opts[i2];
      return result2.warn(text, data);
    }
    remove() {
      if (this.parent) {
        this.parent.removeChild(this);
      }
      this.parent = void 0;
      return this;
    }
    toString(stringifier2 = stringify$3) {
      if (stringifier2.stringify)
        stringifier2 = stringifier2.stringify;
      let result2 = "";
      stringifier2(this, (i2) => {
        result2 += i2;
      });
      return result2;
    }
    assign(overrides = {}) {
      for (let name2 in overrides) {
        this[name2] = overrides[name2];
      }
      return this;
    }
    clone(overrides = {}) {
      let cloned = cloneNode(this);
      for (let name2 in overrides) {
        cloned[name2] = overrides[name2];
      }
      return cloned;
    }
    cloneBefore(overrides = {}) {
      let cloned = this.clone(overrides);
      this.parent.insertBefore(this, cloned);
      return cloned;
    }
    cloneAfter(overrides = {}) {
      let cloned = this.clone(overrides);
      this.parent.insertAfter(this, cloned);
      return cloned;
    }
    replaceWith(...nodes) {
      if (this.parent) {
        let bookmark = this;
        let foundSelf = false;
        for (let node2 of nodes) {
          if (node2 === this) {
            foundSelf = true;
          } else if (foundSelf) {
            this.parent.insertAfter(bookmark, node2);
            bookmark = node2;
          } else {
            this.parent.insertBefore(bookmark, node2);
          }
        }
        if (!foundSelf) {
          this.remove();
        }
      }
      return this;
    }
    next() {
      if (!this.parent)
        return void 0;
      let index = this.parent.index(this);
      return this.parent.nodes[index + 1];
    }
    prev() {
      if (!this.parent)
        return void 0;
      let index = this.parent.index(this);
      return this.parent.nodes[index - 1];
    }
    before(add) {
      this.parent.insertBefore(this, add);
      return this;
    }
    after(add) {
      this.parent.insertAfter(this, add);
      return this;
    }
    root() {
      let result2 = this;
      while (result2.parent && result2.parent.type !== "document") {
        result2 = result2.parent;
      }
      return result2;
    }
    raw(prop, defaultType) {
      let str = new Stringifier();
      return str.raw(this, prop, defaultType);
    }
    cleanRaws(keepBetween) {
      delete this.raws.before;
      delete this.raws.after;
      if (!keepBetween)
        delete this.raws.between;
    }
    toJSON(_, inputs) {
      let fixed = {};
      let emitInputs = inputs == null;
      inputs = inputs || /* @__PURE__ */ new Map();
      let inputsNextIndex = 0;
      for (let name2 in this) {
        if (!Object.prototype.hasOwnProperty.call(this, name2)) {
          continue;
        }
        if (name2 === "parent" || name2 === "proxyCache")
          continue;
        let value = this[name2];
        if (Array.isArray(value)) {
          fixed[name2] = value.map((i2) => {
            if (typeof i2 === "object" && i2.toJSON) {
              return i2.toJSON(null, inputs);
            } else {
              return i2;
            }
          });
        } else if (typeof value === "object" && value.toJSON) {
          fixed[name2] = value.toJSON(null, inputs);
        } else if (name2 === "source") {
          let inputId = inputs.get(value.input);
          if (inputId == null) {
            inputId = inputsNextIndex;
            inputs.set(value.input, inputsNextIndex);
            inputsNextIndex++;
          }
          fixed[name2] = {
            inputId,
            start: value.start,
            end: value.end
          };
        } else {
          fixed[name2] = value;
        }
      }
      if (emitInputs) {
        fixed.inputs = [...inputs.keys()].map((input2) => input2.toJSON());
      }
      return fixed;
    }
    positionInside(index) {
      let string = this.toString();
      let column = this.source.start.column;
      let line = this.source.start.line;
      for (let i2 = 0; i2 < index; i2++) {
        if (string[i2] === "\n") {
          column = 1;
          line += 1;
        } else {
          column += 1;
        }
      }
      return { line, column };
    }
    positionBy(opts) {
      let pos = this.source.start;
      if (opts.index) {
        pos = this.positionInside(opts.index);
      } else if (opts.word) {
        let index = this.toString().indexOf(opts.word);
        if (index !== -1)
          pos = this.positionInside(index);
      }
      return pos;
    }
    rangeBy(opts) {
      let start = {
        line: this.source.start.line,
        column: this.source.start.column
      };
      let end = this.source.end ? {
        line: this.source.end.line,
        column: this.source.end.column + 1
      } : {
        line: start.line,
        column: start.column + 1
      };
      if (opts.word) {
        let index = this.toString().indexOf(opts.word);
        if (index !== -1) {
          start = this.positionInside(index);
          end = this.positionInside(index + opts.word.length);
        }
      } else {
        if (opts.start) {
          start = {
            line: opts.start.line,
            column: opts.start.column
          };
        } else if (opts.index) {
          start = this.positionInside(opts.index);
        }
        if (opts.end) {
          end = {
            line: opts.end.line,
            column: opts.end.column
          };
        } else if (opts.endIndex) {
          end = this.positionInside(opts.endIndex);
        } else if (opts.index) {
          end = this.positionInside(opts.index + 1);
        }
      }
      if (end.line < start.line || end.line === start.line && end.column <= start.column) {
        end = { line: start.line, column: start.column + 1 };
      }
      return { start, end };
    }
    getProxyProcessor() {
      return {
        set(node2, prop, value) {
          if (node2[prop] === value)
            return true;
          node2[prop] = value;
          if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || /* c8 ignore next */
          prop === "text") {
            node2.markDirty();
          }
          return true;
        },
        get(node2, prop) {
          if (prop === "proxyOf") {
            return node2;
          } else if (prop === "root") {
            return () => node2.root().toProxy();
          } else {
            return node2[prop];
          }
        }
      };
    }
    toProxy() {
      if (!this.proxyCache) {
        this.proxyCache = new Proxy(this, this.getProxyProcessor());
      }
      return this.proxyCache;
    }
    addToError(error) {
      error.postcssNode = this;
      if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
        let s = this.source;
        error.stack = error.stack.replace(
          /\n\s{4}at /,
          `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
        );
      }
      return error;
    }
    markDirty() {
      if (this[isClean$2]) {
        this[isClean$2] = false;
        let next = this;
        while (next = next.parent) {
          next[isClean$2] = false;
        }
      }
    }
    get proxyOf() {
      return this;
    }
  };
  var node = Node$4;
  Node$4.default = Node$4;
  let Node$3 = node;
  let Declaration$4 = class Declaration extends Node$3 {
    constructor(defaults) {
      if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
        defaults = { ...defaults, value: String(defaults.value) };
      }
      super(defaults);
      this.type = "decl";
    }
    get variable() {
      return this.prop.startsWith("--") || this.prop[0] === "$";
    }
  };
  var declaration = Declaration$4;
  Declaration$4.default = Declaration$4;
  let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
  let customAlphabet = (alphabet, defaultSize = 21) => {
    return (size = defaultSize) => {
      let id = "";
      let i2 = size;
      while (i2--) {
        id += alphabet[Math.random() * alphabet.length | 0];
      }
      return id;
    };
  };
  let nanoid$1 = (size = 21) => {
    let id = "";
    let i2 = size;
    while (i2--) {
      id += urlAlphabet[Math.random() * 64 | 0];
    }
    return id;
  };
  var nonSecure = { nanoid: nanoid$1, customAlphabet };
  let { SourceMapConsumer: SourceMapConsumer$2, SourceMapGenerator: SourceMapGenerator$2 } = require$$2;
  let { existsSync, readFileSync } = require$$2;
  let { dirname: dirname$1, join } = require$$2;
  function fromBase64(str) {
    if (Buffer) {
      return Buffer.from(str, "base64").toString();
    } else {
      return window.atob(str);
    }
  }
  let PreviousMap$2 = class PreviousMap {
    constructor(css, opts) {
      if (opts.map === false)
        return;
      this.loadAnnotation(css);
      this.inline = this.startWith(this.annotation, "data:");
      let prev = opts.map ? opts.map.prev : void 0;
      let text = this.loadMap(opts.from, prev);
      if (!this.mapFile && opts.from) {
        this.mapFile = opts.from;
      }
      if (this.mapFile)
        this.root = dirname$1(this.mapFile);
      if (text)
        this.text = text;
    }
    consumer() {
      if (!this.consumerCache) {
        this.consumerCache = new SourceMapConsumer$2(this.text);
      }
      return this.consumerCache;
    }
    withContent() {
      return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
    }
    startWith(string, start) {
      if (!string)
        return false;
      return string.substr(0, start.length) === start;
    }
    getAnnotationURL(sourceMapString) {
      return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
    }
    loadAnnotation(css) {
      let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
      if (!comments)
        return;
      let start = css.lastIndexOf(comments.pop());
      let end = css.indexOf("*/", start);
      if (start > -1 && end > -1) {
        this.annotation = this.getAnnotationURL(css.substring(start, end));
      }
    }
    decodeInline(text) {
      let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
      let baseUri = /^data:application\/json;base64,/;
      let charsetUri = /^data:application\/json;charset=utf-?8,/;
      let uri = /^data:application\/json,/;
      if (charsetUri.test(text) || uri.test(text)) {
        return decodeURIComponent(text.substr(RegExp.lastMatch.length));
      }
      if (baseCharsetUri.test(text) || baseUri.test(text)) {
        return fromBase64(text.substr(RegExp.lastMatch.length));
      }
      let encoding = text.match(/data:application\/json;([^,]+),/)[1];
      throw new Error("Unsupported source map encoding " + encoding);
    }
    loadFile(path) {
      this.root = dirname$1(path);
      if (existsSync(path)) {
        this.mapFile = path;
        return readFileSync(path, "utf-8").toString().trim();
      }
    }
    loadMap(file, prev) {
      if (prev === false)
        return false;
      if (prev) {
        if (typeof prev === "string") {
          return prev;
        } else if (typeof prev === "function") {
          let prevPath = prev(file);
          if (prevPath) {
            let map2 = this.loadFile(prevPath);
            if (!map2) {
              throw new Error(
                "Unable to load previous source map: " + prevPath.toString()
              );
            }
            return map2;
          }
        } else if (prev instanceof SourceMapConsumer$2) {
          return SourceMapGenerator$2.fromSourceMap(prev).toString();
        } else if (prev instanceof SourceMapGenerator$2) {
          return prev.toString();
        } else if (this.isMap(prev)) {
          return JSON.stringify(prev);
        } else {
          throw new Error(
            "Unsupported previous source map format: " + prev.toString()
          );
        }
      } else if (this.inline) {
        return this.decodeInline(this.annotation);
      } else if (this.annotation) {
        let map2 = this.annotation;
        if (file)
          map2 = join(dirname$1(file), map2);
        return this.loadFile(map2);
      }
    }
    isMap(map2) {
      if (typeof map2 !== "object")
        return false;
      return typeof map2.mappings === "string" || typeof map2._mappings === "string" || Array.isArray(map2.sections);
    }
  };
  var previousMap = PreviousMap$2;
  PreviousMap$2.default = PreviousMap$2;
  let { SourceMapConsumer: SourceMapConsumer$1, SourceMapGenerator: SourceMapGenerator$1 } = require$$2;
  let { fileURLToPath, pathToFileURL: pathToFileURL$1 } = require$$2;
  let { resolve: resolve$1, isAbsolute } = require$$2;
  let { nanoid } = nonSecure;
  let terminalHighlight = require$$2;
  let CssSyntaxError$1 = cssSyntaxError;
  let PreviousMap$1 = previousMap;
  let fromOffsetCache = Symbol("fromOffsetCache");
  let sourceMapAvailable$1 = Boolean(SourceMapConsumer$1 && SourceMapGenerator$1);
  let pathAvailable$1 = Boolean(resolve$1 && isAbsolute);
  let Input$4 = class Input {
    constructor(css, opts = {}) {
      if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
        throw new Error(`PostCSS received ${css} instead of CSS string`);
      }
      this.css = css.toString();
      if (this.css[0] === "\uFEFF" || this.css[0] === "￾") {
        this.hasBOM = true;
        this.css = this.css.slice(1);
      } else {
        this.hasBOM = false;
      }
      if (opts.from) {
        if (!pathAvailable$1 || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
          this.file = opts.from;
        } else {
          this.file = resolve$1(opts.from);
        }
      }
      if (pathAvailable$1 && sourceMapAvailable$1) {
        let map2 = new PreviousMap$1(this.css, opts);
        if (map2.text) {
          this.map = map2;
          let file = map2.consumer().file;
          if (!this.file && file)
            this.file = this.mapResolve(file);
        }
      }
      if (!this.file) {
        this.id = "<input css " + nanoid(6) + ">";
      }
      if (this.map)
        this.map.file = this.from;
    }
    fromOffset(offset) {
      let lastLine, lineToIndex;
      if (!this[fromOffsetCache]) {
        let lines = this.css.split("\n");
        lineToIndex = new Array(lines.length);
        let prevIndex = 0;
        for (let i2 = 0, l = lines.length; i2 < l; i2++) {
          lineToIndex[i2] = prevIndex;
          prevIndex += lines[i2].length + 1;
        }
        this[fromOffsetCache] = lineToIndex;
      } else {
        lineToIndex = this[fromOffsetCache];
      }
      lastLine = lineToIndex[lineToIndex.length - 1];
      let min = 0;
      if (offset >= lastLine) {
        min = lineToIndex.length - 1;
      } else {
        let max = lineToIndex.length - 2;
        let mid;
        while (min < max) {
          mid = min + (max - min >> 1);
          if (offset < lineToIndex[mid]) {
            max = mid - 1;
          } else if (offset >= lineToIndex[mid + 1]) {
            min = mid + 1;
          } else {
            min = mid;
            break;
          }
        }
      }
      return {
        line: min + 1,
        col: offset - lineToIndex[min] + 1
      };
    }
    error(message, line, column, opts = {}) {
      let result2, endLine, endColumn;
      if (line && typeof line === "object") {
        let start = line;
        let end = column;
        if (typeof start.offset === "number") {
          let pos = this.fromOffset(start.offset);
          line = pos.line;
          column = pos.col;
        } else {
          line = start.line;
          column = start.column;
        }
        if (typeof end.offset === "number") {
          let pos = this.fromOffset(end.offset);
          endLine = pos.line;
          endColumn = pos.col;
        } else {
          endLine = end.line;
          endColumn = end.column;
        }
      } else if (!column) {
        let pos = this.fromOffset(line);
        line = pos.line;
        column = pos.col;
      }
      let origin = this.origin(line, column, endLine, endColumn);
      if (origin) {
        result2 = new CssSyntaxError$1(
          message,
          origin.endLine === void 0 ? origin.line : { line: origin.line, column: origin.column },
          origin.endLine === void 0 ? origin.column : { line: origin.endLine, column: origin.endColumn },
          origin.source,
          origin.file,
          opts.plugin
        );
      } else {
        result2 = new CssSyntaxError$1(
          message,
          endLine === void 0 ? line : { line, column },
          endLine === void 0 ? column : { line: endLine, column: endColumn },
          this.css,
          this.file,
          opts.plugin
        );
      }
      result2.input = { line, column, endLine, endColumn, source: this.css };
      if (this.file) {
        if (pathToFileURL$1) {
          result2.input.url = pathToFileURL$1(this.file).toString();
        }
        result2.input.file = this.file;
      }
      return result2;
    }
    origin(line, column, endLine, endColumn) {
      if (!this.map)
        return false;
      let consumer = this.map.consumer();
      let from = consumer.originalPositionFor({ line, column });
      if (!from.source)
        return false;
      let to;
      if (typeof endLine === "number") {
        to = consumer.originalPositionFor({ line: endLine, column: endColumn });
      }
      let fromUrl;
      if (isAbsolute(from.source)) {
        fromUrl = pathToFileURL$1(from.source);
      } else {
        fromUrl = new URL(
          from.source,
          this.map.consumer().sourceRoot || pathToFileURL$1(this.map.mapFile)
        );
      }
      let result2 = {
        url: fromUrl.toString(),
        line: from.line,
        column: from.column,
        endLine: to && to.line,
        endColumn: to && to.column
      };
      if (fromUrl.protocol === "file:") {
        if (fileURLToPath) {
          result2.file = fileURLToPath(fromUrl);
        } else {
          throw new Error(`file: protocol is not available in this PostCSS build`);
        }
      }
      let source = consumer.sourceContentFor(from.source);
      if (source)
        result2.source = source;
      return result2;
    }
    mapResolve(file) {
      if (/^\w+:\/\//.test(file)) {
        return file;
      }
      return resolve$1(this.map.consumer().sourceRoot || this.map.root || ".", file);
    }
    get from() {
      return this.file || this.id;
    }
    toJSON() {
      let json = {};
      for (let name2 of ["hasBOM", "css", "file", "id"]) {
        if (this[name2] != null) {
          json[name2] = this[name2];
        }
      }
      if (this.map) {
        json.map = { ...this.map };
        if (json.map.consumerCache) {
          json.map.consumerCache = void 0;
        }
      }
      return json;
    }
  };
  var input = Input$4;
  Input$4.default = Input$4;
  if (terminalHighlight && terminalHighlight.registerInput) {
    terminalHighlight.registerInput(Input$4);
  }
  let { SourceMapConsumer, SourceMapGenerator } = require$$2;
  let { dirname, resolve, relative, sep } = require$$2;
  let { pathToFileURL } = require$$2;
  let Input$3 = input;
  let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
  let pathAvailable = Boolean(dirname && resolve && relative && sep);
  let MapGenerator$2 = class MapGenerator {
    constructor(stringify2, root2, opts, cssString) {
      this.stringify = stringify2;
      this.mapOpts = opts.map || {};
      this.root = root2;
      this.opts = opts;
      this.css = cssString;
      this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
    }
    isMap() {
      if (typeof this.opts.map !== "undefined") {
        return !!this.opts.map;
      }
      return this.previous().length > 0;
    }
    previous() {
      if (!this.previousMaps) {
        this.previousMaps = [];
        if (this.root) {
          this.root.walk((node2) => {
            if (node2.source && node2.source.input.map) {
              let map2 = node2.source.input.map;
              if (!this.previousMaps.includes(map2)) {
                this.previousMaps.push(map2);
              }
            }
          });
        } else {
          let input2 = new Input$3(this.css, this.opts);
          if (input2.map)
            this.previousMaps.push(input2.map);
        }
      }
      return this.previousMaps;
    }
    isInline() {
      if (typeof this.mapOpts.inline !== "undefined") {
        return this.mapOpts.inline;
      }
      let annotation = this.mapOpts.annotation;
      if (typeof annotation !== "undefined" && annotation !== true) {
        return false;
      }
      if (this.previous().length) {
        return this.previous().some((i2) => i2.inline);
      }
      return true;
    }
    isSourcesContent() {
      if (typeof this.mapOpts.sourcesContent !== "undefined") {
        return this.mapOpts.sourcesContent;
      }
      if (this.previous().length) {
        return this.previous().some((i2) => i2.withContent());
      }
      return true;
    }
    clearAnnotation() {
      if (this.mapOpts.annotation === false)
        return;
      if (this.root) {
        let node2;
        for (let i2 = this.root.nodes.length - 1; i2 >= 0; i2--) {
          node2 = this.root.nodes[i2];
          if (node2.type !== "comment")
            continue;
          if (node2.text.indexOf("# sourceMappingURL=") === 0) {
            this.root.removeChild(i2);
          }
        }
      } else if (this.css) {
        this.css = this.css.replace(/(\n)?\/\*#[\S\s]*?\*\/$/gm, "");
      }
    }
    setSourcesContent() {
      let already = {};
      if (this.root) {
        this.root.walk((node2) => {
          if (node2.source) {
            let from = node2.source.input.from;
            if (from && !already[from]) {
              already[from] = true;
              let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
              this.map.setSourceContent(fromUrl, node2.source.input.css);
            }
          }
        });
      } else if (this.css) {
        let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
        this.map.setSourceContent(from, this.css);
      }
    }
    applyPrevMaps() {
      for (let prev of this.previous()) {
        let from = this.toUrl(this.path(prev.file));
        let root2 = prev.root || dirname(prev.file);
        let map2;
        if (this.mapOpts.sourcesContent === false) {
          map2 = new SourceMapConsumer(prev.text);
          if (map2.sourcesContent) {
            map2.sourcesContent = map2.sourcesContent.map(() => null);
          }
        } else {
          map2 = prev.consumer();
        }
        this.map.applySourceMap(map2, from, this.toUrl(this.path(root2)));
      }
    }
    isAnnotation() {
      if (this.isInline()) {
        return true;
      }
      if (typeof this.mapOpts.annotation !== "undefined") {
        return this.mapOpts.annotation;
      }
      if (this.previous().length) {
        return this.previous().some((i2) => i2.annotation);
      }
      return true;
    }
    toBase64(str) {
      if (Buffer) {
        return Buffer.from(str).toString("base64");
      } else {
        return window.btoa(unescape(encodeURIComponent(str)));
      }
    }
    addAnnotation() {
      let content;
      if (this.isInline()) {
        content = "data:application/json;base64," + this.toBase64(this.map.toString());
      } else if (typeof this.mapOpts.annotation === "string") {
        content = this.mapOpts.annotation;
      } else if (typeof this.mapOpts.annotation === "function") {
        content = this.mapOpts.annotation(this.opts.to, this.root);
      } else {
        content = this.outputFile() + ".map";
      }
      let eol = "\n";
      if (this.css.includes("\r\n"))
        eol = "\r\n";
      this.css += eol + "/*# sourceMappingURL=" + content + " */";
    }
    outputFile() {
      if (this.opts.to) {
        return this.path(this.opts.to);
      } else if (this.opts.from) {
        return this.path(this.opts.from);
      } else {
        return "to.css";
      }
    }
    generateMap() {
      if (this.root) {
        this.generateString();
      } else if (this.previous().length === 1) {
        let prev = this.previous()[0].consumer();
        prev.file = this.outputFile();
        this.map = SourceMapGenerator.fromSourceMap(prev);
      } else {
        this.map = new SourceMapGenerator({ file: this.outputFile() });
        this.map.addMapping({
          source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>",
          generated: { line: 1, column: 0 },
          original: { line: 1, column: 0 }
        });
      }
      if (this.isSourcesContent())
        this.setSourcesContent();
      if (this.root && this.previous().length > 0)
        this.applyPrevMaps();
      if (this.isAnnotation())
        this.addAnnotation();
      if (this.isInline()) {
        return [this.css];
      } else {
        return [this.css, this.map];
      }
    }
    path(file) {
      if (file.indexOf("<") === 0)
        return file;
      if (/^\w+:\/\//.test(file))
        return file;
      if (this.mapOpts.absolute)
        return file;
      let from = this.opts.to ? dirname(this.opts.to) : ".";
      if (typeof this.mapOpts.annotation === "string") {
        from = dirname(resolve(from, this.mapOpts.annotation));
      }
      file = relative(from, file);
      return file;
    }
    toUrl(path) {
      if (sep === "\\") {
        path = path.replace(/\\/g, "/");
      }
      return encodeURI(path).replace(/[#?]/g, encodeURIComponent);
    }
    toFileUrl(path) {
      if (pathToFileURL) {
        return pathToFileURL(path).toString();
      } else {
        throw new Error(
          "`map.absolute` option is not available in this PostCSS build"
        );
      }
    }
    sourcePath(node2) {
      if (this.mapOpts.from) {
        return this.toUrl(this.mapOpts.from);
      } else if (this.usesFileUrls) {
        return this.toFileUrl(node2.source.input.from);
      } else {
        return this.toUrl(this.path(node2.source.input.from));
      }
    }
    generateString() {
      this.css = "";
      this.map = new SourceMapGenerator({ file: this.outputFile() });
      let line = 1;
      let column = 1;
      let noSource = "<no source>";
      let mapping = {
        source: "",
        generated: { line: 0, column: 0 },
        original: { line: 0, column: 0 }
      };
      let lines, last;
      this.stringify(this.root, (str, node2, type) => {
        this.css += str;
        if (node2 && type !== "end") {
          mapping.generated.line = line;
          mapping.generated.column = column - 1;
          if (node2.source && node2.source.start) {
            mapping.source = this.sourcePath(node2);
            mapping.original.line = node2.source.start.line;
            mapping.original.column = node2.source.start.column - 1;
            this.map.addMapping(mapping);
          } else {
            mapping.source = noSource;
            mapping.original.line = 1;
            mapping.original.column = 0;
            this.map.addMapping(mapping);
          }
        }
        lines = str.match(/\n/g);
        if (lines) {
          line += lines.length;
          last = str.lastIndexOf("\n");
          column = str.length - last;
        } else {
          column += str.length;
        }
        if (node2 && type !== "start") {
          let p = node2.parent || { raws: {} };
          let childless = node2.type === "decl" || node2.type === "atrule" && !node2.nodes;
          if (!childless || node2 !== p.last || p.raws.semicolon) {
            if (node2.source && node2.source.end) {
              mapping.source = this.sourcePath(node2);
              mapping.original.line = node2.source.end.line;
              mapping.original.column = node2.source.end.column - 1;
              mapping.generated.line = line;
              mapping.generated.column = column - 2;
              this.map.addMapping(mapping);
            } else {
              mapping.source = noSource;
              mapping.original.line = 1;
              mapping.original.column = 0;
              mapping.generated.line = line;
              mapping.generated.column = column - 1;
              this.map.addMapping(mapping);
            }
          }
        }
      });
    }
    generate() {
      this.clearAnnotation();
      if (pathAvailable && sourceMapAvailable && this.isMap()) {
        return this.generateMap();
      } else {
        let result2 = "";
        this.stringify(this.root, (i2) => {
          result2 += i2;
        });
        return [result2];
      }
    }
  };
  var mapGenerator = MapGenerator$2;
  let Node$2 = node;
  let Comment$4 = class Comment extends Node$2 {
    constructor(defaults) {
      super(defaults);
      this.type = "comment";
    }
  };
  var comment = Comment$4;
  Comment$4.default = Comment$4;
  let { isClean: isClean$1, my: my$1 } = symbols;
  let Declaration$3 = declaration;
  let Comment$3 = comment;
  let Node$1 = node;
  let parse$4, Rule$4, AtRule$4, Root$6;
  function cleanSource(nodes) {
    return nodes.map((i2) => {
      if (i2.nodes)
        i2.nodes = cleanSource(i2.nodes);
      delete i2.source;
      return i2;
    });
  }
  function markDirtyUp(node2) {
    node2[isClean$1] = false;
    if (node2.proxyOf.nodes) {
      for (let i2 of node2.proxyOf.nodes) {
        markDirtyUp(i2);
      }
    }
  }
  let Container$7 = class Container2 extends Node$1 {
    push(child) {
      child.parent = this;
      this.proxyOf.nodes.push(child);
      return this;
    }
    each(callback) {
      if (!this.proxyOf.nodes)
        return void 0;
      let iterator = this.getIterator();
      let index, result2;
      while (this.indexes[iterator] < this.proxyOf.nodes.length) {
        index = this.indexes[iterator];
        result2 = callback(this.proxyOf.nodes[index], index);
        if (result2 === false)
          break;
        this.indexes[iterator] += 1;
      }
      delete this.indexes[iterator];
      return result2;
    }
    walk(callback) {
      return this.each((child, i2) => {
        let result2;
        try {
          result2 = callback(child, i2);
        } catch (e) {
          throw child.addToError(e);
        }
        if (result2 !== false && child.walk) {
          result2 = child.walk(callback);
        }
        return result2;
      });
    }
    walkDecls(prop, callback) {
      if (!callback) {
        callback = prop;
        return this.walk((child, i2) => {
          if (child.type === "decl") {
            return callback(child, i2);
          }
        });
      }
      if (prop instanceof RegExp) {
        return this.walk((child, i2) => {
          if (child.type === "decl" && prop.test(child.prop)) {
            return callback(child, i2);
          }
        });
      }
      return this.walk((child, i2) => {
        if (child.type === "decl" && child.prop === prop) {
          return callback(child, i2);
        }
      });
    }
    walkRules(selector, callback) {
      if (!callback) {
        callback = selector;
        return this.walk((child, i2) => {
          if (child.type === "rule") {
            return callback(child, i2);
          }
        });
      }
      if (selector instanceof RegExp) {
        return this.walk((child, i2) => {
          if (child.type === "rule" && selector.test(child.selector)) {
            return callback(child, i2);
          }
        });
      }
      return this.walk((child, i2) => {
        if (child.type === "rule" && child.selector === selector) {
          return callback(child, i2);
        }
      });
    }
    walkAtRules(name2, callback) {
      if (!callback) {
        callback = name2;
        return this.walk((child, i2) => {
          if (child.type === "atrule") {
            return callback(child, i2);
          }
        });
      }
      if (name2 instanceof RegExp) {
        return this.walk((child, i2) => {
          if (child.type === "atrule" && name2.test(child.name)) {
            return callback(child, i2);
          }
        });
      }
      return this.walk((child, i2) => {
        if (child.type === "atrule" && child.name === name2) {
          return callback(child, i2);
        }
      });
    }
    walkComments(callback) {
      return this.walk((child, i2) => {
        if (child.type === "comment") {
          return callback(child, i2);
        }
      });
    }
    append(...children) {
      for (let child of children) {
        let nodes = this.normalize(child, this.last);
        for (let node2 of nodes)
          this.proxyOf.nodes.push(node2);
      }
      this.markDirty();
      return this;
    }
    prepend(...children) {
      children = children.reverse();
      for (let child of children) {
        let nodes = this.normalize(child, this.first, "prepend").reverse();
        for (let node2 of nodes)
          this.proxyOf.nodes.unshift(node2);
        for (let id in this.indexes) {
          this.indexes[id] = this.indexes[id] + nodes.length;
        }
      }
      this.markDirty();
      return this;
    }
    cleanRaws(keepBetween) {
      super.cleanRaws(keepBetween);
      if (this.nodes) {
        for (let node2 of this.nodes)
          node2.cleanRaws(keepBetween);
      }
    }
    insertBefore(exist, add) {
      let existIndex = this.index(exist);
      let type = existIndex === 0 ? "prepend" : false;
      let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
      existIndex = this.index(exist);
      for (let node2 of nodes)
        this.proxyOf.nodes.splice(existIndex, 0, node2);
      let index;
      for (let id in this.indexes) {
        index = this.indexes[id];
        if (existIndex <= index) {
          this.indexes[id] = index + nodes.length;
        }
      }
      this.markDirty();
      return this;
    }
    insertAfter(exist, add) {
      let existIndex = this.index(exist);
      let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
      existIndex = this.index(exist);
      for (let node2 of nodes)
        this.proxyOf.nodes.splice(existIndex + 1, 0, node2);
      let index;
      for (let id in this.indexes) {
        index = this.indexes[id];
        if (existIndex < index) {
          this.indexes[id] = index + nodes.length;
        }
      }
      this.markDirty();
      return this;
    }
    removeChild(child) {
      child = this.index(child);
      this.proxyOf.nodes[child].parent = void 0;
      this.proxyOf.nodes.splice(child, 1);
      let index;
      for (let id in this.indexes) {
        index = this.indexes[id];
        if (index >= child) {
          this.indexes[id] = index - 1;
        }
      }
      this.markDirty();
      return this;
    }
    removeAll() {
      for (let node2 of this.proxyOf.nodes)
        node2.parent = void 0;
      this.proxyOf.nodes = [];
      this.markDirty();
      return this;
    }
    replaceValues(pattern, opts, callback) {
      if (!callback) {
        callback = opts;
        opts = {};
      }
      this.walkDecls((decl) => {
        if (opts.props && !opts.props.includes(decl.prop))
          return;
        if (opts.fast && !decl.value.includes(opts.fast))
          return;
        decl.value = decl.value.replace(pattern, callback);
      });
      this.markDirty();
      return this;
    }
    every(condition) {
      return this.nodes.every(condition);
    }
    some(condition) {
      return this.nodes.some(condition);
    }
    index(child) {
      if (typeof child === "number")
        return child;
      if (child.proxyOf)
        child = child.proxyOf;
      return this.proxyOf.nodes.indexOf(child);
    }
    get first() {
      if (!this.proxyOf.nodes)
        return void 0;
      return this.proxyOf.nodes[0];
    }
    get last() {
      if (!this.proxyOf.nodes)
        return void 0;
      return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
    }
    normalize(nodes, sample) {
      if (typeof nodes === "string") {
        nodes = cleanSource(parse$4(nodes).nodes);
      } else if (Array.isArray(nodes)) {
        nodes = nodes.slice(0);
        for (let i2 of nodes) {
          if (i2.parent)
            i2.parent.removeChild(i2, "ignore");
        }
      } else if (nodes.type === "root" && this.type !== "document") {
        nodes = nodes.nodes.slice(0);
        for (let i2 of nodes) {
          if (i2.parent)
            i2.parent.removeChild(i2, "ignore");
        }
      } else if (nodes.type) {
        nodes = [nodes];
      } else if (nodes.prop) {
        if (typeof nodes.value === "undefined") {
          throw new Error("Value field is missed in node creation");
        } else if (typeof nodes.value !== "string") {
          nodes.value = String(nodes.value);
        }
        nodes = [new Declaration$3(nodes)];
      } else if (nodes.selector) {
        nodes = [new Rule$4(nodes)];
      } else if (nodes.name) {
        nodes = [new AtRule$4(nodes)];
      } else if (nodes.text) {
        nodes = [new Comment$3(nodes)];
      } else {
        throw new Error("Unknown node type in node creation");
      }
      let processed = nodes.map((i2) => {
        if (!i2[my$1])
          Container2.rebuild(i2);
        i2 = i2.proxyOf;
        if (i2.parent)
          i2.parent.removeChild(i2);
        if (i2[isClean$1])
          markDirtyUp(i2);
        if (typeof i2.raws.before === "undefined") {
          if (sample && typeof sample.raws.before !== "undefined") {
            i2.raws.before = sample.raws.before.replace(/\S/g, "");
          }
        }
        i2.parent = this.proxyOf;
        return i2;
      });
      return processed;
    }
    getProxyProcessor() {
      return {
        set(node2, prop, value) {
          if (node2[prop] === value)
            return true;
          node2[prop] = value;
          if (prop === "name" || prop === "params" || prop === "selector") {
            node2.markDirty();
          }
          return true;
        },
        get(node2, prop) {
          if (prop === "proxyOf") {
            return node2;
          } else if (!node2[prop]) {
            return node2[prop];
          } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
            return (...args) => {
              return node2[prop](
                ...args.map((i2) => {
                  if (typeof i2 === "function") {
                    return (child, index) => i2(child.toProxy(), index);
                  } else {
                    return i2;
                  }
                })
              );
            };
          } else if (prop === "every" || prop === "some") {
            return (cb) => {
              return node2[prop](
                (child, ...other) => cb(child.toProxy(), ...other)
              );
            };
          } else if (prop === "root") {
            return () => node2.root().toProxy();
          } else if (prop === "nodes") {
            return node2.nodes.map((i2) => i2.toProxy());
          } else if (prop === "first" || prop === "last") {
            return node2[prop].toProxy();
          } else {
            return node2[prop];
          }
        }
      };
    }
    getIterator() {
      if (!this.lastEach)
        this.lastEach = 0;
      if (!this.indexes)
        this.indexes = {};
      this.lastEach += 1;
      let iterator = this.lastEach;
      this.indexes[iterator] = 0;
      return iterator;
    }
  };
  Container$7.registerParse = (dependant) => {
    parse$4 = dependant;
  };
  Container$7.registerRule = (dependant) => {
    Rule$4 = dependant;
  };
  Container$7.registerAtRule = (dependant) => {
    AtRule$4 = dependant;
  };
  Container$7.registerRoot = (dependant) => {
    Root$6 = dependant;
  };
  var container$1 = Container$7;
  Container$7.default = Container$7;
  Container$7.rebuild = (node2) => {
    if (node2.type === "atrule") {
      Object.setPrototypeOf(node2, AtRule$4.prototype);
    } else if (node2.type === "rule") {
      Object.setPrototypeOf(node2, Rule$4.prototype);
    } else if (node2.type === "decl") {
      Object.setPrototypeOf(node2, Declaration$3.prototype);
    } else if (node2.type === "comment") {
      Object.setPrototypeOf(node2, Comment$3.prototype);
    } else if (node2.type === "root") {
      Object.setPrototypeOf(node2, Root$6.prototype);
    }
    node2[my$1] = true;
    if (node2.nodes) {
      node2.nodes.forEach((child) => {
        Container$7.rebuild(child);
      });
    }
  };
  let Container$6 = container$1;
  let LazyResult$4, Processor$3;
  let Document$3 = class Document extends Container$6 {
    constructor(defaults) {
      super({ type: "document", ...defaults });
      if (!this.nodes) {
        this.nodes = [];
      }
    }
    toResult(opts = {}) {
      let lazy = new LazyResult$4(new Processor$3(), this, opts);
      return lazy.stringify();
    }
  };
  Document$3.registerLazyResult = (dependant) => {
    LazyResult$4 = dependant;
  };
  Document$3.registerProcessor = (dependant) => {
    Processor$3 = dependant;
  };
  var document$1 = Document$3;
  Document$3.default = Document$3;
  let printed = {};
  var warnOnce$2 = function warnOnce2(message) {
    if (printed[message])
      return;
    printed[message] = true;
    if (typeof console !== "undefined" && console.warn) {
      console.warn(message);
    }
  };
  let Warning$2 = class Warning {
    constructor(text, opts = {}) {
      this.type = "warning";
      this.text = text;
      if (opts.node && opts.node.source) {
        let range = opts.node.rangeBy(opts);
        this.line = range.start.line;
        this.column = range.start.column;
        this.endLine = range.end.line;
        this.endColumn = range.end.column;
      }
      for (let opt in opts)
        this[opt] = opts[opt];
    }
    toString() {
      if (this.node) {
        return this.node.error(this.text, {
          plugin: this.plugin,
          index: this.index,
          word: this.word
        }).message;
      }
      if (this.plugin) {
        return this.plugin + ": " + this.text;
      }
      return this.text;
    }
  };
  var warning = Warning$2;
  Warning$2.default = Warning$2;
  let Warning$1 = warning;
  let Result$3 = class Result {
    constructor(processor2, root2, opts) {
      this.processor = processor2;
      this.messages = [];
      this.root = root2;
      this.opts = opts;
      this.css = void 0;
      this.map = void 0;
    }
    toString() {
      return this.css;
    }
    warn(text, opts = {}) {
      if (!opts.plugin) {
        if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
          opts.plugin = this.lastPlugin.postcssPlugin;
        }
      }
      let warning2 = new Warning$1(text, opts);
      this.messages.push(warning2);
      return warning2;
    }
    warnings() {
      return this.messages.filter((i2) => i2.type === "warning");
    }
    get content() {
      return this.css;
    }
  };
  var result = Result$3;
  Result$3.default = Result$3;
  const SINGLE_QUOTE = "'".charCodeAt(0);
  const DOUBLE_QUOTE = '"'.charCodeAt(0);
  const BACKSLASH = "\\".charCodeAt(0);
  const SLASH = "/".charCodeAt(0);
  const NEWLINE = "\n".charCodeAt(0);
  const SPACE = " ".charCodeAt(0);
  const FEED = "\f".charCodeAt(0);
  const TAB = "	".charCodeAt(0);
  const CR = "\r".charCodeAt(0);
  const OPEN_SQUARE = "[".charCodeAt(0);
  const CLOSE_SQUARE = "]".charCodeAt(0);
  const OPEN_PARENTHESES = "(".charCodeAt(0);
  const CLOSE_PARENTHESES = ")".charCodeAt(0);
  const OPEN_CURLY = "{".charCodeAt(0);
  const CLOSE_CURLY = "}".charCodeAt(0);
  const SEMICOLON = ";".charCodeAt(0);
  const ASTERISK = "*".charCodeAt(0);
  const COLON = ":".charCodeAt(0);
  const AT = "@".charCodeAt(0);
  const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
  const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
  const RE_BAD_BRACKET = /.[\n"'(/\\]/;
  const RE_HEX_ESCAPE = /[\da-f]/i;
  var tokenize = function tokenizer2(input2, options = {}) {
    let css = input2.css.valueOf();
    let ignore = options.ignoreErrors;
    let code, next, quote, content, escape;
    let escaped, escapePos, prev, n, currentToken;
    let length = css.length;
    let pos = 0;
    let buffer = [];
    let returned = [];
    function position() {
      return pos;
    }
    function unclosed(what) {
      throw input2.error("Unclosed " + what, pos);
    }
    function endOfFile() {
      return returned.length === 0 && pos >= length;
    }
    function nextToken(opts) {
      if (returned.length)
        return returned.pop();
      if (pos >= length)
        return;
      let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
      code = css.charCodeAt(pos);
      switch (code) {
        case NEWLINE:
        case SPACE:
        case TAB:
        case CR:
        case FEED: {
          next = pos;
          do {
            next += 1;
            code = css.charCodeAt(next);
          } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
          currentToken = ["space", css.slice(pos, next)];
          pos = next - 1;
          break;
        }
        case OPEN_SQUARE:
        case CLOSE_SQUARE:
        case OPEN_CURLY:
        case CLOSE_CURLY:
        case COLON:
        case SEMICOLON:
        case CLOSE_PARENTHESES: {
          let controlChar = String.fromCharCode(code);
          currentToken = [controlChar, controlChar, pos];
          break;
        }
        case OPEN_PARENTHESES: {
          prev = buffer.length ? buffer.pop()[1] : "";
          n = css.charCodeAt(pos + 1);
          if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
            next = pos;
            do {
              escaped = false;
              next = css.indexOf(")", next + 1);
              if (next === -1) {
                if (ignore || ignoreUnclosed) {
                  next = pos;
                  break;
                } else {
                  unclosed("bracket");
                }
              }
              escapePos = next;
              while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                escapePos -= 1;
                escaped = !escaped;
              }
            } while (escaped);
            currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
            pos = next;
          } else {
            next = css.indexOf(")", pos + 1);
            content = css.slice(pos, next + 1);
            if (next === -1 || RE_BAD_BRACKET.test(content)) {
              currentToken = ["(", "(", pos];
            } else {
              currentToken = ["brackets", content, pos, next];
              pos = next;
            }
          }
          break;
        }
        case SINGLE_QUOTE:
        case DOUBLE_QUOTE: {
          quote = code === SINGLE_QUOTE ? "'" : '"';
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(quote, next + 1);
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos + 1;
                break;
              } else {
                unclosed("string");
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);
          currentToken = ["string", css.slice(pos, next + 1), pos, next];
          pos = next;
          break;
        }
        case AT: {
          RE_AT_END.lastIndex = pos + 1;
          RE_AT_END.test(css);
          if (RE_AT_END.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_AT_END.lastIndex - 2;
          }
          currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
          pos = next;
          break;
        }
        case BACKSLASH: {
          next = pos;
          escape = true;
          while (css.charCodeAt(next + 1) === BACKSLASH) {
            next += 1;
            escape = !escape;
          }
          code = css.charCodeAt(next + 1);
          if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
            next += 1;
            if (RE_HEX_ESCAPE.test(css.charAt(next))) {
              while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
                next += 1;
              }
              if (css.charCodeAt(next + 1) === SPACE) {
                next += 1;
              }
            }
          }
          currentToken = ["word", css.slice(pos, next + 1), pos, next];
          pos = next;
          break;
        }
        default: {
          if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
            next = css.indexOf("*/", pos + 2) + 1;
            if (next === 0) {
              if (ignore || ignoreUnclosed) {
                next = css.length;
              } else {
                unclosed("comment");
              }
            }
            currentToken = ["comment", css.slice(pos, next + 1), pos, next];
            pos = next;
          } else {
            RE_WORD_END.lastIndex = pos + 1;
            RE_WORD_END.test(css);
            if (RE_WORD_END.lastIndex === 0) {
              next = css.length - 1;
            } else {
              next = RE_WORD_END.lastIndex - 2;
            }
            currentToken = ["word", css.slice(pos, next + 1), pos, next];
            buffer.push(currentToken);
            pos = next;
          }
          break;
        }
      }
      pos++;
      return currentToken;
    }
    function back(token) {
      returned.push(token);
    }
    return {
      back,
      nextToken,
      endOfFile,
      position
    };
  };
  let Container$5 = container$1;
  let AtRule$3 = class AtRule extends Container$5 {
    constructor(defaults) {
      super(defaults);
      this.type = "atrule";
    }
    append(...children) {
      if (!this.proxyOf.nodes)
        this.nodes = [];
      return super.append(...children);
    }
    prepend(...children) {
      if (!this.proxyOf.nodes)
        this.nodes = [];
      return super.prepend(...children);
    }
  };
  var atRule = AtRule$3;
  AtRule$3.default = AtRule$3;
  Container$5.registerAtRule(AtRule$3);
  let Container$4 = container$1;
  let LazyResult$3, Processor$2;
  let Root$5 = class Root extends Container$4 {
    constructor(defaults) {
      super(defaults);
      this.type = "root";
      if (!this.nodes)
        this.nodes = [];
    }
    removeChild(child, ignore) {
      let index = this.index(child);
      if (!ignore && index === 0 && this.nodes.length > 1) {
        this.nodes[1].raws.before = this.nodes[index].raws.before;
      }
      return super.removeChild(child);
    }
    normalize(child, sample, type) {
      let nodes = super.normalize(child);
      if (sample) {
        if (type === "prepend") {
          if (this.nodes.length > 1) {
            sample.raws.before = this.nodes[1].raws.before;
          } else {
            delete sample.raws.before;
          }
        } else if (this.first !== sample) {
          for (let node2 of nodes) {
            node2.raws.before = sample.raws.before;
          }
        }
      }
      return nodes;
    }
    toResult(opts = {}) {
      let lazy = new LazyResult$3(new Processor$2(), this, opts);
      return lazy.stringify();
    }
  };
  Root$5.registerLazyResult = (dependant) => {
    LazyResult$3 = dependant;
  };
  Root$5.registerProcessor = (dependant) => {
    Processor$2 = dependant;
  };
  var root = Root$5;
  Root$5.default = Root$5;
  Container$4.registerRoot(Root$5);
  let list$3 = {
    split(string, separators, last) {
      let array2 = [];
      let current = "";
      let split = false;
      let func2 = 0;
      let inQuote = false;
      let prevQuote = "";
      let escape = false;
      for (let letter of string) {
        if (escape) {
          escape = false;
        } else if (letter === "\\") {
          escape = true;
        } else if (inQuote) {
          if (letter === prevQuote) {
            inQuote = false;
          }
        } else if (letter === '"' || letter === "'") {
          inQuote = true;
          prevQuote = letter;
        } else if (letter === "(") {
          func2 += 1;
        } else if (letter === ")") {
          if (func2 > 0)
            func2 -= 1;
        } else if (func2 === 0) {
          if (separators.includes(letter))
            split = true;
        }
        if (split) {
          if (current !== "")
            array2.push(current.trim());
          current = "";
          split = false;
        } else {
          current += letter;
        }
      }
      if (last || current !== "")
        array2.push(current.trim());
      return array2;
    },
    space(string) {
      let spaces2 = [" ", "\n", "	"];
      return list$3.split(string, spaces2);
    },
    comma(string) {
      return list$3.split(string, [","], true);
    }
  };
  var list_1 = list$3;
  list$3.default = list$3;
  let Container$3 = container$1;
  let list$2 = list_1;
  let Rule$3 = class Rule extends Container$3 {
    constructor(defaults) {
      super(defaults);
      this.type = "rule";
      if (!this.nodes)
        this.nodes = [];
    }
    get selectors() {
      return list$2.comma(this.selector);
    }
    set selectors(values) {
      let match = this.selector ? this.selector.match(/,\s*/) : null;
      let sep2 = match ? match[0] : "," + this.raw("between", "beforeOpen");
      this.selector = values.join(sep2);
    }
  };
  var rule = Rule$3;
  Rule$3.default = Rule$3;
  Container$3.registerRule(Rule$3);
  let Declaration$2 = declaration;
  let tokenizer = tokenize;
  let Comment$2 = comment;
  let AtRule$2 = atRule;
  let Root$4 = root;
  let Rule$2 = rule;
  const SAFE_COMMENT_NEIGHBOR = {
    empty: true,
    space: true
  };
  function findLastWithPosition(tokens) {
    for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
      let token = tokens[i2];
      let pos = token[3] || token[2];
      if (pos)
        return pos;
    }
  }
  let Parser$1 = class Parser {
    constructor(input2) {
      this.input = input2;
      this.root = new Root$4();
      this.current = this.root;
      this.spaces = "";
      this.semicolon = false;
      this.customProperty = false;
      this.createTokenizer();
      this.root.source = { input: input2, start: { offset: 0, line: 1, column: 1 } };
    }
    createTokenizer() {
      this.tokenizer = tokenizer(this.input);
    }
    parse() {
      let token;
      while (!this.tokenizer.endOfFile()) {
        token = this.tokenizer.nextToken();
        switch (token[0]) {
          case "space":
            this.spaces += token[1];
            break;
          case ";":
            this.freeSemicolon(token);
            break;
          case "}":
            this.end(token);
            break;
          case "comment":
            this.comment(token);
            break;
          case "at-word":
            this.atrule(token);
            break;
          case "{":
            this.emptyRule(token);
            break;
          default:
            this.other(token);
            break;
        }
      }
      this.endFile();
    }
    comment(token) {
      let node2 = new Comment$2();
      this.init(node2, token[2]);
      node2.source.end = this.getPosition(token[3] || token[2]);
      let text = token[1].slice(2, -2);
      if (/^\s*$/.test(text)) {
        node2.text = "";
        node2.raws.left = text;
        node2.raws.right = "";
      } else {
        let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
        node2.text = match[2];
        node2.raws.left = match[1];
        node2.raws.right = match[3];
      }
    }
    emptyRule(token) {
      let node2 = new Rule$2();
      this.init(node2, token[2]);
      node2.selector = "";
      node2.raws.between = "";
      this.current = node2;
    }
    other(start) {
      let end = false;
      let type = null;
      let colon = false;
      let bracket = null;
      let brackets = [];
      let customProperty = start[1].startsWith("--");
      let tokens = [];
      let token = start;
      while (token) {
        type = token[0];
        tokens.push(token);
        if (type === "(" || type === "[") {
          if (!bracket)
            bracket = token;
          brackets.push(type === "(" ? ")" : "]");
        } else if (customProperty && colon && type === "{") {
          if (!bracket)
            bracket = token;
          brackets.push("}");
        } else if (brackets.length === 0) {
          if (type === ";") {
            if (colon) {
              this.decl(tokens, customProperty);
              return;
            } else {
              break;
            }
          } else if (type === "{") {
            this.rule(tokens);
            return;
          } else if (type === "}") {
            this.tokenizer.back(tokens.pop());
            end = true;
            break;
          } else if (type === ":") {
            colon = true;
          }
        } else if (type === brackets[brackets.length - 1]) {
          brackets.pop();
          if (brackets.length === 0)
            bracket = null;
        }
        token = this.tokenizer.nextToken();
      }
      if (this.tokenizer.endOfFile())
        end = true;
      if (brackets.length > 0)
        this.unclosedBracket(bracket);
      if (end && colon) {
        if (!customProperty) {
          while (tokens.length) {
            token = tokens[tokens.length - 1][0];
            if (token !== "space" && token !== "comment")
              break;
            this.tokenizer.back(tokens.pop());
          }
        }
        this.decl(tokens, customProperty);
      } else {
        this.unknownWord(tokens);
      }
    }
    rule(tokens) {
      tokens.pop();
      let node2 = new Rule$2();
      this.init(node2, tokens[0][2]);
      node2.raws.between = this.spacesAndCommentsFromEnd(tokens);
      this.raw(node2, "selector", tokens);
      this.current = node2;
    }
    decl(tokens, customProperty) {
      let node2 = new Declaration$2();
      this.init(node2, tokens[0][2]);
      let last = tokens[tokens.length - 1];
      if (last[0] === ";") {
        this.semicolon = true;
        tokens.pop();
      }
      node2.source.end = this.getPosition(
        last[3] || last[2] || findLastWithPosition(tokens)
      );
      while (tokens[0][0] !== "word") {
        if (tokens.length === 1)
          this.unknownWord(tokens);
        node2.raws.before += tokens.shift()[1];
      }
      node2.source.start = this.getPosition(tokens[0][2]);
      node2.prop = "";
      while (tokens.length) {
        let type = tokens[0][0];
        if (type === ":" || type === "space" || type === "comment") {
          break;
        }
        node2.prop += tokens.shift()[1];
      }
      node2.raws.between = "";
      let token;
      while (tokens.length) {
        token = tokens.shift();
        if (token[0] === ":") {
          node2.raws.between += token[1];
          break;
        } else {
          if (token[0] === "word" && /\w/.test(token[1])) {
            this.unknownWord([token]);
          }
          node2.raws.between += token[1];
        }
      }
      if (node2.prop[0] === "_" || node2.prop[0] === "*") {
        node2.raws.before += node2.prop[0];
        node2.prop = node2.prop.slice(1);
      }
      let firstSpaces = [];
      let next;
      while (tokens.length) {
        next = tokens[0][0];
        if (next !== "space" && next !== "comment")
          break;
        firstSpaces.push(tokens.shift());
      }
      this.precheckMissedSemicolon(tokens);
      for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
        token = tokens[i2];
        if (token[1].toLowerCase() === "!important") {
          node2.important = true;
          let string = this.stringFrom(tokens, i2);
          string = this.spacesFromEnd(tokens) + string;
          if (string !== " !important")
            node2.raws.important = string;
          break;
        } else if (token[1].toLowerCase() === "important") {
          let cache = tokens.slice(0);
          let str = "";
          for (let j = i2; j > 0; j--) {
            let type = cache[j][0];
            if (str.trim().indexOf("!") === 0 && type !== "space") {
              break;
            }
            str = cache.pop()[1] + str;
          }
          if (str.trim().indexOf("!") === 0) {
            node2.important = true;
            node2.raws.important = str;
            tokens = cache;
          }
        }
        if (token[0] !== "space" && token[0] !== "comment") {
          break;
        }
      }
      let hasWord = tokens.some((i2) => i2[0] !== "space" && i2[0] !== "comment");
      if (hasWord) {
        node2.raws.between += firstSpaces.map((i2) => i2[1]).join("");
        firstSpaces = [];
      }
      this.raw(node2, "value", firstSpaces.concat(tokens), customProperty);
      if (node2.value.includes(":") && !customProperty) {
        this.checkMissedSemicolon(tokens);
      }
    }
    atrule(token) {
      let node2 = new AtRule$2();
      node2.name = token[1].slice(1);
      if (node2.name === "") {
        this.unnamedAtrule(node2, token);
      }
      this.init(node2, token[2]);
      let type;
      let prev;
      let shift;
      let last = false;
      let open2 = false;
      let params = [];
      let brackets = [];
      while (!this.tokenizer.endOfFile()) {
        token = this.tokenizer.nextToken();
        type = token[0];
        if (type === "(" || type === "[") {
          brackets.push(type === "(" ? ")" : "]");
        } else if (type === "{" && brackets.length > 0) {
          brackets.push("}");
        } else if (type === brackets[brackets.length - 1]) {
          brackets.pop();
        }
        if (brackets.length === 0) {
          if (type === ";") {
            node2.source.end = this.getPosition(token[2]);
            this.semicolon = true;
            break;
          } else if (type === "{") {
            open2 = true;
            break;
          } else if (type === "}") {
            if (params.length > 0) {
              shift = params.length - 1;
              prev = params[shift];
              while (prev && prev[0] === "space") {
                prev = params[--shift];
              }
              if (prev) {
                node2.source.end = this.getPosition(prev[3] || prev[2]);
              }
            }
            this.end(token);
            break;
          } else {
            params.push(token);
          }
        } else {
          params.push(token);
        }
        if (this.tokenizer.endOfFile()) {
          last = true;
          break;
        }
      }
      node2.raws.between = this.spacesAndCommentsFromEnd(params);
      if (params.length) {
        node2.raws.afterName = this.spacesAndCommentsFromStart(params);
        this.raw(node2, "params", params);
        if (last) {
          token = params[params.length - 1];
          node2.source.end = this.getPosition(token[3] || token[2]);
          this.spaces = node2.raws.between;
          node2.raws.between = "";
        }
      } else {
        node2.raws.afterName = "";
        node2.params = "";
      }
      if (open2) {
        node2.nodes = [];
        this.current = node2;
      }
    }
    end(token) {
      if (this.current.nodes && this.current.nodes.length) {
        this.current.raws.semicolon = this.semicolon;
      }
      this.semicolon = false;
      this.current.raws.after = (this.current.raws.after || "") + this.spaces;
      this.spaces = "";
      if (this.current.parent) {
        this.current.source.end = this.getPosition(token[2]);
        this.current = this.current.parent;
      } else {
        this.unexpectedClose(token);
      }
    }
    endFile() {
      if (this.current.parent)
        this.unclosedBlock();
      if (this.current.nodes && this.current.nodes.length) {
        this.current.raws.semicolon = this.semicolon;
      }
      this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    }
    freeSemicolon(token) {
      this.spaces += token[1];
      if (this.current.nodes) {
        let prev = this.current.nodes[this.current.nodes.length - 1];
        if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
          prev.raws.ownSemicolon = this.spaces;
          this.spaces = "";
        }
      }
    }
    // Helpers
    getPosition(offset) {
      let pos = this.input.fromOffset(offset);
      return {
        offset,
        line: pos.line,
        column: pos.col
      };
    }
    init(node2, offset) {
      this.current.push(node2);
      node2.source = {
        start: this.getPosition(offset),
        input: this.input
      };
      node2.raws.before = this.spaces;
      this.spaces = "";
      if (node2.type !== "comment")
        this.semicolon = false;
    }
    raw(node2, prop, tokens, customProperty) {
      let token, type;
      let length = tokens.length;
      let value = "";
      let clean = true;
      let next, prev;
      for (let i2 = 0; i2 < length; i2 += 1) {
        token = tokens[i2];
        type = token[0];
        if (type === "space" && i2 === length - 1 && !customProperty) {
          clean = false;
        } else if (type === "comment") {
          prev = tokens[i2 - 1] ? tokens[i2 - 1][0] : "empty";
          next = tokens[i2 + 1] ? tokens[i2 + 1][0] : "empty";
          if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
            if (value.slice(-1) === ",") {
              clean = false;
            } else {
              value += token[1];
            }
          } else {
            clean = false;
          }
        } else {
          value += token[1];
        }
      }
      if (!clean) {
        let raw = tokens.reduce((all, i2) => all + i2[1], "");
        node2.raws[prop] = { value, raw };
      }
      node2[prop] = value;
    }
    spacesAndCommentsFromEnd(tokens) {
      let lastTokenType;
      let spaces2 = "";
      while (tokens.length) {
        lastTokenType = tokens[tokens.length - 1][0];
        if (lastTokenType !== "space" && lastTokenType !== "comment")
          break;
        spaces2 = tokens.pop()[1] + spaces2;
      }
      return spaces2;
    }
    spacesAndCommentsFromStart(tokens) {
      let next;
      let spaces2 = "";
      while (tokens.length) {
        next = tokens[0][0];
        if (next !== "space" && next !== "comment")
          break;
        spaces2 += tokens.shift()[1];
      }
      return spaces2;
    }
    spacesFromEnd(tokens) {
      let lastTokenType;
      let spaces2 = "";
      while (tokens.length) {
        lastTokenType = tokens[tokens.length - 1][0];
        if (lastTokenType !== "space")
          break;
        spaces2 = tokens.pop()[1] + spaces2;
      }
      return spaces2;
    }
    stringFrom(tokens, from) {
      let result2 = "";
      for (let i2 = from; i2 < tokens.length; i2++) {
        result2 += tokens[i2][1];
      }
      tokens.splice(from, tokens.length - from);
      return result2;
    }
    colon(tokens) {
      let brackets = 0;
      let token, type, prev;
      for (let [i2, element] of tokens.entries()) {
        token = element;
        type = token[0];
        if (type === "(") {
          brackets += 1;
        }
        if (type === ")") {
          brackets -= 1;
        }
        if (brackets === 0 && type === ":") {
          if (!prev) {
            this.doubleColon(token);
          } else if (prev[0] === "word" && prev[1] === "progid") {
            continue;
          } else {
            return i2;
          }
        }
        prev = token;
      }
      return false;
    }
    // Errors
    unclosedBracket(bracket) {
      throw this.input.error(
        "Unclosed bracket",
        { offset: bracket[2] },
        { offset: bracket[2] + 1 }
      );
    }
    unknownWord(tokens) {
      throw this.input.error(
        "Unknown word",
        { offset: tokens[0][2] },
        { offset: tokens[0][2] + tokens[0][1].length }
      );
    }
    unexpectedClose(token) {
      throw this.input.error(
        "Unexpected }",
        { offset: token[2] },
        { offset: token[2] + 1 }
      );
    }
    unclosedBlock() {
      let pos = this.current.source.start;
      throw this.input.error("Unclosed block", pos.line, pos.column);
    }
    doubleColon(token) {
      throw this.input.error(
        "Double colon",
        { offset: token[2] },
        { offset: token[2] + token[1].length }
      );
    }
    unnamedAtrule(node2, token) {
      throw this.input.error(
        "At-rule without name",
        { offset: token[2] },
        { offset: token[2] + token[1].length }
      );
    }
    precheckMissedSemicolon() {
    }
    checkMissedSemicolon(tokens) {
      let colon = this.colon(tokens);
      if (colon === false)
        return;
      let founded = 0;
      let token;
      for (let j = colon - 1; j >= 0; j--) {
        token = tokens[j];
        if (token[0] !== "space") {
          founded += 1;
          if (founded === 2)
            break;
        }
      }
      throw this.input.error(
        "Missed semicolon",
        token[0] === "word" ? token[3] + 1 : token[2]
      );
    }
  };
  var parser$1 = Parser$1;
  let Container$2 = container$1;
  let Parser = parser$1;
  let Input$2 = input;
  function parse$3(css, opts) {
    let input2 = new Input$2(css, opts);
    let parser2 = new Parser(input2);
    try {
      parser2.parse();
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        if (e.name === "CssSyntaxError" && opts && opts.from) {
          if (/\.scss$/i.test(opts.from)) {
            e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
          } else if (/\.sass/i.test(opts.from)) {
            e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
          } else if (/\.less$/i.test(opts.from)) {
            e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
          }
        }
      }
      throw e;
    }
    return parser2.root;
  }
  var parse_1 = parse$3;
  parse$3.default = parse$3;
  Container$2.registerParse(parse$3);
  let { isClean, my } = symbols;
  let MapGenerator$1 = mapGenerator;
  let stringify$2 = stringify_1;
  let Container$1 = container$1;
  let Document$2 = document$1;
  let warnOnce$1 = warnOnce$2;
  let Result$2 = result;
  let parse$2 = parse_1;
  let Root$3 = root;
  const TYPE_TO_CLASS_NAME = {
    document: "Document",
    root: "Root",
    atrule: "AtRule",
    rule: "Rule",
    decl: "Declaration",
    comment: "Comment"
  };
  const PLUGIN_PROPS = {
    postcssPlugin: true,
    prepare: true,
    Once: true,
    Document: true,
    Root: true,
    Declaration: true,
    Rule: true,
    AtRule: true,
    Comment: true,
    DeclarationExit: true,
    RuleExit: true,
    AtRuleExit: true,
    CommentExit: true,
    RootExit: true,
    DocumentExit: true,
    OnceExit: true
  };
  const NOT_VISITORS = {
    postcssPlugin: true,
    prepare: true,
    Once: true
  };
  const CHILDREN = 0;
  function isPromise(obj) {
    return typeof obj === "object" && typeof obj.then === "function";
  }
  function getEvents(node2) {
    let key = false;
    let type = TYPE_TO_CLASS_NAME[node2.type];
    if (node2.type === "decl") {
      key = node2.prop.toLowerCase();
    } else if (node2.type === "atrule") {
      key = node2.name.toLowerCase();
    }
    if (key && node2.append) {
      return [
        type,
        type + "-" + key,
        CHILDREN,
        type + "Exit",
        type + "Exit-" + key
      ];
    } else if (key) {
      return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
    } else if (node2.append) {
      return [type, CHILDREN, type + "Exit"];
    } else {
      return [type, type + "Exit"];
    }
  }
  function toStack(node2) {
    let events;
    if (node2.type === "document") {
      events = ["Document", CHILDREN, "DocumentExit"];
    } else if (node2.type === "root") {
      events = ["Root", CHILDREN, "RootExit"];
    } else {
      events = getEvents(node2);
    }
    return {
      node: node2,
      events,
      eventIndex: 0,
      visitors: [],
      visitorIndex: 0,
      iterator: 0
    };
  }
  function cleanMarks(node2) {
    node2[isClean] = false;
    if (node2.nodes)
      node2.nodes.forEach((i2) => cleanMarks(i2));
    return node2;
  }
  let postcss$2 = {};
  let LazyResult$2 = class LazyResult2 {
    constructor(processor2, css, opts) {
      this.stringified = false;
      this.processed = false;
      let root2;
      if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
        root2 = cleanMarks(css);
      } else if (css instanceof LazyResult2 || css instanceof Result$2) {
        root2 = cleanMarks(css.root);
        if (css.map) {
          if (typeof opts.map === "undefined")
            opts.map = {};
          if (!opts.map.inline)
            opts.map.inline = false;
          opts.map.prev = css.map;
        }
      } else {
        let parser2 = parse$2;
        if (opts.syntax)
          parser2 = opts.syntax.parse;
        if (opts.parser)
          parser2 = opts.parser;
        if (parser2.parse)
          parser2 = parser2.parse;
        try {
          root2 = parser2(css, opts);
        } catch (error) {
          this.processed = true;
          this.error = error;
        }
        if (root2 && !root2[my]) {
          Container$1.rebuild(root2);
        }
      }
      this.result = new Result$2(processor2, root2, opts);
      this.helpers = { ...postcss$2, result: this.result, postcss: postcss$2 };
      this.plugins = this.processor.plugins.map((plugin) => {
        if (typeof plugin === "object" && plugin.prepare) {
          return { ...plugin, ...plugin.prepare(this.result) };
        } else {
          return plugin;
        }
      });
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
    then(onFulfilled, onRejected) {
      if (process.env.NODE_ENV !== "production") {
        if (!("from" in this.opts)) {
          warnOnce$1(
            "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
          );
        }
      }
      return this.async().then(onFulfilled, onRejected);
    }
    catch(onRejected) {
      return this.async().catch(onRejected);
    }
    finally(onFinally) {
      return this.async().then(onFinally, onFinally);
    }
    async() {
      if (this.error)
        return Promise.reject(this.error);
      if (this.processed)
        return Promise.resolve(this.result);
      if (!this.processing) {
        this.processing = this.runAsync();
      }
      return this.processing;
    }
    sync() {
      if (this.error)
        throw this.error;
      if (this.processed)
        return this.result;
      this.processed = true;
      if (this.processing) {
        throw this.getAsyncError();
      }
      for (let plugin of this.plugins) {
        let promise = this.runOnRoot(plugin);
        if (isPromise(promise)) {
          throw this.getAsyncError();
        }
      }
      this.prepareVisitors();
      if (this.hasListener) {
        let root2 = this.result.root;
        while (!root2[isClean]) {
          root2[isClean] = true;
          this.walkSync(root2);
        }
        if (this.listeners.OnceExit) {
          if (root2.type === "document") {
            for (let subRoot of root2.nodes) {
              this.visitSync(this.listeners.OnceExit, subRoot);
            }
          } else {
            this.visitSync(this.listeners.OnceExit, root2);
          }
        }
      }
      return this.result;
    }
    stringify() {
      if (this.error)
        throw this.error;
      if (this.stringified)
        return this.result;
      this.stringified = true;
      this.sync();
      let opts = this.result.opts;
      let str = stringify$2;
      if (opts.syntax)
        str = opts.syntax.stringify;
      if (opts.stringifier)
        str = opts.stringifier;
      if (str.stringify)
        str = str.stringify;
      let map2 = new MapGenerator$1(str, this.result.root, this.result.opts);
      let data = map2.generate();
      this.result.css = data[0];
      this.result.map = data[1];
      return this.result;
    }
    walkSync(node2) {
      node2[isClean] = true;
      let events = getEvents(node2);
      for (let event of events) {
        if (event === CHILDREN) {
          if (node2.nodes) {
            node2.each((child) => {
              if (!child[isClean])
                this.walkSync(child);
            });
          }
        } else {
          let visitors = this.listeners[event];
          if (visitors) {
            if (this.visitSync(visitors, node2.toProxy()))
              return;
          }
        }
      }
    }
    visitSync(visitors, node2) {
      for (let [plugin, visitor] of visitors) {
        this.result.lastPlugin = plugin;
        let promise;
        try {
          promise = visitor(node2, this.helpers);
        } catch (e) {
          throw this.handleError(e, node2.proxyOf);
        }
        if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
          return true;
        }
        if (isPromise(promise)) {
          throw this.getAsyncError();
        }
      }
    }
    runOnRoot(plugin) {
      this.result.lastPlugin = plugin;
      try {
        if (typeof plugin === "object" && plugin.Once) {
          if (this.result.root.type === "document") {
            let roots = this.result.root.nodes.map(
              (root2) => plugin.Once(root2, this.helpers)
            );
            if (isPromise(roots[0])) {
              return Promise.all(roots);
            }
            return roots;
          }
          return plugin.Once(this.result.root, this.helpers);
        } else if (typeof plugin === "function") {
          return plugin(this.result.root, this.result);
        }
      } catch (error) {
        throw this.handleError(error);
      }
    }
    getAsyncError() {
      throw new Error("Use process(css).then(cb) to work with async plugins");
    }
    handleError(error, node2) {
      let plugin = this.result.lastPlugin;
      try {
        if (node2)
          node2.addToError(error);
        this.error = error;
        if (error.name === "CssSyntaxError" && !error.plugin) {
          error.plugin = plugin.postcssPlugin;
          error.setMessage();
        } else if (plugin.postcssVersion) {
          if (process.env.NODE_ENV !== "production") {
            let pluginName = plugin.postcssPlugin;
            let pluginVer = plugin.postcssVersion;
            let runtimeVer = this.result.processor.version;
            let a = pluginVer.split(".");
            let b = runtimeVer.split(".");
            if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
              console.error(
                "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
              );
            }
          }
        }
      } catch (err) {
        if (console && console.error)
          console.error(err);
      }
      return error;
    }
    async runAsync() {
      this.plugin = 0;
      for (let i2 = 0; i2 < this.plugins.length; i2++) {
        let plugin = this.plugins[i2];
        let promise = this.runOnRoot(plugin);
        if (isPromise(promise)) {
          try {
            await promise;
          } catch (error) {
            throw this.handleError(error);
          }
        }
      }
      this.prepareVisitors();
      if (this.hasListener) {
        let root2 = this.result.root;
        while (!root2[isClean]) {
          root2[isClean] = true;
          let stack = [toStack(root2)];
          while (stack.length > 0) {
            let promise = this.visitTick(stack);
            if (isPromise(promise)) {
              try {
                await promise;
              } catch (e) {
                let node2 = stack[stack.length - 1].node;
                throw this.handleError(e, node2);
              }
            }
          }
        }
        if (this.listeners.OnceExit) {
          for (let [plugin, visitor] of this.listeners.OnceExit) {
            this.result.lastPlugin = plugin;
            try {
              if (root2.type === "document") {
                let roots = root2.nodes.map(
                  (subRoot) => visitor(subRoot, this.helpers)
                );
                await Promise.all(roots);
              } else {
                await visitor(root2, this.helpers);
              }
            } catch (e) {
              throw this.handleError(e);
            }
          }
        }
      }
      this.processed = true;
      return this.stringify();
    }
    prepareVisitors() {
      this.listeners = {};
      let add = (plugin, type, cb) => {
        if (!this.listeners[type])
          this.listeners[type] = [];
        this.listeners[type].push([plugin, cb]);
      };
      for (let plugin of this.plugins) {
        if (typeof plugin === "object") {
          for (let event in plugin) {
            if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
              throw new Error(
                `Unknown event ${event} in ${plugin.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
              );
            }
            if (!NOT_VISITORS[event]) {
              if (typeof plugin[event] === "object") {
                for (let filter in plugin[event]) {
                  if (filter === "*") {
                    add(plugin, event, plugin[event][filter]);
                  } else {
                    add(
                      plugin,
                      event + "-" + filter.toLowerCase(),
                      plugin[event][filter]
                    );
                  }
                }
              } else if (typeof plugin[event] === "function") {
                add(plugin, event, plugin[event]);
              }
            }
          }
        }
      }
      this.hasListener = Object.keys(this.listeners).length > 0;
    }
    visitTick(stack) {
      let visit = stack[stack.length - 1];
      let { node: node2, visitors } = visit;
      if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
        stack.pop();
        return;
      }
      if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
        let [plugin, visitor] = visitors[visit.visitorIndex];
        visit.visitorIndex += 1;
        if (visit.visitorIndex === visitors.length) {
          visit.visitors = [];
          visit.visitorIndex = 0;
        }
        this.result.lastPlugin = plugin;
        try {
          return visitor(node2.toProxy(), this.helpers);
        } catch (e) {
          throw this.handleError(e, node2);
        }
      }
      if (visit.iterator !== 0) {
        let iterator = visit.iterator;
        let child;
        while (child = node2.nodes[node2.indexes[iterator]]) {
          node2.indexes[iterator] += 1;
          if (!child[isClean]) {
            child[isClean] = true;
            stack.push(toStack(child));
            return;
          }
        }
        visit.iterator = 0;
        delete node2.indexes[iterator];
      }
      let events = visit.events;
      while (visit.eventIndex < events.length) {
        let event = events[visit.eventIndex];
        visit.eventIndex += 1;
        if (event === CHILDREN) {
          if (node2.nodes && node2.nodes.length) {
            node2[isClean] = true;
            visit.iterator = node2.getIterator();
          }
          return;
        } else if (this.listeners[event]) {
          visit.visitors = this.listeners[event];
          return;
        }
      }
      stack.pop();
    }
  };
  LazyResult$2.registerPostcss = (dependant) => {
    postcss$2 = dependant;
  };
  var lazyResult = LazyResult$2;
  LazyResult$2.default = LazyResult$2;
  Root$3.registerLazyResult(LazyResult$2);
  Document$2.registerLazyResult(LazyResult$2);
  let MapGenerator = mapGenerator;
  let stringify$1 = stringify_1;
  let warnOnce = warnOnce$2;
  let parse$1 = parse_1;
  const Result$1 = result;
  let NoWorkResult$1 = class NoWorkResult {
    constructor(processor2, css, opts) {
      css = css.toString();
      this.stringified = false;
      this._processor = processor2;
      this._css = css;
      this._opts = opts;
      this._map = void 0;
      let root2;
      let str = stringify$1;
      this.result = new Result$1(this._processor, root2, this._opts);
      this.result.css = css;
      let self2 = this;
      Object.defineProperty(this.result, "root", {
        get() {
          return self2.root;
        }
      });
      let map2 = new MapGenerator(str, root2, this._opts, css);
      if (map2.isMap()) {
        let [generatedCSS, generatedMap] = map2.generate();
        if (generatedCSS) {
          this.result.css = generatedCSS;
        }
        if (generatedMap) {
          this.result.map = generatedMap;
        }
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
      if (this._root) {
        return this._root;
      }
      let root2;
      let parser2 = parse$1;
      try {
        root2 = parser2(this._css, this._opts);
      } catch (error) {
        this.error = error;
      }
      if (this.error) {
        throw this.error;
      } else {
        this._root = root2;
        return root2;
      }
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
    then(onFulfilled, onRejected) {
      if (process.env.NODE_ENV !== "production") {
        if (!("from" in this._opts)) {
          warnOnce(
            "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
          );
        }
      }
      return this.async().then(onFulfilled, onRejected);
    }
    catch(onRejected) {
      return this.async().catch(onRejected);
    }
    finally(onFinally) {
      return this.async().then(onFinally, onFinally);
    }
    async() {
      if (this.error)
        return Promise.reject(this.error);
      return Promise.resolve(this.result);
    }
    sync() {
      if (this.error)
        throw this.error;
      return this.result;
    }
  };
  var noWorkResult = NoWorkResult$1;
  NoWorkResult$1.default = NoWorkResult$1;
  let NoWorkResult = noWorkResult;
  let LazyResult$1 = lazyResult;
  let Document$1 = document$1;
  let Root$2 = root;
  let Processor$1 = class Processor {
    constructor(plugins = []) {
      this.version = "8.4.23";
      this.plugins = this.normalize(plugins);
    }
    use(plugin) {
      this.plugins = this.plugins.concat(this.normalize([plugin]));
      return this;
    }
    process(css, opts = {}) {
      if (this.plugins.length === 0 && typeof opts.parser === "undefined" && typeof opts.stringifier === "undefined" && typeof opts.syntax === "undefined") {
        return new NoWorkResult(this, css, opts);
      } else {
        return new LazyResult$1(this, css, opts);
      }
    }
    normalize(plugins) {
      let normalized = [];
      for (let i2 of plugins) {
        if (i2.postcss === true) {
          i2 = i2();
        } else if (i2.postcss) {
          i2 = i2.postcss;
        }
        if (typeof i2 === "object" && Array.isArray(i2.plugins)) {
          normalized = normalized.concat(i2.plugins);
        } else if (typeof i2 === "object" && i2.postcssPlugin) {
          normalized.push(i2);
        } else if (typeof i2 === "function") {
          normalized.push(i2);
        } else if (typeof i2 === "object" && (i2.parse || i2.stringify)) {
          if (process.env.NODE_ENV !== "production") {
            throw new Error(
              "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
            );
          }
        } else {
          throw new Error(i2 + " is not a PostCSS plugin");
        }
      }
      return normalized;
    }
  };
  var processor = Processor$1;
  Processor$1.default = Processor$1;
  Root$2.registerProcessor(Processor$1);
  Document$1.registerProcessor(Processor$1);
  let Declaration$1 = declaration;
  let PreviousMap = previousMap;
  let Comment$1 = comment;
  let AtRule$1 = atRule;
  let Input$1 = input;
  let Root$1 = root;
  let Rule$1 = rule;
  function fromJSON$1(json, inputs) {
    if (Array.isArray(json))
      return json.map((n) => fromJSON$1(n));
    let { inputs: ownInputs, ...defaults } = json;
    if (ownInputs) {
      inputs = [];
      for (let input2 of ownInputs) {
        let inputHydrated = { ...input2, __proto__: Input$1.prototype };
        if (inputHydrated.map) {
          inputHydrated.map = {
            ...inputHydrated.map,
            __proto__: PreviousMap.prototype
          };
        }
        inputs.push(inputHydrated);
      }
    }
    if (defaults.nodes) {
      defaults.nodes = json.nodes.map((n) => fromJSON$1(n, inputs));
    }
    if (defaults.source) {
      let { inputId, ...source } = defaults.source;
      defaults.source = source;
      if (inputId != null) {
        defaults.source.input = inputs[inputId];
      }
    }
    if (defaults.type === "root") {
      return new Root$1(defaults);
    } else if (defaults.type === "decl") {
      return new Declaration$1(defaults);
    } else if (defaults.type === "rule") {
      return new Rule$1(defaults);
    } else if (defaults.type === "comment") {
      return new Comment$1(defaults);
    } else if (defaults.type === "atrule") {
      return new AtRule$1(defaults);
    } else {
      throw new Error("Unknown node type: " + json.type);
    }
  }
  var fromJSON_1 = fromJSON$1;
  fromJSON$1.default = fromJSON$1;
  let CssSyntaxError = cssSyntaxError;
  let Declaration = declaration;
  let LazyResult = lazyResult;
  let Container = container$1;
  let Processor = processor;
  let stringify = stringify_1;
  let fromJSON = fromJSON_1;
  let Document = document$1;
  let Warning = warning;
  let Comment = comment;
  let AtRule = atRule;
  let Result = result;
  let Input = input;
  let parse = parse_1;
  let list$1 = list_1;
  let Rule = rule;
  let Root = root;
  let Node = node;
  function postcss(...plugins) {
    if (plugins.length === 1 && Array.isArray(plugins[0])) {
      plugins = plugins[0];
    }
    return new Processor(plugins);
  }
  postcss.plugin = function plugin(name2, initializer) {
    let warningPrinted = false;
    function creator(...args) {
      if (console && console.warn && !warningPrinted) {
        warningPrinted = true;
        console.warn(
          name2 + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
        );
        if (process.env.LANG && process.env.LANG.startsWith("cn")) {
          console.warn(
            name2 + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226"
          );
        }
      }
      let transformer = initializer(...args);
      transformer.postcssPlugin = name2;
      transformer.postcssVersion = new Processor().version;
      return transformer;
    }
    let cache;
    Object.defineProperty(creator, "postcss", {
      get() {
        if (!cache)
          cache = creator();
        return cache;
      }
    });
    creator.process = function(css, processOpts, pluginOpts) {
      return postcss([creator(pluginOpts)]).process(css, processOpts);
    };
    return creator;
  };
  postcss.stringify = stringify;
  postcss.parse = parse;
  postcss.fromJSON = fromJSON;
  postcss.list = list$1;
  postcss.comment = (defaults) => new Comment(defaults);
  postcss.atRule = (defaults) => new AtRule(defaults);
  postcss.decl = (defaults) => new Declaration(defaults);
  postcss.rule = (defaults) => new Rule(defaults);
  postcss.root = (defaults) => new Root(defaults);
  postcss.document = (defaults) => new Document(defaults);
  postcss.CssSyntaxError = CssSyntaxError;
  postcss.Declaration = Declaration;
  postcss.Container = Container;
  postcss.Processor = Processor;
  postcss.Document = Document;
  postcss.Comment = Comment;
  postcss.Warning = Warning;
  postcss.AtRule = AtRule;
  postcss.Result = Result;
  postcss.Input = Input;
  postcss.Rule = Rule;
  postcss.Root = Root;
  postcss.Node = Node;
  LazyResult.registerPostcss(postcss);
  var postcss_1 = postcss;
  postcss.default = postcss;
  const postcss$1 = /* @__PURE__ */ getDefaultExportFromCjs(postcss_1);
  postcss$1.stringify;
  postcss$1.fromJSON;
  postcss$1.plugin;
  postcss$1.parse;
  const list = postcss$1.list;
  postcss$1.document;
  postcss$1.comment;
  postcss$1.atRule;
  postcss$1.rule;
  postcss$1.decl;
  postcss$1.root;
  postcss$1.CssSyntaxError;
  postcss$1.Declaration;
  postcss$1.Container;
  postcss$1.Processor;
  postcss$1.Document;
  postcss$1.Comment;
  postcss$1.Warning;
  postcss$1.AtRule;
  postcss$1.Result;
  postcss$1.Input;
  postcss$1.Rule;
  postcss$1.Root;
  postcss$1.Node;
  const TAKEABLE_DICTIONARY = {
    afterCreation: function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        verbList.push(o2.isAtLoc(player().name) ? lang.verbs.drop : lang.verbs.take);
      });
    },
    takeable: true,
    msgDrop: lang.drop_successful,
    msgDropIn: lang.done_msg,
    msgTake: lang.take_successful,
    msgTakeOut: lang.done_msg,
    drop: function(options) {
      if (this.testDrop && !this.testDrop(options))
        return false;
      const dest = w$1[options.char.loc];
      if (dest.testDropIn && !dest.testDropIn(options))
        return false;
      msg(this.msgDrop, options);
      this.moveToFrom(options, "loc", "name");
      return true;
    },
    take: function(options) {
      const char2 = options.char;
      if (this.isAtLoc(char2.name))
        return falsemsg(lang.already_have, options);
      if (!char2.testManipulate(this, "take"))
        return false;
      if (this.testTake && !this.testTake(options))
        return false;
      if (w$1[char2.loc].testTakeOut && !w$1[char2.loc].testTakeOut(options))
        return false;
      msg(this.msgTake, options);
      this.moveToFrom(options, "name", "loc");
      if (this.scenery)
        this.scenery = false;
      return true;
    },
    // This returns the location from which the item is to be taken
    // (and does not do taking from a location).
    // This can be useful for weird objects, such as ropes
    takeFromLoc: function(char2) {
      return this.loc;
    }
  };
  const TAKEABLE = () => TAKEABLE_DICTIONARY;
  const SHIFTABLE = function() {
    return {
      shiftable: true
    };
  };
  const createEnsemble = function(name2, ensembleMembers, dict) {
    const res = createItem(name2, dict);
    res.ensemble = true;
    res.ensembleMembers = ensembleMembers;
    res.parserPriority = 30;
    res.inventorySkip = true;
    res.takeable = true;
    res.getWorn = function(situation) {
      return this.isAtLoc(this.ensembleMembers[0].loc, situation) && this.ensembleMembers[0].getWorn();
    };
    res.nameModifierFunctions = [function(o, list2) {
      if (o.ensembleMembers[0].getWorn() && o.isAllTogether() && o.ensembleMembers[0].isAtLoc(player().name))
        list2.push(lang.invModifiers.worn);
    }];
    res.isLocatedAt = function(loc2, situation) {
      if (situation !== world.PARSER)
        return false;
      const worn = this.ensembleMembers[0].getWorn();
      for (let member of this.ensembleMembers) {
        if (member.loc !== loc2)
          return false;
        if (member.getWorn() !== worn)
          return false;
      }
      return true;
    };
    res.isAllTogether = function() {
      const worn = this.ensembleMembers[0].getWorn();
      const loc2 = this.ensembleMembers[0].loc;
      for (let member of this.ensembleMembers) {
        if (member.loc !== loc2)
          return false;
        if (member.breakEnsemble && member.breakEnsemble())
          return false;
        if (member.getWorn() !== worn)
          return false;
      }
      return true;
    };
    res.msgDrop = lang.drop_successful;
    res.msgTake = lang.take_successful;
    res.drop = function(options) {
      const dest = w$1[options.char.loc];
      if (dest.testDrop && !dest.testDrop(options))
        return false;
      if (dest.testDropIn && !dest.testDropIn(options))
        return false;
      msg(this.msgDrop, options);
      for (let member of this.ensembleMembers) {
        member.moveToFrom(options, "loc");
      }
      return true;
    };
    res.take = function(options) {
      const char2 = options.char;
      if (this.isAtLoc(char2.name)) {
        msg(lang.already_have, options);
        return false;
      }
      if (!char2.testManipulate(this, "take"))
        return false;
      if (this.testTake && !this.testTake(options))
        return false;
      if (w$1[char2.loc].testTakeOut && !w$1[char2.loc].testTakeOut(options))
        return false;
      msg(this.msgTake, options);
      for (let member of this.ensembleMembers) {
        member.moveToFrom(options, "name");
        if (member.scenery)
          member.scenery = false;
      }
      return true;
    };
    for (let member of ensembleMembers) {
      member.ensembleMaster = res;
    }
    return res;
  };
  const MERCH = function(value, locs) {
    const res = {
      price: value,
      getPrice: function() {
        return this.price;
      },
      msgPurchase: lang.purchase_successful,
      msgSell: lang.sell_successful,
      // The price when the player sells the item
      // By default, half the "list" price
      //
      getSellingPrice: function(char2) {
        if (w$1[char2.loc].buyingValue) {
          return Math.round(this.getPrice() * w$1[char2.loc].buyingValue / 100);
        }
        return Math.round(this.getPrice() / 2);
      },
      // The price when the player buys the item
      // Uses the sellingDiscount, as te shop is selling it!
      getBuyingPrice: function(char2) {
        if (w$1[char2.loc].sellingDiscount) {
          return Math.round(this.getPrice() * (100 - w$1[char2.loc].sellingDiscount) / 100);
        }
        return this.getPrice();
      },
      isLocatedAt: function(loc2, situation) {
        if (this.salesLoc || this.salesLocs) {
          return (situation === world.PURCHASE || situation === world.PARSER) && this.isForSale(loc2);
        } else {
          return this.loc === loc2;
        }
      },
      isForSale: function(loc2) {
        if (!this.salesLoc && !this.salesLocs)
          return false;
        if (this.doNotClone)
          return this.salesLoc === loc2;
        return this.salesLocs.includes(loc2);
      },
      canBeSoldHere: function(loc2) {
        return w$1[loc2].willBuy && w$1[loc2].willBuy(this);
      },
      purchase: function(options) {
        if (this.testPurchase && !this.testPurchase(options))
          return false;
        if (!this.isForSale(options.char.loc)) {
          return failedmsg(this.doNotClone && this.isAtLoc(options.char.name) ? lang.cannot_purchase_again : lang.cannot_purchase_here, options);
        }
        const cost = this.getBuyingPrice(options.char);
        options.money = cost;
        if (options.char.money < cost)
          return failedmsg(lang.cannot_afford, options);
        return this.purchaseScript(options, options.char, cost);
      },
      purchaseScript: function(options, char2, cost) {
        char2.money -= cost;
        msg(this.msgPurchase, options);
        if (this.doNotClone) {
          this.loc = char2.name;
          delete this.salesLoc;
          if (this.afterPurchase)
            this.afterPurchase(options);
        } else {
          const o = cloneObject(this, char2.name);
          o.loc = char2.name;
          delete o.salesLocs;
          if (o.afterPurchase)
            o.afterPurchase(options);
        }
        return world.SUCCESS;
      },
      sell: function(options) {
        if (this.testSell && !this.testSell(options))
          return false;
        if (!this.canBeSoldHere(options.char.loc)) {
          return failedmsg(lang.cannot_sell_here, options);
        }
        const cost = this.getSellingPrice(options.char);
        options.money = cost;
        options.char.money += cost;
        msg(this.msgSell, options);
        if (this.doNotClone) {
          this.salesLoc = options.char.loc;
          delete this.loc;
        } else {
          delete w$1[this.name];
        }
        if (this.afterSell)
          this.afterSell(options);
        return world.SUCCESS;
      }
    };
    if (!Array.isArray(locs)) {
      res.doNotClone = true;
      res.salesLoc = locs;
    } else {
      res.salesLocs = locs;
    }
    return res;
  };
  const COUNTABLE = function(countableLocs) {
    const res = Object.assign({}, TAKEABLE_DICTIONARY);
    res.countable = true;
    res.countableLocs = countableLocs ? countableLocs : {};
    res.multiLoc = true;
    res.defaultToAll = true;
    res.isUltimatelyHeldBy = function(obj) {
      const locs = [];
      for (const key in this.countableLocs) {
        if (this.countableLocs[key])
          locs.push(key);
      }
      return util.multiIsUltimatelyHeldBy(obj, locs);
    };
    res.extractNumber = function() {
      const md = /^(\d+)/.exec(this.cmdMatch);
      if (!md) {
        return false;
      }
      return parseInt(md[1]);
    };
    res.beforeSaveForTemplate = function() {
      const l = [];
      for (let key in this.countableLocs) {
        l.push(key + "=" + this.countableLocs[key]);
      }
      this.customSaveCountableLocs = l.join(",");
      this.beforeSave();
    };
    res.afterLoadForTemplate = function() {
      const l = this.customSaveCountableLocs.split(",");
      this.countableLocs = {};
      for (let el of l) {
        const parts = el.split("=");
        this.countableLocs[parts[0]] = parseInt(parts[1]);
      }
      this.customSaveCountableLocs = false;
      this.afterLoad();
    };
    res.getListAlias = function(loc2) {
      return sentenceCase(this.pluralAlias) + " (" + this.countAtLoc(loc2) + ")";
    };
    res.isLocatedAt = function(loc2, situation) {
      if (!this.countableLocs[loc2]) {
        return false;
      }
      return this.countableLocs[loc2] > 0 || this.countableLocs[loc2] === "infinity";
    };
    res.countAtLoc = function(loc2) {
      if (typeof loc2 !== "string")
        loc2 = loc2.name;
      if (!this.countableLocs[loc2]) {
        return 0;
      }
      return this.countableLocs[loc2];
    };
    res.moveToFrom = function(options, toLoc, fromLoc) {
      util.setToFrom(options, toLoc, fromLoc);
      let count = options.count ? options.count : this.extractNumber();
      if (!count)
        count = options.fromLoc === player().name ? 1 : this.countAtLoc(options.fromLoc);
      if (count === "infinity")
        count = 1;
      this.takeFrom(options.fromLoc, count);
      this.giveTo(options.toLoc, count);
    };
    res.takeFrom = function(loc2, count) {
      if (this.countableLocs[loc2] !== "infinity")
        this.countableLocs[loc2] -= count;
      if (this.countableLocs[loc2] <= 0)
        this.countableLocs[loc2] = false;
      w$1[loc2].afterDropIn(player(), { item: this, count });
    };
    res.giveTo = function(loc2, count) {
      if (!this.countableLocs[loc2]) {
        this.countableLocs[loc2] = 0;
      }
      if (this.countableLocs[loc2] !== "infinity")
        this.countableLocs[loc2] += count;
      w$1[loc2].afterDropIn(player(), { item: this, count });
    };
    res.findSource = function(sourceLoc, tryContainers) {
      if (this.isAtLoc(sourceLoc)) {
        return sourceLoc;
      }
      if (tryContainers) {
        const containers = scopeReachable().filter((el) => el.container);
        for (let container2 of containers) {
          if (container2.closed)
            continue;
          if (this.isAtLoc(container2.name))
            return container2.name;
        }
      }
      return false;
    };
    res.getTakeDropCount = function(options, loc2) {
      options.excess = false;
      let n = this.extractNumber();
      let m = this.countAtLoc(loc2);
      if (!n) {
        if (m === "infinity") {
          n = 1;
        } else if (this.defaultToAll) {
          n = m;
        } else {
          n = 1;
        }
      }
      if (n > m) {
        n = m;
        options.excess = true;
      }
      options.count = n;
    };
    res.take = function(options) {
      const sourceLoc = this.findSource(options.char.loc, true);
      if (!sourceLoc)
        return falsemsg(lang.none_here, options);
      this.getTakeDropCount(options, sourceLoc);
      if (this.testTake && !this.testTake(options))
        return false;
      if (w$1[sourceLoc].testTakeOut && !w$1[sourceLoc].testTakeOut(options))
        return false;
      msg(this.msgTake, options);
      this.takeFrom(sourceLoc, options.count);
      this.giveTo(options.char.name, options.count);
      if (this.scenery)
        this.scenery = false;
      return true;
    };
    res.drop = function(options) {
      if (this.countAtLoc(options.char.name) === 0)
        return falsemsg(lang.none_held, options);
      const dest = w$1[options.char.loc];
      options.destination = dest;
      this.getTakeDropCount(options, options.char.name);
      if (this.testDrop && !this.testDrop(options))
        return false;
      if (dest.testDropIn && !dest.testDropIn(options))
        return false;
      msg(this.msgDrop, options);
      this.takeFrom(options.char.name, options.count);
      this.giveTo(options.char.loc, options.count);
      return true;
    };
    res.afterCreation = function(o) {
      if (!o.regex)
        o.regex = new RegExp("^(\\d+ )?" + o.name + "s?$");
    };
    return res;
  };
  const WEARABLE = function(wear_layer, slots) {
    const res = Object.assign({}, TAKEABLE_DICTIONARY);
    res.wearable = true;
    res.armour = 0;
    res.wear_layer = wear_layer ? wear_layer : false;
    res.slots = slots && wear_layer ? slots : [];
    res.worn = false;
    res.useDefaultsTo = function(char2) {
      return char2 === player() ? "Wear" : "NpcWear";
    };
    res.getSlots = function() {
      return this.slots;
    };
    res.getWorn = function() {
      return this.worn;
    };
    res.getArmour = function() {
      return this.armour;
    };
    res.msgWear = lang.wear_successful;
    res.msgRemove = lang.remove_successful;
    res.afterCreation = function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        if (!o2.isAtLoc(player().name)) {
          verbList.push(lang.verbs.take);
        } else if (o2.getWorn()) {
          if (!o2.getWearRemoveBlocker(player(), false))
            verbList.push(lang.verbs.remove);
        } else {
          verbList.push(lang.verbs.drop);
          if (!o2.getWearRemoveBlocker(player(), true))
            verbList.push(lang.verbs.wear);
        }
      });
      o.nameModifierFunctions.push(function(o2, list2) {
        if (o2.worn && o2.isAtLoc(player().name))
          list2.push(lang.invModifiers.worn);
      });
    };
    res.icon = () => "garment12";
    res.getWearRemoveBlocker = function(char2, toWear) {
      if (!this.wear_layer)
        return false;
      const slots2 = this.getSlots();
      for (let slot of slots2) {
        let outer = char2.getOuterWearable(slot);
        if (outer && outer !== this && (outer.wear_layer >= this.wear_layer || outer.wear_layer === 0)) {
          return outer;
        }
      }
      return false;
    };
    res.testWear = function() {
      return true;
    };
    res.testRemove = function() {
      return true;
    };
    res._canWearRemove = function(toWear, options) {
      if (toWear) {
        if (!this.testWear(options))
          return false;
      } else {
        if (!this.testRemove(options))
          return false;
      }
      const outer = this.getWearRemoveBlocker(options.char, toWear);
      if (outer) {
        options.outer = outer;
        return falsemsg(toWear ? lang.cannot_wear_over : lang.cannot_remove_under, options);
      }
      return true;
    };
    res.wear = function(options) {
      if (!this._canWearRemove(true, options))
        return false;
      if (!options.char.testManipulate(this, "wear"))
        return false;
      msg(this.msgWear, options);
      this.worn = true;
      if (this.afterWear)
        this.afterWear(options);
      return true;
    };
    res.remove = function(options) {
      if (!this._canWearRemove(false, options))
        return false;
      if (!options.char.testManipulate(this, "remove"))
        return false;
      msg(this.msgRemove, options);
      this.worn = false;
      if (this.afterRemove)
        this.afterRemove(options);
      return true;
    };
    return res;
  };
  const OPENABLE_DICTIONARY = {
    msgClose: lang.close_successful,
    msgOpen: lang.open_successful,
    msgLock: lang.lock_successful,
    msgUnlock: lang.unlock_successful,
    msgCloseAndLock: lang.close_and_lock_successful,
    openMsg: function(options) {
      msg(this.msgOpen, options);
    },
    open: function(options) {
      options.container = this;
      if (!this.openable) {
        msg(lang.cannot_open, { item: this });
        return false;
      } else if (!this.closed) {
        msg(lang.already, { item: this });
        return false;
      } else if (this.testOpen && !this.testOpen(options)) {
        return false;
      }
      if (this.locked) {
        if (this.testKeys(options.char)) {
          this.locked = false;
          this.closed = false;
          msg(this.msgUnlock, options);
          this.openMsg(options);
          return true;
        } else {
          msg(lang.locked, options);
          return false;
        }
      }
      this.closed = false;
      this.openMsg(options);
      if (this.afterOpen)
        this.afterOpen(options);
      return true;
    },
    close: function(options) {
      options.container = this;
      if (!this.openable) {
        msg(lang.cannot_close, { item: this });
        return false;
      } else if (this.closed) {
        msg(lang.already, { item: this });
        return false;
      } else if (this.testClose && !this.testClose(options)) {
        return false;
      }
      this.closed = true;
      msg(this.msgClose, options);
      if (this.afterClose)
        this.afterClose(options);
      return true;
    }
  };
  const CONTAINER = function(openable) {
    const res = Object.assign({}, OPENABLE_DICTIONARY);
    res.container = true;
    res.closed = openable;
    res.openable = openable;
    res.contentsType = "container";
    res.getContents = util.getContents;
    res.testForRecursion = util.testForRecursion;
    res.listContents = util.listContents;
    res.transparent = false;
    res.afterCreation = function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        if (o2.openable) {
          verbList.push(o2.closed ? lang.verbs.open : lang.verbs.close);
        }
      });
      o.nameModifierFunctions.push(util.nameModifierFunctionForContainer);
    };
    res.lookinside = function(options) {
      options.container = this;
      if (this.closed && !this.transparent) {
        msg(lang.not_open, options);
        return false;
      }
      options.list = this.listContents(world.LOOK, true);
      msg(lang.look_inside, options);
      return true;
    };
    res.openMsg = function(options) {
      options.list = this.listContents(world.LOOK);
      msg(this.msgOpen + " " + (options.list === lang.list_nothing ? lang.it_is_empty : lang.look_inside_it), options);
    };
    res.icon = function() {
      return this.closed ? "closed12" : "opened12";
    };
    res.canReachThroughThis = function() {
      return !this.closed;
    };
    res.canSeeThroughThis = function() {
      return !this.closed || this.transparent;
    };
    return res;
  };
  const SURFACE = function() {
    const res = {};
    res.container = true;
    res.getContents = util.getContents;
    res.testForRecursion = util.testForRecursion;
    res.listContents = util.listContents;
    res.afterCreation = function(o) {
      o.nameModifierFunctions.push(util.nameModifierFunctionForContainer);
    };
    res.closed = false;
    res.openable = false;
    res.contentsType = "surface";
    res.canReachThroughThis = () => true;
    res.canSeeThroughThis = () => true;
    return res;
  };
  const OPENABLE = function(alreadyOpen) {
    const res = Object.assign({}, OPENABLE_DICTIONARY);
    res.closed = !alreadyOpen;
    res.openable = true;
    res.afterCreation = function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        verbList.push(o2.closed ? lang.verbs.open : lang.verbs.close);
      });
      o.nameModifierFunctions.push(function(o2, list2) {
        if (!o2.closed)
          list2.push(lang.invModifiers.open);
      });
    };
    return res;
  };
  const LOCKED_WITH = function(keyNames) {
    if (typeof keyNames === "string") {
      keyNames = [keyNames];
    }
    if (keyNames === void 0) {
      keyNames = [];
    }
    return {
      keyNames,
      locked: true,
      lockwith: function(options) {
        this.lock(options);
      },
      unlockwith: function(options) {
        this.unlock(options);
      },
      lock: function(options) {
        options.container = this;
        if (this.locked)
          return falsemsg(lang.already, options);
        if (!this.testKeys(options.char, true))
          return falsemsg(lang.no_key, options);
        if (!this.closed) {
          this.closed = true;
          this.locked = true;
          msg(this.msgCloseAndLock, options);
        } else {
          this.locked = true;
          msg(this.msgLock, options);
        }
        if (this.afterLock)
          this.afterLock(options);
        return true;
      },
      unlock: function(options) {
        options.container = this;
        if (!this.locked)
          return falsemsg(lang.already, { item: this });
        if (options.secondItem) {
          if (!this.keyNames.includes(options.secondItem.name))
            return falsemsg(lang.cannot_unlock_with, options);
        } else {
          if (!this.testKeys(options.char, false))
            return falsemsg(lang.no_key, options);
        }
        msg(this.msgUnlock, options);
        this.locked = false;
        if (this.afterUnlock)
          this.afterUnlock(options);
        return true;
      },
      testKeys: function(char2, toLock) {
        for (let s of this.keyNames) {
          if (!w$1[s])
            return errormsg("The key name for this container, `" + s + "`, does not match any key in the game.");
          if (w$1[s].isAtLoc(char2.name))
            return true;
        }
        return false;
      }
    };
  };
  const LOCKED_DOOR = function(key, loc1, loc2, name1, name2) {
    const res = Object.assign({}, OPENABLE(false), LOCKED_WITH(key));
    res.loc1 = loc1;
    res.loc2 = loc2;
    res.name1 = name1;
    res.name2 = name2;
    res.scenery = true;
    res.afterCreation = function(item2) {
      const room1 = w$1[item2.loc1];
      if (!room1)
        return errormsg("Bad location name '" + item2.loc1 + "' for door " + item2.name);
      const exit1 = room1.findExit(item2.loc2);
      if (!exit1)
        return errormsg("No exit to '" + item2.loc2 + "' for door " + item2.name);
      item2.dir1 = exit1.dir;
      if (!room1[item2.dir1])
        return errormsg("Bad exit '" + item2.dir1 + "' in location '" + room1.name + "' for door: " + item2.name + " (possibly because the room is defined after the door?)");
      const room2 = w$1[item2.loc2];
      if (!room2)
        return errormsg("Bad location name '" + item2.loc2 + "' for door " + item2.name);
      const exit2 = room2.findExit(item2.loc1);
      if (!exit2)
        return errormsg("No exit to '" + item2.loc1 + "' for door " + item2.name);
      item2.dir2 = exit2.dir;
      if (!room2[item2.dir2])
        return errormsg("Bad exit '" + item2.dir2 + "' in location '" + room2.name + "' for door: " + item2.name + " (possibly because the room is defined after the door?)");
      room1[item2.dir1].use = util.useWithDoor;
      room1[item2.dir1].door = item2.name;
      room1[item2.dir1].doorName = item2.name1 || "door to " + lang.getName(w$1[item2.loc2], { article: DEFINITE });
      room2[item2.dir2].use = util.useWithDoor;
      room2[item2.dir2].door = item2.name;
      room2[item2.dir2].doorName = item2.name2 || "door to " + lang.getName(w$1[item2.loc1], { article: DEFINITE });
    };
    res.isLocatedAt = function(loc3) {
      return loc3 === this.loc1 || loc3 === this.loc2;
    };
    res.icon = () => "door12";
    return res;
  };
  const KEY = function() {
    const res = Object.assign({}, TAKEABLE_DICTIONARY);
    res.key = true;
    res.icon = () => "key12";
    return res;
  };
  const READABLE = function(mustBeHeld) {
    const res = {};
    res.readable = true;
    res.mustBeHeld = mustBeHeld;
    res.icon = () => "readable12";
    res.afterCreation = function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        if (o2.loc === player().name || !o2.mustBeHeld)
          verbList.push(lang.verbs.read);
      });
    };
    return res;
  };
  const BACKSCENE = function() {
    return {
      scenery: true,
      parserPriority: -15,
      isLocatedAt: function(loc2, situation) {
        if (!w$1[loc2].room)
          return false;
        const locationType = w$1[loc2].locationType || w$1[loc2]._region;
        if (!locationType)
          return false;
        if (w$1[loc2 + "_" + this.name])
          return false;
        return !!regions[locationType][this.name];
      },
      examine_for_backscene: function() {
        if (!loc$1())
          return;
        loc$1().locationType || loc$1()._region;
        const addendum = loc$1()["addendum_examine_" + this.name] ? " " + loc$1()["addendum_examine_" + this.name] : "";
        if (typeof loc$1()["examine_" + this.name] === "function") {
          loc$1()["examine_" + this.name](addendum);
        } else if (typeof loc$1()["examine_" + this.name] === "string") {
          msg(loc$1()["examine_" + this.name] + addendum);
        } else if (loc$1()._region && regions[loc$1()._region][this.name]) {
          msg(regions[loc$1()._region][this.name] + addendum);
        } else if (this.defaultExamine) {
          msg(this.defaultExamine + addendum);
        } else {
          msg(lang.default_scenery);
        }
      },
      afterCreation: function(o) {
        o.defaultExamine = o.examine;
        o.examine = o.examine_for_backscene;
      }
    };
  };
  const FURNITURE = function(options) {
    if (options === void 0)
      return errormsg("No options for FURNITURE template. Look in the stack traces below for a reference to a file you are using to create objects, and see what the line number is.");
    const res = {
      testPostureOn: () => true,
      getoff: function(options2) {
        if (!options2.char.posture) {
          options2.char.msg(lang.already, options2);
          return false;
        }
        if (options2.char.posture) {
          options2.char.msg(lang.stop_posture(options2.char));
          return true;
        }
      }
    };
    res.useDefaultsTo = function(char2) {
      const cmd = this.useCmd ? this.useCmd : this.reclineon ? "ReclineOn" : this.siton ? "SitOn" : "StandOn";
      return char2 === player() ? cmd : "Npc" + cmd;
    };
    res.afterCreation = function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        if (player().posture && player().postureFurniture === o2.name) {
          verbList.push(lang.verbs.getOff);
          return;
        }
        if (player().posture && player().posture !== "standing")
          return;
        if (o2.siton)
          verbList.push(lang.verbs.sitOn);
        if (o2.standon)
          verbList.push(lang.verbs.standOn);
        if (o2.reclineon)
          verbList.push(lang.verbs.reclineOn);
      });
    };
    res.assumePosture = function(options2, posture, name2, adverb) {
      options2.posture = posture;
      const char2 = options2.char;
      if (char2.posture === posture && char2.postureFurniture === this.name) {
        char2.msg(lang.already, { item: char2 });
        return false;
      }
      if (!this.testPostureOn({ char: char2, posture }))
        return false;
      if (char2.posture && char2.postureFurniture !== this.name) {
        char2.msg(lang.stop_posture(char2));
        char2.msg(lang[name2 + "_on_successful"], options2);
      } else if (char2.posture && this[char2.posture + "_to_" + posture] && this.postureChangesImplemented) {
        char2.msg(this[char2.posture + "_to_" + posture], options2);
      } else {
        char2.msg(lang[name2 + "_on_successful"], options2);
      }
      char2.posture = posture;
      char2.postureFurniture = this.name;
      char2.postureAdverb = adverb === void 0 ? "on" : adverb;
      if (this.afterPostureOn)
        this.afterPostureOn(options2);
      return true;
    };
    if (options.sit) {
      res.siton = function(options2) {
        return this.assumePosture(options2, "sitting", "sit");
      };
    }
    if (options.stand) {
      res.standon = function(options2) {
        return this.assumePosture(options2, "standing", "stand");
      };
    }
    if (options.recline) {
      res.reclineon = function(options2) {
        return this.assumePosture(options2, "reclining", "recline");
      };
    }
    if (options.useCmd) {
      res.useCmd = options.useCmd;
    }
    res.icon = () => "furniture12";
    return res;
  };
  const SWITCHABLE = function(alreadyOn, nameModifier) {
    const res = {};
    res.switchedon = alreadyOn;
    res.nameModifier = nameModifier;
    res.msgSwitchOff = lang.switch_off_successful;
    res.msgSwitchOn = lang.switch_on_successful;
    res.afterCreation = function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        if (!o2.mustBeHeldToOperate || o2.isAtLoc(player())) {
          verbList.push(o2.switchedon ? lang.verbs.switchoff : lang.verbs.switchon);
        }
      });
      o.nameModifierFunctions.push(function(o2, list2) {
        if (o2.nameModifier && o2.switchedon)
          list2.push(o2.nameModifier);
      });
    };
    res.switchon = function(options) {
      if (this.switchedon) {
        options.char.msg(lang.already, { item: this });
        return false;
      }
      if (!this.testSwitchOn(options))
        return false;
      if (!options.char.getAgreement("SwitchOn", { item: this, switchOn: true }))
        return false;
      if (!this.suppressMsgs)
        options.char.msg(this.msgSwitchOn, options);
      this.doSwitchon(options);
      return true;
    };
    res.doSwitchon = function(options) {
      let lighting = game.dark;
      this.switchedon = true;
      world.update();
      if (lighting !== game.dark) {
        loc$1().description();
      }
      if (this.afterSwitchOn)
        this.afterSwitchOn(options);
    };
    res.testSwitchOn = () => true;
    res.testSwitchOff = () => true;
    res.switchoff = function(options) {
      if (!this.switchedon) {
        options.char.msg(lang.already, { item: this });
        return false;
      }
      if (!this.testSwitchOff(options))
        return false;
      if (!options.char.getAgreement("SwitchOn", { item: this }))
        return false;
      if (!this.suppressMsgs)
        options.char.msg(this.msgSwitchOff, options);
      this.doSwitchoff(options);
      return true;
    };
    res.doSwitchoff = function(options) {
      let lighting = game.dark;
      this.switchedon = false;
      world.update();
      if (lighting !== game.dark) {
        loc$1().description();
      }
      if (this.afterSwitchOff)
        this.afterSwitchOff(options);
    };
    res.icon = function() {
      return this.switchedon ? "turnedon12" : "turnedoff12";
    };
    return res;
  };
  const COMPONENT = function(nameOfWhole) {
    const res = {
      scenery: true,
      component: true,
      loc: nameOfWhole,
      takeable: true,
      // Set this as it has its own take attribute
      isLocatedAt: function(loc2, situation) {
        if (situation !== world.PARSER && situation !== world.ALL)
          return false;
        let cont = w$1[this.loc];
        return cont.isAtLoc(loc2);
      },
      take: function(options) {
        options.whole = w$1[this.loc];
        msg(lang.cannot_take_component, options);
        return false;
      }
    };
    if (!w$1[nameOfWhole])
      debugmsg("Whole is not define: " + nameOfWhole);
    w$1[nameOfWhole].componentHolder = true;
    return res;
  };
  const EDIBLE = function(isLiquid) {
    const res = Object.assign({}, TAKEABLE_DICTIONARY);
    res.isLiquid = isLiquid;
    res.msgIngest = isLiquid ? lang.drink_successful : lang.eat_successful;
    res.eat = function(options) {
      if (this.isLiquid) {
        msg(lang.cannot_eat, options);
        return false;
      }
      msg(this.msgIngest, options);
      this.loc = null;
      if (this.afterIngest)
        this.afterIngest(options);
      return true;
    };
    res.drink = function(options) {
      if (!this.isLiquid) {
        msg(lang.cannot_drink, options);
        return false;
      }
      msg(this.msgIngest, options);
      this.loc = null;
      if (this.afterIngest)
        this.afterIngest(options);
      return true;
    };
    res.ingest = function(options) {
      if (this.isLiquid) {
        return this.drink(options);
      } else {
        return this.eat(options);
      }
    };
    res.icon = () => "edible12";
    res.afterCreation = function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        verbList.push(o2.isAtLoc(player().name) ? lang.verbs.drop : lang.verbs.take);
        if (o2.isAtLoc(player()))
          verbList.push(o2.isLiquid ? lang.verbs.drink : lang.verbs.eat);
      });
    };
    return res;
  };
  const VESSEL = function() {
    const res = {};
    res.vessel = true;
    res.afterCreation = function(o) {
      if (o.volumeContained) {
        list.push("full of " + o.containedFluidName);
      }
    };
    res.findSource = function(options) {
      return util.findSource(options);
    };
    res.fill = function(options) {
      if (!this.findSource(options))
        return falsemsg(lang.no_generic_fluid_here, { item: this });
      return this.doFill(options);
    };
    res.doFill = function(options) {
      options.item = this;
      if (this.testFill && !this.testFill(options))
        return false;
      if (this.containedFluidName)
        return falsemsg(lang.already_full, options);
      this.containedFluidName = options.fluid;
      if (options.source.vessel)
        delete options.source.containedFluidName;
      msg(lang.fill_successful, options);
      if (this.afterFill)
        this.afterFill(options);
      return true;
    };
    res.empty = function(options) {
      delete options.item;
      return this.doEmpty(options);
    };
    res.doEmpty = function(options) {
      options.source = this;
      options.fluid = this.containedFluidName;
      if (!this.containedFluidName)
        return falsemsg(lang.already_empty, options);
      if (this.testEmpty && !this.testEmpty(options))
        return false;
      if (!options.item) {
        msg(lang.empty_successful, options);
        delete this.containedFluidName;
      } else if (options.item === options.source) {
        return falsemsg(lang.pour_into_self, options);
      } else if (options.item.vessel) {
        if (options.item.containedFluidName)
          return falsemsg(lang.already_full, { char: options.char, item: options.sink, fluid: options.item.containedFluidName });
        msg(lang.empty_into_successful, options);
        options.item.containedFluidName = this.containedFluidName;
        delete this.containedFluidName;
      } else if (options.item.sink) {
        if (!options.item.sink(this.containedFluidName, options.char, this))
          return false;
      } else {
        msg(lang.empty_onto_successful, options);
        delete this.containedFluidName;
      }
      if (this.afterEmpty)
        this.afterEmpty(options.char, { fluid: this.containedFluidName, sink: options.item });
      delete this.containedFluidName;
      return true;
    };
    res.handleInOutContainer = function(options, items) {
      let success = false;
      for (const obj of items) {
        if (!options.char.testManipulate(obj, options.verb))
          return world.FAILED;
        options.count = obj.countable ? obj.extractNumber() : void 0;
        options.item = obj;
        if (options.count)
          options[obj.name + "_count"] = options.count;
        if (this.container) {
          success = success || func(char, container, obj, options);
        } else {
          msg(lang.not_container_not_vessel, options);
        }
      }
      if (success)
        options.char.pause();
      return success ? world.SUCCESS : world.FAILED;
    };
    res.afterCreation = function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        if (!o2.isAtLoc(player().name))
          return;
        verbList.push(o2.containedFluidName ? lang.verbs.empty : lang.verbs.fill);
      });
    };
    return res;
  };
  const CONSTRUCTION = function(componentNames) {
    const res = {};
    res.construction = true;
    res.componentNames = componentNames ? componentNames : [];
    res.destroyComponentsOnBuild = true;
    res.msgConstruction = lang.construction_done;
    res.testComponents = function(components, options) {
      for (const el of components) {
        if (!res.componentNames.includes(el.name)) {
          options.wrong = el;
          return falsemsg(lang.component_wrong, options);
        }
      }
      return true;
    };
    res.buildPrecheck = function(options) {
      if (this.loc)
        return falsemsg(lang.construction_already, options);
      for (const el of options.components) {
        if (el.loc !== player().name) {
          options.missing = el;
          return falsemsg(lang.component_missing, options);
        }
      }
      return true;
    };
    res.build = function(options) {
      const components = this.componentNames.map((el) => w$1[el]);
      options.components = components;
      if (!this.buildPrecheck(options))
        return false;
      if (this.testConstruction && !this.testConstruction(options))
        return false;
      if (this.destroyComponentsOnBuild) {
        for (const el of components)
          delete el.loc;
      }
      this.loc = this.buildAtLocation ? player().loc : player().name;
      options.list = formatList(components, { article: DEFINITE, lastSep: "and" });
      msg(this.msgConstruction, options);
      if (this.afterConstruction)
        this.afterConstruction(options);
      return true;
    };
    return res;
  };
  const ROPE = function(length, tetheredTo) {
    const res = Object.assign({
      rope: true,
      ropeLength: length,
      tethered: tetheredTo !== void 0,
      tiedTo1: tetheredTo,
      locs: tetheredTo ? [w$1[w$1[tetheredTo].loc]] : [],
      attachVerb: lang.rope_attach_verb,
      attachedVerb: lang.rope_attached_verb,
      detachVerb: lang.rope_detach_verb,
      msgDetach: lang.rope_detach_success,
      msgAttach: lang.rope_attach_success,
      msgWind: lang.rope_wind,
      msgUnwind: lang.rope_unwind,
      isLocatedAt: function(loc2, situation) {
        if (this.loc) {
          this.locs = [this.loc];
          this.loc = false;
        }
        if (typeof loc2 !== "string")
          loc2 = loc2.name;
        if (situation === world.SIDE_PANE && this.locs.includes(player().name) && loc2 !== player().name)
          return false;
        return this.locs.includes(loc2);
      },
      isUltimatelyHeldBy: function(obj) {
        return util.multiIsUltimatelyHeldBy(obj, this.locs);
      },
      isAttachedTo: function(item2) {
        return this.tiedTo1 === item2.name || this.tiedTo2 === item2.name;
      },
      getAttached: function() {
        let res2 = this.tiedTo1 ? [this.tiedTo1] : [];
        if (this.tiedTo2)
          res2.push(this.tiedTo2);
        return res2;
      },
      examineAddendum: function() {
        const obj1 = this.tiedTo1 && w$1[this.tiedTo1].isHere() ? w$1[this.tiedTo1] : false;
        const obj2 = this.tiedTo2 && w$1[this.tiedTo2].isHere() ? w$1[this.tiedTo2] : false;
        if (this.locs.length === 1) {
          if (obj1 && obj2)
            return processText(lang.examineAddBothEnds, { item: this, obj1, obj2 });
          if (obj1)
            return processText(lang.rope_examine_attached_one_end, { item: this, obj1 });
          if (obj2)
            return processText(lang.rope_examine_attached_one_end, { item: this, obj1: obj2 });
          return "";
        }
        const end1 = w$1[this.locs[0]];
        const holder1 = (end1.npc || end1.player) && end1.isHere() ? end1 : false;
        const end2 = w$1[this.locs[this.locs.length - 1]];
        const holder2 = (end2.npc || end2.player) && end2.isHere() ? end2 : false;
        const index = this.locs.findIndex((el) => el === player().loc);
        const loc1 = index > 0 && w$1[this.locs[index - 1]].room ? w$1[this.locs[index - 1]] : false;
        const loc2 = index < this.locs.length - 1 && w$1[this.locs[index + 1]].room ? w$1[this.locs[index + 1]] : false;
        let s = "";
        let flag = false;
        if (obj1 || holder1 || loc1) {
          s += " " + lang.rope_one_end + " ";
          flag = true;
        }
        if (obj1) {
          s += lang.rope_examine_end_attached.replace("obj", "obj1");
        } else if (holder1) {
          s += lang.rope_examine_end_held.replace("holder", "holder1");
        } else if (loc1) {
          s += lang.rope_examine_end_headed.replace("loc", "loc1");
        }
        if (obj2 || holder2 || loc2) {
          s += " " + (flag ? lang.rope_other_end : lang.rope_one_end) + " ";
        }
        if (obj2) {
          s += lang.rope_examine_end_attached.replace("obj", "obj2");
        } else if (holder2) {
          s += lang.rope_examine_end_held.replace("holder", "holder2");
        } else if (loc2) {
          s += lang.rope_examine_end_headed.replace("loc", "loc2");
        }
        return processText(s, { item: this, obj1, obj2, holder1, holder2, loc1, loc2 });
      },
      canAttachTo: function(item2) {
        return item2.attachable;
      },
      handleTieTo: function(char2, obj) {
        if (obj === void 0)
          obj = this.findAttachable(this);
        const options = { char: char2, item: this, obj };
        if (obj === void 0)
          return falsemsg(lang.rope_no_attachable_here, options);
        if (!obj.attachable)
          return failedmsg(lang.rope_not_attachable_to, options);
        if (this.tiedTo1 === obj.name)
          return failedmsg(lang.already, { item: this });
        if (this.tiedTo2 === obj.name)
          return failedmsg(lang.already, { item: this });
        if (this.tiedTo1 && this.tiedTo)
          return failedmsg(lang.rope_tied_both_ends_already, { item: this, obj1: w$1[this.tiedTo1], obj2: w$1[this.tiedTo2] });
        if (obj.testAttach && !obj.testAttach(options))
          return world.FAILED;
        this.attachTo(char2, obj);
        if (!this.suppessMsgs)
          msg(this.msgAttach, options);
        return world.SUCCESS;
      },
      handleUntieFrom: function(char2, obj) {
        const tpParams = { char: char2, item: this, obj };
        if (obj === void 0) {
          if (!this.tiedTo1 && !this.tiedTo2)
            return failedmsg(lang.rope_not_attached, tpParams);
          if (this.tiedTo1 && !this.tiedTo2) {
            obj = w$1[this.tiedTo1];
          } else if (!this.tiedTo1 && this.tiedTo2) {
            obj = w$1[this.tiedTo2];
          } else if (w$1[this.tiedTo1].isHere() && !w$1[this.tiedTo2].isHere()) {
            obj = w$1[this.tiedTo1];
          } else if (!w$1[this.tiedTo1].isHere() && w$1[this.tiedTo2].isHere()) {
            obj = w$1[this.tiedTo2];
          } else {
            return failedmsg(lang.rope_detach_end_ambig, tpParams);
          }
          tpParams.obj = obj;
        } else {
          if (this.tiedTo1 !== obj.name && this.tiedTo2 !== obj.name) {
            return failedmsg(lang.rope_not_attached_to, tpParams);
          }
        }
        if (obj === this.tiedTo1 && this.tethered)
          return failedmsg(lang.rope_tethered, tpParams);
        this.detachFrom(char2, obj);
        if (!this.suppessMsgs)
          msg(this.msgDetach, tpParams);
        return world.SUCCESS;
      },
      useWith: function(char2, item2) {
        return this.handleTieTo(char2, item2) === world.SUCCESS;
      },
      attachTo: function(char2, item2) {
        const loc2 = item2.loc;
        if (!this.tiedTo1) {
          if (this.locs.length > 1)
            this.locs.shift();
          if (this.locs[0] !== loc2)
            this.locs.unshift(loc2);
          this.tiedTo1 = item2.name;
        } else {
          if (this.locs.length > 1)
            this.locs.pop();
          if (this.locs[this.locs.length - 1] !== loc2)
            this.locs.push(loc2);
          this.tiedTo2 = item2.name;
        }
        if (this.afterAttach)
          this.afterAttach(char2, { item: item2 });
      },
      detachFrom: function(char2, item2) {
        if (this.tiedTo1 === item2.name) {
          if (this.locs.length === 2 && this.locs.includes(char2.name))
            this.locs.shift();
          if (this.locs[0] !== char2.name) {
            this.locs.unshift(char2.name);
          }
          this.tiedTo1 = false;
        } else {
          if (this.locs.length === 2 && this.locs.includes(char2.name))
            this.locs.pop();
          if (this.locs[this.locs.length - 1] !== char2.name)
            this.locs.push(char2.name);
          this.tiedTo2 = false;
        }
        if (this.afterDetach)
          this.afterDetach(char2, { item: item2 });
      },
      findAttachable: function() {
        const items = scopeReachable();
        for (let obj of items) {
          if (obj.attachable)
            return obj;
        }
        return void 0;
      }
    }, TAKEABLE_DICTIONARY);
    res.moveToFrom = function() {
      errormsg('You cannot use "moveToFrom" with a ROPE object, due to the complicated nature of these things. You should either prevent the user trying to do this, or look to implement some custom code as the ROPE template does for DROP and TAKE. Sorry I cannot be any more help than that!');
    };
    res.drop = function(options) {
      const char2 = options.char;
      if (!this.isAtLoc(char2.name))
        return falsemsg(lang.not_carrying, options);
      let end;
      if (this.locs.length === 1) {
        this.locs = [char2.loc];
        end = 0;
      } else if (this.locs[0] === char2.name) {
        this.locs.shift();
        end = 1;
      } else if (this.locs[this.locs.length - 1] === char2.name) {
        this.locs.pop();
        end = 2;
      }
      options.end = end;
      options.toLoc = char2.loc;
      options.fromLoc = char2.name;
      msg(this.msgDrop, options);
      if (w$1[char2.loc].afterDropIn)
        w$1[char2.loc].afterDropIn(options);
      if (w$1[char2.name].afterTakeFrom)
        w$1[char2.name].afterTakeFrom(options);
      if (this.afterMove !== void 0)
        this.afterMove(options);
      return true;
    };
    res.take = function(options) {
      const char2 = options.char;
      if (this.isAtLoc(char2.name) && !this.isAtLoc(options.char.loc))
        return falsemsg(lang.already_have, options);
      if (!char2.testManipulate(this, "take"))
        return false;
      if (this.tiedTo1 && this.tiedTo2)
        return falsemsg(lang.rope_tied_both_end, options);
      let end;
      if (this.locs.length === 1 && !this.tiedTo1 && !this.tiedTo2) {
        this.locs = [char2.name];
        end = 0;
      } else if (this.locs[0] === char2.loc && !this.tiedTo1) {
        this.locs.unshift(char2.name);
        end = 1;
      } else if (this.locs[this.locs.length - 1] === char2.loc && !this.tiedTo2) {
        this.locs.push(char2.name);
        end = 2;
      } else if (this.locs[0] === char2.loc || this.locs[this.locs.length - 1] === char2.loc) {
        return falsemsg(lang.rope_tied_one_end, options);
      } else {
        return falsemsg(lang.rope_no_end, options);
      }
      options.end = end;
      options.toLoc = char2.name;
      options.fromLoc = char2.loc;
      msg(this.msgTake, options);
      if (w$1[char2.loc].afterTakeOut)
        w$1[char2.loc].afterTakeOut(options);
      if (w$1[char2.name].afterDropIn)
        w$1[char2.name].afterDropIn(options);
      if (this.afterMove !== void 0)
        this.afterMove(options);
      if (this.afterTake !== void 0)
        this.afterTake(options);
      if (this.scenery)
        this.scenery = false;
      return true;
    };
    res.testCarry = function(options) {
      if (this.ropeLength === void 0)
        return true;
      if (this.locs.length < 3)
        return true;
      if (!this.locs.includes(options.char.name))
        return true;
      if (this.locs[0] === options.char.name) {
        if (this.locs[2] === options.exit.name)
          return true;
      } else {
        if (this.locs[this.locs.length - 3] === options.exit.name)
          return true;
      }
      if (this.locs.length <= this.ropeLength)
        return true;
      msg(lang.rope_cannot_move, options);
      return false;
    };
    res.afterCarry = function(options) {
      const char2 = options.char;
      if (this.locs.length === 1)
        return;
      if (!this.locs.includes(char2.name))
        return;
      if (this.locs[0] === char2.name) {
        this.locs.shift();
        if (this.locs[1] === char2.loc) {
          this.locs.shift();
          char2.msg(this.msgWind, { char: char2, item: this });
        } else {
          this.locs.unshift(char2.loc);
          char2.msg(this.msgUnwind, { char: char2, item: this });
        }
        this.locs.unshift(char2.name);
      } else {
        this.locs.pop();
        if (this.locs[this.locs.length - 2] === char2.loc) {
          this.locs.pop();
          char2.msg(this.msgWind, { char: char2, item: this });
        } else {
          this.locs.push(char2.loc);
          char2.msg(this.msgUnwind, { char: char2, item: this });
        }
        this.locs.push(char2.name);
      }
    };
    return res;
  };
  const BUTTON_DICTIONARY = {
    button: true,
    msgPress: lang.press_button_successful,
    afterCreation: function(o) {
      o.verbFunctions.push(function(o2, verbList) {
        verbList.push(lang.verbs.push);
      });
    }
  };
  const BUTTON = function() {
    const res = Object.assign({}, BUTTON_DICTIONARY);
    res.push = function(options) {
      msg(this.msgPress, options);
      if (this.afterPress)
        this.afterPress(options);
    };
    return res;
  };
  const TRANSIT_BUTTON = function(nameOfTransit, transitDest) {
    const res = Object.assign({}, BUTTON_DICTIONARY);
    res.loc = nameOfTransit;
    res.transitDest = transitDest;
    res.transitButton = true;
    res.transitAlreadyHere = lang.transit_already_here;
    res.transitGoToDest = lang.transit_go_to_dest;
    res.push = function(options) {
      const transit = w$1[this.loc];
      const exit = transit[transit.transitDoorDir];
      if (this.testTransitButton && !this.testTransitButton(options.char, { multiple: options.multiple, transit }))
        return false;
      if (transit.testTransit && !transit.testTransit(options.char, { multiple: options.multiple, button: this }))
        return false;
      if (this.locked)
        return falsemsg(this.transitLocked);
      if (exit.name === this.transitDest)
        return falsemsg(this.transitAlreadyHere);
      if (transit.transitAutoMove) {
        player().moveChar(transit[transit.transitDoorDir]);
      } else {
        printOrRun(player(), this, "transitGoToDest");
        transit.transitUpdate(this, true);
      }
      return true;
    };
    return res;
  };
  const ROOM_SET = function(setName) {
    return { roomSet: setName };
  };
  const EXIT_FAKER = function() {
    const res = {};
    res.exit_attributes = ["msg", "npcLeaveMsg", "npcEnterMsg"];
    res.getExit = function(dir) {
      if (this["exit_" + dir] === void 0)
        return void 0;
      const params = { origin: this, dir };
      if (this["exit_func_" + dir])
        params.simpleUse = this[this["exit_func_" + dir]];
      for (const att of this.exit_attributes) {
        if (this["exit_" + att + "_" + dir])
          params[att] = this["exit_" + att + "_" + dir];
      }
      return new Exit(this["exit_" + dir], params);
    };
    res.hasExit = function(dir, options) {
      if (options === void 0)
        options = {};
      if (!this["exit_" + dir])
        return false;
      if (options.excludeLocked && this.isExitLocked(dir))
        return false;
      if (options.excludeScenery && this["exit_scenery_" + dir])
        return false;
      if (game.dark && !this["exit_illuminated_" + dir])
        return false;
      return !this.isExitHidden(dir);
    };
    return res;
  };
  const TRANSIT = function(exitDir) {
    return {
      saveExitDests: true,
      transitDoorDir: exitDir,
      mapMoveableLoc: true,
      mapRedrawEveryTurn: true,
      beforeEnter: function() {
        const transitButton = this.findTransitButton(player().previousLoc);
        if (transitButton)
          this.transitUpdate(transitButton);
      },
      getTransitButtons: function(includeHidden, includeLocked) {
        return this.getContents(world.LOOK).filter(function(el) {
          if (!el.transitButton)
            return false;
          if (!includeHidden && el.hidden)
            return false;
          return !(!includeLocked && el.locked);
        });
      },
      findTransitButton: function(dest) {
        for (let key in w$1) {
          if (w$1[key].loc === this.name && w$1[key].transitDest === dest)
            return w$1[key];
        }
        return null;
      },
      setTransitDest: function(transitButton) {
        if (typeof transitButton === "string") {
          transitButton = this.findTransitButton(transitButton);
        }
        if (!transitButton)
          return errormsg("Trying to set a transit to an unfathomable destination.");
        this[this.transitDoorDir].name = transitButton.transitDest;
        this.currentButtonName = transitButton.name;
        this.transitCurrentLocation = transitButton.transitDest;
      },
      getTransitDestLocation: function() {
        return w$1[this[this.transitDoorDir].name];
      },
      getTransitDestButton: function() {
        return w$1[this.currentButtonName];
      },
      transitUpdate: function(transitButton, callEvent) {
        if (!this[this.transitDoorDir])
          return errormsg('The transit "' + this.name + '" is set to use "' + this.transitDoorDir + '" as the exit, but has no such exit.');
        const previousDest = this[this.transitDoorDir].name;
        this.setTransitDest(transitButton);
        if (typeof map !== "undefined" && map.transitUpdate)
          map.transitUpdate(this, transitButton, callEvent);
        if (callEvent && this.afterTransitMove)
          this.afterTransitMove(transitButton.transitDest, previousDest);
      },
      // The exit is not saved, so after a load, need to update the exit
      afterLoadForTemplate: function() {
        if (this.currentButtonName)
          this.setTransitDest(w$1[this.currentButtonName]);
        if (this.afterLoad)
          this.afterLoad();
      },
      isTransitHere: function(char2 = player()) {
        log(this[this.transitDoorDir].name);
        log(char2.loc);
        return this[this.transitDoorDir].name === char2.loc;
      },
      transitOfferMenu: function() {
        if (this.testTransit && !this.testTransit(player())) {
          if (this.transitAutoMove)
            player().moveChar(this[this.transitDoorDir]);
          return false;
        }
        const buttons = this.getTransitButtons(true, false);
        this.transitDoorDir;
        showMenu(this.transitMenuPrompt, buttons.map((el) => el.transitDestAlias), function(result2) {
          for (let button of buttons) {
            if (buttons[i].transitDestAlias === result2) {
              buttons[i].push(false, player());
            }
          }
        });
      }
    };
  };
  const CHARACTER = function() {
    return {
      // The following are used also both player and NPCs, so we can use the same functions for both
      canReachThroughThis: () => true,
      canSeeThroughThis: () => true,
      getContents: util.getContents,
      pause: NULL_FUNC,
      testManipulate: () => true,
      testMove: () => true,
      testPosture: () => true,
      testTakeDrop: () => true,
      mentionedTopics: [],
      testTalkFlag: true,
      testTalk: function() {
        return this.testTalkFlag;
      },
      afterCarryList: [],
      followers: [],
      money: 0,
      getAgreement: function(cmdType, options) {
        if (this["getAgreement" + cmdType])
          return this["getAgreement" + cmdType](options);
        if (this.getAgreementDefault)
          return this.getAgreementDefault();
        return true;
      },
      getHolding: function() {
        return this.getContents(world.LOOK).filter(function(el) {
          return !el.getWorn();
        });
      },
      getWearing: function() {
        return this.getContents(world.LOOK).filter(function(el) {
          return el.getWorn() && !el.ensemble;
        });
      },
      getCarrying: function() {
        const res = [];
        for (const key in w$1) {
          if (w$1[key].isUltimatelyHeldBy && w$1[key].isUltimatelyHeldBy(this))
            res.push(w$1[key]);
        }
        return res;
      },
      getStatusDesc: function() {
        if (!this.posture)
          return false;
        return this.posture + " " + this.postureAdverb + " " + lang.getName(w$1[this.postureFurniture], { article: DEFINITE });
      },
      handleGiveTo: function(options) {
        if (!options.item.isAtLoc(options.char.name))
          return falsemsg(lang.not_carrying, options);
        if (!options.char.getAgreement("Give", options))
          return false;
        if (!options.char.testManipulate(options.item, "give"))
          return false;
        options.extraTest = function(options2, response) {
          if (!response.item)
            return true;
          const item2 = typeof response.item === "string" ? w$1[response.item] : response.item;
          return item2 === options2.item;
        };
        return respond(options, this.receiveItems);
      },
      getOuterWearable: function(slot) {
        const clothing = this.getWearing().filter(function(el) {
          if (typeof el.getSlots !== "function") {
            console.log("Item with worn set to true, but no getSlots function");
            console.log(el);
          }
          return el.getSlots().includes(slot);
        });
        if (clothing.length === 0) {
          return false;
        }
        let outer = clothing[0];
        for (let garment of clothing) {
          if (garment.wear_layer > outer.wear_layer) {
            outer = garment;
          }
        }
        return outer;
      },
      // Also used by NPCs, so has to allow for that
      msg: function(s, params) {
        msg(s, params);
      },
      afterCreation: function(o) {
        o.nameModifierFunctions.push(function(o2, l) {
          const state = o2.getStatusDesc();
          const held = o2.getHolding();
          const worn = o2.getWearingVisible();
          const list2 = [];
          if (state) {
            list2.push(state);
          }
          if (held.length > 0) {
            list2.push(lang.invHoldingPrefix + " " + formatList(held, {
              article: INDEFINITE,
              lastSep: lang.list_and,
              modified: false,
              nothing: lang.list_nothing,
              loc: o2.name,
              npc: true
            }));
          }
          if (worn.length > 0) {
            list2.push(lang.invWearingPrefix + " " + formatList(worn, {
              article: INDEFINITE,
              lastSep: lang.list_and,
              modified: false,
              nothing: lang.list_nothing,
              loc: o2.name,
              npc: true
            }));
          }
          if (list2.length > 0)
            l.push(list2.join("; "));
        });
        o.verbFunctions.push(function(o2, verbList) {
          verbList.shift();
          verbList.push(lang.verbs.lookat);
          if (!settings.noTalkTo)
            verbList.push(lang.verbs.talkto);
        });
      },
      // Use this to move the character. Describing it should be done elsewhere
      moveChar: function(exit) {
        if (!(exit instanceof Exit))
          return errormsg("Using moveChar for " + this.name + " but no exit sent.");
        const room = util.getObj(exit.name);
        this.previousLoc = this.loc;
        if (this.player) {
          if (settings.clearScreenOnRoomEnter)
            clearScreen();
          loc$1().afterExit(exit);
          this.loc = room.name;
          world.update();
          world.enterRoom(exit);
        } else {
          this.loc = room.name;
          this.handleMovingFollowers(exit);
        }
        if (this.afterMove)
          this.afterMove(exit);
        for (const el of this.getCarrying()) {
          if (el.afterCarry)
            el.afterCarry({ char: this, item: el, exit });
        }
      },
      // Use when the NPC changes rooms; will give a message if the player can observe it
      movingMsg: function(exit) {
        if (this.player) {
          if (exit.msg) {
            printOrRun(this, exit, "msg");
          } else if (lang.go_successful) {
            msg(lang.go_successful, { char: this, dir: exit.dir });
          }
        } else {
          if (exit.msgNPC) {
            exit.msgNPC(this);
          } else {
            lang.npc_leaving_msg(this, exit);
            lang.npc_entering_msg(this, exit);
          }
        }
      },
      handleMovingFollowers: function(exit) {
        for (let s of this.followers) {
          const follower = w$1[s];
          if (follower.loc === this.loc)
            continue;
          if (!follower.testFollowTo || follower.testFollowTo(w$1[exit.name])) {
            if (this.player)
              follower.movingMsg(exit, true);
            follower.moveChar(exit);
          }
        }
      }
    };
  };
  const PLAYER = function() {
    const res = CHARACTER();
    res.pronouns = lang.pronouns.secondperson;
    res.player = true;
    res.receiveItems = [
      {
        test: function() {
          return true;
        },
        f: function(options) {
          msg(lang.done_msg, options);
          util.giveItem(options);
          return true;
        }
      }
    ];
    return res;
  };
  const w$1 = {};
  function createItem() {
    const args = Array.prototype.slice.call(arguments);
    const o = createItemOrRoom(args, DEFAULT_ITEM, settings.itemCreateFunc);
    if (o.convTopics) {
      o.convTopics.forEach(function(value, i2) {
        value.loc = o.name;
        createItem(value.name ? value.name : o.name + "_convTopic_" + i2, TOPIC(), value);
      });
      delete o.convTopics;
    }
    if (o.player && !game.player) {
      setPlayer(o);
    }
    return o;
  }
  function createRoom() {
    const args = Array.prototype.slice.call(arguments);
    const o = createItemOrRoom(args, DEFAULT_ROOM, settings.roomCreateFunc);
    o._region = region;
    if (o.scenery) {
      for (const x2 of o.scenery) {
        const el = typeof x2 === "string" ? { alias: x2 } : x2;
        const alias = Array.isArray(el.alias) ? el.alias.shift() : el.alias;
        const aliases = Array.isArray(el.alias) ? el.alias : [];
        if (!alias)
          throw "ERROR: Scenery item is missing an alias in room: " + o.name;
        const obj = createItem(o.name + "_scenery_" + alias.replace(/\W/g, ""), {
          loc: o.name,
          alias,
          synonyms: aliases,
          scenery: true,
          examine: el.examine ? el.examine : lang.default_description
        });
        delete el.alias;
        delete el.examine;
        for (const key in el)
          obj[key] = el[key];
      }
      delete o.scenery;
    }
    return o;
  }
  function createItemOrRoom(args, defaults, createFunc) {
    const name2 = args.shift();
    args.unshift(defaults);
    const o = createObject(name2, args);
    if (createFunc)
      createFunc(o);
    return o;
  }
  function cloneObject(item2, loc2, newName) {
    if (item2 === void 0) {
      return errormsg("Item is not defined.");
    }
    if (typeof item2 === "string") {
      const o = w$1[item2];
      if (o === void 0) {
        return errormsg("No item called '" + item2 + "' found in cloneObject.");
      }
      item2 = o;
    }
    if (!newName)
      newName = item2.name;
    const clone = {};
    for (let key in item2)
      clone[key] = item2[key];
    clone.name = util.findUniqueName(newName);
    if (!clone.clonePrototype) {
      clone.clonePrototype = item2;
    }
    if (loc2 !== void 0) {
      clone.loc = loc2;
    }
    clone.getSaveStringPreamble = function(item3) {
      return "Clone:" + this.clonePrototype.name + "=";
    };
    w$1[clone.name] = clone;
    return clone;
  }
  function copyObject(item2, loc2, newName) {
    if (world.isCreated) {
      return errormsg("Attempting to copy item after the game has started");
    }
    if (item2 === void 0) {
      return errormsg("Item is not defined.");
    }
    if (typeof item2 === "string") {
      const o = w$1[item2];
      if (o === void 0) {
        return errormsg("No item called '" + item2 + "' found in copyObject.");
      }
      item2 = o;
    }
    if (!newName)
      newName = item2.name;
    const copy = {
      ...item2,
      verbFunctions: [world.defaultVerbFunction],
      initialiserFunctions: [...item2.initialiserFunctions]
    };
    copy.name = util.findUniqueName(newName);
    if (loc2 !== void 0) {
      copy.loc = loc2;
    }
    w$1[copy.name] = copy;
    return copy;
  }
  function createObject(name2, listOfHashes) {
    if (world.isCreated && !settings.saveDisabled)
      return errormsg("Attempting to use createObject with `" + name2 + "` after set up. To ensure games save properly you should use cloneObject to create ites during play.");
    if (/\W/.test(name2))
      return errormsg("Attempting to use the prohibited name `" + name2 + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.");
    if (w$1[name2])
      return errormsg("Attempting to use the name `" + name2 + "` when there is already an item with that name in the world.");
    if (typeof listOfHashes.unshift !== "function")
      return errormsg("The list of hashes for `" + name2 + "` is not what I was expecting. Maybe you meant to use createItem or createRoom?");
    listOfHashes.unshift(DEFAULT_OBJECT);
    const item2 = { name: name2 };
    for (let hash2 of listOfHashes) {
      for (let key in hash2) {
        item2[key] = hash2[key];
      }
    }
    item2.setAlias(item2.alias ? item2.alias : item2.name.replace(/_/g, " "), item2);
    item2.verbFunctions = [world.defaultVerbFunction];
    item2.nameModifierFunctions = [];
    item2.initialiserFunctions = [];
    for (let hash2 of listOfHashes) {
      if (hash2.afterCreation)
        item2.initialiserFunctions.push(hash2.afterCreation);
    }
    w$1[name2] = item2;
    return item2;
  }
  let region;
  const world = {
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
    isCreated: false,
    //------------------------------------------------------------
    // Initialisation
    init: function() {
      settings.performanceLog("Start world.init");
      player();
      for (let key in w$1) {
        world.initItem(w$1[key]);
      }
      initCommands();
      settings.verbosity = world.VERBOSE;
      game.ticker = setInterval(world.gameTimer, settings.timerInterval);
      w$1[player().loc].visited++;
      world.update();
      world.saveGameState();
      settings.performanceLog("End world.init");
      world.isCreated = true;
    },
    // Every item or room should have this called for them.
    // That will be done at the start, but you need to do it yourself
    // if creating items on the fly (but you should not be doing that anyway!).
    initItem: function(item2) {
      if (item2.clonePrototype)
        return errormsg("Trying to initiaslise a cloned object. This is not permitted, as the prototype will not have been initialised before it was cloned. Instead, clone the object in settings.setup.");
      for (const f of [...new Set(item2.initialiserFunctions)])
        f(item2);
      delete item2.initialiserFunctions;
      delete item2.afterCreation;
      for (let exit of lang.exit_list) {
        const ex = item2[exit.name];
        if (ex) {
          ex.origin = item2;
          ex.dir = exit.name;
          if (ex.alsoDir) {
            for (let dir of ex.alsoDir) {
              item2[dir] = new Exit(ex.name, ex);
              item2[dir].scenery = true;
              item2[dir].isAlsoDir = true;
              item2[dir].dir = dir;
              delete item2[dir].alsoDir;
            }
          }
          if (ex instanceof Link) {
            const reverseDir = ex.reverse();
            const dest = w$1[ex.name];
            if (dest[reverseDir]) {
              log("WARNING: The returning Exit for the Link on " + item2.name + ' goes to a direction that already has something set (conflicts with "' + reverseDir + '" on ' + dest.name + ").");
              continue;
            }
            dest[reverseDir] = new Exit(ex.origin.name);
            dest[reverseDir].origin = dest;
            dest[reverseDir].dir = reverseDir;
          }
        }
      }
      if (item2.roomSet) {
        if (!settings.roomSetList[item2.roomSet]) {
          settings.roomSetList[item2.roomSet] = [];
        }
        settings.roomSetList[item2.roomSet].push({ name: item2.name, visited: false });
      }
      if (settings.playMode === "dev" && !settings.disableChecks && !item2.abstract) {
        if (item2.loc && !w$1[item2.loc]) {
          warningFor(item2, "In an unknown location (" + item2.loc + ")");
        }
        if (item2.consultable && !settings.noAskTell) {
          if (!item2.tellOptions || item2.tellOptions.length === 0)
            warningFor(item2, "No tellOptions for consultable/NPC");
          if (!item2.askOptions || item2.askOptions.length === 0)
            warningFor(item2, "No askOptions for consultable/NPC");
        }
        const dirs = lang.exit_list.filter((el) => el.type !== "nocmd").map((el) => el.name);
        for (let key in item2) {
          if (dirs.includes(key)) {
            if (!item2[key] instanceof Exit)
              warningFor(item2, "Exit " + key + " is not an Exit instance.");
            if (item2[key].name !== "_" && !w$1[item2[key].name])
              warningFor(item2, "Exit " + key + " goes to an unknown location (" + item2[key].name + ").");
          } else {
            if (item2[key] instanceof Exit)
              warningFor(item2, "Attribute " + key + " is an Exit instance and probably should not.");
          }
        }
        if (item2.abstract)
          ;
        if (item2.room) {
          if (typeof item2.desc === "function") {
            try {
              test.testing = true;
              test.testOutput = [];
              const out = item2.desc();
              test.testing = false;
              if (test.testOutput.length > 0)
                warningFor(item2, "The 'desc' attribute for this location is a function that prints directy to screen; should return a string only: " + item2.name);
              if (typeof out !== "string") {
                warningFor(item2, "The 'desc' function attribute does not return a string");
              }
            } catch (err) {
              warningFor(item2, "The 'desc' function caused an error");
              log(err.message);
              log(err.stack);
            }
          } else if (typeof item2.desc !== "string") {
            warningFor(item2, "The 'desc' attribute for this location is neither a string nor a function");
          }
        } else if (item2.conversationTopic) {
          if (!item2.msg && !item2.script)
            warningFor(item2, "Topic has neither 'script' or 'msg' attribute");
          if (item2.msg && typeof item2.msg !== "string")
            warningFor(item2, "The 'msg' attribute for this topic is not a string");
          if (item2.script && typeof item2.script !== "function")
            warningFor(item2, "The 'script' attribute for this topic is not a function");
        } else {
          if (typeof item2.examine === "function") {
            try {
              test.testing = true;
              test.testOutput = [];
              const out = item2.examine({ char: player(), item: item2 });
              test.testing = false;
              if (out !== void 0) {
                warningFor(item2, "The 'examine' function attribute returns a value; it probably should not");
              }
            } catch (err) {
              warningFor(item2, "The 'examine' function caused an error");
              log(err.message);
              log(err.stack);
            }
          } else if (typeof item2.examine !== "string") {
            warningFor(item2, "The 'examine' attribute for this item is neither a string nor a function");
          }
        }
        if (settings.customObjectChecks)
          settings.customObjectChecks(item2);
      }
    },
    // Start the game - could be called after the start up dialog, so not part of init
    begin: function() {
      settings.performanceLog("Start begin");
      if (settings.startingDialogEnabled)
        return;
      if (typeof settings.intro === "string") {
        msg(settings.intro);
      } else if (settings.intro) {
        for (let el of settings.intro)
          msg(el);
      }
      if (typeof settings.setup === "function")
        settings.setup();
      world.enterRoom();
      settings.performanceLog("End begin");
    },
    //------------------------------------------------------------
    // Turn taking
    // Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
    endTurn: function(result2) {
      if (result2 === true)
        log("That command returned 'true', rather than the proper result code.");
      if (result2 === false)
        log("That command returned 'false', rather than the proper result code.");
      util.handleChangeListeners();
      if (result2 === world.SUCCESS || settings.failCountsAsTurn && result2 === world.FAILED) {
        game.turnCount++;
        game.elapsedTime += settings.dateTime.secondsPerTurn;
        for (const key in w$1)
          w$1[key].endTurn();
        for (const m of settings.modulesToEndTurn)
          m.endTurn();
        util.handleChangeListeners();
        world.resetPauses();
        world.update();
        world.saveGameState();
        endTurnUI(true);
      } else {
        endTurnUI(false);
      }
    },
    // Updates the game world, specifically...
    // Sets the scoping snapshot
    // Sets the light/dark
    update: function() {
      if (!player())
        return errormsg("No player object found. This will not go well...");
      if (player().loc === player().name)
        return errormsg("The location assigned to the player is the player itself.");
      if (!player().loc || !w$1[player().loc]) {
        if (world.isCreated) {
          return errormsg((player().loc === void 0 ? "No player location set." : "Player location set to '" + player().loc + "', which does not exist.") + " Has the player just moved? This is likely to be because of an error in the exit being used.");
        } else {
          return errormsg((player().loc === void 0 ? "No player location set." : "Player location set to '" + player().loc + "', which does not exist.") + " This is may be because of an error in one of the .js files; the browser has hit the error and stopped at that point, before getting to where the player is set. Is there another error above this one? If so, that i the real problem.");
        }
      }
      game.loc = w$1[player().loc];
      world.scopeSnapshot();
    },
    resetPauses: function() {
      for (let key in w$1) {
        if (w$1[key].paused) {
          w$1[key].paused = false;
        }
      }
    },
    // Returns true if bad lighting is not obscuring the item
    ifNotDark: function(item2) {
      return !game.dark || item2.lightSource() > world.LIGHT_NONE;
    },
    // scopeStatus is used to track what the player can see and reach; it is a lot faster than working
    // it out each time, as the scope needs to be checked several times every turn.
    scopeSnapshot: function() {
      for (let key in w$1)
        w$1[key].scopeStatus = {};
      world.scope = [];
      world.takeScopeSnapshot("See");
      world.takeScopeSnapshot("Reach");
      if (!world.scope.includes(loc$1()))
        world.scope.push(loc$1());
      if (player().onPhoneTo && !world.scope.includes(w$1[player().onPhoneTo]))
        world.scope.push(w$1[player().onPhoneTo]);
      let light = world.LIGHT_NONE;
      for (const item2 of world.scope) {
        if (!item2.lightSource)
          log(item2.name);
        if (light < item2.lightSource()) {
          light = item2.lightSource();
        }
      }
      game.dark = light < world.LIGHT_MEAGRE;
    },
    // mode is either "Reach" or "See"
    takeScopeSnapshot: function(mode) {
      let room = loc$1();
      room.scopeStatus["room" + mode] = true;
      while (room.loc && room["can" + mode + "ThroughThis"]()) {
        room = w$1[room.loc];
        room.scopeStatus["room" + mode] = true;
      }
      room.scopeSnapshot(mode);
    },
    defaultVerbFunction: function(o, verbList) {
      verbList.push(lang.verbs.examine);
      if (o.use !== void 0)
        verbList.push(lang.verbs.use);
    },
    //------------------------------------------------------------
    // Entering a new room
    // Runs the script and gives the description
    enterRoom: function(exit) {
      if (loc$1().beforeEnter === void 0) {
        return errormsg("This room, " + loc$1().name + ", has no 'beforeEnter` function defined.  This is probably because it is not actually a room (it was not created with 'createRoom' and has not got the DEFAULT_ROOM template), but is an item. It is not clear what state the game will continue in.");
      }
      settings.beforeEnter(exit);
      if (loc$1().visited === 0) {
        if (loc$1().roomSet) {
          loc$1().roomSetOrder = 1;
          for (const el of settings.roomSetList[loc$1().roomSet]) {
            if (el.visited)
              loc$1().roomSetOrder++;
            if (el.name === loc$1().name)
              el.visited = true;
          }
        }
        loc$1().beforeFirstEnter(exit);
      }
      loc$1().beforeEnter(exit);
      world.enterRoomAfterScripts(exit);
    },
    // Called when entering a new room, after beforeEnter and beforeFirstEnter re done
    enterRoomAfterScripts: function(exit) {
      loc$1().description();
      player().handleMovingFollowers(exit);
      loc$1().visited++;
      loc$1().afterEnter(exit);
      settings.afterEnter(exit);
      if (loc$1().visited === 1) {
        loc$1().afterFirstEnter(exit);
      }
      for (let key in loc$1().afterEnterIf) {
        if (loc$1().afterEnterIfFlags.split(" ").includes(key))
          continue;
        if (loc$1().afterEnterIf[key].test()) {
          loc$1().afterEnterIf[key].action();
          loc$1().afterEnterIfFlags += " " + key;
        }
      }
    },
    //------------------------------------------------------------
    // Real time event handling
    gameTimer: function() {
      game.elapsedRealTime++;
      let somethingHappened = false;
      for (let i2 = 0; i2 < game.timerEventNames.length; i2++) {
        if (game.timerEventTriggerTimes[i2] && game.timerEventTriggerTimes[i2] < game.elapsedRealTime) {
          const flag = settings.eventFunctions[game.timerEventNames[i2]]();
          if (game.timerEventIntervals[i2] !== -1 && !flag) {
            game.timerEventTriggerTimes[i2] += game.timerEventIntervals[i2];
          } else {
            game.timerEventTriggerTimes[i2] = 0;
          }
          somethingHappened = true;
        }
      }
      if (somethingHappened)
        util.handleChangeListeners();
    },
    //------------------------------------------------------------
    // UNDO Support
    gameState: [],
    saveGameState: function() {
      if (settings.maxUndo > 0) {
        world.gameState.push(saveLoad.getSaveBody());
        if (world.gameState.length > settings.maxUndo)
          world.gameState.shift();
      }
    },
    find: function(fn, options) {
      for (const key in w$1) {
        if (fn(w$1[key], options))
          return w$1[key];
      }
      return null;
    }
  };
  const game = {
    player: null,
    loc: null,
    turnCount: 0,
    elapsedTime: 0,
    elapsedRealTime: 0,
    startTime: settings.dateTime.start,
    name: "built-in_game_object",
    timerEventNames: [],
    timerEventTriggerTimes: [],
    timerEventIntervals: [],
    getSaveString: function() {
      let s = "GameState=";
      for (const key in this) {
        if (!this.saveLoadExclude(key))
          s += saveLoad.encode(key, this[key]);
      }
      return s;
    },
    setLoadString: function(s) {
      const parts = s.split("=");
      if (parts.length !== 2)
        return errormsg("Bad format in saved data (" + s + ")");
      if (parts[0] !== "GameState")
        return errormsg("Expected GameState to be second");
      saveLoad.setFromArray(this, parts[1].split(";"));
    },
    saveLoadExclude: function(att) {
      return att === "player" || typeof this[att] === "function" || typeof this[att] === "object";
    }
  };
  function loc$1() {
    if (!game.loc) {
      return errormsg("Something wrong - current location not found!");
    }
    return game.loc;
  }
  function player() {
    if (!game.player) {
      return errormsg("No player object found. This is probably due to an error in the data file where the player object is defined, but could be because you have not set one.");
    }
    return game.player;
  }
  function setPlayer(char2) {
    game.player = char2;
  }
  class Exit {
    constructor(name2, hash2) {
      if (!hash2)
        hash2 = {};
      this.name = name2;
      this.use = util.defaultExitUse;
      this.isGuarded = util.defaultExitIsGuarded;
      this.getExitObject = function() {
        return lang.exit_list.find((el) => el.name === this.dir);
      };
      this.nice = function() {
        const dirObj = this.getExitObject();
        return dirObj.niceDir ? dirObj.niceDir : dirObj.name;
      };
      this.reverseNice = function() {
        const dirObj = this.reverseObject();
        return dirObj.niceDir ? dirObj.niceDir : dirObj.name;
      };
      this.reverse = function() {
        return this.getExitObject().opp;
      };
      this.reverseObject = function() {
        const dir = this.getExitObject().opp;
        return lang.exit_list.find((el) => el.name === dir);
      };
      this.isLocked = function() {
        return this.origin.isExitLocked(this.dir);
      };
      this.setLock = function(locked) {
        return this.origin.setExitLock(this.dir, locked);
      };
      this.isHidden = function() {
        return this.origin.isExitHidden(this.dir);
      };
      this.setHide = function(hidden) {
        return this.origin.setExitHide(this.dir, hidden);
      };
      for (let key in hash2) {
        if (key !== "name")
          this[key] = hash2[key];
      }
    }
  }
  class Link extends Exit {
    constructor(name2, hash2) {
      super(name2, hash2);
    }
  }
  const regions = {};
  const setRegion = function(name2, data) {
    region = name2;
    regions[name2] = data;
  };
  const NPC = function(isFemale) {
    const res = Object.assign({}, CHARACTER(), CONSULTABLE(), AGENDA_FOLLOWER());
    res.npc = true;
    res.isFemale = isFemale;
    res.pronouns = isFemale ? lang.pronouns.female : lang.pronouns.male;
    res.askOptions = [];
    res.tellOptions = [];
    res.excludeFromAll = true;
    res.reactions = [];
    res.receiveItems = [
      {
        msg: lang.not_interested_for_give,
        failed: true
      }
    ];
    res.followers = [];
    res.canReachThroughThis = () => false;
    res.icon = () => "npc12";
    res.getWearingVisible = function() {
      return this.getWearing();
    };
    res.isHere = function() {
      return this.isAtLoc(player().loc);
    };
    res.msg = function(s, params) {
      if (this.isHere())
        msg(s, params);
    };
    res.multiMsg = function(ary) {
      if (!this.isHere())
        return;
      const counter = ary[0].replace(/[^a-z]/ig, "");
      if (this[counter] === void 0)
        this[counter] = -1;
      this[counter]++;
      if (this[counter] >= ary.length)
        this[counter] = ary.length - 1;
      if (ary[this[counter]])
        msg(ary[this[counter]]);
    };
    res.inSight = function(room) {
      if (!this.loc)
        return false;
      if (!room)
        room = w$1[this.loc];
      if (player().loc === room.name)
        return true;
      if (room.visibleFrom === void 0)
        return false;
      if (typeof room.visibleFrom === "function")
        return room.visibleFrom(loc$1());
      if (Array.isArray(room.visibleFrom)) {
        if (room.visibleFrom.includes(loc$1().name))
          return room.visibleFromPrefix ? room.visibleFromPrefix : true;
      }
      return false;
    };
    res.setLeader = function(npc2) {
      if (typeof npc2 === "string")
        npc2 = w$1[npc2];
      if (this.leaderName)
        array.remove(w$1[this.leaderName].followers, this.name);
      if (npc2) {
        npc2.followers.push(this.name);
        this.leaderName = npc2.name;
      } else {
        delete this.leaderName;
      }
    };
    res.getFollowers = function() {
      return this.followers.map((el) => w$1[el]);
    };
    res.startFollow = function() {
      if (this.leaderName)
        return falsemsg(lang.already_following, { npc: this });
      this.setLeader(player());
      msg("{nv:npc:nod:true} his head.", { npc: this });
      return true;
    };
    res.endFollow = function() {
      if (!this.leaderName)
        return falsemsg(lang.already_waiting, { npc: this });
      this.setLeader();
      msg("{nv:npc:nod:true} his head.", { npc: this });
      return true;
    };
    res.endTurn = function(turn) {
      if (this.dead)
        return;
      this.sayTakeTurn();
      this.doReactions();
      if (!this.paused && !this.suspended && this.agenda && this.agenda.length > 0)
        this.doAgenda();
      this.doEvent(turn);
    };
    res.doReactions = function() {
      if (this.player)
        return;
      if (!this.isHere() && !settings.npcReactionsAlways)
        return;
      if (!this.reactionFlags)
        this.reactionFlags = [];
      const params = {
        char: this,
        noResponseNotError: true,
        afterScript: function(params2, response) {
          if (!response)
            return;
          if (response.name)
            params2.char.reactionFlags.push(response.name);
          if (!response.noPause)
            params2.char.pause();
          if (response.override)
            params2.char.reactionFlags = params2.char.reactionFlags.concat(response.override);
        },
        extraTest: function(params2, response) {
          return !response.name || !params2.char.reactionFlags.includes(response.name);
        }
      };
      respond(params, this.reactions);
    };
    for (const key in npc_utilities)
      res[key] = npc_utilities[key];
    res.topics = function() {
      if (this.askOptions.length === 0 && this.tellOptions.length === 0) {
        metamsg(lang.topics_no_ask_tell);
        return world.SUCCESS_NO_TURNSCRIPTS;
      }
      let flag = false;
      for (let action of ["ask", "tell"]) {
        const arr = getResponseList({ char: this, action }, this[action + "Options"]);
        const arr2 = [];
        for (let res2 of arr) {
          if (res2.silent && !player().mentionedTopics.includes(res2.name))
            continue;
          arr2.push(res2.name);
        }
        if (arr2.length !== 0) {
          metamsg(lang["topics_" + action + "_list"], { item: this, list: arr2.sort().join("; ") });
          flag = true;
        }
      }
      if (!flag) {
        metamsg(lang.topics_none_found, { item: this });
      }
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    };
    res.sayBonus = 0;
    res.sayPriority = 0;
    res.sayState = 0;
    res.sayUsed = " ";
    res.sayResponse = function(s) {
      if (!this.sayResponses)
        return false;
      const params = {
        text: s,
        char: this,
        extraTest: function(params2, response) {
          if (!response.regex)
            return true;
          if (response.id && params2.char.sayUsed.match(new RegExp("\\b" + response.id + "\\b")))
            return false;
          return response.regex.test(params2.text);
        },
        afterScript: function(params2, response) {
          if (!response)
            return;
          if (this.oldQuestion) {
            delete this.oldQuestion;
          } else {
            params2.char.sayBonus = 0;
            params2.char.sayQuestion = false;
          }
          if (response.id)
            params2.char.sayUsed += response.id + " ";
        },
        noResponseNotError: true
      };
      return respond(params, this.sayResponses);
    };
    res.sayCanHear = function(char2, verb) {
      return char2.loc === this.loc;
    };
    res.askQuestion = function(questionName) {
      if (typeof questionName !== "string")
        questionName = questionName.name;
      if (this.sayQuestion)
        this.oldQuestion = this.sayQuestion;
      const q = util.questionList[questionName];
      if (!q)
        return errormsg("Trying to set a question that does not exist, " + questionName + ", for " + this.name);
      this.sayQuestion = questionName;
      this.sayQuestionCountdown = q.countdown;
      this.sayBonus = 100;
    };
    res.respondToAnswer = function(s) {
      const q = util.questionList[this.sayQuestion];
      return q.sayResponse(this, s);
    };
    res.sayTakeTurn = function() {
      if (!this.sayQuestion)
        return;
      this.sayQuestionCountdown--;
      if (this.sayQuestionCountdown > 0)
        return;
      const q = util.questionList[this.sayQuestion];
      this.sayQuestion = false;
      this.sayBonus = 0;
      if (q.expiredScript)
        q.expiredScript(this);
    };
    return res;
  };
  const npc_utilities = {
    findTopic: function(alias, n = 1) {
      return util.findTopic(alias, this, n);
    },
    showTopic: function(alias, n = 1) {
      util.findTopic(alias, this, n).show();
    },
    hideTopic: function(alias, n = 1) {
      util.findTopic(alias, this, n).hide();
    },
    talkto: function() {
      if (settings.noTalkTo !== false) {
        metamsg(settings.noTalkTo);
        return false;
      }
      if (!player().testTalk(this))
        return false;
      if (this.testTalk && !this.testTalk())
        return false;
      if (typeof this.talk === "string") {
        msg(this.talk, { char: this });
        return true;
      }
      if (typeof this.talk === "function") {
        return this.talk();
      }
      const topics = this.getTopics();
      player().conversingWithNpc = this;
      if (topics.length === 0)
        return failedmsg(this.no_topics ? this.no_topics : lang.no_topics, { char: player(), item: this });
      if (this.greeting) {
        printOrRun(this, this, "greeting");
      }
      topics.push(lang.never_mind);
      const fn = io.menuFunctions[settings.funcForDynamicConv];
      fn(lang.speak_to_menu_title(this), topics, function(result2) {
        if (result2 !== lang.never_mind) {
          result2.runscript();
        }
      });
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    askTopics: function(...topics) {
      const title = topics.shift();
      const fn = io.menuFunctions[settings.funcForDynamicConv];
      fn(title, topics, function(result2) {
        result2.runscript();
      });
    },
    getTopics: function() {
      const list2 = [];
      for (let key in w$1) {
        if (w$1[key].isTopicVisible && w$1[key].isTopicVisible(this)) {
          list2.push(w$1[key]);
        }
      }
      return list2;
    }
  };
  const AGENDA_FOLLOWER = function() {
    const res = {};
    res.agenda = [];
    res.suspended = false;
    res.followers = [];
    res.inSight = function() {
      return false;
    };
    res.endTurn = function(turn) {
      if (!this.paused && !this.suspended && this.agenda.length > 0)
        this.doAgenda();
      this.doEvent(turn);
    };
    res.setAgenda = function(agenda2) {
      this.agenda = agenda2;
      this.suspended = false;
      this.agendaWaitCounter = false;
      this.patrolCounter = false;
    };
    res.doAgenda = function() {
      if (this.followers.length !== 0) {
        this.savedPronouns = this.pronouns;
        this.savedAlias = this.alias;
        this.pronouns = lang.pronouns.plural;
        this.followers.unshift(this.name);
        this.alias = formatList(this.getFollowers(), { lastSep: lang.list_and });
        this.followers.shift();
      }
      if (!Array.isArray(this.agenda))
        throw "Agenda is not a list for " + this.name;
      if (typeof this.agenda[0] !== "string")
        throw "Next agenda item is not a string for " + this.name;
      const arr = this.agenda[0].split(":");
      const functionName = arr.shift();
      if (typeof agenda[functionName] !== "function") {
        errormsg("Unknown function `" + functionName + "' in agenda for " + this.name);
        return;
      }
      const flag = agenda[functionName](this, arr);
      if (flag)
        this.agenda.shift();
      if (flag === "next")
        this.doAgenda();
      if (this.savedPronouns) {
        this.pronouns = this.savedPronouns;
        this.alias = this.savedAlias;
        this.savedPronouns = false;
      }
    };
    res.pause = function() {
      if (this.leaderName) {
        w$1[this.leaderName].pause();
      } else {
        this.paused = true;
      }
    };
    return res;
  };
  const agenda = {
    debug: function(s, npc2, arr) {
      if (settings.agendaDebugging && settings.playMode === "dev")
        debugmsg("AGENDA for " + npc2.name + ": " + s + "; " + formatList(arr, { doNotSort: true }));
    },
    debugS: function(s) {
      if (settings.agendaDebugging && settings.playMode === "dev")
        debugmsg("AGENDA comment: " + s);
    },
    // wait one turn
    pause: function(npc2, arr) {
      return true;
    },
    // print the array as text if the player is here
    // otherwise this will be skipped
    // Used by several other functions, so this applies to them too
    text: function(npc2, arr) {
      if (typeof npc2[arr[0]] === "function") {
        this.debug("text (function)", npc2, arr);
        const fn = arr.shift();
        const res = npc2[fn](arr);
        return typeof res === "boolean" ? res : true;
      }
      this.debug("text (string)", npc2, arr);
      if (npc2.inSight())
        msg(arr.join(":"));
      return true;
    },
    msg: function(npc2, arr) {
      this.debug("msg (string)", npc2, arr);
      msg(arr.join(":"));
      return true;
    },
    // Alias for text
    run: function(npc2, arr) {
      return this.text(npc2, arr);
    },
    // sets one attribute on the given item
    // it will guess if Boolean, integer or string
    setItemAtt: function(npc2, arr) {
      return this._setItemAtt(npc2, arr, false);
    },
    // sets one attribute on the given item
    // it will guess if Boolean, integer or string
    setItemAttThen: function(npc2, arr) {
      return this._setItemAtt(npc2, arr, true);
    },
    // sets one attribute on the given item
    // it will guess if Boolean, integer or string
    _setItemAtt: function(npc2, arr, next) {
      this.debug("setItemAtt", npc2, arr);
      const item2 = arr.shift();
      const att = arr.shift();
      let value = arr.shift();
      if (!w$1[item2])
        errormsg("Item '" + item2 + "' not recognised in the agenda of " + npc2.name);
      if (value === "true")
        value = true;
      if (value === "false")
        value = false;
      if (/^\d+$/.test(value))
        value = parseInt(value);
      w$1[item2][att] = value;
      this.text(npc2, arr);
      return next ? "next" : true;
    },
    // delete one attribute on the given item
    deleteItemAtt: function(npc2, arr) {
      this.debug("deleteItemAtt", npc2, arr);
      const item2 = arr.shift();
      const att = arr.shift();
      if (!w$1[item2])
        errormsg("Item '" + item2 + "' not recognised in the agenda of " + npc2.name);
      delete w$1[item2][att];
      this.text(npc2, arr);
      return true;
    },
    // Wait n turns
    wait: function(npc2, arr) {
      this.debug("wait", npc2, arr);
      if (arr.length === 0)
        return true;
      if (isNaN(arr[0]))
        errormsg("Expected wait to be given a number in the agenda of '" + npc2.name + "'");
      const count = parseInt(arr.shift());
      if (npc2.agendaWaitCounter !== void 0) {
        npc2.agendaWaitCounter++;
        if (npc2.agendaWaitCounter >= count) {
          this.debugS("Pass");
          this.text(npc2, arr);
          return true;
        }
        return false;
      }
      npc2.agendaWaitCounter = 0;
      return false;
    },
    // Wait until ...
    // This may be repeated any number of times
    waitFor: function(npc2, arr) {
      return this.handleWaitFor(npc2, arr, false);
    },
    waitForNow: function(npc2, arr) {
      return this.handleWaitFor(npc2, arr, true);
    },
    handleWaitFor: function(npc2, arr, immediate) {
      this.debug("waitFor", npc2, arr);
      let name2 = arr.shift();
      if (typeof npc2[name2] === "function") {
        if (npc2[name2](arr)) {
          this.text(npc2, arr);
          this.debugS("Pass");
          return immediate ? "next" : true;
        } else {
          return false;
        }
      } else {
        if (name2 === "player")
          name2 = player().name;
        if (npc2.loc === w$1[name2].loc) {
          this.text(npc2, arr);
          this.debugS("Pass");
          return immediate ? "next" : true;
        } else {
          return false;
        }
      }
    },
    waitUntil: function(npc2, arr) {
      return agenda.handleWaitUntilWhile(npc2, arr, true);
    },
    waitUntilNow: function(npc2, arr) {
      return agenda.handleWaitUntilWhile(npc2, arr, true, true);
    },
    waitWhile: function(npc2, arr) {
      return agenda.handleWaitUntilWhile(npc2, arr, false);
    },
    waitWhileNow: function(npc2, arr) {
      return agenda.handleWaitUntilWhile(npc2, arr, false, true);
    },
    handleWaitUntilWhile: function(npc2, arr, reverse, immediate) {
      const item2 = arr[0] === "player" ? player() : w$1[arr[0]];
      arr.shift();
      const attName = arr.shift();
      const value = util.guessMyType(arr.shift());
      let flag = item2[attName] === value;
      if (reverse)
        flag = !flag;
      if (flag)
        return false;
      msg(arr.join(":"));
      return immediate ? "next" : true;
    },
    joinedBy: function(npc2, arr) {
      this.debug("joinedBy", npc2, arr);
      const followerName = arr.shift();
      w$1[followerName].setLeader(npc2);
      this.text(npc2, arr);
      return true;
    },
    joining: function(npc2, arr) {
      this.debug("joining", npc2, arr);
      const leaderName = arr.shift();
      npc2.setLeader(w$1[leaderName]);
      this.text(npc2, arr);
      return true;
    },
    disband: function(npc2, arr) {
      this.debug("disband", npc2, arr);
      for (let s of npc2.followers) {
        const follower = w$1[s];
        follower.leader = false;
      }
      npc2.followers = [];
      this.text(npc2, arr);
      return true;
    },
    // Move the given item directly to the given location, then print the rest of the array as text
    // Do not use for items with a funny location, such as COUNTABLES
    moveItem: function(npc2, arr) {
      this.debug("moveItem", npc2, arr);
      const item2 = arr.shift();
      let dest = arr.shift();
      if (dest === "player") {
        dest = player().name;
      } else if (dest === "_") {
        dest = false;
      } else {
        if (!w$1[dest])
          return errormsg("Location '" + dest + "' not recognized in the agenda of " + npc2.name);
      }
      w$1[item2].moveToFrom({ char: npc2, toLoc: dest, item: item2 });
      this.text(npc2, arr);
      return true;
    },
    // Move directly to the given location, then print the rest of the array as text
    // Use "player" to go directly to the room the player is in.
    // Use an item (i.e., an object not flagged as a room) to have the NPC move
    // to the room containing the item.
    // None of the usual reactions will be performed, so items carried with not react to
    // moving, any followers will be left behind, etc.
    jumpTo: function(npc2, arr) {
      let dest = arr.shift();
      if (dest === "player") {
        dest = player().loc;
      } else if (dest === "_") {
        dest = void 0;
        this.text(npc2, arr);
      } else {
        if (!w$1[dest])
          return errormsg("Location '" + dest + "' not recognised in the agenda of " + npc2.name);
        if (!w$1[dest].room)
          dest = dest.loc;
        if (!w$1[dest])
          return errormsg("Location '" + dest + "' not recognized in the agenda of " + npc2.name);
      }
      npc2.loc = dest;
      this.text(npc2, arr);
      return true;
    },
    // Move to the given location, then print the rest of the array as text.
    // There must be an exit from the current room to that room.
    moveTo: function(npc2, arr) {
      let dest = arr.shift();
      if (!w$1[dest])
        return errormsg("Location '" + dest + "' not recognised in the agenda of " + npc2.name);
      if (!w$1[dest].room)
        dest = dest.loc;
      const exit = w$1[npc2.loc].findExit(dest);
      if (!exit)
        return errormsg("Could not find an exit to location '" + dest + "' in the agenda of " + npc2.name);
      npc2.movingMsg(exit);
      npc2.moveChar(exit);
      this.text(npc2, arr);
      return true;
    },
    patrol: function(npc2, arr) {
      this.debug("patrol", npc2, arr);
      if (npc2.patrolCounter === void 0)
        npc2.patrolCounter = -1;
      npc2.patrolCounter = (npc2.patrolCounter + 1) % arr.length;
      this.moveTo(npc2, [arr[npc2.patrolCounter]]);
      return false;
    },
    // Move to another room via a random, unlocked exit, then print the rest of the array as text
    walkRandom: function(npc2, arr) {
      this.debug("walkRandom", npc2, arr);
      const exit = w$1[npc2.loc].getRandomExit({ excludeLocked: true, excludeScenery: true });
      if (exit === null) {
        this.text(npc2, arr);
        return true;
      }
      if (!w$1[exit.name])
        errormsg("Location '" + exit.name + "' not recognised in the agenda of " + npc2.name);
      npc2.movingMsg(exit);
      npc2.moveChar(exit);
      return false;
    },
    // Move to the given location, using available, unlocked exits, one room per turn
    // then print the rest of the array as text
    // Use "player" to go to the room the player is in (if the player moves, the NPC will head
    // to the new position, but will be omniscient!).
    // Use an item (i.e., an object not flagged as a room) to have the NPC move
    // to the room containing the item.
    // This may be repeated any number of turns
    leadTo: function(npc2, arr) {
      this.debug("leadTo", npc2, arr);
      if (npc2.loc !== player().loc)
        return false;
      return this.walkTo(npc2, arr);
    },
    walkTo: function(npc2, arr) {
      this.debug("walkTo", npc2, arr);
      let dest = arr.shift();
      if (dest === "player")
        dest = player().loc;
      if (w$1[dest] === void 0) {
        errormsg("Location '" + dest + "' not recognised in the agenda of " + npc2.name);
        return true;
      }
      if (!w$1[dest].room) {
        dest = w$1[dest].loc;
        if (w$1[dest] === void 0) {
          errormsg("Object location '" + dest + "' not recognised in the agenda of " + npc2.name);
          return true;
        }
      }
      if (npc2.isAtLoc(dest)) {
        this.text(npc2, arr);
        return true;
      } else {
        const route = agenda.findPath(w$1[npc2.loc], w$1[dest]);
        if (!route)
          errormsg("Location '" + dest + "' not reachable in the agenda of " + npc2.name);
        const exit = w$1[npc2.loc].findExit(route[0]);
        npc2.movingMsg(exit);
        npc2.moveChar(exit);
        if (npc2.isAtLoc(dest)) {
          this.text(npc2, arr);
          return true;
        } else {
          return false;
        }
      }
    },
    // Initiate a conversation, with this topic
    showTopic: function(npc2, arr) {
      let alias = arr.shift();
      npc2.showTopic(alias);
      this.text(npc2, arr);
      return true;
    }
  };
  agenda.findPath = function(start, end, maxlength) {
    if (start === end)
      return [];
    if (!game.pathID)
      game.pathID = 0;
    if (maxlength === void 0)
      maxlength = 999;
    game.pathID++;
    let currentList = [start];
    let length = 0;
    let nextList, dest, exits;
    start.pathfinderNote = { id: game.pathID };
    while (currentList.length > 0 && length < maxlength) {
      nextList = [];
      length++;
      for (let room of currentList) {
        exits = room.getExits({ npc: true });
        for (let exit of exits) {
          if (exit.name === "_")
            continue;
          dest = w$1[exit.name];
          if (dest === void 0) {
            errormsg("Dest is undefined: " + exit.name + " (room " + room.name + "). Giving up.");
            console.log(this);
            return false;
          }
          if (dest.pathfinderNote && dest.pathfinderNote.id === game.pathID)
            continue;
          dest.pathfinderNote = { jumpFrom: room, id: game.pathID };
          if (dest === end)
            return agenda.extractPath(start, end);
          nextList.push(dest);
        }
      }
      currentList = nextList;
    }
    return false;
  };
  agenda.extractPath = function(start, end) {
    let res = [end];
    let current = end;
    let count = 0;
    do {
      current = current.pathfinderNote.jumpFrom;
      res.push(current);
      count++;
    } while (current !== start && count < 99);
    res.pop();
    return res.reverse();
  };
  const CONSULTABLE = function() {
    const res = {};
    res.consultable = true;
    res.askabout = function(text1, text2) {
      return this.asktellabout(text1, text2, lang.ask_about_intro, this.askOptions, "ask");
    };
    res.tellabout = function(text1, text2) {
      return this.asktellabout(text1, text2, lang.tell_about_intro, this.tellOptions, "tell");
    };
    res.talkabout = function(text1, text2) {
      let data = this.talkOptions;
      if (!this.talkOptions)
        data = this.tellOptions ? this.tellOptions.concat(this.askOptions) : this.askOptions;
      return this.asktellabout(text1, text2, lang.talk_about_intro, data, "talk");
    };
    res.asktellabout = function(text1, text2, intro, list2, action) {
      if (settings.noAskTell !== false) {
        metamsg(settings.noAskTell);
        return false;
      }
      if (!player().testTalk(this))
        return false;
      if (this.testTalk && !this.testTalk(text1, action))
        return false;
      if (!list2 || list2.length === 0) {
        metamsg(settings.noAskTell);
        return errormsg("No " + action + "Options set for " + this.name + " and I think there should at least be default saying why.");
      }
      if (settings.givePlayerAskTellMsg)
        msg(intro(this, text1, text2), { char: player() });
      const params = {
        text: text1,
        text2,
        char: this,
        action,
        extraTest: function(params2, response) {
          if (!response.regex)
            return true;
          return response.regex.test(params2.text);
        },
        afterScript: this.askTellDone
      };
      return respond(params, list2);
    };
    res.askTellDone = function(params, response) {
      if (!response) {
        msg(lang.npc_no_interest_in, params);
        return;
      }
      if (response.mentions) {
        for (let s of response.mentions) {
          if (!player().mentionedTopics.includes(s))
            player().mentionedTopics.push(s);
        }
      }
      if (params.char.pause)
        params.char.pause();
    };
    return res;
  };
  class Question {
    constructor(name2, responses) {
      this.name = name2;
      this.responses = responses;
      this.countdown = settings.turnsQuestionsLast;
    }
    sayResponse(char2, s) {
      const params = {
        text: s,
        char: char2,
        question: this,
        extraTest: function(params2, response) {
          if (!response.regex)
            return true;
          return response.regex.test(params2.text);
        },
        afterScript: function(params2, response) {
          if (this.oldQuestion) {
            delete this.oldQuestion;
          } else {
            params2.char.sayBonus = 0;
            params2.char.sayQuestion = false;
            delete params2.char.questionExpiredFunction;
          }
          if (params2.question.afterScript) {
            params2.question.afterScript(params2, response);
          }
        },
        noResponseNotError: true
      };
      return respond(params, this.responses);
    }
  }
  util.questionList = {};
  util.createQuestion = function(name2, responses, options = {}) {
    const q = new Question(name2, responses);
    for (const key in options)
      q[key] = options[key];
    util.questionList[name2] = q;
    return q;
  };
  const TOPIC = function(fromStart) {
    return {
      conversationTopic: true,
      showTopic: fromStart,
      hideTopic: false,
      hideAfter: true,
      properNoun: true,
      // we do not want "the" prepended
      nowShow: [],
      nowHide: [],
      count: 0,
      isVisible: () => true,
      isAtLoc: () => false,
      belongsTo: function(loc2) {
        return this.loc === loc2;
      },
      eventPeriod: 1,
      eventIsActive: function() {
        return this.showTopic && !this.hideTopic && this.countdown;
      },
      eventScript: function() {
        this.countdown--;
        if (this.countdown < 0)
          this.hide();
      },
      runscript: function() {
        let obj = player().conversingWithNpc;
        if (obj === void 0)
          return errormsg("No conversing NPC called " + player().conversingWithNpc + " found.");
        obj.pause();
        this.hideTopic = this.hideAfter;
        if (!this.script && !this.msg)
          return errormsg("Topic " + this.name + " has neither script nor msg attributes.");
        if (this.script) {
          if (typeof this.script !== "function")
            return errormsg("script for topic " + this.name + " is not a function.");
          this.script.bind(obj)({ char: obj, player: player(), topic: this });
        }
        if (this.msg) {
          if (typeof this.msg !== "string")
            return errormsg("msg for topic " + this.name + " is not a string.");
          msg(this.msg, { char: obj, topic: this });
        }
        this.showHideList(this.nowShow, true);
        this.showHideList(this.nowHide, false);
        this.count++;
        world.endTurn(world.SUCCESS);
      },
      isTopicVisible: function(char2) {
        return this.showTopic && !this.hideTopic && this.belongsTo(char2.name) && this.isVisible(char2);
      },
      showHideList: function(list2, isShow) {
        if (typeof list2 === "string") {
          log("WARNING: " + (isShow ? "nowShow" : "nowHide") + " for topic " + this.name + " is a string.");
          return;
        }
        for (let s of list2) {
          const t = util.findTopic(s);
          if (t) {
            t[isShow ? "showTopic" : "hideTopic"] = true;
          } else {
            log("WARNING: Topic " + this.name + " wants to now show/hide a non-existent topic, " + s);
          }
        }
      },
      show: function() {
        return this.showTopic = true;
      },
      hide: function() {
        return this.hideTopic = true;
      }
    };
  };
  const parser = {};
  parser.currentCommand = null;
  parser.pronouns = {};
  parser.specialText = {};
  parser.debug = false;
  parser.BAD_SPECIAL = -14;
  parser.DISALLOWED_MULTIPLE = -16;
  parser.NO_OBJECT = -13;
  parser.NONE_FOR_ALL = -12;
  parser.NO_MATCH = -100;
  parser.parse = function(inputText) {
    io.startCommand();
    settings.performanceLogStart();
    settings.performanceLog("Start command");
    if (parser.override) {
      parser.msg("Parser overriden");
      parser.override(inputText);
      delete parser.override;
      return;
    }
    if (settings.parserPreprocessor)
      inputText = settings.parserPreprocessor(inputText);
    parser.inputTexts = parser.keepTogether(inputText) ? [inputText] : inputText.split(lang.command_split_regex);
    while (parser.inputTexts.length > 0) {
      const s = parser.inputTexts.shift();
      settings.performanceLog('Start "' + s + '"');
      parser.parseSingle(s);
      settings.performanceLog("Done");
    }
  };
  parser.abort = function() {
    if (parser.inputTexts.length === 0)
      return;
    parsermsg(lang.abort_cmds + ": " + parser.inputTexts.join("; "));
    parser.inputTexts = [];
  };
  parser.parseSingle = function(inputText) {
    parser.msg("Input string: " + inputText);
    if (inputText) {
      const res = parser.findCommand(inputText);
      if (typeof res === "string") {
        parsermsg(res);
        parser.abort();
        world.endTurn(world.PARSER_FAILURE);
        return;
      }
      if (res.tmp.score < 0) {
        parsermsg(res.tmp.error);
        parser.abort();
        world.endTurn(world.PARSER_FAILURE);
        return;
      }
      parser.currentCommand = res;
    }
    settings.performanceLog("Command found");
    let needToDisAmbigFlag = false;
    for (let i2 = 0; i2 < parser.currentCommand.tmp.objects.length; i2++) {
      if (!Array.isArray(parser.currentCommand.tmp.objects[i2]))
        continue;
      for (let j = 0; j < parser.currentCommand.tmp.objects[i2].length; j++) {
        if (parser.currentCommand.tmp.objects[i2][j] instanceof Array) {
          if (parser.currentCommand.tmp.objects[i2][j].length === 1) {
            parser.currentCommand.tmp.objects[i2][j] = parser.currentCommand.tmp.objects[i2][j][0];
          } else {
            needToDisAmbigFlag = true;
            parser.currentCommand.tmp.disambiguate1 = i2;
            parser.currentCommand.tmp.disambiguate2 = j;
            const fn = io.menuFunctions[settings.funcForDisambigMenu];
            fn(lang.disambig_msg, parser.currentCommand.tmp.objects[i2][j], function(result2) {
              parser.currentCommand.tmp.objects[parser.currentCommand.tmp.disambiguate1][parser.currentCommand.tmp.disambiguate2] = result2;
              parser.parseSingle(null);
            }, function(input2) {
              parser.parse(input2);
            });
          }
        }
      }
    }
    if (!needToDisAmbigFlag) {
      settings.performanceLog("About to execute");
      parser.execute();
    }
  };
  parser.overrideWith = function(fn) {
    parser.override = fn;
  };
  parser.execute = function() {
    parser.inspect();
    let inEndTurnFlag = false;
    try {
      if (parser.currentCommand.tmp.objects.length > 0 && Array.isArray(parser.currentCommand.tmp.objects[0]) && !parser.currentCommand.all) {
        for (let obj of parser.currentCommand.tmp.objects[0]) {
          parser.pronouns[obj.parserPronouns ? obj.parserPronouns.objective : obj.pronouns.objective] = obj;
        }
      }
      settings.performanceLog("About to run command script");
      const outcome = parser.currentCommand.script(parser.currentCommand.tmp.objects);
      if (outcome === void 0 && settings.playMode === "dev")
        log("WARNING: " + parser.currentCommand.name + " command did not return a result to indicate success or failure.");
      inEndTurnFlag = true;
      settings.performanceLog("About to run world.endTurn");
      world.endTurn(outcome);
    } catch (err) {
      if (inEndTurnFlag) {
        printError("Hit a coding error trying to process world.endTurn after that command.", err);
      } else {
        printError("Hit a coding error trying to process the command `" + parser.currentCommand.cmdString + "'.", err);
      }
    }
    settings.performanceLog("All done");
  };
  parser.findCommand = function(inputText) {
    let cmdString = inputText.toLowerCase().trim().replace(/\s+/g, " ");
    if (settings.convertNumbersInParser) {
      cmdString = lang.convertNumbers(cmdString);
    }
    settings.performanceLog("Numbers converted");
    let bestMatch;
    for (const el of commands) {
      el.matchItems(cmdString, inputText);
      if (el.tmp.score > parser.NO_MATCH) {
        if (!bestMatch || el.tmp.score > bestMatch.tmp.score) {
          parser.msg("Candidate accepted!");
          bestMatch = el;
        }
      }
    }
    settings.performanceLog("Best match found");
    if (!bestMatch) {
      io.reset();
      if (settings.playMode === "dev")
        log("Command was [" + inputText + "]");
      return lang.not_known_msg;
    }
    bestMatch.tmp.string = inputText;
    bestMatch.tmp.cmdString = cmdString;
    parser.msg("This is the one:" + bestMatch.name);
    return bestMatch;
  };
  parser.matchToNames = function(s, scopes, cmdParams, res) {
    const objectNames = s.split(lang.joiner_regex).map(function(el) {
      return el.trim();
    }).filter((e) => e);
    let objectWordList = [], score = 0;
    for (let s2 of objectNames) {
      const n = parser.matchToName(lang.article_filter_regex.exec(s2)[1], scopes, cmdParams, objectWordList);
      if (n < 0) {
        res.score = n;
        res.error_s = s2;
        return;
      }
      if (n > score)
        score = n;
    }
    if (objectWordList.length > 1 && !cmdParams.multiple) {
      res.error = lang.no_multiples_msg;
      res.score = parser.DISALLOWED_MULTIPLE;
      return;
    }
    res.objects.push(objectWordList);
    res.score += score;
  };
  parser.matchToName = function(s, scopes, cmdParams, objectWordList) {
    let [objDisambigList, n] = this.findInScope(s, scopes, cmdParams);
    if (n === 0)
      return parser.NO_OBJECT;
    const objDisambigList2 = [];
    for (const el of objDisambigList) {
      let flag = false;
      for (const el1 of objectWordList) {
        for (const el2 of el1) {
          if (el2.name === el.name)
            flag = true;
        }
      }
      if (flag) {
        parser.msg("..Skipping duplicate: " + el.name);
      } else {
        objDisambigList2.push(el);
      }
    }
    if (objDisambigList2.length > 0)
      objectWordList.push(objDisambigList2);
    return n;
  };
  parser.findInScope = function(s, scopes, cmdParams) {
    parser.msg("Now matching: " + s);
    for (const key in lang.pronouns) {
      if (s === lang.pronouns[key].objective && parser.pronouns[lang.pronouns[key].objective]) {
        return [[parser.pronouns[lang.pronouns[key].objective]], 1];
      }
    }
    for (let i2 = 0; i2 < scopes.length; i2++) {
      parser.msg("..Looking for a match for: " + s + " (scope " + (i2 + 1) + ")");
      const objList = this.findInList(s, scopes[i2], cmdParams);
      if (objList.length > 0) {
        return [objList, scopes.length - i2];
      }
    }
    return [[], 0];
  };
  parser.findInList = function(s, list2, cmdParams) {
    let res = [];
    let score = 0;
    let n;
    parser.msg("-> Trying to match: " + s);
    for (let item2 of list2) {
      parser.msg("-> Considering: " + item2.name);
      n = this.scoreObjectMatch(s, item2, cmdParams);
      if (n >= 0)
        parser.msg(item2.name + " scores " + n);
      if (n > score) {
        res = [];
        score = n;
      }
      if (n >= score) {
        res.push(item2);
      }
    }
    parser.msg(res.length > 1 ? "Cannot decide between: " + res.map((el) => el.name).join(", ") : res.length === 1 ? "..Going with: " + res[0].name : "Found no suitable objects");
    return res;
  };
  parser.itemSetup = function(item2) {
    item2.parserOptionsSet = true;
    item2.parserItemName = item2.alias.toLowerCase();
    item2.parserItemNameParts = array.combos(item2.parserItemName.split(" "));
    if (item2.pattern) {
      if (!item2.regex)
        item2.regex = new RegExp("^(" + item2.pattern + ")$");
      if (!item2.synonyms)
        item2.synonyms = item2.pattern.split("|");
    }
    if (item2.synonyms) {
      if (!Array.isArray(item2.synonyms))
        throw 'Expected "synonyms" to be an array for ' + item2.name;
      item2.synonyms.forEach(function(el) {
        if (el.includes(" ")) {
          item2.parserItemNameParts = item2.parserItemNameParts.concat(el.split(" "));
        }
      });
    }
  };
  parser.scoreObjectMatch = function(s, item2, cmdParams) {
    if (!item2.parserOptionsSet)
      parser.itemSetup(item2);
    item2.alias.toLowerCase();
    let res = -1;
    if (cmdParams.items && cmdParams.items.includes(item2.name)) {
      parser.msg("The command specifically mentions this item, so highest priority, score 100");
      res = 100;
    } else if (s === item2.parserItemName) {
      parser.msg("The player has used the exact alias, score 60");
      res = 60;
    } else if (item2.regex && item2.regex.test(s)) {
      parser.msg("The player has used the exact string allowed in the regex, score 55");
      parser.msg("" + item2.regex);
      parser.msg(">" + s + "<");
      res = 55;
    } else if (item2.parserItemNameParts && item2.parserItemNameParts.some(function(el) {
      return el === s;
    })) {
      parser.msg("The player has matched a complete word, but not the full phrase, score 50");
      res = 50;
    } else if (item2.parserItemName.startsWith(s)) {
      parser.msg("the player has used a string that matches the start of the alias, score length + 15");
      res = s.length + 15;
    } else if (item2.synonyms && item2.synonyms.some(function(el) {
      return el.startsWith(s);
    })) {
      parser.msg("the player has used a string that matches the start of an alt name, score length + 10");
      res = s.length + 10;
    } else if (item2.parserItemNameParts && item2.parserItemNameParts.some(function(el) {
      return el.startsWith(s);
    })) {
      parser.msg("the player has used a string that matches the start of an alt name, score length");
      res = s.length;
    } else {
      return -1;
    }
    if (item2[cmdParams.attName]) {
      parser.msg("bonus 20 as item has attribute " + cmdParams.attName);
      res += 20;
    }
    if (item2.parserPriority) {
      parser.msg("item.parserPriority is " + item2.parserPriority);
      res += item2.parserPriority;
    }
    item2.cmdMatch = s;
    return res;
  };
  parser.inspect = function() {
    if (!parser.debug)
      return;
    let s = "PARSER RESULT:<br/>";
    s += "Input text: " + parser.currentCommand.string + "<br/>";
    s += "Matched command: " + parser.currentCommand.name + "<br/>";
    s += "Matched regex: " + parser.currentCommand.tmp.regex + "<br/>";
    s += "Match score: " + parser.currentCommand.tmp.score + "<br/>";
    if (parser.currentCommand.all) {
      s += "Player typed ALL<br/>";
    }
    s += "Objects/texts (" + parser.currentCommand.tmp.objects.length + "):<br/>";
    for (let obj of parser.currentCommand.tmp.objects) {
      if (typeof obj === "string") {
        s += "&nbsp;&nbsp;&nbsp;&nbsp;Text: " + obj + "<br/>";
      } else if (Array.isArray(obj)) {
        s += "&nbsp;&nbsp;&nbsp;&nbsp;Objects:" + obj.map(function(el) {
          return el.name;
        }).join(", ") + "<br/>";
      } else if (obj.name) {
        s += "&nbsp;&nbsp;&nbsp;&nbsp;Something called :" + obj + "<br/>";
      } else {
        s += "&nbsp;&nbsp;&nbsp;&nbsp;Something else:" + obj + "<br/>";
      }
    }
    debugmsg(s);
  };
  parser.specialText.ignore = {
    error: function(text) {
      return false;
    },
    exec: function(text) {
      return false;
    }
  };
  parser.specialText.text = {
    error: function(text) {
      return false;
    },
    exec: function(text) {
      return text;
    }
  };
  parser.specialText.fluid = {
    error: function(text) {
      if (settings.fluids.includes(text))
        return false;
      return processText(lang.not_a_fluid_here, { text });
    },
    exec: function(text) {
      return text;
    }
  };
  parser.specialText.number = {
    error: function(text) {
      if (text.match(/^\d+$/))
        return false;
      return !lang.numberUnits.includes(text);
    },
    exec: function(text) {
      if (text.match(/^\d+$/))
        return parseInt(text);
      return lang.numberUnits.indexOf(text);
    }
  };
  parser.msg = function(...ary) {
    if (parser.debug) {
      for (let s of ary)
        debugmsg("P&gt; " + s);
    }
  };
  parser.getScope = function(cmdParams) {
    if (!cmdParams.scope) {
      console.log("WARNING: No scope (or scope not found) in command");
      return world.scope;
    }
    if (cmdParams.extendedScope) {
      return parser.scopeFromWorld(cmdParams.allScope ? cmdParams.allScope : cmdParams.scope);
    }
    return parser.scopeFromScope(cmdParams.allScope ? cmdParams.allScope : cmdParams.scope);
  };
  parser.getScopes = function(cmdParams) {
    const baseScope = cmdParams.extendedScope ? parser.scopeFromWorld(cmdParams.scope) : parser.scopeFromScope(cmdParams.scope);
    return [baseScope, world.scope];
  };
  parser.scopeFromScope = function(fn, options) {
    const list2 = [];
    for (const o of world.scope) {
      if (fn(o, options)) {
        list2.push(o);
      }
    }
    return list2;
  };
  parser.scopeFromWorld = function(fn, options) {
    const list2 = [];
    for (const key in w$1) {
      if (fn(w$1[key], options)) {
        list2.push(w$1[key]);
      }
    }
    return list2;
  };
  parser.keepTogether = function(s) {
    return lang.regex.MetaUserComment.test(s);
  };
  parser.isInWorld = function(item2) {
    return true;
  };
  parser.isReachable = function(item2) {
    return item2.scopeStatus.canReach && world.ifNotDark(item2);
  };
  parser.isVisible = function(item2) {
    return item2.scopeStatus.visible && world.ifNotDark(item2);
  };
  parser.isPresent = function(item2) {
    return parser.isHere(item2) || parser.isHeld(item2);
  };
  parser.isPresentOrMe = function(item2) {
    return parser.isHere(item2) || parser.isHeld(item2) || item2 === player();
  };
  parser.isHeldNotWorn = function(item2) {
    return item2.isAtLoc(player().name, world.PARSER) && world.ifNotDark(item2) && !item2.getWorn();
  };
  parser.isHeld = function(item2) {
    return item2.isAtLoc(player().name, world.PARSER) && world.ifNotDark(item2);
  };
  parser.isHeldByNpc = function(item2) {
    const npcs = parser.scopeFromScope(parser.isReachable).filter((el) => el.npc);
    for (let npc2 of npcs) {
      if (item2.isAtLoc(npc2.name, world.PARSER))
        return true;
    }
    return false;
  };
  parser.isWorn = function(item2) {
    return item2.isAtLoc(player().name, world.PARSER) && world.ifNotDark(item2) && item2.getWorn();
  };
  parser.isWornByNpc = function(item2) {
    const npcs = parser.scopeFromScope(parser.isReachable).filter((el) => el.npc);
    for (let npc2 of npcs) {
      if (item2.isAtLoc(npc2.name, world.PARSER) && item2.getWorn())
        return true;
    }
    return false;
  };
  parser.isNpcOrHere = function(item2) {
    return item2.isAtLoc(player().loc, world.PARSER) && world.ifNotDark(item2) || item2.npc || item2.player;
  };
  parser.isNpcAndHere = function(item2) {
    return player().onPhoneTo === item2.name || item2.isAtLoc(player().loc, world.PARSER) && (item2.npc || item2.player);
  };
  parser.isHere = function(item2) {
    return item2.isAtLoc(player().loc, world.PARSER) && world.ifNotDark(item2);
  };
  parser.isForSale = function(item2) {
    return item2.isForSale && item2.isForSale(player().loc) && world.ifNotDark(item2);
  };
  parser.isContained = function(item2) {
    const containers = parser.scopeFromScope(parser.isReachable).filter((el) => el.container);
    for (let container2 of containers) {
      if (container2.closed)
        continue;
      if (item2.isAtLoc(container2.name, world.PARSER))
        return true;
    }
    return false;
  };
  parser.isLocationContained = function(item2) {
    const containers = parser.scopeFromScope(parser.isReachable).filter((el) => el.container);
    for (let container2 of containers) {
      if (container2.closed)
        continue;
      if (container2.isUltimatelyHeldBy(player()))
        continue;
      if (item2.isAtLoc(container2.name, world.PARSER))
        return true;
    }
    return false;
  };
  parser.isHereOrContained = function(item2) {
    if (parser.isHere(item2))
      return true;
    return parser.isContained(item2);
  };
  parser.isHereOrLocationContained = function(item2) {
    if (item2 === loc$1())
      return false;
    if (parser.isHere(item2))
      return true;
    return parser.isLocationContained(item2);
  };
  parser.isUnconstructed = function(item2) {
    return !item2.loc && item2.construction;
  };
  const cmdDirections = [];
  for (let exit of lang.exit_list) {
    if (exit.type === "nocmd")
      continue;
    cmdDirections.push(exit.name);
    cmdDirections.push(exit.abbrev.toLowerCase());
    if (exit.alt)
      cmdDirections.push(exit.alt);
  }
  const commands = [];
  new Cmd("MetaHello", {
    script: lang.helloScript
  });
  new Cmd("MetaHelp", {
    script: lang.helpScript
  });
  new Cmd("MetaHint", {
    script: function() {
      if (settings.hintResponses) {
        respond({ char: { msg: function(s) {
          settings.hintResponsesInGame ? msg(s) : metamsg(s);
        } } }, settings.hintResponses);
        return world.SUCCESS_NO_TURNSCRIPTS;
      }
      if (settings.hintSheetData) {
        io.showHintSheet();
        return world.SUCCESS_NO_TURNSCRIPTS;
      }
      return lang.hintScript();
    }
  });
  new Cmd("MetaCredits", {
    script: lang.aboutScript
  });
  new Cmd("MetaDarkMode", {
    script: io.toggleDarkMode
  });
  new Cmd("MetaNarrowMode", {
    script: io.toggleNarrowMode
  });
  new Cmd("MetaAutoScrollMode", {
    script: io.toggleAutoScrollMode
  });
  new Cmd("MetaPlainFontMode", {
    script: io.togglePlainFontMode
  });
  new Cmd("MetaSilent", {
    script: function() {
      if (settings.silent) {
        metamsg(lang.mode_silent_off);
        settings.silent = false;
      } else {
        metamsg(lang.mode_silent_on);
        settings.silent = true;
        ambient();
      }
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaWarnings", {
    script: lang.warningsScript
  });
  new Cmd("MetaSpoken", {
    script: function() {
      if (io.spoken) {
        io.spoken = false;
        metamsg(lang.spoken_off);
      } else {
        io.spoken = true;
        metamsg(lang.spoken_on);
      }
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaIntro", {
    script: function() {
      io.spoken = true;
      if (typeof settings.intro === "string") {
        msg(settings.intro);
      } else {
        for (let el of settings.intro)
          msg(el);
      }
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaBrief", {
    script: function() {
      settings.verbosity = world.BRIEF;
      metamsg(lang.mode_brief);
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaTerse", {
    script: function() {
      settings.verbosity = world.TERSE;
      metamsg(lang.mode_terse);
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaVerbose", {
    script: function() {
      settings.verbosity = world.VERBOSE;
      metamsg(lang.mode_verbose);
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaTranscript", {
    script: lang.transcriptScript
  });
  new Cmd("MetaTranscriptStart", {
    script: function() {
      if (saveLoad.transcript) {
        metamsg(lang.transcript_already_on);
        return world.FAILED;
      }
      saveLoad.transcriptClear();
      saveLoad.transcriptStart();
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaTranscriptOn", {
    script: function() {
      if (saveLoad.transcript) {
        metamsg(lang.transcript_already_on);
        return world.FAILED;
      }
      saveLoad.transcriptStart();
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaTranscriptOff", {
    script: function() {
      if (!saveLoad.transcript) {
        metamsg(lang.transcript_already_off);
        return world.FAILED;
      }
      saveLoad.transcriptEnd();
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaTranscriptClear", {
    script: function() {
      saveLoad.transcriptClear();
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaTranscriptShow", {
    script: function() {
      saveLoad.transcriptShow();
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaUserComment", {
    script: function(arr) {
      commentmsg("Comment: " + arr[0]);
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects: [
      { special: "text" }
    ]
  });
  new Cmd("MetaSave", {
    script: lang.saveLoadScript
  });
  new Cmd("MetaSaveOverwriteGame", {
    script: function(arr) {
      saveLoad.saveGame(arr[0], true);
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects: [
      { special: "text" }
    ]
  });
  new Cmd("MetaSaveGame", {
    script: function(arr) {
      if (settings.localStorageDisabled) {
        saveLoad.saveGameAsFile(arr[0]);
      } else {
        saveLoad.saveGame(arr[0]);
      }
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects: [
      { special: "text" }
    ]
  });
  new Cmd("MetaFileSaveGame", {
    script: function(arr) {
      saveLoad.saveGameAsFile(arr[0]);
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects: [
      { special: "text" }
    ]
  });
  new Cmd("MetaLoad", {
    script: function(arr) {
      if (settings.localStorageDisabled) {
        document.getElementById("fileDialog").click();
      } else {
        lang.saveLoadScript();
      }
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects: []
  });
  new Cmd("MetaLoadGame", {
    script: function(arr) {
      saveLoad.loadGameFromLS(arr[0]);
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects: [
      { special: "text" }
    ]
  });
  new Cmd("MetaFileLoadGame", {
    script: function(arr) {
      document.getElementById("fileDialog").click();
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects: [
      { special: "text" }
    ]
  });
  new Cmd("MetaDir", {
    script: function() {
      saveLoad.dirGame();
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaDeleteGame", {
    script: function(arr) {
      saveLoad.deleteGame(arr[0]);
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects: [
      { special: "text" }
    ]
  });
  new Cmd("MetaUndo", {
    script: function() {
      if (settings.maxUndo === 0) {
        metamsg(lang.undo_disabled);
        return world.FAILED;
      }
      if (world.gameState.length < 2) {
        metamsg(lang.undo_not_available);
        return world.FAILED;
      }
      world.gameState.pop();
      const gameState = world.gameState[world.gameState.length - 1];
      metamsg(lang.undo_done);
      saveLoad.loadTheWorld(gameState);
      w$1[player().loc].description();
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaAgain", {
    script: function() {
      return io.againOrOops(true);
    }
  });
  new Cmd("MetaOops", {
    script: function() {
      return io.againOrOops(false);
    }
  });
  new Cmd("MetaRestart", {
    script: function() {
      askText(lang.restart_are_you_sure, function(result2) {
        if (result2.match(lang.yes_regex)) {
          location.reload();
        } else {
          metamsg(lang.restart_no);
        }
      });
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("MetaPronouns", {
    script: function() {
      metamsg("See the developer console (F12) for the current pronouns");
      console.log(parser.pronouns);
    }
  });
  new Cmd("MetaScore", {
    script: function() {
      metamsg(lang.scores_not_implemented);
    }
  });
  new Cmd("MetaTopicsNote", {
    script: lang.topicsScript
  });
  new Cmd("Look", {
    script: function() {
      loc$1().description(true);
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    },
    score: 50
  });
  new Cmd("Exits", {
    script: function() {
      msg(lang.can_go, { char: player() });
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("Inv", {
    script: function() {
      const listOfOjects = player().getContents(world.INVENTORY);
      msg(lang.inventory_prefix + " " + formatList(listOfOjects, {
        article: INDEFINITE,
        lastSep: lang.list_and,
        modified: true,
        nothing: lang.list_nothing,
        loc: player().name
      }) + ".", { char: player() });
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("Map", {
    script: function() {
      if (typeof showMap !== "undefined") {
        showMap();
        return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
      } else {
        const zone = w$1[player().loc];
        if (!zone.zone) {
          return failedmsg(lang.no_map);
        } else {
          const flag = zone.drawMap();
          if (!flag)
            return failedmsg(lang.no_map);
          return world.SUCCESS_NO_TURNSCRIPTS;
        }
      }
    }
  });
  new Cmd("Topics", {
    attName: "topics",
    objects: [
      { scope: parser.isNpcAndHere }
    ],
    defmsg: lang.no_topics
  });
  new Cmd("Wait", {
    script: function() {
      msg(lang.wait_msg);
      return world.SUCCESS;
    }
  });
  new Cmd("Smell", {
    script: function() {
      if (loc$1().smell) {
        printOrRun(player(), loc$1(), "smell");
      } else if (loc$1()._region && regions[loc$1()._region].smell) {
        msg(regions[loc$1()._region].smell);
      } else {
        msg(lang.no_smell, { char: player() });
      }
      return world.SUCCESS;
    }
  });
  new Cmd("Listen", {
    script: function() {
      if (loc$1().listen) {
        printOrRun(player(), loc$1(), "listen");
      } else if (loc$1()._region && regions[loc$1()._region].listen) {
        msg(regions[loc$1()._region].listen);
      } else {
        msg(lang.no_listen, { char: player() });
      }
      return world.SUCCESS;
    }
  });
  new Cmd("PurchaseFromList", {
    script: function() {
      const l = [];
      for (let key in w$1) {
        if (parser.isForSale(w$1[key])) {
          const price = w$1[key].getBuyingPrice(player());
          const row = [sentenceCase(w$1[key].getName()), world.Money(price)];
          row.push(price > player().money ? "-" : "{cmd:buy " + w$1[key].alias + ":" + buy + "}");
          l.push(row);
        }
      }
      if (l.length === 0) {
        return failedmsg(lang.nothing_for_sale);
      }
      msg(lang.current_money + ": " + world.Money(player().money));
      msgTable(l, lang.buy_headings);
      return world.SUCCESS_NO_TURNSCRIPTS;
    }
  });
  new Cmd("GetFluid", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { special: "fluid" }
    ],
    score: 5,
    script: function(objects) {
      const options = { char: player(), fluid: objects[0] };
      if (!util.findSource(options))
        return failedmsg(lang.no_fluid_here, options);
      return failedmsg(lang.cannot_get_fluid, options);
    }
  });
  new Cmd("Examine", {
    npcCmd: true,
    objects: [
      { scope: parser.isPresent, multiple: true }
    ],
    defmsg: lang.default_examine
  });
  new Cmd("LookAt", {
    // used for NPCs
    npcCmd: true,
    attName: "examine",
    objects: [
      { scope: parser.isPresentOrMe }
    ],
    defmsg: lang.default_examine
  });
  new Cmd("LookOut", {
    npcCmd: true,
    rules: [cmdRules.isPresent],
    objects: [
      { scope: parser.isPresent }
    ],
    attName: "lookout",
    defmsg: lang.cannot_look_out
  });
  new Cmd("LookBehind", {
    npcCmd: true,
    rules: [cmdRules.isPresent],
    attName: "lookbehind",
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.nothing_there
  });
  new Cmd("LookUnder", {
    npcCmd: true,
    rules: [cmdRules.isPresent],
    attName: "lookunder",
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.nothing_there
  });
  new Cmd("LookThrough", {
    npcCmd: true,
    rules: [cmdRules.isPresent],
    attName: "lookthrough",
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.nothing_there
  });
  new Cmd("LookInside", {
    npcCmd: true,
    rules: [cmdRules.isPresent],
    attName: "lookinside",
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.nothing_inside
  });
  new Cmd("Search", {
    npcCmd: true,
    rules: [cmdRules.isPresent],
    attName: "search",
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.nothing_there
  });
  new Cmd("Take", {
    npcCmd: true,
    rules: [cmdRules.isHereAlready, cmdRules.testManipulate],
    objects: [
      { scope: parser.isHereOrContained, allScope: parser.isHereOrLocationContained, multiple: true }
    ],
    defmsg: lang.cannot_take
  });
  new Cmd("Drop", {
    npcCmd: true,
    rules: [cmdRules.isHeldNotWorn, cmdRules.testManipulate],
    objects: [
      { scope: parser.isHeld, multiple: true }
    ],
    default: function(options) {
      falsemsg(options.item.isAtLoc(options.char) ? lang.cannot_drop : lang.not_carrying, options);
    }
  });
  new Cmd("Wear2", {
    npcCmd: true,
    rules: [cmdRules.isHeldNotWorn, cmdRules.isHeld, cmdRules.testManipulate],
    attName: "wear",
    objects: [
      { scope: parser.isHeld, multiple: true }
    ],
    default: function(options) {
      falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.cannot_wear, options);
    }
  });
  new Cmd("Wear", {
    npcCmd: true,
    rules: [cmdRules.isHeldNotWorn, cmdRules.testManipulate],
    objects: [
      { scope: parser.isHeld, multiple: true }
    ],
    default: function(options) {
      falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.cannot_wear, options);
    }
  });
  new Cmd("Remove", {
    npcCmd: true,
    rules: [cmdRules.isWorn, cmdRules.testManipulate],
    objects: [
      { scope: parser.isWorn, multiple: true }
    ],
    default: function(options) {
      falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.not_wearing, options);
    }
  });
  new Cmd("Remove2", {
    npcCmd: true,
    rules: [cmdRules.isWorn, cmdRules.testManipulate],
    attName: "remove",
    objects: [
      { scope: parser.isWorn, multiple: true }
    ],
    default: function(options) {
      falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.not_wearing, options);
    }
  });
  new Cmd("Read", {
    npcCmd: true,
    rules: [cmdRules.isPresent],
    objects: [
      { scope: parser.isHeld, multiple: true }
    ],
    defmsg: lang.cannot_read
  });
  new Cmd("Purchase", {
    npcCmd: true,
    rules: [cmdRules.testManipulate],
    objects: [
      { scope: parser.isForSale }
    ],
    defmsg: lang.cannot_purchase_here
  });
  new Cmd("Sell", {
    npcCmd: true,
    rules: [cmdRules.isHeldNotWorn, cmdRules.testManipulate],
    objects: [
      { scope: parser.isHeld, multiple: true }
    ],
    defmsg: lang.cannot_sell_here
  });
  new Cmd("Smash", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresent],
    objects: [
      { scope: parser.isHeld, multiple: true }
    ],
    defmsg: lang.cannot_smash
  });
  new Cmd("Turn", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isHere }
    ],
    defmsg: lang.cannot_turn
  });
  new Cmd("TurnLeft", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isHere }
    ],
    defmsg: lang.cannot_turn
  });
  new Cmd("TurnRight", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isHere }
    ],
    defmsg: lang.cannot_turn
  });
  new Cmd("SwitchOn", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    attName: "switchon",
    cmdCategory: "SwitchOn",
    objects: [
      { scope: parser.isHeld, multiple: true }
    ],
    defmsg: lang.cannot_switch_on
  });
  new Cmd("SwitchOn2", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    attName: "switchon",
    cmdCategory: "SwitchOn",
    objects: [
      { scope: parser.isHeld, multiple: true }
    ],
    defmsg: lang.cannot_switch_on
  });
  new Cmd("SwitchOff2", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    attName: "switchoff",
    cmdCategory: "SwitchOff",
    objects: [
      { scope: parser.isHeld, multiple: true, attName: "switchon" }
    ],
    defmsg: lang.cannot_switch_off
  });
  new Cmd("SwitchOff", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    attName: "switchoff",
    cmdCategory: "SwitchOff",
    objects: [
      { scope: parser.isHeld, multiple: true, attName: "switchoff" }
    ],
    defmsg: lang.cannot_switch_off
  });
  new Cmd("Open", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent, multiple: true, attName: "open" }
    ],
    defmsg: lang.cannot_open
  });
  new Cmd("OpenWith", {
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent, multiple: true, attName: "open" },
      { scope: parser.isHeld, multiple: true }
    ],
    defmsg: lang.cannot_open_with
  });
  new Cmd("Close", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent, multiple: true, attName: "close" }
    ],
    defmsg: lang.cannot_close
  });
  new Cmd("Lock", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent, multiple: true, attName: "lock" }
    ],
    defmsg: lang.cannot_lock
  });
  new Cmd("LockWith", {
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent, attName: "lock" },
      { scope: parser.isHeld, attName: "key" }
    ],
    defmsg: lang.cannot_lock_with
  });
  new Cmd("Unlock", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent, multiple: true, attName: "unlock" }
    ],
    defmsg: lang.cannot_unlock
  });
  new Cmd("UnlockWith", {
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent, attName: "unlock" },
      { scope: parser.isHeld, attName: "key" }
    ],
    defmsg: lang.cannot_unlock_with
  });
  new Cmd("Push", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.nothing_useful
  });
  new Cmd("Pull", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.nothing_useful
  });
  new Cmd("Fill", {
    npcCmd: true,
    rules: [cmdRules.testManipulate],
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.cannot_fill
  });
  new Cmd("Empty", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { scope: parser.isPresent }
    ],
    defmsg: lang.cannot_empty
  });
  new Cmd("SmellItem", {
    npcCmd: true,
    attName: "smell",
    objects: [
      { scope: parser.isPresent, attName: "smell" }
    ],
    defmsg: lang.cannot_smell
  });
  new Cmd("ListenToItem", {
    npcCmd: true,
    attName: "listen",
    objects: [
      { scope: parser.isPresent, attName: "listen" }
    ],
    defmsg: lang.cannot_listen
  });
  new Cmd("Eat", {
    npcCmd: true,
    rules: [cmdRules.isHeldNotWorn, cmdRules.testManipulate],
    objects: [
      { special: "text" },
      { scope: parser.isHeld, multiple: true, attName: "ingest" }
    ],
    defmsg: lang.cannot_eat
  });
  new Cmd("Drink", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { special: "text" },
      { scope: parser.isPresent, attName: "ingest" }
    ],
    defmsg: lang.cannot_drink
  });
  new Cmd("Ingest", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { special: "text" },
      { scope: parser.isPresent, attName: "ingest" }
    ],
    defmsg: lang.cannot_ingest
  });
  new Cmd("Sit", {
    npcCmd: true,
    cmdCategory: "Posture",
    rules: [cmdRules.testPosture],
    attName: "siton",
    objects: [],
    script: function() {
      const objs = scopeBy((el) => el.siton && el.isAtLoc(player().loc));
      log(objs);
      if (objs.length === 0)
        return failedmsg(lang.no_sit_object);
      return objs[0].siton({ char: player(), item: objs[0] }) ? world.SUCCESS : world.FAILED;
    }
  });
  new Cmd("Recline", {
    npcCmd: true,
    cmdCategory: "Posture",
    rules: [cmdRules.testPosture],
    attName: "reclineon",
    objects: [],
    script: function() {
      const objs = scopeBy((el) => el.reclineon && el.isAtLoc(player().loc));
      log(objs);
      if (objs.length === 0)
        return failedmsg(lang.no_recline_object);
      return objs[0].reclineon({ char: player(), item: objs[0] }) ? world.SUCCESS : world.FAILED;
    }
  });
  new Cmd("SitOn", {
    npcCmd: true,
    cmdCategory: "Posture",
    rules: [cmdRules.testPosture, cmdRules.isHere],
    attName: "siton",
    objects: [
      { scope: parser.isHere, attName: "assumePosture" }
    ],
    defmsg: lang.cannot_sit_on
  });
  new Cmd("StandOn", {
    npcCmd: true,
    cmdCategory: "Posture",
    rules: [cmdRules.testPosture, cmdRules.isHere],
    attName: "standon",
    objects: [
      { scope: parser.isHere, attName: "assumePosture" }
    ],
    defmsg: lang.cannot_stand_on
  });
  new Cmd("ReclineOn", {
    npcCmd: true,
    cmdCategory: "Posture",
    rules: [cmdRules.testPosture, cmdRules.isHere],
    attName: "reclineon",
    objects: [
      { scope: parser.isHere, attName: "assumePosture" }
    ],
    defmsg: lang.cannot_recline_on
  });
  new Cmd("GetOff", {
    npcCmd: true,
    cmdCategory: "Posture",
    score: 5,
    // to give priority over TAKE
    rules: [cmdRules.testPosture, cmdRules.isHere],
    attName: "getoff",
    objects: [
      { scope: parser.isHere, attName: "assumePosture" }
    ],
    defmsg: lang.already
  });
  new Cmd("Use", {
    npcCmd: true,
    rules: [cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects: [
      { scope: parser.isPresent }
    ],
    script: function(objects) {
      const obj = objects[0][0];
      const options = { char: player(), item: obj, verb: "use" };
      if (obj.useFunction) {
        const result2 = obj.useFunction(options);
        return result2 ? world.SUCCESS : world.FAILED;
      }
      if (obj.use) {
        const result2 = this.processCommand(options);
        return result2 ? world.SUCCESS : world.FAILED;
      }
      if (obj.useDefaultsTo) {
        const cmd = findCmd(obj.useDefaultsTo(player()));
        if (cmd) {
          const result2 = cmd.processCommand(options);
          return result2 ? world.SUCCESS : world.FAILED;
        } else {
          throw new Error("USE command defaulting to unknown command " + obj.useDefaultsTo());
        }
      }
      this.default({ char: player(), item: obj });
      return world.FAILED;
    },
    defmsg: lang.cannot_use
  });
  new Cmd("TalkTo", {
    rules: [cmdRules.canTalkTo],
    attName: "talkto",
    objects: [
      { scope: parser.isNpcAndHere }
    ],
    defmsg: lang.cannot_talk_to
  });
  new Cmd("Say", {
    script: function(arr) {
      const l = [];
      for (let key in w$1) {
        if (w$1[key].sayCanHear && w$1[key].sayCanHear(player(), arr[0]))
          l.push(w$1[key]);
      }
      l.sort(function(a, b) {
        return b.sayPriority + b.sayBonus - (a.sayPriority + b.sayBonus);
      });
      if (l.length === 0) {
        return world.SUCCESS;
      }
      const options = { char: player(), text: sentenceCase(arr[1]) };
      if (settings.givePlayerSayMsg)
        msg(lang.say_something, options);
      for (let chr of l) {
        if (chr.sayQuestion && chr.respondToAnswer(arr[1]))
          return world.SUCCESS;
        if (chr.sayResponse && chr.sayResponse(arr[1], arr[0]))
          return world.SUCCESS;
      }
      if (settings.givePlayerSayMsg) {
        msg(lang.say_no_response, options);
      } else {
        msg(lang.say_no_response_full, options);
      }
      return world.SUCCESS;
    },
    objects: [
      { special: "text" },
      { special: "text" }
    ]
  });
  new Cmd("Stand", {
    rules: [cmdRules.testPosture],
    script: handleStandUp
  });
  new Cmd("NpcStand", {
    rules: [cmdRules.testPosture],
    cmdCategory: "Posture",
    objects: [
      { scope: parser.isHere, attName: "npc" }
    ],
    script: handleStandUp
  });
  new Cmd("Make", {
    objects: [
      { scope: parser.isUnconstructed, extendedScope: true }
    ],
    script: function(objects) {
      const obj = objects[0][0];
      return obj.build({ char: player(), item: obj }) ? world.SUCCESS : world.FAILED;
    }
  });
  new Cmd("MakeWith", {
    objects: [
      { scope: parser.isUnconstructed, extendedScope: true },
      { scope: parser.isHere, multiple: true }
    ],
    script: function(objects) {
      const obj = objects[0][0];
      const options = { char: player(), item: obj };
      if (!obj.testComponents(objects[1], options))
        return world.FAILED;
      return obj.build(options) ? world.SUCCESS : world.FAILED;
    }
  });
  new Cmd("NpcMake", {
    objects: [
      { scope: parser.isUnconstructed }
    ],
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      const obj = objects[0][0];
      return obj.build({ char: npc2, item: obj }) ? world.SUCCESS : world.FAILED;
    }
  });
  new Cmd("NpcMakeWith", {
    objects: [
      { scope: parser.isUnconstructed },
      { scope: parser.isHere, multiple: true }
    ],
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      const obj = objects[0][0];
      const options = { char: npc2, item: obj };
      if (!obj.testComponents(objects[1], options))
        return world.FAILED;
      return obj.build(options) ? world.SUCCESS : world.FAILED;
    }
  });
  new Cmd("FillWith", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { scope: parser.isHeld },
      { special: "fluid" }
    ],
    script: function(objects) {
      return handleFillFromUnknown(player(), objects[0][0], objects[1]);
    }
  });
  new Cmd("NpcFillWith", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Fill",
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isHeld },
      { special: "fluid" }
    ],
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      return handleFillFromUnknown(npc2, objects[0][0], objects[1]);
    }
  });
  new Cmd("EmptyInto", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { scope: parser.isHeld },
      { scope: parser.isPresent }
    ],
    script: function(objects) {
      return handleFillFromVessel(player(), objects[0][0], objects[1][0], void 0);
    }
  });
  new Cmd("NpcEmptyInto", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Fill",
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isHeld },
      { scope: parser.isPresent }
    ],
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      return handleFillFromVessel(npc2, objects[0][0], objects[1][0], void 0);
    }
  });
  new Cmd("EmptyFluidInto", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { special: "fluid" },
      { scope: parser.isPresent }
    ],
    script: function(objects) {
      return handleEmptyFluidInto(player(), objects[1][0], objects[0]);
    }
  });
  new Cmd("NpcEmptyFluidInto", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Fill",
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { special: "fluid" },
      { scope: parser.isPresent }
    ],
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      return handleEmptyFluidInto(npc2, objects[1][0], objects[0]);
    }
  });
  new Cmd("PutFluidIn", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { special: "fluid" },
      { scope: parser.isPresent, attName: "container" }
    ],
    script: function(objects) {
      return handleFillFromUnknown(player(), objects[1][0], objects[0]);
    }
  });
  new Cmd("PutIn", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { scope: parser.isHeld, multiple: true },
      { scope: parser.isPresent, attName: "container" }
    ],
    script: function(objects) {
      return handleInOutContainer(player(), objects, "drop", handleSingleDropInContainer);
    }
  });
  new Cmd("NpcPutIn", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Drop/in",
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isHeldByNpc, multiple: true },
      { scope: parser.isPresent, attName: "container" }
    ],
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      return handleInOutContainer(npc2, objects, "drop", handleSingleDropInContainer);
    }
  });
  new Cmd("TakeOut", {
    rules: [cmdRules.testManipulate, cmdRules.isPresent],
    objects: [
      { scope: parser.isContained, multiple: true },
      { scope: parser.isPresent, attName: "container" }
    ],
    script: function(objects) {
      return handleInOutContainer(player(), objects, "take", handleSingleTakeOutContainer);
    }
  });
  new Cmd("NpcTakeOut", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Take",
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isContained, multiple: true },
      { scope: parser.isPresent, attName: "container" }
    ],
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      return handleInOutContainer(npc2, objects, "take", handleSingleTakeOutContainer);
    }
  });
  new Cmd("GiveTo", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    objects: [
      { scope: parser.isHeld, multiple: true },
      { scope: parser.isPresent, attName: "npc" }
    ],
    script: function(objects) {
      return handleGiveToNpc(player(), objects);
    }
  });
  new Cmd("NpcGiveTo", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Give",
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isHeldByNpc, multiple: true },
      { scope: parser.isPresentOrMe, attName: "npc" }
    ],
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      return handleGiveToNpc(npc2, objects);
    }
  });
  new Cmd("Give", {
    antiRegexes: [lang.regex.GiveTo],
    matchItems: function(s) {
      if (!this._test(s))
        return;
      if (!this._testNot(s))
        return;
      parser.msg("---------------------------------------------------------");
      parser.msg("* Looking at candidate: " + this.name);
      this.tmp.objectTexts = [];
      this.tmp.objects = [];
      this.tmp.score = this.score ? this.score : 10;
      this.tmp.error = void 0;
      let arr = this.tmp.regex.exec(s);
      arr.shift();
      const scope = world.scope;
      const npcs = scope.filter((el) => el.npc && el !== player());
      const items = array.fromTokens(arr[0].split(" "), scope);
      if (!items)
        return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(arr[0]));
      if (items[0].length === 1) {
        if (items[0][0].npc) {
          this.tmp.objects[1] = items[0];
          items.shift();
          this.tmp.objects[0] = items;
        } else {
          if (npcs.length === 0)
            return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(arr[0]));
          this.tmp.objects[1] = npcs;
          this.tmp.objects[0] = items;
        }
      } else {
        const npcList = items[0].filter((el) => el.npc);
        if (npcList.length === 0) {
          if (npcs.length === 0)
            return this.setError(parser.NO_OBJECT, lang.no_receiver);
          this.tmp.objects[1] = npcs;
          this.tmp.objects[0] = items;
        } else if (npcList.length === 1) {
          this.tmp.objects[1] = [npcList[0]];
          items.shift();
          this.tmp.objects[0] = items;
        } else {
          this.tmp.objects[1] = [npcList];
          items.shift();
          this.tmp.objects[0] = items;
        }
      }
      for (let i2 = 0; i2 < this.tmp.objects[0].length; i2++) {
        const el = this.tmp.objects[0][i2];
        if (el.length === 1) {
          this.tmp.objects[0][i2] = el[0];
        } else {
          const held = el.filter((el2) => el2.loc === player().name);
          if (held.length === 1) {
            this.tmp.objects[0][i2] = held[0];
          } else if (held.length > 1) {
            this.tmp.objects[0][i2] = held;
          }
        }
      }
      this.tmp.score = 10;
      parser.msg("..Base score: " + this.tmp.score);
    },
    script: function(objects) {
      return handleGiveToNpc(player(), objects);
    }
  });
  new Cmd("NpcGive", {
    antiRegexes: lang.regex.NpcGiveTo,
    matchItems: function(s) {
      if (!this._test(s))
        return;
      if (!this._testNot(s))
        return;
      parser.msg("---------------------------------------------------------");
      parser.msg("* Looking at candidate: " + this.name);
      this.tmp.objectTexts = [];
      this.tmp.objects = [];
      this.tmp.score = this.score ? this.score : 10;
      this.tmp.error = void 0;
      let arr = this.tmp.regex.exec(s);
      arr.shift();
      const scope = world.scope;
      let char2;
      const charString = arr.shift();
      const possibleChars = parser.findInList(charString, scope, {});
      if (possibleChars.length === 0)
        return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(charString));
      if (possibleChars.length === 1) {
        char2 = possibleChars[0];
      } else {
        possibleChars.filter((el) => (el.npc || el.player) && el !== char2);
        if (possibleChars.length === 0) {
          char2 = possibleChars;
        } else if (possibleChars.length === 1) {
          char2 = possibleChars[0];
        } else {
          char2 = possibleChars;
        }
      }
      const npcs = scope.filter((el) => (el.npc || el.player) && el !== char2);
      const items = array.fromTokens(arr[0].split(" "), scope);
      if (!items)
        return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(arr[0]));
      if (items[0].length === 1) {
        if (items[0][0].npc || items[0][0] === player()) {
          this.tmp.objects[1] = items[0];
          items.shift();
          this.tmp.objects[0] = items;
        } else {
          if (npcs.length === 0)
            return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(arr[0]));
          this.tmp.objects[1] = npcs;
          this.tmp.objects[0] = items;
        }
      } else {
        const npcList = items[0].filter((el) => el.npc || el.player);
        if (npcList.length === 0) {
          if (npcs.length === 0)
            return this.setError(parser.NO_OBJECT, lang.no_receiver);
          this.tmp.objects[1] = npcs;
          this.tmp.objects[0] = items;
        } else if (npcList.length === 1) {
          this.tmp.objects[1] = [npcList[0]];
          items.shift();
          this.tmp.objects[0] = items;
        } else {
          this.tmp.objects[1] = [npcList];
          items.shift();
          this.tmp.objects[0] = items;
        }
      }
      for (let i2 = 0; i2 < this.tmp.objects[0].length; i2++) {
        const el = this.tmp.objects[0][i2];
        if (el.length === 1) {
          this.tmp.objects[0][i2] = el[0];
        } else {
          const held = el.filter((el2) => el2.loc === char2.name);
          if (held.length === 1) {
            this.tmp.objects[0][i2] = held[0];
          } else if (held.length > 1) {
            this.tmp.objects[0][i2] = held;
          }
        }
      }
      this.tmp.objects.unshift([char2]);
      this.tmp.score = 10;
      parser.msg("..Base score: " + this.tmp.score);
    },
    script: function(objects) {
      const char2 = objects[0][0];
      objects.shift();
      return handleGiveToNpc(char2, objects);
    }
  });
  new Cmd("LookExit", {
    script: function(objects) {
      const dirName = getDir(objects[0]);
      const attName = "look_" + dirName;
      const exit = loc$1()[dirName];
      const tpParams = { char: player(), dir: dirName, exit };
      if (typeof loc$1()[attName] === "function") {
        const res = loc$1()[attName](tpParams);
        return res ? world.SUCCESS : world.FAILED;
      }
      if (!exit || exit.isHidden())
        return failedmsg(lang.no_look_that_way, tpParams);
      if (exit.isLocked())
        return failedmsg(lang.locked_exit, { char: player(), exit });
      tpParams.dest = w$1[exit.name];
      if (loc$1()[attName]) {
        msg(loc$1()[attName], tpParams);
      } else if (typeof exit.look === "function") {
        return exit.look(tpParams);
      } else if (exit.look) {
        msg(exit.look, tpParams);
      } else {
        msg(lang.default_look_exit, tpParams);
        return world.SUCCESS_NO_TURNSCRIPTS;
      }
      return world.SUCCESS;
    },
    objects: [
      { special: "text" }
    ]
  });
  new Cmd("PushExit", {
    rules: [cmdRules.testManipulate, cmdRules.isHere],
    cmdCategory: "Push",
    script: function(objects) {
      return handlePushExit(player(), objects);
    },
    objects: [
      { special: "text" },
      { scope: parser.isHere, attName: "shiftable" },
      { special: "text" }
    ]
  });
  new Cmd("NpcPushExit", {
    rules: [cmdRules.testManipulate, cmdRules.isHere],
    cmdCategory: "Push",
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      return handlePushExit(npc2, objects);
    },
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { special: "text" },
      { scope: parser.isHere, attName: "shiftable" },
      { special: "text" }
    ]
  });
  new Cmd("TieUp", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Tie",
    objects: [
      { scope: parser.isHeld, attName: "rope" }
    ],
    script: function(objects) {
      const rope = objects[0][0];
      if (!rope.rope)
        return failedmsg(lang.rope_not_attachable, { rope, char: player() });
      return rope.handleTieTo(player());
    }
  });
  new Cmd("TieTo", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Tie",
    objects: [
      { scope: parser.isHeld, attName: "rope" },
      { scope: parser.isHere, attName: "attachable" }
    ],
    script: function(objects) {
      const rope = objects[0][0];
      if (!rope.rope)
        return failedmsg(lang.rope_not_attachable, { rope, char: player() });
      return rope.handleTieTo(player(), objects[1][0]);
    }
  });
  new Cmd("NpcTieUp", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Tie",
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      const rope = objects[0][0];
      if (!rope.rope)
        return failedmsg(lang.rope_not_attachable, { rope, char: npc2 });
      return rope.handleTieTo(npc2);
    },
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isHeld, attName: "rope" }
    ]
  });
  new Cmd("NpcTieTo", {
    rules: [cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory: "Tie",
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      const rope = objects[0][0];
      if (!rope.rope)
        return failedmsg(lang.rope_not_attachable, { rope, char: npc2 });
      return rope.handleTieTo(npc2, objects[1][0]);
    },
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isHeld, attName: "rope" },
      { scope: parser.isHere, attName: "attachable" }
    ]
  });
  new Cmd("Untie", {
    rules: [cmdRules.testManipulate, cmdRules.isPresent],
    cmdCategory: "Untie",
    objects: [
      { scope: parser.isHere, attName: "rope" }
    ],
    script: function(objects) {
      const rope = objects[0][0];
      if (!rope.rope)
        return failedmsg(lang.rope_not_attachable, { rope, char: player() });
      return rope.handleUntieFrom(player());
    }
  });
  new Cmd("NpcUntie", {
    rules: [cmdRules.testManipulate, cmdRules.isPresent],
    cmdCategory: "Tie",
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      const rope = objects[0][0];
      if (!rope.rope)
        return failedmsg(lang.rope_not_attachable, { rope, char: npc2 });
      return rope.handleUntieFrom(npc2);
    },
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isHeld, attName: "rope" }
    ]
  });
  new Cmd("UntieFrom", {
    rules: [cmdRules.testManipulate, cmdRules.isPresent],
    cmdCategory: "Untie",
    objects: [
      { scope: parser.isHere, attName: "rope" },
      { scope: parser.isHere, attName: "attachable" }
    ],
    script: function(objects) {
      const rope = objects[0][0];
      if (!rope.rope)
        return failedmsg(lang.rope_not_attachable, { rope, char: npc });
      return rope.handleUntieFrom(player(), objects[1][0]);
    }
  });
  new Cmd("NpcUntieFrom", {
    rules: [cmdRules.testManipulate, cmdRules.isPresent],
    cmdCategory: "Tie",
    script: function(objects) {
      const npc2 = objects[0][0];
      if (!npc2.npc)
        return failedmsg(lang.not_npc, { char: player(), item: npc2 });
      objects.shift();
      const rope = objects[0][0];
      if (!rope.rope)
        return failedmsg(lang.rope_not_attachable, { rope, char: npc2 });
      return rope.handleUntieFrom(npc2, objects[1][0]);
    },
    objects: [
      { scope: parser.isHere, attName: "npc" },
      { scope: parser.isHere, attName: "rope" },
      { scope: parser.isHere, attName: "attachable" }
    ]
  });
  new Cmd("UseWith", {
    //npcCmd:true,
    rules: [cmdRules.testManipulate, cmdRules.isPresent],
    objects: [
      { scope: parser.isPresent },
      { scope: parser.isPresent }
    ],
    script: function(objects) {
      const obj = objects[0][0];
      const obj2 = objects[1][0];
      if (obj.useWith) {
        const result2 = obj.useWith(player(), obj2);
        return result2 ? world.SUCCESS : world.FAILED;
      }
      if (obj2.withUse) {
        const result2 = obj2.withUse(player(), obj);
        return result2 ? world.SUCCESS : world.FAILED;
      }
      if (obj.useWithDefaultsTo) {
        const cmd = findCmd(obj.useWithDefaultsTo());
        if (cmd) {
          const result2 = cmd.script(objects);
          return result2 ? world.SUCCESS : world.FAILED;
        } else {
          throw new Error("USE command defaulting to unknown command " + obj.useWithDefaultsTo);
        }
      }
      if (obj2.withUseDefaultsTo) {
        const cmd = findCmd(obj2.withUseDefaultsTo());
        if (cmd) {
          const result2 = cmd.script(objects);
          return result2 ? world.SUCCESS : world.FAILED;
        } else {
          throw new Error("USE command defaulting to unknown command " + obj2.withUseDefaultsTo);
        }
      }
      this.default({ char: player(), item: obj });
      return world.FAILED;
    },
    defmsg: lang.cannot_use
  });
  new Cmd("FollowMe", {
    objects: [
      { scope: parser.isHere, attName: "npc" }
    ],
    script: function(objects) {
      const obj = objects[0][0];
      const tpParams = { char: player(), npc: obj };
      if (!obj.npc)
        return failedmsg(lang.cannot_follow, tpParams);
      if (!obj.getAgreement("Follow"))
        return world.FAILED;
      return obj.startFollow() ? world.SUCCESS : world.FAILED;
    }
  });
  new Cmd("WaitHere", {
    objects: [
      { scope: parser.isHere, attName: "npc" }
    ],
    script: function(objects) {
      const obj = objects[0][0];
      const tpParams = { item: obj };
      if (!obj.npc)
        return falsemsg(lang.cannot_wait, tpParams);
      return obj.endFollow() ? world.SUCCESS : world.FAILED;
    }
  });
  new Cmd("AskAbout", {
    rules: [cmdRules.canTalkTo],
    script: function(arr) {
      if (!player().testTalk())
        return false;
      if (!arr[0][0].askabout)
        return failedmsg(lang.cannot_ask_about, { char: player(), item: arr[0][0], text: arr[2] });
      return arr[0][0].askabout(arr[2], arr[1]) ? world.SUCCESS : world.FAILED;
    },
    objects: [
      { scope: parser.isNpcAndHere },
      { special: "text" },
      { special: "text" }
    ]
  });
  new Cmd("TellAbout", {
    rules: [cmdRules.canTalkTo],
    script: function(arr) {
      if (!player().testTalk())
        return false;
      if (!arr[0][0].tellabout)
        return failedmsg(lang.cannot_tell_about, { char: player(), item: arr[0][0], text: arr[1] });
      return arr[0][0].tellabout(arr[2], arr[1]) ? world.SUCCESS : world.FAILED;
    },
    objects: [
      { scope: parser.isNpcAndHere },
      { special: "text" },
      { special: "text" }
    ]
  });
  new Cmd("TalkAbout", {
    rules: [cmdRules.canTalkTo],
    //score:1, // to override TALK TO
    script: function(arr) {
      if (!player().testTalk())
        return false;
      if (!arr[0][0].tellabout && !arr[0][0].askabout)
        return failedmsg(lang.cannot_tell_about, { char: player(), item: arr[0][0], text: arr[1] });
      return arr[0][0].talkabout(arr[2], arr[1]) ? world.SUCCESS : world.FAILED;
    },
    objects: [
      { scope: parser.isNpcAndHere },
      { special: "text" },
      { special: "text" }
    ]
  });
  for (const s of ["In", "Out", "Up", "Down", "Through"]) {
    new Cmd("Go" + s + "Item", {
      objects: [{ scope: parser.isHere, attName: "go" + s + "Direction" }],
      dirType: s,
      script: function(objects) {
        if (typeof objects[0][0]["go" + this.dirType + "Item"] === "string") {
          return failedmsg(objects[0][0]["go" + this.dirType + "Item"], { char: player(), item: objects[0][0] });
        }
        return loc$1().goItem(objects[0][0], this.dirType);
      }
    });
    new Cmd("NpcGo" + s + "Item", {
      objects: [
        { scope: parser.isHere, attName: "npc" },
        { scope: parser.isHere, attName: "go" + s + "Direction" }
      ],
      dirType: s,
      script: function(objects) {
        if (typeof objects[1][0]["go" + this.dirType + "Item"] === "string") {
          return failedmsg(objects[1][0]["go" + this.dirType + "Item"], { char: objects[0][0], item: objects[1][0] });
        }
        return loc$1().goItem(objects[1][0], this.dirType, objects[0][0]);
      }
    });
  }
  for (const el of lang.questions) {
    new Cmd("Question" + verbify(el.q), {
      regex: new RegExp("^" + el.q + "\\??$"),
      objects: [],
      script: el.script
    });
  }
  if (settings.playMode === "dev") {
    new Cmd("DebugWalkThrough", {
      objects: [
        { special: "text" }
      ],
      script: function(objects) {
        if (typeof walkthroughs === "undefined") {
          metamsg("No walkthroughs set");
          return world.FAILED;
        }
        const wt = walkthroughs[objects[0]];
        if (wt === void 0)
          return failedmsg("No walkthrough found called " + objects[0]);
        settings.walkthroughInProgress = true;
        for (let el of wt) {
          if (typeof el === "string") {
            runCmd(el);
          } else if (typeof el === "function") {
            el();
          } else {
            settings.walkthroughMenuResponses = Array.isArray(el.menu) ? el.menu : [el.menu];
            runCmd(el.cmd);
            settings.walkthroughMenuResponses = [];
          }
        }
        settings.walkthroughInProgress = false;
        return world.SUCCESS_NO_TURNSCRIPTS;
      }
    });
    new Cmd("DebugInspect", {
      script: function(arr) {
        const item2 = arr[0][0];
        debugmsg("See the console for details on the object " + item2.name + " (press F12 to world. the console)");
        console.log(item2);
        return world.SUCCESS_NO_TURNSCRIPTS;
      },
      objects: [
        { scope: parser.isInWorld }
      ]
    });
    new Cmd("DebugInspectByName", {
      script: function(arr) {
        const item_name = arr[0];
        if (!w$1[item_name]) {
          debugmsg("No object called " + item_name);
          return world.FAILED;
        }
        debugmsg("See the console for details on the object " + item_name + " (press F12 to world. the console)");
        console.log(w$1[item_name]);
        return world.SUCCESS_NO_TURNSCRIPTS;
      },
      objects: [
        { special: "text" }
      ]
    });
    new Cmd("DebugWarpName", {
      script: function(arr) {
        const o = w$1[arr[0]];
        if (!o) {
          debugmsg("No object called " + arr[0]);
          return world.FAILED;
        }
        if (o.room) {
          player().loc = o.name;
          debugmsg("Moved to " + o.name);
        } else {
          o.loc = player().name;
          delete o.scenery;
          debugmsg("Retrieved " + o.name + ' (as long as it uses the "loc" attribute normally)');
        }
        return world.SUCCESS;
      },
      objects: [
        { special: "text" }
      ]
    });
    new Cmd("DebugTest", {
      script: function() {
        if (!settings.tests) {
          metamsg("The TEST command is for unit testing during game development, and is not activated (F12 for more).");
          console.log("To activate testing in your game, set settings.tests to true. More details here: https://github.com/ThePix/QuestJS/wiki/Unit-testing");
          return world.SUCCESS_NO_TURNSCRIPTS;
        }
        if (typeof test.runTests !== "function") {
          console.log(test);
          return world.FAILED;
        }
        test.runTests();
        return world.SUCCESS_NO_TURNSCRIPTS;
      }
    });
    new Cmd("DebugInspectCommand", {
      script: function(arr) {
        debugmsg("Looking for " + arr[0]);
        for (let cmd of commands) {
          if (cmd.name.toLowerCase() === arr[0] || cmd.cmdCategory && cmd.cmdCategory.toLowerCase() === arr[0]) {
            debugmsg("Name: " + cmd.name);
            for (let key in cmd) {
              if (cmd.hasOwnProperty(key)) {
                debugmsg("--" + key + ": " + cmd[key]);
              }
            }
          }
        }
        return world.SUCCESS_NO_TURNSCRIPTS;
      },
      objects: [
        { special: "text" }
      ]
    });
    new Cmd("DebugListCommands", {
      script: function(arr) {
        let count = 0;
        for (let cmd of commands) {
          if (!cmd.name.match(/\d$/)) {
            let s = cmd.name + " (" + cmd.regex;
            let altCmd;
            let n = 2;
            do {
              altCmd = commands.find((el) => el.name === cmd.name + n);
              if (altCmd)
                s += " or " + altCmd.regex;
              n++;
            } while (altCmd);
            s += ")";
            const npcCmd = commands.find((el) => el.name === "Npc" + cmd.name + "2");
            if (npcCmd)
              s += " - NPC too";
            debugmsg(s);
            count++;
          }
        }
        debugmsg("... Found " + count + " commands.");
        return world.SUCCESS_NO_TURNSCRIPTS;
      },
      objects: []
    });
    new Cmd("DebugListCommands2", {
      script: function(arr) {
        let count = 0;
        for (let cmd of commands) {
          let s = cmd.name + " (" + cmd.regex + ")";
          debugmsg(s);
          count++;
        }
        debugmsg("... Found " + count + " commands.");
        return world.SUCCESS_NO_TURNSCRIPTS;
      },
      objects: []
    });
    new Cmd("DebugParserToggle", {
      script: function(arr) {
        if (parser.debug) {
          parser.debug = false;
          debugmsg("Parser debugging messages are off.");
        } else {
          parser.debug = true;
          debugmsg("Parser debugging messages are on.");
        }
        return world.SUCCESS_NO_TURNSCRIPTS;
      },
      objects: []
    });
    new Cmd("DebugStats", {
      script: function(arr) {
        for (const el of settings.statsData)
          el.count = 0;
        for (const key in w$1) {
          for (const el of settings.statsData) {
            const res = el.test(w$1[key]);
            if (res === true)
              el.count++;
            if (typeof res === "number")
              el.count += res;
          }
        }
        for (const el of settings.statsData) {
          debugmsg(el.name + ": " + el.count);
        }
        return world.SUCCESS_NO_TURNSCRIPTS;
      },
      objects: []
    });
    new Cmd("DebugHighlight", {
      script: function(arr) {
        for (const el of document.querySelectorAll(".parser")) {
          el.style.color = "black";
          el.style.backgroundColor = "yellow";
        }
        for (const el of document.querySelectorAll(".error")) {
          el.style.backgroundColor = "yellow";
        }
        for (const el of document.querySelectorAll(".meta")) {
          el.style.color = "black";
          el.style.backgroundColor = "#8f8";
        }
        debugmsg("Previous parser and error messages are now highlighted.");
        return world.SUCCESS_NO_TURNSCRIPTS;
      },
      objects: []
    });
    new Cmd("MetaTranscriptWalkthrough", {
      script: function() {
        saveLoad.transcriptWalk();
        return world.SUCCESS_NO_TURNSCRIPTS;
      }
    });
  }
  function handleFillFromUnknown(char2, sink, fluid) {
    const options = { fluid };
    if (!util.findSource(options))
      return failedmsg(fluid ? lang.no_fluid_here : lang.no_fluid_here_at_all, options);
    if (options.source.vessel)
      return handleFillFromVessel(char2, options.source, sink, options.fluid);
    return handleFillFromSource(char2, options.source, sink, options.fluid);
  }
  function handleFillFromVessel(char2, source, sink, fluid) {
    if (!fluid)
      fluid = source.containedFluidName;
    const options = { char: char2, source, fluid, item: sink };
    if (!source.vessel)
      return failedmsg(lang.not_vessel, options);
    if (source.closed)
      return failedmsg(lang.container_closed, options);
    if (!source.containedFluidName)
      return failedmsg(lang.already_empty, options);
    if (!sink.vessel && !sink.sink)
      return failedmsg(lang.not_sink, options);
    if (sink.vessel && sink.containedFluidName)
      return failedmsg(lang.already_full, options);
    if (!char2.testManipulate(source, "fill"))
      return world.FAILED;
    if (!char2.getAgreement("Fill", { source, sink, fluid }))
      return world.FAILED;
    if (!source.isAtLoc(char2.name))
      return failedmsg(lang.not_carrying, options);
    if (source.containedFluidName !== fluid)
      return failedmsg(lang.no_fluid_here, options);
    return source.doEmpty(options) ? world.SUCCESS : world.FAILED;
  }
  function handleFillFromSource(char2, source, sink, fluid) {
    const options = { char: char2, source, fluid, item: sink };
    if (!source.isSourceOf)
      return failedmsg(lang.not_source, options);
    if (source.closed)
      return failedmsg(lang.container_closed, options);
    if (!sink.vessel)
      return failedmsg(lang.not_vessel, options);
    if (sink.containedFluidName)
      return failedmsg(lang.already_full, options);
    if (!char2.testManipulate(sink, "fill"))
      return world.FAILED;
    if (!char2.getAgreement("Fill", { source, sink, fluid }))
      return world.FAILED;
    if (!source.room && !source.isAtLoc(char2.loc))
      return failedmsg(lang.not_here, options);
    if (!source.isSourceOf(fluid))
      return failedmsg(lang.no_fluid_here, options);
    return sink.doFill(options) ? world.SUCCESS : world.FAILED;
  }
  function handleEmptyFluidInto(char2, sink, fluid) {
    for (const key in w$1) {
      const o = w$1[key];
      if (o.vessel && o.containedFluidName === fluid && o.loc === char2.name) {
        return handleFillFromVessel(char2, o, sink, fluid);
      }
    }
    return failedmsg(lang.not_carrying_fluid, { char: char2, fluid });
  }
  function handleInOutContainer(char2, objects, verb, func2) {
    let success = false;
    const container2 = objects[1][0];
    const options = { char: char2, container: container2, verb, multiple: objects[0].length > 1 || parser.currentCommand.all };
    if (container2.handleInOutContainer)
      return container2.handleInOutContainer(options, objects[0]);
    if (!container2.container)
      return failedmsg(lang.not_container, options);
    if (container2.closed) {
      if (container2.containerAutoOpen) {
        if (!container2.open({ char: char2, item: container2 }))
          return false;
      } else if (!container2.containerIgnoreClosed) {
        return failedmsg(lang.container_closed, options);
      }
    }
    for (const obj of objects[0]) {
      if (!char2.testManipulate(obj, verb))
        return world.FAILED;
      options.count = obj.countable ? obj.extractNumber() : void 0;
      options.item = obj;
      if (options.count)
        options[obj.name + "_count"] = options.count;
      const flag = func2(char2, container2, obj, options);
      success = success || flag;
    }
    if (success)
      char2.pause();
    return success ? world.SUCCESS : world.FAILED;
  }
  function handleSingleDropInContainer(char2, container2, obj, options) {
    options.fromLoc = char2.name;
    options.toLoc = container2.name;
    if (!char2.getAgreement("Drop/in", { item: obj, container: container2 }))
      return;
    if (!container2.testForRecursion(char2, obj))
      return false;
    if (obj.testDrop && !obj.testDrop(options))
      return false;
    if (!obj.msgDropIn)
      return falsemsg(lang.cannot_drop, options);
    if (container2.testDropIn && !container2.testDropIn(options))
      return false;
    if (!obj.isAtLoc(char2.name))
      return failedmsg(lang.not_carrying, { char: char2, item: obj });
    if (obj.getTakeDropCount)
      obj.getTakeDropCount(options, char2.name);
    if (typeof obj.msgDropIn === "function") {
      obj.msgDropIn(options);
    } else {
      msg(obj.msgDropIn, options);
    }
    obj.moveToFrom(options);
    return true;
  }
  function handleSingleTakeOutContainer(char2, container2, obj, options) {
    options.toLoc = char2.name;
    options.fromLoc = container2.name;
    if (!char2.getAgreement("Take", { item: obj }))
      return false;
    if (!obj.isAtLoc(container2.name))
      return failedmsg(lang.not_inside, { container: container2, item: obj });
    if (obj.getTakeDropCount)
      obj.getTakeDropCount(options, container2.name);
    if (obj.testTake && !obj.testTake(options))
      return false;
    if (container2.testTakeOut && !container2.testTakeOut(options))
      return false;
    msg(obj.msgTakeOut, options);
    obj.moveToFrom(options);
    return true;
  }
  function handleGiveToNpc(char2, objects) {
    let success = false;
    const npc2 = objects[1][0];
    const multiple = objects[0].length > 1 || parser.currentCommand.all;
    if (!npc2.npc && npc2 !== player())
      return failedmsg(lang.not_npc_for_give, { char: char2, item: npc2 });
    if (!npc2.handleGiveTo)
      log(npc2);
    for (const obj of objects[0]) {
      const flag = npc2.handleGiveTo({ char: char2, npc: npc2, multiple, item: obj, toLoc: npc2.name, fromLoc: char2.name });
      success = success || flag;
    }
    if (success == world.SUCCESS)
      char2.pause();
    return success ? world.SUCCESS : world.FAILED;
  }
  function handleStandUp(objects) {
    let char2;
    if (objects.length === 0) {
      char2 = player();
    } else {
      const npc2 = objects[0][0];
      if (!npc2.npc) {
        failedmsg(lang.not_npc, { char: player(), item: npc2 });
        return world.FAILED;
      }
      if (!npc2.posture) {
        failedmsg(lang.already, { item: npc2 });
        return world.FAILED;
      }
      if (!npc2.getAgreement("Posture", { posture: "stand" })) {
        return world.FAILED;
      }
      char2 = npc2;
    }
    if (!char2.testPosture()) {
      return world.FAILED;
    }
    if (char2.posture) {
      msg(lang.stop_posture(char2));
      char2.pause();
      return world.SUCCESS;
    }
  }
  function handlePushExit(char2, objects) {
    const verb = objects[0];
    const obj = objects[1][0];
    const dir = getDir(objects[2]);
    const room = w$1[char2.loc];
    const tpParams = { char: char2, item: obj, dir };
    if (!obj.shiftable && obj.takeable)
      return failedmsg(lang.take_not_push, tpParams);
    if (!obj.shiftable)
      return failedmsg(lang.cannot_push, tpParams);
    if (!room[dir] || room[dir].isHidden())
      return failedmsg(lang.not_that_way, tpParams);
    if (room[dir].isLocked())
      return failedmsg(lang.locked_exit, { char: char2, exit: room[dir] });
    if (typeof room[dir].noShiftingMsg === "function")
      return failedmsg(room[dir].noShiftingMsg(char2, item));
    if (typeof room[dir].noShiftingMsg === "string")
      return failedmsg(room[dir].noShiftingMsg);
    if (!char2.getAgreement("Push", { item: obj, dir }))
      return false;
    if (typeof obj.shift === "function") {
      const res = obj.shift(char2, dir, verb);
      return res ? world.SUCCESS : world.FAILED;
    }
    if (dir === "up") {
      msg(lang.cannot_push_up, tpParams);
      return world.FAILED;
    }
    const dest = room[dir].name;
    obj.moveToFrom({ char: char2, toLoc: dest, item: obj });
    char2.loc = dest;
    tpParams.dest = w$1[dest];
    msg(lang.push_exit_successful, tpParams);
    return world.SUCCESS;
  }
  exports2.AGENDA_FOLLOWER = AGENDA_FOLLOWER;
  exports2.BACKSCENE = BACKSCENE;
  exports2.BUTTON = BUTTON;
  exports2.BUTTON_DICTIONARY = BUTTON_DICTIONARY;
  exports2.CHARACTER = CHARACTER;
  exports2.COMPONENT = COMPONENT;
  exports2.CONSTRUCTION = CONSTRUCTION;
  exports2.CONSULTABLE = CONSULTABLE;
  exports2.CONTAINER = CONTAINER;
  exports2.COUNT = COUNT;
  exports2.COUNTABLE = COUNTABLE;
  exports2.Cmd = Cmd;
  exports2.DEFAULT_ITEM = DEFAULT_ITEM;
  exports2.DEFAULT_OBJECT = DEFAULT_OBJECT;
  exports2.DEFAULT_ROOM = DEFAULT_ROOM;
  exports2.DEFINITE = DEFINITE;
  exports2.EDIBLE = EDIBLE;
  exports2.EXIT_FAKER = EXIT_FAKER;
  exports2.Exit = Exit;
  exports2.ExitCmd = ExitCmd;
  exports2.FURNITURE = FURNITURE;
  exports2.INDEFINITE = INDEFINITE;
  exports2.KEY = KEY;
  exports2.LOCKED_DOOR = LOCKED_DOOR;
  exports2.LOCKED_WITH = LOCKED_WITH;
  exports2.Link = Link;
  exports2.MERCH = MERCH;
  exports2.NPC = NPC;
  exports2.NULL_FUNC = NULL_FUNC;
  exports2.NpcCmd = NpcCmd;
  exports2.NpcExitCmd = NpcExitCmd;
  exports2.OPENABLE = OPENABLE;
  exports2.OPENABLE_DICTIONARY = OPENABLE_DICTIONARY;
  exports2.OutputTextNoBr = OutputTextNoBr;
  exports2.PLAYER = PLAYER;
  exports2.Question = Question;
  exports2.READABLE = READABLE;
  exports2.ROOM_SET = ROOM_SET;
  exports2.ROPE = ROPE;
  exports2.SHIFTABLE = SHIFTABLE;
  exports2.SURFACE = SURFACE;
  exports2.SWITCHABLE = SWITCHABLE;
  exports2.TAKEABLE = TAKEABLE;
  exports2.TAKEABLE_DICTIONARY = TAKEABLE_DICTIONARY;
  exports2.TOPIC = TOPIC;
  exports2.TRANSIT = TRANSIT;
  exports2.TRANSIT_BUTTON = TRANSIT_BUTTON;
  exports2.VESSEL = VESSEL;
  exports2.WEARABLE = WEARABLE;
  exports2._msg = _msg;
  exports2.agenda = agenda;
  exports2.ambient = ambient;
  exports2.array = array;
  exports2.askDiag = askDiag;
  exports2.askText = askText;
  exports2.blankLine = blankLine;
  exports2.c = c;
  exports2.clearScreen = clearScreen;
  exports2.cloneObject = cloneObject;
  exports2.cmdRules = cmdRules;
  exports2.commands = commands;
  exports2.commentmsg = commentmsg;
  exports2.copyObject = copyObject;
  exports2.createAdditionalPane = createAdditionalPane;
  exports2.createEnsemble = createEnsemble;
  exports2.createItem = createItem;
  exports2.createItemOrRoom = createItemOrRoom;
  exports2.createObject = createObject;
  exports2.createRoom = createRoom;
  exports2.debuglog = debuglog;
  exports2.debugmsg = debugmsg;
  exports2.displayMoney = displayMoney;
  exports2.displayNumber = displayNumber;
  exports2.doOnce = doOnce;
  exports2.draw = draw;
  exports2.endTurnUI = endTurnUI;
  exports2.errormsg = errormsg;
  exports2.extractChar = extractChar;
  exports2.failedmsg = failedmsg;
  exports2.falsemsg = falsemsg;
  exports2.findCmd = findCmd;
  exports2.formatList = formatList;
  exports2.game = game;
  exports2.getDir = getDir;
  exports2.getResponseList = getResponseList;
  exports2.handleEmptyFluidInto = handleEmptyFluidInto;
  exports2.handleFillFromSource = handleFillFromSource;
  exports2.handleFillFromUnknown = handleFillFromUnknown;
  exports2.handleFillFromVessel = handleFillFromVessel;
  exports2.handleGiveToNpc = handleGiveToNpc;
  exports2.handleInOutContainer = handleInOutContainer;
  exports2.handlePushExit = handlePushExit;
  exports2.handleSingleDropInContainer = handleSingleDropInContainer;
  exports2.handleSingleTakeOutContainer = handleSingleTakeOutContainer;
  exports2.handleStandUp = handleStandUp;
  exports2.hr = hr;
  exports2.image = image;
  exports2.initCommands = initCommands;
  exports2.io = io;
  exports2.lang = lang;
  exports2.listProperties = listProperties;
  exports2.loc = loc$1;
  exports2.log = log$1;
  exports2.metamsg = metamsg;
  exports2.msg = msg;
  exports2.msgBlankLine = msgBlankLine;
  exports2.msgDiv = msgDiv;
  exports2.msgHeading = msgHeading;
  exports2.msgList = msgList;
  exports2.msgPre = msgPre;
  exports2.msgTable = msgTable;
  exports2.npc_utilities = npc_utilities;
  exports2.parser = parser;
  exports2.parserlog = parserlog;
  exports2.parsermsg = parsermsg;
  exports2.picture = picture;
  exports2.player = player;
  exports2.prefix = prefix;
  exports2.printError = printError;
  exports2.printOrRun = printOrRun;
  exports2.processText = processText;
  exports2.rChunkString = rChunkString;
  exports2.random = random;
  exports2.rawPrint = rawPrint;
  exports2.regions = regions;
  exports2.respond = respond;
  exports2.run = run;
  exports2.runCmd = runCmd;
  exports2.saveAs = saveAs;
  exports2.saveLoad = saveLoad;
  exports2.scopeAllNpcHere = scopeAllNpcHere;
  exports2.scopeBy = scopeBy;
  exports2.scopeHeldBy = scopeHeldBy;
  exports2.scopeHereListed = scopeHereListed;
  exports2.scopeHereParser = scopeHereParser;
  exports2.scopeNpcHere = scopeNpcHere;
  exports2.scopeReachable = scopeReachable;
  exports2.sentenceCase = sentenceCase;
  exports2.sentenceCaseForHTML = sentenceCaseForHTML;
  exports2.setPlayer = setPlayer;
  exports2.setRegion = setRegion;
  exports2.settings = settings;
  exports2.showDiag = showDiag;
  exports2.showDropDown = showDropDown;
  exports2.showMenu = showMenu;
  exports2.showMenuDiag = showMenuDiag;
  exports2.showMenuNumbersOnly = showMenuNumbersOnly;
  exports2.showMenuWithNumbers = showMenuWithNumbers;
  exports2.showYesNoDropDown = showYesNoDropDown;
  exports2.showYesNoMenu = showYesNoMenu;
  exports2.showYesNoMenuWithNumbers = showYesNoMenuWithNumbers;
  exports2.sound = sound;
  exports2.spaces = spaces;
  exports2.test = test;
  exports2.testCmd = testCmd;
  exports2.titleCase = titleCase;
  exports2.titleCaseForHTML = titleCaseForHTML;
  exports2.toRoman = toRoman;
  exports2.tp = tp;
  exports2.trigger = trigger;
  exports2.util = util;
  exports2.verbify = verbify;
  exports2.video = video;
  exports2.w = w$1;
  exports2.wait = wait;
  exports2.warningFor = warningFor;
  exports2.world = world;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
//# sourceMappingURL=quest.umd.cjs.map

"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) =>
    function __require() {
      return (
        mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports
      );
    };
  var __export = (target2, all) => {
    for (var name in all) __defProp(target2, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target2) => (
    (target2 = mod != null ? __create(__getProtoOf(mod)) : {}),
    __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule
        ? __defProp(target2, "default", { value: mod, enumerable: true })
        : target2,
      mod,
    )
  );

  // node_modules/.pnpm/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js
  var require_quick_format_unescaped = __commonJS({
    "node_modules/.pnpm/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js"(
      exports,
      module,
    ) {
      "use strict";
      function tryStringify(o) {
        try {
          return JSON.stringify(o);
        } catch (e) {
          return '"[Circular]"';
        }
      }
      module.exports = format;
      function format(f, args, opts) {
        var ss = (opts && opts.stringify) || tryStringify;
        var offset = 1;
        if (typeof f === "object" && f !== null) {
          var len = args.length + offset;
          if (len === 1) return f;
          var objects = new Array(len);
          objects[0] = ss(f);
          for (var index = 1; index < len; index++) {
            objects[index] = ss(args[index]);
          }
          return objects.join(" ");
        }
        if (typeof f !== "string") {
          return f;
        }
        var argLen = args.length;
        if (argLen === 0) return f;
        var str = "";
        var a = 1 - offset;
        var lastPos = -1;
        var flen = (f && f.length) || 0;
        for (var i = 0; i < flen; ) {
          if (f.charCodeAt(i) === 37 && i + 1 < flen) {
            lastPos = lastPos > -1 ? lastPos : 0;
            switch (f.charCodeAt(i + 1)) {
              case 100:
              // 'd'
              case 102:
                if (a >= argLen) break;
                if (args[a] == null) break;
                if (lastPos < i) str += f.slice(lastPos, i);
                str += Number(args[a]);
                lastPos = i + 2;
                i++;
                break;
              case 105:
                if (a >= argLen) break;
                if (args[a] == null) break;
                if (lastPos < i) str += f.slice(lastPos, i);
                str += Math.floor(Number(args[a]));
                lastPos = i + 2;
                i++;
                break;
              case 79:
              // 'O'
              case 111:
              // 'o'
              case 106:
                if (a >= argLen) break;
                if (args[a] === void 0) break;
                if (lastPos < i) str += f.slice(lastPos, i);
                var type = typeof args[a];
                if (type === "string") {
                  str += "'" + args[a] + "'";
                  lastPos = i + 2;
                  i++;
                  break;
                }
                if (type === "function") {
                  str += args[a].name || "<anonymous>";
                  lastPos = i + 2;
                  i++;
                  break;
                }
                str += ss(args[a]);
                lastPos = i + 2;
                i++;
                break;
              case 115:
                if (a >= argLen) break;
                if (lastPos < i) str += f.slice(lastPos, i);
                str += String(args[a]);
                lastPos = i + 2;
                i++;
                break;
              case 37:
                if (lastPos < i) str += f.slice(lastPos, i);
                str += "%";
                lastPos = i + 2;
                i++;
                a--;
                break;
            }
            ++a;
          }
          ++i;
        }
        if (lastPos === -1) return f;
        else if (lastPos < flen) {
          str += f.slice(lastPos);
        }
        return str;
      }
    },
  });

  // node_modules/.pnpm/pino@9.14.0/node_modules/pino/browser.js
  var require_browser = __commonJS({
    "node_modules/.pnpm/pino@9.14.0/node_modules/pino/browser.js"(exports, module) {
      "use strict";
      var format = require_quick_format_unescaped();
      module.exports = pino2;
      var _console = pfGlobalThisOrFallback().console || {};
      var stdSerializers = {
        mapHttpRequest: mock,
        mapHttpResponse: mock,
        wrapRequestSerializer: passthrough,
        wrapResponseSerializer: passthrough,
        wrapErrorSerializer: passthrough,
        req: mock,
        res: mock,
        err: asErrValue,
        errWithCause: asErrValue,
      };
      function levelToValue(level, logger4) {
        return level === "silent" ? Infinity : logger4.levels.values[level];
      }
      var baseLogFunctionSymbol = /* @__PURE__ */ Symbol("pino.logFuncs");
      var hierarchySymbol = /* @__PURE__ */ Symbol("pino.hierarchy");
      var logFallbackMap = {
        error: "log",
        fatal: "error",
        warn: "error",
        info: "log",
        debug: "log",
        trace: "log",
      };
      function appendChildLogger(parentLogger, childLogger) {
        const newEntry = {
          logger: childLogger,
          parent: parentLogger[hierarchySymbol],
        };
        childLogger[hierarchySymbol] = newEntry;
      }
      function setupBaseLogFunctions(logger4, levels, proto) {
        const logFunctions = {};
        levels.forEach((level) => {
          logFunctions[level] = proto[level]
            ? proto[level]
            : _console[level] || _console[logFallbackMap[level] || "log"] || noop;
        });
        logger4[baseLogFunctionSymbol] = logFunctions;
      }
      function shouldSerialize(serialize, serializers) {
        if (Array.isArray(serialize)) {
          const hasToFilter = serialize.filter(function (k) {
            return k !== "!stdSerializers.err";
          });
          return hasToFilter;
        } else if (serialize === true) {
          return Object.keys(serializers);
        }
        return false;
      }
      function pino2(opts) {
        opts = opts || {};
        opts.browser = opts.browser || {};
        const transmit2 = opts.browser.transmit;
        if (transmit2 && typeof transmit2.send !== "function") {
          throw Error("pino: transmit option must have a send function");
        }
        const proto = opts.browser.write || _console;
        if (opts.browser.write) opts.browser.asObject = true;
        const serializers = opts.serializers || {};
        const serialize = shouldSerialize(opts.browser.serialize, serializers);
        let stdErrSerialize = opts.browser.serialize;
        if (
          Array.isArray(opts.browser.serialize) &&
          opts.browser.serialize.indexOf("!stdSerializers.err") > -1
        )
          stdErrSerialize = false;
        const customLevels = Object.keys(opts.customLevels || {});
        const levels = ["error", "fatal", "warn", "info", "debug", "trace"].concat(customLevels);
        if (typeof proto === "function") {
          levels.forEach(function (level2) {
            proto[level2] = proto;
          });
        }
        if (opts.enabled === false || opts.browser.disabled) opts.level = "silent";
        const level = opts.level || "info";
        const logger4 = Object.create(proto);
        if (!logger4.log) logger4.log = noop;
        setupBaseLogFunctions(logger4, levels, proto);
        appendChildLogger({}, logger4);
        Object.defineProperty(logger4, "levelVal", {
          get: getLevelVal,
        });
        Object.defineProperty(logger4, "level", {
          get: getLevel,
          set: setLevel,
        });
        const setOpts = {
          transmit: transmit2,
          serialize,
          asObject: opts.browser.asObject,
          asObjectBindingsOnly: opts.browser.asObjectBindingsOnly,
          formatters: opts.browser.formatters,
          levels,
          timestamp: getTimeFunction(opts),
          messageKey: opts.messageKey || "msg",
          onChild: opts.onChild || noop,
        };
        logger4.levels = getLevels(opts);
        logger4.level = level;
        logger4.isLevelEnabled = function (level2) {
          if (!this.levels.values[level2]) {
            return false;
          }
          return this.levels.values[level2] >= this.levels.values[this.level];
        };
        logger4.setMaxListeners =
          logger4.getMaxListeners =
          logger4.emit =
          logger4.addListener =
          logger4.on =
          logger4.prependListener =
          logger4.once =
          logger4.prependOnceListener =
          logger4.removeListener =
          logger4.removeAllListeners =
          logger4.listeners =
          logger4.listenerCount =
          logger4.eventNames =
          logger4.write =
          logger4.flush =
            noop;
        logger4.serializers = serializers;
        logger4._serialize = serialize;
        logger4._stdErrSerialize = stdErrSerialize;
        logger4.child = function (...args) {
          return child.call(this, setOpts, ...args);
        };
        if (transmit2) logger4._logEvent = createLogEventShape();
        function getLevelVal() {
          return levelToValue(this.level, this);
        }
        function getLevel() {
          return this._level;
        }
        function setLevel(level2) {
          if (level2 !== "silent" && !this.levels.values[level2]) {
            throw Error("unknown level " + level2);
          }
          this._level = level2;
          set2(this, setOpts, logger4, "error");
          set2(this, setOpts, logger4, "fatal");
          set2(this, setOpts, logger4, "warn");
          set2(this, setOpts, logger4, "info");
          set2(this, setOpts, logger4, "debug");
          set2(this, setOpts, logger4, "trace");
          customLevels.forEach((level3) => {
            set2(this, setOpts, logger4, level3);
          });
        }
        function child(setOpts2, bindings, childOptions) {
          if (!bindings) {
            throw new Error("missing bindings for child Pino");
          }
          childOptions = childOptions || {};
          if (serialize && bindings.serializers) {
            childOptions.serializers = bindings.serializers;
          }
          const childOptionsSerializers = childOptions.serializers;
          if (serialize && childOptionsSerializers) {
            var childSerializers = Object.assign({}, serializers, childOptionsSerializers);
            var childSerialize =
              opts.browser.serialize === true ? Object.keys(childSerializers) : serialize;
            delete bindings.serializers;
            applySerializers([bindings], childSerialize, childSerializers, this._stdErrSerialize);
          }
          function Child(parent) {
            this._childLevel = (parent._childLevel | 0) + 1;
            this.bindings = bindings;
            if (childSerializers) {
              this.serializers = childSerializers;
              this._serialize = childSerialize;
            }
            if (transmit2) {
              this._logEvent = createLogEventShape([].concat(parent._logEvent.bindings, bindings));
            }
          }
          Child.prototype = this;
          const newLogger = new Child(this);
          appendChildLogger(this, newLogger);
          newLogger.child = function (...args) {
            return child.call(this, setOpts2, ...args);
          };
          newLogger.level = childOptions.level || this.level;
          setOpts2.onChild(newLogger);
          return newLogger;
        }
        return logger4;
      }
      function getLevels(opts) {
        const customLevels = opts.customLevels || {};
        const values = Object.assign({}, pino2.levels.values, customLevels);
        const labels = Object.assign({}, pino2.levels.labels, invertObject(customLevels));
        return {
          values,
          labels,
        };
      }
      function invertObject(obj) {
        const inverted = {};
        Object.keys(obj).forEach(function (key) {
          inverted[obj[key]] = key;
        });
        return inverted;
      }
      pino2.levels = {
        values: {
          fatal: 60,
          error: 50,
          warn: 40,
          info: 30,
          debug: 20,
          trace: 10,
        },
        labels: {
          10: "trace",
          20: "debug",
          30: "info",
          40: "warn",
          50: "error",
          60: "fatal",
        },
      };
      pino2.stdSerializers = stdSerializers;
      pino2.stdTimeFunctions = Object.assign({}, { nullTime, epochTime, unixTime, isoTime });
      function getBindingChain(logger4) {
        const bindings = [];
        if (logger4.bindings) {
          bindings.push(logger4.bindings);
        }
        let hierarchy = logger4[hierarchySymbol];
        while (hierarchy.parent) {
          hierarchy = hierarchy.parent;
          if (hierarchy.logger.bindings) {
            bindings.push(hierarchy.logger.bindings);
          }
        }
        return bindings.reverse();
      }
      function set2(self2, opts, rootLogger, level) {
        Object.defineProperty(self2, level, {
          value:
            levelToValue(self2.level, rootLogger) > levelToValue(level, rootLogger)
              ? noop
              : rootLogger[baseLogFunctionSymbol][level],
          writable: true,
          enumerable: true,
          configurable: true,
        });
        if (self2[level] === noop) {
          if (!opts.transmit) return;
          const transmitLevel = opts.transmit.level || self2.level;
          const transmitValue = levelToValue(transmitLevel, rootLogger);
          const methodValue = levelToValue(level, rootLogger);
          if (methodValue < transmitValue) return;
        }
        self2[level] = createWrap(self2, opts, rootLogger, level);
        const bindings = getBindingChain(self2);
        if (bindings.length === 0) {
          return;
        }
        self2[level] = prependBindingsInArguments(bindings, self2[level]);
      }
      function prependBindingsInArguments(bindings, logFunc) {
        return function () {
          return logFunc.apply(this, [...bindings, ...arguments]);
        };
      }
      function createWrap(self2, opts, rootLogger, level) {
        return /* @__PURE__ */ (function (write) {
          return function LOG() {
            const ts = opts.timestamp();
            const args = new Array(arguments.length);
            const proto =
              Object.getPrototypeOf && Object.getPrototypeOf(this) === _console ? _console : this;
            for (var i = 0; i < args.length; i++) args[i] = arguments[i];
            var argsIsSerialized = false;
            if (opts.serialize) {
              applySerializers(args, this._serialize, this.serializers, this._stdErrSerialize);
              argsIsSerialized = true;
            }
            if (opts.asObject || opts.formatters) {
              write.call(proto, ...asObject(this, level, args, ts, opts));
            } else write.apply(proto, args);
            if (opts.transmit) {
              const transmitLevel = opts.transmit.level || self2._level;
              const transmitValue = levelToValue(transmitLevel, rootLogger);
              const methodValue = levelToValue(level, rootLogger);
              if (methodValue < transmitValue) return;
              transmit(
                this,
                {
                  ts,
                  methodLevel: level,
                  methodValue,
                  transmitLevel,
                  transmitValue: rootLogger.levels.values[opts.transmit.level || self2._level],
                  send: opts.transmit.send,
                  val: levelToValue(self2._level, rootLogger),
                },
                args,
                argsIsSerialized,
              );
            }
          };
        })(self2[baseLogFunctionSymbol][level]);
      }
      function asObject(logger4, level, args, ts, opts) {
        const { level: levelFormatter, log: logObjectFormatter = (obj) => obj } =
          opts.formatters || {};
        const argsCloned = args.slice();
        let msg = argsCloned[0];
        const logObject = {};
        let lvl = (logger4._childLevel | 0) + 1;
        if (lvl < 1) lvl = 1;
        if (ts) {
          logObject.time = ts;
        }
        if (levelFormatter) {
          const formattedLevel = levelFormatter(level, logger4.levels.values[level]);
          Object.assign(logObject, formattedLevel);
        } else {
          logObject.level = logger4.levels.values[level];
        }
        if (opts.asObjectBindingsOnly) {
          if (msg !== null && typeof msg === "object") {
            while (lvl-- && typeof argsCloned[0] === "object") {
              Object.assign(logObject, argsCloned.shift());
            }
          }
          const formattedLogObject = logObjectFormatter(logObject);
          return [formattedLogObject, ...argsCloned];
        } else {
          if (msg !== null && typeof msg === "object") {
            while (lvl-- && typeof argsCloned[0] === "object") {
              Object.assign(logObject, argsCloned.shift());
            }
            msg = argsCloned.length ? format(argsCloned.shift(), argsCloned) : void 0;
          } else if (typeof msg === "string") msg = format(argsCloned.shift(), argsCloned);
          if (msg !== void 0) logObject[opts.messageKey] = msg;
          const formattedLogObject = logObjectFormatter(logObject);
          return [formattedLogObject];
        }
      }
      function applySerializers(args, serialize, serializers, stdErrSerialize) {
        for (const i in args) {
          if (stdErrSerialize && args[i] instanceof Error) {
            args[i] = pino2.stdSerializers.err(args[i]);
          } else if (typeof args[i] === "object" && !Array.isArray(args[i]) && serialize) {
            for (const k in args[i]) {
              if (serialize.indexOf(k) > -1 && k in serializers) {
                args[i][k] = serializers[k](args[i][k]);
              }
            }
          }
        }
      }
      function transmit(logger4, opts, args, argsIsSerialized = false) {
        const send = opts.send;
        const ts = opts.ts;
        const methodLevel = opts.methodLevel;
        const methodValue = opts.methodValue;
        const val = opts.val;
        const bindings = logger4._logEvent.bindings;
        if (!argsIsSerialized) {
          applySerializers(
            args,
            logger4._serialize || Object.keys(logger4.serializers),
            logger4.serializers,
            logger4._stdErrSerialize === void 0 ? true : logger4._stdErrSerialize,
          );
        }
        logger4._logEvent.ts = ts;
        logger4._logEvent.messages = args.filter(function (arg) {
          return bindings.indexOf(arg) === -1;
        });
        logger4._logEvent.level.label = methodLevel;
        logger4._logEvent.level.value = methodValue;
        send(methodLevel, logger4._logEvent, val);
        logger4._logEvent = createLogEventShape(bindings);
      }
      function createLogEventShape(bindings) {
        return {
          ts: 0,
          messages: [],
          bindings: bindings || [],
          level: { label: "", value: 0 },
        };
      }
      function asErrValue(err) {
        const obj = {
          type: err.constructor.name,
          msg: err.message,
          stack: err.stack,
        };
        for (const key in err) {
          if (obj[key] === void 0) {
            obj[key] = err[key];
          }
        }
        return obj;
      }
      function getTimeFunction(opts) {
        if (typeof opts.timestamp === "function") {
          return opts.timestamp;
        }
        if (opts.timestamp === false) {
          return nullTime;
        }
        return epochTime;
      }
      function mock() {
        return {};
      }
      function passthrough(a) {
        return a;
      }
      function noop() {}
      function nullTime() {
        return false;
      }
      function epochTime() {
        return Date.now();
      }
      function unixTime() {
        return Math.round(Date.now() / 1e3);
      }
      function isoTime() {
        return new Date(Date.now()).toISOString();
      }
      function pfGlobalThisOrFallback() {
        function defd(o) {
          return typeof o !== "undefined" && o;
        }
        try {
          if (typeof globalThis !== "undefined") return globalThis;
          Object.defineProperty(Object.prototype, "globalThis", {
            get: function () {
              delete Object.prototype.globalThis;
              return (this.globalThis = this);
            },
            configurable: true,
          });
          return globalThis;
        } catch (e) {
          return defd(self) || defd(window) || defd(this) || {};
        }
      }
      module.exports.default = pino2;
      module.exports.pino = pino2;
    },
  });

  // node_modules/.pnpm/invariant@2.2.4/node_modules/invariant/browser.js
  var require_browser2 = __commonJS({
    "node_modules/.pnpm/invariant@2.2.4/node_modules/invariant/browser.js"(exports, module) {
      "use strict";
      var invariant5 = function (condition, format, a, b, c, d, e, f) {
        if (true) {
          if (format === void 0) {
            throw new Error("invariant requires an error message argument");
          }
        }
        if (!condition) {
          var error51;
          if (format === void 0) {
            error51 = new Error(
              "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.",
            );
          } else {
            var args = [a, b, c, d, e, f];
            var argIndex = 0;
            error51 = new Error(
              format.replace(/%s/g, function () {
                return args[argIndex++];
              }),
            );
            error51.name = "Invariant Violation";
          }
          error51.framesToPop = 1;
          throw error51;
        }
      };
      module.exports = invariant5;
    },
  });

  // node_modules/.pnpm/retry@0.13.1/node_modules/retry/lib/retry_operation.js
  var require_retry_operation = __commonJS({
    "node_modules/.pnpm/retry@0.13.1/node_modules/retry/lib/retry_operation.js"(exports, module) {
      function RetryOperation(timeouts, options) {
        if (typeof options === "boolean") {
          options = { forever: options };
        }
        this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
        this._timeouts = timeouts;
        this._options = options || {};
        this._maxRetryTime = (options && options.maxRetryTime) || Infinity;
        this._fn = null;
        this._errors = [];
        this._attempts = 1;
        this._operationTimeout = null;
        this._operationTimeoutCb = null;
        this._timeout = null;
        this._operationStart = null;
        this._timer = null;
        if (this._options.forever) {
          this._cachedTimeouts = this._timeouts.slice(0);
        }
      }
      module.exports = RetryOperation;
      RetryOperation.prototype.reset = function () {
        this._attempts = 1;
        this._timeouts = this._originalTimeouts.slice(0);
      };
      RetryOperation.prototype.stop = function () {
        if (this._timeout) {
          clearTimeout(this._timeout);
        }
        if (this._timer) {
          clearTimeout(this._timer);
        }
        this._timeouts = [];
        this._cachedTimeouts = null;
      };
      RetryOperation.prototype.retry = function (err) {
        if (this._timeout) {
          clearTimeout(this._timeout);
        }
        if (!err) {
          return false;
        }
        var currentTime = /* @__PURE__ */ new Date().getTime();
        if (err && currentTime - this._operationStart >= this._maxRetryTime) {
          this._errors.push(err);
          this._errors.unshift(new Error("RetryOperation timeout occurred"));
          return false;
        }
        this._errors.push(err);
        var timeout = this._timeouts.shift();
        if (timeout === void 0) {
          if (this._cachedTimeouts) {
            this._errors.splice(0, this._errors.length - 1);
            timeout = this._cachedTimeouts.slice(-1);
          } else {
            return false;
          }
        }
        var self2 = this;
        this._timer = setTimeout(function () {
          self2._attempts++;
          if (self2._operationTimeoutCb) {
            self2._timeout = setTimeout(function () {
              self2._operationTimeoutCb(self2._attempts);
            }, self2._operationTimeout);
            if (self2._options.unref) {
              self2._timeout.unref();
            }
          }
          self2._fn(self2._attempts);
        }, timeout);
        if (this._options.unref) {
          this._timer.unref();
        }
        return true;
      };
      RetryOperation.prototype.attempt = function (fn, timeoutOps) {
        this._fn = fn;
        if (timeoutOps) {
          if (timeoutOps.timeout) {
            this._operationTimeout = timeoutOps.timeout;
          }
          if (timeoutOps.cb) {
            this._operationTimeoutCb = timeoutOps.cb;
          }
        }
        var self2 = this;
        if (this._operationTimeoutCb) {
          this._timeout = setTimeout(function () {
            self2._operationTimeoutCb();
          }, self2._operationTimeout);
        }
        this._operationStart = /* @__PURE__ */ new Date().getTime();
        this._fn(this._attempts);
      };
      RetryOperation.prototype.try = function (fn) {
        console.log("Using RetryOperation.try() is deprecated");
        this.attempt(fn);
      };
      RetryOperation.prototype.start = function (fn) {
        console.log("Using RetryOperation.start() is deprecated");
        this.attempt(fn);
      };
      RetryOperation.prototype.start = RetryOperation.prototype.try;
      RetryOperation.prototype.errors = function () {
        return this._errors;
      };
      RetryOperation.prototype.attempts = function () {
        return this._attempts;
      };
      RetryOperation.prototype.mainError = function () {
        if (this._errors.length === 0) {
          return null;
        }
        var counts = {};
        var mainError = null;
        var mainErrorCount = 0;
        for (var i = 0; i < this._errors.length; i++) {
          var error51 = this._errors[i];
          var message = error51.message;
          var count = (counts[message] || 0) + 1;
          counts[message] = count;
          if (count >= mainErrorCount) {
            mainError = error51;
            mainErrorCount = count;
          }
        }
        return mainError;
      };
    },
  });

  // node_modules/.pnpm/retry@0.13.1/node_modules/retry/lib/retry.js
  var require_retry = __commonJS({
    "node_modules/.pnpm/retry@0.13.1/node_modules/retry/lib/retry.js"(exports) {
      var RetryOperation = require_retry_operation();
      exports.operation = function (options) {
        var timeouts = exports.timeouts(options);
        return new RetryOperation(timeouts, {
          forever: options && (options.forever || options.retries === Infinity),
          unref: options && options.unref,
          maxRetryTime: options && options.maxRetryTime,
        });
      };
      exports.timeouts = function (options) {
        if (options instanceof Array) {
          return [].concat(options);
        }
        var opts = {
          retries: 10,
          factor: 2,
          minTimeout: 1 * 1e3,
          maxTimeout: Infinity,
          randomize: false,
        };
        for (var key in options) {
          opts[key] = options[key];
        }
        if (opts.minTimeout > opts.maxTimeout) {
          throw new Error("minTimeout is greater than maxTimeout");
        }
        var timeouts = [];
        for (var i = 0; i < opts.retries; i++) {
          timeouts.push(this.createTimeout(i, opts));
        }
        if (options && options.forever && !timeouts.length) {
          timeouts.push(this.createTimeout(i, opts));
        }
        timeouts.sort(function (a, b) {
          return a - b;
        });
        return timeouts;
      };
      exports.createTimeout = function (attempt, opts) {
        var random = opts.randomize ? Math.random() + 1 : 1;
        var timeout = Math.round(
          random * Math.max(opts.minTimeout, 1) * Math.pow(opts.factor, attempt),
        );
        timeout = Math.min(timeout, opts.maxTimeout);
        return timeout;
      };
      exports.wrap = function (obj, options, methods) {
        if (options instanceof Array) {
          methods = options;
          options = null;
        }
        if (!methods) {
          methods = [];
          for (var key in obj) {
            if (typeof obj[key] === "function") {
              methods.push(key);
            }
          }
        }
        for (var i = 0; i < methods.length; i++) {
          var method = methods[i];
          var original = obj[method];
          obj[method] = function retryWrapper(original2) {
            var op = exports.operation(options);
            var args = Array.prototype.slice.call(arguments, 1);
            var callback = args.pop();
            args.push(function (err) {
              if (op.retry(err)) {
                return;
              }
              if (err) {
                arguments[0] = op.mainError();
              }
              callback.apply(this, arguments);
            });
            op.attempt(function () {
              original2.apply(obj, args);
            });
          }.bind(obj, original);
          obj[method].options = options;
        }
      };
    },
  });

  // node_modules/.pnpm/retry@0.13.1/node_modules/retry/index.js
  var require_retry2 = __commonJS({
    "node_modules/.pnpm/retry@0.13.1/node_modules/retry/index.js"(exports, module) {
      module.exports = require_retry();
    },
  });

  // node_modules/.pnpm/rivetkit@2.3.17_@libsql+client@0.18.0_@opentelemetry+api@1.9.0_better-sqlite3@12.11.1_sql.js@1.14.2_ws@8.21.3/node_modules/rivetkit/dist/browser/client.js
  var import_pino = __toESM(require_browser(), 1);

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/external.js
  var external_exports = {};
  __export(external_exports, {
    $brand: () => $brand,
    $input: () => $input,
    $output: () => $output,
    NEVER: () => NEVER,
    TimePrecision: () => TimePrecision,
    ZodAny: () => ZodAny,
    ZodArray: () => ZodArray,
    ZodBase64: () => ZodBase64,
    ZodBase64URL: () => ZodBase64URL,
    ZodBigInt: () => ZodBigInt,
    ZodBigIntFormat: () => ZodBigIntFormat,
    ZodBoolean: () => ZodBoolean,
    ZodCIDRv4: () => ZodCIDRv4,
    ZodCIDRv6: () => ZodCIDRv6,
    ZodCUID: () => ZodCUID,
    ZodCUID2: () => ZodCUID2,
    ZodCatch: () => ZodCatch,
    ZodCodec: () => ZodCodec,
    ZodCustom: () => ZodCustom,
    ZodCustomStringFormat: () => ZodCustomStringFormat,
    ZodDate: () => ZodDate,
    ZodDefault: () => ZodDefault,
    ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
    ZodE164: () => ZodE164,
    ZodEmail: () => ZodEmail,
    ZodEmoji: () => ZodEmoji,
    ZodEnum: () => ZodEnum,
    ZodError: () => ZodError,
    ZodExactOptional: () => ZodExactOptional,
    ZodFile: () => ZodFile,
    ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
    ZodFunction: () => ZodFunction,
    ZodGUID: () => ZodGUID,
    ZodIPv4: () => ZodIPv4,
    ZodIPv6: () => ZodIPv6,
    ZodISODate: () => ZodISODate,
    ZodISODateTime: () => ZodISODateTime,
    ZodISODuration: () => ZodISODuration,
    ZodISOTime: () => ZodISOTime,
    ZodIntersection: () => ZodIntersection,
    ZodIssueCode: () => ZodIssueCode,
    ZodJWT: () => ZodJWT,
    ZodKSUID: () => ZodKSUID,
    ZodLazy: () => ZodLazy,
    ZodLiteral: () => ZodLiteral,
    ZodMAC: () => ZodMAC,
    ZodMap: () => ZodMap,
    ZodNaN: () => ZodNaN,
    ZodNanoID: () => ZodNanoID,
    ZodNever: () => ZodNever,
    ZodNonOptional: () => ZodNonOptional,
    ZodNull: () => ZodNull,
    ZodNullable: () => ZodNullable,
    ZodNumber: () => ZodNumber,
    ZodNumberFormat: () => ZodNumberFormat,
    ZodObject: () => ZodObject,
    ZodOptional: () => ZodOptional,
    ZodPipe: () => ZodPipe,
    ZodPrefault: () => ZodPrefault,
    ZodPreprocess: () => ZodPreprocess,
    ZodPromise: () => ZodPromise,
    ZodReadonly: () => ZodReadonly,
    ZodRealError: () => ZodRealError,
    ZodRecord: () => ZodRecord,
    ZodSet: () => ZodSet,
    ZodString: () => ZodString,
    ZodStringFormat: () => ZodStringFormat,
    ZodSuccess: () => ZodSuccess,
    ZodSymbol: () => ZodSymbol,
    ZodTemplateLiteral: () => ZodTemplateLiteral,
    ZodTransform: () => ZodTransform,
    ZodTuple: () => ZodTuple,
    ZodType: () => ZodType,
    ZodULID: () => ZodULID,
    ZodURL: () => ZodURL,
    ZodUUID: () => ZodUUID,
    ZodUndefined: () => ZodUndefined,
    ZodUnion: () => ZodUnion,
    ZodUnknown: () => ZodUnknown,
    ZodVoid: () => ZodVoid,
    ZodXID: () => ZodXID,
    ZodXor: () => ZodXor,
    _ZodString: () => _ZodString,
    _default: () => _default2,
    _function: () => _function,
    any: () => any,
    array: () => array,
    base64: () => base642,
    base64url: () => base64url2,
    bigint: () => bigint2,
    boolean: () => boolean2,
    catch: () => _catch2,
    check: () => check,
    cidrv4: () => cidrv42,
    cidrv6: () => cidrv62,
    clone: () => clone,
    codec: () => codec,
    coerce: () => coerce_exports,
    config: () => config,
    core: () => core_exports2,
    cuid: () => cuid3,
    cuid2: () => cuid22,
    custom: () => custom,
    date: () => date3,
    decode: () => decode2,
    decodeAsync: () => decodeAsync2,
    describe: () => describe2,
    discriminatedUnion: () => discriminatedUnion,
    e164: () => e1642,
    email: () => email2,
    emoji: () => emoji2,
    encode: () => encode2,
    encodeAsync: () => encodeAsync2,
    endsWith: () => _endsWith,
    enum: () => _enum2,
    exactOptional: () => exactOptional,
    file: () => file,
    flattenError: () => flattenError,
    float32: () => float32,
    float64: () => float64,
    formatError: () => formatError,
    fromJSONSchema: () => fromJSONSchema,
    function: () => _function,
    getErrorMap: () => getErrorMap,
    globalRegistry: () => globalRegistry,
    gt: () => _gt,
    gte: () => _gte,
    guid: () => guid2,
    hash: () => hash,
    hex: () => hex2,
    hostname: () => hostname2,
    httpUrl: () => httpUrl,
    includes: () => _includes,
    instanceof: () => _instanceof,
    int: () => int,
    int32: () => int32,
    int64: () => int64,
    intersection: () => intersection,
    invertCodec: () => invertCodec,
    ipv4: () => ipv42,
    ipv6: () => ipv62,
    iso: () => iso_exports,
    json: () => json,
    jwt: () => jwt,
    keyof: () => keyof,
    ksuid: () => ksuid2,
    lazy: () => lazy,
    length: () => _length,
    literal: () => literal,
    locales: () => locales_exports,
    looseObject: () => looseObject,
    looseRecord: () => looseRecord,
    lowercase: () => _lowercase,
    lt: () => _lt,
    lte: () => _lte,
    mac: () => mac2,
    map: () => map,
    maxLength: () => _maxLength,
    maxSize: () => _maxSize,
    meta: () => meta2,
    mime: () => _mime,
    minLength: () => _minLength,
    minSize: () => _minSize,
    multipleOf: () => _multipleOf,
    nan: () => nan,
    nanoid: () => nanoid2,
    nativeEnum: () => nativeEnum,
    negative: () => _negative,
    never: () => never,
    nonnegative: () => _nonnegative,
    nonoptional: () => nonoptional,
    nonpositive: () => _nonpositive,
    normalize: () => _normalize,
    null: () => _null3,
    nullable: () => nullable,
    nullish: () => nullish2,
    number: () => number2,
    object: () => object,
    optional: () => optional,
    overwrite: () => _overwrite,
    parse: () => parse2,
    parseAsync: () => parseAsync2,
    partialRecord: () => partialRecord,
    pipe: () => pipe,
    positive: () => _positive,
    prefault: () => prefault,
    preprocess: () => preprocess,
    prettifyError: () => prettifyError,
    promise: () => promise,
    property: () => _property,
    readonly: () => readonly,
    record: () => record,
    refine: () => refine,
    regex: () => _regex,
    regexes: () => regexes_exports,
    registry: () => registry,
    safeDecode: () => safeDecode2,
    safeDecodeAsync: () => safeDecodeAsync2,
    safeEncode: () => safeEncode2,
    safeEncodeAsync: () => safeEncodeAsync2,
    safeParse: () => safeParse2,
    safeParseAsync: () => safeParseAsync2,
    set: () => set,
    setErrorMap: () => setErrorMap,
    size: () => _size,
    slugify: () => _slugify,
    startsWith: () => _startsWith,
    strictObject: () => strictObject,
    string: () => string2,
    stringFormat: () => stringFormat,
    stringbool: () => stringbool,
    success: () => success,
    superRefine: () => superRefine,
    symbol: () => symbol,
    templateLiteral: () => templateLiteral,
    toJSONSchema: () => toJSONSchema,
    toLowerCase: () => _toLowerCase,
    toUpperCase: () => _toUpperCase,
    transform: () => transform,
    treeifyError: () => treeifyError,
    trim: () => _trim,
    tuple: () => tuple,
    uint32: () => uint32,
    uint64: () => uint64,
    ulid: () => ulid2,
    undefined: () => _undefined3,
    union: () => union,
    unknown: () => unknown,
    uppercase: () => _uppercase,
    url: () => url,
    util: () => util_exports,
    uuid: () => uuid2,
    uuidv4: () => uuidv4,
    uuidv6: () => uuidv6,
    uuidv7: () => uuidv7,
    void: () => _void2,
    xid: () => xid2,
    xor: () => xor,
  });

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/index.js
  var core_exports2 = {};
  __export(core_exports2, {
    $ZodAny: () => $ZodAny,
    $ZodArray: () => $ZodArray,
    $ZodAsyncError: () => $ZodAsyncError,
    $ZodBase64: () => $ZodBase64,
    $ZodBase64URL: () => $ZodBase64URL,
    $ZodBigInt: () => $ZodBigInt,
    $ZodBigIntFormat: () => $ZodBigIntFormat,
    $ZodBoolean: () => $ZodBoolean,
    $ZodCIDRv4: () => $ZodCIDRv4,
    $ZodCIDRv6: () => $ZodCIDRv6,
    $ZodCUID: () => $ZodCUID,
    $ZodCUID2: () => $ZodCUID2,
    $ZodCatch: () => $ZodCatch,
    $ZodCheck: () => $ZodCheck,
    $ZodCheckBigIntFormat: () => $ZodCheckBigIntFormat,
    $ZodCheckEndsWith: () => $ZodCheckEndsWith,
    $ZodCheckGreaterThan: () => $ZodCheckGreaterThan,
    $ZodCheckIncludes: () => $ZodCheckIncludes,
    $ZodCheckLengthEquals: () => $ZodCheckLengthEquals,
    $ZodCheckLessThan: () => $ZodCheckLessThan,
    $ZodCheckLowerCase: () => $ZodCheckLowerCase,
    $ZodCheckMaxLength: () => $ZodCheckMaxLength,
    $ZodCheckMaxSize: () => $ZodCheckMaxSize,
    $ZodCheckMimeType: () => $ZodCheckMimeType,
    $ZodCheckMinLength: () => $ZodCheckMinLength,
    $ZodCheckMinSize: () => $ZodCheckMinSize,
    $ZodCheckMultipleOf: () => $ZodCheckMultipleOf,
    $ZodCheckNumberFormat: () => $ZodCheckNumberFormat,
    $ZodCheckOverwrite: () => $ZodCheckOverwrite,
    $ZodCheckProperty: () => $ZodCheckProperty,
    $ZodCheckRegex: () => $ZodCheckRegex,
    $ZodCheckSizeEquals: () => $ZodCheckSizeEquals,
    $ZodCheckStartsWith: () => $ZodCheckStartsWith,
    $ZodCheckStringFormat: () => $ZodCheckStringFormat,
    $ZodCheckUpperCase: () => $ZodCheckUpperCase,
    $ZodCodec: () => $ZodCodec,
    $ZodCustom: () => $ZodCustom,
    $ZodCustomStringFormat: () => $ZodCustomStringFormat,
    $ZodDate: () => $ZodDate,
    $ZodDefault: () => $ZodDefault,
    $ZodDiscriminatedUnion: () => $ZodDiscriminatedUnion,
    $ZodE164: () => $ZodE164,
    $ZodEmail: () => $ZodEmail,
    $ZodEmoji: () => $ZodEmoji,
    $ZodEncodeError: () => $ZodEncodeError,
    $ZodEnum: () => $ZodEnum,
    $ZodError: () => $ZodError,
    $ZodExactOptional: () => $ZodExactOptional,
    $ZodFile: () => $ZodFile,
    $ZodFunction: () => $ZodFunction,
    $ZodGUID: () => $ZodGUID,
    $ZodIPv4: () => $ZodIPv4,
    $ZodIPv6: () => $ZodIPv6,
    $ZodISODate: () => $ZodISODate,
    $ZodISODateTime: () => $ZodISODateTime,
    $ZodISODuration: () => $ZodISODuration,
    $ZodISOTime: () => $ZodISOTime,
    $ZodIntersection: () => $ZodIntersection,
    $ZodJWT: () => $ZodJWT,
    $ZodKSUID: () => $ZodKSUID,
    $ZodLazy: () => $ZodLazy,
    $ZodLiteral: () => $ZodLiteral,
    $ZodMAC: () => $ZodMAC,
    $ZodMap: () => $ZodMap,
    $ZodNaN: () => $ZodNaN,
    $ZodNanoID: () => $ZodNanoID,
    $ZodNever: () => $ZodNever,
    $ZodNonOptional: () => $ZodNonOptional,
    $ZodNull: () => $ZodNull,
    $ZodNullable: () => $ZodNullable,
    $ZodNumber: () => $ZodNumber,
    $ZodNumberFormat: () => $ZodNumberFormat,
    $ZodObject: () => $ZodObject,
    $ZodObjectJIT: () => $ZodObjectJIT,
    $ZodOptional: () => $ZodOptional,
    $ZodPipe: () => $ZodPipe,
    $ZodPrefault: () => $ZodPrefault,
    $ZodPreprocess: () => $ZodPreprocess,
    $ZodPromise: () => $ZodPromise,
    $ZodReadonly: () => $ZodReadonly,
    $ZodRealError: () => $ZodRealError,
    $ZodRecord: () => $ZodRecord,
    $ZodRegistry: () => $ZodRegistry,
    $ZodSet: () => $ZodSet,
    $ZodString: () => $ZodString,
    $ZodStringFormat: () => $ZodStringFormat,
    $ZodSuccess: () => $ZodSuccess,
    $ZodSymbol: () => $ZodSymbol,
    $ZodTemplateLiteral: () => $ZodTemplateLiteral,
    $ZodTransform: () => $ZodTransform,
    $ZodTuple: () => $ZodTuple,
    $ZodType: () => $ZodType,
    $ZodULID: () => $ZodULID,
    $ZodURL: () => $ZodURL,
    $ZodUUID: () => $ZodUUID,
    $ZodUndefined: () => $ZodUndefined,
    $ZodUnion: () => $ZodUnion,
    $ZodUnknown: () => $ZodUnknown,
    $ZodVoid: () => $ZodVoid,
    $ZodXID: () => $ZodXID,
    $ZodXor: () => $ZodXor,
    $brand: () => $brand,
    $constructor: () => $constructor,
    $input: () => $input,
    $output: () => $output,
    Doc: () => Doc,
    JSONSchema: () => json_schema_exports,
    JSONSchemaGenerator: () => JSONSchemaGenerator,
    NEVER: () => NEVER,
    TimePrecision: () => TimePrecision,
    _any: () => _any,
    _array: () => _array,
    _base64: () => _base64,
    _base64url: () => _base64url,
    _bigint: () => _bigint,
    _boolean: () => _boolean,
    _catch: () => _catch,
    _check: () => _check,
    _cidrv4: () => _cidrv4,
    _cidrv6: () => _cidrv6,
    _coercedBigint: () => _coercedBigint,
    _coercedBoolean: () => _coercedBoolean,
    _coercedDate: () => _coercedDate,
    _coercedNumber: () => _coercedNumber,
    _coercedString: () => _coercedString,
    _cuid: () => _cuid,
    _cuid2: () => _cuid2,
    _custom: () => _custom,
    _date: () => _date,
    _decode: () => _decode,
    _decodeAsync: () => _decodeAsync,
    _default: () => _default,
    _discriminatedUnion: () => _discriminatedUnion,
    _e164: () => _e164,
    _email: () => _email,
    _emoji: () => _emoji2,
    _encode: () => _encode,
    _encodeAsync: () => _encodeAsync,
    _endsWith: () => _endsWith,
    _enum: () => _enum,
    _file: () => _file,
    _float32: () => _float32,
    _float64: () => _float64,
    _gt: () => _gt,
    _gte: () => _gte,
    _guid: () => _guid,
    _includes: () => _includes,
    _int: () => _int,
    _int32: () => _int32,
    _int64: () => _int64,
    _intersection: () => _intersection,
    _ipv4: () => _ipv4,
    _ipv6: () => _ipv6,
    _isoDate: () => _isoDate,
    _isoDateTime: () => _isoDateTime,
    _isoDuration: () => _isoDuration,
    _isoTime: () => _isoTime,
    _jwt: () => _jwt,
    _ksuid: () => _ksuid,
    _lazy: () => _lazy,
    _length: () => _length,
    _literal: () => _literal,
    _lowercase: () => _lowercase,
    _lt: () => _lt,
    _lte: () => _lte,
    _mac: () => _mac,
    _map: () => _map,
    _max: () => _lte,
    _maxLength: () => _maxLength,
    _maxSize: () => _maxSize,
    _mime: () => _mime,
    _min: () => _gte,
    _minLength: () => _minLength,
    _minSize: () => _minSize,
    _multipleOf: () => _multipleOf,
    _nan: () => _nan,
    _nanoid: () => _nanoid,
    _nativeEnum: () => _nativeEnum,
    _negative: () => _negative,
    _never: () => _never,
    _nonnegative: () => _nonnegative,
    _nonoptional: () => _nonoptional,
    _nonpositive: () => _nonpositive,
    _normalize: () => _normalize,
    _null: () => _null2,
    _nullable: () => _nullable,
    _number: () => _number,
    _optional: () => _optional,
    _overwrite: () => _overwrite,
    _parse: () => _parse,
    _parseAsync: () => _parseAsync,
    _pipe: () => _pipe,
    _positive: () => _positive,
    _promise: () => _promise,
    _property: () => _property,
    _readonly: () => _readonly,
    _record: () => _record,
    _refine: () => _refine,
    _regex: () => _regex,
    _safeDecode: () => _safeDecode,
    _safeDecodeAsync: () => _safeDecodeAsync,
    _safeEncode: () => _safeEncode,
    _safeEncodeAsync: () => _safeEncodeAsync,
    _safeParse: () => _safeParse,
    _safeParseAsync: () => _safeParseAsync,
    _set: () => _set,
    _size: () => _size,
    _slugify: () => _slugify,
    _startsWith: () => _startsWith,
    _string: () => _string,
    _stringFormat: () => _stringFormat,
    _stringbool: () => _stringbool,
    _success: () => _success,
    _superRefine: () => _superRefine,
    _symbol: () => _symbol,
    _templateLiteral: () => _templateLiteral,
    _toLowerCase: () => _toLowerCase,
    _toUpperCase: () => _toUpperCase,
    _transform: () => _transform,
    _trim: () => _trim,
    _tuple: () => _tuple,
    _uint32: () => _uint32,
    _uint64: () => _uint64,
    _ulid: () => _ulid,
    _undefined: () => _undefined2,
    _union: () => _union,
    _unknown: () => _unknown,
    _uppercase: () => _uppercase,
    _url: () => _url,
    _uuid: () => _uuid,
    _uuidv4: () => _uuidv4,
    _uuidv6: () => _uuidv6,
    _uuidv7: () => _uuidv7,
    _void: () => _void,
    _xid: () => _xid,
    _xor: () => _xor,
    clone: () => clone,
    config: () => config,
    createStandardJSONSchemaMethod: () => createStandardJSONSchemaMethod,
    createToJSONSchemaMethod: () => createToJSONSchemaMethod,
    decode: () => decode,
    decodeAsync: () => decodeAsync,
    describe: () => describe,
    encode: () => encode,
    encodeAsync: () => encodeAsync,
    extractDefs: () => extractDefs,
    finalize: () => finalize,
    flattenError: () => flattenError,
    formatError: () => formatError,
    globalConfig: () => globalConfig,
    globalRegistry: () => globalRegistry,
    initializeContext: () => initializeContext,
    isValidBase64: () => isValidBase64,
    isValidBase64URL: () => isValidBase64URL,
    isValidJWT: () => isValidJWT,
    locales: () => locales_exports,
    meta: () => meta,
    parse: () => parse,
    parseAsync: () => parseAsync,
    prettifyError: () => prettifyError,
    process: () => process2,
    regexes: () => regexes_exports,
    registry: () => registry,
    safeDecode: () => safeDecode,
    safeDecodeAsync: () => safeDecodeAsync,
    safeEncode: () => safeEncode,
    safeEncodeAsync: () => safeEncodeAsync,
    safeParse: () => safeParse,
    safeParseAsync: () => safeParseAsync,
    toDotPath: () => toDotPath,
    toJSONSchema: () => toJSONSchema,
    treeifyError: () => treeifyError,
    util: () => util_exports,
    version: () => version,
  });

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
  var _a;
  var NEVER = /* @__PURE__ */ Object.freeze({
    status: "aborted",
  });
  // @__NO_SIDE_EFFECTS__
  function $constructor(name, initializer3, params) {
    function init(inst, def) {
      if (!inst._zod) {
        Object.defineProperty(inst, "_zod", {
          value: {
            def,
            constr: _,
            traits: /* @__PURE__ */ new Set(),
          },
          enumerable: false,
        });
      }
      if (inst._zod.traits.has(name)) {
        return;
      }
      inst._zod.traits.add(name);
      initializer3(inst, def);
      const proto = _.prototype;
      const keys = Object.keys(proto);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (!(k in inst)) {
          inst[k] = proto[k].bind(inst);
        }
      }
    }
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {}
    Object.defineProperty(Definition, "name", { value: name });
    function _(def) {
      var _a3;
      const inst = params?.Parent ? new Definition() : this;
      init(inst, def);
      (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
      for (const fn of inst._zod.deferred) {
        fn();
      }
      return inst;
    }
    Object.defineProperty(_, "init", { value: init });
    Object.defineProperty(_, Symbol.hasInstance, {
      value: (inst) => {
        if (params?.Parent && inst instanceof params.Parent) return true;
        return inst?._zod?.traits?.has(name);
      },
    });
    Object.defineProperty(_, "name", { value: name });
    return _;
  }
  var $brand = /* @__PURE__ */ Symbol("zod_brand");
  var $ZodAsyncError = class extends Error {
    constructor() {
      super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
  };
  var $ZodEncodeError = class extends Error {
    constructor(name) {
      super(`Encountered unidirectional transform during encode: ${name}`);
      this.name = "ZodEncodeError";
    }
  };
  (_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
  var globalConfig = globalThis.__zod_globalConfig;
  function config(newConfig) {
    if (newConfig) Object.assign(globalConfig, newConfig);
    return globalConfig;
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
  var util_exports = {};
  __export(util_exports, {
    BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
    Class: () => Class,
    NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
    aborted: () => aborted,
    allowsEval: () => allowsEval,
    assert: () => assert,
    assertEqual: () => assertEqual,
    assertIs: () => assertIs,
    assertNever: () => assertNever,
    assertNotEqual: () => assertNotEqual,
    assignProp: () => assignProp,
    base64ToUint8Array: () => base64ToUint8Array,
    base64urlToUint8Array: () => base64urlToUint8Array,
    cached: () => cached,
    captureStackTrace: () => captureStackTrace,
    cleanEnum: () => cleanEnum,
    cleanRegex: () => cleanRegex,
    clone: () => clone,
    cloneDef: () => cloneDef,
    createTransparentProxy: () => createTransparentProxy,
    defineLazy: () => defineLazy,
    esc: () => esc,
    escapeRegex: () => escapeRegex,
    explicitlyAborted: () => explicitlyAborted,
    extend: () => extend,
    finalizeIssue: () => finalizeIssue,
    floatSafeRemainder: () => floatSafeRemainder,
    getElementAtPath: () => getElementAtPath,
    getEnumValues: () => getEnumValues,
    getLengthableOrigin: () => getLengthableOrigin,
    getParsedType: () => getParsedType,
    getSizableOrigin: () => getSizableOrigin,
    hexToUint8Array: () => hexToUint8Array,
    isObject: () => isObject,
    isPlainObject: () => isPlainObject,
    issue: () => issue,
    joinValues: () => joinValues,
    jsonStringifyReplacer: () => jsonStringifyReplacer,
    merge: () => merge,
    mergeDefs: () => mergeDefs,
    normalizeParams: () => normalizeParams,
    nullish: () => nullish,
    numKeys: () => numKeys,
    objectClone: () => objectClone,
    omit: () => omit,
    optionalKeys: () => optionalKeys,
    parsedType: () => parsedType,
    partial: () => partial,
    pick: () => pick,
    prefixIssues: () => prefixIssues,
    primitiveTypes: () => primitiveTypes,
    promiseAllObject: () => promiseAllObject,
    propertyKeyTypes: () => propertyKeyTypes,
    randomString: () => randomString,
    required: () => required,
    safeExtend: () => safeExtend,
    shallowClone: () => shallowClone,
    slugify: () => slugify,
    stringifyPrimitive: () => stringifyPrimitive,
    uint8ArrayToBase64: () => uint8ArrayToBase64,
    uint8ArrayToBase64url: () => uint8ArrayToBase64url,
    uint8ArrayToHex: () => uint8ArrayToHex,
    unwrapMessage: () => unwrapMessage,
  });
  function assertEqual(val) {
    return val;
  }
  function assertNotEqual(val) {
    return val;
  }
  function assertIs(_arg) {}
  function assertNever(_x) {
    throw new Error("Unexpected value in exhaustive check");
  }
  function assert(_) {}
  function getEnumValues(entries) {
    const numericValues = Object.values(entries).filter((v) => typeof v === "number");
    const values = Object.entries(entries)
      .filter(([k, _]) => numericValues.indexOf(+k) === -1)
      .map(([_, v]) => v);
    return values;
  }
  function joinValues(array2, separator = "|") {
    return array2.map((val) => stringifyPrimitive(val)).join(separator);
  }
  function jsonStringifyReplacer(_, value) {
    if (typeof value === "bigint") return value.toString();
    return value;
  }
  function cached(getter) {
    const set2 = false;
    return {
      get value() {
        if (!set2) {
          const value = getter();
          Object.defineProperty(this, "value", { value });
          return value;
        }
        throw new Error("cached value already set");
      },
    };
  }
  function nullish(input) {
    return input === null || input === void 0;
  }
  function cleanRegex(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
  }
  function floatSafeRemainder(val, step) {
    const ratio = val / step;
    const roundedRatio = Math.round(ratio);
    const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
    if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
    return ratio - roundedRatio;
  }
  var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
  function defineLazy(object2, key, getter) {
    let value = void 0;
    Object.defineProperty(object2, key, {
      get() {
        if (value === EVALUATING) {
          return void 0;
        }
        if (value === void 0) {
          value = EVALUATING;
          value = getter();
        }
        return value;
      },
      set(v) {
        Object.defineProperty(object2, key, {
          value: v,
          // configurable: true,
        });
      },
      configurable: true,
    });
  }
  function objectClone(obj) {
    return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  }
  function assignProp(target2, prop, value) {
    Object.defineProperty(target2, prop, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  function mergeDefs(...defs) {
    const mergedDescriptors = {};
    for (const def of defs) {
      const descriptors = Object.getOwnPropertyDescriptors(def);
      Object.assign(mergedDescriptors, descriptors);
    }
    return Object.defineProperties({}, mergedDescriptors);
  }
  function cloneDef(schema) {
    return mergeDefs(schema._zod.def);
  }
  function getElementAtPath(obj, path) {
    if (!path) return obj;
    return path.reduce((acc, key) => acc?.[key], obj);
  }
  function promiseAllObject(promisesObj) {
    const keys = Object.keys(promisesObj);
    const promises = keys.map((key) => promisesObj[key]);
    return Promise.all(promises).then((results) => {
      const resolvedObj = {};
      for (let i = 0; i < keys.length; i++) {
        resolvedObj[keys[i]] = results[i];
      }
      return resolvedObj;
    });
  }
  function randomString(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }
  function esc(str) {
    return JSON.stringify(str);
  }
  function slugify(input) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
  function isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
  }
  var allowsEval = /* @__PURE__ */ cached(() => {
    if (globalConfig.jitless) {
      return false;
    }
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
      return false;
    }
    try {
      const F = Function;
      new F("");
      return true;
    } catch (_) {
      return false;
    }
  });
  function isPlainObject(o) {
    if (isObject(o) === false) return false;
    const ctor = o.constructor;
    if (ctor === void 0) return true;
    if (typeof ctor !== "function") return true;
    const prot = ctor.prototype;
    if (isObject(prot) === false) return false;
    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  function shallowClone(o) {
    if (isPlainObject(o)) return { ...o };
    if (Array.isArray(o)) return [...o];
    if (o instanceof Map) return new Map(o);
    if (o instanceof Set) return new Set(o);
    return o;
  }
  function numKeys(data) {
    let keyCount = 0;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        keyCount++;
      }
    }
    return keyCount;
  }
  var getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
      case "undefined":
        return "undefined";
      case "string":
        return "string";
      case "number":
        return Number.isNaN(data) ? "nan" : "number";
      case "boolean":
        return "boolean";
      case "function":
        return "function";
      case "bigint":
        return "bigint";
      case "symbol":
        return "symbol";
      case "object":
        if (Array.isArray(data)) {
          return "array";
        }
        if (data === null) {
          return "null";
        }
        if (
          data.then &&
          typeof data.then === "function" &&
          data.catch &&
          typeof data.catch === "function"
        ) {
          return "promise";
        }
        if (typeof Map !== "undefined" && data instanceof Map) {
          return "map";
        }
        if (typeof Set !== "undefined" && data instanceof Set) {
          return "set";
        }
        if (typeof Date !== "undefined" && data instanceof Date) {
          return "date";
        }
        if (typeof File !== "undefined" && data instanceof File) {
          return "file";
        }
        return "object";
      default:
        throw new Error(`Unknown data type: ${t}`);
    }
  };
  var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
  var primitiveTypes = /* @__PURE__ */ new Set([
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol",
    "undefined",
  ]);
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function clone(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent) cl._zod.parent = inst;
    return cl;
  }
  function normalizeParams(_params) {
    const params = _params;
    if (!params) return {};
    if (typeof params === "string") return { error: () => params };
    if (params?.message !== void 0) {
      if (params?.error !== void 0)
        throw new Error("Cannot specify both `message` and `error` params");
      params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string") return { ...params, error: () => params.error };
    return params;
  }
  function createTransparentProxy(getter) {
    let target2;
    return new Proxy(
      {},
      {
        get(_, prop, receiver) {
          target2 ?? (target2 = getter());
          return Reflect.get(target2, prop, receiver);
        },
        set(_, prop, value, receiver) {
          target2 ?? (target2 = getter());
          return Reflect.set(target2, prop, value, receiver);
        },
        has(_, prop) {
          target2 ?? (target2 = getter());
          return Reflect.has(target2, prop);
        },
        deleteProperty(_, prop) {
          target2 ?? (target2 = getter());
          return Reflect.deleteProperty(target2, prop);
        },
        ownKeys(_) {
          target2 ?? (target2 = getter());
          return Reflect.ownKeys(target2);
        },
        getOwnPropertyDescriptor(_, prop) {
          target2 ?? (target2 = getter());
          return Reflect.getOwnPropertyDescriptor(target2, prop);
        },
        defineProperty(_, prop, descriptor) {
          target2 ?? (target2 = getter());
          return Reflect.defineProperty(target2, prop, descriptor);
        },
      },
    );
  }
  function stringifyPrimitive(value) {
    if (typeof value === "bigint") return value.toString() + "n";
    if (typeof value === "string") return `"${value}"`;
    return `${value}`;
  }
  function optionalKeys(shape) {
    return Object.keys(shape).filter((k) => {
      return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
  }
  var NUMBER_FORMAT_RANGES = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-34028234663852886e22, 34028234663852886e22],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
  };
  var BIGINT_FORMAT_RANGES = {
    int64: [
      /* @__PURE__ */ BigInt("-9223372036854775808"),
      /* @__PURE__ */ BigInt("9223372036854775807"),
    ],
    uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")],
  };
  function pick(schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
      throw new Error(".pick() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const newShape = {};
        for (const key in mask) {
          if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key]) continue;
          newShape[key] = currDef.shape[key];
        }
        assignProp(this, "shape", newShape);
        return newShape;
      },
      checks: [],
    });
    return clone(schema, def);
  }
  function omit(schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
      throw new Error(".omit() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const newShape = { ...schema._zod.def.shape };
        for (const key in mask) {
          if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
          }
          if (!mask[key]) continue;
          delete newShape[key];
        }
        assignProp(this, "shape", newShape);
        return newShape;
      },
      checks: [],
    });
    return clone(schema, def);
  }
  function extend(schema, shape) {
    if (!isPlainObject(shape)) {
      throw new Error("Invalid input to extend: expected a plain object");
    }
    const checks = schema._zod.def.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
      const existingShape = schema._zod.def.shape;
      for (const key in shape) {
        if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
          throw new Error(
            "Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.",
          );
        }
      }
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const _shape = { ...schema._zod.def.shape, ...shape };
        assignProp(this, "shape", _shape);
        return _shape;
      },
    });
    return clone(schema, def);
  }
  function safeExtend(schema, shape) {
    if (!isPlainObject(shape)) {
      throw new Error("Invalid input to safeExtend: expected a plain object");
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const _shape = { ...schema._zod.def.shape, ...shape };
        assignProp(this, "shape", _shape);
        return _shape;
      },
    });
    return clone(schema, def);
  }
  function merge(a, b) {
    if (a._zod.def.checks?.length) {
      throw new Error(
        ".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.",
      );
    }
    const def = mergeDefs(a._zod.def, {
      get shape() {
        const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
        assignProp(this, "shape", _shape);
        return _shape;
      },
      get catchall() {
        return b._zod.def.catchall;
      },
      checks: b._zod.def.checks ?? [],
    });
    return clone(a, def);
  }
  function partial(Class2, schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
      throw new Error(".partial() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const oldShape = schema._zod.def.shape;
        const shape = { ...oldShape };
        if (mask) {
          for (const key in mask) {
            if (!(key in oldShape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key]) continue;
            shape[key] = Class2
              ? new Class2({
                  type: "optional",
                  innerType: oldShape[key],
                })
              : oldShape[key];
          }
        } else {
          for (const key in oldShape) {
            shape[key] = Class2
              ? new Class2({
                  type: "optional",
                  innerType: oldShape[key],
                })
              : oldShape[key];
          }
        }
        assignProp(this, "shape", shape);
        return shape;
      },
      checks: [],
    });
    return clone(schema, def);
  }
  function required(Class2, schema, mask) {
    const def = mergeDefs(schema._zod.def, {
      get shape() {
        const oldShape = schema._zod.def.shape;
        const shape = { ...oldShape };
        if (mask) {
          for (const key in mask) {
            if (!(key in shape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key]) continue;
            shape[key] = new Class2({
              type: "nonoptional",
              innerType: oldShape[key],
            });
          }
        } else {
          for (const key in oldShape) {
            shape[key] = new Class2({
              type: "nonoptional",
              innerType: oldShape[key],
            });
          }
        }
        assignProp(this, "shape", shape);
        return shape;
      },
    });
    return clone(schema, def);
  }
  function aborted(x, startIndex = 0) {
    if (x.aborted === true) return true;
    for (let i = startIndex; i < x.issues.length; i++) {
      if (x.issues[i]?.continue !== true) {
        return true;
      }
    }
    return false;
  }
  function explicitlyAborted(x, startIndex = 0) {
    if (x.aborted === true) return true;
    for (let i = startIndex; i < x.issues.length; i++) {
      if (x.issues[i]?.continue === false) {
        return true;
      }
    }
    return false;
  }
  function prefixIssues(path, issues) {
    return issues.map((iss) => {
      var _a3;
      (_a3 = iss).path ?? (_a3.path = []);
      iss.path.unshift(path);
      return iss;
    });
  }
  function unwrapMessage(message) {
    return typeof message === "string" ? message : message?.message;
  }
  function finalizeIssue(iss, ctx, config2) {
    const message = iss.message
      ? iss.message
      : (unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ??
        unwrapMessage(ctx?.error?.(iss)) ??
        unwrapMessage(config2.customError?.(iss)) ??
        unwrapMessage(config2.localeError?.(iss)) ??
        "Invalid input");
    const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
    rest.path ?? (rest.path = []);
    rest.message = message;
    if (ctx?.reportInput) {
      rest.input = _input;
    }
    return rest;
  }
  function getSizableOrigin(input) {
    if (input instanceof Set) return "set";
    if (input instanceof Map) return "map";
    if (input instanceof File) return "file";
    return "unknown";
  }
  function getLengthableOrigin(input) {
    if (Array.isArray(input)) return "array";
    if (typeof input === "string") return "string";
    return "unknown";
  }
  function parsedType(data) {
    const t = typeof data;
    switch (t) {
      case "number": {
        return Number.isNaN(data) ? "nan" : "number";
      }
      case "object": {
        if (data === null) {
          return "null";
        }
        if (Array.isArray(data)) {
          return "array";
        }
        const obj = data;
        if (
          obj &&
          Object.getPrototypeOf(obj) !== Object.prototype &&
          "constructor" in obj &&
          obj.constructor
        ) {
          return obj.constructor.name;
        }
      }
    }
    return t;
  }
  function issue(...args) {
    const [iss, input, inst] = args;
    if (typeof iss === "string") {
      return {
        message: iss,
        code: "custom",
        input,
        inst,
      };
    }
    return { ...iss };
  }
  function cleanEnum(obj) {
    return Object.entries(obj)
      .filter(([k, _]) => {
        return Number.isNaN(Number.parseInt(k, 10));
      })
      .map((el2) => el2[1]);
  }
  function base64ToUint8Array(base643) {
    const binaryString = atob(base643);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  function uint8ArrayToBase64(bytes) {
    let binaryString = "";
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  }
  function base64urlToUint8Array(base64url3) {
    const base643 = base64url3.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base643.length % 4)) % 4);
    return base64ToUint8Array(base643 + padding);
  }
  function uint8ArrayToBase64url(bytes) {
    return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  function hexToUint8Array(hex3) {
    const cleanHex = hex3.replace(/^0x/, "");
    if (cleanHex.length % 2 !== 0) {
      throw new Error("Invalid hex string length");
    }
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
    }
    return bytes;
  }
  function uint8ArrayToHex(bytes) {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  var Class = class {
    constructor(..._args) {}
  };

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
  var initializer = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
      value: inst._zod,
      enumerable: false,
    });
    Object.defineProperty(inst, "issues", {
      value: def,
      enumerable: false,
    });
    inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
    Object.defineProperty(inst, "toString", {
      value: () => inst.message,
      enumerable: false,
    });
  };
  var $ZodError = $constructor("$ZodError", initializer);
  var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
  function flattenError(error51, mapper = (issue2) => issue2.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of error51.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  function formatError(error51, mapper = (issue2) => issue2.message) {
    const fieldErrors = { _errors: [] };
    const processError = (error52, path = []) => {
      for (const issue2 of error52.issues) {
        if (issue2.code === "invalid_union" && issue2.errors.length) {
          issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
        } else if (issue2.code === "invalid_key") {
          processError({ issues: issue2.issues }, [...path, ...issue2.path]);
        } else if (issue2.code === "invalid_element") {
          processError({ issues: issue2.issues }, [...path, ...issue2.path]);
        } else {
          const fullpath = [...path, ...issue2.path];
          if (fullpath.length === 0) {
            fieldErrors._errors.push(mapper(issue2));
          } else {
            let curr = fieldErrors;
            let i = 0;
            while (i < fullpath.length) {
              const el2 = fullpath[i];
              const terminal = i === fullpath.length - 1;
              if (!terminal) {
                curr[el2] = curr[el2] || { _errors: [] };
              } else {
                curr[el2] = curr[el2] || { _errors: [] };
                curr[el2]._errors.push(mapper(issue2));
              }
              curr = curr[el2];
              i++;
            }
          }
        }
      }
    };
    processError(error51);
    return fieldErrors;
  }
  function treeifyError(error51, mapper = (issue2) => issue2.message) {
    const result = { errors: [] };
    const processError = (error52, path = []) => {
      var _a3, _b;
      for (const issue2 of error52.issues) {
        if (issue2.code === "invalid_union" && issue2.errors.length) {
          issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
        } else if (issue2.code === "invalid_key") {
          processError({ issues: issue2.issues }, [...path, ...issue2.path]);
        } else if (issue2.code === "invalid_element") {
          processError({ issues: issue2.issues }, [...path, ...issue2.path]);
        } else {
          const fullpath = [...path, ...issue2.path];
          if (fullpath.length === 0) {
            result.errors.push(mapper(issue2));
            continue;
          }
          let curr = result;
          let i = 0;
          while (i < fullpath.length) {
            const el2 = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (typeof el2 === "string") {
              curr.properties ?? (curr.properties = {});
              (_a3 = curr.properties)[el2] ?? (_a3[el2] = { errors: [] });
              curr = curr.properties[el2];
            } else {
              curr.items ?? (curr.items = []);
              (_b = curr.items)[el2] ?? (_b[el2] = { errors: [] });
              curr = curr.items[el2];
            }
            if (terminal) {
              curr.errors.push(mapper(issue2));
            }
            i++;
          }
        }
      }
    };
    processError(error51);
    return result;
  }
  function toDotPath(_path) {
    const segs = [];
    const path = _path.map((seg) => (typeof seg === "object" ? seg.key : seg));
    for (const seg of path) {
      if (typeof seg === "number") segs.push(`[${seg}]`);
      else if (typeof seg === "symbol") segs.push(`[${JSON.stringify(String(seg))}]`);
      else if (/[^\w$]/.test(seg)) segs.push(`[${JSON.stringify(seg)}]`);
      else {
        if (segs.length) segs.push(".");
        segs.push(seg);
      }
    }
    return segs.join("");
  }
  function prettifyError(error51) {
    const lines = [];
    const issues = [...error51.issues].sort(
      (a, b) => (a.path ?? []).length - (b.path ?? []).length,
    );
    for (const issue2 of issues) {
      lines.push(`\u2716 ${issue2.message}`);
      if (issue2.path?.length) lines.push(`  \u2192 at ${toDotPath(issue2.path)}`);
    }
    return lines.join("\n");
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
  var _parse = (_Err) => (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    if (result.issues.length) {
      const e = new (_params?.Err ?? _Err)(
        result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
      );
      captureStackTrace(e, _params?.callee);
      throw e;
    }
    return result.value;
  };
  var parse = /* @__PURE__ */ _parse($ZodRealError);
  var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
    const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) result = await result;
    if (result.issues.length) {
      const e = new (params?.Err ?? _Err)(
        result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
      );
      captureStackTrace(e, params?.callee);
      throw e;
    }
    return result.value;
  };
  var parseAsync = /* @__PURE__ */ _parseAsync($ZodRealError);
  var _safeParse = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    return result.issues.length
      ? {
          success: false,
          error: new (_Err ?? $ZodError)(
            result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
          ),
        }
      : { success: true, data: result.value };
  };
  var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
  var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) result = await result;
    return result.issues.length
      ? {
          success: false,
          error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
        }
      : { success: true, data: result.value };
  };
  var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
  var _encode = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return _parse(_Err)(schema, value, ctx);
  };
  var encode = /* @__PURE__ */ _encode($ZodRealError);
  var _decode = (_Err) => (schema, value, _ctx) => {
    return _parse(_Err)(schema, value, _ctx);
  };
  var decode = /* @__PURE__ */ _decode($ZodRealError);
  var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return _parseAsync(_Err)(schema, value, ctx);
  };
  var encodeAsync = /* @__PURE__ */ _encodeAsync($ZodRealError);
  var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
    return _parseAsync(_Err)(schema, value, _ctx);
  };
  var decodeAsync = /* @__PURE__ */ _decodeAsync($ZodRealError);
  var _safeEncode = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return _safeParse(_Err)(schema, value, ctx);
  };
  var safeEncode = /* @__PURE__ */ _safeEncode($ZodRealError);
  var _safeDecode = (_Err) => (schema, value, _ctx) => {
    return _safeParse(_Err)(schema, value, _ctx);
  };
  var safeDecode = /* @__PURE__ */ _safeDecode($ZodRealError);
  var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return _safeParseAsync(_Err)(schema, value, ctx);
  };
  var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync($ZodRealError);
  var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
    return _safeParseAsync(_Err)(schema, value, _ctx);
  };
  var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync($ZodRealError);

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
  var regexes_exports = {};
  __export(regexes_exports, {
    base64: () => base64,
    base64url: () => base64url,
    bigint: () => bigint,
    boolean: () => boolean,
    browserEmail: () => browserEmail,
    cidrv4: () => cidrv4,
    cidrv6: () => cidrv6,
    cuid: () => cuid,
    cuid2: () => cuid2,
    date: () => date,
    datetime: () => datetime,
    domain: () => domain,
    duration: () => duration,
    e164: () => e164,
    email: () => email,
    emoji: () => emoji,
    extendedDuration: () => extendedDuration,
    guid: () => guid,
    hex: () => hex,
    hostname: () => hostname,
    html5Email: () => html5Email,
    httpProtocol: () => httpProtocol,
    idnEmail: () => idnEmail,
    integer: () => integer,
    ipv4: () => ipv4,
    ipv6: () => ipv6,
    ksuid: () => ksuid,
    lowercase: () => lowercase,
    mac: () => mac,
    md5_base64: () => md5_base64,
    md5_base64url: () => md5_base64url,
    md5_hex: () => md5_hex,
    nanoid: () => nanoid,
    null: () => _null,
    number: () => number,
    rfc5322Email: () => rfc5322Email,
    sha1_base64: () => sha1_base64,
    sha1_base64url: () => sha1_base64url,
    sha1_hex: () => sha1_hex,
    sha256_base64: () => sha256_base64,
    sha256_base64url: () => sha256_base64url,
    sha256_hex: () => sha256_hex,
    sha384_base64: () => sha384_base64,
    sha384_base64url: () => sha384_base64url,
    sha384_hex: () => sha384_hex,
    sha512_base64: () => sha512_base64,
    sha512_base64url: () => sha512_base64url,
    sha512_hex: () => sha512_hex,
    string: () => string,
    time: () => time,
    ulid: () => ulid,
    undefined: () => _undefined,
    unicodeEmail: () => unicodeEmail,
    uppercase: () => uppercase,
    uuid: () => uuid,
    uuid4: () => uuid4,
    uuid6: () => uuid6,
    uuid7: () => uuid7,
    xid: () => xid,
  });
  var cuid = /^[cC][0-9a-z]{6,}$/;
  var cuid2 = /^[0-9a-z]+$/;
  var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
  var xid = /^[0-9a-vA-V]{20}$/;
  var ksuid = /^[A-Za-z0-9]{27}$/;
  var nanoid = /^[a-zA-Z0-9_-]{21}$/;
  var duration =
    /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
  var extendedDuration =
    /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
  var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
  var uuid = (version2) => {
    if (!version2)
      return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
    return new RegExp(
      `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
    );
  };
  var uuid4 = /* @__PURE__ */ uuid(4);
  var uuid6 = /* @__PURE__ */ uuid(6);
  var uuid7 = /* @__PURE__ */ uuid(7);
  var email =
    /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
  var html5Email =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  var rfc5322Email =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
  var idnEmail = unicodeEmail;
  var browserEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  function emoji() {
    return new RegExp(_emoji, "u");
  }
  var ipv4 =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  var ipv6 =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
  var mac = (delimiter) => {
    const escapedDelim = escapeRegex(delimiter ?? ":");
    return new RegExp(
      `^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`,
    );
  };
  var cidrv4 =
    /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
  var cidrv6 =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
  var base64url = /^[A-Za-z0-9_-]*$/;
  var hostname =
    /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
  var domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  var httpProtocol = /^https?$/;
  var e164 = /^\+[1-9]\d{6,14}$/;
  var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
  var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
  function timeSource(args) {
    const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
    const regex =
      typeof args.precision === "number"
        ? args.precision === -1
          ? `${hhmm}`
          : args.precision === 0
            ? `${hhmm}:[0-5]\\d`
            : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}`
        : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
    return regex;
  }
  function time(args) {
    return new RegExp(`^${timeSource(args)}$`);
  }
  function datetime(args) {
    const time3 = timeSource({ precision: args.precision });
    const opts = ["Z"];
    if (args.local) opts.push("");
    if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
    const timeRegex = `${time3}(?:${opts.join("|")})`;
    return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
  }
  var string = (params) => {
    const regex = params
      ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}`
      : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
  };
  var bigint = /^-?\d+n?$/;
  var integer = /^-?\d+$/;
  var number = /^-?\d+(?:\.\d+)?$/;
  var boolean = /^(?:true|false)$/i;
  var _null = /^null$/i;
  var _undefined = /^undefined$/i;
  var lowercase = /^[^A-Z]*$/;
  var uppercase = /^[^a-z]*$/;
  var hex = /^[0-9a-fA-F]*$/;
  function fixedBase64(bodyLength, padding) {
    return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
  }
  function fixedBase64url(length) {
    return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
  }
  var md5_hex = /^[0-9a-fA-F]{32}$/;
  var md5_base64 = /* @__PURE__ */ fixedBase64(22, "==");
  var md5_base64url = /* @__PURE__ */ fixedBase64url(22);
  var sha1_hex = /^[0-9a-fA-F]{40}$/;
  var sha1_base64 = /* @__PURE__ */ fixedBase64(27, "=");
  var sha1_base64url = /* @__PURE__ */ fixedBase64url(27);
  var sha256_hex = /^[0-9a-fA-F]{64}$/;
  var sha256_base64 = /* @__PURE__ */ fixedBase64(43, "=");
  var sha256_base64url = /* @__PURE__ */ fixedBase64url(43);
  var sha384_hex = /^[0-9a-fA-F]{96}$/;
  var sha384_base64 = /* @__PURE__ */ fixedBase64(64, "");
  var sha384_base64url = /* @__PURE__ */ fixedBase64url(64);
  var sha512_hex = /^[0-9a-fA-F]{128}$/;
  var sha512_base64 = /* @__PURE__ */ fixedBase64(86, "==");
  var sha512_base64url = /* @__PURE__ */ fixedBase64url(86);

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
  var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
    var _a3;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a3 = inst._zod).onattach ?? (_a3.onattach = []);
  });
  var numericOriginMap = {
    number: "number",
    bigint: "bigint",
    object: "date",
  };
  var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
      if (def.value < curr) {
        if (def.inclusive) bag.maximum = def.value;
        else bag.exclusiveMaximum = def.value;
      }
    });
    inst._zod.check = (payload) => {
      if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
        return;
      }
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
        input: payload.value,
        inclusive: def.inclusive,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
      if (def.value > curr) {
        if (def.inclusive) bag.minimum = def.value;
        else bag.exclusiveMinimum = def.value;
      }
    });
    inst._zod.check = (payload) => {
      if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
        return;
      }
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
        input: payload.value,
        inclusive: def.inclusive,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst2) => {
      var _a3;
      (_a3 = inst2._zod.bag).multipleOf ?? (_a3.multipleOf = def.value);
    });
    inst._zod.check = (payload) => {
      if (typeof payload.value !== typeof def.value)
        throw new Error("Cannot mix number and bigint in multiple_of check.");
      const isMultiple =
        typeof payload.value === "bigint"
          ? payload.value % def.value === BigInt(0)
          : floatSafeRemainder(payload.value, def.value) === 0;
      if (isMultiple) return;
      payload.issues.push({
        origin: typeof payload.value,
        code: "not_multiple_of",
        divisor: def.value,
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
    $ZodCheck.init(inst, def);
    def.format = def.format || "float64";
    const isInt = def.format?.includes("int");
    const origin = isInt ? "int" : "number";
    const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.format = def.format;
      bag.minimum = minimum;
      bag.maximum = maximum;
      if (isInt) bag.pattern = integer;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      if (isInt) {
        if (!Number.isInteger(input)) {
          payload.issues.push({
            expected: origin,
            format: def.format,
            code: "invalid_type",
            continue: false,
            input,
            inst,
          });
          return;
        }
        if (!Number.isSafeInteger(input)) {
          if (input > 0) {
            payload.issues.push({
              input,
              code: "too_big",
              maximum: Number.MAX_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst,
              origin,
              inclusive: true,
              continue: !def.abort,
            });
          } else {
            payload.issues.push({
              input,
              code: "too_small",
              minimum: Number.MIN_SAFE_INTEGER,
              note: "Integers must be within the safe integer range.",
              inst,
              origin,
              inclusive: true,
              continue: !def.abort,
            });
          }
          return;
        }
      }
      if (input < minimum) {
        payload.issues.push({
          origin: "number",
          input,
          code: "too_small",
          minimum,
          inclusive: true,
          inst,
          continue: !def.abort,
        });
      }
      if (input > maximum) {
        payload.issues.push({
          origin: "number",
          input,
          code: "too_big",
          maximum,
          inclusive: true,
          inst,
          continue: !def.abort,
        });
      }
    };
  });
  var $ZodCheckBigIntFormat = /* @__PURE__ */ $constructor("$ZodCheckBigIntFormat", (inst, def) => {
    $ZodCheck.init(inst, def);
    const [minimum, maximum] = BIGINT_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.format = def.format;
      bag.minimum = minimum;
      bag.maximum = maximum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      if (input < minimum) {
        payload.issues.push({
          origin: "bigint",
          input,
          code: "too_small",
          minimum,
          inclusive: true,
          inst,
          continue: !def.abort,
        });
      }
      if (input > maximum) {
        payload.issues.push({
          origin: "bigint",
          input,
          code: "too_big",
          maximum,
          inclusive: true,
          inst,
          continue: !def.abort,
        });
      }
    };
  });
  var $ZodCheckMaxSize = /* @__PURE__ */ $constructor("$ZodCheckMaxSize", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ??
      (_a3.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.size !== void 0;
      });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
      if (def.maximum < curr) inst2._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const size = input.size;
      if (size <= def.maximum) return;
      payload.issues.push({
        origin: getSizableOrigin(input),
        code: "too_big",
        maximum: def.maximum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckMinSize = /* @__PURE__ */ $constructor("$ZodCheckMinSize", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ??
      (_a3.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.size !== void 0;
      });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
      if (def.minimum > curr) inst2._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const size = input.size;
      if (size >= def.minimum) return;
      payload.issues.push({
        origin: getSizableOrigin(input),
        code: "too_small",
        minimum: def.minimum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckSizeEquals = /* @__PURE__ */ $constructor("$ZodCheckSizeEquals", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ??
      (_a3.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.size !== void 0;
      });
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.minimum = def.size;
      bag.maximum = def.size;
      bag.size = def.size;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const size = input.size;
      if (size === def.size) return;
      const tooBig = size > def.size;
      payload.issues.push({
        origin: getSizableOrigin(input),
        ...(tooBig
          ? { code: "too_big", maximum: def.size }
          : { code: "too_small", minimum: def.size }),
        inclusive: true,
        exact: true,
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ??
      (_a3.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== void 0;
      });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
      if (def.maximum < curr) inst2._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length <= def.maximum) return;
      const origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: def.maximum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ??
      (_a3.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== void 0;
      });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
      if (def.minimum > curr) inst2._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length >= def.minimum) return;
      const origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: def.minimum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
    var _a3;
    $ZodCheck.init(inst, def);
    (_a3 = inst._zod.def).when ??
      (_a3.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== void 0;
      });
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.minimum = def.length;
      bag.maximum = def.length;
      bag.length = def.length;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length === def.length) return;
      const origin = getLengthableOrigin(input);
      const tooBig = length > def.length;
      payload.issues.push({
        origin,
        ...(tooBig
          ? { code: "too_big", maximum: def.length }
          : { code: "too_small", minimum: def.length }),
        inclusive: true,
        exact: true,
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
    var _a3, _b;
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.format = def.format;
      if (def.pattern) {
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
        bag.patterns.add(def.pattern);
      }
    });
    if (def.pattern)
      (_a3 = inst._zod).check ??
        (_a3.check = (payload) => {
          def.pattern.lastIndex = 0;
          if (def.pattern.test(payload.value)) return;
          payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: def.format,
            input: payload.value,
            ...(def.pattern ? { pattern: def.pattern.toString() } : {}),
            inst,
            continue: !def.abort,
          });
        });
    else (_b = inst._zod).check ?? (_b.check = () => {});
  });
  var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value)) return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "regex",
        input: payload.value,
        pattern: def.pattern.toString(),
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
    def.pattern ?? (def.pattern = lowercase);
    $ZodCheckStringFormat.init(inst, def);
  });
  var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
    def.pattern ?? (def.pattern = uppercase);
    $ZodCheckStringFormat.init(inst, def);
  });
  var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
    $ZodCheck.init(inst, def);
    const escapedRegex = escapeRegex(def.includes);
    const pattern = new RegExp(
      typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex,
    );
    def.pattern = pattern;
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.includes(def.includes, def.position)) return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "includes",
        includes: def.includes,
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.startsWith(def.prefix)) return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "starts_with",
        prefix: def.prefix,
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst2) => {
      const bag = inst2._zod.bag;
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
      bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
      if (payload.value.endsWith(def.suffix)) return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: "ends_with",
        suffix: def.suffix,
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  function handleCheckPropertyResult(result, payload, property) {
    if (result.issues.length) {
      payload.issues.push(...prefixIssues(property, result.issues));
    }
  }
  var $ZodCheckProperty = /* @__PURE__ */ $constructor("$ZodCheckProperty", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
      const result = def.schema._zod.run(
        {
          value: payload.value[def.property],
          issues: [],
        },
        {},
      );
      if (result instanceof Promise) {
        return result.then((result2) => handleCheckPropertyResult(result2, payload, def.property));
      }
      handleCheckPropertyResult(result, payload, def.property);
      return;
    };
  });
  var $ZodCheckMimeType = /* @__PURE__ */ $constructor("$ZodCheckMimeType", (inst, def) => {
    $ZodCheck.init(inst, def);
    const mimeSet = new Set(def.mime);
    inst._zod.onattach.push((inst2) => {
      inst2._zod.bag.mime = def.mime;
    });
    inst._zod.check = (payload) => {
      if (mimeSet.has(payload.value.type)) return;
      payload.issues.push({
        code: "invalid_value",
        values: def.mime,
        input: payload.value.type,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
      payload.value = def.tx(payload.value);
    };
  });

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
  var Doc = class {
    constructor(args = []) {
      this.content = [];
      this.indent = 0;
      if (this) this.args = args;
    }
    indented(fn) {
      this.indent += 1;
      fn(this);
      this.indent -= 1;
    }
    write(arg) {
      if (typeof arg === "function") {
        arg(this, { execution: "sync" });
        arg(this, { execution: "async" });
        return;
      }
      const content = arg;
      const lines = content.split("\n").filter((x) => x);
      const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
      const dedented = lines
        .map((x) => x.slice(minIndent))
        .map((x) => " ".repeat(this.indent * 2) + x);
      for (const line of dedented) {
        this.content.push(line);
      }
    }
    compile() {
      const F = Function;
      const args = this?.args;
      const content = this?.content ?? [``];
      const lines = [...content.map((x) => `  ${x}`)];
      return new F(...args, lines.join("\n"));
    }
  };

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
  var version = {
    major: 4,
    minor: 4,
    patch: 3,
  };

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
  var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
    var _a3;
    inst ?? (inst = {});
    inst._zod.def = def;
    inst._zod.bag = inst._zod.bag || {};
    inst._zod.version = version;
    const checks = [...(inst._zod.def.checks ?? [])];
    if (inst._zod.traits.has("$ZodCheck")) {
      checks.unshift(inst);
    }
    for (const ch of checks) {
      for (const fn of ch._zod.onattach) {
        fn(inst);
      }
    }
    if (checks.length === 0) {
      (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
      inst._zod.deferred?.push(() => {
        inst._zod.run = inst._zod.parse;
      });
    } else {
      const runChecks = (payload, checks2, ctx) => {
        let isAborted = aborted(payload);
        let asyncResult;
        for (const ch of checks2) {
          if (ch._zod.def.when) {
            if (explicitlyAborted(payload)) continue;
            const shouldRun = ch._zod.def.when(payload);
            if (!shouldRun) continue;
          } else if (isAborted) {
            continue;
          }
          const currLen = payload.issues.length;
          const _ = ch._zod.check(payload);
          if (_ instanceof Promise && ctx?.async === false) {
            throw new $ZodAsyncError();
          }
          if (asyncResult || _ instanceof Promise) {
            asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
              await _;
              const nextLen = payload.issues.length;
              if (nextLen === currLen) return;
              if (!isAborted) isAborted = aborted(payload, currLen);
            });
          } else {
            const nextLen = payload.issues.length;
            if (nextLen === currLen) continue;
            if (!isAborted) isAborted = aborted(payload, currLen);
          }
        }
        if (asyncResult) {
          return asyncResult.then(() => {
            return payload;
          });
        }
        return payload;
      };
      const handleCanaryResult = (canary, payload, ctx) => {
        if (aborted(canary)) {
          canary.aborted = true;
          return canary;
        }
        const checkResult = runChecks(payload, checks, ctx);
        if (checkResult instanceof Promise) {
          if (ctx.async === false) throw new $ZodAsyncError();
          return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
        }
        return inst._zod.parse(checkResult, ctx);
      };
      inst._zod.run = (payload, ctx) => {
        if (ctx.skipChecks) {
          return inst._zod.parse(payload, ctx);
        }
        if (ctx.direction === "backward") {
          const canary = inst._zod.parse(
            { value: payload.value, issues: [] },
            { ...ctx, skipChecks: true },
          );
          if (canary instanceof Promise) {
            return canary.then((canary2) => {
              return handleCanaryResult(canary2, payload, ctx);
            });
          }
          return handleCanaryResult(canary, payload, ctx);
        }
        const result = inst._zod.parse(payload, ctx);
        if (result instanceof Promise) {
          if (ctx.async === false) throw new $ZodAsyncError();
          return result.then((result2) => runChecks(result2, checks, ctx));
        }
        return runChecks(result, checks, ctx);
      };
    }
    defineLazy(inst, "~standard", () => ({
      validate: (value) => {
        try {
          const r = safeParse(inst, value);
          return r.success ? { value: r.data } : { issues: r.error?.issues };
        } catch (_) {
          return safeParseAsync(inst, value).then((r) =>
            r.success ? { value: r.data } : { issues: r.error?.issues },
          );
        }
      },
      vendor: "zod",
      version: 1,
    }));
  });
  var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = [...(inst?._zod.bag?.patterns ?? [])].pop() ?? string(inst._zod.bag);
    inst._zod.parse = (payload, _) => {
      if (def.coerce)
        try {
          payload.value = String(payload.value);
        } catch (_2) {}
      if (typeof payload.value === "string") return payload;
      payload.issues.push({
        expected: "string",
        code: "invalid_type",
        input: payload.value,
        inst,
      });
      return payload;
    };
  });
  var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    $ZodString.init(inst, def);
  });
  var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
    def.pattern ?? (def.pattern = guid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
    if (def.version) {
      const versionMap = {
        v1: 1,
        v2: 2,
        v3: 3,
        v4: 4,
        v5: 5,
        v6: 6,
        v7: 7,
        v8: 8,
      };
      const v = versionMap[def.version];
      if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
      def.pattern ?? (def.pattern = uuid(v));
    } else def.pattern ?? (def.pattern = uuid());
    $ZodStringFormat.init(inst, def);
  });
  var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
    def.pattern ?? (def.pattern = email);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      try {
        const trimmed = payload.value.trim();
        if (!def.normalize && def.protocol?.source === httpProtocol.source) {
          if (!/^https?:\/\//i.test(trimmed)) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid URL format",
              input: payload.value,
              inst,
              continue: !def.abort,
            });
            return;
          }
        }
        const url2 = new URL(trimmed);
        if (def.hostname) {
          def.hostname.lastIndex = 0;
          if (!def.hostname.test(url2.hostname)) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid hostname",
              pattern: def.hostname.source,
              input: payload.value,
              inst,
              continue: !def.abort,
            });
          }
        }
        if (def.protocol) {
          def.protocol.lastIndex = 0;
          if (
            !def.protocol.test(
              url2.protocol.endsWith(":") ? url2.protocol.slice(0, -1) : url2.protocol,
            )
          ) {
            payload.issues.push({
              code: "invalid_format",
              format: "url",
              note: "Invalid protocol",
              pattern: def.protocol.source,
              input: payload.value,
              inst,
              continue: !def.abort,
            });
          }
        }
        if (def.normalize) {
          payload.value = url2.href;
        } else {
          payload.value = trimmed;
        }
        return;
      } catch (_) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort,
        });
      }
    };
  });
  var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
    def.pattern ?? (def.pattern = emoji());
    $ZodStringFormat.init(inst, def);
  });
  var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
    def.pattern ?? (def.pattern = nanoid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
    def.pattern ?? (def.pattern = cuid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
    def.pattern ?? (def.pattern = cuid2);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
    def.pattern ?? (def.pattern = ulid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
    def.pattern ?? (def.pattern = xid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
    def.pattern ?? (def.pattern = ksuid);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
    def.pattern ?? (def.pattern = datetime(def));
    $ZodStringFormat.init(inst, def);
  });
  var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
    def.pattern ?? (def.pattern = date);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
    def.pattern ?? (def.pattern = time(def));
    $ZodStringFormat.init(inst, def);
  });
  var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
    def.pattern ?? (def.pattern = duration);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
    def.pattern ?? (def.pattern = ipv4);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `ipv4`;
  });
  var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
    def.pattern ?? (def.pattern = ipv6);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `ipv6`;
    inst._zod.check = (payload) => {
      try {
        new URL(`http://[${payload.value}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "ipv6",
          input: payload.value,
          inst,
          continue: !def.abort,
        });
      }
    };
  });
  var $ZodMAC = /* @__PURE__ */ $constructor("$ZodMAC", (inst, def) => {
    def.pattern ?? (def.pattern = mac(def.delimiter));
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `mac`;
  });
  var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv4);
    $ZodStringFormat.init(inst, def);
  });
  var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv6);
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      const parts = payload.value.split("/");
      try {
        if (parts.length !== 2) throw new Error();
        const [address, prefix] = parts;
        if (!prefix) throw new Error();
        const prefixNum = Number(prefix);
        if (`${prefixNum}` !== prefix) throw new Error();
        if (prefixNum < 0 || prefixNum > 128) throw new Error();
        new URL(`http://[${address}]`);
      } catch {
        payload.issues.push({
          code: "invalid_format",
          format: "cidrv6",
          input: payload.value,
          inst,
          continue: !def.abort,
        });
      }
    };
  });
  function isValidBase64(data) {
    if (data === "") return true;
    if (/\s/.test(data)) return false;
    if (data.length % 4 !== 0) return false;
    try {
      atob(data);
      return true;
    } catch {
      return false;
    }
  }
  var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
    def.pattern ?? (def.pattern = base64);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.contentEncoding = "base64";
    inst._zod.check = (payload) => {
      if (isValidBase64(payload.value)) return;
      payload.issues.push({
        code: "invalid_format",
        format: "base64",
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  function isValidBase64URL(data) {
    if (!base64url.test(data)) return false;
    const base643 = data.replace(/[-_]/g, (c) => (c === "-" ? "+" : "/"));
    const padded = base643.padEnd(Math.ceil(base643.length / 4) * 4, "=");
    return isValidBase64(padded);
  }
  var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
    def.pattern ?? (def.pattern = base64url);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.contentEncoding = "base64url";
    inst._zod.check = (payload) => {
      if (isValidBase64URL(payload.value)) return;
      payload.issues.push({
        code: "invalid_format",
        format: "base64url",
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
    def.pattern ?? (def.pattern = e164);
    $ZodStringFormat.init(inst, def);
  });
  function isValidJWT(token, algorithm = null) {
    try {
      const tokensParts = token.split(".");
      if (tokensParts.length !== 3) return false;
      const [header] = tokensParts;
      if (!header) return false;
      const parsedHeader = JSON.parse(atob(header));
      if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
      if (!parsedHeader.alg) return false;
      if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
      return true;
    } catch {
      return false;
    }
  }
  var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
      if (isValidJWT(payload.value, def.alg)) return;
      payload.issues.push({
        code: "invalid_format",
        format: "jwt",
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    };
  });
  var $ZodCustomStringFormat = /* @__PURE__ */ $constructor(
    "$ZodCustomStringFormat",
    (inst, def) => {
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (def.fn(payload.value)) return;
        payload.issues.push({
          code: "invalid_format",
          format: def.format,
          input: payload.value,
          inst,
          continue: !def.abort,
        });
      };
    },
  );
  var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = inst._zod.bag.pattern ?? number;
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = Number(payload.value);
        } catch (_) {}
      const input = payload.value;
      if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
        return payload;
      }
      const received =
        typeof input === "number"
          ? Number.isNaN(input)
            ? "NaN"
            : !Number.isFinite(input)
              ? "Infinity"
              : void 0
          : void 0;
      payload.issues.push({
        expected: "number",
        code: "invalid_type",
        input,
        inst,
        ...(received ? { received } : {}),
      });
      return payload;
    };
  });
  var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
    $ZodCheckNumberFormat.init(inst, def);
    $ZodNumber.init(inst, def);
  });
  var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = boolean;
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = Boolean(payload.value);
        } catch (_) {}
      const input = payload.value;
      if (typeof input === "boolean") return payload;
      payload.issues.push({
        expected: "boolean",
        code: "invalid_type",
        input,
        inst,
      });
      return payload;
    };
  });
  var $ZodBigInt = /* @__PURE__ */ $constructor("$ZodBigInt", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = bigint;
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = BigInt(payload.value);
        } catch (_) {}
      if (typeof payload.value === "bigint") return payload;
      payload.issues.push({
        expected: "bigint",
        code: "invalid_type",
        input: payload.value,
        inst,
      });
      return payload;
    };
  });
  var $ZodBigIntFormat = /* @__PURE__ */ $constructor("$ZodBigIntFormat", (inst, def) => {
    $ZodCheckBigIntFormat.init(inst, def);
    $ZodBigInt.init(inst, def);
  });
  var $ZodSymbol = /* @__PURE__ */ $constructor("$ZodSymbol", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (typeof input === "symbol") return payload;
      payload.issues.push({
        expected: "symbol",
        code: "invalid_type",
        input,
        inst,
      });
      return payload;
    };
  });
  var $ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = _undefined;
    inst._zod.values = /* @__PURE__ */ new Set([void 0]);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (typeof input === "undefined") return payload;
      payload.issues.push({
        expected: "undefined",
        code: "invalid_type",
        input,
        inst,
      });
      return payload;
    };
  });
  var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = _null;
    inst._zod.values = /* @__PURE__ */ new Set([null]);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (input === null) return payload;
      payload.issues.push({
        expected: "null",
        code: "invalid_type",
        input,
        inst,
      });
      return payload;
    };
  });
  var $ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
  });
  var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
  });
  var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      payload.issues.push({
        expected: "never",
        code: "invalid_type",
        input: payload.value,
        inst,
      });
      return payload;
    };
  });
  var $ZodVoid = /* @__PURE__ */ $constructor("$ZodVoid", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (typeof input === "undefined") return payload;
      payload.issues.push({
        expected: "void",
        code: "invalid_type",
        input,
        inst,
      });
      return payload;
    };
  });
  var $ZodDate = /* @__PURE__ */ $constructor("$ZodDate", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce) {
        try {
          payload.value = new Date(payload.value);
        } catch (_err) {}
      }
      const input = payload.value;
      const isDate = input instanceof Date;
      const isValidDate = isDate && !Number.isNaN(input.getTime());
      if (isValidDate) return payload;
      payload.issues.push({
        expected: "date",
        code: "invalid_type",
        input,
        ...(isDate ? { received: "Invalid Date" } : {}),
        inst,
      });
      return payload;
    };
  });
  function handleArrayResult(result, final, index) {
    if (result.issues.length) {
      final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
  }
  var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!Array.isArray(input)) {
        payload.issues.push({
          expected: "array",
          code: "invalid_type",
          input,
          inst,
        });
        return payload;
      }
      payload.value = Array(input.length);
      const proms = [];
      for (let i = 0; i < input.length; i++) {
        const item = input[i];
        const result = def.element._zod.run(
          {
            value: item,
            issues: [],
          },
          ctx,
        );
        if (result instanceof Promise) {
          proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
        } else {
          handleArrayResult(result, payload, i);
        }
      }
      if (proms.length) {
        return Promise.all(proms).then(() => payload);
      }
      return payload;
    };
  });
  function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
    const isPresent = key in input;
    if (result.issues.length) {
      if (isOptionalIn && isOptionalOut && !isPresent) {
        return;
      }
      final.issues.push(...prefixIssues(key, result.issues));
    }
    if (!isPresent && !isOptionalIn) {
      if (!result.issues.length) {
        final.issues.push({
          code: "invalid_type",
          expected: "nonoptional",
          input: void 0,
          path: [key],
        });
      }
      return;
    }
    if (result.value === void 0) {
      if (isPresent) {
        final.value[key] = void 0;
      }
    } else {
      final.value[key] = result.value;
    }
  }
  function normalizeDef(def) {
    const keys = Object.keys(def.shape);
    for (const k of keys) {
      if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
        throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
      }
    }
    const okeys = optionalKeys(def.shape);
    return {
      ...def,
      keys,
      keySet: new Set(keys),
      numKeys: keys.length,
      optionalKeys: new Set(okeys),
    };
  }
  function handleCatchall(proms, input, payload, ctx, def, inst) {
    const unrecognized = [];
    const keySet = def.keySet;
    const _catchall = def.catchall._zod;
    const t = _catchall.def.type;
    const isOptionalIn = _catchall.optin === "optional";
    const isOptionalOut = _catchall.optout === "optional";
    for (const key in input) {
      if (key === "__proto__") continue;
      if (keySet.has(key)) continue;
      if (t === "never") {
        unrecognized.push(key);
        continue;
      }
      const r = _catchall.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(
          r.then((r2) =>
            handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut),
          ),
        );
      } else {
        handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
      }
    }
    if (unrecognized.length) {
      payload.issues.push({
        code: "unrecognized_keys",
        keys: unrecognized,
        input,
        inst,
      });
    }
    if (!proms.length) return payload;
    return Promise.all(proms).then(() => {
      return payload;
    });
  }
  var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
    $ZodType.init(inst, def);
    const desc = Object.getOwnPropertyDescriptor(def, "shape");
    if (!desc?.get) {
      const sh = def.shape;
      Object.defineProperty(def, "shape", {
        get: () => {
          const newSh = { ...sh };
          Object.defineProperty(def, "shape", {
            value: newSh,
          });
          return newSh;
        },
      });
    }
    const _normalized = cached(() => normalizeDef(def));
    defineLazy(inst._zod, "propValues", () => {
      const shape = def.shape;
      const propValues = {};
      for (const key in shape) {
        const field = shape[key]._zod;
        if (field.values) {
          propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
          for (const v of field.values) propValues[key].add(v);
        }
      }
      return propValues;
    });
    const isObject2 = isObject;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
      value ?? (value = _normalized.value);
      const input = payload.value;
      if (!isObject2(input)) {
        payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst,
        });
        return payload;
      }
      payload.value = {};
      const proms = [];
      const shape = value.shape;
      for (const key of value.keys) {
        const el2 = shape[key];
        const isOptionalIn = el2._zod.optin === "optional";
        const isOptionalOut = el2._zod.optout === "optional";
        const r = el2._zod.run({ value: input[key], issues: [] }, ctx);
        if (r instanceof Promise) {
          proms.push(
            r.then((r2) =>
              handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut),
            ),
          );
        } else {
          handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
        }
      }
      if (!catchall) {
        return proms.length ? Promise.all(proms).then(() => payload) : payload;
      }
      return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
    };
  });
  var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
    $ZodObject.init(inst, def);
    const superParse = inst._zod.parse;
    const _normalized = cached(() => normalizeDef(def));
    const generateFastpass = (shape) => {
      const doc = new Doc(["shape", "payload", "ctx"]);
      const normalized = _normalized.value;
      const parseStr = (key) => {
        const k = esc(key);
        return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
      };
      doc.write(`const input = payload.value;`);
      const ids = /* @__PURE__ */ Object.create(null);
      let counter = 0;
      for (const key of normalized.keys) {
        ids[key] = `key_${counter++}`;
      }
      doc.write(`const newResult = {};`);
      for (const key of normalized.keys) {
        const id = ids[key];
        const k = esc(key);
        const schema = shape[key];
        const isOptionalIn = schema?._zod?.optin === "optional";
        const isOptionalOut = schema?._zod?.optout === "optional";
        doc.write(`const ${id} = ${parseStr(key)};`);
        if (isOptionalIn && isOptionalOut) {
          doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
        } else if (!isOptionalIn) {
          doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
        } else {
          doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
        }
      }
      doc.write(`payload.value = newResult;`);
      doc.write(`return payload;`);
      const fn = doc.compile();
      return (payload, ctx) => fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject2 = isObject;
    const jit = !globalConfig.jitless;
    const allowsEval2 = allowsEval;
    const fastEnabled = jit && allowsEval2.value;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
      value ?? (value = _normalized.value);
      const input = payload.value;
      if (!isObject2(input)) {
        payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst,
        });
        return payload;
      }
      if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
        if (!fastpass) fastpass = generateFastpass(def.shape);
        payload = fastpass(payload, ctx);
        if (!catchall) return payload;
        return handleCatchall([], input, payload, ctx, value, inst);
      }
      return superParse(payload, ctx);
    };
  });
  function handleUnionResults(results, final, inst, ctx) {
    for (const result of results) {
      if (result.issues.length === 0) {
        final.value = result.value;
        return final;
      }
    }
    const nonaborted = results.filter((r) => !aborted(r));
    if (nonaborted.length === 1) {
      final.value = nonaborted[0].value;
      return nonaborted[0];
    }
    final.issues.push({
      code: "invalid_union",
      input: final.value,
      inst,
      errors: results.map((result) =>
        result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
      ),
    });
    return final;
  }
  var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () =>
      def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0,
    );
    defineLazy(inst._zod, "optout", () =>
      def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0,
    );
    defineLazy(inst._zod, "values", () => {
      if (def.options.every((o) => o._zod.values)) {
        return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
      }
      return void 0;
    });
    defineLazy(inst._zod, "pattern", () => {
      if (def.options.every((o) => o._zod.pattern)) {
        const patterns = def.options.map((o) => o._zod.pattern);
        return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
      }
      return void 0;
    });
    const first = def.options.length === 1 ? def.options[0]._zod.run : null;
    inst._zod.parse = (payload, ctx) => {
      if (first) {
        return first(payload, ctx);
      }
      let async = false;
      const results = [];
      for (const option of def.options) {
        const result = option._zod.run(
          {
            value: payload.value,
            issues: [],
          },
          ctx,
        );
        if (result instanceof Promise) {
          results.push(result);
          async = true;
        } else {
          if (result.issues.length === 0) return result;
          results.push(result);
        }
      }
      if (!async) return handleUnionResults(results, payload, inst, ctx);
      return Promise.all(results).then((results2) => {
        return handleUnionResults(results2, payload, inst, ctx);
      });
    };
  });
  function handleExclusiveUnionResults(results, final, inst, ctx) {
    const successes = results.filter((r) => r.issues.length === 0);
    if (successes.length === 1) {
      final.value = successes[0].value;
      return final;
    }
    if (successes.length === 0) {
      final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: results.map((result) =>
          result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
        ),
      });
    } else {
      final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: [],
        inclusive: false,
      });
    }
    return final;
  }
  var $ZodXor = /* @__PURE__ */ $constructor("$ZodXor", (inst, def) => {
    $ZodUnion.init(inst, def);
    def.inclusive = false;
    const first = def.options.length === 1 ? def.options[0]._zod.run : null;
    inst._zod.parse = (payload, ctx) => {
      if (first) {
        return first(payload, ctx);
      }
      let async = false;
      const results = [];
      for (const option of def.options) {
        const result = option._zod.run(
          {
            value: payload.value,
            issues: [],
          },
          ctx,
        );
        if (result instanceof Promise) {
          results.push(result);
          async = true;
        } else {
          results.push(result);
        }
      }
      if (!async) return handleExclusiveUnionResults(results, payload, inst, ctx);
      return Promise.all(results).then((results2) => {
        return handleExclusiveUnionResults(results2, payload, inst, ctx);
      });
    };
  });
  var $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor(
    "$ZodDiscriminatedUnion",
    (inst, def) => {
      def.inclusive = false;
      $ZodUnion.init(inst, def);
      const _super = inst._zod.parse;
      defineLazy(inst._zod, "propValues", () => {
        const propValues = {};
        for (const option of def.options) {
          const pv = option._zod.propValues;
          if (!pv || Object.keys(pv).length === 0)
            throw new Error(
              `Invalid discriminated union option at index "${def.options.indexOf(option)}"`,
            );
          for (const [k, v] of Object.entries(pv)) {
            if (!propValues[k]) propValues[k] = /* @__PURE__ */ new Set();
            for (const val of v) {
              propValues[k].add(val);
            }
          }
        }
        return propValues;
      });
      const disc = cached(() => {
        const opts = def.options;
        const map2 = /* @__PURE__ */ new Map();
        for (const o of opts) {
          const values = o._zod.propValues?.[def.discriminator];
          if (!values || values.size === 0)
            throw new Error(
              `Invalid discriminated union option at index "${def.options.indexOf(o)}"`,
            );
          for (const v of values) {
            if (map2.has(v)) {
              throw new Error(`Duplicate discriminator value "${String(v)}"`);
            }
            map2.set(v, o);
          }
        }
        return map2;
      });
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!isObject(input)) {
          payload.issues.push({
            code: "invalid_type",
            expected: "object",
            input,
            inst,
          });
          return payload;
        }
        const opt = disc.value.get(input?.[def.discriminator]);
        if (opt) {
          return opt._zod.run(payload, ctx);
        }
        if (def.unionFallback || ctx.direction === "backward") {
          return _super(payload, ctx);
        }
        payload.issues.push({
          code: "invalid_union",
          errors: [],
          note: "No matching discriminator",
          discriminator: def.discriminator,
          options: Array.from(disc.value.keys()),
          input,
          path: [def.discriminator],
          inst,
        });
        return payload;
      };
    },
  );
  var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      const left = def.left._zod.run({ value: input, issues: [] }, ctx);
      const right = def.right._zod.run({ value: input, issues: [] }, ctx);
      const async = left instanceof Promise || right instanceof Promise;
      if (async) {
        return Promise.all([left, right]).then(([left2, right2]) => {
          return handleIntersectionResults(payload, left2, right2);
        });
      }
      return handleIntersectionResults(payload, left, right);
    };
  });
  function mergeValues(a, b) {
    if (a === b) {
      return { valid: true, data: a };
    }
    if (a instanceof Date && b instanceof Date && +a === +b) {
      return { valid: true, data: a };
    }
    if (isPlainObject(a) && isPlainObject(b)) {
      const bKeys = Object.keys(b);
      const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
      const newObj = { ...a, ...b };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) {
          return {
            valid: false,
            mergeErrorPath: [key, ...sharedValue.mergeErrorPath],
          };
        }
        newObj[key] = sharedValue.data;
      }
      return { valid: true, data: newObj };
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return { valid: false, mergeErrorPath: [] };
      }
      const newArray = [];
      for (let index = 0; index < a.length; index++) {
        const itemA = a[index];
        const itemB = b[index];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return {
            valid: false,
            mergeErrorPath: [index, ...sharedValue.mergeErrorPath],
          };
        }
        newArray.push(sharedValue.data);
      }
      return { valid: true, data: newArray };
    }
    return { valid: false, mergeErrorPath: [] };
  }
  function handleIntersectionResults(result, left, right) {
    const unrecKeys = /* @__PURE__ */ new Map();
    let unrecIssue;
    for (const iss of left.issues) {
      if (iss.code === "unrecognized_keys") {
        unrecIssue ?? (unrecIssue = iss);
        for (const k of iss.keys) {
          if (!unrecKeys.has(k)) unrecKeys.set(k, {});
          unrecKeys.get(k).l = true;
        }
      } else {
        result.issues.push(iss);
      }
    }
    for (const iss of right.issues) {
      if (iss.code === "unrecognized_keys") {
        for (const k of iss.keys) {
          if (!unrecKeys.has(k)) unrecKeys.set(k, {});
          unrecKeys.get(k).r = true;
        }
      } else {
        result.issues.push(iss);
      }
    }
    const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
    if (bothKeys.length && unrecIssue) {
      result.issues.push({ ...unrecIssue, keys: bothKeys });
    }
    if (aborted(result)) return result;
    const merged = mergeValues(left.value, right.value);
    if (!merged.valid) {
      throw new Error(
        `Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`,
      );
    }
    result.value = merged.data;
    return result;
  }
  var $ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def) => {
    $ZodType.init(inst, def);
    const items = def.items;
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!Array.isArray(input)) {
        payload.issues.push({
          input,
          inst,
          expected: "tuple",
          code: "invalid_type",
        });
        return payload;
      }
      payload.value = [];
      const proms = [];
      const optinStart = getTupleOptStart(items, "optin");
      const optoutStart = getTupleOptStart(items, "optout");
      if (!def.rest) {
        if (input.length < optinStart) {
          payload.issues.push({
            code: "too_small",
            minimum: optinStart,
            inclusive: true,
            input,
            inst,
            origin: "array",
          });
          return payload;
        }
        if (input.length > items.length) {
          payload.issues.push({
            code: "too_big",
            maximum: items.length,
            inclusive: true,
            input,
            inst,
            origin: "array",
          });
        }
      }
      const itemResults = new Array(items.length);
      for (let i = 0; i < items.length; i++) {
        const r = items[i]._zod.run({ value: input[i], issues: [] }, ctx);
        if (r instanceof Promise) {
          proms.push(
            r.then((rr) => {
              itemResults[i] = rr;
            }),
          );
        } else {
          itemResults[i] = r;
        }
      }
      if (def.rest) {
        let i = items.length - 1;
        const rest = input.slice(items.length);
        for (const el2 of rest) {
          i++;
          const result = def.rest._zod.run({ value: el2, issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((r) => handleTupleResult(r, payload, i)));
          } else {
            handleTupleResult(result, payload, i);
          }
        }
      }
      if (proms.length) {
        return Promise.all(proms).then(() =>
          handleTupleResults(itemResults, payload, items, input, optoutStart),
        );
      }
      return handleTupleResults(itemResults, payload, items, input, optoutStart);
    };
  });
  function getTupleOptStart(items, key) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i]._zod[key] !== "optional") return i + 1;
    }
    return 0;
  }
  function handleTupleResult(result, final, index) {
    if (result.issues.length) {
      final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
  }
  function handleTupleResults(itemResults, final, items, input, optoutStart) {
    for (let i = 0; i < items.length; i++) {
      const r = itemResults[i];
      const isPresent = i < input.length;
      if (r.issues.length) {
        if (!isPresent && i >= optoutStart) {
          final.value.length = i;
          break;
        }
        final.issues.push(...prefixIssues(i, r.issues));
      }
      final.value[i] = r.value;
    }
    for (let i = final.value.length - 1; i >= input.length; i--) {
      if (items[i]._zod.optout === "optional" && final.value[i] === void 0) {
        final.value.length = i;
      } else {
        break;
      }
    }
    return final;
  }
  var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!isPlainObject(input)) {
        payload.issues.push({
          expected: "record",
          code: "invalid_type",
          input,
          inst,
        });
        return payload;
      }
      const proms = [];
      const values = def.keyType._zod.values;
      if (values) {
        payload.value = {};
        const recordKeys = /* @__PURE__ */ new Set();
        for (const key of values) {
          if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
            recordKeys.add(typeof key === "number" ? key.toString() : key);
            const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
            if (keyResult instanceof Promise) {
              throw new Error("Async schemas not supported in object keys currently");
            }
            if (keyResult.issues.length) {
              payload.issues.push({
                code: "invalid_key",
                origin: "record",
                issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                input: key,
                path: [key],
                inst,
              });
              continue;
            }
            const outKey = keyResult.value;
            const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
            if (result instanceof Promise) {
              proms.push(
                result.then((result2) => {
                  if (result2.issues.length) {
                    payload.issues.push(...prefixIssues(key, result2.issues));
                  }
                  payload.value[outKey] = result2.value;
                }),
              );
            } else {
              if (result.issues.length) {
                payload.issues.push(...prefixIssues(key, result.issues));
              }
              payload.value[outKey] = result.value;
            }
          }
        }
        let unrecognized;
        for (const key in input) {
          if (!recordKeys.has(key)) {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          }
        }
        if (unrecognized && unrecognized.length > 0) {
          payload.issues.push({
            code: "unrecognized_keys",
            input,
            inst,
            keys: unrecognized,
          });
        }
      } else {
        payload.value = {};
        for (const key of Reflect.ownKeys(input)) {
          if (key === "__proto__") continue;
          if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
          let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          const checkNumericKey =
            typeof key === "string" && number.test(key) && keyResult.issues.length;
          if (checkNumericKey) {
            const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
            if (retryResult instanceof Promise) {
              throw new Error("Async schemas not supported in object keys currently");
            }
            if (retryResult.issues.length === 0) {
              keyResult = retryResult;
            }
          }
          if (keyResult.issues.length) {
            if (def.mode === "loose") {
              payload.value[key] = input[key];
            } else {
              payload.issues.push({
                code: "invalid_key",
                origin: "record",
                issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                input: key,
                path: [key],
                inst,
              });
            }
            continue;
          }
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(
              result.then((result2) => {
                if (result2.issues.length) {
                  payload.issues.push(...prefixIssues(key, result2.issues));
                }
                payload.value[keyResult.value] = result2.value;
              }),
            );
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[keyResult.value] = result.value;
          }
        }
      }
      if (proms.length) {
        return Promise.all(proms).then(() => payload);
      }
      return payload;
    };
  });
  var $ZodMap = /* @__PURE__ */ $constructor("$ZodMap", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!(input instanceof Map)) {
        payload.issues.push({
          expected: "map",
          code: "invalid_type",
          input,
          inst,
        });
        return payload;
      }
      const proms = [];
      payload.value = /* @__PURE__ */ new Map();
      for (const [key, value] of input) {
        const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        const valueResult = def.valueType._zod.run({ value, issues: [] }, ctx);
        if (keyResult instanceof Promise || valueResult instanceof Promise) {
          proms.push(
            Promise.all([keyResult, valueResult]).then(([keyResult2, valueResult2]) => {
              handleMapResult(keyResult2, valueResult2, payload, key, input, inst, ctx);
            }),
          );
        } else {
          handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
        }
      }
      if (proms.length) return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
    if (keyResult.issues.length) {
      if (propertyKeyTypes.has(typeof key)) {
        final.issues.push(...prefixIssues(key, keyResult.issues));
      } else {
        final.issues.push({
          code: "invalid_key",
          origin: "map",
          input,
          inst,
          issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
        });
      }
    }
    if (valueResult.issues.length) {
      if (propertyKeyTypes.has(typeof key)) {
        final.issues.push(...prefixIssues(key, valueResult.issues));
      } else {
        final.issues.push({
          origin: "map",
          code: "invalid_element",
          input,
          inst,
          key,
          issues: valueResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
        });
      }
    }
    final.value.set(keyResult.value, valueResult.value);
  }
  var $ZodSet = /* @__PURE__ */ $constructor("$ZodSet", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!(input instanceof Set)) {
        payload.issues.push({
          input,
          inst,
          expected: "set",
          code: "invalid_type",
        });
        return payload;
      }
      const proms = [];
      payload.value = /* @__PURE__ */ new Set();
      for (const item of input) {
        const result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => handleSetResult(result2, payload)));
        } else handleSetResult(result, payload);
      }
      if (proms.length) return Promise.all(proms).then(() => payload);
      return payload;
    };
  });
  function handleSetResult(result, final) {
    if (result.issues.length) {
      final.issues.push(...result.issues);
    }
    final.value.add(result.value);
  }
  var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
    $ZodType.init(inst, def);
    const values = getEnumValues(def.entries);
    const valuesSet = new Set(values);
    inst._zod.values = valuesSet;
    inst._zod.pattern = new RegExp(
      `^(${values
        .filter((k) => propertyKeyTypes.has(typeof k))
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o.toString()))
        .join("|")})$`,
    );
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (valuesSet.has(input)) {
        return payload;
      }
      payload.issues.push({
        code: "invalid_value",
        values,
        input,
        inst,
      });
      return payload;
    };
  });
  var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    if (def.values.length === 0) {
      throw new Error("Cannot create literal schema with no valid values");
    }
    const values = new Set(def.values);
    inst._zod.values = values;
    inst._zod.pattern = new RegExp(
      `^(${def.values.map((o) => (typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o))).join("|")})$`,
    );
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (values.has(input)) {
        return payload;
      }
      payload.issues.push({
        code: "invalid_value",
        values: def.values,
        input,
        inst,
      });
      return payload;
    };
  });
  var $ZodFile = /* @__PURE__ */ $constructor("$ZodFile", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      const input = payload.value;
      if (input instanceof File) return payload;
      payload.issues.push({
        expected: "file",
        code: "invalid_type",
        input,
        inst,
      });
      return payload;
    };
  });
  var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        throw new $ZodEncodeError(inst.constructor.name);
      }
      const _out = def.transform(payload.value, payload);
      if (ctx.async) {
        const output = _out instanceof Promise ? _out : Promise.resolve(_out);
        return output.then((output2) => {
          payload.value = output2;
          payload.fallback = true;
          return payload;
        });
      }
      if (_out instanceof Promise) {
        throw new $ZodAsyncError();
      }
      payload.value = _out;
      payload.fallback = true;
      return payload;
    };
  });
  function handleOptionalResult(result, input) {
    if (input === void 0 && (result.issues.length || result.fallback)) {
      return { issues: [], value: void 0 };
    }
    return result;
  }
  var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values
        ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0])
        : void 0;
    });
    defineLazy(inst._zod, "pattern", () => {
      const pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
    });
    inst._zod.parse = (payload, ctx) => {
      if (def.innerType._zod.optin === "optional") {
        const input = payload.value;
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
        return handleOptionalResult(result, input);
      }
      if (payload.value === void 0) {
        return payload;
      }
      return def.innerType._zod.run(payload, ctx);
    };
  });
  var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
    inst._zod.parse = (payload, ctx) => {
      return def.innerType._zod.run(payload, ctx);
    };
  });
  var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "pattern", () => {
      const pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
    });
    defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values
        ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null])
        : void 0;
    });
    inst._zod.parse = (payload, ctx) => {
      if (payload.value === null) return payload;
      return def.innerType._zod.run(payload, ctx);
    };
  });
  var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      if (payload.value === void 0) {
        payload.value = def.defaultValue;
        return payload;
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => handleDefaultResult(result2, def));
      }
      return handleDefaultResult(result, def);
    };
  });
  function handleDefaultResult(payload, def) {
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
    }
    return payload;
  }
  var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      if (payload.value === void 0) {
        payload.value = def.defaultValue;
      }
      return def.innerType._zod.run(payload, ctx);
    };
  });
  var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => {
      const v = def.innerType._zod.values;
      return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
    });
    inst._zod.parse = (payload, ctx) => {
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => handleNonOptionalResult(result2, inst));
      }
      return handleNonOptionalResult(result, inst);
    };
  });
  function handleNonOptionalResult(payload, inst) {
    if (!payload.issues.length && payload.value === void 0) {
      payload.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: payload.value,
        inst,
      });
    }
    return payload;
  }
  var $ZodSuccess = /* @__PURE__ */ $constructor("$ZodSuccess", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        throw new $ZodEncodeError("ZodSuccess");
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => {
          payload.value = result2.issues.length === 0;
          return payload;
        });
      }
      payload.value = result.issues.length === 0;
      return payload;
    };
  });
  var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then((result2) => {
          payload.value = result2.value;
          if (result2.issues.length) {
            payload.value = def.catchValue({
              ...payload,
              error: {
                issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              },
              input: payload.value,
            });
            payload.issues = [];
            payload.fallback = true;
          }
          return payload;
        });
      }
      payload.value = result.value;
      if (result.issues.length) {
        payload.value = def.catchValue({
          ...payload,
          error: {
            issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
          },
          input: payload.value,
        });
        payload.issues = [];
        payload.fallback = true;
      }
      return payload;
    };
  });
  var $ZodNaN = /* @__PURE__ */ $constructor("$ZodNaN", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
        payload.issues.push({
          input: payload.value,
          inst,
          expected: "nan",
          code: "invalid_type",
        });
        return payload;
      }
      return payload;
    };
  });
  var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        const right = def.out._zod.run(payload, ctx);
        if (right instanceof Promise) {
          return right.then((right2) => handlePipeResult(right2, def.in, ctx));
        }
        return handlePipeResult(right, def.in, ctx);
      }
      const left = def.in._zod.run(payload, ctx);
      if (left instanceof Promise) {
        return left.then((left2) => handlePipeResult(left2, def.out, ctx));
      }
      return handlePipeResult(left, def.out, ctx);
    };
  });
  function handlePipeResult(left, next, ctx) {
    if (left.issues.length) {
      left.aborted = true;
      return left;
    }
    return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
  }
  var $ZodCodec = /* @__PURE__ */ $constructor("$ZodCodec", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
      const direction = ctx.direction || "forward";
      if (direction === "forward") {
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
          return left.then((left2) => handleCodecAResult(left2, def, ctx));
        }
        return handleCodecAResult(left, def, ctx);
      } else {
        const right = def.out._zod.run(payload, ctx);
        if (right instanceof Promise) {
          return right.then((right2) => handleCodecAResult(right2, def, ctx));
        }
        return handleCodecAResult(right, def, ctx);
      }
    };
  });
  function handleCodecAResult(result, def, ctx) {
    if (result.issues.length) {
      result.aborted = true;
      return result;
    }
    const direction = ctx.direction || "forward";
    if (direction === "forward") {
      const transformed = def.transform(result.value, result);
      if (transformed instanceof Promise) {
        return transformed.then((value) => handleCodecTxResult(result, value, def.out, ctx));
      }
      return handleCodecTxResult(result, transformed, def.out, ctx);
    } else {
      const transformed = def.reverseTransform(result.value, result);
      if (transformed instanceof Promise) {
        return transformed.then((value) => handleCodecTxResult(result, value, def.in, ctx));
      }
      return handleCodecTxResult(result, transformed, def.in, ctx);
    }
  }
  function handleCodecTxResult(left, value, nextSchema, ctx) {
    if (left.issues.length) {
      left.aborted = true;
      return left;
    }
    return nextSchema._zod.run({ value, issues: left.issues }, ctx);
  }
  var $ZodPreprocess = /* @__PURE__ */ $constructor("$ZodPreprocess", (inst, def) => {
    $ZodPipe.init(inst, def);
  });
  var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
    defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
    inst._zod.parse = (payload, ctx) => {
      if (ctx.direction === "backward") {
        return def.innerType._zod.run(payload, ctx);
      }
      const result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise) {
        return result.then(handleReadonlyResult);
      }
      return handleReadonlyResult(result);
    };
  });
  function handleReadonlyResult(payload) {
    payload.value = Object.freeze(payload.value);
    return payload;
  }
  var $ZodTemplateLiteral = /* @__PURE__ */ $constructor("$ZodTemplateLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    const regexParts = [];
    for (const part of def.parts) {
      if (typeof part === "object" && part !== null) {
        if (!part._zod.pattern) {
          throw new Error(
            `Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`,
          );
        }
        const source =
          part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
        if (!source) throw new Error(`Invalid template literal part: ${part._zod.traits}`);
        const start = source.startsWith("^") ? 1 : 0;
        const end = source.endsWith("$") ? source.length - 1 : source.length;
        regexParts.push(source.slice(start, end));
      } else if (part === null || primitiveTypes.has(typeof part)) {
        regexParts.push(escapeRegex(`${part}`));
      } else {
        throw new Error(`Invalid template literal part: ${part}`);
      }
    }
    inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
    inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "string") {
        payload.issues.push({
          input: payload.value,
          inst,
          expected: "string",
          code: "invalid_type",
        });
        return payload;
      }
      inst._zod.pattern.lastIndex = 0;
      if (!inst._zod.pattern.test(payload.value)) {
        payload.issues.push({
          input: payload.value,
          inst,
          code: "invalid_format",
          format: def.format ?? "template_literal",
          pattern: inst._zod.pattern.source,
        });
        return payload;
      }
      return payload;
    };
  });
  var $ZodFunction = /* @__PURE__ */ $constructor("$ZodFunction", (inst, def) => {
    $ZodType.init(inst, def);
    inst._def = def;
    inst._zod.def = def;
    inst.implement = (func) => {
      if (typeof func !== "function") {
        throw new Error("implement() must be called with a function");
      }
      return function (...args) {
        const parsedArgs = inst._def.input ? parse(inst._def.input, args) : args;
        const result = Reflect.apply(func, this, parsedArgs);
        if (inst._def.output) {
          return parse(inst._def.output, result);
        }
        return result;
      };
    };
    inst.implementAsync = (func) => {
      if (typeof func !== "function") {
        throw new Error("implementAsync() must be called with a function");
      }
      return async function (...args) {
        const parsedArgs = inst._def.input ? await parseAsync(inst._def.input, args) : args;
        const result = await Reflect.apply(func, this, parsedArgs);
        if (inst._def.output) {
          return await parseAsync(inst._def.output, result);
        }
        return result;
      };
    };
    inst._zod.parse = (payload, _ctx) => {
      if (typeof payload.value !== "function") {
        payload.issues.push({
          code: "invalid_type",
          expected: "function",
          input: payload.value,
          inst,
        });
        return payload;
      }
      const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
      if (hasPromiseOutput) {
        payload.value = inst.implementAsync(payload.value);
      } else {
        payload.value = inst.implement(payload.value);
      }
      return payload;
    };
    inst.input = (...args) => {
      const F = inst.constructor;
      if (Array.isArray(args[0])) {
        return new F({
          type: "function",
          input: new $ZodTuple({
            type: "tuple",
            items: args[0],
            rest: args[1],
          }),
          output: inst._def.output,
        });
      }
      return new F({
        type: "function",
        input: args[0],
        output: inst._def.output,
      });
    };
    inst.output = (output) => {
      const F = inst.constructor;
      return new F({
        type: "function",
        input: inst._def.input,
        output,
      });
    };
    return inst;
  });
  var $ZodPromise = /* @__PURE__ */ $constructor("$ZodPromise", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      return Promise.resolve(payload.value).then((inner) =>
        def.innerType._zod.run({ value: inner, issues: [] }, ctx),
      );
    };
  });
  var $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "innerType", () => {
      const d = def;
      if (!d._cachedInner) d._cachedInner = def.getter();
      return d._cachedInner;
    });
    defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
    defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
    defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? void 0);
    defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? void 0);
    inst._zod.parse = (payload, ctx) => {
      const inner = inst._zod.innerType;
      return inner._zod.run(payload, ctx);
    };
  });
  var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
    $ZodCheck.init(inst, def);
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _) => {
      return payload;
    };
    inst._zod.check = (payload) => {
      const input = payload.value;
      const r = def.fn(input);
      if (r instanceof Promise) {
        return r.then((r2) => handleRefineResult(r2, payload, input, inst));
      }
      handleRefineResult(r, payload, input, inst);
      return;
    };
  });
  function handleRefineResult(result, payload, input, inst) {
    if (!result) {
      const _iss = {
        code: "custom",
        input,
        inst,
        // incorporates params.error into issue reporting
        path: [...(inst._zod.def.path ?? [])],
        // incorporates params.error into issue reporting
        continue: !inst._zod.def.abort,
        // params: inst._zod.def.params,
      };
      if (inst._zod.def.params) _iss.params = inst._zod.def.params;
      payload.issues.push(issue(_iss));
    }
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/index.js
  var locales_exports = {};
  __export(locales_exports, {
    ar: () => ar_default,
    az: () => az_default,
    be: () => be_default,
    bg: () => bg_default,
    ca: () => ca_default,
    cs: () => cs_default,
    da: () => da_default,
    de: () => de_default,
    el: () => el_default,
    en: () => en_default,
    eo: () => eo_default,
    es: () => es_default,
    fa: () => fa_default,
    fi: () => fi_default,
    fr: () => fr_default,
    frCA: () => fr_CA_default,
    he: () => he_default,
    hr: () => hr_default,
    hu: () => hu_default,
    hy: () => hy_default,
    id: () => id_default,
    is: () => is_default,
    it: () => it_default,
    ja: () => ja_default,
    ka: () => ka_default,
    kh: () => kh_default,
    km: () => km_default,
    ko: () => ko_default,
    lt: () => lt_default,
    mk: () => mk_default,
    ms: () => ms_default,
    nl: () => nl_default,
    no: () => no_default,
    ota: () => ota_default,
    pl: () => pl_default,
    ps: () => ps_default,
    pt: () => pt_default,
    ro: () => ro_default,
    ru: () => ru_default,
    sl: () => sl_default,
    sv: () => sv_default,
    ta: () => ta_default,
    th: () => th_default,
    tr: () => tr_default,
    ua: () => ua_default,
    uk: () => uk_default,
    ur: () => ur_default,
    uz: () => uz_default,
    vi: () => vi_default,
    yo: () => yo_default,
    zhCN: () => zh_CN_default,
    zhTW: () => zh_TW_default,
  });

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ar.js
  var error = () => {
    const Sizable = {
      string: { unit: "\u062D\u0631\u0641", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
      file: { unit: "\u0628\u0627\u064A\u062A", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
      array: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
      set: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0645\u062F\u062E\u0644",
      email: "\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
      url: "\u0631\u0627\u0628\u0637",
      emoji: "\u0625\u064A\u0645\u0648\u062C\u064A",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
      date: "\u062A\u0627\u0631\u064A\u062E \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
      time: "\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
      duration: "\u0645\u062F\u0629 \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
      ipv4: "\u0639\u0646\u0648\u0627\u0646 IPv4",
      ipv6: "\u0639\u0646\u0648\u0627\u0646 IPv6",
      cidrv4:
        "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv4",
      cidrv6:
        "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv6",
      base64: "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64-encoded",
      base64url: "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64url-encoded",
      json_string: "\u0646\u064E\u0635 \u0639\u0644\u0649 \u0647\u064A\u0626\u0629 JSON",
      e164: "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0628\u0645\u0639\u064A\u0627\u0631 E.164",
      jwt: "JWT",
      template_literal: "\u0645\u062F\u062E\u0644",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 instanceof ${issue2.expected}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${received}`;
          }
          return `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${expected}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${stringifyPrimitive(issue2.values[0])}`;
          return `\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062A\u0648\u0642\u0639 \u0627\u0646\u062A\u0642\u0627\u0621 \u0623\u062D\u062F \u0647\u0630\u0647 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A: ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return ` \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${issue2.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "\u0639\u0646\u0635\u0631"}`;
          return `\u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${issue2.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${adj} ${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${issue2.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${issue2.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${adj} ${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0628\u062F\u0623 \u0628\u0640 "${issue2.prefix}"`;
          if (_issue.format === "ends_with")
            return `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0646\u062A\u0647\u064A \u0628\u0640 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0636\u0645\u0651\u064E\u0646 "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0637\u0627\u0628\u0642 \u0627\u0644\u0646\u0645\u0637 ${_issue.pattern}`;
          return `${FormatDictionary[_issue.format] ?? issue2.format} \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644`;
        }
        case "not_multiple_of":
          return `\u0631\u0642\u0645 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0645\u0646 \u0645\u0636\u0627\u0639\u0641\u0627\u062A ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\u0645\u0639\u0631\u0641${issue2.keys.length > 1 ? "\u0627\u062A" : ""} \u063A\u0631\u064A\u0628${issue2.keys.length > 1 ? "\u0629" : ""}: ${joinValues(issue2.keys, "\u060C ")}`;
        case "invalid_key":
          return `\u0645\u0639\u0631\u0641 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${issue2.origin}`;
        case "invalid_union":
          return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
        case "invalid_element":
          return `\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${issue2.origin}`;
        default:
          return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
      }
    };
  };
  function ar_default() {
    return {
      localeError: error(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/az.js
  var error2 = () => {
    const Sizable = {
      string: { unit: "simvol", verb: "olmal\u0131d\u0131r" },
      file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
      array: { unit: "element", verb: "olmal\u0131d\u0131r" },
      set: { unit: "element", verb: "olmal\u0131d\u0131r" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "input",
      email: "email address",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datetime",
      date: "ISO date",
      time: "ISO time",
      duration: "ISO duration",
      ipv4: "IPv4 address",
      ipv6: "IPv6 address",
      cidrv4: "IPv4 range",
      cidrv6: "IPv6 range",
      base64: "base64-encoded string",
      base64url: "base64url-encoded string",
      json_string: "JSON string",
      e164: "E.164 number",
      jwt: "JWT",
      template_literal: "input",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n instanceof ${issue2.expected}, daxil olan ${received}`;
          }
          return `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${expected}, daxil olan ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${stringifyPrimitive(issue2.values[0])}`;
          return `Yanl\u0131\u015F se\xE7im: a\u015Fa\u011F\u0131dak\u0131lardan biri olmal\u0131d\u0131r: ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${issue2.origin ?? "d\u0259y\u0259r"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element"}`;
          return `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${issue2.origin ?? "d\u0259y\u0259r"} ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          return `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Yanl\u0131\u015F m\u0259tn: "${_issue.prefix}" il\u0259 ba\u015Flamal\u0131d\u0131r`;
          if (_issue.format === "ends_with")
            return `Yanl\u0131\u015F m\u0259tn: "${_issue.suffix}" il\u0259 bitm\u0259lidir`;
          if (_issue.format === "includes")
            return `Yanl\u0131\u015F m\u0259tn: "${_issue.includes}" daxil olmal\u0131d\u0131r`;
          if (_issue.format === "regex")
            return `Yanl\u0131\u015F m\u0259tn: ${_issue.pattern} \u015Fablonuna uy\u011Fun olmal\u0131d\u0131r`;
          return `Yanl\u0131\u015F ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Yanl\u0131\u015F \u0259d\u0259d: ${issue2.divisor} il\u0259 b\xF6l\xFCn\u0259 bil\u0259n olmal\u0131d\u0131r`;
        case "unrecognized_keys":
          return `Tan\u0131nmayan a\xE7ar${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `${issue2.origin} daxilind\u0259 yanl\u0131\u015F a\xE7ar`;
        case "invalid_union":
          return "Yanl\u0131\u015F d\u0259y\u0259r";
        case "invalid_element":
          return `${issue2.origin} daxilind\u0259 yanl\u0131\u015F d\u0259y\u0259r`;
        default:
          return `Yanl\u0131\u015F d\u0259y\u0259r`;
      }
    };
  };
  function az_default() {
    return {
      localeError: error2(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/be.js
  function getBelarusianPlural(count, one, few, many) {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return many;
    }
    if (lastDigit === 1) {
      return one;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return few;
    }
    return many;
  }
  var error3 = () => {
    const Sizable = {
      string: {
        unit: {
          one: "\u0441\u0456\u043C\u0432\u0430\u043B",
          few: "\u0441\u0456\u043C\u0432\u0430\u043B\u044B",
          many: "\u0441\u0456\u043C\u0432\u0430\u043B\u0430\u045E",
        },
        verb: "\u043C\u0435\u0446\u044C",
      },
      array: {
        unit: {
          one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
          few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
          many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
        },
        verb: "\u043C\u0435\u0446\u044C",
      },
      set: {
        unit: {
          one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
          few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
          many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
        },
        verb: "\u043C\u0435\u0446\u044C",
      },
      file: {
        unit: {
          one: "\u0431\u0430\u0439\u0442",
          few: "\u0431\u0430\u0439\u0442\u044B",
          many: "\u0431\u0430\u0439\u0442\u0430\u045E",
        },
        verb: "\u043C\u0435\u0446\u044C",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0443\u0432\u043E\u0434",
      email: "email \u0430\u0434\u0440\u0430\u0441",
      url: "URL",
      emoji: "\u044D\u043C\u043E\u0434\u0437\u0456",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0434\u0430\u0442\u0430 \u0456 \u0447\u0430\u0441",
      date: "ISO \u0434\u0430\u0442\u0430",
      time: "ISO \u0447\u0430\u0441",
      duration: "ISO \u043F\u0440\u0430\u0446\u044F\u0433\u043B\u0430\u0441\u0446\u044C",
      ipv4: "IPv4 \u0430\u0434\u0440\u0430\u0441",
      ipv6: "IPv6 \u0430\u0434\u0440\u0430\u0441",
      cidrv4: "IPv4 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
      cidrv6: "IPv6 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
      base64:
        "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64",
      base64url:
        "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64url",
      json_string: "JSON \u0440\u0430\u0434\u043E\u043A",
      e164: "\u043D\u0443\u043C\u0430\u0440 E.164",
      jwt: "JWT",
      template_literal: "\u0443\u0432\u043E\u0434",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u043B\u0456\u043A",
      array: "\u043C\u0430\u0441\u0456\u045E",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F instanceof ${issue2.expected}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${received}`;
          }
          return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F ${expected}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F ${stringifyPrimitive(issue2.values[0])}`;
          return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0432\u0430\u0440\u044B\u044F\u043D\u0442: \u0447\u0430\u043A\u0430\u045E\u0441\u044F \u0430\u0434\u0437\u0456\u043D \u0437 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            const maxValue = Number(issue2.maximum);
            const unit = getBelarusianPlural(
              maxValue,
              sizing.unit.one,
              sizing.unit.few,
              sizing.unit.many,
            );
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${issue2.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${sizing.verb} ${adj}${issue2.maximum.toString()} ${unit}`;
          }
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${issue2.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            const minValue = Number(issue2.minimum);
            const unit = getBelarusianPlural(
              minValue,
              sizing.unit.one,
              sizing.unit.few,
              sizing.unit.many,
            );
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${issue2.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${sizing.verb} ${adj}${issue2.minimum.toString()} ${unit}`;
          }
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${issue2.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u043F\u0430\u0447\u044B\u043D\u0430\u0446\u0446\u0430 \u0437 "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u0430\u043A\u0430\u043D\u0447\u0432\u0430\u0446\u0446\u0430 \u043D\u0430 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u043C\u044F\u0448\u0447\u0430\u0446\u044C "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0430\u0434\u043F\u0430\u0432\u044F\u0434\u0430\u0446\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${_issue.pattern}`;
          return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043B\u0456\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0431\u044B\u0446\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\u041D\u0435\u0440\u0430\u0441\u043F\u0430\u0437\u043D\u0430\u043D\u044B ${issue2.keys.length > 1 ? "\u043A\u043B\u044E\u0447\u044B" : "\u043A\u043B\u044E\u0447"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043A\u043B\u044E\u0447 \u0443 ${issue2.origin}`;
        case "invalid_union":
          return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
        case "invalid_element":
          return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u0430\u0435 \u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435 \u045E ${issue2.origin}`;
        default:
          return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434`;
      }
    };
  };
  function be_default() {
    return {
      localeError: error3(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/bg.js
  var error4 = () => {
    const Sizable = {
      string: {
        unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
        verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
      },
      file: {
        unit: "\u0431\u0430\u0439\u0442\u0430",
        verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
      },
      array: {
        unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
        verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
      },
      set: {
        unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
        verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0432\u0445\u043E\u0434",
      email: "\u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441",
      url: "URL",
      emoji: "\u0435\u043C\u043E\u0434\u0436\u0438",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0432\u0440\u0435\u043C\u0435",
      date: "ISO \u0434\u0430\u0442\u0430",
      time: "ISO \u0432\u0440\u0435\u043C\u0435",
      duration:
        "ISO \u043F\u0440\u043E\u0434\u044A\u043B\u0436\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442",
      ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
      ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
      cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      base64: "base64-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
      base64url: "base64url-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
      json_string: "JSON \u043D\u0438\u0437",
      e164: "E.164 \u043D\u043E\u043C\u0435\u0440",
      jwt: "JWT",
      template_literal: "\u0432\u0445\u043E\u0434",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0447\u0438\u0441\u043B\u043E",
      array: "\u043C\u0430\u0441\u0438\u0432",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D instanceof ${issue2.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${received}`;
          }
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${stringifyPrimitive(issue2.values[0])}`;
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u043E\u043F\u0446\u0438\u044F: \u043E\u0447\u0430\u043A\u0432\u0430\u043D\u043E \u0435\u0434\u043D\u043E \u043E\u0442 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${issue2.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430"}`;
          return `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${issue2.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0431\u044A\u0434\u0435 ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${issue2.origin} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${issue2.origin} \u0434\u0430 \u0431\u044A\u0434\u0435 ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u0432\u0430 \u0441 "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u0432\u044A\u0440\u0448\u0432\u0430 \u0441 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0432\u043A\u043B\u044E\u0447\u0432\u0430 "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0441\u044A\u0432\u043F\u0430\u0434\u0430 \u0441 ${_issue.pattern}`;
          let invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D";
          if (_issue.format === "emoji")
            invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
          if (_issue.format === "datetime")
            invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
          if (_issue.format === "date")
            invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430";
          if (_issue.format === "time")
            invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
          if (_issue.format === "duration")
            invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430";
          return `${invalid_adj} ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E \u0447\u0438\u0441\u043B\u043E: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0431\u044A\u0434\u0435 \u043A\u0440\u0430\u0442\u043D\u043E \u043D\u0430 ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\u041D\u0435\u0440\u0430\u0437\u043F\u043E\u0437\u043D\u0430\u0442${issue2.keys.length > 1 ? "\u0438" : ""} \u043A\u043B\u044E\u0447${issue2.keys.length > 1 ? "\u043E\u0432\u0435" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043A\u043B\u044E\u0447 \u0432 ${issue2.origin}`;
        case "invalid_union":
          return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
        case "invalid_element":
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442 \u0432 ${issue2.origin}`;
        default:
          return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434`;
      }
    };
  };
  function bg_default() {
    return {
      localeError: error4(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ca.js
  var error5 = () => {
    const Sizable = {
      string: { unit: "car\xE0cters", verb: "contenir" },
      file: { unit: "bytes", verb: "contenir" },
      array: { unit: "elements", verb: "contenir" },
      set: { unit: "elements", verb: "contenir" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "entrada",
      email: "adre\xE7a electr\xF2nica",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "data i hora ISO",
      date: "data ISO",
      time: "hora ISO",
      duration: "durada ISO",
      ipv4: "adre\xE7a IPv4",
      ipv6: "adre\xE7a IPv6",
      cidrv4: "rang IPv4",
      cidrv6: "rang IPv6",
      base64: "cadena codificada en base64",
      base64url: "cadena codificada en base64url",
      json_string: "cadena JSON",
      e164: "n\xFAmero E.164",
      jwt: "JWT",
      template_literal: "entrada",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Tipus inv\xE0lid: s'esperava instanceof ${issue2.expected}, s'ha rebut ${received}`;
          }
          return `Tipus inv\xE0lid: s'esperava ${expected}, s'ha rebut ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Valor inv\xE0lid: s'esperava ${stringifyPrimitive(issue2.values[0])}`;
          return `Opci\xF3 inv\xE0lida: s'esperava una de ${joinValues(issue2.values, " o ")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "com a m\xE0xim" : "menys de";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Massa gran: s'esperava que ${issue2.origin ?? "el valor"} contingu\xE9s ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
          return `Massa gran: s'esperava que ${issue2.origin ?? "el valor"} fos ${adj} ${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? "com a m\xEDnim" : "m\xE9s de";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Massa petit: s'esperava que ${issue2.origin} contingu\xE9s ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Massa petit: s'esperava que ${issue2.origin} fos ${adj} ${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `Format inv\xE0lid: ha de comen\xE7ar amb "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `Format inv\xE0lid: ha d'acabar amb "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Format inv\xE0lid: ha d'incloure "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Format inv\xE0lid: ha de coincidir amb el patr\xF3 ${_issue.pattern}`;
          return `Format inv\xE0lid per a ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `N\xFAmero inv\xE0lid: ha de ser m\xFAltiple de ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Clau${issue2.keys.length > 1 ? "s" : ""} no reconeguda${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Clau inv\xE0lida a ${issue2.origin}`;
        case "invalid_union":
          return "Entrada inv\xE0lida";
        // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
        case "invalid_element":
          return `Element inv\xE0lid a ${issue2.origin}`;
        default:
          return `Entrada inv\xE0lida`;
      }
    };
  };
  function ca_default() {
    return {
      localeError: error5(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/cs.js
  var error6 = () => {
    const Sizable = {
      string: { unit: "znak\u016F", verb: "m\xEDt" },
      file: { unit: "bajt\u016F", verb: "m\xEDt" },
      array: { unit: "prvk\u016F", verb: "m\xEDt" },
      set: { unit: "prvk\u016F", verb: "m\xEDt" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "regul\xE1rn\xED v\xFDraz",
      email: "e-mailov\xE1 adresa",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "datum a \u010Das ve form\xE1tu ISO",
      date: "datum ve form\xE1tu ISO",
      time: "\u010Das ve form\xE1tu ISO",
      duration: "doba trv\xE1n\xED ISO",
      ipv4: "IPv4 adresa",
      ipv6: "IPv6 adresa",
      cidrv4: "rozsah IPv4",
      cidrv6: "rozsah IPv6",
      base64: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64",
      base64url: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64url",
      json_string: "\u0159et\u011Bzec ve form\xE1tu JSON",
      e164: "\u010D\xEDslo E.164",
      jwt: "JWT",
      template_literal: "vstup",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u010D\xEDslo",
      string: "\u0159et\u011Bzec",
      function: "funkce",
      array: "pole",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no instanceof ${issue2.expected}, obdr\u017Eeno ${received}`;
          }
          return `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${expected}, obdr\u017Eeno ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${stringifyPrimitive(issue2.values[0])}`;
          return `Neplatn\xE1 mo\u017Enost: o\u010Dek\xE1v\xE1na jedna z hodnot ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${issue2.origin ?? "hodnota"} mus\xED m\xEDt ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "prvk\u016F"}`;
          }
          return `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${issue2.origin ?? "hodnota"} mus\xED b\xFDt ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${issue2.origin ?? "hodnota"} mus\xED m\xEDt ${adj}${issue2.minimum.toString()} ${sizing.unit ?? "prvk\u016F"}`;
          }
          return `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${issue2.origin ?? "hodnota"} mus\xED b\xFDt ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Neplatn\xFD \u0159et\u011Bzec: mus\xED za\u010D\xEDnat na "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Neplatn\xFD \u0159et\u011Bzec: mus\xED kon\u010Dit na "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Neplatn\xFD \u0159et\u011Bzec: mus\xED obsahovat "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Neplatn\xFD \u0159et\u011Bzec: mus\xED odpov\xEDdat vzoru ${_issue.pattern}`;
          return `Neplatn\xFD form\xE1t ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Neplatn\xE9 \u010D\xEDslo: mus\xED b\xFDt n\xE1sobkem ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Nezn\xE1m\xE9 kl\xED\u010De: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Neplatn\xFD kl\xED\u010D v ${issue2.origin}`;
        case "invalid_union":
          return "Neplatn\xFD vstup";
        case "invalid_element":
          return `Neplatn\xE1 hodnota v ${issue2.origin}`;
        default:
          return `Neplatn\xFD vstup`;
      }
    };
  };
  function cs_default() {
    return {
      localeError: error6(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/da.js
  var error7 = () => {
    const Sizable = {
      string: { unit: "tegn", verb: "havde" },
      file: { unit: "bytes", verb: "havde" },
      array: { unit: "elementer", verb: "indeholdt" },
      set: { unit: "elementer", verb: "indeholdt" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "input",
      email: "e-mailadresse",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO dato- og klokkesl\xE6t",
      date: "ISO-dato",
      time: "ISO-klokkesl\xE6t",
      duration: "ISO-varighed",
      ipv4: "IPv4-omr\xE5de",
      ipv6: "IPv6-omr\xE5de",
      cidrv4: "IPv4-spektrum",
      cidrv6: "IPv6-spektrum",
      base64: "base64-kodet streng",
      base64url: "base64url-kodet streng",
      json_string: "JSON-streng",
      e164: "E.164-nummer",
      jwt: "JWT",
      template_literal: "input",
    };
    const TypeDictionary = {
      nan: "NaN",
      string: "streng",
      number: "tal",
      boolean: "boolean",
      array: "liste",
      object: "objekt",
      set: "s\xE6t",
      file: "fil",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Ugyldigt input: forventede instanceof ${issue2.expected}, fik ${received}`;
          }
          return `Ugyldigt input: forventede ${expected}, fik ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Ugyldig v\xE6rdi: forventede ${stringifyPrimitive(issue2.values[0])}`;
          return `Ugyldigt valg: forventede en af f\xF8lgende ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          if (sizing)
            return `For stor: forventede ${origin ?? "value"} ${sizing.verb} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "elementer"}`;
          return `For stor: forventede ${origin ?? "value"} havde ${adj} ${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          if (sizing) {
            return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `For lille: forventede ${origin} havde ${adj} ${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Ugyldig streng: skal matche m\xF8nsteret ${_issue.pattern}`;
          return `Ugyldig ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Ugyldigt tal: skal v\xE6re deleligt med ${issue2.divisor}`;
        case "unrecognized_keys":
          return `${issue2.keys.length > 1 ? "Ukendte n\xF8gler" : "Ukendt n\xF8gle"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Ugyldig n\xF8gle i ${issue2.origin}`;
        case "invalid_union":
          return "Ugyldigt input: matcher ingen af de tilladte typer";
        case "invalid_element":
          return `Ugyldig v\xE6rdi i ${issue2.origin}`;
        default:
          return `Ugyldigt input`;
      }
    };
  };
  function da_default() {
    return {
      localeError: error7(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/de.js
  var error8 = () => {
    const Sizable = {
      string: { unit: "Zeichen", verb: "zu haben" },
      file: { unit: "Bytes", verb: "zu haben" },
      array: { unit: "Elemente", verb: "zu haben" },
      set: { unit: "Elemente", verb: "zu haben" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "Eingabe",
      email: "E-Mail-Adresse",
      url: "URL",
      emoji: "Emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO-Datum und -Uhrzeit",
      date: "ISO-Datum",
      time: "ISO-Uhrzeit",
      duration: "ISO-Dauer",
      ipv4: "IPv4-Adresse",
      ipv6: "IPv6-Adresse",
      cidrv4: "IPv4-Bereich",
      cidrv6: "IPv6-Bereich",
      base64: "Base64-codierter String",
      base64url: "Base64-URL-codierter String",
      json_string: "JSON-String",
      e164: "E.164-Nummer",
      jwt: "JWT",
      template_literal: "Eingabe",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "Zahl",
      array: "Array",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Ung\xFCltige Eingabe: erwartet instanceof ${issue2.expected}, erhalten ${received}`;
          }
          return `Ung\xFCltige Eingabe: erwartet ${expected}, erhalten ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Ung\xFCltige Eingabe: erwartet ${stringifyPrimitive(issue2.values[0])}`;
          return `Ung\xFCltige Option: erwartet eine von ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Zu gro\xDF: erwartet, dass ${issue2.origin ?? "Wert"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
          return `Zu gro\xDF: erwartet, dass ${issue2.origin ?? "Wert"} ${adj}${issue2.maximum.toString()} ist`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Zu klein: erwartet, dass ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} hat`;
          }
          return `Zu klein: erwartet, dass ${issue2.origin} ${adj}${issue2.minimum.toString()} ist`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Ung\xFCltiger String: muss mit "${_issue.prefix}" beginnen`;
          if (_issue.format === "ends_with")
            return `Ung\xFCltiger String: muss mit "${_issue.suffix}" enden`;
          if (_issue.format === "includes")
            return `Ung\xFCltiger String: muss "${_issue.includes}" enthalten`;
          if (_issue.format === "regex")
            return `Ung\xFCltiger String: muss dem Muster ${_issue.pattern} entsprechen`;
          return `Ung\xFCltig: ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Ung\xFCltige Zahl: muss ein Vielfaches von ${issue2.divisor} sein`;
        case "unrecognized_keys":
          return `${issue2.keys.length > 1 ? "Unbekannte Schl\xFCssel" : "Unbekannter Schl\xFCssel"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Ung\xFCltiger Schl\xFCssel in ${issue2.origin}`;
        case "invalid_union":
          return "Ung\xFCltige Eingabe";
        case "invalid_element":
          return `Ung\xFCltiger Wert in ${issue2.origin}`;
        default:
          return `Ung\xFCltige Eingabe`;
      }
    };
  };
  function de_default() {
    return {
      localeError: error8(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/el.js
  var error9 = () => {
    const Sizable = {
      string: {
        unit: "\u03C7\u03B1\u03C1\u03B1\u03BA\u03C4\u03AE\u03C1\u03B5\u03C2",
        verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
      },
      file: { unit: "bytes", verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9" },
      array: {
        unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
        verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
      },
      set: {
        unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
        verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
      },
      map: {
        unit: "\u03BA\u03B1\u03C4\u03B1\u03C7\u03C9\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2",
        verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
      email: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1 \u03BA\u03B1\u03B9 \u03CE\u03C1\u03B1",
      date: "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1",
      time: "ISO \u03CE\u03C1\u03B1",
      duration: "ISO \u03B4\u03B9\u03AC\u03C1\u03BA\u03B5\u03B9\u03B1",
      ipv4: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv4",
      ipv6: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv6",
      mac: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 MAC",
      cidrv4: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv4",
      cidrv6: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv6",
      base64:
        "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64",
      base64url:
        "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64url",
      json_string: "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC JSON",
      e164: "\u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 E.164",
      jwt: "JWT",
      template_literal: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (typeof issue2.expected === "string" && /^[A-Z]/.test(issue2.expected)) {
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD instanceof ${issue2.expected}, \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ${received}`;
          }
          return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${expected}, \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${stringifyPrimitive(issue2.values[0])}`;
          return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD \u03AD\u03BD\u03B1 \u03B1\u03C0\u03CC ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${issue2.origin ?? "\u03C4\u03B9\u03BC\u03AE"} \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1"}`;
          return `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${issue2.origin ?? "\u03C4\u03B9\u03BC\u03AE"} \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${issue2.origin} \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${issue2.origin} \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03BE\u03B5\u03BA\u03B9\u03BD\u03AC \u03BC\u03B5 "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B5\u03BB\u03B5\u03B9\u03CE\u03BD\u03B5\u03B9 \u03BC\u03B5 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C0\u03B5\u03C1\u03B9\u03AD\u03C7\u03B5\u03B9 "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B1\u03B9\u03C1\u03B9\u03AC\u03B6\u03B5\u03B9 \u03BC\u03B5 \u03C4\u03BF \u03BC\u03BF\u03C4\u03AF\u03B2\u03BF ${_issue.pattern}`;
          return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF: ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF\u03C2 \u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C0\u03BF\u03BB\u03BB\u03B1\u03C0\u03BB\u03AC\u03C3\u03B9\u03BF \u03C4\u03BF\u03C5 ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\u0386\u03B3\u03BD\u03C9\u03C3\u03C4${issue2.keys.length > 1 ? "\u03B1" : "\u03BF"} \u03BA\u03BB\u03B5\u03B9\u03B4${issue2.keys.length > 1 ? "\u03B9\u03AC" : "\u03AF"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF \u03BA\u03BB\u03B5\u03B9\u03B4\u03AF \u03C3\u03C4\u03BF ${issue2.origin}`;
        case "invalid_union":
          return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2";
        case "invalid_element":
          return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C4\u03B9\u03BC\u03AE \u03C3\u03C4\u03BF ${issue2.origin}`;
        default:
          return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2`;
      }
    };
  };
  function el_default() {
    return {
      localeError: error9(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/en.js
  var error10 = () => {
    const Sizable = {
      string: { unit: "characters", verb: "to have" },
      file: { unit: "bytes", verb: "to have" },
      array: { unit: "items", verb: "to have" },
      set: { unit: "items", verb: "to have" },
      map: { unit: "entries", verb: "to have" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "input",
      email: "email address",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datetime",
      date: "ISO date",
      time: "ISO time",
      duration: "ISO duration",
      ipv4: "IPv4 address",
      ipv6: "IPv6 address",
      mac: "MAC address",
      cidrv4: "IPv4 range",
      cidrv6: "IPv6 range",
      base64: "base64-encoded string",
      base64url: "base64url-encoded string",
      json_string: "JSON string",
      e164: "E.164 number",
      jwt: "JWT",
      template_literal: "input",
    };
    const TypeDictionary = {
      // Compatibility: "nan" -> "NaN" for display
      nan: "NaN",
      // All other type names omitted - they fall back to raw values via ?? operator
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          return `Invalid input: expected ${expected}, received ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
          return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
          return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `Invalid string: must start with "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `Invalid string: must end with "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Invalid string: must include "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Invalid string: must match pattern ${_issue.pattern}`;
          return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Invalid number: must be a multiple of ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Invalid key in ${issue2.origin}`;
        case "invalid_union":
          if (issue2.options && Array.isArray(issue2.options) && issue2.options.length > 0) {
            const opts = issue2.options.map((o) => `'${o}'`).join(" | ");
            return `Invalid discriminator value. Expected ${opts}`;
          }
          return "Invalid input";
        case "invalid_element":
          return `Invalid value in ${issue2.origin}`;
        default:
          return `Invalid input`;
      }
    };
  };
  function en_default() {
    return {
      localeError: error10(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/eo.js
  var error11 = () => {
    const Sizable = {
      string: { unit: "karaktrojn", verb: "havi" },
      file: { unit: "bajtojn", verb: "havi" },
      array: { unit: "elementojn", verb: "havi" },
      set: { unit: "elementojn", verb: "havi" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "enigo",
      email: "retadreso",
      url: "URL",
      emoji: "emo\u011Dio",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO-datotempo",
      date: "ISO-dato",
      time: "ISO-tempo",
      duration: "ISO-da\u016Dro",
      ipv4: "IPv4-adreso",
      ipv6: "IPv6-adreso",
      cidrv4: "IPv4-rango",
      cidrv6: "IPv6-rango",
      base64: "64-ume kodita karaktraro",
      base64url: "URL-64-ume kodita karaktraro",
      json_string: "JSON-karaktraro",
      e164: "E.164-nombro",
      jwt: "JWT",
      template_literal: "enigo",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "nombro",
      array: "tabelo",
      null: "senvalora",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Nevalida enigo: atendi\u011Dis instanceof ${issue2.expected}, ricevi\u011Dis ${received}`;
          }
          return `Nevalida enigo: atendi\u011Dis ${expected}, ricevi\u011Dis ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Nevalida enigo: atendi\u011Dis ${stringifyPrimitive(issue2.values[0])}`;
          return `Nevalida opcio: atendi\u011Dis unu el ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Tro granda: atendi\u011Dis ke ${issue2.origin ?? "valoro"} havu ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
          return `Tro granda: atendi\u011Dis ke ${issue2.origin ?? "valoro"} havu ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Tro malgranda: atendi\u011Dis ke ${issue2.origin} havu ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Tro malgranda: atendi\u011Dis ke ${issue2.origin} estu ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Nevalida karaktraro: devas komenci\u011Di per "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Nevalida karaktraro: devas fini\u011Di per "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
          return `Nevalida ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Nevalida nombro: devas esti oblo de ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Nekonata${issue2.keys.length > 1 ? "j" : ""} \u015Dlosilo${issue2.keys.length > 1 ? "j" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Nevalida \u015Dlosilo en ${issue2.origin}`;
        case "invalid_union":
          return "Nevalida enigo";
        case "invalid_element":
          return `Nevalida valoro en ${issue2.origin}`;
        default:
          return `Nevalida enigo`;
      }
    };
  };
  function eo_default() {
    return {
      localeError: error11(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/es.js
  var error12 = () => {
    const Sizable = {
      string: { unit: "caracteres", verb: "tener" },
      file: { unit: "bytes", verb: "tener" },
      array: { unit: "elementos", verb: "tener" },
      set: { unit: "elementos", verb: "tener" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "entrada",
      email: "direcci\xF3n de correo electr\xF3nico",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "fecha y hora ISO",
      date: "fecha ISO",
      time: "hora ISO",
      duration: "duraci\xF3n ISO",
      ipv4: "direcci\xF3n IPv4",
      ipv6: "direcci\xF3n IPv6",
      cidrv4: "rango IPv4",
      cidrv6: "rango IPv6",
      base64: "cadena codificada en base64",
      base64url: "URL codificada en base64",
      json_string: "cadena JSON",
      e164: "n\xFAmero E.164",
      jwt: "JWT",
      template_literal: "entrada",
    };
    const TypeDictionary = {
      nan: "NaN",
      string: "texto",
      number: "n\xFAmero",
      boolean: "booleano",
      array: "arreglo",
      object: "objeto",
      set: "conjunto",
      file: "archivo",
      date: "fecha",
      bigint: "n\xFAmero grande",
      symbol: "s\xEDmbolo",
      undefined: "indefinido",
      null: "nulo",
      function: "funci\xF3n",
      map: "mapa",
      record: "registro",
      tuple: "tupla",
      enum: "enumeraci\xF3n",
      union: "uni\xF3n",
      literal: "literal",
      promise: "promesa",
      void: "vac\xEDo",
      never: "nunca",
      unknown: "desconocido",
      any: "cualquiera",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Entrada inv\xE1lida: se esperaba instanceof ${issue2.expected}, recibido ${received}`;
          }
          return `Entrada inv\xE1lida: se esperaba ${expected}, recibido ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Entrada inv\xE1lida: se esperaba ${stringifyPrimitive(issue2.values[0])}`;
          return `Opci\xF3n inv\xE1lida: se esperaba una de ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          if (sizing)
            return `Demasiado grande: se esperaba que ${origin ?? "valor"} tuviera ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementos"}`;
          return `Demasiado grande: se esperaba que ${origin ?? "valor"} fuera ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          if (sizing) {
            return `Demasiado peque\xF1o: se esperaba que ${origin} tuviera ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Demasiado peque\xF1o: se esperaba que ${origin} fuera ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Cadena inv\xE1lida: debe comenzar con "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Cadena inv\xE1lida: debe terminar en "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Cadena inv\xE1lida: debe incluir "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Cadena inv\xE1lida: debe coincidir con el patr\xF3n ${_issue.pattern}`;
          return `Inv\xE1lido ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `N\xFAmero inv\xE1lido: debe ser m\xFAltiplo de ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Llave${issue2.keys.length > 1 ? "s" : ""} desconocida${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Llave inv\xE1lida en ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
        case "invalid_union":
          return "Entrada inv\xE1lida";
        case "invalid_element":
          return `Valor inv\xE1lido en ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
        default:
          return `Entrada inv\xE1lida`;
      }
    };
  };
  function es_default() {
    return {
      localeError: error12(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/fa.js
  var error13 = () => {
    const Sizable = {
      string: {
        unit: "\u06A9\u0627\u0631\u0627\u06A9\u062A\u0631",
        verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
      },
      file: {
        unit: "\u0628\u0627\u06CC\u062A",
        verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
      },
      array: {
        unit: "\u0622\u06CC\u062A\u0645",
        verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
      },
      set: {
        unit: "\u0622\u06CC\u062A\u0645",
        verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0648\u0631\u0648\u062F\u06CC",
      email: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644",
      url: "URL",
      emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u062A\u0627\u0631\u06CC\u062E \u0648 \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
      date: "\u062A\u0627\u0631\u06CC\u062E \u0627\u06CC\u0632\u0648",
      time: "\u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
      duration: "\u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
      ipv4: "IPv4 \u0622\u062F\u0631\u0633",
      ipv6: "IPv6 \u0622\u062F\u0631\u0633",
      cidrv4: "IPv4 \u062F\u0627\u0645\u0646\u0647",
      cidrv6: "IPv6 \u062F\u0627\u0645\u0646\u0647",
      base64: "base64-encoded \u0631\u0634\u062A\u0647",
      base64url: "base64url-encoded \u0631\u0634\u062A\u0647",
      json_string: "JSON \u0631\u0634\u062A\u0647",
      e164: "E.164 \u0639\u062F\u062F",
      jwt: "JWT",
      template_literal: "\u0648\u0631\u0648\u062F\u06CC",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0639\u062F\u062F",
      array: "\u0622\u0631\u0627\u06CC\u0647",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A instanceof ${issue2.expected} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${received} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`;
          }
          return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${expected} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${received} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`;
        }
        case "invalid_value":
          if (issue2.values.length === 1) {
            return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${stringifyPrimitive(issue2.values[0])} \u0645\u06CC\u200C\u0628\u0648\u062F`;
          }
          return `\u06AF\u0632\u06CC\u0646\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A \u06CC\u06A9\u06CC \u0627\u0632 ${joinValues(issue2.values, "|")} \u0645\u06CC\u200C\u0628\u0648\u062F`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${issue2.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u0639\u0646\u0635\u0631"} \u0628\u0627\u0634\u062F`;
          }
          return `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${issue2.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${adj}${issue2.maximum.toString()} \u0628\u0627\u0634\u062F`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${issue2.origin} \u0628\u0627\u06CC\u062F ${adj}${issue2.minimum.toString()} ${sizing.unit} \u0628\u0627\u0634\u062F`;
          }
          return `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${issue2.origin} \u0628\u0627\u06CC\u062F ${adj}${issue2.minimum.toString()} \u0628\u0627\u0634\u062F`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${_issue.prefix}" \u0634\u0631\u0648\u0639 \u0634\u0648\u062F`;
          }
          if (_issue.format === "ends_with") {
            return `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${_issue.suffix}" \u062A\u0645\u0627\u0645 \u0634\u0648\u062F`;
          }
          if (_issue.format === "includes") {
            return `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 "${_issue.includes}" \u0628\u0627\u0634\u062F`;
          }
          if (_issue.format === "regex") {
            return `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC ${_issue.pattern} \u0645\u0637\u0627\u0628\u0642\u062A \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F`;
          }
          return `${FormatDictionary[_issue.format] ?? issue2.format} \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
        }
        case "not_multiple_of":
          return `\u0639\u062F\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0645\u0636\u0631\u0628 ${issue2.divisor} \u0628\u0627\u0634\u062F`;
        case "unrecognized_keys":
          return `\u06A9\u0644\u06CC\u062F${issue2.keys.length > 1 ? "\u0647\u0627\u06CC" : ""} \u0646\u0627\u0634\u0646\u0627\u0633: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u06A9\u0644\u06CC\u062F \u0646\u0627\u0634\u0646\u0627\u0633 \u062F\u0631 ${issue2.origin}`;
        case "invalid_union":
          return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
        case "invalid_element":
          return `\u0645\u0642\u062F\u0627\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u062F\u0631 ${issue2.origin}`;
        default:
          return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
      }
    };
  };
  function fa_default() {
    return {
      localeError: error13(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/fi.js
  var error14 = () => {
    const Sizable = {
      string: { unit: "merkki\xE4", subject: "merkkijonon" },
      file: { unit: "tavua", subject: "tiedoston" },
      array: { unit: "alkiota", subject: "listan" },
      set: { unit: "alkiota", subject: "joukon" },
      number: { unit: "", subject: "luvun" },
      bigint: { unit: "", subject: "suuren kokonaisluvun" },
      int: { unit: "", subject: "kokonaisluvun" },
      date: { unit: "", subject: "p\xE4iv\xE4m\xE4\xE4r\xE4n" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "s\xE4\xE4nn\xF6llinen lauseke",
      email: "s\xE4hk\xF6postiosoite",
      url: "URL-osoite",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO-aikaleima",
      date: "ISO-p\xE4iv\xE4m\xE4\xE4r\xE4",
      time: "ISO-aika",
      duration: "ISO-kesto",
      ipv4: "IPv4-osoite",
      ipv6: "IPv6-osoite",
      cidrv4: "IPv4-alue",
      cidrv6: "IPv6-alue",
      base64: "base64-koodattu merkkijono",
      base64url: "base64url-koodattu merkkijono",
      json_string: "JSON-merkkijono",
      e164: "E.164-luku",
      jwt: "JWT",
      template_literal: "templaattimerkkijono",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Virheellinen tyyppi: odotettiin instanceof ${issue2.expected}, oli ${received}`;
          }
          return `Virheellinen tyyppi: odotettiin ${expected}, oli ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Virheellinen sy\xF6te: t\xE4ytyy olla ${stringifyPrimitive(issue2.values[0])}`;
          return `Virheellinen valinta: t\xE4ytyy olla yksi seuraavista: ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Liian suuri: ${sizing.subject} t\xE4ytyy olla ${adj}${issue2.maximum.toString()} ${sizing.unit}`.trim();
          }
          return `Liian suuri: arvon t\xE4ytyy olla ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Liian pieni: ${sizing.subject} t\xE4ytyy olla ${adj}${issue2.minimum.toString()} ${sizing.unit}`.trim();
          }
          return `Liian pieni: arvon t\xE4ytyy olla ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Virheellinen sy\xF6te: t\xE4ytyy alkaa "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Virheellinen sy\xF6te: t\xE4ytyy loppua "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Virheellinen sy\xF6te: t\xE4ytyy sis\xE4lt\xE4\xE4 "${_issue.includes}"`;
          if (_issue.format === "regex") {
            return `Virheellinen sy\xF6te: t\xE4ytyy vastata s\xE4\xE4nn\xF6llist\xE4 lauseketta ${_issue.pattern}`;
          }
          return `Virheellinen ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Virheellinen luku: t\xE4ytyy olla luvun ${issue2.divisor} monikerta`;
        case "unrecognized_keys":
          return `${issue2.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return "Virheellinen avain tietueessa";
        case "invalid_union":
          return "Virheellinen unioni";
        case "invalid_element":
          return "Virheellinen arvo joukossa";
        default:
          return `Virheellinen sy\xF6te`;
      }
    };
  };
  function fi_default() {
    return {
      localeError: error14(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/fr.js
  var error15 = () => {
    const Sizable = {
      string: { unit: "caract\xE8res", verb: "avoir" },
      file: { unit: "octets", verb: "avoir" },
      array: { unit: "\xE9l\xE9ments", verb: "avoir" },
      set: { unit: "\xE9l\xE9ments", verb: "avoir" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "entr\xE9e",
      email: "adresse e-mail",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "date et heure ISO",
      date: "date ISO",
      time: "heure ISO",
      duration: "dur\xE9e ISO",
      ipv4: "adresse IPv4",
      ipv6: "adresse IPv6",
      cidrv4: "plage IPv4",
      cidrv6: "plage IPv6",
      base64: "cha\xEEne encod\xE9e en base64",
      base64url: "cha\xEEne encod\xE9e en base64url",
      json_string: "cha\xEEne JSON",
      e164: "num\xE9ro E.164",
      jwt: "JWT",
      template_literal: "entr\xE9e",
    };
    const TypeDictionary = {
      string: "cha\xEEne",
      number: "nombre",
      int: "entier",
      boolean: "bool\xE9en",
      bigint: "grand entier",
      symbol: "symbole",
      undefined: "ind\xE9fini",
      null: "null",
      never: "jamais",
      void: "vide",
      date: "date",
      array: "tableau",
      object: "objet",
      tuple: "tuple",
      record: "enregistrement",
      map: "carte",
      set: "ensemble",
      file: "fichier",
      nonoptional: "non-optionnel",
      nan: "NaN",
      function: "fonction",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Entr\xE9e invalide : instanceof ${issue2.expected} attendu, ${received} re\xE7u`;
          }
          return `Entr\xE9e invalide : ${expected} attendu, ${received} re\xE7u`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Entr\xE9e invalide : ${stringifyPrimitive(issue2.values[0])} attendu`;
          return `Option invalide : une valeur parmi ${joinValues(issue2.values, "|")} attendue`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Trop grand : ${TypeDictionary[issue2.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\xE9l\xE9ment(s)"}`;
          return `Trop grand : ${TypeDictionary[issue2.origin] ?? "valeur"} doit \xEAtre ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Trop petit : ${TypeDictionary[issue2.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          return `Trop petit : ${TypeDictionary[issue2.origin] ?? "valeur"} doit \xEAtre ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Cha\xEEne invalide : doit commencer par "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Cha\xEEne invalide : doit se terminer par "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Cha\xEEne invalide : doit inclure "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Cha\xEEne invalide : doit correspondre au mod\xE8le ${_issue.pattern}`;
          return `${FormatDictionary[_issue.format] ?? issue2.format} invalide`;
        }
        case "not_multiple_of":
          return `Nombre invalide : doit \xEAtre un multiple de ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Cl\xE9${issue2.keys.length > 1 ? "s" : ""} non reconnue${issue2.keys.length > 1 ? "s" : ""} : ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Cl\xE9 invalide dans ${issue2.origin}`;
        case "invalid_union":
          return "Entr\xE9e invalide";
        case "invalid_element":
          return `Valeur invalide dans ${issue2.origin}`;
        default:
          return `Entr\xE9e invalide`;
      }
    };
  };
  function fr_default() {
    return {
      localeError: error15(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/fr-CA.js
  var error16 = () => {
    const Sizable = {
      string: { unit: "caract\xE8res", verb: "avoir" },
      file: { unit: "octets", verb: "avoir" },
      array: { unit: "\xE9l\xE9ments", verb: "avoir" },
      set: { unit: "\xE9l\xE9ments", verb: "avoir" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "entr\xE9e",
      email: "adresse courriel",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "date-heure ISO",
      date: "date ISO",
      time: "heure ISO",
      duration: "dur\xE9e ISO",
      ipv4: "adresse IPv4",
      ipv6: "adresse IPv6",
      cidrv4: "plage IPv4",
      cidrv6: "plage IPv6",
      base64: "cha\xEEne encod\xE9e en base64",
      base64url: "cha\xEEne encod\xE9e en base64url",
      json_string: "cha\xEEne JSON",
      e164: "num\xE9ro E.164",
      jwt: "JWT",
      template_literal: "entr\xE9e",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Entr\xE9e invalide : attendu instanceof ${issue2.expected}, re\xE7u ${received}`;
          }
          return `Entr\xE9e invalide : attendu ${expected}, re\xE7u ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Entr\xE9e invalide : attendu ${stringifyPrimitive(issue2.values[0])}`;
          return `Option invalide : attendu l'une des valeurs suivantes ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "\u2264" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Trop grand : attendu que ${issue2.origin ?? "la valeur"} ait ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
          return `Trop grand : attendu que ${issue2.origin ?? "la valeur"} soit ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? "\u2265" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Trop petit : attendu que ${issue2.origin} ait ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Trop petit : attendu que ${issue2.origin} soit ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `Cha\xEEne invalide : doit commencer par "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `Cha\xEEne invalide : doit se terminer par "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Cha\xEEne invalide : doit inclure "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Cha\xEEne invalide : doit correspondre au motif ${_issue.pattern}`;
          return `${FormatDictionary[_issue.format] ?? issue2.format} invalide`;
        }
        case "not_multiple_of":
          return `Nombre invalide : doit \xEAtre un multiple de ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Cl\xE9${issue2.keys.length > 1 ? "s" : ""} non reconnue${issue2.keys.length > 1 ? "s" : ""} : ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Cl\xE9 invalide dans ${issue2.origin}`;
        case "invalid_union":
          return "Entr\xE9e invalide";
        case "invalid_element":
          return `Valeur invalide dans ${issue2.origin}`;
        default:
          return `Entr\xE9e invalide`;
      }
    };
  };
  function fr_CA_default() {
    return {
      localeError: error16(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/he.js
  var error17 = () => {
    const TypeNames = {
      string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA", gender: "f" },
      number: { label: "\u05DE\u05E1\u05E4\u05E8", gender: "m" },
      boolean: {
        label: "\u05E2\u05E8\u05DA \u05D1\u05D5\u05DC\u05D9\u05D0\u05E0\u05D9",
        gender: "m",
      },
      bigint: { label: "BigInt", gender: "m" },
      date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA", gender: "m" },
      array: { label: "\u05DE\u05E2\u05E8\u05DA", gender: "m" },
      object: { label: "\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8", gender: "m" },
      null: { label: "\u05E2\u05E8\u05DA \u05E8\u05D9\u05E7 (null)", gender: "m" },
      undefined: {
        label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8 (undefined)",
        gender: "m",
      },
      symbol: { label: "\u05E1\u05D9\u05DE\u05D1\u05D5\u05DC (Symbol)", gender: "m" },
      function: { label: "\u05E4\u05D5\u05E0\u05E7\u05E6\u05D9\u05D4", gender: "f" },
      map: { label: "\u05DE\u05E4\u05D4 (Map)", gender: "f" },
      set: { label: "\u05E7\u05D1\u05D5\u05E6\u05D4 (Set)", gender: "f" },
      file: { label: "\u05E7\u05D5\u05D1\u05E5", gender: "m" },
      promise: { label: "Promise", gender: "m" },
      NaN: { label: "NaN", gender: "m" },
      unknown: { label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2", gender: "m" },
      value: { label: "\u05E2\u05E8\u05DA", gender: "m" },
    };
    const Sizable = {
      string: {
        unit: "\u05EA\u05D5\u05D5\u05D9\u05DD",
        shortLabel: "\u05E7\u05E6\u05E8",
        longLabel: "\u05D0\u05E8\u05D5\u05DA",
      },
      file: {
        unit: "\u05D1\u05D9\u05D9\u05D8\u05D9\u05DD",
        shortLabel: "\u05E7\u05D8\u05DF",
        longLabel: "\u05D2\u05D3\u05D5\u05DC",
      },
      array: {
        unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
        shortLabel: "\u05E7\u05D8\u05DF",
        longLabel: "\u05D2\u05D3\u05D5\u05DC",
      },
      set: {
        unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
        shortLabel: "\u05E7\u05D8\u05DF",
        longLabel: "\u05D2\u05D3\u05D5\u05DC",
      },
      number: { unit: "", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" },
      // no unit
    };
    const typeEntry = (t) => (t ? TypeNames[t] : void 0);
    const typeLabel = (t) => {
      const e = typeEntry(t);
      if (e) return e.label;
      return t ?? TypeNames.unknown.label;
    };
    const withDefinite = (t) => `\u05D4${typeLabel(t)}`;
    const verbFor = (t) => {
      const e = typeEntry(t);
      const gender = e?.gender ?? "m";
      return gender === "f"
        ? "\u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA"
        : "\u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA";
    };
    const getSizing = (origin) => {
      if (!origin) return null;
      return Sizable[origin] ?? null;
    };
    const FormatDictionary = {
      regex: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      email: {
        label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC",
        gender: "f",
      },
      url: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05E8\u05E9\u05EA", gender: "f" },
      emoji: { label: "\u05D0\u05D9\u05DE\u05D5\u05D2'\u05D9", gender: "m" },
      uuid: { label: "UUID", gender: "m" },
      nanoid: { label: "nanoid", gender: "m" },
      guid: { label: "GUID", gender: "m" },
      cuid: { label: "cuid", gender: "m" },
      cuid2: { label: "cuid2", gender: "m" },
      ulid: { label: "ULID", gender: "m" },
      xid: { label: "XID", gender: "m" },
      ksuid: { label: "KSUID", gender: "m" },
      datetime: {
        label: "\u05EA\u05D0\u05E8\u05D9\u05DA \u05D5\u05D6\u05DE\u05DF ISO",
        gender: "m",
      },
      date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA ISO", gender: "m" },
      time: { label: "\u05D6\u05DE\u05DF ISO", gender: "m" },
      duration: { label: "\u05DE\u05E9\u05DA \u05D6\u05DE\u05DF ISO", gender: "m" },
      ipv4: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv4", gender: "f" },
      ipv6: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv6", gender: "f" },
      cidrv4: { label: "\u05D8\u05D5\u05D5\u05D7 IPv4", gender: "m" },
      cidrv6: { label: "\u05D8\u05D5\u05D5\u05D7 IPv6", gender: "m" },
      base64: {
        label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64",
        gender: "f",
      },
      base64url: {
        label:
          "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64 \u05DC\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA \u05E8\u05E9\u05EA",
        gender: "f",
      },
      json_string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA JSON", gender: "f" },
      e164: { label: "\u05DE\u05E1\u05E4\u05E8 E.164", gender: "m" },
      jwt: { label: "JWT", gender: "m" },
      ends_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      includes: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      lowercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      starts_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
      uppercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expectedKey = issue2.expected;
          const expected = TypeDictionary[expectedKey ?? ""] ?? typeLabel(expectedKey);
          const receivedType = parsedType(issue2.input);
          const received =
            TypeDictionary[receivedType] ?? TypeNames[receivedType]?.label ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA instanceof ${issue2.expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${received}`;
          }
          return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${received}`;
        }
        case "invalid_value": {
          if (issue2.values.length === 1) {
            return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05E2\u05E8\u05DA \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA ${stringifyPrimitive(issue2.values[0])}`;
          }
          const stringified = issue2.values.map((v) => stringifyPrimitive(v));
          if (issue2.values.length === 2) {
            return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${stringified[0]} \u05D0\u05D5 ${stringified[1]}`;
          }
          const lastValue = stringified[stringified.length - 1];
          const restValues = stringified.slice(0, -1).join(", ");
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${restValues} \u05D0\u05D5 ${lastValue}`;
        }
        case "too_big": {
          const sizing = getSizing(issue2.origin);
          const subject = withDefinite(issue2.origin ?? "value");
          if (issue2.origin === "string") {
            return `${sizing?.longLabel ?? "\u05D0\u05E8\u05D5\u05DA"} \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${issue2.maximum.toString()} ${sizing?.unit ?? ""} ${issue2.inclusive ? "\u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA" : "\u05DC\u05DB\u05DC \u05D4\u05D9\u05D5\u05EA\u05E8"}`.trim();
          }
          if (issue2.origin === "number") {
            const comparison = issue2.inclusive
              ? `\u05E7\u05D8\u05DF \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${issue2.maximum}`
              : `\u05E7\u05D8\u05DF \u05DE-${issue2.maximum}`;
            return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${comparison}`;
          }
          if (issue2.origin === "array" || issue2.origin === "set") {
            const verb =
              issue2.origin === "set"
                ? "\u05E6\u05E8\u05D9\u05DB\u05D4"
                : "\u05E6\u05E8\u05D9\u05DA";
            const comparison = issue2.inclusive
              ? `${issue2.maximum} ${sizing?.unit ?? ""} \u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA`
              : `\u05E4\u05D7\u05D5\u05EA \u05DE-${issue2.maximum} ${sizing?.unit ?? ""}`;
            return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${comparison}`.trim();
          }
          const adj = issue2.inclusive ? "<=" : "<";
          const be = verbFor(issue2.origin ?? "value");
          if (sizing?.unit) {
            return `${sizing.longLabel} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
          }
          return `${sizing?.longLabel ?? "\u05D2\u05D3\u05D5\u05DC"} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const sizing = getSizing(issue2.origin);
          const subject = withDefinite(issue2.origin ?? "value");
          if (issue2.origin === "string") {
            return `${sizing?.shortLabel ?? "\u05E7\u05E6\u05E8"} \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${issue2.minimum.toString()} ${sizing?.unit ?? ""} ${issue2.inclusive ? "\u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8" : "\u05DC\u05E4\u05D7\u05D5\u05EA"}`.trim();
          }
          if (issue2.origin === "number") {
            const comparison = issue2.inclusive
              ? `\u05D2\u05D3\u05D5\u05DC \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${issue2.minimum}`
              : `\u05D2\u05D3\u05D5\u05DC \u05DE-${issue2.minimum}`;
            return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${comparison}`;
          }
          if (issue2.origin === "array" || issue2.origin === "set") {
            const verb =
              issue2.origin === "set"
                ? "\u05E6\u05E8\u05D9\u05DB\u05D4"
                : "\u05E6\u05E8\u05D9\u05DA";
            if (issue2.minimum === 1 && issue2.inclusive) {
              const singularPhrase =
                issue2.origin === "set"
                  ? "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3"
                  : "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3";
              return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${singularPhrase}`;
            }
            const comparison = issue2.inclusive
              ? `${issue2.minimum} ${sizing?.unit ?? ""} \u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8`
              : `\u05D9\u05D5\u05EA\u05E8 \u05DE-${issue2.minimum} ${sizing?.unit ?? ""}`;
            return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${comparison}`.trim();
          }
          const adj = issue2.inclusive ? ">=" : ">";
          const be = verbFor(issue2.origin ?? "value");
          if (sizing?.unit) {
            return `${sizing.shortLabel} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `${sizing?.shortLabel ?? "\u05E7\u05D8\u05DF"} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1 "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05E1\u05EA\u05D9\u05D9\u05DD \u05D1 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05DB\u05DC\u05D5\u05DC "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05DC\u05EA\u05D1\u05E0\u05D9\u05EA ${_issue.pattern}`;
          const nounEntry = FormatDictionary[_issue.format];
          const noun = nounEntry?.label ?? _issue.format;
          const gender = nounEntry?.gender ?? "m";
          const adjective =
            gender === "f" ? "\u05EA\u05E7\u05D9\u05E0\u05D4" : "\u05EA\u05E7\u05D9\u05DF";
          return `${noun} \u05DC\u05D0 ${adjective}`;
        }
        case "not_multiple_of":
          return `\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05DB\u05E4\u05DC\u05D4 \u05E9\u05DC ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\u05DE\u05E4\u05EA\u05D7${issue2.keys.length > 1 ? "\u05D5\u05EA" : ""} \u05DC\u05D0 \u05DE\u05D6\u05D5\u05D4${issue2.keys.length > 1 ? "\u05D9\u05DD" : "\u05D4"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key": {
          return `\u05E9\u05D3\u05D4 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8`;
        }
        case "invalid_union":
          return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
        case "invalid_element": {
          const place = withDefinite(issue2.origin ?? "array");
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1${place}`;
        }
        default:
          return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF`;
      }
    };
  };
  function he_default() {
    return {
      localeError: error17(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/hr.js
  var error18 = () => {
    const Sizable = {
      string: { unit: "znakova", verb: "imati" },
      file: { unit: "bajtova", verb: "imati" },
      array: { unit: "stavki", verb: "imati" },
      set: { unit: "stavki", verb: "imati" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "unos",
      email: "email adresa",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datum i vrijeme",
      date: "ISO datum",
      time: "ISO vrijeme",
      duration: "ISO trajanje",
      ipv4: "IPv4 adresa",
      ipv6: "IPv6 adresa",
      cidrv4: "IPv4 raspon",
      cidrv6: "IPv6 raspon",
      base64: "base64 kodirani tekst",
      base64url: "base64url kodirani tekst",
      json_string: "JSON tekst",
      e164: "E.164 broj",
      jwt: "JWT",
      template_literal: "unos",
    };
    const TypeDictionary = {
      nan: "NaN",
      string: "tekst",
      number: "broj",
      boolean: "boolean",
      array: "niz",
      object: "objekt",
      set: "skup",
      file: "datoteka",
      date: "datum",
      bigint: "bigint",
      symbol: "simbol",
      undefined: "undefined",
      null: "null",
      function: "funkcija",
      map: "mapa",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Neispravan unos: o\u010Dekuje se instanceof ${issue2.expected}, a primljeno je ${received}`;
          }
          return `Neispravan unos: o\u010Dekuje se ${expected}, a primljeno je ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Neispravna vrijednost: o\u010Dekivano ${stringifyPrimitive(issue2.values[0])}`;
          return `Neispravna opcija: o\u010Dekivano jedno od ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          if (sizing)
            return `Preveliko: o\u010Dekivano da ${origin ?? "vrijednost"} ima ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemenata"}`;
          return `Preveliko: o\u010Dekivano da ${origin ?? "vrijednost"} bude ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          if (sizing) {
            return `Premalo: o\u010Dekivano da ${origin} ima ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Premalo: o\u010Dekivano da ${origin} bude ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Neispravan tekst: mora zapo\u010Dinjati s "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Neispravan tekst: mora zavr\u0161avati s "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Neispravan tekst: mora sadr\u017Eavati "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Neispravan tekst: mora odgovarati uzorku ${_issue.pattern}`;
          return `Neispravna ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Neispravan broj: mora biti vi\u0161ekratnik od ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Neprepoznat${issue2.keys.length > 1 ? "i klju\u010Devi" : " klju\u010D"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Neispravan klju\u010D u ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
        case "invalid_union":
          return "Neispravan unos";
        case "invalid_element":
          return `Neispravna vrijednost u ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
        default:
          return `Neispravan unos`;
      }
    };
  };
  function hr_default() {
    return {
      localeError: error18(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/hu.js
  var error19 = () => {
    const Sizable = {
      string: { unit: "karakter", verb: "legyen" },
      file: { unit: "byte", verb: "legyen" },
      array: { unit: "elem", verb: "legyen" },
      set: { unit: "elem", verb: "legyen" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "bemenet",
      email: "email c\xEDm",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO id\u0151b\xE9lyeg",
      date: "ISO d\xE1tum",
      time: "ISO id\u0151",
      duration: "ISO id\u0151intervallum",
      ipv4: "IPv4 c\xEDm",
      ipv6: "IPv6 c\xEDm",
      cidrv4: "IPv4 tartom\xE1ny",
      cidrv6: "IPv6 tartom\xE1ny",
      base64: "base64-k\xF3dolt string",
      base64url: "base64url-k\xF3dolt string",
      json_string: "JSON string",
      e164: "E.164 sz\xE1m",
      jwt: "JWT",
      template_literal: "bemenet",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "sz\xE1m",
      array: "t\xF6mb",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k instanceof ${issue2.expected}, a kapott \xE9rt\xE9k ${received}`;
          }
          return `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${expected}, a kapott \xE9rt\xE9k ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${stringifyPrimitive(issue2.values[0])}`;
          return `\xC9rv\xE9nytelen opci\xF3: valamelyik \xE9rt\xE9k v\xE1rt ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `T\xFAl nagy: ${issue2.origin ?? "\xE9rt\xE9k"} m\xE9rete t\xFAl nagy ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elem"}`;
          return `T\xFAl nagy: a bemeneti \xE9rt\xE9k ${issue2.origin ?? "\xE9rt\xE9k"} t\xFAl nagy: ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `T\xFAl kicsi: a bemeneti \xE9rt\xE9k ${issue2.origin} m\xE9rete t\xFAl kicsi ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `T\xFAl kicsi: a bemeneti \xE9rt\xE9k ${issue2.origin} t\xFAl kicsi ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\xC9rv\xE9nytelen string: "${_issue.prefix}" \xE9rt\xE9kkel kell kezd\u0151dnie`;
          if (_issue.format === "ends_with")
            return `\xC9rv\xE9nytelen string: "${_issue.suffix}" \xE9rt\xE9kkel kell v\xE9gz\u0151dnie`;
          if (_issue.format === "includes")
            return `\xC9rv\xE9nytelen string: "${_issue.includes}" \xE9rt\xE9ket kell tartalmaznia`;
          if (_issue.format === "regex")
            return `\xC9rv\xE9nytelen string: ${_issue.pattern} mint\xE1nak kell megfelelnie`;
          return `\xC9rv\xE9nytelen ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\xC9rv\xE9nytelen sz\xE1m: ${issue2.divisor} t\xF6bbsz\xF6r\xF6s\xE9nek kell lennie`;
        case "unrecognized_keys":
          return `Ismeretlen kulcs${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\xC9rv\xE9nytelen kulcs ${issue2.origin}`;
        case "invalid_union":
          return "\xC9rv\xE9nytelen bemenet";
        case "invalid_element":
          return `\xC9rv\xE9nytelen \xE9rt\xE9k: ${issue2.origin}`;
        default:
          return `\xC9rv\xE9nytelen bemenet`;
      }
    };
  };
  function hu_default() {
    return {
      localeError: error19(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/hy.js
  function getArmenianPlural(count, one, many) {
    return Math.abs(count) === 1 ? one : many;
  }
  function withDefiniteArticle(word) {
    if (!word) return "";
    const vowels = ["\u0561", "\u0565", "\u0568", "\u056B", "\u0578", "\u0578\u0582", "\u0585"];
    const lastChar = word[word.length - 1];
    return word + (vowels.includes(lastChar) ? "\u0576" : "\u0568");
  }
  var error20 = () => {
    const Sizable = {
      string: {
        unit: {
          one: "\u0576\u0577\u0561\u0576",
          many: "\u0576\u0577\u0561\u0576\u0576\u0565\u0580",
        },
        verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
      },
      file: {
        unit: {
          one: "\u0562\u0561\u0575\u0569",
          many: "\u0562\u0561\u0575\u0569\u0565\u0580",
        },
        verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
      },
      array: {
        unit: {
          one: "\u057F\u0561\u0580\u0580",
          many: "\u057F\u0561\u0580\u0580\u0565\u0580",
        },
        verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
      },
      set: {
        unit: {
          one: "\u057F\u0561\u0580\u0580",
          many: "\u057F\u0561\u0580\u0580\u0565\u0580",
        },
        verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0574\u0578\u0582\u057F\u0584",
      email: "\u0567\u056C. \u0570\u0561\u057D\u0581\u0565",
      url: "URL",
      emoji: "\u0567\u0574\u0578\u057B\u056B",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E \u0587 \u056A\u0561\u0574",
      date: "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E",
      time: "ISO \u056A\u0561\u0574",
      duration: "ISO \u057F\u0587\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
      ipv4: "IPv4 \u0570\u0561\u057D\u0581\u0565",
      ipv6: "IPv6 \u0570\u0561\u057D\u0581\u0565",
      cidrv4: "IPv4 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
      cidrv6: "IPv6 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
      base64: "base64 \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
      base64url: "base64url \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
      json_string: "JSON \u057F\u0578\u0572",
      e164: "E.164 \u0570\u0561\u0574\u0561\u0580",
      jwt: "JWT",
      template_literal: "\u0574\u0578\u0582\u057F\u0584",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0569\u056B\u057E",
      array: "\u0566\u0561\u0576\u0563\u057E\u0561\u056E",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 instanceof ${issue2.expected}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${received}`;
          }
          return `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${expected}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${stringifyPrimitive(issue2.values[1])}`;
          return `\u054D\u056D\u0561\u056C \u057F\u0561\u0580\u0562\u0565\u0580\u0561\u056F\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 \u0570\u0565\u057F\u0587\u0575\u0561\u056C\u0576\u0565\u0580\u056B\u0581 \u0574\u0565\u056F\u0568\u055D ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            const maxValue = Number(issue2.maximum);
            const unit = getArmenianPlural(maxValue, sizing.unit.one, sizing.unit.many);
            return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${withDefiniteArticle(issue2.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${adj}${issue2.maximum.toString()} ${unit}`;
          }
          return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${withDefiniteArticle(issue2.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056C\u056B\u0576\u056B ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            const minValue = Number(issue2.minimum);
            const unit = getArmenianPlural(minValue, sizing.unit.one, sizing.unit.many);
            return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${withDefiniteArticle(issue2.origin)} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${adj}${issue2.minimum.toString()} ${unit}`;
          }
          return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${withDefiniteArticle(issue2.origin)} \u056C\u056B\u0576\u056B ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057D\u056F\u057D\u057E\u056B "${_issue.prefix}"-\u0578\u057E`;
          if (_issue.format === "ends_with")
            return `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0561\u057E\u0561\u0580\u057F\u057E\u056B "${_issue.suffix}"-\u0578\u057E`;
          if (_issue.format === "includes")
            return `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057A\u0561\u0580\u0578\u0582\u0576\u0561\u056F\u056B "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0570\u0561\u0574\u0561\u057A\u0561\u057F\u0561\u057D\u056D\u0561\u0576\u056B ${_issue.pattern} \u0571\u0587\u0561\u0579\u0561\u0583\u056B\u0576`;
          return `\u054D\u056D\u0561\u056C ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u054D\u056D\u0561\u056C \u0569\u056B\u057E\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0562\u0561\u0566\u0574\u0561\u057A\u0561\u057F\u056B\u056F \u056C\u056B\u0576\u056B ${issue2.divisor}-\u056B`;
        case "unrecognized_keys":
          return `\u0549\u0573\u0561\u0576\u0561\u0579\u057E\u0561\u056E \u0562\u0561\u0576\u0561\u056C\u056B${issue2.keys.length > 1 ? "\u0576\u0565\u0580" : ""}. ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u054D\u056D\u0561\u056C \u0562\u0561\u0576\u0561\u056C\u056B ${withDefiniteArticle(issue2.origin)}-\u0578\u0582\u0574`;
        case "invalid_union":
          return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
        case "invalid_element":
          return `\u054D\u056D\u0561\u056C \u0561\u0580\u056A\u0565\u0584 ${withDefiniteArticle(issue2.origin)}-\u0578\u0582\u0574`;
        default:
          return `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574`;
      }
    };
  };
  function hy_default() {
    return {
      localeError: error20(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/id.js
  var error21 = () => {
    const Sizable = {
      string: { unit: "karakter", verb: "memiliki" },
      file: { unit: "byte", verb: "memiliki" },
      array: { unit: "item", verb: "memiliki" },
      set: { unit: "item", verb: "memiliki" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "input",
      email: "alamat email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "tanggal dan waktu format ISO",
      date: "tanggal format ISO",
      time: "jam format ISO",
      duration: "durasi format ISO",
      ipv4: "alamat IPv4",
      ipv6: "alamat IPv6",
      cidrv4: "rentang alamat IPv4",
      cidrv6: "rentang alamat IPv6",
      base64: "string dengan enkode base64",
      base64url: "string dengan enkode base64url",
      json_string: "string JSON",
      e164: "angka E.164",
      jwt: "JWT",
      template_literal: "input",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Input tidak valid: diharapkan instanceof ${issue2.expected}, diterima ${received}`;
          }
          return `Input tidak valid: diharapkan ${expected}, diterima ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Input tidak valid: diharapkan ${stringifyPrimitive(issue2.values[0])}`;
          return `Pilihan tidak valid: diharapkan salah satu dari ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Terlalu besar: diharapkan ${issue2.origin ?? "value"} memiliki ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemen"}`;
          return `Terlalu besar: diharapkan ${issue2.origin ?? "value"} menjadi ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Terlalu kecil: diharapkan ${issue2.origin} memiliki ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Terlalu kecil: diharapkan ${issue2.origin} menjadi ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `String tidak valid: harus menyertakan "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
          return `${FormatDictionary[_issue.format] ?? issue2.format} tidak valid`;
        }
        case "not_multiple_of":
          return `Angka tidak valid: harus kelipatan dari ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Kunci tidak dikenali ${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Kunci tidak valid di ${issue2.origin}`;
        case "invalid_union":
          return "Input tidak valid";
        case "invalid_element":
          return `Nilai tidak valid di ${issue2.origin}`;
        default:
          return `Input tidak valid`;
      }
    };
  };
  function id_default() {
    return {
      localeError: error21(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/is.js
  var error22 = () => {
    const Sizable = {
      string: { unit: "stafi", verb: "a\xF0 hafa" },
      file: { unit: "b\xE6ti", verb: "a\xF0 hafa" },
      array: { unit: "hluti", verb: "a\xF0 hafa" },
      set: { unit: "hluti", verb: "a\xF0 hafa" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "gildi",
      email: "netfang",
      url: "vefsl\xF3\xF0",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO dagsetning og t\xEDmi",
      date: "ISO dagsetning",
      time: "ISO t\xEDmi",
      duration: "ISO t\xEDmalengd",
      ipv4: "IPv4 address",
      ipv6: "IPv6 address",
      cidrv4: "IPv4 range",
      cidrv6: "IPv6 range",
      base64: "base64-encoded strengur",
      base64url: "base64url-encoded strengur",
      json_string: "JSON strengur",
      e164: "E.164 t\xF6lugildi",
      jwt: "JWT",
      template_literal: "gildi",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "n\xFAmer",
      array: "fylki",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Rangt gildi: \xDE\xFA sl\xF3st inn ${received} \xFEar sem \xE1 a\xF0 vera instanceof ${issue2.expected}`;
          }
          return `Rangt gildi: \xDE\xFA sl\xF3st inn ${received} \xFEar sem \xE1 a\xF0 vera ${expected}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Rangt gildi: gert r\xE1\xF0 fyrir ${stringifyPrimitive(issue2.values[0])}`;
          return `\xD3gilt val: m\xE1 vera eitt af eftirfarandi ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ${issue2.origin ?? "gildi"} hafi ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "hluti"}`;
          return `Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ${issue2.origin ?? "gildi"} s\xE9 ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ${issue2.origin} hafi ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ${issue2.origin} s\xE9 ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\xD3gildur strengur: ver\xF0ur a\xF0 byrja \xE1 "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `\xD3gildur strengur: ver\xF0ur a\xF0 enda \xE1 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\xD3gildur strengur: ver\xF0ur a\xF0 innihalda "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\xD3gildur strengur: ver\xF0ur a\xF0 fylgja mynstri ${_issue.pattern}`;
          return `Rangt ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `R\xF6ng tala: ver\xF0ur a\xF0 vera margfeldi af ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\xD3\xFEekkt ${issue2.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Rangur lykill \xED ${issue2.origin}`;
        case "invalid_union":
          return "Rangt gildi";
        case "invalid_element":
          return `Rangt gildi \xED ${issue2.origin}`;
        default:
          return `Rangt gildi`;
      }
    };
  };
  function is_default() {
    return {
      localeError: error22(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/it.js
  var error23 = () => {
    const Sizable = {
      string: { unit: "caratteri", verb: "avere" },
      file: { unit: "byte", verb: "avere" },
      array: { unit: "elementi", verb: "avere" },
      set: { unit: "elementi", verb: "avere" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "input",
      email: "indirizzo email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "data e ora ISO",
      date: "data ISO",
      time: "ora ISO",
      duration: "durata ISO",
      ipv4: "indirizzo IPv4",
      ipv6: "indirizzo IPv6",
      cidrv4: "intervallo IPv4",
      cidrv6: "intervallo IPv6",
      base64: "stringa codificata in base64",
      base64url: "URL codificata in base64",
      json_string: "stringa JSON",
      e164: "numero E.164",
      jwt: "JWT",
      template_literal: "input",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "numero",
      array: "vettore",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Input non valido: atteso instanceof ${issue2.expected}, ricevuto ${received}`;
          }
          return `Input non valido: atteso ${expected}, ricevuto ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Input non valido: atteso ${stringifyPrimitive(issue2.values[0])}`;
          return `Opzione non valida: atteso uno tra ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Troppo grande: ${issue2.origin ?? "valore"} deve avere ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementi"}`;
          return `Troppo grande: ${issue2.origin ?? "valore"} deve essere ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Troppo piccolo: ${issue2.origin} deve avere ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Troppo piccolo: ${issue2.origin} deve essere ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Stringa non valida: deve includere "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
          return `Input non valido: ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Numero non valido: deve essere un multiplo di ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Chiav${issue2.keys.length > 1 ? "i" : "e"} non riconosciut${issue2.keys.length > 1 ? "e" : "a"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Chiave non valida in ${issue2.origin}`;
        case "invalid_union":
          return "Input non valido";
        case "invalid_element":
          return `Valore non valido in ${issue2.origin}`;
        default:
          return `Input non valido`;
      }
    };
  };
  function it_default() {
    return {
      localeError: error23(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ja.js
  var error24 = () => {
    const Sizable = {
      string: { unit: "\u6587\u5B57", verb: "\u3067\u3042\u308B" },
      file: { unit: "\u30D0\u30A4\u30C8", verb: "\u3067\u3042\u308B" },
      array: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
      set: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u5165\u529B\u5024",
      email: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
      url: "URL",
      emoji: "\u7D75\u6587\u5B57",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO\u65E5\u6642",
      date: "ISO\u65E5\u4ED8",
      time: "ISO\u6642\u523B",
      duration: "ISO\u671F\u9593",
      ipv4: "IPv4\u30A2\u30C9\u30EC\u30B9",
      ipv6: "IPv6\u30A2\u30C9\u30EC\u30B9",
      cidrv4: "IPv4\u7BC4\u56F2",
      cidrv6: "IPv6\u7BC4\u56F2",
      base64: "base64\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
      base64url: "base64url\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
      json_string: "JSON\u6587\u5B57\u5217",
      e164: "E.164\u756A\u53F7",
      jwt: "JWT",
      template_literal: "\u5165\u529B\u5024",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u6570\u5024",
      array: "\u914D\u5217",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u7121\u52B9\u306A\u5165\u529B: instanceof ${issue2.expected}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${received}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F`;
          }
          return `\u7121\u52B9\u306A\u5165\u529B: ${expected}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${received}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u7121\u52B9\u306A\u5165\u529B: ${stringifyPrimitive(issue2.values[0])}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F`;
          return `\u7121\u52B9\u306A\u9078\u629E: ${joinValues(issue2.values, "\u3001")}\u306E\u3044\u305A\u308C\u304B\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
        case "too_big": {
          const adj = issue2.inclusive
            ? "\u4EE5\u4E0B\u3067\u3042\u308B"
            : "\u3088\u308A\u5C0F\u3055\u3044";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u5927\u304D\u3059\u304E\u308B\u5024: ${issue2.origin ?? "\u5024"}\u306F${issue2.maximum.toString()}${sizing.unit ?? "\u8981\u7D20"}${adj}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          return `\u5927\u304D\u3059\u304E\u308B\u5024: ${issue2.origin ?? "\u5024"}\u306F${issue2.maximum.toString()}${adj}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
        }
        case "too_small": {
          const adj = issue2.inclusive
            ? "\u4EE5\u4E0A\u3067\u3042\u308B"
            : "\u3088\u308A\u5927\u304D\u3044";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u5C0F\u3055\u3059\u304E\u308B\u5024: ${issue2.origin}\u306F${issue2.minimum.toString()}${sizing.unit}${adj}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          return `\u5C0F\u3055\u3059\u304E\u308B\u5024: ${issue2.origin}\u306F${issue2.minimum.toString()}${adj}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${_issue.prefix}"\u3067\u59CB\u307E\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          if (_issue.format === "ends_with")
            return `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${_issue.suffix}"\u3067\u7D42\u308F\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          if (_issue.format === "includes")
            return `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${_issue.includes}"\u3092\u542B\u3080\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          if (_issue.format === "regex")
            return `\u7121\u52B9\u306A\u6587\u5B57\u5217: \u30D1\u30BF\u30FC\u30F3${_issue.pattern}\u306B\u4E00\u81F4\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          return `\u7121\u52B9\u306A${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u7121\u52B9\u306A\u6570\u5024: ${issue2.divisor}\u306E\u500D\u6570\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
        case "unrecognized_keys":
          return `\u8A8D\u8B58\u3055\u308C\u3066\u3044\u306A\u3044\u30AD\u30FC${issue2.keys.length > 1 ? "\u7FA4" : ""}: ${joinValues(issue2.keys, "\u3001")}`;
        case "invalid_key":
          return `${issue2.origin}\u5185\u306E\u7121\u52B9\u306A\u30AD\u30FC`;
        case "invalid_union":
          return "\u7121\u52B9\u306A\u5165\u529B";
        case "invalid_element":
          return `${issue2.origin}\u5185\u306E\u7121\u52B9\u306A\u5024`;
        default:
          return `\u7121\u52B9\u306A\u5165\u529B`;
      }
    };
  };
  function ja_default() {
    return {
      localeError: error24(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ka.js
  var error25 = () => {
    const Sizable = {
      string: {
        unit: "\u10E1\u10D8\u10DB\u10D1\u10DD\u10DA\u10DD",
        verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
      },
      file: {
        unit: "\u10D1\u10D0\u10D8\u10E2\u10D8",
        verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
      },
      array: {
        unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8",
        verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
      },
      set: {
        unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8",
        verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0",
      email:
        "\u10D4\u10DA-\u10E4\u10DD\u10E1\u10E2\u10D8\u10E1 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
      url: "URL",
      emoji: "\u10D4\u10DB\u10DD\u10EF\u10D8",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8-\u10D3\u10E0\u10DD",
      date: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8",
      time: "\u10D3\u10E0\u10DD",
      duration: "\u10EE\u10D0\u10DC\u10D2\u10E0\u10EB\u10DA\u10D8\u10D5\u10DD\u10D1\u10D0",
      ipv4: "IPv4 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
      ipv6: "IPv6 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
      cidrv4: "IPv4 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
      cidrv6: "IPv6 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
      base64:
        "base64-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10D5\u10D4\u10DA\u10D8",
      base64url:
        "base64url-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10D5\u10D4\u10DA\u10D8",
      json_string: "JSON \u10D5\u10D4\u10DA\u10D8",
      e164: "E.164 \u10DC\u10DD\u10DB\u10D4\u10E0\u10D8",
      jwt: "JWT",
      template_literal: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u10E0\u10D8\u10EA\u10EE\u10D5\u10D8",
      string: "\u10D5\u10D4\u10DA\u10D8",
      boolean: "\u10D1\u10E3\u10DA\u10D4\u10D0\u10DC\u10D8",
      function: "\u10E4\u10E3\u10DC\u10E5\u10EA\u10D8\u10D0",
      array: "\u10DB\u10D0\u10E1\u10D8\u10D5\u10D8",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 instanceof ${issue2.expected}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${received}`;
          }
          return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${expected}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${stringifyPrimitive(issue2.values[0])}`;
          return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D0\u10E0\u10D8\u10D0\u10DC\u10E2\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8\u10D0 \u10D4\u10E0\u10D7-\u10D4\u10E0\u10D7\u10D8 ${joinValues(issue2.values, "|")}-\u10D3\u10D0\u10DC`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${issue2.origin ?? "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
          return `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${issue2.origin ?? "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0"} \u10D8\u10E7\u10DD\u10E1 ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${issue2.origin} \u10D8\u10E7\u10DD\u10E1 ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10EC\u10E7\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "${_issue.prefix}"-\u10D8\u10D7`;
          }
          if (_issue.format === "ends_with")
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10DB\u10D7\u10D0\u10D5\u10E0\u10D3\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "${_issue.suffix}"-\u10D8\u10D7`;
          if (_issue.format === "includes")
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1 "${_issue.includes}"-\u10E1`;
          if (_issue.format === "regex")
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D4\u10E1\u10D0\u10D1\u10D0\u10DB\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 \u10E8\u10D0\u10D1\u10DA\u10DD\u10DC\u10E1 ${_issue.pattern}`;
          return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E0\u10D8\u10EA\u10EE\u10D5\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10E7\u10DD\u10E1 ${issue2.divisor}-\u10D8\u10E1 \u10EF\u10D4\u10E0\u10D0\u10D3\u10D8`;
        case "unrecognized_keys":
          return `\u10E3\u10EA\u10DC\u10DD\u10D1\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1${issue2.keys.length > 1 ? "\u10D4\u10D1\u10D8" : "\u10D8"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1\u10D8 ${issue2.origin}-\u10E8\u10D8`;
        case "invalid_union":
          return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0";
        case "invalid_element":
          return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0 ${issue2.origin}-\u10E8\u10D8`;
        default:
          return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0`;
      }
    };
  };
  function ka_default() {
    return {
      localeError: error25(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/km.js
  var error26 = () => {
    const Sizable = {
      string: {
        unit: "\u178F\u17BD\u17A2\u1780\u17D2\u179F\u179A",
        verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
      },
      file: { unit: "\u1794\u17C3", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
      array: { unit: "\u1792\u17B6\u178F\u17BB", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
      set: { unit: "\u1792\u17B6\u178F\u17BB", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B",
      email:
        "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793\u17A2\u17CA\u17B8\u1798\u17C2\u179B",
      url: "URL",
      emoji: "\u179F\u1789\u17D2\u1789\u17B6\u17A2\u17B6\u179A\u1798\u17D2\u1798\u178E\u17CD",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 \u1793\u17B7\u1784\u1798\u17C9\u17C4\u1784 ISO",
      date: "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 ISO",
      time: "\u1798\u17C9\u17C4\u1784 ISO",
      duration: "\u179A\u1799\u17C8\u1796\u17C1\u179B ISO",
      ipv4: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
      ipv6: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
      cidrv4: "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
      cidrv6: "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
      base64:
        "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64",
      base64url:
        "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64url",
      json_string: "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A JSON",
      e164: "\u179B\u17C1\u1781 E.164",
      jwt: "JWT",
      template_literal:
        "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u179B\u17C1\u1781",
      array: "\u17A2\u17B6\u179A\u17C1 (Array)",
      null: "\u1782\u17D2\u1798\u17B6\u1793\u178F\u1798\u17D2\u179B\u17C3 (null)",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A instanceof ${issue2.expected} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${received}`;
          }
          return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${expected} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${stringifyPrimitive(issue2.values[0])}`;
          return `\u1787\u1798\u17D2\u179A\u17BE\u179F\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1787\u17B6\u1798\u17BD\u1799\u1780\u17D2\u1793\u17BB\u1784\u1785\u17C6\u178E\u17C4\u1798 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${issue2.origin ?? "\u178F\u1798\u17D2\u179B\u17C3"} ${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "\u1792\u17B6\u178F\u17BB"}`;
          return `\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${issue2.origin ?? "\u178F\u1798\u17D2\u179B\u17C3"} ${adj} ${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${issue2.origin} ${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${issue2.origin} ${adj} ${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798\u178A\u17C4\u1799 "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1794\u1789\u17D2\u1785\u1794\u17CB\u178A\u17C4\u1799 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1798\u17B6\u1793 "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1793\u17B9\u1784\u1791\u1798\u17D2\u179A\u1784\u17CB\u178A\u17C2\u179B\u1794\u17B6\u1793\u1780\u17C6\u178E\u178F\u17CB ${_issue.pattern}`;
          return `\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u179B\u17C1\u1781\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1787\u17B6\u1796\u17A0\u17BB\u1782\u17BB\u178E\u1793\u17C3 ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\u179A\u1780\u1783\u17BE\u1789\u179F\u17C4\u1798\u17B7\u1793\u179F\u17D2\u1782\u17B6\u179B\u17CB\u17D6 ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u179F\u17C4\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ${issue2.origin}`;
        case "invalid_union":
          return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C`;
        case "invalid_element":
          return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ${issue2.origin}`;
        default:
          return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C`;
      }
    };
  };
  function km_default() {
    return {
      localeError: error26(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/kh.js
  function kh_default() {
    return km_default();
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ko.js
  var error27 = () => {
    const Sizable = {
      string: { unit: "\uBB38\uC790", verb: "to have" },
      file: { unit: "\uBC14\uC774\uD2B8", verb: "to have" },
      array: { unit: "\uAC1C", verb: "to have" },
      set: { unit: "\uAC1C", verb: "to have" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\uC785\uB825",
      email: "\uC774\uBA54\uC77C \uC8FC\uC18C",
      url: "URL",
      emoji: "\uC774\uBAA8\uC9C0",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \uB0A0\uC9DC\uC2DC\uAC04",
      date: "ISO \uB0A0\uC9DC",
      time: "ISO \uC2DC\uAC04",
      duration: "ISO \uAE30\uAC04",
      ipv4: "IPv4 \uC8FC\uC18C",
      ipv6: "IPv6 \uC8FC\uC18C",
      cidrv4: "IPv4 \uBC94\uC704",
      cidrv6: "IPv6 \uBC94\uC704",
      base64: "base64 \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
      base64url: "base64url \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
      json_string: "JSON \uBB38\uC790\uC5F4",
      e164: "E.164 \uBC88\uD638",
      jwt: "JWT",
      template_literal: "\uC785\uB825",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 instanceof ${issue2.expected}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${received}\uC785\uB2C8\uB2E4`;
          }
          return `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 ${expected}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${received}\uC785\uB2C8\uB2E4`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\uC798\uBABB\uB41C \uC785\uB825: \uAC12\uC740 ${stringifyPrimitive(issue2.values[0])} \uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4`;
          return `\uC798\uBABB\uB41C \uC635\uC158: ${joinValues(issue2.values, "\uB610\uB294 ")} \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
        case "too_big": {
          const adj = issue2.inclusive ? "\uC774\uD558" : "\uBBF8\uB9CC";
          const suffix =
            adj === "\uBBF8\uB9CC"
              ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4"
              : "\uC5EC\uC57C \uD569\uB2C8\uB2E4";
          const sizing = getSizing(issue2.origin);
          const unit = sizing?.unit ?? "\uC694\uC18C";
          if (sizing)
            return `${issue2.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${issue2.maximum.toString()}${unit} ${adj}${suffix}`;
          return `${issue2.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${issue2.maximum.toString()} ${adj}${suffix}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? "\uC774\uC0C1" : "\uCD08\uACFC";
          const suffix =
            adj === "\uC774\uC0C1"
              ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4"
              : "\uC5EC\uC57C \uD569\uB2C8\uB2E4";
          const sizing = getSizing(issue2.origin);
          const unit = sizing?.unit ?? "\uC694\uC18C";
          if (sizing) {
            return `${issue2.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${issue2.minimum.toString()}${unit} ${adj}${suffix}`;
          }
          return `${issue2.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${issue2.minimum.toString()} ${adj}${suffix}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${_issue.prefix}"(\uC73C)\uB85C \uC2DC\uC791\uD574\uC57C \uD569\uB2C8\uB2E4`;
          }
          if (_issue.format === "ends_with")
            return `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${_issue.suffix}"(\uC73C)\uB85C \uB05D\uB098\uC57C \uD569\uB2C8\uB2E4`;
          if (_issue.format === "includes")
            return `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${_issue.includes}"\uC744(\uB97C) \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4`;
          if (_issue.format === "regex")
            return `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: \uC815\uADDC\uC2DD ${_issue.pattern} \uD328\uD134\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4`;
          return `\uC798\uBABB\uB41C ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\uC798\uBABB\uB41C \uC22B\uC790: ${issue2.divisor}\uC758 \uBC30\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
        case "unrecognized_keys":
          return `\uC778\uC2DD\uD560 \uC218 \uC5C6\uB294 \uD0A4: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\uC798\uBABB\uB41C \uD0A4: ${issue2.origin}`;
        case "invalid_union":
          return `\uC798\uBABB\uB41C \uC785\uB825`;
        case "invalid_element":
          return `\uC798\uBABB\uB41C \uAC12: ${issue2.origin}`;
        default:
          return `\uC798\uBABB\uB41C \uC785\uB825`;
      }
    };
  };
  function ko_default() {
    return {
      localeError: error27(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/lt.js
  var capitalizeFirstCharacter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  function getUnitTypeFromNumber(number4) {
    const abs = Math.abs(number4);
    const last = abs % 10;
    const last2 = abs % 100;
    if ((last2 >= 11 && last2 <= 19) || last === 0) return "many";
    if (last === 1) return "one";
    return "few";
  }
  var error28 = () => {
    const Sizable = {
      string: {
        unit: {
          one: "simbolis",
          few: "simboliai",
          many: "simboli\u0173",
        },
        verb: {
          smaller: {
            inclusive: "turi b\u016Bti ne ilgesn\u0117 kaip",
            notInclusive: "turi b\u016Bti trumpesn\u0117 kaip",
          },
          bigger: {
            inclusive: "turi b\u016Bti ne trumpesn\u0117 kaip",
            notInclusive: "turi b\u016Bti ilgesn\u0117 kaip",
          },
        },
      },
      file: {
        unit: {
          one: "baitas",
          few: "baitai",
          many: "bait\u0173",
        },
        verb: {
          smaller: {
            inclusive: "turi b\u016Bti ne didesnis kaip",
            notInclusive: "turi b\u016Bti ma\u017Eesnis kaip",
          },
          bigger: {
            inclusive: "turi b\u016Bti ne ma\u017Eesnis kaip",
            notInclusive: "turi b\u016Bti didesnis kaip",
          },
        },
      },
      array: {
        unit: {
          one: "element\u0105",
          few: "elementus",
          many: "element\u0173",
        },
        verb: {
          smaller: {
            inclusive: "turi tur\u0117ti ne daugiau kaip",
            notInclusive: "turi tur\u0117ti ma\u017Eiau kaip",
          },
          bigger: {
            inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
            notInclusive: "turi tur\u0117ti daugiau kaip",
          },
        },
      },
      set: {
        unit: {
          one: "element\u0105",
          few: "elementus",
          many: "element\u0173",
        },
        verb: {
          smaller: {
            inclusive: "turi tur\u0117ti ne daugiau kaip",
            notInclusive: "turi tur\u0117ti ma\u017Eiau kaip",
          },
          bigger: {
            inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
            notInclusive: "turi tur\u0117ti daugiau kaip",
          },
        },
      },
    };
    function getSizing(origin, unitType, inclusive, targetShouldBe) {
      const result = Sizable[origin] ?? null;
      if (result === null) return result;
      return {
        unit: result.unit[unitType],
        verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"],
      };
    }
    const FormatDictionary = {
      regex: "\u012Fvestis",
      email: "el. pa\u0161to adresas",
      url: "URL",
      emoji: "jaustukas",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO data ir laikas",
      date: "ISO data",
      time: "ISO laikas",
      duration: "ISO trukm\u0117",
      ipv4: "IPv4 adresas",
      ipv6: "IPv6 adresas",
      cidrv4: "IPv4 tinklo prefiksas (CIDR)",
      cidrv6: "IPv6 tinklo prefiksas (CIDR)",
      base64: "base64 u\u017Ekoduota eilut\u0117",
      base64url: "base64url u\u017Ekoduota eilut\u0117",
      json_string: "JSON eilut\u0117",
      e164: "E.164 numeris",
      jwt: "JWT",
      template_literal: "\u012Fvestis",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "skai\u010Dius",
      bigint: "sveikasis skai\u010Dius",
      string: "eilut\u0117",
      boolean: "login\u0117 reik\u0161m\u0117",
      undefined: "neapibr\u0117\u017Eta reik\u0161m\u0117",
      function: "funkcija",
      symbol: "simbolis",
      array: "masyvas",
      object: "objektas",
      null: "nulin\u0117 reik\u0161m\u0117",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Gautas tipas ${received}, o tik\u0117tasi - instanceof ${issue2.expected}`;
          }
          return `Gautas tipas ${received}, o tik\u0117tasi - ${expected}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Privalo b\u016Bti ${stringifyPrimitive(issue2.values[0])}`;
          return `Privalo b\u016Bti vienas i\u0161 ${joinValues(issue2.values, "|")} pasirinkim\u0173`;
        case "too_big": {
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          const sizing = getSizing(
            issue2.origin,
            getUnitTypeFromNumber(Number(issue2.maximum)),
            issue2.inclusive ?? false,
            "smaller",
          );
          if (sizing?.verb)
            return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reik\u0161m\u0117")} ${sizing.verb} ${issue2.maximum.toString()} ${sizing.unit ?? "element\u0173"}`;
          const adj = issue2.inclusive ? "ne didesnis kaip" : "ma\u017Eesnis kaip";
          return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${adj} ${issue2.maximum.toString()} ${sizing?.unit}`;
        }
        case "too_small": {
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          const sizing = getSizing(
            issue2.origin,
            getUnitTypeFromNumber(Number(issue2.minimum)),
            issue2.inclusive ?? false,
            "bigger",
          );
          if (sizing?.verb)
            return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reik\u0161m\u0117")} ${sizing.verb} ${issue2.minimum.toString()} ${sizing.unit ?? "element\u0173"}`;
          const adj = issue2.inclusive ? "ne ma\u017Eesnis kaip" : "didesnis kaip";
          return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${adj} ${issue2.minimum.toString()} ${sizing?.unit}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `Eilut\u0117 privalo prasid\u0117ti "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `Eilut\u0117 privalo pasibaigti "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Eilut\u0117 privalo \u012Ftraukti "${_issue.includes}"`;
          if (_issue.format === "regex") return `Eilut\u0117 privalo atitikti ${_issue.pattern}`;
          return `Neteisingas ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Skai\u010Dius privalo b\u016Bti ${issue2.divisor} kartotinis.`;
        case "unrecognized_keys":
          return `Neatpa\u017Eint${issue2.keys.length > 1 ? "i" : "as"} rakt${issue2.keys.length > 1 ? "ai" : "as"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return "Rastas klaidingas raktas";
        case "invalid_union":
          return "Klaidinga \u012Fvestis";
        case "invalid_element": {
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          return `${capitalizeFirstCharacter(origin ?? issue2.origin ?? "reik\u0161m\u0117")} turi klaiding\u0105 \u012Fvest\u012F`;
        }
        default:
          return "Klaidinga \u012Fvestis";
      }
    };
  };
  function lt_default() {
    return {
      localeError: error28(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/mk.js
  var error29 = () => {
    const Sizable = {
      string: {
        unit: "\u0437\u043D\u0430\u0446\u0438",
        verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
      },
      file: {
        unit: "\u0431\u0430\u0458\u0442\u0438",
        verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
      },
      array: {
        unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
        verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
      },
      set: {
        unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
        verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0432\u043D\u0435\u0441",
      email:
        "\u0430\u0434\u0440\u0435\u0441\u0430 \u043D\u0430 \u0435-\u043F\u043E\u0448\u0442\u0430",
      url: "URL",
      emoji: "\u0435\u043C\u043E\u045F\u0438",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0434\u0430\u0442\u0443\u043C \u0438 \u0432\u0440\u0435\u043C\u0435",
      date: "ISO \u0434\u0430\u0442\u0443\u043C",
      time: "ISO \u0432\u0440\u0435\u043C\u0435",
      duration: "ISO \u0432\u0440\u0435\u043C\u0435\u0442\u0440\u0430\u0435\u045A\u0435",
      ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441\u0430",
      ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441\u0430",
      cidrv4: "IPv4 \u043E\u043F\u0441\u0435\u0433",
      cidrv6: "IPv6 \u043E\u043F\u0441\u0435\u0433",
      base64:
        "base64-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
      base64url:
        "base64url-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
      json_string: "JSON \u043D\u0438\u0437\u0430",
      e164: "E.164 \u0431\u0440\u043E\u0458",
      jwt: "JWT",
      template_literal: "\u0432\u043D\u0435\u0441",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0431\u0440\u043E\u0458",
      array: "\u043D\u0438\u0437\u0430",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 instanceof ${issue2.expected}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${received}`;
          }
          return `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${expected}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
          return `\u0413\u0440\u0435\u0448\u0430\u043D\u0430 \u043E\u043F\u0446\u0438\u0458\u0430: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 \u0435\u0434\u043D\u0430 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${issue2.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0438\u043C\u0430 ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0438"}`;
          return `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${issue2.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0431\u0438\u0434\u0435 ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${issue2.origin} \u0434\u0430 \u0438\u043C\u0430 ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${issue2.origin} \u0434\u0430 \u0431\u0438\u0434\u0435 ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u043D\u0443\u0432\u0430 \u0441\u043E "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u0432\u0440\u0448\u0443\u0432\u0430 \u0441\u043E "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0432\u043A\u043B\u0443\u0447\u0443\u0432\u0430 "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u043E\u0434\u0433\u043E\u0430\u0440\u0430 \u043D\u0430 \u043F\u0430\u0442\u0435\u0440\u043D\u043E\u0442 ${_issue.pattern}`;
          return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u0413\u0440\u0435\u0448\u0435\u043D \u0431\u0440\u043E\u0458: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0431\u0438\u0434\u0435 \u0434\u0435\u043B\u0438\u0432 \u0441\u043E ${issue2.divisor}`;
        case "unrecognized_keys":
          return `${issue2.keys.length > 1 ? "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D\u0438 \u043A\u043B\u0443\u0447\u0435\u0432\u0438" : "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D \u043A\u043B\u0443\u0447"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u0413\u0440\u0435\u0448\u0435\u043D \u043A\u043B\u0443\u0447 \u0432\u043E ${issue2.origin}`;
        case "invalid_union":
          return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
        case "invalid_element":
          return `\u0413\u0440\u0435\u0448\u043D\u0430 \u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442 \u0432\u043E ${issue2.origin}`;
        default:
          return `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441`;
      }
    };
  };
  function mk_default() {
    return {
      localeError: error29(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ms.js
  var error30 = () => {
    const Sizable = {
      string: { unit: "aksara", verb: "mempunyai" },
      file: { unit: "bait", verb: "mempunyai" },
      array: { unit: "elemen", verb: "mempunyai" },
      set: { unit: "elemen", verb: "mempunyai" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "input",
      email: "alamat e-mel",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "tarikh masa ISO",
      date: "tarikh ISO",
      time: "masa ISO",
      duration: "tempoh ISO",
      ipv4: "alamat IPv4",
      ipv6: "alamat IPv6",
      cidrv4: "julat IPv4",
      cidrv6: "julat IPv6",
      base64: "string dikodkan base64",
      base64url: "string dikodkan base64url",
      json_string: "string JSON",
      e164: "nombor E.164",
      jwt: "JWT",
      template_literal: "input",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "nombor",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Input tidak sah: dijangka instanceof ${issue2.expected}, diterima ${received}`;
          }
          return `Input tidak sah: dijangka ${expected}, diterima ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Input tidak sah: dijangka ${stringifyPrimitive(issue2.values[0])}`;
          return `Pilihan tidak sah: dijangka salah satu daripada ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Terlalu besar: dijangka ${issue2.origin ?? "nilai"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemen"}`;
          return `Terlalu besar: dijangka ${issue2.origin ?? "nilai"} adalah ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Terlalu kecil: dijangka ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Terlalu kecil: dijangka ${issue2.origin} adalah ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
          return `${FormatDictionary[_issue.format] ?? issue2.format} tidak sah`;
        }
        case "not_multiple_of":
          return `Nombor tidak sah: perlu gandaan ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Kunci tidak dikenali: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Kunci tidak sah dalam ${issue2.origin}`;
        case "invalid_union":
          return "Input tidak sah";
        case "invalid_element":
          return `Nilai tidak sah dalam ${issue2.origin}`;
        default:
          return `Input tidak sah`;
      }
    };
  };
  function ms_default() {
    return {
      localeError: error30(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/nl.js
  var error31 = () => {
    const Sizable = {
      string: { unit: "tekens", verb: "heeft" },
      file: { unit: "bytes", verb: "heeft" },
      array: { unit: "elementen", verb: "heeft" },
      set: { unit: "elementen", verb: "heeft" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "invoer",
      email: "emailadres",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datum en tijd",
      date: "ISO datum",
      time: "ISO tijd",
      duration: "ISO duur",
      ipv4: "IPv4-adres",
      ipv6: "IPv6-adres",
      cidrv4: "IPv4-bereik",
      cidrv6: "IPv6-bereik",
      base64: "base64-gecodeerde tekst",
      base64url: "base64 URL-gecodeerde tekst",
      json_string: "JSON string",
      e164: "E.164-nummer",
      jwt: "JWT",
      template_literal: "invoer",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "getal",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Ongeldige invoer: verwacht instanceof ${issue2.expected}, ontving ${received}`;
          }
          return `Ongeldige invoer: verwacht ${expected}, ontving ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Ongeldige invoer: verwacht ${stringifyPrimitive(issue2.values[0])}`;
          return `Ongeldige optie: verwacht \xE9\xE9n van ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          const longName =
            issue2.origin === "date" ? "laat" : issue2.origin === "string" ? "lang" : "groot";
          if (sizing)
            return `Te ${longName}: verwacht dat ${issue2.origin ?? "waarde"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementen"} ${sizing.verb}`;
          return `Te ${longName}: verwacht dat ${issue2.origin ?? "waarde"} ${adj}${issue2.maximum.toString()} is`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          const shortName =
            issue2.origin === "date" ? "vroeg" : issue2.origin === "string" ? "kort" : "klein";
          if (sizing) {
            return `Te ${shortName}: verwacht dat ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
          }
          return `Te ${shortName}: verwacht dat ${issue2.origin} ${adj}${issue2.minimum.toString()} is`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
          }
          if (_issue.format === "ends_with")
            return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
          if (_issue.format === "includes")
            return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
          if (_issue.format === "regex")
            return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
          return `Ongeldig: ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Ongeldig getal: moet een veelvoud van ${issue2.divisor} zijn`;
        case "unrecognized_keys":
          return `Onbekende key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Ongeldige key in ${issue2.origin}`;
        case "invalid_union":
          return "Ongeldige invoer";
        case "invalid_element":
          return `Ongeldige waarde in ${issue2.origin}`;
        default:
          return `Ongeldige invoer`;
      }
    };
  };
  function nl_default() {
    return {
      localeError: error31(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/no.js
  var error32 = () => {
    const Sizable = {
      string: { unit: "tegn", verb: "\xE5 ha" },
      file: { unit: "bytes", verb: "\xE5 ha" },
      array: { unit: "elementer", verb: "\xE5 inneholde" },
      set: { unit: "elementer", verb: "\xE5 inneholde" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "input",
      email: "e-postadresse",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO dato- og klokkeslett",
      date: "ISO-dato",
      time: "ISO-klokkeslett",
      duration: "ISO-varighet",
      ipv4: "IPv4-omr\xE5de",
      ipv6: "IPv6-omr\xE5de",
      cidrv4: "IPv4-spekter",
      cidrv6: "IPv6-spekter",
      base64: "base64-enkodet streng",
      base64url: "base64url-enkodet streng",
      json_string: "JSON-streng",
      e164: "E.164-nummer",
      jwt: "JWT",
      template_literal: "input",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "tall",
      array: "liste",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Ugyldig input: forventet instanceof ${issue2.expected}, fikk ${received}`;
          }
          return `Ugyldig input: forventet ${expected}, fikk ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Ugyldig verdi: forventet ${stringifyPrimitive(issue2.values[0])}`;
          return `Ugyldig valg: forventet en av ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `For stor(t): forventet ${issue2.origin ?? "value"} til \xE5 ha ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementer"}`;
          return `For stor(t): forventet ${issue2.origin ?? "value"} til \xE5 ha ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `For lite(n): forventet ${issue2.origin} til \xE5 ha ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `For lite(n): forventet ${issue2.origin} til \xE5 ha ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Ugyldig streng: m\xE5 starte med "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Ugyldig streng: m\xE5 ende med "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Ugyldig streng: m\xE5 inneholde "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Ugyldig streng: m\xE5 matche m\xF8nsteret ${_issue.pattern}`;
          return `Ugyldig ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Ugyldig tall: m\xE5 v\xE6re et multiplum av ${issue2.divisor}`;
        case "unrecognized_keys":
          return `${issue2.keys.length > 1 ? "Ukjente n\xF8kler" : "Ukjent n\xF8kkel"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Ugyldig n\xF8kkel i ${issue2.origin}`;
        case "invalid_union":
          return "Ugyldig input";
        case "invalid_element":
          return `Ugyldig verdi i ${issue2.origin}`;
        default:
          return `Ugyldig input`;
      }
    };
  };
  function no_default() {
    return {
      localeError: error32(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ota.js
  var error33 = () => {
    const Sizable = {
      string: { unit: "harf", verb: "olmal\u0131d\u0131r" },
      file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
      array: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
      set: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "giren",
      email: "epostag\xE2h",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO heng\xE2m\u0131",
      date: "ISO tarihi",
      time: "ISO zaman\u0131",
      duration: "ISO m\xFCddeti",
      ipv4: "IPv4 ni\u015F\xE2n\u0131",
      ipv6: "IPv6 ni\u015F\xE2n\u0131",
      cidrv4: "IPv4 menzili",
      cidrv6: "IPv6 menzili",
      base64: "base64-\u015Fifreli metin",
      base64url: "base64url-\u015Fifreli metin",
      json_string: "JSON metin",
      e164: "E.164 say\u0131s\u0131",
      jwt: "JWT",
      template_literal: "giren",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "numara",
      array: "saf",
      null: "gayb",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `F\xE2sit giren: umulan instanceof ${issue2.expected}, al\u0131nan ${received}`;
          }
          return `F\xE2sit giren: umulan ${expected}, al\u0131nan ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `F\xE2sit giren: umulan ${stringifyPrimitive(issue2.values[0])}`;
          return `F\xE2sit tercih: m\xFBteberler ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Fazla b\xFCy\xFCk: ${issue2.origin ?? "value"}, ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmal\u0131yd\u0131.`;
          return `Fazla b\xFCy\xFCk: ${issue2.origin ?? "value"}, ${adj}${issue2.maximum.toString()} olmal\u0131yd\u0131.`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Fazla k\xFC\xE7\xFCk: ${issue2.origin}, ${adj}${issue2.minimum.toString()} ${sizing.unit} sahip olmal\u0131yd\u0131.`;
          }
          return `Fazla k\xFC\xE7\xFCk: ${issue2.origin}, ${adj}${issue2.minimum.toString()} olmal\u0131yd\u0131.`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `F\xE2sit metin: "${_issue.prefix}" ile ba\u015Flamal\u0131.`;
          if (_issue.format === "ends_with")
            return `F\xE2sit metin: "${_issue.suffix}" ile bitmeli.`;
          if (_issue.format === "includes")
            return `F\xE2sit metin: "${_issue.includes}" ihtiv\xE2 etmeli.`;
          if (_issue.format === "regex")
            return `F\xE2sit metin: ${_issue.pattern} nak\u015F\u0131na uymal\u0131.`;
          return `F\xE2sit ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `F\xE2sit say\u0131: ${issue2.divisor} kat\u0131 olmal\u0131yd\u0131.`;
        case "unrecognized_keys":
          return `Tan\u0131nmayan anahtar ${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `${issue2.origin} i\xE7in tan\u0131nmayan anahtar var.`;
        case "invalid_union":
          return "Giren tan\u0131namad\u0131.";
        case "invalid_element":
          return `${issue2.origin} i\xE7in tan\u0131nmayan k\u0131ymet var.`;
        default:
          return `K\u0131ymet tan\u0131namad\u0131.`;
      }
    };
  };
  function ota_default() {
    return {
      localeError: error33(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ps.js
  var error34 = () => {
    const Sizable = {
      string: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
      file: { unit: "\u0628\u0627\u06CC\u067C\u0633", verb: "\u0648\u0644\u0631\u064A" },
      array: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
      set: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0648\u0631\u0648\u062F\u064A",
      email: "\u0628\u0631\u06CC\u069A\u0646\u0627\u0644\u06CC\u06A9",
      url: "\u06CC\u0648 \u0622\u0631 \u0627\u0644",
      emoji: "\u0627\u06CC\u0645\u0648\u062C\u064A",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "\u0646\u06CC\u067C\u0647 \u0627\u0648 \u0648\u062E\u062A",
      date: "\u0646\u06D0\u067C\u0647",
      time: "\u0648\u062E\u062A",
      duration: "\u0645\u0648\u062F\u0647",
      ipv4: "\u062F IPv4 \u067E\u062A\u0647",
      ipv6: "\u062F IPv6 \u067E\u062A\u0647",
      cidrv4: "\u062F IPv4 \u0633\u0627\u062D\u0647",
      cidrv6: "\u062F IPv6 \u0633\u0627\u062D\u0647",
      base64: "base64-encoded \u0645\u062A\u0646",
      base64url: "base64url-encoded \u0645\u062A\u0646",
      json_string: "JSON \u0645\u062A\u0646",
      e164: "\u062F E.164 \u0634\u0645\u06D0\u0631\u0647",
      jwt: "JWT",
      template_literal: "\u0648\u0631\u0648\u062F\u064A",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0639\u062F\u062F",
      array: "\u0627\u0631\u06D0",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F instanceof ${issue2.expected} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${received} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`;
          }
          return `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${expected} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${received} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`;
        }
        case "invalid_value":
          if (issue2.values.length === 1) {
            return `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${stringifyPrimitive(issue2.values[0])} \u0648\u0627\u06CC`;
          }
          return `\u0646\u0627\u0633\u0645 \u0627\u0646\u062A\u062E\u0627\u0628: \u0628\u0627\u06CC\u062F \u06CC\u0648 \u0644\u0647 ${joinValues(issue2.values, "|")} \u0685\u062E\u0647 \u0648\u0627\u06CC`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${issue2.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u0639\u0646\u0635\u0631\u0648\u0646\u0647"} \u0648\u0644\u0631\u064A`;
          }
          return `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${issue2.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${adj}${issue2.maximum.toString()} \u0648\u064A`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${issue2.origin} \u0628\u0627\u06CC\u062F ${adj}${issue2.minimum.toString()} ${sizing.unit} \u0648\u0644\u0631\u064A`;
          }
          return `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${issue2.origin} \u0628\u0627\u06CC\u062F ${adj}${issue2.minimum.toString()} \u0648\u064A`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${_issue.prefix}" \u0633\u0631\u0647 \u067E\u06CC\u0644 \u0634\u064A`;
          }
          if (_issue.format === "ends_with") {
            return `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${_issue.suffix}" \u0633\u0631\u0647 \u067E\u0627\u06CC \u062A\u0647 \u0648\u0631\u0633\u064A\u0696\u064A`;
          }
          if (_issue.format === "includes") {
            return `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F "${_issue.includes}" \u0648\u0644\u0631\u064A`;
          }
          if (_issue.format === "regex") {
            return `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F ${_issue.pattern} \u0633\u0631\u0647 \u0645\u0637\u0627\u0628\u0642\u062A \u0648\u0644\u0631\u064A`;
          }
          return `${FormatDictionary[_issue.format] ?? issue2.format} \u0646\u0627\u0633\u0645 \u062F\u06CC`;
        }
        case "not_multiple_of":
          return `\u0646\u0627\u0633\u0645 \u0639\u062F\u062F: \u0628\u0627\u06CC\u062F \u062F ${issue2.divisor} \u0645\u0636\u0631\u0628 \u0648\u064A`;
        case "unrecognized_keys":
          return `\u0646\u0627\u0633\u0645 ${issue2.keys.length > 1 ? "\u06A9\u0644\u06CC\u0689\u0648\u0646\u0647" : "\u06A9\u0644\u06CC\u0689"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u0646\u0627\u0633\u0645 \u06A9\u0644\u06CC\u0689 \u067E\u0647 ${issue2.origin} \u06A9\u06D0`;
        case "invalid_union":
          return `\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A`;
        case "invalid_element":
          return `\u0646\u0627\u0633\u0645 \u0639\u0646\u0635\u0631 \u067E\u0647 ${issue2.origin} \u06A9\u06D0`;
        default:
          return `\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A`;
      }
    };
  };
  function ps_default() {
    return {
      localeError: error34(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/pl.js
  var error35 = () => {
    const Sizable = {
      string: { unit: "znak\xF3w", verb: "mie\u0107" },
      file: { unit: "bajt\xF3w", verb: "mie\u0107" },
      array: { unit: "element\xF3w", verb: "mie\u0107" },
      set: { unit: "element\xF3w", verb: "mie\u0107" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "wyra\u017Cenie",
      email: "adres email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "data i godzina w formacie ISO",
      date: "data w formacie ISO",
      time: "godzina w formacie ISO",
      duration: "czas trwania ISO",
      ipv4: "adres IPv4",
      ipv6: "adres IPv6",
      cidrv4: "zakres IPv4",
      cidrv6: "zakres IPv6",
      base64: "ci\u0105g znak\xF3w zakodowany w formacie base64",
      base64url: "ci\u0105g znak\xF3w zakodowany w formacie base64url",
      json_string: "ci\u0105g znak\xF3w w formacie JSON",
      e164: "liczba E.164",
      jwt: "JWT",
      template_literal: "wej\u015Bcie",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "liczba",
      array: "tablica",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano instanceof ${issue2.expected}, otrzymano ${received}`;
          }
          return `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${expected}, otrzymano ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${stringifyPrimitive(issue2.values[0])}`;
          return `Nieprawid\u0142owa opcja: oczekiwano jednej z warto\u015Bci ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Za du\u017Ca warto\u015B\u0107: oczekiwano, \u017Ce ${issue2.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element\xF3w"}`;
          }
          return `Zbyt du\u017C(y/a/e): oczekiwano, \u017Ce ${issue2.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Za ma\u0142a warto\u015B\u0107: oczekiwano, \u017Ce ${issue2.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${adj}${issue2.minimum.toString()} ${sizing.unit ?? "element\xF3w"}`;
          }
          return `Zbyt ma\u0142(y/a/e): oczekiwano, \u017Ce ${issue2.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zaczyna\u0107 si\u0119 od "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi ko\u0144czy\u0107 si\u0119 na "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zawiera\u0107 "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi odpowiada\u0107 wzorcowi ${_issue.pattern}`;
          return `Nieprawid\u0142ow(y/a/e) ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Nieprawid\u0142owa liczba: musi by\u0107 wielokrotno\u015Bci\u0105 ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Nierozpoznane klucze${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Nieprawid\u0142owy klucz w ${issue2.origin}`;
        case "invalid_union":
          return "Nieprawid\u0142owe dane wej\u015Bciowe";
        case "invalid_element":
          return `Nieprawid\u0142owa warto\u015B\u0107 w ${issue2.origin}`;
        default:
          return `Nieprawid\u0142owe dane wej\u015Bciowe`;
      }
    };
  };
  function pl_default() {
    return {
      localeError: error35(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/pt.js
  var error36 = () => {
    const Sizable = {
      string: { unit: "caracteres", verb: "ter" },
      file: { unit: "bytes", verb: "ter" },
      array: { unit: "itens", verb: "ter" },
      set: { unit: "itens", verb: "ter" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "padr\xE3o",
      email: "endere\xE7o de e-mail",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "data e hora ISO",
      date: "data ISO",
      time: "hora ISO",
      duration: "dura\xE7\xE3o ISO",
      ipv4: "endere\xE7o IPv4",
      ipv6: "endere\xE7o IPv6",
      cidrv4: "faixa de IPv4",
      cidrv6: "faixa de IPv6",
      base64: "texto codificado em base64",
      base64url: "URL codificada em base64",
      json_string: "texto JSON",
      e164: "n\xFAmero E.164",
      jwt: "JWT",
      template_literal: "entrada",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "n\xFAmero",
      null: "nulo",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Tipo inv\xE1lido: esperado instanceof ${issue2.expected}, recebido ${received}`;
          }
          return `Tipo inv\xE1lido: esperado ${expected}, recebido ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Entrada inv\xE1lida: esperado ${stringifyPrimitive(issue2.values[0])}`;
          return `Op\xE7\xE3o inv\xE1lida: esperada uma das ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Muito grande: esperado que ${issue2.origin ?? "valor"} tivesse ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementos"}`;
          return `Muito grande: esperado que ${issue2.origin ?? "valor"} fosse ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Muito pequeno: esperado que ${issue2.origin} tivesse ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Muito pequeno: esperado que ${issue2.origin} fosse ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Texto inv\xE1lido: deve come\xE7ar com "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Texto inv\xE1lido: deve terminar com "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Texto inv\xE1lido: deve incluir "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Texto inv\xE1lido: deve corresponder ao padr\xE3o ${_issue.pattern}`;
          return `${FormatDictionary[_issue.format] ?? issue2.format} inv\xE1lido`;
        }
        case "not_multiple_of":
          return `N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Chave${issue2.keys.length > 1 ? "s" : ""} desconhecida${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Chave inv\xE1lida em ${issue2.origin}`;
        case "invalid_union":
          return "Entrada inv\xE1lida";
        case "invalid_element":
          return `Valor inv\xE1lido em ${issue2.origin}`;
        default:
          return `Campo inv\xE1lido`;
      }
    };
  };
  function pt_default() {
    return {
      localeError: error36(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ro.js
  var error37 = () => {
    const Sizable = {
      string: { unit: "caractere", verb: "s\u0103 aib\u0103" },
      file: { unit: "octe\u021Bi", verb: "s\u0103 aib\u0103" },
      array: { unit: "elemente", verb: "s\u0103 aib\u0103" },
      set: { unit: "elemente", verb: "s\u0103 aib\u0103" },
      map: { unit: "intr\u0103ri", verb: "s\u0103 aib\u0103" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "intrare",
      email: "adres\u0103 de email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "dat\u0103 \u0219i or\u0103 ISO",
      date: "dat\u0103 ISO",
      time: "or\u0103 ISO",
      duration: "durat\u0103 ISO",
      ipv4: "adres\u0103 IPv4",
      ipv6: "adres\u0103 IPv6",
      mac: "adres\u0103 MAC",
      cidrv4: "interval IPv4",
      cidrv6: "interval IPv6",
      base64: "\u0219ir codat base64",
      base64url: "\u0219ir codat base64url",
      json_string: "\u0219ir JSON",
      e164: "num\u0103r E.164",
      jwt: "JWT",
      template_literal: "intrare",
    };
    const TypeDictionary = {
      nan: "NaN",
      string: "\u0219ir",
      number: "num\u0103r",
      boolean: "boolean",
      function: "func\u021Bie",
      array: "matrice",
      object: "obiect",
      undefined: "nedefinit",
      symbol: "simbol",
      bigint: "num\u0103r mare",
      void: "void",
      never: "never",
      map: "hart\u0103",
      set: "set",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          return `Intrare invalid\u0103: a\u0219teptat ${expected}, primit ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Intrare invalid\u0103: a\u0219teptat ${stringifyPrimitive(issue2.values[0])}`;
          return `Op\u021Biune invalid\u0103: a\u0219teptat una dintre ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Prea mare: a\u0219teptat ca ${issue2.origin ?? "valoarea"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemente"}`;
          return `Prea mare: a\u0219teptat ca ${issue2.origin ?? "valoarea"} s\u0103 fie ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Prea mic: a\u0219teptat ca ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Prea mic: a\u0219teptat ca ${issue2.origin} s\u0103 fie ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u0218ir invalid: trebuie s\u0103 \xEEnceap\u0103 cu "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `\u0218ir invalid: trebuie s\u0103 se termine cu "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u0218ir invalid: trebuie s\u0103 includ\u0103 "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u0218ir invalid: trebuie s\u0103 se potriveasc\u0103 cu modelul ${_issue.pattern}`;
          return `Format invalid: ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Num\u0103r invalid: trebuie s\u0103 fie multiplu de ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Chei nerecunoscute: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Cheie invalid\u0103 \xEEn ${issue2.origin}`;
        case "invalid_union":
          return "Intrare invalid\u0103";
        case "invalid_element":
          return `Valoare invalid\u0103 \xEEn ${issue2.origin}`;
        default:
          return `Intrare invalid\u0103`;
      }
    };
  };
  function ro_default() {
    return {
      localeError: error37(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ru.js
  function getRussianPlural(count, one, few, many) {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return many;
    }
    if (lastDigit === 1) {
      return one;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return few;
    }
    return many;
  }
  var error38 = () => {
    const Sizable = {
      string: {
        unit: {
          one: "\u0441\u0438\u043C\u0432\u043E\u043B",
          few: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
          many: "\u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
        },
        verb: "\u0438\u043C\u0435\u0442\u044C",
      },
      file: {
        unit: {
          one: "\u0431\u0430\u0439\u0442",
          few: "\u0431\u0430\u0439\u0442\u0430",
          many: "\u0431\u0430\u0439\u0442",
        },
        verb: "\u0438\u043C\u0435\u0442\u044C",
      },
      array: {
        unit: {
          one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
          few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
          many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
        },
        verb: "\u0438\u043C\u0435\u0442\u044C",
      },
      set: {
        unit: {
          one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
          few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
          many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
        },
        verb: "\u0438\u043C\u0435\u0442\u044C",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0432\u0432\u043E\u0434",
      email: "email \u0430\u0434\u0440\u0435\u0441",
      url: "URL",
      emoji: "\u044D\u043C\u043E\u0434\u0437\u0438",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F",
      date: "ISO \u0434\u0430\u0442\u0430",
      time: "ISO \u0432\u0440\u0435\u043C\u044F",
      duration: "ISO \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
      ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
      ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
      cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
      base64:
        "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64",
      base64url:
        "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64url",
      json_string: "JSON \u0441\u0442\u0440\u043E\u043A\u0430",
      e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
      jwt: "JWT",
      template_literal: "\u0432\u0432\u043E\u0434",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0447\u0438\u0441\u043B\u043E",
      array: "\u043C\u0430\u0441\u0441\u0438\u0432",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C instanceof ${issue2.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${received}`;
          }
          return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${stringifyPrimitive(issue2.values[0])}`;
          return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0434\u043D\u043E \u0438\u0437 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            const maxValue = Number(issue2.maximum);
            const unit = getRussianPlural(
              maxValue,
              sizing.unit.one,
              sizing.unit.few,
              sizing.unit.many,
            );
            return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${issue2.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${adj}${issue2.maximum.toString()} ${unit}`;
          }
          return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${issue2.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            const minValue = Number(issue2.minimum);
            const unit = getRussianPlural(
              minValue,
              sizing.unit.one,
              sizing.unit.few,
              sizing.unit.many,
            );
            return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${issue2.origin} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${adj}${issue2.minimum.toString()} ${unit}`;
          }
          return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${issue2.origin} \u0431\u0443\u0434\u0435\u0442 ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C\u0441\u044F \u0441 "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${_issue.pattern}`;
          return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E: \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\u041D\u0435\u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D${issue2.keys.length > 1 ? "\u044B\u0435" : "\u044B\u0439"} \u043A\u043B\u044E\u0447${issue2.keys.length > 1 ? "\u0438" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043B\u044E\u0447 \u0432 ${issue2.origin}`;
        case "invalid_union":
          return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
        case "invalid_element":
          return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 ${issue2.origin}`;
        default:
          return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435`;
      }
    };
  };
  function ru_default() {
    return {
      localeError: error38(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/sl.js
  var error39 = () => {
    const Sizable = {
      string: { unit: "znakov", verb: "imeti" },
      file: { unit: "bajtov", verb: "imeti" },
      array: { unit: "elementov", verb: "imeti" },
      set: { unit: "elementov", verb: "imeti" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "vnos",
      email: "e-po\u0161tni naslov",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO datum in \u010Das",
      date: "ISO datum",
      time: "ISO \u010Das",
      duration: "ISO trajanje",
      ipv4: "IPv4 naslov",
      ipv6: "IPv6 naslov",
      cidrv4: "obseg IPv4",
      cidrv6: "obseg IPv6",
      base64: "base64 kodiran niz",
      base64url: "base64url kodiran niz",
      json_string: "JSON niz",
      e164: "E.164 \u0161tevilka",
      jwt: "JWT",
      template_literal: "vnos",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0161tevilo",
      array: "tabela",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Neveljaven vnos: pri\u010Dakovano instanceof ${issue2.expected}, prejeto ${received}`;
          }
          return `Neveljaven vnos: pri\u010Dakovano ${expected}, prejeto ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Neveljaven vnos: pri\u010Dakovano ${stringifyPrimitive(issue2.values[0])}`;
          return `Neveljavna mo\u017Enost: pri\u010Dakovano eno izmed ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Preveliko: pri\u010Dakovano, da bo ${issue2.origin ?? "vrednost"} imelo ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elementov"}`;
          return `Preveliko: pri\u010Dakovano, da bo ${issue2.origin ?? "vrednost"} ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Premajhno: pri\u010Dakovano, da bo ${issue2.origin} imelo ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Premajhno: pri\u010Dakovano, da bo ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `Neveljaven niz: mora se za\u010Deti z "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `Neveljaven niz: mora se kon\u010Dati z "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
          return `Neveljaven ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Neveljavno \u0161tevilo: mora biti ve\u010Dkratnik ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Neprepoznan${issue2.keys.length > 1 ? "i klju\u010Di" : " klju\u010D"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Neveljaven klju\u010D v ${issue2.origin}`;
        case "invalid_union":
          return "Neveljaven vnos";
        case "invalid_element":
          return `Neveljavna vrednost v ${issue2.origin}`;
        default:
          return "Neveljaven vnos";
      }
    };
  };
  function sl_default() {
    return {
      localeError: error39(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/sv.js
  var error40 = () => {
    const Sizable = {
      string: { unit: "tecken", verb: "att ha" },
      file: { unit: "bytes", verb: "att ha" },
      array: { unit: "objekt", verb: "att inneh\xE5lla" },
      set: { unit: "objekt", verb: "att inneh\xE5lla" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "regulj\xE4rt uttryck",
      email: "e-postadress",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO-datum och tid",
      date: "ISO-datum",
      time: "ISO-tid",
      duration: "ISO-varaktighet",
      ipv4: "IPv4-intervall",
      ipv6: "IPv6-intervall",
      cidrv4: "IPv4-spektrum",
      cidrv6: "IPv6-spektrum",
      base64: "base64-kodad str\xE4ng",
      base64url: "base64url-kodad str\xE4ng",
      json_string: "JSON-str\xE4ng",
      e164: "E.164-nummer",
      jwt: "JWT",
      template_literal: "mall-literal",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "antal",
      array: "lista",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Ogiltig inmatning: f\xF6rv\xE4ntat instanceof ${issue2.expected}, fick ${received}`;
          }
          return `Ogiltig inmatning: f\xF6rv\xE4ntat ${expected}, fick ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Ogiltig inmatning: f\xF6rv\xE4ntat ${stringifyPrimitive(issue2.values[0])}`;
          return `Ogiltigt val: f\xF6rv\xE4ntade en av ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `F\xF6r stor(t): f\xF6rv\xE4ntade ${issue2.origin ?? "v\xE4rdet"} att ha ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "element"}`;
          }
          return `F\xF6r stor(t): f\xF6rv\xE4ntat ${issue2.origin ?? "v\xE4rdet"} att ha ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `F\xF6r lite(t): f\xF6rv\xE4ntade ${issue2.origin ?? "v\xE4rdet"} att ha ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `F\xF6r lite(t): f\xF6rv\xE4ntade ${issue2.origin ?? "v\xE4rdet"} att ha ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `Ogiltig str\xE4ng: m\xE5ste b\xF6rja med "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `Ogiltig str\xE4ng: m\xE5ste sluta med "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Ogiltig str\xE4ng: m\xE5ste inneh\xE5lla "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Ogiltig str\xE4ng: m\xE5ste matcha m\xF6nstret "${_issue.pattern}"`;
          return `Ogiltig(t) ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Ogiltigt tal: m\xE5ste vara en multipel av ${issue2.divisor}`;
        case "unrecognized_keys":
          return `${issue2.keys.length > 1 ? "Ok\xE4nda nycklar" : "Ok\xE4nd nyckel"}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Ogiltig nyckel i ${issue2.origin ?? "v\xE4rdet"}`;
        case "invalid_union":
          return "Ogiltig input";
        case "invalid_element":
          return `Ogiltigt v\xE4rde i ${issue2.origin ?? "v\xE4rdet"}`;
        default:
          return `Ogiltig input`;
      }
    };
  };
  function sv_default() {
    return {
      localeError: error40(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ta.js
  var error41 = () => {
    const Sizable = {
      string: {
        unit: "\u0B8E\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
        verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
      },
      file: {
        unit: "\u0BAA\u0BC8\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD",
        verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
      },
      array: {
        unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
        verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
      },
      set: {
        unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
        verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1",
      email:
        "\u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u0BA4\u0BC7\u0BA4\u0BBF \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
      date: "ISO \u0BA4\u0BC7\u0BA4\u0BBF",
      time: "ISO \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
      duration: "ISO \u0B95\u0BBE\u0BB2 \u0B85\u0BB3\u0BB5\u0BC1",
      ipv4: "IPv4 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
      ipv6: "IPv6 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
      cidrv4: "IPv4 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
      cidrv6: "IPv6 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
      base64: "base64-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
      base64url: "base64url-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
      json_string: "JSON \u0B9A\u0BB0\u0BAE\u0BCD",
      e164: "E.164 \u0B8E\u0BA3\u0BCD",
      jwt: "JWT",
      template_literal: "input",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0B8E\u0BA3\u0BCD",
      array: "\u0B85\u0BA3\u0BBF",
      null: "\u0BB5\u0BC6\u0BB1\u0BC1\u0BAE\u0BC8",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 instanceof ${issue2.expected}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${received}`;
          }
          return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${expected}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${stringifyPrimitive(issue2.values[0])}`;
          return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${joinValues(issue2.values, "|")} \u0B87\u0BB2\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${issue2.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD"} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          }
          return `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${issue2.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${adj}${issue2.maximum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          }
          return `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${issue2.origin} ${adj}${issue2.minimum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${_issue.prefix}" \u0B87\u0BB2\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          if (_issue.format === "ends_with")
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${_issue.suffix}" \u0B87\u0BB2\u0BCD \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0B9F\u0BC8\u0BAF \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          if (_issue.format === "includes")
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${_issue.includes}" \u0B90 \u0B89\u0BB3\u0BCD\u0BB3\u0B9F\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          if (_issue.format === "regex")
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: ${_issue.pattern} \u0BAE\u0BC1\u0BB1\u0BC8\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1\u0B9F\u0BA9\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B8E\u0BA3\u0BCD: ${issue2.divisor} \u0B87\u0BA9\u0BCD \u0BAA\u0BB2\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
        case "unrecognized_keys":
          return `\u0B85\u0B9F\u0BC8\u0BAF\u0BBE\u0BB3\u0BAE\u0BCD \u0BA4\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BA4 \u0BB5\u0BBF\u0B9A\u0BC8${issue2.keys.length > 1 ? "\u0B95\u0BB3\u0BCD" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `${issue2.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0B9A\u0BC8`;
        case "invalid_union":
          return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
        case "invalid_element":
          return `${issue2.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1`;
        default:
          return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1`;
      }
    };
  };
  function ta_default() {
    return {
      localeError: error41(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/th.js
  var error42 = () => {
    const Sizable = {
      string: {
        unit: "\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23",
        verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
      },
      file: { unit: "\u0E44\u0E1A\u0E15\u0E4C", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
      array: {
        unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
        verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
      },
      set: { unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
      email: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E2D\u0E35\u0E40\u0E21\u0E25",
      url: "URL",
      emoji: "\u0E2D\u0E34\u0E42\u0E21\u0E08\u0E34",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime:
        "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
      date: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E1A\u0E1A ISO",
      time: "\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
      duration: "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
      ipv4: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv4",
      ipv6: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv6",
      cidrv4: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv4",
      cidrv6: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv6",
      base64: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64",
      base64url:
        "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A URL",
      json_string: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A JSON",
      e164: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28 (E.164)",
      jwt: "\u0E42\u0E17\u0E40\u0E04\u0E19 JWT",
      template_literal:
        "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02",
      array: "\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C (Array)",
      null: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32 (null)",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 instanceof ${issue2.expected} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${received}`;
          }
          return `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${expected} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u0E04\u0E48\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${stringifyPrimitive(issue2.values[0])}`;
          return `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive
            ? "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19"
            : "\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${issue2.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${adj} ${issue2.maximum.toString()} ${sizing.unit ?? "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"}`;
          return `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${issue2.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${adj} ${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive
            ? "\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22"
            : "\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${issue2.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${adj} ${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${issue2.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${adj} ${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with")
            return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E25\u0E07\u0E17\u0E49\u0E32\u0E22\u0E14\u0E49\u0E27\u0E22 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 "${_issue.includes}" \u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21`;
          if (_issue.format === "regex")
            return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 ${_issue.pattern}`;
          return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E2B\u0E32\u0E23\u0E14\u0E49\u0E27\u0E22 ${issue2.divisor} \u0E44\u0E14\u0E49\u0E25\u0E07\u0E15\u0E31\u0E27`;
        case "unrecognized_keys":
          return `\u0E1E\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u0E04\u0E35\u0E22\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${issue2.origin}`;
        case "invalid_union":
          return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E22\u0E39\u0E40\u0E19\u0E35\u0E22\u0E19\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49";
        case "invalid_element":
          return `\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${issue2.origin}`;
        default:
          return `\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07`;
      }
    };
  };
  function th_default() {
    return {
      localeError: error42(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/tr.js
  var error43 = () => {
    const Sizable = {
      string: { unit: "karakter", verb: "olmal\u0131" },
      file: { unit: "bayt", verb: "olmal\u0131" },
      array: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
      set: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "girdi",
      email: "e-posta adresi",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO tarih ve saat",
      date: "ISO tarih",
      time: "ISO saat",
      duration: "ISO s\xFCre",
      ipv4: "IPv4 adresi",
      ipv6: "IPv6 adresi",
      cidrv4: "IPv4 aral\u0131\u011F\u0131",
      cidrv6: "IPv6 aral\u0131\u011F\u0131",
      base64: "base64 ile \u015Fifrelenmi\u015F metin",
      base64url: "base64url ile \u015Fifrelenmi\u015F metin",
      json_string: "JSON dizesi",
      e164: "E.164 say\u0131s\u0131",
      jwt: "JWT",
      template_literal: "\u015Eablon dizesi",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Ge\xE7ersiz de\u011Fer: beklenen instanceof ${issue2.expected}, al\u0131nan ${received}`;
          }
          return `Ge\xE7ersiz de\u011Fer: beklenen ${expected}, al\u0131nan ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Ge\xE7ersiz de\u011Fer: beklenen ${stringifyPrimitive(issue2.values[0])}`;
          return `Ge\xE7ersiz se\xE7enek: a\u015Fa\u011F\u0131dakilerden biri olmal\u0131: ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\xC7ok b\xFCy\xFCk: beklenen ${issue2.origin ?? "de\u011Fer"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\xF6\u011Fe"}`;
          return `\xC7ok b\xFCy\xFCk: beklenen ${issue2.origin ?? "de\u011Fer"} ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\xC7ok k\xFC\xE7\xFCk: beklenen ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          return `\xC7ok k\xFC\xE7\xFCk: beklenen ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Ge\xE7ersiz metin: "${_issue.prefix}" ile ba\u015Flamal\u0131`;
          if (_issue.format === "ends_with")
            return `Ge\xE7ersiz metin: "${_issue.suffix}" ile bitmeli`;
          if (_issue.format === "includes")
            return `Ge\xE7ersiz metin: "${_issue.includes}" i\xE7ermeli`;
          if (_issue.format === "regex")
            return `Ge\xE7ersiz metin: ${_issue.pattern} desenine uymal\u0131`;
          return `Ge\xE7ersiz ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Ge\xE7ersiz say\u0131: ${issue2.divisor} ile tam b\xF6l\xFCnebilmeli`;
        case "unrecognized_keys":
          return `Tan\u0131nmayan anahtar${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `${issue2.origin} i\xE7inde ge\xE7ersiz anahtar`;
        case "invalid_union":
          return "Ge\xE7ersiz de\u011Fer";
        case "invalid_element":
          return `${issue2.origin} i\xE7inde ge\xE7ersiz de\u011Fer`;
        default:
          return `Ge\xE7ersiz de\u011Fer`;
      }
    };
  };
  function tr_default() {
    return {
      localeError: error43(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/uk.js
  var error44 = () => {
    const Sizable = {
      string: {
        unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432",
        verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
      },
      file: {
        unit: "\u0431\u0430\u0439\u0442\u0456\u0432",
        verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
      },
      array: {
        unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
        verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
      },
      set: {
        unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
        verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
      },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
      email:
        "\u0430\u0434\u0440\u0435\u0441\u0430 \u0435\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0457 \u043F\u043E\u0448\u0442\u0438",
      url: "URL",
      emoji: "\u0435\u043C\u043E\u0434\u0437\u0456",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "\u0434\u0430\u0442\u0430 \u0442\u0430 \u0447\u0430\u0441 ISO",
      date: "\u0434\u0430\u0442\u0430 ISO",
      time: "\u0447\u0430\u0441 ISO",
      duration: "\u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C ISO",
      ipv4: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv4",
      ipv6: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv6",
      cidrv4: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv4",
      cidrv6: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv6",
      base64:
        "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64",
      base64url:
        "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64url",
      json_string: "\u0440\u044F\u0434\u043E\u043A JSON",
      e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
      jwt: "JWT",
      template_literal: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0447\u0438\u0441\u043B\u043E",
      array: "\u043C\u0430\u0441\u0438\u0432",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F instanceof ${issue2.expected}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${received}`;
          }
          return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${expected}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${stringifyPrimitive(issue2.values[0])}`;
          return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430 \u043E\u043F\u0446\u0456\u044F: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u043D\u0435 \u0437 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${issue2.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432"}`;
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${issue2.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} \u0431\u0443\u0434\u0435 ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${issue2.origin} \u0431\u0443\u0434\u0435 ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438\u0441\u044F \u0437 "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0437\u0430\u043A\u0456\u043D\u0447\u0443\u0432\u0430\u0442\u0438\u0441\u044F \u043D\u0430 "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043C\u0456\u0441\u0442\u0438\u0442\u0438 "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${_issue.pattern}`;
          return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0447\u0438\u0441\u043B\u043E: \u043F\u043E\u0432\u0438\u043D\u043D\u043E \u0431\u0443\u0442\u0438 \u043A\u0440\u0430\u0442\u043D\u0438\u043C ${issue2.divisor}`;
        case "unrecognized_keys":
          return `\u041D\u0435\u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u043D\u0438\u0439 \u043A\u043B\u044E\u0447${issue2.keys.length > 1 ? "\u0456" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u043A\u043B\u044E\u0447 \u0443 ${issue2.origin}`;
        case "invalid_union":
          return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
        case "invalid_element":
          return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0443 ${issue2.origin}`;
        default:
          return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456`;
      }
    };
  };
  function uk_default() {
    return {
      localeError: error44(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ua.js
  function ua_default() {
    return uk_default();
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/ur.js
  var error45 = () => {
    const Sizable = {
      string: { unit: "\u062D\u0631\u0648\u0641", verb: "\u06C1\u0648\u0646\u0627" },
      file: { unit: "\u0628\u0627\u0626\u0679\u0633", verb: "\u06C1\u0648\u0646\u0627" },
      array: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" },
      set: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0627\u0646 \u067E\u0679",
      email: "\u0627\u06CC \u0645\u06CC\u0644 \u0627\u06CC\u0688\u0631\u06CC\u0633",
      url: "\u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644",
      emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
      uuid: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      uuidv4: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 4",
      uuidv6: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 6",
      nanoid: "\u0646\u06CC\u0646\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      guid: "\u062C\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      cuid: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      cuid2: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC 2",
      ulid: "\u06CC\u0648 \u0627\u06CC\u0644 \u0622\u0626\u06CC \u0688\u06CC",
      xid: "\u0627\u06CC\u06A9\u0633 \u0622\u0626\u06CC \u0688\u06CC",
      ksuid: "\u06A9\u06D2 \u0627\u06CC\u0633 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
      datetime:
        "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0688\u06CC\u0679 \u0679\u0627\u0626\u0645",
      date: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u062A\u0627\u0631\u06CC\u062E",
      time: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0648\u0642\u062A",
      duration: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0645\u062F\u062A",
      ipv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0627\u06CC\u0688\u0631\u06CC\u0633",
      ipv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0627\u06CC\u0688\u0631\u06CC\u0633",
      cidrv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0631\u06CC\u0646\u062C",
      cidrv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0631\u06CC\u0646\u062C",
      base64:
        "\u0628\u06CC\u0633 64 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
      base64url:
        "\u0628\u06CC\u0633 64 \u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
      json_string:
        "\u062C\u06D2 \u0627\u06CC\u0633 \u0627\u0648 \u0627\u06CC\u0646 \u0633\u0679\u0631\u0646\u06AF",
      e164: "\u0627\u06CC 164 \u0646\u0645\u0628\u0631",
      jwt: "\u062C\u06D2 \u0688\u0628\u0644\u06CC\u0648 \u0679\u06CC",
      template_literal: "\u0627\u0646 \u067E\u0679",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u0646\u0645\u0628\u0631",
      array: "\u0622\u0631\u06D2",
      null: "\u0646\u0644",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: instanceof ${issue2.expected} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${received} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`;
          }
          return `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${expected} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${received} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${stringifyPrimitive(issue2.values[0])} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
          return `\u063A\u0644\u0637 \u0622\u067E\u0634\u0646: ${joinValues(issue2.values, "|")} \u0645\u06CC\u06BA \u0633\u06D2 \u0627\u06CC\u06A9 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u0628\u06C1\u062A \u0628\u0691\u0627: ${issue2.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u06D2 ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u0639\u0646\u0627\u0635\u0631"} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2`;
          return `\u0628\u06C1\u062A \u0628\u0691\u0627: ${issue2.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u0627 ${adj}${issue2.maximum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${issue2.origin} \u06A9\u06D2 ${adj}${issue2.minimum.toString()} ${sizing.unit} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2`;
          }
          return `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${issue2.origin} \u06A9\u0627 ${adj}${issue2.minimum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${_issue.prefix}" \u0633\u06D2 \u0634\u0631\u0648\u0639 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
          }
          if (_issue.format === "ends_with")
            return `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${_issue.suffix}" \u067E\u0631 \u062E\u062A\u0645 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
          if (_issue.format === "includes")
            return `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${_issue.includes}" \u0634\u0627\u0645\u0644 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
          if (_issue.format === "regex")
            return `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: \u067E\u06CC\u0679\u0631\u0646 ${_issue.pattern} \u0633\u06D2 \u0645\u06CC\u0686 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
          return `\u063A\u0644\u0637 ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u063A\u0644\u0637 \u0646\u0645\u0628\u0631: ${issue2.divisor} \u06A9\u0627 \u0645\u0636\u0627\u0639\u0641 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
        case "unrecognized_keys":
          return `\u063A\u06CC\u0631 \u062A\u0633\u0644\u06CC\u0645 \u0634\u062F\u06C1 \u06A9\u06CC${issue2.keys.length > 1 ? "\u0632" : ""}: ${joinValues(issue2.keys, "\u060C ")}`;
        case "invalid_key":
          return `${issue2.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u06A9\u06CC`;
        case "invalid_union":
          return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
        case "invalid_element":
          return `${issue2.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u0648\u06CC\u0644\u06CC\u0648`;
        default:
          return `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679`;
      }
    };
  };
  function ur_default() {
    return {
      localeError: error45(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/uz.js
  var error46 = () => {
    const Sizable = {
      string: { unit: "belgi", verb: "bo\u2018lishi kerak" },
      file: { unit: "bayt", verb: "bo\u2018lishi kerak" },
      array: { unit: "element", verb: "bo\u2018lishi kerak" },
      set: { unit: "element", verb: "bo\u2018lishi kerak" },
      map: { unit: "yozuv", verb: "bo\u2018lishi kerak" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "kirish",
      email: "elektron pochta manzili",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO sana va vaqti",
      date: "ISO sana",
      time: "ISO vaqt",
      duration: "ISO davomiylik",
      ipv4: "IPv4 manzil",
      ipv6: "IPv6 manzil",
      mac: "MAC manzil",
      cidrv4: "IPv4 diapazon",
      cidrv6: "IPv6 diapazon",
      base64: "base64 kodlangan satr",
      base64url: "base64url kodlangan satr",
      json_string: "JSON satr",
      e164: "E.164 raqam",
      jwt: "JWT",
      template_literal: "kirish",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "raqam",
      array: "massiv",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Noto\u2018g\u2018ri kirish: kutilgan instanceof ${issue2.expected}, qabul qilingan ${received}`;
          }
          return `Noto\u2018g\u2018ri kirish: kutilgan ${expected}, qabul qilingan ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `Noto\u2018g\u2018ri kirish: kutilgan ${stringifyPrimitive(issue2.values[0])}`;
          return `Noto\u2018g\u2018ri variant: quyidagilardan biri kutilgan ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Juda katta: kutilgan ${issue2.origin ?? "qiymat"} ${adj}${issue2.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
          return `Juda katta: kutilgan ${issue2.origin ?? "qiymat"} ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Juda kichik: kutilgan ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
          }
          return `Juda kichik: kutilgan ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Noto\u2018g\u2018ri satr: "${_issue.prefix}" bilan boshlanishi kerak`;
          if (_issue.format === "ends_with")
            return `Noto\u2018g\u2018ri satr: "${_issue.suffix}" bilan tugashi kerak`;
          if (_issue.format === "includes")
            return `Noto\u2018g\u2018ri satr: "${_issue.includes}" ni o\u2018z ichiga olishi kerak`;
          if (_issue.format === "regex")
            return `Noto\u2018g\u2018ri satr: ${_issue.pattern} shabloniga mos kelishi kerak`;
          return `Noto\u2018g\u2018ri ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `Noto\u2018g\u2018ri raqam: ${issue2.divisor} ning karralisi bo\u2018lishi kerak`;
        case "unrecognized_keys":
          return `Noma\u2019lum kalit${issue2.keys.length > 1 ? "lar" : ""}: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `${issue2.origin} dagi kalit noto\u2018g\u2018ri`;
        case "invalid_union":
          return "Noto\u2018g\u2018ri kirish";
        case "invalid_element":
          return `${issue2.origin} da noto\u2018g\u2018ri qiymat`;
        default:
          return `Noto\u2018g\u2018ri kirish`;
      }
    };
  };
  function uz_default() {
    return {
      localeError: error46(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/vi.js
  var error47 = () => {
    const Sizable = {
      string: { unit: "k\xFD t\u1EF1", verb: "c\xF3" },
      file: { unit: "byte", verb: "c\xF3" },
      array: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
      set: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u0111\u1EA7u v\xE0o",
      email: "\u0111\u1ECBa ch\u1EC9 email",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ng\xE0y gi\u1EDD ISO",
      date: "ng\xE0y ISO",
      time: "gi\u1EDD ISO",
      duration: "kho\u1EA3ng th\u1EDDi gian ISO",
      ipv4: "\u0111\u1ECBa ch\u1EC9 IPv4",
      ipv6: "\u0111\u1ECBa ch\u1EC9 IPv6",
      cidrv4: "d\u1EA3i IPv4",
      cidrv6: "d\u1EA3i IPv6",
      base64: "chu\u1ED7i m\xE3 h\xF3a base64",
      base64url: "chu\u1ED7i m\xE3 h\xF3a base64url",
      json_string: "chu\u1ED7i JSON",
      e164: "s\u1ED1 E.164",
      jwt: "JWT",
      template_literal: "\u0111\u1EA7u v\xE0o",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "s\u1ED1",
      array: "m\u1EA3ng",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i instanceof ${issue2.expected}, nh\u1EADn \u0111\u01B0\u1EE3c ${received}`;
          }
          return `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${expected}, nh\u1EADn \u0111\u01B0\u1EE3c ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${stringifyPrimitive(issue2.values[0])}`;
          return `T\xF9y ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i m\u1ED9t trong c\xE1c gi\xE1 tr\u1ECB ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${issue2.origin ?? "gi\xE1 tr\u1ECB"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "ph\u1EA7n t\u1EED"}`;
          return `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${issue2.origin ?? "gi\xE1 tr\u1ECB"} ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i b\u1EAFt \u0111\u1EA7u b\u1EB1ng "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i k\u1EBFt th\xFAc b\u1EB1ng "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i bao g\u1ED3m "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i kh\u1EDBp v\u1EDBi m\u1EABu ${_issue.pattern}`;
          return `${FormatDictionary[_issue.format] ?? issue2.format} kh\xF4ng h\u1EE3p l\u1EC7`;
        }
        case "not_multiple_of":
          return `S\u1ED1 kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i l\xE0 b\u1ED9i s\u1ED1 c\u1EE7a ${issue2.divisor}`;
        case "unrecognized_keys":
          return `Kh\xF3a kh\xF4ng \u0111\u01B0\u1EE3c nh\u1EADn d\u1EA1ng: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `Kh\xF3a kh\xF4ng h\u1EE3p l\u1EC7 trong ${issue2.origin}`;
        case "invalid_union":
          return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
        case "invalid_element":
          return `Gi\xE1 tr\u1ECB kh\xF4ng h\u1EE3p l\u1EC7 trong ${issue2.origin}`;
        default:
          return `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7`;
      }
    };
  };
  function vi_default() {
    return {
      localeError: error47(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/zh-CN.js
  var error48 = () => {
    const Sizable = {
      string: { unit: "\u5B57\u7B26", verb: "\u5305\u542B" },
      file: { unit: "\u5B57\u8282", verb: "\u5305\u542B" },
      array: { unit: "\u9879", verb: "\u5305\u542B" },
      set: { unit: "\u9879", verb: "\u5305\u542B" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u8F93\u5165",
      email: "\u7535\u5B50\u90AE\u4EF6",
      url: "URL",
      emoji: "\u8868\u60C5\u7B26\u53F7",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO\u65E5\u671F\u65F6\u95F4",
      date: "ISO\u65E5\u671F",
      time: "ISO\u65F6\u95F4",
      duration: "ISO\u65F6\u957F",
      ipv4: "IPv4\u5730\u5740",
      ipv6: "IPv6\u5730\u5740",
      cidrv4: "IPv4\u7F51\u6BB5",
      cidrv6: "IPv6\u7F51\u6BB5",
      base64: "base64\u7F16\u7801\u5B57\u7B26\u4E32",
      base64url: "base64url\u7F16\u7801\u5B57\u7B26\u4E32",
      json_string: "JSON\u5B57\u7B26\u4E32",
      e164: "E.164\u53F7\u7801",
      jwt: "JWT",
      template_literal: "\u8F93\u5165",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "\u6570\u5B57",
      array: "\u6570\u7EC4",
      null: "\u7A7A\u503C(null)",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B instanceof ${issue2.expected}\uFF0C\u5B9E\u9645\u63A5\u6536 ${received}`;
          }
          return `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${expected}\uFF0C\u5B9E\u9645\u63A5\u6536 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${stringifyPrimitive(issue2.values[0])}`;
          return `\u65E0\u6548\u9009\u9879\uFF1A\u671F\u671B\u4EE5\u4E0B\u4E4B\u4E00 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${issue2.origin ?? "\u503C"} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u4E2A\u5143\u7D20"}`;
          return `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${issue2.origin ?? "\u503C"} ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${issue2.origin} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${issue2.origin} ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${_issue.prefix}" \u5F00\u5934`;
          if (_issue.format === "ends_with")
            return `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${_issue.suffix}" \u7ED3\u5C3E`;
          if (_issue.format === "includes")
            return `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u5305\u542B "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u6EE1\u8DB3\u6B63\u5219\u8868\u8FBE\u5F0F ${_issue.pattern}`;
          return `\u65E0\u6548${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u65E0\u6548\u6570\u5B57\uFF1A\u5FC5\u987B\u662F ${issue2.divisor} \u7684\u500D\u6570`;
        case "unrecognized_keys":
          return `\u51FA\u73B0\u672A\u77E5\u7684\u952E(key): ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `${issue2.origin} \u4E2D\u7684\u952E(key)\u65E0\u6548`;
        case "invalid_union":
          return "\u65E0\u6548\u8F93\u5165";
        case "invalid_element":
          return `${issue2.origin} \u4E2D\u5305\u542B\u65E0\u6548\u503C(value)`;
        default:
          return `\u65E0\u6548\u8F93\u5165`;
      }
    };
  };
  function zh_CN_default() {
    return {
      localeError: error48(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/zh-TW.js
  var error49 = () => {
    const Sizable = {
      string: { unit: "\u5B57\u5143", verb: "\u64C1\u6709" },
      file: { unit: "\u4F4D\u5143\u7D44", verb: "\u64C1\u6709" },
      array: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
      set: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u8F38\u5165",
      email: "\u90F5\u4EF6\u5730\u5740",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "ISO \u65E5\u671F\u6642\u9593",
      date: "ISO \u65E5\u671F",
      time: "ISO \u6642\u9593",
      duration: "ISO \u671F\u9593",
      ipv4: "IPv4 \u4F4D\u5740",
      ipv6: "IPv6 \u4F4D\u5740",
      cidrv4: "IPv4 \u7BC4\u570D",
      cidrv6: "IPv6 \u7BC4\u570D",
      base64: "base64 \u7DE8\u78BC\u5B57\u4E32",
      base64url: "base64url \u7DE8\u78BC\u5B57\u4E32",
      json_string: "JSON \u5B57\u4E32",
      e164: "E.164 \u6578\u503C",
      jwt: "JWT",
      template_literal: "\u8F38\u5165",
    };
    const TypeDictionary = {
      nan: "NaN",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA instanceof ${issue2.expected}\uFF0C\u4F46\u6536\u5230 ${received}`;
          }
          return `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${expected}\uFF0C\u4F46\u6536\u5230 ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${stringifyPrimitive(issue2.values[0])}`;
          return `\u7121\u6548\u7684\u9078\u9805\uFF1A\u9810\u671F\u70BA\u4EE5\u4E0B\u5176\u4E2D\u4E4B\u4E00 ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${issue2.origin ?? "\u503C"} \u61C9\u70BA ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "\u500B\u5143\u7D20"}`;
          return `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${issue2.origin ?? "\u503C"} \u61C9\u70BA ${adj}${issue2.maximum.toString()}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${issue2.origin} \u61C9\u70BA ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${issue2.origin} \u61C9\u70BA ${adj}${issue2.minimum.toString()}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${_issue.prefix}" \u958B\u982D`;
          }
          if (_issue.format === "ends_with")
            return `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${_issue.suffix}" \u7D50\u5C3E`;
          if (_issue.format === "includes")
            return `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u5305\u542B "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u7B26\u5408\u683C\u5F0F ${_issue.pattern}`;
          return `\u7121\u6548\u7684 ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `\u7121\u6548\u7684\u6578\u5B57\uFF1A\u5FC5\u9808\u70BA ${issue2.divisor} \u7684\u500D\u6578`;
        case "unrecognized_keys":
          return `\u7121\u6CD5\u8B58\u5225\u7684\u9375\u503C${issue2.keys.length > 1 ? "\u5011" : ""}\uFF1A${joinValues(issue2.keys, "\u3001")}`;
        case "invalid_key":
          return `${issue2.origin} \u4E2D\u6709\u7121\u6548\u7684\u9375\u503C`;
        case "invalid_union":
          return "\u7121\u6548\u7684\u8F38\u5165\u503C";
        case "invalid_element":
          return `${issue2.origin} \u4E2D\u6709\u7121\u6548\u7684\u503C`;
        default:
          return `\u7121\u6548\u7684\u8F38\u5165\u503C`;
      }
    };
  };
  function zh_TW_default() {
    return {
      localeError: error49(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/locales/yo.js
  var error50 = () => {
    const Sizable = {
      string: { unit: "\xE0mi", verb: "n\xED" },
      file: { unit: "bytes", verb: "n\xED" },
      array: { unit: "nkan", verb: "n\xED" },
      set: { unit: "nkan", verb: "n\xED" },
    };
    function getSizing(origin) {
      return Sizable[origin] ?? null;
    }
    const FormatDictionary = {
      regex: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
      email: "\xE0d\xEDr\u1EB9\u0301s\xEC \xECm\u1EB9\u0301l\xEC",
      url: "URL",
      emoji: "emoji",
      uuid: "UUID",
      uuidv4: "UUIDv4",
      uuidv6: "UUIDv6",
      nanoid: "nanoid",
      guid: "GUID",
      cuid: "cuid",
      cuid2: "cuid2",
      ulid: "ULID",
      xid: "XID",
      ksuid: "KSUID",
      datetime: "\xE0k\xF3k\xF2 ISO",
      date: "\u1ECDj\u1ECD\u0301 ISO",
      time: "\xE0k\xF3k\xF2 ISO",
      duration: "\xE0k\xF3k\xF2 t\xF3 p\xE9 ISO",
      ipv4: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv4",
      ipv6: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv6",
      cidrv4: "\xE0gb\xE8gb\xE8 IPv4",
      cidrv6: "\xE0gb\xE8gb\xE8 IPv6",
      base64: "\u1ECD\u0300r\u1ECD\u0300 t\xED a k\u1ECD\u0301 n\xED base64",
      base64url: "\u1ECD\u0300r\u1ECD\u0300 base64url",
      json_string: "\u1ECD\u0300r\u1ECD\u0300 JSON",
      e164: "n\u1ECD\u0301mb\xE0 E.164",
      jwt: "JWT",
      template_literal: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
    };
    const TypeDictionary = {
      nan: "NaN",
      number: "n\u1ECD\u0301mb\xE0",
      array: "akop\u1ECD",
    };
    return (issue2) => {
      switch (issue2.code) {
        case "invalid_type": {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi instanceof ${issue2.expected}, \xE0m\u1ECD\u0300 a r\xED ${received}`;
          }
          return `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${expected}, \xE0m\u1ECD\u0300 a r\xED ${received}`;
        }
        case "invalid_value":
          if (issue2.values.length === 1)
            return `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${stringifyPrimitive(issue2.values[0])}`;
          return `\xC0\u1E63\xE0y\xE0n a\u1E63\xEC\u1E63e: yan \u1ECD\u0300kan l\xE1ra ${joinValues(issue2.values, "|")}`;
        case "too_big": {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${issue2.origin ?? "iye"} ${sizing.verb} ${adj}${issue2.maximum} ${sizing.unit}`;
          return `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 ${adj}${issue2.maximum}`;
        }
        case "too_small": {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing)
            return `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum} ${sizing.unit}`;
          return `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 ${adj}${issue2.minimum}`;
        }
        case "invalid_format": {
          const _issue = issue2;
          if (_issue.format === "starts_with")
            return `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\u1EB9\u0300r\u1EB9\u0300 p\u1EB9\u0300l\xFA "${_issue.prefix}"`;
          if (_issue.format === "ends_with")
            return `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 par\xED p\u1EB9\u0300l\xFA "${_issue.suffix}"`;
          if (_issue.format === "includes")
            return `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 n\xED "${_issue.includes}"`;
          if (_issue.format === "regex")
            return `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\xE1 \xE0p\u1EB9\u1EB9r\u1EB9 mu ${_issue.pattern}`;
          return `A\u1E63\xEC\u1E63e: ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
        case "not_multiple_of":
          return `N\u1ECD\u0301mb\xE0 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 j\u1EB9\u0301 \xE8y\xE0 p\xEDp\xEDn ti ${issue2.divisor}`;
        case "unrecognized_keys":
          return `B\u1ECDt\xECn\xEC \xE0\xECm\u1ECD\u0300: ${joinValues(issue2.keys, ", ")}`;
        case "invalid_key":
          return `B\u1ECDt\xECn\xEC a\u1E63\xEC\u1E63e n\xEDn\xFA ${issue2.origin}`;
        case "invalid_union":
          return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
        case "invalid_element":
          return `Iye a\u1E63\xEC\u1E63e n\xEDn\xFA ${issue2.origin}`;
        default:
          return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
      }
    };
  };
  function yo_default() {
    return {
      localeError: error50(),
    };
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
  var _a2;
  var $output = /* @__PURE__ */ Symbol("ZodOutput");
  var $input = /* @__PURE__ */ Symbol("ZodInput");
  var $ZodRegistry = class {
    constructor() {
      this._map = /* @__PURE__ */ new WeakMap();
      this._idmap = /* @__PURE__ */ new Map();
    }
    add(schema, ..._meta) {
      const meta3 = _meta[0];
      this._map.set(schema, meta3);
      if (meta3 && typeof meta3 === "object" && "id" in meta3) {
        this._idmap.set(meta3.id, schema);
      }
      return this;
    }
    clear() {
      this._map = /* @__PURE__ */ new WeakMap();
      this._idmap = /* @__PURE__ */ new Map();
      return this;
    }
    remove(schema) {
      const meta3 = this._map.get(schema);
      if (meta3 && typeof meta3 === "object" && "id" in meta3) {
        this._idmap.delete(meta3.id);
      }
      this._map.delete(schema);
      return this;
    }
    get(schema) {
      const p = schema._zod.parent;
      if (p) {
        const pm = { ...(this.get(p) ?? {}) };
        delete pm.id;
        const f = { ...pm, ...this._map.get(schema) };
        return Object.keys(f).length ? f : void 0;
      }
      return this._map.get(schema);
    }
    has(schema) {
      return this._map.has(schema);
    }
  };
  function registry() {
    return new $ZodRegistry();
  }
  (_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
  var globalRegistry = globalThis.__zod_globalRegistry;

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
  // @__NO_SIDE_EFFECTS__
  function _string(Class2, params) {
    return new Class2({
      type: "string",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _coercedString(Class2, params) {
    return new Class2({
      type: "string",
      coerce: true,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _email(Class2, params) {
    return new Class2({
      type: "string",
      format: "email",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _guid(Class2, params) {
    return new Class2({
      type: "string",
      format: "guid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uuid(Class2, params) {
    return new Class2({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uuidv4(Class2, params) {
    return new Class2({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v4",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uuidv6(Class2, params) {
    return new Class2({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v6",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uuidv7(Class2, params) {
    return new Class2({
      type: "string",
      format: "uuid",
      check: "string_format",
      abort: false,
      version: "v7",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _url(Class2, params) {
    return new Class2({
      type: "string",
      format: "url",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _emoji2(Class2, params) {
    return new Class2({
      type: "string",
      format: "emoji",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _nanoid(Class2, params) {
    return new Class2({
      type: "string",
      format: "nanoid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _cuid(Class2, params) {
    return new Class2({
      type: "string",
      format: "cuid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _cuid2(Class2, params) {
    return new Class2({
      type: "string",
      format: "cuid2",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _ulid(Class2, params) {
    return new Class2({
      type: "string",
      format: "ulid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _xid(Class2, params) {
    return new Class2({
      type: "string",
      format: "xid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _ksuid(Class2, params) {
    return new Class2({
      type: "string",
      format: "ksuid",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _ipv4(Class2, params) {
    return new Class2({
      type: "string",
      format: "ipv4",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _ipv6(Class2, params) {
    return new Class2({
      type: "string",
      format: "ipv6",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _mac(Class2, params) {
    return new Class2({
      type: "string",
      format: "mac",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _cidrv4(Class2, params) {
    return new Class2({
      type: "string",
      format: "cidrv4",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _cidrv6(Class2, params) {
    return new Class2({
      type: "string",
      format: "cidrv6",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _base64(Class2, params) {
    return new Class2({
      type: "string",
      format: "base64",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _base64url(Class2, params) {
    return new Class2({
      type: "string",
      format: "base64url",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _e164(Class2, params) {
    return new Class2({
      type: "string",
      format: "e164",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _jwt(Class2, params) {
    return new Class2({
      type: "string",
      format: "jwt",
      check: "string_format",
      abort: false,
      ...normalizeParams(params),
    });
  }
  var TimePrecision = {
    Any: null,
    Minute: -1,
    Second: 0,
    Millisecond: 3,
    Microsecond: 6,
  };
  // @__NO_SIDE_EFFECTS__
  function _isoDateTime(Class2, params) {
    return new Class2({
      type: "string",
      format: "datetime",
      check: "string_format",
      offset: false,
      local: false,
      precision: null,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _isoDate(Class2, params) {
    return new Class2({
      type: "string",
      format: "date",
      check: "string_format",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _isoTime(Class2, params) {
    return new Class2({
      type: "string",
      format: "time",
      check: "string_format",
      precision: null,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _isoDuration(Class2, params) {
    return new Class2({
      type: "string",
      format: "duration",
      check: "string_format",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _number(Class2, params) {
    return new Class2({
      type: "number",
      checks: [],
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _coercedNumber(Class2, params) {
    return new Class2({
      type: "number",
      coerce: true,
      checks: [],
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _int(Class2, params) {
    return new Class2({
      type: "number",
      check: "number_format",
      abort: false,
      format: "safeint",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _float32(Class2, params) {
    return new Class2({
      type: "number",
      check: "number_format",
      abort: false,
      format: "float32",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _float64(Class2, params) {
    return new Class2({
      type: "number",
      check: "number_format",
      abort: false,
      format: "float64",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _int32(Class2, params) {
    return new Class2({
      type: "number",
      check: "number_format",
      abort: false,
      format: "int32",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uint32(Class2, params) {
    return new Class2({
      type: "number",
      check: "number_format",
      abort: false,
      format: "uint32",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _boolean(Class2, params) {
    return new Class2({
      type: "boolean",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _coercedBoolean(Class2, params) {
    return new Class2({
      type: "boolean",
      coerce: true,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _bigint(Class2, params) {
    return new Class2({
      type: "bigint",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _coercedBigint(Class2, params) {
    return new Class2({
      type: "bigint",
      coerce: true,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _int64(Class2, params) {
    return new Class2({
      type: "bigint",
      check: "bigint_format",
      abort: false,
      format: "int64",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uint64(Class2, params) {
    return new Class2({
      type: "bigint",
      check: "bigint_format",
      abort: false,
      format: "uint64",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _symbol(Class2, params) {
    return new Class2({
      type: "symbol",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _undefined2(Class2, params) {
    return new Class2({
      type: "undefined",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _null2(Class2, params) {
    return new Class2({
      type: "null",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _any(Class2) {
    return new Class2({
      type: "any",
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _unknown(Class2) {
    return new Class2({
      type: "unknown",
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _never(Class2, params) {
    return new Class2({
      type: "never",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _void(Class2, params) {
    return new Class2({
      type: "void",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _date(Class2, params) {
    return new Class2({
      type: "date",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _coercedDate(Class2, params) {
    return new Class2({
      type: "date",
      coerce: true,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _nan(Class2, params) {
    return new Class2({
      type: "nan",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _lt(value, params) {
    return new $ZodCheckLessThan({
      check: "less_than",
      ...normalizeParams(params),
      value,
      inclusive: false,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _lte(value, params) {
    return new $ZodCheckLessThan({
      check: "less_than",
      ...normalizeParams(params),
      value,
      inclusive: true,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _gt(value, params) {
    return new $ZodCheckGreaterThan({
      check: "greater_than",
      ...normalizeParams(params),
      value,
      inclusive: false,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _gte(value, params) {
    return new $ZodCheckGreaterThan({
      check: "greater_than",
      ...normalizeParams(params),
      value,
      inclusive: true,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _positive(params) {
    return /* @__PURE__ */ _gt(0, params);
  }
  // @__NO_SIDE_EFFECTS__
  function _negative(params) {
    return /* @__PURE__ */ _lt(0, params);
  }
  // @__NO_SIDE_EFFECTS__
  function _nonpositive(params) {
    return /* @__PURE__ */ _lte(0, params);
  }
  // @__NO_SIDE_EFFECTS__
  function _nonnegative(params) {
    return /* @__PURE__ */ _gte(0, params);
  }
  // @__NO_SIDE_EFFECTS__
  function _multipleOf(value, params) {
    return new $ZodCheckMultipleOf({
      check: "multiple_of",
      ...normalizeParams(params),
      value,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _maxSize(maximum, params) {
    return new $ZodCheckMaxSize({
      check: "max_size",
      ...normalizeParams(params),
      maximum,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _minSize(minimum, params) {
    return new $ZodCheckMinSize({
      check: "min_size",
      ...normalizeParams(params),
      minimum,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _size(size, params) {
    return new $ZodCheckSizeEquals({
      check: "size_equals",
      ...normalizeParams(params),
      size,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _maxLength(maximum, params) {
    const ch = new $ZodCheckMaxLength({
      check: "max_length",
      ...normalizeParams(params),
      maximum,
    });
    return ch;
  }
  // @__NO_SIDE_EFFECTS__
  function _minLength(minimum, params) {
    return new $ZodCheckMinLength({
      check: "min_length",
      ...normalizeParams(params),
      minimum,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _length(length, params) {
    return new $ZodCheckLengthEquals({
      check: "length_equals",
      ...normalizeParams(params),
      length,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _regex(pattern, params) {
    return new $ZodCheckRegex({
      check: "string_format",
      format: "regex",
      ...normalizeParams(params),
      pattern,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _lowercase(params) {
    return new $ZodCheckLowerCase({
      check: "string_format",
      format: "lowercase",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _uppercase(params) {
    return new $ZodCheckUpperCase({
      check: "string_format",
      format: "uppercase",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _includes(includes, params) {
    return new $ZodCheckIncludes({
      check: "string_format",
      format: "includes",
      ...normalizeParams(params),
      includes,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _startsWith(prefix, params) {
    return new $ZodCheckStartsWith({
      check: "string_format",
      format: "starts_with",
      ...normalizeParams(params),
      prefix,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _endsWith(suffix, params) {
    return new $ZodCheckEndsWith({
      check: "string_format",
      format: "ends_with",
      ...normalizeParams(params),
      suffix,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _property(property, schema, params) {
    return new $ZodCheckProperty({
      check: "property",
      property,
      schema,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _mime(types, params) {
    return new $ZodCheckMimeType({
      check: "mime_type",
      mime: types,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _overwrite(tx) {
    return new $ZodCheckOverwrite({
      check: "overwrite",
      tx,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _normalize(form) {
    return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
  }
  // @__NO_SIDE_EFFECTS__
  function _trim() {
    return /* @__PURE__ */ _overwrite((input) => input.trim());
  }
  // @__NO_SIDE_EFFECTS__
  function _toLowerCase() {
    return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
  }
  // @__NO_SIDE_EFFECTS__
  function _toUpperCase() {
    return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
  }
  // @__NO_SIDE_EFFECTS__
  function _slugify() {
    return /* @__PURE__ */ _overwrite((input) => slugify(input));
  }
  // @__NO_SIDE_EFFECTS__
  function _array(Class2, element, params) {
    return new Class2({
      type: "array",
      element,
      // get element() {
      //   return element;
      // },
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _union(Class2, options, params) {
    return new Class2({
      type: "union",
      options,
      ...normalizeParams(params),
    });
  }
  function _xor(Class2, options, params) {
    return new Class2({
      type: "union",
      options,
      inclusive: false,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _discriminatedUnion(Class2, discriminator, options, params) {
    return new Class2({
      type: "union",
      options,
      discriminator,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _intersection(Class2, left, right) {
    return new Class2({
      type: "intersection",
      left,
      right,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _tuple(Class2, items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof $ZodType;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new Class2({
      type: "tuple",
      items,
      rest,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _record(Class2, keyType, valueType, params) {
    return new Class2({
      type: "record",
      keyType,
      valueType,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _map(Class2, keyType, valueType, params) {
    return new Class2({
      type: "map",
      keyType,
      valueType,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _set(Class2, valueType, params) {
    return new Class2({
      type: "set",
      valueType,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _enum(Class2, values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    return new Class2({
      type: "enum",
      entries,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _nativeEnum(Class2, entries, params) {
    return new Class2({
      type: "enum",
      entries,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _literal(Class2, value, params) {
    return new Class2({
      type: "literal",
      values: Array.isArray(value) ? value : [value],
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _file(Class2, params) {
    return new Class2({
      type: "file",
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _transform(Class2, fn) {
    return new Class2({
      type: "transform",
      transform: fn,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _optional(Class2, innerType) {
    return new Class2({
      type: "optional",
      innerType,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _nullable(Class2, innerType) {
    return new Class2({
      type: "nullable",
      innerType,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _default(Class2, innerType, defaultValue) {
    return new Class2({
      type: "default",
      innerType,
      get defaultValue() {
        return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
      },
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _nonoptional(Class2, innerType, params) {
    return new Class2({
      type: "nonoptional",
      innerType,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _success(Class2, innerType) {
    return new Class2({
      type: "success",
      innerType,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _catch(Class2, innerType, catchValue) {
    return new Class2({
      type: "catch",
      innerType,
      catchValue: typeof catchValue === "function" ? catchValue : () => catchValue,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _pipe(Class2, in_, out) {
    return new Class2({
      type: "pipe",
      in: in_,
      out,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _readonly(Class2, innerType) {
    return new Class2({
      type: "readonly",
      innerType,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _templateLiteral(Class2, parts, params) {
    return new Class2({
      type: "template_literal",
      parts,
      ...normalizeParams(params),
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _lazy(Class2, getter) {
    return new Class2({
      type: "lazy",
      getter,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _promise(Class2, innerType) {
    return new Class2({
      type: "promise",
      innerType,
    });
  }
  // @__NO_SIDE_EFFECTS__
  function _custom(Class2, fn, _params) {
    const norm = normalizeParams(_params);
    norm.abort ?? (norm.abort = true);
    const schema = new Class2({
      type: "custom",
      check: "custom",
      fn,
      ...norm,
    });
    return schema;
  }
  // @__NO_SIDE_EFFECTS__
  function _refine(Class2, fn, _params) {
    const schema = new Class2({
      type: "custom",
      check: "custom",
      fn,
      ...normalizeParams(_params),
    });
    return schema;
  }
  // @__NO_SIDE_EFFECTS__
  function _superRefine(fn, params) {
    const ch = /* @__PURE__ */ _check((payload) => {
      payload.addIssue = (issue2) => {
        if (typeof issue2 === "string") {
          payload.issues.push(issue(issue2, payload.value, ch._zod.def));
        } else {
          const _issue = issue2;
          if (_issue.fatal) _issue.continue = false;
          _issue.code ?? (_issue.code = "custom");
          _issue.input ?? (_issue.input = payload.value);
          _issue.inst ?? (_issue.inst = ch);
          _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
          payload.issues.push(issue(_issue));
        }
      };
      return fn(payload.value, payload);
    }, params);
    return ch;
  }
  // @__NO_SIDE_EFFECTS__
  function _check(fn, params) {
    const ch = new $ZodCheck({
      check: "custom",
      ...normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
  }
  // @__NO_SIDE_EFFECTS__
  function describe(description) {
    const ch = new $ZodCheck({ check: "describe" });
    ch._zod.onattach = [
      (inst) => {
        const existing = globalRegistry.get(inst) ?? {};
        globalRegistry.add(inst, { ...existing, description });
      },
    ];
    ch._zod.check = () => {};
    return ch;
  }
  // @__NO_SIDE_EFFECTS__
  function meta(metadata) {
    const ch = new $ZodCheck({ check: "meta" });
    ch._zod.onattach = [
      (inst) => {
        const existing = globalRegistry.get(inst) ?? {};
        globalRegistry.add(inst, { ...existing, ...metadata });
      },
    ];
    ch._zod.check = () => {};
    return ch;
  }
  // @__NO_SIDE_EFFECTS__
  function _stringbool(Classes, _params) {
    const params = normalizeParams(_params);
    let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
    let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
    if (params.case !== "sensitive") {
      truthyArray = truthyArray.map((v) => (typeof v === "string" ? v.toLowerCase() : v));
      falsyArray = falsyArray.map((v) => (typeof v === "string" ? v.toLowerCase() : v));
    }
    const truthySet = new Set(truthyArray);
    const falsySet = new Set(falsyArray);
    const _Codec = Classes.Codec ?? $ZodCodec;
    const _Boolean = Classes.Boolean ?? $ZodBoolean;
    const _String = Classes.String ?? $ZodString;
    const stringSchema = new _String({ type: "string", error: params.error });
    const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
    const codec2 = new _Codec({
      type: "pipe",
      in: stringSchema,
      out: booleanSchema,
      transform: (input, payload) => {
        let data = input;
        if (params.case !== "sensitive") data = data.toLowerCase();
        if (truthySet.has(data)) {
          return true;
        } else if (falsySet.has(data)) {
          return false;
        } else {
          payload.issues.push({
            code: "invalid_value",
            expected: "stringbool",
            values: [...truthySet, ...falsySet],
            input: payload.value,
            inst: codec2,
            continue: false,
          });
          return {};
        }
      },
      reverseTransform: (input, _payload) => {
        if (input === true) {
          return truthyArray[0] || "true";
        } else {
          return falsyArray[0] || "false";
        }
      },
      error: params.error,
    });
    return codec2;
  }
  // @__NO_SIDE_EFFECTS__
  function _stringFormat(Class2, format, fnOrRegex, _params = {}) {
    const params = normalizeParams(_params);
    const def = {
      ...normalizeParams(_params),
      check: "string_format",
      type: "string",
      format,
      fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
      ...params,
    };
    if (fnOrRegex instanceof RegExp) {
      def.pattern = fnOrRegex;
    }
    const inst = new Class2(def);
    return inst;
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
  function initializeContext(params) {
    let target2 = params?.target ?? "draft-2020-12";
    if (target2 === "draft-4") target2 = "draft-04";
    if (target2 === "draft-7") target2 = "draft-07";
    return {
      processors: params.processors ?? {},
      metadataRegistry: params?.metadata ?? globalRegistry,
      target: target2,
      unrepresentable: params?.unrepresentable ?? "throw",
      override: params?.override ?? (() => {}),
      io: params?.io ?? "output",
      counter: 0,
      seen: /* @__PURE__ */ new Map(),
      cycles: params?.cycles ?? "ref",
      reused: params?.reused ?? "inline",
      external: params?.external ?? void 0,
    };
  }
  function process2(schema, ctx, _params = { path: [], schemaPath: [] }) {
    var _a3;
    const def = schema._zod.def;
    const seen = ctx.seen.get(schema);
    if (seen) {
      seen.count++;
      const isCycle = _params.schemaPath.includes(schema);
      if (isCycle) {
        seen.cycle = _params.path;
      }
      return seen.schema;
    }
    const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
    ctx.seen.set(schema, result);
    const overrideSchema = schema._zod.toJSONSchema?.();
    if (overrideSchema) {
      result.schema = overrideSchema;
    } else {
      const params = {
        ..._params,
        schemaPath: [..._params.schemaPath, schema],
        path: _params.path,
      };
      if (schema._zod.processJSONSchema) {
        schema._zod.processJSONSchema(ctx, result.schema, params);
      } else {
        const _json = result.schema;
        const processor = ctx.processors[def.type];
        if (!processor) {
          throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
        }
        processor(schema, ctx, _json, params);
      }
      const parent = schema._zod.parent;
      if (parent) {
        if (!result.ref) result.ref = parent;
        process2(parent, ctx, params);
        ctx.seen.get(parent).isParent = true;
      }
    }
    const meta3 = ctx.metadataRegistry.get(schema);
    if (meta3) Object.assign(result.schema, meta3);
    if (ctx.io === "input" && isTransforming(schema)) {
      delete result.schema.examples;
      delete result.schema.default;
    }
    if (ctx.io === "input" && "_prefault" in result.schema)
      (_a3 = result.schema).default ?? (_a3.default = result.schema._prefault);
    delete result.schema._prefault;
    const _result = ctx.seen.get(schema);
    return _result.schema;
  }
  function extractDefs(ctx, schema) {
    const root = ctx.seen.get(schema);
    if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
    const idToSchema = /* @__PURE__ */ new Map();
    for (const entry of ctx.seen.entries()) {
      const id = ctx.metadataRegistry.get(entry[0])?.id;
      if (id) {
        const existing = idToSchema.get(id);
        if (existing && existing !== entry[0]) {
          throw new Error(
            `Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`,
          );
        }
        idToSchema.set(id, entry[0]);
      }
    }
    const makeURI = (entry) => {
      const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
      if (ctx.external) {
        const externalId = ctx.external.registry.get(entry[0])?.id;
        const uriGenerator = ctx.external.uri ?? ((id2) => id2);
        if (externalId) {
          return { ref: uriGenerator(externalId) };
        }
        const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
        entry[1].defId = id;
        return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
      }
      if (entry[1] === root) {
        return { ref: "#" };
      }
      const uriPrefix = `#`;
      const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
      const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
      return { defId, ref: defUriPrefix + defId };
    };
    const extractToDef = (entry) => {
      if (entry[1].schema.$ref) {
        return;
      }
      const seen = entry[1];
      const { ref, defId } = makeURI(entry);
      seen.def = { ...seen.schema };
      if (defId) seen.defId = defId;
      const schema2 = seen.schema;
      for (const key in schema2) {
        delete schema2[key];
      }
      schema2.$ref = ref;
    };
    if (ctx.cycles === "throw") {
      for (const entry of ctx.seen.entries()) {
        const seen = entry[1];
        if (seen.cycle) {
          throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
        }
      }
    }
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (schema === entry[0]) {
        extractToDef(entry);
        continue;
      }
      if (ctx.external) {
        const ext = ctx.external.registry.get(entry[0])?.id;
        if (schema !== entry[0] && ext) {
          extractToDef(entry);
          continue;
        }
      }
      const id = ctx.metadataRegistry.get(entry[0])?.id;
      if (id) {
        extractToDef(entry);
        continue;
      }
      if (seen.cycle) {
        extractToDef(entry);
        continue;
      }
      if (seen.count > 1) {
        if (ctx.reused === "ref") {
          extractToDef(entry);
          continue;
        }
      }
    }
  }
  function finalize(ctx, schema) {
    const root = ctx.seen.get(schema);
    if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
    const flattenRef = (zodSchema) => {
      const seen = ctx.seen.get(zodSchema);
      if (seen.ref === null) return;
      const schema2 = seen.def ?? seen.schema;
      const _cached = { ...schema2 };
      const ref = seen.ref;
      seen.ref = null;
      if (ref) {
        flattenRef(ref);
        const refSeen = ctx.seen.get(ref);
        const refSchema = refSeen.schema;
        if (
          refSchema.$ref &&
          (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")
        ) {
          schema2.allOf = schema2.allOf ?? [];
          schema2.allOf.push(refSchema);
        } else {
          Object.assign(schema2, refSchema);
        }
        Object.assign(schema2, _cached);
        const isParentRef = zodSchema._zod.parent === ref;
        if (isParentRef) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf") continue;
            if (!(key in _cached)) {
              delete schema2[key];
            }
          }
        }
        if (refSchema.$ref && refSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf") continue;
            if (
              key in refSeen.def &&
              JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])
            ) {
              delete schema2[key];
            }
          }
        }
      }
      const parent = zodSchema._zod.parent;
      if (parent && parent !== ref) {
        flattenRef(parent);
        const parentSeen = ctx.seen.get(parent);
        if (parentSeen?.schema.$ref) {
          schema2.$ref = parentSeen.schema.$ref;
          if (parentSeen.def) {
            for (const key in schema2) {
              if (key === "$ref" || key === "allOf") continue;
              if (
                key in parentSeen.def &&
                JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])
              ) {
                delete schema2[key];
              }
            }
          }
        }
      }
      ctx.override({
        zodSchema,
        jsonSchema: schema2,
        path: seen.path ?? [],
      });
    };
    for (const entry of [...ctx.seen.entries()].reverse()) {
      flattenRef(entry[0]);
    }
    const result = {};
    if (ctx.target === "draft-2020-12") {
      result.$schema = "https://json-schema.org/draft/2020-12/schema";
    } else if (ctx.target === "draft-07") {
      result.$schema = "http://json-schema.org/draft-07/schema#";
    } else if (ctx.target === "draft-04") {
      result.$schema = "http://json-schema.org/draft-04/schema#";
    } else if (ctx.target === "openapi-3.0") {
    } else {
    }
    if (ctx.external?.uri) {
      const id = ctx.external.registry.get(schema)?.id;
      if (!id) throw new Error("Schema is missing an `id` property");
      result.$id = ctx.external.uri(id);
    }
    Object.assign(result, root.def ?? root.schema);
    const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
    if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
    const defs = ctx.external?.defs ?? {};
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        if (seen.def.id === seen.defId) delete seen.def.id;
        defs[seen.defId] = seen.def;
      }
    }
    if (ctx.external) {
    } else {
      if (Object.keys(defs).length > 0) {
        if (ctx.target === "draft-2020-12") {
          result.$defs = defs;
        } else {
          result.definitions = defs;
        }
      }
    }
    try {
      const finalized = JSON.parse(JSON.stringify(result));
      Object.defineProperty(finalized, "~standard", {
        value: {
          ...schema["~standard"],
          jsonSchema: {
            input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
            output: createStandardJSONSchemaMethod(schema, "output", ctx.processors),
          },
        },
        enumerable: false,
        writable: false,
      });
      return finalized;
    } catch (_err) {
      throw new Error("Error converting schema to JSON.");
    }
  }
  function isTransforming(_schema, _ctx) {
    const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
    if (ctx.seen.has(_schema)) return false;
    ctx.seen.add(_schema);
    const def = _schema._zod.def;
    if (def.type === "transform") return true;
    if (def.type === "array") return isTransforming(def.element, ctx);
    if (def.type === "set") return isTransforming(def.valueType, ctx);
    if (def.type === "lazy") return isTransforming(def.getter(), ctx);
    if (
      def.type === "promise" ||
      def.type === "optional" ||
      def.type === "nonoptional" ||
      def.type === "nullable" ||
      def.type === "readonly" ||
      def.type === "default" ||
      def.type === "prefault"
    ) {
      return isTransforming(def.innerType, ctx);
    }
    if (def.type === "intersection") {
      return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
    }
    if (def.type === "record" || def.type === "map") {
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    if (def.type === "pipe") {
      if (_schema._zod.traits.has("$ZodCodec")) return true;
      return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
    }
    if (def.type === "object") {
      for (const key in def.shape) {
        if (isTransforming(def.shape[key], ctx)) return true;
      }
      return false;
    }
    if (def.type === "union") {
      for (const option of def.options) {
        if (isTransforming(option, ctx)) return true;
      }
      return false;
    }
    if (def.type === "tuple") {
      for (const item of def.items) {
        if (isTransforming(item, ctx)) return true;
      }
      if (def.rest && isTransforming(def.rest, ctx)) return true;
      return false;
    }
    return false;
  }
  var createToJSONSchemaMethod =
    (schema, processors = {}) =>
    (params) => {
      const ctx = initializeContext({ ...params, processors });
      process2(schema, ctx);
      extractDefs(ctx, schema);
      return finalize(ctx, schema);
    };
  var createStandardJSONSchemaMethod =
    (schema, io, processors = {}) =>
    (params) => {
      const { libraryOptions, target: target2 } = params ?? {};
      const ctx = initializeContext({ ...(libraryOptions ?? {}), target: target2, io, processors });
      process2(schema, ctx);
      extractDefs(ctx, schema);
      return finalize(ctx, schema);
    };

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
  var formatMap = {
    guid: "uuid",
    url: "uri",
    datetime: "date-time",
    json_string: "json-string",
    regex: "",
    // do not set
  };
  var stringProcessor = (schema, ctx, _json, _params) => {
    const json2 = _json;
    json2.type = "string";
    const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
    if (typeof minimum === "number") json2.minLength = minimum;
    if (typeof maximum === "number") json2.maxLength = maximum;
    if (format) {
      json2.format = formatMap[format] ?? format;
      if (json2.format === "") delete json2.format;
      if (format === "time") {
        delete json2.format;
      }
    }
    if (contentEncoding) json2.contentEncoding = contentEncoding;
    if (patterns && patterns.size > 0) {
      const regexes = [...patterns];
      if (regexes.length === 1) json2.pattern = regexes[0].source;
      else if (regexes.length > 1) {
        json2.allOf = [
          ...regexes.map((regex) => ({
            ...(ctx.target === "draft-07" ||
            ctx.target === "draft-04" ||
            ctx.target === "openapi-3.0"
              ? { type: "string" }
              : {}),
            pattern: regex.source,
          })),
        ];
      }
    }
  };
  var numberProcessor = (schema, ctx, _json, _params) => {
    const json2 = _json;
    const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } =
      schema._zod.bag;
    if (typeof format === "string" && format.includes("int")) json2.type = "integer";
    else json2.type = "number";
    const exMin =
      typeof exclusiveMinimum === "number" &&
      exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
    const exMax =
      typeof exclusiveMaximum === "number" &&
      exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
    const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
    if (exMin) {
      if (legacy) {
        json2.minimum = exclusiveMinimum;
        json2.exclusiveMinimum = true;
      } else {
        json2.exclusiveMinimum = exclusiveMinimum;
      }
    } else if (typeof minimum === "number") {
      json2.minimum = minimum;
    }
    if (exMax) {
      if (legacy) {
        json2.maximum = exclusiveMaximum;
        json2.exclusiveMaximum = true;
      } else {
        json2.exclusiveMaximum = exclusiveMaximum;
      }
    } else if (typeof maximum === "number") {
      json2.maximum = maximum;
    }
    if (typeof multipleOf === "number") json2.multipleOf = multipleOf;
  };
  var booleanProcessor = (_schema, _ctx, json2, _params) => {
    json2.type = "boolean";
  };
  var bigintProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("BigInt cannot be represented in JSON Schema");
    }
  };
  var symbolProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Symbols cannot be represented in JSON Schema");
    }
  };
  var nullProcessor = (_schema, ctx, json2, _params) => {
    if (ctx.target === "openapi-3.0") {
      json2.type = "string";
      json2.nullable = true;
      json2.enum = [null];
    } else {
      json2.type = "null";
    }
  };
  var undefinedProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Undefined cannot be represented in JSON Schema");
    }
  };
  var voidProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Void cannot be represented in JSON Schema");
    }
  };
  var neverProcessor = (_schema, _ctx, json2, _params) => {
    json2.not = {};
  };
  var anyProcessor = (_schema, _ctx, _json, _params) => {};
  var unknownProcessor = (_schema, _ctx, _json, _params) => {};
  var dateProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Date cannot be represented in JSON Schema");
    }
  };
  var enumProcessor = (schema, _ctx, json2, _params) => {
    const def = schema._zod.def;
    const values = getEnumValues(def.entries);
    if (values.every((v) => typeof v === "number")) json2.type = "number";
    if (values.every((v) => typeof v === "string")) json2.type = "string";
    json2.enum = values;
  };
  var literalProcessor = (schema, ctx, json2, _params) => {
    const def = schema._zod.def;
    const vals = [];
    for (const val of def.values) {
      if (val === void 0) {
        if (ctx.unrepresentable === "throw") {
          throw new Error("Literal `undefined` cannot be represented in JSON Schema");
        } else {
        }
      } else if (typeof val === "bigint") {
        if (ctx.unrepresentable === "throw") {
          throw new Error("BigInt literals cannot be represented in JSON Schema");
        } else {
          vals.push(Number(val));
        }
      } else {
        vals.push(val);
      }
    }
    if (vals.length === 0) {
    } else if (vals.length === 1) {
      const val = vals[0];
      json2.type = val === null ? "null" : typeof val;
      if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
        json2.enum = [val];
      } else {
        json2.const = val;
      }
    } else {
      if (vals.every((v) => typeof v === "number")) json2.type = "number";
      if (vals.every((v) => typeof v === "string")) json2.type = "string";
      if (vals.every((v) => typeof v === "boolean")) json2.type = "boolean";
      if (vals.every((v) => v === null)) json2.type = "null";
      json2.enum = vals;
    }
  };
  var nanProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("NaN cannot be represented in JSON Schema");
    }
  };
  var templateLiteralProcessor = (schema, _ctx, json2, _params) => {
    const _json = json2;
    const pattern = schema._zod.pattern;
    if (!pattern) throw new Error("Pattern not found in template literal");
    _json.type = "string";
    _json.pattern = pattern.source;
  };
  var fileProcessor = (schema, _ctx, json2, _params) => {
    const _json = json2;
    const file2 = {
      type: "string",
      format: "binary",
      contentEncoding: "binary",
    };
    const { minimum, maximum, mime } = schema._zod.bag;
    if (minimum !== void 0) file2.minLength = minimum;
    if (maximum !== void 0) file2.maxLength = maximum;
    if (mime) {
      if (mime.length === 1) {
        file2.contentMediaType = mime[0];
        Object.assign(_json, file2);
      } else {
        Object.assign(_json, file2);
        _json.anyOf = mime.map((m) => ({ contentMediaType: m }));
      }
    } else {
      Object.assign(_json, file2);
    }
  };
  var successProcessor = (_schema, _ctx, json2, _params) => {
    json2.type = "boolean";
  };
  var customProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Custom types cannot be represented in JSON Schema");
    }
  };
  var functionProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Function types cannot be represented in JSON Schema");
    }
  };
  var transformProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Transforms cannot be represented in JSON Schema");
    }
  };
  var mapProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Map cannot be represented in JSON Schema");
    }
  };
  var setProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
      throw new Error("Set cannot be represented in JSON Schema");
    }
  };
  var arrayProcessor = (schema, ctx, _json, params) => {
    const json2 = _json;
    const def = schema._zod.def;
    const { minimum, maximum } = schema._zod.bag;
    if (typeof minimum === "number") json2.minItems = minimum;
    if (typeof maximum === "number") json2.maxItems = maximum;
    json2.type = "array";
    json2.items = process2(def.element, ctx, {
      ...params,
      path: [...params.path, "items"],
    });
  };
  var objectProcessor = (schema, ctx, _json, params) => {
    const json2 = _json;
    const def = schema._zod.def;
    json2.type = "object";
    json2.properties = {};
    const shape = def.shape;
    for (const key in shape) {
      json2.properties[key] = process2(shape[key], ctx, {
        ...params,
        path: [...params.path, "properties", key],
      });
    }
    const allKeys = new Set(Object.keys(shape));
    const requiredKeys = new Set(
      [...allKeys].filter((key) => {
        const v = def.shape[key]._zod;
        if (ctx.io === "input") {
          return v.optin === void 0;
        } else {
          return v.optout === void 0;
        }
      }),
    );
    if (requiredKeys.size > 0) {
      json2.required = Array.from(requiredKeys);
    }
    if (def.catchall?._zod.def.type === "never") {
      json2.additionalProperties = false;
    } else if (!def.catchall) {
      if (ctx.io === "output") json2.additionalProperties = false;
    } else if (def.catchall) {
      json2.additionalProperties = process2(def.catchall, ctx, {
        ...params,
        path: [...params.path, "additionalProperties"],
      });
    }
  };
  var unionProcessor = (schema, ctx, json2, params) => {
    const def = schema._zod.def;
    const isExclusive = def.inclusive === false;
    const options = def.options.map((x, i) =>
      process2(x, ctx, {
        ...params,
        path: [...params.path, isExclusive ? "oneOf" : "anyOf", i],
      }),
    );
    if (isExclusive) {
      json2.oneOf = options;
    } else {
      json2.anyOf = options;
    }
  };
  var intersectionProcessor = (schema, ctx, json2, params) => {
    const def = schema._zod.def;
    const a = process2(def.left, ctx, {
      ...params,
      path: [...params.path, "allOf", 0],
    });
    const b = process2(def.right, ctx, {
      ...params,
      path: [...params.path, "allOf", 1],
    });
    const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
    const allOf = [
      ...(isSimpleIntersection(a) ? a.allOf : [a]),
      ...(isSimpleIntersection(b) ? b.allOf : [b]),
    ];
    json2.allOf = allOf;
  };
  var tupleProcessor = (schema, ctx, _json, params) => {
    const json2 = _json;
    const def = schema._zod.def;
    json2.type = "array";
    const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
    const restPath =
      ctx.target === "draft-2020-12"
        ? "items"
        : ctx.target === "openapi-3.0"
          ? "items"
          : "additionalItems";
    const prefixItems = def.items.map((x, i) =>
      process2(x, ctx, {
        ...params,
        path: [...params.path, prefixPath, i],
      }),
    );
    const rest = def.rest
      ? process2(def.rest, ctx, {
          ...params,
          path: [
            ...params.path,
            restPath,
            ...(ctx.target === "openapi-3.0" ? [def.items.length] : []),
          ],
        })
      : null;
    if (ctx.target === "draft-2020-12") {
      json2.prefixItems = prefixItems;
      if (rest) {
        json2.items = rest;
      }
    } else if (ctx.target === "openapi-3.0") {
      json2.items = {
        anyOf: prefixItems,
      };
      if (rest) {
        json2.items.anyOf.push(rest);
      }
      json2.minItems = prefixItems.length;
      if (!rest) {
        json2.maxItems = prefixItems.length;
      }
    } else {
      json2.items = prefixItems;
      if (rest) {
        json2.additionalItems = rest;
      }
    }
    const { minimum, maximum } = schema._zod.bag;
    if (typeof minimum === "number") json2.minItems = minimum;
    if (typeof maximum === "number") json2.maxItems = maximum;
  };
  var recordProcessor = (schema, ctx, _json, params) => {
    const json2 = _json;
    const def = schema._zod.def;
    json2.type = "object";
    const keyType = def.keyType;
    const keyBag = keyType._zod.bag;
    const patterns = keyBag?.patterns;
    if (def.mode === "loose" && patterns && patterns.size > 0) {
      const valueSchema = process2(def.valueType, ctx, {
        ...params,
        path: [...params.path, "patternProperties", "*"],
      });
      json2.patternProperties = {};
      for (const pattern of patterns) {
        json2.patternProperties[pattern.source] = valueSchema;
      }
    } else {
      if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
        json2.propertyNames = process2(def.keyType, ctx, {
          ...params,
          path: [...params.path, "propertyNames"],
        });
      }
      json2.additionalProperties = process2(def.valueType, ctx, {
        ...params,
        path: [...params.path, "additionalProperties"],
      });
    }
    const keyValues = keyType._zod.values;
    if (keyValues) {
      const validKeyValues = [...keyValues].filter(
        (v) => typeof v === "string" || typeof v === "number",
      );
      if (validKeyValues.length > 0) {
        json2.required = validKeyValues;
      }
    }
  };
  var nullableProcessor = (schema, ctx, json2, params) => {
    const def = schema._zod.def;
    const inner = process2(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    if (ctx.target === "openapi-3.0") {
      seen.ref = def.innerType;
      json2.nullable = true;
    } else {
      json2.anyOf = [inner, { type: "null" }];
    }
  };
  var nonoptionalProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    process2(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
  };
  var defaultProcessor = (schema, ctx, json2, params) => {
    const def = schema._zod.def;
    process2(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    json2.default = JSON.parse(JSON.stringify(def.defaultValue));
  };
  var prefaultProcessor = (schema, ctx, json2, params) => {
    const def = schema._zod.def;
    process2(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    if (ctx.io === "input") json2._prefault = JSON.parse(JSON.stringify(def.defaultValue));
  };
  var catchProcessor = (schema, ctx, json2, params) => {
    const def = schema._zod.def;
    process2(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    let catchValue;
    try {
      catchValue = def.catchValue(void 0);
    } catch {
      throw new Error("Dynamic catch values are not supported in JSON Schema");
    }
    json2.default = catchValue;
  };
  var pipeProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    const inIsTransform = def.in._zod.traits.has("$ZodTransform");
    const innerType = ctx.io === "input" ? (inIsTransform ? def.out : def.in) : def.out;
    process2(innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = innerType;
  };
  var readonlyProcessor = (schema, ctx, json2, params) => {
    const def = schema._zod.def;
    process2(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    json2.readOnly = true;
  };
  var promiseProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    process2(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
  };
  var optionalProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    process2(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
  };
  var lazyProcessor = (schema, ctx, _json, params) => {
    const innerType = schema._zod.innerType;
    process2(innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = innerType;
  };
  var allProcessors = {
    string: stringProcessor,
    number: numberProcessor,
    boolean: booleanProcessor,
    bigint: bigintProcessor,
    symbol: symbolProcessor,
    null: nullProcessor,
    undefined: undefinedProcessor,
    void: voidProcessor,
    never: neverProcessor,
    any: anyProcessor,
    unknown: unknownProcessor,
    date: dateProcessor,
    enum: enumProcessor,
    literal: literalProcessor,
    nan: nanProcessor,
    template_literal: templateLiteralProcessor,
    file: fileProcessor,
    success: successProcessor,
    custom: customProcessor,
    function: functionProcessor,
    transform: transformProcessor,
    map: mapProcessor,
    set: setProcessor,
    array: arrayProcessor,
    object: objectProcessor,
    union: unionProcessor,
    intersection: intersectionProcessor,
    tuple: tupleProcessor,
    record: recordProcessor,
    nullable: nullableProcessor,
    nonoptional: nonoptionalProcessor,
    default: defaultProcessor,
    prefault: prefaultProcessor,
    catch: catchProcessor,
    pipe: pipeProcessor,
    readonly: readonlyProcessor,
    promise: promiseProcessor,
    optional: optionalProcessor,
    lazy: lazyProcessor,
  };
  function toJSONSchema(input, params) {
    if ("_idmap" in input) {
      const registry2 = input;
      const ctx2 = initializeContext({ ...params, processors: allProcessors });
      const defs = {};
      for (const entry of registry2._idmap.entries()) {
        const [_, schema] = entry;
        process2(schema, ctx2);
      }
      const schemas = {};
      const external = {
        registry: registry2,
        uri: params?.uri,
        defs,
      };
      ctx2.external = external;
      for (const entry of registry2._idmap.entries()) {
        const [key, schema] = entry;
        extractDefs(ctx2, schema);
        schemas[key] = finalize(ctx2, schema);
      }
      if (Object.keys(defs).length > 0) {
        const defsSegment = ctx2.target === "draft-2020-12" ? "$defs" : "definitions";
        schemas.__shared = {
          [defsSegment]: defs,
        };
      }
      return { schemas };
    }
    const ctx = initializeContext({ ...params, processors: allProcessors });
    process2(input, ctx);
    extractDefs(ctx, input);
    return finalize(ctx, input);
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-generator.js
  var JSONSchemaGenerator = class {
    /** @deprecated Access via ctx instead */
    get metadataRegistry() {
      return this.ctx.metadataRegistry;
    }
    /** @deprecated Access via ctx instead */
    get target() {
      return this.ctx.target;
    }
    /** @deprecated Access via ctx instead */
    get unrepresentable() {
      return this.ctx.unrepresentable;
    }
    /** @deprecated Access via ctx instead */
    get override() {
      return this.ctx.override;
    }
    /** @deprecated Access via ctx instead */
    get io() {
      return this.ctx.io;
    }
    /** @deprecated Access via ctx instead */
    get counter() {
      return this.ctx.counter;
    }
    set counter(value) {
      this.ctx.counter = value;
    }
    /** @deprecated Access via ctx instead */
    get seen() {
      return this.ctx.seen;
    }
    constructor(params) {
      let normalizedTarget = params?.target ?? "draft-2020-12";
      if (normalizedTarget === "draft-4") normalizedTarget = "draft-04";
      if (normalizedTarget === "draft-7") normalizedTarget = "draft-07";
      this.ctx = initializeContext({
        processors: allProcessors,
        target: normalizedTarget,
        ...(params?.metadata && { metadata: params.metadata }),
        ...(params?.unrepresentable && { unrepresentable: params.unrepresentable }),
        ...(params?.override && { override: params.override }),
        ...(params?.io && { io: params.io }),
      });
    }
    /**
     * Process a schema to prepare it for JSON Schema generation.
     * This must be called before emit().
     */
    process(schema, _params = { path: [], schemaPath: [] }) {
      return process2(schema, this.ctx, _params);
    }
    /**
     * Emit the final JSON Schema after processing.
     * Must call process() first.
     */
    emit(schema, _params) {
      if (_params) {
        if (_params.cycles) this.ctx.cycles = _params.cycles;
        if (_params.reused) this.ctx.reused = _params.reused;
        if (_params.external) this.ctx.external = _params.external;
      }
      extractDefs(this.ctx, schema);
      const result = finalize(this.ctx, schema);
      const { "~standard": _, ...plainResult } = result;
      return plainResult;
    }
  };

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema.js
  var json_schema_exports = {};

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
  var schemas_exports2 = {};
  __export(schemas_exports2, {
    ZodAny: () => ZodAny,
    ZodArray: () => ZodArray,
    ZodBase64: () => ZodBase64,
    ZodBase64URL: () => ZodBase64URL,
    ZodBigInt: () => ZodBigInt,
    ZodBigIntFormat: () => ZodBigIntFormat,
    ZodBoolean: () => ZodBoolean,
    ZodCIDRv4: () => ZodCIDRv4,
    ZodCIDRv6: () => ZodCIDRv6,
    ZodCUID: () => ZodCUID,
    ZodCUID2: () => ZodCUID2,
    ZodCatch: () => ZodCatch,
    ZodCodec: () => ZodCodec,
    ZodCustom: () => ZodCustom,
    ZodCustomStringFormat: () => ZodCustomStringFormat,
    ZodDate: () => ZodDate,
    ZodDefault: () => ZodDefault,
    ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
    ZodE164: () => ZodE164,
    ZodEmail: () => ZodEmail,
    ZodEmoji: () => ZodEmoji,
    ZodEnum: () => ZodEnum,
    ZodExactOptional: () => ZodExactOptional,
    ZodFile: () => ZodFile,
    ZodFunction: () => ZodFunction,
    ZodGUID: () => ZodGUID,
    ZodIPv4: () => ZodIPv4,
    ZodIPv6: () => ZodIPv6,
    ZodIntersection: () => ZodIntersection,
    ZodJWT: () => ZodJWT,
    ZodKSUID: () => ZodKSUID,
    ZodLazy: () => ZodLazy,
    ZodLiteral: () => ZodLiteral,
    ZodMAC: () => ZodMAC,
    ZodMap: () => ZodMap,
    ZodNaN: () => ZodNaN,
    ZodNanoID: () => ZodNanoID,
    ZodNever: () => ZodNever,
    ZodNonOptional: () => ZodNonOptional,
    ZodNull: () => ZodNull,
    ZodNullable: () => ZodNullable,
    ZodNumber: () => ZodNumber,
    ZodNumberFormat: () => ZodNumberFormat,
    ZodObject: () => ZodObject,
    ZodOptional: () => ZodOptional,
    ZodPipe: () => ZodPipe,
    ZodPrefault: () => ZodPrefault,
    ZodPreprocess: () => ZodPreprocess,
    ZodPromise: () => ZodPromise,
    ZodReadonly: () => ZodReadonly,
    ZodRecord: () => ZodRecord,
    ZodSet: () => ZodSet,
    ZodString: () => ZodString,
    ZodStringFormat: () => ZodStringFormat,
    ZodSuccess: () => ZodSuccess,
    ZodSymbol: () => ZodSymbol,
    ZodTemplateLiteral: () => ZodTemplateLiteral,
    ZodTransform: () => ZodTransform,
    ZodTuple: () => ZodTuple,
    ZodType: () => ZodType,
    ZodULID: () => ZodULID,
    ZodURL: () => ZodURL,
    ZodUUID: () => ZodUUID,
    ZodUndefined: () => ZodUndefined,
    ZodUnion: () => ZodUnion,
    ZodUnknown: () => ZodUnknown,
    ZodVoid: () => ZodVoid,
    ZodXID: () => ZodXID,
    ZodXor: () => ZodXor,
    _ZodString: () => _ZodString,
    _default: () => _default2,
    _function: () => _function,
    any: () => any,
    array: () => array,
    base64: () => base642,
    base64url: () => base64url2,
    bigint: () => bigint2,
    boolean: () => boolean2,
    catch: () => _catch2,
    check: () => check,
    cidrv4: () => cidrv42,
    cidrv6: () => cidrv62,
    codec: () => codec,
    cuid: () => cuid3,
    cuid2: () => cuid22,
    custom: () => custom,
    date: () => date3,
    describe: () => describe2,
    discriminatedUnion: () => discriminatedUnion,
    e164: () => e1642,
    email: () => email2,
    emoji: () => emoji2,
    enum: () => _enum2,
    exactOptional: () => exactOptional,
    file: () => file,
    float32: () => float32,
    float64: () => float64,
    function: () => _function,
    guid: () => guid2,
    hash: () => hash,
    hex: () => hex2,
    hostname: () => hostname2,
    httpUrl: () => httpUrl,
    instanceof: () => _instanceof,
    int: () => int,
    int32: () => int32,
    int64: () => int64,
    intersection: () => intersection,
    invertCodec: () => invertCodec,
    ipv4: () => ipv42,
    ipv6: () => ipv62,
    json: () => json,
    jwt: () => jwt,
    keyof: () => keyof,
    ksuid: () => ksuid2,
    lazy: () => lazy,
    literal: () => literal,
    looseObject: () => looseObject,
    looseRecord: () => looseRecord,
    mac: () => mac2,
    map: () => map,
    meta: () => meta2,
    nan: () => nan,
    nanoid: () => nanoid2,
    nativeEnum: () => nativeEnum,
    never: () => never,
    nonoptional: () => nonoptional,
    null: () => _null3,
    nullable: () => nullable,
    nullish: () => nullish2,
    number: () => number2,
    object: () => object,
    optional: () => optional,
    partialRecord: () => partialRecord,
    pipe: () => pipe,
    prefault: () => prefault,
    preprocess: () => preprocess,
    promise: () => promise,
    readonly: () => readonly,
    record: () => record,
    refine: () => refine,
    set: () => set,
    strictObject: () => strictObject,
    string: () => string2,
    stringFormat: () => stringFormat,
    stringbool: () => stringbool,
    success: () => success,
    superRefine: () => superRefine,
    symbol: () => symbol,
    templateLiteral: () => templateLiteral,
    transform: () => transform,
    tuple: () => tuple,
    uint32: () => uint32,
    uint64: () => uint64,
    ulid: () => ulid2,
    undefined: () => _undefined3,
    union: () => union,
    unknown: () => unknown,
    url: () => url,
    uuid: () => uuid2,
    uuidv4: () => uuidv4,
    uuidv6: () => uuidv6,
    uuidv7: () => uuidv7,
    void: () => _void2,
    xid: () => xid2,
    xor: () => xor,
  });

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/checks.js
  var checks_exports2 = {};
  __export(checks_exports2, {
    endsWith: () => _endsWith,
    gt: () => _gt,
    gte: () => _gte,
    includes: () => _includes,
    length: () => _length,
    lowercase: () => _lowercase,
    lt: () => _lt,
    lte: () => _lte,
    maxLength: () => _maxLength,
    maxSize: () => _maxSize,
    mime: () => _mime,
    minLength: () => _minLength,
    minSize: () => _minSize,
    multipleOf: () => _multipleOf,
    negative: () => _negative,
    nonnegative: () => _nonnegative,
    nonpositive: () => _nonpositive,
    normalize: () => _normalize,
    overwrite: () => _overwrite,
    positive: () => _positive,
    property: () => _property,
    regex: () => _regex,
    size: () => _size,
    slugify: () => _slugify,
    startsWith: () => _startsWith,
    toLowerCase: () => _toLowerCase,
    toUpperCase: () => _toUpperCase,
    trim: () => _trim,
    uppercase: () => _uppercase,
  });

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
  var iso_exports = {};
  __export(iso_exports, {
    ZodISODate: () => ZodISODate,
    ZodISODateTime: () => ZodISODateTime,
    ZodISODuration: () => ZodISODuration,
    ZodISOTime: () => ZodISOTime,
    date: () => date2,
    datetime: () => datetime2,
    duration: () => duration2,
    time: () => time2,
  });
  var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
    $ZodISODateTime.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function datetime2(params) {
    return _isoDateTime(ZodISODateTime, params);
  }
  var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
    $ZodISODate.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function date2(params) {
    return _isoDate(ZodISODate, params);
  }
  var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
    $ZodISOTime.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function time2(params) {
    return _isoTime(ZodISOTime, params);
  }
  var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
    $ZodISODuration.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function duration2(params) {
    return _isoDuration(ZodISODuration, params);
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
  var initializer2 = (inst, issues) => {
    $ZodError.init(inst, issues);
    inst.name = "ZodError";
    Object.defineProperties(inst, {
      format: {
        value: (mapper) => formatError(inst, mapper),
        // enumerable: false,
      },
      flatten: {
        value: (mapper) => flattenError(inst, mapper),
        // enumerable: false,
      },
      addIssue: {
        value: (issue2) => {
          inst.issues.push(issue2);
          inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
        },
        // enumerable: false,
      },
      addIssues: {
        value: (issues2) => {
          inst.issues.push(...issues2);
          inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
        },
        // enumerable: false,
      },
      isEmpty: {
        get() {
          return inst.issues.length === 0;
        },
        // enumerable: false,
      },
    });
  };
  var ZodError = /* @__PURE__ */ $constructor("ZodError", initializer2);
  var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, {
    Parent: Error,
  });

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
  var parse2 = /* @__PURE__ */ _parse(ZodRealError);
  var parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError);
  var safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
  var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);
  var encode2 = /* @__PURE__ */ _encode(ZodRealError);
  var decode2 = /* @__PURE__ */ _decode(ZodRealError);
  var encodeAsync2 = /* @__PURE__ */ _encodeAsync(ZodRealError);
  var decodeAsync2 = /* @__PURE__ */ _decodeAsync(ZodRealError);
  var safeEncode2 = /* @__PURE__ */ _safeEncode(ZodRealError);
  var safeDecode2 = /* @__PURE__ */ _safeDecode(ZodRealError);
  var safeEncodeAsync2 = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
  var safeDecodeAsync2 = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
  var _installedGroups = /* @__PURE__ */ new WeakMap();
  function _installLazyMethods(inst, group, methods) {
    const proto = Object.getPrototypeOf(inst);
    let installed = _installedGroups.get(proto);
    if (!installed) {
      installed = /* @__PURE__ */ new Set();
      _installedGroups.set(proto, installed);
    }
    if (installed.has(group)) return;
    installed.add(group);
    for (const key in methods) {
      const fn = methods[key];
      Object.defineProperty(proto, key, {
        configurable: true,
        enumerable: false,
        get() {
          const bound = fn.bind(this);
          Object.defineProperty(this, key, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: bound,
          });
          return bound;
        },
        set(v) {
          Object.defineProperty(this, key, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: v,
          });
        },
      });
    }
  }
  var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
    $ZodType.init(inst, def);
    Object.assign(inst["~standard"], {
      jsonSchema: {
        input: createStandardJSONSchemaMethod(inst, "input"),
        output: createStandardJSONSchemaMethod(inst, "output"),
      },
    });
    inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
    inst.def = def;
    inst.type = def.type;
    Object.defineProperty(inst, "_def", { value: def });
    inst.parse = (data, params) => parse2(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => safeParse2(inst, data, params);
    inst.parseAsync = async (data, params) =>
      parseAsync2(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
    inst.spa = inst.safeParseAsync;
    inst.encode = (data, params) => encode2(inst, data, params);
    inst.decode = (data, params) => decode2(inst, data, params);
    inst.encodeAsync = async (data, params) => encodeAsync2(inst, data, params);
    inst.decodeAsync = async (data, params) => decodeAsync2(inst, data, params);
    inst.safeEncode = (data, params) => safeEncode2(inst, data, params);
    inst.safeDecode = (data, params) => safeDecode2(inst, data, params);
    inst.safeEncodeAsync = async (data, params) => safeEncodeAsync2(inst, data, params);
    inst.safeDecodeAsync = async (data, params) => safeDecodeAsync2(inst, data, params);
    _installLazyMethods(inst, "ZodType", {
      check(...chks) {
        const def2 = this.def;
        return this.clone(
          util_exports.mergeDefs(def2, {
            checks: [
              ...(def2.checks ?? []),
              ...chks.map((ch) =>
                typeof ch === "function"
                  ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } }
                  : ch,
              ),
            ],
          }),
          { parent: true },
        );
      },
      with(...chks) {
        return this.check(...chks);
      },
      clone(def2, params) {
        return clone(this, def2, params);
      },
      brand() {
        return this;
      },
      register(reg, meta3) {
        reg.add(this, meta3);
        return this;
      },
      refine(check3, params) {
        return this.check(refine(check3, params));
      },
      superRefine(refinement, params) {
        return this.check(superRefine(refinement, params));
      },
      overwrite(fn) {
        return this.check(_overwrite(fn));
      },
      optional() {
        return optional(this);
      },
      exactOptional() {
        return exactOptional(this);
      },
      nullable() {
        return nullable(this);
      },
      nullish() {
        return optional(nullable(this));
      },
      nonoptional(params) {
        return nonoptional(this, params);
      },
      array() {
        return array(this);
      },
      or(arg) {
        return union([this, arg]);
      },
      and(arg) {
        return intersection(this, arg);
      },
      transform(tx) {
        return pipe(this, transform(tx));
      },
      default(d) {
        return _default2(this, d);
      },
      prefault(d) {
        return prefault(this, d);
      },
      catch(params) {
        return _catch2(this, params);
      },
      pipe(target2) {
        return pipe(this, target2);
      },
      readonly() {
        return readonly(this);
      },
      describe(description) {
        const cl = this.clone();
        globalRegistry.add(cl, { description });
        return cl;
      },
      meta(...args) {
        if (args.length === 0) return globalRegistry.get(this);
        const cl = this.clone();
        globalRegistry.add(cl, args[0]);
        return cl;
      },
      isOptional() {
        return this.safeParse(void 0).success;
      },
      isNullable() {
        return this.safeParse(null).success;
      },
      apply(fn) {
        return fn(this);
      },
    });
    Object.defineProperty(inst, "description", {
      get() {
        return globalRegistry.get(inst)?.description;
      },
      configurable: true,
    });
    return inst;
  });
  var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => stringProcessor(inst, ctx, json2, params);
    const bag = inst._zod.bag;
    inst.format = bag.format ?? null;
    inst.minLength = bag.minimum ?? null;
    inst.maxLength = bag.maximum ?? null;
    _installLazyMethods(inst, "_ZodString", {
      regex(...args) {
        return this.check(_regex(...args));
      },
      includes(...args) {
        return this.check(_includes(...args));
      },
      startsWith(...args) {
        return this.check(_startsWith(...args));
      },
      endsWith(...args) {
        return this.check(_endsWith(...args));
      },
      min(...args) {
        return this.check(_minLength(...args));
      },
      max(...args) {
        return this.check(_maxLength(...args));
      },
      length(...args) {
        return this.check(_length(...args));
      },
      nonempty(...args) {
        return this.check(_minLength(1, ...args));
      },
      lowercase(params) {
        return this.check(_lowercase(params));
      },
      uppercase(params) {
        return this.check(_uppercase(params));
      },
      trim() {
        return this.check(_trim());
      },
      normalize(...args) {
        return this.check(_normalize(...args));
      },
      toLowerCase() {
        return this.check(_toLowerCase());
      },
      toUpperCase() {
        return this.check(_toUpperCase());
      },
      slugify() {
        return this.check(_slugify());
      },
    });
  });
  var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    _ZodString.init(inst, def);
    inst.email = (params) => inst.check(_email(ZodEmail, params));
    inst.url = (params) => inst.check(_url(ZodURL, params));
    inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
    inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
    inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
    inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
    inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
    inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
    inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
    inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
    inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
    inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
    inst.xid = (params) => inst.check(_xid(ZodXID, params));
    inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
    inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
    inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
    inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
    inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
    inst.e164 = (params) => inst.check(_e164(ZodE164, params));
    inst.datetime = (params) => inst.check(datetime2(params));
    inst.date = (params) => inst.check(date2(params));
    inst.time = (params) => inst.check(time2(params));
    inst.duration = (params) => inst.check(duration2(params));
  });
  function string2(params) {
    return _string(ZodString, params);
  }
  var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    _ZodString.init(inst, def);
  });
  var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
    $ZodEmail.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function email2(params) {
    return _email(ZodEmail, params);
  }
  var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
    $ZodGUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function guid2(params) {
    return _guid(ZodGUID, params);
  }
  var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
    $ZodUUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function uuid2(params) {
    return _uuid(ZodUUID, params);
  }
  function uuidv4(params) {
    return _uuidv4(ZodUUID, params);
  }
  function uuidv6(params) {
    return _uuidv6(ZodUUID, params);
  }
  function uuidv7(params) {
    return _uuidv7(ZodUUID, params);
  }
  var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
    $ZodURL.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function url(params) {
    return _url(ZodURL, params);
  }
  function httpUrl(params) {
    return _url(ZodURL, {
      protocol: regexes_exports.httpProtocol,
      hostname: regexes_exports.domain,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
    $ZodEmoji.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function emoji2(params) {
    return _emoji2(ZodEmoji, params);
  }
  var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
    $ZodNanoID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function nanoid2(params) {
    return _nanoid(ZodNanoID, params);
  }
  var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
    $ZodCUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function cuid3(params) {
    return _cuid(ZodCUID, params);
  }
  var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
    $ZodCUID2.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function cuid22(params) {
    return _cuid2(ZodCUID2, params);
  }
  var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
    $ZodULID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function ulid2(params) {
    return _ulid(ZodULID, params);
  }
  var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
    $ZodXID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function xid2(params) {
    return _xid(ZodXID, params);
  }
  var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
    $ZodKSUID.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function ksuid2(params) {
    return _ksuid(ZodKSUID, params);
  }
  var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
    $ZodIPv4.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function ipv42(params) {
    return _ipv4(ZodIPv4, params);
  }
  var ZodMAC = /* @__PURE__ */ $constructor("ZodMAC", (inst, def) => {
    $ZodMAC.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function mac2(params) {
    return _mac(ZodMAC, params);
  }
  var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
    $ZodIPv6.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function ipv62(params) {
    return _ipv6(ZodIPv6, params);
  }
  var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
    $ZodCIDRv4.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function cidrv42(params) {
    return _cidrv4(ZodCIDRv4, params);
  }
  var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
    $ZodCIDRv6.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function cidrv62(params) {
    return _cidrv6(ZodCIDRv6, params);
  }
  var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
    $ZodBase64.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function base642(params) {
    return _base64(ZodBase64, params);
  }
  var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
    $ZodBase64URL.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function base64url2(params) {
    return _base64url(ZodBase64URL, params);
  }
  var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
    $ZodE164.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function e1642(params) {
    return _e164(ZodE164, params);
  }
  var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
    $ZodJWT.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function jwt(params) {
    return _jwt(ZodJWT, params);
  }
  var ZodCustomStringFormat = /* @__PURE__ */ $constructor("ZodCustomStringFormat", (inst, def) => {
    $ZodCustomStringFormat.init(inst, def);
    ZodStringFormat.init(inst, def);
  });
  function stringFormat(format, fnOrRegex, _params = {}) {
    return _stringFormat(ZodCustomStringFormat, format, fnOrRegex, _params);
  }
  function hostname2(_params) {
    return _stringFormat(ZodCustomStringFormat, "hostname", regexes_exports.hostname, _params);
  }
  function hex2(_params) {
    return _stringFormat(ZodCustomStringFormat, "hex", regexes_exports.hex, _params);
  }
  function hash(alg, params) {
    const enc = params?.enc ?? "hex";
    const format = `${alg}_${enc}`;
    const regex = regexes_exports[format];
    if (!regex) throw new Error(`Unrecognized hash format: ${format}`);
    return _stringFormat(ZodCustomStringFormat, format, regex, params);
  }
  var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
    $ZodNumber.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => numberProcessor(inst, ctx, json2, params);
    _installLazyMethods(inst, "ZodNumber", {
      gt(value, params) {
        return this.check(_gt(value, params));
      },
      gte(value, params) {
        return this.check(_gte(value, params));
      },
      min(value, params) {
        return this.check(_gte(value, params));
      },
      lt(value, params) {
        return this.check(_lt(value, params));
      },
      lte(value, params) {
        return this.check(_lte(value, params));
      },
      max(value, params) {
        return this.check(_lte(value, params));
      },
      int(params) {
        return this.check(int(params));
      },
      safe(params) {
        return this.check(int(params));
      },
      positive(params) {
        return this.check(_gt(0, params));
      },
      nonnegative(params) {
        return this.check(_gte(0, params));
      },
      negative(params) {
        return this.check(_lt(0, params));
      },
      nonpositive(params) {
        return this.check(_lte(0, params));
      },
      multipleOf(value, params) {
        return this.check(_multipleOf(value, params));
      },
      step(value, params) {
        return this.check(_multipleOf(value, params));
      },
      finite() {
        return this;
      },
    });
    const bag = inst._zod.bag;
    inst.minValue =
      Math.max(
        bag.minimum ?? Number.NEGATIVE_INFINITY,
        bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY,
      ) ?? null;
    inst.maxValue =
      Math.min(
        bag.maximum ?? Number.POSITIVE_INFINITY,
        bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY,
      ) ?? null;
    inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
    inst.isFinite = true;
    inst.format = bag.format ?? null;
  });
  function number2(params) {
    return _number(ZodNumber, params);
  }
  var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
    $ZodNumberFormat.init(inst, def);
    ZodNumber.init(inst, def);
  });
  function int(params) {
    return _int(ZodNumberFormat, params);
  }
  function float32(params) {
    return _float32(ZodNumberFormat, params);
  }
  function float64(params) {
    return _float64(ZodNumberFormat, params);
  }
  function int32(params) {
    return _int32(ZodNumberFormat, params);
  }
  function uint32(params) {
    return _uint32(ZodNumberFormat, params);
  }
  var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
    $ZodBoolean.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      booleanProcessor(inst, ctx, json2, params);
  });
  function boolean2(params) {
    return _boolean(ZodBoolean, params);
  }
  var ZodBigInt = /* @__PURE__ */ $constructor("ZodBigInt", (inst, def) => {
    $ZodBigInt.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => bigintProcessor(inst, ctx, json2, params);
    inst.gte = (value, params) => inst.check(_gte(value, params));
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.gt = (value, params) => inst.check(_gt(value, params));
    inst.gte = (value, params) => inst.check(_gte(value, params));
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.lt = (value, params) => inst.check(_lt(value, params));
    inst.lte = (value, params) => inst.check(_lte(value, params));
    inst.max = (value, params) => inst.check(_lte(value, params));
    inst.positive = (params) => inst.check(_gt(BigInt(0), params));
    inst.negative = (params) => inst.check(_lt(BigInt(0), params));
    inst.nonpositive = (params) => inst.check(_lte(BigInt(0), params));
    inst.nonnegative = (params) => inst.check(_gte(BigInt(0), params));
    inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
    const bag = inst._zod.bag;
    inst.minValue = bag.minimum ?? null;
    inst.maxValue = bag.maximum ?? null;
    inst.format = bag.format ?? null;
  });
  function bigint2(params) {
    return _bigint(ZodBigInt, params);
  }
  var ZodBigIntFormat = /* @__PURE__ */ $constructor("ZodBigIntFormat", (inst, def) => {
    $ZodBigIntFormat.init(inst, def);
    ZodBigInt.init(inst, def);
  });
  function int64(params) {
    return _int64(ZodBigIntFormat, params);
  }
  function uint64(params) {
    return _uint64(ZodBigIntFormat, params);
  }
  var ZodSymbol = /* @__PURE__ */ $constructor("ZodSymbol", (inst, def) => {
    $ZodSymbol.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => symbolProcessor(inst, ctx, json2, params);
  });
  function symbol(params) {
    return _symbol(ZodSymbol, params);
  }
  var ZodUndefined = /* @__PURE__ */ $constructor("ZodUndefined", (inst, def) => {
    $ZodUndefined.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      undefinedProcessor(inst, ctx, json2, params);
  });
  function _undefined3(params) {
    return _undefined2(ZodUndefined, params);
  }
  var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
    $ZodNull.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => nullProcessor(inst, ctx, json2, params);
  });
  function _null3(params) {
    return _null2(ZodNull, params);
  }
  var ZodAny = /* @__PURE__ */ $constructor("ZodAny", (inst, def) => {
    $ZodAny.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => anyProcessor(inst, ctx, json2, params);
  });
  function any() {
    return _any(ZodAny);
  }
  var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
    $ZodUnknown.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      unknownProcessor(inst, ctx, json2, params);
  });
  function unknown() {
    return _unknown(ZodUnknown);
  }
  var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
    $ZodNever.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => neverProcessor(inst, ctx, json2, params);
  });
  function never(params) {
    return _never(ZodNever, params);
  }
  var ZodVoid = /* @__PURE__ */ $constructor("ZodVoid", (inst, def) => {
    $ZodVoid.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => voidProcessor(inst, ctx, json2, params);
  });
  function _void2(params) {
    return _void(ZodVoid, params);
  }
  var ZodDate = /* @__PURE__ */ $constructor("ZodDate", (inst, def) => {
    $ZodDate.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => dateProcessor(inst, ctx, json2, params);
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.max = (value, params) => inst.check(_lte(value, params));
    const c = inst._zod.bag;
    inst.minDate = c.minimum ? new Date(c.minimum) : null;
    inst.maxDate = c.maximum ? new Date(c.maximum) : null;
  });
  function date3(params) {
    return _date(ZodDate, params);
  }
  var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
    $ZodArray.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => arrayProcessor(inst, ctx, json2, params);
    inst.element = def.element;
    _installLazyMethods(inst, "ZodArray", {
      min(n, params) {
        return this.check(_minLength(n, params));
      },
      nonempty(params) {
        return this.check(_minLength(1, params));
      },
      max(n, params) {
        return this.check(_maxLength(n, params));
      },
      length(n, params) {
        return this.check(_length(n, params));
      },
      unwrap() {
        return this.element;
      },
    });
  });
  function array(element, params) {
    return _array(ZodArray, element, params);
  }
  function keyof(schema) {
    const shape = schema._zod.def.shape;
    return _enum2(Object.keys(shape));
  }
  var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
    $ZodObjectJIT.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => objectProcessor(inst, ctx, json2, params);
    util_exports.defineLazy(inst, "shape", () => {
      return def.shape;
    });
    _installLazyMethods(inst, "ZodObject", {
      keyof() {
        return _enum2(Object.keys(this._zod.def.shape));
      },
      catchall(catchall) {
        return this.clone({ ...this._zod.def, catchall });
      },
      passthrough() {
        return this.clone({ ...this._zod.def, catchall: unknown() });
      },
      loose() {
        return this.clone({ ...this._zod.def, catchall: unknown() });
      },
      strict() {
        return this.clone({ ...this._zod.def, catchall: never() });
      },
      strip() {
        return this.clone({ ...this._zod.def, catchall: void 0 });
      },
      extend(incoming) {
        return util_exports.extend(this, incoming);
      },
      safeExtend(incoming) {
        return util_exports.safeExtend(this, incoming);
      },
      merge(other) {
        return util_exports.merge(this, other);
      },
      pick(mask) {
        return util_exports.pick(this, mask);
      },
      omit(mask) {
        return util_exports.omit(this, mask);
      },
      partial(...args) {
        return util_exports.partial(ZodOptional, this, args[0]);
      },
      required(...args) {
        return util_exports.required(ZodNonOptional, this, args[0]);
      },
    });
  });
  function object(shape, params) {
    const def = {
      type: "object",
      shape: shape ?? {},
      ...util_exports.normalizeParams(params),
    };
    return new ZodObject(def);
  }
  function strictObject(shape, params) {
    return new ZodObject({
      type: "object",
      shape,
      catchall: never(),
      ...util_exports.normalizeParams(params),
    });
  }
  function looseObject(shape, params) {
    return new ZodObject({
      type: "object",
      shape,
      catchall: unknown(),
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
    inst.options = def.options;
  });
  function union(options, params) {
    return new ZodUnion({
      type: "union",
      options,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodXor = /* @__PURE__ */ $constructor("ZodXor", (inst, def) => {
    ZodUnion.init(inst, def);
    $ZodXor.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => unionProcessor(inst, ctx, json2, params);
    inst.options = def.options;
  });
  function xor(options, params) {
    return new ZodXor({
      type: "union",
      options,
      inclusive: false,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
    ZodUnion.init(inst, def);
    $ZodDiscriminatedUnion.init(inst, def);
  });
  function discriminatedUnion(discriminator, options, params) {
    return new ZodDiscriminatedUnion({
      type: "union",
      options,
      discriminator,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
    $ZodIntersection.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      intersectionProcessor(inst, ctx, json2, params);
  });
  function intersection(left, right) {
    return new ZodIntersection({
      type: "intersection",
      left,
      right,
    });
  }
  var ZodTuple = /* @__PURE__ */ $constructor("ZodTuple", (inst, def) => {
    $ZodTuple.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => tupleProcessor(inst, ctx, json2, params);
    inst.rest = (rest) =>
      inst.clone({
        ...inst._zod.def,
        rest,
      });
  });
  function tuple(items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof $ZodType;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new ZodTuple({
      type: "tuple",
      items,
      rest,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
    $ZodRecord.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => recordProcessor(inst, ctx, json2, params);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
  });
  function record(keyType, valueType, params) {
    if (!valueType || !valueType._zod) {
      return new ZodRecord({
        type: "record",
        keyType: string2(),
        valueType: keyType,
        ...util_exports.normalizeParams(valueType),
      });
    }
    return new ZodRecord({
      type: "record",
      keyType,
      valueType,
      ...util_exports.normalizeParams(params),
    });
  }
  function partialRecord(keyType, valueType, params) {
    const k = clone(keyType);
    k._zod.values = void 0;
    return new ZodRecord({
      type: "record",
      keyType: k,
      valueType,
      ...util_exports.normalizeParams(params),
    });
  }
  function looseRecord(keyType, valueType, params) {
    return new ZodRecord({
      type: "record",
      keyType,
      valueType,
      mode: "loose",
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodMap = /* @__PURE__ */ $constructor("ZodMap", (inst, def) => {
    $ZodMap.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => mapProcessor(inst, ctx, json2, params);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
    inst.min = (...args) => inst.check(_minSize(...args));
    inst.nonempty = (params) => inst.check(_minSize(1, params));
    inst.max = (...args) => inst.check(_maxSize(...args));
    inst.size = (...args) => inst.check(_size(...args));
  });
  function map(keyType, valueType, params) {
    return new ZodMap({
      type: "map",
      keyType,
      valueType,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodSet = /* @__PURE__ */ $constructor("ZodSet", (inst, def) => {
    $ZodSet.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => setProcessor(inst, ctx, json2, params);
    inst.min = (...args) => inst.check(_minSize(...args));
    inst.nonempty = (params) => inst.check(_minSize(1, params));
    inst.max = (...args) => inst.check(_maxSize(...args));
    inst.size = (...args) => inst.check(_size(...args));
  });
  function set(valueType, params) {
    return new ZodSet({
      type: "set",
      valueType,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
    $ZodEnum.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => enumProcessor(inst, ctx, json2, params);
    inst.enum = def.entries;
    inst.options = Object.values(def.entries);
    const keys = new Set(Object.keys(def.entries));
    inst.extract = (values, params) => {
      const newEntries = {};
      for (const value of values) {
        if (keys.has(value)) {
          newEntries[value] = def.entries[value];
        } else throw new Error(`Key ${value} not found in enum`);
      }
      return new ZodEnum({
        ...def,
        checks: [],
        ...util_exports.normalizeParams(params),
        entries: newEntries,
      });
    };
    inst.exclude = (values, params) => {
      const newEntries = { ...def.entries };
      for (const value of values) {
        if (keys.has(value)) {
          delete newEntries[value];
        } else throw new Error(`Key ${value} not found in enum`);
      }
      return new ZodEnum({
        ...def,
        checks: [],
        ...util_exports.normalizeParams(params),
        entries: newEntries,
      });
    };
  });
  function _enum2(values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    return new ZodEnum({
      type: "enum",
      entries,
      ...util_exports.normalizeParams(params),
    });
  }
  function nativeEnum(entries, params) {
    return new ZodEnum({
      type: "enum",
      entries,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
    $ZodLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      literalProcessor(inst, ctx, json2, params);
    inst.values = new Set(def.values);
    Object.defineProperty(inst, "value", {
      get() {
        if (def.values.length > 1) {
          throw new Error(
            "This schema contains multiple valid literal values. Use `.values` instead.",
          );
        }
        return def.values[0];
      },
    });
  });
  function literal(value, params) {
    return new ZodLiteral({
      type: "literal",
      values: Array.isArray(value) ? value : [value],
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodFile = /* @__PURE__ */ $constructor("ZodFile", (inst, def) => {
    $ZodFile.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => fileProcessor(inst, ctx, json2, params);
    inst.min = (size, params) => inst.check(_minSize(size, params));
    inst.max = (size, params) => inst.check(_maxSize(size, params));
    inst.mime = (types, params) =>
      inst.check(_mime(Array.isArray(types) ? types : [types], params));
  });
  function file(params) {
    return _file(ZodFile, params);
  }
  var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
    $ZodTransform.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      transformProcessor(inst, ctx, json2, params);
    inst._zod.parse = (payload, _ctx) => {
      if (_ctx.direction === "backward") {
        throw new $ZodEncodeError(inst.constructor.name);
      }
      payload.addIssue = (issue2) => {
        if (typeof issue2 === "string") {
          payload.issues.push(util_exports.issue(issue2, payload.value, def));
        } else {
          const _issue = issue2;
          if (_issue.fatal) _issue.continue = false;
          _issue.code ?? (_issue.code = "custom");
          _issue.input ?? (_issue.input = payload.value);
          _issue.inst ?? (_issue.inst = inst);
          payload.issues.push(util_exports.issue(_issue));
        }
      };
      const output = def.transform(payload.value, payload);
      if (output instanceof Promise) {
        return output.then((output2) => {
          payload.value = output2;
          payload.fallback = true;
          return payload;
        });
      }
      payload.value = output;
      payload.fallback = true;
      return payload;
    };
  });
  function transform(fn) {
    return new ZodTransform({
      type: "transform",
      transform: fn,
    });
  }
  var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      optionalProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function optional(innerType) {
    return new ZodOptional({
      type: "optional",
      innerType,
    });
  }
  var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
    $ZodExactOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      optionalProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function exactOptional(innerType) {
    return new ZodExactOptional({
      type: "optional",
      innerType,
    });
  }
  var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
    $ZodNullable.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      nullableProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function nullable(innerType) {
    return new ZodNullable({
      type: "nullable",
      innerType,
    });
  }
  function nullish2(innerType) {
    return optional(nullable(innerType));
  }
  var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
    $ZodDefault.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      defaultProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeDefault = inst.unwrap;
  });
  function _default2(innerType, defaultValue) {
    return new ZodDefault({
      type: "default",
      innerType,
      get defaultValue() {
        return typeof defaultValue === "function"
          ? defaultValue()
          : util_exports.shallowClone(defaultValue);
      },
    });
  }
  var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
    $ZodPrefault.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      prefaultProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function prefault(innerType, defaultValue) {
    return new ZodPrefault({
      type: "prefault",
      innerType,
      get defaultValue() {
        return typeof defaultValue === "function"
          ? defaultValue()
          : util_exports.shallowClone(defaultValue);
      },
    });
  }
  var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
    $ZodNonOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      nonoptionalProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function nonoptional(innerType, params) {
    return new ZodNonOptional({
      type: "nonoptional",
      innerType,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodSuccess = /* @__PURE__ */ $constructor("ZodSuccess", (inst, def) => {
    $ZodSuccess.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      successProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function success(innerType) {
    return new ZodSuccess({
      type: "success",
      innerType,
    });
  }
  var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
    $ZodCatch.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => catchProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeCatch = inst.unwrap;
  });
  function _catch2(innerType, catchValue) {
    return new ZodCatch({
      type: "catch",
      innerType,
      catchValue: typeof catchValue === "function" ? catchValue : () => catchValue,
    });
  }
  var ZodNaN = /* @__PURE__ */ $constructor("ZodNaN", (inst, def) => {
    $ZodNaN.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => nanProcessor(inst, ctx, json2, params);
  });
  function nan(params) {
    return _nan(ZodNaN, params);
  }
  var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
    $ZodPipe.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => pipeProcessor(inst, ctx, json2, params);
    inst.in = def.in;
    inst.out = def.out;
  });
  function pipe(in_, out) {
    return new ZodPipe({
      type: "pipe",
      in: in_,
      out,
      // ...util.normalizeParams(params),
    });
  }
  var ZodCodec = /* @__PURE__ */ $constructor("ZodCodec", (inst, def) => {
    ZodPipe.init(inst, def);
    $ZodCodec.init(inst, def);
  });
  function codec(in_, out, params) {
    return new ZodCodec({
      type: "pipe",
      in: in_,
      out,
      transform: params.decode,
      reverseTransform: params.encode,
    });
  }
  function invertCodec(codec2) {
    const def = codec2._zod.def;
    return new ZodCodec({
      type: "pipe",
      in: def.out,
      out: def.in,
      transform: def.reverseTransform,
      reverseTransform: def.transform,
    });
  }
  var ZodPreprocess = /* @__PURE__ */ $constructor("ZodPreprocess", (inst, def) => {
    ZodPipe.init(inst, def);
    $ZodPreprocess.init(inst, def);
  });
  var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
    $ZodReadonly.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      readonlyProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function readonly(innerType) {
    return new ZodReadonly({
      type: "readonly",
      innerType,
    });
  }
  var ZodTemplateLiteral = /* @__PURE__ */ $constructor("ZodTemplateLiteral", (inst, def) => {
    $ZodTemplateLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      templateLiteralProcessor(inst, ctx, json2, params);
  });
  function templateLiteral(parts, params) {
    return new ZodTemplateLiteral({
      type: "template_literal",
      parts,
      ...util_exports.normalizeParams(params),
    });
  }
  var ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
    $ZodLazy.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => lazyProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.getter();
  });
  function lazy(getter) {
    return new ZodLazy({
      type: "lazy",
      getter,
    });
  }
  var ZodPromise = /* @__PURE__ */ $constructor("ZodPromise", (inst, def) => {
    $ZodPromise.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      promiseProcessor(inst, ctx, json2, params);
    inst.unwrap = () => inst._zod.def.innerType;
  });
  function promise(innerType) {
    return new ZodPromise({
      type: "promise",
      innerType,
    });
  }
  var ZodFunction = /* @__PURE__ */ $constructor("ZodFunction", (inst, def) => {
    $ZodFunction.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) =>
      functionProcessor(inst, ctx, json2, params);
  });
  function _function(params) {
    return new ZodFunction({
      type: "function",
      input: Array.isArray(params?.input)
        ? tuple(params?.input)
        : (params?.input ?? array(unknown())),
      output: params?.output ?? unknown(),
    });
  }
  var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
    $ZodCustom.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json2, params) => customProcessor(inst, ctx, json2, params);
  });
  function check(fn) {
    const ch = new $ZodCheck({
      check: "custom",
      // ...util.normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
  }
  function custom(fn, _params) {
    return _custom(ZodCustom, fn ?? (() => true), _params);
  }
  function refine(fn, _params = {}) {
    return _refine(ZodCustom, fn, _params);
  }
  function superRefine(fn, params) {
    return _superRefine(fn, params);
  }
  var describe2 = describe;
  var meta2 = meta;
  function _instanceof(cls, params = {}) {
    const inst = new ZodCustom({
      type: "custom",
      check: "custom",
      fn: (data) => data instanceof cls,
      abort: true,
      ...util_exports.normalizeParams(params),
    });
    inst._zod.bag.Class = cls;
    inst._zod.check = (payload) => {
      if (!(payload.value instanceof cls)) {
        payload.issues.push({
          code: "invalid_type",
          expected: cls.name,
          input: payload.value,
          inst,
          path: [...(inst._zod.def.path ?? [])],
        });
      }
    };
    return inst;
  }
  var stringbool = (...args) =>
    _stringbool(
      {
        Codec: ZodCodec,
        Boolean: ZodBoolean,
        String: ZodString,
      },
      ...args,
    );
  function json(params) {
    const jsonSchema = lazy(() => {
      return union([
        string2(params),
        number2(),
        boolean2(),
        _null3(),
        array(jsonSchema),
        record(string2(), jsonSchema),
      ]);
    });
    return jsonSchema;
  }
  function preprocess(fn, schema) {
    return new ZodPreprocess({
      type: "pipe",
      in: transform(fn),
      out: schema,
    });
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/compat.js
  var ZodIssueCode = {
    invalid_type: "invalid_type",
    too_big: "too_big",
    too_small: "too_small",
    invalid_format: "invalid_format",
    not_multiple_of: "not_multiple_of",
    unrecognized_keys: "unrecognized_keys",
    invalid_union: "invalid_union",
    invalid_key: "invalid_key",
    invalid_element: "invalid_element",
    invalid_value: "invalid_value",
    custom: "custom",
  };
  function setErrorMap(map2) {
    config({
      customError: map2,
    });
  }
  function getErrorMap() {
    return config().customError;
  }
  var ZodFirstPartyTypeKind;
  /* @__PURE__ */ (function (ZodFirstPartyTypeKind2) {})(
    ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}),
  );

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/from-json-schema.js
  var z = {
    ...schemas_exports2,
    ...checks_exports2,
    iso: iso_exports,
  };
  var RECOGNIZED_KEYS = /* @__PURE__ */ new Set([
    // Schema identification
    "$schema",
    "$ref",
    "$defs",
    "definitions",
    // Core schema keywords
    "$id",
    "id",
    "$comment",
    "$anchor",
    "$vocabulary",
    "$dynamicRef",
    "$dynamicAnchor",
    // Type
    "type",
    "enum",
    "const",
    // Composition
    "anyOf",
    "oneOf",
    "allOf",
    "not",
    // Object
    "properties",
    "required",
    "additionalProperties",
    "patternProperties",
    "propertyNames",
    "minProperties",
    "maxProperties",
    // Array
    "items",
    "prefixItems",
    "additionalItems",
    "minItems",
    "maxItems",
    "uniqueItems",
    "contains",
    "minContains",
    "maxContains",
    // String
    "minLength",
    "maxLength",
    "pattern",
    "format",
    // Number
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
    // Already handled metadata
    "description",
    "default",
    // Content
    "contentEncoding",
    "contentMediaType",
    "contentSchema",
    // Unsupported (error-throwing)
    "unevaluatedItems",
    "unevaluatedProperties",
    "if",
    "then",
    "else",
    "dependentSchemas",
    "dependentRequired",
    // OpenAPI
    "nullable",
    "readOnly",
  ]);
  function detectVersion(schema, defaultTarget) {
    const $schema = schema.$schema;
    if ($schema === "https://json-schema.org/draft/2020-12/schema") {
      return "draft-2020-12";
    }
    if ($schema === "http://json-schema.org/draft-07/schema#") {
      return "draft-7";
    }
    if ($schema === "http://json-schema.org/draft-04/schema#") {
      return "draft-4";
    }
    return defaultTarget ?? "draft-2020-12";
  }
  function resolveRef(ref, ctx) {
    if (!ref.startsWith("#")) {
      throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
    }
    const path = ref.slice(1).split("/").filter(Boolean);
    if (path.length === 0) {
      return ctx.rootSchema;
    }
    const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
    if (path[0] === defsKey) {
      const key = path[1];
      if (!key || !ctx.defs[key]) {
        throw new Error(`Reference not found: ${ref}`);
      }
      return ctx.defs[key];
    }
    throw new Error(`Reference not found: ${ref}`);
  }
  function convertBaseSchema(schema, ctx) {
    if (schema.not !== void 0) {
      if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) {
        return z.never();
      }
      throw new Error("not is not supported in Zod (except { not: {} } for never)");
    }
    if (schema.unevaluatedItems !== void 0) {
      throw new Error("unevaluatedItems is not supported");
    }
    if (schema.unevaluatedProperties !== void 0) {
      throw new Error("unevaluatedProperties is not supported");
    }
    if (schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) {
      throw new Error("Conditional schemas (if/then/else) are not supported");
    }
    if (schema.dependentSchemas !== void 0 || schema.dependentRequired !== void 0) {
      throw new Error("dependentSchemas and dependentRequired are not supported");
    }
    if (schema.$ref) {
      const refPath = schema.$ref;
      if (ctx.refs.has(refPath)) {
        return ctx.refs.get(refPath);
      }
      if (ctx.processing.has(refPath)) {
        return z.lazy(() => {
          if (!ctx.refs.has(refPath)) {
            throw new Error(`Circular reference not resolved: ${refPath}`);
          }
          return ctx.refs.get(refPath);
        });
      }
      ctx.processing.add(refPath);
      const resolved = resolveRef(refPath, ctx);
      const zodSchema2 = convertSchema(resolved, ctx);
      ctx.refs.set(refPath, zodSchema2);
      ctx.processing.delete(refPath);
      return zodSchema2;
    }
    if (schema.enum !== void 0) {
      const enumValues = schema.enum;
      if (
        ctx.version === "openapi-3.0" &&
        schema.nullable === true &&
        enumValues.length === 1 &&
        enumValues[0] === null
      ) {
        return z.null();
      }
      if (enumValues.length === 0) {
        return z.never();
      }
      if (enumValues.length === 1) {
        return z.literal(enumValues[0]);
      }
      if (enumValues.every((v) => typeof v === "string")) {
        return z.enum(enumValues);
      }
      const literalSchemas = enumValues.map((v) => z.literal(v));
      if (literalSchemas.length < 2) {
        return literalSchemas[0];
      }
      return z.union([literalSchemas[0], literalSchemas[1], ...literalSchemas.slice(2)]);
    }
    if (schema.const !== void 0) {
      return z.literal(schema.const);
    }
    const type = schema.type;
    if (Array.isArray(type)) {
      const typeSchemas = type.map((t) => {
        const typeSchema = { ...schema, type: t };
        return convertBaseSchema(typeSchema, ctx);
      });
      if (typeSchemas.length === 0) {
        return z.never();
      }
      if (typeSchemas.length === 1) {
        return typeSchemas[0];
      }
      return z.union(typeSchemas);
    }
    if (!type) {
      return z.any();
    }
    let zodSchema;
    switch (type) {
      case "string": {
        let stringSchema = z.string();
        if (schema.format) {
          const format = schema.format;
          if (format === "email") {
            stringSchema = stringSchema.check(z.email());
          } else if (format === "uri" || format === "uri-reference") {
            stringSchema = stringSchema.check(z.url());
          } else if (format === "uuid" || format === "guid") {
            stringSchema = stringSchema.check(z.uuid());
          } else if (format === "date-time") {
            stringSchema = stringSchema.check(z.iso.datetime());
          } else if (format === "date") {
            stringSchema = stringSchema.check(z.iso.date());
          } else if (format === "time") {
            stringSchema = stringSchema.check(z.iso.time());
          } else if (format === "duration") {
            stringSchema = stringSchema.check(z.iso.duration());
          } else if (format === "ipv4") {
            stringSchema = stringSchema.check(z.ipv4());
          } else if (format === "ipv6") {
            stringSchema = stringSchema.check(z.ipv6());
          } else if (format === "mac") {
            stringSchema = stringSchema.check(z.mac());
          } else if (format === "cidr") {
            stringSchema = stringSchema.check(z.cidrv4());
          } else if (format === "cidr-v6") {
            stringSchema = stringSchema.check(z.cidrv6());
          } else if (format === "base64") {
            stringSchema = stringSchema.check(z.base64());
          } else if (format === "base64url") {
            stringSchema = stringSchema.check(z.base64url());
          } else if (format === "e164") {
            stringSchema = stringSchema.check(z.e164());
          } else if (format === "jwt") {
            stringSchema = stringSchema.check(z.jwt());
          } else if (format === "emoji") {
            stringSchema = stringSchema.check(z.emoji());
          } else if (format === "nanoid") {
            stringSchema = stringSchema.check(z.nanoid());
          } else if (format === "cuid") {
            stringSchema = stringSchema.check(z.cuid());
          } else if (format === "cuid2") {
            stringSchema = stringSchema.check(z.cuid2());
          } else if (format === "ulid") {
            stringSchema = stringSchema.check(z.ulid());
          } else if (format === "xid") {
            stringSchema = stringSchema.check(z.xid());
          } else if (format === "ksuid") {
            stringSchema = stringSchema.check(z.ksuid());
          }
        }
        if (typeof schema.minLength === "number") {
          stringSchema = stringSchema.min(schema.minLength);
        }
        if (typeof schema.maxLength === "number") {
          stringSchema = stringSchema.max(schema.maxLength);
        }
        if (schema.pattern) {
          stringSchema = stringSchema.regex(new RegExp(schema.pattern));
        }
        zodSchema = stringSchema;
        break;
      }
      case "number":
      case "integer": {
        let numberSchema = type === "integer" ? z.number().int() : z.number();
        if (typeof schema.minimum === "number") {
          numberSchema = numberSchema.min(schema.minimum);
        }
        if (typeof schema.maximum === "number") {
          numberSchema = numberSchema.max(schema.maximum);
        }
        if (typeof schema.exclusiveMinimum === "number") {
          numberSchema = numberSchema.gt(schema.exclusiveMinimum);
        } else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") {
          numberSchema = numberSchema.gt(schema.minimum);
        }
        if (typeof schema.exclusiveMaximum === "number") {
          numberSchema = numberSchema.lt(schema.exclusiveMaximum);
        } else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") {
          numberSchema = numberSchema.lt(schema.maximum);
        }
        if (typeof schema.multipleOf === "number") {
          numberSchema = numberSchema.multipleOf(schema.multipleOf);
        }
        zodSchema = numberSchema;
        break;
      }
      case "boolean": {
        zodSchema = z.boolean();
        break;
      }
      case "null": {
        zodSchema = z.null();
        break;
      }
      case "object": {
        const shape = {};
        const properties = schema.properties || {};
        const requiredSet = new Set(schema.required || []);
        for (const [key, propSchema] of Object.entries(properties)) {
          const propZodSchema = convertSchema(propSchema, ctx);
          shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
        }
        if (schema.propertyNames) {
          const keySchema = convertSchema(schema.propertyNames, ctx);
          const valueSchema =
            schema.additionalProperties && typeof schema.additionalProperties === "object"
              ? convertSchema(schema.additionalProperties, ctx)
              : z.any();
          if (Object.keys(shape).length === 0) {
            zodSchema = z.record(keySchema, valueSchema);
            break;
          }
          const objectSchema2 = z.object(shape).passthrough();
          const recordSchema = z.looseRecord(keySchema, valueSchema);
          zodSchema = z.intersection(objectSchema2, recordSchema);
          break;
        }
        if (schema.patternProperties) {
          const patternProps = schema.patternProperties;
          const patternKeys = Object.keys(patternProps);
          const looseRecords = [];
          for (const pattern of patternKeys) {
            const patternValue = convertSchema(patternProps[pattern], ctx);
            const keySchema = z.string().regex(new RegExp(pattern));
            looseRecords.push(z.looseRecord(keySchema, patternValue));
          }
          const schemasToIntersect = [];
          if (Object.keys(shape).length > 0) {
            schemasToIntersect.push(z.object(shape).passthrough());
          }
          schemasToIntersect.push(...looseRecords);
          if (schemasToIntersect.length === 0) {
            zodSchema = z.object({}).passthrough();
          } else if (schemasToIntersect.length === 1) {
            zodSchema = schemasToIntersect[0];
          } else {
            let result = z.intersection(schemasToIntersect[0], schemasToIntersect[1]);
            for (let i = 2; i < schemasToIntersect.length; i++) {
              result = z.intersection(result, schemasToIntersect[i]);
            }
            zodSchema = result;
          }
          break;
        }
        const objectSchema = z.object(shape);
        if (schema.additionalProperties === false) {
          zodSchema = objectSchema.strict();
        } else if (typeof schema.additionalProperties === "object") {
          zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
        } else {
          zodSchema = objectSchema.passthrough();
        }
        break;
      }
      case "array": {
        const prefixItems = schema.prefixItems;
        const items = schema.items;
        if (prefixItems && Array.isArray(prefixItems)) {
          const tupleItems = prefixItems.map((item) => convertSchema(item, ctx));
          const rest =
            items && typeof items === "object" && !Array.isArray(items)
              ? convertSchema(items, ctx)
              : void 0;
          if (rest) {
            zodSchema = z.tuple(tupleItems).rest(rest);
          } else {
            zodSchema = z.tuple(tupleItems);
          }
          if (typeof schema.minItems === "number") {
            zodSchema = zodSchema.check(z.minLength(schema.minItems));
          }
          if (typeof schema.maxItems === "number") {
            zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
          }
        } else if (Array.isArray(items)) {
          const tupleItems = items.map((item) => convertSchema(item, ctx));
          const rest =
            schema.additionalItems && typeof schema.additionalItems === "object"
              ? convertSchema(schema.additionalItems, ctx)
              : void 0;
          if (rest) {
            zodSchema = z.tuple(tupleItems).rest(rest);
          } else {
            zodSchema = z.tuple(tupleItems);
          }
          if (typeof schema.minItems === "number") {
            zodSchema = zodSchema.check(z.minLength(schema.minItems));
          }
          if (typeof schema.maxItems === "number") {
            zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
          }
        } else if (items !== void 0) {
          const element = convertSchema(items, ctx);
          let arraySchema = z.array(element);
          if (typeof schema.minItems === "number") {
            arraySchema = arraySchema.min(schema.minItems);
          }
          if (typeof schema.maxItems === "number") {
            arraySchema = arraySchema.max(schema.maxItems);
          }
          zodSchema = arraySchema;
        } else {
          zodSchema = z.array(z.any());
        }
        break;
      }
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
    return zodSchema;
  }
  function convertSchema(schema, ctx) {
    if (typeof schema === "boolean") {
      return schema ? z.any() : z.never();
    }
    let baseSchema = convertBaseSchema(schema, ctx);
    const hasExplicitType = schema.type || schema.enum !== void 0 || schema.const !== void 0;
    if (schema.anyOf && Array.isArray(schema.anyOf)) {
      const options = schema.anyOf.map((s) => convertSchema(s, ctx));
      const anyOfUnion = z.union(options);
      baseSchema = hasExplicitType ? z.intersection(baseSchema, anyOfUnion) : anyOfUnion;
    }
    if (schema.oneOf && Array.isArray(schema.oneOf)) {
      const options = schema.oneOf.map((s) => convertSchema(s, ctx));
      const oneOfUnion = z.xor(options);
      baseSchema = hasExplicitType ? z.intersection(baseSchema, oneOfUnion) : oneOfUnion;
    }
    if (schema.allOf && Array.isArray(schema.allOf)) {
      if (schema.allOf.length === 0) {
        baseSchema = hasExplicitType ? baseSchema : z.any();
      } else {
        let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
        const startIdx = hasExplicitType ? 0 : 1;
        for (let i = startIdx; i < schema.allOf.length; i++) {
          result = z.intersection(result, convertSchema(schema.allOf[i], ctx));
        }
        baseSchema = result;
      }
    }
    if (schema.nullable === true && ctx.version === "openapi-3.0") {
      baseSchema = z.nullable(baseSchema);
    }
    if (schema.readOnly === true) {
      baseSchema = z.readonly(baseSchema);
    }
    if (schema.default !== void 0) {
      baseSchema = baseSchema.default(schema.default);
    }
    const extraMeta = {};
    const coreMetadataKeys = [
      "$id",
      "id",
      "$comment",
      "$anchor",
      "$vocabulary",
      "$dynamicRef",
      "$dynamicAnchor",
    ];
    for (const key of coreMetadataKeys) {
      if (key in schema) {
        extraMeta[key] = schema[key];
      }
    }
    const contentMetadataKeys = ["contentEncoding", "contentMediaType", "contentSchema"];
    for (const key of contentMetadataKeys) {
      if (key in schema) {
        extraMeta[key] = schema[key];
      }
    }
    for (const key of Object.keys(schema)) {
      if (!RECOGNIZED_KEYS.has(key)) {
        extraMeta[key] = schema[key];
      }
    }
    if (Object.keys(extraMeta).length > 0) {
      ctx.registry.add(baseSchema, extraMeta);
    }
    if (schema.description) {
      baseSchema = baseSchema.describe(schema.description);
    }
    return baseSchema;
  }
  function fromJSONSchema(schema, params) {
    if (typeof schema === "boolean") {
      return schema ? z.any() : z.never();
    }
    let normalized;
    try {
      normalized = JSON.parse(JSON.stringify(schema));
    } catch {
      throw new Error(
        "fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas",
      );
    }
    const version2 = detectVersion(normalized, params?.defaultTarget);
    const defs = normalized.$defs || normalized.definitions || {};
    const ctx = {
      version: version2,
      defs,
      refs: /* @__PURE__ */ new Map(),
      processing: /* @__PURE__ */ new Set(),
      rootSchema: normalized,
      registry: params?.registry ?? globalRegistry,
    };
    return convertSchema(normalized, ctx);
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/coerce.js
  var coerce_exports = {};
  __export(coerce_exports, {
    bigint: () => bigint3,
    boolean: () => boolean3,
    date: () => date4,
    number: () => number3,
    string: () => string3,
  });
  function string3(params) {
    return _coercedString(ZodString, params);
  }
  function number3(params) {
    return _coercedNumber(ZodNumber, params);
  }
  function boolean3(params) {
    return _coercedBoolean(ZodBoolean, params);
  }
  function bigint3(params) {
    return _coercedBigint(ZodBigInt, params);
  }
  function date4(params) {
    return _coercedDate(ZodDate, params);
  }

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/external.js
  config(en_default());

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/index.js
  var classic_default = external_exports;

  // node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/index.js
  var v4_default = classic_default;

  // node_modules/.pnpm/cbor-x@1.6.6/node_modules/cbor-x/decode.js
  var decoder;
  try {
    decoder = new TextDecoder();
  } catch (error51) {}
  var src;
  var srcEnd;
  var position = 0;
  var EMPTY_ARRAY = [];
  var LEGACY_RECORD_INLINE_ID = 105;
  var RECORD_DEFINITIONS_ID = 57342;
  var RECORD_INLINE_ID = 57343;
  var BUNDLED_STRINGS_ID = 57337;
  var PACKED_REFERENCE_TAG_ID = 6;
  var STOP_CODE = {};
  var maxArraySize = 11281e4;
  var maxMapSize = 1681e4;
  var strings = EMPTY_ARRAY;
  var stringPosition = 0;
  var currentDecoder = {};
  var currentStructures;
  var srcString;
  var srcStringStart = 0;
  var srcStringEnd = 0;
  var bundledStrings;
  var referenceMap;
  var currentExtensions = [];
  var currentExtensionRanges = [];
  var packedValues;
  var dataView;
  var restoreMapsAsObject;
  var defaultOptions = {
    useRecords: false,
    mapsAsObjects: true,
  };
  var sequentialMode = false;
  var inlineObjectReadThreshold = 2;
  try {
    new Function("");
  } catch (error51) {
    inlineObjectReadThreshold = Infinity;
  }
  var Decoder = class _Decoder {
    constructor(options) {
      if (options) {
        if ((options.keyMap || options._keyMap) && !options.useRecords) {
          options.useRecords = false;
          options.mapsAsObjects = true;
        }
        if (options.useRecords === false && options.mapsAsObjects === void 0)
          options.mapsAsObjects = true;
        if (options.getStructures) options.getShared = options.getStructures;
        if (options.getShared && !options.structures)
          (options.structures = []).uninitialized = true;
        if (options.keyMap) {
          this.mapKey = /* @__PURE__ */ new Map();
          for (let [k, v] of Object.entries(options.keyMap)) this.mapKey.set(v, k);
        }
      }
      Object.assign(this, options);
    }
    /*
    decodeKey(key) {
    	return this.keyMap
    		? Object.keys(this.keyMap)[Object.values(this.keyMap).indexOf(key)] || key
    		: key
    }
    */
    decodeKey(key) {
      return this.keyMap ? this.mapKey.get(key) || key : key;
    }
    encodeKey(key) {
      return this.keyMap && this.keyMap.hasOwnProperty(key) ? this.keyMap[key] : key;
    }
    encodeKeys(rec) {
      if (!this._keyMap) return rec;
      let map2 = /* @__PURE__ */ new Map();
      for (let [k, v] of Object.entries(rec))
        map2.set(this._keyMap.hasOwnProperty(k) ? this._keyMap[k] : k, v);
      return map2;
    }
    decodeKeys(map2) {
      if (!this._keyMap || map2.constructor.name != "Map") return map2;
      if (!this._mapKey) {
        this._mapKey = /* @__PURE__ */ new Map();
        for (let [k, v] of Object.entries(this._keyMap)) this._mapKey.set(v, k);
      }
      let res = {};
      map2.forEach((v, k) => (res[safeKey(this._mapKey.has(k) ? this._mapKey.get(k) : k)] = v));
      return res;
    }
    mapDecode(source, end) {
      let res = this.decode(source);
      if (this._keyMap) {
        switch (res.constructor.name) {
          case "Array":
            return res.map((r) => this.decodeKeys(r));
        }
      }
      return res;
    }
    decode(source, end) {
      if (src) {
        return saveState(() => {
          clearSource();
          return this
            ? this.decode(source, end)
            : _Decoder.prototype.decode.call(defaultOptions, source, end);
        });
      }
      srcEnd = end > -1 ? end : source.length;
      position = 0;
      stringPosition = 0;
      srcStringEnd = 0;
      srcString = null;
      strings = EMPTY_ARRAY;
      bundledStrings = null;
      src = source;
      try {
        dataView =
          source.dataView ||
          (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
      } catch (error51) {
        src = null;
        if (source instanceof Uint8Array) throw error51;
        throw new Error(
          "Source must be a Uint8Array or Buffer but was a " +
            (source && typeof source == "object" ? source.constructor.name : typeof source),
        );
      }
      if (this instanceof _Decoder) {
        currentDecoder = this;
        packedValues =
          this.sharedValues &&
          (this.pack
            ? new Array(this.maxPrivatePackedValues || 16).concat(this.sharedValues)
            : this.sharedValues);
        if (this.structures) {
          currentStructures = this.structures;
          return checkedRead();
        } else if (!currentStructures || currentStructures.length > 0) {
          currentStructures = [];
        }
      } else {
        currentDecoder = defaultOptions;
        if (!currentStructures || currentStructures.length > 0) currentStructures = [];
        packedValues = null;
      }
      return checkedRead();
    }
    decodeMultiple(source, forEach) {
      let values,
        lastPosition = 0;
      try {
        let size = source.length;
        sequentialMode = true;
        let value = this ? this.decode(source, size) : defaultDecoder.decode(source, size);
        if (forEach) {
          if (forEach(value) === false) {
            return;
          }
          while (position < size) {
            lastPosition = position;
            if (forEach(checkedRead()) === false) {
              return;
            }
          }
        } else {
          values = [value];
          while (position < size) {
            lastPosition = position;
            values.push(checkedRead());
          }
          return values;
        }
      } catch (error51) {
        error51.lastPosition = lastPosition;
        error51.values = values;
        throw error51;
      } finally {
        sequentialMode = false;
        clearSource();
      }
    }
  };
  function checkedRead() {
    try {
      let result = read();
      if (bundledStrings) {
        if (position >= bundledStrings.postBundlePosition) {
          let error51 = new Error("Unexpected bundle position");
          error51.incomplete = true;
          throw error51;
        }
        position = bundledStrings.postBundlePosition;
        bundledStrings = null;
      }
      if (position == srcEnd) {
        currentStructures = null;
        src = null;
        if (referenceMap) referenceMap = null;
      } else if (position > srcEnd) {
        let error51 = new Error("Unexpected end of CBOR data");
        error51.incomplete = true;
        throw error51;
      } else if (!sequentialMode) {
        throw new Error("Data read, but end of buffer not reached");
      }
      return result;
    } catch (error51) {
      clearSource();
      if (error51 instanceof RangeError || error51.message.startsWith("Unexpected end of buffer")) {
        error51.incomplete = true;
      }
      throw error51;
    }
  }
  function endOfCBORError() {
    let error51 = new Error("Unexpected end of CBOR data");
    error51.incomplete = true;
    return error51;
  }
  function read() {
    if (!(position < srcEnd)) throw endOfCBORError();
    let token = src[position++];
    let majorType = token >> 5;
    token = token & 31;
    if (token > 23) {
      switch (token) {
        case 24:
          if (position >= srcEnd) throw endOfCBORError();
          token = src[position++];
          break;
        case 25:
          if (majorType == 7) {
            return getFloat16();
          }
          token = dataView.getUint16(position);
          position += 2;
          break;
        case 26:
          if (majorType == 7) {
            let value = dataView.getFloat32(position);
            if (currentDecoder.useFloat32 > 2) {
              let multiplier = mult10[((src[position] & 127) << 1) | (src[position + 1] >> 7)];
              position += 4;
              return ((multiplier * value + (value > 0 ? 0.5 : -0.5)) >> 0) / multiplier;
            }
            position += 4;
            return value;
          }
          token = dataView.getUint32(position);
          position += 4;
          if (majorType === 1) return -1 - token;
          break;
        case 27:
          if (majorType == 7) {
            let value = dataView.getFloat64(position);
            position += 8;
            return value;
          }
          if (majorType > 1) {
            if (dataView.getUint32(position) > 0)
              throw new Error(
                "JavaScript does not support arrays, maps, or strings with length over 4294967295",
              );
            token = dataView.getUint32(position + 4);
          } else if (currentDecoder.int64AsNumber) {
            token = dataView.getUint32(position) * 4294967296;
            token += dataView.getUint32(position + 4);
          } else token = dataView.getBigUint64(position);
          position += 8;
          break;
        case 31:
          switch (majorType) {
            case 2:
            // byte string
            case 3:
              throw new Error("Indefinite length not supported for byte or text strings");
            case 4:
              let array2 = [];
              let value,
                i = 0;
              while ((value = read()) != STOP_CODE) {
                if (i >= maxArraySize) throw new Error(`Array length exceeds ${maxArraySize}`);
                array2[i++] = value;
              }
              return majorType == 4
                ? array2
                : majorType == 3
                  ? array2.join("")
                  : Buffer.concat(array2);
            case 5:
              let key;
              if (currentDecoder.mapsAsObjects) {
                let object2 = {};
                let i2 = 0;
                if (currentDecoder.keyMap) {
                  while ((key = read()) != STOP_CODE) {
                    if (i2++ >= maxMapSize) throw new Error(`Property count exceeds ${maxMapSize}`);
                    object2[safeKey(currentDecoder.decodeKey(key))] = read();
                  }
                } else {
                  while ((key = read()) != STOP_CODE) {
                    if (i2++ >= maxMapSize) throw new Error(`Property count exceeds ${maxMapSize}`);
                    object2[safeKey(key)] = read();
                  }
                }
                return object2;
              } else {
                if (restoreMapsAsObject) {
                  currentDecoder.mapsAsObjects = true;
                  restoreMapsAsObject = false;
                }
                let map2 = /* @__PURE__ */ new Map();
                if (currentDecoder.keyMap) {
                  let i2 = 0;
                  while ((key = read()) != STOP_CODE) {
                    if (i2++ >= maxMapSize) {
                      throw new Error(`Map size exceeds ${maxMapSize}`);
                    }
                    map2.set(currentDecoder.decodeKey(key), read());
                  }
                } else {
                  let i2 = 0;
                  while ((key = read()) != STOP_CODE) {
                    if (i2++ >= maxMapSize) {
                      throw new Error(`Map size exceeds ${maxMapSize}`);
                    }
                    map2.set(key, read());
                  }
                }
                return map2;
              }
            case 7:
              return STOP_CODE;
            default:
              throw new Error("Invalid major type for indefinite length " + majorType);
          }
        default:
          throw new Error("Unknown token " + token);
      }
    }
    switch (majorType) {
      case 0:
        return token;
      case 1:
        return ~token;
      case 2:
        return readBin(token);
      case 3:
        if (srcStringEnd >= position) {
          return srcString.slice(position - srcStringStart, (position += token) - srcStringStart);
        }
        if (srcStringEnd == 0 && srcEnd < 140 && token < 32) {
          let string4 = token < 16 ? shortStringInJS(token) : longStringInJS(token);
          if (string4 != null) return string4;
        }
        return readFixedString(token);
      case 4:
        if (token >= maxArraySize) throw new Error(`Array length exceeds ${maxArraySize}`);
        if (token > srcEnd - position) throw endOfCBORError();
        let array2 = new Array(token);
        for (let i = 0; i < token; i++) array2[i] = read();
        return array2;
      case 5:
        if (token >= maxMapSize) throw new Error(`Map size exceeds ${maxArraySize}`);
        if (token > (srcEnd - position) / 2) throw endOfCBORError();
        if (currentDecoder.mapsAsObjects) {
          let object2 = {};
          if (currentDecoder.keyMap)
            for (let i = 0; i < token; i++)
              object2[safeKey(currentDecoder.decodeKey(read()))] = read();
          else for (let i = 0; i < token; i++) object2[safeKey(read())] = read();
          return object2;
        } else {
          if (restoreMapsAsObject) {
            currentDecoder.mapsAsObjects = true;
            restoreMapsAsObject = false;
          }
          let map2 = /* @__PURE__ */ new Map();
          if (currentDecoder.keyMap)
            for (let i = 0; i < token; i++) map2.set(currentDecoder.decodeKey(read()), read());
          else for (let i = 0; i < token; i++) map2.set(read(), read());
          return map2;
        }
      case 6:
        if (token >= BUNDLED_STRINGS_ID) {
          let structure = currentStructures[token & 8191];
          if (structure) {
            if (!structure.read) structure.read = createStructureReader(structure);
            return structure.read();
          }
          if (token < 65536) {
            if (token == RECORD_INLINE_ID) {
              let length = readJustLength();
              let id = read();
              let structure2 = read();
              recordDefinition(id, structure2);
              let object2 = {};
              if (currentDecoder.keyMap)
                for (let i = 2; i < length; i++) {
                  let key = currentDecoder.decodeKey(structure2[i - 2]);
                  object2[safeKey(key)] = read();
                }
              else
                for (let i = 2; i < length; i++) {
                  let key = structure2[i - 2];
                  object2[safeKey(key)] = read();
                }
              return object2;
            } else if (token == RECORD_DEFINITIONS_ID) {
              let length = readJustLength();
              let id = read();
              for (let i = 2; i < length; i++) {
                recordDefinition(id++, read());
              }
              return read();
            } else if (token == BUNDLED_STRINGS_ID) {
              return readBundleExt();
            }
            if (currentDecoder.getShared) {
              loadShared();
              structure = currentStructures[token & 8191];
              if (structure) {
                if (!structure.read) structure.read = createStructureReader(structure);
                return structure.read();
              }
            }
          }
        }
        let extension = currentExtensions[token];
        if (extension) {
          if (extension.handlesRead) return extension(read);
          else return extension(read());
        } else {
          let input = read();
          for (let i = 0; i < currentExtensionRanges.length; i++) {
            let value = currentExtensionRanges[i](token, input);
            if (value !== void 0) return value;
          }
          return new Tag(input, token);
        }
      case 7:
        switch (token) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return;
          // undefined
          case 31:
          default:
            let packedValue = (packedValues || getPackedValues())[token];
            if (packedValue !== void 0) return packedValue;
            throw new Error("Unknown token " + token);
        }
      default:
        if (isNaN(token)) throw endOfCBORError();
        throw new Error("Unknown CBOR token " + token);
    }
  }
  var validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
  function createStructureReader(structure) {
    if (!structure) throw new Error("Structure is required in record definition");
    function readObject() {
      let length = src[position++];
      length = length & 31;
      if (length > 23) {
        switch (length) {
          case 24:
            length = src[position++];
            break;
          case 25:
            length = dataView.getUint16(position);
            position += 2;
            break;
          case 26:
            length = dataView.getUint32(position);
            position += 4;
            break;
          default:
            throw new Error("Expected array header, but got " + src[position - 1]);
        }
      }
      let compiledReader = this.compiledReader;
      while (compiledReader) {
        if (compiledReader.propertyCount === length) return compiledReader(read);
        compiledReader = compiledReader.next;
      }
      if (this.slowReads++ >= inlineObjectReadThreshold) {
        let array2 = this.length == length ? this : this.slice(0, length);
        compiledReader = currentDecoder.keyMap
          ? new Function(
              "r",
              "return {" +
                array2
                  .map((k) => currentDecoder.decodeKey(k))
                  .map((k) =>
                    validName.test(k) ? safeKey(k) + ":r()" : "[" + JSON.stringify(k) + "]:r()",
                  )
                  .join(",") +
                "}",
            )
          : new Function(
              "r",
              "return {" +
                array2
                  .map((key) =>
                    validName.test(key)
                      ? safeKey(key) + ":r()"
                      : "[" + JSON.stringify(key) + "]:r()",
                  )
                  .join(",") +
                "}",
            );
        if (this.compiledReader) compiledReader.next = this.compiledReader;
        compiledReader.propertyCount = length;
        this.compiledReader = compiledReader;
        return compiledReader(read);
      }
      let object2 = {};
      if (currentDecoder.keyMap)
        for (let i = 0; i < length; i++)
          object2[safeKey(currentDecoder.decodeKey(this[i]))] = read();
      else
        for (let i = 0; i < length; i++) {
          object2[safeKey(this[i])] = read();
        }
      return object2;
    }
    structure.slowReads = 0;
    return readObject;
  }
  function safeKey(key) {
    if (typeof key === "string") return key === "__proto__" ? "__proto_" : key;
    if (typeof key === "number" || typeof key === "boolean" || typeof key === "bigint")
      return key.toString();
    if (key == null) return key + "";
    throw new Error("Invalid property name type " + typeof key);
  }
  var readFixedString = readStringJS;
  function readStringJS(length) {
    let result;
    if (length < 16) {
      if ((result = shortStringInJS(length))) return result;
    }
    if (length > 64 && decoder) return decoder.decode(src.subarray(position, (position += length)));
    const end = position + length;
    const units = [];
    result = "";
    while (position < end) {
      const byte1 = src[position++];
      if ((byte1 & 128) === 0) {
        units.push(byte1);
      } else if ((byte1 & 224) === 192) {
        if (byte1 < 194 || position >= end || (src[position] & 192) !== 128) {
          units.push(65533);
        } else {
          const byte2 = src[position++] & 63;
          units.push(((byte1 & 31) << 6) | byte2);
        }
      } else if ((byte1 & 240) === 224) {
        const byte2 = position < end ? src[position] : 0;
        if (
          position >= end ||
          (byte2 & 192) !== 128 ||
          (byte1 === 224 && byte2 < 160) ||
          (byte1 === 237 && byte2 >= 160)
        ) {
          units.push(65533);
        } else {
          position++;
          if (position >= end || (src[position] & 192) !== 128) {
            units.push(65533);
          } else {
            const byte3 = src[position++] & 63;
            units.push(((byte1 & 31) << 12) | ((byte2 & 63) << 6) | byte3);
          }
        }
      } else if ((byte1 & 248) === 240) {
        const byte2 = position < end ? src[position] : 0;
        if (
          byte1 > 244 ||
          position >= end ||
          (byte2 & 192) !== 128 ||
          (byte1 === 240 && byte2 < 144) ||
          (byte1 === 244 && byte2 >= 144)
        ) {
          units.push(65533);
        } else {
          position++;
          if (position >= end || (src[position] & 192) !== 128) {
            units.push(65533);
          } else {
            const byte3 = src[position++] & 63;
            if (position >= end || (src[position] & 192) !== 128) {
              units.push(65533);
            } else {
              const byte4 = src[position++] & 63;
              let unit = ((byte1 & 7) << 18) | ((byte2 & 63) << 12) | (byte3 << 6) | byte4;
              unit -= 65536;
              units.push(((unit >>> 10) & 1023) | 55296);
              units.push(56320 | (unit & 1023));
            }
          }
        }
      } else {
        units.push(65533);
      }
      if (units.length >= 4096) {
        result += fromCharCode.apply(String, units);
        units.length = 0;
      }
    }
    if (units.length > 0) {
      result += fromCharCode.apply(String, units);
    }
    return result;
  }
  var fromCharCode = String.fromCharCode;
  function longStringInJS(length) {
    let start = position;
    let bytes = new Array(length);
    for (let i = 0; i < length; i++) {
      const byte = src[position++];
      if ((byte & 128) > 0) {
        position = start;
        return;
      }
      bytes[i] = byte;
    }
    return fromCharCode.apply(String, bytes);
  }
  function shortStringInJS(length) {
    if (length < 4) {
      if (length < 2) {
        if (length === 0) return "";
        else {
          let a = src[position++];
          if ((a & 128) > 1) {
            position -= 1;
            return;
          }
          return fromCharCode(a);
        }
      } else {
        let a = src[position++];
        let b = src[position++];
        if ((a & 128) > 0 || (b & 128) > 0) {
          position -= 2;
          return;
        }
        if (length < 3) return fromCharCode(a, b);
        let c = src[position++];
        if ((c & 128) > 0) {
          position -= 3;
          return;
        }
        return fromCharCode(a, b, c);
      }
    } else {
      let a = src[position++];
      let b = src[position++];
      let c = src[position++];
      let d = src[position++];
      if ((a & 128) > 0 || (b & 128) > 0 || (c & 128) > 0 || (d & 128) > 0) {
        position -= 4;
        return;
      }
      if (length < 6) {
        if (length === 4) return fromCharCode(a, b, c, d);
        else {
          let e = src[position++];
          if ((e & 128) > 0) {
            position -= 5;
            return;
          }
          return fromCharCode(a, b, c, d, e);
        }
      } else if (length < 8) {
        let e = src[position++];
        let f = src[position++];
        if ((e & 128) > 0 || (f & 128) > 0) {
          position -= 6;
          return;
        }
        if (length < 7) return fromCharCode(a, b, c, d, e, f);
        let g = src[position++];
        if ((g & 128) > 0) {
          position -= 7;
          return;
        }
        return fromCharCode(a, b, c, d, e, f, g);
      } else {
        let e = src[position++];
        let f = src[position++];
        let g = src[position++];
        let h = src[position++];
        if ((e & 128) > 0 || (f & 128) > 0 || (g & 128) > 0 || (h & 128) > 0) {
          position -= 8;
          return;
        }
        if (length < 10) {
          if (length === 8) return fromCharCode(a, b, c, d, e, f, g, h);
          else {
            let i = src[position++];
            if ((i & 128) > 0) {
              position -= 9;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i);
          }
        } else if (length < 12) {
          let i = src[position++];
          let j = src[position++];
          if ((i & 128) > 0 || (j & 128) > 0) {
            position -= 10;
            return;
          }
          if (length < 11) return fromCharCode(a, b, c, d, e, f, g, h, i, j);
          let k = src[position++];
          if ((k & 128) > 0) {
            position -= 11;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
        } else {
          let i = src[position++];
          let j = src[position++];
          let k = src[position++];
          let l = src[position++];
          if ((i & 128) > 0 || (j & 128) > 0 || (k & 128) > 0 || (l & 128) > 0) {
            position -= 12;
            return;
          }
          if (length < 14) {
            if (length === 12) return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
            else {
              let m = src[position++];
              if ((m & 128) > 0) {
                position -= 13;
                return;
              }
              return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
            }
          } else {
            let m = src[position++];
            let n = src[position++];
            if ((m & 128) > 0 || (n & 128) > 0) {
              position -= 14;
              return;
            }
            if (length < 15) return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
            let o = src[position++];
            if ((o & 128) > 0) {
              position -= 15;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
          }
        }
      }
    }
  }
  function readBin(length) {
    return currentDecoder.copyBuffers
      ? // specifically use the copying slice (not the node one)
        Uint8Array.prototype.slice.call(src, position, (position += length))
      : src.subarray(position, (position += length));
  }
  var f32Array = new Float32Array(1);
  var u8Array = new Uint8Array(f32Array.buffer, 0, 4);
  function getFloat16() {
    let byte0 = src[position++];
    let byte1 = src[position++];
    let exponent = (byte0 & 127) >> 2;
    if (exponent === 31) {
      if (byte1 || byte0 & 3) return NaN;
      return byte0 & 128 ? -Infinity : Infinity;
    }
    if (exponent === 0) {
      let abs = (((byte0 & 3) << 8) | byte1) / (1 << 24);
      return byte0 & 128 ? -abs : abs;
    }
    u8Array[3] =
      (byte0 & 128) | // sign bit
      ((exponent >> 1) + 56);
    u8Array[2] =
      ((byte0 & 7) << 5) | // last exponent bit and first two mantissa bits
      (byte1 >> 3);
    u8Array[1] = byte1 << 5;
    u8Array[0] = 0;
    return f32Array[0];
  }
  var keyCache = new Array(4096);
  var Tag = class {
    constructor(value, tag) {
      this.value = value;
      this.tag = tag;
    }
  };
  currentExtensions[0] = (dateString) => {
    return new Date(dateString);
  };
  currentExtensions[1] = (epochSec) => {
    return new Date(Math.round(epochSec * 1e3));
  };
  currentExtensions[2] = (buffer) => {
    let value = BigInt(0);
    for (let i = 0, l = buffer.byteLength; i < l; i++) {
      value = BigInt(buffer[i]) + (value << BigInt(8));
    }
    return value;
  };
  currentExtensions[3] = (buffer) => {
    return BigInt(-1) - currentExtensions[2](buffer);
  };
  currentExtensions[4] = (fraction) => {
    return +(fraction[1] + "e" + fraction[0]);
  };
  currentExtensions[5] = (fraction) => {
    return fraction[1] * Math.exp(fraction[0] * Math.log(2));
  };
  var recordDefinition = (id, structure) => {
    id = id - 57344;
    let existingStructure = currentStructures[id];
    if (existingStructure && existingStructure.isShared) {
      (currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] =
        existingStructure;
    }
    currentStructures[id] = structure;
    structure.read = createStructureReader(structure);
  };
  currentExtensions[LEGACY_RECORD_INLINE_ID] = (data) => {
    let length = data.length;
    let structure = data[1];
    recordDefinition(data[0], structure);
    let object2 = {};
    for (let i = 2; i < length; i++) {
      let key = structure[i - 2];
      object2[safeKey(key)] = data[i];
    }
    return object2;
  };
  currentExtensions[14] = (value) => {
    if (bundledStrings)
      return bundledStrings[0].slice(bundledStrings.position0, (bundledStrings.position0 += value));
    return new Tag(value, 14);
  };
  currentExtensions[15] = (value) => {
    if (bundledStrings)
      return bundledStrings[1].slice(bundledStrings.position1, (bundledStrings.position1 += value));
    return new Tag(value, 15);
  };
  var glbl = { Error, RegExp };
  currentExtensions[27] = (data) => {
    return (glbl[data[0]] || Error)(data[1], data[2]);
  };
  var packedTable = (read6) => {
    if (src[position++] != 132) {
      let error51 = new Error("Packed values structure must be followed by a 4 element array");
      if (src.length < position) error51.incomplete = true;
      throw error51;
    }
    let newPackedValues = read6();
    if (!newPackedValues || !newPackedValues.length) {
      let error51 = new Error("Packed values structure must be followed by a 4 element array");
      error51.incomplete = true;
      throw error51;
    }
    packedValues = packedValues
      ? newPackedValues.concat(packedValues.slice(newPackedValues.length))
      : newPackedValues;
    packedValues.prefixes = read6();
    packedValues.suffixes = read6();
    return read6();
  };
  packedTable.handlesRead = true;
  currentExtensions[51] = packedTable;
  currentExtensions[PACKED_REFERENCE_TAG_ID] = (data) => {
    if (!packedValues) {
      if (currentDecoder.getShared) loadShared();
      else return new Tag(data, PACKED_REFERENCE_TAG_ID);
    }
    if (typeof data == "number") return packedValues[16 + (data >= 0 ? 2 * data : -2 * data - 1)];
    let error51 = new Error("No support for non-integer packed references yet");
    if (data === void 0) error51.incomplete = true;
    throw error51;
  };
  currentExtensions[28] = (read6) => {
    if (!referenceMap) {
      referenceMap = /* @__PURE__ */ new Map();
      referenceMap.id = 0;
    }
    let id = referenceMap.id++;
    let startingPosition = position;
    let token = src[position];
    let target2;
    if (token >> 5 == 4) target2 = [];
    else target2 = {};
    let refEntry = { target: target2 };
    referenceMap.set(id, refEntry);
    let targetProperties = read6();
    if (refEntry.used) {
      if (Object.getPrototypeOf(target2) !== Object.getPrototypeOf(targetProperties)) {
        position = startingPosition;
        target2 = targetProperties;
        referenceMap.set(id, { target: target2 });
        targetProperties = read6();
      }
      return Object.assign(target2, targetProperties);
    }
    refEntry.target = targetProperties;
    return targetProperties;
  };
  currentExtensions[28].handlesRead = true;
  currentExtensions[29] = (id) => {
    let refEntry = referenceMap.get(id);
    refEntry.used = true;
    return refEntry.target;
  };
  currentExtensions[258] = (array2) => new Set(array2);
  (currentExtensions[259] = (read6) => {
    if (currentDecoder.mapsAsObjects) {
      currentDecoder.mapsAsObjects = false;
      restoreMapsAsObject = true;
    }
    return read6();
  }).handlesRead = true;
  function combine(a, b) {
    if (typeof a === "string") return a + b;
    if (a instanceof Array) return a.concat(b);
    return Object.assign({}, a, b);
  }
  function getPackedValues() {
    if (!packedValues) {
      if (currentDecoder.getShared) loadShared();
      else throw new Error("No packed values available");
    }
    return packedValues;
  }
  var SHARED_DATA_TAG_ID = 1399353956;
  currentExtensionRanges.push((tag, input) => {
    if (tag >= 225 && tag <= 255) return combine(getPackedValues().prefixes[tag - 224], input);
    if (tag >= 28704 && tag <= 32767)
      return combine(getPackedValues().prefixes[tag - 28672], input);
    if (tag >= 1879052288 && tag <= 2147483647)
      return combine(getPackedValues().prefixes[tag - 1879048192], input);
    if (tag >= 216 && tag <= 223) return combine(input, getPackedValues().suffixes[tag - 216]);
    if (tag >= 27647 && tag <= 28671)
      return combine(input, getPackedValues().suffixes[tag - 27639]);
    if (tag >= 1811940352 && tag <= 1879048191)
      return combine(input, getPackedValues().suffixes[tag - 1811939328]);
    if (tag == SHARED_DATA_TAG_ID) {
      return {
        packedValues,
        structures: currentStructures.slice(0),
        version: input,
      };
    }
    if (tag == 55799) return input;
  });
  var isLittleEndianMachine = new Uint8Array(new Uint16Array([1]).buffer)[0] == 1;
  var typedArrays = [
    Uint8Array,
    Uint8ClampedArray,
    Uint16Array,
    Uint32Array,
    typeof BigUint64Array == "undefined" ? { name: "BigUint64Array" } : BigUint64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    typeof BigInt64Array == "undefined" ? { name: "BigInt64Array" } : BigInt64Array,
    Float32Array,
    Float64Array,
  ];
  var typedArrayTags = [64, 68, 69, 70, 71, 72, 77, 78, 79, 85, 86];
  for (let i = 0; i < typedArrays.length; i++) {
    registerTypedArray(typedArrays[i], typedArrayTags[i]);
  }
  function registerTypedArray(TypedArray, tag) {
    let dvMethod = "get" + TypedArray.name.slice(0, -5);
    let bytesPerElement;
    if (typeof TypedArray === "function") bytesPerElement = TypedArray.BYTES_PER_ELEMENT;
    else TypedArray = null;
    for (let littleEndian = 0; littleEndian < 2; littleEndian++) {
      if (!littleEndian && bytesPerElement == 1) continue;
      let sizeShift =
        bytesPerElement == 2 ? 1 : bytesPerElement == 4 ? 2 : bytesPerElement == 8 ? 3 : 0;
      currentExtensions[littleEndian ? tag : tag - 4] =
        bytesPerElement == 1 || littleEndian == isLittleEndianMachine
          ? (buffer) => {
              if (!TypedArray) throw new Error("Could not find typed array for code " + tag);
              if (!currentDecoder.copyBuffers) {
                if (
                  bytesPerElement === 1 ||
                  (bytesPerElement === 2 && !(buffer.byteOffset & 1)) ||
                  (bytesPerElement === 4 && !(buffer.byteOffset & 3)) ||
                  (bytesPerElement === 8 && !(buffer.byteOffset & 7))
                )
                  return new TypedArray(
                    buffer.buffer,
                    buffer.byteOffset,
                    buffer.byteLength >> sizeShift,
                  );
              }
              return new TypedArray(Uint8Array.prototype.slice.call(buffer, 0).buffer);
            }
          : (buffer) => {
              if (!TypedArray) throw new Error("Could not find typed array for code " + tag);
              let dv = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
              let elements = buffer.length >> sizeShift;
              let ta = new TypedArray(elements);
              let method = dv[dvMethod];
              for (let i = 0; i < elements; i++) {
                ta[i] = method.call(dv, i << sizeShift, littleEndian);
              }
              return ta;
            };
    }
  }
  function readBundleExt() {
    let length = readJustLength();
    let bundlePosition = position + read();
    for (let i = 2; i < length; i++) {
      let bundleLength = readJustLength();
      position += bundleLength;
    }
    let dataPosition = position;
    position = bundlePosition;
    bundledStrings = [readStringJS(readJustLength()), readStringJS(readJustLength())];
    bundledStrings.position0 = 0;
    bundledStrings.position1 = 0;
    bundledStrings.postBundlePosition = position;
    position = dataPosition;
    return read();
  }
  function readJustLength() {
    if (!(position < srcEnd)) throw endOfCBORError();
    let token = src[position++] & 31;
    if (token > 23) {
      switch (token) {
        case 24:
          if (position >= srcEnd) throw endOfCBORError();
          token = src[position++];
          break;
        case 25:
          token = dataView.getUint16(position);
          position += 2;
          break;
        case 26:
          token = dataView.getUint32(position);
          position += 4;
          break;
      }
    }
    return token;
  }
  function loadShared() {
    if (currentDecoder.getShared) {
      let sharedData =
        saveState(() => {
          src = null;
          return currentDecoder.getShared();
        }) || {};
      let updatedStructures = sharedData.structures || [];
      currentDecoder.sharedVersion = sharedData.version;
      packedValues = currentDecoder.sharedValues = sharedData.packedValues;
      if (currentStructures === true)
        currentDecoder.structures = currentStructures = updatedStructures;
      else
        currentStructures.splice.apply(
          currentStructures,
          [0, updatedStructures.length].concat(updatedStructures),
        );
    }
  }
  function saveState(callback) {
    let savedSrcEnd = srcEnd;
    let savedPosition = position;
    let savedStringPosition = stringPosition;
    let savedSrcStringStart = srcStringStart;
    let savedSrcStringEnd = srcStringEnd;
    let savedSrcString = srcString;
    let savedStrings = strings;
    let savedReferenceMap = referenceMap;
    let savedBundledStrings = bundledStrings;
    let savedSrc = new Uint8Array(src.slice(0, srcEnd));
    let savedStructures = currentStructures;
    let savedDecoder = currentDecoder;
    let savedSequentialMode = sequentialMode;
    let value = callback();
    srcEnd = savedSrcEnd;
    position = savedPosition;
    stringPosition = savedStringPosition;
    srcStringStart = savedSrcStringStart;
    srcStringEnd = savedSrcStringEnd;
    srcString = savedSrcString;
    strings = savedStrings;
    referenceMap = savedReferenceMap;
    bundledStrings = savedBundledStrings;
    src = savedSrc;
    sequentialMode = savedSequentialMode;
    currentStructures = savedStructures;
    currentDecoder = savedDecoder;
    dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
    return value;
  }
  function clearSource() {
    src = null;
    referenceMap = null;
    currentStructures = null;
  }
  var mult10 = new Array(147);
  for (let i = 0; i < 256; i++) {
    mult10[i] = +("1e" + Math.floor(45.15 - i * 0.30103));
  }
  var defaultDecoder = new Decoder({ useRecords: false });
  var decode3 = defaultDecoder.decode;
  var decodeMultiple = defaultDecoder.decodeMultiple;
  var FLOAT32_OPTIONS = {
    NEVER: 0,
    ALWAYS: 1,
    DECIMAL_ROUND: 3,
    DECIMAL_FIT: 4,
  };

  // node_modules/.pnpm/cbor-x@1.6.6/node_modules/cbor-x/encode.js
  var textEncoder;
  try {
    textEncoder = new TextEncoder();
  } catch (error51) {}
  var extensions;
  var extensionClasses;
  var Buffer2 = typeof globalThis === "object" && globalThis.Buffer;
  var hasNodeBuffer = typeof Buffer2 !== "undefined";
  var ByteArrayAllocate = hasNodeBuffer ? Buffer2.allocUnsafeSlow : Uint8Array;
  var ByteArray = hasNodeBuffer ? Buffer2 : Uint8Array;
  var MAX_STRUCTURES = 256;
  var MAX_BUFFER_SIZE = hasNodeBuffer ? 4294967296 : 2144337920;
  var throwOnIterable;
  var target;
  var targetView;
  var position2 = 0;
  var safeEnd;
  var bundledStrings2 = null;
  var MAX_BUNDLE_SIZE = 61440;
  var hasNonLatin = /[\u0080-\uFFFF]/;
  var RECORD_SYMBOL = /* @__PURE__ */ Symbol("record-id");
  var Encoder = class extends Decoder {
    constructor(options) {
      super(options);
      this.offset = 0;
      let typeBuffer;
      let start;
      let sharedStructures;
      let hasSharedUpdate;
      let structures;
      let referenceMap2;
      options = options || {};
      let encodeUtf8 = ByteArray.prototype.utf8Write
        ? function (string4, position3) {
            return target.utf8Write(string4, position3, target.byteLength - position3);
          }
        : textEncoder && textEncoder.encodeInto
          ? function (string4, position3) {
              return textEncoder.encodeInto(string4, target.subarray(position3)).written;
            }
          : false;
      let encoder = this;
      let hasSharedStructures = options.structures || options.saveStructures;
      let maxSharedStructures = options.maxSharedStructures;
      if (maxSharedStructures == null) maxSharedStructures = hasSharedStructures ? 128 : 0;
      if (maxSharedStructures > 8190) throw new Error("Maximum maxSharedStructure is 8190");
      let isSequential = options.sequential;
      if (isSequential) {
        maxSharedStructures = 0;
      }
      if (!this.structures) this.structures = [];
      if (this.saveStructures) this.saveShared = this.saveStructures;
      let samplingPackedValues,
        packedObjectMap2,
        sharedValues = options.sharedValues;
      let sharedPackedObjectMap2;
      if (sharedValues) {
        sharedPackedObjectMap2 = /* @__PURE__ */ Object.create(null);
        for (let i = 0, l = sharedValues.length; i < l; i++) {
          sharedPackedObjectMap2[sharedValues[i]] = i;
        }
      }
      let recordIdsToRemove = [];
      let transitionsCount = 0;
      let serializationsSinceTransitionRebuild = 0;
      this.mapEncode = function (value, encodeOptions) {
        if (this._keyMap && !this._mapped) {
          switch (value.constructor.name) {
            case "Array":
              value = value.map((r) => this.encodeKeys(r));
              break;
          }
        }
        return this.encode(value, encodeOptions);
      };
      this.encode = function (value, encodeOptions) {
        if (!target) {
          target = new ByteArrayAllocate(8192);
          targetView = new DataView(target.buffer, 0, 8192);
          position2 = 0;
        }
        safeEnd = target.length - 10;
        if (safeEnd - position2 < 2048) {
          target = new ByteArrayAllocate(target.length);
          targetView = new DataView(target.buffer, 0, target.length);
          safeEnd = target.length - 10;
          position2 = 0;
        } else if (encodeOptions === REUSE_BUFFER_MODE) position2 = (position2 + 7) & 2147483640;
        start = position2;
        if (encoder.useSelfDescribedHeader) {
          targetView.setUint32(position2, 3654940416);
          position2 += 3;
        }
        referenceMap2 = encoder.structuredClone ? /* @__PURE__ */ new Map() : null;
        if (encoder.bundleStrings && typeof value !== "string") {
          bundledStrings2 = [];
          bundledStrings2.size = Infinity;
        } else bundledStrings2 = null;
        sharedStructures = encoder.structures;
        if (sharedStructures) {
          if (sharedStructures.uninitialized) {
            let sharedData = encoder.getShared() || {};
            encoder.structures = sharedStructures = sharedData.structures || [];
            encoder.sharedVersion = sharedData.version;
            let sharedValues2 = (encoder.sharedValues = sharedData.packedValues);
            if (sharedValues2) {
              sharedPackedObjectMap2 = {};
              for (let i = 0, l = sharedValues2.length; i < l; i++)
                sharedPackedObjectMap2[sharedValues2[i]] = i;
            }
          }
          let sharedStructuresLength = sharedStructures.length;
          if (sharedStructuresLength > maxSharedStructures && !isSequential)
            sharedStructuresLength = maxSharedStructures;
          if (!sharedStructures.transitions) {
            sharedStructures.transitions = /* @__PURE__ */ Object.create(null);
            for (let i = 0; i < sharedStructuresLength; i++) {
              let keys = sharedStructures[i];
              if (!keys) continue;
              let nextTransition,
                transition = sharedStructures.transitions;
              for (let j = 0, l = keys.length; j < l; j++) {
                if (transition[RECORD_SYMBOL] === void 0) transition[RECORD_SYMBOL] = i;
                let key = keys[j];
                nextTransition = transition[key];
                if (!nextTransition) {
                  nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
                }
                transition = nextTransition;
              }
              transition[RECORD_SYMBOL] = i | 1048576;
            }
          }
          if (!isSequential) sharedStructures.nextId = sharedStructuresLength;
        }
        if (hasSharedUpdate) hasSharedUpdate = false;
        structures = sharedStructures || [];
        packedObjectMap2 = sharedPackedObjectMap2;
        if (options.pack) {
          let packedValues2 = /* @__PURE__ */ new Map();
          packedValues2.values = [];
          packedValues2.encoder = encoder;
          packedValues2.maxValues =
            options.maxPrivatePackedValues || (sharedPackedObjectMap2 ? 16 : Infinity);
          packedValues2.objectMap = sharedPackedObjectMap2 || false;
          packedValues2.samplingPackedValues = samplingPackedValues;
          findRepetitiveStrings(value, packedValues2);
          if (packedValues2.values.length > 0) {
            target[position2++] = 216;
            target[position2++] = 51;
            writeArrayHeader(4);
            let valuesArray = packedValues2.values;
            encode4(valuesArray);
            writeArrayHeader(0);
            writeArrayHeader(0);
            packedObjectMap2 = Object.create(sharedPackedObjectMap2 || null);
            for (let i = 0, l = valuesArray.length; i < l; i++) {
              packedObjectMap2[valuesArray[i]] = i;
            }
          }
        }
        throwOnIterable = encodeOptions & THROW_ON_ITERABLE;
        try {
          if (throwOnIterable) return;
          encode4(value);
          if (bundledStrings2) {
            writeBundles(start, encode4);
          }
          encoder.offset = position2;
          if (referenceMap2 && referenceMap2.idsToInsert) {
            position2 += referenceMap2.idsToInsert.length * 2;
            if (position2 > safeEnd) makeRoom(position2);
            encoder.offset = position2;
            let serialized = insertIds(
              target.subarray(start, position2),
              referenceMap2.idsToInsert,
            );
            referenceMap2 = null;
            return serialized;
          }
          if (encodeOptions & REUSE_BUFFER_MODE) {
            target.start = start;
            target.end = position2;
            return target;
          }
          return target.subarray(start, position2);
        } finally {
          if (sharedStructures) {
            if (serializationsSinceTransitionRebuild < 10) serializationsSinceTransitionRebuild++;
            if (sharedStructures.length > maxSharedStructures)
              sharedStructures.length = maxSharedStructures;
            if (transitionsCount > 1e4) {
              sharedStructures.transitions = null;
              serializationsSinceTransitionRebuild = 0;
              transitionsCount = 0;
              if (recordIdsToRemove.length > 0) recordIdsToRemove = [];
            } else if (recordIdsToRemove.length > 0 && !isSequential) {
              for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
                recordIdsToRemove[i][RECORD_SYMBOL] = void 0;
              }
              recordIdsToRemove = [];
            }
          }
          if (hasSharedUpdate && encoder.saveShared) {
            if (encoder.structures.length > maxSharedStructures) {
              encoder.structures = encoder.structures.slice(0, maxSharedStructures);
            }
            let returnBuffer = target.subarray(start, position2);
            if (encoder.updateSharedData() === false) return encoder.encode(value);
            return returnBuffer;
          }
          if (encodeOptions & RESET_BUFFER_MODE) position2 = start;
        }
      };
      this.findCommonStringsToPack = () => {
        samplingPackedValues = /* @__PURE__ */ new Map();
        if (!sharedPackedObjectMap2) sharedPackedObjectMap2 = /* @__PURE__ */ Object.create(null);
        return (options2) => {
          let threshold = (options2 && options2.threshold) || 4;
          let position3 = this.pack ? options2.maxPrivatePackedValues || 16 : 0;
          if (!sharedValues) sharedValues = this.sharedValues = [];
          for (let [key, status] of samplingPackedValues) {
            if (status.count > threshold) {
              sharedPackedObjectMap2[key] = position3++;
              sharedValues.push(key);
              hasSharedUpdate = true;
            }
          }
          while (this.saveShared && this.updateSharedData() === false) {}
          samplingPackedValues = null;
        };
      };
      const encode4 = (value) => {
        if (position2 > safeEnd) target = makeRoom(position2);
        var type = typeof value;
        var length;
        if (type === "string") {
          if (packedObjectMap2) {
            let packedPosition = packedObjectMap2[value];
            if (packedPosition >= 0) {
              if (packedPosition < 16) target[position2++] = packedPosition + 224;
              else {
                target[position2++] = 198;
                if (packedPosition & 1) encode4((15 - packedPosition) >> 1);
                else encode4((packedPosition - 16) >> 1);
              }
              return;
            } else if (samplingPackedValues && !options.pack) {
              let status = samplingPackedValues.get(value);
              if (status) status.count++;
              else
                samplingPackedValues.set(value, {
                  count: 1,
                });
            }
          }
          let strLength = value.length;
          if (bundledStrings2 && strLength >= 4 && strLength < 1024) {
            if ((bundledStrings2.size += strLength) > MAX_BUNDLE_SIZE) {
              let extStart;
              let maxBytes2 =
                (bundledStrings2[0]
                  ? bundledStrings2[0].length * 3 + bundledStrings2[1].length
                  : 0) + 10;
              if (position2 + maxBytes2 > safeEnd) target = makeRoom(position2 + maxBytes2);
              target[position2++] = 217;
              target[position2++] = 223;
              target[position2++] = 249;
              target[position2++] = bundledStrings2.position ? 132 : 130;
              target[position2++] = 26;
              extStart = position2 - start;
              position2 += 4;
              if (bundledStrings2.position) {
                writeBundles(start, encode4);
              }
              bundledStrings2 = ["", ""];
              bundledStrings2.size = 0;
              bundledStrings2.position = extStart;
            }
            let twoByte = hasNonLatin.test(value);
            bundledStrings2[twoByte ? 0 : 1] += value;
            target[position2++] = twoByte ? 206 : 207;
            encode4(strLength);
            return;
          }
          let headerSize;
          if (strLength < 32) {
            headerSize = 1;
          } else if (strLength < 256) {
            headerSize = 2;
          } else if (strLength < 65536) {
            headerSize = 3;
          } else {
            headerSize = 5;
          }
          let maxBytes = strLength * 3;
          if (position2 + maxBytes > safeEnd) target = makeRoom(position2 + maxBytes);
          if (strLength < 64 || !encodeUtf8) {
            let i,
              c1,
              c2,
              strPosition = position2 + headerSize;
            for (i = 0; i < strLength; i++) {
              c1 = value.charCodeAt(i);
              if (c1 < 128) {
                target[strPosition++] = c1;
              } else if (c1 < 2048) {
                target[strPosition++] = (c1 >> 6) | 192;
                target[strPosition++] = (c1 & 63) | 128;
              } else if (
                (c1 & 64512) === 55296 &&
                ((c2 = value.charCodeAt(i + 1)) & 64512) === 56320
              ) {
                c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
                i++;
                target[strPosition++] = (c1 >> 18) | 240;
                target[strPosition++] = ((c1 >> 12) & 63) | 128;
                target[strPosition++] = ((c1 >> 6) & 63) | 128;
                target[strPosition++] = (c1 & 63) | 128;
              } else {
                target[strPosition++] = (c1 >> 12) | 224;
                target[strPosition++] = ((c1 >> 6) & 63) | 128;
                target[strPosition++] = (c1 & 63) | 128;
              }
            }
            length = strPosition - position2 - headerSize;
          } else {
            length = encodeUtf8(value, position2 + headerSize, maxBytes);
          }
          if (length < 24) {
            target[position2++] = 96 | length;
          } else if (length < 256) {
            if (headerSize < 2) {
              target.copyWithin(position2 + 2, position2 + 1, position2 + 1 + length);
            }
            target[position2++] = 120;
            target[position2++] = length;
          } else if (length < 65536) {
            if (headerSize < 3) {
              target.copyWithin(position2 + 3, position2 + 2, position2 + 2 + length);
            }
            target[position2++] = 121;
            target[position2++] = length >> 8;
            target[position2++] = length & 255;
          } else {
            if (headerSize < 5) {
              target.copyWithin(position2 + 5, position2 + 3, position2 + 3 + length);
            }
            target[position2++] = 122;
            targetView.setUint32(position2, length);
            position2 += 4;
          }
          position2 += length;
        } else if (type === "number") {
          if (!this.alwaysUseFloat && value >>> 0 === value) {
            if (value < 24) {
              target[position2++] = value;
            } else if (value < 256) {
              target[position2++] = 24;
              target[position2++] = value;
            } else if (value < 65536) {
              target[position2++] = 25;
              target[position2++] = value >> 8;
              target[position2++] = value & 255;
            } else {
              target[position2++] = 26;
              targetView.setUint32(position2, value);
              position2 += 4;
            }
          } else if (!this.alwaysUseFloat && value >> 0 === value) {
            if (value >= -24) {
              target[position2++] = 31 - value;
            } else if (value >= -256) {
              target[position2++] = 56;
              target[position2++] = ~value;
            } else if (value >= -65536) {
              target[position2++] = 57;
              targetView.setUint16(position2, ~value);
              position2 += 2;
            } else {
              target[position2++] = 58;
              targetView.setUint32(position2, ~value);
              position2 += 4;
            }
          } else if (
            !this.alwaysUseFloat &&
            value < 0 &&
            value >= -4294967296 &&
            Math.floor(value) === value
          ) {
            target[position2++] = 58;
            targetView.setUint32(position2, -1 - value);
            position2 += 4;
          } else {
            let useFloat32;
            if ((useFloat32 = this.useFloat32) > 0 && value < 4294967296 && value >= -2147483648) {
              target[position2++] = 250;
              targetView.setFloat32(position2, value);
              let xShifted;
              if (
                useFloat32 < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
                (xShifted =
                  value *
                  mult10[((target[position2] & 127) << 1) | (target[position2 + 1] >> 7)]) >>
                  0 ===
                  xShifted
              ) {
                position2 += 4;
                return;
              } else position2--;
            }
            target[position2++] = 251;
            targetView.setFloat64(position2, value);
            position2 += 8;
          }
        } else if (type === "object") {
          if (!value) target[position2++] = 246;
          else {
            if (referenceMap2) {
              let referee = referenceMap2.get(value);
              if (referee) {
                target[position2++] = 216;
                target[position2++] = 29;
                target[position2++] = 25;
                if (!referee.references) {
                  let idsToInsert = referenceMap2.idsToInsert || (referenceMap2.idsToInsert = []);
                  referee.references = [];
                  idsToInsert.push(referee);
                }
                referee.references.push(position2 - start);
                position2 += 2;
                return;
              } else referenceMap2.set(value, { offset: position2 - start });
            }
            let constructor = value.constructor;
            if (constructor === Object) {
              if (this.skipFunction === true) {
                value = Object.fromEntries([
                  ...Object.keys(value)
                    .filter((x) => typeof value[x] !== "function")
                    .map((x) => [x, value[x]]),
                ]);
              }
              writeObject(value);
            } else if (constructor === Array) {
              length = value.length;
              if (length < 24) {
                target[position2++] = 128 | length;
              } else {
                writeArrayHeader(length);
              }
              for (let i = 0; i < length; i++) {
                encode4(value[i]);
              }
            } else if (constructor === Map) {
              if (this.mapsAsObjects ? this.useTag259ForMaps !== false : this.useTag259ForMaps) {
                target[position2++] = 217;
                target[position2++] = 1;
                target[position2++] = 3;
              }
              length = value.size;
              if (length < 24) {
                target[position2++] = 160 | length;
              } else if (length < 256) {
                target[position2++] = 184;
                target[position2++] = length;
              } else if (length < 65536) {
                target[position2++] = 185;
                target[position2++] = length >> 8;
                target[position2++] = length & 255;
              } else {
                target[position2++] = 186;
                targetView.setUint32(position2, length);
                position2 += 4;
              }
              if (encoder.keyMap) {
                for (let [key, entryValue] of value) {
                  encode4(encoder.encodeKey(key));
                  encode4(entryValue);
                }
              } else {
                for (let [key, entryValue] of value) {
                  encode4(key);
                  encode4(entryValue);
                }
              }
            } else {
              for (let i = 0, l = extensions.length; i < l; i++) {
                let extensionClass = extensionClasses[i];
                if (value instanceof extensionClass) {
                  let extension = extensions[i];
                  let tag = extension.tag;
                  if (tag == void 0) tag = extension.getTag && extension.getTag.call(this, value);
                  if (tag < 24) {
                    target[position2++] = 192 | tag;
                  } else if (tag < 256) {
                    target[position2++] = 216;
                    target[position2++] = tag;
                  } else if (tag < 65536) {
                    target[position2++] = 217;
                    target[position2++] = tag >> 8;
                    target[position2++] = tag & 255;
                  } else if (tag > -1) {
                    target[position2++] = 218;
                    targetView.setUint32(position2, tag);
                    position2 += 4;
                  }
                  extension.encode.call(this, value, encode4, makeRoom);
                  return;
                }
              }
              if (value[Symbol.iterator]) {
                if (throwOnIterable) {
                  let error51 = new Error("Iterable should be serialized as iterator");
                  error51.iteratorNotHandled = true;
                  throw error51;
                }
                target[position2++] = 159;
                for (let entry of value) {
                  encode4(entry);
                }
                target[position2++] = 255;
                return;
              }
              if (value[Symbol.asyncIterator] || isBlob(value)) {
                let error51 = new Error("Iterable/blob should be serialized as iterator");
                error51.iteratorNotHandled = true;
                throw error51;
              }
              if (this.useToJSON && value.toJSON) {
                const json2 = value.toJSON();
                if (json2 !== value) return encode4(json2);
              }
              writeObject(value);
            }
          }
        } else if (type === "boolean") {
          target[position2++] = value ? 245 : 244;
        } else if (type === "bigint") {
          if (value < BigInt(1) << BigInt(64) && value >= 0) {
            target[position2++] = 27;
            targetView.setBigUint64(position2, value);
          } else if (value > -(BigInt(1) << BigInt(64)) && value < 0) {
            target[position2++] = 59;
            targetView.setBigUint64(position2, -value - BigInt(1));
          } else {
            if (this.largeBigIntToFloat) {
              target[position2++] = 251;
              targetView.setFloat64(position2, Number(value));
            } else {
              if (value >= BigInt(0)) target[position2++] = 194;
              else {
                target[position2++] = 195;
                value = BigInt(-1) - value;
              }
              let bytes = [];
              while (value) {
                bytes.push(Number(value & BigInt(255)));
                value >>= BigInt(8);
              }
              writeBuffer(new Uint8Array(bytes.reverse()), makeRoom);
              return;
            }
          }
          position2 += 8;
        } else if (type === "undefined") {
          target[position2++] = 247;
        } else {
          throw new Error("Unknown type: " + type);
        }
      };
      const writeObject =
        this.useRecords === false
          ? this.variableMapSize
            ? (object2) => {
                let keys = Object.keys(object2);
                let vals = Object.values(object2);
                let length = keys.length;
                if (length < 24) {
                  target[position2++] = 160 | length;
                } else if (length < 256) {
                  target[position2++] = 184;
                  target[position2++] = length;
                } else if (length < 65536) {
                  target[position2++] = 185;
                  target[position2++] = length >> 8;
                  target[position2++] = length & 255;
                } else {
                  target[position2++] = 186;
                  targetView.setUint32(position2, length);
                  position2 += 4;
                }
                let key;
                if (encoder.keyMap) {
                  for (let i = 0; i < length; i++) {
                    encode4(encoder.encodeKey(keys[i]));
                    encode4(vals[i]);
                  }
                } else {
                  for (let i = 0; i < length; i++) {
                    encode4(keys[i]);
                    encode4(vals[i]);
                  }
                }
              }
            : (object2) => {
                target[position2++] = 185;
                let objectOffset = position2 - start;
                position2 += 2;
                let size = 0;
                if (encoder.keyMap) {
                  for (let key in object2)
                    if (
                      typeof object2.hasOwnProperty !== "function" ||
                      object2.hasOwnProperty(key)
                    ) {
                      encode4(encoder.encodeKey(key));
                      encode4(object2[key]);
                      size++;
                    }
                } else {
                  for (let key in object2)
                    if (
                      typeof object2.hasOwnProperty !== "function" ||
                      object2.hasOwnProperty(key)
                    ) {
                      encode4(key);
                      encode4(object2[key]);
                      size++;
                    }
                }
                target[objectOffset++ + start] = size >> 8;
                target[objectOffset + start] = size & 255;
              }
          : (object2, skipValues) => {
              let nextTransition,
                transition =
                  structures.transitions ||
                  (structures.transitions = /* @__PURE__ */ Object.create(null));
              let newTransitions = 0;
              let length = 0;
              let parentRecordId;
              let keys;
              if (this.keyMap) {
                keys = Object.keys(object2).map((k) => this.encodeKey(k));
                length = keys.length;
                for (let i = 0; i < length; i++) {
                  let key = keys[i];
                  nextTransition = transition[key];
                  if (!nextTransition) {
                    nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
                    newTransitions++;
                  }
                  transition = nextTransition;
                }
              } else {
                for (let key in object2)
                  if (typeof object2.hasOwnProperty !== "function" || object2.hasOwnProperty(key)) {
                    nextTransition = transition[key];
                    if (!nextTransition) {
                      if (transition[RECORD_SYMBOL] & 1048576) {
                        parentRecordId = transition[RECORD_SYMBOL] & 65535;
                      }
                      nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
                      newTransitions++;
                    }
                    transition = nextTransition;
                    length++;
                  }
              }
              let recordId = transition[RECORD_SYMBOL];
              if (recordId !== void 0) {
                recordId &= 65535;
                target[position2++] = 217;
                target[position2++] = (recordId >> 8) | 224;
                target[position2++] = recordId & 255;
              } else {
                if (!keys)
                  keys = transition.__keys__ || (transition.__keys__ = Object.keys(object2));
                if (parentRecordId === void 0) {
                  recordId = structures.nextId++;
                  if (!recordId) {
                    recordId = 0;
                    structures.nextId = 1;
                  }
                  if (recordId >= MAX_STRUCTURES) {
                    structures.nextId = (recordId = maxSharedStructures) + 1;
                  }
                } else {
                  recordId = parentRecordId;
                }
                structures[recordId] = keys;
                if (recordId < maxSharedStructures) {
                  target[position2++] = 217;
                  target[position2++] = (recordId >> 8) | 224;
                  target[position2++] = recordId & 255;
                  transition = structures.transitions;
                  for (let i = 0; i < length; i++) {
                    if (transition[RECORD_SYMBOL] === void 0 || transition[RECORD_SYMBOL] & 1048576)
                      transition[RECORD_SYMBOL] = recordId;
                    transition = transition[keys[i]];
                  }
                  transition[RECORD_SYMBOL] = recordId | 1048576;
                  hasSharedUpdate = true;
                } else {
                  transition[RECORD_SYMBOL] = recordId;
                  targetView.setUint32(position2, 3655335680);
                  position2 += 3;
                  if (newTransitions)
                    transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
                  if (recordIdsToRemove.length >= MAX_STRUCTURES - maxSharedStructures)
                    recordIdsToRemove.shift()[RECORD_SYMBOL] = void 0;
                  recordIdsToRemove.push(transition);
                  writeArrayHeader(length + 2);
                  encode4(57344 + recordId);
                  encode4(keys);
                  if (skipValues) return;
                  for (let key in object2)
                    if (typeof object2.hasOwnProperty !== "function" || object2.hasOwnProperty(key))
                      encode4(object2[key]);
                  return;
                }
              }
              if (length < 24) {
                target[position2++] = 128 | length;
              } else {
                writeArrayHeader(length);
              }
              if (skipValues) return;
              for (let key in object2)
                if (typeof object2.hasOwnProperty !== "function" || object2.hasOwnProperty(key))
                  encode4(object2[key]);
            };
      const makeRoom = (end) => {
        let newSize;
        if (end > 16777216) {
          if (end - start > MAX_BUFFER_SIZE)
            throw new Error("Encoded buffer would be larger than maximum buffer size");
          newSize = Math.min(
            MAX_BUFFER_SIZE,
            Math.round(Math.max((end - start) * (end > 67108864 ? 1.25 : 2), 4194304) / 4096) *
              4096,
          );
        } else newSize = ((Math.max((end - start) << 2, target.length - 1) >> 12) + 1) << 12;
        let newBuffer = new ByteArrayAllocate(newSize);
        targetView = new DataView(newBuffer.buffer, 0, newSize);
        if (target.copy) target.copy(newBuffer, 0, start, end);
        else newBuffer.set(target.slice(start, end));
        position2 -= start;
        start = 0;
        safeEnd = newBuffer.length - 10;
        return (target = newBuffer);
      };
      let chunkThreshold = 100;
      let continuedChunkThreshold = 1e3;
      this.encodeAsIterable = function (value, options2) {
        return startEncoding(value, options2, encodeObjectAsIterable);
      };
      this.encodeAsAsyncIterable = function (value, options2) {
        return startEncoding(value, options2, encodeObjectAsAsyncIterable);
      };
      function* encodeObjectAsIterable(object2, iterateProperties, finalIterable) {
        let constructor = object2.constructor;
        if (constructor === Object) {
          let useRecords = encoder.useRecords !== false;
          if (useRecords) writeObject(object2, true);
          else writeEntityLength(Object.keys(object2).length, 160);
          for (let key in object2) {
            let value = object2[key];
            if (!useRecords) encode4(key);
            if (value && typeof value === "object") {
              if (iterateProperties[key])
                yield* encodeObjectAsIterable(value, iterateProperties[key]);
              else yield* tryEncode(value, iterateProperties, key);
            } else encode4(value);
          }
        } else if (constructor === Array) {
          let length = object2.length;
          writeArrayHeader(length);
          for (let i = 0; i < length; i++) {
            let value = object2[i];
            if (value && (typeof value === "object" || position2 - start > chunkThreshold)) {
              if (iterateProperties.element)
                yield* encodeObjectAsIterable(value, iterateProperties.element);
              else yield* tryEncode(value, iterateProperties, "element");
            } else encode4(value);
          }
        } else if (object2[Symbol.iterator] && !object2.buffer) {
          target[position2++] = 159;
          for (let value of object2) {
            if (value && (typeof value === "object" || position2 - start > chunkThreshold)) {
              if (iterateProperties.element)
                yield* encodeObjectAsIterable(value, iterateProperties.element);
              else yield* tryEncode(value, iterateProperties, "element");
            } else encode4(value);
          }
          target[position2++] = 255;
        } else if (isBlob(object2)) {
          writeEntityLength(object2.size, 64);
          yield target.subarray(start, position2);
          yield object2;
          restartEncoding();
        } else if (object2[Symbol.asyncIterator]) {
          target[position2++] = 159;
          yield target.subarray(start, position2);
          yield object2;
          restartEncoding();
          target[position2++] = 255;
        } else {
          encode4(object2);
        }
        if (finalIterable && position2 > start) yield target.subarray(start, position2);
        else if (position2 - start > chunkThreshold) {
          yield target.subarray(start, position2);
          restartEncoding();
        }
      }
      function* tryEncode(value, iterateProperties, key) {
        let restart = position2 - start;
        try {
          encode4(value);
          if (position2 - start > chunkThreshold) {
            yield target.subarray(start, position2);
            restartEncoding();
          }
        } catch (error51) {
          if (error51.iteratorNotHandled) {
            iterateProperties[key] = {};
            position2 = start + restart;
            yield* encodeObjectAsIterable.call(this, value, iterateProperties[key]);
          } else throw error51;
        }
      }
      function restartEncoding() {
        chunkThreshold = continuedChunkThreshold;
        encoder.encode(null, THROW_ON_ITERABLE);
      }
      function startEncoding(value, options2, encodeIterable) {
        if (options2 && options2.chunkThreshold)
          chunkThreshold = continuedChunkThreshold = options2.chunkThreshold;
        else chunkThreshold = 100;
        if (value && typeof value === "object") {
          encoder.encode(null, THROW_ON_ITERABLE);
          return encodeIterable(
            value,
            encoder.iterateProperties || (encoder.iterateProperties = {}),
            true,
          );
        }
        return [encoder.encode(value)];
      }
      async function* encodeObjectAsAsyncIterable(value, iterateProperties) {
        for (let encodedValue of encodeObjectAsIterable(value, iterateProperties, true)) {
          let constructor = encodedValue.constructor;
          if (constructor === ByteArray || constructor === Uint8Array) yield encodedValue;
          else if (isBlob(encodedValue)) {
            let reader = encodedValue.stream().getReader();
            let next;
            while (!(next = await reader.read()).done) {
              yield next.value;
            }
          } else if (encodedValue[Symbol.asyncIterator]) {
            for await (let asyncValue of encodedValue) {
              restartEncoding();
              if (asyncValue)
                yield* encodeObjectAsAsyncIterable(
                  asyncValue,
                  iterateProperties.async || (iterateProperties.async = {}),
                );
              else yield encoder.encode(asyncValue);
            }
          } else {
            yield encodedValue;
          }
        }
      }
    }
    useBuffer(buffer) {
      target = buffer;
      targetView = new DataView(target.buffer, target.byteOffset, target.byteLength);
      position2 = 0;
    }
    clearSharedData() {
      if (this.structures) this.structures = [];
      if (this.sharedValues) this.sharedValues = void 0;
    }
    updateSharedData() {
      let lastVersion = this.sharedVersion || 0;
      this.sharedVersion = lastVersion + 1;
      let structuresCopy = this.structures.slice(0);
      let sharedData = new SharedData(structuresCopy, this.sharedValues, this.sharedVersion);
      let saveResults = this.saveShared(
        sharedData,
        (existingShared) => ((existingShared && existingShared.version) || 0) == lastVersion,
      );
      if (saveResults === false) {
        sharedData = this.getShared() || {};
        this.structures = sharedData.structures || [];
        this.sharedValues = sharedData.packedValues;
        this.sharedVersion = sharedData.version;
        this.structures.nextId = this.structures.length;
      } else {
        structuresCopy.forEach((structure, i) => (this.structures[i] = structure));
      }
      return saveResults;
    }
  };
  function writeEntityLength(length, majorValue) {
    if (length < 24) target[position2++] = majorValue | length;
    else if (length < 256) {
      target[position2++] = majorValue | 24;
      target[position2++] = length;
    } else if (length < 65536) {
      target[position2++] = majorValue | 25;
      target[position2++] = length >> 8;
      target[position2++] = length & 255;
    } else {
      target[position2++] = majorValue | 26;
      targetView.setUint32(position2, length);
      position2 += 4;
    }
  }
  var SharedData = class {
    constructor(structures, values, version2) {
      this.structures = structures;
      this.packedValues = values;
      this.version = version2;
    }
  };
  function writeArrayHeader(length) {
    if (length < 24) target[position2++] = 128 | length;
    else if (length < 256) {
      target[position2++] = 152;
      target[position2++] = length;
    } else if (length < 65536) {
      target[position2++] = 153;
      target[position2++] = length >> 8;
      target[position2++] = length & 255;
    } else {
      target[position2++] = 154;
      targetView.setUint32(position2, length);
      position2 += 4;
    }
  }
  var BlobConstructor = typeof Blob === "undefined" ? function () {} : Blob;
  function isBlob(object2) {
    if (object2 instanceof BlobConstructor) return true;
    let tag = object2[Symbol.toStringTag];
    return tag === "Blob" || tag === "File";
  }
  function findRepetitiveStrings(value, packedValues2) {
    switch (typeof value) {
      case "string":
        if (value.length > 3) {
          if (
            packedValues2.objectMap[value] > -1 ||
            packedValues2.values.length >= packedValues2.maxValues
          )
            return;
          let packedStatus = packedValues2.get(value);
          if (packedStatus) {
            if (++packedStatus.count == 2) {
              packedValues2.values.push(value);
            }
          } else {
            packedValues2.set(value, {
              count: 1,
            });
            if (packedValues2.samplingPackedValues) {
              let status = packedValues2.samplingPackedValues.get(value);
              if (status) status.count++;
              else
                packedValues2.samplingPackedValues.set(value, {
                  count: 1,
                });
            }
          }
        }
        break;
      case "object":
        if (value) {
          if (value instanceof Array) {
            for (let i = 0, l = value.length; i < l; i++) {
              findRepetitiveStrings(value[i], packedValues2);
            }
          } else {
            let includeKeys = !packedValues2.encoder.useRecords;
            for (var key in value) {
              if (value.hasOwnProperty(key)) {
                if (includeKeys) findRepetitiveStrings(key, packedValues2);
                findRepetitiveStrings(value[key], packedValues2);
              }
            }
          }
        }
        break;
      case "function":
        console.log(value);
    }
  }
  var isLittleEndianMachine2 = new Uint8Array(new Uint16Array([1]).buffer)[0] == 1;
  extensionClasses = [
    Date,
    Set,
    Error,
    RegExp,
    Tag,
    ArrayBuffer,
    Uint8Array,
    Uint8ClampedArray,
    Uint16Array,
    Uint32Array,
    typeof BigUint64Array == "undefined" ? function () {} : BigUint64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    typeof BigInt64Array == "undefined" ? function () {} : BigInt64Array,
    Float32Array,
    Float64Array,
    SharedData,
  ];
  extensions = [
    {
      // Date
      tag: 1,
      encode(date5, encode4) {
        let seconds = date5.getTime() / 1e3;
        if (
          (this.useTimestamp32 || date5.getMilliseconds() === 0) &&
          seconds >= 0 &&
          seconds < 4294967296
        ) {
          target[position2++] = 26;
          targetView.setUint32(position2, seconds);
          position2 += 4;
        } else {
          target[position2++] = 251;
          targetView.setFloat64(position2, seconds);
          position2 += 8;
        }
      },
    },
    {
      // Set
      tag: 258,
      // https://github.com/input-output-hk/cbor-sets-spec/blob/master/CBOR_SETS.md
      encode(set2, encode4) {
        let array2 = Array.from(set2);
        encode4(array2);
      },
    },
    {
      // Error
      tag: 27,
      // http://cbor.schmorp.de/generic-object
      encode(error51, encode4) {
        encode4([error51.name, error51.message]);
      },
    },
    {
      // RegExp
      tag: 27,
      // http://cbor.schmorp.de/generic-object
      encode(regex, encode4) {
        encode4(["RegExp", regex.source, regex.flags]);
      },
    },
    {
      // Tag
      getTag(tag) {
        return tag.tag;
      },
      encode(tag, encode4) {
        encode4(tag.value);
      },
    },
    {
      // ArrayBuffer
      encode(arrayBuffer, encode4, makeRoom) {
        writeBuffer(arrayBuffer, makeRoom);
      },
    },
    {
      // Uint8Array
      getTag(typedArray) {
        if (typedArray.constructor === Uint8Array) {
          if (this.tagUint8Array || (hasNodeBuffer && this.tagUint8Array !== false)) return 64;
        }
      },
      encode(typedArray, encode4, makeRoom) {
        writeBuffer(typedArray, makeRoom);
      },
    },
    typedArrayEncoder(68, 1),
    typedArrayEncoder(69, 2),
    typedArrayEncoder(70, 4),
    typedArrayEncoder(71, 8),
    typedArrayEncoder(72, 1),
    typedArrayEncoder(77, 2),
    typedArrayEncoder(78, 4),
    typedArrayEncoder(79, 8),
    typedArrayEncoder(85, 4),
    typedArrayEncoder(86, 8),
    {
      encode(sharedData, encode4) {
        let packedValues2 = sharedData.packedValues || [];
        let sharedStructures = sharedData.structures || [];
        if (packedValues2.values.length > 0) {
          target[position2++] = 216;
          target[position2++] = 51;
          writeArrayHeader(4);
          let valuesArray = packedValues2.values;
          encode4(valuesArray);
          writeArrayHeader(0);
          writeArrayHeader(0);
          packedObjectMap = Object.create(sharedPackedObjectMap || null);
          for (let i = 0, l = valuesArray.length; i < l; i++) {
            packedObjectMap[valuesArray[i]] = i;
          }
        }
        if (sharedStructures) {
          targetView.setUint32(position2, 3655335424);
          position2 += 3;
          let definitions = sharedStructures.slice(0);
          definitions.unshift(57344);
          definitions.push(new Tag(sharedData.version, 1399353956));
          encode4(definitions);
        } else encode4(new Tag(sharedData.version, 1399353956));
      },
    },
  ];
  function typedArrayEncoder(tag, size) {
    if (!isLittleEndianMachine2 && size > 1) tag -= 4;
    return {
      tag,
      encode: function writeExtBuffer(typedArray, encode4) {
        let length = typedArray.byteLength;
        let offset = typedArray.byteOffset || 0;
        let buffer = typedArray.buffer || typedArray;
        encode4(
          hasNodeBuffer
            ? Buffer2.from(buffer, offset, length)
            : new Uint8Array(buffer, offset, length),
        );
      },
    };
  }
  function writeBuffer(buffer, makeRoom) {
    let length = buffer.byteLength;
    if (length < 24) {
      target[position2++] = 64 + length;
    } else if (length < 256) {
      target[position2++] = 88;
      target[position2++] = length;
    } else if (length < 65536) {
      target[position2++] = 89;
      target[position2++] = length >> 8;
      target[position2++] = length & 255;
    } else {
      target[position2++] = 90;
      targetView.setUint32(position2, length);
      position2 += 4;
    }
    if (position2 + length >= target.length) {
      makeRoom(position2 + length);
    }
    target.set(buffer.buffer ? buffer : new Uint8Array(buffer), position2);
    position2 += length;
  }
  function insertIds(serialized, idsToInsert) {
    let nextId;
    let distanceToMove = idsToInsert.length * 2;
    let lastEnd = serialized.length - distanceToMove;
    idsToInsert.sort((a, b) => (a.offset > b.offset ? 1 : -1));
    for (let id = 0; id < idsToInsert.length; id++) {
      let referee = idsToInsert[id];
      referee.id = id;
      for (let position3 of referee.references) {
        serialized[position3++] = id >> 8;
        serialized[position3] = id & 255;
      }
    }
    while ((nextId = idsToInsert.pop())) {
      let offset = nextId.offset;
      serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
      distanceToMove -= 2;
      let position3 = offset + distanceToMove;
      serialized[position3++] = 216;
      serialized[position3++] = 28;
      lastEnd = offset;
    }
    return serialized;
  }
  function writeBundles(start, encode4) {
    targetView.setUint32(
      bundledStrings2.position + start,
      position2 - bundledStrings2.position - start + 1,
    );
    let writeStrings = bundledStrings2;
    bundledStrings2 = null;
    encode4(writeStrings[0]);
    encode4(writeStrings[1]);
  }
  var defaultEncoder = new Encoder({ useRecords: false });
  var encode3 = defaultEncoder.encode;
  var encodeAsIterable = defaultEncoder.encodeAsIterable;
  var encodeAsAsyncIterable = defaultEncoder.encodeAsAsyncIterable;
  var { NEVER: NEVER2, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = FLOAT32_OPTIONS;
  var REUSE_BUFFER_MODE = 512;
  var RESET_BUFFER_MODE = 1024;
  var THROW_ON_ITERABLE = 2048;

  // node_modules/.pnpm/rivetkit@2.3.17_@libsql+client@0.18.0_@opentelemetry+api@1.9.0_better-sqlite3@12.11.1_sql.js@1.14.2_ws@8.21.3/node_modules/rivetkit/dist/browser/client.js
  var import_invariant = __toESM(require_browser2(), 1);
  var import_invariant2 = __toESM(require_browser2(), 1);
  var import_invariant3 = __toESM(require_browser2(), 1);

  // node_modules/.pnpm/vbare@0.0.4/node_modules/vbare/dist/index.mjs
  var VersionedDataHandler = class {
    constructor(config2) {
      this.config = config2;
    }
    // Deserialize bytes of a given version into latest L
    deserialize(bytes, version2) {
      let data = this.config.deserializeVersion(bytes, version2);
      const converters = this.config.deserializeConverters();
      for (let i = Math.max(0, version2 - 1); i < converters.length; i++) {
        data = converters[i](data);
      }
      return data;
    }
    // Serialize an S (which may represent any version) to target `version`
    serialize(data, version2) {
      let cur = data;
      const converters = this.config.serializeConverters();
      for (let i = Math.max(0, version2 - 1); i < converters.length; i++) {
        cur = converters[i](cur);
      }
      return this.config.serializeVersion(cur, version2);
    }
    // Helpers that embed a u16 (LE) version prefix, like Rust
    serializeWithEmbeddedVersion(data, version2) {
      const payload = this.serialize(data, version2);
      const versionBytes = new Uint8Array(2);
      new DataView(versionBytes.buffer).setUint16(0, version2, true);
      const out = new Uint8Array(2 + payload.length);
      out.set(versionBytes, 0);
      out.set(payload, 2);
      return out;
    }
    deserializeWithEmbeddedVersion(bytes) {
      if (bytes.length < 2) {
        throw new Error("payload too short for embedded version");
      }
      const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const version2 = dv.getUint16(0, true);
      const payload = bytes.slice(2);
      return this.deserialize(payload, version2);
    }
    // Utility kept for completeness in case callers want it.
    embedVersion(data) {
      const versionBytes = new Uint8Array(2);
      new DataView(versionBytes.buffer).setUint16(0, data.version, true);
      const result = new Uint8Array(versionBytes.length + data.data.length);
      result.set(versionBytes);
      result.set(data.data, versionBytes.length);
      return result;
    }
    extractVersion(bytes) {
      if (bytes.length < 2) {
        throw new Error("Invalid versioned data: too short");
      }
      const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const version2 = dv.getUint16(0, true);
      const data = bytes.slice(2);
      return { version: version2, data };
    }
  };
  function createVersionedDataHandler(config2) {
    return new VersionedDataHandler(config2);
  }

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/imports/dev.js
  var DEV = false;

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/util/assert.js
  var V8Error = Error;
  function assert2(test, message = "") {
    if (!test) {
      const e = new AssertionError(message);
      V8Error.captureStackTrace?.(e, assert2);
      throw e;
    }
  }
  var AssertionError = class extends Error {
    constructor() {
      super(...arguments);
      this.name = "AssertionError";
    }
  };

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/util/validator.js
  function isU8(val) {
    return val === (val & 255);
  }
  function isU32(val) {
    return val === val >>> 0;
  }
  function isU64(val) {
    return val === BigInt.asUintN(64, val);
  }

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/util/constants.js
  var TEXT_DECODER_THRESHOLD = 256;
  var TEXT_ENCODER_THRESHOLD = 256;
  var UINT_MAX_BYTE_COUNT = 10;
  var UINT_SAFE32_MAX_BYTE_COUNT = 5;
  var INVALID_UTF8_STRING = "invalid UTF-8 string";
  var NON_CANONICAL_REPRESENTATION = "must be canonical";
  var TOO_LARGE_BUFFER = "too large buffer";
  var TOO_LARGE_NUMBER = "too large number";

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/core/bare-error.js
  var BareError = class extends Error {
    constructor(offset, issue2, opts) {
      super(`(byte:${offset}) ${issue2}`);
      this.name = "BareError";
      this.issue = issue2;
      this.offset = offset;
      this.cause = opts?.cause;
    }
  };

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/core/byte-cursor.js
  var ByteCursor = class {
    /**
     * @throws {BareError} Buffer exceeds `config.maxBufferLength`
     */
    constructor(bytes, config2) {
      this.offset = 0;
      if (bytes.length > config2.maxBufferLength) {
        throw new BareError(0, TOO_LARGE_BUFFER);
      }
      this.bytes = bytes;
      this.config = config2;
      this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.length);
    }
  };
  function check2(bc, min) {
    if (DEV) {
      assert2(isU32(min));
    }
    if (bc.offset + min > bc.bytes.length) {
      throw new BareError(bc.offset, "missing bytes");
    }
  }
  function reserve(bc, min) {
    if (DEV) {
      assert2(isU32(min));
    }
    const minLen = (bc.offset + min) | 0;
    if (minLen > bc.bytes.length) {
      grow(bc, minLen);
    }
  }
  function grow(bc, minLen) {
    if (minLen > bc.config.maxBufferLength) {
      throw new BareError(0, TOO_LARGE_BUFFER);
    }
    const buffer = bc.bytes.buffer;
    let newBytes;
    if (
      isEs2024ArrayBufferLike(buffer) && // Make sure that the view covers the end of the buffer.
      // If it is not the case, this indicates that the user don't want
      // to override the trailing bytes.
      bc.bytes.byteOffset + bc.bytes.byteLength === buffer.byteLength &&
      bc.bytes.byteLength + minLen <= buffer.maxByteLength
    ) {
      const newLen = Math.min(minLen << 1, bc.config.maxBufferLength, buffer.maxByteLength);
      if (buffer instanceof ArrayBuffer) {
        buffer.resize(newLen);
      } else {
        buffer.grow(newLen);
      }
      newBytes = new Uint8Array(buffer, bc.bytes.byteOffset, newLen);
    } else {
      const newLen = Math.min(minLen << 1, bc.config.maxBufferLength);
      newBytes = new Uint8Array(newLen);
      newBytes.set(bc.bytes);
    }
    bc.bytes = newBytes;
    bc.view = new DataView(newBytes.buffer);
  }
  function isEs2024ArrayBufferLike(buffer) {
    return "maxByteLength" in buffer;
  }

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/codec/fixed-primitive.js
  function readBool(bc) {
    const val = readU8(bc);
    if (val > 1) {
      bc.offset--;
      throw new BareError(bc.offset, "a bool must be equal to 0 or 1");
    }
    return val > 0;
  }
  function writeBool(bc, x) {
    writeU8(bc, x ? 1 : 0);
  }
  function readU8(bc) {
    check2(bc, 1);
    return bc.bytes[bc.offset++];
  }
  function writeU8(bc, x) {
    if (DEV) {
      assert2(isU8(x), TOO_LARGE_NUMBER);
    }
    reserve(bc, 1);
    bc.bytes[bc.offset++] = x;
  }
  function readU64(bc) {
    check2(bc, 8);
    const result = bc.view.getBigUint64(bc.offset, true);
    bc.offset += 8;
    return result;
  }
  function writeU64(bc, x) {
    if (DEV) {
      assert2(isU64(x), TOO_LARGE_NUMBER);
    }
    reserve(bc, 8);
    bc.view.setBigUint64(bc.offset, x, true);
    bc.offset += 8;
  }

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/codec/uint.js
  function readUint(bc) {
    let low = readU8(bc);
    if (low >= 128) {
      low &= 127;
      let shiftMul = 128;
      let byteCount = 1;
      let byte;
      do {
        byte = readU8(bc);
        low += (byte & 127) * shiftMul;
        shiftMul *= /* 2**7 */ 128;
        byteCount++;
      } while (byte >= 128 && byteCount < 7);
      let height = 0;
      shiftMul = 1;
      while (byte >= 128 && byteCount < UINT_MAX_BYTE_COUNT) {
        byte = readU8(bc);
        height += (byte & 127) * shiftMul;
        shiftMul *= /* 2**7 */ 128;
        byteCount++;
      }
      if (byte === 0 || (byteCount === UINT_MAX_BYTE_COUNT && byte > 1)) {
        bc.offset -= byteCount;
        throw new BareError(bc.offset, NON_CANONICAL_REPRESENTATION);
      }
      return BigInt(low) + (BigInt(height) << BigInt(7 * 7));
    }
    return BigInt(low);
  }
  function writeUint(bc, x) {
    const truncated = BigInt.asUintN(64, x);
    if (DEV) {
      assert2(truncated === x, TOO_LARGE_NUMBER);
    }
    writeUintTruncated(bc, truncated);
  }
  function writeUintTruncated(bc, x) {
    let tmp = Number(BigInt.asUintN(7 * 7, x));
    let rest = Number(x >> BigInt(7 * 7));
    let byteCount = 0;
    while (tmp >= 128 || rest > 0) {
      writeU8(bc, 128 | (tmp & 127));
      tmp = Math.floor(tmp /* 2**7 */ / 128);
      byteCount++;
      if (byteCount === 7) {
        tmp = rest;
        rest = 0;
      }
    }
    writeU8(bc, tmp);
  }
  function readUintSafe32(bc) {
    let result = readU8(bc);
    if (result >= 128) {
      result &= 127;
      let shift = 7;
      let byteCount = 1;
      let byte;
      do {
        byte = readU8(bc);
        result += ((byte & 127) << shift) >>> 0;
        shift += 7;
        byteCount++;
      } while (byte >= 128 && byteCount < UINT_SAFE32_MAX_BYTE_COUNT);
      if (byte === 0) {
        bc.offset -= byteCount - 1;
        throw new BareError(bc.offset - byteCount + 1, NON_CANONICAL_REPRESENTATION);
      }
      if (byteCount === UINT_SAFE32_MAX_BYTE_COUNT && byte > 15) {
        bc.offset -= byteCount - 1;
        throw new BareError(bc.offset, TOO_LARGE_NUMBER);
      }
    }
    return result;
  }
  function writeUintSafe32(bc, x) {
    if (DEV) {
      assert2(isU32(x), TOO_LARGE_NUMBER);
    }
    let zigZag = x >>> 0;
    while (zigZag >= 128) {
      writeU8(bc, 128 | (zigZag & 127));
      zigZag >>>= 7;
    }
    writeU8(bc, zigZag);
  }

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/codec/u8-array.js
  function readU8Array(bc) {
    return readU8FixedArray(bc, readUintSafe32(bc));
  }
  function writeU8Array(bc, x) {
    writeUintSafe32(bc, x.length);
    writeU8FixedArray(bc, x);
  }
  function readU8FixedArray(bc, len) {
    return readUnsafeU8FixedArray(bc, len).slice();
  }
  function writeU8FixedArray(bc, x) {
    const len = x.length;
    if (len > 0) {
      reserve(bc, len);
      bc.bytes.set(x, bc.offset);
      bc.offset += len;
    }
  }
  function readUnsafeU8FixedArray(bc, len) {
    if (DEV) {
      assert2(isU32(len));
    }
    check2(bc, len);
    const offset = bc.offset;
    bc.offset += len;
    return bc.bytes.subarray(offset, offset + len);
  }

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/codec/data.js
  function readData(bc) {
    return readU8Array(bc).buffer;
  }
  function writeData(bc, x) {
    writeU8Array(bc, new Uint8Array(x));
  }

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/codec/string.js
  function readString(bc) {
    return readFixedString2(bc, readUintSafe32(bc));
  }
  function writeString(bc, x) {
    if (x.length < TEXT_ENCODER_THRESHOLD) {
      const byteLen = utf8ByteLength(x);
      writeUintSafe32(bc, byteLen);
      reserve(bc, byteLen);
      writeUtf8Js(bc, x);
    } else {
      const strBytes = UTF8_ENCODER.encode(x);
      writeUintSafe32(bc, strBytes.length);
      writeU8FixedArray(bc, strBytes);
    }
  }
  function readFixedString2(bc, byteLen) {
    if (DEV) {
      assert2(isU32(byteLen));
    }
    if (byteLen < TEXT_DECODER_THRESHOLD) {
      return readUtf8Js(bc, byteLen);
    }
    try {
      return UTF8_DECODER.decode(readUnsafeU8FixedArray(bc, byteLen));
    } catch (_cause) {
      throw new BareError(bc.offset, INVALID_UTF8_STRING);
    }
  }
  function readUtf8Js(bc, byteLen) {
    check2(bc, byteLen);
    let result = "";
    const bytes = bc.bytes;
    let offset = bc.offset;
    const upperOffset = offset + byteLen;
    while (offset < upperOffset) {
      let codePoint = bytes[offset++];
      if (codePoint > 127) {
        let malformed = true;
        const byte1 = codePoint;
        if (offset < upperOffset && codePoint < 224) {
          const byte2 = bytes[offset++];
          codePoint = ((byte1 & 31) << 6) | (byte2 & 63);
          malformed =
            codePoint >> 7 === 0 || // non-canonical char
            byte1 >> 5 !== 6 || // invalid tag
            byte2 >> 6 !== 2;
        } else if (offset + 1 < upperOffset && codePoint < 240) {
          const byte2 = bytes[offset++];
          const byte3 = bytes[offset++];
          codePoint = ((byte1 & 15) << 12) | ((byte2 & 63) << 6) | (byte3 & 63);
          malformed =
            codePoint >> 11 === 0 || // non-canonical char or missing data
            codePoint >> 11 === 27 || // surrogate char (0xD800 <= codePoint <= 0xDFFF)
            byte1 >> 4 !== 14 || // invalid tag
            byte2 >> 6 !== 2 || // invalid tag
            byte3 >> 6 !== 2;
        } else if (offset + 2 < upperOffset) {
          const byte2 = bytes[offset++];
          const byte3 = bytes[offset++];
          const byte4 = bytes[offset++];
          codePoint =
            ((byte1 & 7) << 18) | ((byte2 & 63) << 12) | ((byte3 & 63) << 6) | (byte4 & 63);
          malformed =
            codePoint >> 16 === 0 || // non-canonical char or missing data
            codePoint > 1114111 || // too large code point
            byte1 >> 3 !== 30 || // invalid tag
            byte2 >> 6 !== 2 || // invalid tag
            byte3 >> 6 !== 2 || // invalid tag
            byte4 >> 6 !== 2;
        }
        if (malformed) {
          throw new BareError(bc.offset, INVALID_UTF8_STRING);
        }
      }
      result += String.fromCodePoint(codePoint);
    }
    bc.offset = offset;
    return result;
  }
  function writeUtf8Js(bc, s) {
    const bytes = bc.bytes;
    let offset = bc.offset;
    let i = 0;
    while (i < s.length) {
      const codePoint = s.codePointAt(i++);
      if (codePoint < 128) {
        bytes[offset++] = codePoint;
      } else {
        if (codePoint < 2048) {
          bytes[offset++] = 192 | (codePoint >> 6);
        } else {
          if (codePoint < 65536) {
            bytes[offset++] = 224 | (codePoint >> 12);
          } else {
            bytes[offset++] = 240 | (codePoint >> 18);
            bytes[offset++] = 128 | ((codePoint >> 12) & 63);
            i++;
          }
          bytes[offset++] = 128 | ((codePoint >> 6) & 63);
        }
        bytes[offset++] = 128 | (codePoint & 63);
      }
    }
    bc.offset = offset;
  }
  function utf8ByteLength(s) {
    let result = s.length;
    for (let i = 0; i < s.length; i++) {
      const codePoint = s.codePointAt(i);
      if (codePoint > 127) {
        result++;
        if (codePoint > 2047) {
          result++;
          if (codePoint > 65535) {
            i++;
          }
        }
      }
    }
    return result;
  }
  var UTF8_DECODER = /* @__PURE__ */ new TextDecoder("utf-8", { fatal: true });
  var UTF8_ENCODER = /* @__PURE__ */ new TextEncoder();

  // node_modules/.pnpm/@rivetkit+bare-ts@0.6.2/node_modules/@rivetkit/bare-ts/dist/core/config.js
  function Config({ initialBufferLength = 1024, maxBufferLength = 1024 * 1024 * 32 }) {
    if (DEV) {
      assert2(isU32(initialBufferLength), TOO_LARGE_NUMBER);
      assert2(isU32(maxBufferLength), TOO_LARGE_NUMBER);
      assert2(
        initialBufferLength <= maxBufferLength,
        "initialBufferLength must be lower than or equal to maxBufferLength",
      );
    }
    return {
      initialBufferLength,
      maxBufferLength,
    };
  }

  // node_modules/.pnpm/p-retry@6.2.1/node_modules/p-retry/index.js
  var import_retry = __toESM(require_retry2(), 1);

  // node_modules/.pnpm/is-network-error@1.3.2/node_modules/is-network-error/index.js
  var objectToString = Object.prototype.toString;
  var isError = (value) => objectToString.call(value) === "[object Error]";
  var errorMessages = /* @__PURE__ */ new Set([
    "network error",
    // Chrome
    "NetworkError when attempting to fetch resource.",
    // Firefox
    "The Internet connection appears to be offline.",
    // Safari 16
    "Network request failed",
    // `cross-fetch`
    "fetch failed",
    // Undici (Node.js)
    "terminated",
    // Undici (Node.js)
    " A network error occurred.",
    // Bun (WebKit)
    "Network connection lost",
    // Cloudflare Workers (fetch)
  ]);
  function isNetworkError(error51) {
    const isValid =
      error51 &&
      isError(error51) &&
      error51.name === "TypeError" &&
      typeof error51.message === "string";
    if (!isValid) {
      return false;
    }
    const { message, stack } = error51;
    if (
      message === "Load failed" ||
      (message.startsWith("Load failed (") && message.endsWith(")"))
    ) {
      return stack === void 0 || "__sentry_captured__" in error51;
    }
    if (message.startsWith("error sending request for url")) {
      return true;
    }
    if (
      message === "Failed to fetch" ||
      (message.startsWith("Failed to fetch (") && message.endsWith(")"))
    ) {
      return true;
    }
    return errorMessages.has(message);
  }

  // node_modules/.pnpm/p-retry@6.2.1/node_modules/p-retry/index.js
  var AbortError = class extends Error {
    constructor(message) {
      super();
      if (message instanceof Error) {
        this.originalError = message;
        ({ message } = message);
      } else {
        this.originalError = new Error(message);
        this.originalError.stack = this.stack;
      }
      this.name = "AbortError";
      this.message = message;
    }
  };
  var decorateErrorWithCounts = (error51, attemptNumber, options) => {
    const retriesLeft = options.retries - (attemptNumber - 1);
    error51.attemptNumber = attemptNumber;
    error51.retriesLeft = retriesLeft;
    return error51;
  };
  async function pRetry(input, options) {
    return new Promise((resolve, reject) => {
      options = { ...options };
      options.onFailedAttempt ??= () => {};
      options.shouldRetry ??= () => true;
      options.retries ??= 10;
      const operation = import_retry.default.operation(options);
      const abortHandler = () => {
        operation.stop();
        reject(options.signal?.reason);
      };
      if (options.signal && !options.signal.aborted) {
        options.signal.addEventListener("abort", abortHandler, { once: true });
      }
      const cleanUp = () => {
        options.signal?.removeEventListener("abort", abortHandler);
        operation.stop();
      };
      operation.attempt(async (attemptNumber) => {
        try {
          const result = await input(attemptNumber);
          cleanUp();
          resolve(result);
        } catch (error51) {
          try {
            if (!(error51 instanceof Error)) {
              throw new TypeError(
                `Non-error was thrown: "${error51}". You should only throw errors.`,
              );
            }
            if (error51 instanceof AbortError) {
              throw error51.originalError;
            }
            if (error51 instanceof TypeError && !isNetworkError(error51)) {
              throw error51;
            }
            decorateErrorWithCounts(error51, attemptNumber, options);
            if (!(await options.shouldRetry(error51))) {
              operation.stop();
              reject(error51);
            }
            await options.onFailedAttempt(error51);
            if (!operation.retry(error51)) {
              throw operation.mainError();
            }
          } catch (finalError) {
            decorateErrorWithCounts(finalError, attemptNumber, options);
            cleanUp();
            reject(finalError);
          }
        }
      });
    });
  }

  // node_modules/.pnpm/rivetkit@2.3.17_@libsql+client@0.18.0_@opentelemetry+api@1.9.0_better-sqlite3@12.11.1_sql.js@1.14.2_ws@8.21.3/node_modules/rivetkit/dist/browser/client.js
  var import_invariant4 = __toESM(require_browser2(), 1);
  var INTERNAL_ERROR_CODE = "internal_error";
  var INTERNAL_ERROR_DESCRIPTION = "An internal error occurred";
  function looksLikeRivetErrorOptions(value) {
    return (
      typeof value === "object" &&
      value !== null &&
      ("public" in value ||
        "metadata" in value ||
        "rayId" in value ||
        "statusCode" in value ||
        "actor" in value ||
        "cause" in value)
    );
  }
  function isTypedErrorTag(value) {
    return value === "ActorError" || value === "RivetError";
  }
  function errorMessage(error51, fallback = String(error51)) {
    if (
      error51 &&
      typeof error51 === "object" &&
      "message" in error51 &&
      typeof error51.message === "string"
    ) {
      return error51.message;
    }
    return fallback;
  }
  function isRivetErrorLike(error51) {
    return (
      typeof error51 === "object" &&
      error51 !== null &&
      "group" in error51 &&
      typeof error51.group === "string" &&
      "code" in error51 &&
      typeof error51.code === "string" &&
      "message" in error51 &&
      typeof error51.message === "string" &&
      (!("rayId" in error51) || error51.rayId === void 0 || typeof error51.rayId === "string") &&
      (!("__type" in error51) || isTypedErrorTag(error51.__type))
    );
  }
  var RivetError = class extends Error {
    __type = "RivetError";
    public;
    metadata;
    rayId;
    statusCode;
    actor;
    group;
    code;
    static isRivetError(error51) {
      return isRivetErrorLike(error51);
    }
    static isActorError(error51) {
      return isRivetErrorLike(error51);
    }
    constructor(group, code, message, options) {
      const normalized = looksLikeRivetErrorOptions(options) ? options : { metadata: options };
      super(message, { cause: normalized.cause });
      this.name = "RivetError";
      this.group = group;
      this.code = code;
      this.public = normalized.public ?? false;
      this.metadata = normalized.metadata;
      this.rayId = normalized.rayId ?? void 0;
      this.statusCode = normalized.statusCode ?? (this.public ? 400 : 500);
      this.actor = normalized.actor;
    }
    toString() {
      return this.message;
    }
  };
  function invalidRequest(error51) {
    return new RivetError(
      "request",
      "invalid",
      `Invalid request: ${errorMessage(error51, String(error51))}`,
      {
        public: true,
        cause: error51 instanceof Error ? error51 : void 0,
      },
    );
  }
  function actorNotFound(identifier) {
    return new RivetError(
      "actor",
      "not_found",
      identifier
        ? `Actor not found: ${identifier} (https://www.rivet.dev/docs/clients/javascript)`
        : "Actor not found (https://www.rivet.dev/docs/clients/javascript)",
      { public: true },
    );
  }
  function assertUnreachable(x) {
    throw new Error(`Unreachable case: ${x}`);
  }
  function isCanonicalStructuredRivetError(error51) {
    return (
      error51 instanceof RivetError ||
      (typeof error51 === "object" &&
        error51 !== null &&
        "__type" in error51 &&
        error51.__type === "RivetError" &&
        "group" in error51 &&
        typeof error51.group === "string" &&
        "code" in error51 &&
        typeof error51.code === "string" &&
        "message" in error51 &&
        typeof error51.message === "string")
    );
  }
  function deconstructError(error51, exposeInternalError = false) {
    let statusCode;
    let public_;
    let group;
    let code;
    let message;
    let metadata;
    let rayId;
    let actor;
    if (isCanonicalStructuredRivetError(error51)) {
      statusCode =
        typeof error51.statusCode === "number" ? error51.statusCode : error51.public ? 400 : 500;
      public_ = error51.public ?? false;
      group = error51.group;
      code = error51.code;
      message = error51.message;
      metadata = error51.metadata;
      rayId = error51.rayId;
      actor = error51.actor;
    } else if (RivetError.isActorError(error51) && error51.public) {
      statusCode = "statusCode" in error51 && error51.statusCode ? error51.statusCode : 400;
      public_ = true;
      group = error51.group;
      code = error51.code;
      message = getErrorMessage(error51);
      metadata = error51.metadata;
      rayId = error51.rayId;
      actor = error51.actor;
    } else if (exposeInternalError) {
      if (RivetError.isActorError(error51)) {
        statusCode = 500;
        public_ = false;
        group = error51.group;
        code = error51.code;
        message = getErrorMessage(error51);
        metadata = error51.metadata;
        rayId = error51.rayId;
        actor = error51.actor;
      } else {
        statusCode = 500;
        public_ = false;
        group = "rivetkit";
        code = INTERNAL_ERROR_CODE;
        message = getErrorMessage(error51);
      }
    } else {
      statusCode = 500;
      public_ = false;
      group = "rivetkit";
      code = INTERNAL_ERROR_CODE;
      message = INTERNAL_ERROR_DESCRIPTION;
      if (RivetError.isActorError(error51)) {
        actor = error51.actor;
      }
      metadata = {
        //url: `https://dashboard.rivet.dev/projects/${actorMetadata.project.slug}/environments/${actorMetadata.environment.slug}/actors?actorId=${actorMetadata.actor.id}`,
      };
    }
    return {
      __type: "ActorError",
      statusCode,
      public: public_,
      group,
      code,
      message,
      metadata,
      rayId,
      actor,
    };
  }
  function stringifyError(error51) {
    if (error51 instanceof Error) {
      if (typeof process !== "undefined" && getLogErrorStack()) {
        let stack;
        try {
          stack = error51.stack;
        } catch {
          stack = void 0;
        }
        return `${error51.name}: ${error51.message}${
          stack
            ? `
${stack}`
            : ""
        }`;
      } else {
        return `${error51.name}: ${error51.message}`;
      }
    } else if (typeof error51 === "string") {
      return error51;
    } else if (typeof error51 === "object" && error51 !== null) {
      try {
        return `${JSON.stringify(error51)}`;
      } catch {
        return "[cannot stringify error]";
      }
    } else {
      return `Unknown error: ${getErrorMessage(error51)}`;
    }
  }
  function getErrorMessage(err) {
    if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
      return err.message;
    } else {
      return String(err);
    }
  }
  function noopNext() {
    return async () => {};
  }
  var package_default = {
    name: "rivetkit",
    version: "2.3.17",
    description: "Lightweight libraries for building stateful actors on edge platforms",
    license: "Apache-2.0",
    keywords: [
      "rivetkit",
      "stateful",
      "serverless",
      "actors",
      "agents",
      "realtime",
      "websocket",
      "actors",
      "framework",
    ],
    files: ["dist", "schemas", "src", "package.json"],
    type: "module",
    exports: {
      ".": {
        import: {
          types: "./dist/tsup/mod.d.ts",
          default: "./dist/tsup/mod.js",
        },
        require: {
          types: "./dist/tsup/mod.d.cts",
          default: "./dist/tsup/mod.cjs",
        },
      },
      "./workflow": {
        import: {
          types: "./dist/tsup/workflow/mod.d.ts",
          default: "./dist/tsup/workflow/mod.js",
        },
        require: {
          types: "./dist/tsup/workflow/mod.d.cts",
          default: "./dist/tsup/workflow/mod.cjs",
        },
      },
      "./test": {
        import: {
          types: "./dist/tsup/test/mod.d.ts",
          default: "./dist/tsup/test/mod.js",
        },
        require: {
          types: "./dist/tsup/test/mod.d.cts",
          default: "./dist/tsup/test/mod.cjs",
        },
      },
      "./db": {
        import: {
          types: "./dist/tsup/db/mod.d.ts",
          default: "./dist/tsup/db/mod.js",
        },
        require: {
          types: "./dist/tsup/db/mod.d.cts",
          default: "./dist/tsup/db/mod.cjs",
        },
      },
      "./db/drizzle": {
        import: {
          types: "./dist/tsup/db/drizzle.d.ts",
          default: "./dist/tsup/db/drizzle.js",
        },
        require: {
          types: "./dist/tsup/db/drizzle.d.cts",
          default: "./dist/tsup/db/drizzle.cjs",
        },
      },
      "./unstable/migrations": {
        import: {
          types: "./dist/tsup/unstable/migrations.d.ts",
          default: "./dist/tsup/unstable/migrations.js",
        },
        require: {
          types: "./dist/tsup/unstable/migrations.d.cts",
          default: "./dist/tsup/unstable/migrations.cjs",
        },
      },
      "./dynamic": {
        import: {
          types: "./dist/tsup/dynamic/mod.d.ts",
          default: "./dist/tsup/dynamic/mod.js",
        },
        require: {
          types: "./dist/tsup/dynamic/mod.d.cts",
          default: "./dist/tsup/dynamic/mod.cjs",
        },
      },
      "./client": {
        import: {
          browser: {
            types: "./dist/browser/client.d.ts",
            default: "./dist/browser/client.js",
          },
          types: "./dist/tsup/client/mod.d.ts",
          default: "./dist/tsup/client/mod.js",
        },
        require: {
          types: "./dist/tsup/client/mod.d.cts",
          default: "./dist/tsup/client/mod.cjs",
        },
      },
      "./log": {
        import: {
          types: "./dist/tsup/common/log.d.ts",
          default: "./dist/tsup/common/log.js",
        },
        require: {
          types: "./dist/tsup/common/log.d.cts",
          default: "./dist/tsup/common/log.cjs",
        },
      },
      "./errors": {
        import: {
          types: "./dist/tsup/actor/errors.d.ts",
          default: "./dist/tsup/actor/errors.js",
        },
        require: {
          types: "./dist/tsup/actor/errors.d.cts",
          default: "./dist/tsup/actor/errors.cjs",
        },
      },
      "./inspector": {
        import: {
          types: "./dist/tsup/inspector/mod.d.ts",
          default: "./dist/tsup/inspector/mod.js",
        },
        require: {
          types: "./dist/tsup/inspector/mod.d.cts",
          default: "./dist/tsup/inspector/mod.cjs",
        },
      },
      "./experimental/inspector/workflow": {
        import: {
          types: "./dist/tsup/inspector/workflow.d.ts",
          default: "./dist/tsup/inspector/workflow.js",
        },
        require: {
          types: "./dist/tsup/inspector/workflow.d.cts",
          default: "./dist/tsup/inspector/workflow.cjs",
        },
      },
      "./inspector-tab": {
        import: {
          types: "./dist/tsup/inspector-tab/mod.d.ts",
          default: "./dist/tsup/inspector-tab/mod.js",
        },
        require: {
          types: "./dist/tsup/inspector-tab/mod.d.cts",
          default: "./dist/tsup/inspector-tab/mod.cjs",
        },
      },
      "./inspector/client": {
        import: {
          types: "./dist/browser/inspector/client.d.ts",
          default: "./dist/browser/inspector/client.js",
        },
      },
      "./utils": {
        import: {
          types: "./dist/tsup/utils.d.ts",
          default: "./dist/tsup/utils.js",
        },
        require: {
          types: "./dist/tsup/utils.d.cts",
          default: "./dist/tsup/utils.cjs",
        },
      },
      "./agent-os": {
        import: {
          types: "./dist/tsup/agent-os/index.d.ts",
          default: "./dist/tsup/agent-os/index.js",
        },
        require: {
          types: "./dist/tsup/agent-os/index.d.cts",
          default: "./dist/tsup/agent-os/index.cjs",
        },
      },
    },
    engines: {
      node: ">=22.0.0",
    },
    sideEffects: ["./dist/tsup/chunk-*.js", "./dist/tsup/chunk-*.cjs"],
    scripts: {
      build:
        "tsup src/mod.ts src/client/mod.ts src/common/log.ts src/common/websocket.ts src/actor/errors.ts src/utils.ts src/workflow/mod.ts src/test/mod.ts src/inspector/mod.ts src/inspector/workflow.ts src/inspector-tab/mod.ts src/db/mod.ts src/db/drizzle.ts src/dynamic/mod.ts src/unstable/migrations.ts && tsup src/agent-os/index.ts --no-clean --out-dir dist/tsup/agent-os && node scripts/check-built-commonjs.mjs",
      "build:browser": "tsup --config tsup.browser.config.ts",
      "check-types": "tsc --noEmit",
      lint: "biome check . && pnpm run check:test-skips && pnpm run check:wait-for-comments",
      "lint:fix": "biome check --write .",
      "check:test-skips": "tsx scripts/check-annotated-skips.ts",
      "check:wait-for-comments": "tsx scripts/check-wait-for-comments.ts",
      format: "biome format .",
      "format:write": "biome format --write .",
      test: "vitest run",
      "test:platforms":
        "pnpm run build && RIVETKIT_INCLUDE_PLATFORM_TESTS=1 vitest run tests/platforms --passWithNoTests",
      "test:watch": "vitest",
      "dump-asyncapi": "tsx scripts/dump-asyncapi.ts",
      "registry-config-schema-gen": "tsx scripts/registry-config-schema-gen.ts",
      "actor-config-schema-gen": "tsx scripts/actor-config-schema-gen.ts",
    },
    dependencies: {
      "@hono/zod-openapi": "^1.1.5",
      "@rivet-dev/agent-os-core": "^0.1.1",
      "@rivet-dev/services": "^0.1.5",
      "@rivetkit/bare-ts": "^0.6.2",
      "@rivetkit/engine-cli": "workspace:*",
      "@rivetkit/engine-envoy-protocol": "workspace:*",
      "@rivetkit/on-change": "6.0.1",
      "@rivetkit/rivetkit-napi": "workspace:*",
      "@rivetkit/rivetkit-wasm": "workspace:*",
      "@rivetkit/traces": "workspace:*",
      "@rivetkit/virtual-websocket": "workspace:*",
      "@rivetkit/workflow-engine": "workspace:*",
      "cbor-x": "^1.6.0",
      "drizzle-orm": "catalog:",
      hono: "^4.7.0",
      invariant: "^2.2.4",
      "p-retry": "^6.2.1",
      pino: "^9.5.0",
      uuid: "^12.0.0",
      vbare: "^0.0.4",
      zod: "^4.1.0",
    },
    devDependencies: {
      "@biomejs/biome": "^2.3",
      "@copilotkit/llmock": "^1.6.0",
      "@hono/node-server": "^1.18.2",
      "@hono/node-ws": "^1.1.1",
      "@rivet-dev/agent-os-common": "*",
      "@rivet-dev/agent-os-pi": "^0.1.1",
      "@standard-schema/spec": "^1.0.0",
      "@types/invariant": "^2",
      "@types/node": "^22.13.1",
      eventsource: "^4.0.0",
      "get-port": "^7.1.0",
      tsup: "^8.4.0",
      tsx: "^4.19.4",
      typescript: "^5.7.3",
      "vite-tsconfig-paths": "^5.1.4",
      vitest: "^3.1.1",
      ws: "^8.18.1",
    },
    peerDependencies: {
      "drizzle-kit": "^0.31.2",
      eventsource: "^4.0.0",
      ws: "^8.0.0",
    },
    peerDependenciesMeta: {
      "drizzle-kit": {
        optional: true,
      },
      eventsource: {
        optional: true,
      },
      ws: {
        optional: true,
      },
    },
    stableVersion: "0.8.0",
  };
  function uint8ArrayToBase642(uint8Array) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(uint8Array).toString("base64");
    }
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }
  function contentTypeForEncoding(encoding) {
    if (encoding === "json") {
      return "application/json";
    } else if (encoding === "cbor" || encoding === "bare") {
      return "application/octet-stream";
    } else {
      assertUnreachable(encoding);
    }
  }
  function encodeCborCompat(value) {
    return encode3(encodeJsonCompatValue(value));
  }
  function decodeCborCompat(buffer) {
    return reviveJsonCompatValue(decode3(buffer));
  }
  function serializeWithEncoding(
    encoding,
    value,
    versionedDataHandler,
    version2,
    zodSchema,
    toJson,
    toBare,
  ) {
    if (encoding === "json") {
      const jsonValue = toJson(value);
      const validated = zodSchema.parse(jsonValue);
      return jsonStringifyCompat(validated);
    } else if (encoding === "cbor") {
      const jsonValue = toJson(value);
      const validated = zodSchema.parse(jsonValue);
      return encode3(validated);
    } else if (encoding === "bare") {
      if (!versionedDataHandler) {
        throw new Error("VersionedDataHandler is required for 'bare' encoding");
      }
      if (version2 === void 0) {
        throw new Error("version is required for 'bare' encoding");
      }
      const bareValue = toBare(value);
      return versionedDataHandler.serializeWithEmbeddedVersion(bareValue, version2);
    } else {
      assertUnreachable(encoding);
    }
  }
  function deserializeWithEncoding(
    encoding,
    buffer,
    versionedDataHandler,
    zodSchema,
    fromJson,
    fromBare,
  ) {
    if (encoding === "json") {
      let parsed;
      if (typeof buffer === "string") {
        parsed = jsonParseCompat(buffer);
      } else {
        const decoder2 = new TextDecoder("utf-8");
        const jsonString = decoder2.decode(buffer);
        parsed = jsonParseCompat(jsonString);
      }
      const validated = zodSchema.parse(parsed);
      return fromJson(validated);
    } else if (encoding === "cbor") {
      (0, import_invariant.default)(
        typeof buffer !== "string",
        "buffer cannot be string for cbor encoding",
      );
      const decoded = decodeCborCompat(buffer);
      const validated = zodSchema.parse(decoded);
      return fromJson(validated);
    } else if (encoding === "bare") {
      (0, import_invariant.default)(
        typeof buffer !== "string",
        "buffer cannot be string for bare encoding",
      );
      if (!versionedDataHandler) {
        throw new Error("VersionedDataHandler is required for 'bare' encoding");
      }
      const bareValue = versionedDataHandler.deserializeWithEmbeddedVersion(buffer);
      return fromBare(bareValue);
    } else {
      assertUnreachable(encoding);
    }
  }
  var JSON_COMPAT_BIGINT = "$BigInt";
  var JSON_COMPAT_ARRAY_BUFFER = "$ArrayBuffer";
  var JSON_COMPAT_UINT8_ARRAY = "$Uint8Array";
  var JSON_COMPAT_UNDEFINED = "$Undefined";
  var JSON_COMPAT_SET = "$Set";
  function isTypedArray(value) {
    return (
      value instanceof Uint8ClampedArray ||
      value instanceof Uint16Array ||
      value instanceof Uint32Array ||
      value instanceof BigUint64Array ||
      value instanceof Int8Array ||
      value instanceof Int16Array ||
      value instanceof Int32Array ||
      value instanceof BigInt64Array ||
      value instanceof Float32Array ||
      value instanceof Float64Array
    );
  }
  var EncodingSchema = external_exports.enum(["json", "cbor", "bare"]);
  async function inputDataToBuffer(data) {
    if (typeof data === "string") {
      return data;
    }
    if (data instanceof Blob) {
      return new Uint8Array(await data.arrayBuffer());
    }
    if (data instanceof Uint8Array) {
      return data;
    }
    if (data instanceof ArrayBuffer || data instanceof SharedArrayBuffer) {
      return new Uint8Array(data);
    }
    throw new Error("Malformed message");
  }
  function base64EncodeUint8Array(uint8Array) {
    let binary = "";
    for (const value of uint8Array) {
      binary += String.fromCharCode(value);
    }
    return btoa(binary);
  }
  function base64EncodeArrayBuffer(arrayBuffer) {
    return base64EncodeUint8Array(new Uint8Array(arrayBuffer));
  }
  function isPlainObject2(value) {
    if (value === null || typeof value !== "object") {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }
  function encodeJsonCompatValue(input) {
    if (input === null) {
      return input;
    }
    if (input === void 0) {
      return [JSON_COMPAT_UNDEFINED, 0];
    }
    if (typeof input === "string" || typeof input === "number" || typeof input === "boolean") {
      return input;
    }
    if (typeof input === "bigint") {
      return [JSON_COMPAT_BIGINT, input.toString()];
    }
    if (input instanceof ArrayBuffer) {
      return [JSON_COMPAT_ARRAY_BUFFER, base64EncodeArrayBuffer(input)];
    }
    if (input instanceof Uint8Array) {
      return [JSON_COMPAT_UINT8_ARRAY, base64EncodeUint8Array(input)];
    }
    if (isTypedArray(input)) {
      return input;
    }
    if (input instanceof Date || input instanceof RegExp || input instanceof Error) {
      return input;
    }
    if (input instanceof Set) {
      const encoded = [...input.values()].map((v) => encodeJsonCompatValue(v));
      return [JSON_COMPAT_SET, encoded];
    }
    if (input instanceof Map) {
      const encoded = /* @__PURE__ */ new Map();
      for (const [k, v] of input.entries()) {
        encoded.set(encodeJsonCompatValue(k), encodeJsonCompatValue(v));
      }
      return encoded;
    }
    if (Array.isArray(input)) {
      const encoded = input.map((value) => encodeJsonCompatValue(value));
      if (encoded.length === 2 && typeof encoded[0] === "string" && encoded[0].startsWith("$")) {
        return [`$${encoded[0]}`, encoded[1]];
      }
      return encoded;
    }
    if (isPlainObject2(input)) {
      const encoded = {};
      for (const [key, value] of Object.entries(input)) {
        encoded[key] = encodeJsonCompatValue(value);
      }
      return encoded;
    }
    const typeName =
      typeof input === "object" && input !== null
        ? (input.constructor?.name ?? typeof input)
        : typeof input;
    throw new TypeError(`Value of type "${typeName}" is not CBOR serializable`);
  }
  function reviveJsonCompatValue(input, options = {}) {
    if (typeof input === "bigint") {
      if (
        options.coerceSafeIntegerBigInts &&
        input >= BigInt(Number.MIN_SAFE_INTEGER) &&
        input <= BigInt(Number.MAX_SAFE_INTEGER)
      ) {
        return Number(input);
      }
      return input;
    }
    if (input instanceof Map) {
      const revived = /* @__PURE__ */ new Map();
      for (const [k, v] of input.entries()) {
        revived.set(reviveJsonCompatValue(k, options), reviveJsonCompatValue(v, options));
      }
      return revived;
    }
    if (Array.isArray(input)) {
      if (input.length === 2 && typeof input[0] === "string" && input[0].startsWith("$")) {
        if (input[0] === JSON_COMPAT_BIGINT) {
          return BigInt(input[1]);
        }
        if (input[0] === JSON_COMPAT_ARRAY_BUFFER) {
          return base64DecodeToArrayBuffer(input[1]);
        }
        if (input[0] === JSON_COMPAT_UINT8_ARRAY) {
          return base64DecodeToUint8Array(input[1]);
        }
        if (input[0] === JSON_COMPAT_UNDEFINED) {
          return void 0;
        }
        if (input[0] === JSON_COMPAT_SET) {
          const items = input[1].map((v) => reviveJsonCompatValue(v, options));
          return new Set(items);
        }
        if (input[0].startsWith("$$")) {
          return [input[0].substring(1), reviveJsonCompatValue(input[1], options)];
        }
        throw new Error(
          `Unknown JSON encoding type: ${input[0]}. This may indicate corrupted data or a version mismatch.`,
        );
      }
      return input.map((value) => reviveJsonCompatValue(value, options));
    }
    if (isPlainObject2(input)) {
      const decoded = {};
      for (const [key, value] of Object.entries(input)) {
        decoded[key] = reviveJsonCompatValue(value, options);
      }
      return decoded;
    }
    return input;
  }
  function base64DecodeToUint8Array(base643) {
    if (typeof Buffer !== "undefined") {
      return new Uint8Array(Buffer.from(base643, "base64"));
    }
    const binary = atob(base643);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  function base64DecodeToArrayBuffer(base643) {
    return base64DecodeToUint8Array(base643).buffer;
  }
  function jsonStringifyCompat(input, space) {
    return JSON.stringify(
      input,
      (_key, value) => {
        if (typeof value === "bigint") {
          return [JSON_COMPAT_BIGINT, value.toString()];
        }
        if (value instanceof ArrayBuffer) {
          return [JSON_COMPAT_ARRAY_BUFFER, base64EncodeArrayBuffer(value)];
        }
        if (value instanceof Uint8Array) {
          return [JSON_COMPAT_UINT8_ARRAY, base64EncodeUint8Array(value)];
        }
        if (
          Array.isArray(value) &&
          value.length === 2 &&
          typeof value[0] === "string" &&
          value[0].startsWith("$")
        ) {
          return [`$${value[0]}`, value[1]];
        }
        return value;
      },
      space,
    );
  }
  function jsonParseCompat(input) {
    return reviveJsonCompatValue(JSON.parse(input));
  }
  var VERSION = package_default.version;
  var _userAgent;
  function httpUserAgent() {
    if (_userAgent !== void 0) {
      return _userAgent;
    }
    let userAgent = `RivetKit/${VERSION}`;
    const navigatorObj = typeof navigator !== "undefined" ? navigator : void 0;
    if (navigatorObj?.userAgent) userAgent += ` ${navigatorObj.userAgent}`;
    _userAgent = userAgent;
    return userAgent;
  }
  function getEnvUniversal(key) {
    if (typeof Deno !== "undefined") {
      return Deno.env.get(key);
    } else if (typeof process !== "undefined") {
      return process.env[key];
    }
  }
  function promiseWithResolvers(onReject) {
    let resolve;
    let reject;
    const promise2 = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    promise2.catch(onReject);
    return { promise: promise2, resolve, reject };
  }
  function bufferToArrayBuffer(buf) {
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }
  function combineUrlPath(endpoint, path, queryParams) {
    const baseUrl = new URL(endpoint);
    const pathParts = path.split("?");
    const pathOnly = pathParts[0];
    const existingQuery = pathParts[1] || "";
    const basePath = baseUrl.pathname.replace(/\/$/, "");
    const cleanPath = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
    const fullPath = (basePath + cleanPath).replace(/\/\//g, "/");
    const queryParts = [];
    if (existingQuery) {
      queryParts.push(existingQuery);
    }
    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== void 0) {
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
      }
    }
    const fullQuery = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    return `${baseUrl.protocol}//${baseUrl.host}${fullPath}${fullQuery}`;
  }
  var getRivetEngine = () => getEnvUniversal("RIVET_ENGINE");
  var getRivetEndpoint = () => getEnvUniversal("RIVET_ENDPOINT");
  var getRivetToken = () => getEnvUniversal("RIVET_TOKEN");
  var getRivetNamespace = () => getEnvUniversal("RIVET_NAMESPACE");
  var getRivetPool = () => getEnvUniversal("RIVET_POOL");
  var getLogLevel = () => getEnvUniversal("RIVET_LOG_LEVEL") ?? getEnvUniversal("LOG_LEVEL");
  var getLogTarget = () => getEnvUniversal("RIVET_LOG_TARGET") === "1";
  var getLogTimestamp = () => getEnvUniversal("RIVET_LOG_TIMESTAMP") === "1";
  var getLogMessage = () => getEnvUniversal("RIVET_LOG_MESSAGE") === "1";
  var getLogErrorStack = () => getEnvUniversal("RIVET_LOG_ERROR_STACK") === "1";
  var getNextPhase = () => getEnvUniversal("NEXT_PHASE");
  var baseLogger;
  var configuredLogLevel;
  var loggerCache = /* @__PURE__ */ new Map();
  var LogLevelSchema = external_exports.enum([
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
    "silent",
  ]);
  function getPinoLevel(logLevel) {
    if (logLevel) {
      return logLevel;
    }
    if (configuredLogLevel) {
      return configuredLogLevel;
    }
    const raw = (getLogLevel() || "warn").toString().toLowerCase();
    const parsed = LogLevelSchema.safeParse(raw);
    if (parsed.success) {
      return parsed.data;
    }
    return "info";
  }
  function getIncludeTarget() {
    return getLogTarget();
  }
  function makeDefaultLogger(logLevel) {
    return (0, import_pino.pino)(
      {
        level: getPinoLevel(logLevel),
        messageKey: "msg",
        // Do not include pid/hostname in output
        base: {},
        errorKey: "error",
        // Keep the numeric level so the logfmt sink can match Pino's levels.
        formatters: {
          level(_label, number4) {
            return { level: number4 };
          },
        },
        timestamp: getLogTimestamp() ? import_pino.stdTimeFunctions.epochTime : false,
      },
      createLogfmtDestination(),
    );
  }
  function configureDefaultLogger(logLevel) {
    if (logLevel) {
      configuredLogLevel = logLevel;
    }
    baseLogger = makeDefaultLogger(logLevel);
    loggerCache.clear();
  }
  function getBaseLogger() {
    if (!baseLogger) {
      configureDefaultLogger();
    }
    return baseLogger;
  }
  function getLogger(name = "default") {
    const cached2 = loggerCache.get(name);
    if (cached2) {
      return cached2;
    }
    const base = getBaseLogger();
    const child = getIncludeTarget() ? base.child({ target: name }) : base;
    loggerCache.set(name, child);
    return child;
  }
  var PINO_LEVEL_LABELS = {
    10: "trace",
    20: "debug",
    30: "info",
    40: "warn",
    50: "error",
    60: "fatal",
  };
  function createLogfmtDestination() {
    return {
      write(msg) {
        const line = formatLogfmtLine(msg);
        if (typeof process !== "undefined" && process.stdout?.write) {
          process.stdout.write(`${line}
`);
        } else {
          console.log(line);
        }
      },
    };
  }
  function formatLogfmtLine(raw) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return raw.trimEnd();
    }
    const parts = [];
    appendLogfmtEntry(parts, "level", formatPinoLevel(data.level));
    if (data.time !== void 0) {
      appendLogfmtEntry(parts, "ts", data.time);
    }
    for (const [key, value] of Object.entries(data)) {
      if (key === "level" || key === "time") {
        continue;
      }
      appendLogfmtEntry(parts, key, value);
    }
    return parts.join(" ");
  }
  function formatPinoLevel(level) {
    if (typeof level === "number") {
      return PINO_LEVEL_LABELS[level] ?? level.toString();
    }
    if (typeof level === "string") {
      return level.toLowerCase();
    }
    return "info";
  }
  function appendLogfmtEntry(parts, key, value) {
    const safeKey2 = key.replace(/[\s="]/g, "");
    if (safeKey2.length === 0) {
      return;
    }
    parts.push(`${safeKey2}=${formatLogfmtValue(value)}`);
  }
  function formatLogfmtValue(value) {
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (value === null || value === void 0) {
      return "null";
    }
    if (typeof value === "string") {
      return quoteLogfmtString(value);
    }
    return quoteLogfmtString(JSON.stringify(value));
  }
  function quoteLogfmtString(value) {
    if (!/[\s="]/.test(value)) {
      return value;
    }
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
  }
  function logger() {
    return getLogger("devtools");
  }
  var scriptId = "rivetkit-devtools-script";
  function injectDevtools(config2) {
    if (!window) {
      logger().warn("devtools not available outside browser environment");
      return;
    }
    if (!document.getElementById(scriptId)) {
      const src2 = `${config2.endpoint?.replace(/\/$/, "")}/devtools/mod.js`;
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = src2;
      script.async = true;
      document.head.appendChild(script);
    }
    window.__rivetkit = window.__rivetkit || [];
    window.__rivetkit.push(config2);
  }
  var EMPTY_KEY = "/";
  var KEY_SEPARATOR = "/";
  var KEYS = {
    PERSIST_DATA: Uint8Array.from([1]),
    CONN_PREFIX: Uint8Array.from([2]),
    INSPECTOR_TOKEN: Uint8Array.from([3]),
    KV: Uint8Array.from([4]),
    QUEUE_PREFIX: Uint8Array.from([5]),
    LAST_PUSHED_ALARM: Uint8Array.from([6]),
    WORKFLOW_PREFIX: Uint8Array.from([6]),
    TRACES_PREFIX: Uint8Array.from([7]),
  };
  var STORAGE_VERSION = {
    QUEUE: 1,
    WORKFLOW: 1,
    TRACES: 1,
  };
  var STORAGE_VERSION_BYTES = {
    QUEUE: Uint8Array.from([STORAGE_VERSION.QUEUE]),
    WORKFLOW: Uint8Array.from([STORAGE_VERSION.WORKFLOW]),
    TRACES: Uint8Array.from([STORAGE_VERSION.TRACES]),
  };
  var QUEUE_NAMESPACE = {
    METADATA: Uint8Array.from([1]),
    MESSAGES: Uint8Array.from([2]),
  };
  function concatPrefix(prefix, suffix) {
    const merged = new Uint8Array(prefix.length + suffix.length);
    merged.set(prefix, 0);
    merged.set(suffix, prefix.length);
    return merged;
  }
  var QUEUE_STORAGE_PREFIX = concatPrefix(KEYS.QUEUE_PREFIX, STORAGE_VERSION_BYTES.QUEUE);
  var QUEUE_METADATA_KEY = concatPrefix(QUEUE_STORAGE_PREFIX, QUEUE_NAMESPACE.METADATA);
  var QUEUE_MESSAGES_PREFIX = concatPrefix(QUEUE_STORAGE_PREFIX, QUEUE_NAMESPACE.MESSAGES);
  var WORKFLOW_STORAGE_PREFIX = concatPrefix(KEYS.WORKFLOW_PREFIX, STORAGE_VERSION_BYTES.WORKFLOW);
  var TRACES_STORAGE_PREFIX = concatPrefix(KEYS.TRACES_PREFIX, STORAGE_VERSION_BYTES.TRACES);
  function serializeActorKey(key) {
    if (key.length === 0) {
      return EMPTY_KEY;
    }
    const escapedParts = key.map((part) => {
      if (part === "") {
        return "\\0";
      }
      let escaped = part.replace(/\\/g, "\\\\");
      escaped = escaped.replace(/\//g, `\\${KEY_SEPARATOR}`);
      return escaped;
    });
    return escapedParts.join(KEY_SEPARATOR);
  }
  function deserializeActorKey(keyString) {
    if (keyString === void 0 || keyString === null || keyString === EMPTY_KEY) {
      return [];
    }
    const parts = [];
    let currentPart = "";
    let escaping = false;
    let isEmptyStringMarker = false;
    for (let i = 0; i < keyString.length; i++) {
      const char = keyString[i];
      if (escaping) {
        if (char === "0") {
          isEmptyStringMarker = true;
        } else {
          currentPart += char;
        }
        escaping = false;
      } else if (char === "\\") {
        escaping = true;
      } else if (char === KEY_SEPARATOR) {
        if (isEmptyStringMarker) {
          parts.push("");
          isEmptyStringMarker = false;
        } else {
          parts.push(currentPart);
        }
        currentPart = "";
      } else {
        currentPart += char;
      }
    }
    if (escaping) {
      parts.push(`${currentPart}\\`);
    } else if (isEmptyStringMarker) {
      parts.push("");
    } else if (currentPart !== "" || parts.length > 0) {
      parts.push(currentPart);
    }
    return parts;
  }
  var PATH_CONNECT = "/connect";
  var PATH_WEBSOCKET_BASE = "/websocket";
  var PATH_WEBSOCKET_PREFIX = "/websocket/";
  var HEADER_ENCODING = "x-rivet-encoding";
  var HEADER_CONN_PARAMS = "x-rivet-conn-params";
  var HEADER_ORIGINAL_REQUEST_URL = "x-rivet-internal-original-request-url";
  var HEADER_RIVET_TOKEN = "x-rivet-token";
  var HEADER_RIVET_TARGET = "x-rivet-target";
  var HEADER_RIVET_ACTOR = "x-rivet-actor";
  var HEADER_RIVET_SKIP_READY_WAIT = "x-rivet-skip-ready-wait";
  var WS_PROTOCOL_STANDARD = "rivet";
  var WS_PROTOCOL_TARGET = "rivet_target.";
  var WS_PROTOCOL_ACTOR = "rivet_actor.";
  var WS_PROTOCOL_ENCODING = "rivet_encoding.";
  var WS_PROTOCOL_CONN_PARAMS = "rivet_conn_params.";
  var WS_PROTOCOL_TOKEN = "rivet_token.";
  var WS_PROTOCOL_SKIP_READY_WAIT = "rivet_skip_ready_wait";
  var WS_PROTOCOL_TEST_ACK_HOOK = "rivet_test_ack_hook.";
  function shouldSkipReadyWait(options = {}) {
    return options.skipReadyWait === true;
  }
  async function sendHttpRequestToGateway(runConfig, gatewayUrl, actorRequest, options = {}) {
    let bodyToSend = null;
    const guardHeaders = buildGuardHeaders(runConfig, actorRequest, options);
    if (actorRequest.method !== "GET" && actorRequest.method !== "HEAD") {
      if (actorRequest.bodyUsed) {
        throw new Error("Request body has already been consumed");
      }
      if (actorRequest.body) {
        bodyToSend = actorRequest.body;
        guardHeaders.delete("transfer-encoding");
        guardHeaders.delete("content-length");
      }
    }
    return fetch(gatewayUrl, {
      method: actorRequest.method,
      headers: guardHeaders,
      body: bodyToSend,
      signal: actorRequest.signal,
      ...(bodyToSend ? { duplex: "half" } : {}),
    });
  }
  function buildGuardHeaders(runConfig, actorRequest, options) {
    const headers = new Headers();
    actorRequest.headers.forEach((value, key) => {
      headers.set(key, value);
    });
    for (const [key, value] of Object.entries(runConfig.headers)) {
      headers.set(key, value);
    }
    if (runConfig.token) {
      headers.set(HEADER_RIVET_TOKEN, runConfig.token);
    }
    if (options.directActorId !== void 0) {
      headers.set(HEADER_RIVET_TARGET, "actor");
      headers.set(HEADER_RIVET_ACTOR, options.directActorId);
    }
    if (shouldSkipReadyWait(options)) {
      headers.set(HEADER_RIVET_SKIP_READY_WAIT, "1");
    }
    return headers;
  }
  function tryParseEndpoint(ctx, options) {
    const {
      endpoint,
      path = ["endpoint"],
      namespace: configNamespace,
      token: configToken,
    } = options;
    let url2;
    try {
      url2 = new URL(endpoint);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: `invalid URL: ${endpoint}`,
        path,
      });
      return void 0;
    }
    if (url2.search) {
      ctx.addIssue({
        code: "custom",
        message: "endpoint cannot contain a query string",
        path,
      });
      return void 0;
    }
    if (url2.hash) {
      ctx.addIssue({
        code: "custom",
        message: "endpoint cannot contain a fragment",
        path,
      });
      return void 0;
    }
    const namespace = url2.username ? decodeURIComponent(url2.username) : void 0;
    const token = url2.password ? decodeURIComponent(url2.password) : void 0;
    if (token && !namespace) {
      ctx.addIssue({
        code: "custom",
        message: "endpoint cannot have a token without a namespace",
        path,
      });
      return void 0;
    }
    if (namespace && configNamespace) {
      ctx.addIssue({
        code: "custom",
        message: "cannot specify namespace both in endpoint URL and as a separate config option",
        path: ["namespace"],
      });
    }
    if (token && configToken) {
      ctx.addIssue({
        code: "custom",
        message: "cannot specify token both in endpoint URL and as a separate config option",
        path: ["token"],
      });
    }
    url2.username = "";
    url2.password = "";
    const cleanedEndpoint = url2.toString();
    return {
      endpoint: cleanedEndpoint,
      namespace,
      token,
    };
  }
  var DEFAULT_ENDPOINT = "http://localhost:6420";
  var DEFAULT_MAX_QUERY_INPUT_SIZE = 4 * 1024;
  var hasWarnedMissingEndpoint = false;
  var ClientConfigSchemaBase = v4_default.object({
    /**
     * Endpoint to connect to for Rivet Engine or the local RivetKit runtime API.
     *
     * Supports URL auth syntax for namespace and token:
     * - `https://namespace:token@api.rivet.dev`
     * - `https://namespace@api.rivet.dev`
     *
     * Can also be set via RIVET_ENDPOINT environment variables.
     *
     * Defaults to http://localhost:6420.
     */
    endpoint: v4_default
      .string()
      .optional()
      .transform((val) => {
        const resolved = val ?? getRivetEngine() ?? getRivetEndpoint();
        if (!resolved && !hasWarnedMissingEndpoint) {
          hasWarnedMissingEndpoint = true;
          console.warn(
            `[rivetkit] No endpoint provided to client. Defaulting to ${DEFAULT_ENDPOINT}. Starting in 2.2.0, an explicit endpoint will be required. Pass an endpoint to createClient() or createRivetKit(), or set the RIVET_ENDPOINT environment variable.`,
          );
        }
        return resolved ?? DEFAULT_ENDPOINT;
      }),
    /** Token to use to authenticate with the API. */
    token: v4_default
      .string()
      .optional()
      .transform((val) => val ?? getRivetToken()),
    /** Namespace to connect to. */
    namespace: v4_default
      .string()
      .optional()
      .transform((val) => val ?? getRivetNamespace()),
    /** Name of the envoy pool. This is used to group together envoys in to different pools. */
    poolName: v4_default.string().default(() => getRivetPool() ?? "default"),
    encoding: EncodingSchema.default("bare"),
    headers: v4_default
      .record(v4_default.string(), v4_default.string())
      .optional()
      .default(() => ({})),
    gateway: v4_default
      .object({
        skipReadyWait: v4_default.boolean().optional().default(false),
      })
      .optional()
      .default(() => ({ skipReadyWait: false })),
    // See RunConfig.getUpgradeWebSocket
    //
    // This is required in the client config in order to support
    // `proxyWebSocket`
    getUpgradeWebSocket: v4_default.custom().optional(),
    /** Whether to automatically perform health checks when the client is created. */
    disableMetadataLookup: v4_default.boolean().optional().default(false),
    /**
     * Maximum serialized query input size in bytes before base64url encoding.
     *
     * This applies to query-backed `getOrCreate()` and `create()` gateway URLs.
     */
    maxInputSize: v4_default.number().int().positive().default(DEFAULT_MAX_QUERY_INPUT_SIZE),
    /** Whether to enable RivetKit Devtools integration. */
    devtools: v4_default
      .boolean()
      .default(
        () =>
          typeof window !== "undefined" &&
          (window?.location?.hostname === "127.0.0.1" || window.location?.hostname === "localhost"),
      ),
  });
  var ClientConfigSchema = ClientConfigSchemaBase.transform((config2, ctx) =>
    transformClientConfig(config2, ctx),
  );
  function transformClientConfig(config2, ctx) {
    const parsedEndpoint = tryParseEndpoint(ctx, {
      endpoint: config2.endpoint,
      path: ["endpoint"],
      namespace: config2.namespace,
      token: config2.token,
    });
    return {
      ...config2,
      endpoint: parsedEndpoint?.endpoint,
      namespace: parsedEndpoint?.namespace ?? config2.namespace ?? "default",
      token: parsedEndpoint?.token ?? config2.token,
    };
  }
  function logger2() {
    return getLogger("actor-client");
  }
  var webSocketPromise = null;
  async function importWebSocket() {
    if (webSocketPromise !== null) {
      return webSocketPromise;
    }
    webSocketPromise = (async () => {
      let _WebSocket;
      if (typeof WebSocket !== "undefined") {
        _WebSocket = WebSocket;
      } else {
        try {
          const moduleName = "ws";
          const ws = await import(
            /* webpackIgnore: true */
            moduleName
          );
          _WebSocket = ws.default;
          logger2().debug("using websocket from npm");
        } catch {
          _WebSocket = class MockWebSocket {
            constructor() {
              throw new Error('WebSocket support requires installing the "ws" peer dependency.');
            }
          };
          logger2().debug("using mock websocket");
        }
      }
      return _WebSocket;
    })();
    return webSocketPromise;
  }
  var UTF8_DECODER2 = new TextDecoder();
  var REMOTE_HIBERNATABLE_WEBSOCKET_ACK_HOOKS = /* @__PURE__ */ new Map();
  function setHibernatableWebSocketAckTestHooks(websocket, hooks, enabled) {
    if (!enabled) {
      return;
    }
    const testWebSocket = websocket;
    testWebSocket.__rivetGetHibernatableAckState = hooks.getState;
    testWebSocket.__rivetWaitForHibernatableAck = hooks.waitForAck;
  }
  function setRemoteHibernatableWebSocketAckTestHooks(websocket, token, enabled) {
    if (!enabled) {
      return;
    }
    setHibernatableWebSocketAckTestHooks(
      websocket,
      {
        getState: () => {
          const hooks = REMOTE_HIBERNATABLE_WEBSOCKET_ACK_HOOKS.get(token);
          if (!hooks) {
            throw new Error(
              `remote hibernatable websocket ack hooks are unavailable for token ${token}`,
            );
          }
          return hooks.getState();
        },
        waitForAck: async (serverMessageIndex) => {
          const hooks = REMOTE_HIBERNATABLE_WEBSOCKET_ACK_HOOKS.get(token);
          if (!hooks) {
            throw new Error(
              `remote hibernatable websocket ack hooks are unavailable for token ${token}`,
            );
          }
          await hooks.waitForAck(serverMessageIndex);
        },
      },
      enabled,
    );
  }
  function logger3() {
    return getLogger("engine-client");
  }
  var BufferedRemoteWebSocket = class {
    CONNECTING = 0;
    OPEN = 1;
    CLOSING = 2;
    CLOSED = 3;
    #inner;
    #listeners = /* @__PURE__ */ new Map();
    #queuedEvents = [];
    #onopen = null;
    #onclose = null;
    #onerror = null;
    #onmessage = null;
    constructor(inner) {
      this.#inner = inner;
      for (const type of ["open", "message", "close", "error"]) {
        this.#inner.addEventListener(type, (event) => {
          this.#handleEvent(type, event);
        });
      }
    }
    get readyState() {
      return this.#inner.readyState;
    }
    get binaryType() {
      return this.#inner.binaryType;
    }
    set binaryType(value) {
      this.#inner.binaryType = value;
    }
    get bufferedAmount() {
      return this.#inner.bufferedAmount;
    }
    get extensions() {
      return this.#inner.extensions;
    }
    get protocol() {
      return this.#inner.protocol;
    }
    get url() {
      return this.#inner.url;
    }
    get onopen() {
      return this.#onopen;
    }
    set onopen(handler) {
      this.#onopen = handler;
      this.#flushQueuedEvents();
    }
    get onclose() {
      return this.#onclose;
    }
    set onclose(handler) {
      this.#onclose = handler;
      this.#flushQueuedEvents();
    }
    get onerror() {
      return this.#onerror;
    }
    set onerror(handler) {
      this.#onerror = handler;
      this.#flushQueuedEvents();
    }
    get onmessage() {
      return this.#onmessage;
    }
    set onmessage(handler) {
      this.#onmessage = handler;
      this.#flushQueuedEvents();
    }
    send(data) {
      this.#inner.send(data);
    }
    close(code, reason) {
      this.#inner.close(code, reason);
    }
    addEventListener(type, listener) {
      const listeners = this.#listeners.get(type) ?? /* @__PURE__ */ new Set();
      listeners.add(listener);
      this.#listeners.set(type, listeners);
      this.#flushQueuedEvents();
    }
    removeEventListener(type, listener) {
      this.#listeners.get(type)?.delete(listener);
    }
    dispatchEvent(event) {
      return this.#dispatchEvent(event.type, event);
    }
    #handleEvent(type, event) {
      if (this.#hasConsumer(type)) {
        this.#dispatchEvent(type, event);
        return;
      }
      this.#queuedEvents.push({ type, event });
    }
    #flushQueuedEvents() {
      if (this.#queuedEvents.length === 0) {
        return;
      }
      const pending = this.#queuedEvents;
      this.#queuedEvents = [];
      for (const pendingEvent of pending) {
        if (this.#hasConsumer(pendingEvent.type)) {
          this.#dispatchEvent(pendingEvent.type, pendingEvent.event);
          continue;
        }
        this.#queuedEvents.push(pendingEvent);
      }
    }
    #hasConsumer(type) {
      const handler =
        type === "open"
          ? this.#onopen
          : type === "close"
            ? this.#onclose
            : type === "error"
              ? this.#onerror
              : type === "message"
                ? this.#onmessage
                : null;
      return Boolean(handler) || (this.#listeners.get(type)?.size ?? 0) > 0;
    }
    #dispatchEvent(type, event) {
      const listeners = this.#listeners.get(type);
      if (listeners) {
        for (const listener of listeners) {
          listener(event);
        }
      }
      const handler =
        type === "open"
          ? this.#onopen
          : type === "close"
            ? this.#onclose
            : type === "error"
              ? this.#onerror
              : type === "message"
                ? this.#onmessage
                : null;
      handler?.(event);
      return true;
    }
  };
  function buildActorGatewayUrl(endpoint, actorId, token, path = "") {
    const tokenSegment = token !== void 0 ? `@${encodeURIComponent(token)}` : "";
    const gatewayPath = `/gateway/${encodeURIComponent(actorId)}${tokenSegment}${path}`;
    return combineUrlPath(endpoint, gatewayPath);
  }
  function buildActorQueryGatewayUrl(
    endpoint,
    namespace,
    query,
    token,
    path = "",
    maxInputSize = DEFAULT_MAX_QUERY_INPUT_SIZE,
    crashPolicy = void 0,
    runnerName,
    options = {},
  ) {
    if (namespace.length === 0) {
      throw new Error("actor query namespace must not be empty");
    }
    let name;
    const params = new URLSearchParams();
    params.append("rvt-namespace", namespace);
    if ("getForKey" in query) {
      name = query.getForKey.name;
      params.append("rvt-method", "get");
      pushKeyQueryParams(params, query.getForKey.key);
      if (crashPolicy !== void 0) {
        throw new Error("Actor query method=get does not support crashPolicy.");
      }
      if (runnerName !== void 0) {
        throw new Error("Actor query method=get does not support runnerName.");
      }
    } else if ("getOrCreateForKey" in query) {
      name = query.getOrCreateForKey.name;
      params.append("rvt-method", "getOrCreate");
      if (runnerName === void 0) {
        throw new Error("Actor query method=getOrCreate requires runnerName.");
      }
      params.append("rvt-runner", runnerName);
      pushKeyQueryParams(params, query.getOrCreateForKey.key);
      pushInputQueryParam(params, query.getOrCreateForKey.input, maxInputSize);
      if (query.getOrCreateForKey.region !== void 0) {
        params.append("rvt-region", query.getOrCreateForKey.region);
      }
      params.append("rvt-crash-policy", crashPolicy ?? "sleep");
    } else {
      throw new Error("Actor query gateway URLs only support get and getOrCreate.");
    }
    if (name.length === 0) {
      throw new Error("actor query name must not be empty");
    }
    if (token !== void 0) {
      params.append("rvt-token", token);
    }
    if (shouldSkipReadyWait(options)) {
      params.append("rvt-skip-ready-wait", "true");
    }
    const queryString = params.toString();
    let separator;
    if (path.endsWith("?") || path.endsWith("&")) {
      separator = "";
    } else if (path.includes("?")) {
      separator = "&";
    } else {
      separator = "?";
    }
    const gatewayPath = `/gateway/${encodeURIComponent(name)}${path}${separator}${queryString}`;
    return combineUrlPath(endpoint, gatewayPath);
  }
  function pushKeyQueryParams(params, key) {
    if (key.length > 0) {
      params.append("rvt-key", key.join(","));
    }
  }
  function pushInputQueryParam(params, input, maxInputSize) {
    if (input === void 0) {
      return;
    }
    const encodedInput = encodeCborCompat(input);
    if (encodedInput.byteLength > maxInputSize) {
      throw new Error(
        `Actor query input exceeds maxInputSize (${encodedInput.byteLength} > ${maxInputSize} bytes). Increase client maxInputSize to allow larger query payloads.`,
      );
    }
    params.append("rvt-input", uint8ArrayToBase64Url(encodedInput));
  }
  function uint8ArrayToBase64Url(value) {
    return uint8ArrayToBase642(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  async function openWebSocketToGateway(runConfig, gatewayUrl, encoding, params, options = {}) {
    const WebSocket2 = await importWebSocket();
    const ackHookToken =
      typeof process !== "undefined" && process.env.VITEST ? crypto.randomUUID() : void 0;
    logger3().debug({
      msg: "opening websocket to actor via guard",
      gatewayUrl,
    });
    const ws = new WebSocket2(
      gatewayUrl,
      buildWebSocketProtocols(
        runConfig,
        encoding,
        params,
        ackHookToken,
        options.directActorId
          ? {
              target: "actor",
              actorId: options.directActorId,
            }
          : void 0,
        options,
      ),
    );
    ws.binaryType = "arraybuffer";
    const bufferedWs = new BufferedRemoteWebSocket(ws);
    if (ackHookToken) {
      setRemoteHibernatableWebSocketAckTestHooks(bufferedWs, ackHookToken, true);
    }
    return bufferedWs;
  }
  function buildWebSocketProtocols(
    runConfig,
    encoding,
    params,
    ackHookToken,
    target2,
    options = {},
  ) {
    const protocols = [];
    protocols.push(WS_PROTOCOL_STANDARD);
    protocols.push(`${WS_PROTOCOL_ENCODING}${encoding}`);
    if (target2) {
      protocols.push(`${WS_PROTOCOL_TARGET}${target2.target}`);
      protocols.push(`${WS_PROTOCOL_ACTOR}${target2.actorId}`);
      if (runConfig.token) {
        protocols.push(`${WS_PROTOCOL_TOKEN}${runConfig.token}`);
      }
    }
    if (shouldSkipReadyWait(options)) {
      protocols.push(WS_PROTOCOL_SKIP_READY_WAIT);
    }
    if (params) {
      protocols.push(`${WS_PROTOCOL_CONN_PARAMS}${encodeURIComponent(JSON.stringify(params))}`);
    }
    if (ackHookToken) {
      protocols.push(`${WS_PROTOCOL_TEST_ACK_HOOK}${encodeURIComponent(ackHookToken)}`);
    }
    return protocols;
  }
  var DEFAULT_CONFIG = /* @__PURE__ */ Config({});
  function readCbor(bc) {
    return readData(bc);
  }
  function writeCbor(bc, x) {
    writeData(bc, x);
  }
  function readInit(bc) {
    return {
      actorId: readString(bc),
      connectionId: readString(bc),
      connectionToken: readString(bc),
    };
  }
  function writeInit(bc, x) {
    writeString(bc, x.actorId);
    writeString(bc, x.connectionId);
    writeString(bc, x.connectionToken);
  }
  function read0(bc) {
    return readBool(bc) ? readCbor(bc) : null;
  }
  function write0(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeCbor(bc, x);
    }
  }
  function read1(bc) {
    return readBool(bc) ? readUint(bc) : null;
  }
  function write1(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeUint(bc, x);
    }
  }
  function readError(bc) {
    return {
      group: readString(bc),
      code: readString(bc),
      message: readString(bc),
      metadata: read0(bc),
      actionId: read1(bc),
    };
  }
  function writeError(bc, x) {
    writeString(bc, x.group);
    writeString(bc, x.code);
    writeString(bc, x.message);
    write0(bc, x.metadata);
    write1(bc, x.actionId);
  }
  function readActionResponse(bc) {
    return {
      id: readUint(bc),
      output: readCbor(bc),
    };
  }
  function writeActionResponse(bc, x) {
    writeUint(bc, x.id);
    writeCbor(bc, x.output);
  }
  function readEvent(bc) {
    return {
      name: readString(bc),
      args: readCbor(bc),
    };
  }
  function writeEvent(bc, x) {
    writeString(bc, x.name);
    writeCbor(bc, x.args);
  }
  function readToClientBody(bc) {
    const offset = bc.offset;
    const tag = readU8(bc);
    switch (tag) {
      case 0:
        return { tag: "Init", val: readInit(bc) };
      case 1:
        return { tag: "Error", val: readError(bc) };
      case 2:
        return { tag: "ActionResponse", val: readActionResponse(bc) };
      case 3:
        return { tag: "Event", val: readEvent(bc) };
      default: {
        bc.offset = offset;
        throw new BareError(offset, "invalid tag");
      }
    }
  }
  function writeToClientBody(bc, x) {
    switch (x.tag) {
      case "Init": {
        writeU8(bc, 0);
        writeInit(bc, x.val);
        break;
      }
      case "Error": {
        writeU8(bc, 1);
        writeError(bc, x.val);
        break;
      }
      case "ActionResponse": {
        writeU8(bc, 2);
        writeActionResponse(bc, x.val);
        break;
      }
      case "Event": {
        writeU8(bc, 3);
        writeEvent(bc, x.val);
        break;
      }
    }
  }
  function readToClient(bc) {
    return {
      body: readToClientBody(bc),
    };
  }
  function writeToClient(bc, x) {
    writeToClientBody(bc, x.body);
  }
  function encodeToClient(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeToClient(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeToClient(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG);
    const result = readToClient(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readActionRequest(bc) {
    return {
      id: readUint(bc),
      name: readString(bc),
      args: readCbor(bc),
    };
  }
  function writeActionRequest(bc, x) {
    writeUint(bc, x.id);
    writeString(bc, x.name);
    writeCbor(bc, x.args);
  }
  function readSubscriptionRequest(bc) {
    return {
      eventName: readString(bc),
      subscribe: readBool(bc),
    };
  }
  function writeSubscriptionRequest(bc, x) {
    writeString(bc, x.eventName);
    writeBool(bc, x.subscribe);
  }
  function readToServerBody(bc) {
    const offset = bc.offset;
    const tag = readU8(bc);
    switch (tag) {
      case 0:
        return { tag: "ActionRequest", val: readActionRequest(bc) };
      case 1:
        return { tag: "SubscriptionRequest", val: readSubscriptionRequest(bc) };
      default: {
        bc.offset = offset;
        throw new BareError(offset, "invalid tag");
      }
    }
  }
  function writeToServerBody(bc, x) {
    switch (x.tag) {
      case "ActionRequest": {
        writeU8(bc, 0);
        writeActionRequest(bc, x.val);
        break;
      }
      case "SubscriptionRequest": {
        writeU8(bc, 1);
        writeSubscriptionRequest(bc, x.val);
        break;
      }
    }
  }
  function readToServer(bc) {
    return {
      body: readToServerBody(bc),
    };
  }
  function writeToServer(bc, x) {
    writeToServerBody(bc, x.body);
  }
  function encodeToServer(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeToServer(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeToServer(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG);
    const result = readToServer(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpActionRequest(bc) {
    return {
      args: readCbor(bc),
    };
  }
  function writeHttpActionRequest(bc, x) {
    writeCbor(bc, x.args);
  }
  function encodeHttpActionRequest(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpActionRequest(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpActionRequest(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG);
    const result = readHttpActionRequest(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpActionResponse(bc) {
    return {
      output: readCbor(bc),
    };
  }
  function writeHttpActionResponse(bc, x) {
    writeCbor(bc, x.output);
  }
  function encodeHttpActionResponse(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpActionResponse(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpActionResponse(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG);
    const result = readHttpActionResponse(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpResponseError(bc) {
    return {
      group: readString(bc),
      code: readString(bc),
      message: readString(bc),
      metadata: read0(bc),
    };
  }
  function writeHttpResponseError(bc, x) {
    writeString(bc, x.group);
    writeString(bc, x.code);
    writeString(bc, x.message);
    write0(bc, x.metadata);
  }
  function encodeHttpResponseError(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpResponseError(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpResponseError(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG);
    const result = readHttpResponseError(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpResolveResponse(bc) {
    return {
      actorId: readString(bc),
    };
  }
  function writeHttpResolveResponse(bc, x) {
    writeString(bc, x.actorId);
  }
  function encodeHttpResolveResponse(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpResolveResponse(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpResolveResponse(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG);
    const result = readHttpResolveResponse(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  var DEFAULT_CONFIG2 = /* @__PURE__ */ Config({});
  function readCbor2(bc) {
    return readData(bc);
  }
  function writeCbor2(bc, x) {
    writeData(bc, x);
  }
  function readInit2(bc) {
    return {
      actorId: readString(bc),
      connectionId: readString(bc),
    };
  }
  function writeInit2(bc, x) {
    writeString(bc, x.actorId);
    writeString(bc, x.connectionId);
  }
  function read02(bc) {
    return readBool(bc) ? readCbor2(bc) : null;
  }
  function write02(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeCbor2(bc, x);
    }
  }
  function read12(bc) {
    return readBool(bc) ? readUint(bc) : null;
  }
  function write12(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeUint(bc, x);
    }
  }
  function readError2(bc) {
    return {
      group: readString(bc),
      code: readString(bc),
      message: readString(bc),
      metadata: read02(bc),
      actionId: read12(bc),
    };
  }
  function writeError2(bc, x) {
    writeString(bc, x.group);
    writeString(bc, x.code);
    writeString(bc, x.message);
    write02(bc, x.metadata);
    write12(bc, x.actionId);
  }
  function readActionResponse2(bc) {
    return {
      id: readUint(bc),
      output: readCbor2(bc),
    };
  }
  function writeActionResponse2(bc, x) {
    writeUint(bc, x.id);
    writeCbor2(bc, x.output);
  }
  function readEvent2(bc) {
    return {
      name: readString(bc),
      args: readCbor2(bc),
    };
  }
  function writeEvent2(bc, x) {
    writeString(bc, x.name);
    writeCbor2(bc, x.args);
  }
  function readToClientBody2(bc) {
    const offset = bc.offset;
    const tag = readU8(bc);
    switch (tag) {
      case 0:
        return { tag: "Init", val: readInit2(bc) };
      case 1:
        return { tag: "Error", val: readError2(bc) };
      case 2:
        return { tag: "ActionResponse", val: readActionResponse2(bc) };
      case 3:
        return { tag: "Event", val: readEvent2(bc) };
      default: {
        bc.offset = offset;
        throw new BareError(offset, "invalid tag");
      }
    }
  }
  function writeToClientBody2(bc, x) {
    switch (x.tag) {
      case "Init": {
        writeU8(bc, 0);
        writeInit2(bc, x.val);
        break;
      }
      case "Error": {
        writeU8(bc, 1);
        writeError2(bc, x.val);
        break;
      }
      case "ActionResponse": {
        writeU8(bc, 2);
        writeActionResponse2(bc, x.val);
        break;
      }
      case "Event": {
        writeU8(bc, 3);
        writeEvent2(bc, x.val);
        break;
      }
    }
  }
  function readToClient2(bc) {
    return {
      body: readToClientBody2(bc),
    };
  }
  function writeToClient2(bc, x) {
    writeToClientBody2(bc, x.body);
  }
  function encodeToClient2(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG2;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeToClient2(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeToClient2(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG2);
    const result = readToClient2(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readActionRequest2(bc) {
    return {
      id: readUint(bc),
      name: readString(bc),
      args: readCbor2(bc),
    };
  }
  function writeActionRequest2(bc, x) {
    writeUint(bc, x.id);
    writeString(bc, x.name);
    writeCbor2(bc, x.args);
  }
  function readSubscriptionRequest2(bc) {
    return {
      eventName: readString(bc),
      subscribe: readBool(bc),
    };
  }
  function writeSubscriptionRequest2(bc, x) {
    writeString(bc, x.eventName);
    writeBool(bc, x.subscribe);
  }
  function readToServerBody2(bc) {
    const offset = bc.offset;
    const tag = readU8(bc);
    switch (tag) {
      case 0:
        return { tag: "ActionRequest", val: readActionRequest2(bc) };
      case 1:
        return { tag: "SubscriptionRequest", val: readSubscriptionRequest2(bc) };
      default: {
        bc.offset = offset;
        throw new BareError(offset, "invalid tag");
      }
    }
  }
  function writeToServerBody2(bc, x) {
    switch (x.tag) {
      case "ActionRequest": {
        writeU8(bc, 0);
        writeActionRequest2(bc, x.val);
        break;
      }
      case "SubscriptionRequest": {
        writeU8(bc, 1);
        writeSubscriptionRequest2(bc, x.val);
        break;
      }
    }
  }
  function readToServer2(bc) {
    return {
      body: readToServerBody2(bc),
    };
  }
  function writeToServer2(bc, x) {
    writeToServerBody2(bc, x.body);
  }
  function encodeToServer2(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG2;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeToServer2(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeToServer2(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG2);
    const result = readToServer2(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpActionRequest2(bc) {
    return {
      args: readCbor2(bc),
    };
  }
  function writeHttpActionRequest2(bc, x) {
    writeCbor2(bc, x.args);
  }
  function encodeHttpActionRequest2(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG2;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpActionRequest2(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpActionRequest2(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG2);
    const result = readHttpActionRequest2(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpActionResponse2(bc) {
    return {
      output: readCbor2(bc),
    };
  }
  function writeHttpActionResponse2(bc, x) {
    writeCbor2(bc, x.output);
  }
  function encodeHttpActionResponse2(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG2;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpActionResponse2(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpActionResponse2(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG2);
    const result = readHttpActionResponse2(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpResponseError2(bc) {
    return {
      group: readString(bc),
      code: readString(bc),
      message: readString(bc),
      metadata: read02(bc),
    };
  }
  function writeHttpResponseError2(bc, x) {
    writeString(bc, x.group);
    writeString(bc, x.code);
    writeString(bc, x.message);
    write02(bc, x.metadata);
  }
  function encodeHttpResponseError2(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG2;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpResponseError2(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpResponseError2(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG2);
    const result = readHttpResponseError2(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpResolveResponse2(bc) {
    return {
      actorId: readString(bc),
    };
  }
  function writeHttpResolveResponse2(bc, x) {
    writeString(bc, x.actorId);
  }
  function encodeHttpResolveResponse2(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG2;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpResolveResponse2(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpResolveResponse2(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG2);
    const result = readHttpResolveResponse2(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  var DEFAULT_CONFIG3 = /* @__PURE__ */ Config({});
  function readCbor3(bc) {
    return readData(bc);
  }
  function writeCbor3(bc, x) {
    writeData(bc, x);
  }
  function readInit3(bc) {
    return {
      actorId: readString(bc),
      connectionId: readString(bc),
    };
  }
  function writeInit3(bc, x) {
    writeString(bc, x.actorId);
    writeString(bc, x.connectionId);
  }
  function read03(bc) {
    return readBool(bc) ? readCbor3(bc) : null;
  }
  function write03(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeCbor3(bc, x);
    }
  }
  function read13(bc) {
    return readBool(bc) ? readUint(bc) : null;
  }
  function write13(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeUint(bc, x);
    }
  }
  function readError3(bc) {
    return {
      group: readString(bc),
      code: readString(bc),
      message: readString(bc),
      metadata: read03(bc),
      actionId: read13(bc),
    };
  }
  function writeError3(bc, x) {
    writeString(bc, x.group);
    writeString(bc, x.code);
    writeString(bc, x.message);
    write03(bc, x.metadata);
    write13(bc, x.actionId);
  }
  function readActionResponse3(bc) {
    return {
      id: readUint(bc),
      output: readCbor3(bc),
    };
  }
  function writeActionResponse3(bc, x) {
    writeUint(bc, x.id);
    writeCbor3(bc, x.output);
  }
  function readEvent3(bc) {
    return {
      name: readString(bc),
      args: readCbor3(bc),
    };
  }
  function writeEvent3(bc, x) {
    writeString(bc, x.name);
    writeCbor3(bc, x.args);
  }
  function readToClientBody3(bc) {
    const offset = bc.offset;
    const tag = readU8(bc);
    switch (tag) {
      case 0:
        return { tag: "Init", val: readInit3(bc) };
      case 1:
        return { tag: "Error", val: readError3(bc) };
      case 2:
        return { tag: "ActionResponse", val: readActionResponse3(bc) };
      case 3:
        return { tag: "Event", val: readEvent3(bc) };
      default: {
        bc.offset = offset;
        throw new BareError(offset, "invalid tag");
      }
    }
  }
  function writeToClientBody3(bc, x) {
    switch (x.tag) {
      case "Init": {
        writeU8(bc, 0);
        writeInit3(bc, x.val);
        break;
      }
      case "Error": {
        writeU8(bc, 1);
        writeError3(bc, x.val);
        break;
      }
      case "ActionResponse": {
        writeU8(bc, 2);
        writeActionResponse3(bc, x.val);
        break;
      }
      case "Event": {
        writeU8(bc, 3);
        writeEvent3(bc, x.val);
        break;
      }
    }
  }
  function readToClient3(bc) {
    return {
      body: readToClientBody3(bc),
    };
  }
  function writeToClient3(bc, x) {
    writeToClientBody3(bc, x.body);
  }
  function encodeToClient3(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG3;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeToClient3(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeToClient3(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG3);
    const result = readToClient3(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readActionRequest3(bc) {
    return {
      id: readUint(bc),
      name: readString(bc),
      args: readCbor3(bc),
    };
  }
  function writeActionRequest3(bc, x) {
    writeUint(bc, x.id);
    writeString(bc, x.name);
    writeCbor3(bc, x.args);
  }
  function readSubscriptionRequest3(bc) {
    return {
      eventName: readString(bc),
      subscribe: readBool(bc),
    };
  }
  function writeSubscriptionRequest3(bc, x) {
    writeString(bc, x.eventName);
    writeBool(bc, x.subscribe);
  }
  function readToServerBody3(bc) {
    const offset = bc.offset;
    const tag = readU8(bc);
    switch (tag) {
      case 0:
        return { tag: "ActionRequest", val: readActionRequest3(bc) };
      case 1:
        return { tag: "SubscriptionRequest", val: readSubscriptionRequest3(bc) };
      default: {
        bc.offset = offset;
        throw new BareError(offset, "invalid tag");
      }
    }
  }
  function writeToServerBody3(bc, x) {
    switch (x.tag) {
      case "ActionRequest": {
        writeU8(bc, 0);
        writeActionRequest3(bc, x.val);
        break;
      }
      case "SubscriptionRequest": {
        writeU8(bc, 1);
        writeSubscriptionRequest3(bc, x.val);
        break;
      }
    }
  }
  function readToServer3(bc) {
    return {
      body: readToServerBody3(bc),
    };
  }
  function writeToServer3(bc, x) {
    writeToServerBody3(bc, x.body);
  }
  function encodeToServer3(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG3;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeToServer3(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeToServer3(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG3);
    const result = readToServer3(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpActionRequest3(bc) {
    return {
      args: readCbor3(bc),
    };
  }
  function writeHttpActionRequest3(bc, x) {
    writeCbor3(bc, x.args);
  }
  function encodeHttpActionRequest3(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG3;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpActionRequest3(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpActionRequest3(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG3);
    const result = readHttpActionRequest3(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpActionResponse3(bc) {
    return {
      output: readCbor3(bc),
    };
  }
  function writeHttpActionResponse3(bc, x) {
    writeCbor3(bc, x.output);
  }
  function encodeHttpActionResponse3(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG3;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpActionResponse3(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpActionResponse3(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG3);
    const result = readHttpActionResponse3(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function read2(bc) {
    return readBool(bc) ? readString(bc) : null;
  }
  function write2(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeString(bc, x);
    }
  }
  function read3(bc) {
    return readBool(bc) ? readBool(bc) : null;
  }
  function write3(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeBool(bc, x);
    }
  }
  function read4(bc) {
    return readBool(bc) ? readU64(bc) : null;
  }
  function write4(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeU64(bc, x);
    }
  }
  function readHttpQueueSendRequest(bc) {
    return {
      body: readCbor3(bc),
      name: read2(bc),
      wait: read3(bc),
      timeout: read4(bc),
    };
  }
  function writeHttpQueueSendRequest(bc, x) {
    writeCbor3(bc, x.body);
    write2(bc, x.name);
    write3(bc, x.wait);
    write4(bc, x.timeout);
  }
  function encodeHttpQueueSendRequest(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG3;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpQueueSendRequest(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpQueueSendRequest(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG3);
    const result = readHttpQueueSendRequest(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpQueueSendResponse(bc) {
    return {
      status: readString(bc),
      response: read03(bc),
    };
  }
  function writeHttpQueueSendResponse(bc, x) {
    writeString(bc, x.status);
    write03(bc, x.response);
  }
  function encodeHttpQueueSendResponse(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG3;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpQueueSendResponse(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpQueueSendResponse(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG3);
    const result = readHttpQueueSendResponse(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpResponseError3(bc) {
    return {
      group: readString(bc),
      code: readString(bc),
      message: readString(bc),
      metadata: read03(bc),
    };
  }
  function writeHttpResponseError3(bc, x) {
    writeString(bc, x.group);
    writeString(bc, x.code);
    writeString(bc, x.message);
    write03(bc, x.metadata);
  }
  function encodeHttpResponseError3(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG3;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpResponseError3(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpResponseError3(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG3);
    const result = readHttpResponseError3(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpResolveResponse3(bc) {
    return {
      actorId: readString(bc),
    };
  }
  function writeHttpResolveResponse3(bc, x) {
    writeString(bc, x.actorId);
  }
  function encodeHttpResolveResponse3(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG3;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpResolveResponse3(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpResolveResponse3(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG3);
    const result = readHttpResolveResponse3(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  var DEFAULT_CONFIG4 = /* @__PURE__ */ Config({});
  function readCbor4(bc) {
    return readData(bc);
  }
  function writeCbor4(bc, x) {
    writeData(bc, x);
  }
  function read04(bc) {
    return readBool(bc) ? readString(bc) : null;
  }
  function write04(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeString(bc, x);
    }
  }
  function readActorSpecifier(bc) {
    return {
      actorId: readString(bc),
      generation: readUint(bc),
      key: read04(bc),
    };
  }
  function writeActorSpecifier(bc, x) {
    writeString(bc, x.actorId);
    writeUint(bc, x.generation);
    write04(bc, x.key);
  }
  function readInit4(bc) {
    return {
      actorId: readString(bc),
      connectionId: readString(bc),
    };
  }
  function writeInit4(bc, x) {
    writeString(bc, x.actorId);
    writeString(bc, x.connectionId);
  }
  function read14(bc) {
    return readBool(bc) ? readCbor4(bc) : null;
  }
  function write14(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeCbor4(bc, x);
    }
  }
  function read22(bc) {
    return readBool(bc) ? readUint(bc) : null;
  }
  function write22(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeUint(bc, x);
    }
  }
  function read32(bc) {
    return readBool(bc) ? readActorSpecifier(bc) : null;
  }
  function write32(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeActorSpecifier(bc, x);
    }
  }
  function readError4(bc) {
    return {
      group: readString(bc),
      code: readString(bc),
      message: readString(bc),
      metadata: read14(bc),
      actionId: read22(bc),
      actor: read32(bc),
    };
  }
  function writeError4(bc, x) {
    writeString(bc, x.group);
    writeString(bc, x.code);
    writeString(bc, x.message);
    write14(bc, x.metadata);
    write22(bc, x.actionId);
    write32(bc, x.actor);
  }
  function readActionResponse4(bc) {
    return {
      id: readUint(bc),
      output: readCbor4(bc),
    };
  }
  function writeActionResponse4(bc, x) {
    writeUint(bc, x.id);
    writeCbor4(bc, x.output);
  }
  function readEvent4(bc) {
    return {
      name: readString(bc),
      args: readCbor4(bc),
    };
  }
  function writeEvent4(bc, x) {
    writeString(bc, x.name);
    writeCbor4(bc, x.args);
  }
  function readToClientBody4(bc) {
    const offset = bc.offset;
    const tag = readU8(bc);
    switch (tag) {
      case 0:
        return { tag: "Init", val: readInit4(bc) };
      case 1:
        return { tag: "Error", val: readError4(bc) };
      case 2:
        return { tag: "ActionResponse", val: readActionResponse4(bc) };
      case 3:
        return { tag: "Event", val: readEvent4(bc) };
      default: {
        bc.offset = offset;
        throw new BareError(offset, "invalid tag");
      }
    }
  }
  function writeToClientBody4(bc, x) {
    switch (x.tag) {
      case "Init": {
        writeU8(bc, 0);
        writeInit4(bc, x.val);
        break;
      }
      case "Error": {
        writeU8(bc, 1);
        writeError4(bc, x.val);
        break;
      }
      case "ActionResponse": {
        writeU8(bc, 2);
        writeActionResponse4(bc, x.val);
        break;
      }
      case "Event": {
        writeU8(bc, 3);
        writeEvent4(bc, x.val);
        break;
      }
    }
  }
  function readToClient4(bc) {
    return {
      body: readToClientBody4(bc),
    };
  }
  function writeToClient4(bc, x) {
    writeToClientBody4(bc, x.body);
  }
  function encodeToClient4(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG4;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeToClient4(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeToClient4(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG4);
    const result = readToClient4(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readActionRequest4(bc) {
    return {
      id: readUint(bc),
      name: readString(bc),
      args: readCbor4(bc),
    };
  }
  function writeActionRequest4(bc, x) {
    writeUint(bc, x.id);
    writeString(bc, x.name);
    writeCbor4(bc, x.args);
  }
  function readSubscriptionRequest4(bc) {
    return {
      eventName: readString(bc),
      subscribe: readBool(bc),
    };
  }
  function writeSubscriptionRequest4(bc, x) {
    writeString(bc, x.eventName);
    writeBool(bc, x.subscribe);
  }
  function readToServerBody4(bc) {
    const offset = bc.offset;
    const tag = readU8(bc);
    switch (tag) {
      case 0:
        return { tag: "ActionRequest", val: readActionRequest4(bc) };
      case 1:
        return { tag: "SubscriptionRequest", val: readSubscriptionRequest4(bc) };
      default: {
        bc.offset = offset;
        throw new BareError(offset, "invalid tag");
      }
    }
  }
  function writeToServerBody4(bc, x) {
    switch (x.tag) {
      case "ActionRequest": {
        writeU8(bc, 0);
        writeActionRequest4(bc, x.val);
        break;
      }
      case "SubscriptionRequest": {
        writeU8(bc, 1);
        writeSubscriptionRequest4(bc, x.val);
        break;
      }
    }
  }
  function readToServer4(bc) {
    return {
      body: readToServerBody4(bc),
    };
  }
  function writeToServer4(bc, x) {
    writeToServerBody4(bc, x.body);
  }
  function encodeToServer4(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG4;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeToServer4(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeToServer4(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG4);
    const result = readToServer4(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpActionRequest4(bc) {
    return {
      args: readCbor4(bc),
    };
  }
  function writeHttpActionRequest4(bc, x) {
    writeCbor4(bc, x.args);
  }
  function encodeHttpActionRequest4(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG4;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpActionRequest4(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpActionRequest4(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG4);
    const result = readHttpActionRequest4(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpActionResponse4(bc) {
    return {
      output: readCbor4(bc),
    };
  }
  function writeHttpActionResponse4(bc, x) {
    writeCbor4(bc, x.output);
  }
  function encodeHttpActionResponse4(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG4;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpActionResponse4(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpActionResponse4(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG4);
    const result = readHttpActionResponse4(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function read42(bc) {
    return readBool(bc) ? readBool(bc) : null;
  }
  function write42(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeBool(bc, x);
    }
  }
  function read5(bc) {
    return readBool(bc) ? readU64(bc) : null;
  }
  function write5(bc, x) {
    writeBool(bc, x != null);
    if (x != null) {
      writeU64(bc, x);
    }
  }
  function readHttpQueueSendRequest2(bc) {
    return {
      body: readCbor4(bc),
      name: read04(bc),
      wait: read42(bc),
      timeout: read5(bc),
    };
  }
  function writeHttpQueueSendRequest2(bc, x) {
    writeCbor4(bc, x.body);
    write04(bc, x.name);
    write42(bc, x.wait);
    write5(bc, x.timeout);
  }
  function encodeHttpQueueSendRequest2(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG4;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpQueueSendRequest2(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpQueueSendRequest2(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG4);
    const result = readHttpQueueSendRequest2(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpQueueSendResponse2(bc) {
    return {
      status: readString(bc),
      response: read14(bc),
    };
  }
  function writeHttpQueueSendResponse2(bc, x) {
    writeString(bc, x.status);
    write14(bc, x.response);
  }
  function encodeHttpQueueSendResponse2(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG4;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpQueueSendResponse2(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpQueueSendResponse2(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG4);
    const result = readHttpQueueSendResponse2(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpResponseError4(bc) {
    return {
      group: readString(bc),
      code: readString(bc),
      message: readString(bc),
      metadata: read14(bc),
      actor: read32(bc),
    };
  }
  function writeHttpResponseError4(bc, x) {
    writeString(bc, x.group);
    writeString(bc, x.code);
    writeString(bc, x.message);
    write14(bc, x.metadata);
    write32(bc, x.actor);
  }
  function encodeHttpResponseError4(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG4;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpResponseError4(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpResponseError4(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG4);
    const result = readHttpResponseError4(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  function readHttpResolveResponse4(bc) {
    return {
      actorId: readString(bc),
    };
  }
  function writeHttpResolveResponse4(bc, x) {
    writeString(bc, x.actorId);
  }
  function encodeHttpResolveResponse4(x, config2) {
    const fullConfig = config2 != null ? Config(config2) : DEFAULT_CONFIG4;
    const bc = new ByteCursor(new Uint8Array(fullConfig.initialBufferLength), fullConfig);
    writeHttpResolveResponse4(bc, x);
    return new Uint8Array(bc.view.buffer, bc.view.byteOffset, bc.offset);
  }
  function decodeHttpResolveResponse4(bytes) {
    const bc = new ByteCursor(bytes, DEFAULT_CONFIG4);
    const result = readHttpResolveResponse4(bc);
    if (bc.offset < bc.view.byteLength) {
      throw new BareError(bc.offset, "remaining bytes");
    }
    return result;
  }
  var CURRENT_VERSION = 4;
  var v1ToV2 = (v1Data) => {
    if (v1Data.body.tag === "Init") {
      const { actorId, connectionId } = v1Data.body.val;
      return {
        body: {
          tag: "Init",
          val: {
            actorId,
            connectionId,
          },
        },
      };
    }
    return v1Data;
  };
  var v2ToV1 = (v2Data) => {
    if (v2Data.body.tag === "Init") {
      const { actorId, connectionId } = v2Data.body.val;
      return {
        body: {
          tag: "Init",
          val: {
            actorId,
            connectionId,
            connectionToken: "",
            // Add empty connectionToken for v1 compatibility
          },
        },
      };
    }
    return v2Data;
  };
  var v2ToV3 = (v2Data) => {
    return v2Data;
  };
  var v3ToV4 = (v3Data) => {
    if (v3Data.body.tag === "Error") {
      return {
        body: {
          tag: "Error",
          val: {
            ...v3Data.body.val,
            actor: null,
          },
        },
      };
    }
    return v3Data;
  };
  var v4ToV3 = (v4Data) => {
    if (v4Data.body.tag === "Error") {
      const { actor: _, ...val } = v4Data.body.val;
      return {
        body: {
          tag: "Error",
          val,
        },
      };
    }
    return v4Data;
  };
  var v3ToV2 = (v3Data) => {
    return v3Data;
  };
  var v1ToServerV2 = (v1Data) => {
    return v1Data;
  };
  var v2ToServerV3 = (v2Data) => {
    return v2Data;
  };
  var v3ToServerV4 = (v3Data) => {
    return v3Data;
  };
  var v4ToServerV3 = (v4Data) => {
    return v4Data;
  };
  var v3ToServerV2 = (v3Data) => {
    return v3Data;
  };
  var v2ToServerV1 = (v2Data) => {
    return v2Data;
  };
  var v3HttpResponseErrorToV4 = (v3Data) => ({
    ...v3Data,
    actor: null,
  });
  var v4HttpResponseErrorToV3 = (v4Data) => {
    const { actor: _, ...rest } = v4Data;
    return rest;
  };
  var CLIENT_PROTOCOL_TO_SERVER = createVersionedDataHandler({
    deserializeVersion: (bytes, version2) => {
      switch (version2) {
        case 1:
          return decodeToServer(bytes);
        case 2:
          return decodeToServer2(bytes);
        case 3:
          return decodeToServer3(bytes);
        case 4:
          return decodeToServer4(bytes);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    serializeVersion: (data, version2) => {
      switch (version2) {
        case 1:
          return encodeToServer(data);
        case 2:
          return encodeToServer2(data);
        case 3:
          return encodeToServer3(data);
        case 4:
          return encodeToServer4(data);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    deserializeConverters: () => [v1ToServerV2, v2ToServerV3, v3ToServerV4],
    serializeConverters: () => [v4ToServerV3, v3ToServerV2, v2ToServerV1],
  });
  var CLIENT_PROTOCOL_TO_CLIENT = createVersionedDataHandler({
    deserializeVersion: (bytes, version2) => {
      switch (version2) {
        case 1:
          return decodeToClient(bytes);
        case 2:
          return decodeToClient2(bytes);
        case 3:
          return decodeToClient3(bytes);
        case 4:
          return decodeToClient4(bytes);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    serializeVersion: (data, version2) => {
      switch (version2) {
        case 1:
          return encodeToClient(data);
        case 2:
          return encodeToClient2(data);
        case 3:
          return encodeToClient3(data);
        case 4:
          return encodeToClient4(data);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    deserializeConverters: () => [v1ToV2, v2ToV3, v3ToV4],
    serializeConverters: () => [v4ToV3, v3ToV2, v2ToV1],
  });
  var HTTP_ACTION_REQUEST_VERSIONED = createVersionedDataHandler({
    deserializeVersion: (bytes, version2) => {
      switch (version2) {
        case 1:
          return decodeHttpActionRequest(bytes);
        case 2:
          return decodeHttpActionRequest2(bytes);
        case 3:
          return decodeHttpActionRequest3(bytes);
        case 4:
          return decodeHttpActionRequest4(bytes);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    serializeVersion: (data, version2) => {
      switch (version2) {
        case 1:
          return encodeHttpActionRequest(data);
        case 2:
          return encodeHttpActionRequest2(data);
        case 3:
          return encodeHttpActionRequest3(data);
        case 4:
          return encodeHttpActionRequest4(data);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    deserializeConverters: () => [],
    serializeConverters: () => [],
  });
  var HTTP_ACTION_RESPONSE_VERSIONED = createVersionedDataHandler({
    deserializeVersion: (bytes, version2) => {
      switch (version2) {
        case 1:
          return decodeHttpActionResponse(bytes);
        case 2:
          return decodeHttpActionResponse2(bytes);
        case 3:
          return decodeHttpActionResponse3(bytes);
        case 4:
          return decodeHttpActionResponse4(bytes);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    serializeVersion: (data, version2) => {
      switch (version2) {
        case 1:
          return encodeHttpActionResponse(data);
        case 2:
          return encodeHttpActionResponse2(data);
        case 3:
          return encodeHttpActionResponse3(data);
        case 4:
          return encodeHttpActionResponse4(data);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    deserializeConverters: () => [],
    serializeConverters: () => [],
  });
  var HTTP_QUEUE_SEND_REQUEST_VERSIONED = createVersionedDataHandler({
    deserializeVersion: (bytes, version2) => {
      switch (version2) {
        case 3:
          return decodeHttpQueueSendRequest(bytes);
        case 4:
          return decodeHttpQueueSendRequest2(bytes);
        default:
          throw new Error(
            `HttpQueueSendRequest only exists in version 3+, got version ${version2}`,
          );
      }
    },
    serializeVersion: (data, version2) => {
      switch (version2) {
        case 3:
          return encodeHttpQueueSendRequest(data);
        case 4:
          return encodeHttpQueueSendRequest2(data);
        default:
          throw new Error(
            `HttpQueueSendRequest only exists in version 3+, got version ${version2}`,
          );
      }
    },
    deserializeConverters: () => [],
    serializeConverters: () => [],
  });
  var HTTP_QUEUE_SEND_RESPONSE_VERSIONED = createVersionedDataHandler({
    deserializeVersion: (bytes, version2) => {
      switch (version2) {
        case 3:
          return decodeHttpQueueSendResponse(bytes);
        case 4:
          return decodeHttpQueueSendResponse2(bytes);
        default:
          throw new Error(
            `HttpQueueSendResponse only exists in version 3+, got version ${version2}`,
          );
      }
    },
    serializeVersion: (data, version2) => {
      switch (version2) {
        case 3:
          return encodeHttpQueueSendResponse(data);
        case 4:
          return encodeHttpQueueSendResponse2(data);
        default:
          throw new Error(
            `HttpQueueSendResponse only exists in version 3+, got version ${version2}`,
          );
      }
    },
    deserializeConverters: () => [],
    serializeConverters: () => [],
  });
  var HTTP_RESPONSE_ERROR_VERSIONED = createVersionedDataHandler({
    deserializeVersion: (bytes, version2) => {
      switch (version2) {
        case 1:
          return decodeHttpResponseError(bytes);
        case 2:
          return decodeHttpResponseError2(bytes);
        case 3:
          return decodeHttpResponseError3(bytes);
        case 4:
          return decodeHttpResponseError4(bytes);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    serializeVersion: (data, version2) => {
      switch (version2) {
        case 1:
          return encodeHttpResponseError(data);
        case 2:
          return encodeHttpResponseError2(data);
        case 3:
          return encodeHttpResponseError3(data);
        case 4:
          return encodeHttpResponseError4(data);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    deserializeConverters: () => [(data) => data, (data) => data, v3HttpResponseErrorToV4],
    serializeConverters: () => [v4HttpResponseErrorToV3, (data) => data, (data) => data],
  });
  var HTTP_RESOLVE_RESPONSE_VERSIONED = createVersionedDataHandler({
    deserializeVersion: (bytes, version2) => {
      switch (version2) {
        case 1:
          return decodeHttpResolveResponse(bytes);
        case 2:
          return decodeHttpResolveResponse2(bytes);
        case 3:
          return decodeHttpResolveResponse3(bytes);
        case 4:
          return decodeHttpResolveResponse4(bytes);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    serializeVersion: (data, version2) => {
      switch (version2) {
        case 1:
          return encodeHttpResolveResponse(data);
        case 2:
          return encodeHttpResolveResponse2(data);
        case 3:
          return encodeHttpResolveResponse3(data);
        case 4:
          return encodeHttpResolveResponse4(data);
        default:
          throw new Error(`Unknown version ${version2}`);
      }
    },
    deserializeConverters: () => [],
    serializeConverters: () => [],
  });
  var UintSchema = external_exports.bigint();
  var OptionalUintSchema = UintSchema.nullable();
  var ActorSpecifierSchema = external_exports.object({
    actorId: external_exports.string(),
    generation: external_exports.union([external_exports.number(), external_exports.bigint()]),
    key: external_exports.string().optional(),
  });
  var InitSchema = external_exports.object({
    actorId: external_exports.string(),
    connectionId: external_exports.string(),
  });
  var ErrorSchema = external_exports.object({
    group: external_exports.string(),
    code: external_exports.string(),
    message: external_exports.string(),
    metadata: external_exports.unknown().optional(),
    actionId: OptionalUintSchema,
    actor: ActorSpecifierSchema.optional(),
  });
  var ActionResponseSchema = external_exports.object({
    id: UintSchema,
    output: external_exports.unknown(),
  });
  var EventSchema = external_exports.object({
    name: external_exports.string(),
    args: external_exports.unknown(),
  });
  var ToClientBodySchema = external_exports.discriminatedUnion("tag", [
    external_exports.object({ tag: external_exports.literal("Init"), val: InitSchema }),
    external_exports.object({ tag: external_exports.literal("Error"), val: ErrorSchema }),
    external_exports.object({
      tag: external_exports.literal("ActionResponse"),
      val: ActionResponseSchema,
    }),
    external_exports.object({ tag: external_exports.literal("Event"), val: EventSchema }),
  ]);
  var ToClientSchema = external_exports.object({
    body: ToClientBodySchema,
  });
  var ActionRequestSchema = external_exports.object({
    id: UintSchema,
    name: external_exports.string(),
    args: external_exports.unknown(),
  });
  var SubscriptionRequestSchema = external_exports.object({
    eventName: external_exports.string(),
    subscribe: external_exports.boolean(),
  });
  var ToServerBodySchema = external_exports.discriminatedUnion("tag", [
    external_exports.object({
      tag: external_exports.literal("ActionRequest"),
      val: ActionRequestSchema,
    }),
    external_exports.object({
      tag: external_exports.literal("SubscriptionRequest"),
      val: SubscriptionRequestSchema,
    }),
  ]);
  var ToServerSchema = external_exports.object({
    body: ToServerBodySchema,
  });
  var HttpActionRequestSchema = external_exports.object({
    args: external_exports.unknown(),
  });
  var HttpActionResponseSchema = external_exports.object({
    output: external_exports.unknown(),
  });
  var HttpQueueSendRequestSchema = external_exports.object({
    body: external_exports.unknown(),
    name: external_exports.string().optional(),
    wait: external_exports.boolean().optional(),
    timeout: external_exports.number().optional(),
  });
  var HttpQueueSendResponseSchema = external_exports.object({
    status: external_exports.enum(["completed", "timedOut"]),
    response: external_exports.unknown().optional(),
  });
  var HttpResponseErrorSchema = external_exports.object({
    group: external_exports.string(),
    code: external_exports.string(),
    message: external_exports.string(),
    metadata: external_exports.unknown().optional(),
    actor: ActorSpecifierSchema.optional(),
  });
  var HttpResolveRequestSchema = external_exports.null();
  var HttpResolveResponseSchema = external_exports.object({
    actorId: external_exports.string(),
  });
  var ActorClientError = class extends Error {};
  var HttpRequestError = class extends ActorClientError {
    constructor(message, opts) {
      super(`HTTP request error: ${message}`, { cause: opts?.cause });
    }
  };
  var ActorConnDisposed = class extends ActorClientError {
    constructor() {
      super("Attempting to interact with a disposed actor connection.");
    }
  };
  function isSchedulingError(group, code) {
    return group === "guard" && (code === "actor_ready_timeout" || code === "actor_runner_failed");
  }
  function actorSchedulingError(group, code, actorId, details, rayId) {
    return new RivetError(
      group,
      code,
      `Actor failed to start (${actorId}): ${JSON.stringify(details)}`,
      { metadata: { actorId, details }, rayId },
    );
  }
  function internalClientError(message, opts) {
    return new RivetError("rivetkit", INTERNAL_ERROR_CODE, message, {
      cause: opts?.cause,
    });
  }
  function parseWebSocketCloseReason(reason) {
    const [mainPart, rayId] = reason.split("#");
    const [group, code] = mainPart.split(".");
    if (!group || !code) {
      logger2().warn({ msg: "failed to parse close reason", reason });
      return void 0;
    }
    return {
      group,
      code,
      rayId,
    };
  }
  function messageLength(message) {
    if (message instanceof Blob) {
      return message.size;
    }
    if (message instanceof ArrayBuffer) {
      return message.byteLength;
    }
    if (message instanceof Uint8Array) {
      return message.byteLength;
    }
    if (typeof message === "string") {
      return message.length;
    }
    assertUnreachable(message);
  }
  async function sendHttpRequest(opts) {
    logger2().debug({
      msg: "sending http request",
      url: opts.url,
      encoding: opts.encoding,
    });
    let contentType;
    let bodyData;
    if (opts.method === "POST" || opts.method === "PUT") {
      (0, import_invariant3.default)(opts.body !== void 0, "missing body");
      contentType = contentTypeForEncoding(opts.encoding);
      bodyData = serializeWithEncoding(
        opts.encoding,
        opts.body,
        opts.requestVersionedDataHandler,
        opts.requestVersion,
        opts.requestZodSchema,
        opts.requestToJson,
        opts.requestToBare,
      );
    }
    let response;
    try {
      response = await (opts.customFetch ?? fetch)(
        new globalThis.Request(opts.url, {
          method: opts.method,
          headers: {
            ...opts.headers,
            ...(contentType
              ? {
                  "Content-Type": contentType,
                }
              : {}),
            "User-Agent": httpUserAgent(),
          },
          body: bodyData,
          credentials: "include",
          signal: opts.signal,
        }),
      );
    } catch (error51) {
      throw new HttpRequestError(`Request failed: ${error51}`, {
        cause: error51,
      });
    }
    if (!response.ok) {
      const bufferResponse = await response.arrayBuffer();
      const contentType2 = response.headers.get("content-type");
      const rayId = response.headers.get("x-rivet-ray-id");
      const encoding = contentType2?.includes("application/json") ? "json" : opts.encoding;
      try {
        const responseData = deserializeWithEncoding(
          encoding,
          new Uint8Array(bufferResponse),
          HTTP_RESPONSE_ERROR_VERSIONED,
          HttpResponseErrorSchema,
          // JSON/CBOR: normalize actor generation to the public number shape.
          (json2) => ({
            ...json2,
            actor: json2.actor
              ? {
                  ...json2.actor,
                  generation: Number(json2.actor.generation),
                }
              : void 0,
          }),
          // BARE: decode ArrayBuffer metadata to unknown
          (bare5) => ({
            group: bare5.group,
            code: bare5.code,
            message: bare5.message,
            metadata: bare5.metadata ? decodeCborCompat(new Uint8Array(bare5.metadata)) : void 0,
            actor: bare5.actor
              ? {
                  actorId: bare5.actor.actorId,
                  generation: Number(bare5.actor.generation),
                  key: bare5.actor.key ?? void 0,
                }
              : void 0,
          }),
        );
        logger2().warn({
          msg: "http error response",
          group: responseData.group,
          code: responseData.code,
          message: responseData.message,
          metadata: responseData.metadata,
          rayId,
          actorId: responseData.actor?.actorId,
          generation: responseData.actor?.generation,
          actorKey: responseData.actor?.key,
        });
        throw new RivetError(responseData.group, responseData.code, responseData.message, {
          metadata: responseData.metadata,
          rayId: rayId ?? void 0,
          actor: responseData.actor,
        });
      } catch (error51) {
        if (error51 instanceof RivetError) {
          throw error51;
        }
        const textResponse = new TextDecoder("utf-8", {
          fatal: false,
        }).decode(bufferResponse);
        if (rayId) {
          throw new HttpRequestError(
            `${response.statusText} (${response.status}) (Ray ID: ${rayId}):
${textResponse}`,
          );
        } else {
          throw new HttpRequestError(
            `${response.statusText} (${response.status}):
${textResponse}`,
          );
        }
      }
    }
    if (opts.skipParseResponse) {
      return void 0;
    }
    try {
      const buffer = new Uint8Array(await response.arrayBuffer());
      return deserializeWithEncoding(
        opts.encoding,
        buffer,
        opts.responseVersionedDataHandler,
        opts.responseZodSchema,
        opts.responseFromJson,
        opts.responseFromBare,
      );
    } catch (error51) {
      throw new HttpRequestError(`Failed to parse response: ${error51}`, {
        cause: error51,
      });
    }
  }
  function getEndpoint(config2) {
    return config2.endpoint ?? "http://127.0.0.1:6420";
  }
  async function apiCall(config2, method, path, body) {
    const endpoint = getEndpoint(config2);
    const url2 = combineUrlPath(endpoint, path, {
      namespace: config2.namespace,
    });
    logger3().debug({ msg: "making api call", method, url: url2 });
    const headers = {
      ...config2.headers,
    };
    if (config2.token) {
      headers.Authorization = `Bearer ${config2.token}`;
    }
    return await sendHttpRequest({
      method,
      url: url2,
      headers,
      body,
      encoding: "json",
      skipParseResponse: false,
      requestVersionedDataHandler: void 0,
      requestVersion: void 0,
      responseVersionedDataHandler: void 0,
      responseVersion: void 0,
      requestZodSchema: external_exports.any(),
      responseZodSchema: external_exports.any(),
      // Identity conversions (passthrough for generic API calls)
      requestToJson: (value) => value,
      requestToBare: (value) => value,
      responseFromJson: (value) => value,
      responseFromBare: (value) => value,
    });
  }
  async function getActor(config2, _, actorId) {
    return apiCall(config2, "GET", `/actors?actor_ids=${encodeURIComponent(actorId)}`);
  }
  async function getActorByKey(config2, name, key) {
    const serializedKey = serializeActorKey(key);
    return apiCall(
      config2,
      "GET",
      `/actors?name=${encodeURIComponent(name)}&key=${encodeURIComponent(serializedKey)}`,
    );
  }
  async function listActorsByName(config2, name) {
    return apiCall(config2, "GET", `/actors?name=${encodeURIComponent(name)}`);
  }
  async function getOrCreateActor(config2, request) {
    return apiCall(config2, "PUT", `/actors`, request);
  }
  async function createActor(config2, request) {
    return apiCall(config2, "POST", `/actors`, request);
  }
  async function destroyActor(config2, actorId) {
    return apiCall(config2, "DELETE", `/actors/${encodeURIComponent(actorId)}`);
  }
  async function getMetadata(config2) {
    return apiCall(config2, "GET", `/metadata`);
  }
  var metadataLookupCache = /* @__PURE__ */ new Map();
  async function lookupMetadataCached(config2) {
    const endpoint = getEndpoint(config2);
    const existingPromise = metadataLookupCache.get(endpoint);
    if (existingPromise) {
      return existingPromise;
    }
    const metadataLookupPromise = pRetry(
      async () => {
        logger3().debug({
          msg: "fetching metadata",
          endpoint,
        });
        const metadataData = await getMetadata(config2);
        logger3().debug({
          msg: "received metadata",
          endpoint,
          clientEndpoint: metadataData.clientEndpoint,
        });
        return metadataData;
      },
      {
        forever: true,
        minTimeout: 500,
        maxTimeout: 15e3,
        onFailedAttempt: (error51) => {
          if (error51.attemptNumber > 1) {
            logger3().warn({
              msg: "failed to fetch metadata, retrying",
              endpoint,
              attempt: error51.attemptNumber,
              error: stringifyError(error51),
            });
          }
        },
      },
    );
    metadataLookupCache.set(endpoint, metadataLookupPromise);
    return metadataLookupPromise;
  }
  async function createWebSocketProxy(_c, targetUrl, protocols) {
    const WebSocket2 = await importWebSocket();
    const state = {};
    return {
      onOpen: async (_event, clientWs) => {
        logger3().debug({ msg: "client websocket connected", targetUrl });
        if (clientWs.readyState !== 1) {
          logger3().warn({
            msg: "client websocket not open on connection",
            targetUrl,
            readyState: clientWs.readyState,
          });
          return;
        }
        const targetWs = new WebSocket2(targetUrl, protocols);
        state.targetWs = targetWs;
        state.connectPromise = new Promise((resolve, reject) => {
          targetWs.addEventListener("open", () => {
            logger3().debug({
              msg: "target websocket connected",
              targetUrl,
            });
            if (clientWs.readyState !== 1) {
              logger3().warn({
                msg: "client websocket closed before target connected",
                targetUrl,
                clientReadyState: clientWs.readyState,
              });
              targetWs.close(1001, "Client disconnected");
              reject(new Error("Client disconnected"));
              return;
            }
            resolve();
          });
          targetWs.addEventListener("error", (error51) => {
            logger3().warn({
              msg: "target websocket error during connection",
              targetUrl,
            });
            reject(error51);
          });
        });
        state.connectPromise.catch(() => {});
        state.targetWs.addEventListener("message", (event) => {
          if (typeof event.data === "string" || event.data instanceof ArrayBuffer) {
            clientWs.send(event.data);
          } else if (event.data instanceof Blob) {
            event.data.arrayBuffer().then((buffer) => {
              clientWs.send(buffer);
            });
          }
        });
        state.targetWs.addEventListener("close", (event) => {
          logger3().debug({
            msg: "target websocket closed",
            targetUrl,
            code: event.code,
            reason: event.reason,
          });
          closeWebSocketIfOpen(clientWs, event.code, event.reason);
        });
        state.targetWs.addEventListener("error", (error51) => {
          logger3().error({
            msg: "target websocket error",
            targetUrl,
            error: stringifyError(error51),
          });
          closeWebSocketIfOpen(clientWs, 1011, "Target WebSocket error");
        });
      },
      onMessage: async (event, clientWs) => {
        if (!state.targetWs || !state.connectPromise) {
          logger3().error({
            msg: "websocket state not initialized",
            targetUrl,
          });
          return;
        }
        try {
          await state.connectPromise;
          if (state.targetWs.readyState === WebSocket2.OPEN) {
            state.targetWs.send(event.data);
          } else {
            logger3().warn({
              msg: "target websocket not open",
              targetUrl,
              readyState: state.targetWs.readyState,
            });
          }
        } catch (error51) {
          logger3().error({
            msg: "failed to connect to target websocket",
            targetUrl,
            error: error51,
          });
          closeWebSocketIfOpen(clientWs, 1011, "Failed to connect to target");
        }
      },
      onClose: (event, _clientWs) => {
        logger3().debug({
          msg: "client websocket closed",
          targetUrl,
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        if (state.targetWs) {
          if (
            state.targetWs.readyState === WebSocket2.OPEN ||
            state.targetWs.readyState === WebSocket2.CONNECTING
          ) {
            state.targetWs.close(1e3, event.reason || "Client disconnected");
          }
        }
      },
      onError: (event, _clientWs) => {
        logger3().error({ msg: "client websocket error", targetUrl, event });
        if (state.targetWs) {
          if (state.targetWs.readyState === WebSocket2.OPEN) {
            state.targetWs.close(1011, "Client WebSocket error");
          } else if (state.targetWs.readyState === WebSocket2.CONNECTING) {
            state.targetWs.close();
          }
        }
      },
    };
  }
  function closeWebSocketIfOpen(ws, code, reason) {
    if (ws.readyState === 1) {
      ws.close(code, reason);
    } else if ("close" in ws && ws.readyState === WebSocket.OPEN) {
      ws.close(code, reason);
    }
  }
  var RemoteEngineControlClient = class {
    #config;
    #metadataPromise;
    constructor(runConfig) {
      if (getNextPhase() === "phase-production-build") {
        logger3().info("detected next.js build phase, disabling health check");
        runConfig.disableMetadataLookup = true;
      }
      this.#config = { ...runConfig };
      if (!runConfig.disableMetadataLookup) {
        this.#metadataPromise = lookupMetadataCached(this.#config).then((metadataData) => {
          if (metadataData.clientEndpoint) {
            this.#config.endpoint = metadataData.clientEndpoint;
            if (metadataData.clientNamespace) {
              this.#config.namespace = metadataData.clientNamespace;
            }
            if (metadataData.clientToken) {
              this.#config.token = metadataData.clientToken;
            }
            logger3().info({
              msg: "overriding client endpoint",
              endpoint: metadataData.clientEndpoint,
              namespace: metadataData.clientNamespace,
              token: metadataData.clientToken,
            });
          }
          logger3().info({
            msg: "connected to rivetkit runtime",
            runtime: metadataData.runtime,
            version: metadataData.version,
            envoy: metadataData.envoy,
          });
        });
      }
    }
    async getForId({ name, actorId }) {
      await this.#metadataPromise;
      const response = await getActor(this.#config, name, actorId);
      const actor = response.actors[0];
      if (!actor) return void 0;
      if (actor.name !== name) {
        logger3().debug({
          msg: "actor name mismatch from api",
          actorId,
          apiName: actor.name,
          requestedName: name,
        });
        return void 0;
      }
      return apiActorToOutput(actor);
    }
    async getWithKey({ name, key }) {
      await this.#metadataPromise;
      logger3().debug({ msg: "getWithKey: searching for actor", name, key });
      try {
        const response = await getActorByKey(this.#config, name, key);
        const actor = response.actors[0];
        if (!actor) return void 0;
        logger3().debug({
          msg: "getWithKey: found actor via api",
          actorId: actor.actor_id,
          name,
          key,
        });
        return apiActorToOutput(actor);
      } catch (error51) {
        if (
          error51 instanceof RivetError &&
          error51.group === "actor" &&
          error51.code === "not_found"
        ) {
          return void 0;
        }
        throw error51;
      }
    }
    async getOrCreateWithKey(input) {
      await this.#metadataPromise;
      const { name, key, input: actorInput, region, crashPolicy, poolName } = input;
      logger3().info({
        msg: "getOrCreateWithKey: getting or creating actor via engine api",
        name,
        key,
      });
      try {
        const { actor, created } = await getOrCreateActor(this.#config, {
          datacenter: region,
          name,
          key: serializeActorKey(key),
          runner_name_selector: poolName ?? this.#config.poolName,
          input: actorInput ? uint8ArrayToBase642(encodeCborCompat(actorInput)) : void 0,
          crash_policy: crashPolicy ?? "sleep",
        });
        logger3().info({
          msg: "getOrCreateWithKey: actor ready",
          actorId: actor.actor_id,
          name,
          key,
          created,
        });
        return apiActorToOutput(actor);
      } catch (error51) {
        if (
          error51 instanceof RivetError &&
          error51.group === "actor" &&
          error51.code === "key_reserved_in_different_datacenter"
        ) {
          logger3().warn({
            msg: "getOrCreateWithKey: key reserved in different datacenter, retrying as get",
            name,
            key,
          });
          const response = await getActorByKey(this.#config, name, key);
          const existing = response.actors[0];
          if (!existing) throw error51;
          logger3().info({
            msg: "getOrCreateWithKey: resolved existing actor via get",
            actorId: existing.actor_id,
            name,
            key,
          });
          return apiActorToOutput(existing);
        }
        throw error51;
      }
    }
    async createActor({ name, key, input, region, crashPolicy, poolName }) {
      await this.#metadataPromise;
      logger3().info({ msg: "creating actor via engine api", name, key });
      const result = await createActor(this.#config, {
        datacenter: region,
        name,
        runner_name_selector: poolName ?? this.#config.poolName,
        key: serializeActorKey(key),
        input: input ? uint8ArrayToBase642(encodeCborCompat(input)) : void 0,
        crash_policy: crashPolicy ?? "sleep",
      });
      logger3().info({
        msg: "actor created",
        actorId: result.actor.actor_id,
        name,
        key,
      });
      return apiActorToOutput(result.actor);
    }
    async listActors({ name }) {
      await this.#metadataPromise;
      logger3().debug({ msg: "listing actors via engine api", name });
      const response = await listActorsByName(this.#config, name);
      return response.actors.map(apiActorToOutput);
    }
    async destroyActor(actorId) {
      await this.#metadataPromise;
      logger3().info({ msg: "destroying actor via engine api", actorId });
      await destroyActor(this.#config, actorId);
      logger3().info({ msg: "actor destroyed", actorId });
    }
    async sendRequest(target2, actorRequest, options = {}) {
      await this.#metadataPromise;
      const path = requestPath(actorRequest);
      const gatewayUrl = this.#buildGatewayUrlForTarget(target2, path, options);
      const httpOptions = {
        ...options,
        directActorId: shouldSkipReadyWait(options) ? directActorIdFromTarget(target2) : void 0,
      };
      return sendHttpRequestToGateway(this.#config, gatewayUrl, actorRequest, httpOptions);
    }
    async openWebSocket(path, target2, encoding, params, options = {}) {
      await this.#metadataPromise;
      const gatewayUrl = this.#buildGatewayUrlForTarget(target2, path, options);
      return openWebSocketToGateway(this.#config, gatewayUrl, encoding, params, {
        ...options,
        directActorId: shouldSkipReadyWait(options) ? directActorIdFromTarget(target2) : void 0,
      });
    }
    async buildGatewayUrl(target2, options = {}) {
      await this.#metadataPromise;
      return this.#buildGatewayUrlForTarget(target2, "", options);
    }
    async proxyRequest(_c, actorRequest, actorId) {
      await this.#metadataPromise;
      const gatewayUrl = this.#buildGatewayUrlForTarget(
        { directId: actorId },
        requestPath(actorRequest),
      );
      return sendHttpRequestToGateway(this.#config, gatewayUrl, actorRequest);
    }
    async proxyWebSocket(c, path, actorId, encoding, params) {
      await this.#metadataPromise;
      const upgradeWebSocket = this.#config.getUpgradeWebSocket?.();
      (0, import_invariant2.default)(upgradeWebSocket, "missing getUpgradeWebSocket");
      const endpoint = getEndpoint(this.#config);
      const guardUrl = combineUrlPath(endpoint, path);
      const wsGuardUrl = guardUrl.replace("http://", "ws://");
      logger3().debug({
        msg: "forwarding websocket to actor via guard",
        actorId,
        path,
        guardUrl,
      });
      const protocols = buildWebSocketProtocols(this.#config, encoding, params, void 0, {
        target: "actor",
        actorId,
      });
      const args = await createWebSocketProxy(c, wsGuardUrl, protocols);
      return await upgradeWebSocket(() => args)(c, noopNext());
    }
    displayInformation() {
      return { properties: {} };
    }
    setGetUpgradeWebSocket(getUpgradeWebSocket) {
      this.#config.getUpgradeWebSocket = getUpgradeWebSocket;
    }
    #buildGatewayUrlForTarget(target2, path, options = {}) {
      const endpoint = getEndpoint(this.#config);
      if (
        shouldSkipReadyWait(options) &&
        directActorIdFromTarget(target2) &&
        canUseDirectSkipReadyWaitPath(path)
      ) {
        return combineUrlPath(endpoint, path);
      }
      if ("directId" in target2) {
        return buildActorGatewayUrl(endpoint, target2.directId, this.#config.token, path);
      }
      if ("getForId" in target2) {
        return buildActorGatewayUrl(endpoint, target2.getForId.actorId, this.#config.token, path);
      }
      if ("getForKey" in target2 || "getOrCreateForKey" in target2) {
        return buildActorQueryGatewayUrl(
          endpoint,
          this.#config.namespace,
          target2,
          this.#config.token,
          path,
          this.#config.maxInputSize,
          void 0,
          "getOrCreateForKey" in target2
            ? (target2.getOrCreateForKey.poolName ?? this.#config.poolName)
            : void 0,
          options,
        );
      }
      if ("create" in target2) {
        throw new Error(
          "Gateway URLs only support direct actor IDs, get, and getOrCreate targets.",
        );
      }
      throw new Error("unreachable: unknown gateway target type");
    }
  };
  function canUseDirectSkipReadyWaitPath(path) {
    return (
      isActorHttpRequestPath(path) ||
      isPathOrQuery(path, PATH_CONNECT) ||
      isPathOrQuery(path, PATH_WEBSOCKET_BASE) ||
      path.startsWith(PATH_WEBSOCKET_PREFIX)
    );
  }
  function isPathOrQuery(path, basePath) {
    return path === basePath || path.startsWith(`${basePath}?`);
  }
  function isActorHttpRequestPath(path) {
    const stripped = path.slice("/request".length);
    return (
      path.startsWith("/request") &&
      (stripped.length === 0 || stripped.startsWith("/") || stripped.startsWith("?"))
    );
  }
  function directActorIdFromTarget(target2) {
    if ("directId" in target2) {
      return target2.directId;
    }
    if ("getForId" in target2) {
      return target2.getForId.actorId;
    }
    return void 0;
  }
  function requestPath(req) {
    const url2 = new URL(req.url);
    return `${url2.pathname}${url2.search}`;
  }
  function apiActorToOutput(actor) {
    return {
      actorId: actor.actor_id,
      name: actor.name,
      key: deserializeActorKey(actor.key),
      createTs: actor.create_ts,
      startTs: actor.start_ts ?? null,
      connectableTs: actor.connectable_ts ?? null,
      sleepTs: actor.sleep_ts ?? null,
      destroyTs: actor.destroy_ts ?? null,
      error: actor.error ?? void 0,
    };
  }
  function resolveActorGatewayOptions(defaults = {}, overrides) {
    const skipReadyWait = overrides?.skipReadyWait ?? defaults.skipReadyWait ?? false;
    return {
      skipReadyWait,
    };
  }
  function getActorNameFromQuery(query) {
    if ("getForId" in query) return query.getForId.name;
    if ("getForKey" in query) return query.getForKey.name;
    if ("getOrCreateForKey" in query) return query.getOrCreateForKey.name;
    if ("create" in query) return query.create.name;
    throw invalidRequest("Invalid query format");
  }
  function isDynamicActorQuery(actorQuery) {
    return "getForKey" in actorQuery || "getOrCreateForKey" in actorQuery;
  }
  function getGatewayTarget(state) {
    if ("getForId" in state) {
      return { directId: state.getForId.actorId };
    }
    if ("create" in state) {
      throw invalidRequest(
        "create queries cannot be used as gateway targets. Resolve to an actor ID first.",
      );
    }
    return state;
  }
  function isStaleResolvedActorError(group, code) {
    return (
      group === "actor" &&
      (code === "not_found" ||
        code === "starting" ||
        code === "stopping" ||
        code === "not_configured" ||
        code === "dropped_reply" ||
        code.startsWith("destroyed_"))
    );
  }
  async function checkForSchedulingError(group, code, actorId, query, driver, rayId) {
    const name = getActorNameFromQuery(query);
    try {
      const actor = await driver.getForId({ name, actorId });
      if (actor?.error) {
        logger2().info({
          msg: "found actor scheduling error",
          actorId,
          error: actor.error,
        });
        return actorSchedulingError(group, code, actorId, actor.error, rayId);
      }
    } catch (err) {
      logger2().warn({
        msg: "failed to fetch actor details for scheduling error check",
        actorId,
        error: stringifyError(err),
      });
    }
    return null;
  }
  function* walkErrorChain(error51, maxDepth = 8) {
    let current = error51;
    let depth = 0;
    while (current !== void 0 && current !== null && depth < maxDepth) {
      yield current;
      if (typeof current === "object" && "cause" in current && current.cause !== current) {
        current = current.cause;
        depth += 1;
        continue;
      }
      break;
    }
  }
  function buildLifecycleBoundaryInfo(kind, source, message, opts) {
    return {
      kind,
      source,
      group: opts?.group,
      code: opts?.code,
      message,
      legacy: opts?.legacy ?? false,
    };
  }
  function classifyActorError(error51) {
    if (
      error51.group === "actor" &&
      error51.code === "stopping" &&
      error51.message.includes("database accessed after actor stopped")
    ) {
      return void 0;
    }
    if (error51.group === "actor" && error51.code === "restarting") {
      return buildLifecycleBoundaryInfo("request_retry", "actor_error", error51.message, {
        group: error51.group,
        code: error51.code,
      });
    }
    if (error51.group === "guard" && isRetryableGuardGatewayHttpError(error51.code)) {
      return buildLifecycleBoundaryInfo("request_retry", "actor_error", error51.message, {
        group: error51.group,
        code: error51.code,
      });
    }
    if (
      error51.group === "actor" &&
      error51.code === "internal_error" &&
      error51.message === "Actor is stopping"
    ) {
      return buildLifecycleBoundaryInfo("request_retry", "actor_error", error51.message, {
        group: error51.group,
        code: error51.code,
        legacy: true,
      });
    }
    if (
      error51.group === "actor" &&
      error51.code === "stopping" &&
      error51.message === "Actor stopping: Cannot accept new connections while actor is stopping"
    ) {
      return buildLifecycleBoundaryInfo("request_retry", "actor_error", error51.message, {
        group: error51.group,
        code: error51.code,
        legacy: true,
      });
    }
    if (error51.group === "actor" && error51.code === "stopped") {
      return buildLifecycleBoundaryInfo("reconnect_only", "actor_error", error51.message, {
        group: error51.group,
        code: error51.code,
        legacy: true,
      });
    }
    if (error51.group === "ws" && error51.code === "going_away") {
      return buildLifecycleBoundaryInfo("reconnect_only", "actor_error", error51.message, {
        group: error51.group,
        code: error51.code,
        legacy: true,
      });
    }
    return void 0;
  }
  function isRetryableGuardGatewayHttpError(code) {
    return (
      code === "service_unavailable" ||
      code === "actor_wake_retries_exceeded" ||
      code === "actor_stopped_while_waiting" ||
      code === "tunnel_request_aborted" ||
      code === "tunnel_message_timeout" ||
      code === "tunnel_response_closed" ||
      code === "gateway_response_start_timeout"
    );
  }
  function classifyTransportError(error51) {
    if (error51.message.includes("database accessed after actor stopped")) {
      return void 0;
    }
    if (/^Actor [A-Za-z0-9-]+ stopped$/.test(error51.message)) {
      return buildLifecycleBoundaryInfo("request_retry", "transport_error", error51.message, {
        legacy: true,
      });
    }
    if (
      error51.message === "WebSocket connection closed during shutdown" ||
      error51.message === "envoy shut down" ||
      error51.message === "envoy shutting down"
    ) {
      return buildLifecycleBoundaryInfo("reconnect_only", "transport_error", error51.message, {
        legacy: true,
      });
    }
    return void 0;
  }
  function classifyLifecycleBoundaryError(error51) {
    for (const current of walkErrorChain(error51)) {
      if (current instanceof RivetError) {
        const classified = classifyActorError(current);
        if (classified) {
          return classified;
        }
        continue;
      }
      if (current instanceof HttpRequestError || current instanceof Error) {
        const classified = classifyTransportError(current);
        if (classified) {
          return classified;
        }
      }
    }
    return void 0;
  }
  function isRetryableLifecycleRequestError(error51) {
    return classifyLifecycleBoundaryError(error51)?.kind === "request_retry";
  }
  function isRetryableLifecycleReconnectSignal(error51) {
    const classified = classifyLifecycleBoundaryError(error51);
    return classified?.kind === "reconnect_only" || classified?.kind === "request_retry";
  }
  function throwIfAborted(signal) {
    if (signal?.aborted) {
      throw signal.reason ?? new Error("Operation aborted");
    }
  }
  async function waitWithSignal(ms, signal) {
    throwIfAborted(signal);
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        resolve();
      }, ms);
      const onAbort = () => {
        clearTimeout(timeout);
        cleanup();
        reject(signal?.reason ?? new Error("Operation aborted"));
      };
      const cleanup = () => {
        signal?.removeEventListener("abort", onAbort);
      };
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }
  async function retryOnLifecycleBoundary(run, opts) {
    const maxAttempts = opts?.maxAttempts ?? 5;
    const initialDelayMs = opts?.initialDelayMs ?? 25;
    const maxDelayMs = opts?.maxDelayMs ?? 200;
    let lastError;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      throwIfAborted(opts?.signal);
      try {
        return await run();
      } catch (error51) {
        if (!isRetryableLifecycleRequestError(error51)) {
          throw error51;
        }
        lastError = error51;
        if (attempt === maxAttempts - 1) {
          break;
        }
        const delayMs = Math.min(initialDelayMs * 2 ** attempt, maxDelayMs);
        await waitWithSignal(delayMs, opts?.signal);
      }
    }
    throw lastError;
  }
  function createQueueSender(senderOptions) {
    async function send(name, body, options) {
      const wait = options?.wait ?? false;
      const timeout = options?.timeout;
      const result = await sendHttpRequest({
        url: `http://actor/queue/${encodeURIComponent(name)}`,
        method: "POST",
        headers: {
          [HEADER_ENCODING]: senderOptions.encoding,
          ...(senderOptions.params !== void 0
            ? {
                [HEADER_CONN_PARAMS]: JSON.stringify(senderOptions.params),
              }
            : {}),
        },
        body: { body, wait, timeout },
        encoding: senderOptions.encoding,
        customFetch: senderOptions.customFetch,
        signal: options?.signal,
        requestVersion: CURRENT_VERSION,
        requestVersionedDataHandler: HTTP_QUEUE_SEND_REQUEST_VERSIONED,
        responseVersion: CURRENT_VERSION,
        responseVersionedDataHandler: HTTP_QUEUE_SEND_RESPONSE_VERSIONED,
        requestZodSchema: HttpQueueSendRequestSchema,
        responseZodSchema: HttpQueueSendResponseSchema,
        requestToJson: (value) => ({
          ...value,
          name,
        }),
        requestToBare: (value) => ({
          name: value.name ?? name,
          body: bufferToArrayBuffer(encodeCborCompat(value.body)),
          wait: value.wait ?? false,
          timeout: value.timeout !== void 0 ? BigInt(value.timeout) : null,
        }),
        responseFromJson: (json2) => {
          if (json2.response === void 0) {
            return { status: json2.status };
          }
          return {
            status: json2.status,
            response: json2.response,
          };
        },
        responseFromBare: (bare5) => {
          if (bare5.response === null || bare5.response === void 0) {
            return { status: bare5.status };
          }
          return {
            status: bare5.status,
            response: decodeCborCompat(new Uint8Array(bare5.response)),
          };
        },
      });
      if (wait) {
        return result;
      }
      return;
    }
    return {
      send,
    };
  }
  var CONNECT_SYMBOL = /* @__PURE__ */ Symbol("connect");
  var ActorConnRaw = class {
    #disposed = false;
    /* Will be aborted on dispose. */
    #abortController = new AbortController();
    #connStatus = "idle";
    #actorId;
    #connId;
    #messageQueue = [];
    #actionsInFlight = /* @__PURE__ */ new Map();
    #eventSubscriptions = /* @__PURE__ */ new Map();
    #errorHandlers = /* @__PURE__ */ new Set();
    #openHandlers = /* @__PURE__ */ new Set();
    #openScheduled = false;
    #closeHandlers = /* @__PURE__ */ new Set();
    #statusChangeHandlers = /* @__PURE__ */ new Set();
    #actionIdCounter = 0;
    #queueSender;
    #readyPromise;
    /**
     * Interval that keeps the NodeJS process alive if this is the only thing running.
     *
     * See ttps://github.com/nodejs/node/issues/22088
     */
    #keepNodeAliveInterval;
    /** Promise used to indicate the socket has connected successfully. This will be rejected if the connection fails. */
    #onOpenPromise;
    #websocket;
    #client;
    #driver;
    #params;
    #getParams;
    #encoding;
    #actorResolutionState;
    #gatewayOptions;
    // TODO: ws message queue
    /**
     * Do not call this directly.
     *
     * Creates an instance of ActorConnRaw.
     *
     * @protected
     */
    constructor(
      client,
      driver,
      params,
      getParams,
      encoding,
      actorResolutionState,
      gatewayOptions = {},
    ) {
      this.#client = client;
      this.#driver = driver;
      this.#params = params;
      this.#getParams = getParams;
      this.#encoding = encoding;
      this.#actorResolutionState = actorResolutionState;
      this.#gatewayOptions = resolveActorGatewayOptions(gatewayOptions);
      if ("getForId" in actorResolutionState) {
        this.#actorId = actorResolutionState.getForId.actorId;
      }
      this.#readyPromise = promiseWithResolvers((reason) =>
        logger2().warn({
          msg: "unhandled ready promise rejection",
          reason,
        }),
      );
      this.#queueSender = createQueueSender({
        encoding: this.#encoding,
        params: this.#params,
        customFetch: async (request) => {
          return await this.#driver.sendRequest(
            getGatewayTarget(this.#actorResolutionState),
            request,
            this.#gatewayOptions,
          );
        },
      });
      this.#keepNodeAliveInterval = setInterval(() => {}, 6e4);
    }
    #clearResolvedActorIdentity() {
      this.#actorId = void 0;
      this.#connId = void 0;
    }
    /**
     * If the query is dynamic (getForKey or getOrCreateForKey) and the error
     * indicates the previously resolved actor is stale (not_found, starting,
     * stopping, or destroyed),
     * clear the cached actor ID and connection ID so the next operation
     * re-resolves to a fresh actor. Returns true if the identity was
     * invalidated.
     */
    #invalidateActorIfStale(group, code) {
      if (
        !isDynamicActorQuery(this.#actorResolutionState) ||
        !isStaleResolvedActorError(group, code)
      ) {
        return false;
      }
      this.#clearResolvedActorIdentity();
      return true;
    }
    #shouldReconnectForStaleActor(group, code) {
      return (
        isDynamicActorQuery(this.#actorResolutionState) &&
        isStaleResolvedActorError(group, code) &&
        this.#onOpenPromise !== void 0 &&
        this.#connStatus !== "connected"
      );
    }
    send(name, body, options) {
      return this.#sendQueueMessage(name, body, options);
    }
    async #sendQueueMessage(name, body, options) {
      return await this.#queueSender.send(name, body, options);
    }
    /**
     * Call a raw action connection. See {@link ActorConn} for type-safe action calls.
     *
     * @see {@link ActorConn}
     * @template Args - The type of arguments to pass to the action function.
     * @template Response - The type of the response returned by the action function.
     * @param {string} name - The name of the action function to call.
     * @param {...Args} args - The arguments to pass to the action function.
     * @returns {Promise<Response>} - A promise that resolves to the response of the action function.
     */
    async action(opts) {
      if (
        typeof opts === "string" ||
        typeof opts !== "object" ||
        opts === null ||
        !("name" in opts)
      ) {
        throw new Error(
          `Invalid action call: expected an options object { name, args }, got ${typeof opts}. Use conn.actionName(...args) for the shorthand API.`,
        );
      }
      logger2().debug({ msg: "action", name: opts.name, args: opts.args });
      const actionId = this.#actionIdCounter;
      this.#actionIdCounter += 1;
      const {
        promise: promise2,
        resolve,
        reject,
      } = promiseWithResolvers((reason) =>
        logger2().warn({
          msg: "unhandled action promise rejection",
          reason,
        }),
      );
      this.#actionsInFlight.set(actionId, {
        name: opts.name,
        resolve,
        reject,
      });
      logger2().debug({
        msg: "added action to in-flight map",
        actionId,
        actionName: opts.name,
        inFlightCount: this.#actionsInFlight.size,
      });
      this.#sendMessage({
        body: {
          tag: "ActionRequest",
          val: {
            id: BigInt(actionId),
            name: opts.name,
            args: opts.args,
          },
        },
      });
      const { id: responseId, output } = await promise2;
      if (responseId !== BigInt(actionId))
        throw new Error(`Request ID ${actionId} does not match response ID ${responseId}`);
      return output;
    }
    /**
     * Do not call this directly.
     * Establishes a connection to the server using the specified endpoint & encoding & driver.
     *
     * @protected
     */
    [CONNECT_SYMBOL]() {
      this.#connectWithRetry();
    }
    #setConnStatus(status) {
      const prevStatus = this.#connStatus;
      if (prevStatus === status) return;
      this.#connStatus = status;
      for (const handler of [...this.#statusChangeHandlers]) {
        try {
          handler(status);
        } catch (err) {
          logger2().error({
            msg: "error in status change handler",
            error: stringifyError(err),
          });
        }
      }
      if (status === "connected") {
        this.#readyPromise.resolve(void 0);
        for (const handler of [...this.#openHandlers]) {
          try {
            handler();
          } catch (err) {
            logger2().error({
              msg: "error in open handler",
              error: stringifyError(err),
            });
          }
        }
      }
      if ((status === "disconnected" || status === "idle") && prevStatus === "connected") {
        for (const handler of [...this.#closeHandlers]) {
          try {
            handler();
          } catch (err) {
            logger2().error({
              msg: "error in close handler",
              error: stringifyError(err),
            });
          }
        }
      }
    }
    #connectWithRetry() {
      this.#setConnStatus("connecting");
      pRetry(this.#connectAndWait.bind(this), {
        forever: true,
        minTimeout: 250,
        maxTimeout: 3e4,
        onFailedAttempt: (error51) => {
          logger2().warn({
            msg: "failed to reconnect",
            attempt: error51.attemptNumber,
            error: stringifyError(error51),
          });
        },
        // Cancel retry if aborted
        signal: this.#abortController.signal,
      }).catch((err) => {
        if (
          err instanceof AbortError ||
          err.name === "AbortError" ||
          !this.#shouldRetryConnectionOpenError(err)
        ) {
          logger2().info({ msg: "connection retry aborted" });
        } else {
          logger2().error({
            msg: "unexpected error in connection retry",
            error: stringifyError(err),
          });
        }
      });
    }
    async #connectAndWait() {
      try {
        if (this.#onOpenPromise) throw new Error("#onOpenPromise already defined");
        this.#onOpenPromise = promiseWithResolvers((reason) =>
          logger2().warn({
            msg: "unhandled open promise rejection",
            reason,
          }),
        );
        await this.#connectWebSocket();
        await this.#onOpenPromise.promise;
      } catch (error51) {
        if (this.#shouldRetryConnectionOpenError(error51)) {
          throw error51;
        }
        const actorError =
          error51 instanceof RivetError
            ? error51
            : new RivetError(
                "client",
                "connection_open_failed",
                `Failed to open connection: ${stringifyError(error51)}`,
                { error: stringifyError(error51) },
              );
        this.#clearQueuedMessages();
        this.#rejectPendingPromises(actorError, false);
        this.#dispatchActorError(actorError);
        this.#setConnStatus("idle");
        throw new AbortError(
          error51 instanceof Error ? error51 : new Error(stringifyError(error51)),
        );
      } finally {
        this.#onOpenPromise = void 0;
      }
    }
    #shouldRetryConnectionOpenError(error51) {
      if (error51 instanceof ActorConnDisposed) {
        return false;
      }
      if (
        error51 instanceof RivetError &&
        this.#shouldReconnectForStaleActor(error51.group, error51.code)
      ) {
        return true;
      }
      if (
        error51 instanceof RivetError &&
        error51.group === "client" &&
        error51.code === "get_params_failed"
      ) {
        return true;
      }
      return isRetryableLifecycleReconnectSignal(error51);
    }
    #clearQueuedMessages() {
      if (this.#messageQueue.length === 0) return;
      logger2().debug({
        msg: "clearing queued connection messages",
        queueLength: this.#messageQueue.length,
      });
      this.#messageQueue = [];
    }
    async #resolveConnectionParams() {
      if (!this.#getParams) {
        return this.#params;
      }
      try {
        return await this.#getParams();
      } catch (err) {
        const errorMessage2 = stringifyError(err);
        const error51 = new RivetError(
          "client",
          "get_params_failed",
          `Failed to resolve connection params: ${errorMessage2}`,
          { error: errorMessage2 },
        );
        this.#clearQueuedMessages();
        this.#rejectPendingPromises(error51, false);
        this.#dispatchActorError(error51);
        throw error51;
      }
    }
    async #connectWebSocket() {
      const params = await this.#resolveConnectionParams();
      const target2 = getGatewayTarget(this.#actorResolutionState);
      const ws = await this.#driver.openWebSocket(
        PATH_CONNECT,
        target2,
        this.#encoding,
        params,
        this.#gatewayOptions,
      );
      (0, import_invariant4.default)(ws, "websocket should have been created");
      logger2().debug({
        msg: "opened websocket",
        connId: this.#connId,
        readyState: ws.readyState,
        messageQueueLength: this.#messageQueue.length,
      });
      this.#websocket = ws;
      ws.addEventListener("open", () => {
        logger2().debug({
          msg: "client websocket open",
          connId: this.#connId,
        });
      });
      ws.addEventListener("message", async (ev) => {
        try {
          await this.#handleOnMessage(ev.data);
        } catch (err) {
          logger2().error({
            msg: "error in websocket message handler",
            error: stringifyError(err),
          });
        }
      });
      ws.addEventListener("close", async (ev) => {
        try {
          await this.#handleOnClose(ev);
        } catch (err) {
          logger2().error({
            msg: "error in websocket close handler",
            error: stringifyError(err),
          });
        }
      });
      ws.addEventListener("error", () => {
        try {
          this.#handleOnError();
        } catch (err) {
          logger2().error({
            msg: "error in websocket error handler",
            error: stringifyError(err),
          });
        }
      });
    }
    /** Called by the onopen event from drivers. */
    #handleOnOpen() {
      if (this.#disposed) {
        logger2().debug({
          msg: "handleOnOpen called after dispose, closing websocket",
        });
        if (this.#websocket) {
          this.#websocket.close(1e3, "Disposed");
          this.#websocket = void 0;
        }
        return;
      }
      if (this.#connStatus === "connected" || this.#openScheduled) {
        return;
      }
      this.#openScheduled = true;
      queueMicrotask(() => {
        this.#openScheduled = false;
        if (this.#disposed) {
          logger2().debug({
            msg: "handleOnOpen scheduled after dispose, closing websocket",
          });
          if (this.#websocket) {
            this.#websocket.close(1e3, "Disposed");
            this.#websocket = void 0;
          }
          return;
        }
        logger2().debug({
          msg: "socket open",
          messageQueueLength: this.#messageQueue.length,
          connId: this.#connId,
        });
        this.#setConnStatus("connected");
        if (this.#onOpenPromise) {
          this.#onOpenPromise.resolve(void 0);
        } else {
          logger2().warn({ msg: "#onOpenPromise is undefined" });
        }
        for (const eventName of this.#eventSubscriptions.keys()) {
          this.#sendSubscription(eventName, true);
        }
        const queue = this.#messageQueue;
        this.#messageQueue = [];
        logger2().debug({
          msg: "flushing message queue",
          queueLength: queue.length,
        });
        for (const msg of queue) {
          this.#sendMessage(msg);
        }
      });
    }
    /** Called by the onmessage event from drivers. */
    async #handleOnMessage(data) {
      logger2().trace({
        msg: "received message",
        dataType: typeof data,
        isBlob: data instanceof Blob,
        isArrayBuffer: data instanceof ArrayBuffer,
      });
      const response = await this.#parseMessage(data);
      logger2().trace(
        getLogMessage()
          ? {
              msg: "parsed message",
              message: jsonStringifyCompat(response).substring(0, 100) + "...",
            }
          : { msg: "parsed message" },
      );
      if (response.body.tag === "Init") {
        this.#actorId = response.body.val.actorId;
        this.#connId = response.body.val.connectionId;
        logger2().trace({
          msg: "received init message",
          actorId: this.#actorId,
          connId: this.#connId,
        });
        this.#handleOnOpen();
      } else if (response.body.tag === "Error") {
        const { group, code, message, metadata, actionId, actor } = response.body.val;
        if (actionId !== null) {
          const inFlight = this.#takeActionInFlight(Number(actionId));
          this.#invalidateActorIfStale(group, code);
          logger2().warn({
            msg: "action error",
            actionId,
            actionName: inFlight?.name,
            group,
            code,
            message,
            metadata,
            actorId: actor?.actorId,
            generation: actor?.generation,
            actorKey: actor?.key,
          });
          inFlight.reject(
            new RivetError(group, code, message, {
              metadata,
              actor,
            }),
          );
        } else {
          logger2().warn({
            msg: "connection error",
            group,
            code,
            message,
            metadata,
            actorId: actor?.actorId,
            generation: actor?.generation,
            actorKey: actor?.key,
          });
          if (this.#shouldReconnectForStaleActor(group, code)) {
            this.#clearResolvedActorIdentity();
            this.#onOpenPromise?.reject(
              new RivetError(group, code, message, {
                metadata,
                actor,
              }),
            );
            return;
          }
          let errorToThrow = new RivetError(group, code, message, {
            metadata,
            actor,
          });
          if (isSchedulingError(group, code) && this.#actorId) {
            const schedulingError = await checkForSchedulingError(
              group,
              code,
              this.#actorId,
              this.#actorResolutionState,
              this.#driver,
            );
            if (schedulingError) {
              errorToThrow = schedulingError;
            }
          }
          if (this.#onOpenPromise) {
            this.#onOpenPromise.reject(errorToThrow);
          }
          this.#invalidateActorIfStale(group, code);
          for (const [id, inFlight] of this.#actionsInFlight.entries()) {
            inFlight.reject(errorToThrow);
            this.#actionsInFlight.delete(id);
          }
          this.#dispatchActorError(errorToThrow);
        }
      } else if (response.body.tag === "ActionResponse") {
        const { id: actionId } = response.body.val;
        logger2().debug({
          msg: "received action response",
          actionId: Number(actionId),
          inFlightCount: this.#actionsInFlight.size,
          inFlightIds: Array.from(this.#actionsInFlight.keys()),
        });
        const inFlight = this.#takeActionInFlight(Number(actionId));
        logger2().trace({
          msg: "resolving action promise",
          actionId,
          actionName: inFlight?.name,
        });
        inFlight.resolve(response.body.val);
      } else if (response.body.tag === "Event") {
        logger2().trace({
          msg: "received event",
          name: response.body.val.name,
        });
        this.#dispatchEvent(response.body.val);
      } else {
        assertUnreachable(response.body);
      }
    }
    /** Called by the onclose event from drivers. */
    async #handleOnClose(event) {
      const closeEvent = event;
      const wasClean = closeEvent.wasClean;
      const wasConnected = this.#connStatus === "connected";
      logger2().info({
        msg: "socket closed",
        code: closeEvent.code,
        reason: closeEvent.reason,
        wasClean,
        disposed: this.#disposed,
        connId: this.#connId,
      });
      this.#websocket = void 0;
      if (this.#disposed) {
        this.#rejectPendingPromises(new ActorConnDisposed(), true);
      } else {
        this.#setConnStatus("disconnected");
        let error51;
        const reason = closeEvent.reason || "";
        const parsed = parseWebSocketCloseReason(reason);
        if (parsed) {
          const { group, code, rayId } = parsed;
          if (this.#shouldReconnectForStaleActor(group, code)) {
            this.#clearResolvedActorIdentity();
            this.#onOpenPromise?.reject(
              new RivetError(group, code, `Connection closed: ${reason}`, { rayId }),
            );
            return;
          }
          if (isSchedulingError(group, code) && this.#actorId) {
            const schedulingError = await checkForSchedulingError(
              group,
              code,
              this.#actorId,
              this.#actorResolutionState,
              this.#driver,
              rayId,
            );
            if (schedulingError) {
              error51 = schedulingError;
            } else {
              error51 = new RivetError(group, code, `Connection closed: ${reason}`, { rayId });
            }
          } else {
            error51 = new RivetError(group, code, `Connection closed: ${reason}`, { rayId });
          }
          this.#invalidateActorIfStale(group, code);
        } else {
          error51 = new Error(
            `${wasClean ? "Connection closed" : "Connection lost"} (code: ${closeEvent.code}, reason: ${reason})`,
          );
        }
        this.#rejectPendingPromises(error51, false);
        if (error51 instanceof RivetError) {
          this.#dispatchActorError(error51);
        }
        if (wasConnected) {
          logger2().debug({
            msg: "triggering reconnect",
            connId: this.#connId,
          });
          this.#connectWithRetry();
        }
      }
    }
    #rejectPendingPromises(error51, suppressUnhandled) {
      if (this.#onOpenPromise) {
        if (suppressUnhandled) {
          this.#onOpenPromise.promise.catch(() => {});
        }
        this.#onOpenPromise.reject(error51);
      }
      for (const actionInfo of this.#actionsInFlight.values()) {
        actionInfo.reject(error51);
      }
      this.#actionsInFlight.clear();
    }
    /** Called by the onerror event from drivers. */
    #handleOnError() {
      if (this.#disposed) return;
      logger2().warn("socket error");
    }
    #takeActionInFlight(id) {
      const inFlight = this.#actionsInFlight.get(id);
      if (!inFlight) {
        logger2().error({
          msg: "action not found in in-flight map",
          lookupId: id,
          inFlightCount: this.#actionsInFlight.size,
          inFlightIds: Array.from(this.#actionsInFlight.keys()),
          inFlightActions: Array.from(this.#actionsInFlight.entries()).map(([id2, action]) => ({
            id: id2,
            name: action.name,
          })),
        });
        throw internalClientError(`No in flight response for ${id}`);
      }
      this.#actionsInFlight.delete(id);
      logger2().debug({
        msg: "removed action from in-flight map",
        actionId: id,
        actionName: inFlight.name,
        inFlightCount: this.#actionsInFlight.size,
      });
      return inFlight;
    }
    #dispatchEvent(event) {
      const { name, args } = event;
      const listeners = this.#eventSubscriptions.get(name);
      if (!listeners) return;
      for (const listener of [...listeners]) {
        listener.callback(...args);
        if (listener.once) {
          listeners.delete(listener);
        }
      }
      if (listeners.size === 0) {
        this.#eventSubscriptions.delete(name);
      }
    }
    #dispatchActorError(error51) {
      for (const handler of [...this.#errorHandlers]) {
        try {
          handler(error51);
        } catch (err) {
          logger2().error({
            msg: "error in connection error handler",
            error: stringifyError(err),
          });
        }
      }
    }
    #addEventSubscription(eventName, callback, once) {
      const listener = {
        callback,
        once,
      };
      let subscriptionSet = this.#eventSubscriptions.get(eventName);
      if (subscriptionSet === void 0) {
        subscriptionSet = /* @__PURE__ */ new Set();
        this.#eventSubscriptions.set(eventName, subscriptionSet);
        this.#sendSubscription(eventName, true);
      }
      subscriptionSet.add(listener);
      return () => {
        const listeners = this.#eventSubscriptions.get(eventName);
        if (listeners) {
          listeners.delete(listener);
          if (listeners.size === 0) {
            this.#eventSubscriptions.delete(eventName);
            this.#sendSubscription(eventName, false);
          }
        }
      };
    }
    /**
     * Subscribes to an event that will happen repeatedly.
     *
     * @template Args - The type of arguments the event callback will receive.
     * @param {string} eventName - The name of the event to subscribe to.
     * @param {(...args: Args) => void} callback - The callback function to execute when the event is triggered.
     * @returns {EventUnsubscribe} - A function to unsubscribe from the event.
     * @see {@link https://rivet.dev/docs/events|Events Documentation}
     */
    on(eventName, callback) {
      return this.#addEventSubscription(eventName, callback, false);
    }
    /**
     * Subscribes to an event that will be triggered only once.
     *
     * @template Args - The type of arguments the event callback will receive.
     * @param {string} eventName - The name of the event to subscribe to.
     * @param {(...args: Args) => void} callback - The callback function to execute when the event is triggered.
     * @returns {EventUnsubscribe} - A function to unsubscribe from the event.
     * @see {@link https://rivet.dev/docs/events|Events Documentation}
     */
    once(eventName, callback) {
      return this.#addEventSubscription(eventName, callback, true);
    }
    /**
     * Subscribes to connection errors.
     *
     * @param {ActorErrorCallback} callback - The callback function to execute when a connection error occurs.
     * @returns {() => void} - A function to unsubscribe from the error handler.
     */
    onError(callback) {
      this.#errorHandlers.add(callback);
      return () => {
        this.#errorHandlers.delete(callback);
      };
    }
    /**
     * Returns the current connection status.
     *
     * @returns {ActorConnStatus} - The current connection status.
     */
    get connStatus() {
      return this.#connStatus;
    }
    /**
     * Returns whether the connection is currently open.
     *
     * @deprecated Use `connStatus` instead.
     * @returns {boolean} - True if the connection is open, false otherwise.
     */
    get isConnected() {
      return this.#connStatus === "connected";
    }
    /**
     * Resolves when this connection first reaches the connected state.
     */
    get ready() {
      return this.#readyPromise.promise;
    }
    /**
     * Subscribes to connection open events.
     *
     * This is called when the WebSocket connection is established and the Init message is received.
     *
     * @param {ConnectionStateCallback} callback - The callback function to execute when the connection opens.
     * @returns {() => void} - A function to unsubscribe from the open handler.
     */
    onOpen(callback) {
      this.#openHandlers.add(callback);
      if (this.#connStatus === "connected") {
        queueMicrotask(() => {
          if (!this.#openHandlers.has(callback)) {
            return;
          }
          try {
            callback();
          } catch (err) {
            logger2().error({
              msg: "error in open handler",
              error: stringifyError(err),
            });
          }
        });
      }
      return () => {
        this.#openHandlers.delete(callback);
      };
    }
    /**
     * Subscribes to connection close events.
     *
     * This is called when the WebSocket connection is closed. The connection will automatically
     * attempt to reconnect unless disposed.
     *
     * @param {ConnectionStateCallback} callback - The callback function to execute when the connection closes.
     * @returns {() => void} - A function to unsubscribe from the close handler.
     */
    onClose(callback) {
      this.#closeHandlers.add(callback);
      return () => {
        this.#closeHandlers.delete(callback);
      };
    }
    /**
     * Subscribes to connection status changes.
     *
     * This is called whenever the connection status changes between Disconnected, Connecting, and Connected.
     *
     * @param {StatusChangeCallback} callback - The callback function to execute when the status changes.
     * @returns {() => void} - A function to unsubscribe from the status change handler.
     */
    onStatusChange(callback) {
      this.#statusChangeHandlers.add(callback);
      return () => {
        this.#statusChangeHandlers.delete(callback);
      };
    }
    #sendMessage(message, opts) {
      if (this.#disposed) {
        if (opts?.ephemeral) {
          return;
        } else {
          throw new ActorConnDisposed();
        }
      }
      let queueMessage = false;
      if (this.#websocket) {
        const readyState = this.#websocket.readyState;
        logger2().debug({
          msg: "websocket send attempt",
          readyState,
          readyStateString:
            readyState === 0
              ? "CONNECTING"
              : readyState === 1
                ? "OPEN"
                : readyState === 2
                  ? "CLOSING"
                  : "CLOSED",
          connId: this.#connId,
          messageType: message.body.tag,
          actionName: message.body.val?.name,
        });
        if (this.#connStatus !== "connected") {
          logger2().debug({
            msg: "websocket init pending, queueing message",
            connStatus: this.#connStatus,
            messageType: message.body.tag,
          });
          queueMessage = true;
        } else if (readyState === 1) {
          try {
            const messageSerialized = serializeWithEncoding(
              this.#encoding,
              message,
              CLIENT_PROTOCOL_TO_SERVER,
              CURRENT_VERSION,
              ToServerSchema,
              // JSON: args is the raw value
              (msg) => msg,
              // BARE: args needs to be CBOR-encoded to ArrayBuffer
              (msg) => {
                if (msg.body.tag === "ActionRequest") {
                  return {
                    body: {
                      tag: "ActionRequest",
                      val: {
                        id: msg.body.val.id,
                        name: msg.body.val.name,
                        args: bufferToArrayBuffer(encodeCborCompat(msg.body.val.args)),
                      },
                    },
                  };
                } else {
                  return msg;
                }
              },
            );
            this.#websocket.send(messageSerialized);
            const serializedLength = messageLength(messageSerialized);
            logger2().trace({
              msg: "sent websocket message",
              len: serializedLength,
            });
          } catch (error51) {
            logger2().warn({
              msg: "failed to send message, added to queue",
              error: error51,
              connId: this.#connId,
            });
            queueMessage = true;
          }
        } else {
          logger2().debug({
            msg: "websocket not open, queueing message",
            readyState,
          });
          queueMessage = true;
        }
      } else {
        logger2().debug({ msg: "no websocket, queueing message" });
        queueMessage = true;
      }
      if (!opts?.ephemeral && queueMessage) {
        this.#messageQueue.push(message);
        logger2().debug({
          msg: "queued connection message",
          queueLength: this.#messageQueue.length,
          connId: this.#connId,
          messageType: message.body.tag,
          actionName: message.body.val?.name,
        });
      }
    }
    async #parseMessage(data) {
      (0, import_invariant4.default)(this.#websocket, "websocket must be defined");
      const buffer = await inputDataToBuffer(data);
      return deserializeWithEncoding(
        this.#encoding,
        buffer,
        CLIENT_PROTOCOL_TO_CLIENT,
        ToClientSchema,
        // JSON/CBOR: normalize actor generation to the public number shape.
        (msg) => {
          if (msg.body.tag !== "Error" || !msg.body.val.actor) {
            return msg;
          }
          return {
            body: {
              tag: "Error",
              val: {
                ...msg.body.val,
                actor: {
                  ...msg.body.val.actor,
                  generation: Number(msg.body.val.actor.generation),
                },
              },
            },
          };
        },
        // BARE: need to decode ArrayBuffer fields back to unknown
        (msg) => {
          if (msg.body.tag === "Error") {
            return {
              body: {
                tag: "Error",
                val: {
                  group: msg.body.val.group,
                  code: msg.body.val.code,
                  message: msg.body.val.message,
                  metadata: msg.body.val.metadata
                    ? decodeCborCompat(new Uint8Array(msg.body.val.metadata))
                    : null,
                  actionId: msg.body.val.actionId,
                  actor: msg.body.val.actor
                    ? {
                        actorId: msg.body.val.actor.actorId,
                        generation: Number(msg.body.val.actor.generation),
                        key: msg.body.val.actor.key ?? void 0,
                      }
                    : void 0,
                },
              },
            };
          } else if (msg.body.tag === "ActionResponse") {
            return {
              body: {
                tag: "ActionResponse",
                val: {
                  id: msg.body.val.id,
                  output: decodeCborCompat(new Uint8Array(msg.body.val.output)),
                },
              },
            };
          } else if (msg.body.tag === "Event") {
            return {
              body: {
                tag: "Event",
                val: {
                  name: msg.body.val.name,
                  args: decodeCborCompat(new Uint8Array(msg.body.val.args)),
                },
              },
            };
          } else {
            return msg;
          }
        },
      );
    }
    /**
     * Get the actor ID (for testing purposes).
     * @internal
     */
    get actorId() {
      return this.#actorId;
    }
    /**
     * Get the connection ID (for testing purposes).
     * @internal
     */
    get connId() {
      return this.#connId;
    }
    /**
     * Get the connection ID (for testing purposes).
     * @internal
     * @deprecated Use `connId` instead.
     */
    get connectionId() {
      return this.#connId;
    }
    /**
     * Disconnects from the actor.
     *
     * @returns {Promise<void>} A promise that resolves when the socket is gracefully closed.
     */
    async dispose() {
      if (this.#disposed) {
        logger2().warn({ msg: "connection already disconnected" });
        return;
      }
      this.#disposed = true;
      logger2().debug({ msg: "disposing actor conn" });
      this.#setConnStatus("idle");
      clearInterval(this.#keepNodeAliveInterval);
      this.#abortController.abort();
      this.#client[ACTOR_CONNS_SYMBOL].delete(this);
      if (this.#websocket) {
        const ws = this.#websocket;
        if (ws.readyState !== 2 && ws.readyState !== 3) {
          const { promise: promise2, resolve } = promiseWithResolvers((reason) =>
            logger2().warn({
              msg: "unhandled websocket close promise rejection",
              reason,
            }),
          );
          ws.addEventListener("close", () => resolve(void 0));
          ws.close(1e3, "Disposed");
          await promise2;
        }
      } else {
        this.#rejectPendingPromises(new ActorConnDisposed(), true);
      }
      this.#websocket = void 0;
    }
    #sendSubscription(eventName, subscribe) {
      this.#sendMessage(
        {
          body: {
            tag: "SubscriptionRequest",
            val: {
              eventName,
              subscribe,
            },
          },
        },
        { ephemeral: true },
      );
    }
  };
  function isUrlLike(value) {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.href === "string" &&
      typeof value.pathname === "string" &&
      typeof value.search === "string"
    );
  }
  function isRequestLike(value) {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof value.url === "string" &&
      typeof value.method === "string" &&
      isHeadersLike(value.headers)
    );
  }
  function isHeadersLike(value) {
    return typeof value === "object" && value !== null && typeof value.entries === "function";
  }
  var MIGRATION_TRANSACTION_TIMEOUT_MS = 5 * 6e4;
  var AsyncMutex = class {
    #locked = false;
    #waiting = [];
    async acquire() {
      while (this.#locked) {
        await new Promise((resolve) => this.#waiting.push(resolve));
      }
      this.#locked = true;
    }
    release() {
      this.#locked = false;
      const next = this.#waiting.shift();
      if (next) {
        next();
      }
    }
    async run(fn) {
      await this.acquire();
      try {
        return await fn();
      } finally {
        this.release();
      }
    }
  };
  async function prepareRetryableInit(init) {
    if (init.body instanceof ReadableStream) {
      return {
        ...init,
        body: new Uint8Array(await new Response(init.body).arrayBuffer()),
      };
    }
    return init;
  }
  async function rawHttpFetch(driver, target2, params, input, init, options = {}) {
    let path;
    let originalUrl;
    let mergedInit = init || {};
    if (typeof input === "string") {
      path = input;
    } else if (isUrlLike(input)) {
      path = input.pathname + input.search;
      originalUrl = input.toString();
    } else if (isRequestLike(input)) {
      const url2 = new URL(input.url);
      path = url2.pathname + url2.search;
      originalUrl = url2.toString();
      const requestHeaders = new Headers(input.headers);
      const initHeaders = new Headers(init?.headers || {});
      const mergedHeaders = new Headers(requestHeaders);
      initHeaders.forEach((value, key) => {
        mergedHeaders.set(key, value);
      });
      mergedInit = {
        method: input.method,
        body: input.body,
        mode: input.mode,
        credentials: input.credentials,
        redirect: input.redirect,
        referrer: input.referrer,
        referrerPolicy: input.referrerPolicy,
        integrity: input.integrity,
        keepalive: input.keepalive,
        signal: input.signal,
        ...mergedInit,
        // init overrides Request properties
        headers: mergedHeaders,
        // headers must be set after spread to ensure proper merge
      };
      if (mergedInit.body) {
        mergedInit.duplex = "half";
      }
    } else {
      throw new TypeError("Invalid input type for fetch");
    }
    try {
      logger2().debug(
        "directId" in target2
          ? {
              msg: "sending raw http request to actor",
              actorId: target2.directId,
            }
          : {
              msg: "sending raw http request with actor query",
              query: target2,
            },
      );
      const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
      const url2 = new URL(`http://actor/request/${normalizedPath}`);
      const proxyRequestHeaders = new Headers(mergedInit.headers);
      proxyRequestHeaders.delete(HEADER_ORIGINAL_REQUEST_URL);
      if (originalUrl) {
        proxyRequestHeaders.set(HEADER_ORIGINAL_REQUEST_URL, originalUrl);
      }
      if (params) {
        proxyRequestHeaders.set(HEADER_CONN_PARAMS, JSON.stringify(params));
      }
      const proxyRequest = new Request(url2, {
        ...mergedInit,
        headers: proxyRequestHeaders,
      });
      return driver.sendRequest(target2, proxyRequest, options);
    } catch (err) {
      const { group, code, message, metadata, rayId, actor } = deconstructError(err, true);
      throw new RivetError(group, code, message, { metadata, rayId, actor });
    }
  }
  async function rawWebSocket(driver, target2, params, path, _protocols, options = {}) {
    const encoding = "bare";
    let pathPortion = "";
    let queryPortion = "";
    if (path) {
      const queryIndex = path.indexOf("?");
      if (queryIndex !== -1) {
        pathPortion = path.substring(0, queryIndex);
        queryPortion = path.substring(queryIndex);
      } else {
        pathPortion = path;
      }
      if (pathPortion.startsWith("/")) {
        pathPortion = pathPortion.slice(1);
      }
    }
    const fullPath = `${PATH_WEBSOCKET_PREFIX}${pathPortion}${queryPortion}`;
    logger2().debug({
      msg: "opening websocket",
      target: target2,
      encoding,
      path: fullPath,
    });
    const ws = await driver.openWebSocket(fullPath, target2, encoding, params, options);
    return ws;
  }
  async function resolveGatewayTarget(driver, target2) {
    if ("directId" in target2) {
      return target2.directId;
    }
    if ("getForId" in target2) {
      return target2.getForId.actorId;
    }
    if ("getForKey" in target2) {
      const output = await driver.getWithKey({
        name: target2.getForKey.name,
        key: target2.getForKey.key,
      });
      if (!output) {
        throw actorNotFound(`${target2.getForKey.name}:${JSON.stringify(target2.getForKey.key)}`);
      }
      return output.actorId;
    }
    if ("getOrCreateForKey" in target2) {
      const output = await driver.getOrCreateWithKey({
        name: target2.getOrCreateForKey.name,
        key: target2.getOrCreateForKey.key,
        input: target2.getOrCreateForKey.input,
        region: target2.getOrCreateForKey.region,
        poolName: target2.getOrCreateForKey.poolName,
      });
      return output.actorId;
    }
    if ("create" in target2) {
      const output = await driver.createActor({
        name: target2.create.name,
        key: target2.create.key,
        input: target2.create.input,
        region: target2.create.region,
        poolName: target2.create.poolName,
      });
      return output.actorId;
    }
    throw invalidRequest("Invalid query format");
  }
  var ActorHandleRaw = class {
    #client;
    #driver;
    #encoding;
    #actorResolutionState;
    #gatewayOptions;
    #params;
    #getParams;
    #signal;
    #resolvedActorId;
    #resolvingActorId;
    #queueSendMutex = new AsyncMutex();
    /**
     * Do not call this directly.
     *
     * Creates an instance of ActorHandleRaw.
     *
     * @protected
     */
    constructor(
      client,
      driver,
      params,
      getParams,
      encoding,
      actorResolutionState,
      gatewayOptions = {},
      signal,
    ) {
      this.#client = client;
      this.#driver = driver;
      this.#encoding = encoding;
      this.#actorResolutionState = actorResolutionState;
      this.#gatewayOptions = gatewayOptions;
      this.#params = params;
      this.#getParams = getParams;
      this.#signal = signal;
    }
    async #resolveConnectionParams() {
      if (this.#getParams) {
        return await this.#getParams();
      }
      return this.#params;
    }
    send(name, body, options) {
      return this.#sendQueueMessage(name, body, options);
    }
    async #sendQueueMessage(name, body, options) {
      return await this.#queueSendMutex.run(async () => {
        const maxAttempts = this.#getDynamicQueryMaxAttempts();
        let useQueryTarget = isDynamicActorQuery(this.#actorResolutionState);
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          let actorId;
          try {
            const gatewayOptions = resolveActorGatewayOptions(this.#gatewayOptions);
            const target2 = await this.#resolveGatewayRequestTarget(useQueryTarget, gatewayOptions);
            actorId = "directId" in target2 ? target2.directId : void 0;
            return await createQueueSender({
              encoding: this.#encoding,
              params: this.#params,
              customFetch: async (request) => {
                return await this.#driver.sendRequest(target2, request, gatewayOptions);
              },
            }).send(name, body, options);
          } catch (err) {
            const { group, code, message, metadata, rayId, actor } = deconstructError(err, true);
            if (
              this.#shouldRetryQueueDispatchOverload(group, code, metadata, attempt, maxAttempts)
            ) {
              await this.#waitForRetryWindow();
              continue;
            }
            if (
              await this.#shouldRetrySchedulingError(
                group,
                code,
                actorId,
                attempt,
                maxAttempts,
                rayId,
              )
            ) {
              useQueryTarget = true;
              await this.#waitForRetryWindow();
              continue;
            }
            if (this.#shouldRetryDynamicLifecycleError(group, code, attempt, maxAttempts)) {
              this.#clearResolvedActorId();
              useQueryTarget = true;
              await this.#waitForRetryWindow();
              continue;
            }
            const invalidated = this.#invalidateResolvedActorId(group, code);
            if (invalidated && attempt < maxAttempts - 1) {
              const waitForReady =
                code === "starting" || code === "stopping" || code.startsWith("destroyed_");
              useQueryTarget = useQueryTarget || waitForReady;
              if (waitForReady) {
                await this.#waitForRetryWindow();
              }
              continue;
            }
            throw new RivetError(group, code, message, {
              metadata,
              rayId,
              actor,
            });
          }
        }
        throw new Error("unreachable queue retry state");
      });
    }
    /**
     * Call a raw action. This method sends an HTTP request to invoke the named action.
     *
     * @see {@link ActorHandle}
     * @template Args - The type of arguments to pass to the action function.
     * @template Response - The type of the response returned by the action function.
     */
    async action(opts) {
      if (
        typeof opts === "string" ||
        typeof opts !== "object" ||
        opts === null ||
        !("name" in opts)
      ) {
        throw new Error(
          `Invalid action call: expected an options object { name, args }, got ${typeof opts}. Use handle.actionName(...args) for the shorthand API.`,
        );
      }
      const signal = opts.signal ?? this.#signal;
      const optsWithSignal = { ...opts, signal };
      const run = async () => await this.#sendActionNow(optsWithSignal);
      if (opts.name === "destroy") {
        return await run();
      }
      return await retryOnLifecycleBoundary(run, { signal });
    }
    async #sendActionNow(opts) {
      const maxAttempts = this.#getDynamicQueryMaxAttempts();
      let useQueryTarget = isDynamicActorQuery(this.#actorResolutionState);
      const gatewayOptions = resolveActorGatewayOptions(this.#gatewayOptions, opts);
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        let actorId;
        try {
          const target2 = await this.#resolveGatewayRequestTarget(useQueryTarget, gatewayOptions);
          actorId = "directId" in target2 ? target2.directId : void 0;
          logger2().debug(
            actorId
              ? { msg: "using direct actor gateway target", actorId }
              : {
                  msg: "using query gateway target for action",
                  query: this.#actorResolutionState,
                },
          );
          logger2().debug({
            msg: "handling action",
            name: opts.name,
            encoding: this.#encoding,
          });
          const output = await sendHttpRequest({
            url: `http://actor/action/${encodeURIComponent(opts.name)}`,
            method: "POST",
            headers: {
              [HEADER_ENCODING]: this.#encoding,
              ...(this.#params !== void 0
                ? {
                    [HEADER_CONN_PARAMS]: JSON.stringify(this.#params),
                  }
                : {}),
            },
            body: opts.args,
            encoding: this.#encoding,
            customFetch: async (request) =>
              await this.#driver.sendRequest(target2, request, gatewayOptions),
            signal: opts?.signal,
            requestVersion: CURRENT_VERSION,
            requestVersionedDataHandler: HTTP_ACTION_REQUEST_VERSIONED,
            responseVersion: CURRENT_VERSION,
            responseVersionedDataHandler: HTTP_ACTION_RESPONSE_VERSIONED,
            requestZodSchema: HttpActionRequestSchema,
            responseZodSchema: HttpActionResponseSchema,
            requestToJson: (args) => ({
              args,
            }),
            requestToBare: (args) => ({
              args: bufferToArrayBuffer(encodeCborCompat(args)),
            }),
            responseFromJson: (json2) => json2.output,
            responseFromBare: (bare5) => decodeCborCompat(new Uint8Array(bare5.output)),
          });
          if (opts.name === "destroy" && actorId) {
            await this.#waitForDestroyActionToSettle(actorId);
          }
          return output;
        } catch (err) {
          const { group, code, message, metadata, rayId, actor } = deconstructError(err, true);
          if (
            await this.#shouldRetrySchedulingError(
              group,
              code,
              actorId,
              attempt,
              maxAttempts,
              rayId,
            )
          ) {
            useQueryTarget = true;
            await this.#waitForRetryWindow();
            continue;
          }
          if (
            opts.name !== "destroy" &&
            this.#shouldRetryDynamicLifecycleError(group, code, attempt, maxAttempts)
          ) {
            this.#clearResolvedActorId();
            useQueryTarget = true;
            await this.#waitForRetryWindow();
            continue;
          }
          if (
            group === "actor" &&
            code === "destroyed_while_waiting_for_ready" &&
            "getForId" in this.#actorResolutionState
          ) {
            throw new RivetError(
              "actor",
              "not_found",
              "The actor does not exist or was destroyed.",
              { metadata, rayId, actor },
            );
          }
          const invalidated = this.#invalidateResolvedActorId(group, code);
          if (invalidated && attempt < maxAttempts - 1) {
            if (group === "actor" && (code === "starting" || code === "stopping")) {
              useQueryTarget = true;
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            continue;
          }
          throw new RivetError(group, code, message, {
            metadata,
            rayId,
            actor,
          });
        }
      }
      throw new Error("unreachable action retry state");
    }
    async #waitForDestroyActionToSettle(actorId) {
      const name = getActorNameFromQuery(this.#actorResolutionState);
      const deadline = Date.now() + 1e3;
      while (Date.now() < deadline) {
        const actor = await this.#driver.getForId({ name, actorId });
        if (!actor) {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    }
    async #waitForRetryWindow() {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    #getDynamicQueryMaxAttempts() {
      if (!isDynamicActorQuery(this.#actorResolutionState)) {
        return 1;
      }
      return "getOrCreateForKey" in this.#actorResolutionState ? 60 : 24;
    }
    #shouldRetryDynamicLifecycleError(group, code, attempt, maxAttempts) {
      if (
        !isDynamicActorQuery(this.#actorResolutionState) ||
        attempt >= maxAttempts - 1 ||
        group !== "actor"
      ) {
        return false;
      }
      return (
        code === "not_found" ||
        code === "starting" ||
        code === "stopping" ||
        code === "not_configured" ||
        code === "dropped_reply" ||
        code === "destroying" ||
        code.startsWith("destroyed_")
      );
    }
    #shouldRetryQueueDispatchOverload(group, code, metadata, attempt, maxAttempts) {
      if (
        !isDynamicActorQuery(this.#actorResolutionState) ||
        attempt >= maxAttempts - 1 ||
        group !== "actor" ||
        code !== "overloaded" ||
        metadata === null ||
        typeof metadata !== "object"
      ) {
        return false;
      }
      const overload = metadata;
      return overload.channel === "dispatch_inbox" && overload.operation === "dispatch_queue_send";
    }
    #clearResolvedActorId() {
      this.#resolvedActorId = void 0;
      this.#resolvingActorId = void 0;
    }
    async #shouldRetrySchedulingError(group, code, actorId, attempt, maxAttempts, rayId) {
      if (
        !isDynamicActorQuery(this.#actorResolutionState) ||
        !isSchedulingError(group, code) ||
        attempt >= maxAttempts - 1
      ) {
        return false;
      }
      if (actorId) {
        const schedulingError = await checkForSchedulingError(
          group,
          code,
          actorId,
          this.#actorResolutionState,
          this.#driver,
          rayId,
        );
        if (schedulingError) {
          throw schedulingError;
        }
      }
      this.#clearResolvedActorId();
      return true;
    }
    #invalidateResolvedActorId(group, code) {
      if (
        !isDynamicActorQuery(this.#actorResolutionState) ||
        !isStaleResolvedActorError(group, code)
      ) {
        return false;
      }
      this.#clearResolvedActorId();
      return true;
    }
    async #resolveActionTarget(useQueryTarget) {
      if ("getForId" in this.#actorResolutionState) {
        return getGatewayTarget(this.#actorResolutionState);
      }
      if (useQueryTarget) {
        return getGatewayTarget(this.#actorResolutionState);
      }
      if (this.#resolvedActorId) {
        return { directId: this.#resolvedActorId };
      }
      if (!this.#resolvingActorId) {
        this.#resolvingActorId = resolveGatewayTarget(
          this.#driver,
          this.#actorResolutionState,
        ).then((actorId) => {
          this.#resolvedActorId = actorId;
          return actorId;
        });
      }
      try {
        return { directId: await this.#resolvingActorId };
      } finally {
        this.#resolvingActorId = void 0;
      }
    }
    async #resolveGatewayRequestTarget(useQueryTarget, gatewayOptions) {
      if (gatewayOptions.skipReadyWait) {
        return getGatewayTarget(this.#actorResolutionState);
      }
      return await this.#resolveActionTarget(useQueryTarget);
    }
    /**
     * Establishes a persistent connection to the actor.
     *
     * @template AD The actor class that this connection is for.
     * @returns {ActorConn<AD>} A connection to the actor.
     */
    connect(params, options = {}) {
      logger2().debug({
        msg: "establishing connection from handle",
        query: this.#actorResolutionState,
      });
      const connParams = params === void 0 ? this.#params : params;
      const getParams = params === void 0 ? this.#getParams : void 0;
      const conn = new ActorConnRaw(
        this.#client,
        this.#driver,
        connParams,
        getParams,
        this.#encoding,
        this.#actorResolutionState,
        resolveActorGatewayOptions(this.#gatewayOptions, options),
      );
      return this.#client[CREATE_ACTOR_CONN_PROXY](conn);
    }
    /**
     * Fetches a resource from this actor via the /request endpoint. This is a
     * convenience wrapper around the raw HTTP API.
     */
    fetch(input, init) {
      return this.#fetchWithResolvedActor(input, init);
    }
    async #fetchWithResolvedActor(input, init) {
      const { skipReadyWait, ...restInit } = init ?? {};
      const maxAttempts = this.#getDynamicQueryMaxAttempts();
      const requestInit = maxAttempts > 1 ? await prepareRetryableInit(restInit) : restInit;
      const clonesInputBody =
        requestInit.body === void 0 && isRequestLike(input) && input.body !== null;
      let useQueryTarget = isDynamicActorQuery(this.#actorResolutionState);
      const gatewayOptions = resolveActorGatewayOptions(this.#gatewayOptions, {
        skipReadyWait,
      });
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        let actorId;
        try {
          const target2 = await this.#resolveGatewayRequestTarget(useQueryTarget, gatewayOptions);
          actorId = "directId" in target2 ? target2.directId : void 0;
          const response = await rawHttpFetch(
            this.#driver,
            target2,
            this.#params,
            // Clone a body-bearing Request so retries don't reuse a consumed stream.
            // NOTE: This holds the body in memory until GC (unavoidable).
            clonesInputBody ? input.clone() : input,
            requestInit,
            gatewayOptions,
          );
          const retry2 = await this.#shouldRetryRawFetchResponse(
            response,
            actorId,
            attempt,
            maxAttempts,
          );
          if (retry2) {
            useQueryTarget = retry2.useQueryTarget;
            if (retry2.waitForRetryWindow) {
              await this.#waitForRetryWindow();
            }
            continue;
          }
          return response;
        } catch (err) {
          const { group, code, message, metadata, rayId, actor } = deconstructError(err, true);
          if (
            await this.#shouldRetrySchedulingError(
              group,
              code,
              actorId,
              attempt,
              maxAttempts,
              rayId,
            )
          ) {
            useQueryTarget = true;
            await this.#waitForRetryWindow();
            continue;
          }
          if (this.#shouldRetryDynamicLifecycleError(group, code, attempt, maxAttempts)) {
            this.#clearResolvedActorId();
            useQueryTarget = true;
            await this.#waitForRetryWindow();
            continue;
          }
          const invalidated = this.#invalidateResolvedActorId(group, code);
          if (invalidated && attempt < maxAttempts - 1) {
            const waitForReady =
              code === "starting" || code === "stopping" || code.startsWith("destroyed_");
            useQueryTarget = useQueryTarget || waitForReady;
            if (waitForReady) {
              await this.#waitForRetryWindow();
            }
            continue;
          }
          throw new RivetError(group, code, message, {
            metadata,
            rayId,
            actor,
          });
        }
      }
      throw new Error("unreachable fetch retry state");
    }
    async #shouldRetryRawFetchResponse(response, actorId, attempt, maxAttempts) {
      if (response.ok || !isDynamicActorQuery(this.#actorResolutionState)) {
        return null;
      }
      const error51 = await this.#parseRawFetchErrorResponse(response);
      if (!error51) {
        return null;
      }
      const { group, code, rayId } = error51;
      if (
        await this.#shouldRetrySchedulingError(group, code, actorId, attempt, maxAttempts, rayId)
      ) {
        return {
          useQueryTarget: true,
          waitForRetryWindow: true,
        };
      }
      if (this.#shouldRetryDynamicLifecycleError(group, code, attempt, maxAttempts)) {
        this.#clearResolvedActorId();
        return {
          useQueryTarget: true,
          waitForRetryWindow: true,
        };
      }
      const invalidated = this.#invalidateResolvedActorId(group, code);
      if (invalidated && attempt < maxAttempts - 1) {
        const waitForReady =
          code === "starting" || code === "stopping" || code.startsWith("destroyed_");
        return {
          useQueryTarget: true,
          waitForRetryWindow: waitForReady,
        };
      }
      return null;
    }
    async #parseRawFetchErrorResponse(response) {
      if (response.ok) {
        return null;
      }
      const contentType = response.headers.get("content-type");
      const encoding = contentType?.includes("application/json") ? "json" : this.#encoding;
      try {
        const error51 = deserializeWithEncoding(
          encoding,
          new Uint8Array(await response.clone().arrayBuffer()),
          HTTP_RESPONSE_ERROR_VERSIONED,
          HttpResponseErrorSchema,
          (json2) => ({
            ...json2,
            actor: json2.actor
              ? {
                  ...json2.actor,
                  generation: Number(json2.actor.generation),
                }
              : void 0,
          }),
          (bare5) => ({
            group: bare5.group,
            code: bare5.code,
            message: bare5.message,
            metadata: bare5.metadata ? decodeCborCompat(new Uint8Array(bare5.metadata)) : void 0,
            actor: bare5.actor
              ? {
                  actorId: bare5.actor.actorId,
                  generation: Number(bare5.actor.generation),
                  key: bare5.actor.key ?? void 0,
                }
              : void 0,
          }),
        );
        return {
          ...error51,
          rayId: response.headers.get("x-rivet-ray-id") ?? void 0,
        };
      } catch {
        return null;
      }
    }
    /**
     * Opens a raw WebSocket connection to this actor.
     */
    async webSocket(path, protocols, options = {}) {
      const params = await this.#resolveConnectionParams();
      const gatewayOptions = resolveActorGatewayOptions(this.#gatewayOptions, options);
      const useQueryTarget = isDynamicActorQuery(this.#actorResolutionState);
      const target2 = await this.#resolveGatewayRequestTarget(useQueryTarget, gatewayOptions);
      return await rawWebSocket(this.#driver, target2, params, path, protocols, gatewayOptions);
    }
    /**
     * Resolves the actor to get its unique actor ID.
     */
    async resolve() {
      if ("getForId" in this.#actorResolutionState) {
        return this.#actorResolutionState.getForId.actorId;
      }
      const target2 = await this.#resolveActionTarget(false);
      if ("directId" in target2) {
        return target2.directId;
      }
      throw new Error("dynamic actor resolution did not produce a direct actor id");
    }
    /**
     * Returns the raw URL for routing traffic to the actor.
     */
    async getGatewayUrl() {
      return await this.#driver.buildGatewayUrl(
        getGatewayTarget(this.#actorResolutionState),
        this.#gatewayOptions,
      );
    }
    async reload() {
      const target2 = getGatewayTarget(this.#actorResolutionState);
      const request = new Request("http://actor/dynamic/reload", {
        method: "PUT",
      });
      const response = await this.#driver.sendRequest(target2, request);
      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new RivetError(
          "actor",
          "reload_failed",
          `reload failed with status ${response.status}: ${body}`,
          {
            rayId: response.headers.get("x-rivet-ray-id") ?? void 0,
          },
        );
      }
    }
  };
  var ACTOR_CONNS_SYMBOL = /* @__PURE__ */ Symbol("actorConns");
  var CREATE_ACTOR_CONN_PROXY = /* @__PURE__ */ Symbol("createActorConnProxy");
  var ClientRaw = class {
    #disposed = false;
    [ACTOR_CONNS_SYMBOL] = /* @__PURE__ */ new Set();
    #driver;
    #encodingKind;
    #gatewayOptions;
    /**
     * Creates an instance of Client.
     */
    constructor(driver, encoding, gatewayOptions = {}) {
      this.#driver = driver;
      this.#encodingKind = encoding ?? "bare";
      this.#gatewayOptions = gatewayOptions;
    }
    /**
     * Gets a stateless handle to a actor by its ID.
     *
     * @template AD The actor class that this handle is for.
     * @param {string} name - The name of the actor.
     * @param {string} actorId - The ID of the actor.
     * @param {GetWithIdOptions} [opts] - Options for getting the actor.
     * @returns {ActorHandle<AD>} - A handle to the actor.
     */
    getForId(name, actorId, opts) {
      logger2().debug({
        msg: "get handle to actor with id",
        name,
        actorId,
        params: opts?.params,
      });
      const actorQuery = {
        getForId: {
          name,
          actorId,
        },
      };
      const handle = this.#createHandle(opts?.params, opts?.getParams, actorQuery, opts?.signal);
      return createActorProxy(handle);
    }
    /**
     * Gets a stateless handle to a actor by its key, but does not create the actor if it doesn't exist.
     *
     * @template AD The actor class that this handle is for.
     * @param {string} name - The name of the actor.
     * @param {string | string[]} [key=[]] - The key to identify the actor. Can be a single string or an array of strings.
     * @param {GetWithIdOptions} [opts] - Options for getting the actor.
     * @returns {ActorHandle<AD>} - A handle to the actor.
     */
    get(name, key, opts) {
      const keyArray = typeof key === "string" ? [key] : key || [];
      logger2().debug({
        msg: "get handle to actor",
        name,
        key: keyArray,
        parameters: opts?.params,
      });
      const actorQuery = {
        getForKey: {
          name,
          key: keyArray,
        },
      };
      const handle = this.#createHandle(opts?.params, opts?.getParams, actorQuery, opts?.signal);
      return createActorProxy(handle);
    }
    /**
     * Gets a stateless handle to a actor by its key, creating it if necessary.
     *
     * @template AD The actor class that this handle is for.
     * @param {string} name - The name of the actor.
     * @param {string | string[]} [key=[]] - The key to identify the actor. Can be a single string or an array of strings.
     * @param {GetOptions} [opts] - Options for getting the actor.
     * @returns {ActorHandle<AD>} - A handle to the actor.
     */
    getOrCreate(name, key, opts) {
      const keyArray = typeof key === "string" ? [key] : key || [];
      logger2().debug({
        msg: "get or create handle to actor",
        name,
        key: keyArray,
        parameters: opts?.params,
        createInRegion: opts?.createInRegion,
      });
      const actorQuery = {
        getOrCreateForKey: {
          name,
          key: keyArray,
          input: opts?.createWithInput,
          region: opts?.createInRegion,
          poolName: opts?.poolName,
        },
      };
      const handle = this.#createHandle(opts?.params, opts?.getParams, actorQuery, opts?.signal);
      return createActorProxy(handle);
    }
    /**
     * Creates a new actor with the provided key and returns a stateless handle to it.
     * Resolves the actor ID and returns a handle with getForId query.
     *
     * @template AD The actor class that this handle is for.
     * @param {string} name - The name of the actor.
     * @param {string | string[]} key - The key to identify the actor. Can be a single string or an array of strings.
     * @param {CreateOptions} [opts] - Options for creating the actor (excluding name and key).
     * @returns {Promise<ActorHandle<AD>>} - A promise that resolves to a handle to the actor.
     */
    async create(name, key, opts) {
      const keyArray = typeof key === "string" ? [key] : key || [];
      const createQuery = {
        create: {
          ...opts,
          // Do these last to override `opts`
          name,
          key: keyArray,
        },
      };
      logger2().debug({
        msg: "create actor handle",
        name,
        key: keyArray,
        parameters: opts?.params,
        create: createQuery.create,
      });
      const actorId = await resolveGatewayTarget(this.#driver, createQuery);
      logger2().debug({
        msg: "created actor with ID",
        name,
        key: keyArray,
        actorId,
      });
      const getForIdQuery = {
        getForId: {
          name,
          actorId,
        },
      };
      const handle = this.#createHandle(opts?.params, opts?.getParams, getForIdQuery, opts?.signal);
      const proxy = createActorProxy(handle);
      return proxy;
    }
    #createHandle(params, getParams, actorQuery, signal) {
      return new ActorHandleRaw(
        this,
        this.#driver,
        params,
        getParams,
        this.#encodingKind,
        actorQuery,
        this.#gatewayOptions,
        signal,
      );
    }
    [CREATE_ACTOR_CONN_PROXY](conn) {
      this[ACTOR_CONNS_SYMBOL].add(conn);
      conn[CONNECT_SYMBOL]();
      return createActorProxy(conn);
    }
    /**
     * Disconnects from all actors.
     *
     * @returns {Promise<void>} A promise that resolves when all connections are closed.
     */
    async dispose() {
      if (this.#disposed) {
        logger2().warn({ msg: "client already disconnected" });
        return;
      }
      this.#disposed = true;
      logger2().debug({ msg: "disposing client" });
      const disposePromises = [];
      for (const conn of this[ACTOR_CONNS_SYMBOL].values()) {
        disposePromises.push(conn.dispose());
      }
      await Promise.all(disposePromises);
    }
  };
  function createClientWithDriver(driver, config2 = {}) {
    const client = new ClientRaw(driver, config2.encoding, config2.gateway);
    return new Proxy(client, {
      get: (target2, prop, receiver) => {
        if (typeof prop === "symbol" || prop in target2) {
          const value = Reflect.get(target2, prop, receiver);
          if (typeof value === "function") {
            return value.bind(target2);
          }
          return value;
        }
        if (typeof prop === "string") {
          return {
            // Handle methods (stateless action)
            get: (key, opts) => {
              return target2.get(prop, key, opts);
            },
            getOrCreate: (key, opts) => {
              return target2.getOrCreate(prop, key, opts);
            },
            getForId: (actorId, opts) => {
              return target2.getForId(prop, actorId, opts);
            },
            create: async (key, opts = {}) => {
              return await target2.create(prop, key, opts);
            },
          };
        }
        return void 0;
      },
    });
  }
  function createActorProxy(handle) {
    const methodCache = /* @__PURE__ */ new Map();
    const actionPath = (name) => {
      let method = methodCache.get(name);
      if (method) return method;
      method = new Proxy((...args) => handle.action({ name, args }), {
        get(target2, prop) {
          if (typeof prop === "symbol") return Reflect.get(target2, prop);
          if (prop === "then") return void 0;
          return actionPath(`${name}.${prop}`);
        },
      });
      methodCache.set(name, method);
      return method;
    };
    return new Proxy(handle, {
      get(target2, prop, receiver) {
        if (typeof prop === "symbol") {
          return Reflect.get(target2, prop, receiver);
        }
        if (prop === "constructor" || prop in target2) {
          const value = Reflect.get(target2, prop, target2);
          if (typeof value === "function") {
            return value.bind(target2);
          }
          return value;
        }
        if (typeof prop === "string") {
          if (prop === "then") return void 0;
          return actionPath(prop);
        }
      },
      // Support for 'in' operator
      has(target2, prop) {
        if (typeof prop === "string") return true;
        return Reflect.has(target2, prop);
      },
      // Support instanceof checks
      getPrototypeOf(target2) {
        return Reflect.getPrototypeOf(target2);
      },
      // Prevent property enumeration of non-existent action methods
      ownKeys(target2) {
        return Reflect.ownKeys(target2);
      },
      // Support proper property descriptors
      getOwnPropertyDescriptor(target2, prop) {
        if (prop === "then") return void 0;
        const targetDescriptor = Reflect.getOwnPropertyDescriptor(target2, prop);
        if (targetDescriptor) {
          return targetDescriptor;
        }
        if (typeof prop === "string") {
          return {
            configurable: true,
            enumerable: false,
            writable: false,
            value: actionPath(prop),
          };
        }
        return void 0;
      },
    });
  }
  function createClient(endpointOrConfig) {
    const configInput =
      endpointOrConfig === void 0
        ? {}
        : typeof endpointOrConfig === "string"
          ? { endpoint: endpointOrConfig }
          : endpointOrConfig;
    const config2 = ClientConfigSchema.parse(configInput);
    const driver = new RemoteEngineControlClient(config2);
    if (config2.devtools) {
      injectDevtools(config2);
    }
    return createClientWithDriver(driver, config2);
  }

  // src/dashboard.ts
  var PHASES = ["IDLE", "RECALL", "PLAN", "EXECUTE", "VERIFY", "COMMIT", "ESCALATE"];
  var el = (id) => document.getElementById(id);
  var workerKeyInput = el("worker-key");
  var connectBtn = el("connect");
  var connDot = el("conn-dot");
  var connLabel = el("conn-label");
  var agentLabel = el("agent-id");
  var taskLabel = el("current-task");
  var processedLabel = el("processed");
  var branchLabel = el("branch");
  var stdoutPane = el("stdout");
  var feed = el("feed");
  var depthCells = {
    PENDING: el("depth-PENDING"),
    LEASED: el("depth-LEASED"),
    COMPLETED: el("depth-COMPLETED"),
    FAILED: el("depth-FAILED"),
  };
  var stdoutLines = [];
  var currentPhase = null;
  var unsubscribers = [];
  var reconnectTimer = null;
  function log(line) {
    stdoutLines.push(`[${/* @__PURE__ */ new Date().toLocaleTimeString()}] ${line}`);
    if (stdoutLines.length > 400) stdoutLines.splice(0, stdoutLines.length - 400);
    stdoutPane.textContent = stdoutLines.join("\n");
    stdoutPane.scrollTop = stdoutPane.scrollHeight;
  }
  function feedItem(text, kind = "") {
    const li = document.createElement("li");
    li.textContent = text;
    if (kind) li.className = kind;
    feed.prepend(li);
    while (feed.children.length > 50) feed.removeChild(feed.lastChild);
  }
  function setPhase(phase) {
    currentPhase = phase;
    for (const p of PHASES) {
      const chip = document.getElementById(`phase-${p}`);
      if (chip) chip.classList.toggle("active", p === phase);
    }
  }
  function setConn(state) {
    connDot.dataset.state = state;
    connLabel.textContent =
      state === "open" ? "connected" : state === "connecting" ? "connecting\u2026" : "disconnected";
  }
  function renderDepth(depth) {
    if (!depth) return;
    for (const [status, cell] of Object.entries(depthCells)) {
      cell.textContent = String(depth[status] ?? 0);
    }
  }
  function handleStdout(output, taskId) {
    for (const line of output.replace(/\n+$/, "").split("\n")) log(`${taskId} | ${line}`);
  }
  function teardown() {
    for (const unsub of unsubscribers) {
      try {
        unsub();
      } catch {}
    }
    unsubscribers = [];
  }
  function connect() {
    teardown();
    if (reconnectTimer) clearTimeout(reconnectTimer);
    const key = workerKeyInput.value.trim() || "dashboard-demo";
    setConn("connecting");
    agentLabel.textContent = key;
    const endpointParam = new URLSearchParams(location.search).get("endpoint");
    const client = createClient(endpointParam ?? `${location.origin}/api/rivet`);
    const worker = client.swarmWorker.get([key]);
    worker.on("samTransition", (e) => {
      if (!e || typeof e !== "object") return;
      setPhase(e.to);
      feedItem(
        `${e.ts ? new Date(e.ts).toLocaleTimeString() + " " : ""}${e.from} \u2192 ${e.to}`,
        "transition",
      );
    });
    worker.on("sandboxStdout", (e) => {
      if (!e || typeof e !== "object") return;
      handleStdout(String(e.output ?? ""), String(e.taskId ?? "").slice(0, 8));
    });
    worker.on("workspaceStatus", (e) => {
      if (!e || typeof e !== "object") return;
      feedItem(
        `${e.step}${e.detail ? ` \u2014 ${String(e.detail).slice(0, 120)}` : ""}`,
        e.step?.startsWith("task_") ? e.step : "",
      );
    });
    worker.on("queueStatus", (e) => {
      if (!e || typeof e !== "object") return;
      renderDepth(e.depth);
    });
    worker
      .status()
      .then((s) => {
        taskLabel.textContent =
          s?.currentTaskName ?? (s?.currentTaskId ? String(s.currentTaskId).slice(0, 8) : "\u2014");
        processedLabel.textContent = String(s?.processedTasks ?? 0);
        branchLabel.textContent = s?.hasBranch ? "branched" : "none";
      })
      .catch((err) => log(`status() failed: ${err}`));
    setConn("open");
    log(`connected to ${location.origin}/api/rivet (worker ${key})`);
    feedItem("dashboard connected");
    const poll = setInterval(() => {
      worker
        .status()
        .then((s) => {
          processedLabel.textContent = String(s?.processedTasks ?? 0);
          if (s?.currentTaskName) taskLabel.textContent = s.currentTaskName;
          else if (s?.currentTaskId) taskLabel.textContent = String(s.currentTaskId).slice(0, 8);
        })
        .catch(() => {});
    }, 1e4);
    unsubscribers.push(() => clearInterval(poll));
  }
  connectBtn.addEventListener("click", connect);
  workerKeyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") connect();
  });
  setPhase(null);
  renderDepth(null);
  log("dashboard loaded \u2014 waiting for connection");
  connect();
})();
/*! Bundled license information:

@rivetkit/bare-ts/imports/dev.js:
@rivetkit/bare-ts/dist/util/assert.js:
@rivetkit/bare-ts/dist/util/validator.js:
@rivetkit/bare-ts/dist/util/constants.js:
@rivetkit/bare-ts/dist/core/bare-error.js:
@rivetkit/bare-ts/dist/core/byte-cursor.js:
@rivetkit/bare-ts/dist/codec/fixed-primitive.js:
@rivetkit/bare-ts/dist/codec/u8-array.js:
@rivetkit/bare-ts/dist/codec/data.js:
@rivetkit/bare-ts/dist/codec/string.js:
@rivetkit/bare-ts/dist/core/config.js:
  (*! Copyright (c) 2022 Victorien Elvinger *)
  (*! Licensed under the MIT License (https://mit-license.org/) *)
*/

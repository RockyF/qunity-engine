(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('qunity-core')) :
	typeof define === 'function' && define.amd ? define(['qunity-core'], factory) :
	(global = global || self, factory(global['qunity-core']));
}(this, function (qunityCore) { 'use strict';

	var ua = navigator.userAgent.toLowerCase();
	var isMobile = (ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1);
	var InteractContext = (function () {
	    function InteractContext(engine) {
	        this.engine = engine;
	    }
	    InteractContext.prototype.setup = function (options) {
	        if (options === void 0) { options = {}; }
	        var canvas = options.canvas, touchHandlers = options.touchHandlers, touchEnabled = options.touchEnabled;
	        this.touchHandlers = touchHandlers;
	        this.canvas = canvas;
	        if (touchEnabled) {
	            this.addListeners();
	        }
	    };
	    InteractContext.prototype.updateScale = function (scaleX, scaleY, rotation) {
	        this.scaleX = scaleX;
	        this.scaleY = scaleY;
	        this.rotation = rotation;
	    };
	    InteractContext.prototype.addListeners = function () {
	        var _this = this;
	        if (window.navigator.msPointerEnabled) {
	            this.canvas.addEventListener("MSPointerDown", function (event) {
	                event.identifier = event.pointerId;
	                _this.onTouchBegin(event);
	                _this.prevent(event);
	            }, false);
	            this.canvas.addEventListener("MSPointerMove", function (event) {
	                event.identifier = event.pointerId;
	                _this.onTouchMove(event);
	                _this.prevent(event);
	            }, false);
	            this.canvas.addEventListener("MSPointerUp", function (event) {
	                event.identifier = event.pointerId;
	                _this.onTouchEnd(event);
	                _this.prevent(event);
	            }, false);
	        }
	        else {
	            if (!isMobile) {
	                this.addMouseListener();
	            }
	            this.addTouchListener();
	        }
	    };
	    InteractContext.prototype.prevent = function (event) {
	        event.stopPropagation();
	        if (event["isScroll"] != true && !this.canvas['userTyping']) {
	            event.preventDefault();
	        }
	    };
	    InteractContext.prototype.addMouseListener = function () {
	        this.canvas.addEventListener("mousedown", this.onTouchBegin.bind(this));
	        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
	        this.canvas.addEventListener("mouseup", this.onTouchEnd.bind(this));
	    };
	    InteractContext.prototype.addTouchListener = function () {
	        var _this = this;
	        this.canvas.addEventListener("touchstart", function (event) {
	            for (var _i = 0, _a = event.changedTouches; _i < _a.length; _i++) {
	                var touch = _a[_i];
	                _this.onTouchBegin(touch);
	            }
	            _this.prevent(event);
	        }, false);
	        this.canvas.addEventListener("touchmove", function (event) {
	            for (var _i = 0, _a = event.changedTouches; _i < _a.length; _i++) {
	                var touch = _a[_i];
	                _this.onTouchMove(touch);
	            }
	            _this.prevent(event);
	        }, false);
	        this.canvas.addEventListener("touchend", function (event) {
	            for (var _i = 0, _a = event.changedTouches; _i < _a.length; _i++) {
	                var touch = _a[_i];
	                _this.onTouchEnd(touch);
	            }
	            _this.prevent(event);
	        }, false);
	        this.canvas.addEventListener("touchcancel", function (event) {
	            for (var _i = 0, _a = event.changedTouches; _i < _a.length; _i++) {
	                var touch = _a[_i];
	                _this.onTouchEnd(touch);
	            }
	            _this.prevent(event);
	        }, false);
	    };
	    InteractContext.prototype.onTouchBegin = function (event) {
	        var location = this.getLocation(event);
	        this.touchHandlers.onTouchBegin(location);
	    };
	    InteractContext.prototype.onMouseMove = function (event) {
	        if (event.buttons === 0) {
	            this.onTouchEnd(event);
	        }
	        else {
	            this.onTouchMove(event);
	        }
	    };
	    InteractContext.prototype.onTouchMove = function (event) {
	        var location = this.getLocation(event);
	        this.touchHandlers.onTouchMove(location);
	    };
	    InteractContext.prototype.onTouchEnd = function (event) {
	        var location = this.getLocation(event);
	        this.touchHandlers.onTouchEnd(location);
	    };
	    InteractContext.prototype.getLocation = function (event) {
	    };
	    return InteractContext;
	}());

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function fieldChanged(onModify) {
	    return function (target, key) {
	        var privateKey = '_' + key;
	        Object.defineProperty(target, key, {
	            enumerable: true,
	            get: function () {
	                return this[privateKey];
	            },
	            set: function (v) {
	                var oldValue = this[privateKey];
	                if (oldValue !== v) {
	                    this[privateKey] = v;
	                    onModify.apply(this, [v, key, oldValue]);
	                }
	            }
	        });
	    };
	}
	var dirtyFieldDetector = fieldChanged(function (value, key, oldValue) {
	    this['dirty'] = true;
	});
	var deepDirtyFieldDetector = fieldChanged(function (value, key, oldValue) {
	    var scope = this;
	    scope['dirty'] = true;
	    if (typeof value === 'object') {
	        value['onModify'] = function () {
	            scope['dirty'] = true;
	        };
	    }
	});
	var dirtyFieldTrigger = fieldChanged(function (value, key, oldValue) {
	    this['onModify'] && this['onModify'](value, key, oldValue);
	});

	var ScaleMode;
	(function (ScaleMode) {
	    ScaleMode["SHOW_ALL"] = "showAll";
	    ScaleMode["FIXED_WIDTH"] = "fixedWidth";
	    ScaleMode["FIXED_HEIGHT"] = "fixedHeight";
	    ScaleMode["NO_SCALE"] = "noScale";
	    ScaleMode["NO_FIXED"] = "noFixed";
	})(ScaleMode || (ScaleMode = {}));
	var RenderContext = (function () {
	    function RenderContext(engine) {
	        this._rotation = 0;
	        this.dirtyFieldTriggerLock = false;
	        this.engine = engine;
	    }
	    RenderContext.prototype.onModify = function (value, key, oldValue) {
	        if (!this.dirtyFieldTriggerLock) {
	            this.updateScaleModeSelf();
	        }
	    };
	    RenderContext.prototype.setup = function (options) {
	        if (options === void 0) { options = {}; }
	        var canvas = options.canvas, designWidth = options.designWidth, designHeight = options.designHeight, _a = options.scaleMode, scaleMode = _a === void 0 ? ScaleMode.SHOW_ALL : _a, _b = options.modifyCanvasSize, modifyCanvasSize = _b === void 0 ? false : _b, _c = options.autoAdjustSize, autoAdjustSize = _c === void 0 ? false : _c, onUpdateScale = options.onUpdateScale;
	        this.canvas = canvas;
	        this.canvasContext = canvas.getContext('2d');
	        this.dirtyFieldTriggerLock = true;
	        this.designWidth = designWidth;
	        this.designHeight = designHeight;
	        this.scaleMode = scaleMode;
	        this.modifyCanvasSize = modifyCanvasSize;
	        this.autoAdjustSize = autoAdjustSize;
	        this.onUpdateScale = onUpdateScale;
	        this.dirtyFieldTriggerLock = false;
	        this.updateScaleModeSelf();
	    };
	    Object.defineProperty(RenderContext.prototype, "scaleX", {
	        get: function () {
	            return this._scaleX;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(RenderContext.prototype, "scaleY", {
	        get: function () {
	            return this._scaleY;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(RenderContext.prototype, "rotation", {
	        get: function () {
	            return this._rotation;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    RenderContext.prototype.clear = function () {
	        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
	        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    };
	    Object.defineProperty(RenderContext.prototype, "context", {
	        get: function () {
	            return this.canvasContext;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(RenderContext.prototype, "stageSize", {
	        get: function () {
	            return {
	                width: this.stageWidth,
	                height: this.stageHeight,
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(RenderContext.prototype, "stageScale", {
	        get: function () {
	            return {
	                x: this._scaleX,
	                y: this._scaleY,
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(RenderContext.prototype, "stageCenter", {
	        get: function () {
	            return {
	                x: this.stageWidth / 2,
	                y: this.stageHeight / 2,
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    RenderContext.prototype.updateScaleModeSelf = function () {
	        var _a = this, canvas = _a.canvas, designWidth = _a.designWidth, designHeight = _a.designHeight, scaleMode = _a.scaleMode, _rotation = _a._rotation, modifyCanvasSize = _a.modifyCanvasSize;
	        var parent = canvas.parentElement;
	        var containerWidth = parent.clientWidth;
	        var containerHeight = parent.clientHeight;
	        var dWidth = designWidth || containerWidth;
	        var dHeight = designHeight || containerHeight;
	        var width, stageWidth;
	        var height, stageHeight;
	        var scaleX = containerWidth / dWidth;
	        var scaleY = containerHeight / dHeight;
	        var styleWidth;
	        var styleHeight;
	        switch (scaleMode) {
	            case ScaleMode.SHOW_ALL:
	                break;
	            case ScaleMode.NO_SCALE:
	                scaleX = scaleY = 1;
	                break;
	            case ScaleMode.NO_FIXED:
	                scaleX = scaleY = 1;
	                break;
	            case ScaleMode.FIXED_WIDTH:
	            case ScaleMode.FIXED_HEIGHT:
	                break;
	        }
	        switch (scaleMode) {
	            case ScaleMode.SHOW_ALL:
	                width = dWidth;
	                height = dHeight;
	                stageWidth = dWidth;
	                stageHeight = dHeight;
	                break;
	            case ScaleMode.NO_SCALE:
	                width = dWidth;
	                height = dHeight;
	                stageWidth = dWidth;
	                stageHeight = dHeight;
	                break;
	            case ScaleMode.NO_FIXED:
	                width = containerWidth;
	                height = containerHeight;
	                stageWidth = dWidth;
	                stageHeight = dHeight;
	                break;
	            case ScaleMode.FIXED_WIDTH:
	                width = dWidth;
	                if (modifyCanvasSize) {
	                    height = dHeight;
	                }
	                else {
	                    height = containerHeight / scaleX;
	                }
	                scaleY = scaleX;
	                stageWidth = width;
	                stageHeight = height;
	                break;
	            case ScaleMode.FIXED_HEIGHT:
	                if (modifyCanvasSize) {
	                    width = dWidth;
	                }
	                else {
	                    width = containerWidth / scaleY;
	                }
	                height = dHeight;
	                scaleX = scaleY;
	                stageWidth = width;
	                stageHeight = height;
	                break;
	        }
	        switch (scaleMode) {
	            case ScaleMode.SHOW_ALL:
	                styleWidth = containerWidth;
	                styleHeight = containerHeight;
	                break;
	            case ScaleMode.NO_FIXED:
	                styleWidth = containerWidth;
	                styleHeight = containerHeight;
	                break;
	            case ScaleMode.NO_SCALE:
	                styleWidth = designWidth;
	                styleHeight = designHeight;
	                break;
	            case ScaleMode.FIXED_WIDTH:
	            case ScaleMode.FIXED_HEIGHT:
	                styleWidth = modifyCanvasSize ? designWidth * scaleX : containerWidth;
	                styleHeight = modifyCanvasSize ? designHeight * scaleY : containerHeight;
	                break;
	        }
	        this.onUpdateScale(scaleX, scaleY, _rotation);
	        this.stageWidth = stageWidth;
	        this.stageHeight = stageHeight;
	        this._scaleX = scaleX;
	        this._scaleY = scaleY;
	        canvas.width = width;
	        canvas.height = height;
	        canvas.style.display = 'block';
	        canvas.style.width = styleWidth + 'px';
	        canvas.style.height = styleHeight + 'px';
	    };
	    __decorate([
	        dirtyFieldTrigger
	    ], RenderContext.prototype, "designWidth", void 0);
	    __decorate([
	        dirtyFieldTrigger
	    ], RenderContext.prototype, "designHeight", void 0);
	    __decorate([
	        dirtyFieldTrigger
	    ], RenderContext.prototype, "scaleMode", void 0);
	    __decorate([
	        dirtyFieldTrigger
	    ], RenderContext.prototype, "modifyCanvasSize", void 0);
	    __decorate([
	        dirtyFieldTrigger
	    ], RenderContext.prototype, "autoAdjustSize", void 0);
	    return RenderContext;
	}());

	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
	        window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) {
	    window.requestAnimationFrame = function (callback) {
	        var currTime = new Date().getTime();
	        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
	        var id = window.setTimeout(function () {
	            callback(currTime + timeToCall);
	        }, timeToCall);
	        lastTime = currTime + timeToCall;
	        return id;
	    };
	}
	if (!window.cancelAnimationFrame) {
	    window.cancelAnimationFrame = function (id) {
	        clearTimeout(id);
	    };
	}

	function injectProp(target, data, callback, ignoreMethod, ignoreNull) {
	    if (ignoreMethod === void 0) { ignoreMethod = true; }
	    if (ignoreNull === void 0) { ignoreNull = true; }
	    if (!target || !data) {
	        return false;
	    }
	    var result = false;
	    for (var key in data) {
	        var value = data[key];
	        if ((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null) && key.indexOf('_') !== 0 && key.indexOf('$') !== 0) {
	            if (callback) {
	                callback(target, key, value);
	            }
	            else {
	                try {
	                    target[key] = value;
	                }
	                catch (e) {
	                }
	            }
	            result = true;
	        }
	    }
	    return result;
	}

	var QunityEngine = (function () {
	    function QunityEngine() {
	        var _this = this;
	        this.engineConfig = {
	            canvas: 'gameCanvas',
	            fps: 60,
	            designWidth: 750,
	            designHeight: 1334,
	            scaleMode: ScaleMode.FIXED_WIDTH,
	            touchEnabled: true,
	        };
	        this.customConfig = {};
	        this._flush = 0;
	        this._currentFlush = 0;
	        this.lastFPS = 0;
	        this.nextTicks = [];
	        this.defMap = {};
	        this.flush = function (tsNow) {
	            if (_this._flush == 0) {
	                _this.onFrameTick(tsNow);
	            }
	            else {
	                if (_this._currentFlush == 0) {
	                    _this.onFrameTick(tsNow);
	                    _this._currentFlush = _this._flush;
	                }
	                else {
	                    _this._currentFlush--;
	                }
	            }
	            _this.tickId = requestAnimationFrame(_this.flush);
	        };
	    }
	    QunityEngine.prototype.registerDef = function (name, def) {
	        this.defMap[name] = def;
	        def.__class__ = name;
	    };
	    QunityEngine.prototype.unregisterDef = function (name) {
	        delete this.defMap[name];
	    };
	    QunityEngine.prototype.getDefByName = function (name, showWarn) {
	        if (showWarn === void 0) { showWarn = true; }
	        var def;
	        def = this.defMap[name];
	        if (!def && showWarn) {
	            console.warn('missing def:', name);
	            return;
	        }
	        return def;
	    };
	    QunityEngine.prototype.setup = function (_engineConfig, _customConfig, _dataCenterConfig) {
	        injectProp(this.engineConfig, _engineConfig);
	        injectProp(this.customConfig, _customConfig);
	        var _a = this.engineConfig, canvas = _a.canvas, designWidth = _a.designWidth, designHeight = _a.designHeight, scaleMode = _a.scaleMode, modifyCanvasSize = _a.modifyCanvasSize, touchEnabled = _a.touchEnabled;
	        this._canvasElement = typeof canvas == 'string' ? document.getElementById(canvas) : canvas;
	        this._interactContext = new InteractContext(this);
	        this._interactContext.setup({
	            canvas: this._canvasElement,
	            touchHandlers: {
	                onTouchBegin: this.onTouchBegin.bind(this),
	                onTouchMove: this.onTouchMove.bind(this),
	                onTouchEnd: this.onTouchEnd.bind(this),
	            },
	            touchEnabled: touchEnabled,
	        });
	        this._renderContext = new RenderContext(this);
	        this._renderContext.setup({
	            canvas: this._canvasElement,
	            designWidth: designWidth,
	            designHeight: designHeight,
	            scaleMode: scaleMode,
	            modifyCanvasSize: modifyCanvasSize,
	            onUpdateScale: this.onUpdateScale.bind(this),
	        });
	        this._root = new qunityCore.RootEntity();
	    };
	    QunityEngine.prototype.start = function () {
	        this._root.enabled = true;
	        this.tsStart = -1;
	        this.startTick();
	    };
	    QunityEngine.prototype.pause = function () {
	        this._root.enabled = false;
	        this.stopTick();
	    };
	    Object.defineProperty(QunityEngine.prototype, "root", {
	        get: function () {
	            return this._root;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QunityEngine.prototype.getEntityPath = function (entity) {
	        var path = '';
	        var current = entity || this._root;
	        while (current.parent) {
	            path = current.parent.children.indexOf(current) + (path.length > 0 ? '|' : '') + path;
	            current = current.parent;
	        }
	        return path;
	    };
	    QunityEngine.prototype.getEntityByPath = function (path) {
	        var target = this._root;
	        if (path.length > 0) {
	            var arr = path.split('|');
	            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
	                var item = arr_1[_i];
	                target = target.children[item];
	                if (!target) {
	                    target = null;
	                    break;
	                }
	            }
	        }
	        return target;
	    };
	    QunityEngine.prototype.getFPS = function () {
	        return this.lastFPS;
	    };
	    Object.defineProperty(QunityEngine.prototype, "renderContext", {
	        get: function () {
	            return this._renderContext;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QunityEngine.prototype, "interactContext", {
	        get: function () {
	            return this._interactContext;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QunityEngine.prototype, "canvasElement", {
	        get: function () {
	            return this._canvasElement;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QunityEngine.prototype.onUpdateScale = function (scaleX, scaleY, rotation) {
	        this._interactContext.updateScale(scaleX, scaleY, rotation);
	    };
	    QunityEngine.prototype.startTick = function () {
	        this._flush = 60 / this.engineConfig.fps - 1 >> 0;
	        if (this._flush < 0) {
	            this._flush = 0;
	        }
	        this.tickId = requestAnimationFrame(this.flush);
	    };
	    QunityEngine.prototype.stopTick = function () {
	        cancelAnimationFrame(this.tickId);
	    };
	    QunityEngine.prototype.nextTick = function (func, tickCount) {
	        if (tickCount === void 0) { tickCount = 1; }
	        this.nextTicks.push({ func: func, tickCount: tickCount });
	    };
	    QunityEngine.prototype.onFrameTick = function (tsNow) {
	        if (this.tsStart < 0) {
	            this.tsStart = tsNow;
	        }
	        this._renderContext.clear();
	        this.lastFPS = Math.floor(1000 / (tsNow - this.tsLast));
	        this.tsLast = tsNow;
	        var ts = Math.floor(tsNow - this.tsStart);
	        qunityCore.traverse(this._root, function (child) {
	            if (!child.isFree && child.enabled) {
	                child.components.onUpdate(ts);
	            }
	            else {
	                return true;
	            }
	        }, -1, true, function (current) {
	            current.components.afterUpdate(ts);
	        });
	        for (var i = 0, li = this.nextTicks.length; i < li; i++) {
	            var item = this.nextTicks[i];
	            item.tickCount--;
	            if (item.tickCount <= 0) {
	                item.func(ts);
	                this.nextTicks.splice(i, 1);
	                i--;
	                li--;
	            }
	        }
	    };
	    QunityEngine.prototype.onTouchBegin = function (event) {
	        qunityCore.traversePostorder(this._root, function (child) {
	            return child.components.onInteract(0, event);
	        });
	    };
	    QunityEngine.prototype.onTouchMove = function (event) {
	        qunityCore.traversePostorder(this._root, function (child) {
	            return child.components.onInteract(1, event);
	        });
	    };
	    QunityEngine.prototype.onTouchEnd = function (event) {
	        qunityCore.traversePostorder(this._root, function (child) {
	            return child.components.onInteract(2, event);
	        });
	    };
	    return QunityEngine;
	}());

	var Vector2D = (function (_super) {
	    __extends(Vector2D, _super);
	    function Vector2D(x, y, onChange) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        var _this = _super.call(this) || this;
	        _this.onChange = onChange;
	        _this.setXY(x, y);
	        return _this;
	    }
	    Vector2D.prototype.onModify = function (value, key, oldValue) {
	        this.onChange && this.onChange(value, key, oldValue);
	    };
	    Vector2D.prototype.setXY = function (x, y) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        this.x = x;
	        this.y = y;
	        return this;
	    };
	    Vector2D.prototype.copyFrom = function (v2) {
	        this.x = v2.x;
	        this.y = v2.y;
	        return this;
	    };
	    Vector2D.prototype.clone = function () {
	        return new Vector2D(this.x, this.y);
	    };
	    Vector2D.prototype.zero = function () {
	        this.x = 0;
	        this.y = 0;
	        return this;
	    };
	    Object.defineProperty(Vector2D.prototype, "isZero", {
	        get: function () {
	            return this.x == 0 && this.y == 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Vector2D.prototype.normalize = function () {
	        var len = this.length;
	        if (len == 0) {
	            this.x = 1;
	            return this;
	        }
	        this.x /= len;
	        this.y /= len;
	        return this;
	    };
	    Object.defineProperty(Vector2D.prototype, "isNormalized", {
	        get: function () {
	            return this.length == 1.0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Vector2D.prototype.truncate = function (max) {
	        this.length = Math.min(max, this.length);
	        return this;
	    };
	    Vector2D.prototype.reverse = function () {
	        this.x = -this.x;
	        this.y = -this.y;
	        return this;
	    };
	    Vector2D.prototype.dotProd = function (v2) {
	        return this.x * v2.x + this.y * v2.y;
	    };
	    Vector2D.prototype.crossProd = function (v2) {
	        return this.x * v2.y - this.y * v2.x;
	    };
	    Vector2D.prototype.distSQ = function (v2) {
	        var dx = v2.x - this.x;
	        var dy = v2.y - this.y;
	        return dx * dx + dy * dy;
	    };
	    Vector2D.prototype.distance = function (v2) {
	        return Math.sqrt(this.distSQ(v2));
	    };
	    Vector2D.prototype.add = function (v2) {
	        this.x += v2.x;
	        this.y += v2.y;
	        return this;
	    };
	    Vector2D.prototype.subtract = function (v2) {
	        this.x -= v2.x;
	        this.y -= v2.y;
	        return this;
	    };
	    Vector2D.prototype.multiply = function (value) {
	        this.x *= value;
	        this.y *= value;
	        return this;
	    };
	    Vector2D.prototype.divide = function (value) {
	        this.x /= value;
	        this.y /= value;
	        return this;
	    };
	    Object.defineProperty(Vector2D.prototype, "angle", {
	        get: function () {
	            return this.radian * 180 / Math.PI;
	        },
	        set: function (value) {
	            this.radian = value * Math.PI / 180;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Vector2D.prototype, "radian", {
	        get: function () {
	            return Math.atan2(this.y, this.x);
	        },
	        set: function (value) {
	            var len = this.length;
	            this.setXY(Math.cos(value) * len, Math.sin(value) * len);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Vector2D.prototype.equals = function (v2) {
	        return this.x == v2.x && this.y == v2.y;
	    };
	    Object.defineProperty(Vector2D.prototype, "length", {
	        get: function () {
	            return Math.sqrt(this.lengthSQ);
	        },
	        set: function (value) {
	            var a = this.radian;
	            this.setXY(Math.cos(a) * value, Math.sin(a) * value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Vector2D.prototype, "lengthSQ", {
	        get: function () {
	            return this.x * this.x + this.y * this.y;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Vector2D.prototype, "slope", {
	        get: function () {
	            return this.y / this.x;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Vector2D.prototype.toString = function () {
	        return "[Vector2D (x:" + this.x + ", y:" + this.y + ")]";
	    };
	    Vector2D.prototype.toObj = function () {
	        return { x: this.x, y: this.y };
	    };
	    Vector2D.prototype.toArray = function () {
	        return [this.x, this.y];
	    };
	    Vector2D.corner = function (v1, v2) {
	        return Math.acos(v1.dotProd(v2) / (v1.length * v2.length));
	    };
	    __decorate([
	        dirtyFieldTrigger
	    ], Vector2D.prototype, "x", void 0);
	    __decorate([
	        dirtyFieldTrigger
	    ], Vector2D.prototype, "y", void 0);
	    return Vector2D;
	}(qunityCore.HashObject));

	var PI = Math.PI;
	var TwoPI = PI * 2;
	var DEG_TO_RAD = PI / 180;
	var Matrix = (function () {
	    function Matrix(a, b, c, d, tx, ty) {
	        if (a === void 0) { a = 1; }
	        if (b === void 0) { b = 0; }
	        if (c === void 0) { c = 0; }
	        if (d === void 0) { d = 1; }
	        if (tx === void 0) { tx = 0; }
	        if (ty === void 0) { ty = 0; }
	        this.a = a;
	        this.b = b;
	        this.c = c;
	        this.d = d;
	        this.tx = tx;
	        this.ty = ty;
	    }
	    Matrix.prototype.clone = function () {
	        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
	    };
	    Matrix.prototype.concat = function (other) {
	        var a = this.a * other.a;
	        var b = 0.0;
	        var c = 0.0;
	        var d = this.d * other.d;
	        var tx = this.tx * other.a + other.tx;
	        var ty = this.ty * other.d + other.ty;
	        if (this.b !== 0.0 || this.c !== 0.0 || other.b !== 0.0 || other.c !== 0.0) {
	            a += this.b * other.c;
	            d += this.c * other.b;
	            b += this.a * other.b + this.b * other.d;
	            c += this.c * other.a + this.d * other.c;
	            tx += this.ty * other.c;
	            ty += this.tx * other.b;
	        }
	        this.a = a;
	        this.b = b;
	        this.c = c;
	        this.d = d;
	        this.tx = tx;
	        this.ty = ty;
	    };
	    Matrix.prototype.copyFrom = function (other) {
	        this.a = other.a;
	        this.b = other.b;
	        this.c = other.c;
	        this.d = other.d;
	        this.tx = other.tx;
	        this.ty = other.ty;
	        return this;
	    };
	    Matrix.prototype.identity = function () {
	        this.a = this.d = 1;
	        this.b = this.c = this.tx = this.ty = 0;
	    };
	    Matrix.prototype.invert = function () {
	        this.$invertInto(this);
	    };
	    Matrix.prototype.$invertInto = function (target) {
	        var a = this.a;
	        var b = this.b;
	        var c = this.c;
	        var d = this.d;
	        var tx = this.tx;
	        var ty = this.ty;
	        if (b == 0 && c == 0) {
	            target.b = target.c = 0;
	            if (a == 0 || d == 0) {
	                target.a = target.d = target.tx = target.ty = 0;
	            }
	            else {
	                a = target.a = 1 / a;
	                d = target.d = 1 / d;
	                target.tx = -a * tx;
	                target.ty = -d * ty;
	            }
	            return;
	        }
	        var determinant = a * d - b * c;
	        if (determinant == 0) {
	            target.identity();
	            return;
	        }
	        determinant = 1 / determinant;
	        var k = target.a = d * determinant;
	        b = target.b = -b * determinant;
	        c = target.c = -c * determinant;
	        d = target.d = a * determinant;
	        target.tx = -(k * tx + c * ty);
	        target.ty = -(b * tx + d * ty);
	    };
	    Matrix.prototype.rotate = function (radian) {
	        radian = +radian;
	        if (radian !== 0) {
	            var u = Math.cos(radian);
	            var v = Math.sin(radian);
	            var _a = this, a = _a.a, b = _a.b, c = _a.c, d = _a.d, tx = _a.tx, ty = _a.ty;
	            this.a = a * u - b * v;
	            this.b = a * v + b * u;
	            this.c = c * u - d * v;
	            this.d = c * v + d * u;
	            this.tx = tx * u - ty * v;
	            this.ty = tx * v + ty * u;
	        }
	    };
	    Object.defineProperty(Matrix.prototype, "rotation", {
	        get: function () {
	            return Math.atan2(this.b, this.a);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Matrix.prototype.scale = function (sx, sy) {
	        if (sx !== 1) {
	            this.a *= sx;
	            this.c *= sx;
	            this.tx *= sx;
	        }
	        if (sy !== 1) {
	            this.b *= sy;
	            this.d *= sy;
	            this.ty *= sy;
	        }
	    };
	    Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
	        this.a = a;
	        this.b = b;
	        this.c = c;
	        this.d = d;
	        this.tx = tx;
	        this.ty = ty;
	        return this;
	    };
	    Matrix.prototype.transformPoint = function (pointX, pointY, resultPoint) {
	        var _a = this, a = _a.a, b = _a.b, c = _a.c, d = _a.d, tx = _a.tx, ty = _a.ty;
	        var x = a * pointX + c * pointY + tx;
	        var y = b * pointX + d * pointY + ty;
	        if (resultPoint) {
	            resultPoint.x = x;
	            resultPoint.y = y;
	            return resultPoint;
	        }
	        return { x: x, y: y };
	    };
	    Matrix.prototype.deltaTransformPoint = function (pointX, pointY, resultPoint) {
	        var _a = this, a = _a.a, b = _a.b, c = _a.c, d = _a.d;
	        var x = a * pointX + c * pointY;
	        var y = b * pointX + d * pointY;
	        if (resultPoint) {
	            resultPoint.x = x;
	            resultPoint.y = y;
	            return resultPoint;
	        }
	        return { x: x, y: y };
	    };
	    Matrix.prototype.translate = function (dx, dy) {
	        this.tx += dx;
	        this.ty += dy;
	    };
	    Matrix.prototype.equals = function (other) {
	        return this.a == other.a && this.b == other.b &&
	            this.c == other.c && this.d == other.d &&
	            this.tx == other.tx && this.ty == other.ty;
	    };
	    Matrix.prototype.prepend = function (a, b, c, d, tx, ty) {
	        var tx1 = this.tx;
	        if (a != 1 || b != 0 || c != 0 || d != 1) {
	            var a1 = this.a;
	            var c1 = this.c;
	            this.a = a1 * a + this.b * c;
	            this.b = a1 * b + this.b * d;
	            this.c = c1 * a + this.d * c;
	            this.d = c1 * b + this.d * d;
	        }
	        this.tx = tx1 * a + this.ty * c + tx;
	        this.ty = tx1 * b + this.ty * d + ty;
	        return this;
	    };
	    Matrix.prototype.append = function (a, b, c, d, tx, ty) {
	        var a1 = this.a;
	        var b1 = this.b;
	        var c1 = this.c;
	        var d1 = this.d;
	        if (a != 1 || b != 0 || c != 0 || d != 1) {
	            this.a = a * a1 + b * c1;
	            this.b = a * b1 + b * d1;
	            this.c = c * a1 + d * c1;
	            this.d = c * b1 + d * d1;
	        }
	        this.tx = tx * a1 + ty * c1 + this.tx;
	        this.ty = tx * b1 + ty * d1 + this.ty;
	        return this;
	    };
	    Matrix.prototype.toString = function () {
	        return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
	    };
	    Matrix.prototype.createBox = function (scaleX, scaleY, rotation, tx, ty) {
	        if (rotation === void 0) { rotation = 0; }
	        if (tx === void 0) { tx = 0; }
	        if (ty === void 0) { ty = 0; }
	        var self = this;
	        if (rotation !== 0) {
	            rotation = rotation / DEG_TO_RAD;
	            var u = Math.cos(rotation);
	            var v = Math.sin(rotation);
	            self.a = u * scaleX;
	            self.b = v * scaleY;
	            self.c = -v * scaleX;
	            self.d = u * scaleY;
	        }
	        else {
	            self.a = scaleX;
	            self.b = 0;
	            self.c = 0;
	            self.d = scaleY;
	        }
	        self.tx = tx;
	        self.ty = ty;
	    };
	    Matrix.prototype.createGradientBox = function (width, height, rotation, tx, ty) {
	        if (rotation === void 0) { rotation = 0; }
	        if (tx === void 0) { tx = 0; }
	        if (ty === void 0) { ty = 0; }
	        this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
	    };
	    Matrix.prototype.$transformBounds = function (bounds) {
	        var a = this.a;
	        var b = this.b;
	        var c = this.c;
	        var d = this.d;
	        var tx = this.tx;
	        var ty = this.ty;
	        var x = bounds.x;
	        var y = bounds.y;
	        var xMax = x + bounds.width;
	        var yMax = y + bounds.height;
	        var x0 = a * x + c * y + tx;
	        var y0 = b * x + d * y + ty;
	        var x1 = a * xMax + c * y + tx;
	        var y1 = b * xMax + d * y + ty;
	        var x2 = a * xMax + c * yMax + tx;
	        var y2 = b * xMax + d * yMax + ty;
	        var x3 = a * x + c * yMax + tx;
	        var y3 = b * x + d * yMax + ty;
	        var tmp = 0;
	        if (x0 > x1) {
	            tmp = x0;
	            x0 = x1;
	            x1 = tmp;
	        }
	        if (x2 > x3) {
	            tmp = x2;
	            x2 = x3;
	            x3 = tmp;
	        }
	        bounds.x = Math.floor(x0 < x2 ? x0 : x2);
	        bounds.width = Math.ceil((x1 > x3 ? x1 : x3) - bounds.x);
	        if (y0 > y1) {
	            tmp = y0;
	            y0 = y1;
	            y1 = tmp;
	        }
	        if (y2 > y3) {
	            tmp = y2;
	            y2 = y3;
	            y3 = tmp;
	        }
	        bounds.y = Math.floor(y0 < y2 ? y0 : y2);
	        bounds.height = Math.ceil((y1 > y3 ? y1 : y3) - bounds.y);
	    };
	    Matrix.prototype.getDeterminant = function () {
	        return this.a * this.d - this.b * this.c;
	    };
	    Matrix.prototype.$getScaleX = function () {
	        var m = this;
	        if (m.b == 0) {
	            return m.a;
	        }
	        var result = Math.sqrt(m.a * m.a + m.b * m.b);
	        return this.getDeterminant() < 0 ? -result : result;
	    };
	    Matrix.prototype.$getScaleY = function () {
	        var m = this;
	        if (m.c == 0) {
	            return m.d;
	        }
	        var result = Math.sqrt(m.c * m.c + m.d * m.d);
	        return this.getDeterminant() < 0 ? -result : result;
	    };
	    Matrix.prototype.$getSkewX = function () {
	        if (this.d < 0) {
	            return Math.atan2(this.d, this.c) + (PI / 2);
	        }
	        else {
	            return Math.atan2(this.d, this.c) - (PI / 2);
	        }
	    };
	    Matrix.prototype.$getSkewY = function () {
	        if (this.a < 0) {
	            return Math.atan2(this.b, this.a) - PI;
	        }
	        else {
	            return Math.atan2(this.b, this.a);
	        }
	    };
	    Matrix.prototype.$updateScaleAndRotation = function (scaleX, scaleY, skewX, skewY) {
	        if ((skewX == 0 || skewX == TwoPI) && (skewY == 0 || skewY == TwoPI)) {
	            this.a = scaleX;
	            this.b = this.c = 0;
	            this.d = scaleY;
	            return;
	        }
	        skewX = skewX / DEG_TO_RAD;
	        skewY = skewY / DEG_TO_RAD;
	        var u = Math.cos(skewX);
	        var v = Math.sin(skewX);
	        if (skewX == skewY) {
	            this.a = u * scaleX;
	            this.b = v * scaleX;
	        }
	        else {
	            this.a = Math.cos(skewY) * scaleX;
	            this.b = Math.sin(skewY) * scaleX;
	        }
	        this.c = -v * scaleY;
	        this.d = u * scaleY;
	    };
	    Matrix.prototype.$preMultiplyInto = function (other, target) {
	        var a = other.a * this.a;
	        var b = 0.0;
	        var c = 0.0;
	        var d = other.d * this.d;
	        var tx = other.tx * this.a + this.tx;
	        var ty = other.ty * this.d + this.ty;
	        if (other.b !== 0.0 || other.c !== 0.0 || this.b !== 0.0 || this.c !== 0.0) {
	            a += other.b * this.c;
	            d += other.c * this.b;
	            b += other.a * this.b + other.b * this.d;
	            c += other.c * this.a + other.d * this.c;
	            tx += other.ty * this.c;
	            ty += other.tx * this.b;
	        }
	        target.a = a;
	        target.b = b;
	        target.c = c;
	        target.d = d;
	        target.tx = tx;
	        target.ty = ty;
	    };
	    Matrix.prototype.toArray = function () {
	        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
	    };
	    return Matrix;
	}());

	var engine = new QunityEngine();
	engine.setup({});

	var MATRIX_ORDER;
	(function (MATRIX_ORDER) {
	    MATRIX_ORDER[MATRIX_ORDER["SCALE_ROTATE"] = 0] = "SCALE_ROTATE";
	    MATRIX_ORDER[MATRIX_ORDER["ROTATE_SCALE"] = 1] = "ROTATE_SCALE";
	})(MATRIX_ORDER || (MATRIX_ORDER = {}));
	var Transform = (function (_super) {
	    __extends(Transform, _super);
	    function Transform() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.localPos = {};
	        _this.position = new Vector2D(0, 0);
	        _this._globalPosition = new Vector2D(0, 0);
	        _this.alpha = 1;
	        _this.affectChildren = true;
	        _this.scale = new Vector2D(1, 1);
	        _this.pivot = new Vector2D(0.5, 0.5);
	        _this.rotation = 0;
	        _this.order = MATRIX_ORDER.SCALE_ROTATE;
	        _this._localMatrix = new Matrix();
	        _this._globalMatrix = new Matrix();
	        _this._globalInvertMatrix = new Matrix();
	        _this._globalPivotMatrix = new Matrix();
	        return _this;
	    }
	    Object.defineProperty(Transform.prototype, "renderAlpha", {
	        get: function () {
	            return this._renderAlpha;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Transform.prototype, "globalPosition", {
	        get: function () {
	            this._globalPosition.setXY(this._globalMatrix.tx, this._globalMatrix.ty);
	            return this._globalPosition;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Transform.prototype, "globalRotation", {
	        get: function () {
	            return this._globalMatrix.rotation * 180 / Math.PI;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Transform.prototype.globalPositionToLocal = function (position) {
	        var matrix = this.getMatrix(true, true, true, true);
	        matrix.transformPoint(position ? position.x : 0, position ? position.y : 0, this.localPos);
	        return this.localPos;
	    };
	    Transform.prototype.updateLocalMatrix = function () {
	        var _a = this, _b = _a.position, x = _b.x, y = _b.y, _c = _a.scale, sx = _c.x, sy = _c.y, rotation = _a.rotation;
	        var matrix = this._localMatrix;
	        matrix.identity();
	        if (this.order === MATRIX_ORDER.SCALE_ROTATE) {
	            matrix.scale(sx, sy);
	            matrix.rotate(rotation * Math.PI / 180);
	        }
	        else {
	            matrix.rotate(rotation * Math.PI / 180);
	            matrix.scale(sx, sy);
	        }
	        matrix.translate(x, y);
	    };
	    Transform.prototype.updateGlobalMatrix = function () {
	        var _a = this, entity = _a.entity, _globalMatrix = _a._globalMatrix, _localMatrix = _a._localMatrix, _globalPivotMatrix = _a._globalPivotMatrix, _b = _a.pivot, px = _b.x, py = _b.y, width = _a.width, height = _a.height;
	        _globalMatrix.copyFrom(_localMatrix);
	        if (entity.parent) {
	            var parentTransform = entity.parent.components.getOne(Transform);
	            if (parentTransform) {
	                this._renderAlpha = parentTransform._renderAlpha * this.alpha;
	                _globalMatrix.concat(parentTransform.getMatrix(true, false));
	            }
	            else {
	                this._renderAlpha = this.alpha;
	            }
	        }
	        else {
	            this._renderAlpha = this.alpha;
	        }
	        if (this.entity.name === 'Miner') {
	            console.log();
	        }
	        _globalPivotMatrix.copyFrom(_globalMatrix);
	        var a = _globalMatrix.a, d = _globalMatrix.d;
	        _globalPivotMatrix.translate(-(px - 0.5) * width * a, -(py - 0.5) * height * d);
	    };
	    Transform.prototype.getMatrix = function (withPivot, invert, affectChildren, invertOnlyTranslate) {
	        if (withPivot === void 0) { withPivot = false; }
	        if (invert === void 0) { invert = false; }
	        if (affectChildren === void 0) { affectChildren = false; }
	        if (invertOnlyTranslate === void 0) { invertOnlyTranslate = false; }
	        var matrix;
	        if (this.affectChildren || affectChildren) {
	            matrix = withPivot ? this._globalPivotMatrix : this._globalMatrix;
	            if (invert) {
	                var invertMatrix = this._globalInvertMatrix;
	                invertMatrix.copyFrom(matrix);
	                if (invertOnlyTranslate) {
	                    invertMatrix.a = 1;
	                    invertMatrix.d = 1;
	                }
	                invertMatrix.invert();
	                return invertMatrix;
	            }
	        }
	        else {
	            matrix = this.entity.parent.components.getOne(Transform).getMatrix(withPivot, invert);
	        }
	        return matrix;
	    };
	    Transform.prototype.onUpdate = function (t) {
	        if (this.dirty) {
	            this.updateLocalMatrix();
	            this.dirty = false;
	        }
	        this.updateGlobalMatrix();
	        _super.prototype.onUpdate.call(this, t);
	    };
	    Transform.prototype.onEditorUpdate = function (t) {
	        this.onUpdate(t);
	    };
	    __decorate([
	        dirtyFieldTrigger
	    ], Transform.prototype, "position", void 0);
	    __decorate([
	        dirtyFieldDetector
	    ], Transform.prototype, "alpha", void 0);
	    __decorate([
	        dirtyFieldDetector
	    ], Transform.prototype, "affectChildren", void 0);
	    __decorate([
	        deepDirtyFieldDetector
	    ], Transform.prototype, "scale", void 0);
	    __decorate([
	        deepDirtyFieldDetector
	    ], Transform.prototype, "pivot", void 0);
	    __decorate([
	        dirtyFieldDetector
	    ], Transform.prototype, "rotation", void 0);
	    return Transform;
	}(qunityCore.Component));

	var RectRenderer = (function (_super) {
	    __extends(RectRenderer, _super);
	    function RectRenderer() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    RectRenderer.prototype.onCreate = function () {
	        this._ctx = engine.renderContext.context;
	    };
	    RectRenderer.prototype.onUpdate = function (t) {
	        var transform = this.entity.components.getOne(Transform);
	        var ctx = this._ctx;
	        if (transform) {
	            ctx.setTransform.apply(ctx, transform.getMatrix().toArray());
	        }
	        else {
	            ctx.setTransform(1, 0, 0, 1, 0, 0);
	        }
	        ctx.fillStyle = 'yellow';
	        ctx.fillRect(-50, -50, 100, 100);
	    };
	    return RectRenderer;
	}(qunityCore.Component));

	var Rotate = (function (_super) {
	    __extends(Rotate, _super);
	    function Rotate() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.autoPlay = true;
	        return _this;
	    }
	    Rotate.prototype.onAwake = function () {
	        if (this.autoPlay) {
	            this.play();
	        }
	    };
	    Rotate.prototype.onUpdate = function (t) {
	        var transform = this.entity.components.getOne(Transform);
	        if (this._playing) {
	            if (this._timeStart < 0) {
	                this._timeStart = t;
	            }
	            var dealtTime = t - this._timeStart;
	            transform.rotation = dealtTime * 0.1;
	        }
	    };
	    Rotate.prototype.play = function () {
	        this._playing = true;
	        this._timeStart = -1;
	    };
	    Rotate.prototype.stop = function () {
	        this._playing = false;
	    };
	    return Rotate;
	}(qunityCore.Component));

	var root = engine.root;
	var transform = new Transform();
	transform.position.setXY(100, 100);
	root.components.add(transform);
	var rectRenderer = new RectRenderer();
	root.components.add(rectRenderer);
	var rotate = new Rotate();
	setTimeout(function () {
	    root.components.add(rotate);
	}, 1000);
	engine.start();

}));
//# sourceMappingURL=ComponentTest.js.map

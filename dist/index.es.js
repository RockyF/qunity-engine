/**
 * Created by rockyl on 2018/11/7.
 *
 * 交互上下文
 */
var ua = navigator.userAgent.toLowerCase();
var isMobile = (ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1);
/**
 * 交互上下文
 */
var InteractContext = /** @class */ (function () {
    function InteractContext(engine) {
        this.engine = engine;
    }
    /**
     * 装配上下文
     * @param options
     */
    InteractContext.prototype.setup = function (options) {
        if (options === void 0) { options = {}; }
        var canvas = options.canvas, touchHandlers = options.touchHandlers, touchEnabled = options.touchEnabled;
        this.touchHandlers = touchHandlers;
        this.canvas = canvas;
        if (touchEnabled) {
            this.addListeners();
        }
    };
    /**
     * 更新缩放模式
     * @param scaleX
     * @param scaleY
     * @param rotation
     */
    InteractContext.prototype.updateScale = function (scaleX, scaleY, rotation) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.rotation = rotation;
    };
    /**
     * 适配鼠标事件
     */
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
    /**
     * 阻断页面拖动
     * @param event
     */
    InteractContext.prototype.prevent = function (event) {
        event.stopPropagation();
        if (event["isScroll"] != true && !this.canvas['userTyping']) {
            event.preventDefault();
        }
    };
    /**
     * 增加鼠标事件
     */
    InteractContext.prototype.addMouseListener = function () {
        this.canvas.addEventListener("mousedown", this.onTouchBegin.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.canvas.addEventListener("mouseup", this.onTouchEnd.bind(this));
    };
    /**
     * 增加触摸事件
     */
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
        //return this.engine.pagePosToCanvasPos(event.pageX, event.pageY, event.identifier)
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

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/**
 * Created by rockyl on 2018/11/9.
 *
 * 装饰器
 */
/**
 * 属性修改时触发
 * @param onModify
 */
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
/**
 * 属性变脏时设置宿主的dirty属性为true
 */
var dirtyFieldDetector = fieldChanged(function (value, key, oldValue) {
    this['dirty'] = true;
});
/**
 * 深度属性变脏时设置宿主的dirty属性为true
 */
var deepDirtyFieldDetector = fieldChanged(function (value, key, oldValue) {
    var scope = this;
    scope['dirty'] = true;
    if (typeof value === 'object') {
        value['onModify'] = function () {
            scope['dirty'] = true;
        };
    }
});
/**
 * 属性变脏时触发onModify方法
 */
var dirtyFieldTrigger = fieldChanged(function (value, key, oldValue) {
    this['onModify'] && this['onModify'](value, key, oldValue);
});
/**
 * 深入属性变脏时触发onModify方法
 */
var deepDirtyFieldTrigger = fieldChanged(function (value, key, oldValue) {
    if (this['onModify']) {
        this['onModify'](value, key, oldValue);
        if (typeof value === 'object') {
            value['onModify'] = this['onModify'];
        }
    }
});

/**
 * Created by rockyl on 2018/11/5.
 *
 * 渲染上下文
 */
/**
 * 缩放模式
 *
 * SHOW_ALL: 全可见
 * FIXED_WIDTH: 宽度固定
 * FIXED_HEIGHT: 高度固定
 */
var ScaleMode;
(function (ScaleMode) {
    ScaleMode["SHOW_ALL"] = "showAll";
    ScaleMode["FIXED_WIDTH"] = "fixedWidth";
    ScaleMode["FIXED_HEIGHT"] = "fixedHeight";
    ScaleMode["NO_SCALE"] = "noScale";
    ScaleMode["NO_FIXED"] = "noFixed";
})(ScaleMode || (ScaleMode = {}));
/**
 * 渲染上下文
 */
var RenderContext = /** @class */ (function () {
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
    /**
     * 装配上下文
     * @param options
     */
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
        /**
         * 缩放x
         */
        get: function () {
            return this._scaleX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderContext.prototype, "scaleY", {
        /**
         * 缩放y
         */
        get: function () {
            return this._scaleY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderContext.prototype, "rotation", {
        /**
         * 旋转
         */
        get: function () {
            return this._rotation;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 清空渲染上下文
     */
    RenderContext.prototype.clear = function () {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Object.defineProperty(RenderContext.prototype, "context", {
        /**
         * 获取渲染上下文
         */
        get: function () {
            return this.canvasContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderContext.prototype, "stageSize", {
        /**
         * 获取舞台尺寸
         */
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
        /**
         * 获取舞台缩放
         */
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
        /**
         * 获取舞台中心
         */
        get: function () {
            return {
                x: this.stageWidth / 2,
                y: this.stageHeight / 2,
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 更新缩放模式
     */
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
        //scale
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
        //size
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
        //styleSize
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

/**
 * Created by Administrator on 2017/7/12.
 */
var lastTime = 0;
var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // name has changed in Webkit
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

/**
 * Created by rockyl on 2018/11/5.
 */
var HASH_CODE_INK = 0;
function getHashCode() {
    return ++HASH_CODE_INK;
}
/**
 * 哈希对象
 */
var HashObject = /** @class */ (function () {
    function HashObject() {
        this._hashCode = getHashCode();
    }
    Object.defineProperty(HashObject.prototype, "hashCode", {
        get: function () {
            return this._hashCode;
        },
        enumerable: true,
        configurable: true
    });
    return HashObject;
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

/**
 * Created by rockyl on 2019-07-29.
 */
/**
 * 组件管理类
 */
var ComponentManager = /** @class */ (function () {
    function ComponentManager(entity) {
        this._components = [];
        this._entity = entity;
        this.eachComponent(function (component) {
            component.$setup(entity);
        });
    }
    /**
     * 遍历组件
     * @param callback
     */
    ComponentManager.prototype.eachComponent = function (callback) {
        this._components.some(callback);
    };
    /**
     * 当被创建时
     */
    ComponentManager.prototype.onSetup = function () {
        this.eachComponent(function (component) {
            component.onSetup();
        });
    };
    /**
     * 当生效时
     */
    ComponentManager.prototype.onAwake = function () {
        this.eachComponent(function (component) {
            component.onAwake();
        });
    };
    /**
     * 当失效时
     */
    ComponentManager.prototype.onSleep = function () {
        this.eachComponent(function (component) {
            component.onSleep();
        });
    };
    /**
     * 时钟更新
     * @param t
     */
    ComponentManager.prototype.onUpdate = function (t) {
        this.eachComponent(function (component) {
            component.$onUpdate(t);
        });
    };
    /**
     * 时钟更新回溯
     * @param t
     */
    ComponentManager.prototype.afterUpdate = function (t) {
        this.eachComponent(function (component) {
            component.$afterUpdate(t);
        });
    };
    /**
     * 当交互时
     * @param type
     * @param event
     */
    ComponentManager.prototype.onInteract = function (type, event) {
        if (this._entity.isActive) {
            var interrupt_1 = false;
            this.eachComponent(function (comp) {
                if (comp.enabled && comp.interactive) {
                    var r = comp.onInteract(type, event);
                    if (r) {
                        interrupt_1 = true;
                    }
                    return false;
                }
            });
            return interrupt_1;
        }
        else {
            return false;
        }
    };
    /**
     * 当被销毁时
     */
    ComponentManager.prototype.onDestroy = function () {
    };
    /**
     * 增加组件
     * @param component
     * @param index
     */
    ComponentManager.prototype.add = function (component, index) {
        if (component.entity && component.entity !== this._entity) {
            console.warn('component.entity was not empty');
            return;
        }
        if (index == undefined || index < 0 || index >= this._components.length) {
            index = this._components.length;
        }
        if (component.entity == this._entity) {
            index--;
        }
        var currentIndex = this._components.indexOf(component);
        if (currentIndex == index) {
            return;
        }
        if (currentIndex >= 0) {
            this._components.splice(currentIndex, 1);
        }
        this._components.splice(index, 0, component);
        if (currentIndex < 0) {
            this.onAddComponent(component);
        }
    };
    /**
     * 移除组件
     * @param component
     */
    ComponentManager.prototype.remove = function (component) {
        this.onRemoveComponent(component);
        var index = this._components.indexOf(component);
        if (index >= 0) {
            this._components.splice(index, 1);
        }
    };
    /**
     * 移除所有组件
     */
    ComponentManager.prototype.removeAll = function () {
        while (this._components.length > 0) {
            this.remove(this._components[0]);
        }
    };
    /**
     * 根据组件名称获取指定类的组件列表
     * @param name
     */
    ComponentManager.prototype.findByName = function (name) {
        var components = this._componentsNameMapping[name];
        if (!components) {
            components = this._componentsNameMapping[name] = this._components.filter(function (component) {
                return component.constructor['__class__'] === name;
            });
        }
        return components;
    };
    /**
     * 获取指定类的组件列表
     * @param clazz
     */
    ComponentManager.prototype.find = function (clazz) {
        var components = this._componentsDefMapping[clazz.name];
        if (!components) {
            components = this._componentsDefMapping[clazz.name] = this._components.filter(function (component) {
                return component instanceof clazz;
            });
        }
        return components;
    };
    /**
     * 获取指定类的组件
     * @param name
     */
    ComponentManager.prototype.getByName = function (name) {
        return this.findByName(name)[0];
    };
    /**
     * 获取指定类的组件
     * @param clazz
     */
    ComponentManager.prototype.getOne = function (clazz) {
        return this.find(clazz)[0];
    };
    Object.defineProperty(ComponentManager.prototype, "all", {
        /**
         * 获取所有组件
         */
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 当添加组件时
     * @param component
     */
    ComponentManager.prototype.onAddComponent = function (component) {
        this._componentsNameMapping = {};
        this._componentsDefMapping = {};
        component.$setup(this._entity);
        this.onAwake();
    };
    /**
     * 当移除组件时
     * @param component
     */
    ComponentManager.prototype.onRemoveComponent = function (component) {
        this._componentsNameMapping = {};
        this._componentsDefMapping = {};
        component.$unsetup();
        this.onSleep();
    };
    return ComponentManager;
}());

/**
 * Created by rockyl on 2019-07-28.
 */
/**
 * 实体类
 */
var Entity = /** @class */ (function (_super) {
    __extends(Entity, _super);
    /**
     * 实例化实体
     * @param name
     */
    function Entity(name) {
        var _this = _super.call(this) || this;
        _this._children = [];
        _this._enabled = false;
        _this._isFree = true;
        if (name) {
            _this.name = name;
        }
        _this._components = new ComponentManager(_this);
        return _this;
    }
    Object.defineProperty(Entity.prototype, "children", {
        /**
         * 所有子实体
         */
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "parent", {
        /**
         * 父实体
         */
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "isFree", {
        /**
         * 是否游离态
         */
        get: function () {
            return this._isFree;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "isActive", {
        get: function () {
            return !this._isFree && this._enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "components", {
        /**
         * 获取组件管理实例
         */
        get: function () {
            return this._components;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "enabled", {
        /**
         * 是否有效
         */
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            if (this._enabled != value) {
                this._enabled = value;
                if (!this._isFree) {
                    if (this._enabled) {
                        this.validate();
                    }
                    else {
                        this.invalidate(true);
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 增加子实体
     * @param child
     * @param index
     */
    Entity.prototype.addChild = function (child, index) {
        if (index == undefined || index < 0 || index >= this._children.length) {
            index = this._children.length;
        }
        if (child._parent == this) {
            index--;
        }
        this.doAddChild(child, index);
    };
    /**
     * 移除子实体
     * @param child
     */
    Entity.prototype.removeChild = function (child) {
        if (this.containsChild(child)) {
            child._parent = null;
            var index = this.getChildIndex(child);
            this._children.splice(index, 1);
            if (!this._isFree) {
                child._free();
                if (this._enabled) {
                    child.invalidate();
                }
            }
            this.onRemoveChild(child);
        }
    };
    /**
     * 通过索引移除实体
     * @param index
     */
    Entity.prototype.removeChildAt = function (index) {
        var child = this.getChildAt(index);
        if (child) {
            this.removeChild(child);
        }
    };
    /**
     * 获取实体
     * @param index
     */
    Entity.prototype.getChildAt = function (index) {
        return this._children[index];
    };
    /**
     * 获取子实体的索引
     * @param child
     */
    Entity.prototype.getChildIndex = function (child) {
        return this._children.indexOf(child);
    };
    /**
     * 是否包含子实体
     * @param child
     */
    Entity.prototype.containsChild = function (child) {
        return child.parent == this;
    };
    /**
     * 遍历子实体
     * @param callback
     */
    Entity.prototype.eachChild = function (callback) {
        this._children.some(callback);
    };
    Entity.prototype.doAddChild = function (child, index) {
        if (child == this) {
            return;
        }
        var parent = child.parent;
        if (parent) {
            if (parent == this) {
                var currentIndex = this.getChildIndex(child);
                if (currentIndex != index) {
                    this._children.splice(currentIndex, 1);
                    this._children.splice(index, 0, child);
                }
            }
            else {
                parent.removeChild(child);
            }
        }
        if (!child.parent) {
            child._parent = this;
            this._children.splice(index, 0, child);
            if (!this._isFree) {
                child._restrict();
                if (this._enabled) {
                    child.validate();
                }
            }
            this.onAddChild(child);
        }
    };
    /**
     * 使生效
     */
    Entity.prototype.validate = function (force) {
        if (force === void 0) { force = false; }
        if (force || this._enabled) {
            this.onEnable();
            this.eachChild(function (child) {
                child.validate();
            });
        }
    };
    /**
     * 使失效
     */
    Entity.prototype.invalidate = function (force) {
        if (force === void 0) { force = false; }
        if (force || this._enabled) {
            this.onDisable();
            this.eachChild(function (child) {
                child.invalidate();
            });
        }
    };
    /**
     * 使约束
     * @private
     */
    Entity.prototype._restrict = function () {
        this._isFree = false;
        this.eachChild(function (child) {
            child._restrict();
        });
    };
    /**
     * 使游离
     * @param includeSelf
     */
    Entity.prototype._free = function (includeSelf) {
        this._isFree = true;
        this.eachChild(function (child) {
            child._free();
        });
    };
    /**
     * 当实体生效时
     */
    Entity.prototype.onEnable = function () {
        this._components.onAwake();
    };
    /**
     * 当实体失效时
     */
    Entity.prototype.onDisable = function () {
        this._components.onSleep();
    };
    /**
     * 当添加子实体时
     * @param child
     */
    Entity.prototype.onAddChild = function (child) {
    };
    /**
     * 当移除子实体时
     * @param child
     */
    Entity.prototype.onRemoveChild = function (child) {
    };
    return Entity;
}(HashObject));
/**
 * 根实体类
 */
var RootEntity = /** @class */ (function (_super) {
    __extends(RootEntity, _super);
    function RootEntity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isFree = false;
        _this._enabled = true;
        return _this;
    }
    return RootEntity;
}(Entity));

/**
 * Created by rockyl on 2019-07-28.
 */
var interactiveMap = [
    'dealGlobalTouchBegin',
    'dealGlobalTouchMove',
    'dealGlobalTouchEnd',
];
/**
 * 组件类
 */
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        var _this = _super.call(this) || this;
        _this._enabled = true;
        _this.interactive = false;
        _this.onCreate();
        return _this;
    }
    Object.defineProperty(Component.prototype, "entity", {
        get: function () {
            return this._entity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "enabled", {
        /**
         * 是否有效
         */
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            if (this._enabled != value) {
                this._enabled = value;
                if (this._entity && this._entity.isActive) {
                    if (value) {
                        this.onEnable();
                    }
                    else {
                        this.onDisable();
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param entity
     */
    Component.prototype.$setup = function (entity) {
        this._entity = entity;
        this.onSetup();
    };
    /**
     * @private
     */
    Component.prototype.$unsetup = function () {
        this._entity = null;
    };
    /**
     * 当被创建时
     * 类似构造方法
     */
    Component.prototype.onCreate = function () {
    };
    /**
     * 当装配完成时
     *
     * 编辑器模式会在场景构造和属性注入完成后触发
     */
    Component.prototype.onSetup = function () {
    };
    /**
     * 当生效时
     * 仅当实体唤醒状态
     */
    Component.prototype.onEnable = function () {
    };
    /**
     * 当失效时
     * 仅当实体唤醒状态
     */
    Component.prototype.onDisable = function () {
    };
    /**
     * 当实体生效或组件被添加时
     */
    Component.prototype.onAwake = function () {
    };
    /**
     * 当实体失效或组件被移除时
     */
    Component.prototype.onSleep = function () {
    };
    /**
     * @private
     * @param t
     */
    Component.prototype.$onUpdate = function (t) {
        if (this._enabled) {
            this.onUpdate(t);
        }
    };
    /**
     * @private
     * @param t
     */
    Component.prototype.$afterUpdate = function (t) {
        if (this._enabled) {
            this.afterUpdate(t);
        }
    };
    /**
     * 时钟更新
     * @param t
     */
    Component.prototype.onUpdate = function (t) {
    };
    /**
     * 时钟更新回溯
     * @param t
     */
    Component.prototype.afterUpdate = function (t) {
    };
    /**
     * 当被销毁时
     */
    Component.prototype.onDestroy = function () {
    };
    /**
     * 当交互时
     * @param type
     * @param event
     */
    Component.prototype.onInteract = function (type, event) {
        try {
            return this['$' + interactiveMap[type]](event);
        }
        catch (e) {
            console.warn(e);
        }
    };
    /**
     * @private
     * @param e
     */
    Component.prototype.$dealGlobalTouchBegin = function (e) {
        return this.onGlobalTouchBegin(e);
    };
    /**
     * @private
     * @param e
     */
    Component.prototype.$dealGlobalTouchMove = function (e) {
        return this.onGlobalTouchMove(e);
    };
    /**
     * @private
     * @param e
     */
    Component.prototype.$dealGlobalTouchEnd = function (e) {
        return this.onGlobalTouchEnd(e);
    };
    /**
     * 当全局触摸开始
     * @param e
     */
    Component.prototype.onGlobalTouchBegin = function (e) {
        return false;
    };
    /**
     * 当全触摸移动
     * @param e
     */
    Component.prototype.onGlobalTouchMove = function (e) {
        return false;
    };
    /**
     * 当全触摸结束
     * @param e
     */
    Component.prototype.onGlobalTouchEnd = function (e) {
        return false;
    };
    return Component;
}(HashObject));

/**
 * Created by rockyl on 2019-04-22.
 *
 * 实体相关工具
 */
/**
 * 属性注入方法
 * @param target 目标对象
 * @param data 被注入对象
 * @param callback 自定义注入方法
 * @param ignoreMethod 是否忽略方法
 * @param ignoreNull 是否忽略Null字段
 *
 * @return 是否有字段注入
 */
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
/**
 * 实体遍历(先序遍历)
 * @param target 目标实体`
 * @param hitChild 遇到子实体回调
 * @param level 深度，默认全部遍历
 * @param includeSelf 是否包括自身
 * @param fullCallback 子实体遍历完后回调
 * @param params 其他参数
 */
function traverse(target, hitChild, level, includeSelf, fullCallback) {
    if (level === void 0) { level = -1; }
    if (includeSelf === void 0) { includeSelf = false; }
    var params = [];
    for (var _i = 5; _i < arguments.length; _i++) {
        params[_i - 5] = arguments[_i];
    }
    var interrupt;
    if (includeSelf) {
        var ps = [].concat(target, params);
        hitChild.apply(null, ps);
    }
    if (level !== 0) {
        for (var _a = 0, _b = target.children; _a < _b.length; _a++) {
            var child = _b[_a];
            var ps = [].concat(child, params);
            if (hitChild.apply(null, ps)) {
                interrupt = true;
                continue;
            }
            if (child.children.length > 0) {
                ps = [].concat(child, hitChild, level - 1, false, fullCallback, params);
                traverse.apply(null, ps);
            }
        }
    }
    !interrupt && fullCallback && fullCallback(target);
}
/**
 * 实体遍历(后序遍历且倒序)
 * @param target 目标实体
 * @param hitChild 遇到子实体回调
 * @param level 深度，默认全部遍历
 * @param includeSelf 是否包括自身
 * @param fullCallback 子实体遍历完后回调
 * @param params 其他参数
 */
function traversePostorder(target, hitChild, level, includeSelf, fullCallback) {
    if (level === void 0) { level = -1; }
    if (includeSelf === void 0) { includeSelf = false; }
    var params = [];
    for (var _i = 5; _i < arguments.length; _i++) {
        params[_i - 5] = arguments[_i];
    }
    if (level !== 0) {
        for (var i = target.children.length - 1; i >= 0; i--) {
            var child = target.children[i];
            if (!child.enabled) {
                continue;
            }
            if (traversePostorder.apply(void 0, [child, hitChild, level - 1, false, fullCallback].concat(params))) {
                return true;
            }
            if (hitChild.apply(void 0, [child].concat(params))) {
                return true;
            }
        }
    }
    if (includeSelf) {
        hitChild.apply(void 0, [target].concat(params));
    }
    fullCallback && fullCallback(target);
}

/**
 * Created by rockyl on 2018/11/23.
 *
 * 引擎
 */
/**
 * 引擎类
 */
var QunityEngine = /** @class */ (function () {
    function QunityEngine() {
        var _this = this;
        /**
         * 默认配置
         */
        this.engineConfig = {
            canvas: 'gameCanvas',
            fps: 60,
            designWidth: 750,
            designHeight: 1334,
            scaleMode: ScaleMode.FIXED_WIDTH,
            touchEnabled: true,
        };
        /**
         * 自定义配置
         */
        this.customConfig = {};
        this._flush = 0;
        this._currentFlush = 0;
        this.lastFPS = 0;
        this.nextTicks = [];
        this.defMap = {};
        /**
         * 时钟触发
         */
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
    /**
     * 注册组件
     * @param name
     * @param def
     */
    QunityEngine.prototype.registerDef = function (name, def) {
        this.defMap[name] = def;
        def.__class__ = name;
    };
    /**
     * 注册组件
     * @param name
     */
    QunityEngine.prototype.unregisterDef = function (name) {
        delete this.defMap[name];
    };
    /**
     * 根据名称获取定义
     * @param name
     * @param showWarn
     */
    QunityEngine.prototype.getDefByName = function (name, showWarn) {
        if (showWarn === void 0) { showWarn = true; }
        var def;
        /*if (name.indexOf('/') >= 0) {//addition
            name = name.substr(name.lastIndexOf('/') + 1);
        }*/
        def = this.defMap[name];
        if (!def && showWarn) {
            console.warn('missing def:', name);
            return;
        }
        return def;
    };
    /**
     * 装配引擎
     * @param _engineConfig
     * @param _customConfig
     * @param _dataCenterConfig
     */
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
        this._root = new RootEntity();
    };
    /**
     * 开始引擎
     */
    QunityEngine.prototype.start = function () {
        this._root.enabled = true;
        this.tsStart = -1;
        this.startTick();
    };
    /**
     * 暂停引擎
     */
    QunityEngine.prototype.pause = function () {
        this._root.enabled = false;
        this.stopTick();
    };
    Object.defineProperty(QunityEngine.prototype, "root", {
        /**
         * 获取根Entity
         */
        get: function () {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取实体路径
     * @param entity
     */
    QunityEngine.prototype.getEntityPath = function (entity) {
        var path = '';
        var current = entity || this._root;
        while (current.parent) {
            path = current.parent.children.indexOf(current) + (path.length > 0 ? '|' : '') + path;
            current = current.parent;
        }
        return path;
    };
    /**
     * 根据实体路径获取实体
     * @param path
     */
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
    /**
     * 获取当前帧率
     */
    QunityEngine.prototype.getFPS = function () {
        return this.lastFPS;
    };
    Object.defineProperty(QunityEngine.prototype, "renderContext", {
        /**
         * 获取渲染上下文
         */
        get: function () {
            return this._renderContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QunityEngine.prototype, "interactContext", {
        /**
         * 获取交互上下文
         */
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
    /**
     * 开始时钟
     */
    QunityEngine.prototype.startTick = function () {
        this._flush = 60 / this.engineConfig.fps - 1 >> 0;
        if (this._flush < 0) {
            this._flush = 0;
        }
        this.tickId = requestAnimationFrame(this.flush);
    };
    /**
     * 停止时钟
     */
    QunityEngine.prototype.stopTick = function () {
        cancelAnimationFrame(this.tickId);
    };
    /**
     * 下一帧执行
     * @param func
     * @param tickCount
     */
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
        traverse(this._root, function (child) {
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
    /**
     * 代理出来的onTouchBegin方法
     * @param event
     */
    QunityEngine.prototype.onTouchBegin = function (event) {
        traversePostorder(this._root, function (child) {
            return child.components.onInteract(0, event);
        });
    };
    /**
     * 代理出来的onTouchMove方法
     * @param event
     */
    QunityEngine.prototype.onTouchMove = function (event) {
        traversePostorder(this._root, function (child) {
            return child.components.onInteract(1, event);
        });
    };
    /**
     * 代理出来的onTouchEnd方法
     * @param event
     */
    QunityEngine.prototype.onTouchEnd = function (event) {
        traversePostorder(this._root, function (child) {
            return child.components.onInteract(2, event);
        });
    };
    return QunityEngine;
}());

/**
 * Created by rockyl on 2019-04-22.
 *
 * 实体相关工具
 */
/**
 * 属性注入方法
 * @param target 目标对象
 * @param data 被注入对象
 * @param callback 自定义注入方法
 * @param ignoreMethod 是否忽略方法
 * @param ignoreNull 是否忽略Null字段
 *
 * @return 是否有字段注入
 */
function injectProp$1(target, data, callback, ignoreMethod, ignoreNull) {
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

/**
 * Created by rockyl on 2018-12-05.
 *
 * 引擎配置
 */
/**
 * 针对引擎的配置
 */
var EngineConfig = {
    /**
     * 是否是编辑器模式
     */
    editorMode: false,
};
/**
 * 注入配置
 * @param _options
 */
function modifyEngineConfig(_options) {
    injectProp$1(EngineConfig, _options);
}

/**
 * Created by rockyl on 2018/11/6.
 *
 * 矩阵 3x3
 */
var PI = Math.PI;
var TwoPI = PI * 2;
var DEG_TO_RAD = PI / 180;
var matrixPool = [];
/**
 * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
 * 您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix
 * 对象应用于显示对象的 matrix 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
 */
var Matrix = /** @class */ (function () {
    /**
     * 使用指定参数创建一个 Matrix 对象
     * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
     * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
     * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
     * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
     * @param tx 沿 x 轴平移每个点的距离。
     * @param ty 沿 y 轴平移每个点的距离。
     */
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
    /**
     * 释放一个Matrix实例到对象池
     * @param matrix 需要回收的 matrix
     */
    Matrix.release = function (matrix) {
        if (!matrix) {
            return;
        }
        matrixPool.push(matrix);
    };
    /**
     * 从对象池中取出或创建一个新的Matrix对象。
     */
    Matrix.create = function () {
        var matrix = matrixPool.pop();
        if (!matrix) {
            matrix = new Matrix();
        }
        return matrix;
    };
    /**
     * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
     */
    Matrix.prototype.clone = function () {
        var m = Matrix.create();
        m.setTo(this.a, this.b, this.c, this.d, this.tx, this.ty);
        return m;
    };
    /**
     * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。在数学术语中，将两个矩阵连接起来与使用矩阵乘法将它们结合起来是相同的。
     * @param other 要连接到源矩阵的矩阵。
     */
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
    /**
     * 将源 Matrix 对象中的所有矩阵数据复制到调用方 Matrix 对象中。
     * @param other 要拷贝的目标矩阵
     */
    Matrix.prototype.copyFrom = function (other) {
        this.a = other.a;
        this.b = other.b;
        this.c = other.c;
        this.d = other.d;
        this.tx = other.tx;
        this.ty = other.ty;
        return this;
    };
    /**
     * 为每个矩阵属性设置一个值，该值将导致矩阵无转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。
     * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
     */
    Matrix.prototype.identity = function () {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
    };
    /**
     * 执行原始矩阵的逆转换。
     * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
     */
    Matrix.prototype.invert = function () {
        this.$invertInto(this);
    };
    /**
     * @private
     */
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
    /**
     * 对 Matrix 对象应用旋转转换。
     * rotate() 方法将更改 Matrix 对象的 a、b、c 和 d 属性。
     * @param radian 以弧度为单位的旋转角度。
     */
    Matrix.prototype.rotate = function (radian) {
        radian = +radian;
        if (radian !== 0) {
            //angle = angle / DEG_TO_RAD;
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
        /**
         * 获取弧度
         */
        get: function () {
            return Math.atan2(this.b, this.a);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 对矩阵应用缩放转换。x 轴乘以 sx，y 轴乘以 sy。
     * scale() 方法将更改 Matrix 对象的 a 和 d 属性。
     * @param sx 用于沿 x 轴缩放对象的乘数。
     * @param sy 用于沿 y 轴缩放对象的乘数。
     */
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
    /**
     * 将 Matrix 的成员设置为指定值
     * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
     * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
     * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
     * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
     * @param tx 沿 x 轴平移每个点的距离。
     * @param ty 沿 y 轴平移每个点的距离。
     */
    Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    };
    /**
     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
     * @param pointX 想要获得其矩阵转换结果的点的x坐标。
     * @param pointY 想要获得其矩阵转换结果的点的y坐标。
     * @param resultPoint 框架建议尽可能减少创建对象次数来优化性能，可以从外部传入一个复用的Point对象来存储结果，若不传入将创建一个新的Point对象返回。
     * @returns Object 由应用矩阵转换所产生的点。
     */
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
    /**
     * 如果给定预转换坐标空间中的点，则此方法返回发生转换后该点的坐标。
     * 与使用 transformPoint() 方法应用的标准转换不同，deltaTransformPoint() 方法的转换不考虑转换参数 tx 和 ty。
     * @param pointX 想要获得其矩阵转换结果的点的x坐标。
     * @param pointY 想要获得其矩阵转换结果的点的y坐标。
     * @param resultPoint 框架建议尽可能减少创建对象次数来优化性能，可以从外部传入一个复用的Point对象来存储结果，若不传入将创建一个新的Point对象返回。
     */
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
    /**
     * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
     * @param dx 沿 x 轴向右移动的量（以像素为单位）。
     * @param dy 沿 y 轴向下移动的量（以像素为单位）。
     */
    Matrix.prototype.translate = function (dx, dy) {
        this.tx += dx;
        this.ty += dy;
    };
    /**
     * 是否与另一个矩阵数据相等
     * @param other 要比较的另一个矩阵对象。
     * @returns 是否相等，ture表示相等。
     */
    Matrix.prototype.equals = function (other) {
        return this.a == other.a && this.b == other.b &&
            this.c == other.c && this.d == other.d &&
            this.tx == other.tx && this.ty == other.ty;
    };
    /**
     * 前置矩阵
     * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值
     * @param b 缩放或旋转图像时影响像素沿 y 轴定位的值
     * @param c 缩放或旋转图像时影响像素沿 x 轴定位的值
     * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值
     * @param tx 沿 x 轴平移每个点的距离
     * @param ty 沿 y 轴平移每个点的距离
     * @returns 矩阵自身
     */
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
    /**
     * 后置矩阵
     * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值
     * @param b 缩放或旋转图像时影响像素沿 y 轴定位的值
     * @param c 缩放或旋转图像时影响像素沿 x 轴定位的值
     * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值
     * @param tx 沿 x 轴平移每个点的距离
     * @param ty 沿 y 轴平移每个点的距离
     * @returns 矩阵自身
     */
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
    /**
     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
     * @returns 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
     */
    Matrix.prototype.toString = function () {
        return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
    };
    /**
     * 包括用于缩放、旋转和转换的参数。当应用于矩阵时，该方法会基于这些参数设置矩阵的值。
     * @param scaleX 水平缩放所用的系数
     * @param scaleY 垂直缩放所用的系数
     * @param rotation 旋转量（以弧度为单位）
     * @param tx 沿 x 轴向右平移（移动）的像素数
     * @param ty 沿 y 轴向下平移（移动）的像素数
     */
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
    /**
     * 创建 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法所需的矩阵的特定样式。
     * 宽度和高度被缩放为 scaleX/scaleY 对，而 tx/ty 值偏移了宽度和高度的一半。
     * @param width 渐变框的宽度
     * @param height 渐变框的高度
     * @param rotation 旋转量（以弧度为单位）
     * @param tx 沿 x 轴向右平移的距离（以像素为单位）。此值将偏移 width 参数的一半
     * @param ty 沿 y 轴向下平移的距离（以像素为单位）。此值将偏移 height 参数的一半
     */
    Matrix.prototype.createGradientBox = function (width, height, rotation, tx, ty) {
        if (rotation === void 0) { rotation = 0; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
    };
    /**
     * @private
     */
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
    /**
     * @private
     */
    Matrix.prototype.getDeterminant = function () {
        return this.a * this.d - this.b * this.c;
    };
    /**
     * @private
     */
    Matrix.prototype.$getScaleX = function () {
        var m = this;
        if (m.b == 0) {
            return m.a;
        }
        var result = Math.sqrt(m.a * m.a + m.b * m.b);
        return this.getDeterminant() < 0 ? -result : result;
    };
    /**
     * @private
     */
    Matrix.prototype.$getScaleY = function () {
        var m = this;
        if (m.c == 0) {
            return m.d;
        }
        var result = Math.sqrt(m.c * m.c + m.d * m.d);
        return this.getDeterminant() < 0 ? -result : result;
    };
    /**
     * @private
     */
    Matrix.prototype.$getSkewX = function () {
        if (this.d < 0) {
            return Math.atan2(this.d, this.c) + (PI / 2);
        }
        else {
            return Math.atan2(this.d, this.c) - (PI / 2);
        }
    };
    /**
     * @private
     */
    Matrix.prototype.$getSkewY = function () {
        if (this.a < 0) {
            return Math.atan2(this.b, this.a) - PI;
        }
        else {
            return Math.atan2(this.b, this.a);
        }
    };
    /**
     * @private
     */
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
    /**
     * @private
     * target = other * this
     */
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

/**
 * Created by rockyl on 2019-07-30.
 */

export { EngineConfig, Matrix, QunityEngine, deepDirtyFieldDetector, deepDirtyFieldTrigger, dirtyFieldDetector, dirtyFieldTrigger, fieldChanged, injectProp$1 as injectProp, modifyEngineConfig };

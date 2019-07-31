(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

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

    var extendStatics$1 = function(d, b) {
        extendStatics$1 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
        extendStatics$1(d, b);
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
        __extends$1(Entity, _super);
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
        __extends$1(RootEntity, _super);
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
        __extends$1(Component, _super);
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
     * 属性变脏时触发onModify方法
     */
    var dirtyFieldTrigger = fieldChanged(function (value, key, oldValue) {
        this['onModify'] && this['onModify'](value, key, oldValue);
    });

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
            this._root = new RootEntity();
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
            var ts = tsNow - this.tsStart;
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
        QunityEngine.prototype.onTouchBegin = function (event) {
            traversePostorder(this._root, function (child) {
                return child.components.onInteract(0, event);
            });
        };
        QunityEngine.prototype.onTouchMove = function (event) {
            traversePostorder(this._root, function (child) {
                return child.components.onInteract(1, event);
            });
        };
        QunityEngine.prototype.onTouchEnd = function (event) {
            traversePostorder(this._root, function (child) {
                return child.components.onInteract(2, event);
            });
        };
        return QunityEngine;
    }());

    var entity1 = new Entity('entity1');
    var entity2 = new Entity('entity2');
    var entity3 = new Entity('entity3');
    entity1.enabled = true;
    entity2.enabled = true;
    entity3.enabled = true;
    var engine = new QunityEngine();
    engine.setup({});
    var root = engine.root;
    var TestComponent1 = (function (_super) {
        __extends(TestComponent1, _super);
        function TestComponent1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestComponent1.prototype.onUpdate = function (t) {
            console.log(t);
        };
        return TestComponent1;
    }(Component));
    var comp = new TestComponent1();
    root.components.add(comp);
    engine.start();

}));
//# sourceMappingURL=test1.js.map

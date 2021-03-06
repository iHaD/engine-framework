/**
 * @module Fire.Runtime
 */

var JS = Fire.JS;
var Vec2 = Fire.Vec2;
var Rect = Fire.Rect;
var NYI = require('./utils').NYI;

function NYI_Accessor (defVal, attrs, noSetter) {
    var prop = {
        get: function () {
            NYI();
            return defVal;
        }
    };
    if (!noSetter) {
        prop.set = NYI;
    }
    if (attrs) {
        return JS.mixin(prop, attrs);
    }
    else {
        return prop;
    }
}

var INVISIBLE = {
    visible: false
};

var ERR_NaN = 'The %s must not be NaN';

/**
 * 这个类用来封装编辑器针对节点的操作。
 * Note: 接口中包含 "Node" 的使用的都是 Runtime 的原生 Node 类型。
 *
 * You should override:
 * - createEmpty (static)
 * - name
 * - parentNode
 * - childNodes
 * - position
 * - worldPosition
 * - rotation
 * - worldRotation
 * - scale
 * - worldScale
 * - getWorldBounds
 * - getWorldOrientedBounds
 * - createNode
 * - onBeforeSerialize (so that node's properties can be serialized in wrapper)
 *
 * You may want to override:
 * - setSiblingIndex
 * - getSiblingIndex
 * - x
 * - y
 * - worldX
 * - worldY
 * - scaleX
 * - scaleY
 *
 * @class NodeWrapper
 * @constructor
 * @param {RuntimeNode} node
 */
var NodeWrapper = Fire.Class({
    name: 'Fire.Runtime.NodeWrapper',
    constructor: function () {
        /**
         * The target node to wrap.
         * @property target
         * @type {RuntimeNode}
         */
        this.target = arguments[0];

        //if (FIRE_EDITOR && !this.target) {
        //    Fire.warn('target of %s must be non-nil', JS.getClassName(this));
        //}
    },

    properties: {
        ///**
        // * The class ID of attached script.
        // * @property mixinId
        // * @type {string|string[]}
        // * @default ""
        // */
        //mixinId: {
        //    default: "",
        //    visible: false
        //},

        /**
         * The name of the node.
         * @property name
         * @type {string}
         */
        name: {
            get: function () {
                return '';
            },
            set: function (value) {
            }
        },

        // HIERARCHY

        /**
         * The parent of the node.
         * If this is the top most node in hierarchy, the returns value of Fire.node(this.parent) must be type SceneWrapper.
         * Changing the parent will keep the transform's local space position, rotation and scale the same but modify
         * the world space position, scale and rotation.
         * @property parentNode
         * @type {RuntimeNode}
         */
        parentNode: NYI_Accessor(null, INVISIBLE),

        /**
         * Returns the array of children. If no child, this method should return an empty array.
         * The returns array can be modified ONLY in setSiblingIndex.
         * @property childNodes
         * @type {RuntimeNode[]}
         * @readOnly
         */
        childNodes: NYI_Accessor([], INVISIBLE, true),

        // TRANSFORM

        /**
         * The local position in its parent's coordinate system
         * @property position
         * @type {Fire.Vec2}
         */
        position: NYI_Accessor(Vec2.zero),

        /**
         * The local x position in its parent's coordinate system
         * @property x
         * @type {number}
         */
        x: {
            get: function () {
                return this.position.x;
            },
            set: function (value) {
                if ( !isNaN(value) ) {
                    var p = this.position;
                    p.x = value;
                    this.position = p;
                }
                else {
                    Fire.error(ERR_NaN, 'new x');
                }
            },
            visible: false
        },

        /**
         * The local y position in its parent's coordinate system
         * @property y
         * @type {number}
         */
        y: {
            get: function () {
                return this.position.y;
            },
            set: function (value) {
                if ( !isNaN(value) ) {
                    var p = this.position;
                    p.y = value;
                    this.position = p;
                }
                else {
                    Fire.error(ERR_NaN, 'new y');
                }
            },
            visible: false
        },

        /**
         * The position of the transform in world space
         * @property worldPosition
         * @type {Fire.Vec2}
         */
        worldPosition: NYI_Accessor(Vec2.zero, INVISIBLE),

        /**
         * The x position of the transform in world space
         * @property worldX
         * @type {number}
         */
        worldX: {
            get: function () {
                return this.worldPosition.x;
            },
            set: function (value) {
                if ( !isNaN(value) ) {
                    var p = this.worldPosition;
                    p.x = value;
                    this.worldPosition = p;
                }
                else {
                    Fire.error(ERR_NaN, 'new worldX');
                }
            },
            visible: false
        },

        /**
         * The y position of the transform in world space
         * @property worldY
         * @type {number}
         */
        worldY: {
            get: function () {
                return this.worldPosition.y;
            },
            set: function (value) {
                if ( !isNaN(value) ) {
                    var p = this.worldPosition;
                    p.y = value;
                    this.worldPosition = p;
                }
                else {
                    Fire.error(ERR_NaN, 'new worldY');
                }
            },
            visible: false
        },

        /**
         * The counterclockwise degrees of rotation relative to the parent
         * @property rotation
         * @type {number}
         */
        rotation: NYI_Accessor(0, {
            tooltip: "The counterclockwise degrees of rotation relative to the parent"
        }),

        /**
         * The counterclockwise degrees of rotation in world space
         * @property worldRotation
         * @type {number}
         */
        worldRotation: NYI_Accessor(0, INVISIBLE),

        /**
         * The local scale factor relative to the parent
         * @property scale
         * @type {Fire.Vec2}
         */
        scale: NYI_Accessor(Vec2.one),

        /**
         * The local x scale factor relative to the parent
         * @property scaleX
         * @type {number}
         */
        scaleX: {
            get: function () {
                return this.scale.x;
            },
            set: function (value) {
                if ( !isNaN(value) ) {
                    var p = this.scale;
                    p.x = value;
                    this.scale = p;
                }
                else {
                    Fire.error(ERR_NaN, 'new scaleX');
                }
            },
            visible: false
        },

        /**
         * The local y scale factor relative to the parent
         * @property scaleY
         * @type {number}
         */
        scaleY: {
            get: function () {
                return this.scale.y;
            },
            set: function (value) {
                if ( !isNaN(value) ) {
                    var p = this.scale;
                    p.y = value;
                    this.scale = p;
                }
                else {
                    Fire.error(ERR_NaN, 'new scaleY');
                }
            },
            visible: false
        },

        /**
         * The lossy scale of the transform in world space (Read Only)
         * @property worldScale
         * @type {Fire.Vec2}
         * @readOnly
         */
        worldScale: NYI_Accessor(Vec2.one, INVISIBLE, true)
    },

    statics: {
        ///**
        // * Creates a new node without any resources.
        // * @method createEmpty
        // * @return {RuntimeNode}
        // * @static
        // */
        //createEmpty: function () {
        //    if (FIRE_EDITOR) {
        //        Fire.error('Not yet implemented');
        //    }
        //    return null;
        //},
    },

    // SERIALIZATION

    /**
     * Creates a new node using the properties defined in this wrapper, the properties will be serialized in the scene.
     * Note: 不需要设置新节点的父子关系，也不需要设置 wrapper 的 target 为新节点.
     * @method createNode
     * @return {RuntimeNode} - the created node
     */
    createNode: function () {
        NYI();
        return null;
    },

    /**
     * 这个方法会在场景保存前调用，你可以将 node 的属性保存到 wrapper 的可序列化的 properties 中，
     * 以便在 createNode() 方法中重新设置好 node。
     * @method onBeforeSerialize
     */
    onBeforeSerialize: function () {
    },

    /**
     * Creates a new node and bind with this wrapper.
     * @method onAfterDeserialize
     */
    onAfterDeserialize: function () {
        var node = this.createNode();
        this.target = node;
        node._FB_wrapper = this;
    },

    ///**
    // * This method is called when the scene is saving, allowing you to return JSON to represent the state of your node.
    // * When the scene is later loaded, the data you returned is passed to the wrapper's deserialize method so you can
    // * restore the node.
    // * @method serialize
    // * @return {object} - a JSON represents the state of the target node
    // */
    //serialize: function (data) {
    //    if (FIRE_EDITOR) {
    //        Fire.error('Not yet implemented');
    //    }
    //    return null;
    //},
    //
    ///**
    // * @callback deserializeCallback
    // * @param {string} error - null or the error info
    // * @param {RuntimeNode} node - the loaded node or null
    // */
    //
    ///**
    // * Creates a new node using the state data from the last time the scene was serialized if the wrapper implements the serialize() method.
    // * @method deserializeAsync
    // * @param {object} data - the JSON data returned from serialize() method
    // * @param {deserializeCallback} callback - Should not being called in current tick.
    // *                                         If there's no async operation, use Fire.nextTick to simulate.
    // */
    //deserializeAsync: function (data, callback) {
    //    Fire.nextTick(callback, 'Not yet implemented', null);
    //},

    ///**
    // * Creates a new node using the state data from the last time the scene was serialized if the wrapper implements the serialize() method.
    // * @method deserialize
    // * @param {object} data - the JSON data returned from serialize() method
    // * @return {RuntimeNode}
    // */
    //deserialize: function (data) {
    //    if (FIRE_EDITOR) {
    //        Fire.error('Not yet implemented');
    //    }
    //    return null;
    //},

    // HIERARCHY

    /**
     * Get the sibling index.
     *
     * NOTE: If this node does not have parent and not belongs to the current scene,
     *       The return value will be -1
     *
     * @method getSiblingIndex
     * @return {number}
     */
    getSiblingIndex: function () {
        return Fire.node(this.parentNode).childNodes.indexOf(this.target);
    },

    /**
     * Set the sibling index of this node.
     * (值越小越先渲染，-1 代表最后一个)
     *
     * @method setSiblingIndex
     * @param {number} index - new zero-based index of the node, -1 will move to the end of children.
     */
    setSiblingIndex: function (index) {
        var siblings = Fire.node(this.parentNode).childNodes;
        var item = this.target;
        index = index !== -1 ? index : siblings.length - 1;
        var oldIndex = siblings.indexOf(item);
        if (index !== oldIndex) {
            siblings.splice(oldIndex, 1);
            if (index < siblings.length) {
                siblings.splice(index, 0, item);
            }
            else {
                siblings.push(item);
            }
        }
    },

    // TRANSFORM

    /**
     * Rotates this transform through point in world space by angle degrees.
     * @method rotateAround
     * @param {Fire.Vec2} point - the world point rotates through
     * @param {number} angle - degrees
     */
    rotateAround: function (point, angle) {
        var delta = this.worldPosition.subSelf(point);
        delta.rotateSelf(Math.deg2rad(angle));
        this.worldPosition = point.addSelf(delta);
        this.rotation += angle;
    },

    // RENDERER

    /**
     * Returns a "world" axis aligned bounding box(AABB) of the renderer.
     *
     * @method getWorldBounds
     * @param {Fire.Rect} [out] - optional, the receiving rect
     * @return {Fire.Rect} - the rect represented in world position
     */
    getWorldBounds: function (out) {
        NYI();
        return new Rect();
    },

    /**
     * Returns a "world" oriented bounding box(OBB) of the renderer.
     *
     * @method getWorldOrientedBounds
     * @param {Fire.Vec2} [out_bl] - optional, the vector to receive the world position of bottom left
     * @param {Fire.Vec2} [out_tl] - optional, the vector to receive the world position of top left
     * @param {Fire.Vec2} [out_tr] - optional, the vector to receive the world position of top right
     * @param {Fire.Vec2} [out_br] - optional, the vector to receive the world position of bottom right
     * @return {Fire.Vec2} - the array contains vectors represented in world position,
     *                    in the sequence of BottomLeft, TopLeft, TopRight, BottomRight
     */
    getWorldOrientedBounds: function (out_bl, out_tl, out_tr, out_br){
        NYI();
        return [Vec2.zero, Vec2.zero, Vec2.zero, Vec2.zero];
    }
});

/**
 * @module Fire
 */

/**
 * 返回跟 object 相互绑定的 NodeWrapper 实例，如果不存在将被创建。
 * @method node
 * @param {RuntimeNode} node
 * @return {Fire.Runtime.NodeWrapper}
 */
NodeWrapper.getWrapper = function (node) {
    var wrapper = node._FB_wrapper;
    if (!wrapper) {
        var Wrapper = Fire.getWrapperType(node);
        if (!Wrapper) {
            var getClassName = Fire.JS.getClassName;
            Fire.error('%s not registered for %s', getClassName(NodeWrapper), getClassName(node));
            return null;
        }
        wrapper = new Wrapper(node);
        node._FB_wrapper = wrapper;
    }
    return wrapper;
};

module.exports = NodeWrapper;

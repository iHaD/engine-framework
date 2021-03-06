// The default mixin solution
var JS = Fire.JS;

//var tmpArray = [];

var mixin = {
    mixin: function (node, classToMix) {
        if (FIRE_EDITOR && !Fire._isFireClass(classToMix)) {
            Fire.error('The class to mixin must be FireClass.');
            return;
        }
        var newMixinClassId = JS._getClassId(classToMix);
        if (FIRE_EDITOR && !newMixinClassId) {
            Fire.error("The class to mixin must have class name or script's uuid.");
            return;
        }

        // call constructor on node
        classToMix.call(node);

        var nodeClass = node.constructor;

        // mixin prototype
        //var nodeProto = nodeClass.prototype;
        var clsProto = classToMix.prototype;
        JS.mixin(node, clsProto);  // 这里也会 mixin cls 的父类的 prototype

        // restore overrided properties
        node.constructor = nodeClass;

        // remove properties no need to mixin
        node.__cid__ = undefined;
        node.__classname__ = undefined;

        // declare mixin classes
        var _mixinClasses = node._mixinClasses;
        if (_mixinClasses) {
            _mixinClasses.push(classToMix);
        }
        else {
            node._mixinClasses = [classToMix];
        }

        // TODO - behaviours
    }
};

module.exports = mixin;

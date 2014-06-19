(function(){
  (function(definition){
    switch (false) {
    case !(typeof define === 'function' && define.amd != null):
      return define([], definition);
    case typeof exports !== 'object':
      return module.exports = definition();
    default:
      return this.Base = definition();
    }
  })(function(){
    var Base;
    return Base = (function(){
      Base.displayName = 'Base';
      var attach, prototype = Base.prototype, constructor = Base;
      attach = function(obj, name, prop, super$, superclass$){
        return obj[name] = typeof prop === 'function' ? function(){
          var this$ = this;
          prop.superclass$ = superclass$;
          prop.super$ = function(){
            return super$.apply(this$, arguments);
          };
          return prop.apply(this, arguments);
        } : prop;
      };
      Base.extend = function(displayName, proto){
        proto == null && (proto = displayName);
        return (function(superclass){
          var name, ref$, prop, prototype = extend$(import$(constructor, superclass), superclass).prototype;
          import$(constructor, Base);
          if (typeof displayName === 'string') {
            constructor.displayName = displayName;
          }
          function constructor(){
            var this$ = this instanceof ctor$ ? this : new ctor$;
            this$.initialize.apply(this$, arguments);
            return this$;
          } function ctor$(){} ctor$.prototype = prototype;
          prototype.initialize = function(){
            if (superclass.prototype.initialize != null) {
              return superclass.prototype.initialize.apply(this, arguments);
            } else {
              return superclass.apply(this, arguments);
            }
          };
          for (name in ref$ = proto) {
            prop = ref$[name];
            attach(prototype, name, prop, prototype[name], superclass);
          }
          return constructor;
        }(this));
      };
      Base.meta = function(meta){
        var name, prop;
        for (name in meta) {
          prop = meta[name];
          attach(this, name, prop, this[name], this);
        }
        return this;
      };
      prototype.initialize = function(){};
      function Base(){}
      return Base;
    }());
  });
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

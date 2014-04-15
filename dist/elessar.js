!function (definition) {
    return typeof exports === 'object' ? module.exports = definition(require('estira'), require('jquery')) : typeof define === 'function' && define.amd ? define([
        'estira',
        'jquery'
    ], definition) : window.RangeBar = definition(window.Base, window.jQuery);
}(function (Base, $) {
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == 'function' && require;
                    if (!u && a)
                        return a(o, !0);
                    if (i)
                        return i(o, !0);
                    throw new Error('Cannot find module \'' + o + '\'');
                }
                var f = n[o] = { exports: {} };
                t[o][0].call(f.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, f, f.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == 'function' && require;
        for (var o = 0; o < r.length; o++)
            s(r[o]);
        return s;
    }({
        1: [
            function (_dereq_, module, exports) {
                var requestAnimationFrame = _dereq_('./raf');
                _dereq_('es5-shim');
                var has = Object.prototype.hasOwnProperty;
                var Element = Base.extend({
                        initialize: function (html) {
                            this.$el = $(html);
                            this.$data = {};
                            this.$el.data('element', this);
                        },
                        draw: function (css) {
                            var self = this;
                            if (this.drawing)
                                return this.$el;
                            requestAnimationFrame(function () {
                                self.drawing = false;
                                self.$el.css(css);
                            });
                            this.drawing = true;
                            return this.$el;
                        },
                        on: function () {
                            this.$el.on.apply(this.$el, arguments);
                            return this;
                        },
                        one: function () {
                            this.$el.one.apply(this.$el, arguments);
                            return this;
                        },
                        off: function () {
                            this.$el.off.apply(this.$el, arguments);
                            return this;
                        },
                        trigger: function () {
                            this.$el.trigger.apply(this.$el, arguments);
                            return this;
                        },
                        remove: function () {
                            this.$el.remove();
                        },
                        data: function (key, value) {
                            var obj = key;
                            if (typeof key === 'string') {
                                if (typeof value === 'undefined') {
                                    return this.$data[key];
                                }
                                obj = {};
                                obj[key] = value;
                            }
                            $.extend(this.$data, obj);
                            return this;
                        }
                    });
                module.exports = Element;
            },
            {
                './raf': 5,
                'es5-shim': 8
            }
        ],
        2: [
            function (_dereq_, module, exports) {
                var has = Object.prototype.hasOwnProperty;
                module.exports = function getEvtX(prop, event) {
                    return has.call(event, prop) ? event[prop] : event.originalEvent && has.call(event.originalEvent, 'touches') ? event.originalEvent.touches[0][prop] : 0;
                };
            },
            {}
        ],
        3: [
            function (_dereq_, module, exports) {
                var Element = _dereq_('./element');
                var Indicator = Element.extend({
                        initialize: function initialize(options) {
                            initialize.super$.call(this, '<div class="elessar-indicator">');
                            if (options.indicatorClass)
                                this.$el.addClass(options.indicatorClass);
                            if (options.value)
                                this.val(options.value);
                        },
                        val: function (pos) {
                            this.draw({ left: 100 * pos + '%' });
                            return this;
                        }
                    });
                module.exports = Indicator;
            },
            { './element': 1 }
        ],
        4: [
            function (_dereq_, module, exports) {
                var Range = _dereq_('./range');
                var requestAnimationFrame = _dereq_('./raf');
                var Phantom = Range.extend({
                        initialize: function initialize(options) {
                            initialize.super$.call(this, $.extend({
                                //readonly: true,
                                label: '+'
                            }, options));
                            this.$el.addClass('elessar-phantom');
                        },
                        mousedown: function (ev) {
                            if (ev.which === 1) {
                                var startX = ev.pageX;
                                var newRange = this.options.parent.addRange(this.val());
                                this.remove();
                                this.options.parent.trigger('addrange', [
                                    newRange.val(),
                                    newRange
                                ]);
                                requestAnimationFrame(function () {
                                    newRange.$el.find('.elessar-handle:first-child').trigger(ev.type);
                                });
                            }
                        },
                        removePhantom: function () {
                        }
                    });
                module.exports = Phantom;
            },
            {
                './raf': 5,
                './range': 6
            }
        ],
        5: [
            function (_dereq_, module, exports) {
                var lastTime = 0;
                var vendors = [
                        'webkit',
                        'moz'
                    ], requestAnimationFrame = window.requestAnimationFrame;
                for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                    requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                }
                if (!requestAnimationFrame) {
                    requestAnimationFrame = function (callback, element) {
                        var currTime = new Date().getTime();
                        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                        var id = window.setTimeout(function () {
                                callback(currTime + timeToCall);
                            }, timeToCall);
                        lastTime = currTime + timeToCall;
                        return id;
                    };
                }
                module.exports = requestAnimationFrame;
            },
            {}
        ],
        6: [
            function (_dereq_, module, exports) {
                var Element = _dereq_('./element');
                var getEvtX = _dereq_('./evtx');
                _dereq_('es5-shim');
                var Range = Element.extend({
                        initialize: function initialize(options) {
                            var self = this;
                            initialize.super$.call(this, '<div class="elessar-range"><span class="elessar-barlabel">');
                            this.options = options;
                            this.parent = options.parent;
                            if (this.options.rangeClass)
                                this.$el.addClass(this.options.rangeClass);
                            if (!this.options.readonly) {
                                this.$el.prepend('<div class="elessar-handle">').append('<div class="elessar-handle">');
                                this.on('mouseenter touchstart', $.proxy(this.removePhantom, this));
                                this.on('mousedown touchstart', $.proxy(this.mousedown, this));
                                this.on('click', $.proxy(this.click, this));
                            } else {
                                this.$el.addClass('elessar-readonly');
                            }
                            if (typeof this.options.label === 'function') {
                                this.on('changing', function (ev, range) {
                                    self.$el.find('.elessar-barlabel').text(self.options.label.call(self, range.map($.proxy(self.parent.normalise, self.parent))));
                                });
                            } else {
                                this.$el.find('.elessar-barlabel').text(this.options.label);
                            }
                            this.range = [];
                            this.hasChanged = false;
                            if (this.options.value)
                                this.val(this.options.value);
                        },
                        removePhantom: function () {
                            this.parent.removePhantom();
                        },
                        val: function (range, valOpts) {
                            if (typeof range === 'undefined') {
                                return this.range;
                            }
                            valOpts = $.extend({}, {
                                dontApplyDelta: false,
                                trigger: true
                            }, valOpts || {});
                            var next = this.parent.nextRange(this.$el), prev = this.parent.prevRange(this.$el), delta = range[1] - range[0], self = this;
                            if (this.options.snap) {
                                range = range.map(snap);
                                delta = snap(delta);
                            }
                            if (next && next.val()[0] <= range[1] && prev && prev.val()[1] >= range[0]) {
                                range[1] = next.val()[0];
                                range[0] = prev.val()[1];
                            }
                            if (next && next.val()[0] < range[1]) {
                                range[1] = next.val()[0];
                                if (!valOpts.dontApplyDelta)
                                    range[0] = range[1] - delta;
                            }
                            if (prev && prev.val()[1] > range[0]) {
                                range[0] = prev.val()[1];
                                if (!valOpts.dontApplyDelta)
                                    range[1] = range[0] + delta;
                            }
                            if (range[1] >= 1) {
                                range[1] = 1;
                                if (!valOpts.dontApplyDelta)
                                    range[0] = 1 - delta;
                            }
                            if (range[0] <= 0) {
                                range[0] = 0;
                                if (!valOpts.dontApplyDelta)
                                    range[1] = delta;
                            }
                            if (this.options.minSize && range[1] - range[0] < this.options.minSize) {
                                range[1] = range[0] + this.options.minSize;
                            }
                            if (this.range[0] === range[0] && this.range[1] === range[1])
                                return this.$el;
                            this.range = range;
                            if (valOpts.trigger) {
                                this.$el.triggerHandler('changing', [
                                    range,
                                    this.$el
                                ]);
                                hasChanged = true;
                            }
                            this.draw({
                                left: 100 * range[0] + '%',
                                minWidth: 100 * (range[1] - range[0]) + '%'
                            });
                            return this;
                            function snap(val) {
                                return Math.round(val / self.options.snap) * self.options.snap;
                            }
                            function sign(x) {
                                return x ? x < 0 ? -1 : 1 : 0;
                            }
                        },
                        click: function (ev) {
                            ev.stopPropagation();
                            ev.preventDefault();
                            var self = this;
                            if (ev.which !== 2 || !this.parent.options.allowDelete)
                                return;
                            if (this.deleteConfirm) {
                                this.parent.removeRange(this);
                                clearTimeout(this.deleteTimeout);
                            } else {
                                this.$el.addClass('elessar-delete-confirm');
                                this.deleteConfirm = true;
                                this.deleteTimeout = setTimeout(function () {
                                    self.$el.removeClass('elessar-delete-confirm');
                                    self.deleteConfirm = false;
                                }, this.parent.options.deleteTimeout);
                            }
                        },
                        mousedown: function (ev) {
                            ev.stopPropagation();
                            ev.preventDefault();
                            this.hasChanged = false;
                            if (ev.which > 1)
                                return;
                            if ($(ev.target).is('.elessar-handle:first-child')) {
                                $('body').addClass('elessar-resizing');
                                $(document).on('mousemove touchmove', this.resizeLeft(ev));
                            } else if ($(ev.target).is('.elessar-handle:last-child')) {
                                $('body').addClass('elessar-resizing');
                                $(document).on('mousemove touchmove', this.resizeRight(ev));
                            } else {
                                $('body').addClass('elessar-dragging');
                                $(document).on('mousemove touchmove', this.drag(ev));
                            }
                            var self = this;
                            $(document).on('mouseup touchend', function (ev) {
                                ev.stopPropagation();
                                ev.preventDefault();
                                if (hasChanged)
                                    self.trigger('change', [
                                        self.range,
                                        self.$el
                                    ]);
                                $(document).off('mouseup mousemove touchend touchmove');
                                $('body').removeClass('elessar-resizing elessar-dragging');
                            });
                        },
                        drag: function (origEv) {
                            var self = this, startLeft = this.$el.offset().left, startPosLeft = this.$el.position().left, mouseOffset = getEvtX('clientX', origEv) ? getEvtX('clientX', origEv) - this.$el.offset().left : 0, startWidth = this.$el.width(), parent = this.options.parent, parentOffset = parent.$el.offset(), parentWidth = parent.$el.width();
                            return function (ev) {
                                ev.stopPropagation();
                                ev.preventDefault();
                                var left = getEvtX('clientX', ev) - parentOffset.left - mouseOffset;
                                if (left >= 0 && left <= parentWidth - startWidth) {
                                    var rangeOffset = left / parentWidth - self.range[0];
                                    self.val([
                                        left / parentWidth,
                                        self.range[1] + rangeOffset
                                    ]);
                                } else {
                                    mouseOffset = getEvtX('clientX', ev) - self.$el.offset().left;
                                }
                            };
                        },
                        resizeRight: function (origEv) {
                            var self = this, startLeft = this.$el.offset().left, startPosLeft = this.$el.position().left, mouseOffset = getEvtX('clientX', origEv) ? getEvtX('clientX', origEv) - this.$el.offset().left : 0, startWidth = this.$el.width(), parent = this.options.parent, parentOffset = parent.$el.offset(), parentWidth = parent.$el.width(), minWidth = this.options.minSize * parentWidth;
                            return function (ev) {
                                var opposite = ev.type === 'touchmove' ? 'touchend' : 'mouseup', subsequent = ev.type === 'touchmove' ? 'touchstart' : 'mousedown';
                                ev.stopPropagation();
                                ev.preventDefault();
                                var width = getEvtX('clientX', ev) - startLeft;
                                if (width > parentWidth - startPosLeft)
                                    width = parentWidth - startPosLeft;
                                if (width >= minWidth) {
                                    self.val([
                                        self.range[0],
                                        self.range[0] + width / parentWidth
                                    ], { dontApplyDelta: true });
                                } else if (width <= 10) {
                                    $(document).trigger(opposite);
                                    self.$el.find('.elessar-handle:first-child').trigger(subsequent);
                                }
                            };
                        },
                        resizeLeft: function (origEv) {
                            var self = this, startLeft = this.$el.offset().left, startPosLeft = this.$el.position().left, mouseOffset = getEvtX('clientX', origEv) ? getEvtX('clientX', origEv) - this.$el.offset().left : 0, startWidth = this.$el.width(), parent = this.options.parent, parentOffset = parent.$el.offset(), parentWidth = parent.$el.width(), minWidth = this.options.minSize * parentWidth;
                            return function (ev) {
                                var opposite = ev.type === 'touchmove' ? 'touchend' : 'mouseup', subsequent = ev.type === 'touchmove' ? 'touchstart' : 'mousedown';
                                ev.stopPropagation();
                                ev.preventDefault();
                                var left = getEvtX('clientX', ev) - parentOffset.left - mouseOffset;
                                var width = startPosLeft + startWidth - left;
                                if (left < 0) {
                                    left = 0;
                                    width = startPosLeft + startWidth;
                                }
                                if (width >= minWidth) {
                                    self.val([
                                        left / parentWidth,
                                        self.range[1]
                                    ], { dontApplyDelta: true });
                                } else if (width <= 10) {
                                    $(document).trigger(opposite);
                                    self.$el.find('.elessar-handle:last-child').trigger(subsequent);
                                }
                            };
                        }
                    });
                module.exports = Range;
            },
            {
                './element': 1,
                './evtx': 2,
                'es5-shim': 8
            }
        ],
        7: [
            function (_dereq_, module, exports) {
                var Element = _dereq_('./element');
                var Range = _dereq_('./range');
                var Phantom = _dereq_('./phantom');
                var Indicator = _dereq_('./indicator');
                var getEvtX = _dereq_('./evtx');
                var RangeBar = Element.extend({
                        initialize: function initialize(options) {
                            initialize.super$.call(this, '<div class="elessar-rangebar">');
                            this.options = $.extend({}, RangeBar.defaults, options);
                            this.options.min = options.valueParse(options.min);
                            this.options.max = options.valueParse(options.max);
                            if (this.options.barClass)
                                this.$el.addClass(this.options.barClass);
                            this.ranges = [];
                            this.on('mousemove touchmove', $.proxy(this.mousemove, this));
                            this.on('mouseleave touchleave', $.proxy(this.removePhantom, this));
                            if (options.values)
                                this.setVal(options.values);
                            for (var i = 0; i < options.bgLabels; ++i) {
                                this.addLabel(i / options.bgLabels);
                            }
                            var self = this;
                            if (options.indicator) {
                                var indicator = this.indicator = new Indicator({
                                        parent: this,
                                        indicatorClass: options.indicatorClass
                                    });
                                indicator.val(this.abnormalise(options.indicator(this, indicator, function () {
                                    indicator.val(self.abnormalise(options.indicator(self, indicator)));
                                })));
                                this.$el.append(indicator.$el);
                            }
                        },
                        normaliseRaw: function (value) {
                            return this.options.min + value * (this.options.max - this.options.min);
                        },
                        normalise: function (value) {
                            return this.options.valueFormat(this.normaliseRaw(value));
                        },
                        abnormaliseRaw: function (value) {
                            return (value - this.options.min) / (this.options.max - this.options.min);
                        },
                        abnormalise: function (value) {
                            return this.abnormaliseRaw(this.options.valueParse(value));
                        },
                        findGap: function (range) {
                            var newIndex;
                            this.ranges.forEach(function ($r, i) {
                                if ($r.val()[0] < range[0] && $r.val()[1] < range[1])
                                    newIndex = i + 1;
                            });
                            return newIndex;
                        },
                        insertRangeIndex: function (range, index, avoidList) {
                            if (!avoidList)
                                this.ranges.splice(index, 0, range);
                            if (this.ranges[index - 1]) {
                                this.ranges[index - 1].$el.after(range.$el);
                            } else {
                                this.$el.prepend(range.$el);
                            }
                        },
                        addRange: function (range, data) {
                            var $range = Range({
                                    parent: this,
                                    snap: this.options.snap ? this.abnormaliseRaw(this.options.snap + this.options.min) : null,
                                    label: this.options.label,
                                    rangeClass: this.options.rangeClass,
                                    minSize: this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : null,
                                    readonly: this.options.readonly
                                });
                            if (this.options.data) {
                                $range.data(this.options.data.call($range, this));
                            }
                            if (data) {
                                $range.data(data);
                            }
                            this.insertRangeIndex($range, this.findGap(range));
                            $range.val(range);
                            var self = this;
                            $range.on('changing', function (ev, nrange, changed) {
                                ev.stopPropagation();
                                self.trigger('changing', [
                                    self.val(),
                                    changed
                                ]);
                            }).on('change', function (ev, nrange, changed) {
                                ev.stopPropagation();
                                self.trigger('change', [
                                    self.val(),
                                    changed
                                ]);
                            });
                            return $range;
                        },
                        prevRange: function (range) {
                            var idx = range.index();
                            if (idx >= 0)
                                return this.ranges[idx - 1];
                        },
                        nextRange: function (range) {
                            var idx = range.index();
                            if (idx >= 0)
                                return this.ranges[range instanceof Phantom ? idx : idx + 1];
                        },
                        setVal: function (ranges) {
                            if (this.ranges.length > ranges.length) {
                                for (var i = ranges.length - 1, l = this.ranges.length - 1; i < l; --l) {
                                    this.removeRange(l);
                                }
                                this.ranges.length = ranges.length;
                            }
                            var self = this;
                            ranges.forEach(function (range, i) {
                                if (self.ranges[i]) {
                                    self.ranges[i].val(range.map($.proxy(self.abnormalise, self)));
                                } else {
                                    self.addRange(range.map($.proxy(self.abnormalise, self)));
                                }
                            });
                            return this;
                        },
                        val: function (ranges) {
                            var self = this;
                            if (typeof ranges === 'undefined') {
                                return this.ranges.map(function (range) {
                                    return range.val().map($.proxy(self.normalise, self));
                                });
                            }
                            if (!this.options.readonly)
                                this.setVal(ranges);
                            return this;
                        },
                        removePhantom: function () {
                            if (this.phantom) {
                                this.phantom.remove();
                                this.phantom = null;
                            }
                        },
                        removeRange: function (i) {
                            if (i instanceof Range) {
                                i = this.ranges.indexOf(i);
                            }
                            this.ranges.splice(i, 1)[0].remove();
                            this.trigger('change', [this.val()]);
                        },
                        calcGap: function (index) {
                            var start = this.ranges[index - 1] ? this.ranges[index - 1].val()[1] : 0;
                            var end = this.ranges[index] ? this.ranges[index].val()[0] : 1;
                            return this.normaliseRaw(end) - this.normaliseRaw(start);
                        },
                        addLabel: function (pos) {
                            var cent = pos * 100, val = this.normalise(pos);
                            var $el = $('<span class="elessar-label">').css('left', cent + '%').text(val);
                            if (1 - pos < 0.05) {
                                $el.css({
                                    left: '',
                                    right: 0
                                });
                            }
                            return $el.appendTo(this.$el);
                        },
                        mousemove: function (ev) {
                            var w = this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : 0.05;
                            var val = (getEvtX('pageX', ev) - this.$el.offset().left) / this.$el.width() - w / 2;
                            if (ev.target === ev.currentTarget && this.ranges.length < this.options.maxRanges && !$('body').is('.elessar-dragging, .elessar-resizing') && !this.options.readonly) {
                                if (!this.phantom)
                                    this.phantom = Phantom({
                                        parent: this,
                                        snap: this.options.snap ? this.abnormaliseRaw(this.options.snap + this.options.min) : null,
                                        label: '+',
                                        minSize: this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : null,
                                        rangeClass: this.options.rangeClass
                                    });
                                var idx = this.findGap([
                                        val,
                                        val + w
                                    ]);
                                if (!this.options.minSize || this.calcGap(idx) >= this.options.minSize) {
                                    this.insertRangeIndex(this.phantom, idx, true);
                                    this.phantom.val([
                                        val,
                                        val + w
                                    ], { trigger: false });
                                }
                            }
                        }
                    });
                RangeBar.defaults = {
                    min: 0,
                    max: 100,
                    valueFormat: function (a) {
                        return a;
                    },
                    valueParse: function (a) {
                        return a;
                    },
                    maxRanges: Infinity,
                    readonly: false,
                    bgLabels: 0,
                    deleteTimeout: 5000,
                    allowDelete: false
                };
                module.exports = RangeBar;
            },
            {
                './element': 1,
                './evtx': 2,
                './indicator': 3,
                './phantom': 4,
                './range': 6
            }
        ],
        8: [
            function (_dereq_, module, exports) {
                (function (definition) {
                    if (typeof define == 'function') {
                        define(definition);
                    } else if (typeof YUI == 'function') {
                        YUI.add('es5', definition);
                    } else {
                        definition();
                    }
                }(function () {
                    function Empty() {
                    }
                    if (!Function.prototype.bind) {
                        Function.prototype.bind = function bind(that) {
                            var target = this;
                            if (typeof target != 'function') {
                                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
                            }
                            var args = _Array_slice_.call(arguments, 1);
                            var bound = function () {
                                if (this instanceof bound) {
                                    var result = target.apply(this, args.concat(_Array_slice_.call(arguments)));
                                    if (Object(result) === result) {
                                        return result;
                                    }
                                    return this;
                                } else {
                                    return target.apply(that, args.concat(_Array_slice_.call(arguments)));
                                }
                            };
                            if (target.prototype) {
                                Empty.prototype = target.prototype;
                                bound.prototype = new Empty();
                                Empty.prototype = null;
                            }
                            return bound;
                        };
                    }
                    var call = Function.prototype.call;
                    var prototypeOfArray = Array.prototype;
                    var prototypeOfObject = Object.prototype;
                    var _Array_slice_ = prototypeOfArray.slice;
                    var _toString = call.bind(prototypeOfObject.toString);
                    var owns = call.bind(prototypeOfObject.hasOwnProperty);
                    var defineGetter;
                    var defineSetter;
                    var lookupGetter;
                    var lookupSetter;
                    var supportsAccessors;
                    if (supportsAccessors = owns(prototypeOfObject, '__defineGetter__')) {
                        defineGetter = call.bind(prototypeOfObject.__defineGetter__);
                        defineSetter = call.bind(prototypeOfObject.__defineSetter__);
                        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
                        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
                    }
                    if ([
                            1,
                            2
                        ].splice(0).length != 2) {
                        var array_splice = Array.prototype.splice;
                        if (function () {
                                function makeArray(l) {
                                    var a = [];
                                    while (l--) {
                                        a.unshift(l);
                                    }
                                    return a;
                                }
                                var array = [], lengthBefore;
                                ;
                                array.splice.bind(array, 0, 0).apply(null, makeArray(20));
                                array.splice.bind(array, 0, 0).apply(null, makeArray(26));
                                lengthBefore = array.length;
                                array.splice(5, 0, 'XXX');
                                if (lengthBefore + 1 == array.length) {
                                    return true;
                                }
                            }()) {
                            Array.prototype.splice = function (start, deleteCount) {
                                if (!arguments.length) {
                                    return [];
                                } else {
                                    return array_splice.apply(this, [
                                        start === void 0 ? 0 : start,
                                        deleteCount === void 0 ? this.length - start : deleteCount
                                    ].concat(_Array_slice_.call(arguments, 2)));
                                }
                            };
                        } else {
                            Array.prototype.splice = function (start, deleteCount) {
                                var result, args = _Array_slice_.call(arguments, 2), addElementsCount = args.length;
                                ;
                                if (!arguments.length) {
                                    return [];
                                }
                                if (start === void 0) {
                                    start = 0;
                                }
                                if (deleteCount === void 0) {
                                    deleteCount = this.length - start;
                                }
                                if (addElementsCount > 0) {
                                    if (deleteCount <= 0) {
                                        if (start == this.length) {
                                            this.push.apply(this, args);
                                            return [];
                                        }
                                        if (start == 0) {
                                            this.unshift.apply(this, args);
                                            return [];
                                        }
                                    }
                                    result = _Array_slice_.call(this, start, start + deleteCount);
                                    args.push.apply(args, _Array_slice_.call(this, start + deleteCount, this.length));
                                    args.unshift.apply(args, _Array_slice_.call(this, 0, start));
                                    args.unshift(0, this.length);
                                    array_splice.apply(this, args);
                                    return result;
                                }
                                return array_splice.call(this, start, deleteCount);
                            };
                        }
                    }
                    if ([].unshift(0) != 1) {
                        var array_unshift = Array.prototype.unshift;
                        Array.prototype.unshift = function () {
                            array_unshift.apply(this, arguments);
                            return this.length;
                        };
                    }
                    if (!Array.isArray) {
                        Array.isArray = function isArray(obj) {
                            return _toString(obj) == '[object Array]';
                        };
                    }
                    var boxedString = Object('a'), splitString = boxedString[0] != 'a' || !(0 in boxedString);
                    if (!Array.prototype.forEach) {
                        Array.prototype.forEach = function forEach(fun) {
                            var object = toObject(this), self = splitString && _toString(this) == '[object String]' ? this.split('') : object, thisp = arguments[1], i = -1, length = self.length >>> 0;
                            if (_toString(fun) != '[object Function]') {
                                throw new TypeError();
                            }
                            while (++i < length) {
                                if (i in self) {
                                    fun.call(thisp, self[i], i, object);
                                }
                            }
                        };
                    }
                    if (!Array.prototype.map) {
                        Array.prototype.map = function map(fun) {
                            var object = toObject(this), self = splitString && _toString(this) == '[object String]' ? this.split('') : object, length = self.length >>> 0, result = Array(length), thisp = arguments[1];
                            if (_toString(fun) != '[object Function]') {
                                throw new TypeError(fun + ' is not a function');
                            }
                            for (var i = 0; i < length; i++) {
                                if (i in self)
                                    result[i] = fun.call(thisp, self[i], i, object);
                            }
                            return result;
                        };
                    }
                    if (!Array.prototype.filter) {
                        Array.prototype.filter = function filter(fun) {
                            var object = toObject(this), self = splitString && _toString(this) == '[object String]' ? this.split('') : object, length = self.length >>> 0, result = [], value, thisp = arguments[1];
                            if (_toString(fun) != '[object Function]') {
                                throw new TypeError(fun + ' is not a function');
                            }
                            for (var i = 0; i < length; i++) {
                                if (i in self) {
                                    value = self[i];
                                    if (fun.call(thisp, value, i, object)) {
                                        result.push(value);
                                    }
                                }
                            }
                            return result;
                        };
                    }
                    if (!Array.prototype.every) {
                        Array.prototype.every = function every(fun) {
                            var object = toObject(this), self = splitString && _toString(this) == '[object String]' ? this.split('') : object, length = self.length >>> 0, thisp = arguments[1];
                            if (_toString(fun) != '[object Function]') {
                                throw new TypeError(fun + ' is not a function');
                            }
                            for (var i = 0; i < length; i++) {
                                if (i in self && !fun.call(thisp, self[i], i, object)) {
                                    return false;
                                }
                            }
                            return true;
                        };
                    }
                    if (!Array.prototype.some) {
                        Array.prototype.some = function some(fun) {
                            var object = toObject(this), self = splitString && _toString(this) == '[object String]' ? this.split('') : object, length = self.length >>> 0, thisp = arguments[1];
                            if (_toString(fun) != '[object Function]') {
                                throw new TypeError(fun + ' is not a function');
                            }
                            for (var i = 0; i < length; i++) {
                                if (i in self && fun.call(thisp, self[i], i, object)) {
                                    return true;
                                }
                            }
                            return false;
                        };
                    }
                    if (!Array.prototype.reduce) {
                        Array.prototype.reduce = function reduce(fun) {
                            var object = toObject(this), self = splitString && _toString(this) == '[object String]' ? this.split('') : object, length = self.length >>> 0;
                            if (_toString(fun) != '[object Function]') {
                                throw new TypeError(fun + ' is not a function');
                            }
                            if (!length && arguments.length == 1) {
                                throw new TypeError('reduce of empty array with no initial value');
                            }
                            var i = 0;
                            var result;
                            if (arguments.length >= 2) {
                                result = arguments[1];
                            } else {
                                do {
                                    if (i in self) {
                                        result = self[i++];
                                        break;
                                    }
                                    if (++i >= length) {
                                        throw new TypeError('reduce of empty array with no initial value');
                                    }
                                } while (true);
                            }
                            for (; i < length; i++) {
                                if (i in self) {
                                    result = fun.call(void 0, result, self[i], i, object);
                                }
                            }
                            return result;
                        };
                    }
                    if (!Array.prototype.reduceRight) {
                        Array.prototype.reduceRight = function reduceRight(fun) {
                            var object = toObject(this), self = splitString && _toString(this) == '[object String]' ? this.split('') : object, length = self.length >>> 0;
                            if (_toString(fun) != '[object Function]') {
                                throw new TypeError(fun + ' is not a function');
                            }
                            if (!length && arguments.length == 1) {
                                throw new TypeError('reduceRight of empty array with no initial value');
                            }
                            var result, i = length - 1;
                            if (arguments.length >= 2) {
                                result = arguments[1];
                            } else {
                                do {
                                    if (i in self) {
                                        result = self[i--];
                                        break;
                                    }
                                    if (--i < 0) {
                                        throw new TypeError('reduceRight of empty array with no initial value');
                                    }
                                } while (true);
                            }
                            if (i < 0) {
                                return result;
                            }
                            do {
                                if (i in this) {
                                    result = fun.call(void 0, result, self[i], i, object);
                                }
                            } while (i--);
                            return result;
                        };
                    }
                    if (!Array.prototype.indexOf || [
                            0,
                            1
                        ].indexOf(1, 2) != -1) {
                        Array.prototype.indexOf = function indexOf(sought) {
                            var self = splitString && _toString(this) == '[object String]' ? this.split('') : toObject(this), length = self.length >>> 0;
                            if (!length) {
                                return -1;
                            }
                            var i = 0;
                            if (arguments.length > 1) {
                                i = toInteger(arguments[1]);
                            }
                            i = i >= 0 ? i : Math.max(0, length + i);
                            for (; i < length; i++) {
                                if (i in self && self[i] === sought) {
                                    return i;
                                }
                            }
                            return -1;
                        };
                    }
                    if (!Array.prototype.lastIndexOf || [
                            0,
                            1
                        ].lastIndexOf(0, -3) != -1) {
                        Array.prototype.lastIndexOf = function lastIndexOf(sought) {
                            var self = splitString && _toString(this) == '[object String]' ? this.split('') : toObject(this), length = self.length >>> 0;
                            if (!length) {
                                return -1;
                            }
                            var i = length - 1;
                            if (arguments.length > 1) {
                                i = Math.min(i, toInteger(arguments[1]));
                            }
                            i = i >= 0 ? i : length - Math.abs(i);
                            for (; i >= 0; i--) {
                                if (i in self && sought === self[i]) {
                                    return i;
                                }
                            }
                            return -1;
                        };
                    }
                    if (!Object.keys) {
                        var hasDontEnumBug = true, dontEnums = [
                                'toString',
                                'toLocaleString',
                                'valueOf',
                                'hasOwnProperty',
                                'isPrototypeOf',
                                'propertyIsEnumerable',
                                'constructor'
                            ], dontEnumsLength = dontEnums.length;
                        for (var key in { 'toString': null }) {
                            hasDontEnumBug = false;
                        }
                        Object.keys = function keys(object) {
                            if (typeof object != 'object' && typeof object != 'function' || object === null) {
                                throw new TypeError('Object.keys called on a non-object');
                            }
                            var keys = [];
                            for (var name in object) {
                                if (owns(object, name)) {
                                    keys.push(name);
                                }
                            }
                            if (hasDontEnumBug) {
                                for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                                    var dontEnum = dontEnums[i];
                                    if (owns(object, dontEnum)) {
                                        keys.push(dontEnum);
                                    }
                                }
                            }
                            return keys;
                        };
                    }
                    var negativeDate = -62198755200000, negativeYearString = '-000001';
                    if (!Date.prototype.toISOString || new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1) {
                        Date.prototype.toISOString = function toISOString() {
                            var result, length, value, year, month;
                            if (!isFinite(this)) {
                                throw new RangeError('Date.prototype.toISOString called on non-finite value.');
                            }
                            year = this.getUTCFullYear();
                            month = this.getUTCMonth();
                            year += Math.floor(month / 12);
                            month = (month % 12 + 12) % 12;
                            result = [
                                month + 1,
                                this.getUTCDate(),
                                this.getUTCHours(),
                                this.getUTCMinutes(),
                                this.getUTCSeconds()
                            ];
                            year = (year < 0 ? '-' : year > 9999 ? '+' : '') + ('00000' + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);
                            length = result.length;
                            while (length--) {
                                value = result[length];
                                if (value < 10) {
                                    result[length] = '0' + value;
                                }
                            }
                            return year + '-' + result.slice(0, 2).join('-') + 'T' + result.slice(2).join(':') + '.' + ('000' + this.getUTCMilliseconds()).slice(-3) + 'Z';
                        };
                    }
                    var dateToJSONIsSupported = false;
                    try {
                        dateToJSONIsSupported = Date.prototype.toJSON && new Date(NaN).toJSON() === null && new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 && Date.prototype.toJSON.call({
                            toISOString: function () {
                                return true;
                            }
                        });
                    } catch (e) {
                    }
                    if (!dateToJSONIsSupported) {
                        Date.prototype.toJSON = function toJSON(key) {
                            var o = Object(this), tv = toPrimitive(o), toISO;
                            if (typeof tv === 'number' && !isFinite(tv)) {
                                return null;
                            }
                            toISO = o.toISOString;
                            if (typeof toISO != 'function') {
                                throw new TypeError('toISOString property is not callable');
                            }
                            return toISO.call(o);
                        };
                    }
                    if (!Date.parse || 'Date.parse is buggy') {
                        Date = function (NativeDate) {
                            function Date(Y, M, D, h, m, s, ms) {
                                var length = arguments.length;
                                if (this instanceof NativeDate) {
                                    var date = length == 1 && String(Y) === Y ? new NativeDate(Date.parse(Y)) : length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) : length >= 6 ? new NativeDate(Y, M, D, h, m, s) : length >= 5 ? new NativeDate(Y, M, D, h, m) : length >= 4 ? new NativeDate(Y, M, D, h) : length >= 3 ? new NativeDate(Y, M, D) : length >= 2 ? new NativeDate(Y, M) : length >= 1 ? new NativeDate(Y) : new NativeDate();
                                    date.constructor = Date;
                                    return date;
                                }
                                return NativeDate.apply(this, arguments);
                            }
                            ;
                            var isoDateExpression = new RegExp('^' + '(\\d{4}|[+-]\\d{6})' + '(?:-(\\d{2})' + '(?:-(\\d{2})' + '(?:' + 'T(\\d{2})' + ':(\\d{2})' + '(?:' + ':(\\d{2})' + '(?:(\\.\\d{1,}))?' + ')?' + '(' + 'Z|' + '(?:' + '([-+])' + '(\\d{2})' + ':(\\d{2})' + ')' + ')?)?)?)?' + '$');
                            var months = [
                                    0,
                                    31,
                                    59,
                                    90,
                                    120,
                                    151,
                                    181,
                                    212,
                                    243,
                                    273,
                                    304,
                                    334,
                                    365
                                ];
                            function dayFromMonth(year, month) {
                                var t = month > 1 ? 1 : 0;
                                return months[month] + Math.floor((year - 1969 + t) / 4) - Math.floor((year - 1901 + t) / 100) + Math.floor((year - 1601 + t) / 400) + 365 * (year - 1970);
                            }
                            for (var key in NativeDate) {
                                Date[key] = NativeDate[key];
                            }
                            Date.now = NativeDate.now;
                            Date.UTC = NativeDate.UTC;
                            Date.prototype = NativeDate.prototype;
                            Date.prototype.constructor = Date;
                            Date.parse = function parse(string) {
                                var match = isoDateExpression.exec(string);
                                if (match) {
                                    var year = Number(match[1]), month = Number(match[2] || 1) - 1, day = Number(match[3] || 1) - 1, hour = Number(match[4] || 0), minute = Number(match[5] || 0), second = Number(match[6] || 0), millisecond = Math.floor(Number(match[7] || 0) * 1000), offset = !match[4] || match[8] ? 0 : Number(new NativeDate(1970, 0)), signOffset = match[9] === '-' ? 1 : -1, hourOffset = Number(match[10] || 0), minuteOffset = Number(match[11] || 0), result;
                                    if (hour < (minute > 0 || second > 0 || millisecond > 0 ? 24 : 25) && minute < 60 && second < 60 && millisecond < 1000 && month > -1 && month < 12 && hourOffset < 24 && minuteOffset < 60 && day > -1 && day < dayFromMonth(year, month + 1) - dayFromMonth(year, month)) {
                                        result = ((dayFromMonth(year, month) + day) * 24 + hour + hourOffset * signOffset) * 60;
                                        result = ((result + minute + minuteOffset * signOffset) * 60 + second) * 1000 + millisecond + offset;
                                        if (-8640000000000000 <= result && result <= 8640000000000000) {
                                            return result;
                                        }
                                    }
                                    return NaN;
                                }
                                return NativeDate.parse.apply(this, arguments);
                            };
                            return Date;
                        }(Date);
                    }
                    if (!Date.now) {
                        Date.now = function now() {
                            return new Date().getTime();
                        };
                    }
                    if (!Number.prototype.toFixed || 0.00008.toFixed(3) !== '0.000' || 0.9.toFixed(0) === '0' || 1.255.toFixed(2) !== '1.25' || 1000000000000000100..toFixed(0) !== '1000000000000000128') {
                        (function () {
                            var base, size, data, i;
                            base = 10000000;
                            size = 6;
                            data = [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ];
                            function multiply(n, c) {
                                var i = -1;
                                while (++i < size) {
                                    c += n * data[i];
                                    data[i] = c % base;
                                    c = Math.floor(c / base);
                                }
                            }
                            function divide(n) {
                                var i = size, c = 0;
                                while (--i >= 0) {
                                    c += data[i];
                                    data[i] = Math.floor(c / n);
                                    c = c % n * base;
                                }
                            }
                            function toString() {
                                var i = size;
                                var s = '';
                                while (--i >= 0) {
                                    if (s !== '' || i === 0 || data[i] !== 0) {
                                        var t = String(data[i]);
                                        if (s === '') {
                                            s = t;
                                        } else {
                                            s += '0000000'.slice(0, 7 - t.length) + t;
                                        }
                                    }
                                }
                                return s;
                            }
                            function pow(x, n, acc) {
                                return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
                            }
                            function log(x) {
                                var n = 0;
                                while (x >= 4096) {
                                    n += 12;
                                    x /= 4096;
                                }
                                while (x >= 2) {
                                    n += 1;
                                    x /= 2;
                                }
                                return n;
                            }
                            Number.prototype.toFixed = function (fractionDigits) {
                                var f, x, s, m, e, z, j, k;
                                f = Number(fractionDigits);
                                f = f !== f ? 0 : Math.floor(f);
                                if (f < 0 || f > 20) {
                                    throw new RangeError('Number.toFixed called with invalid number of decimals');
                                }
                                x = Number(this);
                                if (x !== x) {
                                    return 'NaN';
                                }
                                if (x <= -1e+21 || x >= 1e+21) {
                                    return String(x);
                                }
                                s = '';
                                if (x < 0) {
                                    s = '-';
                                    x = -x;
                                }
                                m = '0';
                                if (x > 1e-21) {
                                    e = log(x * pow(2, 69, 1)) - 69;
                                    z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
                                    z *= 4503599627370496;
                                    e = 52 - e;
                                    if (e > 0) {
                                        multiply(0, z);
                                        j = f;
                                        while (j >= 7) {
                                            multiply(10000000, 0);
                                            j -= 7;
                                        }
                                        multiply(pow(10, j, 1), 0);
                                        j = e - 1;
                                        while (j >= 23) {
                                            divide(1 << 23);
                                            j -= 23;
                                        }
                                        divide(1 << j);
                                        multiply(1, 1);
                                        divide(2);
                                        m = toString();
                                    } else {
                                        multiply(0, z);
                                        multiply(1 << -e, 0);
                                        m = toString() + '0.00000000000000000000'.slice(2, 2 + f);
                                    }
                                }
                                if (f > 0) {
                                    k = m.length;
                                    if (k <= f) {
                                        m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
                                    } else {
                                        m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
                                    }
                                } else {
                                    m = s + m;
                                }
                                return m;
                            };
                        }());
                    }
                    var string_split = String.prototype.split;
                    if ('ab'.split(/(?:ab)*/).length !== 2 || '.'.split(/(.?)(.?)/).length !== 4 || 'tesst'.split(/(s)*/)[1] === 't' || ''.split(/.?/).length === 0 || '.'.split(/()()/).length > 1) {
                        (function () {
                            var compliantExecNpcg = /()??/.exec('')[1] === void 0;
                            String.prototype.split = function (separator, limit) {
                                var string = this;
                                if (separator === void 0 && limit === 0)
                                    return [];
                                if (Object.prototype.toString.call(separator) !== '[object RegExp]') {
                                    return string_split.apply(this, arguments);
                                }
                                var output = [], flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.extended ? 'x' : '') + (separator.sticky ? 'y' : ''), lastLastIndex = 0, separator = new RegExp(separator.source, flags + 'g'), separator2, match, lastIndex, lastLength;
                                string += '';
                                if (!compliantExecNpcg) {
                                    separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
                                }
                                limit = limit === void 0 ? -1 >>> 0 : limit >>> 0;
                                while (match = separator.exec(string)) {
                                    lastIndex = match.index + match[0].length;
                                    if (lastIndex > lastLastIndex) {
                                        output.push(string.slice(lastLastIndex, match.index));
                                        if (!compliantExecNpcg && match.length > 1) {
                                            match[0].replace(separator2, function () {
                                                for (var i = 1; i < arguments.length - 2; i++) {
                                                    if (arguments[i] === void 0) {
                                                        match[i] = void 0;
                                                    }
                                                }
                                            });
                                        }
                                        if (match.length > 1 && match.index < string.length) {
                                            Array.prototype.push.apply(output, match.slice(1));
                                        }
                                        lastLength = match[0].length;
                                        lastLastIndex = lastIndex;
                                        if (output.length >= limit) {
                                            break;
                                        }
                                    }
                                    if (separator.lastIndex === match.index) {
                                        separator.lastIndex++;
                                    }
                                }
                                if (lastLastIndex === string.length) {
                                    if (lastLength || !separator.test('')) {
                                        output.push('');
                                    }
                                } else {
                                    output.push(string.slice(lastLastIndex));
                                }
                                return output.length > limit ? output.slice(0, limit) : output;
                            };
                        }());
                    } else if ('0'.split(void 0, 0).length) {
                        String.prototype.split = function (separator, limit) {
                            if (separator === void 0 && limit === 0)
                                return [];
                            return string_split.apply(this, arguments);
                        };
                    }
                    if (''.substr && '0b'.substr(-1) !== 'b') {
                        var string_substr = String.prototype.substr;
                        String.prototype.substr = function (start, length) {
                            return string_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
                        };
                    }
                    var ws = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
                    if (!String.prototype.trim || ws.trim()) {
                        ws = '[' + ws + ']';
                        var trimBeginRegexp = new RegExp('^' + ws + ws + '*'), trimEndRegexp = new RegExp(ws + ws + '*$');
                        String.prototype.trim = function trim() {
                            if (this === void 0 || this === null) {
                                throw new TypeError('can\'t convert ' + this + ' to object');
                            }
                            return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
                        };
                    }
                    function toInteger(n) {
                        n = +n;
                        if (n !== n) {
                            n = 0;
                        } else if (n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
                            n = (n > 0 || -1) * Math.floor(Math.abs(n));
                        }
                        return n;
                    }
                    function isPrimitive(input) {
                        var type = typeof input;
                        return input === null || type === 'undefined' || type === 'boolean' || type === 'number' || type === 'string';
                    }
                    function toPrimitive(input) {
                        var val, valueOf, toString;
                        if (isPrimitive(input)) {
                            return input;
                        }
                        valueOf = input.valueOf;
                        if (typeof valueOf === 'function') {
                            val = valueOf.call(input);
                            if (isPrimitive(val)) {
                                return val;
                            }
                        }
                        toString = input.toString;
                        if (typeof toString === 'function') {
                            val = toString.call(input);
                            if (isPrimitive(val)) {
                                return val;
                            }
                        }
                        throw new TypeError();
                    }
                    var toObject = function (o) {
                        if (o == null) {
                            throw new TypeError('can\'t convert ' + o + ' to object');
                        }
                        return Object(o);
                    };
                }));
            },
            {}
        ]
    }, {}, [7])(7);
})

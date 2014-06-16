!function (definition) {
    return typeof exports === 'object' ? module.exports = definition(require('jquery')) : typeof define === 'function' && define.amd ? define(['jquery'], definition) : window.RangeBar = definition(window.jQuery);
}(function ($) {
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
                'use strict';
                var requestAnimationFrame = _dereq_('./raf');
                var Element = function Element(html) {
                    this.$el = $(html);
                    this.$data = {};
                    this.$el.data('element', this);
                };
                $traceurRuntime.createClass(Element, {
                    draw: function (css) {
                        var $__0 = this;
                        if (this.drawing)
                            return this.$el;
                        requestAnimationFrame(function () {
                            $__0.drawing = false;
                            $__0.$el.css(css);
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
                }, {});
                module.exports = Element;
            },
            { './raf': 5 }
        ],
        2: [
            function (_dereq_, module, exports) {
                'use strict';
                var has = Object.prototype.hasOwnProperty;
                module.exports = function getEvtX(prop, event) {
                    return has.call(event, prop) ? event[prop] : event.originalEvent && has.call(event.originalEvent, 'touches') ? event.originalEvent.touches[0][prop] : 0;
                };
            },
            {}
        ],
        3: [
            function (_dereq_, module, exports) {
                'use strict';
                var Element = _dereq_('./element');
                var Indicator = function Indicator(options) {
                    $traceurRuntime.superCall(this, $Indicator.prototype, 'constructor', ['<div class="elessar-indicator">']);
                    if (options.indicatorClass)
                        this.$el.addClass(options.indicatorClass);
                    if (options.value)
                        this.val(options.value);
                };
                var $Indicator = Indicator;
                $traceurRuntime.createClass(Indicator, {
                    val: function (pos) {
                        this.draw({ left: 100 * pos + '%' });
                        return this;
                    }
                }, {}, Element);
                module.exports = Indicator;
            },
            { './element': 1 }
        ],
        4: [
            function (_dereq_, module, exports) {
                'use strict';
                var Range = _dereq_('./range');
                var requestAnimationFrame = _dereq_('./raf');
                var Phantom = function Phantom(options) {
                    $traceurRuntime.superCall(this, $Phantom.prototype, 'constructor', [$.extend({
                            readonly: true,
                            label: '+'
                        }, options)]);
                    this.$el.addClass('elessar-phantom');
                    this.on('mousedown touchstart', $.proxy(this.mousedown, this));
                };
                var $Phantom = Phantom;
                $traceurRuntime.createClass(Phantom, {
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
                }, {}, Range);
                module.exports = Phantom;
            },
            {
                './raf': 5,
                './range': 6
            }
        ],
        5: [
            function (_dereq_, module, exports) {
                'use strict';
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
                'use strict';
                var Element = _dereq_('./element');
                var getEvtX = _dereq_('./evtx');
                _dereq_('es5-shim');
                var Range = function Range(options) {
                    var $__0 = this;
                    $traceurRuntime.superCall(this, $Range.prototype, 'constructor', ['<div class="elessar-range"><span class="elessar-barlabel">']);
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
                            $__0.$el.find('.elessar-barlabel').text($__0.options.label.call($__0, range.map($.proxy($__0.parent.normalise, $__0.parent))));
                        });
                    } else {
                        this.$el.find('.elessar-barlabel').text(this.options.label);
                    }
                    this.range = [];
                    this.hasChanged = false;
                    if (this.options.value)
                        this.val(this.options.value);
                };
                var $Range = Range;
                $traceurRuntime.createClass(Range, {
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
                            this.hasChanged = true;
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
                            if (this.hasChanged)
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
                }, {}, Element);
                module.exports = Range;
            },
            {
                './element': 1,
                './evtx': 2,
                'es5-shim': 9
            }
        ],
        7: [
            function (_dereq_, module, exports) {
                'use strict';
                var Element = _dereq_('./element');
                var Range = _dereq_('./range');
                var Phantom = _dereq_('./phantom');
                var Indicator = _dereq_('./indicator');
                var getEvtX = _dereq_('./evtx');
                var RangeBar = function RangeBar(options) {
                    $traceurRuntime.superCall(this, $RangeBar.prototype, 'constructor', ['<div class="elessar-rangebar">']);
                    this.options = $.extend({}, $RangeBar.defaults, options);
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
                };
                var $RangeBar = RangeBar;
                $traceurRuntime.createClass(RangeBar, {
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
                        var $range = new Range({
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
                                this.phantom = new Phantom({
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
                }, {}, Element);
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
                var process = module.exports = {};
                process.nextTick = function () {
                    var canSetImmediate = typeof window !== 'undefined' && window.setImmediate;
                    var canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;
                    ;
                    if (canSetImmediate) {
                        return function (f) {
                            return window.setImmediate(f);
                        };
                    }
                    if (canPost) {
                        var queue = [];
                        window.addEventListener('message', function (ev) {
                            var source = ev.source;
                            if ((source === window || source === null) && ev.data === 'process-tick') {
                                ev.stopPropagation();
                                if (queue.length > 0) {
                                    var fn = queue.shift();
                                    fn();
                                }
                            }
                        }, true);
                        return function nextTick(fn) {
                            queue.push(fn);
                            window.postMessage('process-tick', '*');
                        };
                    }
                    return function nextTick(fn) {
                        setTimeout(fn, 0);
                    };
                }();
                process.title = 'browser';
                process.browser = true;
                process.env = {};
                process.argv = [];
                process.binding = function (name) {
                    throw new Error('process.binding is not supported');
                };
                process.cwd = function () {
                    return '/';
                };
                process.chdir = function (dir) {
                    throw new Error('process.chdir is not supported');
                };
            },
            {}
        ],
        9: [
            function (_dereq_, module, exports) {
                'use strict';
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
        ],
        10: [
            function (_dereq_, module, exports) {
                (function (process, global) {
                    (function (global) {
                        'use strict';
                        if (global.$traceurRuntime) {
                            return;
                        }
                        var $Object = Object;
                        var $TypeError = TypeError;
                        var $create = $Object.create;
                        var $defineProperties = $Object.defineProperties;
                        var $defineProperty = $Object.defineProperty;
                        var $freeze = $Object.freeze;
                        var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
                        var $getOwnPropertyNames = $Object.getOwnPropertyNames;
                        var $keys = $Object.keys;
                        var $hasOwnProperty = $Object.prototype.hasOwnProperty;
                        var $toString = $Object.prototype.toString;
                        var $preventExtensions = Object.preventExtensions;
                        var $seal = Object.seal;
                        var $isExtensible = Object.isExtensible;
                        function nonEnum(value) {
                            return {
                                configurable: true,
                                enumerable: false,
                                value: value,
                                writable: true
                            };
                        }
                        var types = {
                                void: function voidType() {
                                },
                                any: function any() {
                                },
                                string: function string() {
                                },
                                number: function number() {
                                },
                                boolean: function boolean() {
                                }
                            };
                        var method = nonEnum;
                        var counter = 0;
                        function newUniqueString() {
                            return '__$' + Math.floor(Math.random() * 1000000000) + '$' + ++counter + '$__';
                        }
                        var symbolInternalProperty = newUniqueString();
                        var symbolDescriptionProperty = newUniqueString();
                        var symbolDataProperty = newUniqueString();
                        var symbolValues = $create(null);
                        var privateNames = $create(null);
                        function createPrivateName() {
                            var s = newUniqueString();
                            privateNames[s] = true;
                            return s;
                        }
                        function isSymbol(symbol) {
                            return typeof symbol === 'object' && symbol instanceof SymbolValue;
                        }
                        function typeOf(v) {
                            if (isSymbol(v))
                                return 'symbol';
                            return typeof v;
                        }
                        function Symbol(description) {
                            var value = new SymbolValue(description);
                            if (!(this instanceof Symbol))
                                return value;
                            throw new TypeError('Symbol cannot be new\'ed');
                        }
                        $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
                        $defineProperty(Symbol.prototype, 'toString', method(function () {
                            var symbolValue = this[symbolDataProperty];
                            if (!getOption('symbols'))
                                return symbolValue[symbolInternalProperty];
                            if (!symbolValue)
                                throw TypeError('Conversion from symbol to string');
                            var desc = symbolValue[symbolDescriptionProperty];
                            if (desc === undefined)
                                desc = '';
                            return 'Symbol(' + desc + ')';
                        }));
                        $defineProperty(Symbol.prototype, 'valueOf', method(function () {
                            var symbolValue = this[symbolDataProperty];
                            if (!symbolValue)
                                throw TypeError('Conversion from symbol to string');
                            if (!getOption('symbols'))
                                return symbolValue[symbolInternalProperty];
                            return symbolValue;
                        }));
                        function SymbolValue(description) {
                            var key = newUniqueString();
                            $defineProperty(this, symbolDataProperty, { value: this });
                            $defineProperty(this, symbolInternalProperty, { value: key });
                            $defineProperty(this, symbolDescriptionProperty, { value: description });
                            freeze(this);
                            symbolValues[key] = this;
                        }
                        $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
                        $defineProperty(SymbolValue.prototype, 'toString', {
                            value: Symbol.prototype.toString,
                            enumerable: false
                        });
                        $defineProperty(SymbolValue.prototype, 'valueOf', {
                            value: Symbol.prototype.valueOf,
                            enumerable: false
                        });
                        var hashProperty = createPrivateName();
                        var hashPropertyDescriptor = { value: undefined };
                        var hashObjectProperties = {
                                hash: { value: undefined },
                                self: { value: undefined }
                            };
                        var hashCounter = 0;
                        function getOwnHashObject(object) {
                            var hashObject = object[hashProperty];
                            if (hashObject && hashObject.self === object)
                                return hashObject;
                            if ($isExtensible(object)) {
                                hashObjectProperties.hash.value = hashCounter++;
                                hashObjectProperties.self.value = object;
                                hashPropertyDescriptor.value = $create(null, hashObjectProperties);
                                $defineProperty(object, hashProperty, hashPropertyDescriptor);
                                return hashPropertyDescriptor.value;
                            }
                            return undefined;
                        }
                        function freeze(object) {
                            getOwnHashObject(object);
                            return $freeze.apply(this, arguments);
                        }
                        function preventExtensions(object) {
                            getOwnHashObject(object);
                            return $preventExtensions.apply(this, arguments);
                        }
                        function seal(object) {
                            getOwnHashObject(object);
                            return $seal.apply(this, arguments);
                        }
                        Symbol.iterator = Symbol();
                        freeze(SymbolValue.prototype);
                        function toProperty(name) {
                            if (isSymbol(name))
                                return name[symbolInternalProperty];
                            return name;
                        }
                        function getOwnPropertyNames(object) {
                            var rv = [];
                            var names = $getOwnPropertyNames(object);
                            for (var i = 0; i < names.length; i++) {
                                var name = names[i];
                                if (!symbolValues[name] && !privateNames[name])
                                    rv.push(name);
                            }
                            return rv;
                        }
                        function getOwnPropertyDescriptor(object, name) {
                            return $getOwnPropertyDescriptor(object, toProperty(name));
                        }
                        function getOwnPropertySymbols(object) {
                            var rv = [];
                            var names = $getOwnPropertyNames(object);
                            for (var i = 0; i < names.length; i++) {
                                var symbol = symbolValues[names[i]];
                                if (symbol)
                                    rv.push(symbol);
                            }
                            return rv;
                        }
                        function hasOwnProperty(name) {
                            return $hasOwnProperty.call(this, toProperty(name));
                        }
                        function getOption(name) {
                            return global.traceur && global.traceur.options[name];
                        }
                        function setProperty(object, name, value) {
                            var sym, desc;
                            if (isSymbol(name)) {
                                sym = name;
                                name = name[symbolInternalProperty];
                            }
                            object[name] = value;
                            if (sym && (desc = $getOwnPropertyDescriptor(object, name)))
                                $defineProperty(object, name, { enumerable: false });
                            return value;
                        }
                        function defineProperty(object, name, descriptor) {
                            if (isSymbol(name)) {
                                if (descriptor.enumerable) {
                                    descriptor = $create(descriptor, { enumerable: { value: false } });
                                }
                                name = name[symbolInternalProperty];
                            }
                            $defineProperty(object, name, descriptor);
                            return object;
                        }
                        function polyfillObject(Object) {
                            $defineProperty(Object, 'defineProperty', { value: defineProperty });
                            $defineProperty(Object, 'getOwnPropertyNames', { value: getOwnPropertyNames });
                            $defineProperty(Object, 'getOwnPropertyDescriptor', { value: getOwnPropertyDescriptor });
                            $defineProperty(Object.prototype, 'hasOwnProperty', { value: hasOwnProperty });
                            $defineProperty(Object, 'freeze', { value: freeze });
                            $defineProperty(Object, 'preventExtensions', { value: preventExtensions });
                            $defineProperty(Object, 'seal', { value: seal });
                            Object.getOwnPropertySymbols = getOwnPropertySymbols;
                        }
                        function exportStar(object) {
                            for (var i = 1; i < arguments.length; i++) {
                                var names = $getOwnPropertyNames(arguments[i]);
                                for (var j = 0; j < names.length; j++) {
                                    var name = names[j];
                                    if (privateNames[name])
                                        continue;
                                    (function (mod, name) {
                                        $defineProperty(object, name, {
                                            get: function () {
                                                return mod[name];
                                            },
                                            enumerable: true
                                        });
                                    }(arguments[i], names[j]));
                                }
                            }
                            return object;
                        }
                        function isObject(x) {
                            return x != null && (typeof x === 'object' || typeof x === 'function');
                        }
                        function toObject(x) {
                            if (x == null)
                                throw $TypeError();
                            return $Object(x);
                        }
                        function assertObject(x) {
                            if (!isObject(x))
                                throw $TypeError(x + ' is not an Object');
                            return x;
                        }
                        function setupGlobals(global) {
                            global.Symbol = Symbol;
                            polyfillObject(global.Object);
                        }
                        setupGlobals(global);
                        global.$traceurRuntime = {
                            assertObject: assertObject,
                            createPrivateName: createPrivateName,
                            exportStar: exportStar,
                            getOwnHashObject: getOwnHashObject,
                            privateNames: privateNames,
                            setProperty: setProperty,
                            setupGlobals: setupGlobals,
                            toObject: toObject,
                            toProperty: toProperty,
                            type: types,
                            typeof: typeOf,
                            defineProperties: $defineProperties,
                            defineProperty: $defineProperty,
                            getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
                            getOwnPropertyNames: $getOwnPropertyNames,
                            keys: $keys
                        };
                    }(typeof global !== 'undefined' ? global : this));
                    (function () {
                        'use strict';
                        var toObject = $traceurRuntime.toObject;
                        function spread() {
                            var rv = [], k = 0;
                            for (var i = 0; i < arguments.length; i++) {
                                var valueToSpread = toObject(arguments[i]);
                                for (var j = 0; j < valueToSpread.length; j++) {
                                    rv[k++] = valueToSpread[j];
                                }
                            }
                            return rv;
                        }
                        $traceurRuntime.spread = spread;
                    }());
                    (function () {
                        'use strict';
                        var $Object = Object;
                        var $TypeError = TypeError;
                        var $create = $Object.create;
                        var $defineProperties = $traceurRuntime.defineProperties;
                        var $defineProperty = $traceurRuntime.defineProperty;
                        var $getOwnPropertyDescriptor = $traceurRuntime.getOwnPropertyDescriptor;
                        var $getOwnPropertyNames = $traceurRuntime.getOwnPropertyNames;
                        var $getPrototypeOf = Object.getPrototypeOf;
                        function superDescriptor(homeObject, name) {
                            var proto = $getPrototypeOf(homeObject);
                            do {
                                var result = $getOwnPropertyDescriptor(proto, name);
                                if (result)
                                    return result;
                                proto = $getPrototypeOf(proto);
                            } while (proto);
                            return undefined;
                        }
                        function superCall(self, homeObject, name, args) {
                            return superGet(self, homeObject, name).apply(self, args);
                        }
                        function superGet(self, homeObject, name) {
                            var descriptor = superDescriptor(homeObject, name);
                            if (descriptor) {
                                if (!descriptor.get)
                                    return descriptor.value;
                                return descriptor.get.call(self);
                            }
                            return undefined;
                        }
                        function superSet(self, homeObject, name, value) {
                            var descriptor = superDescriptor(homeObject, name);
                            if (descriptor && descriptor.set) {
                                descriptor.set.call(self, value);
                                return value;
                            }
                            throw $TypeError('super has no setter \'' + name + '\'.');
                        }
                        function getDescriptors(object) {
                            var descriptors = {}, name, names = $getOwnPropertyNames(object);
                            for (var i = 0; i < names.length; i++) {
                                var name = names[i];
                                descriptors[name] = $getOwnPropertyDescriptor(object, name);
                            }
                            return descriptors;
                        }
                        function createClass(ctor, object, staticObject, superClass) {
                            $defineProperty(object, 'constructor', {
                                value: ctor,
                                configurable: true,
                                enumerable: false,
                                writable: true
                            });
                            if (arguments.length > 3) {
                                if (typeof superClass === 'function')
                                    ctor.__proto__ = superClass;
                                ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
                            } else {
                                ctor.prototype = object;
                            }
                            $defineProperty(ctor, 'prototype', {
                                configurable: false,
                                writable: false
                            });
                            return $defineProperties(ctor, getDescriptors(staticObject));
                        }
                        function getProtoParent(superClass) {
                            if (typeof superClass === 'function') {
                                var prototype = superClass.prototype;
                                if ($Object(prototype) === prototype || prototype === null)
                                    return superClass.prototype;
                            }
                            if (superClass === null)
                                return null;
                            throw new $TypeError();
                        }
                        function defaultSuperCall(self, homeObject, args) {
                            if ($getPrototypeOf(homeObject) !== null)
                                superCall(self, homeObject, 'constructor', args);
                        }
                        $traceurRuntime.createClass = createClass;
                        $traceurRuntime.defaultSuperCall = defaultSuperCall;
                        $traceurRuntime.superCall = superCall;
                        $traceurRuntime.superGet = superGet;
                        $traceurRuntime.superSet = superSet;
                    }());
                    (function () {
                        'use strict';
                        var createPrivateName = $traceurRuntime.createPrivateName;
                        var $defineProperties = $traceurRuntime.defineProperties;
                        var $defineProperty = $traceurRuntime.defineProperty;
                        var $create = Object.create;
                        var $TypeError = TypeError;
                        function nonEnum(value) {
                            return {
                                configurable: true,
                                enumerable: false,
                                value: value,
                                writable: true
                            };
                        }
                        var ST_NEWBORN = 0;
                        var ST_EXECUTING = 1;
                        var ST_SUSPENDED = 2;
                        var ST_CLOSED = 3;
                        var END_STATE = -2;
                        var RETHROW_STATE = -3;
                        function getInternalError(state) {
                            return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
                        }
                        function GeneratorContext() {
                            this.state = 0;
                            this.GState = ST_NEWBORN;
                            this.storedException = undefined;
                            this.finallyFallThrough = undefined;
                            this.sent_ = undefined;
                            this.returnValue = undefined;
                            this.tryStack_ = [];
                        }
                        GeneratorContext.prototype = {
                            pushTry: function (catchState, finallyState) {
                                if (finallyState !== null) {
                                    var finallyFallThrough = null;
                                    for (var i = this.tryStack_.length - 1; i >= 0; i--) {
                                        if (this.tryStack_[i].catch !== undefined) {
                                            finallyFallThrough = this.tryStack_[i].catch;
                                            break;
                                        }
                                    }
                                    if (finallyFallThrough === null)
                                        finallyFallThrough = RETHROW_STATE;
                                    this.tryStack_.push({
                                        finally: finallyState,
                                        finallyFallThrough: finallyFallThrough
                                    });
                                }
                                if (catchState !== null) {
                                    this.tryStack_.push({ catch: catchState });
                                }
                            },
                            popTry: function () {
                                this.tryStack_.pop();
                            },
                            get sent() {
                                this.maybeThrow();
                                return this.sent_;
                            },
                            set sent(v) {
                                this.sent_ = v;
                            },
                            get sentIgnoreThrow() {
                                return this.sent_;
                            },
                            maybeThrow: function () {
                                if (this.action === 'throw') {
                                    this.action = 'next';
                                    throw this.sent_;
                                }
                            },
                            end: function () {
                                switch (this.state) {
                                case END_STATE:
                                    return this;
                                case RETHROW_STATE:
                                    throw this.storedException;
                                default:
                                    throw getInternalError(this.state);
                                }
                            },
                            handleException: function (ex) {
                                this.GState = ST_CLOSED;
                                this.state = END_STATE;
                                throw ex;
                            }
                        };
                        function nextOrThrow(ctx, moveNext, action, x) {
                            switch (ctx.GState) {
                            case ST_EXECUTING:
                                throw new Error('"' + action + '" on executing generator');
                            case ST_CLOSED:
                                if (action == 'next') {
                                    return {
                                        value: undefined,
                                        done: true
                                    };
                                }
                                throw new Error('"' + action + '" on closed generator');
                            case ST_NEWBORN:
                                if (action === 'throw') {
                                    ctx.GState = ST_CLOSED;
                                    throw x;
                                }
                                if (x !== undefined)
                                    throw $TypeError('Sent value to newborn generator');
                            case ST_SUSPENDED:
                                ctx.GState = ST_EXECUTING;
                                ctx.action = action;
                                ctx.sent = x;
                                var value = moveNext(ctx);
                                var done = value === ctx;
                                if (done)
                                    value = ctx.returnValue;
                                ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
                                return {
                                    value: value,
                                    done: done
                                };
                            }
                        }
                        var ctxName = createPrivateName();
                        var moveNextName = createPrivateName();
                        function GeneratorFunction() {
                        }
                        function GeneratorFunctionPrototype() {
                        }
                        GeneratorFunction.prototype = GeneratorFunctionPrototype;
                        $defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
                        GeneratorFunctionPrototype.prototype = {
                            constructor: GeneratorFunctionPrototype,
                            next: function (v) {
                                return nextOrThrow(this[ctxName], this[moveNextName], 'next', v);
                            },
                            throw: function (v) {
                                return nextOrThrow(this[ctxName], this[moveNextName], 'throw', v);
                            }
                        };
                        $defineProperties(GeneratorFunctionPrototype.prototype, {
                            constructor: { enumerable: false },
                            next: { enumerable: false },
                            throw: { enumerable: false }
                        });
                        Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function () {
                            return this;
                        }));
                        function createGeneratorInstance(innerFunction, functionObject, self) {
                            var moveNext = getMoveNext(innerFunction, self);
                            var ctx = new GeneratorContext();
                            var object = $create(functionObject.prototype);
                            object[ctxName] = ctx;
                            object[moveNextName] = moveNext;
                            return object;
                        }
                        function initGeneratorFunction(functionObject) {
                            functionObject.prototype = $create(GeneratorFunctionPrototype.prototype);
                            functionObject.__proto__ = GeneratorFunctionPrototype;
                            return functionObject;
                        }
                        function AsyncFunctionContext() {
                            GeneratorContext.call(this);
                            this.err = undefined;
                            var ctx = this;
                            ctx.result = new Promise(function (resolve, reject) {
                                ctx.resolve = resolve;
                                ctx.reject = reject;
                            });
                        }
                        AsyncFunctionContext.prototype = $create(GeneratorContext.prototype);
                        AsyncFunctionContext.prototype.end = function () {
                            switch (this.state) {
                            case END_STATE:
                                this.resolve(this.returnValue);
                                break;
                            case RETHROW_STATE:
                                this.reject(this.storedException);
                                break;
                            default:
                                this.reject(getInternalError(this.state));
                            }
                        };
                        AsyncFunctionContext.prototype.handleException = function () {
                            this.state = RETHROW_STATE;
                        };
                        function asyncWrap(innerFunction, self) {
                            var moveNext = getMoveNext(innerFunction, self);
                            var ctx = new AsyncFunctionContext();
                            ctx.createCallback = function (newState) {
                                return function (value) {
                                    ctx.state = newState;
                                    ctx.value = value;
                                    moveNext(ctx);
                                };
                            };
                            ctx.errback = function (err) {
                                handleCatch(ctx, err);
                                moveNext(ctx);
                            };
                            moveNext(ctx);
                            return ctx.result;
                        }
                        function getMoveNext(innerFunction, self) {
                            return function (ctx) {
                                while (true) {
                                    try {
                                        return innerFunction.call(self, ctx);
                                    } catch (ex) {
                                        handleCatch(ctx, ex);
                                    }
                                }
                            };
                        }
                        function handleCatch(ctx, ex) {
                            ctx.storedException = ex;
                            var last = ctx.tryStack_[ctx.tryStack_.length - 1];
                            if (!last) {
                                ctx.handleException(ex);
                                return;
                            }
                            ctx.state = last.catch !== undefined ? last.catch : last.finally;
                            if (last.finallyFallThrough !== undefined)
                                ctx.finallyFallThrough = last.finallyFallThrough;
                        }
                        $traceurRuntime.asyncWrap = asyncWrap;
                        $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
                        $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
                    }());
                    (function () {
                        function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
                            var out = [];
                            if (opt_scheme) {
                                out.push(opt_scheme, ':');
                            }
                            if (opt_domain) {
                                out.push('//');
                                if (opt_userInfo) {
                                    out.push(opt_userInfo, '@');
                                }
                                out.push(opt_domain);
                                if (opt_port) {
                                    out.push(':', opt_port);
                                }
                            }
                            if (opt_path) {
                                out.push(opt_path);
                            }
                            if (opt_queryData) {
                                out.push('?', opt_queryData);
                            }
                            if (opt_fragment) {
                                out.push('#', opt_fragment);
                            }
                            return out.join('');
                        }
                        ;
                        var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
                        var ComponentIndex = {
                                SCHEME: 1,
                                USER_INFO: 2,
                                DOMAIN: 3,
                                PORT: 4,
                                PATH: 5,
                                QUERY_DATA: 6,
                                FRAGMENT: 7
                            };
                        function split(uri) {
                            return uri.match(splitRe);
                        }
                        function removeDotSegments(path) {
                            if (path === '/')
                                return '/';
                            var leadingSlash = path[0] === '/' ? '/' : '';
                            var trailingSlash = path.slice(-1) === '/' ? '/' : '';
                            var segments = path.split('/');
                            var out = [];
                            var up = 0;
                            for (var pos = 0; pos < segments.length; pos++) {
                                var segment = segments[pos];
                                switch (segment) {
                                case '':
                                case '.':
                                    break;
                                case '..':
                                    if (out.length)
                                        out.pop();
                                    else
                                        up++;
                                    break;
                                default:
                                    out.push(segment);
                                }
                            }
                            if (!leadingSlash) {
                                while (up-- > 0) {
                                    out.unshift('..');
                                }
                                if (out.length === 0)
                                    out.push('.');
                            }
                            return leadingSlash + out.join('/') + trailingSlash;
                        }
                        function joinAndCanonicalizePath(parts) {
                            var path = parts[ComponentIndex.PATH] || '';
                            path = removeDotSegments(path);
                            parts[ComponentIndex.PATH] = path;
                            return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
                        }
                        function canonicalizeUrl(url) {
                            var parts = split(url);
                            return joinAndCanonicalizePath(parts);
                        }
                        function resolveUrl(base, url) {
                            var parts = split(url);
                            var baseParts = split(base);
                            if (parts[ComponentIndex.SCHEME]) {
                                return joinAndCanonicalizePath(parts);
                            } else {
                                parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
                            }
                            for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
                                if (!parts[i]) {
                                    parts[i] = baseParts[i];
                                }
                            }
                            if (parts[ComponentIndex.PATH][0] == '/') {
                                return joinAndCanonicalizePath(parts);
                            }
                            var path = baseParts[ComponentIndex.PATH];
                            var index = path.lastIndexOf('/');
                            path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
                            parts[ComponentIndex.PATH] = path;
                            return joinAndCanonicalizePath(parts);
                        }
                        function isAbsolute(name) {
                            if (!name)
                                return false;
                            if (name[0] === '/')
                                return true;
                            var parts = split(name);
                            if (parts[ComponentIndex.SCHEME])
                                return true;
                            return false;
                        }
                        $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
                        $traceurRuntime.isAbsolute = isAbsolute;
                        $traceurRuntime.removeDotSegments = removeDotSegments;
                        $traceurRuntime.resolveUrl = resolveUrl;
                    }());
                    (function (global) {
                        'use strict';
                        var $__2 = $traceurRuntime.assertObject($traceurRuntime), canonicalizeUrl = $__2.canonicalizeUrl, resolveUrl = $__2.resolveUrl, isAbsolute = $__2.isAbsolute;
                        var moduleInstantiators = Object.create(null);
                        var baseURL;
                        if (global.location && global.location.href)
                            baseURL = resolveUrl(global.location.href, './');
                        else
                            baseURL = '';
                        var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
                            this.url = url;
                            this.value_ = uncoatedModule;
                        };
                        $traceurRuntime.createClass(UncoatedModuleEntry, {}, {});
                        var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
                            $traceurRuntime.superCall(this, $UncoatedModuleInstantiator.prototype, 'constructor', [
                                url,
                                null
                            ]);
                            this.func = func;
                        };
                        var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
                        $traceurRuntime.createClass(UncoatedModuleInstantiator, {
                            getUncoatedModule: function () {
                                if (this.value_)
                                    return this.value_;
                                return this.value_ = this.func.call(global);
                            }
                        }, {}, UncoatedModuleEntry);
                        function getUncoatedModuleInstantiator(name) {
                            if (!name)
                                return;
                            var url = ModuleStore.normalize(name);
                            return moduleInstantiators[url];
                        }
                        ;
                        var moduleInstances = Object.create(null);
                        var liveModuleSentinel = {};
                        function Module(uncoatedModule) {
                            var isLive = arguments[1];
                            var coatedModule = Object.create(null);
                            Object.getOwnPropertyNames(uncoatedModule).forEach(function (name) {
                                var getter, value;
                                if (isLive === liveModuleSentinel) {
                                    var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
                                    if (descr.get)
                                        getter = descr.get;
                                }
                                if (!getter) {
                                    value = uncoatedModule[name];
                                    getter = function () {
                                        return value;
                                    };
                                }
                                Object.defineProperty(coatedModule, name, {
                                    get: getter,
                                    enumerable: true
                                });
                            });
                            Object.preventExtensions(coatedModule);
                            return coatedModule;
                        }
                        var ModuleStore = {
                                normalize: function (name, refererName, refererAddress) {
                                    if (typeof name !== 'string')
                                        throw new TypeError('module name must be a string, not ' + typeof name);
                                    if (isAbsolute(name))
                                        return canonicalizeUrl(name);
                                    if (/[^\.]\/\.\.\//.test(name)) {
                                        throw new Error('module name embeds /../: ' + name);
                                    }
                                    if (name[0] === '.' && refererName)
                                        return resolveUrl(refererName, name);
                                    return canonicalizeUrl(name);
                                },
                                get: function (normalizedName) {
                                    var m = getUncoatedModuleInstantiator(normalizedName);
                                    if (!m)
                                        return undefined;
                                    var moduleInstance = moduleInstances[m.url];
                                    if (moduleInstance)
                                        return moduleInstance;
                                    moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
                                    return moduleInstances[m.url] = moduleInstance;
                                },
                                set: function (normalizedName, module) {
                                    normalizedName = String(normalizedName);
                                    moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, function () {
                                        return module;
                                    });
                                    moduleInstances[normalizedName] = module;
                                },
                                get baseURL() {
                                    return baseURL;
                                },
                                set baseURL(v) {
                                    baseURL = String(v);
                                },
                                registerModule: function (name, func) {
                                    var normalizedName = ModuleStore.normalize(name);
                                    if (moduleInstantiators[normalizedName])
                                        throw new Error('duplicate module named ' + normalizedName);
                                    moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
                                },
                                bundleStore: Object.create(null),
                                register: function (name, deps, func) {
                                    if (!deps || !deps.length && !func.length) {
                                        this.registerModule(name, func);
                                    } else {
                                        this.bundleStore[name] = {
                                            deps: deps,
                                            execute: function () {
                                                var $__0 = arguments;
                                                var depMap = {};
                                                deps.forEach(function (dep, index) {
                                                    return depMap[dep] = $__0[index];
                                                });
                                                var registryEntry = func.call(this, depMap);
                                                registryEntry.execute.call(this);
                                                return registryEntry.exports;
                                            }
                                        };
                                    }
                                },
                                getAnonymousModule: function (func) {
                                    return new Module(func.call(global), liveModuleSentinel);
                                },
                                getForTesting: function (name) {
                                    var $__0 = this;
                                    if (!this.testingPrefix_) {
                                        Object.keys(moduleInstances).some(function (key) {
                                            var m = /(traceur@[^\/]*\/)/.exec(key);
                                            if (m) {
                                                $__0.testingPrefix_ = m[1];
                                                return true;
                                            }
                                        });
                                    }
                                    return this.get(this.testingPrefix_ + name);
                                }
                            };
                        ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({ ModuleStore: ModuleStore }));
                        var setupGlobals = $traceurRuntime.setupGlobals;
                        $traceurRuntime.setupGlobals = function (global) {
                            setupGlobals(global);
                        };
                        $traceurRuntime.ModuleStore = ModuleStore;
                        global.System = {
                            register: ModuleStore.register.bind(ModuleStore),
                            get: ModuleStore.get,
                            set: ModuleStore.set,
                            normalize: ModuleStore.normalize
                        };
                        $traceurRuntime.getModuleImpl = function (name) {
                            var instantiator = getUncoatedModuleInstantiator(name);
                            return instantiator && instantiator.getUncoatedModule();
                        };
                    }(typeof global !== 'undefined' ? global : this));
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfills/utils', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfills/utils';
                        var toObject = $traceurRuntime.toObject;
                        function toUint32(x) {
                            return x | 0;
                        }
                        function isObject(x) {
                            return x && (typeof x === 'object' || typeof x === 'function');
                        }
                        function isCallable(x) {
                            return typeof x === 'function';
                        }
                        function toInteger(x) {
                            x = +x;
                            if (isNaN(x))
                                return 0;
                            if (!isFinite(x) || x === 0)
                                return x;
                            return x > 0 ? Math.floor(x) : Math.ceil(x);
                        }
                        var MAX_SAFE_LENGTH = Math.pow(2, 53) - 1;
                        function toLength(x) {
                            var len = toInteger(x);
                            return len < 0 ? 0 : Math.min(len, MAX_SAFE_LENGTH);
                        }
                        return {
                            get toObject() {
                                return toObject;
                            },
                            get toUint32() {
                                return toUint32;
                            },
                            get isObject() {
                                return isObject;
                            },
                            get isCallable() {
                                return isCallable;
                            },
                            get toInteger() {
                                return toInteger;
                            },
                            get toLength() {
                                return toLength;
                            }
                        };
                    });
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfills/Array', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfills/Array';
                        var $__3 = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/utils')), toInteger = $__3.toInteger, toLength = $__3.toLength, toObject = $__3.toObject, isCallable = $__3.isCallable;
                        function fill(value) {
                            var start = arguments[1] !== void 0 ? arguments[1] : 0;
                            var end = arguments[2];
                            var object = toObject(this);
                            var len = toLength(object.length);
                            var fillStart = toInteger(start);
                            var fillEnd = end !== undefined ? toInteger(end) : len;
                            fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
                            fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
                            while (fillStart < fillEnd) {
                                object[fillStart] = value;
                                fillStart++;
                            }
                            return object;
                        }
                        function find(predicate) {
                            var thisArg = arguments[1];
                            return findHelper(this, predicate, thisArg);
                        }
                        function findIndex(predicate) {
                            var thisArg = arguments[1];
                            return findHelper(this, predicate, thisArg, true);
                        }
                        function findHelper(self, predicate) {
                            var thisArg = arguments[2];
                            var returnIndex = arguments[3] !== void 0 ? arguments[3] : false;
                            var object = toObject(self);
                            var len = toLength(object.length);
                            if (!isCallable(predicate)) {
                                throw TypeError();
                            }
                            for (var i = 0; i < len; i++) {
                                if (i in object) {
                                    var value = object[i];
                                    if (predicate.call(thisArg, value, i, object)) {
                                        return returnIndex ? i : value;
                                    }
                                }
                            }
                            return returnIndex ? -1 : undefined;
                        }
                        return {
                            get fill() {
                                return fill;
                            },
                            get find() {
                                return find;
                            },
                            get findIndex() {
                                return findIndex;
                            }
                        };
                    });
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfills/ArrayIterator', [], function () {
                        'use strict';
                        var $__5;
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfills/ArrayIterator';
                        var $__6 = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/utils')), toObject = $__6.toObject, toUint32 = $__6.toUint32;
                        var ARRAY_ITERATOR_KIND_KEYS = 1;
                        var ARRAY_ITERATOR_KIND_VALUES = 2;
                        var ARRAY_ITERATOR_KIND_ENTRIES = 3;
                        var ArrayIterator = function ArrayIterator() {
                        };
                        $traceurRuntime.createClass(ArrayIterator, ($__5 = {}, Object.defineProperty($__5, 'next', {
                            value: function () {
                                var iterator = toObject(this);
                                var array = iterator.iteratorObject_;
                                if (!array) {
                                    throw new TypeError('Object is not an ArrayIterator');
                                }
                                var index = iterator.arrayIteratorNextIndex_;
                                var itemKind = iterator.arrayIterationKind_;
                                var length = toUint32(array.length);
                                if (index >= length) {
                                    iterator.arrayIteratorNextIndex_ = Infinity;
                                    return createIteratorResultObject(undefined, true);
                                }
                                iterator.arrayIteratorNextIndex_ = index + 1;
                                if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
                                    return createIteratorResultObject(array[index], false);
                                if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
                                    return createIteratorResultObject([
                                        index,
                                        array[index]
                                    ], false);
                                return createIteratorResultObject(index, false);
                            },
                            configurable: true,
                            enumerable: true,
                            writable: true
                        }), Object.defineProperty($__5, Symbol.iterator, {
                            value: function () {
                                return this;
                            },
                            configurable: true,
                            enumerable: true,
                            writable: true
                        }), $__5), {});
                        function createArrayIterator(array, kind) {
                            var object = toObject(array);
                            var iterator = new ArrayIterator();
                            iterator.iteratorObject_ = object;
                            iterator.arrayIteratorNextIndex_ = 0;
                            iterator.arrayIterationKind_ = kind;
                            return iterator;
                        }
                        function createIteratorResultObject(value, done) {
                            return {
                                value: value,
                                done: done
                            };
                        }
                        function entries() {
                            return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
                        }
                        function keys() {
                            return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
                        }
                        function values() {
                            return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
                        }
                        return {
                            get entries() {
                                return entries;
                            },
                            get keys() {
                                return keys;
                            },
                            get values() {
                                return values;
                            }
                        };
                    });
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfills/Map', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfills/Map';
                        var isObject = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/utils')).isObject;
                        var getOwnHashObject = $traceurRuntime.getOwnHashObject;
                        var $hasOwnProperty = Object.prototype.hasOwnProperty;
                        var deletedSentinel = {};
                        function lookupIndex(map, key) {
                            if (isObject(key)) {
                                var hashObject = getOwnHashObject(key);
                                return hashObject && map.objectIndex_[hashObject.hash];
                            }
                            if (typeof key === 'string')
                                return map.stringIndex_[key];
                            return map.primitiveIndex_[key];
                        }
                        function initMap(map) {
                            map.entries_ = [];
                            map.objectIndex_ = Object.create(null);
                            map.stringIndex_ = Object.create(null);
                            map.primitiveIndex_ = Object.create(null);
                            map.deletedCount_ = 0;
                        }
                        var Map = function Map() {
                            var iterable = arguments[0];
                            if (!isObject(this))
                                throw new TypeError('Constructor Map requires \'new\'');
                            if ($hasOwnProperty.call(this, 'entries_')) {
                                throw new TypeError('Map can not be reentrantly initialised');
                            }
                            initMap(this);
                            if (iterable !== null && iterable !== undefined) {
                                var iter = iterable[Symbol.iterator];
                                if (iter !== undefined) {
                                    for (var $__8 = iterable[Symbol.iterator](), $__9; !($__9 = $__8.next()).done;) {
                                        var $__10 = $traceurRuntime.assertObject($__9.value), key = $__10[0], value = $__10[1];
                                        {
                                            this.set(key, value);
                                        }
                                    }
                                }
                            }
                        };
                        $traceurRuntime.createClass(Map, {
                            get size() {
                                return this.entries_.length / 2 - this.deletedCount_;
                            },
                            get: function (key) {
                                var index = lookupIndex(this, key);
                                if (index !== undefined)
                                    return this.entries_[index + 1];
                            },
                            set: function (key, value) {
                                var objectMode = isObject(key);
                                var stringMode = typeof key === 'string';
                                var index = lookupIndex(this, key);
                                if (index !== undefined) {
                                    this.entries_[index + 1] = value;
                                } else {
                                    index = this.entries_.length;
                                    this.entries_[index] = key;
                                    this.entries_[index + 1] = value;
                                    if (objectMode) {
                                        var hashObject = getOwnHashObject(key);
                                        var hash = hashObject.hash;
                                        this.objectIndex_[hash] = index;
                                    } else if (stringMode) {
                                        this.stringIndex_[key] = index;
                                    } else {
                                        this.primitiveIndex_[key] = index;
                                    }
                                }
                                return this;
                            },
                            has: function (key) {
                                return lookupIndex(this, key) !== undefined;
                            },
                            delete: function (key) {
                                var objectMode = isObject(key);
                                var stringMode = typeof key === 'string';
                                var index;
                                var hash;
                                if (objectMode) {
                                    var hashObject = getOwnHashObject(key);
                                    if (hashObject) {
                                        index = this.objectIndex_[hash = hashObject.hash];
                                        delete this.objectIndex_[hash];
                                    }
                                } else if (stringMode) {
                                    index = this.stringIndex_[key];
                                    delete this.stringIndex_[key];
                                } else {
                                    index = this.primitiveIndex_[key];
                                    delete this.primitiveIndex_[key];
                                }
                                if (index !== undefined) {
                                    this.entries_[index] = deletedSentinel;
                                    this.entries_[index + 1] = undefined;
                                    this.deletedCount_++;
                                }
                            },
                            clear: function () {
                                initMap(this);
                            },
                            forEach: function (callbackFn) {
                                var thisArg = arguments[1];
                                for (var i = 0, len = this.entries_.length; i < len; i += 2) {
                                    var key = this.entries_[i];
                                    var value = this.entries_[i + 1];
                                    if (key === deletedSentinel)
                                        continue;
                                    callbackFn.call(thisArg, value, key, this);
                                }
                            }
                        }, {});
                        return {
                            get Map() {
                                return Map;
                            }
                        };
                    });
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfills/Object', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfills/Object';
                        var $__11 = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/utils')), toInteger = $__11.toInteger, toLength = $__11.toLength, toObject = $__11.toObject, isCallable = $__11.isCallable;
                        var $__11 = $traceurRuntime.assertObject($traceurRuntime), defineProperty = $__11.defineProperty, getOwnPropertyDescriptor = $__11.getOwnPropertyDescriptor, getOwnPropertyNames = $__11.getOwnPropertyNames, keys = $__11.keys, privateNames = $__11.privateNames;
                        function is(left, right) {
                            if (left === right)
                                return left !== 0 || 1 / left === 1 / right;
                            return left !== left && right !== right;
                        }
                        function assign(target) {
                            for (var i = 1; i < arguments.length; i++) {
                                var source = arguments[i];
                                var props = keys(source);
                                var p, length = props.length;
                                for (p = 0; p < length; p++) {
                                    var name = props[p];
                                    if (privateNames[name])
                                        continue;
                                    target[name] = source[name];
                                }
                            }
                            return target;
                        }
                        function mixin(target, source) {
                            var props = getOwnPropertyNames(source);
                            var p, descriptor, length = props.length;
                            for (p = 0; p < length; p++) {
                                var name = props[p];
                                if (privateNames[name])
                                    continue;
                                descriptor = getOwnPropertyDescriptor(source, props[p]);
                                defineProperty(target, props[p], descriptor);
                            }
                            return target;
                        }
                        return {
                            get is() {
                                return is;
                            },
                            get assign() {
                                return assign;
                            },
                            get mixin() {
                                return mixin;
                            }
                        };
                    });
                    System.register('traceur-runtime@0.0.42/node_modules/rsvp/lib/rsvp/asap', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/node_modules/rsvp/lib/rsvp/asap';
                        var $__default = function asap(callback, arg) {
                            var length = queue.push([
                                    callback,
                                    arg
                                ]);
                            if (length === 1) {
                                scheduleFlush();
                            }
                        };
                        var browserGlobal = typeof window !== 'undefined' ? window : {};
                        var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
                        function useNextTick() {
                            return function () {
                                process.nextTick(flush);
                            };
                        }
                        function useMutationObserver() {
                            var iterations = 0;
                            var observer = new BrowserMutationObserver(flush);
                            var node = document.createTextNode('');
                            observer.observe(node, { characterData: true });
                            return function () {
                                node.data = iterations = ++iterations % 2;
                            };
                        }
                        function useSetTimeout() {
                            return function () {
                                setTimeout(flush, 1);
                            };
                        }
                        var queue = [];
                        function flush() {
                            for (var i = 0; i < queue.length; i++) {
                                var tuple = queue[i];
                                var callback = tuple[0], arg = tuple[1];
                                callback(arg);
                            }
                            queue = [];
                        }
                        var scheduleFlush;
                        if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
                            scheduleFlush = useNextTick();
                        } else if (BrowserMutationObserver) {
                            scheduleFlush = useMutationObserver();
                        } else {
                            scheduleFlush = useSetTimeout();
                        }
                        return {
                            get default() {
                                return $__default;
                            }
                        };
                    });
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfills/Promise', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfills/Promise';
                        var async = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/node_modules/rsvp/lib/rsvp/asap')).default;
                        var promiseRaw = {};
                        function isPromise(x) {
                            return x && typeof x === 'object' && x.status_ !== undefined;
                        }
                        function idResolveHandler(x) {
                            return x;
                        }
                        function idRejectHandler(x) {
                            throw x;
                        }
                        function chain(promise) {
                            var onResolve = arguments[1] !== void 0 ? arguments[1] : idResolveHandler;
                            var onReject = arguments[2] !== void 0 ? arguments[2] : idRejectHandler;
                            var deferred = getDeferred(promise.constructor);
                            switch (promise.status_) {
                            case undefined:
                                throw TypeError;
                            case 0:
                                promise.onResolve_.push(onResolve, deferred);
                                promise.onReject_.push(onReject, deferred);
                                break;
                            case +1:
                                promiseEnqueue(promise.value_, [
                                    onResolve,
                                    deferred
                                ]);
                                break;
                            case -1:
                                promiseEnqueue(promise.value_, [
                                    onReject,
                                    deferred
                                ]);
                                break;
                            }
                            return deferred.promise;
                        }
                        function getDeferred(C) {
                            if (this === $Promise) {
                                var promise = promiseInit(new $Promise(promiseRaw));
                                return {
                                    promise: promise,
                                    resolve: function (x) {
                                        promiseResolve(promise, x);
                                    },
                                    reject: function (r) {
                                        promiseReject(promise, r);
                                    }
                                };
                            } else {
                                var result = {};
                                result.promise = new C(function (resolve, reject) {
                                    result.resolve = resolve;
                                    result.reject = reject;
                                });
                                return result;
                            }
                        }
                        function promiseSet(promise, status, value, onResolve, onReject) {
                            promise.status_ = status;
                            promise.value_ = value;
                            promise.onResolve_ = onResolve;
                            promise.onReject_ = onReject;
                            return promise;
                        }
                        function promiseInit(promise) {
                            return promiseSet(promise, 0, undefined, [], []);
                        }
                        var Promise = function Promise(resolver) {
                            if (resolver === promiseRaw)
                                return;
                            if (typeof resolver !== 'function')
                                throw new TypeError();
                            var promise = promiseInit(this);
                            try {
                                resolver(function (x) {
                                    promiseResolve(promise, x);
                                }, function (r) {
                                    promiseReject(promise, r);
                                });
                            } catch (e) {
                                promiseReject(promise, e);
                            }
                        };
                        $traceurRuntime.createClass(Promise, {
                            catch: function (onReject) {
                                return this.then(undefined, onReject);
                            },
                            then: function (onResolve, onReject) {
                                if (typeof onResolve !== 'function')
                                    onResolve = idResolveHandler;
                                if (typeof onReject !== 'function')
                                    onReject = idRejectHandler;
                                var that = this;
                                var constructor = this.constructor;
                                return chain(this, function (x) {
                                    x = promiseCoerce(constructor, x);
                                    return x === that ? onReject(new TypeError()) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
                                }, onReject);
                            }
                        }, {
                            resolve: function (x) {
                                if (this === $Promise) {
                                    return promiseSet(new $Promise(promiseRaw), +1, x);
                                } else {
                                    return new this(function (resolve, reject) {
                                        resolve(x);
                                    });
                                }
                            },
                            reject: function (r) {
                                if (this === $Promise) {
                                    return promiseSet(new $Promise(promiseRaw), -1, r);
                                } else {
                                    return new this(function (resolve, reject) {
                                        reject(r);
                                    });
                                }
                            },
                            cast: function (x) {
                                if (x instanceof this)
                                    return x;
                                if (isPromise(x)) {
                                    var result = getDeferred(this);
                                    chain(x, result.resolve, result.reject);
                                    return result.promise;
                                }
                                return this.resolve(x);
                            },
                            all: function (values) {
                                var deferred = getDeferred(this);
                                var resolutions = [];
                                try {
                                    var count = values.length;
                                    if (count === 0) {
                                        deferred.resolve(resolutions);
                                    } else {
                                        for (var i = 0; i < values.length; i++) {
                                            this.resolve(values[i]).then(function (i, x) {
                                                resolutions[i] = x;
                                                if (--count === 0)
                                                    deferred.resolve(resolutions);
                                            }.bind(undefined, i), function (r) {
                                                deferred.reject(r);
                                            });
                                        }
                                    }
                                } catch (e) {
                                    deferred.reject(e);
                                }
                                return deferred.promise;
                            },
                            race: function (values) {
                                var deferred = getDeferred(this);
                                try {
                                    for (var i = 0; i < values.length; i++) {
                                        this.resolve(values[i]).then(function (x) {
                                            deferred.resolve(x);
                                        }, function (r) {
                                            deferred.reject(r);
                                        });
                                    }
                                } catch (e) {
                                    deferred.reject(e);
                                }
                                return deferred.promise;
                            }
                        });
                        var $Promise = Promise;
                        var $PromiseReject = $Promise.reject;
                        function promiseResolve(promise, x) {
                            promiseDone(promise, +1, x, promise.onResolve_);
                        }
                        function promiseReject(promise, r) {
                            promiseDone(promise, -1, r, promise.onReject_);
                        }
                        function promiseDone(promise, status, value, reactions) {
                            if (promise.status_ !== 0)
                                return;
                            promiseEnqueue(value, reactions);
                            promiseSet(promise, status, value);
                        }
                        function promiseEnqueue(value, tasks) {
                            async(function () {
                                for (var i = 0; i < tasks.length; i += 2) {
                                    promiseHandle(value, tasks[i], tasks[i + 1]);
                                }
                            });
                        }
                        function promiseHandle(value, handler, deferred) {
                            try {
                                var result = handler(value);
                                if (result === deferred.promise)
                                    throw new TypeError();
                                else if (isPromise(result))
                                    chain(result, deferred.resolve, deferred.reject);
                                else
                                    deferred.resolve(result);
                            } catch (e) {
                                try {
                                    deferred.reject(e);
                                } catch (e) {
                                }
                            }
                        }
                        var thenableSymbol = '@@thenable';
                        function isObject(x) {
                            return x && (typeof x === 'object' || typeof x === 'function');
                        }
                        function promiseCoerce(constructor, x) {
                            if (!isPromise(x) && isObject(x)) {
                                var then;
                                try {
                                    then = x.then;
                                } catch (r) {
                                    var promise = $PromiseReject.call(constructor, r);
                                    x[thenableSymbol] = promise;
                                    return promise;
                                }
                                if (typeof then === 'function') {
                                    var p = x[thenableSymbol];
                                    if (p) {
                                        return p;
                                    } else {
                                        var deferred = getDeferred(constructor);
                                        x[thenableSymbol] = deferred.promise;
                                        try {
                                            then.call(x, deferred.resolve, deferred.reject);
                                        } catch (r) {
                                            deferred.reject(r);
                                        }
                                        return deferred.promise;
                                    }
                                }
                            }
                            return x;
                        }
                        return {
                            get Promise() {
                                return Promise;
                            }
                        };
                    });
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfills/String', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfills/String';
                        var $toString = Object.prototype.toString;
                        var $indexOf = String.prototype.indexOf;
                        var $lastIndexOf = String.prototype.lastIndexOf;
                        function startsWith(search) {
                            var string = String(this);
                            if (this == null || $toString.call(search) == '[object RegExp]') {
                                throw TypeError();
                            }
                            var stringLength = string.length;
                            var searchString = String(search);
                            var searchLength = searchString.length;
                            var position = arguments.length > 1 ? arguments[1] : undefined;
                            var pos = position ? Number(position) : 0;
                            if (isNaN(pos)) {
                                pos = 0;
                            }
                            var start = Math.min(Math.max(pos, 0), stringLength);
                            return $indexOf.call(string, searchString, pos) == start;
                        }
                        function endsWith(search) {
                            var string = String(this);
                            if (this == null || $toString.call(search) == '[object RegExp]') {
                                throw TypeError();
                            }
                            var stringLength = string.length;
                            var searchString = String(search);
                            var searchLength = searchString.length;
                            var pos = stringLength;
                            if (arguments.length > 1) {
                                var position = arguments[1];
                                if (position !== undefined) {
                                    pos = position ? Number(position) : 0;
                                    if (isNaN(pos)) {
                                        pos = 0;
                                    }
                                }
                            }
                            var end = Math.min(Math.max(pos, 0), stringLength);
                            var start = end - searchLength;
                            if (start < 0) {
                                return false;
                            }
                            return $lastIndexOf.call(string, searchString, start) == start;
                        }
                        function contains(search) {
                            if (this == null) {
                                throw TypeError();
                            }
                            var string = String(this);
                            var stringLength = string.length;
                            var searchString = String(search);
                            var searchLength = searchString.length;
                            var position = arguments.length > 1 ? arguments[1] : undefined;
                            var pos = position ? Number(position) : 0;
                            if (isNaN(pos)) {
                                pos = 0;
                            }
                            var start = Math.min(Math.max(pos, 0), stringLength);
                            return $indexOf.call(string, searchString, pos) != -1;
                        }
                        function repeat(count) {
                            if (this == null) {
                                throw TypeError();
                            }
                            var string = String(this);
                            var n = count ? Number(count) : 0;
                            if (isNaN(n)) {
                                n = 0;
                            }
                            if (n < 0 || n == Infinity) {
                                throw RangeError();
                            }
                            if (n == 0) {
                                return '';
                            }
                            var result = '';
                            while (n--) {
                                result += string;
                            }
                            return result;
                        }
                        function codePointAt(position) {
                            if (this == null) {
                                throw TypeError();
                            }
                            var string = String(this);
                            var size = string.length;
                            var index = position ? Number(position) : 0;
                            if (isNaN(index)) {
                                index = 0;
                            }
                            if (index < 0 || index >= size) {
                                return undefined;
                            }
                            var first = string.charCodeAt(index);
                            var second;
                            if (first >= 55296 && first <= 56319 && size > index + 1) {
                                second = string.charCodeAt(index + 1);
                                if (second >= 56320 && second <= 57343) {
                                    return (first - 55296) * 1024 + second - 56320 + 65536;
                                }
                            }
                            return first;
                        }
                        function raw(callsite) {
                            var raw = callsite.raw;
                            var len = raw.length >>> 0;
                            if (len === 0)
                                return '';
                            var s = '';
                            var i = 0;
                            while (true) {
                                s += raw[i];
                                if (i + 1 === len)
                                    return s;
                                s += arguments[++i];
                            }
                        }
                        function fromCodePoint() {
                            var codeUnits = [];
                            var floor = Math.floor;
                            var highSurrogate;
                            var lowSurrogate;
                            var index = -1;
                            var length = arguments.length;
                            if (!length) {
                                return '';
                            }
                            while (++index < length) {
                                var codePoint = Number(arguments[index]);
                                if (!isFinite(codePoint) || codePoint < 0 || codePoint > 1114111 || floor(codePoint) != codePoint) {
                                    throw RangeError('Invalid code point: ' + codePoint);
                                }
                                if (codePoint <= 65535) {
                                    codeUnits.push(codePoint);
                                } else {
                                    codePoint -= 65536;
                                    highSurrogate = (codePoint >> 10) + 55296;
                                    lowSurrogate = codePoint % 1024 + 56320;
                                    codeUnits.push(highSurrogate, lowSurrogate);
                                }
                            }
                            return String.fromCharCode.apply(null, codeUnits);
                        }
                        return {
                            get startsWith() {
                                return startsWith;
                            },
                            get endsWith() {
                                return endsWith;
                            },
                            get contains() {
                                return contains;
                            },
                            get repeat() {
                                return repeat;
                            },
                            get codePointAt() {
                                return codePointAt;
                            },
                            get raw() {
                                return raw;
                            },
                            get fromCodePoint() {
                                return fromCodePoint;
                            }
                        };
                    });
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfills/polyfills', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfills/polyfills';
                        var Map = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/Map')).Map;
                        var Promise = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/Promise')).Promise;
                        var $__14 = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/String')), codePointAt = $__14.codePointAt, contains = $__14.contains, endsWith = $__14.endsWith, fromCodePoint = $__14.fromCodePoint, repeat = $__14.repeat, raw = $__14.raw, startsWith = $__14.startsWith;
                        var $__14 = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/Array')), fill = $__14.fill, find = $__14.find, findIndex = $__14.findIndex;
                        var $__14 = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/ArrayIterator')), entries = $__14.entries, keys = $__14.keys, values = $__14.values;
                        var $__14 = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/Object')), assign = $__14.assign, is = $__14.is, mixin = $__14.mixin;
                        function maybeDefineMethod(object, name, value) {
                            if (!(name in object)) {
                                Object.defineProperty(object, name, {
                                    value: value,
                                    configurable: true,
                                    enumerable: false,
                                    writable: true
                                });
                            }
                        }
                        function maybeAddFunctions(object, functions) {
                            for (var i = 0; i < functions.length; i += 2) {
                                var name = functions[i];
                                var value = functions[i + 1];
                                maybeDefineMethod(object, name, value);
                            }
                        }
                        function polyfillPromise(global) {
                            if (!global.Promise)
                                global.Promise = Promise;
                        }
                        function polyfillCollections(global) {
                            if (!global.Map)
                                global.Map = Map;
                        }
                        function polyfillString(String) {
                            maybeAddFunctions(String.prototype, [
                                'codePointAt',
                                codePointAt,
                                'contains',
                                contains,
                                'endsWith',
                                endsWith,
                                'startsWith',
                                startsWith,
                                'repeat',
                                repeat
                            ]);
                            maybeAddFunctions(String, [
                                'fromCodePoint',
                                fromCodePoint,
                                'raw',
                                raw
                            ]);
                        }
                        function polyfillArray(Array, Symbol) {
                            maybeAddFunctions(Array.prototype, [
                                'entries',
                                entries,
                                'keys',
                                keys,
                                'values',
                                values,
                                'fill',
                                fill,
                                'find',
                                find,
                                'findIndex',
                                findIndex
                            ]);
                            if (Symbol && Symbol.iterator) {
                                Object.defineProperty(Array.prototype, Symbol.iterator, {
                                    value: values,
                                    configurable: true,
                                    enumerable: false,
                                    writable: true
                                });
                            }
                        }
                        function polyfillObject(Object) {
                            maybeAddFunctions(Object, [
                                'assign',
                                assign,
                                'is',
                                is,
                                'mixin',
                                mixin
                            ]);
                        }
                        function polyfill(global) {
                            polyfillPromise(global);
                            polyfillCollections(global);
                            polyfillString(global.String);
                            polyfillArray(global.Array, global.Symbol);
                            polyfillObject(global.Object);
                        }
                        polyfill(this);
                        var setupGlobals = $traceurRuntime.setupGlobals;
                        $traceurRuntime.setupGlobals = function (global) {
                            setupGlobals(global);
                            polyfill(global);
                        };
                        return {};
                    });
                    System.register('traceur-runtime@0.0.42/src/runtime/polyfill-import', [], function () {
                        'use strict';
                        var __moduleName = 'traceur-runtime@0.0.42/src/runtime/polyfill-import';
                        var $__16 = $traceurRuntime.assertObject(System.get('traceur-runtime@0.0.42/src/runtime/polyfills/polyfills'));
                        return {};
                    });
                    System.get('traceur-runtime@0.0.42/src/runtime/polyfill-import' + '');
                }.call(this, _dereq_('/Users/matt/Documents/Elessar/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js'), typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));
            },
            { '/Users/matt/Documents/Elessar/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js': 8 }
        ]
    }, {}, [
        10,
        7
    ])(7);
})
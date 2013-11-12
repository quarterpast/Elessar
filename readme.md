Elessar
=======

Draggable multiple range sliders
![elessar draggable range demo](demo.gif)

Installation
------------
Elessar is available via npm and Bower:

```
npm install elessar
```
```
bower install elessar
```

Using
-----

Elessar exports as a CommonJS (Node) module, an AMD module, or a browser global:
```javascript
var RangeBar = require('elessar');
```
```javascript
require(['elessar/rangebar'], function(RangeBar) { ... });
```
```html
<script src="path/to/elessar/range.js"></script>
<script src="path/to/elessar/rangebar.js"></script>
```

```RangeBar``` is a function which takes an options object and returns a jQuery element, ready to be inserted into the DOM.

Options
-------
```javascript
RangeBar({
  values: [], // array of value pairs; each pair is the min and max of the range it creates
  readonly: false, // whether this bar is read-only
  min: 0, // value at start of bar
  max: 100, // value at end of bar
  valueFormat: function(a) {return a;}, // formats a value on the bar for output
  valueParse: function(a) {return a;}, // parses an output value for the bar
  snap: 0, // clamps range ends to multiples of this value (in bar units)
  minSize: 0, // smallest allowed range (in bar units)
  maxRanges: Infinity, // maximum number of ranges allowed on the bar
  bgLabels: 0 // number of value labels to write in the background of the bar
});
```

API
---
### ``.val()``
Returns array of pairs of min and max values of each range.

```javascript
bar.val(); //=> [[0,20], [34,86]]
```

### ``.val(values)``
Updates the ranges in the bar with the values. Returns the bar, for chaining.
```javascript
bar.val([[0,30], [40,68]]); //=> bar: RangeBar
```

### ``.on('changing' function(values))``
Event that triggers constantly as the value changes. Useful for reactively triggering things in your UI.

### ``.on('change' function(values))``
Event that triggers after the user has finished changing a range. Useful for updating a Backbone model.

Licence
-------
[MIT](licence.md)
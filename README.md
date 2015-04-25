Color Forge
===========

A simple color system based on the work of https://github.com/dfcreative/color-space

```
npm install color-forge
```

```js
var colorForge = require('color-forge');
```

See `doc.md` for full documentation.

Basic Usage
===========

Creating a Color Instance
-------------------------

Colors can be made with the regular constructor pattern with the parameters
`values, alpha = 1, space = 'rgb'`.

```js
var color = new Color([255, 0, 0], 1, 'rgb');
```

or since the alpha defaults to 1, and the color space defaults to 'rgb', this
can be written as follows.

```js
var color = Color.rgb([255, 0, 0]);
```

In addition, you can create a color from a hex code as follows.

```js
Color.hex('#123');
Color.hex('123');
Color.hex('#112233');
Color.hex('112233');
```

You can also create a color from a css name.

```js
Color.css('rebeccapurple');
```

See color-space for supported color spaces (it's pretty much all of them).

The format of a color object is as follows.

```js
color {
	space,
	values,
	alpha,
	/* semi-private */ originalColor
}
```

Converting Colors
-----------------

```js
color.convert('lab');
```

The result is a new object, and does not affect the original object. Additionally, the new object will store the original color, meaning unlimited conversions without loss.

```js
assert.deepEqual(
    color.convert('lab').convert('hsl').convert('rgb').convert('xyz').values,
    color.convert('xyz').values
);
```

Mixing Colors
-------------

Accepts the paremeters `otherColor, amount = 0.5, mode = 'rgb'`. Returns a new color object with the colors mixed according to amount (an amount of 0 gives color1, and 1 gives color2). Specifying a different mode will mix the color via that mode, allowing you to get even color spaces.

```js
color1.mix(color2, 0.5, 'lab');
```

Color Operations
----------------

```js
color1.add(color2);
```

All operations accept a color as the first and only argument. The available color operations are `add`, `subtract`, `multiply`, `divide`, `screen`, `overlay`, `dodge`, `burn`.

All operations are done via RGB.

Extra
-----

```js
color1.toString();     // Gives a string like 'hsl(180, 60, 20)'
color1.toHex();        // Gives the hex code
color1.toCss();        // Gives css value if exactly identical, else null
color1.toClosestCss(); // Gives closest css
```

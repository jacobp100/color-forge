'use strict';

var colorSpace = require('color-space');
var cssColors = require('./palettes/css.json');



/**
Shorthand for creation of a new color object.

@name ColorShorthand
@function

@param {Array} values - Values in the corresponding color space
@param {number} [alpha = 1] - Alpha of the color
*/


/**
Color instance

@constructor

@param {Array} values - Values in the corresponding color space
@param {number} [alpha=1] - Alpha of the color
@param {Color.spaces} [space='rgb'] - Space corresponding to the values

@property {Array} values - Values in given color space
@property {string} space - Current color space
@property {number} alpha - Alpha of tho color
@property {Color} originalColor - The color this was converted from (if
	applicable)
*/
function Color(values, spaceAlpha, space) {
	this.values = values;
	this.alpha = 1;
	this.space = 'rgb';
	this.originalColor = null;

	if (space !== undefined) {
		this.alpha = spaceAlpha;
		this.space = space;
	} else if (spaceAlpha !== undefined) {
		if (typeof spaceAlpha === 'number') {
			this.alpha = spaceAlpha;
		} else {
			this.space = spaceAlpha;
		}
	}
}
/**
Convert to string representation. Gives valid CSS representation for rgb, hsl,
and hsb. Includes alpha component if and only if the alpha is less than one.
*/
Color.prototype.toString = function toString() {
	var functionSuffix = '';
	var alphaText = '';

	if (this.alpha !== 1) {
		if (['rgb', 'hsl'].indexOf(this.space) !== -1) {
			functionSuffix = 'a';
			alphaText = ', ' + this.alpha;
		} else {
			alphaText = ', [alpha = ' + this.alpha + ']';
		}
	}

	return this.space + functionSuffix + '(' + this.values.join(', ') + alphaText + ')';
};
/**
Converts to hex representation. Includes alpha component if and only if the
alpha is less than one.
*/
Color.prototype.toHex = function toHex() {
	var hex = '#' + this.convert('rgb').values.map(function asHex(raw) {
		var hex = hexDouble(Math.min(Math.round(raw), 255));

		if (hex.length === 2) {
			return hex;
		} else {
			return '0' + hex;
		}
	}).join('');

	if (this.alpha >= 1) {
		return hex;
	} else {
		return hex + hexDouble(Math.round(this.alpha * 255));
	}
};
/**
Creates an exact copy of the current color.
*/
Color.prototype.clone = function clone() {
	var self = new Color(this.values.slice(), this.alpha, this.space);

	if (this.originalColor) {
		self.originalColor = this.originalColor.clone();
	}

	return self;
};
/**
Finds the nearest CSS4 color name within a given tolerance.

@param {number} [tolerance=0] - The maximum distance between the current color
	and the css color, with distance being calculated as the the sum of the
	absolute differences between each RGB channel.
*/
Color.prototype.toCss = function toCss(tolerance) {
	tolerance = tolerance || 0;
	var selfRgb = this.convert('rgb').values;

	return Object.keys(cssColors).map(function(name) {
		return {
			name: name,
			distance: distanceTo(name)
		};
	}).filter(function(value) {
		return value.distance <= tolerance;
	}).reduce(function(out, value) {
		if (value.distance < out.distance) {
			return value;
		} else {
			return out;
		}
	}, {
		name: null, // Return value if no values after filter
		distance: Infinity
	}).name;

	function distanceTo(name) {
		return zipValues(cssColors[name], selfRgb).reduce(function(out, zip) {
			return out + Math.abs(zip[0] - zip[1]);
		}, 0);
	}
};
/**
Finds the nearest CSS4 color name. Identical to `#toCss(255)`.
*/
Color.prototype.toClosestCss = function toClosestCss() {
	return this.toCss(255);
};
/**
Returns a new color in the given space. The new color will have the
`originalColor` property set, meaning subsequent conversions will be less
lossy.

@param {Color.spaces} space - The space in which to convert the color to
*/
Color.prototype.convert = function convert(space) {
	if (Color.spaces[space]) {
		if (this.space === space) {
			return this.clone();
		} else if (this.originalColor) {
			return this.originalColor.convert(space);
		} else {
			var newValues = colorSpace[this.space][space](this.values);

			var newColor = new Color(newValues, this.alpha, space);
			newColor.originalColor = this.clone();

			return newColor;
		}
	} else {
		throw new Error('Invalid color space: ' + space);
	}
};
/*
Returns a new color that is the result of mixing the current color with another
color.

@param {Color} other - The color
@param {number} [amount=0.5] - The ratio of the color mix, with 0 being equal
	to the current color, and 1 being equal to the other color
@param {Color.spaces} [mode='rgb'] - The space in which to perform the mix,
	with different spaces giving different outputs
*/
Color.prototype.mix = function mix(other, amountMode, mode) {
	var amount;

	if (mode === undefined) {
		if (typeof amountMode === 'number') {
			amount = amountMode;
		} else if (typeof amountMode === 'string') {
			mode = amountMode;
		}
	} else {
		amount = amountMode;
	}

	if (amount === undefined) {
		amount = 0.5;
	}

	if (mode === undefined) {
		mode = 'rgb';
	}

	var thisValues = this.convert(mode).values;
	var otherValues = other.convert(mode).values;

	var colorMode = colorSpace[mode];

	var values = zipValues(thisValues, otherValues).map(function zippedValues(zip, index) {
		var a = zip[0];
		var b = zip[1];

		if (colorMode.channel[index] === 'hue') {
			var value;

			if (Math.abs(a - b) <= 180) {
				// Clockwise (I guess?)
				value = a * (1 - amount) + b * amount;
			} else {
				// Anti-clockwise
				value = a * (1 - amount) - b * amount;
			}

			if (value < 0) {
				return value + 360;
			} else if (value >= 360) {
				return value - 360;
			} else {
				return value;
			}
		} else {
			return a * (1 - amount) + b * amount;
		}
	}).map(function(value, index) {
		// Clip values
		var max = colorMode.max[index];
		var min = colorMode.min[index];

		return Math.min(max, Math.max(min, value));
	});
	var alpha = this.alpha + (this.alpha - other.alpha) * amount;

	return new Color(values, alpha, mode);
};
/**
Returns a new color that is the result of lightening the current color.

@param {number} [amount=0.1] - The amount to lighten by, between 0 and 1
@param {Color.spaces} [mode='hsl'] - The space to use to lighten, which must
	have a lightness component
*/
Color.prototype.lighten = function lighten(amount, mode) {
	if (amount === undefined) {
		amount = 0.1;
	}

	if (mode === undefined) {
		mode = 'hsl';
	}

	var colorMode = colorSpace[mode];
	var index = colorMode.channel.indexOf('lightness');

	if (index !== -1) {
		var newColor = this.convert(mode);

		var min = colorMode.min[index];
		var max = colorMode.max[index];

		var brightness = newColor.values[index] + amount * (max - min);
		// Clip brightness to bounds
		newColor.values[index] = Math.min(max, Math.max(min, brightness));

		// This will be wrong
		newColor.originalColor = null;

		return newColor.convert(this.space);
	} else {
		throw new Error('Cannot lighten or darken with mode ' + mode);
	}
};
/**
Returns a new color that is the result of darkening the current color.

@param {number} [amount=0.1] - The amount to lighten by, between 0 and 1
@param {Color.spaces} [mode='hsl'] - The space to use to lighten, which must
	have a lightness component
*/
Color.prototype.darken = function darken(amount, mode) {
	if (amount === undefined) {
		amount = 0.1; // Otherwise will be NaN in #lighten
	}

	return this.lighten(-amount, mode);
};
/**
Returns a new color that is the result of adding the channels of the current
color and another color. The resulting color has channels clipped at a maximum
of 255, and an alpha equal to the square root of the sum of the squares of the
alpha values clipped at one.

@function

@param {Color} other - The other color used to perform the operation
*/
Color.prototype.add = colorOperationFactory(function add(zip) {
	return Math.min(zip[0] + zip[1], 255);
}, addSubtractAlphaFn);
/**
Returns a new color that is the result of subtracting the channels of the
current color and another color. The resulting color has channels clipped at a
minimum of 0, and an alpha equal to the square root of the sum of the squares
of the alpha values clipped at one.

@function

@param {Color} other - The other color used to perform the operation
*/
Color.prototype.subtract = colorOperationFactory(function subtract(zip) {
	return Math.max(zip[0] - zip[1], 0);
}, addSubtractAlphaFn);
/**
Returns a new color that is the result of multiplying the channels of the
current color and another color.

@function

@param {Color} other - The other color used to perform the operation
*/
Color.prototype.multiply = colorOperationFactory(function multiply(zip) {
	return zip[0] * zip[1] / 255;
});
/**
Returns a new color that is the result of dividing the channels of the current
color by the channels of another color. The resulting color has channels
clipped at a maximum of 255.

@function

@param {Color} other - The other color used to perform the operation
*/
Color.prototype.divide = colorOperationFactory(function divide(zip) {
	return Math.max(255 * zip[0] / zip[1], 255);
});
/**
Returns a new color that is the result of the screen operation of the current
color and another color. The equation used is 1 - (1 - a)(1 - b).

@function

@param {Color} other - The other color used to perform the operation
*/
Color.prototype.screen = colorOperationFactory(function screen(zip) {
	return 255 - (255 - zip[0]) * (255 - zip[1]) / 255;
});
/**
Returns a new color that is the result of the overlay operation of the current
color and another color. The equation used is given as follows:

	a < 0.5    2ab
	a >= 0.5   1 - 2(1 - a)(1 - b).

@function

@param {Color} other - The other color used to perform the operation
*/
Color.prototype.overlay = colorOperationFactory(function overlay(zip) {
	if (zip[0] < 128) {
		return 2 * zip[0] * zip[1] / 255;
	} else {
		return 255 - 2 * (255 - zip[0]) * (255 - zip[1]) / 255;
	}
});
/**
Returns a new color that is the result of the dodge operation of the current
color and another color. The equation used is given as follows:

	b < 1    b / (1 - a)
	b = 1    1

The resulting color has channels clipped at a maximum of 255.

@function

@param {Color} other - The other color used to perform the operation
*/
Color.prototype.dodge = colorOperationFactory(function dodge(zip) {
	if (zip[0] < 255) {
		return Math.min(255, (zip[1] * 255) / (255 - zip[0]));
	} else {
		return 255;
	}
});
/**
Returns a new color that is the result of the dodge operation of the current
color and another color. The equation used is given as follows:

	a > 0    1 - (1 - b) / a
	a = 0    0

The resulting color has channels clipped at a maximum of 255.

@function

@param {Color} other - The other color used to perform the operation
*/
Color.prototype.burn = colorOperationFactory(function burn(zip) {
	if (zip[0] >= 0) {
		return Math.max(0, 255 - 255 * (255 - zip[1]) / zip[0]);
	} else {
		return 0;
	}
});
/**
Returns a new color that is the result of raising each power to an exponent.
The resulting color has channels clipped at a maximum of 255.

@function

@param {number} power - The power to raise each channel by
*/
Color.prototype.exponent = function exponent(power) {
	var values = this.convert('rgb').values.map(function(value) {
		return Math.min(Math.pow(value / 255, power), 255) * 255;
	});
	var alpha = Math.pow(this.alpha, power);

	return new Color(values, alpha, 'rgb');
};



/**
Available spaces for colors. Check`color-space` to ensure up-to-dateness. Note
that all these values exist on the Color object as a shorthand described in
{@link ColorShorthand}.

@readonly
@enum

@property {string} ciecam
@property {string} cmy
@property {string} cmyk
@property {string} hsl
@property {string} hsv
@property {string} husl
@property {string} huslp
@property {string} hwb
@property {string} lab
@property {string} labh
@property {string} lchab
@property {string} lchuv
@property {string} lms
@property {string} luv
@property {string} rgb
@property {string} xyy
@property {string} xyz
*/
Color.spaces = Object.freeze(Object.keys(colorSpace).reduce(function(out, name) {
	out[name] = name;
	return out;
}, {}));
/**
@memberof Color
@member {ColorShorthand} ciecam
*/
/**
@memberof Color
@member {ColorShorthand} cmyk
*/
/**
@memberof Color
@member {ColorShorthand} cmy
*/
/**
@memberof Color
@member {ColorShorthand} rgb
*/
/**
@memberof Color
@member {ColorShorthand} hsl
*/
/**
@memberof Color
@member {ColorShorthand} hsv
*/
/**
@memberof Color
@member {ColorShorthand} husl
*/
/**
@memberof Color
@member {ColorShorthand} huslp
*/
/**
@memberof Color
@member {ColorShorthand} hwb
*/
/**
@memberof Color
@member {ColorShorthand} lab
*/
/**
@memberof Color
@member {ColorShorthand} labh
*/
/**
@memberof Color
@member {ColorShorthand} lchab
*/
/**
@memberof Color
@member {ColorShorthand} lchuv
*/
/**
@memberof Color
@member {ColorShorthand} lms
*/
/**
@memberof Color
@member {ColorShorthand} luv
*/
/**
@memberof Color
@member {ColorShorthand} rgb
*/
/**
@memberof Color
@member {ColorShorthand} xyy
*/
/**
@memberof Color
@member {ColorShorthand} xyz
*/
// Shorthand instantiation
Object.keys(Color.spaces).forEach(function(space) {
	Color[space] = function(values, alpha) {
		if (alpha !== undefined) {
			return new Color(values, alpha, space);
		} else {
			return new Color(values, space);
		}
	};
});
/**
Shorthand for creation of a new color object using a hex value.

@param {string} hex - A hex value with either 3, 4, 6, or 8 numbers, which can
	optionally be prefixed with a hash (#)
*/
Color.hex = function hex(string) {
	if (string[0] === '#') {
		string = string.substr(1);
	}

	var len = string.length;
	var hasAlphaComponent = (len % 3 !== 0);

	if (!hasAlphaComponent && (len === 6 || len === 3)) {
		var rgb = (function(string) {

			if (len === 3) {
				return [string[0] + string[0], string[1] + string[1], string[2] + string[2]];
			} else if (len === 6) {
				return [string.substr(0, 2), string.substr(2, 2), string.substr(4, 2)];
			}
		})(string).map(function(channelString) {
			return parseInt(channelString, 16);
		});

		return new Color(rgb, 'rgb');
	} else if (hasAlphaComponent && (len === 8 || len === 4)) {
		var offset = len / 4;
		var alphaMultiplicationFactor = (len === 4) ? 17 : 1;

		var alpha = parseInt(string.substr(-offset), 16) * alphaMultiplicationFactor / 255;
		var newColor = Color.hex(string.substr(0, len - offset));
		newColor.alpha = alpha;

		return newColor;
	} else {
		throw new Error('Cannot convert from hex value ' + string);
	}
};
/**
Shorthand for creation of a new color object with a CSS4 color name.

@param {string} name - CSS4 color name
@param {number} [alpha = 1] - Alpha of the color
*/
Color.css = function css(string, alpha) {
	var rgb = cssColors[string];

	if (alpha === undefined) {
		alpha = 1;
	}

	if (rgb) {
		return new Color(rgb, alpha);
	} else {
		return null;
	}
};



function colorOperationFactory(operation, alphaFn) {
	return function(other) {
		var a = this.convert('rgb');
		var b = other.convert('rgb');

		if (!alphaFn) {
			alphaFn = function defaultAlphaFn(a, b) {
				return operation([a * 255, b * 255]) / 255;
			};
		}

		var aValues = a.values.map(function(value) {
			return value * a.alpha;
		});
		var bValues = b.values.map(function(value) {
			return value * b.alpha;
		});

		var values = zipValues(aValues, bValues).map(operation);
		var alpha = alphaFn(a.alpha, b.alpha);

		return new Color(values, alpha, 'rgb');
	};
}

function zipValues(a, b) {
	var out = [];

	for (var i = 0; i < a.length; i++) {
		out[i] = [a[i], b[i]];
	}

	return out;
}

function hexDouble(value) {
	var hex = value.toString(16);

	if (hex.length >= 2) {
		return hex.substr(0, 2);
	} else {
		return '0' + hex;
	}
}

function addSubtractAlphaFn(a, b) {
	return Math.min(Math.sqrt(a * a + b * b), 1);
}



module.exports = Color;

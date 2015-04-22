'use strict';

var colorSpace = require('color-space');



function Color(values, space) {
	this.values = values;
	this.space = space || 'rgb';
	this.originalColor = null;
}
Color.prototype.toString = function toString() {
	return this.space + '(' + this.values.join(', ') + ')';
};
Color.prototype.toHex = function toHex() {
	return '#' + this.convert('rgb').values.map(function asHex(raw) {
		var hex = Math.min(Math.round(raw), 255).toString(16);

		if (hex.length === 2) {
			return hex;
		} else {
			return '0' + hex;
		}
	}).join('');
};
Color.prototype.clone = function clone() {
	var self = new Color(this.values.slice(), this.space);

	if (this.originalColor) {
		self.originalColor = this.originalColor.clone();
	}

	return self;
};
Color.prototype.convert = function convert(space) {
	if (this.space === space) {
		return this.clone();
	} else if (this.originalColor) {
		return this.originalColor.convert(space);
	} else {
		var newValues = colorSpace[this.space][space](this.values);

		var newColor = new Color(newValues, space);
		newColor.originalColor = this.clone();

		return newColor;
	}
};
Color.prototype.mix = function mix(other, amount, mode) {
	if (amount === undefined) {
		amount = 0.5;
	}

	if (mode === undefined) {
		mode = 'rgb';
	}

	var a = this.convert(mode);
	var b = other.convert(mode);

	var colorMode = colorSpace[mode];

	var values = zipValues(a, b).map(function zippedValues(zip, index) {
		var a = zip[0];
		var b = zip[1];

		if (colorMode.channel[index] === 'hue') {
			var value;

			if (Math.abs(a - b) <= 180) {
				// Clockwise (I guess?)
				value = a + (a - b) * amount;
			} else {
				// Anti-clockwise
				value = a - (a - b) * amount;
			}

			if (value < 0) {
				return value + 360;
			} else if (value >= 360) {
				return value - 360;
			} else {
				return value;
			}
		} else {
			return a + (a - b) * amount;
		}
	});

	return new Color(values, mode);
};
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
		var brightness = newColor.values[index] + amount * (colorMode.max[index] - colorMode.min[index]);
		// Clip brightness to bounds
		newColor.values[index] = Math.min(colorMode.max[index], Math.max(colorMode.min[index], brightness));

		// This will be wrong
		newColor.originalColor = null;

		return newColor.convert(this.space);
	} else {
		throw new Error('Cannot lighten or darken with mode ' + mode);
	}
};
Color.prototype.darken = function darken(amount, mode) {
	if (amount === undefined) {
		amount = 0.1;
	}

	return this.lighten(-amount, mode);
};
Color.prototype.add = colorOperationFactory(function add(zip) {
	return Math.max(zip[0] + zip[1], 255);
});
Color.prototype.subtract = colorOperationFactory(function subtract(zip) {
	return Math.max(zip[0] - zip[1], 0);
});
Color.prototype.multiply = colorOperationFactory(function multiply(zip) {
	return zip[0] * zip[1] / 255;
});
Color.prototype.divide = colorOperationFactory(function divide(zip) {
	return Math.max(255 * zip[0] / zip[1], 255);
});
Color.prototype.screen = colorOperationFactory(function screen(zip) {
	return 255 - (255 - zip[0]) * (255 - zip[1]) / 255;
});
Color.prototype.overlay = colorOperationFactory(function overlay(zip) {
	if (zip[0] < 128) {
		return 2 * zip[0] * zip[1] / 255;
	} else {
		return 255 - 2 * (255 - zip[0]) * (255 - zip[1]) / 255;
	}
});
Color.prototype.dodge = colorOperationFactory(function dodge(zip) {
	if (zip[0] < 255) {
		return Math.min(255, (zip[1] * 255) / (255 - zip[0]));
	} else {
		return 255;
	}
});
Color.prototype.burn = colorOperationFactory(function burn(zip) {
	if (zip[0] !== 0) {
		return Math.max(0, 255 - 255 * (255 - zip[1]) / zip[0]);
	} else {
		return 0;
	}
});



// Shorthand instantiation
Object.keys(colorSpace).forEach(function(space) {
	Color[space] = function(values) {
		return new Color(values, space);
	};
});
Color.hex = function hex(string) {
	var rgb = (function(string) {
		if (string[0] === '#') {
			string = string.substr(1);
		}

		if (string.length === 3) {
			return [string[0] + string[0], string[1] + string[1], string[2] + string[2]];
		} else if (string.length === 6) {
			return [string.substr(0, 2), string.substr(2, 2), string.substr(4, 2)];
		} else {
			throw new Error('Cannot convert from hex value ' + string);
		}
	})(string).map(function(channelString) {
		return parseInt(channelString, 16);
	});

	return Color.rgb(rgb);
};



function colorOperationFactory(operation) {
	return function(other) {
		var a = this.convert('rgb');
		var b = other.convert('rgb');

		var values = zipValues(a.values, b.values).map(operation);

		return new Color(values, 'rgb');
	};
}

function zipValues(a, b) {
	var out = [];

	for (var i = 0; i < a.length; i++) {
		out[i] = [a[i], b[i]];
	}

	return out;
}



module.exports = Color;

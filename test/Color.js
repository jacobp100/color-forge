/* eslint-env node, mocha */

'use strict';

var assert = require('assert');
var colorSpace = require('color-space');
var Color = require('..');



var PERCENT_ALLOWANCE = 5;

assert.about = function about(a, b) {
	if (a.space === b.space && a.values.length === b.values.length) {
		var aValues = a.values;
		var bValues = b.values;
		var colorMode = colorSpace[a.space];

		var aboutEqual = aValues.every(function aboutB(a, index) {
			var b = bValues[index];
			var range = colorMode.max[index] - colorMode.min[index];

			return Math.abs(a - b) < PERCENT_ALLOWANCE * 100 / range; // Within some percent
		}) && (Math.abs(a.alpha - b.alpha) * 100 < PERCENT_ALLOWANCE);

		if (aboutEqual) {
			return true;
		} else {
			throw new Error('Expected values to be about equal (' + a.toString() + ' and ' + b.toString() + ')');
		}
	} else {
		throw new Error('Color spaces do not match (' + a.space + ' and ' + b.space + ')');
	}
};



describe('Color', function() {
	it('Should convert rgb to hex', function() {
		assert.equal(Color.rgb([0, 0, 0]).toHex(), '#000000');
		assert.equal(Color.rgb([128, 128, 128]).toHex(), '#808080');
		assert.equal(Color.rgb([255, 255, 255]).toHex(), '#ffffff');
		assert.equal(Color.rgb([255, 255, 255], 0.5).toHex(), '#ffffff80');
		assert.equal(Color.rgb([255, 255, 255], 0.5).toHex(), '#ffffff80');
	});
	it('Should convert colours to string format', function() {
		assert.equal(Color.rgb([255, 255, 255]).toString(), 'rgb(255, 255, 255)');
		assert.equal(Color.rgb([255, 255, 255], 0.5).toString(), 'rgba(255, 255, 255, 0.5)');
		assert.equal(Color.hsl([180, 100, 50]).toString(), 'hsl(180, 100, 50)');
		assert.equal(Color.hsl([180, 100, 50], 0.5).toString(), 'hsla(180, 100, 50, 0.5)');
		assert.equal(Color.hsv([180, 100, 50]).toString(), 'hsv(180, 100, 50)');
		assert.equal(Color.hsv([180, 100, 50], 0.5).toString(), 'hsv(180, 100, 50, [alpha = 0.5])');
	});
	it('Should recognise hex values', function() {
		assert.equal(Color.hex('#000').toHex(), '#000000');
		assert.equal(Color.hex('#000000').toHex(), '#000000');
		assert.equal(Color.hex('#888').toHex(), '#888888');
		assert.equal(Color.hex('#888888').toHex(), '#888888');
		assert.equal(Color.hex('#fff').toHex(), '#ffffff');
		assert.equal(Color.hex('#fff8').toHex(), '#ffffff88');
		assert.equal(Color.hex('#ffffff88').toHex(), '#ffffff88');
	});
	it('Should convert values to css colour names', function() {
		assert.equal(Color.hex('#f00').toCss(), 'red');
		assert.equal(Color.hex('#ff0001').toCss(), null);
		assert.equal(Color.hex('#f00').toClosestCss(), 'red');
		assert.equal(Color.hex('#ff0001').toClosestCss(), 'red');
		assert.equal(Color.hex('#639').toCss(), 'rebeccapurple');
	});
	it('Should convert css colour names to values', function() {
		assert.equal(Color.css('red').toHex(), '#ff0000');
		assert.equal(Color.css('rebeccapurple').toHex(), '#663399');
	});
	it('Should perform lossless conversions', function() {
		assert.deepEqual(
			Color.hex('#123456').convert('hsl').convert('hsv').convert('cmyk').convert('lab').convert('rgb').values,
			Color.hex('#123456').values
		);
	});
	it('Should mix colours via different modes', function() {
		assert.about(Color.hex('#f00').mix(Color.hex('#0f0'), 'rgb').convert('rgb'), Color.hex('#7f7f00'));
		assert.about(Color.hex('#f00').mix(Color.hex('#0f0'), 'hsl').convert('rgb'), Color.hex('#ffff00'));
		assert.about(Color.hex('#f00').mix(Color.hex('#0f0'), 'hsv').convert('rgb'), Color.hex('#ffff00'));
		assert.about(Color.hex('#f00').mix(Color.hex('#0f0'), 'lab').convert('rgb'), Color.hex('#c9ab00'));
		assert.about(Color.hex('#f00').mix(Color.hex('#0f0'), 'lchab').convert('rgb'), Color.hex('#d7a700'));

		assert.about(Color.hex('#800000').mix(Color.hex('#ff0000'), 0, 'rgb').convert('rgb'), Color.hex('#800000'));
		assert.about(Color.hex('#800000').mix(Color.hex('#ff0000'), 0.3, 'rgb').convert('rgb'), Color.hex('#a70000'));
	});
	// Conformance with http://sassmeister.com (where 25 on there is 0.25 here)
	it('Should darken colours via rgb', function() {
		assert.about(Color.hex('#fff').darken(0.5), Color.hex('#808080'));
		assert.about(Color.hex('#f80').darken(0.5), Color.hex('#000000'));
		assert.about(Color.hex('#000').darken(0.5), Color.hex('#000000'));
	});
	it('Should lighten colours via rgb', function() {
		assert.about(Color.hex('#fff').lighten(0.5), Color.hex('#ffffff'));
		assert.about(Color.hex('#f80').lighten(0.5), Color.hex('#ffffff'));
		assert.about(Color.hex('#000').lighten(0.5), Color.hex('#808080'));
	});
	it('Should add colours', function() {
		assert.about(Color.hex('#000').add(Color.hex('#000')), Color.hex('#000'));
		assert.about(Color.hex('#f00').add(Color.hex('#000')), Color.hex('#f00'));
		assert.about(Color.hex('#000').add(Color.hex('#f00')), Color.hex('#f00'));
		assert.about(Color.hex('#f00').add(Color.hex('#f00')), Color.hex('#f00'));
		assert.about(Color.hex('#123').add(Color.hex('#456')), Color.hex('#579'));
		assert.about(Color.hex('#abc').add(Color.hex('#def')), Color.hex('#fff'));

		assert.about(Color.hex('#88888880').add(Color.hex('#88888880')), Color.hex('#888888b5'));
	});
	it('Should subtract colours', function() {
		assert.about(Color.hex('#000').subtract(Color.hex('#000')), Color.hex('#000'));
		assert.about(Color.hex('#f00').subtract(Color.hex('#000')), Color.hex('#f00'));
		assert.about(Color.hex('#000').subtract(Color.hex('#f00')), Color.hex('#000'));
		assert.about(Color.hex('#f00').subtract(Color.hex('#f00')), Color.hex('#000'));
		assert.about(Color.hex('#123').subtract(Color.hex('#456')), Color.hex('#000'));
		assert.about(Color.hex('#456').subtract(Color.hex('#123')), Color.hex('#333'));
	});
	// http://colorblendy.com/
	it('Should multiply colours', function() {
		assert.about(Color.hex('#123').multiply(Color.hex('#456')), Color.hex('#050b14'));
		assert.about(Color.hex('#789').multiply(Color.hex('#101')), Color.hex('#08000a'));
		assert.about(Color.hex('#112').multiply(Color.hex('#131')), Color.hex('#010303'));
		assert.about(Color.hex('#415').multiply(Color.hex('#160')), Color.hex('#050700'));

		assert.about(Color.hex('#22446680').multiply(Color.hex('#88aacc80')), Color.hex('#050b1449'));
	});
	it('Should screen colours', function() {
		assert.about(Color.hex('#123').screen(Color.hex('#456')), Color.hex('#526d86'));
		assert.about(Color.hex('#789').screen(Color.hex('#101')), Color.hex('#8189a1'));
		assert.about(Color.hex('#112').screen(Color.hex('#131')), Color.hex('#224232'));
		assert.about(Color.hex('#415').screen(Color.hex('#160')), Color.hex('#527156'));

		assert.about(Color.hex('#22446680').screen(Color.hex('#88aacc80')), Color.hex('#526d86c8'));
	});
	it('Should overlay colours', function() {
		assert.about(Color.hex('#123').overlay(Color.hex('#456')), Color.hex('#091729'));
		assert.about(Color.hex('#789').overlay(Color.hex('#101')), Color.hex('#101141'));
		assert.about(Color.hex('#112').overlay(Color.hex('#131')), Color.hex('#020705'));
		assert.about(Color.hex('#415').overlay(Color.hex('#160')), Color.hex('#090e00'));

		assert.about(Color.hex('#22446680').overlay(Color.hex('#88aacc80')), Color.hex('#09172988'));
	});
	it('Should dodge colours', function() {
		assert.about(Color.hex('#123').dodge(Color.hex('#456')), Color.hex('#496280'));
		assert.about(Color.hex('#789').dodge(Color.hex('#101')), Color.hex('#20002b'));
		assert.about(Color.hex('#112').dodge(Color.hex('#131')), Color.hex('#123714'));
		assert.about(Color.hex('#415').dodge(Color.hex('#160')), Color.hex('#176e00'));

		assert.about(Color.hex('#22446680').dodge(Color.hex('#88aacc80')), Color.hex('#496280'));
	});
	it('Should burn colours', function() {
		assert.about(Color.hex('#999').burn(Color.hex('#999')), Color.hex('#545454'));
		assert.about(Color.hex('#999').burn(Color.hex('#ccc')), Color.hex('#aaaaaa'));
		assert.about(Color.hex('#ccc').burn(Color.hex('#999')), Color.hex('#7f7f7f'));
		assert.about(Color.hex('#ccc').burn(Color.hex('#ccc')), Color.hex('#bfbfbf'));

		assert.about(Color.hex('#ffffff80').burn(Color.hex('#ffffff80')), Color.hex('#02020202'));
	});
	it('Should raise to exponents', function() {
		assert.about(Color.hex('#111').exponent(2), Color.hex('#010101'));
		assert.about(Color.hex('#888').exponent(2), Color.hex('#494949'));
		assert.about(Color.hex('#fff').exponent(2), Color.hex('#ffffff'));

		assert.about(Color.hex('#1118').exponent(2), Color.hex('#01010149'));
		assert.about(Color.hex('#8888').exponent(2), Color.hex('#49494949'));
		assert.about(Color.hex('#fff8').exponent(2), Color.hex('#ffffff49'));
	});
});

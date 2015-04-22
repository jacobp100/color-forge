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
		});

		if (aboutEqual) {
			return true;
		} else {
			throw new Error('Expected values to be about equal (' + a.toString() + ' and ' + b.toString() + ')');
		}
	} else {
		throw new Error('Color spaces do not match');
	}
};



describe('Color', function() {
	it('Should convert rgb to hex', function() {
		assert.equal(Color.rgb([0, 0, 0]).toHex(), '#000000');
		assert.equal(Color.rgb([128, 128, 128]).toHex(), '#808080');
		assert.equal(Color.rgb([255, 255, 255]).toHex(), '#ffffff');
	});
	it('Should recognise hex values', function() {
		assert.equal(Color.hex('#000').toHex(), '#000000');
		assert.equal(Color.hex('#000000').toHex(), '#000000');
		assert.equal(Color.hex('#888').toHex(), '#888888');
		assert.equal(Color.hex('#888888').toHex(), '#888888');
		assert.equal(Color.hex('#fff').toHex(), '#ffffff');
		assert.equal(Color.hex('#ffffff').toHex(), '#ffffff');
	});
	it('Should convert hsl to rgb', function() {
		assert.about(Color.hsl([0, 0, 0]).convert('rgb'), Color.rgb([0, 0, 0]));
		assert.about(Color.hsl([0, 0, 50]).convert('rgb'), Color.rgb([128, 128, 128]));
		assert.about(Color.hsl([0, 0, 100]).convert('rgb'), Color.rgb([255, 255, 255]));

		assert.about(Color.hsl([0, 100, 25]).convert('rgb'), Color.rgb([128, 0, 0]));
		assert.about(Color.hsl([120, 100, 25]).convert('rgb'), Color.rgb([0, 128, 0]));
		assert.about(Color.hsl([240, 100, 25]).convert('rgb'), Color.rgb([0, 0, 128]));

		assert.about(Color.hsl([0, 100, 50]).convert('rgb'), Color.rgb([255, 0, 0]));
		assert.about(Color.hsl([30, 100, 50]).convert('rgb'), Color.rgb([255, 128, 0]));
		assert.about(Color.hsl([60, 100, 50]).convert('rgb'), Color.rgb([255, 255, 0]));
		assert.about(Color.hsl([90, 100, 50]).convert('rgb'), Color.rgb([128, 255, 0]));
		assert.about(Color.hsl([120, 100, 50]).convert('rgb'), Color.rgb([0, 255, 0]));
		assert.about(Color.hsl([150, 100, 50]).convert('rgb'), Color.rgb([0, 255, 128]));
		assert.about(Color.hsl([180, 100, 50]).convert('rgb'), Color.rgb([0, 255, 255]));
		assert.about(Color.hsl([210, 100, 50]).convert('rgb'), Color.rgb([0, 128, 255]));
		assert.about(Color.hsl([240, 100, 50]).convert('rgb'), Color.rgb([0, 0, 255]));
		assert.about(Color.hsl([270, 100, 50]).convert('rgb'), Color.rgb([128, 0, 255]));
		assert.about(Color.hsl([300, 100, 50]).convert('rgb'), Color.rgb([255, 0, 255]));
		assert.about(Color.hsl([330, 100, 50]).convert('rgb'), Color.rgb([255, 0, 128]));
	});
	// http://colorblendy.com/
	it('Should multiply colours', function() {
		assert.about(Color.hex('#123').multiply(Color.hex('#456')), Color.hex('#050b14'));
		assert.about(Color.hex('#789').multiply(Color.hex('#101')), Color.hex('#08000a'));
		assert.about(Color.hex('#112').multiply(Color.hex('#131')), Color.hex('#010303'));
		assert.about(Color.hex('#415').multiply(Color.hex('#160')), Color.hex('#050700'));
	});
	it('Should screen colours', function() {
		assert.about(Color.hex('#123').screen(Color.hex('#456')), Color.hex('#526d86'));
		assert.about(Color.hex('#789').screen(Color.hex('#101')), Color.hex('#8189a1'));
		assert.about(Color.hex('#112').screen(Color.hex('#131')), Color.hex('#224232'));
		assert.about(Color.hex('#415').screen(Color.hex('#160')), Color.hex('#527156'));
	});
	it('Should overlay colours', function() {
		assert.about(Color.hex('#123').overlay(Color.hex('#456')), Color.hex('#091729'));
		assert.about(Color.hex('#789').overlay(Color.hex('#101')), Color.hex('#101141'));
		assert.about(Color.hex('#112').overlay(Color.hex('#131')), Color.hex('#020705'));
		assert.about(Color.hex('#415').overlay(Color.hex('#160')), Color.hex('#090e00'));
	});
	it('Should dodge colours', function() {
		assert.about(Color.hex('#123').dodge(Color.hex('#456')), Color.hex('#496280'));
		assert.about(Color.hex('#789').dodge(Color.hex('#101')), Color.hex('#20002b'));
		assert.about(Color.hex('#112').dodge(Color.hex('#131')), Color.hex('#123714'));
		assert.about(Color.hex('#415').dodge(Color.hex('#160')), Color.hex('#176e00'));
	});
	it('Should burn colours', function() {
		assert.about(Color.hex('#999').burn(Color.hex('#999')), Color.hex('#545454'));
		assert.about(Color.hex('#999').burn(Color.hex('#ccc')), Color.hex('#aaaaaa'));
		assert.about(Color.hex('#ccc').burn(Color.hex('#999')), Color.hex('#7f7f7f'));
		assert.about(Color.hex('#CCC').burn(Color.hex('#CCC')), Color.hex('#bfbfbf'));
	});
});

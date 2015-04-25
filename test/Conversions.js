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



describe('Conversions', function() {
	describe('hsl', function() {
		it('Should convert rgb to hsl', function() {
			assert.about(Color.rgb([0, 0, 0]).convert('hsl'), Color.hsl([0, 0, 0]));
			assert.about(Color.rgb([128, 128, 128]).convert('hsl'), Color.hsl([0, 0, 50]));
			assert.about(Color.rgb([255, 255, 255]).convert('hsl'), Color.hsl([0, 0, 100]));

			assert.about(Color.rgb([128, 0, 0]).convert('hsl'), Color.hsl([0, 100, 25]));
			assert.about(Color.rgb([0, 128, 0]).convert('hsl'), Color.hsl([120, 100, 25]));
			assert.about(Color.rgb([0, 0, 128]).convert('hsl'), Color.hsl([240, 100, 25]));

			assert.about(Color.rgb([255, 0, 0]).convert('hsl'), Color.hsl([0, 100, 50]));
			assert.about(Color.rgb([255, 128, 0]).convert('hsl'), Color.hsl([30, 100, 50]));
			assert.about(Color.rgb([255, 255, 0]).convert('hsl'), Color.hsl([60, 100, 50]));
			assert.about(Color.rgb([128, 255, 0]).convert('hsl'), Color.hsl([90, 100, 50]));
			assert.about(Color.rgb([0, 255, 0]).convert('hsl'), Color.hsl([120, 100, 50]));
			assert.about(Color.rgb([0, 255, 128]).convert('hsl'), Color.hsl([150, 100, 50]));
			assert.about(Color.rgb([0, 255, 255]).convert('hsl'), Color.hsl([180, 100, 50]));
			assert.about(Color.rgb([0, 128, 255]).convert('hsl'), Color.hsl([210, 100, 50]));
			assert.about(Color.rgb([0, 0, 255]).convert('hsl'), Color.hsl([240, 100, 50]));
			assert.about(Color.rgb([128, 0, 255]).convert('hsl'), Color.hsl([270, 100, 50]));
			assert.about(Color.rgb([255, 0, 255]).convert('hsl'), Color.hsl([300, 100, 50]));
			assert.about(Color.rgb([255, 0, 128]).convert('hsl'), Color.hsl([330, 100, 50]));
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
	});
	describe('hsv', function() {
		it('Should convert rgb to hsv', function() {
			assert.about(Color.rgb([0, 0, 0]).convert('hsv'), Color.hsv([0, 0, 0]));
			assert.about(Color.rgb([128, 128, 128]).convert('hsv'), Color.hsv([0, 0, 50]));
			assert.about(Color.rgb([255, 255, 255]).convert('hsv'), Color.hsv([0, 0, 100]));

			assert.about(Color.rgb([128, 0, 0]).convert('hsv'), Color.hsv([0, 100, 50]));
			assert.about(Color.rgb([0, 128, 0]).convert('hsv'), Color.hsv([120, 100, 50]));
			assert.about(Color.rgb([0, 0, 128]).convert('hsv'), Color.hsv([240, 100, 50]));

			assert.about(Color.rgb([255, 0, 0]).convert('hsv'), Color.hsv([0, 100, 100]));
			assert.about(Color.rgb([255, 128, 0]).convert('hsv'), Color.hsv([30, 100, 100]));
			assert.about(Color.rgb([255, 255, 0]).convert('hsv'), Color.hsv([60, 100, 100]));
			assert.about(Color.rgb([128, 255, 0]).convert('hsv'), Color.hsv([90, 100, 100]));
			assert.about(Color.rgb([0, 255, 0]).convert('hsv'), Color.hsv([120, 100, 100]));
			assert.about(Color.rgb([0, 255, 128]).convert('hsv'), Color.hsv([150, 100, 100]));
			assert.about(Color.rgb([0, 255, 255]).convert('hsv'), Color.hsv([180, 100, 100]));
			assert.about(Color.rgb([0, 128, 255]).convert('hsv'), Color.hsv([210, 100, 100]));
			assert.about(Color.rgb([0, 0, 255]).convert('hsv'), Color.hsv([240, 100, 100]));
			assert.about(Color.rgb([128, 0, 255]).convert('hsv'), Color.hsv([270, 100, 100]));
			assert.about(Color.rgb([255, 0, 255]).convert('hsv'), Color.hsv([300, 100, 100]));
			assert.about(Color.rgb([255, 0, 128]).convert('hsv'), Color.hsv([330, 100, 100]));
		});
		it('Should convert hsv to rgb', function() {
			assert.about(Color.hsv([0, 0, 0]).convert('rgb'), Color.rgb([0, 0, 0]));
			assert.about(Color.hsv([0, 0, 50]).convert('rgb'), Color.rgb([128, 128, 128]));
			assert.about(Color.hsv([0, 0, 100]).convert('rgb'), Color.rgb([255, 255, 255]));

			assert.about(Color.hsv([0, 100, 50]).convert('rgb'), Color.rgb([128, 0, 0]));
			assert.about(Color.hsv([120, 100, 50]).convert('rgb'), Color.rgb([0, 128, 0]));
			assert.about(Color.hsv([240, 100, 50]).convert('rgb'), Color.rgb([0, 0, 128]));

			assert.about(Color.hsv([0, 100, 100]).convert('rgb'), Color.rgb([255, 0, 0]));
			assert.about(Color.hsv([30, 100, 100]).convert('rgb'), Color.rgb([255, 128, 0]));
			assert.about(Color.hsv([60, 100, 100]).convert('rgb'), Color.rgb([255, 255, 0]));
			assert.about(Color.hsv([90, 100, 100]).convert('rgb'), Color.rgb([128, 255, 0]));
			assert.about(Color.hsv([120, 100, 100]).convert('rgb'), Color.rgb([0, 255, 0]));
			assert.about(Color.hsv([150, 100, 100]).convert('rgb'), Color.rgb([0, 255, 128]));
			assert.about(Color.hsv([180, 100, 100]).convert('rgb'), Color.rgb([0, 255, 255]));
			assert.about(Color.hsv([210, 100, 100]).convert('rgb'), Color.rgb([0, 128, 255]));
			assert.about(Color.hsv([240, 100, 100]).convert('rgb'), Color.rgb([0, 0, 255]));
			assert.about(Color.hsv([270, 100, 100]).convert('rgb'), Color.rgb([128, 0, 255]));
			assert.about(Color.hsv([300, 100, 100]).convert('rgb'), Color.rgb([255, 0, 255]));
			assert.about(Color.hsv([330, 100, 100]).convert('rgb'), Color.rgb([255, 0, 128]));
		});
	});
});

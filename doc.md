## Classes
<dl>
<dt><a href="#Color">Color</a></dt>
<dd></dd>
</dl>
## Functions
<dl>
<dt><a href="#ColorShorthand">ColorShorthand(values, [alpha])</a></dt>
<dd><p>Shorthand for creation of a new color object.</p>
</dd>
</dl>
<a name="Color"></a>
## Color
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| values | <code>Array</code> | Values in given color space |
| space | <code>string</code> | Current color space |
| alpha | <code>number</code> | Alpha of tho color |
| originalColor | <code>[Color](#Color)</code> | The color this was converted from (if 	applicable) |


* [Color](#Color)
  * [new Color(values, [alpha], [space])](#new_Color_new)
  * _instance_
    * [.toString()](#Color#toString)
    * [.toHex()](#Color#toHex)
    * [.clone()](#Color#clone)
    * [.toCss([tolerance])](#Color#toCss)
    * [.toClosestCss()](#Color#toClosestCss)
    * [.convert(space)](#Color#convert)
    * [.lighten([amount], [mode])](#Color#lighten)
    * [.darken([amount], [mode])](#Color#darken)
    * [.add(other)](#Color#add)
    * [.subtract(other)](#Color#subtract)
    * [.multiply(other)](#Color#multiply)
    * [.divide(other)](#Color#divide)
    * [.screen(other)](#Color#screen)
    * [.overlay(other)](#Color#overlay)
    * [.dodge(other)](#Color#dodge)
    * [.burn(other)](#Color#burn)
  * _static_
    * [.spaces](#Color.spaces)
    * [.ciecam](#Color.ciecam) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.cmyk](#Color.cmyk) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.cmy](#Color.cmy) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.rgb](#Color.rgb) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.hsl](#Color.hsl) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.hsv](#Color.hsv) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.husl](#Color.husl) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.huslp](#Color.huslp) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.hwb](#Color.hwb) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.lab](#Color.lab) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.labh](#Color.labh) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.lchab](#Color.lchab) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.lchuv](#Color.lchuv) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.lms](#Color.lms) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.luv](#Color.luv) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.rgb](#Color.rgb) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.xyy](#Color.xyy) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.xyz](#Color.xyz) : <code>[ColorShorthand](#ColorShorthand)</code>
    * [.hex(hex)](#Color.hex)
    * [.css(name, [alpha])](#Color.css)

<a name="new_Color_new"></a>
### new Color(values, [alpha], [space])
Color instance


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| values | <code>Array</code> |  | Values in the corresponding color space |
| [alpha] | <code>number</code> | <code>1</code> | Alpha of the color |
| [space] | <code>[spaces](#Color.spaces)</code> | <code>&#x27;rgb&#x27;</code> | Space corresponding to the values |

<a name="Color#toString"></a>
### color.toString()
Convert to string representation. Gives valid CSS representation for rgb, hsl,
and hsb. Includes alpha component if and only if the alpha is less than one.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color#toHex"></a>
### color.toHex()
Converts to hex representation. Includes alpha component if and only if the
alpha is less than one.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color#clone"></a>
### color.clone()
Creates an exact copy of the current color.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color#toCss"></a>
### color.toCss([tolerance])
Finds the nearest CSS4 color name within a given tolerance.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [tolerance] | <code>number</code> | <code>0</code> | The maximum distance between the current color 	and the css color, with distance being calculated as the the sum of the 	absolute differences between each RGB channel. |

<a name="Color#toClosestCss"></a>
### color.toClosestCss()
Finds the nearest CSS4 color name. Identical to `#toCss(255)`.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color#convert"></a>
### color.convert(space)
Returns a new color in the given space. The new color will have the
`originalColor` property set, meaning subsequent conversions will be less
lossy.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| space | <code>[spaces](#Color.spaces)</code> | The space in which to convert the color to |

<a name="Color#lighten"></a>
### color.lighten([amount], [mode])
Returns a new color that is the result of lightening the current color.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [amount] | <code>number</code> | <code>0.1</code> | The amount to lighten by, between 0 and 1 |
| [mode] | <code>[spaces](#Color.spaces)</code> | <code>&#x27;hsl&#x27;</code> | The space to use to lighten, which must 	have a lightness component |

<a name="Color#darken"></a>
### color.darken([amount], [mode])
Returns a new color that is the result of darkening the current color.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [amount] | <code>number</code> | <code>0.1</code> | The amount to lighten by, between 0 and 1 |
| [mode] | <code>[spaces](#Color.spaces)</code> | <code>&#x27;hsl&#x27;</code> | The space to use to lighten, which must 	have a lightness component |

<a name="Color#add"></a>
### color.add(other)
Returns a new color that is the result of adding the channels of the current
color and another color. The resulting color has channels clipped at a maximum
of 255.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>[Color](#Color)</code> | The other color used to perform the operation |

<a name="Color#subtract"></a>
### color.subtract(other)
Returns a new color that is the result of subtracting the channels of the
current color and another color. The resulting color has channels clipped at a
minimum of 0.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>[Color](#Color)</code> | The other color used to perform the operation |

<a name="Color#multiply"></a>
### color.multiply(other)
Returns a new color that is the result of multiplying the channels of the
current color and another color.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>[Color](#Color)</code> | The other color used to perform the operation |

<a name="Color#divide"></a>
### color.divide(other)
Returns a new color that is the result of dividing the channels of the current
color by the channels of another color. The resulting color has channels
clipped at a maximum of 255.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>[Color](#Color)</code> | The other color used to perform the operation |

<a name="Color#screen"></a>
### color.screen(other)
Returns a new color that is the result of the screen operation of the current
color and another color. The equation used is 1 - (1 - a)(1 - b).

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>[Color](#Color)</code> | The other color used to perform the operation |

<a name="Color#overlay"></a>
### color.overlay(other)
Returns a new color that is the result of the overlay operation of the current
color and another color. The equation used is given as follows:

	a < 0.5    2ab
	a >= 0.5   1 - 2(1 - a)(1 - b).

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>[Color](#Color)</code> | The other color used to perform the operation |

<a name="Color#dodge"></a>
### color.dodge(other)
Returns a new color that is the result of the dodge operation of the current
color and another color. The equation used is given as follows:

	b < 1    b / (1 - a)
	b = 1    1

The resulting color has channels clipped at a maximum of 255.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>[Color](#Color)</code> | The other color used to perform the operation |

<a name="Color#burn"></a>
### color.burn(other)
Returns a new color that is the result of the dodge operation of the current
color and another color. The equation used is given as follows:

	a > 0    1 - (1 - b) / a
	a = 0    0

The resulting color has channels clipped at a maximum of 255.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>[Color](#Color)</code> | The other color used to perform the operation |

<a name="Color.spaces"></a>
### Color.spaces
Available spaces for colors. Check`color-space` to ensure up-to-dateness. Note
that all these values exist on the Color object as a shorthand described in
[ColorShorthand](#ColorShorthand).

**Kind**: static enum property of <code>[Color](#Color)</code>  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| ciecam | <code>string</code> | 
| cmy | <code>string</code> | 
| cmyk | <code>string</code> | 
| hsl | <code>string</code> | 
| hsv | <code>string</code> | 
| husl | <code>string</code> | 
| huslp | <code>string</code> | 
| hwb | <code>string</code> | 
| lab | <code>string</code> | 
| labh | <code>string</code> | 
| lchab | <code>string</code> | 
| lchuv | <code>string</code> | 
| lms | <code>string</code> | 
| luv | <code>string</code> | 
| rgb | <code>string</code> | 
| xyy | <code>string</code> | 
| xyz | <code>string</code> | 

<a name="Color.ciecam"></a>
### Color.ciecam : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.cmyk"></a>
### Color.cmyk : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.cmy"></a>
### Color.cmy : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.rgb"></a>
### Color.rgb : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.hsl"></a>
### Color.hsl : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.hsv"></a>
### Color.hsv : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.husl"></a>
### Color.husl : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.huslp"></a>
### Color.huslp : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.hwb"></a>
### Color.hwb : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.lab"></a>
### Color.lab : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.labh"></a>
### Color.labh : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.lchab"></a>
### Color.lchab : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.lchuv"></a>
### Color.lchuv : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.lms"></a>
### Color.lms : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.luv"></a>
### Color.luv : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.rgb"></a>
### Color.rgb : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.xyy"></a>
### Color.xyy : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.xyz"></a>
### Color.xyz : <code>[ColorShorthand](#ColorShorthand)</code>
**Kind**: static property of <code>[Color](#Color)</code>  
<a name="Color.hex"></a>
### Color.hex(hex)
Shorthand for creation of a new color object using a hex value.

**Kind**: static method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | A hex value with either 3, 4, 6, or 8 numbers, which can 	optionally be prefixed with a hash (#) |

<a name="Color.css"></a>
### Color.css(name, [alpha])
Shorthand for creation of a new color object with a CSS4 color name.

**Kind**: static method of <code>[Color](#Color)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | CSS4 color name |
| [alpha] | <code>number</code> | <code>1</code> | Alpha of the color |

<a name="ColorShorthand"></a>
## ColorShorthand(values, [alpha])
Shorthand for creation of a new color object.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| values | <code>Array</code> |  | Values in the corresponding color space |
| [alpha] | <code>number</code> | <code>1</code> | Alpha of the color |


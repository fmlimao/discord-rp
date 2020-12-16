function htmlentities(string, quoteStyle, charset, doubleEncode) {
    //  discuss at: https://locutus.io/php/htmlentities/
    // original by: Kevin van Zonneveld (https://kvz.io)
    //  revised by: Kevin van Zonneveld (https://kvz.io)
    //  revised by: Kevin van Zonneveld (https://kvz.io)
    // improved by: nobbler
    // improved by: Jack
    // improved by: Rafał Kukawski (https://blog.kukawski.pl)
    // improved by: Dj (https://locutus.io/php/htmlentities:425#comment_134018)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // bugfixed by: Brett Zamir (https://brett-zamir.me)
    //    input by: Ratheous
    //      note 1: function is compatible with PHP 5.2 and older
    //   example 1: htmlentities('Kevin & van Zonneveld')
    //   returns 1: 'Kevin &amp; van Zonneveld'
    //   example 2: htmlentities("foo'bar","ENT_QUOTES")
    //   returns 2: 'foo&#039;bar'
    const getHtmlTranslationTable = require('../strings/get_html_translation_table')
    const hashMap = getHtmlTranslationTable('HTML_ENTITIES', quoteStyle)
    string = string === null ? '' : string + ''
    if (!hashMap) {
        return false
    }
    if (quoteStyle && quoteStyle === 'ENT_QUOTES') {
        hashMap["'"] = '&#039;'
    }
    doubleEncode = doubleEncode === null || !!doubleEncode
    const regex = new RegExp('&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[' +
        Object.keys(hashMap)
            .join('')
            // replace regexp special chars
            .replace(/([()[\]{}\-.*+?^$|/\\])/g, '\\$1') + ']',
        'g')
    return string.replace(regex, function (ent) {
        if (ent.length > 1) {
            return doubleEncode ? hashMap['&'] + ent.substr(1) : ent
        }
        return hashMap[ent]
    })
};

function intToHex(colorInt) {
    return colorInt.toString(16).padStart(6, '0');
};

function inverseColor(srcVal) {
    const valNumerico = parseInt(srcVal, 16);
    const mascara = parseInt('FFFFFF', 16);
    const dest = valNumerico ^ mascara; //Operação XOR
    return dest.toString(16);
};

function hexToRgb(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);

    return {
        r,
        g,
        b,
    };
};

function rgbToHex(r, g, b) {
    r = r.toString(16).padStart(2, '0');
    g = g.toString(16).padStart(2, '0');
    b = b.toString(16).padStart(2, '0');
    return (r + g + b).padStart(6, '0');
};

function rgbToHsl(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;


    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;



    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {
        h,
        s,
        l,
    };
};

function hslToRgb(h, s, l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;


    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return {
        r,
        g,
        b,
    };
};

module.exports = {
    htmlentities,
    intToHex,
    inverseColor,
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
};
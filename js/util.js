function parseArray(str, delimeter) {
    if (str !== "") {
        var arr = str.split(delimeter);
        for (var i = 0; i < arr.length; i++) {
            var elem = arr[i]; // remove whitespace
            elem = elem.replace(' ', '');
            if (elem === '') {
                throw new Exception("Rindā ir lieki '" + delimeter + "'");
            }
            arr[i] = elem;
        }
        return arr;
    } else {
        throw new Exception("Rinda ir tukša");
    }
}

// from here: https://stackoverflow.com/questions/16799469/how-to-check-if-a-string-is-a-natural-number
function parseNaturalNumber(n, nullAllowed) {
    var ns = n.toString();
    var n1 = Math.abs(ns),
        n2 = parseInt(ns, 10);

    if (!isNaN(n1) && n2 === n1 && n1.toString() === ns && ((!nullAllowed && n1 > 0) || (nullAllowed && n1 >= 0))) {
        return n1;
    } else {
        return NaN;
    }
}

function Exception(message) {
    this.name = "Exception";
    this.message = message;
}

function withoutCopies(arr) {
    var tmp = [];

    for (var i = 0; i < arr.length; i++) {
        if (!contains(tmp, arr[i])) {
            tmp.push(arr[i])
        }
    }

    return tmp;
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
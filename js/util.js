function parseNaturalNonNullNumbers(str) {
    var naturalNumbers = str.split('\n');
    for (var i = 0; i < naturalNumbers.length; i++) {
        var naturalNumber = parseNaturalNonNullNumber(naturalNumbers[i]);
        if (isNaN(naturalNumber)) {
            return false;
        } else {
            naturalNumbers[i] = naturalNumber;
        }
    }
    return naturalNumbers;
}

// from here: https://stackoverflow.com/questions/16799469/how-to-check-if-a-string-is-a-natural-number
function parseNaturalNonNullNumber(n) {
    var ns = n.toString();
    var n1 = Math.abs(ns),
        n2 = parseInt(ns, 10);

    if (!isNaN(n1) && n2 === n1 && n1.toString() === ns && n1 > 0) {
        return n1;
    } else {
        return NaN;
    }
}

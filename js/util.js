function parseNaturalNonNullNumbers(str) {
    var naturalNumbers = str.split('\n');
    for (var i = 0; i < naturalNumbers.length; i++) {
        var naturalNumber = parseNatural(naturalNumbers[i]);
        if (isNaN(naturalNumber) || naturalNumber <= 0) {
            return false;
        } else {
            naturalNumbers[i] = naturalNumber;
        }
    }
    return naturalNumbers;
}

// from here: https://stackoverflow.com/questions/16799469/how-to-check-if-a-string-is-a-natural-number
function parseNatural(n) {
    n = n.toString();
    var n1 = Math.abs(n),
        n2 = parseInt(n, 10);

    if (!isNaN(n1) && n2 === n1 && n1.toString() === n) {
        return n2;
    } else {
        return NaN;
    }
}

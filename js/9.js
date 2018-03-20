var TextModel = function () {
    var testedUnits = []; // contains objects {codeLength, errorsCount}
    var codeLengthTotal;    // N
    var unitsCount;         // n
    var avgCodeLength;      // Nvid
    var avgErrorsCount;     // Bvid
    var c;
    var initialErrorsCount;

    function getAvgCodeLength() {
        return avgCodeLength;
    }

    function getAvgErrorsCount() {
        return avgErrorsCount;
    }

    function getInitialErrorsCount() {
        return initialErrorsCount;
    }

    function setup(code_length_total, units_count, tested_units) {
        testedUnits = tested_units;
        unitsCount = units_count;
        codeLengthTotal = code_length_total;

        avgCodeLength = 0;
        for (var i = 0; i < testedUnits.length; i++) {
            avgCodeLength += testedUnits[i].codeLength;
        }
        avgCodeLength /= testedUnits.length;

        var diffMin = NaN;
        for (var i = 0; i < testedUnits.length; i++) {
            var diffCurr = Math.abs(avgCodeLength - testedUnits[i].codeLength);
            if (isNaN(diffMin) || diffCurr < diffMin) {
                diffMin = diffCurr;
                avgErrorsCount = testedUnits[i].errorsCount;
            }
        }

        c = avgErrorsCount / avgCodeLength;

        initialErrorsCount = Math.floor(c * codeLengthTotal);
    }

    return {
        setup: setup,
        getAvgCodeLength: getAvgCodeLength,
        getAvgErrorsCount: getAvgErrorsCount,
        getInitialErrorsCount: getInitialErrorsCount
    };
};

function UnitData(unit_length, errors_count) {
    this.codeLength = unit_length;
    this.errorsCount = errors_count;
}

function prepareModulesData(units_lengths, units_errors) {
    var units = [];
    for (var i = 0; i < units_lengths.length; i++) {
        units.push(new UnitData(units_lengths[i], units_errors[i]));
    }
    return units;
}

var TextModel = function () {
    var testedUnits = []; // contains objects {codeLength, errorsCount}
    var codeLengthTotal;    // N
    var unitsCount;         // n
    var avgCodeLength;      // Nvid
    var avgErrorsCount;     // Bvid
    var avgFaultRate;       // c
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

    function InconsistentModelDataException(message) {
        this.name = "InconsistentModelDataException";
        this.message = message;
    }

    function setup(code_length_total, units_count, code_lengths, error_counts) {
        if (codeLengthTotal < unitsCount) {
            throw new InconsistentModelDataException("Moduļu skaitam jābūt mazākam par programmatūras garumu");
        }

        if (!code_lengths) {
            throw new InconsistentModelDataException("Koda garums modulī var būt tikai vesels pozitīvs skaitlis");
        }

        if (!error_counts) {
            throw new InconsistentModelDataException("Kļūdu skaits var būt tikai vesels pozitīvs skaitlis");
        }

        if (code_lengths.length != error_counts.length) {
            throw new InconsistentModelDataException("Moduļu skaits nesakrīt starp moduļu garumu un kļūdu skaitu sarakstiem");
        }

        var codeLengthInTestedModules = 0;
        for (var i = 0; i < code_lengths.length; i++) {
            codeLengthInTestedModules += code_lengths[i];
        }

        if (codeLengthTotal < codeLengthInTestedModules) {
            throw new InconsistentModelDataException("Notestēto moduļu summārais garums nesakrit ar visu moduļu summāro garumu");
        }

        testedUnits = prepareModulesData(code_lengths, error_counts);
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

        avgFaultRate = avgErrorsCount / avgCodeLength;

        initialErrorsCount = Math.floor(avgFaultRate * codeLengthTotal);
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

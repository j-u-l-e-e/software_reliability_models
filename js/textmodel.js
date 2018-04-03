var TextModel = function () {
    var testedUnits = [];           // contains objects {codeLength, errorsCount}
    var codeLengthTotal;            // N
    var unitsCount;                 // n
    var avgCodeLength;              // Nvid
    var avgErrorsCount;             // Bvid
    var avgFaultRate;               // c
    var initialErrorsCount;         // B
    var initialFoundErrorsCount;    // B0
    var testCoefficient;            // k

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

    function getTestCoverageString() {
        var testCoverageStr = "";
        for (var i = 0; i < testedUnits.length; i++) {
            if (testedUnits[i].testCoverageLow) {
                testCoverageStr += "Zema\n";
            } else {
                testCoverageStr += "Augsta\n";
            }
        }
        return testCoverageStr;
    }

    function setup(code_length_total, units_count, units_data, initial_found_errors_count) {
		codeLengthTotal = parseNaturalNonNullNumber(code_length_total);
		unitsCount = parseNaturalNonNullNumber(units_count);

		if (isNaN(codeLengthTotal)) {
            throw new InconsistentModelDataException("Programatūras garums var būt tikai vesels pozitīvs skaitlis lielāks par 0");
        }

        if (isNaN(unitsCount)) {
            throw new InconsistentModelDataException("Kopējais moduļu skaits var būt tikai vesels pozitīvs skaitlis lielāks par 0");
        }
		
        if (codeLengthTotal < unitsCount) {
            throw new InconsistentModelDataException("Moduļu skaitam jābūt mazākam par programmatūras garumu");
        }

        var codeLengthInTestedModules = 0;
        for (var i = 0; i < units_data.length; i++) {
            codeLengthInTestedModules += units_data.codeLength;
        }

        if (codeLengthTotal < codeLengthInTestedModules) {
            throw new InconsistentModelDataException("Notestēto moduļu summārais garums nesakrit ar visu moduļu summāro garumu");
        }

        testedUnits = units_data;
        unitsCount = units_count;
        codeLengthTotal = code_length_total;

        avgCodeLength = codeLengthTotal / unitsCount;

        var diffMin = NaN;
        for (var i = 0; i < testedUnits.length; i++) {
            var diffCurr = Math.abs(avgCodeLength - testedUnits[i].codeLength);
            if (isNaN(diffMin) || diffCurr < diffMin || (diffCurr == diffMin && avgErrorsCount < testedUnits[i].errorsCount)) {
                diffMin = diffCurr;
                avgErrorsCount = testedUnits[i].errorsCount;
            }
        }

        avgFaultRate = avgErrorsCount / avgCodeLength;

        initialErrorsCount = Math.floor(avgFaultRate * codeLengthTotal);

        initialFoundErrorsCount = parseNaturalNonNullNumber(initial_found_errors_count);
        if (!initialFoundErrorsCount) {
            throw new InconsistentModelDataException("Sākotnēji atrasto kļūdu skaits var būt tikai vesels pozitīvs skaitlis lielāks par 0 un mazāks par vidējo kļūdu skaitu");
        } else {
            testCoefficient = initialFoundErrorsCount / avgErrorsCount;

            for (var i = 0; i < testedUnits.length; i++) {
                var bk = testedUnits[i].errorsCount / testCoefficient;
                var cn = avgFaultRate * testedUnits[i].codeLength;
                testedUnits[i].testCoverageLow = bk < cn;
            }
        }
    }

    return {
        setup: setup,
        getAvgCodeLength: getAvgCodeLength,
        getAvgErrorsCount: getAvgErrorsCount,
        getInitialErrorsCount: getInitialErrorsCount,
        getTestCoverageString: getTestCoverageString
    };
};

function UnitData(unit_length, errors_count) {
    this.codeLength = parseNaturalNonNullNumber(unit_length);
    this.errorsCount = parseNaturalNonNullNumber(errors_count);
    this.testCoverageLow = true;
    if (isNaN(this.codeLength)) {
        throw new InconsistentModelDataException("Koda garums modulī var būt tikai vesels pozitīvs skaitlis lielāks par 0");
    }
    if (isNaN(this.errorsCount)) {
        throw new InconsistentModelDataException("Kļūdu skaits var būt tikai vesels pozitīvs skaitlis lielāks par 0");
    }
}

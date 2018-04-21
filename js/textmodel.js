var TextModel = (function () {
    var unitsData = -1;               // contains objects {codeLength, errorsCount}
    var codeLengthTotal = -1;           // N
    var unitsCount = -1;                // n
    var avgCodeLength = -1;             // Nvid
    var avgModuleErrorsCount = -1;      // Bvid
    var avgFaultRate = -1;              // c
    var initialErrorsCount = -1;        // B
    var initialFoundErrorsCount = -1;   // B0
    var testCoefficient = -1;           // k
    var avgLengthUnitId = -1;

    function setCodeLengthTotal(code_length_total) {
        codeLengthTotal = parseNaturalNumber(code_length_total, false);
        if (isNaN(codeLengthTotal)) {
            codeLengthTotal = -1;
            throw new Exception("Programatūras garums var būt tikai vesels pozitīvs skaitlis lielāks par 0");
        }
        chooseAvgLengthUnitId();
    }

    function setUnitsCount(units_count) {
        unitsCount = parseNaturalNumber(units_count, false);
        if (isNaN(unitsCount)) {
            codeLengthTotal = -1;
            throw new Exception("Kopējais moduļu skaits var būt tikai vesels pozitīvs skaitlis lielāks par 0");
        }
        chooseAvgLengthUnitId();
    }

    function setTestedUnits(tested_units) {
        unitsData = tested_units;
        chooseAvgLengthUnitId();
    }

    function chooseAvgLengthUnitId() {
        avgCodeLength = -1;
        avgLengthUnitId = -1;
        initialFoundErrorsCount = -1;
        if (unitsData !== -1) {
            if (codeLengthTotal > 0 && unitsCount > 0 && (codeLengthTotal >= unitsCount)) {
                var codeLengthInTestedModules = 0;
                for (var i = 0; i < unitsData.length; i++) {
                    codeLengthInTestedModules += unitsData[i].codeLength;
                }

                if (codeLengthTotal >= codeLengthInTestedModules) {
                    avgCodeLength = codeLengthTotal / unitsCount;
                    var diffMin = NaN;
                    for (var i = 0; i < unitsData.length; i++) {
                        var diffCurr = Math.abs(avgCodeLength - unitsData[i].codeLength);
                        if (isNaN(diffMin) || diffCurr < diffMin || (diffCurr === diffMin && avgModuleErrorsCount < unitsData[i].errorsCount)) {
                            diffMin = diffCurr;
                            avgLengthUnitId = i;
                            initialFoundErrorsCount = unitsData[i].errorsCount;
                        }
                    }
                }
            }
        }
    }

    function setAvgErrorsCount(avg_module_errors_count) {
        if (avgLengthUnitId >= 0) {
            avgModuleErrorsCount = avg_module_errors_count;
            if (avg_module_errors_count >= 0) {
                avgModuleErrorsCount = avg_module_errors_count;
            } else {
                throw new Exception("Kļūdu skaits nevar būt negatīvs skaitlis");
            }
        } else {
            throw new Exception("Nav zināms vidēja garuma modulis");
        }

    }

    function getAvgLengthUnitId() {
        if (avgLengthUnitId >= 0) return avgLengthUnitId + 1; // make index starting from 1
        else return avgLengthUnitId;
    }

    function getAvgCodeLength() {
        return avgCodeLength;
    }

    function getInitialErrorsCount() {
        return initialErrorsCount;
    }

    function getTestCoverageString() {
        var testCoverageStr = "";
        for (var i = 0; i < unitsData.length; i++) {
            if (unitsData[i].testCoverageLow === -1) {
                testCoverageStr += "\n";
            } else {
                if (unitsData[i].testCoverageLow) {
                    testCoverageStr += "Zema\n";
                } else {
                    testCoverageStr += "Augsta\n";
                }
            }
        }
        return testCoverageStr;
    }

    function getUnitsData() {
        return unitsData;
    }

    function calc() {
        if (codeLengthTotal === -1) {
            throw new Exception("N jābūt lielākam par 0");
        }

        if (unitsCount === -1) {
            throw new Exception("n jābūt lielākam par 0");
        }

        if (codeLengthTotal < unitsCount) {
            throw new Exception("n jābūt mazākam par N");
        }

        if (unitsData.length > unitsCount) {
            throw new Exception("Notestēto moduļu skaits nevar būt lielāks par n");
        }

        if (avgModuleErrorsCount === -1) {
            throw new Exception("Bvid jābūt lielākam par 0");
        }

        avgFaultRate = avgModuleErrorsCount / avgCodeLength;

        initialErrorsCount = Math.floor(avgFaultRate * codeLengthTotal);

        if (initialFoundErrorsCount >= 0) {
            if (isNaN(initialFoundErrorsCount)) {
                throw new Exception("Sākotnēji atrasto kļūdu skaits var būt tikai vesels pozitīvs skaitlis lielāks par 0 un mazāks par vidējo kļūdu skaitu");
            } else {
                testCoefficient = initialFoundErrorsCount / avgModuleErrorsCount;

                for (var i = 0; i < unitsData.length; i++) {
                    var bk = unitsData[i].errorsCount / testCoefficient;
                    var cn = avgFaultRate * unitsData[i].codeLength;
                    unitsData[i].testCoverageLow = bk < cn;
                }
            }
        }
    }

    return {
        calc: calc,
        getAvgLengthUnitId: getAvgLengthUnitId,
        getAvgCodeLength: getAvgCodeLength,
        getInitialErrorsCount: getInitialErrorsCount,
        getTestCoverageString: getTestCoverageString,
        getUnitsData: getUnitsData,
        setCodeLengthTotal: setCodeLengthTotal,
        setUnitsCount: setUnitsCount,
        setTestedUnits: setTestedUnits,
        setAvgErrorsCount: setAvgErrorsCount
    };
})();

function UnitData(unit_length, errors_count) {
    this.codeLength = parseNaturalNumber(unit_length, false);
    this.errorsCount = parseNaturalNumber(errors_count, false);
    this.testCoverageLow = -1;
    if (isNaN(this.codeLength)) {
        throw new Exception("Koda garums modulī var būt tikai vesels pozitīvs skaitlis lielāks par 0");
    }
    if (isNaN(this.errorsCount)) {
        throw new Exception("Kļūdu skaits var būt tikai vesels pozitīvs skaitlis lielāks par 0");
    }
}

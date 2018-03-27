var WeibullModel = function () {
    var failureTimes;
    var timeCurr;
    var scale = 0; // β
    var shape = 0; // α
    var reliability;
    var failureRate;
    var MTTF; // Mean Time to Failure
    var tolerance = 0.001;

    function getReliability() {
        return reliability;
    }

    function getFailureRate() {
        return reliability;
    }

    function setup(failure_times, time_curr) {
        timeCurr = parseNaturalNonNullNumber(time_curr);

        if (isNaN(timeCurr)) {
            throw new InconsistentModelDataException("Laiks var būt tikai vesels pozitīvs skaitlis lielāks par 0");
        }

        if (!failure_times || !Array.isArray(failure_times)) {
            throw new InconsistentModelDataException("Kļūdas atklāšanas laiks var būt tikai vesels pozitīvs skaitlis lielāks par 0");
        }

        failureTimes = failure_times;

        calcShape();
        calcScale();

        reliability = Math.exp(-Math.pow(timeCurr / scale, shape));
        failureRate = shape / scale * Math.pow(timeCurr / scale, shape - 1);
    }
    
    function calcShape() {
        shape = 0.1;

        while (true) {
            var s1 = 0;
            var s2 = 0;
            var s3 = 0;

            for (var i = 0; i < failureTimes.length; i++) {
                s1 += (Math.pow(failureTimes[i], shape) * Math.log(failureTimes[i]));
            }

            for (var i = 0; i < failureTimes.length; i++) {
                s2 += Math.pow(failureTimes[i], shape);
            }

            for (var i = 0; i < failureTimes.length; i++) {
                s3 += Math.log(failureTimes[i]);
            }
            s3 /= failureTimes.length;

            var diff = 1.0 / shape - s1 / s2 + s3;

            if (diff <= tolerance) {
                break;
            }

            shape += 0.1;
        }
    }

    function calcScale() {
        scale = 0;

        for (var i = 0; i < failureTimes.length; i++) {
            scale += Math.log(failureTimes[i]);
        }
        scale /= failureTimes.length;
        scale = Math.pow(scale, 1.0 / shape);
    }

    return {
        setup: setup,
        getReliability: getReliability,
        getFailureRate: getFailureRate
    };
};

var WeibullModel = function () {
    var failureTimes;
    var timeCurr;
    var scale = 0; // β
    var shape = 0; // α
    var reliability;
    var failureRate;
    var tolerance = 0.001;

    function getReliability() {
        return reliability;
    }

    function getFailureRate() {
        return failureRate;
    }

    function getScale() {
        return scale;
    }

    function getShape() {
        return shape;
    }

    function getTimeCurr() {
        return timeCurr;
    }

    function setup(failure_times, time_curr, scale_, shape_) {
        timeCurr = parseNaturalNumber(time_curr, true);

        if (isNaN(timeCurr)) {
            throw new InconsistentModelDataException("Prognozāšanas laiks var būt tikai vesels pozitīvs skaitlis");
        }


        if (!(scale_ || shape_)) {
            if (!failure_times || !Array.isArray(failure_times)) {
                throw new InconsistentModelDataException("Kļūdas atklāšanas laiks var būt tikai vesels pozitīvs skaitlis lielāks par 0");
            }
            failureTimes = failure_times;
            failureTimes.sort(); // sort ascending
            failureTimes = withoutCopies(failureTimes); // remove copies

            calcShape();
            calcScale();
        } else {
            scale = scale_;
            shape = shape_;
        }

        reliability = Math.exp(-Math.pow(timeCurr / scale, shape));
        failureRate = (shape / scale) * Math.pow(timeCurr / scale, shape - 1);
    }

    // Use MLE method
    function calcShape() {
        var step = tolerance;
        shape = step;

        var s3 = 0;
        for (var i = 0; i < failureTimes.length; i++) {
            s3 += Math.log(failureTimes[i]);
        }

        var diffPrev = NaN;

        // Use Newton method to estimate shape
        while (true) {
            var s1 = 0;
            var s2 = 0;

            for (var i = 0; i < failureTimes.length; i++) {
                s1 += (Math.pow(failureTimes[i], shape) * Math.log(failureTimes[i]));
            }

            for (var i = 0; i < failureTimes.length; i++) {
                s2 += Math.pow(failureTimes[i], shape);
            }

            s3 /= failureTimes.length;

            var diff = Math.abs(1.0 / shape - s1 / s2 + s3);

            if (diff <= tolerance) {
                break;
            }

            if (!isNaN(diffPrev)) {
                if (diff > diffPrev) {
                    break;
                }
            }

            diffPrev = diff;

            shape += step;
        }
    }

    function calcScale() {
        scale = 0;

        for (var i = 0; i < failureTimes.length; i++) {
            scale += Math.pow(failureTimes[i], shape);
        }
        scale /= failureTimes.length;
        scale = Math.pow(scale, 1.0 / shape);
    }

    return {
        setup: setup,
        getReliability: getReliability,
        getFailureRate: getFailureRate,
        getScale: getScale,
        getShape: getShape,
        getTimeCurr: getTimeCurr
    };
};

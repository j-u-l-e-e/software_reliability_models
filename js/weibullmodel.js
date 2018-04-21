var WeibullModel = function () {
    var failureTimes;
    var timeCurr;
    var scale = 0; // β
    var shape = 0; // α
    var reliability;
    var failureRate;
    var tolerance = 0.001;
    var MTTF; // Mean Time to Failure – MTTF

    function getFailureRate() {
        return failureRate;
    }

    function getMTTF() {
        return MTTF;
    }

    function getReliability() {
        return reliability;
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
            throw new Exception("Prognozāšanas laiks var būt tikai vesels pozitīvs skaitlis");
        }


        if (!(scale_ || shape_)) {
            if (!failure_times || !Array.isArray(failure_times)) {
                throw new Exception("Atteiču laiki var būt tikai veseli skaitļi lielāki par 0");
            }

            failureTimes = [];
            for (var i = 0; i < failure_times.length; i++) {
                var time = parseFloat(failure_times[i]);
                if (time > 0) {
                    failureTimes.push(time);
                } else {
                    throw new Exception("Atteiču laiki var būt tikai veseli skaitļi lielāki par 0");
                }
            }

            failureTimes.sort(); // sort ascending
            failureTimes = withoutCopies(failureTimes); // remove copies

            calcShape();
            calcScale();
        } else {
            scale = scale_;
            shape = shape_;
            if (scale < 0 || shape_ < 0) {
                throw new Exception("Parametri α un β var būt tikai skaitļi lielāki par 0");
            }
        }

        reliability = Math.exp(-Math.pow(timeCurr / scale, shape));
        failureRate = (shape / scale) * Math.pow(timeCurr / scale, shape - 1);
        MTTF = (shape === 1) ? scale : scale * math.gamma(1 / shape + 1);
    }

    // Use MLE method
    function calcShape() {
        var step = tolerance;
        shape = step;

        var s3 = 0;
        for (var i = 0; i < failureTimes.length; i++) {
            s3 += Math.log(failureTimes[i]);
        }
        s3 /= failureTimes.length;

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
        getMTTF: getMTTF,
        getFailureRate: getFailureRate,
        getReliability: getReliability,
        getScale: getScale,
        getShape: getShape,
        getTimeCurr: getTimeCurr
    };
};

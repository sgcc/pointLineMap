


var insertElbow = function (points,newPoint) {
    var  leastDistance = Infinity,
        insertAt      = -1;

    points.forEach(function forEach(currentPoint, index) {

        var nextPoint = points[index + 1] || points[0],
            distance = pointToSegmentDistance(newPoint, currentPoint, nextPoint);

        if (distance < leastDistance) {
            leastDistance = distance;
            insertAt = index;
        }
    })

    points.splice(insertAt + 1, 0, newPoint);
};

//    //
//    p:新点
//    p1:当前点
//    p2:下一个点
var pointToSegmentDistance = function (p, p1, p2) {
    var x = p1[0],
        y = p1[1],
        dx = p2[0] - x,
        dy = p2[1] - y,
        dot = dx * dx + dy * dy,
        t;

    if (dot > 0) {
        t = ((p[0] - x) * dx + (p[1] - y) * dy) / dot;

        if (t > 1) {
            x = p2[0];
            y = p2[1];
        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p[0] - x;
    dy = p[1] - y;

    return  Math.sqrt(dx * dx + dy * dy);
};
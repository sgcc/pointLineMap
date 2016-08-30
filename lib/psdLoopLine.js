/*
 * ʵ�ֹ��ܣ�
 1. v1 �������ߵ������Ⱦ�ƽ���ߵ㼯����������ƽ������ϳɵĶ����
 2. v2 �����������ƽ���ߣ�����ֱ����Զ���������
 
 
 
 */ 

// ����ƽ����·�㼯
var ParallelA = [], ParallelB = [];
var Distance = 5000;// ƽ���������߾��� 
var reArr = []; 

 // ����
function drawParallel(pointA,linesCount,Dis) {
	ParallelA = [], ParallelB = [];

	Distance = Dis;
	return setParallelPoints(pointA, Distance,linesCount);   
}

/**
 * ������֪���ߵ㼯����ָ�����������ƽ���ߵĵ㼯
 * 
 * @param {MVCArray
 *            <LatLng>}
 * @param {L}
 *            ���ߺ�ƽ���ߵľ��루��λ���ף�
 */
function setParallelPoints(MVCArray, L,lineC) {
	ParallelA = [];
	ParallelB = [];
	var polytemp = [], polyArr = [];
	// ȡ��ԭ��·�㼯
	for (var i = 0; i < MVCArray.length; i++) {
		polytemp.push(MVCArray[i]);
	}
	// �Ż����ߵ㼯
	polyArr = initPolyline(polytemp, L);
	// ��������·�㼯,����ͻ��ƵȾ�ƽ����
	for (var i = 1; i < polyArr.length - 1; i++) {
		var lat1, lng1, lat2, lng2;
		var p0 = polyArr[i - 1];
		var p1 = polyArr[i];
		var p2 = polyArr[i + 1];
		var d_latlng = getParallelPoint(p0, p1, p2, Distance);
		lat1 = p1[0] + d_latlng.lat;
		lng1 = p1[1] + d_latlng.lng;
		lat2 = p1[0] - d_latlng.lat;
		lng2 = p1[1] - d_latlng.lng;
		ParallelA.push([lat1, lng1]);
		ParallelB.push([lat2, lng2]);

	}
	
	var reArr = [];
	reArr.push(ParallelA);
	reArr.push(ParallelB);
	
		
    if(lineC ==3){
		var pointAC = [];
		for (var i = 1; i < polyArr.length-1; i++) {
			pointAC.push(polyArr[i]);
		}
		reArr.push(pointAC);
	}
	
	
	return reArr;
	 
}
/**
 * �Ż����ߵ㼯 ���ߵ㼯��β���ϸ�����,ȥ������������Ķ����
 * 
 * @param {oldArr}
 *            ���ߵ㼯����
 * @param {L}
 *            ���������ֱ�߾����׼����λ���ף�
 * @return newArr �����ߵ㼯����
 */
function initPolyline(oldArr, L) {
	var newArr = [];
	if (oldArr.length < 2)
		return oldArr;
	// ������ʼ������
	newArr.push( [oldArr[0][0] * 2 - oldArr[1][0],oldArr[0][1] * 2 - oldArr[1][1] ]);
	newArr.push(oldArr[0]);
	for (var i = 1; i < oldArr.length - 1; i++) {
		var len = Math.pow(latToLen(oldArr[i][0] - oldArr[i - 1][0]), 2)
				+ Math.pow(lngToLen(oldArr[i][0],(oldArr[i][1] - oldArr[i - 1][1])), 2);
		if (len > L * L)
			newArr.push(oldArr[i]);
	}
	newArr.push(oldArr[oldArr.length - 1]);;
	// �����β������
	newArr.push([oldArr[oldArr.length - 1][0] * 2- oldArr[oldArr.length - 2][0]
	                        , oldArr[oldArr.length - 1][1]* 2 - oldArr[oldArr.length - 2][1]]);
	return newArr;
}
/**
 * ������֪����3�㣬���е�ĵȾ�ƽ�е㾭γ�� * �����㷨
 * 
 * @param {p0,
 *            p1, p2} ��������LatLng��
 * @return {t} ����ƽ�е㵽�߶εĴ�ֱ����
 */
function getParallelPoint(p0, p1, p2, t) {
	// ��γ�ȷֱ�ת���ɳ��ȵ�λ
	var y12 = p2[0] - p1[0];
	var x12 = p2[1] - p1[1];
	var y01 = p1[0] - p0[0];
	var x01 = p1[1] - p0[1];
	if (x12 == 0) {
		a = Math.PI / 2;
		if (y12 < 0)
			a = -a;
	} else {
		a = Math.atan(y12 / x12);
	}
	if (x01 == 0) {
		b = Math.PI / 2;
		if (y01 < 0)
			b = -b;
	} else {
		b = Math.atan(y01 / x01);
	}
	// �ؼ����Ĵ�
	if (p2[1] < p1[1]) {
		a += Math.PI;
	}
	if (p1[1] < p0[1]) {
		b += Math.PI;
	}
	var k = (b - a - Math.PI) / 2;
	var r = a + k;
	var d = t / Math.sin(k);
	var sinr = Math.sin(r);
	var cosr = Math.cos(r);
	var d_lat = lenToLat(d * sinr);
	var d_lng = lenToLng(p1[0], d * cosr);
	return {
		lat : d_lat,
		lng : d_lng
	};
}
/**
 * ���߷��򳤶�ת����γ��
 * 
 * @param {leng}
 *            �����������ȣ��ף�
 * @return ����γ�Ȳ�
 */
function lenToLat(leng) {
	var L = 10002150; // ������߳��ȣ�����Ȧ��1/4������Ӧ90��γ��
	var angle = 90 * leng / L;
	return angle;
}

/**
 * γ�Ȳ�ת���ɳ���
 * 
 * @param {d_lat}
 *            γ�Ȳ�ֵ *
 * @return ���Ȳ�ֵ
 */
function latToLen(d_lat) {
	var L = 10002150; // ������߳��ȣ�����Ȧ��1/4������Ӧ90��γ��
	var len = d_lat * L / 90;
	return len;
}

/**
 * γ�߷��򳤶�ת���ɾ���
 * 
 * @param {lat}
 *            γ��ֵ
 * @param {leng}
 *            γ���������ȣ��ף�
 * @return ���ؾ��Ȳ�
 */
function lenToLng(lat, leng) {
	var L = 20037508;// ���һ�볤�ȣ���Ȧ����Ӧ180�㾭�ȣ�
	var latL = L * Math.cos(Math.PI / 180 * lat); // ָ��γ�ȶ�Ӧ��γ�߳��ȣ���Ȧ��
	var angle = 180 * leng / latL;
	return angle;
}

/**
 * ���Ȳ�ת���ɳ���
 * 
 * @param {lat}
 *            γ��ֵ
 * @param {d_lng}
 *            ���Ȳ�ֵ
 * @return ���س��Ȳ�
 */
function lngToLen(lat, d_lng) {
	var L = 20037508;// ���һ�볤�ȣ���Ȧ����Ӧ180�㾭�ȣ�
	var latL = L * Math.cos(Math.PI / 180 * lat); // ָ��γ�ȶ�Ӧ��γ�߳��ȣ���Ȧ��
	var len = d_lng * latL / 180;
	return len;
}


/**
 * ���߾����װ����
 * 
 * @param {Array}
 *            points LatLng���� *
 * @return {number} ���� ��λ����
 */
function getLongs(points) {
	var longs = 0;
	if (points.length < 2)
		return 0;
	for (var i = 0; i < points.length - 1; i++) {
		longs += getDistance(points[i], points[i + 1]);
	}
	return longs;
}
/**
 * ����������
 * 
 * @param {LatLng}
 *            startP ���
 * @param {LatLng}
 *            endP �յ�
 * @return {number} ���� ��λ����
 */
function getDistance(startP, endP) {
	// ��ط��㣬֪�������γ�Ⱥ;��ȣ�
	// �����ߵĳ���(��ͶӰ���ƽ���������1cm����). Help by LinXB
	// <param name="startP">����γ�Ⱥ;��ȣ���λ����</param>
	// <param name="endP">�յ��γ�Ⱥ;��ȣ���λ����</param>
	// <returns>��������룬��λ��m</returns>
	// ���룺170181690���룬475273606, 170181698, 475273509�������2.05��
	var x, y, result;
	var R = 6378137.0; // 84����
	x = (endP[1] - startP[1]) * Math.PI * R
			* Math.cos(((startP[0] + endP[0]) / 2) * Math.PI / 180) / 180;
	y = Math.PI * (endP[0] - startP[0]) * R / 180;
	result = Math.sqrt(x * x + y * y);
	return result;
}


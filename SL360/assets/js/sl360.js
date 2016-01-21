'use strict';

/**
* PanoramaView Module
*
* Description
*/
angular.module('PanoramaView', []).

(function() {
    var imgDir = 'assets/images/';
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var manualControl = false;
    var longitude = 0;
    var latitude = 0;
    var savedX;
    var savedY;
    var savedLongitude;
    var savedLatitude;
    var panoramasArray = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png'];
    var panoramaNumber = Math.floor(Math.random() * panoramasArray.length);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowWidth, windowHeight);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 1, 1000);
    camera.target = new THREE.Vector3(0, 0, 0);
    var sphere = new THREE.SphereGeometry(100, 100, 40);
    sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    var sphereMaterial = new THREE.MeshBasicMaterial();
    sphereMaterial.map = THREE.ImageUtils.loadTexture(imgDir + panoramasArray[panoramaNumber]);
    var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    scene.add(sphereMesh);

    window.document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.document.addEventListener('mouseup', onDocumentMouseUp, false);

    render();

    function render() {
        window.requestAnimationFrame(render);
        latitude = Math.max(-85, Math.min(85, latitude));
        camera.target.x = 500 * sinDegToRad(90 - latitude) * cosDegToRad(longitude);
        camera.target.y = 500 * cosDegToRad(90 - latitude);
        camera.target.z = 500 * sinDegToRad(90 - latitude) * sinDegToRad(longitude);
        camera.lookAt(camera.target);
        renderer.render(scene, camera);
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        manualControl = true;
        savedX = event.clientX;
        savedY = event.clientY;
        savedLongitude = longitude;
        savedLatitude = latitude;
    }

    function onDocumentMouseMove(event) {
        if (manualControl) {
            longitude = (savedX - event.clientX) * 0.1 + savedLongitude;
            latitude = (event.clientY - savedY) * 0.1 + savedLatitude;
        }
    }

    function onDocumentMouseUp() {
        manualControl = false;
    }

    function sinDegToRad(deg) {
        return Math.sin(THREE.Math.degToRad(deg));
    }

    function cosDegToRad(deg) {
        return Math.cos(THREE.Math.degToRad(deg));
    }

    setTimeout(function() {
        document.body.appendChild(renderer.domElement);
    }, 1000);

}());
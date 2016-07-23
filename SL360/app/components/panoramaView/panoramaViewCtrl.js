'use strict';
var components = angular.module('components', []);
components.controller('panoramaViewCtrl', ['$scope', '$location', 'panoramas', function ($scope, $location, panoramas) {
    panoramas.all(loaded);

    function loaded(panoramas) {

        var querySearch = $location.search();
        var imageId = querySearch['id'];
        var zoomDisabled = querySearch['zd'] == 'false';
        var imagePath = 'assets/images/panoramas/default.jpg';
        var isMouseDown = false;
        var lon, lat, fov = 80;

        if (zoomDisabled) {
            fov = 100;
        }

        var mouseDownX, mouseDownY, mouseDownLon, mouseDownLat;
        var renderer;

        try {
            renderer = new THREE.WebGLRenderer();
        } catch (e) {
            setTimeout(function () {
                angular.element(document.getElementsByClassName('pv-error')[0]).addClass('pv-show');
            }, 1000);
            return;
        }

        renderer.setSize(window.innerWidth, window.innerHeight);

        var camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);

        camera.target = new THREE.Vector3(0, 0, 0);

        var sphere = new THREE.SphereGeometry(100, 50, 25);
        sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

        var sphereMaterial = new THREE.MeshBasicMaterial();
        sphereMaterial.map = THREE.ImageUtils.loadTexture(imagePath);

        var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);

        var scene = new THREE.Scene();
        scene.add(sphereMesh);

        if (!imageId) {
            $scope.panoramas = panoramas;
        }

        $scope.panorama = panoramas[imageId || 'default'] || panoramas['default'];

        $scope.setImage = function (panorama) {
            $scope.panorama = panorama;
            imagePath = 'assets/images/panoramas/' + $scope.panorama.imageName;
            sphereMaterial.map = THREE.ImageUtils.loadTexture(imagePath, {}, hideLoading);
            lon = panorama.lon;
            lat = panorama.lat;
            render();
            showLoading();
        };

        renderer.domElement.addEventListener('mousedown', mouseDown, false);
        renderer.domElement.addEventListener('mousemove', mouseMove, false);
        renderer.domElement.addEventListener('mouseup', mouseUp, false);

        renderer.domElement.addEventListener('touchstart', touchStart, false);
        renderer.domElement.addEventListener('touchmove', touchMove, false);
        renderer.domElement.addEventListener('touchend', touchEnd, false);

        if (!zoomDisabled) {
            renderer.domElement.addEventListener('mousewheel', mouseWheel, true);
            renderer.domElement.addEventListener('DOMMouseScroll', mouseWheel, true);
        }
        window.addEventListener('resize', resize, false);

        function mouseDown(event) {
            event.preventDefault();
            isMouseDown = true;
            mouseDownX = event.clientX;
            mouseDownY = event.clientY;
            mouseDownLon = lon;
            mouseDownLat = lat;
        }

        function mouseMove(event) {
            if (isMouseDown) {
                lon = (mouseDownX - event.clientX) * camera.fov * 0.0015 + mouseDownLon;
                lat = (event.clientY - mouseDownY) * camera.fov * 0.0015 + mouseDownLat;
            }
        }

        function mouseUp() {
            isMouseDown = false;
        }

        function touchStart(event) {
            event.preventDefault();
            isMouseDown = true;
            if (event.targetTouches && event.targetTouches.length) {
                mouseDownX = event.targetTouches[0].clientX;
                mouseDownY = event.targetTouches[0].clientY;
                mouseDownLon = lon;
                mouseDownLat = lat;
            }
        }

        function touchMove(event) {
            if (isMouseDown) {
                lon = (mouseDownX - event.targetTouches[0].clientX) * camera.fov * 0.0015 + mouseDownLon;
                lat = (event.targetTouches[0].clientY - mouseDownY) * camera.fov * 0.0015 + mouseDownLat;
            }
        }

        function touchEnd() {
            isMouseDown = false;
        }


        function mouseWheel(event) {
            camera.fov += Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail))) * -5;
            if (camera.fov > 120) {
                camera.fov = 120;
            }
            if (camera.fov < 15) {
                camera.fov = 15;
            }
            camera.updateProjectionMatrix();
        }

        function resize() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }

        function sinDegToRad(deg) {
            return Math.sin(THREE.Math.degToRad(deg));
        }

        function cosDegToRad(deg) {
            return Math.cos(THREE.Math.degToRad(deg));
        }

        function render() {
            lat = Math.max(-85, Math.min(85, lat));
            camera.target.x = 500 * sinDegToRad(90 - lat) * cosDegToRad(lon);
            camera.target.y = 500 * cosDegToRad(90 - lat);
            camera.target.z = 500 * sinDegToRad(90 - lat) * sinDegToRad(lon);
            camera.lookAt(camera.target);
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        function showLoading() {
            angular.element(document.getElementsByClassName('pv-loading')[0]).addClass('pv-show');
        }

        function hideLoading() {
            angular.element(document.getElementsByClassName('pv-loading')[0]).removeClass('pv-show');
        }

        document.body.appendChild(renderer.domElement);
        $scope.setImage($scope.panorama);
    }
}]);
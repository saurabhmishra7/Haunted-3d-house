import React, { Component, useEffect, useRef } from 'react'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Sphere() {
  const mountRef = useRef(null);

  useEffect(() => {
    // ***
    const { current } = mountRef;
    if (!current) {
        return;
    }
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // use ref as a mount point of the Three.js scene instead of the document.body
    // ***
    const {domElement} = renderer;
    current.appendChild(domElement);
    var geometry = new THREE.SphereGeometry( 15, 32, 16 );
    var material = new THREE.MeshBasicMaterial({color: 0xffff00});
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    camera.position.z = 50;
    var orbit = new OrbitControls(camera, domElement);
    orbit.update();
    let step = 0;
    let speed = 0.05;
    var animate = function () {
        requestAnimationFrame(animate);
        step += speed;
        sphere.position.y =  10*Math.abs(Math.sin(step));
        renderer.render(scene, camera);
    };
    animate();
    // === THREE.JS CODE END ===
    // ***
    return () => {
        current.removeChild(domElement);
    };
}, []);

  return (
    <div ref={mountRef}>
    </div>
  )
}

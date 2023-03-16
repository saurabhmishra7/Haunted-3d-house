import React, { Component, useEffect, useRef } from 'react'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Cube() {
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
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    var orbit = new OrbitControls(camera, domElement);
    orbit.enableDamping = true;
    const clock = new THREE.Clock();
    //orbit.update();
    window.addEventListener('resize', () => {
      //Update Camera Aspect on resizing
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      //Update Renderer Size Aspect on resizing
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    //gsap.to(cube.position, {duration: 2, delay: 2, x: 3}); // It is used for small time animation.
    
    window.addEventListener('dblclick', ()=>{
      const fullscreen = current.fullscreenElement || current.webkitFullscreenElement;

      if(!fullscreen){
        console.log(current);
      }
      else {
        console.log("Exist full screen");
      }
    });

    var animate = function () {
        const timeEslapsed = clock.getElapsedTime();
        //console.log(timeEslapsed);
        //revolve in circle
        //camera.position.x = 2*Math.sin(timeEslapsed);
        //camera.position.y = 2*Math.cos(timeEslapsed);
        //camera.lookAt(cube.position)
        //cube.rotation.x += 0.01;
        //cube.rotation.y += 0.01;
        orbit.update();
        requestAnimationFrame(animate);
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

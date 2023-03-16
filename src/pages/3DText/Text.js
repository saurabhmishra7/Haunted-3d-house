import React, { Component, useEffect, useRef } from 'react'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import typeFaceFont from "three/examples/fonts/gentilis_regular.typeface.json";
import { AxesHelper, MathUtils, Mesh } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


export default function Text() {
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
    var textLoader = new THREE.TextureLoader();
    var axesHelper = new AxesHelper();
    //scene.add(axesHelper);
    const matCapTexture = textLoader.load('/1.png');
    var material = new THREE.MeshMatcapMaterial({matcap: matCapTexture});
    const loader = new FontLoader();
    loader.load( '/gentilis_regular.typeface.json', function ( font ) {
      const textGeometry = new TextGeometry( 'Hello three.js!', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      });
       
      const text = new Mesh(textGeometry, material);
      textGeometry.computeBoundingBox();
      console.log(textGeometry.boundingBox);
      textGeometry.center()
      scene.add(text);
    } );
    
    
    for(let i=0; i<80; ++i){
      const donutGeometry = new THREE.TorusBufferGeometry(0.5, 0.2, 16, 32);
      const donut = new THREE.Mesh(donutGeometry, material);
      donut.position.x = (Math.random()-0.5)*20;
      donut.position.y = (Math.random()-0.5)*20;
      donut.position.z = (Math.random()-0.5)*20;

      donut.rotation.x = Math.random()*Math.PI;
      donut.rotation.y = Math.random()*Math.PI;
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      scene.add(donut);
    }
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

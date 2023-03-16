import React, { Component, useEffect, useRef } from 'react'
import * as THREE from "three";
import { Color } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'dat.gui';

export default function Material() {
  const mountRef = useRef(null);

  useEffect(()=>{

    const { current } = mountRef;
    if(!current){
      return ;
    }
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth/window.innerHeight,
      0.1,
      1000
    );
    const textureLoader = new THREE.TextureLoader();
    const doorTexture = textureLoader.load('/color.jpg');
    const alphaTexture = textureLoader.load('/alpha.jpg');
    const matCapTexture = textureLoader.load('/3.png');
    const doorOcclusionTexture = textureLoader.load('/ambientOcclusion.jpg');
    
    var renderer = new THREE.WebGLRenderer();
    var { domElement } = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    current.appendChild(domElement);
    var orbit = new OrbitControls(camera, domElement);
    orbit.enableDamping = true;
    //var material = new THREE.MeshBasicMaterial() 
   // var material = new THREE.MeshMatcapMaterial() 
  //var material = new THREE.MeshLambertMaterial();
    
  
   /* var material = new THREE.MeshPhongMaterial(); //--Used for more reflection 
    material.shininess = 1000;
    material.specular = new THREE.Color(0xff0000);
     */

    var material = new THREE.MeshStandardMaterial(); // It give more releastic view
    material.roughness = 0.5;
    material.metalness = 0.65;
    /* material.map = doorTexture;
    material.aoMap = doorOcclusionTexture; */
    var cubeTextureLoder = new THREE.CubeTextureLoader();
    var enviromentMap = cubeTextureLoder.load([
      '/0/px.jpg',
      '/0/nx.jpg',
      '/0/py.jpg',
      '/0/ny.jpg',
      '/0/nz.jpg',
      '/0/nz.jpg',
    ])
    var cube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1),  material);
    cube.geometry.setAttribute('uv2', new THREE.BufferAttribute(cube.geometry.attributes.uv.array, 2))
    var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1),  material);
    plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
    var torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.5, 0.2, 16, 32),  material);
    torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
    var ambientLight = new THREE.AmbientLight('white', 1);
    scene.add(ambientLight);
    var pointLight = new THREE.PointLight('white', 0.5);
    pointLight.position.x = 3;
    pointLight.position.y = 3;  
    pointLight.position.z = 1;
    scene.add(pointLight);    
  //material.map = doorTexture;
  //material.alphaMap = alphaTexture;
  //material.transparent = true;
  material.envMap = enviromentMap;
  const gui = new dat.GUI();
  gui.add(material, 'metalness').min(0).max(1).step(0.0001);
  gui.add(material, 'roughness').min(0).max(1).step(0.0001);
  //material.matcap = matCapTexture;
    scene.add(cube, plane, torus);
    camera.position.z = 3;
    cube.position.x = 2;
    torus.position.x = -2;
    var animate = function () {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      plane.rotation.x += 0.01;
      plane.rotation.y += 0.01;

      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
  };
  animate();
  // === THREE.JS CODE END ===
  // ***
  return () => {
      current.removeChild(domElement);
  };

  },[])

  return (
    <div ref={mountRef}>

    </div>
  )
}
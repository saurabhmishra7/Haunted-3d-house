import React, { Component, useEffect, useRef } from 'react'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AxesHelper, MathUtils, Mesh } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as dat from 'dat.gui';



export default function Light() {
  const mountRef = useRef(null);

  useEffect(() => {
    // ***
    const { current } = mountRef;
    if (!current) {
        return;
    }
    // === THREE.JS CODE START ===
    const gui = new dat.GUI()

    // Canvas
    
    // Scene
    const scene = new THREE.Scene()
    
    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const pointLight = new THREE.PointLight(0xff9000, 0.5)
  /*   pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4 */
    scene.add(pointLight);


    const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI*0.1, 0.5, 0.01);
    spotLight.position.set(0, 2, 3);
    scene.add(spotLight);
    //gui.add('')

    /**
     * Objects
     */
    // Material
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.4
    
    // Objects
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        material
    )
    sphere.position.x = - 1.5
    
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.75, 0.75),
        material
    )
    
    const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 32, 64),
        material
    )
    torus.position.x = 1.5
    
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5),
        material
    )
    plane.rotation.x = - Math.PI * 0.5
    plane.position.y = - 0.65
    
    scene.add(sphere, cube, torus, plane)
    
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    
        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 3
    camera.position.z = 4
    scene.add(camera)
    
    /**
     * Renderer
     */

    const renderer = new THREE.WebGLRenderer();
    const {domElement} = renderer;
    current.appendChild(domElement);

    // Controls
    const controls = new OrbitControls(camera, domElement)
    controls.enableDamping = true
    
    
    
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    /**
     * Animate
     */
    const clock = new THREE.Clock()
    
    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
    
        // Update objects
        sphere.rotation.y = 0.1 * elapsedTime
        cube.rotation.y = 0.1 * elapsedTime
        torus.rotation.y = 0.1 * elapsedTime
    
        sphere.rotation.x = 0.15 * elapsedTime
        cube.rotation.x = 0.15 * elapsedTime
        torus.rotation.x = 0.15 * elapsedTime
    
        // Update controls
        controls.update()
    
        // Render
        renderer.render(scene, camera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    
    tick() // === THREE.JS CODE END ===
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

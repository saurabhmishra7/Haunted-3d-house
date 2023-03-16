import React, { Component, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { MeshStandardMaterial } from "three";

export default function HauntedHouse() {
  const mountRef = useRef(null);

  useEffect(() => {
    // ***
    const { current } = mountRef;
    if (!current) {
      return;
    }
    // Debug
    const gui = new dat.GUI();

    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // Scene
    const scene = new THREE.Scene();

    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader();

    const doorColorTexture = textureLoader.load("/Haunted-3d-house/textures/door/color.jpg");
    const doorAlphaTexture = textureLoader.load("/Haunted-3d-house/textures/door/alpha.jpg");
    const doorAmbientOcclusionTexture = textureLoader.load(
      "/textures/door/ambientOcclusion.jpg"
    );
    const doorHeightTexture = textureLoader.load("/Haunted-3d-house/textures/door/height.jpg");
    const doorNormalTexture = textureLoader.load("/Haunted-3d-house/textures/door/normal.jpg");
    const doorMetalnessTexture = textureLoader.load(
      "/textures/door/metalness.jpg"
    );
    const doorRoughnessTexture = textureLoader.load(
      "/textures/door/roughness.jpg"
    );

    const bricksColorTexture = textureLoader.load("/Haunted-3d-house/textures/bricks/color.jpg");
    const bricksAmbientOcclusionTexture = textureLoader.load(
      "/textures/bricks/ambientOcclusion.jpg"
    );
    const bricksNormalTexture = textureLoader.load(
      "/textures/bricks/normal.jpg"
    );
    const bricksRoughnessTexture = textureLoader.load(
      "/textures/bricks/roughness.jpg"
    );

    const grassColorTexture = textureLoader.load("/Haunted-3d-house/textures/grass/color.jpg");
    const grassAmbientOcclusionTexture = textureLoader.load(
      "/textures/grass/ambientOcclusion.jpg"
    );
    const grassNormalTexture = textureLoader.load("/Haunted-3d-house/textures/grass/normal.jpg");
    const grassRoughnessTexture = textureLoader.load(
      "/textures/grass/roughness.jpg"
    );

    grassColorTexture.repeat.set(18, 18);
    grassAmbientOcclusionTexture.repeat.set(18, 18);
    grassNormalTexture.repeat.set(18, 18);
    grassRoughnessTexture.repeat.set(18, 18);

    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

    /**
     * House
     */
    // Temporary sphere
    const house = new THREE.Group();
    scene.add(house);
    //Wall
    const walls = new THREE.Mesh(
      new THREE.BoxBufferGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
      })
    );
    walls.position.y = 2.5 / 2;
    house.add(walls);
    walls.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
    );

    //roof
    const roof = new THREE.Mesh(
      new THREE.ConeBufferGeometry(3.5, 1, 4),
      new MeshStandardMaterial({ color: "#b35f45" })
    );
    house.add(roof);
    roof.position.y = 2.5 + 0.5;
    roof.rotation.y = Math.PI / 4;

    //door
    const door = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
      })
    );
    door.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
    );
    house.add(door);
    door.position.z = 2 + 0.01;
    door.position.y = 1;

    //bush
    const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.2);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-1.2, 0.2, 2.2);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.5, 0.5, 0.5);
    bush4.position.set(-0.6, 0.2, 2.2);

    house.add(bush1, bush2, bush3, bush4);

    //grave

    const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

    for (let i = 0; i < 50; ++i) {
      const angle = Math.PI * 2 * Math.random();

      const radius = 4 + Math.random() * 6;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.4, z);
      grave.rotation.y = (Math.random() - 0.5) * 0.2;
      grave.rotation.z = (Math.random() - 0.5) * 0.2;
      grave.castShadow = true;
      house.add(grave);
    }

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
      })
    );
    floor.receiveShadow = true;
    floor.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    floor.position.z = 0;
    scene.add(floor);

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.2);
    //gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
    scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.2);
    moonLight.castShadow = true
    moonLight.position.set(4, 5, -2);
    /* gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
    gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
    gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
    gui.add(moonLight.position, "z").min(-5).max(5).step(0.001); */
    scene.add(moonLight);

    // Point Light
    const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
    doorLight.position.set(0, 2.2, 2.5);
    doorLight.castShadow = true;
    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;
    //LightHelper
    /*  const doorLightCameraHelper = new THREE.PointLightHelper(doorLight, 0.2);
    scene.add(doorLightCameraHelper) */
    house.add(doorLight);

    //Fog
    const fog = new THREE.Fog("#262837", 1, 15);
    scene.fog = fog;

    //Ghost

    const ghost1 = new THREE.PointLight("#ff00ff", 3, 3);
    ghost1.castShadow = true;
    ghost1.shadow.mapSize.width = 256;
    ghost1.shadow.mapSize.height = 256;
    ghost1.shadow.camera.far = 7;
    scene.add(ghost1);

    const ghost2 = new THREE.PointLight("#00ffff", 3, 3);
    ghost2.castShadow = true;
    ghost2.shadow.mapSize.width = 256;
    ghost2.shadow.mapSize.height = 256;
    ghost2.shadow.camera.far = 7;
    scene.add(ghost2);

    const ghost3 = new THREE.PointLight("#ff7800", 3, 3);
    ghost3.castShadow = true;
    ghost3.shadow.mapSize.width = 256;
    ghost3.shadow.mapSize.height = 256;
    ghost3.shadow.camera.far = 7;
    scene.add(ghost3);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor("#262837");
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 4;
    camera.position.y = 2;
    camera.position.z = 5;
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer();
    const { domElement } = renderer;
    current.appendChild(domElement);

    // Controls
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      const ghost1Angle = elapsedTime * 0.5;
      ghost1.position.x = Math.cos(ghost1Angle) * 4;
      ghost1.position.z = Math.sin(ghost1Angle) * 4;
      ghost1.position.y = Math.sin(elapsedTime * 3);

      const ghost2Angle = -elapsedTime * 0.32;
      ghost2.position.x = Math.cos(ghost2Angle) * 5;
      ghost2.position.z = Math.sin(ghost2Angle) * 5;
      ghost2.position.y =
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

      const ghost3Angle = -elapsedTime * 0.18;
      ghost3.position.x =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
      ghost3.position.z =
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
      ghost3.position.y =
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);
      renderer.shadowMap.enabled = true;
      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
    return () => {
      current.removeChild(domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
}

// import * as THREE from 'three';
// //const THREE = window.THREE;
// import { TEAM_BLUE, TEAM_RED } from './GameClass';

// // Creates the game map with all necessary terrain elements
// export const createMap = (scene) => {
//   // Ground plane
//   const groundGeometry = new THREE.PlaneGeometry(100, 100);
//   const groundMaterial = new THREE.MeshStandardMaterial({ 
//     color: 0x4C9A2A,
//     roughness: 0.8,
//     metalness: 0.2
//   });
//   const ground = new THREE.Mesh(groundGeometry, groundMaterial);
//   ground.rotation.x = -Math.PI / 2;
//   scene.add(ground);
  
//   // Add three lanes
//   const laneGeometry = new THREE.PlaneGeometry(5, 100);
//   const laneMaterial = new THREE.MeshStandardMaterial({ 
//     color: 0xA0522D,
//     roughness: 0.9
//   });
  
//   // Middle lane
//   const midLane = new THREE.Mesh(laneGeometry, laneMaterial);
//   midLane.rotation.x = -Math.PI / 2;
//   midLane.position.y = 0.01; // Slightly above ground to prevent z-fighting
//   scene.add(midLane);
  
//   // Top lane (rotated)
//   const topLane = new THREE.Mesh(laneGeometry, laneMaterial);
//   topLane.rotation.x = -Math.PI / 2;
//   topLane.rotation.z = Math.PI / 4;
//   topLane.position.y = 0.01;
//   topLane.position.x = -25;
//   topLane.position.z = 0;
//   scene.add(topLane);
  
//   // Bottom lane (rotated)
//   const bottomLane = new THREE.Mesh(laneGeometry, laneMaterial);
//   bottomLane.rotation.x = -Math.PI / 2;
//   bottomLane.rotation.z = -Math.PI / 4;
//   bottomLane.position.y = 0.01;
//   bottomLane.position.x = 25;
//   bottomLane.position.z = 0;
//   scene.add(bottomLane);
  
//   // Add jungle areas (green darker patches)
//   const jungleGeometry = new THREE.CircleGeometry(10, 32);
//   const jungleMaterial = new THREE.MeshStandardMaterial({
//     color: 0x2E8B57,
//     roughness: 0.9
//   });
  
//   // Four jungle areas
//   const junglePositions = [
//     { x: -20, z: -20 },
//     { x: 20, z: -20 },
//     { x: -20, z: 20 },
//     { x: 20, z: 20 }
//   ];
  
//   junglePositions.forEach(pos => {
//     const jungleArea = new THREE.Mesh(jungleGeometry, jungleMaterial);
//     jungleArea.rotation.x = -Math.PI / 2;
//     jungleArea.position.set(pos.x, 0.005, pos.z);
//     scene.add(jungleArea);
//   });
  
//   // River across the middle
//   const riverGeometry = new THREE.PlaneGeometry(100, 8);
//   const riverMaterial = new THREE.MeshStandardMaterial({
//     color: 0x1E90FF,
//     transparent: true,
//     opacity: 0.7,
//     roughness: 0.1,
//     metalness: 0.3
//   });
  
//   const river = new THREE.Mesh(riverGeometry, riverMaterial);
//   river.rotation.x = -Math.PI / 2;
//   river.position.y = 0.02;
//   river.rotation.z = Math.PI / 16;
//   scene.add(river);
  
//   // Add base areas
//   const baseGeometry = new THREE.CircleGeometry(8, 32);
  
//   // Blue base
//   const blueBaseMaterial = new THREE.MeshStandardMaterial({
//     color: 0x0000FF,
//     transparent: true,
//     opacity: 0.3
//   });
//   const blueBase = new THREE.Mesh(baseGeometry, blueBaseMaterial);
//   blueBase.rotation.x = -Math.PI / 2;
//   blueBase.position.set(0, 0.03, -45);
//   scene.add(blueBase);
  
//   // Red base
//   const redBaseMaterial = new THREE.MeshStandardMaterial({
//     color: 0xFF0000,
//     transparent: true,
//     opacity: 0.3
//   });
//   const redBase = new THREE.Mesh(baseGeometry, redBaseMaterial);
//   redBase.rotation.x = -Math.PI / 2;
//   redBase.position.set(0, 0.03, 45);
//   scene.add(redBase);
  
//   // Add walls around the map edges
//   const wallGeometry = new THREE.BoxGeometry(100, 3, 1);
//   const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  
//   // North wall
//   const northWall = new THREE.Mesh(wallGeometry, wallMaterial);
//   northWall.position.set(0, 1.5, -50);
//   scene.add(northWall);
  
//   // South wall
//   const southWall = new THREE.Mesh(wallGeometry, wallMaterial);
//   southWall.position.set(0, 1.5, 50);
//   scene.add(southWall);
  
//   // East wall
//   const eastWall = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 100), wallMaterial);
//   eastWall.position.set(50, 1.5, 0);
//   scene.add(eastWall);
  
//   // West wall
//   const westWall = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 100), wallMaterial);
//   westWall.position.set(-50, 1.5, 0);
//   scene.add(westWall);
  
//   // Add some decorative elements
  
//   // Trees in the jungle
//   const treeGeometry = new THREE.ConeGeometry(1.5, 4, 6);
//   const treeTrunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 6);
//   const treeLeavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
//   const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  
//   // Place trees in each jungle area
//   junglePositions.forEach(pos => {
//     for (let i = 0; i < 5; i++) {
//       const treeGroup = new THREE.Group();
      
//       const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
//       trunk.position.y = 1;
      
//       const leaves = new THREE.Mesh(treeGeometry, treeLeavesMaterial);
//       leaves.position.y = 4;
      
//       treeGroup.add(trunk);
//       treeGroup.add(leaves);
      
//       const angle = Math.random() * Math.PI * 2;
//       const distance = Math.random() * 7;
      
//       treeGroup.position.set(
//         pos.x + Math.cos(angle) * distance,
//         0,
//         pos.z + Math.sin(angle) * distance
//       );
      
//       scene.add(treeGroup);
//     }
//   });
  
//   // Add some rocks around the map
//   const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
//   const rockMaterial = new THREE.MeshStandardMaterial({ 
//     color: 0x808080,
//     roughness: 0.9
//   });
  
//   for (let i = 0; i < 20; i++) {
//     const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    
//     // Random position but avoid the bases and lanes
//     let x, z;
//     do {
//       x = (Math.random() - 0.5) * 90;
//       z = (Math.random() - 0.5) * 90;
//     } while (
//       (Math.abs(x) < 10 && Math.abs(z) < 10) || // Center area
//       (Math.abs(z) > 40 && Math.abs(x) < 10)    // Base areas
//     );
    
//     const scale = 0.5 + Math.random() * 1.5;
//     rock.scale.set(scale, scale * 0.7, scale);
//     rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
//     rock.position.set(x, scale * 0.5, z);
    
//     scene.add(rock);
//   }
  
//   // Add ambient occlusion to the scene for better shadowing
//   const aoMap = new THREE.TextureLoader().load(null);
//   ground.material.aoMap = aoMap;
//   ground.material.aoMapIntensity = 1;
  
//   // Return a reference to the scene
//   return scene;
// };
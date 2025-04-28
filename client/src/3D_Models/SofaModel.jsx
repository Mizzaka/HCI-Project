import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SofaModel = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 0.8, onSelect, isSelected, onPositionChange }) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const { camera, raycaster, mouse, gl } = useThree();
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // XZ plane
  const intersectionPoint = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  
  // Handle drag start
  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    
    // Store the offset between the clicked point and the sofa position
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane.current, intersectionPoint.current);
    offset.current.copy(intersectionPoint.current).sub(new THREE.Vector3(
      position[0], position[1], position[2]
    ));
    
    // Capture pointer to track it outside the canvas
    gl.domElement.setPointerCapture(e.pointerId);
  };
  
  // Handle drag movement
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    // Calculate the new position based on the mouse position
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane.current, intersectionPoint.current);
    
    const newPosition = [
      intersectionPoint.current.x - offset.current.x,
      0, // Keep y position fixed at 0
      intersectionPoint.current.z - offset.current.z
    ];
    
    onPositionChange(newPosition);
  };
  
  // Handle drag end
  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      gl.domElement.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Main seat */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[2, 0.5, 0.8]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      
      {/* Back rest */}
      <mesh position={[0, 0.7, -0.35]} castShadow>
        <boxGeometry args={[2, 0.9, 0.1]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      
      {/* Arm rests */}
      <mesh position={[0.95, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      <mesh position={[-0.95, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.8]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[0.8, 0.1, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#2A4480" />
      </mesh>
      <mesh position={[-0.8, 0.1, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#2A4480" />
      </mesh>
      <mesh position={[0.8, 0.1, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#2A4480" />
      </mesh>
      <mesh position={[-0.8, 0.1, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#2A4480" />
      </mesh>
      
      {/* Highlight when selected */}
      {isSelected && (
        <mesh position={[0, 0.5, 0]} scale={[2.2, 1.2, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="yellow" wireframe opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
};

export default SofaModel;
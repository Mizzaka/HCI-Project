import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const TableModel = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 0.5, onSelect, isSelected, onPositionChange }) => {
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
    
    // Store the offset between the clicked point and the table position
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
      {/* Table Top */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Table Legs */}
      <mesh position={[0.5, 0.2, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[-0.5, 0.2, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[0.5, 0.2, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[-0.5, 0.2, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      
      {/* Highlight when selected */}
      {isSelected && (
        <mesh position={[0, 0.3, 0]} scale={[1.4, 0.8, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="yellow" wireframe opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
};

export default TableModel;
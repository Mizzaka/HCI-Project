import React, { useState, Suspense } from 'react';
import { Canvas, } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, useGLTF, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import ChairModel from '../3D_Models/ChairModel';
import TableModel from '../3D_Models/TestTableModel';
import SofaModel from '../3D_Models/SofaModel';
import CupboardModel from '../3D_Models/CupboardModel';
import CoffeeTableModel from '../3D_Models/CoffeeModel';

const Room = ({ dimensions, color }) => {
    const [width, height, depth] = dimensions;

    return (
        <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={color} side={THREE.BackSide} opacity={0.8} transparent />
        </mesh>
    );
};

const FloorGrid = ({ size }) => {
  return <Grid args={[size, size]} cellSize={0.5} cellThickness={0.5} cellColor="#6f6f6f" sectionSize={3} />;
};

//fallback loader component
const ModelLoader = () => {
    return (
        <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="purple" wireframe />
        </mesh>
    );
};

const Dashboard = () => {
    const [dimensions, setDimensions] = useState([3, 2.5, 3]); //default room dimensions
    const [color, setColor] = useState('#f5f5f5'); //default room color
    const [selectedFurniture, setSelectedFurniture] = useState('none'); //current furniture selection for adding
    const [selectedItem, setSelectedItem] = useState(null); //currently selected item for editing
    const [toggleOrbitControl, setToggleOrbitControl] = useState(true);
        
    const [placedFurniture, setPlacedFurniture] = useState({
        chair: { placed: false, position: [0, 0, 0], scale: 0.5, rotation: 0 },
        table: { placed: false, position: [0, 0, 0], scale: 0.7, rotation: 0 },
        sofa: { placed: false, position: [0, 0, 0], scale: 0.8, rotation: 0 },
        cupboard: { placed: false, position: [0, 0, 0], scale: 0.8, rotation: 0 },
        coffeeTable: { placed: false, position: [0, 0, 0], scale: 0.7, rotation: 0 },
    });

    const handleDimensionChange = (index, value) => {
        const newDimensions = [...dimensions];
        newDimensions[index] = parseFloat(value);
        setDimensions(newDimensions);
    };
    
    const handleColorChange = (e) => {
        setColor(e.target.value);
    };
    
    const handleFurnitureChange = (e) => {
        const furniture = e.target.value;
        setSelectedFurniture(furniture);
        
        if (furniture !== 'none' && !placedFurniture[furniture].placed) {
            //add the furniture to the room
            setPlacedFurniture(prev => ({
                ...prev,
                [furniture]: {
                ...prev[furniture],
                placed: true
                }
            }));
            //select it for manipulation
            setSelectedItem(furniture);
        }
    };
    
    //to handle position change of furniture
    const handlePositionChange = (itemType, newPosition) => {
        setPlacedFurniture(prev => ({
        ...prev,
        [itemType]: {
            ...prev[itemType],
            position: newPosition
        }
        }));
    };
    
    const handleRotationChange = (itemType, value) => {
        setPlacedFurniture(prev => ({
        ...prev,
        [itemType]: {
            ...prev[itemType],
            rotation: parseFloat(value)
        }
        }));
    };

    const handleScaleChange = (itemType, value) => {
        setPlacedFurniture(prev => ({
        ...prev,
        [itemType]: {
            ...prev[itemType],
            scale: parseFloat(value)
        }
        }));
    };
        
    const handleRemoveFurniture = (itemType) => {
        setPlacedFurniture(prev => ({
        ...prev,
        [itemType]: {
            ...prev[itemType],
            placed: false
        }
        }));
        
        if (selectedItem === itemType) {
        setSelectedItem(null);
        }
    };

  return (
    <div className="furniture-visualizer">
        <div className="controls-sidebar">
            <h2>Room Designer</h2>

            <div className="dimension-controls">
                <h3>Room Dimensions</h3>
                <div className="dimension-input">
                    <label>Width (m):</label>
                    <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={dimensions[0]}
                    onChange={(e) => handleDimensionChange(0, e.target.value)}
                    />
                </div>
                
                <div className="dimension-input">
                    <label>Height (m):</label>
                    <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={dimensions[1]}
                    onChange={(e) => handleDimensionChange(1, e.target.value)}
                    />
                </div>
                
                <div className="dimension-input">
                    <label>Depth (m):</label>
                    <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={dimensions[2]}
                    onChange={(e) => handleDimensionChange(2, e.target.value)}
                    />
                </div>
            </div>
            
            <div className="color-control">
                <h3>Room Color</h3>
                <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                />
            </div>
            
            <div className="furniture-selection">
                <h3>Add Furniture</h3>
                <select value={selectedFurniture} onChange={handleFurnitureChange}>
                    <option value="none">Select an item</option>
                    {!placedFurniture.chair.placed && <option value="chair">Chair</option>}
                    {!placedFurniture.table.placed && <option value="table">Table</option>}
                    {!placedFurniture.sofa.placed && <option value="sofa">Sofa</option>}
                    {!placedFurniture.cupboard.placed && <option value="cupboard">Cupboard</option>}
                    {!placedFurniture.coffeeTable.placed && <option value="coffeeTable">Coffee Table</option>}
                </select>
            </div>

            <div className="transform-controls">
                <button onClick={() => setToggleOrbitControl(!toggleOrbitControl)}>
                    {toggleOrbitControl ? "Enable Furniture Movement" : "Enable Camera Movement"}
                </button>
            </div>
            
            {/* helper text */}
            {!toggleOrbitControl && (
            <div className="help-text">
                <p>Click and drag furniture to move it around the room</p>
            </div>
            )}
            
            {/* placed furniture list and controls */}
            {(placedFurniture.chair.placed || placedFurniture.table.placed || placedFurniture.sofa.placed) && (
            <div className="placed-furniture">
                <h3>Placed Furniture</h3>
                
                {placedFurniture.chair.placed && (
                <div className={`furniture-item ${selectedItem === 'chair' ? 'selected' : ''}`}>
                    <div className="item-header" onClick={() => setSelectedItem('chair')}>
                        <span>Chair</span>
                        <button className="remove-btn" onClick={() => handleRemoveFurniture('chair')}>×</button>
                    </div>
                    {selectedItem === 'chair' && (
                    <div className="item-controls">
                        <div className="control-row">
                            <label>Size:</label>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.05"
                                value={placedFurniture.chair.scale}
                                onChange={(e) => handleScaleChange('chair', e.target.value)}
                            />
                            <span>{placedFurniture.chair.scale.toFixed(2)}</span>
                        </div>
                        <div className="control-row">
                            <label>Rotate:</label>
                            <button 
                                className="rotate-btn" 
                                onClick={() => handleRotationChange('chair', (placedFurniture.chair.rotation + Math.PI/2) % (Math.PI*2))}
                            >
                                Rotate 90°
                            </button>
                        </div>
                    </div>
                    )}
                </div>
                )}
                
                {placedFurniture.table.placed && (
                <div className={`furniture-item ${selectedItem === 'table' ? 'selected' : ''}`}>
                    <div className="item-header" onClick={() => setSelectedItem('table')}>
                        <span>Table</span>
                        <button className="remove-btn" onClick={() => handleRemoveFurniture('table')}>×</button>
                    </div>
                    {selectedItem === 'table' && (
                    <div className="item-controls">
                        <div className="control-row">
                            <label>Size:</label>
                            <input
                                type="range"
                                min="0.3"
                                max="1.2"
                                step="0.05"
                                value={placedFurniture.table.scale}
                                onChange={(e) => handleScaleChange('table', e.target.value)}
                            />
                            <span>{placedFurniture.table.scale.toFixed(2)}</span>
                        </div>
                        <div className="control-row">
                            <label>Rotate:</label>
                            <button 
                                className="rotate-btn" 
                                onClick={() => handleRotationChange('table', (placedFurniture.table.rotation + Math.PI/2) % (Math.PI*2))}
                            >
                                Rotate 90°
                            </button>
                        </div>
                    </div>
                    )}
                </div>
                )}

                {placedFurniture.sofa.placed && (
                <div className={`furniture-item ${selectedItem === 'sofa' ? 'selected' : ''}`}>
                    <div className="item-header" onClick={() => setSelectedItem('sofa')}>
                        <span>Sofa</span>
                        <button className="remove-btn" onClick={() => handleRemoveFurniture('sofa')}>×</button>
                    </div>
                    {selectedItem === 'sofa' && (
                    <div className="item-controls">
                        <div className="control-row">
                            <label>Size:</label>
                            <input
                                type="range"
                                min="0.5"
                                max="1.2"
                                step="0.05"
                                value={placedFurniture.sofa.scale}
                                onChange={(e) => handleScaleChange('sofa', e.target.value)}
                            />
                            <span>{placedFurniture.sofa.scale.toFixed(2)}</span>
                        </div>
                        <div className="control-row">
                            <label>Rotate:</label>
                            <button 
                                className="rotate-btn" 
                                onClick={() => handleRotationChange('sofa', (placedFurniture.sofa.rotation + Math.PI/2) % (Math.PI*2))}
                            >
                                Rotate 90°
                            </button>
                        </div>
                    </div>
                    )}
                </div>
                )}

                {placedFurniture.cupboard.placed && (
                <div className={`furniture-item ${selectedItem === 'cupboard' ? 'selected' : ''}`}>
                    <div className="item-header" onClick={() => setSelectedItem('cupboard')}>
                        <span>Cupboard</span>
                        <button className="remove-btn" onClick={() => handleRemoveFurniture('cupboard')}>×</button>
                    </div>
                    {selectedItem === 'cupboard' && (
                    <div className="item-controls">
                        <div className="control-row">
                            <label>Size:</label>
                            <input
                                type="range"
                                min="0.5"
                                max="1.2"
                                step="0.05"
                                value={placedFurniture.cupboard.scale}
                                onChange={(e) => handleScaleChange('cupboard', e.target.value)}
                            />
                            <span>{placedFurniture.cupboard.scale.toFixed(2)}</span>
                        </div>
                        <div className="control-row">
                            <label>Rotate:</label>
                            <button 
                                className="rotate-btn" 
                                onClick={() => handleRotationChange('cupboard', (placedFurniture.cupboard.rotation + Math.PI/2) % (Math.PI*2))}
                            >
                                Rotate 90°
                            </button>
                        </div>
                    </div>
                    )}
                </div>
                )}

                {placedFurniture.coffeeTable.placed && (
                <div className={`furniture-item ${selectedItem === 'coffeeTable' ? 'selected' : ''}`}>
                    <div className="item-header" onClick={() => setSelectedItem('coffeeTable')}>
                        <span>Coffee Table</span>
                        <button className="remove-btn" onClick={() => handleRemoveFurniture('coffeeTable')}>×</button>
                    </div>
                    {selectedItem === 'coffeeTable' && (
                    <div className="item-controls">
                        <div className="control-row">
                            <label>Size:</label>
                            <input
                                type="range"
                                min="0.3"
                                max="1.0"
                                step="0.05"
                                value={placedFurniture.coffeeTable.scale}
                                onChange={(e) => handleScaleChange('coffeeTable', e.target.value)}
                            />
                            <span>{placedFurniture.coffeeTable.scale.toFixed(2)}</span>
                        </div>
                        <div className="control-row">
                            <label>Rotate:</label>
                            <button 
                                className="rotate-btn" 
                                onClick={() => handleRotationChange('coffeeTable', (placedFurniture.coffeeTable.rotation + Math.PI/2) % (Math.PI*2))}
                            >
                                Rotate 90°
                            </button>
                        </div>
                    </div>
                    )}
                </div>
                )}
            </div>
            )}
        </div>
      
      <div className="canvas-container">
        <Canvas shadows>
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            
            {/*camera positioned outside the room, looking in */}
            <PerspectiveCamera makeDefault position={[5, 2, 5]} fov={50} />
            
            {/*controls to orbit around the room */}
            {toggleOrbitControl && (
                <OrbitControls 
                target={[0, 1, 0]} 
                maxPolarAngle={Math.PI / 2} 
                minDistance={1}
                maxDistance={10}
                />
            )}
                        
            <Room dimensions={dimensions} color={color} />
            <FloorGrid size={Math.max(...dimensions) * 2} />
                        
            <Suspense fallback={<ModelLoader />}>                
                {placedFurniture.chair.placed && (
                <ChairModel 
                    position={placedFurniture.chair.position} 
                    rotation={[0, placedFurniture.chair.rotation, 0]}
                    scale={placedFurniture.chair.scale}
                    onSelect={() => setSelectedItem('chair')}
                    isSelected={selectedItem === 'chair'}
                    onPositionChange={(pos) => handlePositionChange('chair', pos)}
                />
                )}
                
                {placedFurniture.table.placed && (
                <TableModel 
                    position={placedFurniture.table.position} 
                    rotation={[0, placedFurniture.table.rotation, 0]}
                    scale={placedFurniture.table.scale}
                    onSelect={() => setSelectedItem('table')}
                    isSelected={selectedItem === 'table'}
                    onPositionChange={(pos) => handlePositionChange('table', pos)}
                />
                )}

                {placedFurniture.sofa.placed && (
                <SofaModel 
                    position={placedFurniture.sofa.position} 
                    rotation={[0, placedFurniture.sofa.rotation, 0]}
                    scale={placedFurniture.sofa.scale}
                    onSelect={() => setSelectedItem('sofa')}
                    isSelected={selectedItem === 'sofa'}
                    onPositionChange={(pos) => handlePositionChange('sofa', pos)}
                />
                )}

                {placedFurniture.cupboard.placed && (
                <CupboardModel 
                    position={placedFurniture.cupboard.position} 
                    rotation={[0, placedFurniture.cupboard.rotation, 0]}
                    scale={placedFurniture.cupboard.scale}
                    onSelect={() => setSelectedItem('cupboard')}
                    isSelected={selectedItem === 'cupboard'}
                    onPositionChange={(pos) => handlePositionChange('cupboard', pos)}
                />
                )}

                {placedFurniture.coffeeTable.placed && (
                <CoffeeTableModel 
                    position={placedFurniture.coffeeTable.position} 
                    rotation={[0, placedFurniture.coffeeTable.rotation, 0]}
                    scale={placedFurniture.coffeeTable.scale}
                    onSelect={() => setSelectedItem('coffeeTable')}
                    isSelected={selectedItem === 'coffeeTable'}
                    onPositionChange={(pos) => handlePositionChange('coffeeTable', pos)}
                />
                )}
            </Suspense>
        </Canvas>
      </div>
              
      <style jsx="true">{`
        .furniture-visualizer {
          display: flex;
          height: 100vh;
          width: 100%;
          font-family: Arial, sans-serif;
        }
        
        .controls-sidebar {
          width: 300px;
          background-color: #f0f0f0;
          padding: 20px;
          overflow-y: auto;
        }
        
        .canvas-container {
          flex: 1;
          background-color: #e0e0e0;
        }
        
        h2 {
          margin-top: 0;
          color: #333;
        }
        
        h3 {
          margin-top: 20px;
          color: #555;
        }
        
        .dimension-input {
          margin: 10px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        input[type="number"] {
          width: 70px;
          padding: 5px;
        }
        
        input[type="color"] {
          width: 100%;
          height: 40px;
          cursor: pointer;
        }
        
        input[type="range"] {
          width: 70%;
          margin-right: 10px;
        }
        
        select {
          width: 100%;
          padding: 8px;
          margin-top: 10px;
        }
        
        button {
          padding: 8px 12px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        button:hover {
          background-color: #45a049;
        }
        
        .help-text {
          margin-top: 15px;
          font-size: 0.9em;
          color: #666;
        }
        
        .error {
          color: #ff0000;
          font-weight: bold;
        }
        
        /* Placed furniture styles */
        .placed-furniture {
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        
        .furniture-item {
          background-color: #e9e9e9;
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 10px;
        }
        
        .furniture-item.selected {
          border: 2px solid #4CAF50;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        
        .remove-btn {
          background: none;
          border: none;
          color: #ff0000;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0 5px;
          margin: 0;
        }
        
        .item-controls {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .control-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            gap: 5px;
        }

        .control-row label {
            width: 50px;
            flex-shrink: 0;
        }

        .rotate-btn {
            padding: 3px 6px;
            font-size: 0.8rem;
            margin: 0;
            white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
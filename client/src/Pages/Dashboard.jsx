import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import ChairModel from '../3D_Models/ChairModel';
import TableModel from '../3D_Models/TableModel';
import SofaModel from '../3D_Models/SofaModel';
import CupboardModel from '../3D_Models/CupboardModel';
import CoffeeTableModel from '../3D_Models/CoffeeModel';
import ChairImg from '../assets/chair_2.png';
import TableImg from '../assets/chair_2.png';
import SofaImg from'../assets/chair_2.png';
import CupboardImg from '../assets/chair_2.png';
import CoffeeTableImg from '../assets/chair_2.png';
import { LockClosedIcon, LockOpenIcon, ListBulletIcon, XMarkIcon, PlusIcon, MinusIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

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

const ModelLoader = () => {
    return (
        <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="purple" wireframe />
        </mesh>
    );
};

const Dashboard = () => {
    const [dimensions, setDimensions] = useState([3, 2.5, 3]);
    const [color, setColor] = useState('#f5f5f5');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFurniture, setSelectedFurniture] = useState('none');
    const [selectedItem, setSelectedItem] = useState(null);
    const [toggleOrbitControl, setToggleOrbitControl] = useState(true);
    const [isPlacedFurnitureVisible, setIsPlacedFurnitureVisible] = useState(false);

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
            setPlacedFurniture(prev => ({ ...prev, [furniture]: { ...prev[furniture], placed: true } }));
            setSelectedItem(furniture);
        }
    };

    const handlePositionChange = (itemType, newPosition) => {
        setPlacedFurniture(prev => ({ ...prev, [itemType]: { ...prev[itemType], position: newPosition } }));
    };

    const handleRotationChange = (itemType, value) => {
        setPlacedFurniture(prev => ({ ...prev, [itemType]: { ...prev[itemType], rotation: parseFloat(value) } }));
    };

    const handleScaleChange = (itemType, value) => {
        setPlacedFurniture(prev => ({ ...prev, [itemType]: { ...prev[itemType], scale: parseFloat(value) } }));
    };

    const handleRemoveFurniture = (itemType) => {
        setPlacedFurniture(prev => ({ ...prev, [itemType]: { ...prev[itemType], placed: false } }));
        if (selectedItem === itemType) { setSelectedItem(null); }
    };

    const handleFurnitureSelect = (furniture) => {
        setSelectedFurniture(furniture);
        if (furniture !== 'none' && !placedFurniture[furniture].placed) {
            setPlacedFurniture(prev => ({ ...prev, [furniture]: { ...prev[furniture], placed: true } }));
            setSelectedItem(furniture);
        }
    };

    const toggleModal = () => { setIsModalOpen(!isModalOpen); };
    const toggleColorModal = () => { toggleModal(); };
    const toggleSizeModal = () => { toggleModal(); };
    const togglePlacedFurniturePanel = () => { setIsPlacedFurnitureVisible(!isPlacedFurnitureVisible); };

    const handleAddToCart = (e, furnitureType) => {
        e.stopPropagation();
        console.log(`Added ${furnitureType} to cart`);
    };

    const handlePreciseRotationChange = (itemType, degrees) => {
        const radians = THREE.MathUtils.degToRad(parseFloat(degrees));
        handleRotationChange(itemType, radians);
    };

    const handleIncrementalScaleChange = (itemType, increment) => {
        const currentScale = placedFurniture[itemType].scale;
        let newScale = parseFloat(currentScale) + increment;
        const minScale = itemType === 'chair' ? 0.1 : (itemType === 'coffeeTable' ? 0.3 : 0.5);
        const maxScale = itemType === 'chair' ? 1.0 : 1.2;
        newScale = Math.max(minScale, Math.min(maxScale, newScale));
        handleScaleChange(itemType, newScale.toFixed(3));
    };

  return (
    <div className="flex flex-col h-screen font-sans text-black">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#104F7E]">Furniture plus</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <button className="px-4 py-1 font-medium text-[#104F7E] hover:bg-[#104F7E]/10 rounded-full transition-colors">Add Staff</button>
              <button className="px-4 py-1 font-medium text-[#104F7E] hover:bg-[#104F7E]/10 rounded-full transition-colors">Templates</button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              <div className="h-10 w-10 bg-[#104F7E] rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 font-medium text-[#104F7E] hover:bg-[#104F7E]/10 rounded-full transition-colors">File</button>
              <button className="px-3 py-1 font-medium text-[#104F7E] hover:bg-[#104F7E]/10 rounded-full transition-colors">Edit</button>
              <span className="text-[#104F7E] font-medium ml-4">My Project 2</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex rounded-full overflow-hidden border border-[#104F7E]">
                <button className="bg-white text-[#104F7E] px-4 py-1 text-sm font-medium">2D</button>
                <button className="bg-[#104F7E] text-white px-4 py-1 text-sm font-medium">3D</button>
              </div>
              
              <button 
                onClick={toggleColorModal}
                className="flex items-center justify-center bg-white border border-gray-300 rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>
              
              <button 
                onClick={toggleSizeModal}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Room Size</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[300px] bg-gray-100 p-5 overflow-y-auto flex-shrink-0">
            {/* <h2 className="mt-0 text-black text-xl font-semibold mb-4">Room Designer</h2> */}

            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                  <div className="bg-[#104F7E] rounded-t-xl px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-medium text-white">Edit Room Dimensions & Color</h3>
                    <button
                      className="text-white/70 hover:text-white hover:bg-white/20 rounded-full h-8 w-8 flex items-center justify-center transition-all"
                      onClick={toggleModal}
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                       <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Width (m)</label>
                        <div className="relative">
                          <input type="number" min="1" max="10" step="0.1" value={dimensions[0]} onChange={(e) => handleDimensionChange(0, e.target.value)} className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#104F7E]/50 focus:border-[#104F7E] transition-all"/>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">m</span>
                        </div>
                      </div>
                       <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Height (m)</label>
                        <div className="relative">
                          <input type="number" min="1" max="5" step="0.1" value={dimensions[1]} onChange={(e) => handleDimensionChange(1, e.target.value)} className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#104F7E]/50 focus:border-[#104F7E] transition-all"/>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">m</span>
                        </div>
                      </div>
                       <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Depth (m)</label>
                        <div className="relative">
                          <input type="number" min="1" max="10" step="0.1" value={dimensions[2]} onChange={(e) => handleDimensionChange(2, e.target.value)} className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#104F7E]/50 focus:border-[#104F7E] transition-all"/>
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">m</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Room Color</label>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <input type="color" value={color} onChange={handleColorChange} className="w-12 h-12 rounded-full border border-gray-300 cursor-pointer appearance-none"/>
                        </div>
                        <div className="flex-1">
                          <div className="h-12 rounded-full shadow-inner border border-gray-200" style={{ backgroundColor: color }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-all"
                      onClick={toggleModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2 bg-[#104F7E] hover:bg-[#0d3c61] text-white text-sm rounded-full shadow-md hover:shadow-lg transition-all"
                      onClick={toggleModal}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5">
                <h3 className="mt-5 text-black text-lg font-medium mb-3">Add Furniture</h3>
                <div className="grid grid-cols-2 gap-3 mt-3">
                    {!placedFurniture.chair.placed && (
                    <div className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 bg-white hover:shadow-md ${selectedFurniture === 'chair' ? 'border-[#104F7E] ring-2 ring-[#104F7E]/30' : 'border-gray-300'}`} onClick={() => handleFurnitureSelect('chair')}>
                        <img src={ChairImg} alt="Chair" className="w-full h-20 object-contain mb-2" />
                        <span className="text-sm text-center font-medium mb-2 text-black">Chair</span>
                        <button onClick={(e) => handleAddToCart(e, 'chair')} className="w-full mt-auto bg-[#104F7E]/10 hover:bg-[#104F7E]/20 text-[#104F7E] text-xs px-2 py-1.5 rounded-full transition-colors">
                            Add to Cart
                        </button>
                    </div>
                    )}
                     {!placedFurniture.table.placed && (
                    <div className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 bg-white hover:shadow-md ${selectedFurniture === 'table' ? 'border-[#104F7E] ring-2 ring-[#104F7E]/30' : 'border-gray-300'}`} onClick={() => handleFurnitureSelect('table')}>
                        <img src={TableImg} alt="Table" className="w-full h-20 object-contain mb-2" />
                        <span className="text-sm text-center font-medium mb-2 text-black">Table</span>
                        <button onClick={(e) => handleAddToCart(e, 'table')} className="w-full mt-auto bg-[#104F7E]/10 hover:bg-[#104F7E]/20 text-[#104F7E] text-xs px-2 py-1.5 rounded-full transition-colors">
                            Add to Cart
                        </button>
                    </div>
                    )}
                     {!placedFurniture.sofa.placed && (
                    <div className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 bg-white hover:shadow-md ${selectedFurniture === 'sofa' ? 'border-[#104F7E] ring-2 ring-[#104F7E]/30' : 'border-gray-300'}`} onClick={() => handleFurnitureSelect('sofa')}>
                        <img src={SofaImg} alt="Sofa" className="w-full h-20 object-contain mb-2" />
                        <span className="text-sm text-center font-medium mb-2 text-black">Sofa</span>
                        <button onClick={(e) => handleAddToCart(e, 'sofa')} className="w-full mt-auto bg-[#104F7E]/10 hover:bg-[#104F7E]/20 text-[#104F7E] text-xs px-2 py-1.5 rounded-full transition-colors">
                            Add to Cart
                        </button>
                    </div>
                    )}
                     {!placedFurniture.cupboard.placed && (
                    <div className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 bg-white hover:shadow-md ${selectedFurniture === 'cupboard' ? 'border-[#104F7E] ring-2 ring-[#104F7E]/30' : 'border-gray-300'}`} onClick={() => handleFurnitureSelect('cupboard')}>
                        <img src={CupboardImg} alt="Cupboard" className="w-full h-20 object-contain mb-2" />
                        <span className="text-sm text-center font-medium mb-2 text-black">Cupboard</span>
                        <button onClick={(e) => handleAddToCart(e, 'cupboard')} className="w-full mt-auto bg-[#104F7E]/10 hover:bg-[#104F7E]/20 text-[#104F7E] text-xs px-2 py-1.5 rounded-full transition-colors">
                            Add to Cart
                        </button>
                    </div>
                    )}
                     {!placedFurniture.coffeeTable.placed && (
                    <div className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 bg-white hover:shadow-md ${selectedFurniture === 'coffeeTable' ? 'border-[#104F7E] ring-2 ring-[#104F7E]/30' : 'border-gray-300'}`} onClick={() => handleFurnitureSelect('coffeeTable')}>
                        <img src={CoffeeTableImg} alt="Coffee Table" className="w-full h-20 object-contain mb-2" />
                        <span className="text-sm text-center font-medium mb-2 text-black">Coffee Table</span>
                        <button onClick={(e) => handleAddToCart(e, 'coffeeTable')} className="w-full mt-auto bg-[#104F7E]/10 hover:bg-[#104F7E]/20 text-[#104F7E] text-xs px-2 py-1.5 rounded-full transition-colors">
                            Add to Cart
                        </button>
                    </div>
                    )}
                </div>
            </div>
        </div>

        <div className="flex-1 bg-gray-300 relative">
          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            <button onClick={() => setToggleOrbitControl(!toggleOrbitControl)} className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors group" title={toggleOrbitControl ? "Lock Furniture" : "Unlock Furniture"}>
              {toggleOrbitControl ? <LockOpenIcon className="h-6 w-6" /> : <LockClosedIcon className="h-6 w-6" />}
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {toggleOrbitControl ? "Camera Mode" : "Furniture Mode"}
              </span>
            </button>
            <button onClick={togglePlacedFurniturePanel} className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors group" title={isPlacedFurnitureVisible ? "Hide Placed Items" : "Show Placed Items"}>
              {isPlacedFurnitureVisible ? <XMarkIcon className="h-6 w-6" /> : <ListBulletIcon className="h-6 w-6" />}
               <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isPlacedFurnitureVisible ? "Hide List" : "Show List"}
              </span>
            </button>
          </div>

          {isPlacedFurnitureVisible && (
            <div className="absolute top-28 left-4 z-10 bg-white rounded-lg shadow-lg w-72 max-h-[calc(100vh-10rem)] overflow-y-auto p-4">
              {(placedFurniture.chair.placed || placedFurniture.table.placed || placedFurniture.sofa.placed || placedFurniture.cupboard.placed || placedFurniture.coffeeTable.placed) ? (
              <div>
                  <h3 className="text-black text-lg font-semibold mb-3">Placed Furniture</h3>
                  {Object.entries(placedFurniture).filter(([_, data]) => data.placed).map(([itemType, data]) => (
                    <div key={itemType} className={`bg-gray-100 rounded-lg p-3 mb-3 ${selectedItem === itemType ? 'border-2 border-[#104F7E]' : 'border-2 border-transparent'}`}>
                        <div className="flex justify-between items-center cursor-pointer mb-3" onClick={() => setSelectedItem(itemType)}>
                            <span className="font-medium text-black capitalize">{itemType.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <button
                                className="bg-transparent text-red-500 hover:bg-red-100 rounded-full h-6 w-6 flex items-center justify-center transition-colors"
                                onClick={(e) => { e.stopPropagation(); handleRemoveFurniture(itemType); }}
                                title={`Remove ${itemType}`}
                            >
                                <XMarkIcon className="h-4 w-4"/>
                            </button>
                        </div>
                        {selectedItem === itemType && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <label className="w-[50px] shrink-0 text-sm font-medium text-gray-700">Rotate:</label>
                                <input type="number" value={THREE.MathUtils.radToDeg(data.rotation).toFixed(0)} onChange={(e) => handlePreciseRotationChange(itemType, e.target.value)} className="w-16 px-2 py-1 border border-gray-300 rounded-full text-sm focus:ring-1 focus:ring-[#104F7E]/50 focus:border-[#104F7E]" step="5"/>
                                <span className="text-xs text-gray-500">deg</span>
                                <button className="ml-auto p-1 text-gray-600 hover:bg-gray-200 rounded-full" onClick={() => handleRotationChange(itemType, (data.rotation + Math.PI/2) % (Math.PI*2))} title="Rotate 90°"><ArrowUturnLeftIcon className="h-4 w-4 transform -scale-x-100"/></button>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-[50px] shrink-0 text-sm font-medium text-gray-700">Size:</label>
                                <button onClick={() => handleIncrementalScaleChange(itemType, -0.05)} className="p-1 text-gray-600 hover:bg-gray-200 rounded-full"><MinusIcon className="h-4 w-4"/></button>
                                <input type="range" min={itemType === 'chair' ? 0.1 : (itemType === 'coffeeTable' ? 0.3 : 0.5)} max={itemType === 'chair' ? 1.0 : 1.2} step="0.01" value={data.scale} onChange={(e) => handleScaleChange(itemType, e.target.value)} className="flex-grow h-1.5 bg-gray-300 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#104F7E]/50 focus:ring-offset-1"/>
                                <button onClick={() => handleIncrementalScaleChange(itemType, 0.05)} className="p-1 text-gray-600 hover:bg-gray-200 rounded-full"><PlusIcon className="h-4 w-4"/></button>
                                <span className="text-sm font-mono w-10 text-right text-black">{data.scale.toFixed(2)}</span>
                            </div>
                        </div>
                        )}
                    </div>
                  ))}
              </div>
              ) : (
                 <p className="text-sm text-gray-500 text-center">No furniture placed yet.</p>
              )}
            </div>
          )}

          <Canvas shadows>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
              <PerspectiveCamera makeDefault position={[5, 2, 5]} fov={50} />
              {toggleOrbitControl && <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2} minDistance={1} maxDistance={10}/>}
              <Room dimensions={dimensions} color={color} />
              <FloorGrid size={Math.max(...dimensions) * 2} />
              <Suspense fallback={<ModelLoader />}>
                  {Object.entries(placedFurniture).filter(([_, data]) => data.placed).map(([itemType, data]) => {
                      const ModelComponent = { chair: ChairModel, table: TableModel, sofa: SofaModel, cupboard: CupboardModel, coffeeTable: CoffeeTableModel }[itemType];
                      return (
                          <ModelComponent
                              key={itemType}
                              position={data.position}
                              rotation={[0, data.rotation, 0]}
                              scale={data.scale}
                              onSelect={() => setSelectedItem(itemType)}
                              isSelected={selectedItem === itemType}
                              onPositionChange={(pos) => handlePositionChange(itemType, pos)}
                              isTransformEnabled={!toggleOrbitControl && selectedItem === itemType}
                          />
                      );
                  })}
              </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

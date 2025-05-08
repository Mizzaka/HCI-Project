import React, { useState, Suspense, useEffect } from 'react'; // Added useEffect
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import ChairModel from '../3D_Models/ChairModel';
import TableModel from '../3D_Models/TableModel';
import SofaModel from '../3D_Models/SofaModel';
import CupboardModel from '../3D_Models/CupboardModel';
import CoffeeTableModel from '../3D_Models/CoffeeModel';
import ChairImg from '../assets/chair_2.png';
import TableImg from '../assets/table2.png';
import SofaImg from'../assets/sofa.png';
import CupboardImg from '../assets/cupboard.png';
import CoffeeTableImg from '../assets/coffee_table.png';
import { LockClosedIcon, LockOpenIcon, ListBulletIcon, XMarkIcon, PlusIcon, MinusIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import TopView2D from '../components/TopView2D';
import FrontView2D from '../components/FrontView2D';
import SideView2D from '../components/SideView2D';

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
    const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false); // New state for file dropdown
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false); // State for custom save modal
    const [templateNameInput, setTemplateNameInput] = useState(""); // State for template name input
    const [is2DView, setIs2DView] = useState(false); // State for 2D/3D view toggle
    const [projectName, setProjectName] = useState("My Project"); // Added project name state

    // Initialize cart from localStorage or as an empty array
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('shoppingCart');
        try {
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error parsing cart from localStorage", error);
            return [];
        }
    });

    // Update localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Effect to load a selected template when the component mounts or selectedTemplateName changes
    useEffect(() => {
        const templateNameToLoad = localStorage.getItem('selectedTemplateName');
        if (templateNameToLoad) {
            console.log(`Dashboard: Attempting to load selected template: "${templateNameToLoad}"`); // Added log
            try {
                const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || [];
                const templateToLoad = savedTemplates.find(t => t.name === templateNameToLoad);
                if (templateToLoad) {
                    setDimensions(templateToLoad.dimensions || [3, 2.5, 3]);
                    setColor(templateToLoad.color || '#f5f5f5');
                    setPlacedFurniture(templateToLoad.placedFurniture || {
                        chair: { placed: false, position: [0, 0, 0], scale: 0.5, rotation: 0 },
                        table: { placed: false, position: [0, 0, 0], scale: 0.7, rotation: 0 },
                        sofa: { placed: false, position: [0, 0, 0], scale: 0.8, rotation: 0 },
                        cupboard: { placed: false, position: [0, 0, 0], scale: 0.8, rotation: 0 },
                        coffeeTable: { placed: false, position: [0, 0, 0], scale: 0.7, rotation: 0 },
                    });
                    setProjectName(templateNameToLoad); // Set project name
                    // Optionally, clear the selected template name from localStorage after loading
                    // localStorage.removeItem('selectedTemplateName'); 
                    alert(`Template "${templateNameToLoad}" loaded successfully!`);
                } else {
                    setProjectName("My Project"); // Default if template not found
                    alert(`Template "${templateNameToLoad}" not found.`);
                }
            } catch (error) {
                console.error("Error loading template from localStorage:", error);
                setProjectName("My Project"); // Default on error
                alert("Failed to load template. See console for details.");
            }
            // Clear the name from localStorage whether it was found or not, to prevent re-loading on refresh without explicit selection
            localStorage.removeItem('selectedTemplateName');
        } else {
            setProjectName("My Project"); // Default if no template name in localStorage initially
        }
    }, []); // Runs once on mount, or you might add a dependency if selectedTemplateName could change by other means

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
        setSelectedFurniture(furniture); // For styling the "Add Furniture" item itself

        if (furniture !== 'none') {
            // If the furniture is not yet placed, mark it as placed.
            if (!placedFurniture[furniture].placed) {
                setPlacedFurniture(prev => ({
                    ...prev,
                    [furniture]: { ...prev[furniture], placed: true }
                }));
            }
            // Always set the clicked item as the selected item for the details panel.
            setSelectedItem(furniture);
            
            // If an item is selected from the palette, ensure the "Placed Furniture" panel is visible.
            if (!isPlacedFurnitureVisible) {
                setIsPlacedFurnitureVisible(true);
            }
        }
    };

    const toggleModal = () => { setIsModalOpen(!isModalOpen); };
    const toggleColorModal = () => { toggleModal(); };
    const toggleSizeModal = () => { toggleModal(); };
    const togglePlacedFurniturePanel = () => { setIsPlacedFurnitureVisible(!isPlacedFurnitureVisible); };

    const toggleFileDropdown = () => { // New function to toggle file dropdown
        setIsFileDropdownOpen(!isFileDropdownOpen);
    };

    const handleNewFile = () => {
        // Placeholder for "New File" functionality
        console.log("New File clicked");
        // Resetting the state for a new file
        setDimensions([3, 2.5, 3]);
        setColor('#f5f5f5');
        setSelectedFurniture('none');
        setSelectedItem(null);
        setPlacedFurniture({
            chair: { placed: false, position: [0, 0, 0], scale: 0.5, rotation: 0 },
            table: { placed: false, position: [0, 0, 0], scale: 0.7, rotation: 0 },
            sofa: { placed: false, position: [0, 0, 0], scale: 0.8, rotation: 0 },
            cupboard: { placed: false, position: [0, 0, 0], scale: 0.8, rotation: 0 },
            coffeeTable: { placed: false, position: [0, 0, 0], scale: 0.7, rotation: 0 },
        });
        setProjectName("My Project"); // Reset project name
        setIsFileDropdownOpen(false); // Close dropdown after action
        alert("New file created. The scene has been reset.");
    };

    const handleSaveFile = () => {
        setIsFileDropdownOpen(false); // Close the file dropdown first
        setTemplateNameInput(""); // Reset input field when opening modal
        setIsSaveModalOpen(true); // Open the custom save modal
    };

    const handleConfirmSaveTemplate = () => {
        const fileName = templateNameInput.trim();
        if (fileName !== "") {
            const sceneState = {
                name: fileName,
                dimensions,
                color,
                placedFurniture,
                timestamp: new Date().toISOString(),
                isUnlisted: true, // Added this line to mark the template as unlisted
            };

            try {
                const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || [];
                const existingTemplateIndex = savedTemplates.findIndex(template => template.name === sceneState.name);
                if (existingTemplateIndex > -1) {
                    savedTemplates[existingTemplateIndex] = sceneState;
                    alert(`Template "${sceneState.name}" updated successfully!`);
                } else {
                    savedTemplates.push(sceneState);
                    alert(`Template "${sceneState.name}" saved successfully!`);
                }
                localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
                setProjectName(fileName); // Update project name
                console.log("File saved:", sceneState);
            } catch (error) {
                console.error("Error saving template to localStorage:", error);
                alert("Failed to save template. See console for details.");
            }
            setIsSaveModalOpen(false); // Close modal after saving
            setTemplateNameInput(""); // Reset input field
        } else {
            alert("Template name cannot be empty.");
        }
    };

    const handleAddToCart = (e, furnitureType) => {
        e.stopPropagation(); // Prevents other click handlers if the button is inside a clickable card
        setCartItems(prevCartItems => {
            const existingItemIndex = prevCartItems.findIndex(item => item.type === furnitureType);
            if (existingItemIndex > -1) {
                // Item already in cart, increment quantity
                const updatedCartItems = prevCartItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return updatedCartItems;
            } else {
                // Item not in cart, add as new item
                // You can add more details like price, image, etc., if needed for the cart page
                return [...prevCartItems, { type: furnitureType, quantity: 1, id: `${furnitureType}-${Date.now()}` }];
            }
        });
        // Optional: Provide user feedback
        alert(`${furnitureType.charAt(0).toUpperCase() + furnitureType.slice(1)} has been added to your cart.`);
        console.log("Cart updated:", cartItems); // Note: This will log the cart state before the update due to async nature of setState. The useEffect will log the persisted state.
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
    <div className="flex flex-col h-screen font-sans text-black bg-gradient-to-br from-[#e0f7fa] via-[#ffffff] to-[#e0f7fa]">
      <Navbar />
      <div className="bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* File Dropdown */}
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={toggleFileDropdown}
                className="px-4 py-2 font-medium text-white bg-gradient-to-r from-[#163E43] to-[#163E43] hover:from-[#0d3c61] hover:to-[#104F7E] rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                File
              </button>
              {isFileDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/80 backdrop-blur-md rounded-lg shadow-xl py-2 z-20 border border-gray-200 animate-fadeIn">
                  <button
                    onClick={handleNewFile}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#104F7E] transition-all duration-300"
                  >
                    New File
                  </button>
                  <button
                    onClick={handleSaveFile}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#104F7E] transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              )}
              <span className="text-[#163E43] font-bold ml-4 text-xl transition-all duration-300 transform hover:scale-105">
                {projectName}
              </span>
            </div>

            {/* 2D/3D Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex rounded-full overflow-hidden border border-[#163E43] shadow-md">
                <button
                  onClick={() => setIs2DView(true)}
                  className={`px-6 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    is2DView
                      ? 'bg-gradient-to-r from-[#163E43] to-[#163E43] text-white'
                      : 'bg-white text-[#163E43] hover:bg-gray-100'
                  }`}
                >
                  2D
                </button>
                <button
                  onClick={() => setIs2DView(false)}
                  className={`px-6 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    !is2DView
                      ? 'bg-gradient-to-r from-[#163E43] to-[#163E43] text-white'
                      : 'bg-white text-[#163E43] hover:bg-gray-100'
                  }`}
                >
                  3D
                </button>
              </div>

              {/* Edit Room Dimensions & Color */}
              <button
                onClick={toggleColorModal}
                className="flex items-center justify-center bg-gradient-to-r from-[#163E43] to-[#163E43] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </button>

              {/* Room Size */}
              <button
                onClick={toggleSizeModal}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#163E43] to-[#163E43] text-white rounded-full px-4 py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                <span>Room Size</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Save Template Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="bg-gradient-to-r from-[#163E43] to-[#163E43] rounded-t-xl px-6 py-4">
              <h3 className="text-xl font-bold text-white">Save Template</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name:
                </label>
                <input
                  type="text"
                  id="templateName"
                  value={templateNameInput}
                  onChange={(e) => setTemplateNameInput(e.target.value)}
                  placeholder="Enter a name for your template"
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#104F7E]/50 focus:border-[#104F7E] transition-all"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsSaveModalOpen(false);
                  setTemplateNameInput(""); // Reset input field on cancel
                }}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSaveTemplate}
                className="px-5 py-2 bg-gradient-to-r from-[#163E43] to-[#0d2c30] hover:from-[#0d2c30] hover:to-[#163E43] text-white text-sm rounded-full shadow-md hover:shadow-lg transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[300px] bg-gray-100 p-5 overflow-y-auto flex-shrink-0">
            {/* <h2 className="mt-0 text-black text-xl font-semibold mb-4">Room Designer</h2> */}

            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                  <div className="bg-[#163E43] rounded-t-xl px-6 py-4 flex justify-between items-center">
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
  
  {/* Placed Items Count */}
  <div className="text-sm text-gray-600 mb-3">
    Placed Items: {Object.values(placedFurniture).filter(item => item.placed).length}
  </div>
  
  <div className="grid grid-cols-2 gap-4 mt-3">
    {[
      { type: 'chair', img: ChairImg, label: 'Chair' },
      { type: 'table', img: TableImg, label: 'Table' },
      { type: 'sofa', img: SofaImg, label: 'Sofa' },
      { type: 'cupboard', img: CupboardImg, label: 'Cupboard' },
      { type: 'coffeeTable', img: CoffeeTableImg, label: 'Coffee Table' },
    ].map(({ type, img, label }) => (
      <div
        key={type}
        className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 bg-white hover:shadow-lg hover:scale-105 ${
          selectedFurniture === type
            ? 'border-[#163E43] ring-2 ring-[#104F7E]/30'
            : 'border-gray-300'
        }`}
        onClick={() => handleFurnitureSelect(type)}
      >
        <img
          src={img}
          alt={label}
          className="w-full h-24 object-contain mb-3 transform transition-transform duration-300 hover:scale-110"
        />
        <span className="text-sm text-center font-medium mb-2 text-black">
          {label}
        </span>
        <button
          onClick={(e) => handleAddToCart(e, type)}
          className="w-full mt-auto bg-[#104F7E]/10 hover:bg-[#104F7E]/20 text-[#104F7E] text-xs px-2 py-2 rounded-full transition-colors"
        >
          Add to Cart
        </button>
      </div>
    ))}
  </div>
</div>

        </div>

        <div className="flex-1 bg-gray-300 relative">
          {is2DView ? (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-1 p-1 bg-gray-400">
              <div className="bg-white rounded shadow-lg overflow-hidden col-span-1 lg:col-span-2">
                <h3 className="text-center p-2 bg-gray-100 text-sm font-medium border-b">Top View (Floor Plan)</h3>
                <TopView2D 
                  roomDimensions={dimensions} 
                  roomColor={color} 
                  placedFurniture={placedFurniture} 
                />
              </div>
              <div className="bg-white rounded shadow-lg overflow-hidden">
                <h3 className="text-center p-2 bg-gray-100 text-sm font-medium border-b">Front View</h3>
                <FrontView2D
                  roomDimensions={dimensions} 
                  roomColor={color} 
                  placedFurniture={placedFurniture} 
                />
              </div>
              <div className="bg-white rounded shadow-lg overflow-hidden">
                <h3 className="text-center p-2 bg-gray-100 text-sm font-medium border-b">Side View</h3>
                <SideView2D 
                  roomDimensions={dimensions} 
                  roomColor={color} 
                  placedFurniture={placedFurniture} 
                />
              </div>
            </div>
          ) : (
            <>
              

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
              <div className="absolute bottom-4 left-4 z-10 flex space-x-4">
  {/* Lock Furniture Button */}
  <button
    onClick={() => setToggleOrbitControl(!toggleOrbitControl)}
    className={`flex items-center justify-center bg-gradient-to-r from-[#163E43] to-[#163E43] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
      toggleOrbitControl ? 'opacity-100' : 'opacity-80'
    }`}
    title={toggleOrbitControl ? "Lock Furniture" : "Unlock Furniture"}
  >
    {toggleOrbitControl ? (
      <LockOpenIcon className="h-6 w-6" />
    ) : (
      <LockClosedIcon className="h-6 w-6" />
    )}
  </button>

  {/* Show List Button */}
  <button
    onClick={togglePlacedFurniturePanel}
    className="flex items-center justify-center bg-gradient-to-r from-[#163E43] to-[#163E43] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
    title={isPlacedFurnitureVisible ? "Hide Placed Items" : "Show Placed Items"}
  >
    {isPlacedFurnitureVisible ? (
      <XMarkIcon className="h-6 w-6" />
    ) : (
      <ListBulletIcon className="h-6 w-6" />
    )}
  </button>
</div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

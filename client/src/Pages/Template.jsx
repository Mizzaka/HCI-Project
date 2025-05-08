import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { MoreVertical, User, ShoppingCart, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber'; // Added
import { OrbitControls, PerspectiveCamera, Grid, Html } from '@react-three/drei'; // Added
import * as THREE from 'three'; // Added

// Import 3D Models (adjust paths if necessary)
import ChairModel from '../3D_Models/ChairModel';
import TableModel from '../3D_Models/TableModel';
import SofaModel from '../3D_Models/SofaModel';
import CupboardModel from '../3D_Models/CupboardModel';
import CoffeeTableModel from '../3D_Models/CoffeeModel';

// Simplified Room component for preview
const PreviewRoom = ({ dimensions, color }) => {
    if (!dimensions || dimensions.length < 3) {
        // Default dimensions if not provided or invalid
        dimensions = [3, 2.5, 3]; 
    }
    const [width, height, depth] = dimensions;
    return (
        <mesh position={[0, height / 2, 0]}>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={color || '#f0f0f0'} side={THREE.BackSide} opacity={0.8} transparent />
        </mesh>
    );
};

// Simplified Grid for preview
const PreviewFloorGrid = ({ size }) => {
  return <Grid args={[size, size]} cellSize={0.25} cellThickness={0.5} cellColor="#cccccc" sectionSize={1.5} />;
};

const ModelPreviewLoader = () => {
  return (
    <Html center>
      <div style={{ color: 'grey', fontSize: '0.8em' }}>Loading 3D...</div>
    </Html>
  );
};


const FurnitureTemplate = ({ template, onClick }) => { // Changed props to accept full template
  const { name, timestamp, dimensions, color, placedFurniture } = template;
  const lastModified = timestamp ? new Date(timestamp).toLocaleDateString() : "N/A";

  // Determine a suitable camera position based on room dimensions
  const roomSize = dimensions ? Math.max(...dimensions) : 5;
  const cameraPosition = [roomSize * 1.2, roomSize * 0.8, roomSize * 1.2];


  return (
    <div 
      className="bg-slate-50 rounded-xl shadow-lg p-0 flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer overflow-hidden" // Added overflow-hidden, removed p-5 for now
      onClick={onClick}
    >
      <div className="w-full h-48 bg-gray-200"> {/* Container for 3D preview */}
        {dimensions && color && placedFurniture ? (
          <Canvas shadows dpr={[1, 1.5]}> {/* Added dpr for performance on previews */}
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[5, 8, 5]} 
              intensity={0.8} 
              castShadow 
              shadow-mapSize-width={512} // Reduced shadow map size for previews
              shadow-mapSize-height={512}
            />
            <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
            <OrbitControls 
              target={[0, (dimensions[1] || 2.5) / 3, 0]} // Adjust target based on room height
              enableZoom={false} 
              enablePan={false} 
              minPolarAngle={Math.PI / 4} // Limit vertical rotation
              maxPolarAngle={Math.PI / 2.5}
              autoRotate // Subtle auto-rotation
              autoRotateSpeed={0.7}
            />
            
            <Suspense fallback={<ModelPreviewLoader />}>
              <PreviewRoom dimensions={dimensions} color={color} />
              <PreviewFloorGrid size={Math.max(...dimensions) * 1.5} />
              {Object.entries(placedFurniture).filter(([_, data]) => data.placed).map(([itemType, data]) => {
                  const ModelComponent = { 
                      chair: ChairModel, 
                      table: TableModel, 
                      sofa: SofaModel, 
                      cupboard: CupboardModel, 
                      coffeeTable: CoffeeTableModel 
                  }[itemType];
                  
                  if (!ModelComponent) return null; // Skip if model component is not found

                  return (
                      <ModelComponent
                          key={itemType}
                          position={data.position || [0,0,0]} // Fallback for position
                          rotation={[0, data.rotation || 0, 0]} // Fallback for rotation
                          scale={data.scale || 0.5} // Fallback for scale
                          // For previews, we don't need selection or transform controls
                          isTransformEnabled={false} 
                      />
                  );
              })}
            </Suspense>
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <FileText size={48} className="text-indigo-300" />
            <span className="ml-2">No preview available</span>
          </div>
        )}
      </div>
      
      <div className="p-4 text-left mt-0"> {/* Adjusted padding */}
        <div className="flex justify-between items-start">
          <h3 className="text-md font-semibold text-gray-800 truncate" title={name}>{name}</h3>
          <button className="text-gray-400 hover:text-indigo-600 transition-colors -mt-1 -mr-1"> {/* Adjusted margin for kebab icon */}
            <MoreVertical size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Last modified: {lastModified}</p>
      </div>
    </div>
  );
};

export default function FurniturePlus() {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || [];
      console.log("Loaded templates from localStorage:", savedTemplates); // Debug log
      setTemplates(savedTemplates);
    } catch (error) {
      console.error("Error loading templates from localStorage:", error);
      setTemplates([]);
    }
  }, []);

  const handleCreateNewFile = () => {
    localStorage.removeItem('selectedTemplateName'); // Ensure no template is pre-selected
    navigate('/dashboard'); 
  };

  const handleTemplateClick = (template) => {
    localStorage.setItem('selectedTemplateName', template.name);
    navigate('/dashboard');
    console.log("Load template:", template.name);
  };

  return (
    <div className="min-h-screen bg-white">
     <Navbar />
      <main className="px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome to the Dashboard</h1>
            <p className="text-gray-600">Manage your projects and templates.</p>
          </div>
          <button 
            onClick={handleCreateNewFile}
            className="bg-[#104F7E] hover:bg-[#0d3c61] text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-150 ease-in-out"
          >
            Create New File
          </button>
        </div>
        
        <h2 className="text-2xl font-bold mb-8 text-gray-700">Saved Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.length > 0 ? (
            templates.map(template => (
              <FurnitureTemplate 
                key={template.name} 
                template={template} // Pass the full template object
                onClick={() => handleTemplateClick(template)}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No saved templates yet. Create one from the dashboard!</p>
          )}
        </div>
      </main>
    </div>
  );
}
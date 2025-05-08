import { useState, useEffect, Suspense } from 'react';
import { MoreVertical, FileText, Plus, Clock, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';

// Import 3D Models (adjust paths if necessary)
import ChairModel from '../3D_Models/ChairModel';
import TableModel from '../3D_Models/TableModel';
import SofaModel from '../3D_Models/SofaModel';
import CupboardModel from '../3D_Models/CupboardModel';
import CoffeeTableModel from '../3D_Models/CoffeeModel';

// Styled Spaces colors
const styledSpacesColors = {
  primary: '#163E43',
  secondary: '#1A4B51',
  light: '#E6EEF0',
  accent: '#5A8F94',
};

// Simplified Room component for preview with better styling
const PreviewRoom = ({ dimensions, color }) => {
  if (!dimensions || dimensions.length < 3) {
    dimensions = [3, 2.5, 3]; 
  }
  const [width, height, depth] = dimensions;
  
  return (
    <mesh position={[0, height / 2, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial 
        color={color || '#f0f0f0'} 
        side={THREE.BackSide} 
        opacity={0.85} 
        transparent
        roughness={0.7}
      />
    </mesh>
  );
};

// Enhanced floor grid
const PreviewFloorGrid = ({ size }) => {
  return (
    <Grid 
      args={[size, size]} 
      cellSize={0.25} 
      cellThickness={0.5} 
      cellColor="#cccccc" 
      sectionSize={1.5}
      sectionColor={styledSpacesColors.accent}
      fadeDistance={size * 1.5}
    />
  );
};

const ModelPreviewLoader = () => {
  return (
    <Html center>
      <div className="flex items-center justify-center flex-col">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-2" 
          style={{ borderTopColor: 'transparent', borderColor: styledSpacesColors.primary }}></div>
        <div style={{ color: 'grey', fontSize: '0.8em' }}>Loading 3D...</div>
      </div>
    </Html>
  );
};

const FurnitureTemplate = ({ template, onClick }) => {
  const { name, timestamp, dimensions, color, placedFurniture } = template;
  const lastModified = timestamp ? new Date(timestamp).toLocaleDateString() : "N/A";
  const daysSinceModified = timestamp ? Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24)) : null;

  // Determine a suitable camera position based on room dimensions
  const roomSize = dimensions ? Math.max(...dimensions) : 5;
  const cameraPosition = [roomSize * 1.2, roomSize * 0.8, roomSize * 1.2];

  // Count placed furniture items
  const furnitureCount = placedFurniture ? 
    Object.values(placedFurniture).filter(item => item.placed).length : 0;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer border border-gray-100"
      onClick={onClick}
      style={{ transform: 'translateY(0)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="w-full h-52 relative"> {/* Increased height for better preview */}
        {dimensions && color && placedFurniture ? (
          <Canvas shadows dpr={[1, 1.5]}>
            <color attach="background" args={['#f8f9fa']} />
            
            <ambientLight intensity={0.7} />
            <directionalLight 
              position={[5, 8, 5]} 
              intensity={0.9} 
              castShadow 
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
            />
            <directionalLight 
              position={[-5, 3, -5]} 
              intensity={0.3} 
              color="#b7ceff" 
            />

            <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />
            <OrbitControls 
              target={[0, (dimensions[1] || 2.5) / 3, 0]}
              enableZoom={false} 
              enablePan={false} 
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2.5}
              autoRotate
              autoRotateSpeed={0.8}
            />
            
            <Suspense fallback={<ModelPreviewLoader />}>
              <PreviewRoom dimensions={dimensions} color={color} />
              <PreviewFloorGrid size={Math.max(...dimensions) * 1.5} />
              {Object.entries(placedFurniture).filter(([_, data]) => data.placed).map(([itemType, data], index) => {
                  const ModelComponent = { 
                      chair: ChairModel, 
                      table: TableModel, 
                      sofa: SofaModel, 
                      cupboard: CupboardModel, 
                      coffeeTable: CoffeeTableModel 
                  }[itemType];
                  
                  if (!ModelComponent) return null;

                  return (
                      <ModelComponent
                          key={itemType}
                          position={data.position || [0,0,0]}
                          rotation={[0, data.rotation || 0, 0]}
                          scale={data.scale || 0.5}
                          isTransformEnabled={false}
                      />
                  );
              })}
            </Suspense>
          </Canvas>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <FileText size={50} className="text-gray-400 mb-2" />
            <span className="text-gray-500 font-medium">No preview available</span>
          </div>
        )}
        
        {/* Furniture count badge */}
        {furnitureCount > 0 && (
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-md text-xs font-medium" 
            style={{ color: styledSpacesColors.primary }}>
            {furnitureCount} item{furnitureCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <div className="p-4 text-left flex-grow border-t border-gray-100">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold truncate" style={{ color: styledSpacesColors.primary }} title={name}>{name}</h3>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors -mt-1 -mr-1 p-1"
            style={{ transition: 'transform 0.2s ease' }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <MoreVertical size={18} />
          </button>
        </div>
        
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          {daysSinceModified === 0 ? 'Today' : 
           daysSinceModified === 1 ? 'Yesterday' : 
           `${daysSinceModified} days ago`}
          
          <span className="mx-2 text-gray-300">•</span>
          
          <Calendar size={14} className="mr-1" />
          {lastModified}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs font-medium" style={{ color: styledSpacesColors.primary }}>
            {dimensions ? `${dimensions[0]}m × ${dimensions[2]}m` : 'No dimensions'}
          </div>
          <button 
            className="text-xs font-medium flex items-center"
            style={{ color: styledSpacesColors.secondary }}
          >
            View Details <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Create new template button component
const CreateTemplateButton = ({ onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg flex flex-col items-center justify-center h-full border-2 border-dashed cursor-pointer"
      style={{ 
        borderColor: '#e5e7eb', 
        minHeight: "336px",
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.borderColor = styledSpacesColors.primary;
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      }}
    >
      <div 
        className="rounded-full p-4 mb-3"
        style={{ 
          backgroundColor: styledSpacesColors.light,
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
      >
        <Plus size={30} style={{ color: styledSpacesColors.primary }} />
      </div>
      <p className="font-medium text-lg" style={{ color: styledSpacesColors.primary }}>Create New Template</p>
      <p className="text-gray-500 text-sm mt-2 px-6 text-center">Start designing your new styled space</p>
    </div>
  );
};

export default function FurniturePlus() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setIsLoading(true);
      const savedTemplates = JSON.parse(localStorage.getItem('savedTemplates')) || [];
      console.log("Loaded templates from localStorage:", savedTemplates);
      setTemplates(savedTemplates);
      setTimeout(() => setIsLoading(false), 500); // Add slight delay for animation effect
    } catch (error) {
      console.error("Error loading templates from localStorage:", error);
      setTemplates([]);
      setIsLoading(false);
    }
  }, []);

  const handleCreateNewFile = () => {
    localStorage.removeItem('selectedTemplateName');
    navigate('/dashboard'); 
  };

  const handleTemplateClick = (template) => {
    localStorage.setItem('selectedTemplateName', template.name);
    navigate('/dashboard');
    console.log("Load template:", template.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10"
          style={{ 
            opacity: 0, 
            animation: 'fadeInDown 0.5s forwards',
            animationDelay: '0.2s' 
          }}>
          <div>
            <h1 className="text-4xl font-bold"
              style={{ 
                color: styledSpacesColors.primary,
                opacity: 0,
                animation: 'fadeIn 0.5s forwards',
                animationDelay: '0.3s'
              }}>
              Styled Spaces Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg"
              style={{ 
                opacity: 0,
                animation: 'fadeIn 0.5s forwards',
                animationDelay: '0.4s'
              }}>
              Manage your designed spaces and templates
            </p>
          </div>
          
          <button 
            onClick={handleCreateNewFile}
            className="px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center space-x-2"
            style={{ 
              backgroundColor: styledSpacesColors.primary,
              transition: 'transform 0.3s ease, background-color 0.3s ease',
              opacity: 0,
              animation: 'fadeIn 0.5s forwards',
              animationDelay: '0.5s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = styledSpacesColors.secondary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = styledSpacesColors.primary;
            }}
          >
            <Plus size={18} />
            <span>Create New Design</span>
          </button>
        </div>
        
        <div className="mb-8 pb-4 border-b border-gray-200"
          style={{ 
            opacity: 0,
            animation: 'fadeInUp 0.5s forwards',
            animationDelay: '0.3s'
          }}>
          <h2 className="text-2xl font-semibold text-gray-800">Your Saved Templates</h2>
          <p className="text-gray-500 mt-1">Pick up where you left off or start something new</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" 
              style={{ borderTopColor: 'transparent', borderColor: styledSpacesColors.primary }}></div>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{ 
              opacity: 0,
              animation: 'fadeIn 0.5s forwards',
              animationDelay: '0.5s'
            }}
          >
            <CreateTemplateButton onClick={handleCreateNewFile} />
            
            {templates.length > 0 ? (
              templates.map((template, index) => (
                <div key={template.name} style={{ 
                  opacity: 0,
                  animation: 'fadeInUp 0.5s forwards',
                  animationDelay: `${0.6 + index * 0.1}s`
                }}>
                  <FurnitureTemplate 
                    template={template}
                    onClick={() => handleTemplateClick(template)}
                  />
                </div>
              ))
            ) : (
              <div 
                className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center col-span-2 text-center border border-gray-100"
                style={{ 
                  opacity: 0,
                  animation: 'fadeIn 0.5s forwards',
                  animationDelay: '0.6s'
                }}
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FileText size={28} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No saved templates yet</h3>
                <p className="text-gray-500 max-w-md">
                  Your saved designs will appear here. Start by creating your first styled space template!
                </p>
                <button 
                  onClick={handleCreateNewFile}
                  className="mt-6 px-5 py-2 rounded-lg text-white font-medium"
                  style={{ 
                    backgroundColor: styledSpacesColors.primary,
                    transition: 'transform 0.3s ease, background-color 0.3s ease' 
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = styledSpacesColors.secondary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = styledSpacesColors.primary;
                  }}
                >
                  Create Your First Template
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
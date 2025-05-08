import React, { useState } from 'react';
import { Search, User, Palette, X, Maximize2 } from 'lucide-react';

// Color Picker Component
const ColorPicker = ({ onClose, onColorSelect, currentColor }) => {
  const colors = [
    { name: 'Sky Blue', value: '#87CEEB' },
    { name: 'Lavender', value: '#E6E6FA' },
    { name: 'Mint', value: '#98FF98' },
    { name: 'Peach', value: '#FFDAB9' },
    { name: 'Light Gray', value: '#D3D3D3' },
    { name: 'Cream', value: '#FFFDD0' },
    { name: 'Light Pink', value: '#FFB6C1' },
    { name: 'Pale Yellow', value: '#FFFFE0' },
  ];

  return (
    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg p-4 w-64 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Wall Color</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            className={`w-12 h-12 rounded-lg border-2 ${
              currentColor === color.value ? 'border-blue-500' : 'border-transparent'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

// Room Size Modal Component
const RoomSizeModal = ({ onClose, onApply, currentSize }) => {
  const [width, setWidth] = useState(currentSize.width.toString());
  const [length, setLength] = useState(currentSize.length.toString());
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const numWidth = parseFloat(width);
    const numLength = parseFloat(length);
    
    if (numWidth > 0 && numLength > 0) {
      onApply({ width: numWidth, length: numLength });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Room Dimensions</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (meters)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                step="0.1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length (meters)
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                step="0.1"
                required
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#0A4B7C] text-white rounded-md hover:bg-[#083d66]"
              >
                Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Canvas Grid Background Component
const CanvasBackground = ({ wallColor, roomSize }) => {
  const baseSize = 400;
  const scale = Math.min(roomSize.width, roomSize.length) / 5;
  const roomWidth = (roomSize.width / scale) * baseSize;
  const roomLength = (roomSize.length / scale) * baseSize;

  return (
    <div className="relative w-full h-full overflow-auto">
      <div 
        className="absolute inset-0 min-w-full min-h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundColor: '#f8fafc'
        }}
      >
        <div 
          className="absolute left-1/4 top-1/4 transform-gpu"
          style={{
            width: `${roomWidth}px`,
            height: `${roomLength}px`
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-white border border-gray-300" />
            
            <div className="absolute -top-6 left-0 w-full flex justify-center">
              <span className="bg-white px-2 py-1 text-sm rounded-md shadow-sm">
                {roomSize.width}m
              </span>
            </div>
            <div className="absolute -left-6 top-0 h-full flex items-center">
              <span className="bg-white px-2 py-1 text-sm rounded-md shadow-sm transform -rotate-90">
                {roomSize.length}m
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3D View Component
const ThreeDView = ({ wallColor, roomSize }) => {
  const baseSize = 400;
  const scale = Math.min(roomSize.width, roomSize.length) / 5;
  const roomWidth = (roomSize.width / scale) * baseSize;
  const roomLength = (roomSize.length / scale) * baseSize;

  return (
    <div className="w-full h-full bg-gray-100 grid place-items-center overflow-auto">
      <div 
        className="relative transform-gpu"
        style={{
          width: `${roomWidth}px`,
          height: `${roomLength}px`
        }}
      >
        <div className="absolute inset-0 bg-gray-300 transform rotate-45" />
        
        <div 
          className="absolute top-0 right-0 w-full h-full transform origin-right"
          style={{
            backgroundColor: wallColor,
            transform: 'skewY(-45deg)',
            transformOrigin: 'right top'
          }}
        />
        <div 
          className="absolute top-0 left-0 w-full h-full transform origin-left"
          style={{
            backgroundColor: wallColor,
            transform: 'skewY(45deg)',
            transformOrigin: 'left top'
          }}
        />
        
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <span className="bg-white px-2 py-1 text-sm rounded-md shadow-sm">
            {roomSize.width}m
          </span>
        </div>
        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
          <span className="bg-white px-2 py-1 text-sm rounded-md shadow-sm">
            {roomSize.length}m
          </span>
        </div>
      </div>
    </div>
  );
};
// Furniture Categories Data
const furnitureCategories = [
    {
      id: 'chairs',
      name: 'Chairs',
      items: [
        { image: '/chair-beige.jpg', alt: 'Beige Chair', name: 'Beige Chair', price: '$199' },
        { image: '/chair-blue.jpg', alt: 'Blue Chair', name: 'Blue Chair', price: '$249' },
        { image: '/chair-modern.jpg', alt: 'Modern Chair', name: 'Modern Chair', price: '$299' },
        { image: '/chair-office.jpg', alt: 'Office Chair', name: 'Office Chair', price: '$179' },
      ]
    },
    {
      id: 'tables',
      name: 'Tables',
      items: [
        { image: '/coffee-table.jpg', alt: 'Coffee Table', name: 'Coffee Table', price: '$399' },
        { image: '/dining-table.jpg', alt: 'Dining Table', name: 'Dining Table', price: '$699' },
        { image: '/side-table.jpg', alt: 'Side Table', name: 'Side Table', price: '$149' },
        { image: '/round-table.jpg', alt: 'Round Table', name: 'Round Table', price: '$449' },
      ]
    },
    {
      id: 'storage',
      name: 'Storage',
      items: [
        { image: '/wardrobe.jpg', alt: 'Wardrobe', name: 'Wardrobe', price: '$899' },
        { image: '/cabinet.jpg', alt: 'Cabinet', name: 'Cabinet', price: '$599' },
        { image: '/bookshelf.jpg', alt: 'Bookshelf', name: 'Bookshelf', price: '$349' },
        { image: '/drawer.jpg', alt: 'Drawer Unit', name: 'Drawer Unit', price: '$449' },
      ]
    },
    {
      id: 'beds',
      name: 'Beds',
      items: [
        { image: '/queen-bed.jpg', alt: 'Queen Bed', name: 'Queen Bed', price: '$999' },
        { image: '/single-bed.jpg', alt: 'Single Bed', name: 'Single Bed', price: '$599' },
        { image: '/bunk-bed.jpg', alt: 'Bunk Bed', name: 'Bunk Bed', price: '$1299' },
        { image: '/sofa-bed.jpg', alt: 'Sofa Bed', name: 'Sofa Bed', price: '$799' },
      ]
    },
    {
      id: 'sofas',
      name: 'Sofas',
      items: [
        { image: '/sofa-green.jpg', alt: 'Green Sofa', name: 'Green Sofa', price: '$899' },
        { image: '/sectional.jpg', alt: 'Sectional Sofa', name: 'Sectional', price: '$1499' },
        { image: '/loveseat.jpg', alt: 'Loveseat', name: 'Loveseat', price: '$699' },
        { image: '/recliner.jpg', alt: 'Recliner', name: 'Recliner', price: '$599' },
      ]
    }
  ];
  
  // Category Tab Component
  const CategoryTab = ({ category, isActive, onClick }) => (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? 'bg-[#0A4B7C] text-white' 
          : 'text-gray-600 hover:bg-gray-100'
        }`}
      onClick={onClick}
    >
      {category.name}
    </button>
  );
  
  // Furniture Item Component
  const FurnitureItem = ({ image, alt, name, price }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
      <div className="p-2">
        <img src={image} alt={alt} className="w-full h-32 object-cover rounded-md mb-2" />
        <div className="px-1">
          <h3 className="text-sm font-medium text-gray-800 truncate">{name}</h3>
          <p className="text-sm text-gray-600">{price}</p>
        </div>
      </div>
    </div>
  );
  
  // Furniture Sidebar Component
  const FurnitureSidebar = () => {
    const [activeCategory, setActiveCategory] = useState(furnitureCategories[0].id);
    const [searchQuery, setSearchQuery] = useState('');
  
    const filteredFurniture = furnitureCategories.find(cat => cat.id === activeCategory)
      ?.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];
  
    return (
      <div className="w-80 bg-white p-4 shadow-sm flex flex-col h-full">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search furniture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
  
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {furnitureCategories.map(category => (
            <CategoryTab
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
  
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 pb-4">
            {filteredFurniture.map((item, index) => (
              <FurnitureItem key={index} {...item} />
            ))}
          </div>
        </div>
  
        <button className="w-full bg-[#0A4B7C] text-white py-3 rounded-lg hover:bg-[#083d66] transition-colors mt-4">
          Add Custom Furniture
        </button>
      </div>
    );
  };
  
  // Main Component
  const TestFurnitureDesigner = () => {
    const [viewMode, setViewMode] = useState('2D');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showRoomSize, setShowRoomSize] = useState(false);
    const [wallColor, setWallColor] = useState('#87CEEB');
    const [roomSize, setRoomSize] = useState({ width: 5, length: 4 });
  
    const handleRoomSizeApply = (newSize) => {
      setRoomSize(newSize);
      setShowRoomSize(false);
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#0A4B7C]">Furniture plus</h1>
          <div className="flex items-center space-x-4">
            <h2 className="text-lg">My Project 2</h2>
            <button className="p-2 rounded-full bg-blue-100">
              <User className="w-6 h-6 text-[#0A4B7C]" />
            </button>
          </div>
        </header>
  
        <div className="flex h-[calc(100vh-4rem)]">
          <FurnitureSidebar />
  
          <div className="flex-1 p-4">
            <div className="flex justify-between mb-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-6 py-2 rounded-md ${
                    viewMode === '2D' ? 'bg-[#0A4B7C] text-white' : 'text-gray-600'
                  }`}
                  onClick={() => setViewMode('2D')}
                >
                  2D
                </button>
                <button
                  className={`px-6 py-2 rounded-md ${
                    viewMode === '3D' ? 'bg-[#0A4B7C] text-white' : 'text-gray-600'
                  }`}
                  onClick={() => setViewMode('3D')}
                >
                  3D
                </button>
              </div>
              
              <div className="flex gap-4">
                <div className="relative">
                  <button 
                    className={`p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow ${
                      showColorPicker ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <Palette className="w-6 h-6 text-gray-600" />
                  </button>
                  {showColorPicker && (
                    <ColorPicker
                      onClose={() => setShowColorPicker(false)}
                      onColorSelect={(color) => {
                        setWallColor(color);
                        setShowColorPicker(false);
                      }}
                      currentColor={wallColor}
                    />
                  )}
                </div>
                
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setShowRoomSize(true)}
                >
                  <Maximize2 className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">Room Size</span>
                </button>
              </div>
            </div>
  
            <div className="w-full h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm overflow-hidden">
              {viewMode === '2D' ? (
                <CanvasBackground wallColor={wallColor} roomSize={roomSize} />
              ) : (
                <ThreeDView wallColor={wallColor} roomSize={roomSize} />
              )}
            </div>
          </div>
        </div>
        
        {showRoomSize && (
          <RoomSizeModal
            onClose={() => setShowRoomSize(false)}
            onApply={handleRoomSizeApply}
            currentSize={roomSize}
          />
        )}
      </div>
    );
  };
  
  export default TestFurnitureDesigner;
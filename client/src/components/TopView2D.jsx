import React from 'react';
import * as THREE from 'three'; // Keep for THREE.MathUtils.radToDeg

const TopView2D = ({ roomDimensions, roomColor, placedFurniture }) => {
  // Validate roomDimensions
  if (!Array.isArray(roomDimensions) || roomDimensions.length < 3 || 
      typeof roomDimensions[0] !== 'number' || isNaN(roomDimensions[0]) || roomDimensions[0] <= 0 ||
      typeof roomDimensions[2] !== 'number' || isNaN(roomDimensions[2]) || roomDimensions[2] <= 0) {
    console.error("[TopView2D] Invalid room dimensions provided:", roomDimensions);
    return <div className="w-full h-full flex items-center justify-center text-red-500 p-4 text-center">Invalid Room Dimensions for Top View. Please check room width and depth.</div>;
  }
  const [widthMeters, , depthMeters] = roomDimensions;

  const scaleFactor = 50;
  const roomWidthPx = widthMeters * scaleFactor;
  const roomDepthPx = depthMeters * scaleFactor;

  const furnitureDimensions2D = {
    chair: { w: 0.6, d: 0.6, color: '#8B4513' },
    table: { w: 1.2, d: 0.8, color: '#A0522D' },
    sofa: { w: 2, d: 0.9, color: '#696969' },
    cupboard: { w: 1, d: 0.5, color: '#D2B48C' },
    coffeeTable: { w: 0.8, d: 0.5, color: '#CD853F' },
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-gray-200 p-4 overflow-auto"
      key={`room-${widthMeters}-${depthMeters}`}
    >
      <div
        style={{
          width: `${roomWidthPx}px`,
          height: `${roomDepthPx}px`,
          backgroundColor: roomColor,
          border: '2px solid #333',
          position: 'relative',
          boxSizing: 'content-box',
        }}
      >
        {Object.entries(placedFurniture)
          .filter(([_, data]) => data.placed)
          .map(([itemType, data]) => {
            const itemDetails2D = furnitureDimensions2D[itemType] || { w: 0.5, d: 0.5, color: 'grey' };
            
            if (!data.position || 
                typeof data.position[0] !== 'number' || isNaN(data.position[0]) || 
                typeof data.position[2] !== 'number' || isNaN(data.position[2])) {
                console.warn(`[TopView2D] Invalid or missing position for ${itemType}. Skipping render. Data:`, data);
                return null; 
            }
            // Ensure rotation is a number, default to 0 if not
            const rotationValue = (typeof data.rotation === 'number' && !isNaN(data.rotation)) ? data.rotation : 0;

            const itemWidthPx = itemDetails2D.w * scaleFactor;
            const itemHeightPx = itemDetails2D.d * scaleFactor;
            const itemLeftPx = (data.position[0] + widthMeters / 2) * scaleFactor - itemWidthPx / 2;
            const itemTopPx = (data.position[2] + depthMeters / 2) * scaleFactor - itemHeightPx / 2;
            const rotationDegrees = THREE.MathUtils.radToDeg(rotationValue);

            return (
              <div
                key={itemType} // Ensure key is unique if multiple items of same type, consider data.id if available
                title={`${itemType} (Top View)`}
                style={{
                  position: 'absolute',
                  width: `${itemWidthPx}px`,
                  height: `${itemHeightPx}px`,
                  left: `${itemLeftPx}px`,
                  top: `${itemTopPx}px`,
                  backgroundColor: itemDetails2D.color,
                  border: '1px solid #555',
                  transform: `rotate(${rotationDegrees}deg)`,
                  transformOrigin: 'center center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'white',
                  boxSizing: 'border-box',
                }}
              >
                {/* {itemType.substring(0,1).toUpperCase()} */}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TopView2D;

import React from 'react';
import * as THREE from 'three'; // For MathUtils if needed

const SideView2D = ({ roomDimensions, roomColor, placedFurniture }) => {
  // Validate roomDimensions
  if (!Array.isArray(roomDimensions) || roomDimensions.length < 3 || 
      typeof roomDimensions[1] !== 'number' || isNaN(roomDimensions[1]) || roomDimensions[1] <= 0 ||
      typeof roomDimensions[2] !== 'number' || isNaN(roomDimensions[2]) || roomDimensions[2] <= 0) {
    console.error("[SideView2D] Invalid room dimensions provided:", roomDimensions);
    return <div className="w-full h-full flex items-center justify-center text-red-500 p-4 text-center">Invalid Room Dimensions for Side View. Please check room height and depth.</div>;
  }
  const [/* roomWidthMeters */, roomHeightMeters, roomDepthMeters] = roomDimensions;

  const scaleFactor = 50; // Pixels per meter

  const viewWidthPx = roomDepthMeters * scaleFactor; // Side view width is room's depth
  const viewHeightPx = roomHeightMeters * scaleFactor;

  // Define 2D dimensions for furniture (depth, height for side view)
  // 'd' is the perceived depth of the furniture item in this 2D projection.
  // 'h' is its height.
  // 'yOffset' is how much to lift the item from the floor.
  const furnitureDimensions2D = {
    chair:       { d: 0.6, h: 0.8, color: '#8B4513', yOffset: 0 },
    table:       { d: 0.8, h: 0.75, color: '#A0522D', yOffset: 0 },
    sofa:        { d: 0.9, h: 0.85, color: '#696969', yOffset: 0 },
    cupboard:    { d: 0.5, h: 1.8, color: '#D2B48C', yOffset: 0 },
    coffeeTable: { d: 0.5, h: 0.45, color: '#CD853F', yOffset: 0 },
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-gray-200 p-2 overflow-auto"
      key={`side-room-${roomDepthMeters}-${roomHeightMeters}`}
    >
      <div
        style={{
          width: `${viewWidthPx}px`,
          height: `${viewHeightPx}px`,
          backgroundColor: roomColor,
          border: '2px solid #333',
          position: 'relative',
          boxSizing: 'content-box',
        }}
      >
        {/* Optional: Render a floor line */}
        <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            backgroundColor: '#555'
        }}></div>

        {Object.entries(placedFurniture)
          .filter(([_, data]) => data.placed)
          .map(([itemType, data]) => {
            const itemDetails = furnitureDimensions2D[itemType] || { d: 0.5, h: 0.5, color: 'grey', yOffset: 0 };
            
            // Robustness check for position data
            if (!data.position || 
                typeof data.position[1] !== 'number' || isNaN(data.position[1]) || 
                typeof data.position[2] !== 'number' || isNaN(data.position[2])) {
                console.warn(`[SideView2D] Invalid or missing position for ${itemType}. Skipping render. Data:`, data);
                return null;
            }
            
            const itemWidthPx = itemDetails.d * scaleFactor; // In side view, item "width" on screen is its depth
            const itemHeightPx = itemDetails.h * scaleFactor;

            // Convert 3D position to 2D:
            // Z-axis (3D) -> X-axis (2D Left for side view)
            // Y-axis (3D) + yOffset -> Y-axis (2D Bottom)
            const itemLeftPx = (data.position[2] + roomDepthMeters / 2) * scaleFactor - itemWidthPx / 2;
            
            const itemBaseFromFloor3D = data.position[1] + (roomHeightMeters / 2);
            const itemBottomPx = (itemBaseFromFloor3D + itemDetails.yOffset) * scaleFactor;

            // Rotation: Similar to FrontView, Y-axis rotation is complex to represent accurately with simple boxes
            // without changing the box dimensions based on angle. Typically ignored for simple side orthographic.

            return (
              <div
                key={`${itemType}-side`}
                title={`${itemType} (Side View)`}
                style={{
                  position: 'absolute',
                  width: `${itemWidthPx}px`,
                  height: `${itemHeightPx}px`,
                  left: `${itemLeftPx}px`,
                  bottom: `${itemBottomPx}px`,
                  backgroundColor: itemDetails.color,
                  border: '1px solid #555',
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

export default SideView2D;

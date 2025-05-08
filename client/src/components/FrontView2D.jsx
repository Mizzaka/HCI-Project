import React from 'react';
import * as THREE from 'three'; // For MathUtils if needed for rotation, though less common in front view

const FrontView2D = ({ roomDimensions, roomColor, placedFurniture }) => {
  // Validate roomDimensions
  if (!Array.isArray(roomDimensions) || roomDimensions.length < 3 || 
      typeof roomDimensions[0] !== 'number' || isNaN(roomDimensions[0]) || roomDimensions[0] <= 0 ||
      typeof roomDimensions[1] !== 'number' || isNaN(roomDimensions[1]) || roomDimensions[1] <= 0) {
    console.error("[FrontView2D] Invalid room dimensions provided:", roomDimensions);
    return <div className="w-full h-full flex items-center justify-center text-red-500 p-4 text-center">Invalid Room Dimensions for Front View. Please check room width and height.</div>;
  }
  const [roomWidthMeters, roomHeightMeters /*, roomDepthMeters */] = roomDimensions;

  const scaleFactor = 50; // Pixels per meter

  const viewWidthPx = roomWidthMeters * scaleFactor;
  const viewHeightPx = roomHeightMeters * scaleFactor;

  // Define 2D dimensions for furniture (width, height for front view)
  // These are simplified. 'h' is the perceived height in this 2D projection.
  // 'yOffset' is how much to lift the item from the floor (0 = on floor).
  const furnitureDimensions2D = {
    chair:       { w: 0.6, h: 0.8, color: '#8B4513', yOffset: 0 }, // Brown
    table:       { w: 1.2, h: 0.75, color: '#A0522D', yOffset: 0 }, // Sienna
    sofa:        { w: 2,   h: 0.85, color: '#696969', yOffset: 0 }, // DimGray
    cupboard:    { w: 1,   h: 1.8, color: '#D2B48C', yOffset: 0 }, // Tan
    coffeeTable: { w: 0.8, h: 0.45, color: '#CD853F', yOffset: 0 }, // Peru
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-gray-200 p-2 overflow-auto"
      key={`front-room-${roomWidthMeters}-${roomHeightMeters}`}
    >
      <div
        style={{
          width: `${viewWidthPx}px`,
          height: `${viewHeightPx}px`,
          backgroundColor: roomColor,
          border: '2px solid #333',
          position: 'relative', // For absolute positioning of furniture
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
            const itemDetails = furnitureDimensions2D[itemType] || { w: 0.5, h: 0.5, color: 'grey', yOffset: 0 };
            
            // Robustness check for position data
            if (!data.position || 
                typeof data.position[0] !== 'number' || isNaN(data.position[0]) || 
                typeof data.position[1] !== 'number' || isNaN(data.position[1])) {
                console.warn(`[FrontView2D] Invalid or missing position for ${itemType}. Skipping render. Data:`, data);
                return null;
            }
            
            const itemWidthPx = itemDetails.w * scaleFactor;
            const itemHeightPx = itemDetails.h * scaleFactor;

            // Convert 3D position to 2D:
            // X-axis (3D) -> X-axis (2D Left)
            // Y-axis (3D, furniture base) + yOffset -> Y-axis (2D Bottom)
            const itemLeftPx = (data.position[0] + roomWidthMeters / 2) * scaleFactor - itemWidthPx / 2;
            
            // Calculate bottom position: 3D Y is usually the base of the object.
            // Add item's 3D Y position (relative to room center Y) to room's half height to get distance from room bottom.
            // Then subtract the item's 2D height.
            // (data.position[1] is height from center of room floor, which is 0 for items on floor)
            // For items on the floor, their base (data.position[1] = 0) aligns with the room's y=0 (center).
            // The 2D view's origin (0,0) is top-left.
            // So, bottom of item = (roomHeightMeters / 2 - data.position[1] - itemDetails.yOffset) * scaleFactor
            // itemTopPx = viewHeightPx - bottom_of_item - itemHeightPx
            
            // Simpler: position from bottom of the view
            // data.position[1] is the 3D Y coordinate of the item's origin.
            // Assume item's origin is at its base for simplicity in 2D.
            // The 3D room's floor is at Y = -roomHeightMeters / 2.
            // The height of the item's base from the 3D room floor is data.position[1] - (-roomHeightMeters / 2)
            // = data.position[1] + roomHeightMeters / 2
            const itemBaseFromFloor3D = data.position[1] + (roomHeightMeters / 2);
            const itemBottomPx = (itemBaseFromFloor3D + itemDetails.yOffset) * scaleFactor;


            // Rotation: Generally, Y-axis rotation (around vertical axis) in 3D doesn't change front view silhouette significantly
            // unless the object is very asymmetrical and you want to show a slightly turned view.
            // For a simple orthographic front view, we often ignore Y-rotation or show a "default" front.
            // X or Z rotation would tilt it, which is more complex for simple 2D boxes.

            return (
              <div
                key={`${itemType}-front`}
                title={`${itemType} (Front View)`}
                style={{
                  position: 'absolute',
                  width: `${itemWidthPx}px`,
                  height: `${itemHeightPx}px`,
                  left: `${itemLeftPx}px`,
                  bottom: `${itemBottomPx}px`, // Positioned from the bottom
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

export default FrontView2D;

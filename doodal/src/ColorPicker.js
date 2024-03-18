// ColorPicker.js
import React from "react";
import { CirclePicker, TwitterPicker } from "react-color";

function ColorPicker({ value, onChange }) {
  const customColors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF8C00", // Dark orange
    "#FFD700", // Gold
    "#32CD32", // Lime green
    "#1E90FF", // Dodger blue
    "#9932CC", // Dark orchid
    "#FF69B4", // Hot pink
    "#008080", // Teal
    "#DC143C", // Crimson
    "#FF4500", // Orange red
    "#4682B4", // Steel blue
    "#808000", // Olive
    "#800080", // Purple
    "#00CED1", // Dark turquoise
    "#7FFFD4", // Aquamarine
    "#9370DB", // Medium purple
    "#FF6347", // Tomato
    "#00FA9A", // Medium spring green
    "#8A2BE2", // Blue violet
    "#FFA500", // Orange
    "#48D1CC", // Medium slate blue
    "#E6E6FA", // Lavender
    "#FFB6C1", // Light pink
  ];

  return (
    <div>
      <CirclePicker
        color={value}
        onChange={(color) =>
          onChange(
            `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
          )
        }
        colors={customColors} // Pass the custom color palette
        style={{
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}

export default ColorPicker;

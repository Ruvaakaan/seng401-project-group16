// ColorPicker.js
import React from "react";
import { SketchPicker } from "react-color";

function ColorPicker({ value, onChange }) {
  return (
    <div>
      <SketchPicker
        color={value}
        onChange={(color) => onChange(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)}
        style={{
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}

export default ColorPicker;

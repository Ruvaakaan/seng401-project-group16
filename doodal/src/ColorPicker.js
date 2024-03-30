// ColorPicker.js
import React from "react";
import { CirclePicker } from "react-color";

function ColorPicker({ value, onChange }) {
  const additionalColors = ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"];

  return (
    <div>
      <CirclePicker
        color={value}
        onChange={(color) =>
          onChange(
            `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
          )
        }
        colors={[...CirclePicker.defaultProps.colors, ...additionalColors]}
        style={{
          boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
}

export default ColorPicker;

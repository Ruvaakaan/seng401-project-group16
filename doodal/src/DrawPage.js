import React, { useState } from "react";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";
import { Button } from "react-bootstrap";
import Brush from "./Brush";
import Toolbar from "./Toolbar"

function DrawPage() {
  const [lineColor, setLineColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [backgroundColorPickerEnabled, setBackgroundColorPickerEnabled] = useState(false);
  const [brushColorPickerEnabled, setBrushColorPickerEnabled] = useState(false);


  const handleColorChange = (color) => {
    setLineColor(color);
  };

  const handleBrushSizeChange = (size) => {
    setBrushSize(size);
  };

  const handleBackgroundChange = (color) => {
    setBackgroundColor(color);
  };

  const toggleBackgroundColorPicker = () => {
    setBackgroundColorPickerEnabled(!backgroundColorPickerEnabled);
  }

  const toggleBrushColorPicker = () => {
    setBrushColorPickerEnabled(!brushColorPickerEnabled);
  }



    return (
      <>
          <Toolbar
              backgroundColorPickerEnabled={backgroundColorPickerEnabled}
              brushColorPickerEnabled={brushColorPickerEnabled}
              handleBackgroundChange={handleBackgroundChange}
              handleColorChange={handleColorChange}
              handleBrushSizeChange={handleBrushSizeChange}
              lineColor={lineColor}
              brushSize={brushSize}
              backgroundColor={backgroundColor}
          />


        <Canvas lineColor={lineColor} brushSize={brushSize} backgroundColor={backgroundColor}/>
      </>
  );
}

export default DrawPage;
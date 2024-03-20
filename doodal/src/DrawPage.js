import React, { useState } from "react";
import Canvas from "./Canvas";
import { useLocation } from "react-router-dom";



function DrawPage() {
  const [lineColor, setLineColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [backgroundColorPickerEnabled, setBackgroundColorPickerEnabled] =
    useState(false);
  const [brushColorPickerEnabled, setBrushColorPickerEnabled] = useState(false);
  const location = useLocation();
  const prompt = location.state?.prompt;
  const comp_id = location.state?.comp_id;

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
  };

  const toggleBrushColorPicker = () => {
    setBrushColorPickerEnabled(!brushColorPickerEnabled);
  };

  return (
    <>
      <h1 className="prompt-display prompt-title">{prompt}</h1>
      <Canvas
        backgroundColorPickerEnabled={backgroundColorPickerEnabled}
        brushColorPickerEnabled={brushColorPickerEnabled}
        handleBackgroundChange={handleBackgroundChange}
        handleColorChange={handleColorChange}
        handleBrushSizeChange={handleBrushSizeChange}
        lineColor={lineColor}
        brushSize={brushSize}
        backgroundColor={backgroundColor}
        comp_id={comp_id}
        prompt={prompt}
      />
    </>
  );
}

export default DrawPage;

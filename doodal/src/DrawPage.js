import React, { useState } from "react";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";
import { Button } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import Brush from "./Brush";

function DrawPage() {
  const [lineColor, setLineColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [backgroundColorPickerEnabled, setBackgroundColorPickerEnabled] = useState(false);
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
  }

  const toggleBrushColorPicker = () => {
    setBrushColorPickerEnabled(!brushColorPickerEnabled);
  }

  return (
    <>
      <Button variant="primary" onClick={toggleBackgroundColorPicker}>
        {backgroundColorPickerEnabled ? "Collapse Background Color Picker" : "Expand Background Color Picker"}
      </Button>

      <Button variant="primary" onClick={toggleBrushColorPicker}>
        {brushColorPickerEnabled ? "Collapse Brush Color Picker" : "Expand Brush Color Picker"}
      </Button>

      {backgroundColorPickerEnabled && (
        <>
          <ColorPicker value={backgroundColor} onChange={handleBackgroundChange} />
        </>
      )}

      {brushColorPickerEnabled && (
        <>
          <ColorPicker value={lineColor} onChange={handleColorChange} />
        </>
      )}
      <h1>{prompt}{comp_id}</h1>
      <Brush value={brushSize} onChange={handleBrushSizeChange}/>
      <Canvas lineColor={lineColor} brushSize={brushSize} backgroundColor={backgroundColor} comp_id={comp_id}/>
    </>
  );
}

export default DrawPage;

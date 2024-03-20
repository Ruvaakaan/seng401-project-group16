import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  Form,
  ButtonGroup,
  ButtonToolbar,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
import makeApiCall from "./makeApiCall.js";
import ColorPicker from "./ColorPicker";
import Brush from "./Brush";
import NotLoggedIn from "./NotLoggedIn.js";

function Canvas({
  lineColor,
  brushSize,
  backgroundColor,
  comp_id,
  backgroundColorPickerEnabled,
  brushColorPickerEnabled,
  handleBackgroundChange,
  handleColorChange,
  handleBrushSizeChange,
  prompt,
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [eraserMode, setEraserMode] = useState(false);
  const [canvasStates, setCanvasStates] = useState([]);
  const [straightLineMode, setStraightLineMode] = useState(false);
  const [rectangleMode, setRectangleMode] = useState(false);
  const [triangleMode, setTriangleMode] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [showBackgroundColorOptions, setShowBackgroundColorOptions] =
    useState(false);
  const [showBrushColorOptions, setShowBrushColorOptions] = useState(false);
  const [showBrushRangePicker, setShowBrushRangePicker] = useState(false);
  const [userNotLogged, setUserNotLogged] = useState(false);

  const toggleBackgroundColorOptions = () => {
    console.log("toggled");
    setShowBackgroundColorOptions(!showBackgroundColorOptions);
  };

  const toggleBrushColorOptions = () => {
    setShowBrushColorOptions(!showBrushColorOptions);
  };

  const toggleBrushRangePicker = () => {
    setShowBrushRangePicker(!showBrushRangePicker);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  }, [backgroundColor]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasStates((prevStates) => [...prevStates, newState]);
  };

  const startDrawing = (event) => {
    setIsDrawing(true);
    if (straightLineMode || rectangleMode || triangleMode) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      setStartPoint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.beginPath();
    }
    saveCanvasState();
  };

  const drawFreehand = (event) => {
    if (context) {
      context.lineWidth = brushSize;
      context.lineCap = "round";
      context.strokeStyle = eraserMode ? backgroundColor : lineColor;

      context.lineTo(
        event.clientX - canvasRef.current.offsetLeft,
        event.clientY - canvasRef.current.offsetTop
      );
      context.stroke();
      context.beginPath();
      context.moveTo(
        event.clientX - canvasRef.current.offsetLeft,
        event.clientY - canvasRef.current.offsetTop
      );
    }
  };

  const drawLine = (start, end) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = eraserMode ? backgroundColor : lineColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const drawRectangle = (start, end) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = eraserMode ? backgroundColor : lineColor;
    ctx.lineWidth = brushSize;

    const width = end.x - start.x;
    const height = end.y - start.y;

    ctx.strokeRect(start.x, start.y, width, height);
  };

  const drawTriangle = (point1, point2) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = eraserMode ? backgroundColor : lineColor;
    ctx.lineWidth = brushSize;

    const baseLength = Math.sqrt(
      (point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2
    );
    const height = (Math.sqrt(3) / 2) * baseLength;

    const midPointX = (point1.x + point2.x) / 2;
    const midPointY = (point1.y + point2.y) / 2;

    const point3X = midPointX + (height * (point1.y - point2.y)) / baseLength;
    const point3Y = midPointY + (height * (point2.x - point1.x)) / baseLength;
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3X, point3Y);
    ctx.closePath();
    ctx.stroke();
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const currentPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    if (!straightLineMode && !rectangleMode && !triangleMode) {
      drawFreehand(event);
    } else {
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(canvasStates[canvasStates.length - 1], 0, 0);

      if (straightLineMode) {
        drawLine(startPoint, currentPoint);
      } else if (rectangleMode) {
        drawRectangle(startPoint, currentPoint);
      } else if (triangleMode) {
        drawTriangle(startPoint, currentPoint);
      }
    }
  };

  const toggleStraightLineMode = () => {
    setRectangleMode(false);
    setTriangleMode(false);
    setStraightLineMode(!straightLineMode);
  };

  const toggleRectangleMode = () => {
    setStraightLineMode(false);
    setTriangleMode(false);
    setRectangleMode(!rectangleMode);
  };

  const toggleTriangleMode = () => {
    setStraightLineMode(false);
    setRectangleMode(false);
    setTriangleMode(!triangleMode);
  };

  const toggleEraserMode = () => {
    setStraightLineMode(false);
    setRectangleMode(false);
    setTriangleMode(false);
    setEraserMode(!eraserMode);
  };

  const handleUndo = () => {
    if (canvasStates.length > 1) {
      const previousState = canvasStates.slice(0, -1);
      setCanvasStates(previousState);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      previousState.forEach((state) => {
        ctx.putImageData(state, 0, 0);
      });
    }
  };

  const handleResetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  };

  const handleUpload = async () => {
    try {
      const canvas = canvasRef.current;
      const img = canvas.toDataURL("image/jpeg");
      const img_data = img.replace(/^data:image\/jpeg;base64,/, "");
      const jsonData = {
        competition_id: comp_id,
      };
      jsonData.image_data = img_data;

      const jsonString = JSON.stringify(jsonData);
      const link = `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/upload_drawing`;
      await makeApiCall(link, "POST", jsonString);
      window.location.href = `/gallery/${comp_id}?prompt=${prompt}`
    } catch (error) {
      console.error("Error uploading drawing:", error);
    }
  };

  return (
    <>
      <div className="canvas-container">
        <NotLoggedIn
          isOpen={userNotLogged}
          onClose={() => setUserNotLogged(false)}
        />

        <ButtonGroup vertical className="button-choice-group">
          <Button className="upload-button" onClick={handleUpload}>
            Upload
          </Button>

          <Button
            className="color-selector"
            onClick={toggleBackgroundColorOptions}
          >
            <i className="fa fa-fill"></i>

            <div>
              <ColorPicker
                value={backgroundColor}
                onChange={handleBackgroundChange}
              />
            </div>
          </Button>

          <Button className="color-selector" onClick={toggleBrushColorOptions}>
            <i className="fa fa-palette"></i>

            <div>
              <ColorPicker value={lineColor} onChange={handleColorChange} />
            </div>
          </Button>

          <Button className="color-selector">
            <i className="fa fa-paint-brush"></i>
          </Button>

          <div style={{ margin: "20px" }}>
            <Brush value={brushSize} onChange={handleBrushSizeChange} />
            <ButtonToolbar>
              <ButtonGroup>
                {[1, 5.75, 10.5, 15.25, 20].map((size, index) => (
                  <Button
                    key={index}
                    variant="link"
                    onClick={() => handleBrushSizeChange(size)}
                    className="color-selector"
                  >
                    <svg width="20" height="20">
                      <circle
                        cx="10"
                        cy="10"
                        r={size / 2.2}
                        stroke="black"
                        strokeWidth="2"
                        fill={brushSize === size ? "black" : "none"}
                      />
                    </svg>
                  </Button>
                ))}
              </ButtonGroup>
            </ButtonToolbar>
          </div>
        </ButtonGroup>

        <canvas
          ref={canvasRef}
          onMouseDown={(event) => startDrawing(event)}
          onMouseUp={() => stopDrawing()}
          onMouseMove={(event) => draw(event)}
          onMouseLeave={() => stopDrawing()}
          width={742}
          height={659}
          style={{ border: "1px solid #000", borderRadius: "1px" }}
        ></canvas>

        <ButtonGroup vertical className="button-choice-group">
          <Button className={`color-selector ${straightLineMode ? "selected" : ""}`} onClick={toggleStraightLineMode}>
            <i className="fa fa-slash"></i>
          </Button>

          <Button className={`color-selector ${rectangleMode ? "selected" : ""}`} onClick={toggleRectangleMode}>
            <i class="fa-solid fa-square-full"></i>
          </Button>

          <Button className={`color-selector ${triangleMode ? "selected" : ""}`} onClick={toggleTriangleMode}>
            <i class="fa-solid fa-play"></i>
          </Button>

          <Button className="color-selector" onClick={handleResetCanvas}>
            <i className="fa fa-trash"></i>
          </Button>

          <Button className="color-selector" onClick={handleUndo}>
            <i className="fa fa-undo"></i>
          </Button>

          <Button className={`color-selector ${eraserMode ? "selected" : ""}`} onClick={toggleEraserMode}>
            <i className="fa fa-eraser"></i> 
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

export default Canvas;

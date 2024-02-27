import React, { useRef, useEffect, useState } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import {FaEraser, FaUndo, FaTrash, FaRegSquare, FaSlash} from "react-icons/fa";
import {FaSquareCheck} from "react-icons/fa6";

// resetting canvas when transparent background doesnt work correctly
// going off screen whilst holding mouse button and then letting go of mouse leaves mouse pressed
// add drawing with shapes
// add maybe a fill function
// add maybe a straight line function

function Canvas({ lineColor, brushSize, backgroundColor }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [eraserMode, setEraserMode] = useState(false);
  const [canvasStates, setCanvasStates] = useState([]);
  const [straightLineMode, setStraightLineMode] = useState(false);
  const [rectangleMode, setRectangleMode] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  }, [backgroundColor]);

  useEffect(() => {
    console.log(canvasStates);
  }, [canvasStates]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasStates((prevStates) => [...prevStates, newState]);
  };

  const startDrawing = (event) => {
    setIsDrawing(true);
    if (straightLineMode || rectangleMode) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      setStartPoint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
      }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.beginPath();
    }
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

  const drawLine = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = eraserMode ? backgroundColor : lineColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
  };

  const drawRectangle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = eraserMode ? backgroundColor : lineColor;
    ctx.lineWidth = brushSize;

    const width = endPoint.x - startPoint.x;
    const height = endPoint.y - startPoint.y;

    ctx.strokeRect(startPoint.x, startPoint.y, width, height);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    if(!straightLineMode && !rectangleMode)
      drawFreehand(event);

    else {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(canvasStates[canvasStates.length - 1], 0, 0);

      setEndPoint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });

      if (straightLineMode)
        drawLine();

      else if (rectangleMode)
        drawRectangle();
    }
  };

  const toggleStraightLineMode = () => {
    setStraightLineMode(!straightLineMode);
  };

  const toggleRectangleMode = () => {
    setRectangleMode(!rectangleMode);
  };

    const toggleEraserMode = () => {
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

  return (
      <>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>

            <Button variant="primary" onClick={handleResetCanvas} className="me-2">
              <FaTrash />
            </Button>
            <Button variant="primary" onClick={handleUndo} className="me-2">
              <FaUndo />
            </Button>
            <Button
                variant={eraserMode ? "danger" : "primary"}
                onClick={toggleEraserMode}
                className="me-2"
            >
              <FaEraser /> {eraserMode ? "" : ""}
            </Button>



          <Button
              variant={straightLineMode ? "danger" : "primary"}
              onClick={toggleStraightLineMode}
              className="me-2"
          >
            <FaSlash /> {straightLineMode ? "" : ""}
          </Button>

          <Button
              variant={rectangleMode ? "danger" : "primary"}
              onClick={toggleRectangleMode}
              className="me-2"
          >
            <FaRegSquare /> {rectangleMode ? "" : ""}
          </Button>

        </div>


        <canvas
            ref={canvasRef}
            onMouseDown={(event) => startDrawing(event)}
            onMouseUp={() => stopDrawing()}
            onMouseMove={(event) => draw(event)}
            onMouseLeave={() => stopDrawing()}
            width={800}
            height={600}
            style={{ border: "1px solid #000" }}
        ></canvas>
      </>

  );
}

export default Canvas;
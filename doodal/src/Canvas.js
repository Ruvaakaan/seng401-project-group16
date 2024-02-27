import React, { useRef, useEffect, useState } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import {FaEraser, FaUndo, FaTrash, FaRegSquare, FaSlash} from "react-icons/fa";
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';

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
  const [triangleMode, setTriangleeMode] = useState(false);
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
    if (straightLineMode || rectangleMode || triangleMode) {
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

    const baseLength = Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
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
      y: event.clientY - rect.top
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
      }
        else if(triangleMode) {
        drawTriangle(startPoint, currentPoint);
        }
      }
  };

  const toggleStraightLineMode = () => {
    setRectangleMode(false);
    setTriangleeMode(false);
    setStraightLineMode(!straightLineMode);
  };

  const toggleRectangleMode = () => {
    setStraightLineMode(false);
    setTriangleeMode(false);
    setRectangleMode(!rectangleMode);
  };

  const toggleTriangleMode = () => {
    setStraightLineMode(false);
    setRectangleMode(false);
    setTriangleeMode(!triangleMode);
  };

  const toggleEraserMode = () => {
    setStraightLineMode(false);
    setRectangleMode(false);
    setTriangleeMode(false)
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
          <Button
              variant={straightLineMode ? "danger" : "primary"}
              onClick={toggleStraightLineMode}
              className="me-2"
              style={{ width: "50px" }}
          >
            <FaSlash /> {straightLineMode ? "" : ""}
          </Button>
          <Button
              variant={rectangleMode ? "danger" : "primary"}
              onClick={toggleRectangleMode}
              className="me-2"
              style={{ width: "50px" }}
          >
            <FaRegSquare /> {rectangleMode ? "" : ""}
          </Button>
          <Button
              variant={triangleMode ? "danger" : "primary"}
              onClick={toggleTriangleMode}
              className="me-2"
              style={{ width: "50px" }}
          >
            <ChangeHistoryIcon /> {triangleMode ? "" : ""}
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <Button variant="primary" onClick={handleResetCanvas} className="me-2" style={{ width: "50px" }}>
            <FaTrash />
          </Button>
          <Button variant="primary" onClick={handleUndo} className="me-2" style={{ width: "50px" }}>
            <FaUndo />
          </Button>
          <Button
              variant={eraserMode ? "danger" : "primary"}
              onClick={toggleEraserMode}
              className="me-2"
              style={{ width: "50px" }}
          >
            <FaEraser /> {eraserMode ? "" : ""}
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
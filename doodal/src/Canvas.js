import React, { useRef, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import NotLoggedIn from "./NotLoggedIn.js";
import Cookies from "js-cookie";
import makeApiCall from "./makeApiCall.js";
// resetting canvas when transparent background doesnt work correctly
// going off screen whilst holding mouse button and then letting go of mouse leaves mouse pressed
// add drawing with shapes
// add maybe a fill function
// add maybe a straight line function

function Canvas({ lineColor, brushSize, backgroundColor, comp_id }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [eraserMode, setEraserMode] = useState(false);
  const [canvasStates, setCanvasStates] = useState([]);
  const [userNotLogged, setUserNotLogged] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  }, [backgroundColor]);

  // useEffect(() => {
  //   console.log(canvasStates);
  // }, [canvasStates]);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setCanvasStates((prevStates) => [...prevStates, newState]);
  };

  const startDrawing = () => {
    setIsDrawing(true);
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

  const draw = (event) => {
    if (!isDrawing) return;
    drawFreehand(event);
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

  const handleUpload = () => {
    try {      
      const canvas = canvasRef.current;
      const img = canvas.toDataURL("image/jpeg");
      const img_data = img.replace(/^data:image\/jpeg;base64,/, "");
      const jsonData = {
        competition_id: comp_id
      };
      jsonData.image_data = img_data;

      const jsonString = JSON.stringify(jsonData);
      const link = `https://p7kiqce3wh.execute-api.us-west-2.amazonaws.com/test/upload_drawing`;
      const res = makeApiCall(link, "POST", jsonString)
    } catch (error) {
      console.error("Error uploading drawing:", error);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleResetCanvas}>
        Reset Canvas
      </Button>
      <Button variant="primary" onClick={handleUndo}>
        Undo
      </Button>

      <Button variant="primary" onClick={handleUpload}>
        Upload
      </Button>

      <Form.Check
        type="checkbox"
        id="eraserMode"
        label="Eraser Mode"
        checked={eraserMode}
        onChange={toggleEraserMode}
      />

      <NotLoggedIn
        isOpen={userNotLogged}
        onClose={() => setUserNotLogged(false)}
      />

      <canvas
        ref={canvasRef}
        onMouseDown={() => startDrawing()}
        onMouseUp={() => stopDrawing()}
        onMouseMove={(event) => draw(event)}
        width={742}
        height={659}
        style={{ border: "1px solid #000" }}
      ></canvas>
    </div>
  );
}

export default Canvas;

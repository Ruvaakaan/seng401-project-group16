import React, { useState } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import ColorPicker from "./ColorPicker";
import Brush from "./Brush";
import { FaFill, FaPalette, FaPaintBrush } from "react-icons/fa";

function Toolbar({
                     backgroundColorPickerEnabled,
                     brushColorPickerEnabled,
                     handleBackgroundChange,
                     handleColorChange,
                     handleBrushSizeChange,
                     lineColor,
                     brushSize,
                     backgroundColor,
                 }) {
    const [showBackgroundColorOptions, setShowBackgroundColorOptions] = useState(false);
    const [showBrushColorOptions, setShowBrushColorOptions] = useState(false);
    const [showBrushRangePicker, setShowBrushRangePicker] = useState(false);

    const toggleBackgroundColorOptions = () => {
        setShowBackgroundColorOptions(!showBackgroundColorOptions);
    };

    const toggleBrushColorOptions = () => {
        setShowBrushColorOptions(!showBrushColorOptions);
    };

    const toggleBrushRangePicker = () => {
        setShowBrushRangePicker(!showBrushRangePicker);
    };
    console.log("toggleBrushRangePicker value:", toggleBrushRangePicker);


    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" }}>
            <ButtonToolbar aria-label="Drawing Toolbar">
                <div className="me-2">
                    <ButtonGroup>
                        <Button
                            variant="primary"
                            onClick={toggleBackgroundColorOptions}
                            style={{ width: "50px" }}
                        >
                            {backgroundColorPickerEnabled ? (
                                "Collapse Background Color Picker"
                            ) : (
                                <FaFill />
                            )}
                        </Button>
                        {showBackgroundColorOptions && (
                            <div className="background-color-options">
                                <ColorPicker
                                    value={backgroundColor}
                                    onChange={handleBackgroundChange}
                                />
                            </div>
                        )}
                    </ButtonGroup>
                </div>

                <div className="me-2">
                    <ButtonGroup>
                        <Button
                            variant="primary"
                            onClick={toggleBrushColorOptions}
                            style={{ width: "50px" }}
                        >
                            {brushColorPickerEnabled ? "Collapse Brush Color Picker" : <FaPalette />}
                        </Button>
                        {showBrushColorOptions && (
                            <div className="brush-color-options">
                                <ColorPicker
                                    value={lineColor}
                                    onChange={handleColorChange}
                                />
                            </div>
                        )}
                    </ButtonGroup>
                </div>
                <div className="me-2">
                    <Button
                        variant={showBrushRangePicker ? "danger" : "primary"}
                        onClick={toggleBrushRangePicker}
                        style={{ width: "50px" }}
                    >
                        <FaPaintBrush /> {showBrushRangePicker ? "" : ""}
                    </Button>
                </div>
            </ButtonToolbar>

            {showBrushRangePicker && (
                <div style={{ marginTop: "10px" }}>
                    <ButtonToolbar aria-label="Brush Sizes">
                        <ButtonGroup>
                            <Brush value={brushSize} onChange={handleBrushSizeChange}/>
                            <Button
                                variant="link"
                                onClick={() => handleBrushSizeChange(1)}
                                className={brushSize === 1 ? "selected" : ""}
                            >
                                <svg width="20" height="20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="2"
                                        stroke="black"
                                        strokeWidth="2"
                                        fill={brushSize === 1 ? "black" : "none"}
                                    />
                                </svg>
                            </Button>

                            <Button
                                variant="link"
                                onClick={() => handleBrushSizeChange(3)}
                                className={brushSize === 3 ? "selected" : ""}
                            >
                                <svg width="20" height="20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="3.5"
                                        stroke="black"
                                        strokeWidth="2"
                                        fill={brushSize === 3 ? "black" : "none"}
                                    />
                                </svg>
                            </Button>

                            <Button
                                variant="link"
                                onClick={() => handleBrushSizeChange(5)}
                                className={brushSize === 5 ? "selected" : ""}
                            >
                                <svg width="20" height="20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="5"
                                        stroke="black"
                                        strokeWidth="2"
                                        fill={brushSize === 5 ? "black" : "none"}
                                    />
                                </svg>
                            </Button>

                            <Button
                                variant="link"
                                onClick={() => handleBrushSizeChange(15)}
                                className={brushSize === 15 ? "selected" : ""}
                            >
                                <svg width="20" height="20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="7"
                                        stroke="black"
                                        strokeWidth="2"
                                        fill={brushSize === 15 ? "black" : "none"}
                                    />
                                </svg>
                            </Button>

                            <Button
                                variant="link"
                                onClick={() => handleBrushSizeChange(20)}
                                className={brushSize === 20 ? "selected" : ""}
                            >
                                <svg width="20" height="20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="9"
                                        stroke="black"
                                        strokeWidth="2"
                                        fill={brushSize === 20 ? "black" : "none"}
                                    />
                                </svg>
                            </Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            )}
        </div>
    );



}

export default Toolbar;

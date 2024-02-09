import React from "react";
import { Form } from "react-bootstrap";

function Brush({ value, onChange }) {
  return (
    <Form.Range
      label="Brush Size"
      min="1"
      max="20"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
    />
  );
}

export default Brush;

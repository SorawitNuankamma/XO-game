import { useState } from "react";

import "../styles/mark-element.css";

import CloseIcon from "@mui/icons-material/Close";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";

const renderValue = {
  0: null,
  1: (
    <div className="animation-pop">
      <CloseIcon fontSize="large" />
    </div>
  ),
  2: (
    <div className="animation-pop">
      <PanoramaFishEyeIcon fontSize="large" />
    </div>
  ),
};

export default function MarkElement(props) {
  return (
    <div
      className={`element ${props.style} ${
        props.value === 1 ? `player1` : `player2`
      } `}
      onClick={() => {
        if (!props.disabled) {
          props.callback(
            props.position.row,
            props.position.column,
            props.value,
            props.player,
            props.rows
          );
        }
      }}
    >
      {`${props.position.row} ${props.position.column}`}
    </div>
  );
}

import * as React from "react";
import { context } from "../components/Controls";

export function useHover() {
  const [hovered, setHover] = React.useState(false);
  const [bind] = React.useState(() => ({
    onPointerOver: () => setHover(true),
    onPointerOut: () => setHover(false),
  }));
  return [bind, hovered];
}

export function useDrag(onDrag, onStart, onEnd) {
  const active = React.useRef(false);
  const [, toggle] = React.useContext(context);
  const [bind] = React.useState(() => ({
    onPointerDown: (event) => {
      event.stopPropagation();
      event.target.setPointerCapture(event.pointerId);
      active.current = true;
      // We don't want the camera to move while we're dragging, toggle it off
      toggle(false);
      if (onStart) onStart();
    },
    onPointerUp: (event) => {
      event.stopPropagation();
      event.target.releasePointerCapture(event.pointerId);
      active.current = false;
      // Drag has concluded, toggle the controls on again
      toggle(true);
      if (onEnd) onEnd();
    },
    onPointerMove: (event) => {
      if (active.current) {
        event.stopPropagation();
        onDrag(event.point);
      }
    },
  }));
  return bind;
}

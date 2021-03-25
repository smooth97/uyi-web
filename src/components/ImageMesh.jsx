import ReactDOM from "react-dom";
import * as THREE from "three/src/Three";
import React, { useState, useCallback, useMemo } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { useSpring, a, interpolate } from "react-spring/three";
import data from "../data";
import "../styles.css";

/** This component loads an image and projects it onto a plane */
function Image({ url, opacity, scale, ...props }) {
  const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
  const [hovered, setHover] = useState(false);
  const hover = useCallback(() => setHover(true), []);
  const unhover = useCallback(() => setHover(false), []);
  const { factor } = useSpring({ factor: hovered ? 1.1 : 1 });
  return (
    <a.mesh
      {...props}
      onHover={hover}
      onUnhover={unhover}
      scale={factor.interpolate((f) => [scale * f, scale * f, 1])}
    >
      <planeBufferGeometry attach="geometry" args={[5, 5]} />
      <a.meshLambertMaterial attach="material" transparent opacity={opacity}>
        <primitive attach="map" object={texture} />
      </a.meshLambertMaterial>
    </a.mesh>
  );
}

/** This component creates a bunch of parallaxed images */
function Images({ top, mouse, scrollMax }) {
  return data.map(([url, x, y, z, scale], index) => (
    <Image
      key={index}
      url={url}
      scale={scale}
      opacity={top.interpolate([0, 500], [0, 1])}
      position={interpolate([top, mouse], (top, mouse) => [
        x + (-mouse[0] * (z * 10 + 10)) / 50000,
        y +
          (mouse[1] * (z * 10 + 10)) / 50000 +
          (top * (z * 10 + 10)) / scrollMax,
        z,
      ])}
    />
  ));
}

/** This component maintains the scene */
function Scene({ top, mouse }) {
  const { size } = useThree();
  const scrollMax = size.height * 4.25;
  console.log(top);

  return (
    <>
      <a.spotLight
        intensity={1.2}
        color="white"
        position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])}
      />
      <Images top={top} mouse={mouse} scrollMax={scrollMax} />
    </>
  );
}

/** Main component */
export default function ImageMesh() {
  // This tiny spring right here controlls all(!) the animations, one for scroll, the other for mouse movement ...
  const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }));
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }),
    []
  );
  const onScroll = useCallback((e) => set({ top: e.target.scrollTop }), []);
  return (
    <>
      <Canvas className="canvas">
        <Scene top={top} mouse={mouse} />
      </Canvas>
      <div
        className="scroll-container"
        onScroll={onScroll}
        onMouseMove={onMouseMove}
      >
        <div style={{ height: "525vh" }} />
      </div>
    </>
  );
}

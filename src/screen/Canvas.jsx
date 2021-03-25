import React, { useState, useMemo } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import { Draggable } from "./Draggable";
import * as THREE from "three";
import Person from "../images/person_walking.png";

const Mesh = ({ texture }) => {
  const { viewport } = useThree();
  const size = viewport.width / 5;

  return (
    <mesh scale={[size, size, size]}>
      <planeBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};

function ImageMesh() {
  const url =
    "https://uyi-images.s3.amazonaws.com/dev/cybertron.cg.tu-berlin.de/person_walking1.png";
  const texture = new THREE.TextureLoader().load(Person);
  // const texture = useMemo(() => new THREE.TextureLoader().load(url), [url]);
  return <Mesh texture={texture} />;
}

function Ground(props) {
  const { viewport } = useThree();
  const size = viewport.width;

  const onPointerDown = (e) => e.stopPropagation();
  return (
    <mesh onPointerDown={onPointerDown} rotation-x={-Math.PI / 2} {...props}>
      <planeBufferGeometry args={[size, size]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} />
    </>
  );
}

export default function CanvasComp() {
  // drag
  const [drag, setDrag] = useState(false);
  const dragProps = {
    onDragStart: () => setDrag(true),
    onDragEnd: () => setDrag(false),
  };

  return (
    <Canvas camera={{ position: [0, 2, 4] }}>
      <color attach="background" args={["black"]} />
      <OrbitControls enabled={!drag} />
      <Ground position-y={-0.5} />
      <Lighting />
      <Draggable {...dragProps}>
        <ImageMesh />
      </Draggable>
    </Canvas>
  );
}

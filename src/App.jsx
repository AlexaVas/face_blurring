/** @format */

import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import UserInterface from "./components/UserInterface.jsx";
import { useState } from "react";

export default function App() {
  const [editMode, setEditMode] = useState(false);
  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-1, 0, 0],
        }}>
        <Experience editMode={editMode} />
      </Canvas>
      <UserInterface editMode={editMode} setEditMode={setEditMode} />
    </>
  );
}

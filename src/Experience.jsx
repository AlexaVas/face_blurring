/** @format */
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import PanoramaViewer from "./components/PanoramaViewer";
import { useEffect } from "react";
import { useThree, extend } from "@react-three/fiber";

extend({ OrbitControls });
export default function Experience({ editMode }) {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleWheel = (event) => {
      const zoomFactor = 1; // zoom speed

      if (event.deltaY < 0) {
        // Zoom in and out by adjusting the field of view
        camera.fov = Math.max(20, camera.fov - zoomFactor);
      } else {
        camera.fov = Math.min(75, camera.fov + zoomFactor);
      }
      camera.updateProjectionMatrix();
    };

    gl.domElement.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      gl.domElement.removeEventListener("wheel", handleWheel);
    };
  }, [camera, gl.domElement]);

  return (
    <>
      {/* <Perf position="top-left" /> */}

      <OrbitControls
        enablePan={true}
        rotateSpeed={-0.5}
        minDistance={1}
        maxDistance={1}
      />

      <PanoramaViewer editMode={editMode} />
    </>
  );
}

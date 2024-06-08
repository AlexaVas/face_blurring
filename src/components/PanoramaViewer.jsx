/** @format */

import PanoramaMaterial from "../materials/PanoramaMaterial";
import panoramaImage from "/panorama.jpg";
import panoramaImageLow from "/panorama-low.jpg";
import * as THREE from "three";
import { useControls } from "leva";
import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function PanoramaViewer({ editMode = false }) {
  //** Controls **//

  const { radius, distortion } = useControls("blurring", {
    distortion: { value: 1.5, min: 0, max: 5, step: 0.01 },
    radius: { value: 0.13, min: 0.05, max: 0.5, step: 0.01 },
  });

  //**Texture Loader**//
  const textureLoader = new THREE.TextureLoader();

  //**Declaring useRefs and state variables */
  const materialRef = useRef();
  const markerRef = useRef();
  const intersectionRef = useRef();

  const [texture, setTexture] = useState(null);

  const [clickPoints, setClickPoints] = useState(
    Array(20).fill(new THREE.Vector3())
  );
  const [uRadius, setRadius] = useState(Array(20).fill(0));

  useEffect(() => {
    // Load low-resolution texture first
    textureLoader.load(panoramaImageLow, (texture) => {
      setTexture(texture);

      // Load high-resolution texture after low-res texture is loaded
      textureLoader.load(panoramaImage, (highResTexture) => {
        highResTexture.magFilter = THREE.LinearFilter;
        highResTexture.minFilter = THREE.LinearFilter;
        setTexture(highResTexture);
      });
    });
  }, []);

  const mouseMove = (e) => {
    const point = e.intersections[0].point;
    intersectionRef.current = point; //Store intersection point when moving the mouse to update the marker in the edit mode
  };

  const handleClick = (e) => {
    if (editMode) {
      const point = e.intersections[0].point; //Store the intersection point on the mesh

      setClickPoints((prevPoints) => {
        // If array is full, replace the oldest point with the new one
        if (prevPoints.length === 20) {
          prevPoints.shift();
          prevPoints.push(point);
        }
        return [...prevPoints];
      });

      setRadius((prevUradius) => {
        // If array is full, replace the oldest point with the new one
        if (prevUradius.length === 20) {
          prevUradius.shift();
          prevUradius.push(radius);
        }
        return [...prevUradius];
      });
    }
  };

  useFrame((state) => {
    if (materialRef.current && editMode) {
      // Update the shader uniforms when in edit mode
      materialRef.current.uniforms.uClickPoints.value = clickPoints;
      materialRef.current.uniforms.uNumPoints.value = clickPoints.length;
      materialRef.current.uniforms.uRadius.value = uRadius;

      //**Update the marker position and rotation**//

      //Rotation to ensure the marker is always facing the camera
      const direction = new THREE.Vector3();
      state.camera.getWorldPosition(direction);
      direction.sub(markerRef.current.position);
      markerRef.current.lookAt(
        markerRef.current.position.clone().add(direction)
      );

      //Position to follow the cursor
      markerRef.current.position.copy(intersectionRef.current.clone());
    }
    //update distortion value regardless of the  edit mode
    materialRef.current.uniforms.uDistortion.value = distortion;
  });

  return (
    <>
      <mesh
        onPointerMove={mouseMove}
        onClick={handleClick}
        position={[0, 0, 0]}>
        <sphereGeometry args={[10, 30, 30]} />
        <PanoramaMaterial
          materialRef={materialRef}
          uImage={texture}
          wireframe={false}
          uClickPoints={clickPoints}
          uRadius={uRadius}
        />
      </mesh>
      <mesh
        ref={markerRef}
        scale={10}
        visible={editMode}
        rotation={[0, 0.3, 0]}>
        <sphereGeometry args={[radius, 20, 20]} />
        <meshBasicMaterial opacity={0.8} transparent />
      </mesh>
    </>
  );
}

/** @format */
import panoramaVertex from "/shaders/panorama/vertex.glsl";
import panoramaFragment from "/shaders/panorama/fragment.glsl";
import * as THREE from "three";
import { useMemo } from "react";

const PanoramaMaterial = ({
  uImage,
  wireframe,
  materialRef,
  uClickPoints,
  uRadius,
}) => {
  // Use useMemo to create and memoize the shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uImage: new THREE.Uniform(uImage || null),
        uClickPoints: new THREE.Uniform(uClickPoints),
        uNumPoints: new THREE.Uniform(0),
        uRadius: new THREE.Uniform(uRadius),
        uDistortion: new THREE.Uniform(1.5),
      },
      vertexShader: panoramaVertex,
      fragmentShader: panoramaFragment,
      wireframe: wireframe || false,
      side: THREE.BackSide,
    });
  }, [uImage, wireframe]);

  return <primitive ref={materialRef} object={material} attach="material" />;
};

export default PanoramaMaterial;

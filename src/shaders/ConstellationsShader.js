import * as THREE from "three";

export function createConstellationsMaterial(params = {}) {
  const uniforms = {
    time: { value: params.time !== undefined ? params.time : 0.0 },
    scale: { value: params.scale !== undefined ? params.scale : 1.0 },
    opacity: { value: params.opacity !== undefined ? params.opacity : 1.0 },
    camFadeDist: {
      value: params.camFadeDist !== undefined ? params.camFadeDist : 5e5,
    },
    color: {
      value: new THREE.Color(
        params.color !== undefined ? params.color : 0xffffff
      ),
    },
  };

  const vertexShader = `
    precision mediump float;

    uniform float time;
    uniform float scale;
    uniform float opacity;
    uniform float camFadeDist;
    uniform vec3 color;

    attribute vec2 attributes;

    varying vec4 vColor;

    void main() {

      vec3 pos = position * scale;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

      float camdist = length(cameraPosition);
      float alpha = 1.0 - smoothstep(0.0, camFadeDist, camdist);


      float twinkle = 0.85 + 0.15 * sin(time * 0.5);

      vColor = vec4(color, opacity * alpha * twinkle);
    }
  `;

  const fragmentShader = `
    precision mediump float;

    varying vec4 vColor;

    void main() {
      if (vColor.a < 0.01) discard;
      gl_FragColor = vColor;
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false, 
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}


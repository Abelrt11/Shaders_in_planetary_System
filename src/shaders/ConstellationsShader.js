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

    // Estos los inyecta three.js automáticamente:
    // uniform mat4 modelViewMatrix;
    // uniform mat4 projectionMatrix;
    // uniform vec3 cameraPosition;
    // attribute vec3 position;

    uniform float time;
    uniform float scale;
    uniform float opacity;
    uniform float camFadeDist;
    uniform vec3 color;

    // Nuestro atributo extra para pm_ra, pm_dec (aquí lo dejamos por si quieres usarlo)
    attribute vec2 attributes;

    varying vec4 vColor;

    void main() {
      // Posición en la esfera celeste
      vec3 pos = position * scale;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

      // Distancia de la cámara al origen
      float camdist = length(cameraPosition);
      float alpha = 1.0 - smoothstep(0.0, camFadeDist, camdist);

      // Pequeño parpadeo suave
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
    depthTest: false, // que no las tape la esfera de fondo
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

import * as THREE from "three";

export function createOrbitalsMaterial(params = {}) {
  const uniforms = {
    // posición de la "cabeza" de la traza en [0,1]
    u_head: { value: 0.0 },

    // opacidad global
    lucency: { value: params.lucency !== undefined ? params.lucency : 0.8 },

    // color de la órbita
    u_color: {
      value: new THREE.Color(
        params.color !== undefined ? params.color : 0xffffff
      ),
    },
  };

  const vertexShader = `
    precision mediump float;

    // parámetro de la órbita [0,1] para cada vértice
    attribute float aOrbitalPos;
    varying float vOrbitalPos;

    void main() {
      vOrbitalPos = aOrbitalPos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision mediump float;

    uniform float u_head;
    uniform float lucency;
    uniform vec3 u_color;

    varying float vOrbitalPos;

    void main() {
      // distancia (en el círculo) entre este punto y la cabeza
      float d = abs(vOrbitalPos - u_head);
      d = min(d, 1.0 - d); // wrap-around

      // cuanto más cerca de la cabeza, más brillo
      float alpha = exp(-d * 40.0) * lucency;

      if (alpha < 0.02) discard;

      gl_FragColor = vec4(u_color, alpha);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

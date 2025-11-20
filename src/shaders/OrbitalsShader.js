import * as THREE from "three";

export function createOrbitalsMaterial(params = {}) {
  const uniforms = {
  
    u_head: { value: 0.0 },

    lucency: { value: params.lucency !== undefined ? params.lucency : 0.8 },

    u_color: {
      value: new THREE.Color(
        params.color !== undefined ? params.color : 0xffffff
      ),
    },
  };

  const vertexShader = `
    precision mediump float;

    
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

      float d = abs(vOrbitalPos - u_head);
      d = min(d, 1.0 - d); 


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


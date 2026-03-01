import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    
    // Get fragment's exact screen-space position (0 to 1) 
    vec2 screenUv = gl_FragCoord.xy / uResolution.xy;
    
    // Aspect ratio correction for distance
    vec2 aspectVec = vec2(uResolution.x / uResolution.y, 1.0);
    float dist = distance(screenUv * aspectVec, uMouse * aspectVec);
    
    // Ripple effect localized perfectly on the cursor
    float ripple = sin(dist * 40.0 - uTime * 6.0) * 0.015 * exp(-dist * 8.0);
    
    // Subtle overall wave based on time for an "alive" feel
    float waveX = sin(uv.y * 5.0 + uTime * 0.5) * 0.005;
    float waveY = cos(uv.x * 5.0 + uTime * 0.5) * 0.005;
    
    vec2 distortedUv = uv + vec2(ripple + waveX, ripple + waveY);
    
    vec4 color = texture2D(uTexture, distortedUv);
    
    // Dreamy glow where cursor moves
    float glow = exp(-dist * 12.0) * 0.4;
    vec3 finalColor = color.rgb + vec3( glow * 0.9, glow * 0.6, glow * 1.0 ); 
    
    gl_FragColor = vec4(finalColor, color.a);
}
`;

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;
    
    float breath = sin(uTime * 1.5) * 0.01;
    pos.z += breath;
    
    vec2 centralizedMouse = uMouse - vec2(0.5);
    pos.x += centralizedMouse.x * 2.0;
    pos.y += centralizedMouse.y * 2.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export default function BackgroundScene() {
    const texture = useTexture('./Background.png');
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { viewport, gl } = useThree();

    const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
    const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));

    // Fix: Bulletproof global window pointer tracking
    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            targetMouse.current.set(
                e.clientX / window.innerWidth,
                1.0 - (e.clientY / window.innerHeight)
            );
        };
        // Also track on touch
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                targetMouse.current.set(
                    e.touches[0].clientX / window.innerWidth,
                    1.0 - (e.touches[0].clientY / window.innerHeight)
                );
            }
        };
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('touchmove', handleTouchMove);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('touchmove', handleTouchMove);
        }
    }, []);

    const texImage = texture.image as any;
    const texWidth = texImage ? texImage.width : 1920;
    const texHeight = texImage ? texImage.height : 1080;
    const textureAspect = texWidth / texHeight;
    const viewportAspect = viewport.width / viewport.height;

    let scaleX = viewport.width;
    let scaleY = viewport.height;

    if (viewportAspect > textureAspect) {
        scaleY = viewport.width / textureAspect;
    } else {
        scaleX = viewport.height * textureAspect;
    }

    scaleX *= 2.5;
    scaleY *= 2.5;

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(gl.domElement.width, gl.domElement.height) }
    }), [texture, gl]);

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

            // Constantly update physical max-resolution to guarantee screen tracking accuracy
            materialRef.current.uniforms.uResolution.value.set(
                gl.domElement.width,
                gl.domElement.height
            );

            // Apply smooth, fast interpolation towards current window pixel coords
            currentMouse.current.lerp(targetMouse.current, delta * 10.0); // Make it snappier and incredibly smooth
            materialRef.current.uniforms.uMouse.value.x = currentMouse.current.x;
            materialRef.current.uniforms.uMouse.value.y = currentMouse.current.y;
        }
    });

    return (
        <mesh position={[0, 0, -5]}>
            <planeGeometry args={[scaleX, scaleY, 128, 128]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    );
}

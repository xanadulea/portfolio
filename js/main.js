import * as THREE from 'three';

// ===== THREE.JS SETUP =====
const canvas = document.getElementById('canvas3d');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// ===== CREATE PARTICLES =====
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
const colorArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i += 3) {
    // Position in a sphere
    const radius = 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    
    posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i+1] = radius * Math.sin(phi) * Math.sin(theta);
    posArray[i+2] = radius * Math.cos(phi);
    
    // Initial colors
    colorArray[i] = 1;
    colorArray[i+1] = 1;
    colorArray[i+2] = 1;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// ===== CREATE ELEGANT LINES =====
const lineGeometry = new THREE.BufferGeometry();
const linePositions = [];

for(let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 2;
    const radius = 4;
    linePositions.push(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, 0);
}

lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true });
const line = new THREE.LineLoop(lineGeometry, lineMaterial);
line.rotation.x = 0.5;
line.rotation.z = 0.3;
scene.add(line);

// ===== MOUSE INTERACTION =====
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// ===== ANIMATION LOOP =====
function animate() {
    requestAnimationFrame(animate);
    
    // Subtle rotation
    particlesMesh.rotation.y += 0.0001;
    particlesMesh.rotation.x += 0.00005;
    
    // Gentle mouse parallax
    particlesMesh.rotation.y += mouseX * 0.0005;
    particlesMesh.rotation.x += mouseY * 0.0003;
    
    line.rotation.y += 0.001;
    line.rotation.x += 0.0005;
    
    renderer.render(scene, camera);
}

animate();

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== UI INTERACTIONS =====
// Hide loader
setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
}, 2000);

// DOM Elements
const projects = document.querySelectorAll('.project-item');
const phoneScreen = document.getElementById('phoneScreen');
const screenEmoji = document.getElementById('screenEmoji');
const phoneMockup = document.getElementById('phoneMockup');
const projectCounter = document.getElementById('project-counter');
const body = document.body;
const themeDots = document.querySelectorAll('.theme-dot');

// Project data
const projectData = [
    { emoji: '🌌', name: 'NEBULA' },
    { emoji: '🌊', name: 'ECHO' },
    { emoji: '✨', name: 'AURA' },
    { emoji: '☀️', name: 'SOLARIS' },
    { emoji: '💫', name: 'LUMINA' }
];

// Theme colors for particles
const themeColors = {
    cosmic: { r: 0.6, g: 0.7, b: 1.0 },
    desert: { r: 1.0, g: 0.7, b: 0.5 },
    emerald: { r: 0.4, g: 1.0, b: 0.6 },
    royal: { r: 0.7, g: 0.5, b: 1.0 },
    golden: { r: 1.0, g: 0.8, b: 0.4 }
};

// ===== THEME SWITCHING =====
function setTheme(theme) {
    // Remove all theme classes
    body.classList.remove('theme-cosmic', 'theme-desert', 'theme-emerald', 'theme-royal', 'theme-golden');
    // Add new theme class
    body.classList.add(`theme-${theme}`);
    
    // Update active dot
    themeDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.theme === theme) {
            dot.classList.add('active');
        }
    });
    
    // Update particle colors
    const color = themeColors[theme];
    const colors = particlesGeometry.attributes.color.array;
    for (let i = 0; i < colors.length; i += 3) {
        colors[i] = color.r + (Math.random() * 0.2 - 0.1);
        colors[i+1] = color.g + (Math.random() * 0.2 - 0.1);
        colors[i+2] = color.b + (Math.random() * 0.2 - 0.1);
    }
    particlesGeometry.attributes.color.needsUpdate = true;
    
    // Update line color
    line.material.color.setHSL(
        theme === 'cosmic' ? 0.6 :
        theme === 'desert' ? 0.07 :
        theme === 'emerald' ? 0.4 :
        theme === 'royal' ? 0.75 : 0.12, 
        0.8, 0.7
    );
}

// Add click handlers to theme dots
themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const theme = dot.dataset.theme;
        setTheme(theme);
        
        // Add animation to phone
        phoneMockup.style.transform = 'rotateY(-25deg) rotateX(10deg) translateY(-30px) scale(1.02)';
        setTimeout(() => {
            phoneMockup.style.transform = 'rotateY(-15deg) rotateX(5deg) translateY(-20px)';
        }, 300);
    });
});

// ===== PROJECT INTERACTIONS =====
projects.forEach((project, index) => {
    project.addEventListener('click', () => {
        // Update active state
        projects.forEach(p => p.classList.remove('active'));
        project.classList.add('active');
        
        // Update counter
        projectCounter.textContent = `0${index + 1}`;
        
        // Update phone screen
        phoneMockup.style.transform = 'rotateY(-25deg) rotateX(10deg) translateY(-30px)';
        setTimeout(() => {
            screenEmoji.textContent = projectData[index].emoji;
            screenEmoji.style.fontSize = '80px';
            phoneMockup.style.transform = 'rotateY(-15deg) rotateX(5deg) translateY(-20px)';
        }, 300);
        
        // Update hero text
        document.querySelector('.hero-title span').textContent = projectData[index].name;
    });
});

// Initial animation
setTimeout(() => {
    phoneMockup.style.transform = 'rotateY(-15deg) rotateX(5deg) translateY(-20px)';
}, 500);

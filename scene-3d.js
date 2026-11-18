import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.min.js';

const host = document.querySelector('[data-hero-webgl]');
const hero = document.querySelector('.hero-visual');

if (host && hero && typeof WebGLRenderingContext !== 'undefined') {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(0, 0, 9.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);

  const world = new THREE.Group();
  world.rotation.x = -.06;
  scene.add(world);

  const ambient = new THREE.HemisphereLight(0xffeee5, 0x2a1715, 1.55);
  scene.add(ambient);
  const keyLight = new THREE.SpotLight(0xffd8c6, 34, 22, Math.PI * .24, .48, 1.2);
  keyLight.position.set(4.5, 5.5, 7);
  keyLight.castShadow = true;
  scene.add(keyLight);
  scene.add(keyLight.target);
  const rimLight = new THREE.PointLight(0xd77968, 24, 18, 1.4);
  rimLight.position.set(-4.5, .2, 4.5);
  scene.add(rimLight);

  const roundedRectangle = (width, height, radius) => {
    const x = -width / 2;
    const y = -height / 2;
    const shape = new THREE.Shape();
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
  };

  const portrait = new THREE.Group();
  portrait.position.y = .05;
  world.add(portrait);

  const frameGeometry = new THREE.ExtrudeGeometry(roundedRectangle(3.45, 4.25, .34), {
    depth: .34,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 1,
    bevelSize: .1,
    bevelThickness: .1,
    curveSegments: 12
  });
  frameGeometry.translate(0, 0, -.17);
  const frame = new THREE.Mesh(frameGeometry, new THREE.MeshPhysicalMaterial({
    color: 0x7d3f35,
    metalness: .18,
    roughness: .28,
    clearcoat: .95,
    clearcoatRoughness: .2
  }));
  frame.castShadow = true;
  frame.receiveShadow = true;
  portrait.add(frame);

  const innerPlate = new THREE.Mesh(
    new THREE.PlaneGeometry(3.12, 3.92, 24, 24),
    new THREE.MeshPhysicalMaterial({ color: 0xb97865, roughness: .38, metalness: .04 })
  );
  innerPlate.position.z = .285;
  portrait.add(innerPlate);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(3.22, 4.02),
    new THREE.MeshPhysicalMaterial({
      color: 0xffeee8,
      transparent: true,
      opacity: .13,
      roughness: .08,
      metalness: .04,
      transmission: .18,
      clearcoat: 1
    })
  );
  glass.position.z = .37;
  glass.material.depthWrite = false;
  glass.renderOrder = 6;
  portrait.add(glass);

  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(2.72, .025, 12, 180),
    new THREE.MeshStandardMaterial({ color: 0xffd8c8, emissive: 0xa94f42, emissiveIntensity: 1.1, metalness: .6, roughness: .2 })
  );
  aura.position.z = -.38;
  aura.rotation.x = .12;
  world.add(aura);
  const auraSecond = aura.clone();
  auraSecond.scale.set(.78, .78, .78);
  auraSecond.rotation.set(.5, .35, -.3);
  auraSecond.material = aura.material.clone();
  auraSecond.material.opacity = .62;
  auraSecond.material.transparent = true;
  world.add(auraSecond);

  const particleCount = 110;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.5 + Math.random() * 3.2;
    const angle = Math.random() * Math.PI * 2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = (Math.random() - .5) * 6.6;
    particlePositions[index * 3 + 2] = (Math.random() - .5) * 3.8 - .7;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xffe1d4, size: .035, transparent: true, opacity: .72 }));
  world.add(particles);

  const createLabelTexture = label => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 210;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(35,24,22,.94)';
    context.beginPath();
    context.roundRect(8, 8, 624, 194, 52);
    context.fill();
    context.strokeStyle = 'rgba(255,235,225,.5)';
    context.lineWidth = 4;
    context.stroke();
    context.fillStyle = '#fff7f2';
    context.font = '700 50px DM Sans, Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`${label}  ↗`, 320, 106);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  };

  const portals = [];
  const clickableMeshes = [];
  const portalData = [
    { label: 'VÍDEOS', target: '#video', position: [-1.95, .92, .45], rotation: -.13 },
    { label: 'SETUP', target: '#setup', position: [1.98, .3, .72], rotation: .1 },
    { label: 'REDES', target: '#redes', position: [-1.82, -1.62, .62], rotation: -.08 }
  ];
  portalData.forEach((data, index) => {
    const portal = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, .5, .16, 3, 2, 2),
      new THREE.MeshPhysicalMaterial({ color: 0x2b1d1b, metalness: .32, roughness: .22, clearcoat: .86 })
    );
    body.castShadow = true;
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, .47),
      new THREE.MeshBasicMaterial({ map: createLabelTexture(data.label), transparent: true, toneMapped: false })
    );
    face.position.z = .086;
    portal.add(body, face);
    portal.position.set(...data.position);
    portal.rotation.z = data.rotation;
    portal.userData = { target: data.target, baseY: data.position[1], phase: index * 1.7 };
    body.userData.portal = portal;
    face.userData.portal = portal;
    clickableMeshes.push(body, face);
    portals.push(portal);
    world.add(portal);
  });

  const loader = new THREE.TextureLoader();
  const portraitUrl = new URL('assets/yuuketts-aussie-hero.png', import.meta.url).href;
  loader.load(portraitUrl, texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const image = new THREE.Mesh(
      new THREE.PlaneGeometry(3.08, 3.84),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .015, toneMapped: false, depthTest: false, depthWrite: false })
    );
    image.position.set(0, -.08, .32);
    image.renderOrder = 5;
    portrait.add(image);
    glass.position.z = .4;
    document.body.classList.add('webgl-ready');
  }, undefined, () => {
    console.warn('A textura do retrato 3D não pôde ser carregada; mantendo o visual alternativo.');
  });

  let pointerX = 0;
  let pointerY = 0;
  let pointerDown = null;
  let scrollProgress = 0;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const updatePointer = event => {
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    pointerX = pointer.x;
    pointerY = pointer.y;
    raycaster.setFromCamera(pointer, camera);
    const hovered = raycaster.intersectObjects(clickableMeshes, false)[0];
    host.style.cursor = hovered ? 'pointer' : (pointerDown ? 'grabbing' : 'grab');
    portals.forEach(portal => {
      const active = hovered?.object?.userData?.portal === portal;
      portal.scale.setScalar(active ? 1.1 : 1);
    });
  };
  host.addEventListener('pointermove', updatePointer, { passive: true });
  host.addEventListener('pointerdown', event => {
    pointerDown = { x: event.clientX, y: event.clientY };
  });
  host.addEventListener('pointerup', event => {
    if (!pointerDown || Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 8) {
      pointerDown = null;
      return;
    }
    updatePointer(event);
    const hit = raycaster.intersectObjects(clickableMeshes, false)[0];
    const portal = hit?.object?.userData?.portal;
    if (portal) {
      portal.scale.setScalar(.92);
      setTimeout(() => portal.scale.setScalar(1), 170);
      window.navigateWithTransition?.(portal.userData.target, event);
    }
    pointerDown = null;
  });
  host.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    pointerDown = null;
    host.style.cursor = 'grab';
    portals.forEach(portal => portal.scale.setScalar(1));
  });

  const resize = () => {
    const bounds = host.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = innerWidth < 720 ? 10 : 9.2;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  const syncScrollLighting = () => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    scrollProgress = scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
  };
  addEventListener('scroll', syncScrollLighting, { passive: true });
  syncScrollLighting();

  let sceneVisible = true;
  new IntersectionObserver(([entry]) => {
    sceneVisible = entry.isIntersecting;
  }, { rootMargin: '180px' }).observe(hero);

  const clock = new THREE.Clock();
  const render = () => {
    if (!sceneVisible || document.hidden) {
      requestAnimationFrame(render);
      return;
    }
    const elapsed = clock.getElapsedTime();
    const motion = reducedMotion ? 0 : elapsed;
    world.rotation.y += (pointerX * .26 - world.rotation.y) * .055;
    world.rotation.x += (-pointerY * .16 - .055 - world.rotation.x) * .055;
    portrait.position.y = .05 + Math.sin(motion * .82) * .055;
    portrait.rotation.z = Math.sin(motion * .45) * .012;
    aura.rotation.z = motion * .075;
    auraSecond.rotation.z = -.3 - motion * .052;
    particles.rotation.y = motion * .018;
    particles.rotation.z = motion * .009;
    portals.forEach(portal => {
      portal.position.y = portal.userData.baseY + Math.sin(motion * .92 + portal.userData.phase) * .07;
      portal.rotation.y += ((pointerX * .08) - portal.rotation.y) * .035;
    });
    keyLight.position.x += ((3.8 + pointerX * 2.8) - keyLight.position.x) * .045;
    keyLight.position.y += ((4.7 + pointerY * 1.7) - keyLight.position.y) * .045;
    keyLight.intensity = 26 + scrollProgress * 17;
    rimLight.intensity = 18 + scrollProgress * 13;
    renderer.toneMappingExposure = 1 + scrollProgress * .2;
    camera.position.y += ((scrollProgress * .18) - camera.position.y) * .025;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
}

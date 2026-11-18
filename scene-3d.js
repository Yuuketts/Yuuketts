import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.min.js';

const host = document.querySelector('[data-hero-webgl]');
const hero = document.querySelector('.hero-visual');

if (host && hero && typeof WebGLRenderingContext !== 'undefined') {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(0, 0, 8.7);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  host.append(renderer.domElement);

  const world = new THREE.Group();
  world.position.y = -.03;
  scene.add(world);
  scene.add(new THREE.HemisphereLight(0xffe9df, 0x342522, 1.45));

  const coralLight = new THREE.PointLight(0xff9d91, 20, 16, 1.5);
  coralLight.position.set(3.4, 3.5, 5);
  scene.add(coralLight);
  const mintLight = new THREE.PointLight(0x83c8b9, 12, 14, 1.5);
  mintLight.position.set(-3.8, -.5, 4);
  scene.add(mintLight);

  const createGlowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(256, 246, 18, 256, 256, 244);
    gradient.addColorStop(0, 'rgba(255,238,229,.58)');
    gradient.addColorStop(.46, 'rgba(242,151,137,.18)');
    gradient.addColorStop(.72, 'rgba(128,196,181,.08)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(5.7, 5.7),
    new THREE.MeshBasicMaterial({ map: createGlowTexture(), transparent: true, depthWrite: false, toneMapped: false })
  );
  glow.position.z = -.55;
  world.add(glow);

  const coralRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.36, .018, 10, 180),
    new THREE.MeshBasicMaterial({ color: 0xffb1a6, transparent: true, opacity: .72, depthWrite: false })
  );
  coralRing.position.z = -.32;
  coralRing.rotation.set(.12, -.1, .12);
  world.add(coralRing);

  const mintRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.02, .012, 10, 180),
    new THREE.MeshBasicMaterial({ color: 0x8ecabc, transparent: true, opacity: .35, depthWrite: false })
  );
  mintRing.position.z = -.38;
  mintRing.rotation.set(-.28, .28, -.35);
  world.add(mintRing);

  const character = new THREE.Group();
  character.position.set(.08, -.06, .12);
  world.add(character);

  const particleCount = 64;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.25 + Math.random() * 1.25;
    const angle = Math.random() * Math.PI * 2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = Math.sin(angle) * radius * .88;
    particlePositions[index * 3 + 2] = -.2 + Math.random() * .8;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xffe5dc, size: .026, transparent: true, opacity: .58, depthWrite: false })
  );
  world.add(particles);

  const createIconTexture = type => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const context = canvas.getContext('2d');
    context.strokeStyle = '#3b2927';
    context.fillStyle = '#3b2927';
    context.lineWidth = 16;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    if (type === 'play') {
      context.beginPath();
      context.moveTo(103, 76);
      context.lineTo(178, 128);
      context.lineTo(103, 180);
      context.closePath();
      context.fill();
    } else if (type === 'setup') {
      context.strokeRect(69, 71, 118, 82);
      context.beginPath();
      context.moveTo(102, 184);
      context.lineTo(154, 184);
      context.moveTo(128, 153);
      context.lineTo(128, 184);
      context.stroke();
    } else {
      [[87, 92], [169, 92], [128, 170]].forEach(([x, y]) => {
        context.beginPath();
        context.arc(x, y, 20, 0, Math.PI * 2);
        context.fill();
      });
      context.beginPath();
      context.moveTo(103, 105);
      context.lineTo(118, 151);
      context.moveTo(153, 105);
      context.lineTo(138, 151);
      context.moveTo(108, 92);
      context.lineTo(148, 92);
      context.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const portalData = [
    { label: 'Vídeos', type: 'play', target: '#video', color: 0xf4a297, position: [-1.72, 1.05, .72] },
    { label: 'Setup', type: 'setup', target: '#setup', color: 0xf7dfd5, position: [1.78, .15, .78] },
    { label: 'Redes', type: 'social', target: '#redes', color: 0x86c5b7, position: [-1.45, -1.48, .68] }
  ];
  const portals = [];
  const clickableMeshes = [];
  portalData.forEach((data, index) => {
    const portal = new THREE.Group();
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(.25, 32, 24),
      new THREE.MeshPhysicalMaterial({ color: data.color, roughness: .24, metalness: .04, clearcoat: 1, clearcoatRoughness: .16 })
    );
    const icon = new THREE.Mesh(
      new THREE.PlaneGeometry(.28, .28),
      new THREE.MeshBasicMaterial({ map: createIconTexture(data.type), transparent: true, depthWrite: false, toneMapped: false })
    );
    icon.position.z = .245;
    portal.add(orb, icon);
    portal.position.set(...data.position);
    portal.userData = { ...data, baseY: data.position[1], phase: index * 1.9 };
    orb.userData.portal = portal;
    icon.userData.portal = portal;
    clickableMeshes.push(orb, icon);
    portals.push(portal);
    world.add(portal);
  });

  const tooltip = document.createElement('div');
  tooltip.className = 'scene-tooltip';
  hero.append(tooltip);

  const loader = new THREE.TextureLoader();
  const portraitUrl = new URL('assets/yuuketts-aussie-hero.png', import.meta.url).href;
  loader.load(portraitUrl, texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    for (let layerIndex = 3; layerIndex >= 1; layerIndex -= 1) {
      const depthLayer = new THREE.Mesh(
        new THREE.PlaneGeometry(3.48, 4.35),
        new THREE.MeshBasicMaterial({
          map: texture,
          color: 0x65443d,
          transparent: true,
          opacity: .035,
          alphaTest: .02,
          depthTest: false,
          depthWrite: false,
          toneMapped: false
        })
      );
      depthLayer.position.set(0, 0, -layerIndex * .018);
      depthLayer.renderOrder = 10 - layerIndex;
      character.add(depthLayer);
    }
    const image = new THREE.Mesh(
      new THREE.PlaneGeometry(3.48, 4.35),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .02, depthTest: false, depthWrite: false, toneMapped: false })
    );
    image.position.z = .035;
    image.renderOrder = 20;
    character.add(image);
    document.body.classList.add('webgl-ready');
  }, undefined, () => {
    console.warn('A textura do Chokki não pôde ser carregada; mantendo o visual alternativo.');
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
    const hoveredPortal = raycaster.intersectObjects(clickableMeshes, false)[0]?.object?.userData?.portal;
    host.style.cursor = hoveredPortal ? 'pointer' : (pointerDown ? 'grabbing' : 'grab');
    portals.forEach(portal => { portal.userData.hovered = portal === hoveredPortal; });
    const heroBounds = hero.getBoundingClientRect();
    tooltip.style.left = `${event.clientX - heroBounds.left}px`;
    tooltip.style.top = `${event.clientY - heroBounds.top}px`;
    tooltip.textContent = hoveredPortal?.userData?.label || '';
    tooltip.classList.toggle('is-visible', Boolean(hoveredPortal));
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
    const portal = raycaster.intersectObjects(clickableMeshes, false)[0]?.object?.userData?.portal;
    if (portal) window.navigateWithTransition?.(portal.userData.target, event);
    pointerDown = null;
  });
  host.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    pointerDown = null;
    host.style.cursor = 'grab';
    tooltip.classList.remove('is-visible');
    portals.forEach(portal => { portal.userData.hovered = false; });
  });

  const resize = () => {
    const bounds = host.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = innerWidth < 720 ? 9.5 : 8.7;
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
  new IntersectionObserver(([entry]) => { sceneVisible = entry.isIntersecting; }, { rootMargin: '180px' }).observe(hero);

  const clock = new THREE.Clock();
  const render = () => {
    requestAnimationFrame(render);
    if (!sceneVisible || document.hidden) return;
    const elapsed = clock.getElapsedTime();
    const motion = reducedMotion ? 0 : elapsed;
    world.rotation.y += (pointerX * .16 - world.rotation.y) * .055;
    world.rotation.x += (-pointerY * .105 - .025 - world.rotation.x) * .055;
    character.position.y = -.06 + Math.sin(motion * .82) * .045;
    character.rotation.z = Math.sin(motion * .42) * .009;
    coralRing.rotation.z = .12 + motion * .055;
    mintRing.rotation.z = -.35 - motion * .038;
    particles.rotation.z = motion * .011;
    portals.forEach(portal => {
      portal.position.y = portal.userData.baseY + Math.sin(motion * .88 + portal.userData.phase) * .055;
      const targetScale = portal.userData.hovered ? 1.2 : 1;
      portal.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), .13);
      portal.rotation.y = -world.rotation.y * .55;
    });
    coralLight.position.x += ((3.2 + pointerX * 1.8) - coralLight.position.x) * .045;
    mintLight.position.y += ((-.6 + pointerY * 1.2) - mintLight.position.y) * .045;
    coralLight.intensity = 18 + scrollProgress * 8;
    mintLight.intensity = 10 + scrollProgress * 7;
    renderer.toneMappingExposure = 1.02 + scrollProgress * .12;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  render();
}

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.min.js';

const host = document.querySelector('[data-hero-webgl]');
const hero = document.querySelector('.hero-visual');

if (host && hero && typeof WebGLRenderingContext !== 'undefined') {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(29, 1, .1, 100);
  camera.position.z = 11.2;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  host.append(renderer.domElement);

  const world = new THREE.Group();
  world.position.set(.05, 0, 0);
  scene.add(world);

  const makeGlowTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(256, 248, 18, 256, 256, 250);
    gradient.addColorStop(0, 'rgba(255,245,235,.72)');
    gradient.addColorStop(.42, 'rgba(238,167,148,.2)');
    gradient.addColorStop(.7, 'rgba(139,201,187,.13)');
    gradient.addColorStop(1, 'rgba(38,20,17,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(6.2, 6.2),
    new THREE.MeshBasicMaterial({ map: makeGlowTexture(), transparent: true, depthWrite: false, toneMapped: false })
  );
  glow.position.set(.15, 0, -.45);
  world.add(glow);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.38, 96),
    new THREE.MeshBasicMaterial({ color: 0x5f3a32, transparent: true, opacity: .13, depthWrite: false })
  );
  shadow.scale.set(1.35, .16, 1);
  shadow.position.set(.12, -2.58, -.28);
  world.add(shadow);

  const character = new THREE.Group();
  character.position.set(.08, -.02, .12);
  world.add(character);

  const textureUrl = new URL('assets/chokki-fullbody-v2.png', import.meta.url).href;
  new THREE.TextureLoader().load(textureUrl, texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const softDepth = new THREE.Mesh(
      new THREE.PlaneGeometry(2.58, 5.64),
      new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x3a211c,
        transparent: true,
        opacity: .12,
        alphaTest: .02,
        depthWrite: false,
        toneMapped: false
      })
    );
    softDepth.position.set(.035, -.025, -.07);
    character.add(softDepth);

    const artwork = new THREE.Mesh(
      new THREE.PlaneGeometry(2.58, 5.64),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: .02,
        depthWrite: false,
        toneMapped: false
      })
    );
    artwork.position.z = .04;
    artwork.renderOrder = 2;
    character.add(artwork);

    document.body.classList.add('webgl-ready');
  }, undefined, () => {
    console.warn('A arte do Chokki não pôde ser carregada no WebGL; usando a imagem estática.');
  });

  let pointerX = 0;
  let pointerY = 0;
  let sceneVisible = true;
  let scrollProgress = 0;

  host.addEventListener('pointermove', event => {
    const bounds = host.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  }, { passive: true });

  host.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
  });

  const resize = () => {
    const bounds = host.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = innerWidth < 720 ? 12 : 11.2;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  const syncScroll = () => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    scrollProgress = scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
  };
  addEventListener('scroll', syncScroll, { passive: true });
  syncScroll();

  new IntersectionObserver(([entry]) => {
    sceneVisible = entry.isIntersecting;
  }, { rootMargin: '180px' }).observe(hero);

  const clock = new THREE.Clock();
  const render = () => {
    requestAnimationFrame(render);
    if (!sceneVisible || document.hidden) return;

    const elapsed = reducedMotion ? 0 : clock.getElapsedTime();
    world.rotation.y += (pointerX * .11 - world.rotation.y) * .055;
    world.rotation.x += (pointerY * .055 - world.rotation.x) * .055;
    character.position.y = -.02 + Math.sin(elapsed * .72) * .035;
    character.rotation.z = Math.sin(elapsed * .38) * .006;
    shadow.scale.x = 1.35 + Math.sin(elapsed * .72) * .028;
    shadow.material.opacity = .12 + Math.sin(elapsed * .72) * .01;
    glow.material.opacity = .88 + scrollProgress * .12;
    renderer.toneMappingExposure = 1.01 + scrollProgress * .08;

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  render();
}

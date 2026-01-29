import * as THREE from 'three';

class MinecraftSkinPainter {
  container: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  baseTexture: THREE.CanvasTexture;
  overlayTexture: THREE.CanvasTexture;
  baseMaterial: THREE.MeshBasicMaterial;
  overlayMaterial: THREE.MeshBasicMaterial;
  currentColor: string = '#ff0000';
  ispainting = false;

  constructor(container: HTMLElement) {
    this.container = container;
    // ...existing code...
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Set up base and overlay textures with a 64x64 canvas
    this.baseTexture = new THREE.CanvasTexture(this.createInitialTexture());
    this.overlayTexture = new THREE.CanvasTexture(this.createInitialTexture(true));
    // Disable texture vertical flip for correct UV mapping
    this.baseTexture.flipY = false;
    this.overlayTexture.flipY = false;

    // Create materials for both layers
    this.baseMaterial = new THREE.MeshBasicMaterial({
      map: this.baseTexture,
      transparent: false,
    });
    this.overlayMaterial = new THREE.MeshBasicMaterial({
      map: this.overlayTexture,
      transparent: true,
      opacity: 0.8,
    });

    // Create character parts with updated dimensions:
    // Head: 8x8, Body: 8x12, Arms: 4x12, Legs: 4x12
    this.createCharacterParts();

    // Adjust camera position for better view
    this.camera.position.z = 50;

    // Initialize raycaster and mouse vector for painting
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Bind mouse events
    this.renderer.domElement.addEventListener(
      'mousedown',
      this.onMouseDown.bind(this)
    );
    this.renderer.domElement.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this)
    );
    this.renderer.domElement.addEventListener(
      'mouseup',
      this.onMouseUp.bind(this)
    );

    // Start render loop
    this.animate();
  }

  createInitialTexture(isOverlay = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    if (!isOverlay) {
      // Fill base layer with default skin color
      ctx.fillStyle = '#C4A484';
      ctx.fillRect(0, 0, 64, 64);
    }
    return canvas;
  }

  createCharacterParts() {
    // Updated geometries according to dimensions in pixels
    const headGeo = new THREE.BoxGeometry(8, 8, 8);
    const bodyGeo = new THREE.BoxGeometry(8, 12, 4);
    const armGeo = new THREE.BoxGeometry(4, 12, 4);
    const legGeo = new THREE.BoxGeometry(4, 12, 4);

    // Position calculations:
    // Head centered at (0, 14, 0)
    this.createBodyPart('head', headGeo, new THREE.Vector3(0, 14, 0));
    // Body centered at (0, 7, 0)
    this.createBodyPart('body', bodyGeo, new THREE.Vector3(0, 7, 0));
    // Arms: left at (-6, 7, 0) and right at (6, 7, 0)
    this.createBodyPart('leftArm', armGeo, new THREE.Vector3(-6, 7, 0));
    this.createBodyPart('rightArm', armGeo, new THREE.Vector3(6, 7, 0));
    // Legs: left at (-2, -5, 0) and right at (2, -5, 0)
    this.createBodyPart('leftLeg', legGeo, new THREE.Vector3(-2, -5, 0));
    this.createBodyPart('rightLeg', legGeo, new THREE.Vector3(2, -5, 0));
  }

  createBodyPart(name: string, geometry: THREE.BoxGeometry, position: THREE.Vector3) {
    // Base mesh for inner layer
    const baseMesh = new THREE.Mesh(geometry, this.baseMaterial);
    baseMesh.position.copy(position);
    baseMesh.name = `${name}_base`;
    baseMesh.renderOrder = 0;
    this.scene.add(baseMesh);

    // Overlay mesh for outer layer
    const overlayMesh = new THREE.Mesh(geometry, this.overlayMaterial);
    overlayMesh.position.copy(position);
    overlayMesh.name = `${name}_overlay`;
    overlayMesh.renderOrder = 1;
    this.scene.add(overlayMesh);
  }

  paint(intersect: THREE.Intersection, color: string, layer: 'base' | 'overlay' = 'base') {
    const uv = intersect.uv;
    if (!uv) return;
    const texture = layer === 'base' ? this.baseTexture : this.overlayTexture;
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Convert UV coordinates (from 0 to 1) to pixel coordinates on 64x64 texture canvas
    const x = Math.floor(uv.x * 64);
    const y = Math.floor(uv.y * 64);
    // Use a 4x4 pixel brush, centered
    ctx.fillStyle = color;
    ctx.fillRect(x - 2, y - 2, 4, 4);
    texture.needsUpdate = true;
  }

  onMouseDown(event: MouseEvent) {
    this.ispainting = true;
    // ...existing code...
  }

  onMouseMove(event: MouseEvent) {
    if (!this.ispainting) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      const currentLayer = intersects[0].object.name.includes('overlay') ? 'overlay' : 'base';
      this.paint(intersects[0], this.currentColor, currentLayer);
    }
  }

  onMouseUp() {
    this.ispainting = false;
  }

  setColor(color: string) {
    this.currentColor = color;
  }

  exportSkin() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    // Draw base layer then overlay layer to merge them together
    ctx.drawImage(this.baseTexture.image, 0, 0);
    ctx.drawImage(this.overlayTexture.image, 0, 0);
    return canvas.toDataURL('image/png');
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // ...existing code...
    this.renderer.render(this.scene, this.camera);
  }
}

export default MinecraftSkinPainter;

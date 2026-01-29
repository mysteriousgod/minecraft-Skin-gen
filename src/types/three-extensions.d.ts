declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import * as THREE from 'three';

  export class GLTFLoader extends THREE.Loader {
    constructor(manager?: THREE.LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }

  export interface GLTF {
    scene: THREE.Scene;
    scenes: THREE.Scene[];
    animations: THREE.AnimationClip[];
    cameras: THREE.Camera[];
    asset: any;
  }
}

declare module "*.glb" {
  const url: string;
  export default url;
}

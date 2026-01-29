//  bugs are on the baas of calling use efect which is call before initScene do not use time out to fix
//  all functionality is working fine
//  this is main componont 
//  there is lot of math in this just need to adjust correctly as requirwd 
//  ui can be adjust with library 
//  drawGrid is for grid grid and initScene for canves and there is updateTextureAndModel which are main function for texture and model
//  all the function are working fine just need to adjust the math and ui 
import * as THREE from "three";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useEditorStore } from "../store/editorStore";
import { setPaintedData } from "../store/editorReducer";
import steveTextureImg from "../models/steve.png";
import alexTextureImg from "../models/alex.png";
import alexModelUrl from "../models/alex.glb";
import steveModelUrl from "../models/steve.glb";
import type { RootState } from "../store";
interface Point {
  x: number;
  y: number;
}
const hexToRgba = (hex: string, alpha: number): string => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const ModelViewer: React.FC = () => {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const modelRef = useRef<THREE.Group>();
  const textureRef = useRef<THREE.CanvasTexture>();
  const initialTextureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPaintingRef = useRef(false);
  const mouseRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  const lastPointRef = useRef<Point | null>(null);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const {
    model,
    backgroundColor,
    zoom,
    color,
    tool,
    reset,
    alpha,
    customTexture,
    showGrid,
    toggleGrid,
    addHistory,
    undo,
    redo,
    history,
    historyIndex,
    clearHistory,
    selectedOptionId,
  } = useEditorStore();
  // const [showGrid, setShowGrid] = useState(showGrid);
  const [bodyPartVisibility, setBodyPartVisibility] = useState({
    head: { inner: true, outer: true },
    body: { inner: true, outer: true },
    leftArm: { inner: true, outer: true },
    rightArm: { inner: true, outer: true },
    leftLeg: { inner: true, outer: true },
    rightLeg: { inner: true, outer: true },
  });
  const isOuterLayer = (name: string): boolean => {
    const lowerName = name.toLowerCase();
    return lowerName.includes("_layer") ||
      lowerName.includes("hat") ||
      lowerName.includes("outer");
  };
  const saveCanvasState = useCallback(() => {
    if (!textureRef.current) return;

    const canvas = textureRef.current.image as HTMLCanvasElement;
    const dataUrl = canvas.toDataURL();

    dispatch(setPaintedData({ optionId: selectedOptionId, paintedData: dataUrl }));
    // Add to history immediately after any change
    addHistory(selectedOptionId, dataUrl);
  }, [dispatch, selectedOptionId, addHistory]);

  const restoreCanvasState = useCallback((dataUrl: string) => {
    if (!textureRef.current) return;

    const canvas = textureRef.current.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      textureRef.current!.needsUpdate = true;

      // Ensure the model's materials are updated
      modelRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
      });
    };

    img.src = dataUrl;
  }, []);
  const handleUndo = useCallback(() => {
    const currentHistory = history[selectedOptionId] || [];
    const currentIdx = historyIndex[selectedOptionId] ?? currentHistory.length - 1;

    if (currentHistory.length === 0 || currentIdx <= 0) return;

    undo(); // Update the history index first

    // Get the previous state using the new index
    const previousState = currentHistory[currentIdx - 1];
    if (previousState) {
      restoreCanvasState(previousState);
    }
  }, [history, historyIndex, selectedOptionId, undo, restoreCanvasState]);

  const handleRedo = useCallback(() => {
    const currentHistory = history[selectedOptionId] || [];
    const currentIdx = historyIndex[selectedOptionId] ?? -1;
    if (currentHistory.length === 0 || currentIdx >= currentHistory.length - 1) return;
    redo();
    const nextState = currentHistory[currentIdx + 1];
    if (nextState) {
      restoreCanvasState(nextState);
    }
  }, [history, historyIndex, selectedOptionId, redo, restoreCanvasState]);


  const handleReset = useCallback(async () => {
    if (textureRef.current) {
      const canvas = textureRef.current.image as HTMLCanvasElement;
      const currentState = canvas.toDataURL();
      clearHistory(selectedOptionId);
      addHistory(selectedOptionId, currentState);
    }
    const textureUrl = customTexture
      ? customTexture
      : model === "alex"
        ? alexTextureImg
        : steveTextureImg;
    const newTexture = await createCanvasTexture(textureUrl);
    textureRef.current = newTexture;
    modelRef.current?.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshStandardMaterial).map = newTexture;
        (child.material as THREE.MeshStandardMaterial).needsUpdate = true;
      }
    });
  }, [model, customTexture, clearHistory, addHistory, selectedOptionId]);
  const handleFill = useCallback(() => {
    if (!textureRef.current) return;
    const canvas = textureRef.current.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = tool === "eraser" ? "#ffffff" : hexToRgba(color, alpha);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    textureRef.current.needsUpdate = true;
    saveCanvasState();
  }, [color, alpha, tool, saveCanvasState]);
  useEffect(() => {
    (window as any).undoTexture = handleUndo;
    (window as any).redoTexture = handleRedo;
    (window as any).resetTexture = handleReset;
    (window as any).fillTexture = handleFill;
  }, [handleUndo, handleRedo, handleReset, handleFill]);
  const recordInitialState = useCallback(() => {
    if (
      textureRef.current &&
      textureRef.current.image instanceof HTMLCanvasElement
    ) {
      const canvas = textureRef.current.image as HTMLCanvasElement;
      const currentState = canvas.toDataURL();
      addHistory(selectedOptionId, currentState);
    }
  }, [addHistory, selectedOptionId]);
  const createCanvasTexture = async (
    url?: string
  ): Promise<THREE.CanvasTexture> => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    if (url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const texture = new THREE.CanvasTexture(canvas);
          texture.flipY = false;
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          resolve(texture);
        };
        img.src = url;
      });
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  };
  const paintedDataRedux = useSelector(
    (state: RootState) => state.editor.paintedData
  );
  const getTextureUrl = useCallback((): string => {
    if (paintedDataRedux[selectedOptionId]) {
      return paintedDataRedux[selectedOptionId] as string;
    }
    if (customTexture) return customTexture;
    return model === "alex" ? alexTextureImg : steveTextureImg;
  }, [selectedOptionId, paintedDataRedux, customTexture, model]);
  const loadTexture = async (url: string): Promise<THREE.CanvasTexture> => {
    return await createCanvasTexture(url);
  };
  const drawOnTexture = useCallback(
    (x: number, y: number, meshLayerType: "inner" | "outer") => {
      if (!textureRef.current) return;
      const canvas = textureRef.current.image as HTMLCanvasElement;
      const ctx = canvas.getContext("2d")!;
      if (tool === "eraser") {
        if (meshLayerType === "inner" && initialTextureCanvasRef.current) {
          const initCtx = initialTextureCanvasRef.current.getContext("2d");
          const imageData = initCtx?.getImageData(x, y, 1, 1);
          let defaultColor = "#ffffff";
          if (imageData && imageData.data) {
            const [r, g, b, a] = imageData.data;
            defaultColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
          }
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = defaultColor;
        } else if (meshLayerType === "outer") {
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = "rgba(0,0,0,1)";
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = hexToRgba(color, alpha);
        }
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = hexToRgba(color, alpha);
      }
      ctx.fillRect(x, y, 1, 1);
      ctx.globalCompositeOperation = "source-over";
      textureRef.current.needsUpdate = true;
    },
    [color, alpha, tool]
  );
  const floodFillOnTexture = useCallback(
    (x: number, y: number, meshLayerType: "inner" | "outer") => {
      if (tool === "eraser") {
        drawOnTexture(x, y, meshLayerType);
        return;
      }
      if (!textureRef.current) return;
      const canvas = textureRef.current.image as HTMLCanvasElement;
      let fillColor = parseRgba(hexToRgba(color, alpha));
      floodFill(canvas, x, y, fillColor);
      textureRef.current.needsUpdate = true;
      saveCanvasState();
    },
    [tool, color, alpha, saveCanvasState, drawOnTexture]
  );
  const paintAtMouse = useCallback(() => {
    // Safety checks for required references
    if (!textureRef.current || !cameraRef.current || !modelRef.current || !isPaintMode) {
      return;
    }

    try {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      // Only use visible meshes
      const visibleMeshes: THREE.Object3D[] = [];
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.visible) {
          visibleMeshes.push(child);
        }
      });

      const intersects = raycasterRef.current.intersectObjects(visibleMeshes);

      if (intersects.length === 0) return;

      // Find the closest valid intersection
      const selectedIntersection = intersects.reduce((closest, current) =>
        current.distance < closest.distance ? current : closest
      );

      if (!selectedIntersection.uv) return;

      const mesh = selectedIntersection.object as THREE.Mesh;

      // Get layer type safely, defaulting to "inner" if not set
      const meshLayerType = mesh.userData.layerType as "inner" | "outer" || "inner";

      // Calculate and clamp texture coordinates
      const textureX = Math.floor(selectedIntersection.uv.x * 64);
      const textureY = Math.floor(selectedIntersection.uv.y * 64);
      const clampedX = Math.max(0, Math.min(63, textureX));
      const clampedY = Math.max(0, Math.min(63, textureY));

      // Apply the appropriate painting tool
      if (tool === "fill") {
        floodFillOnTexture(clampedX, clampedY, meshLayerType);
      } else {
        drawOnTexture(clampedX, clampedY, meshLayerType);
      }
    } catch (err) {
      console.error("Error while painting:", err);

      // Reset painting state in case of error
      isPaintingRef.current = false;
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  }, [isPaintMode, tool, drawOnTexture, floodFillOnTexture]);
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isPaintMode || !isPaintingRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = rendererRef.current!.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      paintAtMouse();
    },
    [isPaintMode, paintAtMouse]
  );
  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (!isPaintMode) return;
      if (isPaintingRef.current) {
        event.preventDefault();
        event.stopPropagation();
        isPaintingRef.current = false;
        lastPointRef.current = null;
        if (controlsRef.current) controlsRef.current.enabled = true;
        saveCanvasState();
      }
    },
    [isPaintMode, saveCanvasState]
  );
  const handleMouseLeave = useCallback(
    (event: MouseEvent) => {
      if (!isPaintMode) return;
      if (isPaintingRef.current) {
        event.preventDefault();
        event.stopPropagation();
        isPaintingRef.current = false;
        lastPointRef.current = null;
        if (controlsRef.current) controlsRef.current.enabled = true;
      }
    },
    [isPaintMode]
  );
  const exportTexture = () => {
    if (!textureRef.current) return;
    const canvas = textureRef.current.image as HTMLCanvasElement;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "minecraft-skin.png";
    link.href = dataUrl;
    link.click();
  };
  useEffect(() => {
    (window as any).exportSkinTexture = exportTexture;
  }, [exportTexture]);
  const handleCustomBgUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        sceneRef.current.background = texture;
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, []);
  useEffect(() => {
    (window as any).applyCustomBackground = handleCustomBgUpload;
  }, [handleCustomBgUpload]);
  const configureModelGeometry = useCallback(
    (modelType: "steve" | "alex", meshes: THREE.Object3D[]) => {
      meshes.forEach((obj) => {
        if (obj instanceof THREE.Mesh) {
          const name = obj.name.toLowerCase();
          if (name.includes("arm")) {
            const geometry = obj.geometry as THREE.BufferGeometry;
            const positions = geometry.getAttribute("position").array;
            const scale = modelType === "steve" ? 4 / 16 : 3 / 16; // Steve: 4px, Alex: 3px
            for (let i = 0; i < positions.length; i += 3) {
              if (positions[i] !== 0) {
                // Only scale X axis for width
                positions[i] *= scale;
              }
            }
            geometry.setAttribute(
              "position",
              new THREE.Float32BufferAttribute(positions, 3)
            );
            geometry.computeVertexNormals();
          }
        }
      });
    },
    []
  );

  const matchColor = (data: Uint8ClampedArray, idx: number, target: number[]) =>
    data[idx] === target[0] &&
    data[idx + 1] === target[1] &&
    data[idx + 2] === target[2] &&
    data[idx + 3] === target[3];
  const floodFill = (
    canvas: HTMLCanvasElement,
    startX: number,
    startY: number,
    fillColor: { r: number; g: number; b: number; a: number }
  ) => {
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    const getIdx = (x: number, y: number) => (y * width + x) * 4;
    const startIdx = getIdx(startX, startY);
    const targetColor = [
      data[startIdx],
      data[startIdx + 1],
      data[startIdx + 2],
      data[startIdx + 3],
    ];
    if (
      targetColor[0] === fillColor.r &&
      targetColor[1] === fillColor.g &&
      targetColor[2] === fillColor.b &&
      targetColor[3] === fillColor.a
    )
      return;
    const pixelStack: number[][] = [[startX, startY]];
    while (pixelStack.length) {
      const [x, y] = pixelStack.pop()!;
      let currentY = y;
      let idx = getIdx(x, currentY);
      while (currentY >= 0 && matchColor(data, idx, targetColor)) {
        currentY--;
        idx -= width * 4;
      }
      currentY++;
      idx += width * 4;
      let reachLeft = false;
      let reachRight = false;
      while (currentY < height && matchColor(data, idx, targetColor)) {
        data[idx] = fillColor.r;
        data[idx + 1] = fillColor.g;
        data[idx + 2] = fillColor.b;
        data[idx + 3] = fillColor.a;
        if (x > 0) {
          if (matchColor(data, idx - 4, targetColor)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, currentY]);
              reachLeft = true;
            }
          } else {
            reachLeft = false;
          }
        }
        if (x < width - 1) {
          if (matchColor(data, idx + 4, targetColor)) {
            if (!reachRight) {
              pixelStack.push([x + 1, currentY]);
              reachRight = true;
            }
          } else {
            reachRight = false;
          }
        }
        currentY++;
        idx += width * 4;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };
  const parseRgba = (
    rgba: string
  ): { r: number; g: number; b: number; a: number } => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    if (!match) return { r: 255, g: 255, b: 255, a: 255 };
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: Math.round(parseFloat(match[4]) * 255),
    };
  };
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!isPaintMode) return;

      // Safety checks for required references
      if (!rendererRef.current || !cameraRef.current || !modelRef.current) {
        console.warn("Required references not available for mouse handling");
        return;
      }

      try {
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        mouseRef.current.x = (x / rect.width) * 2 - 1;
        mouseRef.current.y = -(y / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

        // Only consider visible meshes for painting
        const visibleMeshes: THREE.Object3D[] = [];
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.visible) {
            visibleMeshes.push(child);
          }
        });

        const intersects = raycasterRef.current.intersectObjects(visibleMeshes);

        if (intersects.length > 0 && intersects[0].uv) {
          // Prevent default browser behavior and event propagation
          event.preventDefault();
          event.stopPropagation();

          // Save canvas state before making changes
          saveCanvasState();

          // Set painting state
          isPaintingRef.current = true;
          lastPointRef.current = null;

          // Disable orbit controls while painting
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }

          // Start painting at the mouse position
          paintAtMouse();
        } else if (controlsRef.current) {
          // If not painting on a mesh, ensure controls are enabled
          controlsRef.current.enabled = true;
        }
      } catch (err) {
        console.error("Error in mouse down handling:", err);
        // Reset painting state in case of error
        isPaintingRef.current = false;
        if (controlsRef.current) controlsRef.current.enabled = true;
      }
    },
    [isPaintMode, paintAtMouse, saveCanvasState]
  );

  const drawGrid = useCallback(() => {
    if (!modelRef.current) return;

    // Remove any existing grid
    const existingGrid = sceneRef.current.getObjectByName("textureGrid");
    if (existingGrid) {
      sceneRef.current.remove(existingGrid);
    }
    if (!showGrid) return;

    const gridGroup = new THREE.Group();
    gridGroup.name = "textureGrid";
    const modelScale = modelRef.current.scale.x;
    const scale = 0.0318 * modelScale;
    modelRef.current.rotation.y = Math.PI;
    // Create grid box with lines
    const createPixelatedBox = (
      width: number,
      height: number,
      depth: number,
      color: number,
      name: string,
      isOuter: boolean = false
    ): THREE.Group => {
      const boxGroup = new THREE.Group();
      boxGroup.name = name;
      console.log("masdd", name);
      // Adjust outer layer size slightly larger
      const getPartSizeAdjust = (name: string, isOuter: boolean): { x: number, y: number, z: number } => {
        if (!isOuter) return { x: 1, y: 1, z: 1 }; // Inner layers always have normal size

        // Extract part name from the grid name (e.g., "head-outer-grid" -> "head")
        const partName = name.split('-')[0].toLowerCase();

        // Define adjustments for each part and axis
        const partAdjustments: { [key: string]: { x: number, y: number, z: number } } = {
          head: { x: 1.135, y: 1.135, z: 1.135 },
          body: { x: 1.05, y: 1.03, z: 1.14 },
          leftarm: { x: 1.125, y: 1.03, z: 1.15 },
          rightarm: { x: 1.125, y: 1.03, z: 1.15 },
          leftleg: { x: 1.125, y: 1.03, z: 1.15 },
          rightleg: { x: 1.125, y: 1.03, z: 1.15 },
        };

        return partAdjustments[partName] || { x: 1, y: 1, z: 1 };
      };

      // Get the appropriate size adjustment for this box
      const sizeAdjust = getPartSizeAdjust(name, isOuter);
      const boxGeometry = new THREE.BoxGeometry(
        width * scale * sizeAdjust.x,
        height * scale * sizeAdjust.y,
        depth * scale * sizeAdjust.z
      );
      const boxEdges = new THREE.EdgesGeometry(boxGeometry);
      const outerBox = new THREE.LineSegments(
        boxEdges,
        new THREE.LineBasicMaterial({
          color: color,
          linewidth: 2,
          transparent: true,
          opacity: isOuter ? 0.6 : 0.8,
        })
      );
      boxGroup.add(outerBox);

      // Only add grid lines for boxes large enough
      // ... existing code ...

      if (width > 2 && height > 2 && depth > 2) {
        const gridMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: isOuter ? 0.3 : 0.4,
        });

        const addLines = (
          axis: string,
          fixed: number,
          primaryLoop: number,
          secondaryLoop: number,
          positions: (i: number, j: number, w: number, h: number, d: number, s: { x: number, y: number, z: number }) => number[]
        ): void => {
          for (let i = 1; i < primaryLoop; i++) {
            for (let j = 0; j <= fixed; j += fixed) {
              const lineGeometry = new THREE.BufferGeometry();
              const linePositions = new Float32Array(positions(i, j, width, height, depth, {
                x: scale * sizeAdjust.x,
                y: scale * sizeAdjust.y,
                z: scale * sizeAdjust.z
              }));
              lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
              boxGroup.add(new THREE.Line(lineGeometry, gridMaterial));
            }
          }
        };

        // Vertical lines on front and back faces (Z-aligned)
        addLines(
          'z', depth, width, height,
          (x, z, w, h, d, s) => [
            (x - w / 2) * s.x, (-h / 2) * s.y, (z - d / 2) * s.z,
            (x - w / 2) * s.x, (h / 2) * s.y, (z - d / 2) * s.z
          ]
        );

        // Horizontal lines on front and back faces (Z-aligned)
        addLines(
          'z', depth, height, width,
          (y, z, w, h, d, s) => [
            (-w / 2) * s.x, (y - h / 2) * s.y, (z - d / 2) * s.z,
            (w / 2) * s.x, (y - h / 2) * s.y, (z - d / 2) * s.z
          ]
        );

        // Vertical lines on left and right faces (X-aligned)
        addLines(
          'x', width, depth, height,
          (z, x, w, h, d, s) => [
            (x - w / 2) * s.x, (-h / 2) * s.y, (z - d / 2) * s.z,
            (x - w / 2) * s.x, (h / 2) * s.y, (z - d / 2) * s.z
          ]
        );

        // Horizontal lines on left and right faces (X-aligned)
        addLines(
          'x', width, height, depth,
          (y, x, w, h, d, s) => [
            (x - w / 2) * s.x, (y - h / 2) * s.y, (-d / 2) * s.z,
            (x - w / 2) * s.x, (y - h / 2) * s.y, (d / 2) * s.z
          ]
        );

        // Lines on top and bottom faces (x direction)
        addLines(
          'y', height, width, depth,
          (x, y, w, h, d, s) => [
            (x - w / 2) * s.x, (y - h / 2) * s.y, (-d / 2) * s.z,
            (x - w / 2) * s.x, (y - h / 2) * s.y, (d / 2) * s.z
          ]
        );

        // Lines on top and bottom faces (z direction)
        addLines(
          'y', height, depth, width,
          (z, y, w, h, d, s) => [
            (-w / 2) * s.x, (y - h / 2) * s.y, (z - d / 2) * s.z,
            (w / 2) * s.x, (y - h / 2) * s.y, (z - d / 2) * s.z
          ]
        );
      }

      // ... existing code ...

      return boxGroup;
    };

    // Find specific part (inner or outer) by name
    const findPart = (partName: string, isOuter: boolean): THREE.Mesh | null => {
      let foundPart: THREE.Mesh | null = null;

      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const lowerName = child.name.toLowerCase();

            // Special case for head outer layer (hat)
            if (partName === "head" && isOuter && lowerName.includes("hat")) {
              foundPart = child;
              return; // Exit early when found
            }

            // Normal case - match part name and layer type
            if (lowerName.includes(partName)) {
              if (isOuter && (lowerName.includes("_layer"))) {
                foundPart = child;
              } else if (!isOuter && lowerName.includes("_1")) {
                foundPart = child;
              }
            }
          }
        });
      }

      // Debug log
      // console.log(`Finding ${isOuter ? 'outer' : 'inner'} ${partName} part: ${foundPart ? foundPart.name : 'not found'}`);

      return foundPart;
    };

    // Create box grid for a part
    const getBoxForPart = (
      part: THREE.Mesh | null,
      defaultPos: THREE.Vector3,
      width: number,
      height: number,
      depth: number,
      color: number,
      name: string,
      isOuter: boolean = false
    ): THREE.Group | null => {
      if (!part) return null;

      const box = createPixelatedBox(width, height, depth, color, name, isOuter);

      // Get the part's world position
      const partBox = new THREE.Box3().setFromObject(part);
      const partCenter = partBox.getCenter(new THREE.Vector3());
      box.position.copy(partCenter);

      // Define custom positions (offsets) for each body part
      const partPositions = {
        head: { x: 0, y: 0, z: .05 },
        body: { x: 0, y: 0, z: -.05 },
        leftArm: model === "alex"
          ? { x: -1.3722, y: 0, z: 0.16 }
          : { x: -1.5, y: 0, z: 0.16 },
        rightArm: model === "alex"
          ? { x: 1.3722, y: 0, z: -0.23 }
          : { x: 1.5, y: 0, z: -0.23 },
        leftLeg: { x: -.53, y: 0, z: -.31 },
        rightLeg: { x: .53, y: 0, z: 0.235 }
      };

      // Define custom rotations for each body part
      const partRotations = {
        head: { x: -12, y: 0, z: 0 },
        body: { x: 0, y: 0, z: 0 },
        leftArm: { x: 24, y: 0, z: 0 },
        rightArm: { x: -20, y: 0, z: 0 },
        leftLeg: { x: -20, y: -.7, z: 4 },
        rightLeg: { x: 22, y: -.7, z: -4 }
      };

      // Extract part ID from name string
      let partId = name.split('-')[0] as keyof typeof partRotations;

      // Apply custom position offsets if defined for this part
      if (partPositions[partId]) {
        const position = partPositions[partId];
        box.position.x += position.x;
        box.position.y += position.y;
        box.position.z += position.z;
        console.log(`Applied position offset to ${name}: x:${position.x}, y:${position.y}, z:${position.z}`);
      }

      // Match rotation and transformation
      box.rotation.copy(part.rotation);

      // Apply custom rotations if defined for this part
      if (partRotations[partId]) {
        const rotation = partRotations[partId];
        if (rotation.y !== 0) box.rotateY(THREE.MathUtils.degToRad(rotation.y));
        if (rotation.z !== 0) box.rotateZ(THREE.MathUtils.degToRad(rotation.z));
        console.log(`Applied custom rotation to ${name}: x:${rotation.x}°, y:${rotation.y}°, z:${rotation.z}°`);
      }

      // Apply matrix transformations
      box.matrixAutoUpdate = false;
      box.matrix.copy(part.matrixWorld);

      // Position adjustment needs to be applied to the matrix
      const positionVector = new THREE.Vector3();
      if (partPositions[partId]) {
        positionVector.set(
          partCenter.x + partPositions[partId].x,
          partCenter.y + partPositions[partId].y,
          partCenter.z + partPositions[partId].z
        );
      } else {
        positionVector.copy(partCenter);
      }
      box.matrix.setPosition(positionVector);

      // Apply rotation adjustments to the matrix
      if (partRotations[partId]) {
        const rotation = partRotations[partId];
        if (rotation.x !== 0) {
          const xRotation = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(rotation.x));
          box.matrix.multiply(xRotation);
        }
        if (rotation.y !== 0) {
          const yRotation = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(rotation.y));
          box.matrix.multiply(yRotation);
        }
        if (rotation.z !== 0) {
          const zRotation = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(rotation.z));
          box.matrix.multiply(zRotation);
        }
      }

      box.matrixWorldNeedsUpdate = true;

      return box;
    };
    // Model measurements
    const modelBox = new THREE.Box3().setFromObject(modelRef.current);
    const headY = modelBox.max.y - 4 * scale;
    const headx = modelBox.max.y * scale;

    const torsoY = headY - 10 * scale;
    const armWidth = model === "alex" ? 3 : 4;

    // Define body parts with their dimensions and colors
    const bodyParts = [
      {
        id: "head",
        search: "head",
        dims: [8, 8, 8],
        outerDims: [8, 8, 8], // Same as inner dimensions
        color: { inner: 0x00ff00, outer: 0x80ff80 },
        defaultPos: new THREE.Vector3(headx, headY, headx)
      },
      {
        id: "body",
        search: "body",
        dims: [8, 12, 4],
        outerDims: [8, 12, 4], // Same as inner dimensions
        color: { inner: 0xff0000, outer: 0xff8080 },
        defaultPos: new THREE.Vector3(0, torsoY, 0)
      },
      {
        id: "leftArm",
        search: "left_arm",
        dims: [armWidth, 12, 4],
        outerDims: [armWidth, 12, 4], // Same as inner dimensions
        color: { inner: 0x0099ff, outer: 0x80ccff },
        defaultPos: new THREE.Vector3(-(4 + 2) * scale, torsoY, 0)
      },
      {
        id: "rightArm",
        search: "right_arm",
        dims: [armWidth, 12, 4],
        outerDims: [armWidth, 12, 4], // Same as inner dimensions
        color: { inner: 0x0099ff, outer: 0x80ccff },
        defaultPos: new THREE.Vector3((4 + 2) * scale, torsoY, 0)
      },
      {
        id: "leftLeg",
        search: "left_leg",
        dims: [4, 12, 4],
        outerDims: [4, 12, 4], // Same as inner dimensions
        color: { inner: 0xffcc00, outer: 0xffe680 },
        defaultPos: new THREE.Vector3(-2 * scale, torsoY - 12 * scale, 0)
      },
      {
        id: "rightLeg",
        search: "right_leg",
        dims: [4, 12, 4],
        outerDims: [4, 12, 4], // Same as inner dimensions
        color: { inner: 0xffcc00, outer: 0xffe680 },
        defaultPos: new THREE.Vector3(2 * scale, torsoY - 12 * scale, 0)
      }
    ];

    // Create and add all grids based on visibility settings
    bodyParts.forEach(part => {
      const visibility = bodyPartVisibility[part.id as keyof typeof bodyPartVisibility];

      // Add inner layer grid if visible
      if (visibility.inner) {
        const innerPart = findPart(part.search, false);
        if (innerPart) {
          const innerGrid = getBoxForPart(
            innerPart,
            part.defaultPos,
            part.dims[0],
            part.dims[1],
            part.dims[2],
            part.color.inner,
            `${part.id}-inner-grid`,
            false
          );
          if (innerGrid) gridGroup.add(innerGrid);
        }
      }

      // Add outer layer grid if visible
      if (visibility.outer) {
        const outerPart = findPart(part.search, true);
        if (outerPart) {
          const outerGrid = getBoxForPart(
            outerPart,
            part.defaultPos,
            part.outerDims[0],  // Use outerDims instead of adding 0.5
            part.outerDims[1],
            part.outerDims[2],
            part.color.outer,
            `${part.id}-outer-grid`,
            true
          );
          if (outerGrid) gridGroup.add(outerGrid);
        }
      }
    });

    sceneRef.current.add(gridGroup);
  }, [showGrid, model, bodyPartVisibility]);
  useEffect(() => {
    drawGrid();
  }, [showGrid, drawGrid]);

  const initScene = useCallback(async () => {
    try {
      if (!containerRef.current) {
        console.error("Container reference not available");
        return;
      }
      rendererRef.current = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      rendererRef.current.setSize(containerRef.current.offsetWidth, 600);
      containerRef.current.appendChild(rendererRef.current.domElement);
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        containerRef.current.offsetWidth / 600,
        0.1,
        1000
      );
      cameraRef.current.position.set(0, 1.5, 3);
      try {
        const modelToLoad = model === "alex" ? alexModelUrl : steveModelUrl;
        const textureUrl = getTextureUrl();
        textureRef.current = await loadTexture(textureUrl);
        if (textureRef.current.image instanceof HTMLCanvasElement) {
          const canvas = textureRef.current.image;
          const cloneCanvas = document.createElement("canvas");
          cloneCanvas.width = canvas.width;
          cloneCanvas.height = canvas.height;
          const ctx = cloneCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(canvas, 0, 0);
            initialTextureCanvasRef.current = cloneCanvas;
          }
        }
        recordInitialState();
        const gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync(modelToLoad);
        if (!gltf || !gltf.scene) {
          throw new Error("Failed to load model");
        }
        modelRef.current = gltf.scene;
        modelRef.current.rotation.y = Math.PI;
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        modelRef.current.position.sub(center);
        modelRef.current.scale.setScalar(2);
        configureModelGeometry(model, modelRef.current.children);
        modelRef.current.traverse((child) => {
          console.log("Object name:", child.name);
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: textureRef.current,
              transparent: true,
              alphaTest: 0.1,
              side: THREE.DoubleSide,
            });
            const lowerName = child.name.toLowerCase();
            let partType: keyof typeof bodyPartVisibility | null = null;
            let isOuter = false;

            // Determine which part this mesh belongs to
            if (lowerName.includes('head') || lowerName.includes('hat')) {
              partType = 'head';
              isOuter = lowerName === 'hat_layer';
            } else if (lowerName.includes('body')) {
              partType = 'body';
              isOuter = lowerName.includes('_layer');
            } else if (lowerName.includes('left_arm')) {
              partType = 'leftArm';
              isOuter = lowerName.includes('_layer');
            } else if (lowerName.includes('right_arm')) {
              partType = 'rightArm';
              isOuter = lowerName.includes('_layer');
            } else if (lowerName.includes('left_leg')) {
              partType = 'leftLeg';
              isOuter = lowerName.includes('_layer');
            } else if (lowerName.includes('right_leg')) {
              partType = 'rightLeg';
              isOuter = lowerName.includes('_layer');
            }

            // Set visibility based on bodyPartVisibility state
            if (partType) {
              child.visible = isOuter ?
                bodyPartVisibility[partType].outer :
                bodyPartVisibility[partType].inner;
            }
          }
        });

        // Add model to scene
        sceneRef.current.add(modelRef.current);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        sceneRef.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 30, 10);
        sceneRef.current.add(directionalLight);

        // Setup orbit controls
        if (!rendererRef.current) {
          throw new Error("Renderer not initialized");
        }

        controlsRef.current = new OrbitControls(
          cameraRef.current,
          rendererRef.current.domElement
        );

        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.05;
        controlsRef.current.minDistance = 2;
        controlsRef.current.maxDistance = 10;
        controlsRef.current.target.set(0, 1, 0);

        // Set up animation loop
        animate();

        // Everything is ready, enable user interactions
        setCanvasReady(true);

        // Apply background color
        sceneRef.current.background = new THREE.Color(backgroundColor);

      } catch (modelError) {
        console.error("Error loading model or texture:", modelError);
        // Try to show at least something if possible
        setCanvasReady(true);
      }
    } catch (sceneError) {
      console.error("Error initializing scene:", sceneError);
    }
  }, [model, backgroundColor, getTextureUrl, loadTexture, recordInitialState, configureModelGeometry, bodyPartVisibility]);

  const animate = () => {
    requestAnimationFrame(animate);
    controlsRef.current?.update();

    // Sync grid with model if it exists
    const gridGroup = sceneRef.current.getObjectByName("textureGrid");
    if (gridGroup && modelRef.current) {
      gridGroup.rotation.copy(modelRef.current.rotation);
    }

    rendererRef.current?.render(sceneRef.current, cameraRef.current!);
  };
  const handleResize = () => {
    if (!cameraRef.current || !rendererRef.current || !containerRef.current)
      return;
    const width = containerRef.current.offsetWidth;
    const height = 600;
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };
  useEffect(() => {
    initScene();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
      sceneRef.current.clear();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [model, customTexture]);
  useEffect(() => {
    if (!canvasReady) return;
    const canvas = rendererRef.current!.domElement;
    if (isPaintMode) {
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      canvas.style.cursor = "crosshair";
    } else {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.style.cursor = "grab";
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    isPaintMode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    canvasReady,
    initScene,
  ]);
  useEffect(() => {
    sceneRef.current.background = new THREE.Color(backgroundColor);
  }, [backgroundColor]);
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.zoom = zoom;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [zoom]);
  useEffect(() => {
    const updateTextureAndModel = async () => {
      if (!modelRef.current) return;
      const textureUrl = getTextureUrl();
      const newTexture = await loadTexture(textureUrl);
      textureRef.current = newTexture;
      if (newTexture.image instanceof HTMLCanvasElement) {
        const canvas = newTexture.image as HTMLCanvasElement;
        const cloneCanvas = document.createElement("canvas");
        cloneCanvas.width = canvas.width;
        cloneCanvas.height = canvas.height;
        cloneCanvas.getContext("2d")?.drawImage(canvas, 0, 0);
        initialTextureCanvasRef.current = cloneCanvas;
      }
      const gltfLoader = new GLTFLoader();
      const modelToLoad = model === "alex" ? alexModelUrl : steveModelUrl;
      const gltf = await gltfLoader.loadAsync(modelToLoad);
      sceneRef.current.remove(modelRef.current);
      modelRef.current = gltf.scene;
      modelRef.current.rotation.y = Math.PI;
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
      modelRef.current.scale.setScalar(2);
      configureModelGeometry(model, modelRef.current.children);
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {

          child.material = new THREE.MeshStandardMaterial({
            map: newTexture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
          });
          child.userData.layerType = isOuterLayer(child.name) ? "outer" : "inner";
        }
      });
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      sceneRef.current.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(10, 30, 10);
      sceneRef.current.add(directionalLight);
      sceneRef.current.add(modelRef.current);
      recordInitialState();
    };
    updateTextureAndModel();
  }, [model, customTexture, recordInitialState, canvasReady]);
  useEffect(() => {
    if (controlsRef.current) controlsRef.current.enabled = !isPaintMode;
  }, [isPaintMode]);
  useEffect(() => {
    const resetTexture = async () => {
      const newTexture = await createCanvasTexture();
      textureRef.current = newTexture;
    };
    resetTexture();
  }, [reset]);
  useEffect(() => {
    if (["pencil", "eraser", "fill"].includes(tool)) {
      setIsPaintMode(true);
      if (controlsRef.current) controlsRef.current.enabled = false;
    } else {
      setIsPaintMode(false);
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  }, [tool]);

  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const lowerName = child.name.toLowerCase();
        let part: keyof typeof bodyPartVisibility | null = null;
        let isOuter = false;

        // Determine part and layer type
        if (lowerName === 'hat_layer') {
          part = 'head';
          isOuter = true;
        } else if (lowerName.includes('head')) {
          part = 'head';
          isOuter = false;
        } else if (lowerName.includes('body')) {
          part = 'body';
          isOuter = lowerName.includes('_layer');
        } else if (lowerName.includes('left_arm')) {
          part = 'leftArm';
          isOuter = lowerName.includes('_layer');
        } else if (lowerName.includes('right_arm')) {
          part = 'rightArm';
          isOuter = lowerName.includes('_layer');
        } else if (lowerName.includes('left_leg')) {
          part = 'leftLeg';
          isOuter = lowerName.includes('_layer');
        } else if (lowerName.includes('right_leg')) {
          part = 'rightLeg';
          isOuter = lowerName.includes('_layer');
        }

        // Set visibility if part is identified
        if (part) {
          child.visible = isOuter ?
            bodyPartVisibility[part].outer :
            bodyPartVisibility[part].inner;
        }
      }
    });
  }, [bodyPartVisibility]);
  useEffect(() => {
    setBodyPartVisibility({
      head: { inner: true, outer: true },
      body: { inner: true, outer: true },
      leftArm: { inner: true, outer: true },
      rightArm: { inner: true, outer: true },
      leftLeg: { inner: true, outer: true },
      rightLeg: { inner: true, outer: true },
    });
  }, [model]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden glass-panel group ring-1 ring-slate-700/50">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Visibility Controls Panel - Appears on Hover */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel p-4 rounded-xl min-w-[220px] transition-all duration-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 backdrop-blur-md bg-slate-900/80 border border-slate-700/50 shadow-xl">
        <h3 className="panel-title mb-3 !mb-2 text-xs">Part Visibility</h3>
        <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 customize-scrollbar">
          {Object.entries(bodyPartVisibility).map(([part, layers]) => (
            <div key={part} className="flex items-center justify-between gap-3 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors">
              <span className="text-xs font-medium text-slate-300 capitalize">
                {part.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() =>
                    setBodyPartVisibility((prev) => ({
                      ...prev,
                      [part as keyof typeof prev]: {
                        ...prev[part as keyof typeof prev],
                        inner: !prev[part as keyof typeof prev].inner,
                      },
                    }))
                  }
                  className={`p-1.5 rounded-md transition-all duration-200 ${layers.inner
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-slate-700/30 text-slate-500 hover:bg-slate-700/50 hover:text-slate-400"
                    }`}
                  title="Toggle Inner Layer"
                >
                  {layers.inner ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button
                  onClick={() =>
                    setBodyPartVisibility((prev) => ({
                      ...prev,
                      [part as keyof typeof prev]: {
                        ...prev[part as keyof typeof prev],
                        outer: !prev[part as keyof typeof prev].outer,
                      },
                    }))
                  }
                  className={`p-1.5 rounded-md transition-all duration-200 ${layers.outer
                    ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    : "bg-slate-700/30 text-slate-500 hover:bg-slate-700/50 hover:text-slate-400"
                    }`}
                  title="Toggle Outer Layer"
                >
                  {layers.outer ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ModelViewer;

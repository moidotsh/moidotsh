// src/stores/dynamicSceneryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateCloudLayers } from "@/utils/cloudUtils";

interface CloudLayer {
  path: string;
  transform: string;
  opacity: number;
}

interface Cloud {
  id: number;
  position: number;
  speed: number;
  size: number;
  yOffset: number;
  layers: CloudLayer[];
}

interface DynamicSceneryState {
  clouds: Cloud[];
  boats: any[];
  lastUpdateTimestamp: number;
  isInitialized: boolean;
  setClouds: (clouds: Cloud[]) => void;
  setBoats: (boats: any[]) => void;
  setInitialized: (value: boolean) => void;
  updatePositions: (screenWidth: number) => void;
}

const validateCloud = (cloud: any): cloud is Cloud => {
  return (
    cloud &&
    Array.isArray(cloud.layers) &&
    cloud.layers.every(
      (layer: any) =>
        layer.path && layer.transform && typeof layer.opacity === "number",
    )
  );
};

export const useDynamicSceneryStore = create<DynamicSceneryState>()(
  persist(
    (set, get) => ({
      clouds: [],
      boats: [],
      lastUpdateTimestamp: Date.now(),
      isInitialized: false,

      setClouds: (clouds) => {
        // Validate clouds before setting
        const validClouds = clouds.map((cloud) =>
          validateCloud(cloud)
            ? cloud
            : {
                ...cloud,
                layers: generateCloudLayers(),
              },
        );
        set({ clouds: validClouds });
      },

      setBoats: (boats) => set({ boats }),
      setInitialized: (value) => set({ isInitialized: value }),

      updatePositions: (screenWidth) => {
        const currentTime = Date.now();
        const timeDelta = currentTime - get().lastUpdateTimestamp;

        const clouds = get().clouds.map((cloud) => {
          // Validate each cloud's layers
          if (!validateCloud(cloud)) {
            cloud.layers = generateCloudLayers();
          }

          let newPosition = cloud.position - cloud.speed * timeDelta;
          let newLayers = cloud.layers;

          if (newPosition < -cloud.size) {
            newPosition = screenWidth + 100;
            newLayers = generateCloudLayers();
          }

          return {
            ...cloud,
            position: newPosition,
            layers: newLayers,
          };
        });

        const boats = get().boats.map((boat) => {
          const direction = boat.direction;
          const speed = boat.speed * timeDelta;
          let newPosition =
            boat.position + (direction === "right" ? speed : -speed);

          if (direction === "right" && newPosition > screenWidth + 100) {
            newPosition = -100;
          } else if (direction === "left" && newPosition < -100) {
            newPosition = screenWidth + 100;
          }

          return {
            ...boat,
            position: newPosition,
          };
        });

        set({
          clouds,
          boats,
          lastUpdateTimestamp: currentTime,
        });
      },
    }),
    {
      name: "dynamic-scenery-storage",
      version: 1, // Add version number to handle storage migrations
      merge: (persistedState: any, currentState) => {
        // Validate persisted clouds
        const validatedClouds =
          persistedState.clouds?.map((cloud: any) =>
            validateCloud(cloud)
              ? cloud
              : {
                  ...cloud,
                  layers: generateCloudLayers(),
                },
          ) || [];

        return {
          ...currentState,
          ...persistedState,
          clouds: validatedClouds,
          isInitialized: false, // Force reinitialization
        };
      },
    },
  ),
);

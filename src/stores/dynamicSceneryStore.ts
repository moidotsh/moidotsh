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

const validateCloud = (cloud: Partial<Cloud>): cloud is Cloud => {
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

      setClouds: (clouds: Cloud[]) => {
        const validClouds = clouds.map((cloud: Partial<Cloud>) => {
          if (validateCloud(cloud)) return cloud;
          return {
            id: cloud.id || 0,
            position: cloud.position || 0,
            speed: cloud.speed || 0,
            size: cloud.size || 0,
            yOffset: cloud.yOffset || 0,
            layers: generateCloudLayers(),
          };
        });
        set({ clouds: validClouds as Cloud[] });
      },

      setBoats: (boats) => set({ boats }),
      setInitialized: (value) => set({ isInitialized: value }),

      updatePositions: (screenWidth: number) => {
        const currentTime = Date.now();
        const timeDelta = currentTime - get().lastUpdateTimestamp;

        const clouds = get().clouds.map((cloud: Cloud) => {
          // Create a new cloud object instead of modifying the existing one
          const currentCloud: Cloud = {
            ...cloud,
            layers: validateCloud(cloud) ? cloud.layers : generateCloudLayers(),
          };

          let newPosition =
            currentCloud.position - currentCloud.speed * timeDelta;

          if (newPosition < -currentCloud.size) {
            newPosition = screenWidth + 100;
            return {
              ...currentCloud,
              position: newPosition,
              layers: generateCloudLayers(),
            };
          }

          return {
            ...currentCloud,
            position: newPosition,
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
      version: 1,
      merge: (persistedState: any, currentState) => {
        const validatedClouds =
          persistedState.clouds?.map((cloud: Partial<Cloud>) => {
            if (validateCloud(cloud)) return cloud;
            return {
              id: cloud.id || 0,
              position: cloud.position || 0,
              speed: cloud.speed || 0,
              size: cloud.size || 0,
              yOffset: cloud.yOffset || 0,
              layers: generateCloudLayers(),
            };
          }) || [];

        return {
          ...currentState,
          ...persistedState,
          clouds: validatedClouds,
          isInitialized: false,
        };
      },
    },
  ),
);

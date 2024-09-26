// store.ts
import create from 'zustand'

type MountainDetails = any 

interface SceneryState {
topRightMountainDetails: MountainDetails[],
  topLeftMountainDetails: MountainDetails[],
  bottomRightMountainDetails: MountainDetails[],
  bottomLeftMountainDetails: MountainDetails[],
  setTopRightMountainDetails: (details: MountainDetails[]) => void,
  setTopLeftMountainDetails: (details: MountainDetails[]) => void,
  setBottomRightMountainDetails: (details: MountainDetails[]) => void,
  setBottomLeftMountainDetails: (details: MountainDetails[]) => void,
}

export const useSceneryStore = create<SceneryState>((set) => ({
  topRightMountainDetails: [],
  topLeftMountainDetails: [],
  bottomRightMountainDetails: [],
  bottomLeftMountainDetails: [],
  setTopRightMountainDetails: (details) => set({ topRightMountainDetails: details }),
  setTopLeftMountainDetails: (details) => set({ topLeftMountainDetails: details }),
  setBottomRightMountainDetails: (details) => set({ bottomRightMountainDetails: details }),
  setBottomLeftMountainDetails: (details) => set({ bottomLeftMountainDetails: details }),
}))


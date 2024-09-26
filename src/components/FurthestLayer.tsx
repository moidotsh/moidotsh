//FurthestLayer.tsx
import React from 'react'
import Background from './Background'
import MountainContainer from './MountainContainer'
import Sun from './Sun'
import { useSceneryStore } from '@/stores/sceneryStore'


type Props = {}

function FurthestLayer({ }: Props) {

  const setTopRightMountainDetails = useSceneryStore((state) => state.setTopRightMountainDetails)
  const setTopLeftMountainDetails = useSceneryStore((state) => state.setTopLeftMountainDetails)


  return (

    <Background>
      {/* This is 2/5 vh */}
      <MountainContainer
        setMountainDetails={setTopRightMountainDetails}
        className={"row-start-2 col-start-7 col-span-5 -mr-36"}
        colorGroup="top-right"
      />
      <Sun className={"row-start-2 col-start-6 col-span-2"} />
      <MountainContainer
        setMountainDetails={setTopLeftMountainDetails}
        className={"row-start-2 col-span-5 -ml-36"}
        colorGroup="top-left"
      />
    </Background>
  )
}

export default FurthestLayer

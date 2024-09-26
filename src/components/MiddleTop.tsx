import { useSceneryStore } from '@/stores/sceneryStore'
import React from 'react'
import MountainReflection from './MountainReflection'
import MountainContainer from './MountainContainer'
import { theme } from '@/styles/themes'

type Props = {}

function MiddleTop({ }: Props) {
  
  const topRightMountainDetails = useSceneryStore((state) => state.topRightMountainDetails)
  const topLeftMountainDetails = useSceneryStore((state) => state.topLeftMountainDetails)
  const setBottomLeftMountainDetails = useSceneryStore((state) => state.setBottomLeftMountainDetails)
  const setBottomRightMountainDetails = useSceneryStore((state) => state.setBottomRightMountainDetails)

return (


    <div
      style={{
        background: `linear-gradient(to top, ${theme.lakeColors.top.gradientStart}, ${theme.lakeColors.top.gradientMid}, ${theme.lakeColors.top.gradientEnd})`,
      }}
      className="h-1/5 grid grid-rows-2 grid-cols-11"
    >
      <div className="row-start-1 col-span-5 opacity-25 relative scale-x-150 w-[80%]">
        <MountainReflection details={topLeftMountainDetails} />
      </div>

      <div className="col-start-8 col-span-4 row-start-1 opacity-25 relative scale-x-150 ml-1">
        <MountainReflection details={topRightMountainDetails} />
      </div>
      <MountainContainer
        setMountainDetails={setBottomRightMountainDetails}
        className={
          "row-start-2 col-start-8 col-span-4  bottom-[400%] w-3/12 scale-[600%] z-[100] ml-96"
        }
        colorGroup="bottom-right"
      />
      <MountainContainer
        setMountainDetails={setBottomLeftMountainDetails}
        className={
          "row-start-2 col-star-1 col-span-3 bottom-[400%] w-3/12 scale-[600%] z-[100]"
        }
        colorGroup="bottom-left"
      />
    </div>

  )
}

export default MiddleTop

import React from 'react'
import MountainReflection from './MountainReflection'
import { useSceneryStore } from '@/stores/sceneryStore'
import { theme } from '@/styles/themes'

type Props = {}

function MiddleBot({ }: Props) {
  const bottomLeftMountainDetails = useSceneryStore((state) => state.bottomLeftMountainDetails)
  const bottomRightMountainDetails = useSceneryStore((state) => state.bottomRightMountainDetails)

return (
    <>
      {/* Using style here because can't interpolate js to tailwind util classes. But it's only bg colours so it's not a big deal */}
      < div
        style={{
          background: `linear-gradient(to top, ${theme.lakeColors.middle.gradientStart}, ${theme.lakeColors.middle.gradientMid}, ${theme.lakeColors.middle.gradientEnd})`,
        }
        }
        className="h-1/5 grid grid-rows-2 grid-cols-11 overflow-x-hidden"
      >
        <div className="row-start-1 col-span-7 opacity-25 w-[11%] scale-x-[600%]">
          <MountainReflection details={bottomLeftMountainDetails} />
        </div>
        <div className="col-start-8 col-span-3 row-start-1 opacity-25 w-4/12 scale-x-[600%] ml-96 ">
          <MountainReflection details={bottomRightMountainDetails} />
        </div>
      </div >
    </>
  )
}

export default MiddleBot

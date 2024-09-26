import React from 'react'
import { theme } from '@/styles/themes'

type Props = {}

function Bot({ }: Props) {
  return (

    <div
      style={{
        background: `linear-gradient(to top, ${theme.lakeColors.bottom.gradientStart}, ${theme.lakeColors.bottom.gradientMid}, ${theme.lakeColors.bottom.gradientEnd})`,
      }}
      className="h-1/5"
    ></div>
  )
}

export default Bot

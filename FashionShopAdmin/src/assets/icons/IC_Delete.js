import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"

const SvgComponent = (props) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17 7s0-.51-2-.8v-.7A1.53 1.53 0 0 0 13.47 4h-3A1.5 1.5 0 0 0 9 5.5v.7a3.706 3.706 0 0 0-2.007.806L6 7v1h12V7h-1Zm-7-1.5a.51.51 0 0 1 .499-.5h3.002a.53.53 0 0 1 .529.499v.561a10.224 10.224 0 0 0-1.527-.059c-.553 0-2.063 0-2.503.07V5.5ZM6 9v1h1v9c1.234.631 2.692 1 4.236 1h1.529a9.418 9.418 0 0 0 4.289-1.025L17 10h1V9H6Zm4 8.92a9.788 9.788 0 0 1-1-.17V11h1v6.92Zm3 .08h-2v-7h2v7Zm2-.28c-.267.07-.606.136-.95.184L14 11h1v6.72Z"
      fill="#000"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo

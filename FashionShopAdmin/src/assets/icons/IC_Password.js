import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"

const SvgComponent = (props) => (
  <Svg
    width={18}
    height={12}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17.875 5.563C16.187 2.25 12.812 0 9 0 5.156 0 1.781 2.25.094 5.563A.998.998 0 0 0 0 6c0 .188.031.344.094.469C1.78 9.78 5.156 12 9 12c3.813 0 7.188-2.219 8.875-5.531a.998.998 0 0 0 .094-.438c0-.187-.032-.343-.094-.468ZM9 10.5c-2.5 0-4.5-2-4.5-4.5 0-2.469 2-4.5 4.5-4.5 2.469 0 4.5 2.031 4.5 4.5v.031c0 2.469-2.031 4.5-4.5 4.5V10.5ZM9 3c-.281.031-.563.063-.813.125.188.25.282.563.282.906C8.469 4.844 7.813 5.5 7 5.5c-.344 0-.656-.094-.906-.281C6.03 5.469 6 5.75 6 6a3 3 0 0 0 6 0c0-1.656-1.344-2.969-3-2.969V3Z"
      fill="#000"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo

import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"

const SvgComponent = (props) => (
  <Svg
    width={18}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16.5 0h-15A1.5 1.5 0 0 0 0 1.5v11c0 .844.656 1.5 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-11c0-.813-.688-1.5-1.5-1.5Zm0 12.5h-15v-11h15v11ZM6.5 7c1.094 0 2-.875 2-2 0-1.094-.906-2-2-2-1.125 0-2 .906-2 2 0 1.125.875 2 2 2Zm-2.813 4h5.594c.406 0 .719-.25.719-.594v-.594C10 8.813 9.031 8 7.875 8c-.313 0-.563.25-1.375.25-.844 0-1.063-.25-1.406-.25C3.937 8 3 8.813 3 9.813v.593c0 .344.313.594.688.594Zm7.563-2h3.5c.125 0 .25-.094.25-.25v-.5a.269.269 0 0 0-.25-.25h-3.5a.247.247 0 0 0-.25.25v.5c0 .156.094.25.25.25Zm0-2h3.5c.125 0 .25-.094.25-.25v-.5a.269.269 0 0 0-.25-.25h-3.5a.247.247 0 0 0-.25.25v.5c0 .156.094.25.25.25Zm0-2h3.5c.125 0 .25-.094.25-.25v-.5a.269.269 0 0 0-.25-.25h-3.5a.247.247 0 0 0-.25.25v.5c0 .156.094.25.25.25Z"
      fill="#000"
    />
  </Svg>
)

const Memo = memo(SvgComponent)
export default Memo

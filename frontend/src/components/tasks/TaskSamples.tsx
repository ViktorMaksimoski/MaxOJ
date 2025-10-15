import { useState } from "react"

export const TaskSamples = ({ children }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="mt-5"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}>
        <h3 className={`font-semibold text-xl pl-2 text-blue-900 
        border-l-[2px] ${hovered && "border-l-blue-300"} mb-1`}>Примери</h3>
        <div className="w-[80%] pt-4">
          <div className="flex w-full justify-between mb-1">
            <p className="w-[40%] text-blue-700">Влез</p>
            <p className="w-[40%] text-blue-700">Излез</p>
          </div>
          {children}
        </div>
    </div>
  )
}

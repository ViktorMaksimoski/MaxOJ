import { HashIcon } from "lucide-react"

interface SectionContentProps {
    children: React.ReactNode
    title?: string
}

export const SectionContent = ({ children, title }: SectionContentProps) => {
  return (
    <div className='mt-5'>
      <h2 className="text-3xl text-gray-800 flex items-center mt-6 
      font-medium tracking-wide gap-3">
        <span className="h-7 w-1 rounded-full bg-blue-600" />
        {title}
      </h2>
      <div className="mt-5 w-[90%] text-lg tracking-wide">{children}</div>
    </div>
  )
}

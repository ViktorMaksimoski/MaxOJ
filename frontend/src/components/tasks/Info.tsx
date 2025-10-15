import { AlertTriangleIcon } from "lucide-react"

export const Info = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className="bg-blue-800 border-2 border-sky-400 w-[85%] mx-auto
    px-8 py-3 mt-6 flex gap-6 items-center rounded-lg shadow-md shadow-blue-900/40">
        <div className="bg-sky-300/90 p-2 rounded-full text-blue-800 flex items-center justify-center">
            <AlertTriangleIcon className="size-5" />
        </div>
        <div className="font-medium text-white leading-relaxed">
            {children}
        </div>
    </div>
  )
}

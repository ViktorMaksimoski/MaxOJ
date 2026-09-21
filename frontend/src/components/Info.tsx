import { AlertCircle } from "lucide-react";

interface InfoProps {
    children: string;
}

export const Info = ({ children }: InfoProps) => {
  return (
    <div className="bg-blue-300 w-[100%] py-3 px-4 flex gap-3
    shadow-sm shadow-sky-100 items-center rounded-lg mt-5">
      <div className="text-sky-700">
        <AlertCircle />
      </div>
      <div className="text-sky-800 font-medium tracking-wide">
        {children}
      </div>
    </div>
  )
}

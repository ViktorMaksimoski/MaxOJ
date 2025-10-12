import { AlertCircle } from "lucide-react";

interface InfoProps {
    children: string;
}

export const Info = ({ children }: InfoProps) => {
  return (
    <div className="bg-sky-300 w-[80%] py-2 px-4 flex gap-3
    shadow-md shadow-sky-200 items-center rounded-sm mt-5">
      <div className="text-sky-700">
        <AlertCircle />
      </div>
      <div className="text-sky-800 font-semibold">
        {children}
      </div>
    </div>
  )
}

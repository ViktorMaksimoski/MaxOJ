import { XCircle } from "lucide-react";

interface WarningProps {
    children: string;
};

export const Warning = ({children}: WarningProps) => {
  return (
    <div className="bg-red-400 w-[100%] sm:w-[90%] py-3 px-4 flex gap-3
    shadow-sm shadow-red-100 items-center rounded-lg mt-5">
      <div className="text-red-800">
        <XCircle />
      </div>
      <div className="text-red-800 font-medium tracking-wide">
        {children}
      </div>
    </div>
  )
}

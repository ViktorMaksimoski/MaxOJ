import { XCircle } from "lucide-react";

interface WarningProps {
    children: string;
};

export const Warning = ({children}: WarningProps) => {
  return (
    <div className="bg-red-500 w-[80%] py-2 px-4 flex gap-3
    shadow-md shadow-red-200 items-center rounded-sm mt-5">
      <div className="text-red-700">
        <XCircle />
      </div>
      <div className="text-red-800 font-semibold">
        {children}
      </div>
    </div>
  )
}

import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import { useState } from "react";

interface SpoilerProps {
    children: React.ReactNode
    title: string
};

export const Spoiler = ({ children, title }: SpoilerProps) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    
    <div className="mt-5 w-[100%] overflow-hidden
    rounded-lg border border-sky-300 shadow-sm ">
        <button
        onClick={() => setShow(!show)}
        className={`w-full flex justify-between items-center
        py-2.5 px-5 rounded-t-lg text-lg font-semibold tracking-wide
        transition-colors duration-200
        ${show 
        ? "text-sky-600 bg-white" 
        : "text-white bg-blue-300 rounded-b-lg shadow-sm"
        }`}>
            {title}
            <div>
                {show && <ArrowUpCircleIcon className="shrink-0
                transition-transform duration-200" size={30} />}
                {!show && <ArrowDownCircleIcon className="shrink-0
                transition-transform duration-200" size={30} />}
            </div>
        </button>
        {show && <div className="border-t border-sky-100
        bg-sky-50 px-7 py-4 text-sm font-medium leading-relaxed
        text-slate-700 tracking-wide">
            {children}
        </div>}
    </div>
  )
}

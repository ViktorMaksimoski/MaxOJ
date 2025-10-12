import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import { useState } from "react";

interface SpoilerProps {
    children: React.ReactNode
    title: string
};

export const Spoiler = ({ children, title }: SpoilerProps) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="mt-5 w-[70%] shadow-sm shadow-blue-200">
        <button onClick={() => setShow(!show)}
        className={`bg-sky-300 w-full flex justify-between 
        items-center
        py-2.5 px-5 rounded-t-lg text-lg text-white font-semibold
        ${!show && "rounded-b-lg"}
        ${show && "text-sky-500 bg-white border border-sky-500"}`}>
            {title}
            <div>
                {show && <ArrowUpCircleIcon size={40} />}
                {!show && <ArrowDownCircleIcon size={40} />}
            </div>
        </button>
        {show && <div className="bg-sky-600 text-white
        font-semibold px-7 py-3 rounded-b-md">
            {children}
        </div>}
    </div>
  )
}

import { useEffect } from "react";
import { types } from "../lib/task-types"
import { StarIcon } from "lucide-react";

interface TaskRowProps {
    url: string;
    source: string;
    star?: boolean;
    task: string;
    level: number;
};

export const TaskRow = ({ url, source, star, task, level }: TaskRowProps) => {
  return (

    <tr key={url} className='h-10 group transition-colors hover:bg-sky-50/70'>
        <td className="hidden sm:table-cell text-center px-4">
            <span className="text-sm font-medium tracking-wider text-gray-800">
                {source}
            </span>
        </td>
        <td className="pl-1">
            <div className="flex pl-2.5 sm:pl-0 items-center">
                {star && <StarIcon size={18} className="text-amber-400 fill-amber-400" />}
                <a href={url} target='_blank'
                className=" pl-1.5 font-semibold text-gray-800 transition-colors
            hover:text-blue-600 tracking-wide">
                    {task}
                </a>
            </div>
        </td>
        <td className="text-center px-3">
            <span className={`
                inline-flex items-center justify-center
                w-[80%] rounded-full px-3 py-1
                text-sm font-normal tracking-wider text-white
                shadow-sm ${types[level].color}
            `}>
                {types[level].name}
            </span>
        </td>
    </tr>
  )
}

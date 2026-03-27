import { useEffect } from "react";
import { types } from "../lib/task-types"

interface TaskRowProps {
    url: string;
    source: string;
    star?: boolean;
    task: string;
    level: number;
};

export const TaskRow = ({ url, source, star, task, level }: TaskRowProps) => {
  return (
    <tr key={url} className='h-10 hover:bg-sky-50'>
        <td className='hidden sm:table-cell text-center font-semibold text-base'>
            <button className='underline underline-offset-2 decoration-dotted'>
                {source}
            </button>
        </td>
        <td className=''>
            <div className="flex pl-2.5 sm:pl-0">
                <a href={url} className='hover:text-blue-400 font-semibold' target='_blank'>
                    {task}
                </a>
                <div className="pl-1">{star && "⭐"}</div>
            </div>
        </td>
        <td className='text-center font-semibold px-4'>
            <button className={`bg-${types[level].color}-500 text-white text-sm sm:text-base rounded-2xl px-2.5 sm:px-5 py-0.5 w-full
                shadow-sm shadow-slate-400`}>
                {types[level].name}
            </button>
        </td>
    </tr>
  )
}

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
        <td className='text-center font-semibold text-lg'>
            <button className='underline underline-offset-2 decoration-dotted'>
                {source}
            </button>
        </td>
        <td className='pl-1.5'>
            <div className="flex">
                <div>{star && "⭐"}</div>
                <a href={url} className='hover:text-blue-400 font-semibold' target='_blank'>
                    {task}
                </a>
            </div>
        </td>
        <td className='text-center font-semibold px-4'>
            <button className={`${types[level].color} text-white rounded-2xl px-5 py-0.5 w-full`}>
                {types[level].name}
            </button>
        </td>
    </tr>
  )
}

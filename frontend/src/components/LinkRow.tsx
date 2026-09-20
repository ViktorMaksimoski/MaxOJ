import { StarIcon } from "lucide-react";

interface LinkRowProps {
    url: string;
    source: string;
    name: string;
    importance: number;
};

export const LinkRow = ({ url, source, name, importance}: LinkRowProps) => {
  return (
    <tr key={url} className='h-10 group transition-colors hover:bg-sky-50/70'>
        <td className='hidden sm:table-cell text-center px-4'>
            <span className="text-sm font-medium tracking-wider text-gray-800">
                {source}
            </span>
        </td>
        <td>
            <a href={url} target='_blank' 
            className="font-semibold text-gray-800 transition-colors
            hover:text-blue-600 tracking-wide">
                {name}
            </a>
        </td>
        <td className='text-center'>
            <div className="flex items-center justify-center gap-0.5"
            aria-label={`Важност: ${importance} од 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon size={14} key={i}
                    className={
                        i < importance ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"
                    } />
                ))}
            </div>
        </td>
    </tr>
  )
}

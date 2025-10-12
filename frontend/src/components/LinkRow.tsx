interface LinkRowProps {
    url: string;
    source: string;
    name: string;
    importance: number;
};

export const LinkRow = ({ url, source, name, importance}: LinkRowProps) => {
  return (
    <tr key={url} className='h-9 hover:bg-sky-50'>
        <td className='text-center font-semibold text-lg'>
            <button className='underline underline-offset-2 decoration-dotted'>
                {source}
            </button>
        </td>
        <td className='pl-1.5'>
            <a href={url} className='hover:text-blue-400 font-semibold' target='_blank'>
                {name}
            </a>
        </td>
        <td className='text-center font-semibold'>{importance}/5</td>
        </tr>
  )
}

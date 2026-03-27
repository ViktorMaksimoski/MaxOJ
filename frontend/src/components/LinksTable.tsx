import { StarIcon } from "lucide-react"

interface LinksTableProps {
    children: React.ReactNode
}

export const LinksTable = ({ children }: LinksTableProps) => {
  return (
    <table className='mt-2 w-[100%] sm:w-[90%] shadow-sm shadow-blue-200 border border-blue-300 rounded-lg border-separate'>
        <thead className='border-gray-100'>
            <tr className='h-7'>
                <th className='hidden sm:table-cell w-[18%] font-semibold text-blue-700'>Извор</th>
                <th className='font-semibold text-blue-700'>Материјал(и)</th>
                <th className='w-[15%] text-center font-semibold text-blue-700'>
                    <div className="flex justify-center items-center">
                    <div className="block sm:hidden"><StarIcon size={20}/></div>
                    <div className="hidden sm:block">Важност</div>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            {children}
        </tbody>
    </table>
  )
}

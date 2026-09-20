import { StarIcon } from "lucide-react"

interface LinksTableProps {
    children: React.ReactNode
}

export const LinksTable = ({ children }: LinksTableProps) => {
  return (
    <div className="mt-4 w-full sm:w-[90%] overflow-hidden rounded-lg
    border border-blue-300 shadow-sm bg-white">
        <table className="w-full border-collapse">
            <thead className="bg-blue-50 border-b border-blue-200">
                <tr className="h-11">
                    <th className="hidden sm:table-cell w-[18%] px-4
                    text-center text-sm font-semibold text-blue-600">
                        Извор
                    </th>

                    <th className="text-left text-sm font-semibold text-blue-600">
                        Материјал(и)
                    </th>

                    <th className="w-[15%] px-3 text-center text-sm font-semibold text-blue-600">
                        <div className="flex items-center justify-center">
                            <StarIcon
                            size={18}
                            className="block sm:hidden text-amber-400 fill-amber-400"
                            />
                            <span className="hidden sm:block">Важност</span>
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody className="[&>tr]:border-b [&>tr]:border-slate-100 
            [&>tr:last-child]:border-0 [&>tr]:transition-colors 
            [&>tr:hover]:bg-slate-50">
                {children}
            </tbody>
        </table>
    </div>
  )
}

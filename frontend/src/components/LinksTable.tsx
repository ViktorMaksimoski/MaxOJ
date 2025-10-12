interface LinksTableProps {
    children: React.ReactNode
}

export const LinksTable = ({ children }: LinksTableProps) => {
  return (
    <table className='mt-2 w-[90%] shadow-sm shadow-blue-200 border border-blue-300 rounded-lg border-separate'>
        <thead className='border-gray-100'>
            <tr className='h-7'>
                <th className='w-[18%] font-semibold text-blue-700'>Извор</th>
                <th className='font-semibold text-blue-700'>Матријал(и)</th>
                <th className='w-[15%] font-semibold text-blue-700'>Важност</th>
            </tr>
        </thead>
        <tbody>
            {children}
        </tbody>
    </table>
  )
}

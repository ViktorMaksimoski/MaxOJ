export const TaskSubtasks = ({ children }: {children: React.ReactNode}) => {
  return (
    <table className='w-[70%] table-auto mx-auto bg-white mt-6 mb-4 rounded-md
    shadow-sm shadow-slate-200 border hover:border-blue-200 border-collapse'>
        <thead className='py-0.5 border-b'>
          <tr className='w-full'>
            <th className='w-[10%] text-center border font-medium'>#</th>
            <th className='w-[20%] text-center border font-medium'>Поени</th>
            <th className='w-[70%] text-center border font-medium'>Ограничувања</th>
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
    </table>
  )
}

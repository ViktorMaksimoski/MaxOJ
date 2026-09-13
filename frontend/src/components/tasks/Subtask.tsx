import React from 'react'

interface SubtaskProps {
    id: number;
    points: number;
    children: React.ReactNode;
    dep: string;
}

export const Subtask = ({ id, points, children, dep }: SubtaskProps) => {
  return (
    <tr className='hover:bg-blue-50'>
        <td className='w-[10%] text-center border py-0.5'>{id}</td>
        <td className='w-[15%] text-center border py-0.5'>{points}</td>
        <td className='w-[55%] text-center border py-0.5'>{children}</td>
        <td className='w-[55%] text-center border py-0.5'>{dep}</td>
    </tr>
  )
}
 
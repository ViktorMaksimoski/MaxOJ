import React from 'react'

interface SubtaskProps {
    id: number;
    points: number;
    children: React.ReactNode;
}

export const Subtask = ({ id, points, children }: SubtaskProps) => {
  return (
    <tr className='hover:bg-blue-50'>
        <td className='w-[10%] text-center border py-0.5'>{id}</td>
        <td className='w-[20%] text-center border py-0.5'>{points}</td>
        <td className='w-[70%] text-center border py-0.5'>{children}</td>
    </tr>
  )
}
 
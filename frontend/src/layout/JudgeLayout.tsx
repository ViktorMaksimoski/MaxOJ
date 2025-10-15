import { JudgeNav } from './JudgeNav'
import { Outlet } from 'react-router'

export const JudgeLayout = () => {
  return (
    <div className='overflow-visible bg-sky-50 min-h-screen'>
      <JudgeNav />
      <Outlet />
    </div>
  )
}

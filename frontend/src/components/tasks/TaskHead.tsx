interface TaskHeadProps {
    children: React.ReactNode
}

export const TaskHead = ({ children }: TaskHeadProps) => {
  return (
    <div>
        {children}
        <hr className="mt-3 h-1 border-t-2 border-t-gray-300" />
    </div>
  )
}

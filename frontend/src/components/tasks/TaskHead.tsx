interface TaskHeadProps {
    children: React.ReactNode
}

export const TaskHead = ({ children }: TaskHeadProps) => {
  return (
    <div>
        {children}
        <hr className="mt-2" />
    </div>
  )
}

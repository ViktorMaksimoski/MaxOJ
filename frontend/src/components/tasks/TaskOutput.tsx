export const TaskOutput = ({children}) => {
  return (
    <div className="mt-5 border-l-[2px] hover:border-l-blue-300 pl-2">
        <h3 className="font-semibold text-xl mb-1 text-blue-900">Излез</h3>
        {children}
    </div>
  )
}

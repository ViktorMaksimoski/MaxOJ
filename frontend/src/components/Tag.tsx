interface TagProps {
    children: React.ReactNode;
}

export const Tag = ({ children }: TagProps) => {
  return (
    <span className="text-blue-600 rounded-sm border border-blue-400 mx-0.5 shadow-md shadow-slate-200 bg-slate-50 px-1.5 py-1">
        {children}
    </span>
  )
}

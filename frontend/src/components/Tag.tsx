interface TagProps {
    children: React.ReactNode;
}

export const Tag = ({ children }: TagProps) => {
  return (
    <span className="text-blue-400 rounded-sm shadow-md shadow-slate-200 bg-slate-50 px-1 py-[1px]">
        {children}
    </span>
  )
}

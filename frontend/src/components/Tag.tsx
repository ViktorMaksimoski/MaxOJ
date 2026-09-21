interface TagProps {
    children: React.ReactNode;
}

export const Tag = ({ children }: TagProps) => {
  return (
    <span className="mx-0.5 inline-block rounded-md border
    border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[0.9rem] font-semibold
    text-blue-700">
        {children}
    </span>
  )
}

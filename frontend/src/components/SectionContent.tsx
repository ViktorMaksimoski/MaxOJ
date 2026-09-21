interface SectionContentProps {
    children: React.ReactNode
    title?: string
}

export const SectionContent = ({ children, title }: SectionContentProps) => {
  return (
    <div className='mt-5'>
      <h2 className="text-3xl mt-6">{title}</h2>
      <div className="mt-5 w-[90%]">{children}</div>
    </div>
  )
}

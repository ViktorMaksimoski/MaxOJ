interface SectionContentProps {
    children: React.ReactNode
}

export const SectionContent = ({ children }: SectionContentProps) => {
  return (
    <div className='mt-5'>
        {children}
    </div>
  )
}

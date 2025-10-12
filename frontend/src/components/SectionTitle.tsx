import React from 'react'

interface SectionTitleProps {
    children: React.ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => {
  return (
    <h2 className="text-3xl mt-6">{children}</h2>
  )
}

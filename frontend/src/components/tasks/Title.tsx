interface TitleProps {
    children: React.ReactNode
}

export const Title = ({ children }: TitleProps) => {
  return (
    <h1 className="text-gray-800 text-3xl font-medium tracking-wide">{children}</h1>
  )
}

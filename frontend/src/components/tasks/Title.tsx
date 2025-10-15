interface TitleProps {
    children: React.ReactNode
}

export const Title = ({ children }: TitleProps) => {
  return (
    <h1 className="text-bold text-4xl tracking-wide">{children}</h1>
  )
}

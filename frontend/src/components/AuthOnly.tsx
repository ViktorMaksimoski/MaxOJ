import { useAuth } from "../contexts/AuthContext"
import { Warning } from "./Warning";

interface AuthOnlyProps {
    children: React.ReactNode
}

export const AuthOnly = ({ children }: AuthOnlyProps) => {
    const { user, loading } = useAuth()
  
    if(loading) return null;
    if(!user) return <Warning>Мора да бидете најавени да го гледате овој дел</Warning>
    return <>{children}</>
}

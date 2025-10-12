import type { JSX } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router"

interface UsersOnlyRouteProps {
    children: JSX.Element
}

export const UsersOnlyRoute = ({ children }: UsersOnlyRouteProps) => {
    const { user, loading } = useAuth()

    if(loading) return null;
    return user ? children : <Navigate to={'/login'} replace />
}

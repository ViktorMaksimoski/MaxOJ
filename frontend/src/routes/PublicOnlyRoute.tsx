import { type JSX } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router'

interface PublicOnlyRouteProps {
    children: JSX.Element
}

export const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
    const { user, loading } = useAuth()

    if(loading) return null;
    return user ? <Navigate to={'/'} replace /> : children
}

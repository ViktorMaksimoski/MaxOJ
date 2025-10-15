import { Link } from "react-router"
import { useAuth } from "../contexts/AuthContext"

export const JudgeNav = () => {
  const { user, loading } = useAuth()

  return (
    <nav className="sticky top-0 left-0 w-full shadow-sm 
    shadow-sky-200 bg-blue-500 z-50 ">
      <div className="mx-auto mx-w-7xl px-7 py-5 flex items-center justify-between">
        <div>
          <Link to={'/judge'} className="tracking-wider text-2xl
          font-semibold text-white">
            MaxOJ
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-5">
            <Link to={"/"}>
              <button className="text-lg
              border border-blue-900 text-blue-600 py-1.5 px-6
              rounded-md
              hover:text-blue-600 bg-white">Научи</button>
            </Link>
            <button
              className="text-lg px-6 text-white
                bg-blue-800 py-1.5 rounded-md"
            >
              {user.displayName}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { BookOpenIcon } from "lucide-react";

export const JudgeNav = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      className="sticky top-0 left-0 w-full shadow-sm 
    shadow-sky-200 bg-blue-500 z-50 "
    >
      <div className="mx-auto mx-w-7xl px-7 py-5 flex items-center justify-between">
        <div>
          <Link
            to={"/judge"}
            className="tracking-wider text-2xl
          font-semibold text-white"
          >
            MaxOJ
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <Link to={"/"}>
            <button
              className="text-lg
              border border-blue-900 text-blue-600 py-1.5 px-2.5
              rounded-md sm:px-6
              hover:text-blue-600 bg-white"
            >
              <div className="block sm:hidden"><BookOpenIcon /></div>
              <div className="hidden sm:block">Научи</div>
            </button>
          </Link>
          {user && (
            <button
              className="text-lg px-6 text-white
                bg-blue-800 py-1.5 rounded-md"
            >
              {user.displayName}
            </button>
          )}
          {!user && (
            <button
              className="text-lg px-6 text-white
                bg-blue-800 py-1.5 rounded-md"
              onClick={() => navigate('/login')}
            >
              Најава
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

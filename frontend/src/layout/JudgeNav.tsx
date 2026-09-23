import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Book, BookOpenIcon, LogInIcon, LogOutIcon, SearchIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../firebase";

export const JudgeNav = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [logOut, setLogOut] = useState(false);
  const [openProfile, setOpenProfile] = useState(false)
  const location = useLocation();

  const logOutFunc = async () => {
    try {
      await signOut(auth);
      navigate('/judge');
    } catch(err) {
      console.log(err);
      toast.error("Не може да се одјавите! Пробајте повторно");
    }
  }

  return (
    <nav
      className="sticky top-0 left-0 w-full shadow-sm px-16
     bg-white z-50 border-b-2 border-b-gray-200"
    >
      <div className="mx-auto mx-w-7xl px-7 py-5 flex items-center justify-between">
        <div>
          <Link
            to={"/judge"}
            className="text-xl font-medium"
          >
            Max<span className="text-blue-700">OJ</span>
          </Link>
        </div>
        

        <div className="flex items-center gap-5">
          <Link
            to={"/"}
            className="group flex items-center gap-2
          rounded-lg border-2 border-slate-200 bg-white px-4 py-3
          text-sm font-medium transition text-slate-600 h-11 tracking-wide
          duration-200 hover:border-blue-200 hover:text-blue-600
          focus:border-blue-300"
          >
            <BookOpenIcon size={18} />
            Научи
          </Link>
          {user && (
            <div
            className="relative"
            onMouseEnter={() => setOpenProfile(true)}
            onMouseLeave={() => setOpenProfile(false)}>
              <button
                className="group flex items-center gap-2
              rounded-lg border-2 border-slate-200 bg-white px-7 py-3
              text-sm font-medium transition text-slate-600 tracking-wide h-11
              duration-200 hover:border-blue-200 hover:text-blue-600"
                
              >
                <div
                  className="w-6 h-6 flex items-center justify-center rounded-full
                bg-blue-100 px-1 py-1 text-blue-700"
                >
                  <UserIcon size={18} />
                </div>
                {user.displayName}
              </button>

              {openProfile &&
                <div className="absolute left-0 top-full z-50 pt-2 w-full">
                <div
                className="bg-white border border-gray-200 w-full py-2
                rounded-lg shadow-sm flex flex-col items-center">
                  <Link className="h-9 w-[80%] flex items-center gap-2 text-sm
                  font-medium text-slate-600 tracking-wide transition
                  duration-200 hover:bg-blue-50 rounded-lg px-3 py-1"
                  to={'/judge/profile'}>
                    <div className="w-6 h-6 flex items-center justify-center
                    rounded-full bg-blue-100 px-1.5 py-1.5 text-blue-700">
                      <SearchIcon size={16} />
                    </div>
                    Види профил
                  </Link>

                  <div className="h-1 w-[80%] border-t-2 border-gray-200 my-1.5"></div>

                  <button className="h-9 w-[80%] flex items-center gap-2 text-sm
                  font-medium text-red-600 tracking-wide transition duration-200
                  hover:bg-red-50 rounded-lg px-3 py-1"
                  onClick={logOutFunc}>
                    <div className="w-6 h-6 flex items-center justify-center
                    rounded-full bg-red-100 px-1.5 py-1.5 text-red-700">
                      <LogOutIcon size={16} />
                    </div>
                    Одјави се
                  </button>
                </div>
                </div>}
            </div>
          )}
          {!user && (
            <Link
              to={"/login"}
              className="group flex items-center gap-2
              rounded-lg border-2 border-slate-200 bg-white px-4 py-3
              text-sm font-medium transition text-slate-600 h-11 tracking-wide
              duration-200 hover:border-blue-200 hover:text-blue-600"
            >
              <LogInIcon size={18} />
              Најава
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

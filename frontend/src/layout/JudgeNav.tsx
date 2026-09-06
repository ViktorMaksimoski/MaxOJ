import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { BookOpenIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../firebase";

export const JudgeNav = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [logOut, setLogOut] = useState(false);

  const logOutFunc = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch(err) {
      console.log(err);
      toast.error("Не може да се одјавите! Пробајте повторно");
    }
  }

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
              hover:text-blue-700 bg-white"
            >
              <div className="block sm:hidden"><BookOpenIcon /></div>
              <div className="hidden sm:block">Научи</div>
            </button>
          </Link>
          {user && (
            <div className="relative"
            onMouseEnter={() => setLogOut(true)}
            onMouseLeave={() => setLogOut(false)}>
              <button
              className="text-lg px-6 text-white
                bg-blue-800 py-1.5 rounded-md"
              >
                {user.displayName}
              </button>

              {logOut &&
              <div className="absolute right-0 top-full">
                <div className="absolute right-6 -top-1 w-0 h-0
                border-l-[20px] border-r-[20px] border-b-[15px]
                border-l-transparent border-r-transparent 
                border-b-white">

                </div>
                <button className="bg-white
                rounded-md text-base font-semibold py-1.5 px-6
                flex gap-1 items-center shadow-sm text-blue-600
                hover:text-blue-700"
                onClick={logOutFunc}>
                  <LogOutIcon />
                  Одјави се
                </button>
              </div>
              }
            </div>
            
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

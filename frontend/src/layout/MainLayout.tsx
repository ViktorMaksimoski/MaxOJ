import { Outlet } from "react-router"
import { Nav } from "./Nav"

export const MainLayout = () => {
  return (
    <div className="overflow-visible">
        <Nav />
        <Outlet />
    </div>
  )
}

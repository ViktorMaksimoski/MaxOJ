import { Route, Routes } from "react-router"
import { Home } from './pages/Home.tsx'
import { Nav } from "./layout/Nav.tsx"
import { Topic } from "./pages/Topic.tsx"
import { Register } from "./pages/Register.tsx"
import { Login } from './pages/Login.tsx'
import { Testing } from "./pages/Testing.tsx"

export const App = () => {
  return (
    <div className="overflow-visible">
      <Nav />
      <div className="">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/topic/:id' element={<Topic />} />
          <Route path='/topic/:id/:lectionCode' element={<Topic />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/test' element={<Testing />} />
        </Routes>
      </div>
    </div>
  )
}

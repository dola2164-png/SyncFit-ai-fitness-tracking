// import { Sidebar } from "lucide-react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/ui/Sidebar"
import BottomNav from "../components/BottomNav"

const Layout = () => {
  return (
    <div className="layout-container">
        <Sidebar/>
        <div className="flex-1 overflow-y-scroll">
              <Outlet/>
        </div>
<BottomNav/>
   
    </div>
  )
}

export default Layout

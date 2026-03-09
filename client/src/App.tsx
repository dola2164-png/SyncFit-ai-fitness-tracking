import { Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Foodlog from "./pages/Foodlog"
import Activitylog from "./pages/Activitylog"
import Profile from "./pages/profile"
import { useAppContext } from "./context/Appcontext"
import Login from "./pages/Login"
import Loading from "./components/ui/Loading"
import Onboarding from "./pages/Onboarding"
import { Toaster } from "react-hot-toast"
// import Layout from "./pages/Layout"

const App = () => {
  const {user,isUserFetched,onboardingCompleted}=useAppContext()
  if(!user){
    return isUserFetched?<Login/>:<Loading/>
  }
  if(!onboardingCompleted){
    return <Onboarding/>
  }
  return (
    <>
    <Toaster/>
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="food" element={<Foodlog/>}/>
        <Route path="activity" element={<Activitylog/>}/>
         <Route path="profile" element={<Profile/>}/>


        </Route>
      </Routes>
    </>
  )
}

export default App
import { Home, User, Utensils, Activity } from "lucide-react"
import { NavLink } from "react-router-dom"

const BottomNav = () => {
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/food", label: "Food", icon: Utensils },
    { path: "/activity", label: "Activity", icon: Activity },
    { path: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pb-safe lg:hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon // Capitalize dynamic component
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200 ${
                  isActive ? "text-pink-400" : ""
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
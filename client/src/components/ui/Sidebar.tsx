import { ActivityIcon, HeartPulseIcon, HomeIcon, MoonIcon, SunIcon, UserIcon, UtensilsIcon } from "lucide-react";
import { useTheme } from "../../context/Themecontext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/food", label: "Food", icon: UtensilsIcon },
    { path: "/activity", label: "Activity", icon: ActivityIcon },
    { path: "/profile", label: "Profile", icon: UserIcon },
  ]

  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="hidden lg:flex flex-col w-64 bg-purple-50 dark:bg-purple-900 border-r border-purple-200 dark:border-purple-800 p-6 transition-colors duration-200">
      
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
          <HeartPulseIcon className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-purple-800 dark:text-white">
          SyncFit
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
    className={({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded transition-colors duration-200 ${
    isActive
      ? "bg-pink-100 dark:bg-pink-400 text-pink-600 dark:text-pink-100"
      : "text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800"
  }`
}
            >
              <item.icon className="size-5" />
              <span className="text-base">
                {item.label}
              </span>
            </NavLink>
          )
        )}
      </div>
      <div className="mt-auto pt-6 border-t border-slate-100 dark:boredr-slate-800">
       <button
  onClick={toggleTheme}
  className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 
             dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 
             hover:text-slate-700 dark:hover:text-slate-200 rounded-lg 
             transition-colors duration-200 cursor-pointer"
>
{theme=== 'light'?<MoonIcon className="size-5"/>:<SunIcon className="size-5"/>}
<span className="text-base">{theme === 'light'?'Dark Mode':'Light Mode'}</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
import { useEffect, useState } from "react"
import { getMotivationalMessage } from "../assets/assets"
import { useAppContext } from "../context/Appcontext"
import type { ActivityEntry, FoodEntry } from "../types"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import goalImg from "../assets/goal.png"; 
import {
  Activity,
  FlameIcon,
  HamburgerIcon,
  RulerIcon,
  Scale3dIcon,
  ScaleIcon,
  TrendingUpIcon,
  ZapIcon
} from "lucide-react"
import CaloriesChart from "../components/CaloriesChart"

const Dashboard = () => {
  const { user, allActivityLogs, allFoodLogs } = useAppContext()

  // State for today's food and activities
  const [todayFood, setTodayFood] = useState<FoodEntry[]>([])
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([])

  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000

  const loadUserData = () => {
    const today = new Date().toISOString().split("T")[0]

    // Filter today's food
    const foodData = allFoodLogs.filter(
      (f: FoodEntry) => f.createdAt?.split("T")[0] === today
    )
    setTodayFood(foodData)

    // Filter today's activities
    const activityData = allActivityLogs.filter(
      (a: ActivityEntry) => a.createdAt?.split("T")[0] === today
    )
    setTodayActivities(activityData)
  }

  useEffect(() => {
    loadUserData()
  }, [allFoodLogs, allActivityLogs])

  // Derived values
  const totalCalories: number = todayFood.reduce((sum, item) => sum + item.calories, 0)
  const totalActiveMinutes: number = todayActivities.reduce(
    (sum, item) => sum + (item.duration ?? 0),
  0
  );
  const totalCaloriesBurned: number = todayActivities.reduce(
    (sum, item) => sum + (item.calories || 0),
    0
  )
  const workoutsCount: number = todayActivities.length;

  const motivation = getMotivationalMessage(totalCalories, totalActiveMinutes, DAILY_CALORIE_LIMIT)

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome Back</p>
        <h1 className="text-2xl font-bold mt-1">{`Hi there! ${user?.username}`}</h1>
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{motivation.emoji}</span>
            <p className="text-white font-medium">{motivation.text}</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-grid">
        <Card className="shadow-lg col-span-2">
          {/* Calories Consumed */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <HamburgerIcon className="w-6 h-6 text-pink-500" />
              <div>
                <p>Calories Consumed</p>
                <p>{totalCalories}</p>
              </div>
            </div>
            <div className="text-right">
              <p>Limit</p>
              <p>{DAILY_CALORIE_LIMIT}</p>
            </div>
          </div>
          <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-slate-400">{Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%</span>
          </div>

          <div className="border-t my-4"></div>

          {/* Calories Burned */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FlameIcon className="w-6 h-6 text-orange-500" />
              <div>
                <p>Calories Burned</p>
                <p>{totalCaloriesBurned}</p>
              </div>
            </div>
            <div className="text-right">
              <p>Goal</p>
              <p>{user?.dailyCalorieBurn || 400}</p>
            </div>
          </div>
          <ProgressBar value={totalCaloriesBurned} max={user?.dailyCalorieBurn || 400} />
        </Card>

        {/* Quick Stats */}
        <div className="dashboard-card-grid">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-blue-500" />
              <p>Active</p>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalActiveMinutes}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">minutes today</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <ZapIcon className="w-5 h-5 text-pink-300" />
              <p>Workouts</p>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{workoutsCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">sessions today</p>
          </Card>
        </div>

        {/* Goals */}
        {user && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUpIcon className="w-6 h-6 text-blue-500 dark:text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Goal</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {user.goal === "lose" && "lose weight"}
                  {user.goal === "maintain" && "maintain weight"}
                  {user.goal === "gain" && "gain weight"}
                </p>
              </div>
             
            
            </div>
             <div> <img src={goalImg} alt="Goal" className="w-80 h-80 mt-2 object-contain mx-auto" /></div>
          </Card>
        )}

        {/* Body Metrics */}
        {user && (
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <Scale3dIcon className="w-6 h-6 text-blue-900 dark:text-indigo-500" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Body Metrics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your Stats</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Weight */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <ScaleIcon className="w-6 h-6 text-blue-900 dark:text-indigo-500" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {user.weight ? `${user.weight} kg` : "–"}
                </span>
              </div>

              {/* Height */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <RulerIcon className="w-6 h-6 text-blue-900 dark:text-indigo-500" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Height</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {user.height ? `${user.height} cm` : "–"}
                </span>
              </div>

              {/* BMI */}
              <div className="flex flex-col justify-between p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Activity className="w-6 h-6 text-blue-900 dark:text-indigo-500" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">BMI</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {user.weight && user.height
                    ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
                    : "–"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {user.weight && user.height
                    ? (() => {
                        const bmi = user.weight / ((user.height / 100) ** 2)
                        if (bmi < 18.5) return "Underweight"
                        if (bmi < 25) return "Normal"
                        if (bmi < 30) return "Overweight"
                        return "Obese"
                      })()
                    : "Add height"}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Summary */}
        <Card className="p-4 space-y-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-slate-800 rounded-md">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Meals logged</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{todayFood.length}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-slate-800 rounded-md">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Calories</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{totalCalories} kcal</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-slate-800 rounded-md">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Time</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{totalActiveMinutes} min</span>
            </div>
          </div>
        </Card>

        {/* Weekly Chart */}
        <Card>
          <h3>This Week's Progress</h3>
          <CaloriesChart />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
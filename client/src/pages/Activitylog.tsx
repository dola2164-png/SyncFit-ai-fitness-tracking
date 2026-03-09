import { useEffect, useState } from "react"
import { useAppContext } from "../context/Appcontext"
import type { ActivityEntry } from "../types"
import Card from "../components/ui/Card"
import { quickActivities } from "../assets/assets"
import { PlusIcon } from "lucide-react"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import toast from "react-hot-toast"
import api from "../configs/api"

const Activitylog = () => {

  const { allActivityLogs, setAllActivityLogs } = useAppContext()

  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', duration: 0, calories: 0 })
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const loadActivities = () => {
    const todayActivities = allActivityLogs.filter(
      (a: ActivityEntry) => a.createdAt?.split("T")[0] === today
    )
    setActivities(todayActivities)
  }

  useEffect(() => {
    loadActivities()
  }, [allActivityLogs])

  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0)
  const totalCalories = activities.reduce((sum, a) => sum + a.calories, 0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const { data } = await api.post('/api/activity-logs',{data:formData})


      setAllActivityLogs(prev => [...prev, data])
      setFormData({
        name: '',
        duration: 0,
        calories: 0
      })

      setShowForm(false)

    } catch (error: any) {
      toast.error(error?.message || error?.response?.data?.error?.message);
    }
  }

  const handleQuickAdd = (activity: { name: string; rate: number }) => {
    setFormData({
      name: activity.name,
      duration: 30,
      calories: 30 * activity.rate
    })
    setShowForm(true)
  }

  const handleDurationChange = (val: string | number) => {
    const duration = Number(val)
    const activity = quickActivities.find(a => a.name === formData.name)

    let calories = formData.calories
    if (activity) calories = duration * activity.rate

    setFormData({ ...formData, duration, calories })
  }

  return (
    <div className="page-container p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="page-header flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Activity Log
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track daily workouts
          </p>
        </div>

        {/* Totals */}
        <div className="flex flex-col gap-1 text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Active Today
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {totalMinutes} mins
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Calories Burned
          </p>
          <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
            {totalCalories} kcal
          </p>
        </div>

      </div>

      {/* Grid */}
      <div className="page-content-grid grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Quick Add */}
        {!showForm && (
          <div className="flex flex-col gap-3">

            <Card className="p-5 bg-pink-50 dark:bg-pink-900 rounded-xl shadow-md">

              <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-200 mb-3">
                Quick Add
              </h3>

              <div className="flex flex-wrap gap-2">
                {quickActivities.map((activity) => (
                  <button
                    key={activity.name}
                    onClick={() => handleQuickAdd(activity)}
                    className="flex items-center gap-2 px-3 py-2 bg-pink-100 dark:bg-pink-300 text-purple-900 dark:text-white rounded-lg hover:bg-pink-200 dark:hover:bg-pink-600 transition"
                  >
                    <span>{activity.emoji}</span>
                    <span>{activity.name}</span>
                  </button>
                ))}
              </div>

            </Card>

            <Button
              className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-400 text-white"
              onClick={() => setShowForm(true)}
            >
              <PlusIcon className="size-5" />
              Add Custom Activity
            </Button>

          </div>
        )}

        {/* Form */}
        {showForm && (
          <Card className="border-2 border-purple-200 p-5 rounded-xl">

            <h3 className="text-lg font-semibold mb-3">New Activity</h3>

            <form className="space-y-4" onSubmit={handleSubmit}>

              <Input
                label="Activity Name"
                placeholder="e.g., Yoga"
                required
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v.toString() })}
              />

              <div className="flex gap-4">
                <Input
                  label="Duration (min)"
                  type="number"
                  placeholder="30"
                  required
                  value={formData.duration}
                  onChange={handleDurationChange}
                />
                <Input
                  label="Calories Burned"
                  type="number"
                  placeholder="200"
                  required
                  value={formData.calories}
                  onChange={(v) =>
                    setFormData({ ...formData, calories: Number(v) })
                  }
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false)
                    setError('')
                    setFormData({ name: '', duration: 0, calories: 0 })
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-500 text-white">
                  Add Activity
                </Button>
              </div>

            </form>

          </Card>
        )}

        {/* Activity List */}
        <div className="space-y-3">
          {activities.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No activities logged today
              </p>
            </Card>
          ) : (
            activities.map((activity) => (
              <Card
                key={activity.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {activity.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.duration} mins
                  </p>
                </div>
                <p className="text-sm font-medium text-pink-600">
                  {activity.calories} kcal
                </p>
              </Card>
            ))
          )}
        </div>

      </div>

    </div>
  )
}

export default Activitylog
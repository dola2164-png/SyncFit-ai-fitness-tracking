import { useEffect, useState } from "react";
import { useAppContext } from "../context/Appcontext";
import type { ProfileFormData  } from "../types";
import Card from "../components/ui/Card";
import { Calendar, LogOutIcon, RulerIcon, ScaleIcon, Target, User } from "lucide-react";
import Button from "../components/ui/Button";
import { goalLabels, goalOptions } from "../assets/assets";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

import toast from "react-hot-toast";
import api from "../configs/api";

const Profile = () => {
  const { user, logout, fetchUser, allFoodLogs, allActivityLogs } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: 'maintain',
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400,
  });

  // Fetch user data
  const fetchUserData = () => {
    if (user) {
      setFormData({
        age: user.age || 0,
        weight: user.weight || 0,
        height: user.height || 0,
        goal: user.goal || 'maintain',
        dailyCalorieIntake: user.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user.dailyCalorieBurn || 400,
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Save profile updates
  const handleSave = async () => {
    try {
      await api.put(`/api/users/${user?.id}`,formData)
     await fetchUser(user?.token || '');
      toast.success('Profile Updated');
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to update");
    }
    setIsEditing(false);
  };

  // Get total stats
  const getStats = () => {
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivities = allActivityLogs?.length || 0;
    return { totalFoodEntries, totalActivities };
  };
  const stats = getStats();

  if (!user || !formData) return null;

  return (
    <div className="page-container p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Header */}
      <div className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage Settings
        </p>
      </div>

      {/* Profile Content */}
      <div className="profile-content space-y-4">

        {/* Profile Card */}
        <Card className="p-5 rounded-xl shadow-md bg-white dark:bg-slate-800">

          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-pink-100 dark:bg-purple-800">
              <User className="text-pink-600 dark:text-pink-200" size={28} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Profile
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {new Date(user.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          {isEditing ? (
            <div className="space-y-4">
              <Input label="Age" type="number" value={formData.age} onChange={(v) => setFormData({ ...formData, age: Number(v) })} />
              <Input label="Weight (kg)" type="number" value={formData.weight} onChange={(v) => setFormData({ ...formData, weight: Number(v) })} min={20} max={300} />
              <Input label="Height (cm)" type="number" value={formData.height} onChange={(v) => setFormData({ ...formData, height: Number(v) })} min={100} max={300} />
              <Select
                label="Fitness Goal"
                value={formData.goal}
                onChange={(v) => setFormData({ ...formData, goal: v as 'lose' | 'maintain' | 'gain' })}
                options={goalOptions}
              />
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    fetchUserData();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-pink-600 hover:bg-pink-500 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-400">
                    <Calendar className="text-pink-600 dark:text-pink-200" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.age} years</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-400">
                    <ScaleIcon className="text-pink-600 dark:text-pink-200" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.weight} kg</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-400">
                    <RulerIcon className="text-pink-600 dark:text-pink-200" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Height</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.height} cm</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-400">
                    <Target className="text-pink-600 dark:text-pink-200" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Goal</p>
                    <p className="font-medium text-gray-900 dark:text-white">{goalLabels[user.goal || 'maintain']}</p>
                  </div>
                </div>

              </div>

              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="w-full mt-4 bg-pink-600 hover:bg-pink-500 text-white"
              >
                Edit Profile
              </Button>
            </>
          )}

        </Card>

        {/* Stats Section */}
        <div className="space-y-4">
          <Card className="p-5 rounded-xl shadow-md bg-pink-50 dark:bg-purple-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-700">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-200">{stats.totalFoodEntries}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Food Entries</p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-700">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-200">{stats.totalActivities}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Activities</p>
              </div>
            </div>
          </Card>

          {/* Logout */}
          <Button
            variant="danger"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 ring ring-red-300 hover:ring-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOutIcon size={18} />
            Logout
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
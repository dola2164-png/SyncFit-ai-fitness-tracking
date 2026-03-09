import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/Appcontext";
import type { FoodEntry, FormData } from "../types";
import Card from "../components/ui/Card";
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets";
import Button from "../components/ui/Button";
import { Loader2Icon, PlusIcon, SparkleIcon, Trash2Icon, UtensilsIcon } from "lucide-react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import toast from "react-hot-toast";
import api from "../configs/api";

const Foodlog = () => {
  const { allFoodLogs, setAllFoodLogs } = useAppContext();

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    calories: 0,
    mealType: ''
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split('T')[0];

  // Load today's entries
  const loadEntries = () => {
    const todayEntries = allFoodLogs.filter(
      (e: FoodEntry) => e.createdAt?.split('T')[0] === today
    );
    setEntries(todayEntries);
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.calories || formData.calories <= 0 || !formData.mealType) {
      return toast.error('Enter valid data');
    }

    try {
      const { data } = await api.post('/api/food-logs', { data: formData });
      setAllFoodLogs(prev => [...prev, data]);
      setFormData({ name: '', calories: 0, mealType: '' });
      setShowForm(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  // Delete entry
  const handleDelete = async (documentId: string) => {
    try {
      const confirmDelete = window.confirm("Delete this entry?");
      if (!confirmDelete) return;

      await api.delete(`/api/food-logs/${documentId}`);
      setAllFoodLogs(prev => prev.filter(e => e.documentId !== documentId));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  // Quick add buttons
  const handleQuickAdd = (mealType: string) => {
    setFormData({ ...formData, mealType });
    setShowForm(true);
  };

  // AI Food Snap handler
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const imageFormData = new FormData();
    imageFormData.append('image', file);

    try {
      const { data } = await api.post('/api/image-analysis', imageFormData);
      const result = data.result;

      let mealType = '';
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 12) mealType = 'breakfast';
      else if (hour >= 12 && hour < 16) mealType = 'lunch';
      else if (hour >= 16 && hour < 19) mealType = 'snack';
      else mealType = 'dinner';

      if (!mealType || !result.name || !result.calories) {
        return toast.error('Missing data from image analysis');
      }

      const { data: newEntry } = await api.post('/api/food-logs', {
        data: { name: result.name, calories: result.calories, mealType }
      });
setAllFoodLogs(prev => [...prev, newEntry]);

      if (inputRef.current) inputRef.current.value = '';
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Group entries by meal type
  const groupEntries: Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]> =
    entries.reduce((acc, entry) => {
      if (!acc[entry.mealType]) acc[entry.mealType] = [];
      acc[entry.mealType].push(entry);
      return acc;
    }, {} as Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]>);

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);

  useEffect(() => {
    loadEntries();
  }, [allFoodLogs]);

  return (
    <div className="page-container p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="page-header flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Food Log</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track daily intake</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Today's Total</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{totalCalories} kcal</p>
        </div>
      </div>

      <div className="page-content-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick Add + AI Snap */}
        {!showForm && (
          <div className="flex flex-col gap-3">
            <Card className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Add</h3>
              <div className="flex flex-wrap gap-2">
                {quickActivitiesFoodLog.map(activity => (
                  <button
                    key={activity.name}
                    onClick={() => handleQuickAdd(activity.name)}
                    className="flex items-center gap-2 px-3 py-2 bg-pink-100 dark:bg-pink-300 text-gray-900 dark:text-white rounded-lg hover:bg-pink-200 transition"
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
              Add Food Entry
            </Button>

            <Button
              className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-400 text-white"
              onClick={() => inputRef.current?.click()}
            >
              <SparkleIcon className="size-5" />
              AI Food Snap
            </Button>

            <input
              type="file"
              accept="image/*"
              hidden
              ref={inputRef}
              onChange={handleImageChange}
            />

            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2Icon className="size-6 animate-spin text-pink-500" />
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">New Food Entry</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Food Name"
                value={formData.name}
                onChange={v => setFormData({ ...formData, name: v.toString() })}
                placeholder="e.g., Grilled Chicken Salad"
                required
              />
              <Input
                label="Calories"
                type="number"
                value={formData.calories}
                onChange={v => setFormData({ ...formData, calories: Number(v) })}
                placeholder="e.g., 350"
                required
              />
              <Select
                label="Meal Type"
                value={formData.mealType}
                onChange={v => setFormData({ ...formData, mealType: v.toString() })}
                options={mealTypeOptions}
                placeholder="Select meal type"
                required
              />

              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', calories: 0, mealType: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">Add Entry</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Entries Display */}
        {entries.length === 0 ? (
          <Card className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 mb-3">
              <UtensilsIcon className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Food Logged Today</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Start tracking your meals</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
              const mealTypeKey = mealType as keyof typeof groupEntries;
              if (!groupEntries[mealTypeKey] || groupEntries[mealTypeKey].length === 0) return null;

              const MealIcon = mealIcons[mealTypeKey];
              const mealCalories = groupEntries[mealTypeKey].reduce((sum, e) => sum + e.calories, 0);

              return (
                <Card key={mealType} className="p-4 hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealColors[mealTypeKey]}`}>
                        <MealIcon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{mealType}</h3>
                        <p className="text-sm text-gray-500">{groupEntries[mealTypeKey].length} items</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">{mealCalories} kcal</p>
                  </div>

                  <div className="space-y-2 mt-3">
                    {groupEntries[mealTypeKey].map(entry => (
                      <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-slate-700">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{entry.calories} kcal</span>
                          <button
                            onClick={() => handleDelete(entry?.documentId || '')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Foodlog;
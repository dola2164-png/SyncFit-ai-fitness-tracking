import { ArrowLeft, ArrowRight, HeartPulse, ScaleIcon, Target, User } from "lucide-react"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useAppContext } from "../context/Appcontext"
import type { ProfileFormData } from "../types"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { ageRanges, goalOptions } from "../assets/assets"
import Slider from "../components/ui/Slider"
import api from "../configs/api"

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const { user, setOnboardingCompleted, fetchUser } = useAppContext()
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: "maintain",
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400
  })
  const totalSteps = 3;

  const updateField = (field: keyof ProfileFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleNext = async () => {
    if(step === 1){if(!formData.age || Number(formData.age)<13 || Number(formData.age)>120 ){
        return toast("Age Required")
    }}
    if(step < totalSteps) { setStep(step + 1 );}
    else{
        const userData ={
            ...formData,
            age:formData.age,
            weight: formData.weight,
            height:formData.height? formData.height:null,
            createdAt: new Date().toISOString()
        };
       localStorage.setItem('fitnessUser', JSON.stringify(userData))
     try {
      await api.put(`/api/users/${user?.id}`,userData)
       toast.success('Profile updated')
       setOnboardingCompleted(true)
       fetchUser(user?.token || "")
     } catch (error:any) {
      toast.error(error.message)
     }
      
    }
  }

  return (
    <>
      <Toaster />
      <div className="onboarding-container bg-purple-50 dark:bg-purple-900 min-h-screen">
        {/* Header */}
        <div className="p-6 pt-12 onboarding-wrapper">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-purple-500 dark:text-purple-200" />
            </div>
            <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">SyncFit</h1>
          </div>
          <p className="text-purple-500 dark:text-purple-200 mt-4">
            Let's personalize your experience
          </p>
        </div>

        {/* Progress */}
        <div className="px-6 mb-8 onboarding-wrapper">
          <div className="flex gap-2 max-w-2xl">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step
                    ? "bg-purple-500"
                    : "bg-purple-200 dark:bg-purple-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-purple-500 dark:text-purple-200 mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Form Content */}
        <div className="flex-1 px-6 onboarding-wrapper">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-purple-100/50  dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 flex items-center justify-center">
                  <User className="size-6 text-purple-500 dark:text-purple-200" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    Enter your age
                  </h2>
                  <p className="text-purple-500 dark:text-purple-200">
                    This helps us calculate your needs
                  </p>
                </div>
              </div>
              <Input
                label="Age"
                type="number"
                className="max-w-2xl"
                value={formData.age}
                onChange={(v) => updateField("age", v)}
                placeholder="Enter your age"
                min={13}
                max={120}
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-purple-100/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 flex items-center justify-center">
                  <ScaleIcon className="size-6 text-purple-500 dark:text-purple-200" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    Your measurements
                  </h2>
                  <p className="text-purple-500 dark:text-purple-200">
                    This helps us track your progress
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 max-w-2xl">
                <Input
                  label="Weight(kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(v) => updateField("weight", v)}
                  placeholder="Enter your weight"
                  min={15}
                  max={200}
                  required
                />
                <Input
                  label="Height(cm)"
                  type="number"
                  value={formData.height}
                  onChange={(v) => updateField("height", v)}
                  placeholder="Enter your height"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-purple-100/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 flex items-center justify-center">
                  <Target className="size-6 text-purple-500 dark:text-purple-200" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    What's your goal?
                  </h2>
                  <p className="text-purple-500 dark:text-purple-200">
                    We'll tailor your experience
                  </p>
                </div>
              </div>
              {/* option */}
            <div className="space-y-4 max-w-lg">{
                goalOptions.map((option)=>(        
                    <button 
                    key={option.value}
                    onClick={()=>{
                        const age=Number(formData.age);
                        const range=ageRanges.find((r)=>age <= r.max) || ageRanges[ageRanges.length-1]
                        let intake =range.maintain;
                        let burn=range.burn;
                        if(option.value ==='lose'){
                            intake-=400;
                            burn+=100;
                        }else if(option.value ==='gain'){
                            intake+=500;
                            burn-=100;
                        }
                        setFormData({...formData,goal: option.value as 'lose' | 'maintain' | 'gain',
                         dailyCalorieIntake: intake   ,
                         dailyCalorieBurn:burn,
                        })

                    }}
                    className={`onboarding-option-btn ${formData.goal === option.value && 'ring-2 ring-purple-500'}`}>
                        <span className="text-base text-slate-700 dark:text-slate-200">{option.label}</span>
                    </button>
                ))
                }

            </div>



<div className="border-t border-purple-200 dark:border-purple-700 my-6-max-w-lg"></div>

<div className="space-y-8 max-w-lg">
   <h3 className="text-md font-medium text-purple-800 dark:text-white mb-4">Daily Targets</h3> 
   <div className="space-y-6"><Slider label="Daily Calories Intake" min={100} max={4000} step={50} value={formData.dailyCalorieIntake} onChange={(v)=>updateField('dailyCalorieIntake',v)} unit="kcal"/>
    <Slider label="Daily Calories Burn" min={100} max={2000} step={50} value={formData.dailyCalorieBurn} onChange={(v)=>updateField('dailyCalorieBurn',v)} unit="kcal"/>
   </div>

</div>






            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 pb-10 onboarding-wrapper flex gap-4">
          {step > 1 && (
            <Button
              variant="secondary"
              onClick={() => setStep(step>1? step-1:1)}
              className="max-lg:flex-1 lg:px-10 bg-purple-200 dark:bg-purple-700 hover:bg-purple-300 dark:hover:bg-purple-600 text-purple-900 dark:text-purple-100"
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back
              </span>
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="max-lg:flex-1 lg:px-10 bg-purple-400 dark:bg-purple-600 hover:bg-purple-300 dark:hover:bg-purple-500 text-white"
          >
            <span className="flex items-center justify-center gap-2">
              {step === totalSteps ? "Get Started" : "Continue"}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </div>
      </div>
    </>
  )
}

export default Onboarding 
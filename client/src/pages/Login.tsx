import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/Appcontext"
import React from "react"
import { Toaster } from "react-hot-toast"
const Login = () => {
    const [state,setState]=useState('login')
     const [username,setUsername]=useState('')
     const [email,setEmail]=useState('')
         const [password,setPassword]=useState('')
          const [showPassword,setShowPassword]=useState(false)
    const [isSubmitting,setIsSubmitting]=useState(false)
     
    const navigate=useNavigate()
    const {login,signup,user}=useAppContext()
    const handleSubmit=async(e: React.FormEvent)=>{
e.preventDefault()
setIsSubmitting(true)
if(state==='login'){
    await login({email,password})
}else{
    await signup({username,email,password})
}
setIsSubmitting(false)
    }

useEffect(()=>{
    if(user){
    navigate('/')    
    }
},[user,navigate])

  return (
   <>
   <Toaster/>
   <main className="login-page-container">
    <form onSubmit={handleSubmit} className="login-form">
        <h2 className="text-3xl font-medium text-purple-900 dark:text-purple-100">
        {state === 'login'?"Sign in": "Sign up"}</h2>
        <p className="text-sm mt-2 text-purple-500/90 dark:text-purple-300">{state==='login'?'Enter your email and password.':'Enter your details to create an account.' }</p>
        {/* user */}
        {state != 'login' && (
            <div className="mt-4">
               <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
    Username
  </label>
          <div className="relative mt-2">
    <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 size-4" />
          <input onChange={(e)=>setUsername(e.target.value)} value={username}
      type="text"
      placeholder="enter a username"
      className="login-input" required
    />
  </div>

</div>
        )}


 <div className="mt-4">
               <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
  Email
  </label>
          <div className="relative mt-2">
    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 size-4" />
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
      type="email"
      placeholder="enter a Email"
      className="login-input" required
    />
  </div>
  
</div>

{/* pass */}
<div className="mt-4">
              <label className="text-sm font-medium text-purple-700 dark:text-purple-300">
  Password
  </label>
          <div className="relative mt-2">
    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 size-4" />
          <input onChange={(e)=>setPassword(e.target.value)} value={password}
      placeholder="enter your Password"
      className="login-input pr-10" required
      type={showPassword?'text':'password'}
    />
    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
     onClick={() => setShowPassword((p)=>!p)}>
      {showPassword ?<EyeOffIcon size={16}/>:<EyeIcon size={16}/>}  
    </button>
  </div>
  
</div>

<button type="submit" disabled={isSubmitting} className="login-button">
    {isSubmitting?"Signing in....":state==="login"?'Login':'Sign up'}

</button>
{state==='login' ?(<p className="text-center py-6 text-sm text-purple-500 dark:text-purple-300">Don't have an account?<button onClick={()=>setState('sign-up')} className="ml-1 cursor-pointer text-purple-500 hover:text-purple-600 underline">Sign Up</button></p>):
(<p  className="text-center py-6 text-sm text-purple-500 dark:text-purple-300">Already have an account?<button onClick={()=>setState('login')}  className="ml-1 cursor-pointer text-purple-500 hover:text-purple-600 underline">Login</button></p>)}
        </form>
    </main></>
  )
}

export default Login

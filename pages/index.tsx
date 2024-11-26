import React, { useEffect, useState } from "react";
import Image from "next/image";
import {useRouter} from 'next/router'
import { useAuth } from "../context/AuthContext";
import '../styles/Home.module.css'
import { motion } from "framer-motion";


export default function WelcomePage() {



  const {user,profileFirstName,popUpLogin,logout} = useAuth()
  const [header,setHeader] = useState<string>('')
  const siteName = "JLB Investments"
  const [index,setIndex] = useState(0)
  const [blinkText,setBlinkText] = useState('')
  const [visible, setVisible] = useState(false)
  const [welcomeState,setWelcomeState] = useState("Unwelcome")
  const [userState,setUserState] = useState('')
  const router = useRouter()
  

  //console.log('user',user?.photoURL)

  const configureUserPhoto = () => {
    let updatedPhoto = ''
    if(user){
      updatedPhoto = user.photoURL!.slice(0,-4)
      updatedPhoto+="512-c"
    }

    return updatedPhoto
  }

  const userStatusCheck = () => {
    if(user){
      setUserState('User')
    }else{
      setUserState('No User')
    }
  }

  useEffect(() => {
    const typeLetters = ()=> {
      //console.log('index',index)
      if (index<siteName.length){
        //console.log('siteName[index]',siteName[index])
        setIndex(index=>index+1)
        setHeader(header=>header+siteName[index])
      }else{
        clearInterval(typingInterval)
        setBlinkText('.')
        setVisible(true)
        userStatusCheck()
      }

      clearInterval(typingInterval)
    }
    
    const typingInterval = setInterval(typeLetters,100)

  }, [header]);

  useEffect(()=>{
    userStatusCheck()
  },[user])


  useEffect(()=> {
    const visibilityCheck = () => {
      setVisible(visible=>!visible)
      clearInterval(visibilityInterval)
    }

    const visibilityInterval = setInterval(visibilityCheck,500)

  },[visible])






  //adjust to a useEffect to set the interval then show welcome then redirect
  const welcomeMessage = async () => {
    setWelcomeState("Welcome")
    await new Promise((welcomeStateWait) => setTimeout(welcomeStateWait,1000))
    setWelcomeState("Leaving")
    setTimeout(()=>{
      router.push("/testPage")
    },200)
  }

  //need to change user state to user's name in auth context
  const userDomConfig = (userPhoto: string) => {

    //if the header isn't done typing or we are redirecting it's nothing
    if(header!==siteName || welcomeState=='Welcome' || welcomeState=='Leaving'){
      return
    }
    //if the user doesn't exist pass login and default else user info and login/dashboard
    if(!user){
      return(
        <div className="pt-5 flex-grow flex items-top justify-center">
          <Image className="rounded-full" src='/default-user.png' alt="Default User Image" width={256} height={256}/>
          <div className="flex space-x-4 pt-5 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="px-6 py-3 w-15 text-center bg-green-500 text-white rounded shadow hover:bg-green-600"
              onClick={popUpLogin}
            >
                Sign In
            </motion.button>
          </div>
        </div>
      ); 
    }else{
      return (
        <div className="pt-5 flex-grow flex items-top justify-center">
          <Image className="rounded-full" src={userPhoto} alt="Default User Image" width={256} height={256}/>
          <div className="flex space-x-4 pt-5 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="px-6 py-3 w-15 text-center bg-green-500 text-white rounded shadow hover:bg-green-600"
              onClick={welcomeMessage}
            >
                Proceed to Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="px-6 py-3 w-15 text-center bg-red-500 text-white rounded shadow hover:bg-red-600"
              onClick={logout}
            >
                Sign Out
            </motion.button>
          </div>
        </div>
      );
  
    }
  }

  const headerConfig = () => {
    if(welcomeState=='Welcome'){
      return(
      <span className="pt-32 text-center text-5xl">Welcome {profileFirstName}</span>
    ) 
      
    }else if(welcomeState=='Unwelcome'){
      return(
        <div className="pt-32 text-center text-5xl">
          <span>{header}</span>
          <span style={{visibility: visible? 'visible' : 'hidden'}}>{blinkText}</span>
        </div>   
      )
    }else{
      return
    }
  }

  return (
    <motion.div
      className="flex flex-col h-screen w-screen items-center justify-center"
      key={welcomeState} // Unique key for each text state
      initial={{ opacity: 0 }} // Fade-in starting state
      animate={{ opacity: 1 }} // Fade-in final state
      exit={{ opacity: 0 }} // Fade-out final state
      transition={{ duration: 0.5 }}
      >{headerConfig()}

        <motion.div
      className="flex flex-col h-screen w-screen items-center justify-center"
      key={userState} // Unique key for each text state
      initial={{ opacity: 0 }} // Fade-in starting state
      animate={{ opacity: 1 }} // Fade-in final state
      exit={{ opacity: 0 }} // Fade-out final state
      transition={{ duration: 0.5 }}
      >
        {userDomConfig(configureUserPhoto())}

      </motion.div>
    </motion.div>
  )

  


};

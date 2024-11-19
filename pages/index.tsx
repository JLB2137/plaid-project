import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useAuth } from "../context/AuthContext";
import '../styles/Home.module.css'
import { motion } from "framer-motion";


export default function Link() {



  const {user,popUpLogin,logout} = useAuth()
  const [photo,setPhoto] = useState("")
  const [header,setHeader] = useState<string | undefined>("")
  const [index,setIndex] = useState(0)
  const [blinkText,setBlinkText] = useState('')
  const [visible, setVisible] = useState(false)
  const siteName = "JLB Investments"
  const [dom,setDom] = useState<React.JSX.Element>()
  const [welcomeState,setWelcomeState] = useState("")

  

  

  console.log('user',user?.photoURL)
  //https://lh3.googleusercontent.com/a/ACg8ocJFnWkE5hhmgyR1-e7yK6L3j1cClfMJtBd9ZrULCmdsqCxWF-Y=s96-c

  

  useEffect(()=>{
    const welcome = () => {
      if(welcomeState){
  
        return(
          <span>Welcome</span>
        )
          
  
      }else{
        setWelcomeState("Welcome")
        return (
          <div>
            <Image className="rounded-full" src={photo} alt="Default User Image" width={256} height={256}/>
            <div className="flex space-x-4 pt-5 justify-center">
              <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="px-6 py-3 w-15 text-center bg-green-500 text-white rounded shadow hover:bg-green-600"
                  onClick={popUpLogin}
                >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="px-6 py-3 bg-red-500 w-15 text-center text-white rounded shadow hover:bg-red-600"
                onClick={logout}
                >
                Sign Out
              </motion.button>
            </div>
          </div>
        )
      }
    
    }

    if(user){
      let userPhoto = user.photoURL!.slice(0,-4)
      userPhoto+="512-c"
      setPhoto(userPhoto)
      console.log('userPhoto',userPhoto)
    }
    //check if the header is fully rendered then bring in if so on user change
    if(header==siteName){
      setDom(UserFadeIn())
      setTimeout(UserFadeIn,5000)
    }

  },[photo,user])

  useEffect(()=> {
    const visibilityCheck = () => {
      if(visible){
        setVisible(false)
      }else{
        setVisible(true)
      }
      clearInterval(visibilityInterval)
    }

    const visibilityInterval = setInterval(visibilityCheck,500)


  },[visible])


  useEffect(() => {
    console.log(siteName)
    const typeLetters = ()=> {
      console.log('index',index)
      if (index<siteName.length){
        console.log('siteName[index]',siteName[index])
        setIndex(index=>index+1)
        setHeader(header=>header+siteName[index])
      }else{
        clearInterval(typingInterval)
        setDom(UserFadeIn())
        setBlinkText('.')
        setVisible(true)
      }

   
    }
    
    const typingInterval = setInterval(typeLetters,100)
    return  () => {
      clearInterval(typingInterval)
    }

  }, [header]);

  const UserFadeIn = () => {
    if(!user){
      return (
        <div>
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
          <motion.div
            key={welcomeState} // Unique key for each text state
            initial={{ opacity: 0 }} // Fade-in starting state
            animate={{ opacity: 1 }} // Fade-in final state
            exit={{ opacity: 0 }} // Fade-out final state
            transition={{ duration: 0.5 }}
            >
              {welcome()}

          </motion.div>
      );
  
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">
      <div className="pt-32 text-center text-5xl">
        <span>{header}</span>
        <span style={{visibility: visible? 'visible' : 'hidden'}}>{blinkText}</span>
      </div>
      <div className="pt-5 flex-grow flex items-top justify-center">
      {dom}
      </div>
    
    </div>
  )

  


};

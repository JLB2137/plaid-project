import React, { useEffect, useState } from "react";
import {useRouter} from 'next/router'
import { useAuth } from "../context/AuthContext";
import '../styles/Home.module.css'
import LoginHeader from "../components/clientLoginHeader";
import configureUserPhoto from "../lib/front-end/photoConfig";
import UserAccountComponent from "../components/userAccountComponent";


export default function SignIn() {



  const {user,profileFirstName,popUpLogin,logout} = useAuth()
  const [header,setHeader] = useState<string>('')
  const [index,setIndex] = useState(0)
  const [blinkText,setBlinkText] = useState('')
  const [visible, setVisible] = useState(false)
  const [welcomeState,setWelcomeState] = useState("Unwelcome")

  const siteName = "JLB Investments"
  const router = useRouter()
  

  //console.log('user',user?.photoURL)


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
      }

      clearInterval(typingInterval)
    }
    
    const typingInterval = setInterval(typeLetters,100)

  }, [header]);

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



  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center">

        <LoginHeader welcomeState={welcomeState} profileFirstName={profileFirstName} header={header} visible={visible} blinkText={blinkText}/>


        <UserAccountComponent blinkText={blinkText} welcomeState={welcomeState} userPhoto={configureUserPhoto(user)} popUpLogin={popUpLogin} welcomeMessage={welcomeMessage} logout={logout} user={user}/>

      </div>
  )

  


};

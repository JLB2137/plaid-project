import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useAuth } from "../context/AuthContext";
import '../styles/Home.module.css'


export default function Link() {

  const {user,popUpLogin,logout} = useAuth()
  const [photo,setPhoto] = useState("")
  const [header,setHeader] = useState<string | undefined>("")
  const [index,setIndex] = useState(0)
  const siteName = "JLB Investments"
  const [dom,setDom] = useState(        
  <div>
    <h1>{header}</h1>
  </div>
  )

  

  

  console.log('user',user?.photoURL)
  //https://lh3.googleusercontent.com/a/ACg8ocJFnWkE5hhmgyR1-e7yK6L3j1cClfMJtBd9ZrULCmdsqCxWF-Y=s96-c
  useEffect(()=>{
    if(user){
      let userPhoto = user.photoURL!.slice(0,-4)
      userPhoto+="512-c"
      setPhoto(userPhoto)
      console.log('userPhoto',userPhoto)
    }
  },[user])

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
        setDom(<div>{UserFadeIn()}</div>)
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
          <h1>{header}</h1>
          <Image className="rounded-full" src='/default-user.png' alt="Default User Image" width={256} height={256}/>
          <button onClick={popUpLogin} disabled={user !== null}>
            Sign In
          </button>
        </div>
      );
  
    }else{
      return (
        <div>
          <h1>{header}</h1>
          <Image className="rounded-full" src={photo} alt="Default User Image" width={256} height={256}/>
          <button onClick={popUpLogin} disabled={user !== null}>
            Sign In
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      );
  
    }
  }

  return (
    <div>
      {dom}
    </div>
  )

  


};

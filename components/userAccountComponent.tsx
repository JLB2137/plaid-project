import {motion} from 'framer-motion'
import Image from 'next/image'
const UserAccountComponent = ({blinkText, welcomeState, userPhoto, popUpLogin, welcomeMessage, logout, user}) => {

    let imageSetup
    let buttonSetup
    //if the header isn't done typing or we are redirecting it's nothing
    if(blinkText == '' || welcomeState !=='Unwelcome'){
        
    }else if(!user){
    //if the user doesn't exist pass login and default else user info and login/dashboardif(!user){
        imageSetup = 
        <div className='flex justify-center'>
            <Image className="rounded-full" src={userPhoto} alt="Default User Image" width={256} height={256}/>
        </div>
        buttonSetup = 
            <div className="flex space-x-4 pt-5 justify-center">
                <motion.button
                whileHover={{ scale: 1.1 }}
                className="px-6 py-3 w-15 text-center bg-green text-white rounded shadow hover:bg-green"
                onClick={popUpLogin}
                >
                    Sign In
                </motion.button>
            </div>

    }else{
        imageSetup = 
            <div className='flex justify-center'>
                <Image className="rounded-full" src={userPhoto} alt="Default User Image" width={256} height={256}/>
            </div>

        buttonSetup = 
        
            <div className="flex space-x-4 pt-5 justify-center">
                <motion.button
                whileHover={{ scale: 1.1 }}
                className="px-6 py-3 w-15 text-center bg-green text-white rounded shadow hover:bg-green"
                onClick={welcomeMessage}
                >
                    Proceed to Dashboard
                </motion.button>
                <motion.button
                whileHover={{ scale: 1.1 }}
                className="px-6 py-3 w-15 text-center bg-red text-white rounded shadow hover:bg-red"
                onClick={logout}
                >
                    Sign Out
                </motion.button>
            </div>
  
    }

    return(        
        <motion.div
            className="flex flex-col h-full w-full"
            key={user} // Unique key for each text state
            initial={{ opacity: 0 }} // Fade-in starting state
            animate={{ opacity: 1 }} // Fade-in final state
            exit={{ opacity: 0 }} // Fade-out final state
            transition={{ duration: 0.5 }}
            >

            <div className="flex-col justify-center">
                {imageSetup}
                {buttonSetup}
            </div>
        </motion.div>
    )
}

export default UserAccountComponent

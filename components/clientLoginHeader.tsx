import {motion} from 'framer-motion'

const LoginHeader = ({welcomeState, profileFirstName,header, visible,blinkText}) => {

    let currentHeader = <div></div>

    if(welcomeState=='Welcome'){
            currentHeader = <span className="text-center text-5xl">Welcome {profileFirstName}</span>
        
    }else if(welcomeState=='Unwelcome'){
        currentHeader = 
        <div className="text-center text-5xl">
            <span>{header}</span>
            <span style={{visibility: visible? 'visible' : 'hidden'}}>{blinkText}</span>
        </div>   
    }

    return(    
        
        <motion.div
            className="flex flex-col py-16 w-screen justify-center"
            key={welcomeState} // Unique key for each text state
            initial={{ opacity: 0 }} // Fade-in starting state
            animate={{ opacity: 1 }} // Fade-in final state
            exit={{ opacity: 0 }} // Fade-out final state
            transition={{ duration: 0.5 }}
            >
                {currentHeader}
        </motion.div>
    )
}

export default LoginHeader


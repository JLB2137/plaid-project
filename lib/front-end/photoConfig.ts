const configureUserPhoto = (user) => {
    let updatedPhoto = '/default-user.png'
    if(user){
      updatedPhoto = user.photoURL!.slice(0,-4)
      updatedPhoto+="512-c"
    }

    return updatedPhoto
}

export default configureUserPhoto

const newAccountLink = (ready: boolean) => {

    if(!ready){
        <button onClick={() => createLinkTokenV2()} disabled={!user}>
            {`${signInStatus}`}
        </button>
    }


}
import { useState,useEffect, useRef } from 'react'
import viteLogo from '/vite.svg'
import Message from './Components/Message'
import {onAuthStateChanged, signOut ,getAuth ,GoogleAuthProvider,signInWithPopup} from "firebase/auth"
import {app} from './firebase'
import {getFirestore,
  query,
  orderBy,
  onSnapshot, addDoc,collection,serverTimestamp} from 'firebase/firestore'
import {Box,Container,Input,VStack, HStack, Button} from "@chakra-ui/react"
function App() {

  const auth=getAuth(app)
  const db=getFirestore(app)
  const q=query(collection(db,"Messages"),orderBy("createdAt","asc"))
const divforscroll=useRef(null)

  const loginHandler=()=>{
  const provider=new GoogleAuthProvider()
  signInWithPopup(auth,provider)
  }



const logoutHandler=()=> signOut(auth)
const [user,setUser]=useState(false);
const [message,setMessage]=useState("");
const [messages,setMessages]=useState([]);


const submitHandler= async (e)=>{
  e.preventDefault();

  try {
     setMessage("");
    
    await addDoc(collection(db,"Messages"),{
      text:message,
      uid: user.uid,
      uri:user.photoURL,
      createdAt:serverTimestamp()
    });
   
    divforscroll.current.scrollIntoView({behavior:"smooth"})
    
  } catch (error) {
    alert(error)
    
  }
}



useEffect(()=>{
const unsubscribe= onAuthStateChanged(auth,(data)=>{
  setUser(data);
});

const unsubscribeformessage= onSnapshot(q,(snap)=>{
  setMessages(
    snap.docs.map((item)=>{
    const id=item.id;
    return{id, ...item.data()}
  }))
 })

return ()=>{
  unsubscribe(); 
  unsubscribeformessage(); 
}
 
  },[])



return <Box bg={"red.100"} >
    {
      user?(
        <Container h={"100vh"} bg={"white"} >

      <VStack padding={"4"} h={"full"}  >
        <Button onClick={logoutHandler} colorScheme='red' w={"full"} >
          Logout
          </Button>

          <VStack overflowY={"auto"} h="full" w={"full"} bg={"purple.100"} css={{"&::-webkit-scrollbar":{
            display:"none"
          }}} >

          {
            messages.map(item=>(
              <Message 
              key={item.id}
              user={item.uid==user.uid?"me":"other"}
              text={item.text} uri={item.uri} uid={item.uid} />
            ))
          }
          <div ref={divforscroll}></div>
            </VStack>

            
          <form onSubmit={submitHandler} style={{ width:"100%"}} >
            <HStack>
               <Input value={message} onChange={(e)=> setMessage(e.target.value)} placeholder='Enter a message...' />
            <Button  marginRight={"4"} colorScheme="purple" type='submit' >Send</Button>
            </HStack>
            </form>
      </VStack>

    </Container>
      ): <VStack h="100vh" justifyContent={"center"} >
        <Button onClick={loginHandler} colorScheme='purple' >Signup</Button>
      </VStack>
    }
  </Box>
  
}

export default App;

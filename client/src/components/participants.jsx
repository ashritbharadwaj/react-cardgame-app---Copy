import {React,useEffect, useMemo, useState} from 'react';
import {io} from "socket.io-client";
import {Alert, AlertTitle, Button, Container, Stack, TextField, Typography} from "@mui/material"
import { useNavigate } from 'react-router-dom';
import { useSocket, useUsername, useRoomname, useBoxes } from './SocketContext';
import CardDistribution_P from './cardDistribution_P';

const Participants = () =>{
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [Uname, setUname] = useState("");
  // const [isPresent, setIsPresent] = useState(-1);
  const [isPresent, setIsPresent] = useState(-1);

  const socket = useSocket();
  const username = useUsername(); 
  const roomname = useRoomname();
  const boxes = useBoxes();

  useEffect(()=>{
    socket.on('setIsPresent',(num)=>{
      setIsPresent(num);
    })
    console.log(username.Username,"----");
  },[username.Username])

  const handleCheck = (e) => {
    e.preventDefault();
    socket.emit('check-room', roomName, (response) => {
      setIsPresent(response);
      console.log(response);
      {(response) && handleJoin();}
    });
  }

  const handleJoin = (e) => {
    //  e.preventDefault();
    username.setUsername(Uname);
    console.log(username.Username);
    roomname.setRoomname(roomName);
    setUname("");
    socket.emit("join-room", roomName);
    // boxes.setBoxes((prevBoxes) => ({
    //   ...prevBoxes,
    //   [socket.id]: [],
    // }));
     // setRoomName("");
  }

  return(
    <div>
    {(isPresent!=1) && <div>
    <div>Participants</div>
    <center>
    <Button variant="contained" color="primary" onClick={() => {
              navigate('/host');
            }}>Become Host</Button>
    <br/>
    <br/>
    <br/>
    <br/>
    <form>
       <TextField value={Uname} onChange={(e)=>{setUname(e.target.value); setIsPresent(-1)}}
       id="outlined-basic" label="Username" variant="outlined"/>
       <br/>
       <br/>
       <TextField value={roomName} onChange={(e)=>{setRoomName(e.target.value); setIsPresent(-1)}}
       id="outlined-basic" label="Room Name" variant="outlined"/>
       <br/>
       <Button onClick={handleCheck} variant="contained" color="primary" sx={{marginTop:'1%'}}>Join</Button>
       <br/>
       {(!isPresent) && <Alert variant='standard' severity='error' sx={{display: 'inline-block', marginTop:'1%'}}>
        {roomName} Not Present
       </Alert>}
     </form>
    </center>
    </div>}

    {(isPresent==1) && <CardDistribution_P/>}
    </div>
  )
}

export default Participants;




// const Participants = () => {
//   const [message, setMessage] = useState("");
//   const [room, setRoom] = useState("");
//   const [socketID, setSocketID] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [roomName, setRoomName] = useState("");

//   const socket = useMemo( ()=> io("http://localhost:3000/"),[]);

//   const handleJoin = (e) => {
//     e.preventDefault();
//     socket.emit("join-room", roomName);
//     // setRoomName("");
//   }

//   const handleCreate = (e) => {
//     e.preventDefault();
//     socket.emit("create-room", roomName);
//     // setRoomName("");
//   }

//   const handleSubmit = (e) =>{
//     e.preventDefault();
//     socket.emit("message", {message,room})
//     setMessage("")
//     setRoom("");
//   };
  
//   useEffect(()=>{
//     socket.on("connect",()=>{
//       console.log("Connected ID:",socket.id);
//       setSocketID(socket.id);
//     })

//     socket.on("Welcome",(s)=>{
//       console.log(s);
//     })

//     socket.on("recieve-message",(s)=>{
//       console.log(s);
//       setMessages((messages)=>[...messages,s])
//     })

//     return ()=>{
//       socket.disconnect();
//     }
//   },[])

//   // return <Container maxWidth="sm">
//   //   <Typography variant='h6' component="div" gutterBottom>
//   //     Welcome to Socket.io {(roomName==="") ? socketID:roomName}
//   //   </Typography>
//   //   <form onSubmit={handleJoin}>
//   //     <TextField value={roomName} onChange={(e)=>setRoomName(e.target.value)}
//   //     id="outlined-basic" label="Room Name" varient="outlined"/>
//   //     <Button type="submit" varient="contained" color="primary">Join</Button>
//   //   </form>
//   //   <form onSubmit={handleSubmit}>
//   //     <TextField value={message} onChange={(e)=>setMessage(e.target.value)}
//   //     id="outlined-basic" label="Message" varient="outlined"/>
//   //     <TextField value={room} onChange={(e)=>setRoom(e.target.value)}
//   //     id="outlined-basic" label="Room" varient="outlined"/>
//   //     <Button type="submit" varient="contained" color="primary">Send</Button>
//   //   </form>

//   //   <Stack>
//   //     {messages.map((m,i)=>{
//   //       return <Typography key={i} varient="h6" component="div" gutterBottom>{m}</Typography>
//   //     })}
//   //   </Stack>

//   // </Container>

//   return <Container>
//     <center>
//     <Typography variant='h2' component="div" gutterBottom>
//       Welcome to Card Distributing App
//     </Typography>
//     <br/>
//     <form>
//       <TextField value={roomName} onChange={(e)=>setRoomName(e.target.value)}
//       id="outlined-basic" label="Room Name" variant="outlined"/>
//       <Button onClick={handleJoin} variant="contained" color="primary">Create</Button>
//     </form>
//     <br/>
//     <form>
//       <TextField value={roomName} onChange={(e)=>setRoomName(e.target.value)}
//       id="outlined-basic" label="Room Name" variant="outlined"/>
//       <Button onClick={handleJoin} variant="contained" color="primary">Join</Button>
//     </form>
//     </center>
//   </Container>
// }

// export default Participants


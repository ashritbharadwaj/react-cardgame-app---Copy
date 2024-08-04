import {React,useEffect, useMemo, useState} from 'react';
import {io} from "socket.io-client";
import {Alert, AlertTitle, Button, Container, Stack, TextField, Typography} from "@mui/material"
import { useNavigate } from 'react-router-dom';
import { useSocket, useUsername, useRoomname, useBoxes } from './SocketContext';
import CardDistribution_H from './cardDistribution_H';

const Host = () =>{
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState("");
    const [Uname, setUname] = useState("");
    const [isPresent, setIsPresent] = useState(-1);
    const [numbers, setNumbers] = useState([]);
  
    const socket = useSocket();
    const username = useUsername();
    const roomname = useRoomname();
    const boxes = useBoxes();
    
  
    const handleCheck = (e) => {
      e.preventDefault();
      socket.emit('check-room', roomName, (response) => {
        setIsPresent(response);
        console.log(response);
        {(!response) && handleJoin();}
      });
    }
  
    const handleJoin = (e) => {
      // e.preventDefault();
      username.setUsername(Uname);
      roomname.setRoomname(roomName);
      console.log(username.Username,":",Uname)
      setUname("");
      socket.emit("join-room", roomName);
      // boxes.setBoxes((prevBoxes) => ({
      //   ...prevBoxes,
      //   'socket.id': [],
      // }));
       // setRoomName("");
    }
    
    useEffect(()=>{
      socket.on("connect",()=>{
        console.log(socket.id);
      })

      socket.on('setIsPresent',(num)=>{
        setIsPresent(num);
      })

    },[])

    return(
      <div>
      {(isPresent!=0) && <div>
      <div>Host</div>
      <center>
      <form>
        <TextField value={Uname} onChange={(e)=>{setUname(e.target.value); setIsPresent(-1)}}
        id="outlined-basic" label="Username" variant="outlined"/>
        <br/>
        <br/>
         <TextField value={roomName} onChange={(e)=>{setRoomName(e.target.value); setIsPresent(-1)}}
         id="outlined-basic" label="Room Name" variant="outlined"/>
         <br/>
         <Button onClick={handleCheck} variant="contained" color="primary" sx={{marginTop:'1%'}}>Create</Button>
         <br/>
         {(isPresent==1) && <Alert variant='standard' severity='error' sx={{display: 'inline-block', marginTop:'1%'}}>
          {roomName} Already Present</Alert>}
       </form>
      </center>
      </div>}
      
      {(isPresent==0) && <CardDistribution_H/>}
      </div>
    )
  }
  
  export default Host;
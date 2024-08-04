import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [localIp, setLocaIp] = useState();

  // const fetchIP = async () =>{
  //   try{
  //     // const response = await fetch('https://api.ipify.org?format=json');
  //     const response = await fetch('https://api.ipify.org');
  //     const data = await response.text();
  //     setLocaIp(data);
  //   }catch(error){
  //     console.log('Failed to fetch IP:',error);
  //   }
  // }

  // useEffect(()=>{
  //   fetchIP();
  // },[])
  
  // console.log(`http://${localIp}:3000/`)
  // const socket = useMemo(() => io("http://192.168.1.14:3000/"), []);
  const socket = useMemo(() => io("http://localhost:3000/"), []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

const UsernameContext = createContext();

export const UsernameProvider = ({ children }) => {
  const [Username, setUsername] = useState('xyz');

  return (
    <UsernameContext.Provider value={{ Username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = () => {
  return useContext(UsernameContext);
};

const RoomnameContext = createContext();

export const RoomnameProvider = ({ children }) => {
  const [Roomname, setRoomname] = useState('');

  return (
    <RoomnameContext.Provider value={{ Roomname, setRoomname }}>
      {children}
    </RoomnameContext.Provider>
  );
};

export const useRoomname = () => {
  return useContext(RoomnameContext);
};

const BoxContext = createContext();

export const BoxProvider = ({ children }) => {
  const [boxes, setBoxes] = useState({'0':[]});

  return (
    <BoxContext.Provider value={{ boxes, setBoxes }}>
      {children}
    </BoxContext.Provider>
  );
};

export const useBoxes = () => {
  return useContext(BoxContext);
};
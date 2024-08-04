import React, { useState, useEffect } from "react";
import {Alert, AlertTitle, Box, Button, Container, Stack, TextField, Typography} from "@mui/material"
import { useSocket, useUsername, useRoomname } from './SocketContext';
import { images } from "./cardIndex";
import board from "../assets/CardsImages/Board.png";
import {ProfileImages} from "./profileIndex";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableBox from "./droppableBox";


const CardDistribution_P =()=> {

    const socket = useSocket();
    const username = useUsername();
    const roomname = useRoomname();
    const [numbers, setNumbers] = useState([]);
    const [mappedimgs, setMappedimgs] = useState([]);
    const [roomSockets,setRoomSockets] = useState([]);
    const [splittedRoomSockets,setSplittedRoomSockets] = useState([[],[]])
    const [publicCards,setPublicCards] = useState([]);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const LeaveRoom = () =>{
        socket.emit('leave-room', roomname.Roomname);
        socket.emit('isPresent',-1)
    }

    const Temp = () =>{
        socket.emit('getSocketIndex', roomname.Roomname, (index) => {            if (index !== -1) {console.log(`Socket index in room: ${index}`);
            } else {console.log('Socket is not in the room or room does not exist.');}});
        // console.log(boxes)
    }

    const handleDropItem = async (itemIndex, targetBoxIndex, sourceBoxIndex) => {
        // setBoxes((prevBoxes) => {
        //   const updatedBoxes = [...prevBoxes];
        //   const [movedItem] = updatedBoxes[sourceBoxIndex].splice(itemIndex, 1);
        //   updatedBoxes[targetBoxIndex].push(movedItem);
        //   return updatedBoxes;
        // });
        let movedItem = null;
        if(sourceBoxIndex===0){
            setMappedimgs((previmgs)=>{
                const updatedimgs = [...previmgs];
                movedItem = updatedimgs.splice(itemIndex,1);
                return updatedimgs;
            })
        }
        if(sourceBoxIndex===1){
            setPublicCards((previmgs)=>{
                const updatedimgs = [...previmgs];
                movedItem = updatedimgs.splice(itemIndex,1);
                socket.emit('updatePublicCards',roomname.Roomname,updatedimgs);
                console.log("source:",movedItem);
                return updatedimgs;
            })
        }
        // if(sourceBoxIndex>1){
            
        // }

        await delay(50);

        if(targetBoxIndex===0 && movedItem){
            setMappedimgs((previmgs)=>{
                const updatedimgs = [...previmgs]
                console.log("dest:",movedItem);
                updatedimgs.push(movedItem)
                return updatedimgs;
            })
        }
        if(targetBoxIndex===1){
            setPublicCards((previmgs)=>{
                const updatedimgs = [...previmgs]
                updatedimgs.push(movedItem)
                socket.emit('updatePublicCards',roomname.Roomname,updatedimgs);
                return updatedimgs;
            })
        }
        // if(targetBoxIndex>1){

        // }
    };

    const updatedBoxItems = (boxIndex, updatedIndices) => {
        if(boxIndex===0){
            setMappedimgs((previmgs)=>{
                const updatedimgs = [...previmgs];
                const [movedItem] = updatedimgs.splice(updatedIndices.fromIndex,1);
                updatedimgs.splice(updatedIndices.toIndex, 0, movedItem);
                return updatedimgs;
            })
        }
        if(boxIndex===1){
            setPublicCards((previmgs)=>{
                const updatedimgs = [...previmgs];
                const [movedItem] = updatedimgs.splice(updatedIndices.fromIndex,1);
                updatedimgs.splice(updatedIndices.toIndex, 0, movedItem);
                socket.emit('updatePublicCards',roomname.Roomname,updatedimgs);
                return updatedimgs;
            })
        }
    };

    const splitCircularList = (list, index) => {
        const n = list.length;
        const half = Math.floor(n / 2);
    
        // Items before the index
        let beforeIndex = [];
        for (let i = 0; i < half; i++) {
          beforeIndex.push(list[(index - i - 1 + n) % n]);
        }
        beforeIndex.reverse(); // Maintain the order as before the index
    
        // Items after the index
        let afterIndex = [];
        for (let i = 1; i <= half; i++) {
          afterIndex.push(list[(index + i) % n]);
        }
        afterIndex.reverse();
        afterIndex = afterIndex.filter(item => !beforeIndex.includes(item));

        console.log(index,beforeIndex,afterIndex)
        setSplittedRoomSockets([beforeIndex,afterIndex]);
      };

    useEffect(()=>{
        socket.on('numbers', (numbers) => {
            console.log('Received numbers:', numbers);
            setNumbers(numbers);
            setMappedimgs(numbers.map(num=>images[num]));
        });

        socket.on('activeSocketsInRoom',(rs)=>{
            setRoomSockets(rs);
            splitCircularList(rs,rs.indexOf(socket.id));
            console.log(rs);
        });

        socket.on('capturePublicCards',(pubCards)=>{
            setPublicCards(pubCards);
            console.log(pubCards,publicCards);
        });
    },[])



    return (
        <Container sx={{
            backgroundColor:'#111111', 
            marginTop:'2%', color:'white', 
            height:'600px',
            // width:'70%', 
            display:'flex', flexDirection:"column", justifyContent:"space-between", alignItems:"center",
            paddingTop:"1%", paddingBottom:"1%"
            }}><DndProvider backend={HTML5Backend}>
            <Box sx={{
                display:'flex', flexDirection:"row", justifyContent:'space-between', alignItems:"center",
                width:'100%', height:"auto",
            }}>
                <Box sx={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <img src={ProfileImages[roomSockets.indexOf(socket.id)]} width={"45px"}/>
                    <Typography variant="h4" sx={{color:"white", marginLeft:"5%"}}>{username.Username}</Typography>
                </Box>
                <Button variant="contained" onClick={Temp} sx={{
                    backgroundColor:"white", color:"black",
                    "&:hover":{backgroundColor:'#EC002A', color:'white', fontWeight:'600'}
                    }} >temp</Button>
                <Button variant="contained" onClick={LeaveRoom} sx={{
                    backgroundColor:"white", color:"black",
                    "&:hover":{backgroundColor:'#EC002A', color:'white', fontWeight:'600'}
                    }} >Leave</Button>
            </Box>
            <Box sx={{
                display:'flex', flexDirection:'row',justifyContent:"space-between", alignItems:"center",
                width:"100%", height:"75%",
            }}>
                <Box sx={{
                    display:'flex', flexDirection:'column',justifyContent:"space-around", alignItems:"flex-start",
                    width:"25%",height:"100%",
                }}>
                    {splittedRoomSockets[0].map((socketID, index) => (
                        <Box key={index} sx={{
                            display:'flex', flexDirection:'row',justifyContent:"space-around", alignItems:"center",
                            width:"90%", height:"20%", 
                            // backgroundColor:"yellow"
                        }}>
                            <Box sx={{
                                display:'flex', flexDirection:'column',justifyContent:"center", alignItems:"center",
                                width:"20%",
                            }}>
                                <img src={ProfileImages[(roomSockets.indexOf(socket.id)+1+splittedRoomSockets[1].length+index)%roomSockets.length]} width={"100%"}/>
                                {/* <p>smu[smu.indexOf(socketID)+1]</p> */}
                                <Typography varient="h6" sx={{color:"white"}}>{roomSockets.indexOf(socketID)}</Typography>
                            </Box>
                            <Box sx={{
                                width:"70%", height:"100%", 
                                border:"solid 1px #D9D9D9", borderRadius:2,
                                backgroundColor:"#1E1E1E",
                            }}>
                            {/* <p>{roomSockets.indexOf(socketID)}</p> */}
                                <React.Fragment>
                                <DroppableBox 
                                    boxIndex={1}
                                    items={publicCards}
                                    RearrangeItems={(updatedIndices)=>updatedBoxItems(1,updatedIndices)}
                                    onDropItem={handleDropItem}
                                    sx={{
                                        display:"flex",justifyContent:"center",alignItems:"center", flexWrap:"wrap",
                                        overflow:"hidden", overflowY:"scroll",
                                        WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
                                        msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
                                        scrollbarWidth: 'none', // Hide scrollbar for Firefox
                                        '&::-webkit-scrollbar': {
                                            display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
                                        },
                                    }}
                                    />
                                </React.Fragment>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box sx={{
                    display:'flex', flexDirection:'column',justifyContent:"space-around", alignItems:"center",
                    width:"50%",height:"100%",
                }}>
                    <Box sx={{position:"relative", width:'100%'}}>
                        <img src={board} alt="Board"  width={'100%'} style={{display:'block'}}/>
                        <Box sx={{
                            position:'absolute', top:'20%', left:'15%',width:"70%",height:"60%",
                            // display:"flex",justifyContent:"center",alignItems:"center", flexWrap:"wrap",
                            // overflow:"hidden", overflowY:"scroll",
                            // WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
                            // msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
                            // scrollbarWidth: 'none', // Hide scrollbar for Firefox
                            // '&::-webkit-scrollbar': {
                            //     display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
                            // },
                        }}>
                            {/* {publicCards.map((image, index) => (
                            <Box key={index} sx={{
                                margin:'1%', height:'60px'
                            }}>
                                <img src={image} alt={`Example ${index + 1}`} height='60px'/>
                            </Box>
                            ))} */}
                            <React.Fragment>
                                <DroppableBox 
                                    boxIndex={1}
                                    items={publicCards}
                                    RearrangeItems={(updatedIndices)=>updatedBoxItems(1,updatedIndices)}
                                    onDropItem={handleDropItem}
                                    sx={{
                                        display:"flex",justifyContent:"center",alignItems:"center", flexWrap:"wrap",
                                        overflow:"hidden", overflowY:"scroll",
                                        WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
                                        msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
                                        scrollbarWidth: 'none', // Hide scrollbar for Firefox
                                        '&::-webkit-scrollbar': {
                                            display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
                                        },
                                    }}
                                    />
                            </React.Fragment>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display:'flex', flexDirection:'column',justifyContent:"space-around", alignItems:"flex-end",
                    width:"25%",height:"100%", 
                }}>
                    {splittedRoomSockets[1].map((socketID, index) => (
                        <Box key={index} sx={{
                            display:'flex', flexDirection:'row',justifyContent:"space-around", alignItems:"center",
                            width:"90%", height:"20%", 
                            // backgroundColor:"yellow"
                        }}>
                            <Box sx={{
                                width:"70%", height:"100%", 
                                border:"solid 1px #D9D9D9", borderRadius:2,
                                backgroundColor:"#1E1E1E",
                            }}>
                            {/* <p>{roomSockets.indexOf(socketID)} </p> */}
                                <React.Fragment>
                                        <DroppableBox 
                                            boxIndex={1}
                                            items={publicCards}
                                            RearrangeItems={(updatedIndices)=>updatedBoxItems(1,updatedIndices)}
                                            onDropItem={handleDropItem}
                                            sx={{
                                                display:"flex",justifyContent:"center",alignItems:"center", flexWrap:"wrap",
                                                overflow:"hidden", overflowY:"scroll",
                                                WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
                                                msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
                                                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                                                '&::-webkit-scrollbar': {
                                                    display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
                                                },
                                            }}
                                            />
                                    </React.Fragment>
                            </Box>
                            {/* <img src={ProfileImages[(roomSockets.indexOf(socket.id)+splittedRoomSockets[1].length-index)%roomSockets.length]} width={"20%"}/> */}
                            <Box sx={{
                                display:'flex', flexDirection:'column',justifyContent:"center", alignItems:"center",
                                width:"20%",
                            }}>
                                <img src={ProfileImages[(roomSockets.indexOf(socket.id)+splittedRoomSockets[1].length-index)%roomSockets.length]} width={"100%"}/>
                                {/* <p>smu[smu.indexOf(socketID)+1]</p> */}
                                <Typography varient="h6" sx={{color:"white"}}>{roomSockets.indexOf(socketID)}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{
                    // display:'flex', flexDirection:'row',justifyContent:"center", alignItems:"center",
                    backgroundColor:"#1E1E1E", height:'6rem', minWidth:"20%", maxWidth:"60%", paddingLeft:"5px", paddingRight:"5px",
                    borderRadius:"10px", border:"2px solid #D9D9D9",
                    position:'fixed', left:"20%", bottom:"5%",
                    // display: 'flex',
                    // flexWrap: 'nowrap',
                    // overflowX: 'scroll',
                    // WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
                    // msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
                    // scrollbarWidth: 'none', // Hide scrollbar for Firefox
                    // '&::-webkit-scrollbar': {
                    //     display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
                    // },
                }}>
                    {/* {mappedimgs.map((image, index) => (
                    <Box key={index} sx={{
                        marginLeft:'1%', height:'60px'
                    }}>
                        <img src={image} alt={`Example ${index + 1}`} height='60px'/>
                    </Box>
                    ))} */}
                    <React.Fragment>
                        <DroppableBox 
                            boxIndex={0}
                            items={mappedimgs}
                            RearrangeItems={(updatedIndices)=>updatedBoxItems(0,updatedIndices)}
                            onDropItem={handleDropItem}
                            sx={{
                                display:'flex', flexDirection:'row', alignItems:"center",
                                flexWrap: 'nowrap',
                                overflowX: 'scroll',
                                WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
                                msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
                                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                                '&::-webkit-scrollbar': {
                                    display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
                                },
                            }}
                            />
                    </React.Fragment>
                </Box>
            <Box sx={{
                display:'flex', flexDirection:"row", justifyContent:'space-between', alignItems:"center",
                width:"100%",height:"15%"
            }}>
                
                {/* <Box sx={{
                    display:'flex', flexDirection:'row',justifyContent:"flex-start", alignItems:"center",
                    backgroundColor:"#1E1E1E", height:"100%", width:"33%",
                    borderRadius:"10px", border:"2px dashed #F1F2C2",
                    display: 'flex',
                    flexWrap: 'nowrap',
                    overflowX: 'scroll',
                    WebkitOverflowScrolling: 'touch', // Smooth scrolling on touch devices
                    msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
                    scrollbarWidth: 'none', // Hide scrollbar for Firefox
                    '&::-webkit-scrollbar': {
                        display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
                    },
                }}>
                    {mappedimgs.map((image, index) => (
                    <Box key={index} sx={{
                        marginLeft:'1%', height:'60px'
                    }}>
                        <img src={image} alt={`Example ${index + 1}`} height='60px'/>
                    </Box>
                    ))}
                </Box> */}
            </Box>
            </DndProvider></Container>
    )
}

export default CardDistribution_P;
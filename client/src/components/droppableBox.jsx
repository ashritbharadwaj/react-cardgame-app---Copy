import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

const ItemType = 'BOX_ITEM';

const DraggableBoxItem = ({ item, index, moveItem, boxIndex }) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { index, boxIndex },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.boxIndex === boxIndex && draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <Box
      ref={(node) => drag(drop(node))}
      sx={{
        display: "flex",
        marginRight: "5px",
        borderRadius: 1,
      }}
    >
      <img src={item} height={"60px"}/>
    </Box>
  );
};

const DroppableBox = ({ boxIndex, items = [], RearrangeItems, onDropItem, sx={}, sxc={} }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (draggedItem) => {
      if (draggedItem.boxIndex !== boxIndex) {
        onDropItem(draggedItem.index, boxIndex, draggedItem.boxIndex);
        draggedItem.boxIndex = boxIndex;
      }
    },
  });

  useEffect(()=>{
    console.log(items);
  },[items])

  const moveItem = (fromIndex, toIndex) => {
    // setItems((prevItems) => {
    //   const updatedItems = [...prevItems];
    //   const [movedItem] = updatedItems.splice(fromIndex, 1);
    //   updatedItems.splice(toIndex, 0, movedItem);
    //   return updatedItems;
    // });
    RearrangeItems({fromIndex,toIndex})
  };

  return (
    <Box
      ref={drop}
      sx={{
        width: '100%',
        height:'100%',
        ...sx,
        // display:"flex",
        // flexDirection:"row",
        // overflowX: 'auto',
        // whiteSpace: 'nowrap',
        // padding: 2,
        // border: '1px solid grey',
        // backgroundColor: '#f9f9f9',
        // '&::-webkit-scrollbar': {
        //   height: '8px',
        // },
        // '&::-webkit-scrollbar-thumb': {
        //   backgroundColor: '#888',
        //   borderRadius: '4px',
        // },
        // '&::-webkit-scrollbar-thumb:hover': {
        //   backgroundColor: '#555',
        // },
      }}
    >
      {items.map((item, index) => (
        <DraggableBoxItem
          key={index}
          item={item}
          index={index}
          boxIndex={boxIndex}
          moveItem={moveItem}
        />
      ))}
    </Box>
  );
};

DroppableBox.prototype = {
  boxIndex: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  RearrangeItems: PropTypes.func.isRequired,
  onDropItem: PropTypes.func.isRequired,
};

export default DroppableBox;
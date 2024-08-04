import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const theme = createTheme();

const ItemType = 'BOX_ITEM';

const DraggableBoxItem = ({ item, index, moveItem, boxIndex }) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { index, item, boxIndex },
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
        display: 'inline-block',
        width: 200,
        height: 100,
        backgroundColor: 'primary.main',
        color: 'white',
        textAlign: 'center',
        lineHeight: '100px',
        marginRight: 2,
        borderRadius: 1,
        cursor: 'move',
      }}
    >
      <Typography variant="h6">{item}</Typography>
    </Box>
  );
};

const DroppableBox = ({ boxIndex, items, setItems, onDropItem }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (draggedItem) => {
      if (draggedItem.boxIndex !== boxIndex) {
        onDropItem(draggedItem.index, boxIndex);
        draggedItem.boxIndex = boxIndex;
      }
    },
  });

  const moveItem = (fromIndex, toIndex) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      const [movedItem] = updatedItems.splice(fromIndex, 1);
      updatedItems.splice(toIndex, 0, movedItem);
      return updatedItems;
    });
  };

  return (
    <Box
      ref={drop}
      sx={{
        width: '100%',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        padding: 2,
        border: '1px solid grey',
        backgroundColor: '#f9f9f9',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
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

function Try() {
  const [firstBoxItems, setFirstBoxItems] = useState([
    'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6',
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12'
  ]);
  const [secondBoxItems, setSecondBoxItems] = useState([]);

  const handleDropItem = (itemIndex, targetBoxIndex) => {
    if (targetBoxIndex === 0) {
      // Dropped in the first box
      setSecondBoxItems((prevItems) => {
        const updatedItems = [...prevItems];
        const [movedItem] = updatedItems.splice(itemIndex, 1);
        setFirstBoxItems((prevFirstItems) => [...prevFirstItems, movedItem]);
        return updatedItems;
      });
    } else if (targetBoxIndex === 1) {
      // Dropped in the second box
      setFirstBoxItems((prevItems) => {
        const updatedItems = [...prevItems];
        const [movedItem] = updatedItems.splice(itemIndex, 1);
        setSecondBoxItems((prevSecondItems) => [...prevSecondItems, movedItem]);
        return updatedItems;
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        {/* First Scrollable Box with draggable and droppable items */}
        <DroppableBox
          boxIndex={0}
          items={firstBoxItems}
          setItems={setFirstBoxItems}
          onDropItem={handleDropItem}
        />

        {/* Spacer */}
        <Box sx={{ height: 50 }} />

        {/* Second Scrollable Box with draggable and droppable items */}
        <DroppableBox
          boxIndex={1}
          items={secondBoxItems}
          setItems={setSecondBoxItems}
          onDropItem={handleDropItem}
        />
      </DndProvider>
    </ThemeProvider>
  );
}

export default Try;

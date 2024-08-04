import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const theme = createTheme();

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

const DroppableBox = ({ boxIndex, items, RearrangeItems, onDropItem }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (draggedItem) => {
      if (draggedItem.boxIndex !== boxIndex) {
        onDropItem(draggedItem.index, boxIndex, draggedItem.boxIndex);
        draggedItem.boxIndex = boxIndex;
      }
    },
  });

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
  const initialItems = [
    'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6',
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12'
  ];

  const [boxes, setBoxes] = useState([
    initialItems, []
  ]);

  const addNewBox = () => {
    setBoxes((prevBoxes) => [...prevBoxes, []]);
  };

  const handleDropItem = (itemIndex, targetBoxIndex, sourceBoxIndex) => {
    setBoxes((prevBoxes) => {
      const updatedBoxes = [...prevBoxes];
      const [movedItem] = updatedBoxes[sourceBoxIndex].splice(itemIndex, 1);
      updatedBoxes[targetBoxIndex].push(movedItem);
      return updatedBoxes;
    });
  };

  const updateBoxItems = (boxIndex, updatedIndices) => {
    setBoxes((prevBoxes) => {
      const updatedBoxes = [...prevBoxes];
      const [movedItem] = updatedBoxes[boxIndex].splice(updatedIndices.fromIndex,1);
      updatedBoxes[boxIndex].splice(updatedIndices.toIndex, 0, movedItem);
      return updatedBoxes;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        {boxes.map((items, index) => (
          <React.Fragment key={index}>
            <DroppableBox
              boxIndex={index}
              items={items}
              RearrangeItems={(updatedIndices) => updateBoxItems(index, updatedIndices)}
              onDropItem={handleDropItem}
            />
            <Box sx={{ height: 50 }} />
          </React.Fragment>
        ))}
        <Button onClick={addNewBox} variant="contained" sx={{ marginTop: 2 }}>
          Add New Box
        </Button>
      </DndProvider>
    </ThemeProvider>
  );
}

export default Try;


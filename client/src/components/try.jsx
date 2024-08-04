import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DroppableBox from './droppableBox';
import { images } from './cardIndex';

const theme = createTheme();

function Try() {
  const initialItems = [
    'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6',
    'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12'
  ];

  const [boxes, setBoxes] = useState([
    images, []
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


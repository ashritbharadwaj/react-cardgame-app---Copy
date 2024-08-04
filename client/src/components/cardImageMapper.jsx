const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  }
  
  // Dynamically import all images in the 'cards' directory
  const images = importAll(require.context('./assets/cards', false, /\.(png|jpe?g|svg)$/));
  
  const getCardImage = (number) => {
    return images[`${number}.png`];
  };
  
  export default getCardImage;
  
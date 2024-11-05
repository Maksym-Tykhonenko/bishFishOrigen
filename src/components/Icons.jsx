import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case 'menu':
        imageSource = require('../assets/notes/menu.png');
        iconStyle.push(styles.new);
        break;
    case 'search':
        imageSource = require('../assets/notes/search.png');
        iconStyle.push(styles.new);
        break;
    case 'sparkle':
        imageSource = require('../assets/notes/sparkle.png');
        break;
    case 'archive':
        imageSource = require('../assets/notes/archive.png');
        break;
    case 'delete':
        imageSource = require('../assets/notes/delete.png');
        break;
    case 'image':
        imageSource = require('../assets/notes/image.png');
        iconStyle.push(styles.image);
        break;
    case 'arrow':
        imageSource = require('../assets/notes/arrow.png');
        iconStyle.push(styles.new);
        break;
    case 'dots':
        imageSource = require('../assets/notes/dots.png');
        iconStyle.push(styles.new);
        break;
    case 'close':
        imageSource = require('../assets/notes/close.png');
        break;
    case 'calendar':
        imageSource = require('../assets/notes/calendar.png');
        break;
    case 'home':
        imageSource = require('../assets/notes/home.png');
        break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  new:{
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    tintColor: '#e8f7ff'
  }
});

export default Icons;

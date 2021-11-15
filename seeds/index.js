const mongoose = require('mongoose')
const { places, descriptors } = require('./descriptionHelpers')
const cities = require('./cities')
const Room = require('../models/room')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/room-rent');
}


const titleSample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
  await Room.deleteMany({});
  for (let i = 0; i < 50; i++) {
      const random1000 = Math.floor((Math.random() * 1000))
      const priceRandom = Math.floor(Math.random() * 25) + 5; 
      const room = new Room({
          title: `${titleSample(places)} ${titleSample(descriptors)}`,
          image: 'https://source.unsplash.com/collection/9748079',
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quisquam ducimus, veritatis cum tempora, fugit sit iste nam ratione facere',
          price: priceRandom
      })
      await room.save()
  }
};

seedDB().then(() => {
    mongoose.connection.close()
    console.log('Database updated')
})
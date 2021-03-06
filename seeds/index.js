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
          author: '619666f125892c1a57902157',
          title: `${titleSample(places)} ${titleSample(descriptors)}`,
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quisquam ducimus, veritatis cum tempora, fugit sit iste nam ratione facere',
          price: priceRandom,
          geometry: {
            type: "Point",
            coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude, 
            ]
          },
          images: [
            {
              url: 'https://res.cloudinary.com/dmfmgkkf3/image/upload/v1637326349/rooms/obfixunbp0dwsu9u8ptn.jpg',
              filename: 'roomPictures/vix09etd4cvlmi9gjvh2',
            },
            {
              url: 'https://res.cloudinary.com/dmfmgkkf3/image/upload/v1637326350/rooms/vngj8oc4evypjinqr7yi.jpg',
              filename: 'roomPictures/x7rbwdrbz3tarvfqbci8',
            }
          ]
      })
      await room.save()
  }
};

seedDB().then(() => {
    mongoose.connection.close()
    console.log('Database updated')
})
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// get about request
app.get('/about', async(req, res) => {
  try {
    const name = "Sophia Domonoske Bio";
    const paragraph_one = "Hi, I am a double major in Computer Science and Global Liberal Studies. Over the summer, I interned with a small start up, Intellition, where I learned some basic web development skills.";
    const paragraph_two = "I am also the president of the NYU Figure Skating team. Skating is a huge part of my life and my college experience. Every year, as a team, we travel to three qualifiying competitions and nationals.";
    const image_url = "./sophia_bio_photo.jpg";
    res.json({
      name: name,
      paragraph_one: paragraph_one,
      paragraph_two: paragraph_two,
      image_url: image_url,
    });
  }catch (err) {
    console.error(err);
    res.status(400).json({
      error: err,
      status: 'failed to retrieve page data',
    });
  }
});
      // const bio = Bio.create({
      //   name: "About Sophia Domonoske",
      //   paragraph_one: "Hi, I am a double major in Computer Science and Global Liberal Studies. Over the summer, I interned with a small start up, Intellition, where I learned some basic web development skills.",
      //   paragraph_two: "I am also the president of the NYU Figure Skating team. Skating is a huge part of my life and my college experience. Every year, as a team, we travel to three qualifiying competitions and nationals.",
      //   image_url: "./public/sophia.jpg",
      // });
  // export the express app we created to make it available to other modules
  module.exports = app // CommonJS export style!
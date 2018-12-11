const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    image: String,
    name: String,
    artist: String,
    style: String,
    eventDate: String,
    description: String,
    adresse: String,
    price: Number,
    coord: {
        latitude: Number,
        longitude: Number,
    }
});

const EventModel = mongoose.model('events', eventSchema);

module.exports = EventModel;
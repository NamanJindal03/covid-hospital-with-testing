const mongoose = require('mongoose');
if( process.env.NODE_ENV === 'test'){
    mongoose.connect('mongodb://localhost/hospital-test');
}else{
    mongoose.connect('mongodb://localhost/hospital');
}

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting DB'));

db.once('open', function(){
    console.log('connected to database');
})

module.exports = db;
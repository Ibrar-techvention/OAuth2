const mongoose = require("mongoose");

const connection = () => {
    mongoose.connect(
        "mongodb://127.0.0.1:27017/Test",
        {
            useNewUrlParser: false,
            useUnifiedTopology: false,
        }
    )
        .then(() => {
            console.log("yahoo successfully connected to database");
        })
        .catch((e) => {
            console.log("error", e);
        })
};

module.exports = connection; 

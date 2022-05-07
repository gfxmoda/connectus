// if (process.env.NODE_ENV === "production") {
//   module.exports = require("./keys_prod");
// } else {
//   module.exports = require("./keys_dev");
// }

module.exports = {
  mongoURI:
    // "mongodb+srv://gfxmoda:014255366qQ$@cluster0.ffjd2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    "mongodb+srv://gfxmoda:014255366qQ$@cluster0.ffjd2.mongodb.net/myFirstDatabase",
  secretOrKey: "secret",
};

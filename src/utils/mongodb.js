const mongoose = require("mongoose");
const { mongodb_url } = require("../../config.json");
const fs = require("fs");
const path = require("path");

// Connect to MongoDB
mongoose
  .connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    __Client.logger.info("Connected to MongoDB!");
  })
  .catch((err) => {
    __Client.logger.warn("Error connecting to MongoDB");
    __Client.logger.warn(err);
  });

const models = fs.readdirSync(path.join(__dirname, "databases"));
models.forEach((model) => {
  const modelName = model.split(".")[0];
  const modelPath = path.join(__dirname, "databases", model);
  const modelFile = require(modelPath);
  module.exports[modelName] = modelFile;
});

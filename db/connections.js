const { MongoClient } = require("mongodb");

const initDB = async (dbPath, dbName) => {
  try {
    let client = await MongoClient.connect(dbPath);
    return client.db(dbName);
  } catch (error) {
    throw error;
  }
};

const initDBCallBack = (dbPath, dbName, callback) => {
  let opts = { useNewUrlParser: true, useUnifiedTopology: true };
  MongoClient.connect(dbPath, opts, (err, client) => {
    if (err) callback(err);
    else {
      let db = client.db(dbName);
      console.log("Connected");
      callback(null, db, client);
    }
  });
};

module.exports = {
  initDB,
  initDBCallBack,
};

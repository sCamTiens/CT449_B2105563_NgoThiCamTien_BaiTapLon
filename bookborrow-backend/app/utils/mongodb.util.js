// const { MongoClient } = require("mongodb");

// class MongoDB {
//   static connect = async (uri) => {
//     if (this.client) return this.client;
//     this.client = await MongoClient.connect(uri);
//     return this.client;
//   };
// }

// module.exports = MongoDB;

const { MongoClient } = require("mongodb");

class MongoDB {
  // Sử dụng một thuộc tính static cho client
  static client;

  // Phương thức kết nối tới MongoDB
  static connect = async (uri) => {
    if (this.client) return this.client; // Nếu đã có client, trả về client hiện tại
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return this.client;
  };
}

module.exports = MongoDB;

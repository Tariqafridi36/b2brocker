const mongoose = require('mongoose')

const databaseCofig = {
  getConnection: async (DB_URL) => {
    try {
      await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })

      return 'Db Connected'
    } catch (error) {
      console.log(error)
      //process.exit(1)
      return error
    }
  },

  getDatabase: async (client) => {
    const database = await client.db('db_subscribe')
    return database
  },
}

module.exports = databaseCofig

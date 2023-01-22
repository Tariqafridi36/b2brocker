const { databaseConfig } = require('./database')
const express = require('express')
const expressApp = require('./express-app')
const { DB_URL } = require('./config')

const StartServer = async () => {
  const result = await databaseConfig.getConnection(DB_URL)
  console.log(result)
  await expressApp()
}

StartServer()

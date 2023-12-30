// teht 4.2 blogilista step2
// koodin jakaminen useaan moduuliin
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
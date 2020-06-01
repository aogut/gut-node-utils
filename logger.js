const winston = require("winston")
const { printf } = winston.format

const consoleLog = new winston.transports.Console()

// --- FOMRAT
const myFormat = printf(({ message }) => {
  return message
})

const myReqFormat = printf(({ req, message }) => {
  let tstamp = new Date().toISOString()
  let body =
    req && req.body && Object.keys(req.body).length !== 0
      ? "\n" + JSON.stringify(req.body, null, "\t") + "\n"
      : ""

  let url = req ? req.url : ""

  return `${tstamp}\t${url}\t${message}${body}`
})

const regex = /(\s(Select|From|Where|When|Join|And|Set|Values|Order|Group|Left)\s)/g
const mySqlFormat = printf(({ message }) => {
  let tstamp = new Date().toISOString()
  const sql =
    message == null || message.length === 0
      ? "# No message"
      : Array.isArray(message) || typeof message === "object"
      ? "# " + JSON.stringify(message, null, "\t")
      : message.startsWith("#")
      ? message + "\n\n"
      : message.replace(regex, "\n$1") + ";\n\n"

  return `# ${tstamp}\n${sql}`
})

// LOGGER Options
const loggerOptionGenerator = ({ formatter, fileTransport }) => {
  let transports = [consoleLog]
  if (fileTransport != null) {
    let channel = new winston.transports.File({
      filename: fileTransport,
      level: "info"
    })
    transports.push(channel)
  }

  return {
    level: "info",
    format: formatter,
    transports
  }
}

const defaultOptions = {
  db: {
    formatter: mySqlFormat,
    fileTransport: "./logs/db.sql"
  },
  app: {
    formatter: myFormat,
    fileTransport: "./logs/app.log"
  },
  acc: {
    formatter: myReqFormat,
    fileTransport: "./logs/access.log"
  }
}

// --- logger
function createLogger(option) {
  const logger = winston.createLogger({ ...option, maxSize: 200 * 30 })

  return function log(message, req) {
    logger.info({ message, req })
  }
}

module.exports = options => {
  options = options || defaultOptions
  let dbLoggerOption = loggerOptionGenerator(options.db || defaultOptions.db)
  let appLoggerOption = loggerOptionGenerator(options.app || defaultOptions.app)
  let accLoggerOption = loggerOptionGenerator(options.acc || defaultOptions.acc)

  return {
    logDb: createLogger(dbLoggerOption),
    logApp: createLogger(appLoggerOption),
    logRequest: createLogger(accLoggerOption)
  }
}

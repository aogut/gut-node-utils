const SqlString = require("sqlstring")
const { Pool } = require("pg")

const dbConn = (dbConfig, log) => {
  const pool = new Pool(dbConfig)
  return (sql, params, handler) => {
    let statement = Array.isArray(params) ? SqlString.format(sql, params) : sql
    log(statement)

    return new Promise((resolve, reject) => {
      pool.connect((err, client, done) => {
        if (err) return reject(err)

        client.query(statement, (err, res) => {
          done()
          if (err) {
            reject(err)
          } else {
            resolve(handler(res.rows))
          }
        })
      })
    })
  }
}

const limitSql = (page, count) => {
  let p = parseInt(page)
  let c = parseInt(count)
  c = isNaN(c) || c < 1 ? 10 : c
  let start = isNaN(p) || p < 0 ? 0 : p * c
  return ` limit ${c} offset ${start}`
}

module.exports = dbConn
module.exports.limitSql = limitSql

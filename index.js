"use strict"

/**
 * Adds commas to a number
 * @param {number} number
 * @param {string} locale
 * @return {string}
 */

const test = function (number, locale) {
  return number.toLocaleString(locale)
}

const util = require("./util").groupBy

module.exports = {
  test,
  util
}

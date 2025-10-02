/**
 * Represents an HTTP exception with a specific status code and message.
 * Extends the built-in Error class to include HTTP status information.
 *
 * @class
 * @extends Error
 * @param {number} statusCode - The HTTP status code associated with the exception.
 * @param {string} message - The error message describing the exception.
 */
export default class HttpException extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode
  }
}
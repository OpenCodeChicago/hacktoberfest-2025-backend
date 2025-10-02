/**
 * Express middleware for handling errors and sending formatted error responses.
 * Logs the error and returns a JSON response with status code and message.
 * Includes stack trace in development mode.
 *
 * @param {Error} err - The error object.
 * @param {Request} _req - Express request object (unused).
 * @param {Response} res - Express response object.
 * @param {Function} _next - Express next middleware function (unused).
 */
export default function errorHandler(err, req, res, _next) {

  console.error("Error:", err.message);

  const status = err?.statusCode ? err?.statusCode : 500;
  const response = {
    success: false,
    message: err.message || "Internal Server Error"
  };

  // stack trace (only in development)
  if(process.env.NODE_ENV == 'development') response.stack = err.stack;

  res.status(status).json(response);
}

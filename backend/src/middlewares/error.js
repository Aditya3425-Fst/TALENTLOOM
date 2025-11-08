export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.details[0]?.message || 'Validation error',
      },
    });
  }

  // Custom error
  if (err.code && err.message) {
    const statusCode = {
      AUTH_REQUIRED: 401,
      NOT_FOUND: 404,
      CONFLICT: 409,
      VALIDATION_ERROR: 400,
    }[err.code] || 500;

    return res.status(statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    },
  });
};



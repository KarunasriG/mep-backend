const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    code: err.code, // 👈 expose in dev
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // CONTRACT / AUTH ERRORS
  if (err.code) {
    return res.status(err.statusCode || 401).json({
      status: err.status || "fail",
      code: err.code,
      message: err.message || "Unauthorized",
    });
  }

  // OPERATIONAL ERRORS
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // PROGRAMMING / UNKNOWN ERRORS
  console.error("🔥 ERROR:", err);

  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

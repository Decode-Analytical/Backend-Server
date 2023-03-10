const responseStatusCodes = require("../utils/util");
const logger = require("../utils/logger");
class CommonService {
  static successResponse(res, DATA) {
    res.status(responseStatusCodes.SUCCESS).json({
      STATUS: "SUCCESS",
      DATA,
    });
  }

  static createdResponse(DATA, token, res) {
    res.status(responseStatusCodes.CREATED).json({
      STATUS: "SUCCESS",
      MESSAGE: "User created successfully",
      DATA,
      token,
    });
  }

  static failureResponse(message, res) {
    logger.error(message);
    res.status(responseStatusCodes.BAD_REQUEST).json({
      STATUS: "FAILURE",
      MESSAGE: message,
    });
  }

  static unAuthorizedResponse(message, res) {
    res.status(responseStatusCodes.UNAUTHORIZED).json({
      STATUS: "FAILURE",
      MESSAGE: message,
    });
  }

  static forbiddenResponse(message, res) {
    res.status(responseStatusCodes.FORBIDDEN).json({
      STATUS: "FAILURE",
      MESSAGE: message,
    });
  }

  static conflictResponse(message, res) {
    res.status(responseStatusCodes.CONFLICT).json({
      STATUS: "FAILURE",
      MESSAGE: message,
    });
  }

  static UnprocessableResponse(message, res) {
    res.status(responseStatusCodes.UNPROCESSABLE).json({
      STATUS: "FAILURE",
      MESSAGE: message,
    });
  }

  static insufficientParameters(res) {
    res.status(responseStatusCodes.BAD_REQUEST).json({
      STATUS: "FAILURE",
      MESSAGE: "Insufficient parameters",
      DATA: {},
    });
  }

  static serverError(error, res) {
    res.status(responseStatusCodes.INTERNAL_SERVER_ERROR).json({
      STATUS: "FAILURE",
      MESSAGE: "Internal Server error",
      ERROR: error,
    });
  }

  static mongoError(error, res) {
    res.status(responseStatusCodes.INTERNAL_SERVER_ERROR).json({
      STATUS: "FAILURE",
      MESSAGE: "MongoDB error",
      DATA: error,
    });
  }
  static notFoundResponse(message, res) {
    res.status(responseStatusCodes.NOT_FOUND).json({
      STATUS: "FAILURE",
      MESSAGE: message,
    });
  }
}

module.exports = CommonService;

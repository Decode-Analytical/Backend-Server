const responseStatusCodes = require("../utils/util");
class CommonService {
  static successResponse(res, DATA) {
    res.status(responseStatusCodes.SUCCESS).json({
      STATUS: "SUCCESS",
      DATA,
    });
  }

  static createdResponse(message, DATA, res) {
    res.status(responseStatusCodes.CREATED).json({
      STATUS: "SUCCESS",
      MESSAGE: message,
      DATA,
    });
  }

  static failureResponse(message, res) {
    console.log(message);
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

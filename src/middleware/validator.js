const validator = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      res.status(400).json({
        STATUS: "FAILURE",
        message,
      });
    }
  };
};

module.exports = validator;

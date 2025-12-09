const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.error("🔥 ERROR LOG =>", err);
      next(err);
    });
  };
};
export { asyncHandler };

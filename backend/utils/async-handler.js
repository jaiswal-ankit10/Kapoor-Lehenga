const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.error("🔥 ERROR LOG =>", err);
      console.log("asyncHandler wrapper, typeof next:", typeof next);
      next(err);
    });
  };
};
export { asyncHandler };

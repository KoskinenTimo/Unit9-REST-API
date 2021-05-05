// Wraps content(callback) with try catch
exports.asyncHandler = (callback) => {
  return async(req,res,next) => {
    try {
      await callback(req,res,next);
    } catch (error) {
      next(error);
    }
  }
}
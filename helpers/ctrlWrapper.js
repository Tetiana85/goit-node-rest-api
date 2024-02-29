export const ctrlWrapper = (crtl) => {
  const func = async (req, res, next) => {
    try {
      await crtl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

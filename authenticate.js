const { auth } = require("./firebase");

const verifyUser = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      return res.status(400).json({
        message: "User is not logged in",
        code: 400,
        success: false,
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "User is not logged in",
        code: 400,
        success: false,
      });
    }
    const user = await auth.verifyIdToken(token);
    req.userID = user.user_id;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Failed to verify user",
      code: 400,
      success: false,
    });
    next(error);
  }
};

module.exports = { verifyUser };

const User = require("../../model/user");
const crypto = require("crypto");

module.exports = async function (req, res, next) {
    const activationToken = crypto
        .createHash("sha256")
        .update(req.params.activationToken)
        .digest("hex");

    const user = await User.findOne({ activationToken, activationExpire: { $gt: new Date() } });
    if (!user) return res.status(404).send({ error: "Invalid Activation Token" });

    user.isActivated = true;
    user.activationToken = undefined;
    user.activationExpire = undefined;

    await user.save();

    res.send({ message: "User verified successfully" });
};

var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tranvuphong05@gmail.com",
        pass: "ajpb jwvk mcef hqnc"
    }
});
module.exports = transporter;
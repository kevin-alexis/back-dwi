import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL_CONFIG,
        pass:  process.env.USER_PASS_CONFIG
    },
});

transporter.verify().then( () => {
    console.log('Ready for send mails');
})

export default transporter;
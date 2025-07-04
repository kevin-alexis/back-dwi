import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "globainvestmentcentereducation@gmail.com",
        pass:  "lzdusvnrseaoiiiq"
    },
});

transporter.verify().then( () => {
    console.log('Ready for send mails');
})

export default transporter;
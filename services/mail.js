const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendMail = (user, analysts) => {
    const mailOptions = {
        from : process.env.SMTP_USER,
        to: user.email,
        subject: '애널리스트 리포트 알림',
        text: `안녕하세요 ${user.name}님, 즐겨찾기한 애널리스트의 리포트가 나왔어요! ${analysts.map(analyst => analyst.name).join(', ')}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email Sent : ', info);
        }
    })
}

module.exports = {sendMail};
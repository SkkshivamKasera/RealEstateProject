import nodemailer from 'nodemailer'

export const sendEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        host: process.env.SMPT_HOST,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    })
    console.log(email)
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: subject,
        text: message
    }
    await transporter.sendMail(mailOptions)
}
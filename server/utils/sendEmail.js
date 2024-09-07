import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      service: "gmail",
      auth: {
        user: "credminds@gmail.com",
        pass: "vvbc vnwq dnhs gfia",
      },
    });
    const a = await transporter.sendMail({
      from: "credminds@gmail.com",
      to: email.email,
      subject: email.subject,
      text: email.text,
    });
    console.log(a);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email", error);
  }
};

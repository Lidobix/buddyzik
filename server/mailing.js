import nodemailer from "nodemailer";

export async function main() {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "clatdansleburac@gmail.com",
      pass: "blup11pulb",
    },
  });

  let info = await transporter.sendMail({
    from: '"Lidobix"<lidobix@buddyzik.com>',
    to: "pipoflutepouet@gmail.com",
    subject: "TEST",
    text: "Ceci est un test !",
    html: "<b>Cuicui</b>",
  });

  console.log("Message sent !", info.messageId);
  console.log("info = ", info);
  console.log("preview URL: ", nodemailer.getTestMessageUrl(info));
}

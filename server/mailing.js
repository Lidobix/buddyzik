// import nodemailer from "nodemailer";
import SibApiV3Sdk from "sib-api-v3-typescript";

export function mailing() {
  console.log("mail requis");
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.MAIL_API_KEY;

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "{{params.subject}}";
  sendSmtpEmail.htmlContent =
    "<html><style>h1{ color:red;}</style><body><h1>Merci pour votre inscription {{params.parameter}}</h1></body></html>";
  sendSmtpEmail.sender = {
    name: "AdminBuddy",
    email: "buddyzik.contact@gmail.com",
  };
  sendSmtpEmail.to = [{ email: "pipoflutepouet@gmail.com", name: "Ludo" }];
  // sendSmtpEmail.cc = [{ email: "example2@example2.com", name: "Janice Doe" }];
  // sendSmtpEmail.bcc = [{ name: "John Doe", email: "example@example.com" }];
  // sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = {
    parameter: "Jean-Michel",
    subject: "Binevenue chez Buddyzik!",
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );
}

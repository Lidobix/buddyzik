import SibApiV3Sdk from "sib-api-v3-typescript";

export function registerMail(recipient, firstName) {
  const subject = "Bienvenue ! :)";
  const content =
    "<html><style>h1{color:red;}</style><body><h1>Buddyzik</h1><p>Bonjour {{params.name}} !</p></ br><p>Merci pour votre inscription, nous sommes heureux de vous compter dans notre bande ! </p></ br><p>Bonne découverte! A bientôt!</p></body></html>";

  sendMail(recipient, subject, firstName, content);
}

export function lostPasswordMail(recipient, firstName) {
  const subject = "Réinitialisation de votre mot de passe";
  const content =
    "<html><style>h1{color:red;}</style><body><h1>Buddyzik</h1><p>Bonjour {{params.name}} !</p></ br><p>MVeuillez suivre ce lien pour réinitialiser votre mot de passe:</p></ br><p>A bientôt!</p></body></html>";
  sendMail(recipient, subject, firstName, content);
}
export function invitationMail(recipient, firstName) {
  sendMail(recipient, subject, firstName, content);
}

export function recommendationMail(recipient, firstName) {
  sendMail(recipient, subject, firstName, content);
}

export function sendMail(recipient, subject, firstName, content) {
  console.log("mail requis");

  console.log(
    "recipient : ",
    recipient,
    "subject : ",
    subject,
    " firstName : ",
    firstName
  );
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.MAIL_API_KEY;

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.params = {
    recipient: recipient,
    name: firstName,
    // parameter: "Jean-Michel",
    subject: subject,
  };

  sendSmtpEmail.subject = "{{params.subject}}";
  sendSmtpEmail.htmlContent = content;
  // sendSmtpEmail.htmlContent =
  //   "<html><style>h1{ color:red;}</style><body><h1>Buddyzik</h1><p>Bonjour {{params.name}} !</p></ br><p>Merci pour votre inscription, nous sommes heureux de vous compter dans notre bande ! </p></ br><p>Bonne découverte! A bientôt!</p></body></html>";
  sendSmtpEmail.sender = {
    name: "Admin BuddyZik",
    email: "buddyzik.contact@gmail.com",
  };
  sendSmtpEmail.to = [
    { email: sendSmtpEmail.params.recipient, name: sendSmtpEmail.params.name },
  ];
  // sendSmtpEmail.cc = [{ email: "example2@example2.com", name: "Janice Doe" }];
  // sendSmtpEmail.bcc = [{ name: "John Doe", email: "example@example.com" }];
  // sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };

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
// export function mailing(recipient, firstName) {
//   console.log("mail requis");
//   let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//   let apiKey = apiInstance.authentications["apiKey"];
//   apiKey.apiKey = process.env.MAIL_API_KEY;

//   let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//   sendSmtpEmail.subject = "{{params.subject}}";
//   sendSmtpEmail.htmlContent =
//     "<html><style>h1{ color:red;}</style><body><h1>Merci pour votre inscription {{params.parameter}}</h1></body></html>";
//   sendSmtpEmail.sender = {
//     name: "AdminBuddy",
//     email: "buddyzik.contact@gmail.com",
//   };
//   sendSmtpEmail.to = [{ email: "pipoflutepouet@gmail.com", name: "Ludo" }];
//   // sendSmtpEmail.cc = [{ email: "example2@example2.com", name: "Janice Doe" }];
//   // sendSmtpEmail.bcc = [{ name: "John Doe", email: "example@example.com" }];
//   // sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
//   sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
//   sendSmtpEmail.params = {
//      parameter: "Jean-Michel",
//     subject: "Binevenue chez Buddyzik!",
//   };

//   apiInstance.sendTransacEmail(sendSmtpEmail).then(
//     function (data) {
//       console.log(
//         "API called successfully. Returned data: " + JSON.stringify(data)
//       );
//     },
//     function (error) {
//       console.error(error);
//     }
//   );
// }

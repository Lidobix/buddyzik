import SibApiV3Sdk from "sib-api-v3-typescript";

export function registerMail(recipient, firstName) {
  const params = {
    recipient: recipient,
    name: firstName,
    subject: "Bienvenue ! :)",
    content:
      "<html><style>h1{color:red;}</style><body><h1>Buddyzik</h1><p>Bonjour {{params.name}} !</p></ br><p>Merci pour votre inscription, nous sommes heureux de vous compter dans notre bande ! </p></ br><p>Bonne découverte! A bientôt!</p></body></html>",
  };

  sendMail(params);
}

export function lostPasswordMail(recipient, password) {
  const params = {
    recipient: recipient,
    name: "utilisateur inconnu",
    subject: "Réinitialisation de votre mot de passe",
    password: password,
    content:
      "<html><style>h1{color:red;}</style><body><h1>Buddyzik</h1><p>Bonjour,</p></ br><p>Voici votre nouveau mot de passe: {{params.password}}</p></ br><p>A bientôt!</p></body></html>",
  };

  sendMail(params);
}
export function invitationMail(contacts) {
  const params = {
    recipient: contacts[1].mailAddress,
    name: contacts[1].firstName,
    subject: "Vous avez reçu une invitation!",
    hostFirstName: contacts[0].firstName,
    hostLastName: contacts[0].lastName,
    content:
      "<html><style>h1{color:red;}</style><body><h1>Buddyzik</h1><p>Bonjour {{params.name}} !</p></ br><p>{{params.hostFirstName}} {{params.hostLastName}} vous a envoyé une demande d'invitaion, retrouvez le dans votre espace amiitié</p></ br><p>A bientôt!</p></body></html>",
  };

  sendMail(params);
}

export function recommendationMail(recipient, firstName) {
  sendMail(recipient, subject, content, firstName);
}

export function sendMail(params) {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.MAIL_API_KEY;

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.params = params;

  sendSmtpEmail.subject = "{{params.subject}}";
  sendSmtpEmail.htmlContent = params.content;

  sendSmtpEmail.sender = {
    name: "Admin BuddyZik",
    email: "buddyzik.contact@gmail.com",
  };
  sendSmtpEmail.to = [{ email: params.recipient, name: params.name }];
  // sendSmtpEmail.cc = [{ email: "example2@example2.com", name: "Janice Doe" }];
  // sendSmtpEmail.bcc = [{ name: "John Doe", email: "example@example.com" }];
  // sendSmtpEmail.replyTo = { email: "replyto@domain.com", name: "John Doe" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("mail envoyé");
      // console.log(
      //   "API called successfully. Returned data: " + JSON.stringify(data)
      // );
    },
    function (error) {
      console.error(error);
    }
  );
}

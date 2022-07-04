import SibApiV3Sdk from "sib-api-v3-typescript";
import "dotenv/config";

export function registerMail(recipient, firstName) {
  console.log("dans le registermail");
  const params = {
    recipient: recipient,
    name: firstName,
    subject: "Bienvenue ! :)",
    content:
      "<html><body><p>Bonjour {{params.name}} !</p></ br><p>Merci pour votre inscription, nous sommes heureux de vous compter dans notre bande ! </p></ br><p>Bonne découverte! A bientôt!</p></body></html>",
  };

  sendMail(params).catch(console.error);
}

export function lostPasswordMail(recipient, password) {
  const params = {
    recipient: recipient,
    name: "utilisateur inconnu",
    subject: "Réinitialisation de votre mot de passe",
    password: password,
    content:
      "<html><body><p>Bonjour,</p></ br><p>Voici votre nouveau mot de passe: {{params.password}}</p></ br><p>A bientôt!</p></body></html>",
  };

  sendMail(params).catch(console.error);
}
export function invitationMail(contacts) {
  const params = {
    recipient: contacts[1].mailAddress,
    name: contacts[1].firstName,
    subject: "Vous avez reçu une invitation!",
    hostFirstName: contacts[0].firstName,
    hostLastName: contacts[0].lastName,
    content:
      "<html><body><p>Bonjour {{params.name}} !</p></ br><p>{{params.hostFirstName}} {{params.hostLastName}} vous a envoyé une demande d'invitaion, retrouvez le dans votre espace amiitié</p></ br><p>A bientôt!</p></body></html>",
  };

  sendMail(params).catch(console.error);
}

export function recommendationMail(contacts) {
  const params = {
    recipient: contacts[1].mailAddress,
    name: contacts[1].firstName,
    subject: "Vous avez reçu une recommendation!",
    recommenderFirstName: contacts[0].firstName,
    recommenderLastName: contacts[0].lastName,
    content:
      "<html><body><p>Bonjour {{params.name}} !</p></ br><p>{{params.recommenderFirstName}} {{params.recommenderLastName}} vous a recommandé auprès de ses amis!</p></ br><p>A bientôt!</p></body></html>",
  };

  sendMail(params).catch(console.error);
}

async function sendMail(params) {
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

  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("mail envoyé");
    },
    function (error) {
      console.error(error);
    }
  );
}

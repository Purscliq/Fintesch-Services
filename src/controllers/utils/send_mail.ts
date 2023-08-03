import Mailgun from 'mailgun-js';

export class SendMail {
  public static async send( domain: string, key: string, messageData: any ) {
    const mailgun = new Mailgun({ 
          apiKey: key, 
          domain: domain 
        });

    try {
      await mailgun.messages().send(messageData, (error: any, body) => {
        if(error)
            throw new Error(error.message);
            console.log(body);
        });

      console.log("Mail sent", messageData);
    } catch(error: any) {
        console.error(error.message);
      }
  }

} 
import Mailgun from 'mailgun-js';

// send Mail function
export const sendMail = async ( domain: string, key: string, messageData: any ) => {
    const mailgun = new Mailgun({ 
          apiKey: key, 
          domain: domain 
        });

    try {
      await mailgun.messages().send(messageData, (error: any, body) => {
        if(error)
            throw new Error(error);

            console.log(body);
        });

      console.log("Mail sent", messageData);
    } catch(error: any) {
        throw error;
      }
  }
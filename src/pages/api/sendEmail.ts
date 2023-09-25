import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, subject, body } = req.body;

    const msg = {
      to: 'your-email@example.com', // Your email
      from: email, // Sender's email
      subject: `New Message from ${name}: ${subject}`,
      text: body,
    };

    try {
      await sgMail.send(msg);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

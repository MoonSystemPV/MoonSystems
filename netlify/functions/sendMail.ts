import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the request body
    const { name, email, subject, message } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    // Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER,
      subject: `Contacto: ${subject}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Asunto:</b> ${subject}</p>
        <p><b>Mensaje:</b><br>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: 'Correo enviado' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: 'Error enviando correo' }),
    };
  }
};

export { handler };

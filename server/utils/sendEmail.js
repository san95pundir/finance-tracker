const sendEmail = async (to, subject, html) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'Finance Tracker', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Brevo error: ${JSON.stringify(errorData)}`);
  }

  return response.json();
};

module.exports = sendEmail;
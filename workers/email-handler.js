// Cloudflare Workers email handler for kevinstamp.com contact form
// Deploy this to: kevinstamp-email-handler.workers.dev

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const formData = await request.json();

      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }), {
          status: 400,
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      // Send notification email to admin
      const adminEmailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: 'ccook@bpt3.net', name: 'Kevin Stamp Admin' }],
            dkim_domain: 'kevinstamp.com',
            dkim_selector: 'mailchannels',
            dkim_private_key: env.DKIM_PRIVATE_KEY, // We'll set this up
          }],
          from: {
            email: 'noreply@kevinstamp.com',
            name: 'Kevin Stamp Contact Form'
          },
          subject: `🎨 New Contact Form Submission - ${formData.name}`,
          content: [{
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF6B6B; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                  New Contact Form Submission 🎨
                </h2>

                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0 0 15px 0; color: #374151;">Contact Information</h3>
                  <p><strong>Name:</strong> ${formData.name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
                  ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
                </div>

                <div style="background: #FFF4E6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0 0 15px 0; color: #8B4513;">Message</h3>
                  <p style="white-space: pre-wrap;">${formData.message}</p>
                </div>

                ${formData.subject ? `
                <div style="background: #E8F4F8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0 0 15px 0; color: #0C4A6E;">Subject</h3>
                  <p>${formData.subject}</p>
                </div>
                ` : ''}

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                  <p>Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</p>
                  <p>Reply directly to this email to contact: ${formData.email}</p>
                </div>
              </div>
            `
          }]
        })
      });

      if (!adminEmailResponse.ok) {
        const errorText = await adminEmailResponse.text();
        console.error('MailChannels admin email error:', errorText);
        throw new Error(`Admin email failed: ${adminEmailResponse.status}`);
      }

      // Send confirmation email to user
      const userEmailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: formData.email, name: formData.name }],
            dkim_domain: 'kevinstamp.com',
            dkim_selector: 'mailchannels',
            dkim_private_key: env.DKIM_PRIVATE_KEY,
          }],
          from: { email: 'noreply@kevinstamp.com', name: 'Kevin Stamp' },
          subject: `Thank you for contacting Kevin Stamp ✨`,
          content: [{
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF6B6B;">Thank you for your message!</h2>

                <p>Hi ${formData.name},</p>

                <p>We've received your message and appreciate you reaching out about Kevin Stamp and the Bitcoin Stamps ecosystem.</p>

                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <p style="margin: 0;"><strong>Your Message:</strong></p>
                  <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${formData.message}</p>
                </div>

                <div style="background: #FFF4E6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>What's Next:</strong></p>
                  <ul style="margin: 10px 0 0 20px; padding: 0;">
                    <li>We'll review your message carefully</li>
                    <li>Someone from our team will respond within 24-48 hours</li>
                    <li>For urgent matters, please follow up directly</li>
                  </ul>
                </div>

                <p>In the meantime, feel free to explore:</p>
                <ul>
                  <li>Learn more about <a href="https://kevinstamp.com">Kevin Stamp</a></li>
                  <li>Discover the <a href="https://stampchain.io">Bitcoin Stamps ecosystem</a></li>
                  <li>Join our community discussions</li>
                </ul>

                <p>Best regards,<br>
                <strong>The Kevin Stamp Team</strong><br>
                kevinstamp.com</p>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #6b7280; font-size: 12px;">
                  This is an automated confirmation. Your message was submitted on ${new Date().toLocaleDateString()}.
                </p>
              </div>
            `
          }]
        })
      });

      if (!userEmailResponse.ok) {
        console.error('User confirmation email failed but admin email succeeded');
        // Don't fail the whole request if user email fails
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Message sent successfully'
      }), {
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Email handler error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to send message. Please try again or contact us directly.'
      }), {
        status: 500,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }
};
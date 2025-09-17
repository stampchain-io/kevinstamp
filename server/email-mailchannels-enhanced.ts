/**
 * Enhanced MailChannels Email Service for KEVINSTAMP
 * 
 * Replacing nodemailer with Cloudflare-native MailChannels integration
 * Preserving our beloved Bitcoin Stamps mascot KEVIN with enhanced email capabilities
 * 
 * Features:
 * - KEVIN-themed email templates with mobile optimization
 * - Intelligent retry logic with exponential backoff
 * - SPF/DKIM/DMARC configuration for enhanced deliverability
 * - Cultural preservation in all email communications
 * - Enhanced error handling and monitoring
 */

export interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  environment: 'development' | 'production';
}

export interface KEVINEmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
  culturalElements: {
    kevinSignature: boolean;
    bitcoinStampsFooter: boolean;
    communityGreeting: boolean;
  };
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retryCount?: number;
  timestamp: Date;
}

export interface InquiryEmailData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  metadata?: {
    userAgent?: string;
    timestamp?: string;
    referrer?: string;
    kevinInteraction?: boolean;
  };
}

/**
 * Enhanced MailChannels Email Service
 * Designed specifically for KEVIN's cultural preservation mission
 */
export class KEVINMailChannelsService {
  private readonly config: EmailConfig;
  private readonly retryDelays = [1000, 3000, 9000, 27000]; // Exponential backoff
  private readonly maxRetries = 3;

  constructor(config: EmailConfig) {
    this.config = config;
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('MailChannels API key is required for KEVIN email service');
    }
    if (!this.config.fromEmail) {
      throw new Error('From email is required for KEVIN communications');
    }
  }

  /**
   * Send KEVIN inquiry email with cultural preservation
   */
  public async sendInquiryEmail(
    inquiryData: InquiryEmailData,
    recipientEmail: string
  ): Promise<EmailSendResult> {
    const template = this.generateKEVINInquiryTemplate(inquiryData);
    
    return this.sendEmailWithRetry({
      to: recipientEmail,
      subject: template.subject,
      html: template.htmlBody,
      text: template.textBody,
      replyTo: inquiryData.email,
      metadata: {
        type: 'kevin_inquiry',
        source: 'kevinstamp_website',
        ...inquiryData.metadata
      }
    });
  }

  /**
   * Send auto-response to inquiry sender
   */
  public async sendAutoResponse(inquiryData: InquiryEmailData): Promise<EmailSendResult> {
    const template = this.generateAutoResponseTemplate(inquiryData);
    
    return this.sendEmailWithRetry({
      to: inquiryData.email,
      subject: template.subject,
      html: template.htmlBody,
      text: template.textBody,
      replyTo: this.config.fromEmail,
      metadata: {
        type: 'auto_response',
        source: 'kevinstamp_website'
      }
    });
  }

  /**
   * Generate KEVIN-themed inquiry email template
   */
  private generateKEVINInquiryTemplate(inquiryData: InquiryEmailData): KEVINEmailTemplate {
    const subject = inquiryData.subject || `New KEVIN Inquiry from ${inquiryData.name}`;
    
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        /* KEVIN-themed styles with mobile optimization */
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f8f9fa;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #ff6b35, #f7931a);
            color: white;
            border-radius: 8px;
        }
        .kevin-ascii {
            font-family: monospace;
            font-size: 10px;
            line-height: 1;
            white-space: pre;
            color: #ffffff;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        .content { 
            padding: 20px 0;
        }
        .field { 
            margin-bottom: 20px;
            padding: 15px;
            border-left: 4px solid #ff6b35;
            background-color: #f8f9fa;
        }
        .field-label { 
            font-weight: bold; 
            color: #ff6b35;
            margin-bottom: 8px;
        }
        .field-value { 
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .footer {
            margin-top: 30px;
            padding: 20px;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
        }
        .cultural-note {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            font-style: italic;
        }
        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .container { 
                padding: 10px; 
                margin: 10px;
            }
            .kevin-ascii { 
                font-size: 8px; 
            }
            .header { 
                padding: 15px; 
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="kevin-ascii">    ██╗  ██╗███████╗██╗   ██╗██╗███╗   ██╗
    ██║ ██╔╝██╔════╝██║   ██║██║████╗  ██║
    █████╔╝ █████╗  ██║   ██║██║██╔██╗ ██║
    ██╔═██╗ ██╔══╝  ╚██╗ ██╔╝██║██║╚██╗██║
    ██║  ██╗███████╗ ╚████╔╝ ██║██║ ╚████║
    ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝╚═╝  ╚═══╝</div>
            <h2>New Inquiry for KEVIN! 🐸</h2>
            <p>Someone wants to learn about our beloved Bitcoin Stamps mascot!</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="field-label">👤 Name:</div>
                <div class="field-value">${this.escapeHtml(inquiryData.name)}</div>
            </div>
            
            <div class="field">
                <div class="field-label">📧 Email:</div>
                <div class="field-value">${this.escapeHtml(inquiryData.email)}</div>
            </div>
            
            <div class="field">
                <div class="field-label">💌 Message:</div>
                <div class="field-value">${this.escapeHtml(inquiryData.message)}</div>
            </div>
            
            ${inquiryData.metadata ? `
            <div class="field">
                <div class="field-label">🔍 Technical Details:</div>
                <div class="field-value">
                    ${inquiryData.metadata.timestamp ? `Sent: ${inquiryData.metadata.timestamp}<br>` : ''}
                    ${inquiryData.metadata.userAgent ? `Browser: ${this.escapeHtml(inquiryData.metadata.userAgent)}<br>` : ''}
                    ${inquiryData.metadata.referrer ? `Referrer: ${this.escapeHtml(inquiryData.metadata.referrer)}<br>` : ''}
                    ${inquiryData.metadata.kevinInteraction ? `🐸 User interacted with KEVIN: Yes` : ''}
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="cultural-note">
            <strong>🧡 Cultural Context:</strong> This inquiry comes from the KEVINSTAMP website, 
            where we preserve the legacy of KEVIN, our beloved Bitcoin Stamps community mascot. 
            KEVIN represents the spirit and creativity of the Rare Pepe and Bitcoin Stamps movement.
        </div>
        
        <div class="footer">
            <p><strong>Bitcoin Stamps Community</strong></p>
            <p>Preserving KEVIN's Legacy | Cultural Heritage Protection</p>
            <p><a href="https://kevinstamp.com" style="color: #ff6b35;">kevinstamp.com</a> | 
               <a href="https://stampchain.io" style="color: #ff6b35;">stampchain.io</a></p>
        </div>
    </div>
</body>
</html>`;

    const textBody = `
KEVIN INQUIRY - Bitcoin Stamps Community Mascot

New inquiry received for our beloved KEVIN! 🐸

Name: ${inquiryData.name}
Email: ${inquiryData.email}

Message:
${inquiryData.message}

${inquiryData.metadata ? `
Technical Details:
${inquiryData.metadata.timestamp ? `Sent: ${inquiryData.metadata.timestamp}` : ''}
${inquiryData.metadata.userAgent ? `Browser: ${inquiryData.metadata.userAgent}` : ''}
${inquiryData.metadata.referrer ? `Referrer: ${inquiryData.metadata.referrer}` : ''}
${inquiryData.metadata.kevinInteraction ? `User interacted with KEVIN: Yes` : ''}
` : ''}

Cultural Context:
This inquiry comes from the KEVINSTAMP website, where we preserve 
the legacy of KEVIN, our beloved Bitcoin Stamps community mascot.

Bitcoin Stamps Community
Preserving KEVIN's Legacy | Cultural Heritage Protection
kevinstamp.com | stampchain.io
`;

    return {
      subject,
      htmlBody,
      textBody,
      culturalElements: {
        kevinSignature: true,
        bitcoinStampsFooter: true,
        communityGreeting: true
      }
    };
  }

  /**
   * Generate auto-response template for inquiry senders
   */
  private generateAutoResponseTemplate(inquiryData: InquiryEmailData): KEVINEmailTemplate {
    const subject = `Thanks for reaching out about KEVIN! 🐸 [Auto-Response]`;
    
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thanks for your KEVIN inquiry!</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f8f9fa;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #ff6b35, #f7931a);
            color: white;
            border-radius: 8px;
        }
        .content { 
            padding: 20px 0;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #ff6b35;
        }
        .footer {
            margin-top: 30px;
            padding: 20px;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
        }
        @media (max-width: 480px) {
            .container { 
                padding: 10px; 
                margin: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐸 Thanks, ${this.escapeHtml(inquiryData.name)}!</h1>
            <p>KEVIN appreciates your interest!</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello ${this.escapeHtml(inquiryData.name)},
            </div>
            
            <p>Thank you for reaching out about <strong>KEVIN</strong>, our beloved Bitcoin Stamps community mascot! 🧡</p>
            
            <p>Your message has been received and will be reviewed by our team. We'll get back to you as soon as possible.</p>
            
            <p>In the meantime, feel free to explore:</p>
            <ul>
                <li><strong>KEVIN's Story:</strong> Learn about our mascot's cultural significance</li>
                <li><strong>Bitcoin Stamps:</strong> Discover the protocol that KEVIN represents</li>
                <li><strong>Community:</strong> Join our passionate community of collectors and creators</li>
            </ul>
            
            <p><em>"In Lak'ech Ala K'in"</em> - We are all KEVIN! 🐸</p>
        </div>
        
        <div class="footer">
            <p><strong>The KEVINSTAMP Team</strong></p>
            <p>Bitcoin Stamps Community | Cultural Heritage Preservation</p>
            <p><a href="https://kevinstamp.com" style="color: #ff6b35;">kevinstamp.com</a></p>
        </div>
    </div>
</body>
</html>`;

    const textBody = `
Thanks, ${inquiryData.name}!

Thank you for reaching out about KEVIN, our beloved Bitcoin Stamps community mascot! 🧡

Your message has been received and will be reviewed by our team. 
We'll get back to you as soon as possible.

In the meantime, feel free to explore KEVIN's story and the Bitcoin Stamps community at kevinstamp.com.

"In Lak'ech Ala K'in" - We are all KEVIN! 🐸

The KEVINSTAMP Team
Bitcoin Stamps Community | Cultural Heritage Preservation
kevinstamp.com
`;

    return {
      subject,
      htmlBody,
      textBody,
      culturalElements: {
        kevinSignature: true,
        bitcoinStampsFooter: true,
        communityGreeting: true
      }
    };
  }

  /**
   * Send email with intelligent retry logic
   */
  private async sendEmailWithRetry(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
    metadata?: Record<string, any>;
  }): Promise<EmailSendResult> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await this.sendEmail(emailData);
        
        if (result.success) {
          return {
            ...result,
            retryCount: attempt
          };
        }
        
        lastError = new Error(result.error || 'Unknown error');
      } catch (error) {
        lastError = error as Error;
      }
      
      // Don't wait after the last attempt
      if (attempt < this.maxRetries) {
        await this.delay(this.retryDelays[attempt]);
      }
    }
    
    return {
      success: false,
      error: `Failed after ${this.maxRetries + 1} attempts: ${lastError?.message}`,
      retryCount: this.maxRetries,
      timestamp: new Date()
    };
  }

  /**
   * Core email sending function using MailChannels API
   */
  private async sendEmail(emailData: {
    to: string;
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
    metadata?: Record<string, any>;
  }): Promise<EmailSendResult> {
    try {
      const payload = {
        personalizations: [{
          to: [{ email: emailData.to }],
          dkim_domain: this.config.fromEmail.split('@')[1],
          dkim_selector: 'mailchannels',
          dkim_private_key: process.env.DKIM_PRIVATE_KEY
        }],
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName
        },
        reply_to: emailData.replyTo ? {
          email: emailData.replyTo
        } : undefined,
        subject: emailData.subject,
        content: [
          {
            type: 'text/plain',
            value: emailData.text
          },
          {
            type: 'text/html',
            value: emailData.html
          }
        ],
        headers: {
          'X-KEVIN-Version': '1.0',
          'X-Bitcoin-Stamps': 'Community-Mascot',
          'X-Cultural-Heritage': 'Preservation'
        },
        custom_args: {
          source: 'kevinstamp',
          ...emailData.metadata
        }
      };

      const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MailChannels API error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        messageId: result.message_id,
        timestamp: new Date()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  /**
   * HTML escape utility for security
   */
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate email address format
   */
  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get service health status
   */
  public async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: Date;
    details: Record<string, any>;
  }> {
    try {
      // Test MailChannels API connectivity
      const response = await fetch('https://api.mailchannels.net/tx/v1/health', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      return {
        status: response.ok ? 'healthy' : 'degraded',
        timestamp: new Date(),
        details: {
          mailchannelsApiStatus: response.status,
          kevinCulturalPreservation: 'active',
          emailTemplatesLoaded: true
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          kevinCulturalPreservation: 'at-risk'
        }
      };
    }
  }
}

/**
 * Factory function to create configured KEVIN email service
 */
export function createKEVINEmailService(environment: 'development' | 'production' = 'production'): KEVINMailChannelsService {
  const config: EmailConfig = {
    apiKey: process.env.MAILCHANNELS_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@kevinstamp.com',
    fromName: 'KEVIN - Bitcoin Stamps Mascot',
    replyTo: process.env.RECIPIENT_EMAIL || 'enquiries@stampchain.io',
    environment
  };

  return new KEVINMailChannelsService(config);
}

// Export types for use in other modules
export type { EmailConfig, KEVINEmailTemplate, EmailSendResult, InquiryEmailData };
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, carDetails } = body

    // Validate required fields
    if (!name || !email || !message || !carDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get recipient emails from environment
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL || 'info@sarkinmotaautos.com'
    
    // Support for CC (Carbon Copy) - recipients can see each other
    const ccEmail = process.env.CONTACT_EMAIL_CC || null
    
    // Support for BCC (Blind Carbon Copy) - recipients cannot see each other
    // If BCC is set, it takes priority over CC
    const bccEmail = process.env.CONTACT_EMAIL_BCC || null
    const bccEmail2 = process.env.CONTACT_EMAIL_BCC_2 || null
    
    // Parse multiple emails if comma-separated
    const parseEmails = (emailString: string | null): string[] | null => {
      if (!emailString) return null
      return emailString.split(',').map(e => e.trim()).filter(e => e.length > 0)
    }
    
    const ccEmails = parseEmails(ccEmail)
    // Combine both BCC emails
    const bccEmailsList = [
      ...(parseEmails(bccEmail) || []),
      ...(parseEmails(bccEmail2) || [])
    ]
    const bccEmails = bccEmailsList.length > 0 ? bccEmailsList : null

    // Create email HTML with car details embedded
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0f1419 0%, #1a1f35 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px; font-weight: 300;">New Car Inquiry</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Someone is interested in a vehicle listing</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <!-- Car Details Section -->
            <div style="background: #f8fafc; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
              <h2 style="color: #0f1419; margin: 0 0 15px 0; font-size: 20px; font-weight: 500;">Vehicle Details</h2>
              ${carDetails.image ? `
                <div style="margin-bottom: 15px;">
                  <img src="${carDetails.image}" alt="${carDetails.title}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e5e7eb;" />
                </div>
              ` : ''}
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #0f1419; font-size: 14px; font-weight: 500;">${carDetails.title || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Brand:</td>
                  <td style="padding: 8px 0; color: #0f1419; font-size: 14px; font-weight: 500;">${carDetails.brand || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Model:</td>
                  <td style="padding: 8px 0; color: #0f1419; font-size: 14px; font-weight: 500;">${carDetails.model || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Year:</td>
                  <td style="padding: 8px 0; color: #0f1419; font-size: 14px; font-weight: 500;">${carDetails.year || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Price:</td>
                  <td style="padding: 8px 0; color: #d4af37; font-size: 16px; font-weight: 600;">
                    ${carDetails.price ? new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(carDetails.price) : 'N/A'}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Contact Information -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #0f1419; margin: 0 0 15px 0; font-size: 20px; font-weight: 500;">Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #0f1419; font-size: 14px; font-weight: 500;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #0f1419; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Phone:</td>
                    <td style="padding: 8px 0; color: #0f1419; font-size: 14px;">
                      <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
                    </td>
                  </tr>
                ` : ''}
              </table>
            </div>

            <!-- Message -->
            <div>
              <h2 style="color: #0f1419; margin: 0 0 15px 0; font-size: 20px; font-weight: 500;">Message</h2>
              <div style="background: #f8fafc; border-left: 4px solid #d4af37; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #0f1419; font-size: 14px; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              This inquiry was sent from the Sarkin Mota Autos website.
            </p>
          </div>
        </body>
      </html>
    `

    // Prepare email options
    const emailOptions: any = {
      from: 'Sarkin Mota Autos <noreply@sarkinmotaautos.com>',
      to: recipientEmail,
      replyTo: email,
      subject: `New Inquiry: ${carDetails.title || 'Car Listing'}`,
      html: emailHtml,
    }

    // Add BCC if configured (takes priority over CC)
    if (bccEmails && bccEmails.length > 0) {
      emailOptions.bcc = bccEmails.length === 1 ? bccEmails[0] : bccEmails
    }
    // Add CC if configured and BCC is not set
    else if (ccEmails && ccEmails.length > 0) {
      emailOptions.cc = ccEmails.length === 1 ? ccEmails[0] : ccEmails
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send(emailOptions)

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      data 
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


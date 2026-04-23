import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string
  subject: string
  html: string
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Sarkin Mota Autos <noreply@sarkinmotaautos.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    })

    if (error) {
      console.error('Email sending failed:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px; text-align: center;">
        <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Welcome to Sarkin Mota Autos! 🚗</h1>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Hi ${name},<br><br>
            Welcome to Sarkin Mota Autos - where we sell your car faster and better!<br><br>
            You can now:
          </p>
          <ul style="color: #64748b; text-align: left; margin: 20px 0;">
            <li>Submit car listing requests</li>
            <li>Become an affiliate and earn commissions</li>
            <li>Contact sellers directly via WhatsApp</li>
            <li>Track your requests and earnings</li>
          </ul>
          <p style="color: #64748b; font-size: 16px;">
            Ready to get started? Browse our current listings or submit your car for sale!
          </p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background: #1e293b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Browse Cars</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Sarkin Mota Autos Team
          </p>
        </div>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to Sarkin Mota Autos! 🚗',
    html,
  })
}

export const sendCarRequestStatusEmail = async (
  email: string,
  name: string,
  status: 'approved' | 'rejected',
  carDetails: string,
  adminNotes?: string
) => {
  const statusText = status === 'approved' ? 'Approved ✅' : 'Rejected ❌'
  const statusColor = status === 'approved' ? '#10b981' : '#ef4444'
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px; text-align: center;">
        <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Car Request Update</h1>
          <div style="background: ${statusColor}; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin: 0;">${statusText}</h2>
          </div>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Hi ${name},<br><br>
            Your car listing request has been <strong>${status}</strong>.
          </p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left;">
            <h3 style="color: #1e293b; margin-top: 0;">Car Details:</h3>
            <p style="color: #64748b; margin: 0;">${carDetails}</p>
          </div>
          ${adminNotes ? `
            <div style="background: #fef3c7; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left;">
              <h3 style="color: #92400e; margin-top: 0;">Admin Notes:</h3>
              <p style="color: #92400e; margin: 0;">${adminNotes}</p>
            </div>
          ` : ''}
          ${status === 'approved' ? `
            <p style="color: #64748b; font-size: 16px;">
              Your car will be listed on our platform soon. We'll contact you via WhatsApp for further details.
            </p>
          ` : `
            <p style="color: #64748b; font-size: 16px;">
              Don't worry! You can submit another request or contact us for assistance.
            </p>
          `}
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #1e293b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Sarkin Mota Autos Team
          </p>
        </div>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `Car Request ${statusText} - Sarkin Mota Autos`,
    html,
  })
}

export const sendAffiliateStatusEmail = async (
  email: string,
  name: string,
  status: 'approved' | 'rejected'
) => {
  const statusText = status === 'approved' ? 'Approved ✅' : 'Rejected ❌'
  const statusColor = status === 'approved' ? '#10b981' : '#ef4444'
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px; text-align: center;">
        <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px;">
          <h1 style="color: #1e293b; margin-bottom: 20px;">Affiliate Application Update</h1>
          <div style="background: ${statusColor}; color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin: 0;">${statusText}</h2>
          </div>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Hi ${name},<br><br>
            Your affiliate application has been <strong>${status}</strong>.
          </p>
          ${status === 'approved' ? `
            <div style="background: #ecfdf5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: left;">
              <h3 style="color: #065f46; margin-top: 0;">🎉 Congratulations!</h3>
              <p style="color: #065f46; margin: 0;">
                You're now an affiliate partner! Start sharing your unique referral links and earn ₦100,000 for every successful sale.
              </p>
            </div>
            <p style="color: #64748b; font-size: 16px;">
              Log in to your dashboard to get your affiliate code and start earning!
            </p>
          ` : `
            <p style="color: #64748b; font-size: 16px;">
              You can reapply for affiliate status in the future. Contact us if you have any questions.
            </p>
          `}
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #1e293b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Sarkin Mota Autos Team
          </p>
        </div>
      </div>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `Affiliate Application ${statusText} - Sarkin Mota Autos`,
    html,
  })
} 
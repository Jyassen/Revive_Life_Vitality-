/**
 * Shared email sending utility.
 *
 * Supports Resend (preferred) and SMTP (fallback via Nodemailer).
 * Throws a descriptive error when no provider is configured so that
 * callers can decide whether to block or log-and-continue.
 */

export interface SendEmailResult {
	sent: boolean
	provider: 'resend' | 'smtp'
}

/**
 * Send a plain-text email.
 *
 * @throws {Error} If no email provider is configured or if sending fails.
 */
export async function sendEmail(
	to: string,
	subject: string,
	text: string,
): Promise<SendEmailResult> {
	const from =
		process.env.EMAIL_FROM ||
		process.env.SMTP_FROM ||
		'no-reply@revivelifevitality.com'

	// --- Resend (preferred) ---
	const resendKey = process.env.RESEND_API_KEY
	if (resendKey) {
		const { Resend } = await import('resend')
		const resend = new Resend(resendKey)

		const { error } = await resend.emails.send({ from, to, subject, text })

		if (error) {
			console.error('AUDIT_LOG', {
				event: 'EMAIL_SEND_FAILED',
				provider: 'resend',
				timestamp: new Date().toISOString(),
				to,
				subject,
				error: error.message,
			})
			throw new Error(`Resend email failed: ${error.message}`)
		}

		console.info('AUDIT_LOG', {
			event: 'EMAIL_SENT',
			provider: 'resend',
			timestamp: new Date().toISOString(),
			to,
			subject,
		})

		return { sent: true, provider: 'resend' }
	}

	// --- SMTP fallback ---
	const host = process.env.SMTP_HOST
	const user = process.env.SMTP_USER
	const pass = process.env.SMTP_PASS
	if (host && user && pass) {
		const nodemailer = await import('nodemailer')
		const transporter = nodemailer.createTransport({
			host,
			port: Number(process.env.SMTP_PORT || 587),
			secure: false,
			auth: { user, pass },
		})

		await transporter.sendMail({ from, to, subject, text })

		console.info('AUDIT_LOG', {
			event: 'EMAIL_SENT',
			provider: 'smtp',
			timestamp: new Date().toISOString(),
			to,
			subject,
		})

		return { sent: true, provider: 'smtp' }
	}

	// --- No provider configured ---
	console.error('AUDIT_LOG', {
		event: 'EMAIL_NO_PROVIDER',
		timestamp: new Date().toISOString(),
		to,
		subject,
		hint: 'Set RESEND_API_KEY or SMTP_HOST+SMTP_USER+SMTP_PASS',
	})

	throw new Error(
		'No email provider configured. Set RESEND_API_KEY or SMTP credentials.',
	)
}

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, message: "Resend API key not configured." };
  }

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    subject,
    html,
  });
}

export async function sendPropertyInquiryEmail({
  propertyTitle,
  customerName,
  customerEmail,
  customerPhone,
  message,
}: {
  propertyTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
}) {
  const safePropertyTitle = escapeHtml(propertyTitle);
  const safeCustomerName = escapeHtml(customerName);
  const safeCustomerEmail = escapeHtml(customerEmail);
  const safeCustomerPhone = escapeHtml(customerPhone);
  const safeMessage = escapeHtml(message);

  return sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL ?? "Bennyhomes5@gmail.com",
    subject: `New property inquiry for ${safePropertyTitle}`,
    html: `
      <h2>New Property Inquiry</h2>
      <p><strong>Property:</strong> ${safePropertyTitle}</p>
      <p><strong>Name:</strong> ${safeCustomerName}</p>
      <p><strong>Email:</strong> ${safeCustomerEmail}</p>
      <p><strong>Phone:</strong> ${safeCustomerPhone}</p>
      <p><strong>Message:</strong> ${safeMessage}</p>
    `,
  });
}

export async function sendViewingRequestEmail({
  propertyTitle,
  customerName,
  preferredDate,
  preferredTime,
}: {
  propertyTitle: string;
  customerName: string;
  preferredDate: string;
  preferredTime: string;
}) {
  const safePropertyTitle = escapeHtml(propertyTitle);
  const safeCustomerName = escapeHtml(customerName);
  const safePreferredDate = escapeHtml(preferredDate);
  const safePreferredTime = escapeHtml(preferredTime);

  return sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL ?? "Bennyhomes5@gmail.com",
    subject: `Viewing request for ${safePropertyTitle}`,
    html: `
      <h2>Viewing Request</h2>
      <p><strong>Property:</strong> ${safePropertyTitle}</p>
      <p><strong>Customer:</strong> ${safeCustomerName}</p>
      <p><strong>Date:</strong> ${safePreferredDate}</p>
      <p><strong>Time:</strong> ${safePreferredTime}</p>
    `,
  });
}

export async function sendContactMessageEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject ?? "General Inquiry");
  const safeMessage = escapeHtml(message);

  return sendEmail({
    to: process.env.ADMIN_NOTIFICATION_EMAIL ?? "Bennyhomes5@gmail.com",
    subject: `New contact message: ${safeSubject}`,
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <p><strong>Message:</strong> ${safeMessage}</p>
    `,
  });
}

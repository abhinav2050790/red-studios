import { STUDIO_CONFIG } from "@/content/studio";

export interface BookingLinkConfig {
  email?: string;
  subject?: string;
  body?: string;
}

export const DEFAULT_BOOKING_BODY = `Hi Red Studios team,

I'd like to book a discovery call.

Name: 
Company: 
Phone / WhatsApp: 
What I need help with: 
Preferred date and time (with time zone): 

Looking forward to hearing from you.`;

export const DEFAULT_BOOKING_SUBJECT = "Call Request – Red Studios";

/**
 * Generates the direct Gmail compose web link and the mailto fallback.
 * Strictly uses encodeURIComponent per the technical specification.
 */
export function getBookingLinks(config?: BookingLinkConfig) {
  const to = config?.email || STUDIO_CONFIG.email;
  const subject = config?.subject || DEFAULT_BOOKING_SUBJECT;
  const body = config?.body || DEFAULT_BOOKING_BODY;

  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  const mailtoUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

  return {
    gmailComposeUrl,
    mailtoUrl,
    toEmail: to,
    subject,
    body,
  };
}

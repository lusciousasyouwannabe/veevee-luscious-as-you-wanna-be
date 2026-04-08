/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Img,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "VeeVee Luscious"

// Default values — overridden by DB settings when available
const DEFAULTS = {
  subject: "Welcome to VeeVee Luscious — Here's Your 10% Off ✨",
  previewText: "Welcome to the VeeVee Luscious family — here's your 10% off code ✨",
  heading: "Welcome to the Family ✨",
  heroBody: "You've just taken the first step toward a more luscious you. We're so glad you're here.",
  discountLabel: "Your Exclusive 10% Off Code",
  discountCode: "LUSCIOUS10",
  discountNote: "Use this code at checkout on your first order. Because you deserve something beautiful.",
  bodyParagraph1: "At VeeVee Luscious, we believe self-care isn't a luxury — it's a love language. Our handcrafted bath and body products are designed to nourish your skin and calm your spirit.",
  bodyParagraph2: "As part of our inner circle, you'll be the first to know about new launches, VIP offers, and exclusive collections.",
  signoff: "Stay luscious,",
  signoffName: "The VeeVee Luscious Team",
}

export interface NewsletterWelcomeProps {
  subject?: string
  previewText?: string
  heading?: string
  heroBody?: string
  discountLabel?: string
  discountCode?: string
  discountNote?: string
  bodyParagraph1?: string
  bodyParagraph2?: string
  signoff?: string
  signoffName?: string
}

const NewsletterWelcomeEmail = (props: NewsletterWelcomeProps) => {
  const d = { ...DEFAULTS, ...props }
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{d.previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src="https://jpujaqqvbfwvtzsxvxap.supabase.co/storage/v1/object/public/email-assets/veevee-logo.png"
              width="180"
              height="auto"
              alt="VeeVee Luscious"
              style={logo}
            />
          </Section>

          <Section style={heroSection}>
            <Heading style={h1}>{d.heading}</Heading>
            <Text style={heroText}>{d.heroBody}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={discountSection}>
            <Text style={discountLabelStyle}>{d.discountLabel}</Text>
            <Text style={discountCodeStyle}>{d.discountCode}</Text>
            <Text style={discountNoteStyle}>{d.discountNote}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={bodySection}>
            <Text style={text}>{d.bodyParagraph1}</Text>
            <Text style={text}>{d.bodyParagraph2}</Text>
          </Section>

          <Section style={signoffSection}>
            <Text style={signoffStyle}>{d.signoff}</Text>
            <Text style={signoffNameStyle}>{d.signoffName}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: NewsletterWelcomeEmail,
  subject: (data: Record<string, any>) => data?.subject || DEFAULTS.subject,
  displayName: 'Newsletter welcome',
  previewData: { ...DEFAULTS },
  editableFields: [
    { key: 'subject', label: 'Subject Line', type: 'text' },
    { key: 'previewText', label: 'Preview Text', type: 'text' },
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'heroBody', label: 'Hero Body Text', type: 'textarea' },
    { key: 'discountLabel', label: 'Discount Label', type: 'text' },
    { key: 'discountCode', label: 'Discount Code', type: 'text' },
    { key: 'discountNote', label: 'Discount Note', type: 'textarea' },
    { key: 'bodyParagraph1', label: 'Body Paragraph 1', type: 'textarea' },
    { key: 'bodyParagraph2', label: 'Body Paragraph 2', type: 'textarea' },
    { key: 'signoff', label: 'Sign-off', type: 'text' },
    { key: 'signoffName', label: 'Sign-off Name', type: 'text' },
  ],
  defaults: DEFAULTS,
} satisfies TemplateEntry

// ── Styles ──────────────────────────────────────────────────────────────
const goldColor = '#C5944A'
const goldLight = '#D4A95E'
const darkText = '#1A1A1A'
const mutedText = '#6B6355'

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
}

const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px 24px',
}

const logoSection: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo: React.CSSProperties = {
  margin: '0 auto',
}

const heroSection: React.CSSProperties = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const h1: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '28px',
  fontWeight: '700',
  color: darkText,
  margin: '0 0 12px',
  lineHeight: '1.3',
}

const heroText: React.CSSProperties = {
  fontSize: '15px',
  color: mutedText,
  lineHeight: '1.6',
  margin: '0',
}

const divider: React.CSSProperties = {
  borderTop: `1px solid ${goldLight}`,
  margin: '28px 0',
  opacity: 0.4,
}

const discountSection: React.CSSProperties = {
  textAlign: 'center' as const,
  padding: '16px 0',
}

const discountLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: goldColor,
  fontWeight: '600',
  margin: '0 0 12px',
}

const discountCodeStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: '36px',
  fontWeight: '700',
  color: darkText,
  letterSpacing: '0.08em',
  margin: '0 0 12px',
  padding: '12px 24px',
  border: `2px dashed ${goldColor}`,
  display: 'inline-block',
}

const discountNoteStyle: React.CSSProperties = {
  fontSize: '13px',
  color: mutedText,
  lineHeight: '1.5',
  margin: '8px 0 0',
}

const bodySection: React.CSSProperties = {
  marginBottom: '24px',
}

const text: React.CSSProperties = {
  fontSize: '14px',
  color: mutedText,
  lineHeight: '1.7',
  margin: '0 0 16px',
}

const signoffSection: React.CSSProperties = {
  marginTop: '16px',
}

const signoffStyle: React.CSSProperties = {
  fontSize: '14px',
  color: darkText,
  fontStyle: 'italic',
  margin: '0 0 4px',
}

const signoffNameStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: goldColor,
  margin: '0',
}

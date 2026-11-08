export interface SafeguardCheckResult {
  riskLevel: 'verified' | 'unverified' | 'suspicious' | 'high_risk';
  riskScore: number; // 0 (safest) to 100 (extreme danger)
  redFlags: string[];
  positiveIndicators: string[];
  verdictSummary: string;
  actionAdvice: string;
}

const HIGH_RISK_PATTERNS = [
  { regex: /(registration|processing|interview|application|badge|uniform)\s*(fee|payment|charge)/i, label: 'Demands upfront payment or registration fee before interview/offer' },
  { regex: /(send|wire|transfer)\s*(money|crypto|usdt|bitcoin|funds|gift\s*card)/i, label: 'Requests money transfer, cryptocurrency, or gift cards' },
  { regex: /whatsapp\s*(only|interview|recruiter|dm)|contact\s*(via|\+)\d{7,}/i, label: 'Uses WhatsApp or informal messaging channel as primary interview venue' },
  { regex: /(earn|make)\s*(\$|€|£|₦)?\s*\d{3,}\s*(daily|per day|hourly|a day)\s*(with no experience|without experience|just 1 hour)/i, label: 'Unrealistic income promise with minimal effort or no skills required' },
  { regex: /(bank\s*pin|bvn|otp|password|cvv|account\s*login)/i, label: 'Requests sensitive financial credentials (PIN, BVN, OTP, or password)' },
  { regex: /(guaranteed\s*visa|100%\s*visa\s*approval|guaranteed\s*scholarship)/i, label: 'Guarantees visa approval or employment outcomes (illegal promise)' },
  { regex: /urgently\s*(pay|send|transfer)|limited\s*slots?\s*hurry\s*before\s*it\s*expires/i, label: 'Artificial urgency and high-pressure tactics to force hasty payment' },
];

const TRUSTED_DOMAINS = [
  'edu',
  'gov',
  'org',
  'un.org',
  'who.int',
  'chevening.org',
  'fulbrightprogram.org',
  'alxafrica.com',
  'coursera.org',
  'edx.org',
  'microsoft.com',
  'google.com',
  'tonyelumelufoundation.org',
  'mastercardfdn.org',
];

const SUSPICIOUS_DOMAINS = [
  'blogspot.com',
  'wordpress.com',
  'wixsite.com',
  'weebly.com',
  'forms.gle', // When used as the only "corporate website"
  't.me',
  'bit.ly',
  'tinyurl.com',
];

export function evaluateLocalSafeguardRules(text: string, url: string = ''): SafeguardCheckResult {
  const redFlags: string[] = [];
  const positiveIndicators: string[] = [];
  let riskScore = 10; // Baseline caution

  const fullContent = `${text} ${url}`.trim();

  // Pattern detection
  for (const item of HIGH_RISK_PATTERNS) {
    if (item.regex.test(fullContent)) {
      redFlags.push(item.label);
      riskScore += 25;
    }
  }

  // URL checks
  if (url) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostname = parsed.hostname.toLowerCase();

      const isTrusted = TRUSTED_DOMAINS.some((d) => hostname.endsWith(d));
      if (isTrusted) {
        positiveIndicators.push(`Domain has trusted educational, government, or verified institutional top-level structure (${hostname})`);
        riskScore = Math.max(0, riskScore - 20);
      }

      const isSuspiciousHost = SUSPICIOUS_DOMAINS.some((d) => hostname.endsWith(d));
      if (isSuspiciousHost) {
        redFlags.push(`Uses free web hosting or URL shortener instead of an official custom corporate/university domain (${hostname})`);
        riskScore += 20;
      }
    } catch {
      redFlags.push('Invalid or unresolvable web address provided');
      riskScore += 10;
    }
  }

  // Check for email red flags
  if (/(@gmail\.com|@yahoo\.com|@hotmail\.com|@outlook\.com)/i.test(fullContent) && /apply\s*to|send\s*cv\s*to/i.test(fullContent)) {
    redFlags.push('Recruiter uses a free public email provider (Gmail/Yahoo) instead of an official organizational domain');
    riskScore += 15;
  }

  // Clamp score 0 - 100
  riskScore = Math.min(100, Math.max(0, riskScore));

  let riskLevel: SafeguardCheckResult['riskLevel'] = 'unverified';
  let verdictSummary = '';
  let actionAdvice = '';

  if (riskScore >= 60 || redFlags.length >= 2) {
    riskLevel = 'high_risk';
    verdictSummary = 'HIGH-RISK FRAUD INDICATORS DETECTED. Strong signals of an employment/scholarship scam.';
    actionAdvice = 'DO NOT SEND MONEY, BVN, NIN, OR PASSWORDS. Legitimate employers, universities, and grant foundations NEVER charge job application or recruitment fees.';
  } else if (riskScore >= 35 || redFlags.length === 1) {
    riskLevel = 'suspicious';
    verdictSummary = 'SUSPICIOUS LISTING. Contains non-standard recruitment practices that require extreme caution.';
    actionAdvice = 'Verify this opportunity directly by visiting the organization\'s official corporate careers portal. Do not communicate through unverified personal WhatsApp numbers.';
  } else if (positiveIndicators.length > 0 && redFlags.length === 0) {
    riskLevel = 'verified';
    verdictSummary = 'INITIAL INDICATORS LOOK STANDARD. Verified domain structure with no automated red flags detected.';
    actionAdvice = 'Always verify that the application portal uses HTTPS and double-check deadline details on the official organization domain.';
  } else {
    riskLevel = 'unverified';
    verdictSummary = 'UNVERIFIED LISTING. Insufficient data to verify the hosting organization\'s authenticity.';
    actionAdvice = 'Treat with healthy scrutiny. Search for the organization on official corporate registries or official LinkedIn company pages.';
  }

  return {
    riskLevel,
    riskScore,
    redFlags,
    positiveIndicators,
    verdictSummary,
    actionAdvice,
  };
}

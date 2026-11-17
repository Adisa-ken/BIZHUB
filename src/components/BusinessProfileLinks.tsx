import React from 'react';
import {
  Facebook,
  Globe,
  Instagram,
  MessageCircle,
  Phone,
  Star,
} from 'lucide-react';
import { getCopy } from '../i18n/translations';
import type { Language } from '../theme/tokens';

export interface BusinessLinkSet {
  instagram?: string;
  facebook?: string;
  googleReview?: string;
  website?: string;
  phone?: string;
  whatsapp?: string;
}

interface BusinessProfileLinksProps {
  lang: Language;
  links: BusinessLinkSet;
  onDemoLinkClick?: (channel: string) => void;
}

/**
 * Reusable design-system primitive for business profile action links:
 * Instagram, Facebook, Google Review, Website, Call, WhatsApp.
 */
export const BusinessProfileLinks: React.FC<BusinessProfileLinksProps> = ({
  lang,
  links,
  onDemoLinkClick,
}) => {
  const labels = getCopy(lang).businessLinks;

  const items = [
    { key: 'instagram', label: labels.instagram, href: links.instagram, icon: Instagram },
    { key: 'facebook', label: labels.facebook, href: links.facebook, icon: Facebook },
    { key: 'googleReview', label: labels.googleReview, href: links.googleReview, icon: Star },
    { key: 'website', label: labels.website, href: links.website, icon: Globe },
    { key: 'call', label: labels.call, href: links.phone ? `tel:${links.phone}` : undefined, icon: Phone },
    { key: 'whatsapp', label: labels.whatsapp, href: links.whatsapp, icon: MessageCircle },
  ].filter((item) => Boolean(item.href));

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ key, label, href, icon: Icon }) => (
        <a
          key={key}
          href={href}
          onClick={(e) => {
            if (onDemoLinkClick) {
              e.preventDefault();
              onDemoLinkClick(label);
            }
          }}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--bh-text)] whitespace-nowrap shrink-0 transition-colors hover:border-[var(--bh-coral)]"
        >
          <Icon className="h-4 w-4 shrink-0 text-[var(--bh-coral-text)]" aria-hidden="true" />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
};

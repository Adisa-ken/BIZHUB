import React, { useId, useState } from 'react';
import { CheckCircle2, ChevronDown, Send } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/businesses';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';
import {
  validateHelpMessage,
  type HelpMessageErrorKey,
  type HelpMessageInput,
} from '../../utils/clientLogic';

interface ClientHelpViewProps {
  lang: Language;
  defaultEmail?: string | null;
  defaultName?: string;
  onMessageSent: (senderName: string) => void;
}

export const ClientHelpView: React.FC<ClientHelpViewProps> = ({
  lang,
  defaultEmail = '',
  defaultName = '',
  onMessageSent,
}) => {
  const t = getCopy(lang).client.help;
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [form, setForm] = useState<HelpMessageInput>({
    name: defaultName,
    email: defaultEmail ?? '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof HelpMessageInput, HelpMessageErrorKey>>>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = validateHelpMessage(form);
    if (!res.valid) {
      setErrors(res.errors);
      return;
    }
    setErrors({});
    setSent(true);
    onMessageSent(form.name.trim());
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl">
        {t.title}
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* FAQ Accordion List */}
        <section aria-labelledby="faq-heading" className={`${UI_CLASSES.card} p-5 sm:p-6 lg:col-span-6`}>
          <h2 id="faq-heading" className="text-lg font-extrabold text-[var(--bh-text)]">
            {t.faqHeading}
          </h2>
          <div className="mt-4 divide-y divide-[var(--bh-border)]">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id} className="py-2 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    className="flex min-h-[48px] w-full items-center justify-between gap-3 py-2 text-start text-sm font-bold text-[var(--bh-text)]"
                  >
                    <span>{lang === 'ar' ? item.questionAr : item.questionEn}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[var(--bh-coral-text)] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="pb-3 text-sm leading-relaxed text-[var(--bh-text-muted)]">
                      {lang === 'ar' ? item.answerAr : item.answerEn}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Send us a message form */}
        <section aria-labelledby="contact-form-heading" className={`${UI_CLASSES.card} p-5 sm:p-6 lg:col-span-6`}>
          <h2 id="contact-form-heading" className="text-lg font-extrabold text-[var(--bh-text)]">
            {t.formHeading}
          </h2>
          <p className="mt-1 text-xs text-[var(--bh-text-muted)]">{t.formSubtitle}</p>

          {sent ? (
            <div className="mt-6 space-y-4 rounded-[16px] border border-[var(--bh-success)]/40 bg-[var(--bh-success-soft)] p-5 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--bh-success)]" aria-hidden="true" />
              <div>
                <h3 className="text-base font-bold text-[var(--bh-text)]">{t.sentTitle}</h3>
                <p className="mt-1 text-sm text-[var(--bh-text-muted)]">{t.sentBody}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, message: '' }));
                  setSent(false);
                }}
                className={UI_CLASSES.pillButtonSecondary}
              >
                {t.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div>
                <label htmlFor={nameId} className="mb-1.5 block text-sm font-semibold text-[var(--bh-text)]">
                  {t.nameLabel}
                </label>
                <input
                  id={nameId}
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder={t.namePlaceholder}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  className={UI_CLASSES.inputPill}
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 text-xs font-semibold text-[var(--bh-error)]">
                    {t.errors[errors.name]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={emailId} className="mb-1.5 block text-sm font-semibold text-[var(--bh-text)]">
                  {t.emailLabel}
                </label>
                <input
                  id={emailId}
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, email: e.target.value }));
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder={t.emailPlaceholder}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className={UI_CLASSES.inputPill}
                />
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-xs font-semibold text-[var(--bh-error)]">
                    {t.errors[errors.email]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={messageId} className="mb-1.5 block text-sm font-semibold text-[var(--bh-text)]">
                  {t.messageLabel}
                </label>
                <textarea
                  id={messageId}
                  rows={4}
                  value={form.message}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, message: e.target.value }));
                    if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                  }}
                  placeholder={t.messagePlaceholder}
                  aria-invalid={errors.message ? 'true' : 'false'}
                  className="w-full rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-bg)] px-5 py-3 text-[15px] text-[var(--bh-text)] placeholder:text-[var(--bh-text-muted)] focus:border-[var(--bh-coral)] focus:outline-none"
                />
                {errors.message && (
                  <p role="alert" className="mt-1.5 text-xs font-semibold text-[var(--bh-error)]">
                    {t.errors[errors.message]}
                  </p>
                )}
              </div>

              <button type="submit" className={`${UI_CLASSES.pillButtonPrimary} w-full`}>
                <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.sendButton}</span>
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

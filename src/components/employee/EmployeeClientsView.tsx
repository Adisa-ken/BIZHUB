import React, { useMemo, useState } from 'react';
import { Pencil, Phone, Search, X } from 'lucide-react';
import type { EmployeeClientRecord, EmployeeIndustryDataset } from '../../data/employee';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type EmployeeIndustryId, type Language } from '../../theme/tokens';
import { filterEmployeeClients } from '../../utils/employeeLogic';

interface EmployeeClientsViewProps {
  lang: Language;
  industry: EmployeeIndustryId;
  dataset: EmployeeIndustryDataset;
  clients: EmployeeClientRecord[];
  onSaveClientNote: (clientId: string, nextNote: string) => void;
}

export const EmployeeClientsView: React.FC<EmployeeClientsViewProps> = ({
  lang,
  industry,
  dataset,
  clients,
  onSaveClientNote,
}) => {
  const copy = getCopy(lang);
  const t = copy.employee.clients;
  const industryCopy = copy.employee.industries[industry];
  const workplace = lang === 'ar' ? dataset.workplaceAr : dataset.workplaceEn;

  const [query, setQuery] = useState('');
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  const visibleClients = useMemo(
    () => filterEmployeeClients(clients, query),
    [clients, query]
  );

  const startEditing = (client: EmployeeClientRecord) => {
    setEditingClientId(client.id);
    setDraftNote(lang === 'ar' ? client.notesAr : client.notesEn);
  };

  const handleSave = (clientId: string) => {
    if (draftNote.trim().length === 0) return;
    onSaveClientNote(clientId, draftNote);
    setEditingClientId(null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      {/* Header & Search */}
      <section aria-labelledby="employee-clients-heading" className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
            {industryCopy.label} · {workplace}
          </p>
          <h1
            id="employee-clients-heading"
            className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl"
          >
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--bh-text-muted)]">
            {industryCopy.clientsSubtitle}
          </p>
        </div>

        <div className="relative">
          <label htmlFor="employee-clients-search" className="sr-only">
            {t.searchLabel}
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 start-4 h-4 w-4 -translate-y-1/2 text-[var(--bh-text-muted)]"
            aria-hidden="true"
          />
          <input
            id="employee-clients-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`${UI_CLASSES.inputPill} ps-11 pe-12`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t.clearSearch}
              className="absolute top-1/2 end-2 inline-flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-full text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      {/* Client Cards */}
      {visibleClients.length === 0 ? (
        <div className={`${UI_CLASSES.card} p-8 text-center`}>
          <p className="text-base font-extrabold text-[var(--bh-text)]">{t.emptyTitle}</p>
          <p className="mt-1 text-sm text-[var(--bh-text-muted)]">{t.emptyBody}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleClients.map((client) => {
            const name = lang === 'ar' ? client.nameAr : client.nameEn;
            const lastVisit = lang === 'ar' ? client.lastVisitAr : client.lastVisitEn;
            const favorite = lang === 'ar' ? client.favoriteServiceAr : client.favoriteServiceEn;
            const notes = lang === 'ar' ? client.notesAr : client.notesEn;
            const isEditing = editingClientId === client.id;

            return (
              <article
                key={client.id}
                className={`${UI_CLASSES.card} flex flex-col justify-between gap-4 p-5`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-base font-extrabold text-[var(--bh-text)] sm:text-lg">
                        {name}
                      </h2>
                      <p className="tabular-nums mt-0.5 text-xs text-[var(--bh-text-muted)]">
                        {client.visitsCount} {t.visitsLabel} · {t.lastVisitLabel}: {lastVisit}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--bh-text-muted)]">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      <span dir="ltr" className="tabular-nums">
                        {client.phone}
                      </span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
                    {t.favoriteLabel}: {favorite}
                  </p>

                  <div className="rounded-[14px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--bh-amber-text)]">
                        {t.notesLabel}
                      </span>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => startEditing(client)}
                          aria-label={`${t.editNotes} — ${name}`}
                          className="inline-flex min-h-[36px] items-center gap-1 rounded-full px-2.5 text-xs font-semibold text-[var(--bh-coral-text)] hover:bg-[var(--bh-surface)]"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.editNotes}</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-2 space-y-2.5">
                        <label htmlFor={`note-edit-${client.id}`} className="sr-only">
                          {t.notesLabel}
                        </label>
                        <textarea
                          id={`note-edit-${client.id}`}
                          rows={3}
                          value={draftNote}
                          onChange={(e) => setDraftNote(e.target.value)}
                          placeholder={t.notePlaceholder}
                          className="w-full rounded-[12px] border border-[var(--bh-border)] bg-[var(--bh-surface)] px-3 py-2 text-sm text-[var(--bh-text)] focus:border-[var(--bh-coral)] focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSave(client.id)}
                            className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] px-4 py-2 text-xs`}
                          >
                            {t.saveNotes}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingClientId(null)}
                            className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-4 py-2 text-xs`}
                          >
                            {t.cancelEdit}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--bh-text)]">
                        {notes}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

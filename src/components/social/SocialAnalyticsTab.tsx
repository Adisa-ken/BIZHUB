import React, { useMemo, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  SOCIAL_CHANNEL_META,
  type SocialChannelAnalytics,
  type SocialPostRecord,
} from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import {
  SOCIAL_CHANNEL_IDS,
  UI_CLASSES,
  type Language,
  type SocialChannelId,
} from '../../theme/tokens';
import { computeSocialAnalyticsTotals } from '../../utils/socialHubLogic';

interface SocialAnalyticsTabProps {
  lang: Language;
  analytics: SocialChannelAnalytics[];
  posts: SocialPostRecord[];
}

export const SocialAnalyticsTab: React.FC<SocialAnalyticsTabProps> = ({
  lang,
  analytics,
  posts,
}) => {
  const t = getCopy(lang).socialHub.analytics;
  const [selectedChannel, setSelectedChannel] = useState<'all' | SocialChannelId>('all');

  const totals = useMemo(
    () => computeSocialAnalyticsTotals(analytics, posts),
    [analytics, posts]
  );

  const visibleAnalytics =
    selectedChannel === 'all'
      ? analytics
      : analytics.filter((a) => a.channel === selectedChannel);

  const formatCompact = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--bh-text)]">{t.title}</h2>
          <p className="mt-0.5 text-xs text-[var(--bh-text-muted)]">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            aria-pressed={selectedChannel === 'all'}
            onClick={() => setSelectedChannel('all')}
            className={`min-h-[44px] rounded-full px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
              selectedChannel === 'all'
                ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
            }`}
          >
            {t.allChannelsFilter}
          </button>
          {SOCIAL_CHANNEL_IDS.map((ch) => {
            const meta = SOCIAL_CHANNEL_META[ch];
            const active = selectedChannel === ch;
            return (
              <button
                key={ch}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedChannel(ch)}
                className={`min-h-[44px] rounded-full px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                    : 'border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                }`}
              >
                {lang === 'ar' ? meta.nameAr : meta.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className={`${UI_CLASSES.card} p-4`}>
          <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
            {t.kpiReach}
          </p>
          <p className="tabular-nums mt-1 text-2xl font-extrabold text-[var(--bh-text)]">
            {formatCompact(totals.totalReach)}
          </p>
        </div>
        <div className={`${UI_CLASSES.card} p-4`}>
          <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
            {t.kpiEngagement}
          </p>
          <p className="tabular-nums mt-1 text-2xl font-extrabold text-[var(--bh-amber-text)]">
            {formatCompact(totals.totalEngagement)}
          </p>
        </div>
        <div className={`${UI_CLASSES.card} p-4`}>
          <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
            {t.kpiRate}
          </p>
          <p className="tabular-nums mt-1 text-2xl font-extrabold text-[var(--bh-success)]">
            {totals.avgEngagementRate}%
          </p>
        </div>
        <div className={`${UI_CLASSES.card} p-4`}>
          <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
            {t.kpiScheduled}
          </p>
          <p className="tabular-nums mt-1 text-2xl font-extrabold text-[var(--bh-coral-text)]">
            {totals.scheduledCount}
          </p>
        </div>
      </div>

      {/* Reach & Engagement Chart Per Channel */}
      <section
        aria-labelledby="channel-chart-heading"
        className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[var(--bh-coral-text)]" aria-hidden="true" />
            <h3
              id="channel-chart-heading"
              className="text-base font-extrabold text-[var(--bh-text)]"
            >
              {t.chartHeading}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-[var(--bh-text)]">
              <span
                className="h-2.5 w-2.5 rounded-sm bg-[var(--bh-coral)]"
                aria-hidden="true"
              />
              {t.reachLegend}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[var(--bh-text)]">
              <span
                className="h-2.5 w-2.5 rounded-sm bg-[var(--bh-amber)]"
                aria-hidden="true"
              />
              {t.engagementLegend}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {visibleAnalytics.map((item) => {
            const meta = SOCIAL_CHANNEL_META[item.channel];
            const channelName = lang === 'ar' ? meta.nameAr : meta.nameEn;
            const reachWidthPct = Math.max(8, Math.round((item.reach / totals.maxReach) * 100));
            const engagementWidthPct = Math.max(
              5,
              Math.round((item.engagement / totals.maxReach) * 100 * 3)
            );
            const engRate = ((item.engagement / item.reach) * 100).toFixed(1);

            return (
              <div
                key={item.channel}
                className="space-y-2 rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border px-2 text-[11px] font-extrabold ${meta.accentClass}`}
                    >
                      {meta.shortCode}
                    </span>
                    <span className="text-sm font-extrabold text-[var(--bh-text)]">
                      {channelName}
                    </span>
                    <span className="tabular-nums inline-flex items-center gap-1 text-xs font-semibold text-[var(--bh-success)]">
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                      +{item.growthPercent}%
                    </span>
                  </div>

                  <div className="tabular-nums flex items-center gap-3 text-xs font-bold">
                    <span className="text-[var(--bh-text)]">
                      {t.reachLegend}: {item.reach.toLocaleString()}
                    </span>
                    <span className="text-[var(--bh-amber-text)]">
                      {t.engagementLegend}: {item.engagement.toLocaleString()} ({engRate}%)
                    </span>
                  </div>
                </div>

                {/* Visual Bars */}
                <div className="space-y-1.5" aria-hidden="true">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--bh-surface)]">
                    <div
                      className="h-full rounded-full bg-[var(--bh-coral)]"
                      style={{ width: `${reachWidthPct}%` }}
                    />
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bh-surface)]">
                    <div
                      className="h-full rounded-full bg-[var(--bh-amber)]"
                      style={{ width: `${Math.min(100, engagementWidthPct)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--bh-text-muted)]">
                  <span>
                    {t.topPostLabel}:{' '}
                    <strong className="font-semibold text-[var(--bh-text)]">
                      {lang === 'ar' ? item.topPostAr : item.topPostEn}
                    </strong>
                  </span>
                  <span className="tabular-nums">
                    {t.bestWindowLabel}: {lang === 'ar' ? item.bestWindowAr : item.bestWindowEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

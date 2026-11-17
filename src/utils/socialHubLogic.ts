import type {
  SocialChannelAnalytics,
  SocialMediaPresetId,
  SocialPostRecord,
  SocialPostStatus,
} from '../data/socialHub';
import type { SocialChannelId } from '../theme/tokens';

export interface MonthCalendarCell {
  dateKey: string;
  dayNumber: number;
  inCurrentMonth: boolean;
}

export interface SocialPostValidationResult {
  valid: boolean;
  errorKey: 'captionOrMediaRequired' | 'channelsRequired' | 'dateTimeRequired' | null;
}

export function buildMonthGrid(year: number, monthIndexZeroBased: number): MonthCalendarCell[] {
  const firstDay = new Date(year, monthIndexZeroBased, 1);
  const startWeekday = firstDay.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, monthIndexZeroBased + 1, 0).getDate();
  const prevMonthDays = new Date(year, monthIndexZeroBased, 0).getDate();

  const cells: MonthCalendarCell[] = [];

  const formatDate = (y: number, mZero: number, d: number): string => {
    const dt = new Date(y, mZero, d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    const dayNum = prevMonthDays - i;
    cells.push({
      dateKey: formatDate(year, monthIndexZeroBased - 1, dayNum),
      dayNumber: dayNum,
      inCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({
      dateKey: formatDate(year, monthIndexZeroBased, d),
      dayNumber: d,
      inCurrentMonth: true,
    });
  }

  const trailingCount = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= trailingCount; d += 1) {
    cells.push({
      dateKey: formatDate(year, monthIndexZeroBased + 1, d),
      dayNumber: d,
      inCurrentMonth: false,
    });
  }

  return cells;
}

export function groupScheduledPostsByDate(
  posts: SocialPostRecord[]
): Record<string, SocialPostRecord[]> {
  const map: Record<string, SocialPostRecord[]> = {};
  const ordered = sortSocialPosts(posts.filter((p) => p.status === 'scheduled'));
  for (const post of ordered) {
    if (!map[post.dateKey]) {
      map[post.dateKey] = [];
    }
    map[post.dateKey].push(post);
  }
  return map;
}

export function sortSocialPosts(posts: SocialPostRecord[]): SocialPostRecord[] {
  return [...posts].sort((a, b) => {
    const keyA = `${a.dateKey}T${a.time24}`;
    const keyB = `${b.dateKey}T${b.time24}`;
    return keyA.localeCompare(keyB);
  });
}

export function validateSocialPostInput(input: {
  caption: string;
  channels: SocialChannelId[];
  dateKey: string;
  time24: string;
  mediaPresetId: SocialMediaPresetId | null;
  targetStatus: SocialPostStatus;
}): SocialPostValidationResult {
  if (!input.caption.trim() && !input.mediaPresetId) {
    return { valid: false, errorKey: 'captionOrMediaRequired' };
  }
  if (input.channels.length === 0) {
    return { valid: false, errorKey: 'channelsRequired' };
  }
  if (input.targetStatus === 'scheduled' && (!input.dateKey.trim() || !input.time24.trim())) {
    return { valid: false, errorKey: 'dateTimeRequired' };
  }
  return { valid: true, errorKey: null };
}

export function createSocialPost(
  posts: SocialPostRecord[],
  input: {
    caption: string;
    channels: SocialChannelId[];
    dateKey: string;
    time24: string;
    mediaPresetId: SocialMediaPresetId | null;
    status: SocialPostStatus;
  }
): { posts: SocialPostRecord[]; created: SocialPostRecord } {
  const created: SocialPostRecord = {
    id: `sp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    caption: input.caption.trim(),
    channels: [...input.channels],
    dateKey: input.dateKey || '2026-11-20',
    time24: input.time24 || '12:00',
    status: input.status,
    mediaPresetId: input.mediaPresetId,
    createdAtLabelEn: input.status === 'scheduled' ? 'Scheduled' : 'Saved draft',
    createdAtLabelAr: input.status === 'scheduled' ? 'مجدول' : 'مسودة محفوظة',
  };

  return {
    posts: sortSocialPosts([created, ...posts]),
    created,
  };
}

export function rescheduleSocialPost(
  posts: SocialPostRecord[],
  postId: string,
  nextDateKey: string,
  nextTime24: string
): SocialPostRecord[] {
  const updated = posts.map((post) =>
    post.id === postId
      ? {
          ...post,
          dateKey: nextDateKey,
          time24: nextTime24,
          status: 'scheduled' as const,
          createdAtLabelEn: 'Scheduled',
          createdAtLabelAr: 'مجدول',
        }
      : post
  );
  return sortSocialPosts(updated);
}

export function swapQueuedPostSlots(
  posts: SocialPostRecord[],
  draggedId: string,
  targetId: string
): SocialPostRecord[] {
  if (draggedId === targetId) return posts;
  const dragged = posts.find((p) => p.id === draggedId);
  const target = posts.find((p) => p.id === targetId);
  if (!dragged || !target) return posts;

  const swapped = posts.map((post) => {
    if (post.id === draggedId) {
      return { ...post, dateKey: target.dateKey, time24: target.time24 };
    }
    if (post.id === targetId) {
      return { ...post, dateKey: dragged.dateKey, time24: dragged.time24 };
    }
    return post;
  });

  return sortSocialPosts(swapped);
}

export function deleteSocialPost(
  posts: SocialPostRecord[],
  postId: string
): SocialPostRecord[] {
  return posts.filter((p) => p.id !== postId);
}

export function computeSocialAnalyticsTotals(
  analytics: SocialChannelAnalytics[],
  posts: SocialPostRecord[]
) {
  const totalReach = analytics.reduce((sum, item) => sum + item.reach, 0);
  const totalEngagement = analytics.reduce((sum, item) => sum + item.engagement, 0);
  const avgEngagementRate =
    totalReach > 0 ? Number(((totalEngagement / totalReach) * 100).toFixed(1)) : 0;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const maxReach = analytics.reduce((max, item) => Math.max(max, item.reach), 1);

  return {
    totalReach,
    totalEngagement,
    avgEngagementRate,
    scheduledCount,
    draftCount,
    maxReach,
  };
}

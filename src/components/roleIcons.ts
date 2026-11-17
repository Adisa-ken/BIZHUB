import { Briefcase, Megaphone, Store, User } from 'lucide-react';
import type { ComponentType } from 'react';
import type { ProfileRoleId } from '../theme/tokens';

export const ROLE_ICONS: Record<
  ProfileRoleId,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  client: User,
  employee: Briefcase,
  business_owner: Store,
  creator_marketer: Megaphone,
};

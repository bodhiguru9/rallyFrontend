import { formatDate } from './date-utils';
import type { PurchasedPackage } from '@screens/player-profile/PurchasedPackages/PurchasedPackagesScreen.types';

/** Match backend normalisation (see organiser-service normalizePackageId). */
export function normalizePackageIdForCompare(id: string): string {
  return String(id || '')
    .trim()
    .toUpperCase()
    .replace(/-/g, '');
}

/** Pick first non-empty array of objects, else first empty array, from known API keys. */
function firstArrayOfRecords(obj: Record<string, any> | null | undefined): any[] | null {
  if (!obj || typeof obj !== 'object') {
    return null;
  }
  const keys = [
    'packages',
    'myPackages',
    'purchases',
    'activePackages',
    'ownedPackages',
    'userPurchases',
    'items',
    'results',
    'records',
    'list',
    'rows',
    'data',
    'content',
    'packagePurchases',
    'userPackages',
  ];
  let fallbackEmpty: any[] | null = null;
  for (const k of keys) {
    const v = obj[k];
    if (!Array.isArray(v)) {
      continue;
    }
    if (v.length > 0 && typeof v[0] === 'object' && !Array.isArray(v[0])) {
      return v;
    }
    if (v.length === 0 && fallbackEmpty === null) {
      fallbackEmpty = v;
    }
  }
  if (fallbackEmpty) {
    return fallbackEmpty;
  }
  for (const v of Object.values(obj)) {
    if (
      Array.isArray(v) &&
      v.length > 0 &&
      v.every((x) => x != null && typeof x === 'object' && !Array.isArray(x))
    ) {
      return v;
    }
  }
  return null;
}

function nonEmptyString(v: unknown): string {
  if (v == null) {
    return '';
  }
  const s = String(v).trim();
  return s;
}

/**
 * APIs often return purchase rows with package + organiser fields at the top level only
 * (no nested `package`). Merge those onto a single object for reads.
 */
export function coalescePackageContext(item: any): any {
  const nested =
    item?.package ??
    item?.plan ??
    item?.packageDetails ??
    item?.packageInfo ??
    item?.packageData ??
    item?.Package;
  const fromNested: Record<string, any> =
    nested && typeof nested === 'object' && !Array.isArray(nested)
      ? { ...(nested as Record<string, any>) }
      : {};

  const fromItem: Record<string, any> = {};
  const take = (canonical: string, ...keys: string[]) => {
    if (fromNested[canonical] != null) {
      return;
    }
    for (const k of keys) {
      if (item?.[k] != null) {
        fromItem[canonical] = item[k];
        return;
      }
    }
  };

  take('packageName', 'package_name', 'packageTitle', 'package_title', 'title');
  take('packageId', 'package_id');
  take('validityMonths', 'validity_months', 'durationMonths', 'duration_months');
  take('validity', 'validity_label', 'validityLabel');
  take('maxEvents', 'max_events', 'total_events', 'totalEvents', 'credits');
  take('sports');
  take('eventType', 'event_type');
  take('eventTypes', 'event_types');

  return { ...fromItem, ...fromNested };
}

type OrganizerCandidate = { name: string; avatar?: string; score: number };

function collectOrganizerCandidates(
  node: any,
  depth: number,
  seen: WeakSet<object>,
  out: OrganizerCandidate[],
): void {
  if (depth < 0 || node == null || typeof node !== 'object') {
    return;
  }
  if (seen.has(node as object)) {
    return;
  }
  seen.add(node as object);

  if (Array.isArray(node)) {
    node.forEach((el) => collectOrganizerCandidates(el, depth - 1, seen, out));
    return;
  }

  const o = node as Record<string, any>;
  const name = nonEmptyString(
    o.fullName ?? o.communityName ?? o.displayName ?? o.name ?? o.username ?? o.organiserName ?? o.organizerName,
  );
  if (name) {
    let score = 1;
    if (o.communityName) {
      score += 4;
    }
    if (o.userType === 'organiser' || o.userType === 'organizer') {
      score += 6;
    }
    if (typeof o.userId === 'number') {
      score += 2;
    }
    if (o.eventsCreated != null || o.totalEventsHosted != null) {
      score += 3;
    }
    if (typeof o.profilePic === 'string' && o.profilePic.length > 0) {
      score += 2;
    }
    const pic = o.profilePic ?? o.profile_pic ?? o.avatar ?? o.image ?? o.profileImage;
    out.push({
      name,
      avatar: typeof pic === 'string' && pic.length > 0 ? pic : undefined,
      score,
    });
  }

  for (const [key, v] of Object.entries(o)) {
    if (!v || typeof v !== 'object') {
      continue;
    }
    if (
      Array.isArray(v) &&
      (key === 'events' ||
        key === 'bookedEvents' ||
        key === 'joinedEvents' ||
        key === 'eventIds' ||
        key === 'upcomingEvents' ||
        v.length > 40)
    ) {
      continue;
    }
    collectOrganizerCandidates(v, depth - 1, seen, out);
  }
}

function bestOrganizerFromTree(root: any): { name: string; avatar?: string } | null {
  const out: OrganizerCandidate[] = [];
  collectOrganizerCandidates(root, 5, new WeakSet(), out);
  if (out.length === 0) {
    return null;
  }
  out.sort((a, b) => b.score - a.score);
  const top = out[0];
  return { name: top.name, avatar: top.avatar };
}

/**
 * Organiser label + avatar from nested or flat my-packages / purchase-detail rows.
 */
export function resolveOrganizerFromPurchaseRow(item: any, pkg: any): { name: string; avatar?: string } {
  const nestedCandidates: any[] = [
    pkg.creator,
    pkg.organiser,
    pkg.organizer,
    pkg.organiserUser,
    pkg.organizerUser,
    item.organiser,
    item.organizer,
    item.creator,
    item.host,
    item.organiserDetails,
    item.organizerDetails,
    item.organiserUser,
    item.organizerUser,
    pkg.organiserDetails,
    pkg.organizerDetails,
  ].filter((x) => x != null && typeof x === 'object' && !Array.isArray(x));

  for (const o of nestedCandidates) {
    const name = nonEmptyString(
      o.fullName ??
        o.name ??
        o.communityName ??
        o.displayName ??
        o.username ??
        o.organiserName ??
        o.organizerName,
    );
    if (name) {
      const pic =
        o.profilePic ?? o.profile_pic ?? o.avatar ?? o.image ?? o.profileImage ?? o.photoUrl ?? o.photoURL;
      const avatar = typeof pic === 'string' && pic.length > 0 ? pic : undefined;
      return { name, avatar };
    }
  }

  const flatName = nonEmptyString(
    item.organiserName ??
      item.organizerName ??
      item.organiser_name ??
      item.organizer_name ??
      item.organizer_full_name ??
      item.organiser_full_name ??
      item.creator_name ??
      item.creatorName ??
      item.host_name ??
      item.hostName ??
      item.communityName ??
      item.community_name ??
      pkg.organiserName ??
      pkg.organizerName ??
      pkg.communityName ??
      pkg.community_name ??
      pkg.creatorName ??
      pkg.hostName,
  );

  if (flatName) {
    const pic =
      item.organiserProfilePic ??
      item.organizerProfilePic ??
      item.organiserAvatar ??
      item.organizerAvatar ??
      item.organizer_profile_pic ??
      pkg.organiserProfilePic ??
      pkg.organizerProfilePic ??
      pkg.organizerAvatar;
    const avatar = typeof pic === 'string' && pic.length > 0 ? pic : undefined;
    return { name: flatName, avatar };
  }

  const fromTree = bestOrganizerFromTree({ item, pkg });
  if (fromTree) {
    return fromTree;
  }

  /* Payloads like data.packages[] often omit organiser — UI hides "by …" when empty */
  return { name: '' };
}

/**
 * Normalise GET /api/packages/my-packages (and similar) into list rows.
 */
export function mapPlayerPurchasesResponse(apiData: unknown): PurchasedPackage[] {
  const raw = apiData as any;
  const outer = raw?.data ?? raw;

  let list: any[] = [];

  if (Array.isArray(outer)) {
    list = outer;
  } else if (outer && typeof outer === 'object') {
    const top = outer as Record<string, any>;
    const fromTop = firstArrayOfRecords(top);
    if (fromTop) {
      list = fromTop;
    } else if (top.data != null && typeof top.data === 'object' && !Array.isArray(top.data)) {
      const nested = firstArrayOfRecords(top.data as Record<string, any>);
      if (nested) {
        list = nested;
      } else if (Array.isArray(top.data)) {
        list = top.data;
      }
    }
  }

  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((item, index) => {
    const pkg = coalescePackageContext(item);
    const organizer = resolveOrganizerFromPurchaseRow(item, pkg);

    const packageId = String(
      pkg.packageId ??
        pkg.id ??
        item.packageId ??
        item.planId ??
        item.package_id ??
        '',
    );
    const purchaseId = String(
      item.purchaseId ??
        item.purchase_id ??
        item.userPackageId ??
        item.user_package_id ??
        item._id ??
        item.id ??
        item.transactionId ??
        `${packageId || 'p'}-${index}`,
    );

    const title = String(
      pkg.packageName ?? pkg.name ?? item.packageName ?? item.package_name ?? item.title ?? 'Package',
    );

    const organizerName = organizer.name;
    const organizerAvatar = organizer.avatar;

    const validityMonthsRaw =
      pkg.validityMonths ?? item.validityMonths ?? item.validity_months ?? item.durationMonths;
    const validityMonths = typeof validityMonthsRaw === 'number' ? validityMonthsRaw : undefined;
    const validityStr = nonEmptyString(pkg.validity ?? item.validity ?? item.validity_label);
    const validity =
      validityMonths && validityMonths > 0
        ? `${validityMonths} ${validityMonths === 1 ? 'month' : 'months'}`
        : validityStr || '—';

    const sportsSource = pkg.sports ?? item.sports;
    const sports: string[] = Array.isArray(sportsSource) ? sportsSource.map(String) : [];
    const sport = sports.length ? sports.join(', ') : 'All sports';

    const eventTypeRaw =
      pkg.eventType ?? pkg.eventTypes ?? pkg.event_type ?? pkg.event_types ?? item.eventType ?? item.eventTypes ?? item.event_type ?? item.event_types;
    const eventTypes = Array.isArray(eventTypeRaw)
      ? eventTypeRaw.filter(Boolean).map(String)
      : typeof eventTypeRaw === 'string'
        ? eventTypeRaw.split(',').map((v: string) => v.trim()).filter(Boolean)
        : [];

    const purchasedAt =
      item.purchasedAt ??
      item.purchaseDate ??
      item.purchased_at ??
      item.createdAt ??
      item.paidAt ??
      item.updatedAt;
    const purchasedOn = purchasedAt ? formatDate(purchasedAt, 'date') : '—';

    const expiresRaw =
      item.expiryDate ??
      item.expiresAt ??
      item.validUntil ??
      item.expiry_date ??
      pkg.expiresAt;
    const expiresOn = expiresRaw ? formatDate(expiresRaw, 'date') : undefined;

    const maxEvents =
      Number(item.maxEvents ?? item.totalEvents ?? item.usageTotal ?? item.usage?.total ?? pkg.maxEvents ?? 0) ||
      0;

    /**
     * API shape (my-packages): eventsJoined = used, eventsRemaining = left.
     * Do not treat eventsJoined as "remaining" slots.
     */
    const joined = Number(item.eventsJoined ?? item.usedEvents ?? item.events_joined ?? NaN);
    const remainingSlots = Number(
      item.eventsRemaining ?? item.remainingEvents ?? item.usageRemaining ?? item.usage?.remaining ?? NaN,
    );

    const usedFallback =
      Number(item.usedCredits ?? item.usageUsed ?? item.usage?.used ?? 0) || 0;

    let used: number;
    if (Number.isFinite(joined)) {
      used = Math.max(0, joined);
    } else if (Number.isFinite(remainingSlots) && maxEvents > 0) {
      used = Math.max(0, maxEvents - remainingSlots);
    } else {
      used = usedFallback;
    }

    return {
      purchaseId,
      id: packageId || purchaseId,
      title,
      organizerName,
      organizerAvatar,
      validity,
      sport,
      purchasedOn,
      eventTypes,
      totalEvents: maxEvents,
      usedEvents: used,
      expiresOn,
    };
  });
}

export function findActivePurchaseForPackage(
  apiData: unknown,
  routePackageId: string | undefined,
): { purchaseId: string } | null {
  if (!routePackageId?.trim()) {
    return null;
  }
  const rows = mapPlayerPurchasesResponse(apiData);
  const t = normalizePackageIdForCompare(routePackageId);
  const hit = rows.find((r) => normalizePackageIdForCompare(r.id) === t);
  return hit ? { purchaseId: hit.purchaseId } : null;
}

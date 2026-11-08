/**
 * Discord の権限計算（純粋関数）。
 * 「本人がそのチャンネルを見られるか」を、メンバーのロールとチャンネルの権限設定から計算する。
 * https://discord.com/developers/docs/topics/permissions#permission-overwrites
 */
import type { Channel, Guild, GuildMember, PermissionOverwrite } from "../discord/types";

export const Permission = {
  CreateInstantInvite: 1n << 0n,
  Administrator: 1n << 3n,
  AddReactions: 1n << 6n,
  ViewChannel: 1n << 10n,
  SendMessages: 1n << 11n,
  EmbedLinks: 1n << 14n,
  AttachFiles: 1n << 15n,
  ReadMessageHistory: 1n << 16n,
  ManageWebhooks: 1n << 29n,
  CreatePublicThreads: 1n << 35n,
  SendMessagesInThreads: 1n << 38n,
} as const;

/** Botに付ける権限（README の招待URLに使う）。Manage Channels / Manage Messages / Administrator などは付けない */
export const BOT_PERMISSIONS =
  Permission.ViewChannel |
  Permission.ReadMessageHistory |
  Permission.SendMessages |
  Permission.SendMessagesInThreads |
  Permission.AddReactions |
  Permission.AttachFiles |
  Permission.EmbedLinks |
  Permission.ManageWebhooks |
  Permission.CreatePublicThreads;

const ALL = (1n << 64n) - 1n;

function toBig(value: string | undefined): bigint {
  try {
    return BigInt(value ?? "0");
  } catch {
    return 0n;
  }
}

export function has(perms: bigint, flag: bigint): boolean {
  return (perms & flag) === flag;
}

/** サーバー全体での権限（@everyone ロール + 付いているロール） */
export function computeBasePermissions(guild: Guild, userId: string, member: GuildMember): bigint {
  if (guild.owner_id === userId) return ALL;
  const rolesById = new Map(guild.roles.map((r) => [r.id, r]));
  let perms = toBig(rolesById.get(guild.id)?.permissions); // @everyone のロールIDはサーバーIDと同じ
  for (const roleId of member.roles) {
    perms |= toBig(rolesById.get(roleId)?.permissions);
  }
  if (has(perms, Permission.Administrator)) return ALL;
  return perms;
}

/** チャンネルの上書き設定を適用する（@everyone → ロール → メンバー個人の順） */
export function applyOverwrites(
  base: bigint,
  guildId: string,
  userId: string,
  member: GuildMember,
  overwrites: PermissionOverwrite[] = [],
): bigint {
  if (has(base, Permission.Administrator)) return ALL;
  let perms = base;

  const everyone = overwrites.find((o) => o.type === 0 && o.id === guildId);
  if (everyone) {
    perms &= ~toBig(everyone.deny);
    perms |= toBig(everyone.allow);
  }

  let allow = 0n;
  let deny = 0n;
  const roleSet = new Set(member.roles);
  for (const o of overwrites) {
    if (o.type === 0 && o.id !== guildId && roleSet.has(o.id)) {
      allow |= toBig(o.allow);
      deny |= toBig(o.deny);
    }
  }
  perms &= ~deny;
  perms |= allow;

  const own = overwrites.find((o) => o.type === 1 && o.id === userId);
  if (own) {
    perms &= ~toBig(own.deny);
    perms |= toBig(own.allow);
  }
  return perms;
}

/**
 * そのチャンネルでの最終的な権限。スレッドは親チャンネルの権限を使うので、ここには親（またはスレッドでないチャンネル）を渡す。
 * カテゴリの設定は、Discord が子チャンネルに同期済みの値（permission_overwrites）で判定する。
 */
export function computeChannelPermissions(
  guild: Guild,
  userId: string,
  member: GuildMember,
  channel: Pick<Channel, "permission_overwrites">,
): bigint {
  const base = computeBasePermissions(guild, userId, member);
  const perms = applyOverwrites(base, guild.id, userId, member, channel.permission_overwrites);
  // 見られないチャンネルでは、ほかの権限もすべて無いのと同じ
  if (!has(perms, Permission.ViewChannel)) return 0n;
  return perms;
}

export function canView(perms: bigint): boolean {
  return has(perms, Permission.ViewChannel);
}

export function canReadHistory(perms: bigint): boolean {
  return has(perms, Permission.ViewChannel) && has(perms, Permission.ReadMessageHistory);
}

export type Level = 0 | 1 | 2;

export const LEVEL_NAMES: Record<Level, string> = {
  0: "読む",
  1: "発言する",
  2: "場を作る",
};

/** ロールから権限レベルを出す。AI-まとめ（2）は AI-発言（1）のこともできる */
export function levelFromRoles(roles: string[], roleSpeakId: string, roleSummaryId: string): Level {
  if (roles.includes(roleSummaryId)) return 2;
  if (roles.includes(roleSpeakId)) return 1;
  return 0;
}

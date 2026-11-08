/** このサーバーが使う範囲だけの Discord API の型。 */

export const ChannelType = {
  GuildText: 0,
  GuildCategory: 4,
  GuildAnnouncement: 5,
  AnnouncementThread: 10,
  PublicThread: 11,
  PrivateThread: 12,
  GuildForum: 15,
  GuildMedia: 16,
} as const;

export const THREAD_TYPES: readonly number[] = [
  ChannelType.AnnouncementThread,
  ChannelType.PublicThread,
  ChannelType.PrivateThread,
];

/** スレッドを持てる親チャンネル（普通のチャンネル・お知らせ・フォーラム・メディア） */
export const THREAD_PARENT_TYPES: readonly number[] = [
  ChannelType.GuildText,
  ChannelType.GuildAnnouncement,
  ChannelType.GuildForum,
  ChannelType.GuildMedia,
];

export const FORUM_TYPES: readonly number[] = [ChannelType.GuildForum, ChannelType.GuildMedia];

export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string | null;
  bot?: boolean;
  avatar?: string | null;
}

export interface GuildMember {
  user?: DiscordUser;
  nick?: string | null;
  roles: string[];
}

export interface Role {
  id: string;
  name: string;
  permissions: string;
  position: number;
}

export interface Guild {
  id: string;
  name: string;
  owner_id: string;
  roles: Role[];
}

export interface PermissionOverwrite {
  id: string;
  /** 0 = ロール, 1 = メンバー */
  type: 0 | 1;
  allow: string;
  deny: string;
}

export interface ThreadMetadata {
  archived: boolean;
  locked: boolean;
  auto_archive_duration?: number;
  archive_timestamp?: string;
}

export interface Channel {
  id: string;
  type: number;
  guild_id?: string;
  name?: string;
  topic?: string | null;
  position?: number;
  parent_id?: string | null;
  owner_id?: string;
  last_message_id?: string | null;
  message_count?: number;
  permission_overwrites?: PermissionOverwrite[];
  thread_metadata?: ThreadMetadata;
}

export interface Emoji {
  id: string | null;
  name: string | null;
}

export interface Reaction {
  count: number;
  emoji: Emoji;
  me?: boolean;
}

export interface MessageReference {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
}

export interface Message {
  id: string;
  channel_id: string;
  type: number;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp?: string | null;
  webhook_id?: string;
  mentions?: DiscordUser[];
  mention_roles?: string[];
  mention_everyone?: boolean;
  reactions?: Reaction[];
  attachments?: Attachment[];
  embeds?: unknown[];
  message_reference?: MessageReference;
  referenced_message?: Message | null;
}

/** 普通の発言（0）と返信（19）。それ以外はピン留めの通知などのシステムメッセージ。 */
export const USER_MESSAGE_TYPES: readonly number[] = [0, 19];

export interface Webhook {
  id: string;
  type: number;
  channel_id?: string | null;
  name?: string | null;
  token?: string;
  application_id?: string | null;
}

export interface ThreadList {
  threads: Channel[];
  has_more?: boolean;
}

export interface AllowedMentions {
  parse: Array<"users" | "roles" | "everyone">;
  users?: string[];
  roles?: string[];
}

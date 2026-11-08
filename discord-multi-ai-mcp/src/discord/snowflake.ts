/** Discord の ID（snowflake）と日時の変換。 */

export const DISCORD_EPOCH_MS = 1420070400000n;

export function isSnowflake(value: string): boolean {
  return /^\d{15,25}$/.test(value);
}

/** その時刻ちょうどに作られた最小のID。`after` に渡すと「この時刻より後」になる。 */
export function snowflakeFromDate(date: Date): string {
  const ms = BigInt(date.getTime());
  if (ms <= DISCORD_EPOCH_MS) return "0";
  return ((ms - DISCORD_EPOCH_MS) << 22n).toString();
}

export function dateFromSnowflake(id: string): Date {
  return new Date(Number((BigInt(id) >> 22n) + DISCORD_EPOCH_MS));
}

export function compareSnowflakes(a: string, b: string): number {
  const x = BigInt(a);
  const y = BigInt(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

export function sortByIdAsc<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => compareSnowflakes(a.id, b.id));
}

export function messageLink(guildId: string, channelId: string, messageId: string): string {
  return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

export function channelLink(guildId: string, channelId: string): string {
  return `https://discord.com/channels/${guildId}/${channelId}`;
}

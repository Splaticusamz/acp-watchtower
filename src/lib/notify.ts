export type DiscordNotification = {
  score: number;
  manifestName: string;
  issueCount: number;
  criticalCount: number;
  reportUrl: string;
  previousScore?: number | null;
};

export async function notifyDiscord(
  webhookUrl: string,
  data: DiscordNotification,
): Promise<boolean> {
  const scoreEmoji = data.score >= 80 ? "🟢" : data.score >= 50 ? "🟡" : "🔴";
  const delta =
    data.previousScore != null
      ? ` (${data.score > data.previousScore ? "+" : ""}${data.score - data.previousScore})`
      : "";

  const embed = {
    title: `${scoreEmoji} ACP Watchtower Report`,
    description: `**${data.manifestName}** scored **${data.score}/100**${delta}`,
    color: data.score >= 80 ? 0x22c55e : data.score >= 50 ? 0xeab308 : 0xef4444,
    fields: [
      { name: "Issues", value: `${data.issueCount} total, ${data.criticalCount} critical`, inline: true },
      { name: "Report", value: `[View Report](${data.reportUrl})`, inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "ACP Watchtower • Automated Check" },
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

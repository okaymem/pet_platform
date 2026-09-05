export function getNextScheduledAt(
  scheduledAt: Date,
  interval: number,
  intervalUnit: string,
) {
  const nextScheduledAt = new Date(scheduledAt);

  switch (intervalUnit) {
    case "day":
      nextScheduledAt.setDate(
        nextScheduledAt.getDate() + interval,
      );
      break;

    case "week":
      nextScheduledAt.setDate(
        nextScheduledAt.getDate() + interval * 7,
      );
      break;

    case "month":
      nextScheduledAt.setMonth(
        nextScheduledAt.getMonth() + interval,
      );
      break;

    case "year":
      nextScheduledAt.setFullYear(
        nextScheduledAt.getFullYear() + interval,
      );
      break;
  }

  return nextScheduledAt;
}
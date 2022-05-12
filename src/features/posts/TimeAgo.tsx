import { parseISO, formatDistanceToNow } from "date-fns";

export const TimeAgo = ({ timestamp }: { timestamp: string }) => {
  const timeAgo = (() => {
    if (timestamp) {
      const date = parseISO(timestamp);
      const timePeriod = formatDistanceToNow(date);
      return `${timePeriod} ago`;
    }
    return "";
  })();
  return (
    <span title={timestamp}>
      &nbsp;<i>{timeAgo}</i>
    </span>
  );
};

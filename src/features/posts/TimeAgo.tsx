import { formatDistanceToNow, parseISO } from "date-fns";

export const TimeAgo = ({ createdAt }: { createdAt: string }) => {
	let timeAgo = "";
	if (createdAt) {
		const date = parseISO(createdAt);
		const timePeriod = formatDistanceToNow(date);
		timeAgo = `${timePeriod} ago`;
	}

	return (
		<span>
			<i>{timeAgo}</i>
		</span>
	);
};

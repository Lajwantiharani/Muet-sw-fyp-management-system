import { format, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

const timeDifference = (date) => {
    const now = new Date();
    const createdAt = new Date(date);

    const mins = differenceInMinutes(now, createdAt);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;

    const hours = differenceInHours(now, createdAt);
    if (hours < 24) return `${hours}h ago`;

    const days = differenceInDays(now, createdAt);
    if (days < 30) return `${days}d ago`;

    return format(createdAt, 'dd-MM-yyyy');
}

export default timeDifference;
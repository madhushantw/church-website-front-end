import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const toUtcIso = (date: string): string => {
  return dayjs.tz(date, "YYYY-MM-DDTHH:mm", TIMEZONE).toISOString();
};

export const formatDate = (date: string, format: string): string => {
  return dayjs(date).tz(TIMEZONE).format(format);
};

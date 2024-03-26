export const timeConverter = (val) => {
  const currentDateSeconds = Math.floor(new Date().getTime() / 1000);
  const timeDifferenceSeconds = Math.floor(currentDateSeconds - val);

  if (timeDifferenceSeconds < 0){
    return 'Just now'
  }
  if (timeDifferenceSeconds < 60 && timeDifferenceSeconds > 0) {
    return timeDifferenceSeconds === 1
      ? "1 second ago"
      : `${timeDifferenceSeconds} seconds ago`;
  } else if (timeDifferenceSeconds < 60 * 60) {
    const minutes = Math.floor(timeDifferenceSeconds / 60);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else if (timeDifferenceSeconds < 60 * 60 * 24) {
    const hours = Math.floor(timeDifferenceSeconds / (60 * 60));
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else {
    const days = Math.floor(timeDifferenceSeconds / (60 * 60 * 24));
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
};

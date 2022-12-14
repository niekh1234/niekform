export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

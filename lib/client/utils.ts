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

export const capitalizeFirst = (str: string) => {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
};

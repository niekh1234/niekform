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

export const truncate = (value: any, length: number = 40) => {
  if (!value) {
    return '';
  }

  const str = String(value);

  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

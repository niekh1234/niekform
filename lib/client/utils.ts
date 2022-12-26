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

export const createPagination = (page: number = 1, total: number, perPage: number) => {
  const pages = Math.ceil(total / perPage);
  const currentPage = Math.min(page, pages);

  // create an array of pages, set the current page as disabled and have a maximum of 5 pages in view
  // also add a '...' to indicate that there are more pages between
  const pagination = Array.from({ length: pages }, (_, i) => i + 1)
    .map((p) => {
      if (p === currentPage) {
        return { page: p, current: true };
      }

      if (p === 1 || p === pages) {
        return { page: p };
      }

      // don't really care for improving this code as I like the readability of it
      if (p === currentPage - 1 || p === currentPage + 1) {
        return { page: p };
      }

      if (p === currentPage - 2 || p === currentPage + 2) {
        return { page: p };
      }

      if (p === currentPage - 3 || p === currentPage + 3) {
        return { page: p, ellipsis: true };
      }

      return { page: p, hidden: true };
    })
    .filter((p) => !p.hidden);

  return pagination;
};

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { classNames, createPagination } from 'lib/client/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

type PaginationProps = {
  total: number;
  page: number;
  perPage: number;
  linkBlueprint: string;
};

const formatLink = (linkBlueprint: string, page: number, query: any) => {
  if (query) {
    const queryStr = Object.entries(query)
      .filter(([key]) => key !== 'page' && key !== 'id')
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    if (queryStr) {
      return `${linkBlueprint.replace(':page', page.toString())}&${queryStr}`;
    }
  }

  return linkBlueprint.replace(':page', page.toString());
};

const Pagination = ({ total, page, perPage, linkBlueprint }: PaginationProps) => {
  const router = useRouter();
  const pages = useMemo(() => createPagination(page, total, perPage), [total, page, perPage]);
  const pageAsNumber = page !== undefined ? Number(page) : 1;
  const hasPreviousPage = pageAsNumber > 1;
  const hasNextPage = pageAsNumber < pages[pages.length - 1]?.page;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex items-center justify-between flex-1 sm:hidden">
        <Link
          href={hasPreviousPage ? formatLink(linkBlueprint, pageAsNumber - 1, router.query) : '#'}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Previous
        </Link>

        {total > 0 ? (
          <p className="text-sm text-gray-500">{total} results</p>
        ) : (
          <p className="text-sm text-gray-500">No results</p>
        )}

        <Link
          href={hasNextPage ? formatLink(linkBlueprint, pageAsNumber + 1, router.query) : '#'}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Next
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {total > 0 ? (
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page || 1) * perPage - perPage + 1}</span> to{' '}
              <span className="font-medium">
                {page ? Math.min(total, perPage * page) : Math.min(total, perPage)}
              </span>{' '}
              of <span className="font-medium">{total}</span> results
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-700">No results yet</p>
        )}
        <div>
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm isolate"
            aria-label="Pagination"
          >
            <Link
              href={
                hasPreviousPage ? formatLink(linkBlueprint, pageAsNumber - 1, router.query) : '#'
              }
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-20"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
            </Link>

            {pages.map(({ page, ellipsis, current }) => {
              if (ellipsis) {
                return (
                  <span
                    key={page}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Link
                  key={page}
                  href={formatLink(linkBlueprint, page, router.query)}
                  className={classNames(
                    'relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 border',
                    current
                      ? 'text-emerald-600 border border-green-500 bg-emerald-50 z-10'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  )}
                >
                  {page}
                </Link>
              );
            })}

            <Link
              href={hasNextPage ? formatLink(linkBlueprint, pageAsNumber + 1, router.query) : '#'}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-20"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

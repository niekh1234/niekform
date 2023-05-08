import { classNames } from 'lib/client/utils';
import Link from 'next/link';

type FormTabs = {
  id: string;
};

const tabs = [
  {
    name: 'Submissions',
    href: '/forms/[id]/submissions',
  },
  {
    name: 'Fields',
    href: '/forms/[id]/fields',
  },
  {
    name: 'Integrations',
    href: '/forms/[id]/integrations',
  },
  {
    name: 'Settings',
    href: '/forms/[id]/settings',
  },
];

const buildURL = (href: string, id: string) => {
  return href.replace('[id]', id);
};

const isActive = (href: string, id: string) => {
  return href.replace('[id]', id) === window.location.pathname;
};

const FormTabs = ({ id }: FormTabs) => {
  return (
    <div className="flex mt-8 overflow-auto divide-x rounded-md shadow justify-evenly">
      {tabs.map((tab, index) => {
        return (
          <Link
            key={index}
            href={buildURL(tab.href, id)}
            className={classNames(
              'w-full text-center block p-4 text-xs sm:text-sm md:text-base font-medium text-gray-500 hover:text-gray-700 border-t-2 hover:border-t-gray-400',
              isActive(tab.href, id) ? 'border-t-2 border-t-emerald-500 bg-white' : 'bg-gray-50'
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
};

export default FormTabs;

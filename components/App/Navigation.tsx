import { classNames } from 'lib/client/utils';
import { Dialog, Transition } from '@headlessui/react';
import {
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  HomeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, isAlsoActive: '/' },
  { name: 'Forms', href: '/forms', icon: DocumentTextIcon, isAlsoActive: '/projects' },
];

const isActive = (url: string, currentUrl: string) => {
  if (url === '/') {
    return currentUrl === url;
  }

  return currentUrl.includes(url);
};

type NavigationProps = {
  sidebarOpen: boolean;
  setSidebarOpen: any;
};

const Navigation = ({ sidebarOpen, setSidebarOpen }: NavigationProps) => {
  const { pathname } = useRouter();

  useEffect(() => {
    setSidebarOpen(() => false);
  }, [pathname]);

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 pt-2 -mr-12">
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex items-center flex-shrink-0 px-4">
                    <h1 className="text-2xl text-transparent bg-gradient-to-r bg-clip-text from-emerald-600 to-teal-500 font-black">
                      NiekForm
                    </h1>
                  </div>
                  <nav className="px-2 mt-5 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          isActive(item.href, pathname) || isActive(item.isAlsoActive, pathname)
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                          'group flex items-center rounded-md px-2 py-2 text-base font-medium'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            isActive(item.href, pathname) || isActive(item.isAlsoActive, pathname)
                              ? 'text-gray-500'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'mr-4 h-6 w-6 flex-shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
                  <button
                    onClick={() => signOut({ redirect: true, callbackUrl: '/auth/signin' })}
                    className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                  >
                    <ArrowLeftOnRectangleIcon
                      className="flex-shrink-0 w-6 h-6 mr-3 text-gray-400 group-hover:text-red-500"
                      aria-hidden="true"
                    ></ArrowLeftOnRectangleIcon>
                    Logout
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-4xl font-black text-transparent bg-gradient-to-r bg-clip-text from-emerald-600 to-teal-400">
                NiekForm
              </h1>
            </div>
            <nav className="flex-1 mt-12 space-y-1 bg-white">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    isActive(item.href, pathname) || isActive(item.isAlsoActive, pathname)
                      ? 'bg-emerald-50 text-emerald-700 border-l-emerald-600'
                      : 'text-gray-600 hover:text-gray-900 border-l-white',
                    'group flex items-center px-2 py-3 text-sm font-bold border-l-4'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive(item.href, pathname) || isActive(item.isAlsoActive, pathname)
                        ? 'text-emerald-600'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 h-6 w-6 flex-shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/auth/signin' })}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
            >
              <ArrowLeftOnRectangleIcon
                className="flex-shrink-0 w-6 h-6 mr-3 text-gray-400 group-hover:text-red-500"
                aria-hidden="true"
              ></ArrowLeftOnRectangleIcon>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;

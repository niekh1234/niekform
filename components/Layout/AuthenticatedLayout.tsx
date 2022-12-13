import { Bars3Icon } from '@heroicons/react/24/outline';
import Navigation from 'components/App/Navigation';
import { useState } from 'react';

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}></Navigation>
        <div className="flex flex-col flex-1 md:pl-64">
          <div className="sticky top-0 z-10 pt-1 pl-1 bg-white sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <main className="flex-1 min-h-screen px-4 py-12 bg-gray-100 md:px-6">{children}</main>
        </div>
      </div>
    </>
  );
};

export default AuthenticatedLayout;

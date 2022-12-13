import { PencilIcon } from '@heroicons/react/24/solid';
import EmptyState from 'components/App/EmptyState';
import ProjectAdd from 'components/Project/Add';
import { fetcher } from 'lib/client/api';
import { Form, Project } from 'lib/types';
import Link from 'next/link';
import useSWR from 'swr';

const Forms = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/project', fetcher);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Failed to load, please try again later.</div>;

  if (!data?.projects || data.projects.length === 0)
    return (
      <section className="max-w-4xl mx-auto">
        <EmptyState type="Project">
          <ProjectAdd onAdd={() => mutate()}></ProjectAdd>
        </EmptyState>
      </section>
    );

  return (
    <section className="">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Forms</h1>

        <ProjectAdd onAdd={() => mutate()}></ProjectAdd>
        {/* <FormAdd></FormAdd> */}
      </div>

      <div className="flex flex-col py-2 mt-6 overflow-hidden bg-white rounded-lg shadow">
        {data.projects.map((project: Project) => (
          <div key={project.id}>
            <Link href={'/projects/' + project.id} className="flex px-4 pt-4 group">
              <h3 className="text-xs font-black tracking-widest text-gray-600 uppercase">
                {project.name}
              </h3>

              <span className="items-center hidden ml-2 group-hover:flex">
                <PencilIcon className="w-4 h-4 text-gray-600"></PencilIcon>
              </span>
            </Link>

            {project.forms.length === 0 && (
              <div className="px-4 pb-1 mt-1">
                <button className="px-2 py-1 text-xs font-bold text-emerald-600">
                  Create a form
                </button>
              </div>
            )}

            <div className="flex flex-col mt-3">
              {project.forms.map((form: Form) => (
                <button className="p-4 text-left border-l-4 border-gray-200 divide-y hover:border-emerald-600 bg-gray-50">
                  <div className="font-bold">{form.name}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Forms;

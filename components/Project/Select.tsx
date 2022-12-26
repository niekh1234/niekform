import useSWR from 'swr';
import { fetcher } from 'lib/client/api';
import { Project } from 'lib/types';
import { ChangeEvent, forwardRef } from 'react';

type ProjectSelectProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const ProjectSelect = forwardRef<HTMLSelectElement, ProjectSelectProps>(
  ({ value, onChange }, ref) => {
    const { data, error, isLoading } = useSWR('/api/admin/project', fetcher);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) return <div>failed to load</div>;

    const projects = data?.projects as Project[];

    if (!data) return <div>loading...</div>;

    if (projects.length > 0 && !value) {
      onChange({ target: { value: projects[0].id } } as ChangeEvent<HTMLSelectElement>);
    }

    return (
      <select ref={ref} value={value} onChange={onChange} className="input-primary">
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    );
  }
);

export default ProjectSelect;

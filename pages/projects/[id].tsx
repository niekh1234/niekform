import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/App/Button';
import InputError from 'components/App/InputError';
import { doDeleteRequest, doPutRequest, fetcher } from 'lib/client/api';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { Project } from 'lib/types';
import ConfirmButton from 'components/App/ConfirmButton';
import { spawnFlash } from 'components/App/Flash';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Loading from 'components/App/Loading';
import InviteAdd from 'components/Project/Invite/Add';

const schema = yup.object({
  name: yup.string().required('Please enter a name'),
  description: yup.string().default(''),
});

const ProjectID = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
    data,
    error: fetchError,
    isLoading,
    mutate,
  } = useSWR('/api/admin/project/' + id, fetcher);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [processing, setProcessing] = useState(false);

  console.log(data);

  const onSubmit = async (formData: any) => {
    setProcessing(() => true);

    const res = await doPutRequest('/api/admin/project/' + id, {
      name: formData.name,
      descriptiion: formData.description,
    });

    setProcessing(() => false);

    if (res.error && !res?.project) {
      spawnFlash(res.error, 'error');
    } else {
      mutate(res);
      spawnFlash('Project updated', 'success');
    }
  };

  const deleteProject = async () => {
    const res = await doDeleteRequest('/api/admin/project/' + id);

    if (res.error) {
      spawnFlash(res.error, 'error');
    } else {
      router.push('/forms');
    }
  };

  const onAddInvite = () => {};

  // set initial form values
  useEffect(() => {
    if (data?.project) {
      reset({
        name: data.project.name,
        description: data.project.description || '',
      });
    }
  }, [data]);

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (fetchError || !data?.project) {
    return <div>Failed to load</div>;
  }

  const project = data.project as Project;

  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <div className="p-4 mt-6 bg-white rounded-lg shadow md:p-6">
        <h3 className="font-bold">General</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="text-sm text-gray-500">Name</label>
          <input type="text" {...register('name')} className="input-primary"></input>
          <InputError message={(errors.name?.message as string) || ''}></InputError>

          <label className="block mt-4 text-sm text-gray-500">Description (optional)</label>
          <textarea {...register('description')} className="input-primary"></textarea>
          <InputError message={(errors.description?.message as string) || ''}></InputError>

          <Button type="submit" isSecondary processing={processing} className="mt-8">
            Save
          </Button>
        </form>
      </div>

      <div className="p-4 mt-6 bg-white rounded-lg shadow md:p-6">
        <div className="flex justify-between">
          <h3 className="font-bold">Members</h3>
          <InviteAdd project={project.id} onAdd={() => onAddInvite()}></InviteAdd>
        </div>

        <table>
          <tbody>
            {project.invites.map((invite) => (
              <tr key={invite.id}>{invite.email}</tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12">
        <ConfirmButton onClick={() => deleteProject()} extraCaution extraCautionText={project.name}>
          <div className="flex items-center space-x-2 btn-outline">
            <ExclamationCircleIcon className="w-4 h-4"></ExclamationCircleIcon>
            <span>Delete project</span>
          </div>
        </ConfirmButton>
      </div>
    </section>
  );
};

export default ProjectID;

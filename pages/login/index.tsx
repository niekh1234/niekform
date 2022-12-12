import InputError from 'components/App/InputError';
import InputLabel from 'components/App/InputLabel';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from 'components/App/Button';
import { useState } from 'react';
import { doPostRequest } from 'lib/client/api';
import Router from 'next/router';

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'admin@niekform.io',
      password: 'admin',
    },
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    setProcessing(() => true);

    const res = await doPostRequest('/api/auth/login', {
      username: data.email,
      password: data.password,
    });

    setProcessing(() => false);

    if (res.error) {
      setError(() => res.error);
    } else {
      Router.push('/dashboard');
    }
  };

  return (
    <section className="px-4 py-24 bg-gray-100 w-screen h-screen">
      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <InputLabel forInput="email" value="Email" />

            <input className="input-primary" {...register('email')} id="email" type="email"></input>

            <InputError message={errors.email?.message as string} className="mt-2" />
          </div>

          <div className="mt-4">
            <InputLabel forInput="password" value="Password" />

            <input
              className="input-primary"
              {...register('password')}
              id="password"
              type="password"
            ></input>

            <InputError message={errors.password?.message as string} className="mt-2" />
          </div>

          <InputError message={error} className="mt-2" />

          <div className="flex items-center justify-end mt-4">
            <Button type="submit" className="ml-4" processing={processing}>
              Log in
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;

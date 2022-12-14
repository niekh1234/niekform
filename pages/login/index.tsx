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
    <section className='flex flex-col items-center px-4 py-24 md:py-32'>
      <h1 className='text-2xl font-black text-transparent md:text-4xl lg:text-5xl bg-gradient-to-r bg-clip-text from-emerald-600 to-teal-500'>
        NiekForm
      </h1>

      <p className='mt-2 text-sm text-gray-500 md:text-base'>Sign-in to your account</p>

      <div className='w-full max-w-md p-8 mx-auto mt-12 bg-white rounded-lg shadow'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <InputLabel forInput='email' value='Email' />

            <input className='input-primary' {...register('email')} id='email' type='email'></input>

            <InputError message={errors.email?.message as string} className='mt-2' />
          </div>

          <div className='mt-4'>
            <InputLabel forInput='password' value='Password' />

            <input
              className='input-primary'
              {...register('password')}
              id='password'
              type='password'
            ></input>

            <InputError message={errors.password?.message as string} className='mt-2' />
          </div>

          <InputError message={error} className='mt-2' />

          <div className='flex mt-8'>
            <Button type='submit' className='w-full' processing={processing}>
              Log in
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;

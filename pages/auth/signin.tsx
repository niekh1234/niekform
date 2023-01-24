import { signIn } from 'next-auth/react';
import InputLabel from 'components/App/InputLabel';
import Button from 'components/App/Button';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Signin = () => {
  const { query } = useRouter();
  const { verifyRequest } = query;
  const [processing, setProcessing] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(() => true);
    await signIn('email', {
      email: (event.currentTarget.email as HTMLInputElement).value,
    });
  };

  return (
    <section className="flex flex-col items-center px-4 py-24 md:py-32">
      <h1 className="text-2xl font-black text-transparent md:text-4xl lg:text-5xl bg-gradient-to-r bg-clip-text from-emerald-600 to-teal-500">
        NiekForm
      </h1>

      <p className="mt-2 text-sm text-gray-500 md:text-base">Sign-in to your account</p>

      <div className="w-full max-w-md p-8 mx-auto mt-12 bg-white rounded-lg shadow">
        {verifyRequest ? (
          <p className="text-gray-600 text-sm">
            We have sent you a magic link to your email. Please check your inbox and click the link
            to sign in.
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            <div>
              <InputLabel forInput="email" value="Email" />

              <input className="input-primary" id="email" type="email" name="email"></input>
            </div>

            <div className="flex mt-8">
              <Button type="submit" className="w-full" processing={processing}>
                Send magic link
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Signin;

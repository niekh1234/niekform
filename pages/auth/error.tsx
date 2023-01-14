import Link from 'next/link';
import { useRouter } from 'next/router';

const getErrorMessage = (error: string) => {
  switch (error) {
    case 'EmailCreateAccount':
      return 'You need to create an account first';
    case 'EmailSignin':
      return 'Could not send magic link';
    case 'AccessDenied':
      return 'Cannot sign you in, access denied';
    default:
      return 'Access denied';
  }
};

const AuthError = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <section className="flex flex-col items-center px-4 py-24 md:py-32">
      <h1 className="text-2xl font-black text-transparent md:text-4xl lg:text-5xl bg-gradient-to-r bg-clip-text from-emerald-600 to-teal-500">
        NiekForm
      </h1>

      <div className="w-full max-w-md p-8 mx-auto mt-12 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-black">Cannot sign in</h2>

        <p className="text-gray-600">
          Reason: <span className="text-gray-900">{getErrorMessage(error as string)}</span>
        </p>

        <Link href="/auth/signin" className="btn-primary block mt-8 text-center">
          Back to login page
        </Link>
      </div>
    </section>
  );
};

export default AuthError;

import Button from 'components/App/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SubmissionError = () => {
  const router = useRouter();

  const goBack = () => {
    window.history.back();
  };

  return (
    <section className="mx-auto max-w-3xl py-16 sm:py-24 md:py-32">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-black">Oh no!</h1>

        <p className="text-sm text-gray-500">Something went wrong while submitting your form.</p>

        {!!router.query?.message && (
          <p className="mt-4 text-lg">
            Error: <strong>{router.query.message as string}</strong>
          </p>
        )}

        <Button onClick={() => goBack()} className="btn-primary mt-8 inline-block">
          Back to previous page.
        </Button>
      </div>

      <div className="mt-8">
        Powered by{' '}
        <Link
          href="https://niekform.com"
          className="text-transparent bg-gradient-to-r bg-clip-text from-emerald-600 to-teal-500 font-black"
        >
          NiekForm
        </Link>
      </div>
    </section>
  );
};

export default SubmissionError;

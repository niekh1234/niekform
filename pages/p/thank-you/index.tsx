import Button from 'components/App/Button';
import Link from 'next/link';

const SubmissionThanks = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <section className="mx-auto max-w-3xl py-16 sm:py-24 md:py-32">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-black">Thank you!</h1>

        <p className="mt-2 text-gray-500">Your submission has been received in good hands.</p>

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

export default SubmissionThanks;

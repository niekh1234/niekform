import EmptyState from 'components/App/EmptyState';
import Loading from 'components/App/Loading';
import SubmissionChart from 'components/Submission/Chart';
import { fetcher } from 'lib/client/api';
import { Form } from 'lib/types';
import Link from 'next/link';
import useSWR from 'swr';

const Dashboard = () => {
  const { data, isLoading, error } = useSWR('/api/admin/welcome', fetcher);

  if (isLoading) {
    return <Loading></Loading>;
  }

  const latestForms = data?.latestForms as Form[];
  const submissionsByDay = data?.submissionsByDay as { date: string; count: number }[];

  if (error || !latestForms || !submissionsByDay) {
    return <div>Something went wrong</div>;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h1 className="font-black text-3xl">Welcome!</h1>

      <div className="mt-8">
        <h2 className="font-bold">Submissions in the last 30 days</h2>
        <div className="h-[16rem] bg-white p-4 mt-2 rounded shadow">
          <SubmissionChart
            data={formatLatest30DaysOfSubmissions(submissionsByDay)}
          ></SubmissionChart>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold">Latest forms</h2>
        {latestForms.length === 0 && (
          <EmptyState type="form">
            <Link href="/forms" className="btn-primary">
              Create a form
            </Link>
          </EmptyState>
        )}

        <ul className="space-y-2 mt-2 rounded shadow bg-white">
          {latestForms.map((form) => (
            <li key={form.id} className="p-4  flex justify-between">
              <div>
                <strong>{form.name}</strong>{' '}
                <span className="text-sm text-gray-500">({form.submissionCount})</span>
              </div>
              <Link
                href={'forms/' + form.id + '/submissions'}
                className="text-emerald-500 font-bold text-sm"
              >
                Manage
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const formatLatest30DaysOfSubmissions = (submissionsByDay: { date: string; count: number }[]) => {
  let result = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];

    const submission = submissionsByDay.find((submission) => submission.date === formattedDate);

    result.push({
      date: formattedDate,
      count: submission ? submission.count : 0,
    });
  }

  return result;
};

export default Dashboard;

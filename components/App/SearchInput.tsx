import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

const schema = yup.object({
  search: yup.string(),
});

type SearchInputProps = {
  className?: string;
};

const SearchInput = ({ className }: SearchInputProps) => {
  const router = useRouter();
  const { handleSubmit, register } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      search: router.query.search || '',
    },
  });

  const onSubmit = (data: any) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: data.search,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-12 flex items-center">
      <input
        className={className || 'input-primary'}
        type="search"
        placeholder="Search..."
        {...register('search')}
      ></input>

      <button className="btn-secondary" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchInput;

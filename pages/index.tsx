const Home = () => {
  return (
    <div className='w-screen h-screen px-4 py-16 bg-gray-100'>
      <div className='flex flex-col max-w-5xl mx-auto'>
        <form action='/api/f/clbjcahnl0005is6oqbyavaff' method='POST' className='flex flex-col'>
          <input type='text' name='name' className='input-primary' required value='Niek Hagen' />
          <input
            type='email'
            name='email'
            className='input-primary'
            required
            value='niekhagen@hotmail.com'
          />
          <button type='submit' className='mt-6 btn-primary'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;

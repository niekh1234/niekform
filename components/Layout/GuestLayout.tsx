type GuestLayoutProps = {
  children: React.ReactNode;
};

const GuestLayout = ({ children }: GuestLayoutProps) => {
  return <main className='w-screen min-h-screen bg-gray-100'>{children}</main>;
};

export default GuestLayout;

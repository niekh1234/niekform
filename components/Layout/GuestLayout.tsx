type GuestLayoutProps = {
  children: React.ReactNode;
};

const GuestLayout = ({ children }: GuestLayoutProps) => {
  return <main className="w-screen min-h-screen bg-gray-100 px-4 py-12 md:px-6">{children}</main>;
};

export default GuestLayout;

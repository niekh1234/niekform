type GuestLayoutProps = {
  children: React.ReactNode;
};

const GuestLayout = ({ children }: GuestLayoutProps) => {
  return <main>{children}</main>;
};

export default GuestLayout;

import { classNames } from 'lib/client/utils';

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

const Container = ({ className, children }: ContainerProps) => {
  return (
    <section className={classNames('container-primary', className)}>
      {children}
    </section>
  );
};

export default Container;

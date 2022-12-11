type SpinnerProps = {
  radius: number;
};

const Spinner = ({ radius }: SpinnerProps) => {
  return (
    <div
      className="m-auto animate-spin"
      style={{
        width: radius + 'px',
        height: radius + 'px',
        border: `${radius / 6}px solid #dddddd`,
        borderTop: `${radius / 6}px solid grey`,
        borderRadius: '50%',
      }}
    ></div>
  );
};

export default Spinner;

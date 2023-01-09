const RADIUS = 50;

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center py-32">
      <div className="animate-pulse">
        <div
          className="m-auto animate-spin"
          style={{
            width: RADIUS + 'px',
            height: RADIUS + 'px',
            border: `${RADIUS / 6}px solid #dddddd`,
            borderTop: `${RADIUS / 6}px solid grey`,
            borderRadius: '50%',
          }}
        ></div>
        <div className="text-2xl text-transparent bg-gradient-to-r bg-clip-text from-emerald-600 to-teal-500 mt-4 font-black">
          NiekForm
        </div>
      </div>
    </div>
  );
};

export default Loading;

const Skeleton = ({ className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    circle: 'rounded-full',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full rounded-lg',
    button: 'h-10 w-24 rounded',
  };

  return (
    <div
      className={`skeleton ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;

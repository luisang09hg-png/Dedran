const Input = ({ className = '', type = 'text', error = false, ...props }) => {
  return (
    <input
      type={type}
      className={`w-full bg-surface-container border ${error ? 'border-error' : 'border-outline-variant'} rounded-lg px-4 py-2.5 text-on-surface placeholder:text-on-surface-variant transition-smooth focus:border-primary focus:outline-none focus:shadow-[0_0_0_2px_rgba(168,180,216,0.15)] ${error ? 'focus:border-error focus:shadow-[0_0_0_2px_rgba(255,180,171,0.15)]' : ''} ${className}`}
      {...props}
    />
  );
};

export default Input;
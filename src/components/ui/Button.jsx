const variants = {
  primary:
    'bg-[#D9D9D6] text-[#07090E] hover:opacity-90',
  secondary:
    'border border-[#D9D9D6] text-[#D9D9D6] hover:bg-white/10',
  ghost:
    'text-charcoal-gray hover:text-[#D9D9D6] border border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-label-caps rounded',
  md: 'px-5 py-2.5 text-label-caps rounded',
  lg: 'px-8 py-3 text-headline-sm rounded',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
const variants = {
  primary:
    'bg-star-glow text-background hover:opacity-90 hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(188,198,231,0.3)] focus-visible:shadow-[0_0_12px_rgba(188,198,231,0.3)] active:scale-[0.98]',
  secondary:
    'border border-star-glow text-star-glow hover:bg-star-glow/10 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(255,255,255,0.1)] active:scale-[0.98]',
  ghost:
    'text-on-surface-variant hover:text-star-glow border border-transparent hover:scale-[1.01]',
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
      className={`font-semibold transition-all duration-300 ease-out inline-flex items-center justify-center gap-2 will-change-transform ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
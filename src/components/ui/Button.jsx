const variants = {
  primary:
    'bg-primary text-on-primary hover:opacity-90 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,180,216,0.3)] focus-visible:shadow-[0_0_20px_rgba(168,180,216,0.4)] active:scale-[0.98] transition-smooth',
  secondary:
    'border border-primary/30 text-primary hover:bg-primary/10 hover:scale-[1.02] hover:shadow-[0_0_16px_rgba(168,180,216,0.15)] active:scale-[0.98] transition-smooth',
  ghost:
    'text-on-surface-variant hover:text-primary hover:bg-primary/5 border border-transparent hover:scale-[1.01] transition-smooth',
  tertiary:
    'bg-tertiary text-on-tertiary hover:opacity-90 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(184,168,200,0.3)] active:scale-[0.98] transition-smooth',
  danger:
    'bg-error-container text-on-error-container hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-smooth',
};

const sizes = {
  xs: 'px-3 py-1.5 text-label-caps text-label-caps rounded-sm',
  sm: 'px-4 py-2 text-label-caps text-label-caps rounded',
  md: 'px-6 py-2.5 text-label-caps text-label-caps rounded-md',
  lg: 'px-8 py-3 text-body-sm text-body-sm rounded-lg',
  xl: 'px-10 py-4 text-body-md text-body-md rounded-xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  return (
    <button
      className={`font-semibold inline-flex items-center justify-center gap-2 will-change-transform ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;

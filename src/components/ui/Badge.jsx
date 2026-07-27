const variants = {
  default: 'bg-primary-container text-primary',
  secondary: 'bg-secondary-container text-secondary',
  tertiary: 'bg-tertiary-container text-tertiary',
  success: 'bg-green-900/30 text-green-400',
  warning: 'bg-yellow-900/30 text-yellow-400',
  error: 'bg-error-container text-on-error-container',
  outline: 'border border-outline-variant text-on-surface-variant',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const Badge = ({ children, variant = 'default', size = 'md', className = '', ...props }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

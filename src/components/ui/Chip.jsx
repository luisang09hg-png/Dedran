const Chip = ({ children, className = '', active = false, ...props }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-sm font-label-caps text-label-caps transition-colors ${
        active
          ? 'bg-primary-container/40 border border-primary text-primary'
          : 'bg-surface-container border border-charcoal-gray text-on-surface-variant hover:border-primary hover:text-primary'
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Chip;
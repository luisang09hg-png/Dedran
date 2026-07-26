const Input = ({ className = '', type = 'text', ...props }) => {
  return (
    <input
      type={type}
      className={`w-full bg-surface-container border border-outline rounded-lg px-4 py-2.3 text-foreground placeholder:text-on-surface-variant transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    />
  );
};\n\nexport default Input;
const GlassCard = ({ children, className = '', hover = true, as: Tag = 'div', ...props }) => {
  return (
    <Tag
      className={`glass-panel ${hover ? 'hover:shadow-[0_0_20px_rgba(168,180,216,0.1)] hover:border-primary/20 transition-smooth' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
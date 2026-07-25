const GlassCard = ({ children, className = '', hover = true, as: Tag = 'div', ...props }) => {
  return (
    <Tag
      className={`bg-primary-container/60 backdrop-blur-[12px] border border-nebula-stroke rounded-xl ${hover ? 'hover:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.1)] transition-all duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
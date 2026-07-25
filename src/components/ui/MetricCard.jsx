import GlassCard from './GlassCard';

const MetricCard = ({ value, label, icon: Icon, className = '' }) => {
  return (
    <GlassCard className={`p-stack-md flex flex-col items-center justify-center text-center min-h-[120px] ${className}`}>
      {Icon && (
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(188,198,231,0.2)]">
          <Icon size={16} className="text-primary" />
        </div>
      )}
      <p className="font-data-heavy text-data-heavy text-on-surface mb-unit">{value}</p>
      <p className="font-label-caps text-label-caps text-charcoal-gray uppercase tracking-wider">{label}</p>
    </GlassCard>
  );
};

export default MetricCard;
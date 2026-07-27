import { LucideIcon } from 'lucide-react';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-4">
          <Icon size={32} className="text-primary/40" />
        </div>
      )}
      {title && (
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{title}</h3>
      )}
      {description && (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;

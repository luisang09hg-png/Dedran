import EventHorizon from './EventHorizon';

const LoadingSpinner = ({ size = 40, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <EventHorizon variant="spinner" size={size} />
    </div>
  );
};

export default LoadingSpinner;

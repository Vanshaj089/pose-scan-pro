const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative w-20 h-20 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-3 rounded-full bg-accent animate-pulse-soft" />
        {/* Center dot */}
        <div className="absolute inset-1/3 rounded-full gradient-primary shadow-glow" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        Analyzing Your Images
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Our AI is processing pose estimation and calculating your body measurements...
      </p>
    </div>
  );
};

export default LoadingSpinner;

import { Activity, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="text-center mb-12 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
        <Sparkles className="w-4 h-4" />
        <span>AI-Powered Precision</span>
      </div>
      
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          <Activity className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
      
      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Body Measurement
        <span className="block text-primary">Estimation</span>
      </h1>
      
      <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
        Upload three photos from different angles and let our AI accurately estimate your body measurements in seconds.
      </p>
    </header>
  );
};

export default Header;

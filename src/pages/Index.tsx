import { useState } from "react";
import { User, UserRound, PersonStanding, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ImageUploadCard from "@/components/ImageUploadCard";
import MeasurementResults from "@/components/MeasurementResults";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://vanshaj089-body-measurement-docker.hf.space/measure_3pose";

interface UploadState {
  front: File | null;
  side: File | null;
  standing: File | null;
}

const Index = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<UploadState>({
    front: null,
    side: null,
    standing: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (type: keyof UploadState) => (file: File | null) => {
    setImages((prev) => ({ ...prev, [type]: file }));
    setError(null);
  };

  const allImagesUploaded = images.front && images.side && images.standing;

  const handleSubmit = async () => {
    if (!allImagesUploaded) {
      toast({
        title: "Missing Images",
        description: "Please upload all three required images.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("front", images.front);
    formData.append("side", images.side);
    formData.append("standing", images.standing);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Success!",
        description: "Your measurements have been calculated.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImages({ front: null, side: null, standing: null });
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
        <Header />

        {/* Upload Section */}
        {!results && !isLoading && (
          <section className="mb-12 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ImageUploadCard
                label="Front View"
                description="Face the camera directly"
                icon={<User className="w-6 h-6 text-primary" />}
                onImageSelect={handleImageSelect("front")}
                selectedFile={images.front}
              />
              <ImageUploadCard
                label="Side View"
                description="Turn 90° to your left or right"
                icon={<UserRound className="w-6 h-6 text-primary" />}
                onImageSelect={handleImageSelect("side")}
                selectedFile={images.side}
              />
              <ImageUploadCard
                label="Standing Full Body"
                description="Full body, arms slightly apart"
                icon={<PersonStanding className="w-6 h-6 text-primary" />}
                onImageSelect={handleImageSelect("standing")}
                selectedFile={images.standing}
              />
            </div>

            {/* Validation Message */}
            {!allImagesUploaded && (
              <p className="text-center text-sm text-muted-foreground mb-6">
                Please upload all three images to continue
              </p>
            )}

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">
                    Something went wrong
                  </p>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSubmit}
                  className="shrink-0"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                variant="gradient"
                size="xl"
                onClick={handleSubmit}
                disabled={!allImagesUploaded}
                className="min-w-[250px]"
              >
                Calculate Measurements
              </Button>
            </div>
          </section>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Results */}
        {results && !isLoading && (
          <section>
            <MeasurementResults data={results} />
            
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;


import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-finance-cream/30 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold mb-4 font-playfair text-finance-navy">404</h1>
        <p className="text-xl text-finance-slate mb-6">The page you're looking for doesn't exist.</p>
        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <p className="text-finance-slate mb-6">
            We couldn't find the page you were looking for. It might have been removed, renamed, or doesn't exist.
          </p>
          <Button 
            className="bg-finance-navy text-white hover:bg-finance-navy/90 inline-flex items-center"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Customerdashboard from "./pages/Customerdashboard";
import Applicationform from "./pages/Applicationform";
import Adminlogin from "./pages/Adminlogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./components/AdminCustomers";
import Settings from "./components/Settings";
import AdminApplications from "./pages/AdminApplications";
import { useState, useEffect } from "react";
import LoanCalculator from "./pages/LoanCalculator";
import About from "./pages/About";
import Refer from "./pages/Refer";
import Services from "./components/Services";
import ContactForm from "./components/ContactForm";

const queryClient = new QueryClient();

const App = () => {
  const [adminrank, setAdminRank] = useState<number | null>(null);

  useEffect(() => {
    const storedRank = localStorage.getItem("rank");
    if (storedRank) {
      setAdminRank(Number(storedRank));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customerdashboard" element={<Customerdashboard />} />
            <Route path="/applicationform" element={<Applicationform />} />
            <Route path="/admin" element={<Adminlogin />} />
            <Route path="/loancalculator" element={<LoanCalculator />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/refer" element={<Refer />} />
           
            <Route path="/services" element={<Services />} />
            




            {adminrank == 1 && (
              <>
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/admincustomers" element={<AdminCustomers />} />
                <Route path="/settings" element={<Settings />} />
              </>
            )}
            
            <Route path="/adminapplications" element={<AdminApplications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

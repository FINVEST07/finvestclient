/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Customerdashboard from "./pages/Customerdashboard";
import Applicationform from "./pages/Applicationform";
import Adminlogin from "./pages/Adminlogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./components/AdminCustomers";
import Settings from "./components/Settings";
import AdminApplications from "./pages/AdminApplications";
import AdminBlogsMedia from "./pages/AdminBlogsMedia";
import { useState, useEffect } from "react";
import LoanCalculator from "./pages/LoanCalculator";
import About from "./pages/About";
import Refer from "./pages/Refer";
import Services from "./pages/service";
import Contact from "./pages/Contact";
import BecomePartner from "./pages/BecomePartner";
import Blogs from "./pages/Blogs";
import Gallery from "./pages/Gallery";
import BlogDetail from "./pages/BlogDetail";

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
        {/* Sitewide Organization JSON-LD */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'FINVESTCORP',
              url: '/',
              logo: '/fin_lo.png',
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+91 9324592709',
                  contactType: 'customer service',
                  areaServed: 'IN',
                  availableLanguage: ['en', 'hi'],
                },
              ],
              sameAs: [
                '/',
                'mailto:officefinvestcorp@gmail.com',
                'tel:+919324592709',
              ],
            })}
          </script>
        </Helmet>
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
            <Route path="/contact" element={<Contact />} />
            <Route path="/refer" element={<Refer />} />
           
            <Route path="/services" element={<Services />} />
            <Route path="/become-partner" element={<BecomePartner />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            




            {adminrank == 1 && (
              <>
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/admincustomers" element={<AdminCustomers />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/adminblogs" element={<AdminBlogsMedia />} />
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

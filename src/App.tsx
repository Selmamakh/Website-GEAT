import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Leadership from "./pages/Leadership.tsx";
import Careers from "./pages/Careers.tsx";
import JobDetails from "./pages/JobDetails.tsx";
import JobApplication from "./pages/JobApplication.tsx";
import JobSearch from "./pages/JobSearch.tsx";
import HowToApply from "./pages/HowToApply.tsx";
import LifeAtGeat from "./pages/LifeAtGeat.tsx";
import CareersFaq from "./pages/CareersFaq.tsx";
import CareerField from "./pages/CareerField.tsx";
import SpontaneousApplication from "./pages/SpontaneousApplication.tsx";
import News from "./pages/News.tsx";
import Contact from "./pages/Contact.tsx";
import ProductsServices from "./pages/ProductsServices.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Cookies from "./pages/Cookies.tsx";
import NotFound from "./pages/NotFound.tsx";
import RevealOnScroll from "./components/RevealOnScroll";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./i18n/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <RevealOnScroll />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/jobs" element={<JobSearch />} />
          <Route path="/careers/how-to-apply" element={<HowToApply />} />
          <Route path="/careers/life-at-geat" element={<LifeAtGeat />} />
          <Route path="/careers/faq" element={<CareersFaq />} />
          <Route path="/careers/fields/:slug" element={<CareerField />} />
          <Route path="/careers/submit-cv" element={<SpontaneousApplication />} />
          <Route path="/careers/jobs/:slug" element={<JobDetails />} />
          <Route path="/careers/jobs/:slug/apply" element={<JobApplication />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products-services" element={<ProductsServices />} />
          <Route path="/products-services/:slug" element={<ProductDetail />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

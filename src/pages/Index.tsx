"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import axios from "axios";
import {
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  LineChart,
  Briefcase,
} from "lucide-react";

import Login from "@/components/Login";

const About = () => (
  <section id="about" className="section-padding bg-white">
    <div className="container-custom">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 animate-fade-in-left">
          <span className="text-sm font-medium text-blue-900 bg-blue-100 py-1 px-4 rounded-full">
            About Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 font-playfair text-blue-900">
            Trusted Financial Advisors
            <br /> Since 2013
          </h2>

          <p className="text-finance-slate mb-4">
            RISEHIGH FINCON CONSULTANCY PVT. LTD was founded with a simple
            mission: to provide personalized, transparent financial guidance
            that helps our clients achieve their goals. For over many years,
            we've been dedicated to creating tailored loan solutions & insurance
            advisory and best investment opportunity that work for real people.
          </p>

          <p className="text-finance-slate mb-6">
            With a team of certified financial advisors and loan specialists, we
            combine deep industry knowledge with a client-first approach. We
            believe in building long-term relationships based on trust,
            integrity, and results.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-900">12+</span>
              <span className="text-finance-slate">Years Experience</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-900">1,500+</span>
              <span className="text-finance-slate">Clients Served</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-900">98%</span>
              <span className="text-finance-slate">Client Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative animate-fade-in-right">
          <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              alt="Financial advisors team"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 p-4 bg-blue-900 text-white rounded-lg shadow-xl max-w-xs hidden lg:block">
            <div className="flex items-start mb-2">
              <LineChart className="h-5 w-5 mr-2 text-blue-200" />
              <h3 className="text-lg font-medium">Why Choose Us</h3>
            </div>
            <ul className="text-sm text-white/80 space-y-2">
              <li className="flex items-start">
                <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
                <span>Personalized investment strategies</span>
              </li>
              <li className="flex items-start">
                <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
                <span>Transparent fee structure</span>
              </li>
              <li className="flex items-start">
                <ArrowUpRight className="h-4 w-4 mr-1 text-blue-200 shrink-0 mt-0.5" />
                <span>Certified financial advisors</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyChooseUs = () => (
  <section className="section-padding bg-blue-900 text-white">
    <div className="container-custom">
      <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <span className="text-sm font-medium bg-white/10 text-blue-200 py-1 px-3 rounded-full">
          Why Choose Us
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 font-playfair text-white">
          What Sets Us Apart
        </h2>
        <p className="text-white/80 text-lg">
          Our commitment to excellence and client satisfaction defines our
          approach to financial advisory services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="bg-blue-200/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <Briefcase className="h-6 w-6 text-blue-200" />
          </div>
          <h3 className="text-xl font-semibold mb-3 font-playfair">
            Expert Advisors
          </h3>
          <p className="text-white/70">
            Our team consists of certified financial professionals with decades
            of combined experience.
          </p>
        </div>

        <div
          className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <div className="bg-blue-200/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <DollarSign className="h-6 w-6 text-blue-200" />
          </div>
          <h3 className="text-xl font-semibold mb-3 font-playfair">
            Tailored Solutions
          </h3>
          <p className="text-white/70">
            We develop customized financial strategies based on your unique
            goals and risk tolerance.
          </p>
        </div>

        <div
          className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <div className="bg-blue-200/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-200" />
          </div>
          <h3 className="text-xl font-semibold mb-3 font-playfair">
            Proven Results
          </h3>
          <p className="text-white/70">
            Our track record speaks for itself, with consistent performance and
            client satisfaction.
          </p>
        </div>

        <div
          className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <div className="bg-blue-200/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <LineChart className="h-6 w-6 text-blue-200" />
          </div>
          <h3 className="text-xl font-semibold mb-3 font-playfair">
            Transparent Fees
          </h3>
          <p className="text-white/70">
            We believe in complete transparency with no hidden fees or
            unexpected charges.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  const [loginopen, setLoginOpen] = useState(true);
  useEffect(() => {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 100,
            behavior: "smooth",
          });
        }
      });
    });

    // Reveal animations on scroll
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll(".hidden-element");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const alreadySent = sessionStorage.getItem("visitor-tracked");

    if (!alreadySent) {
      axios
        .get("https://api.ipify.org?format=json")
        .then((res) => {
          const ip = res.data?.ip;
          if (ip) {
            axios
              .post(`${import.meta.env.VITE_API_URI}addvisitor`, { ip })
              .then(() => {
                sessionStorage.setItem("visitor-tracked", "true");
              })
              .catch((err) => {
                console.error("Failed to send visitor IP:", err);
              });
          }
        })
        .catch((err) => {
          console.error("Failed to fetch IP address:", err);
        });
    }
  }, []);

  return (
    <div className="min-h-screen w-full">
      <Navbar setLoginOpen={setLoginOpen} />
      <Hero />
      <Login setLoginOpen={setLoginOpen} loginopen={loginopen} />
      <Services setLoginOpen={setLoginOpen}/>
      <About />
      <WhyChooseUs />
      <Testimonials />
      <ContactForm setLoginOpen={setLoginOpen}/>
      <Footer setLoginOpen={setLoginOpen}/>
    </div>
  );
};

export default Index;

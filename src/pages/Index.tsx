import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";

// MySQL API
import { getStock } from "@/api/stock";

// Logo
import logo from "@/assets/logo.png";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stock, setStock] = useState([]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // ✅ Fetch stock from MySQL when page loads
  useEffect(() => {
    getStock().then((data) => {
      console.log("Fetched Stock:", data);
      setStock(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-gray-900">

      {/* Navbar */}
      <Navbar toggleSidebar={handleToggleSidebar} />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] bg-white text-gray-900 px-4 border-b border-gray-200 mt-16">
        <img
          src={logo}
          alt="Fresh Soft Tissue Logo"
          className="h-80 w-auto mb-5 object-contain transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />

        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Welcome to Fresh Soft Tissue Enterprises
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mt-3 text-center max-w-xl">
          Freshness you can feel, softness you can trust.
        </p>
      </section>

      {/* Dashboard Section */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Pass stock data into Dashboard */}
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;

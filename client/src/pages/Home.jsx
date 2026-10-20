import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedVehicles from '../components/home/FeaturedVehicles';
import PopularCities from '../components/home/PopularCities';
import VehicleCategories from '../components/home/VehicleCategories';
import WhyChooseUs from '../components/home/WhyChooseUs';
import OwnerCTA from '../components/home/OwnerCTA';
import Testimonials from '../components/home/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-navy font-sans antialiased selection:bg-electric selection:text-white">
      {/* 1. Header / Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <HeroSection />

        {/* Section 2: How It Works */}
        <HowItWorks />

        {/* Section 3: Featured Vehicles */}
        <FeaturedVehicles />

        {/* Section 4: Popular Cities */}
        <PopularCities />

        {/* Section 5: Vehicle Categories */}
        <VehicleCategories />

        {/* Section 6: Why Choose Us */}
        <WhyChooseUs />

        {/* Section 7: Owner CTA */}
        <OwnerCTA />

        {/* Section 8: Testimonials */}
        <Testimonials />
      </main>

      {/* Section 9: Footer */}
      <Footer />
    </div>
  );
}

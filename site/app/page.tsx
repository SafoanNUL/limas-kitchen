import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Menu from "@/components/Menu";
import Bundles from "@/components/Bundles";
import How from "@/components/How";
import OrderSection from "@/components/OrderSection";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Story />
        <Menu />
        <Bundles />
        <How />
        <OrderSection />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

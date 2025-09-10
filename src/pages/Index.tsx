import Header from "@/components/Header";
import WalletComponent from "@/components/WalletComponent";
import ClaimsPortal from "@/components/ClaimsPortal";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ClaimsPortal />
          </div>
          <div>
            <WalletComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

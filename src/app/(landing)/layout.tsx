import { Footer } from "./components/footer";
import { LandingHeader } from "./components/header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex items-center justify-center container mx-auto min-h-screen p-4">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Deta!</h1>
        <p>
          A Personal data logging application built with React Native. Deta
          combines the Japanese word for data with clean, minimalist approach to
          personal information management.
        </p>
        <Button asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
      </section>
    </main>
  );
}

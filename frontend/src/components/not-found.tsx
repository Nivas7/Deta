import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Button asChild className="mt-4">
        <Link to="/">Goto Home</Link>
      </Button>
    </div>
  );
}

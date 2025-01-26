import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 Not Found</h1>
      <Link to={"/"}>Back to Home</Link>
    </div>
  );
}

import { LoginForm } from "./components/login-form";
import AnimatedContent from "@/components/AnimatedContent";
function App() {
  return (
    <div>
      <AnimatedContent
        distance={150}
        direction="horizontal"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
      >
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}

export default App;

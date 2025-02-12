import { NotFound } from "@/components/not-found";
import { Toaster } from "@/components/ui/sonner";
import { fetchUser } from "@/domain/users/functions/fetch-user.function";
import {
  CatchBoundary,
  Outlet,
  createRootRoute,
  ScriptOnce,
} from "@tanstack/react-router";
import { type ReactNode, lazy } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

let data = {
  user: {
    id: 123,
    email: "test@gg.com",
    name: "test",
  },
};
export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async () => {
    const { user } = data;
    return { user };
  },
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <TanStackRouterDevtools />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <CatchBoundary
          getResetKey={() => "reset"}
          onCatch={(error) => console.error(error)}
        >
          {children}
        </CatchBoundary>
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
          )`}
        </ScriptOnce>
        <Toaster />
      </body>
    </html>
  );
}

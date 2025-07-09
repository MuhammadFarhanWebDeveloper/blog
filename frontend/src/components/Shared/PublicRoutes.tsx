import { useUser } from "@clerk/clerk-react";
import type { ReactNode } from "react";

export default function PublicRoutes({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (isSignedIn) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        You are already signed in!
      </div>
    );
  }
  return <div>{children}</div>;
}

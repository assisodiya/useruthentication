import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/options";
import SignoutButton from "./Components/signoutButton";
export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="h-full">
    {/* <HomeHere /> */}
    <div className="container">
      <div className="px-10 lg:px-80">
        <h1 className="text-4xl">Hi User Logedin</h1>
        {JSON.stringify(session)}
      </div>
    </div>
    <SignoutButton />
  </main>
  );
}
import { type NextPage } from "next";
import Head from "next/head";

import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "n/utils/api";

const Home: NextPage = () => {

const USER = useUser();

const { data } = api.posts.getAll.useQuery();


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-4xl font-bold text-white">Welcome to TwitterClone!</h1>
        <div className="text-white">
          {!USER.isSignedIn && <SignInButton  />}
          {!!USER.isSignedIn && <SignOutButton  />}
        </div>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      <div className="flex flex-col items-center justify-center">
        {data?.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 m-4">
            <p className="text-gray-500">{post.content}</p>
          </div>
        ))}
      </div>
      </main>
    </>
  );
};

export default Home;

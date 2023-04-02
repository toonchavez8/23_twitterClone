import { type NextPage } from "next";
import Head from "next/head";

import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "n/utils/api";
import type { RouterOutputs } from "n/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

// TThis is a component that will be used to create a post
const CreatePostWidget = () => {

  // Get the user
  const USER = useUser();
 
  // If the user is not signed in, return null
  if (!USER.isSignedIn) return null;

  // Return the component
  return (
      <div className="flex gap-2 items-center flex-1">

            <Image 
            src={USER.user.profileImageUrl} 
            alt="Profile Image" 
            className="flex bg-cover w-14 h-14 rounded-full"  
            width={56}
            height={56}
            placeholder="blur"
            blurDataURL={USER.user.profileImageUrl}
            />

      <input type="text" placeholder="Whats on your mind?" className="bg-transparent border border-slate-700 flex-shrink-0 flex-grow p-4 m-4 rounded"/>
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
// this is the component that will be used to display posts
const PostView = (props:  PostWithUser) =>{

  const { post, author } = props;

return (
  <div key={post.id} className="bg-white  rounded-lg shadow-lg p-6 gap-3 m-4 flex">

      <Image 
      src={author.profileImageUrl} 
      alt={`@${author.username}'s profile picture`} 
      className="w-14 h-14 rounded-full"
      width={56}
      height={56}
      placeholder="blur"
      blurDataURL={author.profileImageUrl}
      />

  <div className="flex flex-col">
    <div className="flex flex-row gap-1 text-sm  text-slate-600">
      <span className="font-bold">{`@${author.username}`}</span> 
      <span className="text-gray-500">{`· ${dayjs(post.createdAt).fromNow()}`}</span>
    </div>
    <p className="text-gray-500">{post.content}</p>
  </div>
</div>
)

}

// This is the main page 
const Home: NextPage = () => {
// Declare the user
  const USER = useUser();
  const { data , isLoading } = api.posts.getAll.useQuery();

  // If the data is loading, show loading
  if (isLoading) return <div>Loading...</div>;

  // If there is no data, show error
  if (!data) return <div>Not found, something went wrong</div>;

// Return the page
  return (
      <>
        <Head>
          <title>Create T3 App</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen justify-center ">
          <section className="md:max-w-2xl border-x w-full border-slate-500">
            <h1 className="text-4xl font-bold text-white text-center">Welcome to TwitterClone!</h1>
            <div className="text-white  border-b border-slate-500 p-4 w-full ">
              {/* if the user is not signed in render the sign in button */}
              {!USER.isSignedIn && <div className="flex justify-center  ">
                <SignInButton  />
              </div>}

              {/* if the user is signed in render the sign out button and the create post widget*/}
              {!!USER.isSignedIn && <div className="flex flex-row-reverse"><SignOutButton  />
                {CreatePostWidget()}
              </div>}
            </div>
                  <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
            <div className="flex flex-col  justify-center">
              {/* map data from server onto page */}
              {data?.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id}/>
                ))}
            </div>
            </section>
        </main>
      </>
    );
};

export default Home;

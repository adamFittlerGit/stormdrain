'use client';
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  const [queries, setQueries] = useState("");
  const [response, setResponse] = useState("");

  async function getResponse() {
    
  }

  // Handle "Enter" key press to trigger the submitQuery function
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Enter") {
        getResponse();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [queries]); // Include query dependency to use the latest query when enter is pressed

  return (
    <div className={`flex ${response ? "items-center" : ""} justify-center mt-10 h-screen pb-20`}>
        <main className="flex items-end flex-col gap-8 row-start-2 items-center w-3/4 sm:w-128">
          {response && (
              <div className="flex items-start">
                <Image
                  src="/storm-ai.png" // path to the image in the public folder
                  alt="Storm AI logo"
                  width={25} // Adjust the width
                  height={25} // Adjust the height
                />
                <p>:&nbsp;&nbsp;</p> 
                <TypeAnimation
                  sequence={[
                    response, 
                  ]}
                  cursor={true}
                  repeat={1}
                  className="text-white"
                />
              </div>
            )}
          {!response && (
            <div className="flex items-center justify-items">
              <Image
                src="/storm-ai.png" // path to the image in the public folder
                alt="Storm AI Logo"
                width={50} // Adjust the width
                height={50} // Adjust the height
                className=""
              />
              <TypeAnimation 
                  sequence={[
                    "What can I help with today?", 
                  ]}
                  cursor={true}
                  repeat={1}
                  className="text-2xl font-bold p-2 m-2 text-white"
              />
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent form submission refresh
              getResponse();
            }}
            className="w-full"
          >
            <div className="grid grid-cols-8">
              <input
                value={queries[-1]}
                onChange={(e) => setQueries(e.target.value)} // Update query as user types
                placeholder="What would you like to learn?"
                className="col-span-8 sm:col-span-7 bg-gray-200 rounded-lg p-3 border-2 border-black"
              />
              <button type="submit" className="hover:bg-sky-400 bg-gray-500 ml-2 p-2 text-white h-full rounded-lg col-span-1 border-black border-2 hidden sm:block">
                Ask
              </button>
            </div>
            <br></br>
            <div className="flex justify-center">
              <button type="submit" className="bg-gray-500 ml-2 p-2 text-white h-full rounded-lg col-span-1 border-black border-2 block sm:hidden hover:bg-sky-400">
                  Ask
              </button>
            </div>
          </form>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

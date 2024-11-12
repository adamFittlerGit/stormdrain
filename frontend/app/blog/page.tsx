'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import 'react-loading-skeleton/dist/skeleton.css';
import Tilt from 'react-parallax-tilt';

async function fetchPosts(tagType: any) {
  const response = await fetch("/api/getAllPosts", {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: JSON.stringify({ tagType })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();
  return data;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [tagType, setTagType] = useState("all");
  const [page, setPage] = useState(1); // Current page state
  const [query, setQuery] = useState("");
  const postsPerPage = 10; // Number of posts per page]
  const skeletons = [];

  for (let i = 0; i < 10; i++) {
    skeletons.push(
      <div key={i} className="flex justify-center col-span-1 p-4 m-4 bg-gray-600 rounded h-[200px] opacity-80">
        <div className="bg-gray-500 w-3/4 h-[90px] my-2 opacity-50"></div>
      </div>
    );
  }

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/checkAuth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      const data = await res.json();
      setIsLoggedIn(data.loggedIn);
    };

    const getData = async () => {
      const allPosts = await fetchPosts(tagType);
      setPosts(allPosts); // Fetch all posts at once
    };

    checkAuth();
    getData();
    setIsMounted(true);
  }, [tagType]);

  // Calculate start and end indices for pagination
  const startIdx = (page - 1) * postsPerPage;
  const endIdx = startIdx + postsPerPage;
  const paginatedPosts = posts.slice(startIdx, endIdx);
  const pageTotal = Math.ceil(posts.length / postsPerPage);

  const handleNextPage = () => {
    if (endIdx < posts.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-3/4">
        <h1 className="text-5xl font-bold pt-6 pb-12 text-center text-white">MY BLOG</h1>

        

        {/* New Post Section and AI RAG Search Bar*/}
        {isLoggedIn && 
        <>
          <div className="flex justify-center">
            <Tilt className="w-64">
                <div  className="flex justify-center items-center col-span-1 p-4 m-4 bg-white rounded-lg border-2 border-black ">
                  <Link href="/blog/new"> 
                    <div className="flex justify-center">
                      <Image
                        className="p-2"
                        src="/write.png"
                        width={100}
                        height={100}
                        alt="Post Image"
                      />
                    </div>
                      <h1 className="text-lg font-bold text-center text-black">New Post</h1>
                  </Link>
                </div>
              </Tilt>
          </div>
          <div className=" hidden flex justify-center items-center my-4">
            <Image
                src="/storm-ai.png" // path to the image in the public folder
                alt="Storm AI Logo"
                width={50} // Adjust the width
                height={50} // Adjust the height
                className="mr-4"
            />
            <p className="pr-4 text-3xl fold-bold text-black">:</p>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)  
                console.log(query)
              }} // Update query as user types
              placeholder="Search for a post!"
              className="bg-white rounded-lg p-3 border-2 border-black w-2/3 sm:w-96 hover:border-sky-400"
            />
          </div>
        </>
        }

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-white">Page {page} of {pageTotal}</span>
          <button
            onClick={handleNextPage}
            disabled={endIdx >= posts.length}
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Currently hidden tag selector*/}
        <div className="hidden flex justify-center text-center">
            <select className="mx-1 rounded p-1 text-center text-black" id="tags" name="tags" onChange={(e) => {
              setTagType(e.target.value)
            }}>
              <option className="text-center text-black" value="all" selected>All Tags</option>
              <option className="text-center text-black" value="university">University</option>
              <option className="text-center text-black" value="software-engineering">Software Engineering</option>
              <option className="text-center text-black" value="project-progress">Project Progress</option>
              <option className="text-center text-black" value="fitness">Fitness</option>
              <option className="text-center text-black" value="martial-arts">Martial Arts</option>
              <option className="text-center text-black" value="general-learning">General</option>
              <option className="text-center text-black" value="thoughts">Thoughts</option>
            </select>
        </div>

        {/* Section for the blog posts */}
        <div className="grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {isMounted
            ? paginatedPosts.map((postProps:any, index) => (
                <Tilt key={index}>
                  <div className="col-span-1 p-4 m-4 bg-white rounded-lg hover:border-sky-400 border-2 border-black h-5/6">
                    <Link href={`/blog/${postProps.post_id}`}>
                      <div className="flex justify-center">
                        <Image
                          className="p-2"
                          src={`/${postProps.tag}.png`}
                          width={100}
                          height={100}
                          alt="Post Image"
                        />
                      </div>
                      <h1 className="text-lg font-bold text-center text-black">{postProps.title}</h1>
                      <p className="text-base italic text-center text-black">{postProps.date}</p>
                    </Link>
                  </div>
                </Tilt>
              ))
            : skeletons}
        </div>
      </div>
    </div>
  );
}

'use client';
import React, { useState, useRef, ChangeEvent, useTransition } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { supabaseClient } from '@/supabase/client'; // Ensure this is the correct path
import { useRouter } from 'next/navigation'
import Image from 'next/image';


async function makePost(title: string, tag: string, body: string, images: File[]) {
  const response = await fetch("/api/makePost", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      body: JSON.stringify({
          title,
          body, // Consider renaming this to 'content' to avoid confusion
          tag,
          images // Include image_urls
      })
  });

  if (!response.ok) {
      throw new Error("Failed to fetch posts");
  }
}

const Page = () => {
  // useStates for our data
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageSelected, setImageSelected] = useState<boolean>(false)

  // Use router for changes pages
  const router = useRouter()

  // useRef so we can use the button istead of normal file upload ui
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        await makePost(title, tag, content, imageFiles); // Await the makePost function
        router.push("/"); // Redirect only after the post has been made
    } catch (error) {
        console.error("Error making post:", error);
    }
};

  // Handling the upload of mutliple files
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      console.log(e.target.files[0])
      const newImageUrls = fileArray.map((file) => URL.createObjectURL(file))
      
      setImageUrls([...imageUrls, ...newImageUrls])
      setImageFiles([...imageFiles, ...fileArray])
      console.log(`imageurls: ${newImageUrls[0]}`)
    }
  } 

  return (
    <div className='bg-white mx-20 mt-5 p-5 rounded'>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <h2 className='text-3xl '>New Post</h2>
        <input 
          hidden
          ref = {imageInputRef}
          type="file" 
          id="image_uploads"
          name="image_uploads"
          accept=".jpg, .jpeg, .png"
          multiple
          onChange={handleUpload}
        />

        <Button variant="outlined" onClick={() => {imageInputRef.current?.click()}}>{imageFiles ? "Select Another Image" : "Select Image"}</Button>
        
        <div className='flex gap-4'>
          
          {imageUrls.map((url, index) => (
          
            <Image
              key={url}
              src={url}
              width={50}
              height={50}
              alt={`img-${index}`}
            />
          ))}
        </div>

        <TextField
          type="text"
          variant='outlined'
          color='primary'
          label="Post Title"
          onChange={(e) => {setTitle(e.target.value)}} // Capture title input
          fullWidth
          required
        />
        
        <TextField
          type="text"
          variant='outlined'
          color='primary'
          label="Tag"
          onChange={(e) => {setTag(e.target.value)}} // Capture tag input
          required
          fullWidth
        />
        
        <TextField
          variant='outlined'
          color='primary'
          label="Content"
          onChange={(e) => {setContent(e.target.value)}} // Capture content input
          fullWidth
          required
        />
        
        <Button variant="contained" color="primary" type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default Page;
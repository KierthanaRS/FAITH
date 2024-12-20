"use client"
import React from "react";
import LoaderComponent from "../components/Loader";
import {useState,useEffect} from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (redirect){
      router.push("/");
    }
  },[redirect]);

  useEffect(()=>{
    //write the fuction call to sent the data to the backend
    setInterval(() => {
      setRedirect(true);
    }, 5000);
    // setRedirect(true);
  },[])
  return (
    <div>
     <LoaderComponent />
    </div>
  );
}

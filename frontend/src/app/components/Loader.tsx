import { useEffect, useState } from "react";

const LoaderComponent = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Loading AI models",
    "Connecting to server",
    "Fetching data",
    "Almost there...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 1500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="mt-[16%] flex flex-col items-center justify-center">
      {/* Loader */}
      <svg
        className="w-64 h-32"
        viewBox="0 0 256 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5ebd3e" />
            <stop offset="33%" stopColor="#ffb900" />
            <stop offset="67%" stopColor="#f78200" />
            <stop offset="100%" stopColor="#e23838" />
          </linearGradient>
          <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#e23838" />
            <stop offset="33%" stopColor="#973999" />
            <stop offset="67%" stopColor="#009cdf" />
            <stop offset="100%" stopColor="#5ebd3e" />
          </linearGradient>
        </defs>
        <g fill="none" strokeLinecap="round" strokeWidth="16">
          <g className="ip__track" stroke="#ddd">
            <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
            <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
          </g>
          <g strokeDasharray="180 656">
            <path
              className="ip__worm1"
              stroke="url(#grad1)"
              strokeDashoffset="0"
              d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"
            />
            <path
              className="ip__worm2"
              stroke="url(#grad2)"
              strokeDashoffset="358"
              d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"
            />
          </g>
        </g>
      </svg>

      {/* Dynamic Text */}
      <h1 className="text-xl font-bold mt-6 text-textcolor">
        {messages[messageIndex]}
      </h1>
    </div>
  );
};

export default LoaderComponent;

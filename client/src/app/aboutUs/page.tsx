"use client";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const AboutUs: React.FC = () => {
  const router=useRouter();
  const [currentCalculation, setCurrentCalculation] = useState<string | null>(
    null
  );
  const [confusionMatrix, setConfusionMatrix] = useState<number[][]>([
    [50, 10],
    [5, 35],
  ]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const result = (event.target as HTMLFormElement)["result"].value;
  
    setCurrentCalculation(result);
    // Update the confusion matrix based on the result (example logic)
    const updatedMatrix = [...confusionMatrix];
    if (result === "Halucinating") {
      updatedMatrix[1][1] += 1; // False positive
    } else {
      updatedMatrix[0][0] += 1; // True negative
    }
    setConfusionMatrix(updatedMatrix);
  };

  return (
    <div className="flex h-screen bg-background text-white">
      <div className="mt-3 ml-2">
      <IoIosArrowBack  className="text-white size-6" onClick={()=>{router.push("/")}}/>
      </div>
      {/* Left Part */}
      <div className="w-1/2 py-8 px-4 bg-background">
        <h1 className="text-5xl bg-gradient-to-r from-violet-500 via-white to-pink-500 inline-block text-transparent bg-clip-text">
          FAITH
        </h1>
        <p className="text-sm mt-2 italic text-gray-300">
        <span className="text-pink-500 text-lg">F</span>ramework for <span className="text-pink-500 text-lg">A</span>I   <span className="text-pink-500 text-lg ml-2">I</span>ntegrity and <span className="text-pink-500 text-lg">T</span>esting <span className="text-pink-500 text-lg">H</span>allucinations
        </p>
        <p className="mt-10">
          Our project focuses on detecting and addressing hallucinations in
          AI-generated content. By analyzing queries and providing context-based
          validation, we aim to ensure reliability and trustworthiness in AI
          systems.
        </p>

        {/* Current Calculation */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Calculated Results</h2>
          {currentCalculation ? (
            <p className="mt-2 bg-gray-700 p-4 rounded">
              Result:{" "}
              <span className="font-bold text-violet-400">
                {currentCalculation}
              </span>
            </p>
          ) : (
            <p className="mt-2 text-gray-400">No calculation yet.</p>
          )}
        </div>

        {/* Confusion Matrix */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold ">
            Confusion Matrix
          </h2>
          <div className="flex justify-center mt-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {confusionMatrix.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`h-24 w-24 flex items-center justify-center font-bold rounded ${
                      rowIndex === colIndex
                        ? "bg-violet-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {value}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Part */}
      <div className="w-1/2 p-8 bg-sidebar">
        <h2 className="text-3xl font-bold">Submit a Query</h2>
        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          {/* Query */}
          <div>
            <label className="block font-semibold mb-2">Query</label>
            <input
              type="text"
              name="query"
              className="w-full p-2 rounded bg-background border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
              placeholder="Enter your query"
              required
            />
          </div>

          {/* Response */}
          <div>
            <label className="block font-semibold mb-2">Response</label>
            <textarea
              name="response"
              className="w-full p-2 rounded bg-background border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
              rows={3}
              placeholder="Enter the response"
              required
            ></textarea>
          </div>

          {/* Context */}
          <div>
            <label className="block font-semibold mb-2">Context</label>
            <textarea
              name="context"
              className="w-full p-2 rounded bg-background border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
              rows={3}
              placeholder="Provide context for the query"
              required
            ></textarea>
          </div>

          {/* Result */}
          <div>
            <label className="block font-semibold mb-2">Expected Result</label>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="result"
                  value="Halucinating"
                  className="mr-2"
                  required
                />
                Halucinating
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="result"
                  value="Not Halucinating"
                  className="mr-2"
                  required
                />
                Not Halucinating
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-500 p-2 rounded text-white font-bold hover:bg-violet-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutUs;

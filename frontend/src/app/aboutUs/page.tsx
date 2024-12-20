"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";

const AboutUs: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    query: "",
    response: "",
    context: "",
    result: "",
  });
  const [result, setResult] = useState<{
    groundedness?: string;
    gpt_groundedness?: string;
    groundedness_reason?: string;
  } | null>(null);
  const [userresult, setUserResult] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currentCalculation, setCurrentCalculation] = useState<string | null>(
    null
  );
  const [confusionMatrix, setConfusionMatrix] = useState<number[][]>([
    [0, 0],
    [0, 0],
  ]);
  const fetchMatrix = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/test-model/matrix`
      );
      const data = await res.json();
      setConfusionMatrix([
        [data.TruePositives, data.FalsePositives],
        [data.FalseNegatives, data.TrueNegatives],
      ]);
    } catch (error) {
      console.error("Error while fetching the confusion matrix:", error);
    }
  };
  useEffect(() => {
    fetchMatrix();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    try {
      // POST Request to the backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/test-model`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      console.log("Response from server:", data);
      setCurrentCalculation(data.result);
      if (data.data.groundedness == 6) {
        setCurrentCalculation("Intentional Hallucination");
      }
      setResult(data.data);
      setUserResult(data.user_result);
      setForm({
        query: "",
        response: "",
        context: "",
        result: "",
      });
      fetchMatrix();
      setSubmitted(false);
    } catch (error) {
      setSubmitted(false);
      console.error("Error while submitting the form:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-white">
      <div className="mt-3 ml-2">
        <IoIosArrowBack
          className="text-white size-6"
          onClick={() => {
            router.push("/");
          }}
        />
      </div>
      {/* Left Part */}
      <div className="w-1/2 py-8 px-4 bg-background">
        <h1 className="text-5xl bg-gradient-to-r from-violet-500  to-pink-500 inline-block text-transparent bg-clip-text">
          FAITH
        </h1>
        <p className="text-sm mt-2 italic text-gray-300">
          <span className="text-pink-500 text-lg">F</span>ramework for{" "}
          <span className="text-pink-500 text-lg">A</span>I{" "}
          <span className="text-pink-500 text-lg ml-2">I</span>ntegrity and{" "}
          <span className="text-pink-500 text-lg">T</span>esting{" "}
          <span className="text-pink-500 text-lg">H</span>allucinations
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
            <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-md text-gray-100 space-y-3">
              {/* Result Header */}
              <p className="text-lg font-bold">
                User Result:{" "}
                <span
                  className={`${
                    userresult === "Halucinating"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {userresult}
                </span>
              </p>
              <p className="text-lg font-bold">
                Calculated Result:{" "}
                <span
                  className={`${
                    currentCalculation === "Halucinating"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {currentCalculation}
                </span>
              </p>

              {/* Groundedness Scores */}
              <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                <p className="text-sm">
                  <span className="font-semibold text-violet-300">
                    Groundedness:
                  </span>{" "}
                  {result?.groundedness || "N/A"}
                </p>
                {/* <p className="text-sm">
                  <span className="font-semibold text-violet-300">
                    GPT Groundedness:
                  </span>{" "}
                  {result?.gpt_groundedness || "N/A"}
                </p> */}
              </div>

              {/* Reason for Result */}
              {result?.groundedness_reason && (
                <div className="mt-2 bg-gray-700 p-3 rounded-md">
                  <h3 className="font-semibold text-sm text-gray-300">
                    Explanation:
                  </h3>
                  <p className="text-sm text-gray-200">
                    {result?.groundedness_reason}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-2 text-gray-400">No calculation yet.</p>
          )}
        </div>

        {/* Confusion Matrix */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Our Platform's Performance</h2>
          <div className="flex justify-center mt-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {confusionMatrix.map((row, rowIndex) =>
                row.map((value, colIndex) => {
                  const labels = [
                    ["True Positive", "False Positive"],
                    ["False Negative", "True Negative"],
                  ];
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`h-28 w-28 flex flex-col items-center justify-center font-bold rounded ${
                        rowIndex === colIndex
                          ? "bg-violet-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >                      
                      <div className="text-lg">{value}</div>
                      <div className="text-sm font-medium">
                        {labels[rowIndex][colIndex]}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Part */}
      <div className="w-1/2 p-8 bg-sidebar">
        <div className="relative group">
          <h2 className="text-3xl font-bold mt-5">Submit a Query</h2>
          <IoMdInformationCircleOutline className="ml-[14.5rem] mt-[-3%] cursor-progress text-violet-500" />

          {/* Tooltip */}
          <span className="tooltip absolute hidden group-hover:block top-full right-0 mt-2 w-48 p-2 bg-black text-white text-sm rounded">
            Test the platform by entering a prompt, response, context, and
            hallucination status. Results, including performance metrics like
            false positives and true values, will appear on the left.
          </span>
        </div>
        <form className="mt-4 space-y-4">
          {/* Query */}
          <div>
            <label className="block font-semibold mb-2 relative">
              Query
              <IoMdInformationCircleOutline className="ml-[3.25rem] mt-[-3%] cursor-progress text-violet-500" />
              <span className="tooltip hidden absolute top-full right-0 mt-2 w-48 p-2 bg-black text-white text-sm rounded">
                Provide the query to check for hallucinations.
              </span>
            </label>
            <input
              type="text"
              name="query"
              value={form.query}
              onChange={handleChange}
              className="w-full p-2 rounded bg-background border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
              placeholder="Enter your query"
              required
            />
          </div>

          {/* Response */}
          <div>
            <label className="block font-semibold mb-2 relative">
              Response
              <IoMdInformationCircleOutline className="ml-[5rem] mt-[-3%] cursor-progress text-violet-500" />
              <span className="tooltip hidden absolute top-full right-0 mt-2 w-48 p-2 bg-black text-white text-sm rounded">
                Provide the AI-generated response to analyze.
              </span>
            </label>
            <textarea
              name="response"
              className="w-full p-2 rounded bg-background border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
              rows={3}
              value={form.response}
              onChange={handleChange}
              placeholder="Enter the response"
              required
            ></textarea>
          </div>

          {/* Context */}
          <div>
            <label className="block font-semibold mb-2 relative">
              Context
              <IoMdInformationCircleOutline className="ml-[4rem] mt-[-3%] cursor-progress text-violet-500" />
              <span className="tooltip hidden absolute top-full right-0 mt-2 w-48 p-2 bg-black text-white text-sm rounded">
                Provide context for the query to help validate the response.
              </span>
            </label>
            <textarea
              name="context"
              value={form.context}
              onChange={handleChange}
              className="w-full p-2 rounded bg-background border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
              rows={3}
              placeholder="Provide context for the query"
              required
            ></textarea>
          </div>

          {/* Result */}
          <div>
            <label className="block font-semibold mb-2 relative">
              Expected Result
              <IoMdInformationCircleOutline className="ml-[8rem] mt-[-3%] cursor-progress text-violet-500" />
              <span className="tooltip hidden absolute top-full right-0 mt-2 w-48 p-2 bg-black text-white text-sm rounded">
                Choose if the query is hallucinating or not.
              </span>
            </label>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="result"
                  value="Halucinating"
                  checked={form.result === "Halucinating"}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                Hallucinating
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="result"
                  value="Not Halucinating"
                  checked={form.result === "Not Halucinating"}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                Not Hallucinating
              </label>
            </div>
          </div>

          <button
            onClick={handleFormSubmit}
            type="submit"
            className={`w-full p-2 rounded text-white font-bold ${
              submitted
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-violet-500 hover:bg-violet-600"
            }`}
            disabled={submitted}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutUs;

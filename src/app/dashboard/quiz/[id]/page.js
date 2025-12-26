"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGeneral } from "@/context/generalContext";

export default function QuizPage() {
  const router = useRouter();
  const { id } = useParams(); // Use useParams to get the dynamic id from the URL
  const { quiz, setQuiz, clearQuiz } = useGeneral();
  const [answers, setAnswers] = useState(new Array(0).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      const title = new URLSearchParams(window.location.search).get("title");
      const topic = new URLSearchParams(window.location.search).get("topic");

      try {
        const response = await fetch("/api/quiz/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, title, topic, useAI: false }),
        });

        const data = await response.json();
        console.log("Quiz Data:", data); // Debugging the response

        if (data.ok && data.quiz) {
          setQuiz(data.quiz); // Set the quiz data to context
        } else {
          console.error("Failed to fetch quiz data:", data.error);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }

      setLoading(false); // Set loading to false once the data is fetched
    };

    fetchQuizData();
  }, [id, setQuiz]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let userScore = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz[index]?.a) {
        userScore++;
      }
    });
    setScore(userScore);
    setSubmitted(true);
  };

  const handleBackToHome = () => {
    clearQuiz();
    router.push("/dashboard");
  };

  // Loading state before data is fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black/80">
        <div className="animate-pulse space-y-4 text-white">
          <div className="h-8 w-3/4 bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 rounded-md"></div>
          <div className="h-6 w-1/2 bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 rounded-md"></div>
          <div className="h-4 w-full bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center text-white">
        <h2 className="text-xl font-semibold">No quiz data available.</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 bg-black/20 rounded-2xl backdrop-blur-xl mt-10 mb-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {quiz[0]?.title}
            </h2>
            <div className="text-sm font-medium text-white/60">
              {quiz[0]?.topic}
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-3 border border-white/10 text-white text-sm">
            <span>ID: {id}</span>
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            {quiz.map((question, index) => (
              <div
                key={index}
                className="bg-black/30 p-6 rounded-2xl border border-white/10 hover:bg-black/40 transition-all"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  {question.q}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {question.o.map((option, i) => (
                    <label
                      key={i}
                      className="block text-white/80 cursor-pointer p-4 rounded-lg hover:bg-black/40 transition-all"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                        className="hidden accent-cyan-400"
                      />
                      <div className="flex items-center justify-center p-2 bg-black/40 border border-white/10 rounded-lg">
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 transition ease-in-out"
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Score: {score} / 10
            </h2>
            <button
              onClick={handleBackToHome}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-teal-500 hover:to-green-500 transition ease-in-out"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

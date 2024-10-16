"use client";

import { useState } from "react";
import axios from "axios";

export default function URLForm() {
  const [longURL, setLongURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [error, setError] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiration, setExpiration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortURL("");

    try {
      const res = await axios.post(`${process.env.API_URL}/api/url/shorten`, {
        longURL,
        customAlias: customAlias || undefined,
        expirationTime: expiration ? parseInt(expiration) : undefined,
      });
      setShortURL(res.data.shortURL);
    } catch (err) {
      setError("Failed to generate short URL");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          URL Shortener
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Long URL
            </label>
            <input
              type="url"
              placeholder="Enter long URL"
              value={longURL}
              onChange={(e) => setLongURL(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Custom Alias (optional)
            </label>
            <input
              type="text"
              placeholder="Custom Alias (optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Expiration (seconds, optional)
            </label>
            <input
              type="number"
              placeholder="Expiration (seconds, optional)"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Shorten URL
          </button>
        </form>

        {shortURL && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner">
            <p className="text-lg text-gray-700 font-medium">
              Your Short URL:{" "}
              <a
                href={shortURL}
                className="text-indigo-600 font-bold underline hover:text-indigo-800"
              >
                {shortURL}
              </a>
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-600 font-semibold mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import axios from '../lib/axios';

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [serverResponse, setServerResponse] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleEnterClick = async () => {
    try {
      const response = await axios.post("/test", {
        input: inputValue
      });
  
      console.log(response.data);
      setServerResponse(response.data.message);
    } catch (error) {
      console.error("There was a problem with the axios operation:", error);
    }
  };

  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="border-2"
      />
      <br />
      <button className='border-2' onClick={handleEnterClick}>Enter</button>
      <p>{serverResponse}</p>
    </>
  );
}

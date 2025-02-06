import { useState, useEffect } from "react";
import axios from "axios";
import PDFUploader from "./components/PDFUploader"; // Assuming the PDFUploader is in the same folder
import Whiteboard from "./components/Whiteboard"; // Import the Whiteboard component

const App = () => {
  const [extractedText, setExtractedText] = useState("");
  const [aiResponseParts, setAiResponseParts] = useState([]);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Handles extracted text from PDF
  const handleExtractedText = (text) => {
    setExtractedText(text);
    fetchAIResponse(text);
  };

  // Fetch AI response for the extracted text
  const fetchAIResponse = async (text) => {
    try {
      setLoading(true);
      const response = await axios.post("YOUR_OPENAI_API_URL", {
        prompt: text,
        max_tokens: 500,
        n: 1,
        stop: ["\n", "\r"],
        temperature: 0.7,
      });

      const aiResponse = response.data.choices[0].text.trim();
      
      // Simulating breaking the response into parts (you can adjust this logic as needed)
      const parts = aiResponse.match(/.{1,300}/g); // Splitting into 300 characters for demonstration
      setAiResponseParts(parts || [aiResponse]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setLoading(false);
    }
  };

  // Handle "Yes" response to move to the next part
  const handlePollYes = () => {
    if (currentPartIndex < aiResponseParts.length - 1) {
      setCurrentPartIndex(currentPartIndex + 1);
      speakText(aiResponseParts[currentPartIndex + 1]);
    }
  };

  // Handle "No" response (repeat or offer alternate explanation)
  const handlePollNo = () => {
    // Optionally, you can repeat the current part or send a new prompt to OpenAI.
    speakText(aiResponseParts[currentPartIndex]); // Repeat the current part
  };

  // Function to use TTS (Text-to-Speech)
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (aiResponseParts.length > 0) {
      // Start reading the first part once the AI response is available
      speakText(aiResponseParts[0]);
    }
  }, [aiResponseParts]);

  return (
    <div>
      <h1>Namma Tutor</h1>
      <PDFUploader onExtractedText={handleExtractedText} />
      <Whiteboard extractedText={aiResponseParts[currentPartIndex]} />

      {loading && <p>Loading AI response...</p>}

      {aiResponseParts.length > 0 && (
        <div>
          <p>Do you want to continue to the next part?</p>
          <button onClick={handlePollYes}>Yes</button>
          <button onClick={handlePollNo}>No</button>
        </div>
      )}
    </div>
  );
};

export default App;

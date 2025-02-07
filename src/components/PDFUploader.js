import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import worker from "pdfjs-dist/build/pdf.worker.entry";
import axios from "axios";

// Set the worker source for pdf.js
GlobalWorkerOptions.workerSrc = worker;

const PDFUploader = ({ onExtractedText }) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
        let extractedText = "";

        // Iterate through all pages to extract text
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          if (textContent.items && textContent.items.length > 0) {
            extractedText += textContent.items.map((item) => item.str).join(" ") + "\n";
          }
        }

        setLoading(false);
        onExtractedText(extractedText); // Pass the extracted text to parent
      } catch (error) {
        setLoading(false);
        console.error("Error extracting PDF text:", error);
      }
    };
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="border p-2"
      />
      {loading && <p className="text-blue-500">Extracting text...</p>}
    </div>
  );
};

const App = () => {
  const [extractedText, setExtractedText] = useState("");
  const [response, setResponse] = useState("");
  const [selectedText, setSelectedText] = useState("");

  // Example language selected by user
  const userLanguage = "en"; // Assume user selected 'en' for English

  const handleExtractedText = (text) => {
    console.log("Received extracted text in App:", text);

    if (text.trim().length > 0) {
      setExtractedText(text);
      // Automatically process extracted text based on selected language
      fetchAIResponse(text);
    } else {
      console.error("No valid extracted text.");
    }
  };

  const fetchAIResponse = async (text) => {
    try {
      const response = await axios.post("YOUR_OPENAI_API_URL", {
        prompt: text,
        max_tokens: 500,
        n: 1,
        stop: ["\n", "\r"],
        temperature: 0.7,
      });

      // Assuming the response comes in parts and is displayed on whiteboard
      setResponse(response.data.choices[0].text);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const handleSelection = (e) => {
    // Get selected text and store it
    const selected = window.getSelection().toString();
    setSelectedText(selected);
    console.log("Selected text:", selected);
  };

  return (
    <div>
      <h1>PDF Text Extraction</h1>
      <PDFUploader onExtractedText={handleExtractedText} />
      
      <div className="mt-4">
        <h2>Extracted Text:</h2>
        <div className="width-scroll">{extractedText}</div>

        {selectedText && (
          <div>
            <h3>Selected Text:</h3>
            <pre>{selectedText}</pre>
            <button onClick={() => fetchAIResponse(selectedText)}>Get Explanation</button>
          </div>
        )}

        {response && (
          <div>
            <h3>AI Explanation:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

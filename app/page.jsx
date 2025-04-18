"use client"
import { useState, useEffect } from "react";
import { ec as EC } from "elliptic";

// Initialize the secp256k1 elliptic curve
const ec = new EC('secp256k1');

const generatePublicKey = (values) => {
  // Combine hex values into a single private key string
  const privateKeyHex = values.join("");

  try {
    // Create a key pair from the private key
    const key = ec.keyFromPrivate(privateKeyHex);
    
    // Get the public key in compressed format (as a hex string)
    const publicKey = key.getPublic(true, "hex");
  
    return publicKey;
  } catch (error) {
   
    return publicKey
  }
};

const getRandomHexValue = () => {
  const hexCharacters = "0123456789ABCDEF";
  return hexCharacters[Math.floor(Math.random() * 16)];
};

export default function Home() {
  const target = "02e0a8b039282faf6fe0fd769cfbc4b6b4cf8758ba68220eac420e32b91ddfa673";
  const hexOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
  const initialValues = new Array(40).fill("0");
  initialValues[0] = 1;

  const initiallockValues = new Array(40).fill(0);
  const [lockValues, setLockValues] = useState(initiallockValues);

  const [values, setValues] = useState(initialValues);
  const [publicKey, setPublicKey] = useState("000000000000000000000000000000000000000000000000000000000000000000");

  const lockIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>;

  const unlockIcon =  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>;

const [isRunning, setIsRunning] = useState(false); // New state to track if randomization is running
const [intervalId, setIntervalId] = useState(null); // New state to store the interval ID

 // Initialize history with 50 entries, each filled with `initialValues`
const [history, setHistory] = useState([initialValues]); // History state with the initial values
const [historyIndex, setHistoryIndex] = useState(0); // Index to track the current position in history

const hexRegex = /^[0-9A-F]+$/;
const [hasInvalidChar, setHasInvalidChar] = useState(false); 

const [result, setResult] = useState([]); // To store the last 10 results


  const handleSelectChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
    setPublicKey(generatePublicKey(newValues));
  };

  const handleRandomButtonClick = () => {
    console.log("result", result)
    if(target == publicKey) {
      clearInterval(intervalId);
      setIsRunning(false);
      setIntervalId(null);
      return false;
    }
   //const newValues = values.map((val) => (val === "0" ? getRandomHexValue() : val));
   const newValues = values.map((val, index) => {
    // Only update if lockValues[index] is 0 and the value is "0"
      if (lockValues[index] === 0) {
        return getRandomHexValue();
      } else {
        return val; // Keep the current value if locked or non-zero
      }
    });

    // Save new values to history and update the index
   let updatedHistory = [...history.slice(0, historyIndex + 1), newValues];




    // If history length exceeds 50, remove the oldest item
    if (updatedHistory.length > 50) {
      updatedHistory = updatedHistory.slice(1); // Remove the first (oldest) item
    }
    
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setValues(newValues);

    // Update public key and result
    const newPublicKey = generatePublicKey(newValues);
    setPublicKey(newPublicKey); // publicKey will trigger updateResult via useEffect
    const newPrivateKey = newValues.join('');
    updateResult(newPrivateKey, newPublicKey);
  };

  const handleResetButtonClick = () => {
    const initialValues = new Array(40).fill("0");
    initialValues[0] = 1;
    setValues(initialValues)
    setPublicKey(generatePublicKey(initialValues));
  
  }

  const setClass = (v, i) => {
    // Assuming target is an array or a string you want to compare with publicKey
    if (target[i] === v) {
      return "bg-green-500 text-green-900 px-1"; // Add a class if the condition matches
    } else {
      return "px-1"; // Return an empty string if no class is applied
    }
  };

  const lock = (index) => {
    const newLockValues = [...lockValues];
    newLockValues[index] = 1;
    setLockValues(newLockValues);
    console.log(lockValues);
  }

  const unlock = (index) => {
    const newLockValues = [...lockValues];
    newLockValues[index] = 0;
    setLockValues(newLockValues);
    console.log(lockValues);
  }

  // Function to start or stop the randomization process
  const run = () => {
    if (isRunning) {
      // If already running, stop the interval
      clearInterval(intervalId);
      setIsRunning(false);
      setIntervalId(null);
    } else {
      // Start the interval (10 randomizations per second)
      const id = setInterval(() => {
        handleRandomButtonClick()
   
      }, 100); // 100 milliseconds = 10 times per second
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  // Function to move back in history
  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setValues(history[newIndex]);
      generatePublicKey(history[newIndex]); // Generate public key for the previous state
      setPublicKey(generatePublicKey(history[newIndex]));
    }
  };

  // Function to move forward in history
  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setValues(history[newIndex]);
      generatePublicKey(history[newIndex]); // Generate public key for the next state
      setPublicKey(generatePublicKey(history[newIndex]));
    }
  };

   // Handle change in text input
   const handleInputChange = (e) => {
    let newValue = e.target.value.toUpperCase();
    
    
     // Check if the input contains any non-hexadecimal characters
    const isValidHex = newValue.split('').every((char) => hexRegex.test(char));
    // Update the state to indicate if invalid characters are found
    setHasInvalidChar(!isValidHex);

    // Update the values array based on the input text (only up to 40 characters)
    const updatedValues = newValue
      .split('') // Convert the input string into an array
      .slice(0, 40) // Ensure it doesn't exceed 40 characters
      .map((char, index) => char || values[index]); // If a character is missing, retain the old value
      
    // Update the state for select fields
    setValues(updatedValues);
    setPublicKey(generatePublicKey(updatedValues));
  };

  const calculateMatch = (generatedPublicKey, targetPublicKey) => {
    let matchCount = 0;
  
    // Ensure both public keys are defined and have a valid length
    if (!generatedPublicKey || !targetPublicKey || generatedPublicKey.length !== targetPublicKey.length) {
      console.error('Public key or target public key is missing or has a mismatched length.');
      return { matchCount: 0, matchPercentage: 0 };
    }
  
    // Compare each character in the generatedPublicKey with the targetPublicKey
    generatedPublicKey.split('').forEach((char, index) => {
      if (char === targetPublicKey[index]) {
        matchCount++;
      }
    });
  
    const matchPercentage = ((matchCount / targetPublicKey.length) * 100).toFixed(2);
    return { matchCount, matchPercentage };
  };
  

  // Function to update the result history
  const updateResult = (privateKey, publicKey) => {
    const { matchCount, matchPercentage } = calculateMatch(publicKey, target);
  
    // Add the new result to the history
    const newResult = {
      matchPercentage: parseFloat(matchPercentage),
      matchCount,
      privateKey, // Store the private key used to generate the public key
    };
  
    setResult((prevResult) => {
      let updatedResult = [...prevResult, newResult];
  
      // Sort the history by matchPercentage in descending order
      updatedResult.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
      // Keep only the top 10 records
      if (updatedResult.length > 10) {
        updatedResult = updatedResult.slice(0, 10);
      }
  
      return updatedResult;
    });
  };

// Update result when publicKey changes
useEffect(() => {
  if (publicKey) {
    updateResult();
  }
}, [publicKey]);

  return (
    <div style={{ padding: "20px" }}>
       <p className="font-bold">Result</p>
      <div className="bg-gray-100 dark:bg-gray-700 p-2 uppercase flex flex-wrap gap-1 font-semibold mb-5">
        {publicKey.split("").map((v, i) => {
          const className = setClass(v, i);
          return (
            <span className={className} key={i}>
              {v}
            </span>
          );
        })}
      </div>

      <p className="font-bold">Hexadecimal Input</p>
      <input
        className={values.join('').length != 40 || hasInvalidChar ? "border-2 border-red-400 w-full p-2 outline-0": "border-2 outline-0 border-green-400 w-full p-2"  } //
        type="text"
        value={values.join('')} // Join values without commas
        maxLength={40} // Limit input to 40 characters
        onChange={handleInputChange} // Handle input change
      />
      <div className="bg-gray-100 dark:bg-gray-700 grid grid-cols-3 lg:grid-cols-10 gap-5 p-2 mb-3">
        
        {values.map((value, index) => (
          <div className="flex bg-white dark:bg-gray-800 border dark:border-gray-600 space-x-2 items-center p-1">
            <div className="w-full flex">
            <select disabled = {lockValues[index] == 1 ? true: false}
              key={index}
              value={value}
              onChange={(e) => handleSelectChange(index, e)}
              className="w-full h-8 dark:bg-gray-950"
            >
              {hexOptions.map((option) => (
                <option disabled={index === 0 && option == 0} key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            </div>
           {lockValues[index] == 0 ? <div className="bg-gray-200 dark:bg-transparent p-1" onClick={()=>{lock(index)}}>{unlockIcon}</div> : <div className="bg-gray-200 dark:bg-transparent p-1 text-gray-400" onClick={()=>{unlock(index)}}>{lockIcon}</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }} className="mb-5">
      <button className={historyIndex === 0 ? "bg-gray-200 p-4 mr-3 text-white" : "bg-gray-600 p-4 mr-3 text-white"} onClick={handleBack} disabled={historyIndex === 0} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Back
      </button>
      <button className={historyIndex === history.length - 1 ? "bg-gray-200 mr-3 p-4 text-white" : "bg-gray-600 mr-3 p-4 text-white"} onClick={handleForward} disabled={historyIndex === history.length - 1} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Forward
      </button>

        <button className="bg-blue-600 p-4 text-white" onClick={handleRandomButtonClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Random
        </button>
        <button className="bg-yellow-600 p-4 ml-4 text-white" onClick={handleResetButtonClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Reset
        </button>
        <button className="bg-pink-600 p-4 ml-4 text-white" onClick={run} style={{ padding: "10px 20px", fontSize: "16px" }}>
        {isRunning ? "Stop" : "Auto Run"}
      </button>

     

      </div>
      
      <p className="font-bold">Expected result</p>
      <p className="p-2 bg-gray-100 dark:bg-gray-700 break-words uppercase font-semibold tracking-wider">
        {target}
      </p>

      {/* Display the last 10 match results in DESC order */}
      <h3 className="font-bold mt-4">Match History (Last 10 Runs)</h3>
      <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded-md">
        {result.map((r, index) => (
          <p key={index} className="mb-2">
            <strong>{r.matchPercentage}%</strong> match ({r.matchCount} characters) - Generated key: {r.privateKey}
          </p>
        ))}
      </div>
    </div>
  );
}

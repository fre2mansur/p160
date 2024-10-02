"use client"
import { useState } from "react";
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

  const lockIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>;

  const unlockIcon =  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
</svg>;

const [isRunning, setIsRunning] = useState(false); // New state to track if randomization is running
const [intervalId, setIntervalId] = useState(null); // New state to store the interval ID

const [history, setHistory] = useState([initialValues]); // History state with the initial values
const [historyIndex, setHistoryIndex] = useState(0); // Index to track the current position in history


  const handleSelectChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
    setPublicKey(generatePublicKey(newValues));
  };

  const handleRandomButtonClick = () => {
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
    const updatedHistory = [...history.slice(0, historyIndex + 1), newValues];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
   
    setValues(newValues);
    setPublicKey(generatePublicKey(newValues));
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
    </div>
  );
}

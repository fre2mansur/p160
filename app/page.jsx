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

  const handleSelectChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
    setPublicKey(generatePublicKey(newValues));
  };

  const handleRandomButtonClick = () => {
    if(target == publicKey) {
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
      return "bg-green-500"; // Add a class if the condition matches
    } else {
      return ""; // Return an empty string if no class is applied
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

  return (
    <div style={{ padding: "20px" }}>

      <h1>Hexadecimal Input</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {values.map((value, index) => (
          <div class="flex bg-gray-100 space-x-2 items-center">
          <select disabled = {lockValues[index] == 1 ? true: false}
            key={index}
            value={value}
            onChange={(e) => handleSelectChange(index, e)}
            style={{ width: "60px", height: "40px", fontSize: "16px" }}
          >
            {hexOptions.map((option) => (
              <option disabled={index === 0 && option == 0} key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
           {lockValues[index] == 0 ? <div onClick={()=>{lock(index)}}>{unlockIcon}</div> : <div onClick={()=>{unlock(index)}}>{lockIcon}</div>}
            
            
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button className="bg-blue-600 p-4 text-white" onClick={handleRandomButtonClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Random
        </button>
        <button className="bg-yellow-600 p-4 ml-4 text-white" onClick={handleResetButtonClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Reset
        </button>
      </div>
      <div style={{ marginTop: "20px", fontSize: "30px", textTransform: "uppercase" }}>
        <strong>Public Key:</strong> <br/> 
        {publicKey.split("").map((v, i) => {
          const className = setClass(v, i);
          return (
            <span className={className} key={i}>
              {v}
            </span>
          );
        })}
      </div>
      

      <div style={{ marginTop: "20px", fontSize: "30px", textTransform: "uppercase" }}>
     
        <h2>{target}
        </h2>
        TO BE MATCHED
      </div>
    </div>
  );
}

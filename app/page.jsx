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
  const [values, setValues] = useState(initialValues);
  const [publicKey, setPublicKey] = useState("000000000000000000000000000000000000000000000000000000000000000000");

  const handleSelectChange = (index, event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
    setPublicKey(generatePublicKey(newValues));
  };

  const handleRandomButtonClick = () => {
   // const newValues = values.map((val) => (val === "0" ? getRandomHexValue() : val));
   const newValues = values.map((val) => ( getRandomHexValue()));
   
    setValues(newValues);
    setPublicKey(generatePublicKey(newValues));
  };

  const setClass = (v, i) => {
    // Assuming target is an array or a string you want to compare with publicKey
    if (target[i] === v) {
      return "bg-green-500"; // Add a class if the condition matches
    } else {
      return ""; // Return an empty string if no class is applied
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      
      <h1>Hexadecimal Input</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {values.map((value, index) => (
          <select
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
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleRandomButtonClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Random
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

"use client";

import { useState, useEffect } from "react";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("calculatorHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event;
      if ((/^[0-9]$/).test(key)) {
        handleClick(key);
      } else if (["+", "-", "*", "/", "%", "^"].includes(key)) {
        handleClick(key);
      } else if (key === "Enter") {
        event.preventDefault();
        calculate();
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "Escape") {
        handleClear();
      } else if (key === ".") {
        handleClick(".");
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [input]);

  const handleClick = (value) => {
    if (isOperator(value) && isOperator(input.slice(-1))) {
      return;
    }

    const lastNum = input.split(/[-+*/^%]/).slice(-1)[0];
    if (value === "." && lastNum.includes(".")) {
      return;
    }

    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      if (isOperator(input.slice(-1))) {
        setResult("Error");
        return;
      }

      let expression = input.replace("^", "**").replace("%", "/100");

      const fn = new Function("return " + expression);
      const evalResult = fn();

      if (evalResult === Infinity || evalResult === -Infinity || isNaN(evalResult)) {
        setResult("Error");
      } else {
        const formattedResult = formatNumber(evalResult);
        setResult(formattedResult);
        addToHistory(input, formattedResult);
      }
    } catch {
      setResult("Error");
    }
  };

  const addToHistory = (expression, result) => {
    const newHistory = [...history, { expression, result }];
    setHistory(newHistory);
  };

  const formatNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 10 });
  };

  const isOperator = (char) => {
    return ["+", "-", "*", "/", "%", "^"].includes(char);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-4">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="mb-4">
          <div className="text-right text-2xl mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
            {input || "0"}
          </div>
          <div className="text-right text-xl p-2 bg-gray-200 dark:bg-gray-600 rounded">
            {result || "0"}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <button
            className="col-span-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-700"
            onClick={handleClear}
          >
            AC
          </button>
          <button
            className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-700"
            onClick={handleBackspace}
          >
            C
          </button>
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
            onClick={() => handleClick("/")}
          >
            ÷
          </button>

          {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0"].map((num) => (
            <button
              key={num}
              className="bg-gray-200 dark:bg-gray-700 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 dark:focus:ring-gray-500"
              onClick={() => handleClick(num)}
            >
              {num}
            </button>
          ))}

          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
            onClick={() => handleClick("*")}
          >
            ×
          </button>
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
            onClick={() => handleClick("-")}
          >
            -
          </button>
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
            onClick={() => handleClick("+")}
          >
            +
          </button>
          <button
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-700"
            onClick={calculate}
          >
            =
          </button>

          <button
            className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-700"
            onClick={() => handleClick("%")}
          >
            %
          </button>
          <button
            className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-700"
            onClick={() => handleClick("^")}
          >
            ^
          </button>
          <button
            className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-700"
            onClick={() => handleClick("Math.sqrt(")}
          >
            √
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">History</h3>
          <ul className="max-h-40 overflow-y-auto">
            {history.map((item, index) => (
              <li key={index} className="flex justify-between py-1">
                <span className="text-gray-600 dark:text-gray-400">{item.expression}</span>
                <span className="text-gray-800 dark:text-gray-100">{item.result}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

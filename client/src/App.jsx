import { useState, useEffect, useCallback } from "react";
import "./App.css";
import WordBox from "./WordBox";
import { FidgetSpinner } from "react-loader-spinner";

function App() {
  const [title, setTitle] = useState("");
  const [titleLink, setTitleLink] = useState("");
  const [words, setWords] = useState([]);
  const [guessedList, setGuessedList] = useState([]);
  const [numSubmits, setNumSubmits] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hintArray, setHintArray] = useState([]);
  const [image1, setImage1] = useState([]);
  const [image2, setImage2] = useState([]);
  const [image3, setImage3] = useState([]);
  const [clickedImage, setClickedImage] = useState("");
  const [isHelp, setIsHelp] = useState(false);
  const [inputCorrect, setInputCorrect] = useState([]);
  const [realSubmits, setRealSubmits] = useState(0);

  // on load, fetch info from api and initialize guessedLisst array
  useEffect(() => {
    fetchTitle();
    fetchWords();
    fetchImage();
    setInputCorrect(new Array(words.length).fill(false));
  }, []);

  useEffect(() => {
    if (realSubmits > 0) {
      setFinished(isFullCleared(completed));
    }
    if (realSubmits >= 3) {
      for (let i = 0; i < completed.length; i++) {
        if (!completed[i][0] && !hintArray.includes(i + 1)) {
          let newArr = hintArray;
          newArr.push(i + 1);
          setHintArray(newArr);
          break;
        }
      }
    }
  }, [realSubmits]);

  // fetch title from api
  const fetchTitle = async () => {
    const response = await fetch("/api/title");
    // const response = await fetch("http://10.0.0.8:5000/api/title");
    const data = await response.json();
    setTitle(data.title.title);
    setTitleLink(data.title.link);
  };

  // fetch words from api
  const fetchWords = async () => {
    const response = await fetch("/api/words");
    // const response = await fetch("http://10.0.0.8:5000/api/words");
    const data = await response.json();
    setWords(data.words);
  };

  // fetch image from api
  const fetchImage = async () => {
    const response = await fetch("/api/image");
    // const response = await fetch("http://10.0.0.8:5000/api/image");
    const data = await response.json();
    setClickedImage(data.image.image1);
    setImage1([data.image.image1, "active-button"]);
    setImage2([data.image.image2, "inactive-button"]);
    setImage3([data.image.image3, "inactive-button"]);
  };

  const setInputs = (wordId, state) => {
    let newArr = inputCorrect;
    newArr[wordId] = state;
    setInputCorrect(newArr);
  };

  const getInputs = () => {
    for (const inState of inputCorrect) {
      if (!inState) {
        return false;
      }
    }
    return true;
  };

  // register submits
  const onSubmit = async (e) => {
    e.preventDefault();
    setNumSubmits(numSubmits + 1);
    if (getInputs()) {
      setRealSubmits(realSubmits + 1);
    }
  };

  // updates the completed array
  const insertCompleted = (wordId, numGuesses, isDone) => {
    let newArr = completed;
    newArr[wordId] = [isDone, numGuesses];
    setCompleted(newArr);
  };

  // checks if the puzzle is fully solved
  const isFullCleared = (completedArr) => {
    let totalGuesses = 0;
    for (const wordState of completedArr) {
      if (!wordState[0]) {
        if (realSubmits >= 6) {
          setFailed(true);
        }
        return false;
      }
      totalGuesses += wordState[1];
    }
    if (totalGuesses == 0) {
      return "0";
    }
    return totalGuesses;
  };

  const switchImage = async (e) => {
    let clickedId = e.target.id;
    switch (clickedId) {
      case "1":
        setImage1([image1[0], "active-button"]);
        setImage2([image2[0], "inactive-button"]);
        setImage3([image3[0], "inactive-button"]);
        setClickedImage(image1[0]);
        break;
      case "2":
        setImage1([image1[0], "inactive-button"]);
        setImage2([image2[0], "active-button"]);
        setImage3([image3[0], "inactive-button"]);
        setClickedImage(image2[0]);
        break;
      case "3":
        setImage1([image1[0], "inactive-button"]);
        setImage2([image2[0], "inactive-button"]);
        setImage3([image3[0], "active-button"]);
        setClickedImage(image3[0]);
        break;
    }
  };

  const setHelp = () => {
    if (!isHelp) {
      setIsHelp(true);
    } else {
      setIsHelp(false);
    }
  };

  return (
    <div className="container">
      <div className="round-box">
        <div className="center">
          <div className="flex-h">
            <button
              className="material-symbols-outlined"
              onClick={()=> window.open("https://buymeacoffee.com/scoopdle", "_blank")}
              rel="noopener noreferrer"
            >
              coffee
            </button>
            <h1>Scoopdle</h1>
            <button
              type="button"
              className="material-symbols-outlined"
              onClick={setHelp}
            >
              help
            </button>
          </div>
          <h3>
            Get the scoop by filling in the blanks for a recent news headline
            based on AI-generated images
          </h3>
        </div>
      </div>
      {isHelp && (
        <div className="round-thin">
          <div className="top-right">
            <button
              type="button"
              className="material-symbols-outlined"
              onClick={setHelp}
            >
              close
            </button>
          </div>
          <p>
            Each day at 8:00pm EST, a new headline from recent news is selected.
            Your goal is to fill in the blanks based on the images and
            information provided.
          </p>
          <br></br>
          <p>
            Type a full sentence that matches the blanks and press enter/submit.
            If any words are incomplete or have already been guessed, a{" "}
            <span className="red-border">red box</span> will indicate that they
            need to be changed. Otherwise, your guesses will appear below the
            blanks, color coded as follows:
          </p>
          <br></br>
          <p>
            <span className="green-text">GREEN</span> letters match the headline
            word exactly
          </p>
          <br></br>
          <p>
            <span className="yellow-text">YELLOW</span> letters are at a
            different position in the word
          </p>
          <br></br>
          <p>
            <span className="red-text">RED</span> letters are not found in the
            headline word
          </p>
          <br></br>
          <p>
            More images unlock if you guess the headline incorrectly.{" "}
            <span className="blue-text">BLUE</span> hints will appear above
            incomplete words if all 3 images have already been revelead.
          </p>
        </div>
      )}
      {image3 != "" && (
        <img
          className="center"
          src={"data:image/jpeg;base64," + clickedImage}
          alt=""
        />
      )}
      {image3 == "" && (
        <div className="loader-spacing">
          <FidgetSpinner
            className="loader-spacing"
            backgroundColor="white"
            height={50}
            width={50}
          />
        </div>
      )}
      {!finished && realSubmits < 3 && !failed && (
        <div className="round-thin">
          <h2 className="green-text">{6 - realSubmits} attempts remaining</h2>
        </div>
      )}
      {!finished && realSubmits < 5 && realSubmits >= 3 && !failed && (
        <div className="round-thin">
          <h2 className="yellow-text">{6 - realSubmits} attempts remaining</h2>
        </div>
      )}
      {!finished && realSubmits > 4 && !failed && (
        <div className="round-thin">
          <h2 className="red-text">{6 - realSubmits} attempts remaining</h2>
        </div>
      )}
      <div className="flex-h">
        <button
          id="1"
          type="button"
          className={image1[1]}
          onClick={switchImage}
        >
          1
        </button>
        {(realSubmits >= 1 || finished || failed) && (
          <button
            id="2"
            type="button"
            className={image2[1]}
            onClick={switchImage}
          >
            2
          </button>
        )}
        {realSubmits < 1 && !finished && !failed && (
          <button id="2l" type="button" className="button-overlay">
            Locked - {1 - realSubmits} more guess
          </button>
        )}
        {(realSubmits >= 2 || finished || failed) && (
          <button
            id="3"
            type="button"
            className={image3[1]}
            onClick={switchImage}
          >
            3
          </button>
        )}
        {realSubmits < 2 && !finished && !failed && (
          <button id="3l" type="button" className="button-overlay">
            Locked - {2 - realSubmits} more guesses
          </button>
        )}
      </div>
      {finished && realSubmits > 3 && (
        <div className="round-thin">
          <h3>Congrats! It took you {realSubmits} tries!</h3>
          <a href={titleLink} target="_blank" rel="noopener noreferrer">
            Check out the full story here
          </a>
        </div>
      )}
      {finished && realSubmits <= 3 && realSubmits != 1 && (
        <div className="round-thin">
          <h3>Nice! It only took you {realSubmits} tries today!</h3>
          <a href={titleLink} target="_blank" rel="noopener noreferrer">
            Check out the full story here
          </a>
        </div>
      )}
      {finished && realSubmits == 1 && (
        <div className="round-thin">
          <h3>Wow awesome! It only took you {realSubmits} try?! Crazy!</h3>
          <a href={titleLink} target="_blank" rel="noopener noreferrer">
            Check out the full story here
          </a>
        </div>
      )}
      {failed && (
        <div className="round-thin">
          <h3>Better luck tomorrow...</h3>
          <a href={titleLink} target="_blank" rel="noopener noreferrer">
            Check out the full story here
          </a>
        </div>
      )}
      <form className="center-form" onSubmit={onSubmit} autoComplete="off">
        <div>
          {!finished && !failed && (
            <input
              className="center-button"
              type="submit"
              value="Submit"
            ></input>
          )}
        </div>
        <div className="break"></div>
        <div className="round-box">
          {words.map((word) => (
            <WordBox
              key={word.id}
              word={word}
              guessedList={guessedList}
              setGuessed={setGuessedList}
              numSubmits={numSubmits}
              setCompleted={insertCompleted}
              setInputCorrect={setInputs}
              allCorr={getInputs}
              inputCorrect={inputCorrect}
              isFailed={failed}
              hints={hintArray}
            />
          ))}
        </div>
      </form>
      <div className="bottom-tag">
        <span>Created by Brandon Heise</span>
        <br></br>
        <span>Images generated with </span>
        <a
          className="bottom-link"
          href="https://openai.com/index/dall-e-3/"
          target="_blank"
          rel="noopener noreferrer"
        >
          DALL·E 3 by OpenAI
        </a>
        <br></br>
        <span>Contact me at </span>
        <a
          className="bottom-link"
          href="mailto:brandoncodesnow@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          BrandonCodesNow@gmail.com
        </a>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import { useState, useEffect } from "react";
import "./WordBox.css";
import GuessedLabel from "./GuessedLabel";

const WordBox = ({
  word,
  guessedList,
  setGuessed,
  numSubmits,
  setCompleted,
  setInputCorrect,
  allCorr,
  isFailed,
  hints,
}) => {
  const [isGuessed, setIsGuessed] = useState(false);
  const [wordsGuessed, setWordsGuessed] = useState([]);
  const [lettersGuessed, setLettersGuessed] = useState([]);
  const [field, setField] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const [isPunct, setIsPunct] = useState(false);

  // modifies guessedList state to include current state for this wordbox
  const updateGuessed = (inputWord) => {
    let newArr = [...guessedList];
    if (inputWord.length > word.word.length) {
      newArr[word.wordNum] = inputWord.slice(0, -1);
      setGuessed(newArr);
      setField(inputWord.slice(0, -1));
    } else {
      newArr[word.wordNum] = inputWord;
      setGuessed(newArr);
      setField(inputWord);
    }
  };

  // each time guesses are submitted the guessed/completed states are updated and necessary words revealed
  useEffect(() => {
    if (typeof word.wordNum !== "undefined" && word.autoRevealed) {
      setCompleted(word.wordNum, wordsGuessed.length, true);
      setInputCorrect(word.wordNum, true);
      setIsGuessed(true);
    } else if (guessedList[word.wordNum]) {
      if (
        guessedList[word.wordNum].length >= word.word.length &&
        !wordsGuessed.includes(guessedList[word.wordNum])
      ) {
        setIsInputError(false);
        if (allCorr()) {
          setWordsGuessed([...wordsGuessed, guessedList[word.wordNum]]);
          let tempArr = lettersGuessed;
          tempArr.push(guessedList[word.wordNum].split(""));
          setLettersGuessed(tempArr);
          if (
            guessedList[word.wordNum].toLowerCase() == word.word.toLowerCase()
          ) {
            setCompleted(word.wordNum, wordsGuessed.length, true);
            setIsGuessed(true);
          } else {
            setIsGuessed(false);
            setCompleted(word.wordNum, wordsGuessed.length + 1, false);
          }
          setField("");
          setGuessed([]);
        }
      } else {
        setIsInputError(true);
      }
    } else if (!isGuessed) {
      if (numSubmits > 0) {
        setIsInputError(true);
      }
      setCompleted(word.wordNum, wordsGuessed.length, false);
    }
  }, [numSubmits]);

  useEffect(() => {
    if (typeof word.wordNum !== "undefined" && word.autoRevealed) {
      setInputCorrect(word.wordNum, true);
    } else if (guessedList[word.wordNum]) {
      if (
        guessedList[word.wordNum].length >= word.word.length &&
        !wordsGuessed.includes(guessedList[word.wordNum])
      ) {
        setInputCorrect(word.wordNum, true);
      } else if (!isGuessed) {
        setInputCorrect(word.wordNum, false);
      }
    } else if (!isGuessed) {
      setInputCorrect(word.wordNum, false);
    }
  }, [guessedList, field]);

  // checks to ensure the word has been populated
  if (!word) {
    return;
  } else if (word.pos == "PUNCT" && !isPunct) {
    setIsPunct(true);
  }

  if (isGuessed || word.autoRevealed || isFailed) {
    // displays box with word revealed
    return (
      <div className="center">
        <div className="center-grid">
          {word.autoRevealed && word.word == "-" && (
            <b className="dash">{word.word}</b>
          )}
          {!word.autoRevealed && word.word == "-" && (
            <g-b className="dash">{word.word}</g-b>
          )}
          {word.autoRevealed && isPunct && word.word != "-" && (
            <b className="punct">{word.word}</b>
          )}
          {!word.autoRevealed && isPunct && word.word != "-" && (
            <g-b className="punct">{word.word}</g-b>
          )}
          {word.autoRevealed && !isPunct && <b>{word.word}</b>}
          {!word.autoRevealed && !isPunct && isGuessed && (
            <g-b>{word.word}</g-b>
          )}
          {!word.autoRevealed && !isPunct && !isGuessed && isFailed && (
            <r-b>{word.word}</r-b>
          )}
        </div>
        <div className="break"></div>
        {lettersGuessed
          .slice(0, -1)
          .toReversed()
          .map((guessedWord) => (
            <GuessedLabel
              key={guessedWord}
              letters={guessedWord}
              corrWord={word}
            />
          ))}
      </div>
    );
  } else {
    let blankStr = "-";
    // displays box with word unrevealed
    return (
      <div key={word.wordNum} className="center">
        <div className="center-grid">
          {hints.includes(word.wordNum) && <low-label-b>({word.helpString})</low-label-b>}

          {!hints.includes(word.wordNum) && (
            <high-label>{word.numLetters}</high-label>
          )}
          {!hints.includes(word.wordNum) && <low-label>{word.pos}</low-label>}

          <input-overlay>{blankStr.repeat(word.numLetters)}</input-overlay>
          {!isInputError && (
            <input
              className="no-outline"
              id={word.wordNum}
              name={word.wordNum}
              maxLength={word.numLetters}
              size={word.numLetters}
              value={field}
              onChange={(e) => updateGuessed(e.target.value)}
            />
          )}
          {isInputError && (
            <input
              className="red-outline"
              id={word.wordNum + "red"}
              name={word.wordNum}
              maxLength={word.numLetters}
              size={word.numLetters}
              value={field}
              onChange={(e) => updateGuessed(e.target.value)}
            />
          )}
        </div>
        <div className="break"></div>
        {lettersGuessed.toReversed().map((guessedWord) => (
          <GuessedLabel
            key={guessedWord}
            letters={guessedWord}
            corrWord={word}
          />
        ))}
      </div>
    );
  }
};

export default WordBox;

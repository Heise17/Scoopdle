import React from "react";
import { useState, useEffect } from "react";
import "./GuessedLabel.css";

const GuessedLabel = ({ letters, corrWord }) => {
  const [letterColors, setLetterColors] = useState([]);

  // when label is created, determine which letters match and store the states
  useEffect(() => {
    let tMatch = new Array(letters.length);
    let tContained = new Array(letters.length);
    let tLetterColors = new Array(letters.length);
    let tYellowsLeft = {
      a: corrWord.a,
      b: corrWord.b,
      c: corrWord.c,
      d: corrWord.d,
      e: corrWord.e,
      f: corrWord.f,
      g: corrWord.g,
      h: corrWord.h,
      i: corrWord.i,
      j: corrWord.j,
      k: corrWord.k,
      l: corrWord.l,
      m: corrWord.m,
      n: corrWord.n,
      o: corrWord.o,
      p: corrWord.p,
      q: corrWord.q,
      r: corrWord.r,
      s: corrWord.s,
      t: corrWord.t,
      u: corrWord.u,
      v: corrWord.v,
      w: corrWord.w,
      x: corrWord.x,
      y: corrWord.y,
      z: corrWord.z,
    };
    for (let i = 0; i < letters.length; i++) {
      // check for exact match
      if (
        letters[i].toLowerCase() == corrWord.word.split("")[i].toLowerCase()
      ) {
        tMatch[i] = true;
        tYellowsLeft[letters[i].toLowerCase()] -= 1;
      } else {
        tMatch[i] = false;
        // check if word contains letter
        if (
          corrWord.word
            .toLowerCase()
            .split("")
            .includes(letters[i].toLowerCase())
        ) {
          tContained[i] = true;
        } else {
          tContained[i] = false;
        }
      }
    }
    for (let i = 0; i < letters.length; i++) {
      // check for exact match
      if (
        letters[i].toLowerCase() == corrWord.word.split("")[i].toLowerCase()
      ) {
        tLetterColors[i] = "green";
      } else {
        tMatch[i] = false;
        // check if word contains letter
        if (
          corrWord.word
            .toLowerCase()
            .split("")
            .includes(letters[i].toLowerCase())
        && tYellowsLeft[letters[i].toLowerCase()] > 0) {
            tLetterColors[i] = "yellow";
            tYellowsLeft[letters[i].toLowerCase()] -= 1;
        } else {
            tLetterColors[i] = "red";
        }
      }
    }
    setLetterColors(tLetterColors);
  }, []);

  // display each letter's color based on its state
  return (
    <div className="guessed-box">
      {letters.map(
        (letter, i) =>
          (letterColors[i] == "yellow" && (
            <no-space-orange key={i}>{letter}</no-space-orange>
          )) ||
          (letterColors[i] == "green" && (
            <no-space-green key={i}>{letter}</no-space-green>
          )) ||
          (letterColors[i] == "red" && (
            <no-space-red key={i}>{letter}</no-space-red>
          ))
      )}
    </div>
  );
};

export default GuessedLabel;

import React, { useState } from 'react';
import styled from 'styled-components';
import Keyboard from './Keyboard';
import Board from './Board';
import request from '../utils/request';
import { IGuessedLetters, LetterPositionEnum } from '../utils/LetterPosition';
import { ACTUAL_WORD, MAX_GUESSES, WORD_LENGTH } from '../utils/constants';
import Modal, { ModalType } from './Modal';

// Each guess will render a row
// Maybe in the future we can introduce some UI elements so the user can
// set these themselves as a way of increasing / decreasing the difficulty
const GameStyles = styled.div`
  display: grid;
  min-height: 100%;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 100%;
  grid-gap: .25rem;
  max-width: 520px;
  margin: 0 auto;
`;

function Game() {
  const [guess, updateGuess] = useState<string[]>([]);
  const [attempt, updateAttemptCount] = useState(1);
  const [prevGuesses, addGuessToPrev] = useState<string[][]>([[]]);
  const [flipRowAnimation, setFlipRowAnimation] = useState<boolean>(false);
  const [animateRow, setAnimateRow] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<IGuessedLetters[]>([]);
  // modal
  const [showModal, updateShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameState, updateGameState] = useState(ModalType.none);

  const checkIfGuessIsRealWord = async () => {
    // return true;
    const response = await request(guess.join(''));
    return response.some((item: any) => typeof (item) === 'object');
  };

  // eslint-disable-next-line arrow-body-style
  const checkWinCondition = () => {
    return guess.join('').toUpperCase() === ACTUAL_WORD.join(''.toUpperCase());
  };

  const checkGameOver = () => attempt === MAX_GUESSES;

  /**
   * 1. Board === Word => You win!
   * 2. Board !== Word && attempt === MAX_ATTEMPTS => You lost!
   * 3. Board !== Word && attempt < MAX_ATTEMPTS => guess gets hints and player moves
   * onto the next row
   */
  const checkGuess = async () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (!gameActive()) {
      updateShowModal(true);
    }
    if (guess.length < WORD_LENGTH) {
      return;
    }

    setAnimateRow('');

    const realWord = await checkIfGuessIsRealWord();
    if (!realWord) {
      setAnimateRow('error');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    determineGuessedLetterType();

    // save the guess to render with hints
    if (prevGuesses[0].length) {
      addGuessToPrev([...prevGuesses, guess]);
    } else {
      addGuessToPrev([guess]);
    }

    updateAttemptCount(attempt + 1);
    setFlipRowAnimation(true);
    updateGuess([]);

    if (checkWinCondition()) {
      updateShowModal(true);
      updateGameState(ModalType.winner);
    }
    if (checkGameOver()) {
      updateShowModal(true);
      updateGameState(ModalType.gameOver);
    }
  };

  const restartGame = () => {
    updateGuess([]);
    updateAttemptCount(1);
    addGuessToPrev([[]]);
    updateShowModal(false);
    updateGameState(ModalType.none);
    setGuessedLetters([]);
  };

  const gameActive = () => gameState === ModalType.none;

  const addLetterToGuess = (letter: string) => {
    if (guess.length < WORD_LENGTH && gameActive()) {
      updateGuess(guess.concat(letter.toUpperCase()));
    }
  };

  // when backspace is entered
  const removePrevLetterFromGuess = () => {
    if (guess.length && gameActive) {
      const removed = guess.slice(0, -1);
      updateGuess(removed);
    }
  };

  // eslint-disable-next-line max-len
  const checkIfLetterInGuessedLetters = (guessedLetter: string) => guessedLetters.some((obj: IGuessedLetters) => guessedLetter === obj.letter);

  // update guessedLetters so we can provide hints on the keyboard
  const determineGuessedLetterType = () => {
    const updatesToGuessedLetters = guessedLetters;
    guess.forEach((guessedLetter: string, index: number) => {
      // letter not in guess, add if not already
      if (!ACTUAL_WORD.includes(guessedLetter) && !checkIfLetterInGuessedLetters(guessedLetter)) {
        updatesToGuessedLetters.push(
          { letter: guessedLetter, type: LetterPositionEnum.wrong },
        );
      }
      // letter is in guess
      if (ACTUAL_WORD.includes(guessedLetter)) {
        // letter is in correct spot
        if (ACTUAL_WORD.indexOf(guessedLetter) === index) {
          const exists = checkIfLetterInGuessedLetters(guessedLetter);
          if (!exists) {
            updatesToGuessedLetters.push(
              { letter: guessedLetter, type: LetterPositionEnum.correct },
            );
          } else {
            // letter exists already as correct or close, update close to correct or ignore
            // eslint-disable-next-line max-len
            const existingLetterIndex = guessedLetters.findIndex((iterate:IGuessedLetters) => iterate.letter === guessedLetter);
            if (updatesToGuessedLetters[existingLetterIndex].type === LetterPositionEnum.close) {
              updatesToGuessedLetters[existingLetterIndex].type = LetterPositionEnum.correct;
            }
          }
          // letter is close, add if not there already
        } else if (!checkIfLetterInGuessedLetters(guessedLetter)) {
          updatesToGuessedLetters.push(
            { letter: guessedLetter, type: LetterPositionEnum.close },
          );
        }
      }
    });
    setGuessedLetters(updatesToGuessedLetters);
  };

  return (
    <GameStyles>
      {
        showModal && (
        <Modal
          type={gameState}
          updateShowModal={updateShowModal}
          restartGame={restartGame}
        />
        )
      }
      <Board
        currentGuess={guess}
        attempt={attempt}
        prevGuesses={prevGuesses}
        flipRowAnimation={flipRowAnimation}
        animateRow={animateRow}
      />
      <Keyboard
        guess={guess}
        guessedLetters={guessedLetters}
        addLetterToGuess={addLetterToGuess}
        checkGuess={checkGuess}
        removePrevLetterFromGuess={removePrevLetterFromGuess}
      />
    </GameStyles>
  );
}

export default Game;

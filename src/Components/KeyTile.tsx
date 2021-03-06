import React from 'react';
import styled from 'styled-components';
import { getColorFromLetterState, IGuessedLetters } from '../utils/LetterPosition';

interface KeyTileProps {
  checkGuess: Function,
  letter: string,
  addLetterToGuess: Function,
  removePrevLetterFromGuess: Function,
  guessedLetters: Array<IGuessedLetters>,
}

interface IKeyTileStyles {
  letterColor: string,
}

const KeyTileStyles = styled.span<IKeyTileStyles>`
  display: inline-flex;
  align-items: center;
  height: 2rem;
  border: 1px solid black;
  margin: .1rem;
  padding: .5rem;
  text-transform: capitalize;
  background-color: ${(props) => props.letterColor};
`;

function KeyTile({
  letter, addLetterToGuess, checkGuess, removePrevLetterFromGuess, guessedLetters,
}: KeyTileProps) {
  function onClickHandler() {
    if (letter === '⇍') {
      removePrevLetterFromGuess();
    } else if (letter === 'Enter') {
      checkGuess();
    } else {
      addLetterToGuess(letter);
    }
  }

  const getKeyStyle = (key: string) => {
    // eslint-disable-next-line max-len
    const found = guessedLetters.find((guessedLetter) => guessedLetter.letter === key.toUpperCase());
    if (found) {
      return getColorFromLetterState(found.type);
    }
    return 'white';
  };

  const letterColor = getKeyStyle(letter);
  return (
    <KeyTileStyles letterColor={letterColor} onClick={() => onClickHandler()}>
      {letter}
    </KeyTileStyles>
  );
}

export default KeyTile;

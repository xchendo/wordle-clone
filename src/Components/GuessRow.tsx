import styled from 'styled-components';
import React from 'react';
import GuessTile from './GuessTile';
import { LetterPositionEnum } from '../utils/LetterPosition';

interface GuessRowProps {
  guess: string[],
  actualWord: string[],
  showHint: boolean,
  flipRowAnimation: boolean,
}

const GuessRowStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1.5rem;
`;

export default function GuessRow({
  guess, actualWord, showHint, flipRowAnimation,
}: GuessRowProps) {
  const worldLengthIterator = [0, 1, 2, 3, 4];

  function returnGuessTileHint(index: number) {
    if (!showHint) {
      return LetterPositionEnum.inactive;
    }

    if (guess[index] === actualWord[index]) {
      return LetterPositionEnum.correct;
    } if (actualWord.includes(guess[index])) {
      return LetterPositionEnum.close;
    }
    return LetterPositionEnum.wrong;
  }

  return (
    <GuessRowStyles>
      {
       worldLengthIterator.map((_: number, index: number) => {
         // We want to render out all the squares for a guess, so check
         // the guess length, so we're not accidentally going out of bounds
         if (guess && guess[index] !== undefined) {
           const hintType = returnGuessTileHint(index);
           return (
             <GuessTile
               key={`tile_${_}`}
               flipRowAnimation={flipRowAnimation}
               hint={hintType}
               letter={guess[index]}
             />
           );
         }
         return <GuessTile key={`tile_${_}`} hint={LetterPositionEnum.inactive} flipRowAnimation={false} letter="" />;
       })
    }
    </GuessRowStyles>
  );
}

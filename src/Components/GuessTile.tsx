import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { LetterPositionEnum, getColorFromLetterState } from '../utils/LetterPosition';

interface IGuessTileStyles {
  tileColor: string,
  flipRowAnimation: boolean,
}

interface GuessTileProps {
  letter: string
  hint: LetterPositionEnum,
  flipRowAnimation: boolean,
}

// flip the tiles over when a word is guessed
const flipTile = (tileColor: string) => keyframes`
  0% {
    transform: rotateX(0deg);
    color: black;
    background-color: white;
  }
  
  25% {
    transform: rotateX(-90deg);
    color: black;
    background-color: white;
  }

  // at the point the tile is flipped, give it the hint styling
  // we rotate twice so the letter inside the tile isn't inverted
  50% {
    transform: rotateX(-90deg);
    text-shadow: 2px 2px 4px black;
    color: white;
    background-color: ${tileColor};
    
  }

  100% {
    transform: rotateX(0deg);
    text-shadow: 2px 2px 4px black;
    color: white;
    background-color: ${tileColor};
   
  }
`;

// Show black text in a white box normally when row is active
// after the row is guessed, trigger the flip animation and change the tile background
// to correspond to the hint color and change text to white w/ box shadow
const GuessTileStyles = styled.div<IGuessTileStyles>`
  display: inline-block;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  
  border: 2px solid ${(props) => (props.tileColor === 'white' ? 'grey' : 'black')};
  
  width: 100%;
  height: 100%;

  font-size: 3rem;
  font-weight: bold;
  color: ${(props) => (props.tileColor === 'white' ? 'black' : 'white')};
  text-align: center;

  // animation-fill-mode:forwards allows the hint styling to persist after the animation
  // is done. However once the animation is done we want to retain the hint styling
  background-color: ${(props) => (props.tileColor && !props.flipRowAnimation ? props.tileColor : 'white')};
  ${(props) => props.tileColor !== 'white' && !props.flipRowAnimation && css`
    text-shadow: 2px 2px 4px black;
  `}
  
  ${(props) => props.flipRowAnimation && css`
    animation-name: ${flipTile(props.tileColor)};
    animation-duration: .75s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  `}
  
  // save space in tiles when there is no letter assigned yet
  ::before {
    content: '';
    padding-bottom: 100%;
    display: inline-block;
  }
`;

export default function GuessTile({ letter, hint, flipRowAnimation }: GuessTileProps) {
  return (
    <GuessTileStyles flipRowAnimation={flipRowAnimation} tileColor={getColorFromLetterState(hint)}>
      {letter}
    </GuessTileStyles>
  );
}

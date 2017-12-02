export const ADD_LASER = 'ADD_LASER';
export const UPDATE_ALIENS = 'UPDATE_ALIENS';
export const UPDATE_LASERS = 'UPDATE_LASERS';

import { ARKit } from 'react-native-arkit';

export function moveAliens(requestedByUser) {
  return function(dispatch, getState) {};
}

export function moveLasers(requestedByUser) {
  return function(dispatch, getState) {
    newLasers = getState().objects.lasers.map(laser => {
      return {
        ...laser,
        position: { ...laser.position, z: laser.position.z - 0.1 },
      };
    });

    newLasers = newLasers.filter(laser => {
      return laser.position.z > -5;
    });

    dispatch({ type: UPDATE_LASERS, payload: newLasers });
  };


export function checkCollisions() {
  return (dispatch, getState) => {
    let newAliens = getState().objects.aliens.filter(alien => {

    })
    dispatch({type: UPDATE_ALIENS, payload: newAliens})
  }
}

export function addLaser() {
  return function(dispatch, getState) {
    ARKit.getCameraPosition().then(pos => {
      dispatch({
        type: ADD_LASER,
        payload: { startPosition: pos, position: pos },
      });
    });
  };
}

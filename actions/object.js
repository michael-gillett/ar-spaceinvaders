export const ADD_LASER = 'ADD_LASER';
export const UPDATE_ALIENS = 'UPDATE_ALIENS';
export const UPDATE_LASERS = 'UPDATE_LASERS';

import { ARKit } from 'react-native-arkit';

const ALIEN_WIDTH = 0.15;
const ALIEN_HEIGHT = 0.1;
const ALIEN_LENGTH = 0.1;

export function initAliens(planeCenter, planeExtents) {
  return function(dispatch, getState) {
    let aliens = [];
    for (x = 0; x < 10; x++) {
      for (y = 0; y < 10; y++) {
        aliens.push({
          position: computeAlienPosition(planeCenter, planeExtents, x, y),
          shape: {
            width: ALIEN_WIDTH,
            height: ALIEN_HEIGHT,
            length: ALIEN_LENGTH,
            chamfer: 0.005,
          },
          x: x,
          y: y,
        });
      }
    }
    dispatch({ type: UPDATE_ALIENS, payload: aliens });
  };
}

computeAlienPosition = (planeCenter, planeExtents, x, y) => {
  let backLeftCorner = planeCenter.x - planeExtents.x / 2 + ALIEN_WIDTH / 2;
  return {
    x: backLeftCorner + x * ALIEN_WIDTH,
    y: planeCenter.y + ALIEN_HEIGHT / 2 + y * ALIEN_HEIGHT,
    z: planeCenter.z - planeExtents.z / 2 + ALIEN_LENGTH / 2,
  };
};

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
}

export function checkCollisions() {
  return (dispatch, getState) => {
    let lasers = getState().objects.lasers;
    let newAliens = getState().objects.aliens.filter(alien => {
      let alienNotHit = true;
      lasers.forEach(laser => {
        let inX =
          alien.position.x - ALIEN_WIDTH / 2 < laser.position.x &&
          alien.position.x + ALIEN_WIDTH / 2 > laser.position.x;
        let inY =
          alien.position.y - ALIEN_HEIGHT / 2 < laser.position.y &&
          alien.position.y + ALIEN_HEIGHT / 2 > laser.position.y;
        let inZ =
          alien.position.z - ALIEN_LENGTH / 2 < laser.position.z &&
          alien.position.z + ALIEN_LENGTH / 2 > laser.position.z;
        if (inX && inY && inZ) {
          alienNotHit = false;
        }
      });
      return alienNotHit;
    });
    dispatch({ type: UPDATE_ALIENS, payload: newAliens });
  };
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

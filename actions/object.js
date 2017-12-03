export const ADD_LASER = 'ADD_LASER';
export const UPDATE_ALIENS = 'UPDATE_ALIENS';
export const UPDATE_LASERS = 'UPDATE_LASERS';
export const UPDATE_CURSOR = 'UPDATE_CURSOR';
export const GAME_OVER = 'GAME_OVER';
export const PAUSE = 'PAUSE';
export const SET_ALIEN_COUNT = 'SET_ALIEN_COUNT';

import { ARKit } from 'react-native-arkit';

const BOARD_DEPTH = 3;
const ALIEN_SIZE = 0.2;

export function reset() {
  return function(dispatch, getState) {
    dispatch({ type: UPDATE_ALIENS, payload: [] });
    dispatch({ type: UPDATE_LASERS, payload: [] });
    dispatch({ type: SET_ALIEN_COUNT, payload: 5 });
    dispatch(initAliens());
    dispatch({ type: GAME_OVER, payload: false });
  };
}

export function nextRound() {
  return function(dispatch, getState) {
    dispatch({ type: UPDATE_ALIENS, payload: [] });
    dispatch({ type: UPDATE_LASERS, payload: [] });
    dispatch({
      type: SET_ALIEN_COUNT,
      payload: getState().objects.alienCount + 2,
    });
    dispatch(initAliens()).then(() => {
      dispatch({ type: PAUSE, payload: false });
    });
  };
}

export function initAliens() {
  return function(dispatch, getState) {
    let aliens = [];
    return ARKit.getCameraPosition().then(cameraPos => {
      for (i = 0; i < getState().objects.alienCount; i++) {
        let alienPos = computeAlienPosition(cameraPos, i);
        let alienRot = computeAlienRotation(cameraPos, alienPos);
        let alienDir = computerAlienDir(cameraPos, alienPos);

        aliens.push({
          position: alienPos,
          rotation: alienRot,
          dir: alienDir,
          shape: {
            width: ALIEN_SIZE,
            height: ALIEN_SIZE,
            length: ALIEN_SIZE,
            chamfer: 0.005,
          },
          i: i,
        });
      }
      dispatch({ type: UPDATE_ALIENS, payload: aliens });
    });
  };
}

computeAlienPosition = (cameraPos, i) => {
  let angle = 2 * Math.PI * Math.random();
  let height = 2 * Math.random() - 1;
  return {
    x: cameraPos.x + BOARD_DEPTH * Math.cos(angle),
    y: cameraPos.y + height,
    z: cameraPos.z + BOARD_DEPTH * Math.sin(angle),
  };
};

norm = v => {
  let mag = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
  return {
    x: mag == 0 ? 0 : v.x,
    y: mag == 0 ? 0 : v.y,
    z: mag == 0 ? 0 : v.z,
  };
};

computerAlienDir = (cameraPos, alienPos) => {
  return norm({
    x: cameraPos.x - alienPos.x,
    y: cameraPos.y - alienPos.y,
    z: cameraPos.z - alienPos.z,
  });
};

computeAlienRotation = (cameraPos, alienPos) => {
  let dir = computerAlienDir(cameraPos, alienPos);

  let roty = Math.atan2(dir.x, dir.z);
  let rotx = Math.atan2(dir.y, dir.z);

  if (dir.z < 0) {
    // roty *= -1;
    rotx *= -1;
  }

  return {
    x: isNaN(rotx) ? 0 : -rotx,
    y: isNaN(roty) ? 0 : roty,
    z: 0,
  };
};

export function updateCursorPos(pos) {
  return { type: UPDATE_CURSOR, payload: pos };
}

export function moveAliens(requestedByUser) {
  return function(dispatch, getState) {
    ARKit.getCameraPosition().then(cameraPos => {
      newAliens = getState().objects.aliens.map(alien => {
        let newDir = computerAlienDir(cameraPos, alien.position);
        let newPos = {
          x: alien.position.x + newDir.x / 500,
          y: alien.position.y + newDir.y / 500,
          z: alien.position.z + newDir.z / 500,
        };

        let newRot = computeAlienRotation(cameraPos, newPos);

        if (checkDistance(cameraPos, newPos)) {
          dispatch({ type: GAME_OVER, payload: true });
        }

        return {
          ...alien,
          position: newPos,
          rotation: newRot,
          dir: newDir,
        };
      });
      dispatch({ type: UPDATE_ALIENS, payload: newAliens });
    });
  };
}

function checkDistance(pos1, pos2) {
  let d =
    Math.pow(pos1.x - pos2.x, 2) +
    Math.pow(pos1.y - pos2.y, 2) +
    Math.pow(pos1.z - pos2.z, 2);
  return d < 0.2;
}

export function moveLasers() {
  return function(dispatch, getState) {
    newLasers = getState().objects.lasers.map(laser => {
      return {
        ...laser,
        position: {
          x: laser.position.x + laser.dir.x / 10.0,
          y: laser.position.y + laser.dir.y / 10.0,
          z: laser.position.z + laser.dir.z / 10.0,
        },
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
      lasers.forEach((laser, i) => {
        let inX =
          alien.position.x - ALIEN_SIZE / 2 < laser.position.x &&
          alien.position.x + ALIEN_SIZE / 2 > laser.position.x;
        let inY =
          alien.position.y - ALIEN_SIZE / 2 < laser.position.y &&
          alien.position.y + ALIEN_SIZE / 2 > laser.position.y;
        let inZ =
          alien.position.z - ALIEN_SIZE / 2 < laser.position.z &&
          alien.position.z + ALIEN_SIZE / 2 > laser.position.z;
        if (inX && inY && inZ) {
          alienNotHit = false;
          // Remove the laser that just collided
          lasers.splice(i, 1);
        }
      });
      return alienNotHit;
    });

    if (newAliens.length == 0) {
      console.log('round over');
      dispatch({ type: PAUSE, payload: true });
    }

    dispatch({ type: UPDATE_ALIENS, payload: newAliens });
    dispatch({ type: UPDATE_LASERS, payload: lasers });
  };
}

export function addLaser() {
  return function(dispatch, getState) {
    ARKit.getCameraPosition().then(pos => {
      let cursorPos = getState().objects.cursorPos;
      if (cursorPos) {
        let dX = cursorPos.x - pos.x;
        let dY = cursorPos.y - pos.y;
        let dZ = cursorPos.z - pos.z;
        let dir = { x: dX, y: dY, z: dZ };

        dispatch({
          type: ADD_LASER,
          payload: {
            startPosition: pos,
            position: pos,
            dir: dir,
          },
        });
      }
    });
  };
}

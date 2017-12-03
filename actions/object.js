export const ADD_LASER = 'ADD_LASER';
export const UPDATE_ALIENS = 'UPDATE_ALIENS';
export const UPDATE_LASERS = 'UPDATE_LASERS';
export const UPDATE_CURSOR = 'UPDATE_CURSOR';

import { ARKit } from 'react-native-arkit';

const BOARD_DEPTH = 3;
const ALIEN_SIZE = 0.2;

export function initAliens(cameraPos) {
  return function(dispatch, getState) {
    let aliens = [];
    for (x = 0; x < 5; x++) {
      for (y = 0; y < 4; y++) {
        aliens.push({
          position: computeAlienPosition(cameraPos, x, y),
          shape: {
            width: ALIEN_SIZE,
            height: ALIEN_SIZE,
            length: ALIEN_SIZE,
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

computeAlienPosition = (cameraPos, x, y) => {
  return {
    x: cameraPos.x + (x - 2) * ALIEN_SIZE * 5,
    y: cameraPos.y + (y - 1) * ALIEN_SIZE * 2,
    z: cameraPos.z - BOARD_DEPTH,
  };
};

norm = v => {
  let mag = Math.sqrt((v.x ^ 2) + (v.y ^ 2) + (v.z ^ 2));
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
    z: (dZ = cameraPos.z - alienPos.z),
  });
};

computeAlienRotation = (cameraPos, alienPos) => {
  let dir = computerAlienDir(cameraPos, alienPos);

  let roty = Math.atan2(dir.x, dir.z);
  let rotx = Math.atan2(dir.y, dir.z);

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

export function moveLasers() {
  return function(dispatch, getState) {
    newLasers = getState().objects.lasers.map(laser => {
      return {
        ...laser,
        position: {
          x: laser.position.x + laser.dir.x / 20.0,
          y: laser.position.y + laser.dir.y / 20.0,
          z: laser.position.z + laser.dir.z / 20.0,
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

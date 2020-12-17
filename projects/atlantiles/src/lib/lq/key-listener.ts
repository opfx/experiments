 // tslint:disable: max-line-length

/**  https://github.com/kittykatattack/learningPixi
 * 1). The keyboard function is easy to use. Create a new keyboard object like this: let keyObject = keyboard(keyValue);
 * 2). Its one argument is the key value that you want to listen for: https: *developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 * 3). Keyboard objects also have isDown and isUp Boolean properties that you can use to check the state of each key.
 * 4). Then assign press and release methods to the keyboard object like this:
 *        keyObject.press = () => {
 *           // key object pressed
 *        };
 *        keyObject.release = () => {
 *           // key object pressed
 *        };
 * 5). Don't forget to remove event listeners by using the unsubscribe method : keyObject.unsubscribe();
 */

export class KeyListener
{
    public value: string;
    public isDown = false;
    public isUp = true;
    public press: Function;
    public release: Function;
    public unsubscribe: Function;

    private downHandler: Function;
    private upHandler: Function;

    constructor(value: string)
    {
        this.value = value;

        // The 'downHandler'
        this.downHandler = (event: any) => {
            if (event.key === this.value) {
              if (this.isUp && this.press) { this.press(); }
              this.isDown = true;
              this.isUp = false;
              event.preventDefault();
            }
        };

        // The 'upHandler'
        this.upHandler = (event: any) => {
            if (event.key === this.value) {
            if (this.isDown && this.release) { this.release(); }
            this.isDown = false;
            this.isUp = true;
            event.preventDefault();
            }
        };

        // Attach event listeners
        const downListener = this.downHandler.bind(this);
        const upListener = this.upHandler.bind(this);

        window.addEventListener(
            'keydown', downListener, false
        );
        window.addEventListener(
            'keyup', upListener, false
        );

        // Detach event listeners
        this.unsubscribe = () => {
            window.removeEventListener('keydown', downListener);
            window.removeEventListener('keyup', upListener);
        };
    }
}


// ----- From https://github.com/kittykatattack/learningPixi :
// With just a little more work you can build a simple system to control a sprite using the keyboard.
// To simplify your code, I suggest you use this custom function called keyboard that listens for and captures keyboard events.
/*
function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };

    //The `upHandler`
    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
      'keydown', downListener, false
    );
    window.addEventListener(
      'keyup', upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener('keydown', downListener);
      window.removeEventListener('keyup', upListener);
    };

    return key;
  }
*/

/*
  //Capture the keyboard arrow keys
  let left = keyboard('ArrowLeft'),
      up = keyboard('ArrowUp'),
      right = keyboard('ArrowRight'),
      down = keyboard('ArrowDown');

  //Left arrow key `press` method
  left.press = () => {
    //Change the cat's velocity when the key is pressed
    cat.vx = -5;
    cat.vy = 0;
  };

  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };

  //Up
  up.press = () => {
    cat.vy = -5;
    cat.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };

  //Right
  right.press = () => {
    cat.vx = 5;
    cat.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };

  //Down
  down.press = () => {
    cat.vy = 5;
    cat.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };
*/

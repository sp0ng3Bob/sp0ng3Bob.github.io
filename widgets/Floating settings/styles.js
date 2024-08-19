export const styles = (options) => `
  :root {
    --primary-color: ${options.color};
    --text-color: ${options.textColor};
    --background-color: #ffffff;
    --dialog-background-color: #ffffff;
    --dialog-text-color: #000000;
  }

  body.dark-mode {
    --background-color: #000000;
    --dialog-background-color: #333333;
    --dialog-text-color: #ffffff;
  }
  
  * {
    backround-color: --var(--background-color)
  }
  
  .floating-button.minimized {
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .floating-button.minimized::before {
    content: '*';
    font-size: 24px;
    color: var(--text-color);
  }

  .floating-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--primary-color);
    color: var(--text-color);
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    cursor: pointer;
    z-index: 1000;
    opacity: 0.7;
    transition: all 0.3s ease;
    transform: scale(0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 150px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .floating-button:hover, .floating-button:focus, .floating-button:active {
    opacity: 1;
    transform: scale(1.1);
  }

  .floating-dialog {
    display: none;
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 300px;
    padding: 20px;
    background-color: var(--dialog-background-color);
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 4020;
    color: var(--dialog-text-color);
  }

  .floating-dialog.open {
    display: block;
  }

  .floating-dialog h2 {
    margin: 0 0 10px;
    font-size: 18px;
    color: var(--dialog-text-color);
  }

  .floating-dialog label {
    display: block;
    margin-bottom: 10px;
  }

  .floating-dialog label input,
  .floating-dialog label select {
    display: block;
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    color: #000;
  }

  .floating-dialog label input[type="color"] {
    padding: 0;
  }
`
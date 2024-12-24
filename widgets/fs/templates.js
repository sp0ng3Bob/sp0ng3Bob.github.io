export const dialogTemplate = `
  <h2>Settings</h2>
  <label>
    Theme Mode:
    <select id="theme-mode">
      <option value="light">Day</option>
      <option value="dark">Night</option>
    </select>
  </label>
  <label>
    Font Size:
    <input type="range" id="font-size" min="12" max="24" value="16">
  </label>
  <label>
    Background Color:
    <input type="color" id="background-color" value="#ffffff">
  </label>
`

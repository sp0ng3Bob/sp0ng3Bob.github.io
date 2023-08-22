// Access the container
const arContainer = document.querySelector('arContainer');

// Initialize AR.js
const arToolkitContext = new THREEx.ArToolkitContext({
	sourceType : 'webcam',
  //cameraParametersUrl: 'path/to/camera_para.dat',
  detectionMode: 'mono',
});

// Create a marker for each barcode
const marker1 = new THREEx.ArMarkerControls(arToolkitContext, arContainer, {
  type: 'barcode',
  barcodeValue: '3830055521062',
});

const marker2 = new THREEx.ArMarkerControls(arToolkitContext, arContainer, {
  type: 'barcode',
  barcodeValue: '3830055521063',
});

// Load models
const loader = new THREE.GLTFLoader();
const models = {
  'barcode1': './test/BoxVertexColors.gltf',
  'barcode2': './test/Box.gltf',
};

// Listen for marker found events
marker1.addEventListener('markerFound', event => {
  const marker = event.target;
  const barcodeData = marker.barcodeValue;
  loadAndDisplayModel(barcodeData);
});

marker2.addEventListener('markerFound', event => {
  const marker = event.target;
  const barcodeData = marker.barcodeValue;
  loadAndDisplayModel(barcodeData);
});

// Function to load and display the model
function loadAndDisplayModel(barcodeData) {
  const modelPath = models[barcodeData];
  
  if (modelPath) {
    loader.load(modelPath, gltf => {
      const model = gltf.scene;
      // Position and add the model to the AR scene
      // You can also add animations, textures, etc.
      arContainer.appendChild(model);
    });
  }
}

/* const cameraFeed = document.getElementById('cameraFeed');
const arContainer = document.getElementById('arContainer');

// Access camera feed
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
		stream.getTracks().forEach(track => track.stop());
    cameraFeed.srcObject = stream;
  })
  .catch(error => {
    console.error('Error accessing camera:', error);
  });

// Initialize AR.js
const arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: 'path/to/camera_para.dat',
  detectionMode: 'mono',
});

const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, cameraFeed, {
  type: 'barcode',
  barcodeValue: 'your-barcode-value', // Replace with your barcode value
});

// Set up barcode reader
const barcodeReader = new BarcodeReader(); // Initialize barcode reader library

// Listen for barcode scans
arMarkerControls.addEventListener('markerFound', event => {
  const marker = event.target;
  const barcodeData = marker.barcodeValue;

  // Use barcodeData to display AR content
  displayARContent(barcodeData);
});

// Function to display AR content
function displayARContent(barcodeData) {
  // Implement your logic to display AR content based on barcode data
  // You can use AR.js functions to position and render 3D content on the scene
} */

/**
 * Tool catalogue for the detection grid.
 * `detect` refers to a function name exported from js/detect.js.
 * `auto` tools run as soon as the grid renders; the rest run on click
 * because they need a user gesture and/or a permission prompt.
 */
export const TOOLS = [
  {
    id: "browser-os",
    category: "Software",
    title: "Browser & OS",
    desc: "Identifies your browser engine, version, operating system and platform.",
    icon: "browser",
    detect: "detectBrowserOS",
    auto: true
  },
  {
    id: "screen-display",
    category: "Display",
    title: "Screen & Display",
    desc: "Viewport size, physical resolution, pixel ratio, color depth and orientation.",
    icon: "display",
    detect: "detectScreen",
    auto: true
  },
  {
    id: "cpu-memory",
    category: "Hardware",
    title: "CPU & Memory",
    desc: "Logical CPU cores and approximate device memory reported by the browser.",
    icon: "cpu",
    detect: "detectHardware",
    auto: true
  },
  {
    id: "gpu-graphics",
    category: "Hardware",
    title: "GPU & Graphics",
    desc: "WebGL renderer and vendor strings used to identify your graphics hardware.",
    icon: "gpu",
    detect: "detectGPU",
    auto: true
  },
  {
    id: "network",
    category: "Connectivity",
    title: "Network & Connection",
    desc: "Effective connection type, downlink speed, round-trip time and data saver mode.",
    icon: "network",
    detect: "detectNetwork",
    auto: true
  },
  {
    id: "battery",
    category: "Power",
    title: "Battery Status",
    desc: "Charge level and charging state, where the Battery Status API is supported.",
    icon: "battery",
    detect: "detectBattery",
    auto: false,
    actionLabel: "Check battery"
  },
  {
    id: "touch-input",
    category: "Input",
    title: "Touch & Pointer Input",
    desc: "Multi-touch point support, pointer type and hover capability.",
    icon: "touch",
    detect: "detectTouch",
    auto: true
  },
  {
    id: "sensors",
    category: "Sensors",
    title: "Motion & Orientation",
    desc: "Accelerometer and gyroscope availability via device motion and orientation events.",
    icon: "sensor",
    detect: "detectSensors",
    auto: false,
    actionLabel: "Test sensors"
  },
  {
    id: "storage",
    category: "Storage",
    title: "Storage & Quota",
    desc: "Estimated storage quota, usage, and support for local storage and IndexedDB.",
    icon: "storage",
    detect: "detectStorage",
    auto: true
  },
  {
    id: "media-devices",
    category: "Media",
    title: "Camera & Microphone",
    desc: "Counts available camera and microphone devices without requesting a permission prompt.",
    icon: "camera",
    detect: "detectMediaDevices",
    auto: true
  },
  {
    id: "audio",
    category: "Media",
    title: "Audio Engine",
    desc: "Web Audio API support, sample rate and output channel count.",
    icon: "audio",
    detect: "detectAudio",
    auto: true
  },
  {
    id: "geolocation",
    category: "Location",
    title: "Location & Timezone",
    desc: "Timezone, locale, and whether geolocation is available in this browser.",
    icon: "location",
    detect: "detectLocation",
    auto: false,
    actionLabel: "Check location"
  }
];

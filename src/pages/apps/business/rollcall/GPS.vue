<template>
  <div>
    <h3>Thông tin thiết bị & vị trí</h3>
    <p>User-Agent: {{ deviceInfo.userAgent }}</p>
    <p>Screen Resolution: {{ deviceInfo.screenResolution }}</p>
    <p>GPU Hash: {{ deviceInfo.gpuHash }}</p>
    <p>Font List: {{ deviceInfo.fontList }}</p>
    <p>Language: {{ deviceInfo.language }}</p>
    <p>Timezone: {{ deviceInfo.timezone }}</p>
    <p>CPU Speed (ms): {{ deviceInfo.cpuSpeed }}</p>
    <p>IP: {{ deviceInfo.ip }}</p>
    <p>Country: {{ deviceInfo.geo.country }}</p>
    <p>City: {{ deviceInfo.geo.city }}</p>
    <p>Latitude: {{ deviceInfo.latitude }}</p>
    <p>Longitude: {{ deviceInfo.longitude }}</p>
    <p>Độ chính xác: {{ deviceInfo.accuracy }} mét</p>

    <button @click="getDeviceInfo">Lấy thông tin thiết bị & vị trí</button>

    <!-- Bản đồ Google -->
    <VRow
      v-if="deviceInfo.latitude && deviceInfo.longitude"
      style="margin-top: 20px"
    >
      <iframe
        :src="mapUrl"
        width="100%"
        style="border: 0; height: 400px"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";

const deviceInfo = reactive({
  userAgent: "",
  screenResolution: "",
  gpuHash: "",
  fontList: "",
  language: "",
  timezone: "",
  cpuSpeed: 0,
  ip: "",
  geo: { country: "", city: "" },
  latitude: null as number | null,
  longitude: null as number | null,
  accuracy: null as number | null,
});

const mapUrl = computed(() => {
  if (deviceInfo.latitude && deviceInfo.longitude) {
    return `https://www.google.com/maps?q=${deviceInfo.latitude},${deviceInfo.longitude}&hl=vi&z=16&output=embed`;
  }
  return "";
});
// Lấy fingerprint bền
function getFingerprint() {
  deviceInfo.userAgent = navigator.userAgent;
  deviceInfo.screenResolution = `${window.screen.width}x${window.screen.height}`;
  deviceInfo.language = navigator.language; // <-- chỉ dùng language
  deviceInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // WebGL GPU hash
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext);

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        deviceInfo.gpuHash = vendor + " " + renderer;
      }
    }
  } catch {
    deviceInfo.gpuHash = "";
  }

  // Font list cơ bản
  const fonts = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Courier New",
    "Roboto",
    "Helvetica",
  ];
  const available: string[] = [];
  fonts.forEach((f) => {
    const span = document.createElement("span");
    span.style.fontFamily = f;
    span.innerText = "mmmmmmmmmwwwwwww";
    document.body.appendChild(span);
    if (span.offsetWidth > 0) available.push(f);
    document.body.removeChild(span);
  });
  deviceInfo.fontList = available.join(",");

  // CPU benchmark nhẹ
  const start = performance.now();
  let x = 0;
  for (let i = 0; i < 1e6; i++) x += Math.sqrt(i);
  deviceInfo.cpuSpeed = performance.now() - start;
}

// Lấy vị trí GPS
function getLocation() {
  return new Promise<void>((resolve, reject) => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ Geolocation.");
      reject();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        deviceInfo.latitude = position.coords.latitude;
        deviceInfo.longitude = position.coords.longitude;
        deviceInfo.accuracy = position.coords.accuracy;
        resolve();
      },
      (err) => {
        console.error(err);
        alert("Không thể lấy vị trí. Hãy bật GPS và cho phép truy cập vị trí.");
        reject();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

// Lấy IP + Geo (từ ipapi.co miễn phí)
async function getIPGeo() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    deviceInfo.ip = data.ip || "";
    deviceInfo.geo.country = data.country_name || "";
    deviceInfo.geo.city = data.city || "";
  } catch {
    deviceInfo.ip = "";
    deviceInfo.geo = { country: "", city: "" };
  }
}

// Hàm tổng hợp
async function getDeviceInfo() {
  getFingerprint();
  await getLocation();
  await getIPGeo();
}
</script>

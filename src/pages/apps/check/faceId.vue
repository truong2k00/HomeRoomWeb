<template>
  <VForm>
    <VRow>
      <!-- Video + Canvas -->
      <VCol cols="12" sm="6" v-if="showVideo">
        <div class="relative w-fit">
          <video
            ref="videoElement"
            autoplay
            playsinline
            muted
            class="w-96 h-auto"
          />
          <canvas ref="canvasElement" class="absolute top-0 left-0" />
        </div>
      </VCol>

      <!-- Thông tin kết quả -->
      <VCol cols="12" sm="6">
        <div>
          <p class="font-semibold text-lg text-green-600">
            {{ livenessStatus }}
          </p>

          <VBtn
            @click="captureAndSend"
            :disabled="livenessStatus !== '✅ Người thật'"
            color="primary"
            class="mt-2"
          >
            📤 Gửi ảnh
          </VBtn>

          <p v-if="result" class="mt-4">
            🔍 Kết quả: <strong>{{ result }}</strong>
          </p>

          <div v-if="capturedImageUrl" class="mt-4">
            <p class="font-semibold">📷 Ảnh đã chụp:</p>
            <img
              :src="capturedImageUrl"
              alt="Ảnh đã chụp"
              class="mt-2 border rounded shadow w-96"
            />
          </div>

          <VBtn
            v-if="!showVideo"
            @click="restartCamera"
            class="mt-4"
            color="grey"
          >
            🔄 Bật lại camera
          </VBtn>
        </div>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const videoElement = ref(null);
const canvasElement = ref(null);
const livenessStatus = ref("Đang kiểm tra...");
const result = ref("");
const capturedImageUrl = ref(null);
const showVideo = ref(true);

const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];
let blinkCounter = 0;
let turnDetected = false;
let camera = null;

function getEAR(landmarks, indices) {
  const [p1, p2, p3, p4, p5, p6] = indices.map((i) => landmarks[i]);
  const vertical1 = Math.hypot(p2.x - p6.x, p2.y - p6.y);
  const vertical2 = Math.hypot(p3.x - p5.x, p3.y - p5.y);
  const horizontal = Math.hypot(p1.x - p4.x, p1.y - p4.y);
  return (vertical1 + vertical2) / (2.0 * horizontal);
}

async function onResults(results) {
  const canvasCtx = canvasElement.value.getContext("2d");
  canvasElement.value.width = videoElement.value.videoWidth;
  canvasElement.value.height = videoElement.value.videoHeight;
  canvasCtx.clearRect(
    0,
    0,
    canvasElement.value.width,
    canvasElement.value.height
  );
  canvasCtx.drawImage(results.image, 0, 0);

  if (results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];
    const leftEAR = getEAR(landmarks, LEFT_EYE);
    const rightEAR = getEAR(landmarks, RIGHT_EYE);
    const ear = (leftEAR + rightEAR) / 2.0;

    if (ear < 0.2) blinkCounter++;
    const nose = landmarks[1];
    if (nose.x < 0.4 || nose.x > 0.6) turnDetected = true;

    if (blinkCounter >= 1 && turnDetected) {
      livenessStatus.value = "✅ Người thật";
      await new Promise((resolve) => setTimeout(resolve, 500));
      await captureAndSend();
    } else {
      livenessStatus.value = "🔄 Chớp mắt và quay đầu";
    }
  }
}

onMounted(() => {
  const faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults(onResults);

  camera = new Camera(videoElement.value, {
    onFrame: async () => await faceMesh.send({ image: videoElement.value }),
    width: 640,
    height: 480,
  });
  camera.start();
});

async function captureAndSend() {
  if (!videoElement.value || videoElement.value.readyState < 2) {
    console.warn("Video chưa sẵn sàng!");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoElement.value.videoWidth;
  canvas.height = videoElement.value.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg")
  );

  if (!blob) {
    console.error("Không thể tạo blob từ canvas!");
    return;
  }

  // Lưu ảnh hiển thị
  if (capturedImageUrl.value) {
    URL.revokeObjectURL(capturedImageUrl.value);
  }
  capturedImageUrl.value = URL.createObjectURL(blob);

  // Tắt video
  showVideo.value = false;
  camera?.stop();

  const formData = new FormData();
  formData.append("file", blob, "face.jpg");

  try {
    const response = await fetch("https://localhost:44345/api/face/recognize", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    result.value = data.name;
  } catch (err) {
    console.error("Lỗi khi gửi ảnh:", err);
  }
}

import { nextTick } from "vue";

async function restartCamera() {
  blinkCounter = 0;
  turnDetected = false;
  livenessStatus.value = "Đang kiểm tra...";
  result.value = "";
  capturedImageUrl.value = null;
  showVideo.value = true;

  // Đợi DOM render xong (videoElement được mount lại)
  await nextTick();

  if (!videoElement.value) {
    console.error("Video element chưa sẵn sàng.");
    return;
  }

  const faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults(onResults);

  camera = new Camera(videoElement.value, {
    onFrame: async () => await faceMesh.send({ image: videoElement.value }),
    width: 640,
    height: 480,
  });

  try {
    camera.start();
  } catch (err) {
    console.error("Không thể khởi động lại camera:", err);
  }
}
</script>

<style scoped>
.relative {
  position: relative;
}
video,
canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

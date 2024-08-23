<template>
  <div ref="container" class="canvas-container">
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="startDrawingTouch"
      @touchmove="drawTouch"
      @touchend="stopDrawing"
      class="border"
    ></canvas>
    <div class="buttons">
      <button @click="clearCanvas">Очистить</button>
      <button @click="toggleFullscreen">
        {{ isFullscreen ? "Сузить экран" : "На весь экран" }}
      </button>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvasWidth = ref(400);
const canvasHeight = ref(400);

const canvas = ref(null);
const container = ref(null);
let context = null;
let drawing = false;
const isFullscreen = ref(false);

const startDrawing = (event) => {
  drawing = true;
  draw(event);
};

const draw = (event) => {
  if (!drawing) return;

  context.lineWidth = 5;
  context.lineCap = "round";
  context.strokeStyle = "#000";

  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
};

const startDrawingTouch = (event) => {
  event.preventDefault();
  drawing = true;
  drawTouch(event);
};

const drawTouch = (event) => {
  if (!drawing) return;

  context.lineWidth = 5;
  context.lineCap = "round";
  context.strokeStyle = "#000";

  const rect = canvas.value.getBoundingClientRect();
  const x = event.touches[0].clientX - rect.left;
  const y = event.touches[0].clientY - rect.top;

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
};

const stopDrawing = () => {
  drawing = false;
  context.beginPath();
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.value.width, canvas.value.height);
};

const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    if (container.value.requestFullscreen) {
      container.value.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else if (container.value.mozRequestFullScreen) {
      // Firefox
      container.value.mozRequestFullScreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else if (container.value.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      container.value.webkitRequestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else if (container.value.msRequestFullscreen) {
      // IE/Edge
      container.value.msRequestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    }

    // Установить размеры холста на весь экран
    canvasWidth.value = window.screen.width;
    canvasHeight.value = window.screen.height;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.error(
          `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen().catch((err) => {
        console.error(
          `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document.webkitExitFullscreen().catch((err) => {
        console.error(
          `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen().catch((err) => {
        console.error(
          `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
        );
      });
    }

    // Вернуть размеры холста в исходное состояние
    canvasWidth.value = 400;
    canvasHeight.value = 400;
  }
  isFullscreen.value = !isFullscreen.value;
};

const getCanvasData = () => {
  return canvas.value.toDataURL("image/png");
};

onMounted(() => {
  context = canvas.value.getContext("2d");
});

onBeforeUnmount(() => {
  context = null;
});
</script>
  
  <style scoped>
.canvas-container {
  position: relative;
}

canvas {
  border: 1px solid #000;
  touch-action: none; /* Предотвращение скроллинга во время рисования */
}

.buttons {
  margin-top: 10px;
}

div:fullscreen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

canvas:fullscreen {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
  
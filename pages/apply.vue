<template>
  <div class="mx-auto py-10 px-10">
    <img src="/cropped-sign-all-17.png" class="w-10 mx-auto" alt="" />
    <h1 class="text-center text-3xl font-black mt-4">Draw Me a Splinternet</h1>
    <div class="rounded-xl shadow border border-gray-300 p-8 mt-8 mx-auto">
      <div v-if="successShow" class="mb-4 bg-green-200 p-4 rounded-lg">
        {{ successShow }}
      </div>
      <div v-if="errorShow" class="mb-4 bg-red-200 p-4 rounded-lg">
        {{ errorShow }}
      </div>
      <form>
        <div v-show="step == 1">
          <div class="mb-4">
            <label for="name" class="font-bold">Name</label>
            <input
              v-model="form.name"
              id="name"
              type="text"
              required
              placeholder="Your name"
              class="w-full border-2 p-2 border-black rounded-lg focus:outline-none focus:border-gray-200"
            />
          </div>
          <button
            @click="nextStep"
            :disabled="!form.name"
            class="text-xl bg-black disabled:bg-gray-300 rounded-lg text-white px-8 py-3 font-bold hover:bg-gray-200"
          >
            Next
          </button>
        </div>
        <div class="mb-4" v-show="step == 2">
          <div class="mb-4">
            <label for="name" class="font-bold">Email</label>
            <input
              v-model="form.email"
              id="email"
              type="email"
              required
              placeholder="Email"
              class="w-full border-2 p-2 border-black rounded-lg focus:outline-none focus:border-gray-200"
            />
          </div>
          <button
            @click="nextStep"
            :disabled="!form.email"
            class="text-xl bg-black disabled:bg-gray-300 rounded-lg text-white px-8 py-3 font-bold hover:bg-gray-200"
          >
            Next
          </button>
          <button
            type="button"
            class="text-xl bg-black rounded-lg text-white px-8 py-3 font-bold hover:bg-gray-200 ml-4"
            @click="prevStep"
          >
            Prev
          </button>
        </div>
        <div v-show="step == 3">
          <label class="font-bold">Draw your ideas below:</label>
          <ClientOnly>
            <vue-drawing-canvas
              ref="VueCanvasDrawing"
              :width="canvasWidth"
              :height="canvasHeight"
            />
          </ClientOnly>
          <button
            @click="nextStep"
            @keydown.enter="nextStep"
            class="text-xl bg-black disabled:bg-gray-300 rounded-lg text-white px-8 py-3 font-bold hover:bg-gray-200"
          >
            Next
          </button>
          <button
            type="button"
            class="text-xl bg-black rounded-lg text-white px-8 py-3 font-bold hover:bg-gray-200 ml-4"
            @click="prevStep"
          >
            Prev
          </button>
        </div>
        <div v-show="step == 4">
          <div class="mb-4">
            <input
              v-model="form.subscribe"
              id="subscribe"
              type="checkbox"
              class="mr-2"
            />
            <label for="subscribe"
              >Do you wish to sign up to SplinterCon newsletter, get updates
              about the upcoming offline and online events, tool demos and
              more?</label
            >
          </div>
          <div class="mb-4">
            <input
              v-model="form.hatespeech"
              id="hatespeech"
              type="checkbox"
              required
              class="mr-2"
            />
            <label for="hatespeech"
              >I confirm that the draw does not content hatespeech, does not
              violate human rights etc</label
            >
          </div>
          <button
            class="text-xl bg-[#3a0fc8] rounded-lg text-white px-8 py-3 font-bold hover:bg-gray-200"
            type="button"
            @click="submitForm"
          >
            Submit
          </button>
          <button
            type="button"
            class="text-xl bg-black rounded-lg text-white px-8 py-3 font-bold hover:bg-gray-200 ml-4"
            @click="prevStep"
          >
            Prev
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from "vue";
import axios from "axios";
import VueDrawingCanvas from "vue-drawing-canvas";
const form = ref({
  name: "",
  email: "",
  draw: "",
  subscribe: false,
  hatespeech: false,
});
const step = ref(1);
const successShow = ref(null);
const errorShow = ref(null);
const canvasWidth = ref(null);
const canvasHeight = ref(null);
const config = useRuntimeConfig();
const domain = config.public.domain;

onMounted(() => {
  canvasWidth.value = window.innerWidth * 0.8;
  canvasHeight.value = window.innerHeight * 0.6;
});

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const nextStep = () => {
  if (step.value === 2 && !validateEmail(form.value.email)) {
    errorShow.value = "Please enter a valid email address.";
    return;
  }

  step.value++;
  errorShow.value = null;
};

const prevStep = () => {
  step.value--;
};

const submitForm = async () => {
  try {
    const canvasImage = window.document
      .getElementsByTagName("canvas")[0]
      .toDataURL("image/png");

    if (!canvasImage) {
      errorShow.value = "Canvas element not found";
      return;
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ canvasImage }),
    });

    console.log(response);

    if (response.ok) {
      const data = await response.json();
      form.value.draw = `${domain}/uploads/` + data.fileName;
    } else {
      console.error("Failed to upload image", response.statusText);
      errorShow.value = "Failed to upload image";
      return;
    }

    await axios.post("/api/database", form.value);
    successShow.value =
      "Thank you for sharing your story. It was successfully submitted. We will review it and include it in the atlas.";

    // Reset form data
    form.value = {
      name: "",
      email: "",
      draw: "",
      subscribe: false,
      hatespeech: false,
    };

    setTimeout(() => {
      successShow.value = null;
      navigateTo("/");
    }, 5000);
  } catch (error) {
    console.error("Error submitting form:", error);
    errorShow.value =
      "Something went wrong. Please fill in the mandatory fields or ask us for help.";
  }
};
</script>

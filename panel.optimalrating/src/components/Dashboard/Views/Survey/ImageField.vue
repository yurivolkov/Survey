<template>
  <div class="banner-images">
    <div class="image-preview">
      <div class="boxImage mr-3 float-right">
        <div class="pp float-left iconbox-60" @click="$refs.fileInput1.click()">
          <img v-if="imageUrl" :src="imageUrl" width="100%" height="100%" @error="onError" />
          <input
            type="file"
            name="choice_image"
            ref="fileInput1"
            @change="previewImage"
            accept="image/*"
            style="display:none;"
          />
        </div>
        <div class="Grg65b">
          <div class="EJFIFb"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["imageName", "imageId", "path"],
  data() {
    return {
      secondPath: "cdn/images/survey_approval/",
      isSec: false,
      imageUrl: this.imageName
        ? process.env.CDN_LOCATION + 'cdn/images/choice/' + this.imageName
        : null,
      selectedFile: null,
      headers: {
        Authorization: this.$http.defaults.headers.common["Authorization"],
        "Cache-Control": "",
        "X-Requested-With": ""
      },
      url: this.$http.defaults.baseURL + "choice_image/upload"
    };
  },
  methods: {
    onError() {
      if(!this.isSec) {
        this.isSec = true;
        this.imageUrl = this.imageName ? process.env.CDN_LOCATION + 'cdn/images/survey_approval/' + this.imageName : null;
      }
    },
    previewImage: function(event) {
      // Reference to the DOM input element
      var input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = e => {
          // Note: arrow function used here, so that "this.imageUrl" refers to the imageUrl of Vue component
          // Read image as base64 and set to imageUrl
          this.imageUrl = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);

        this.selectedFile = input.files[0];

        const fd = new FormData();
        fd.append("choice_image", this.selectedFile);
        fd.append("name", this.selectedFile.name);
        fd.append("choice_id", this.imageId);
        this.$emit('upload', true);
        axios.post(this.url, fd, this.headers).then(response => {
          this.$emit('upload', false);
          this.$emit("change", response.data.result.set[0].name);
        }).catch(() => {
          this.$emit('upload', false);
        });
      }
    }
  }
};
</script>

<style scoped>
.preview {
  width: 75%;
}
.boxImage {
  width: 60px;
  height: 60px;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 50%;
  margin-left: 16px;
  overflow: hidden;
  position: relative;
}
.pp {
  cursor: pointer;
  border: 1px solid lightgrey;
  width: 60px;
  height: 60px;
}
.iconbox-60 {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.Grg65b {
  background-color: rgba(32, 33, 36, 0.6);
  bottom: 0;
  height: 20px;
  left: 0;
  position: absolute;
  right: 0;
}
.EJFIFb {
  background-image: url(//www.gstatic.com/images/icons/material/system/2x/photo_camera_white_24dp.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 20px 20px;
  height: 100%;
  opacity: 0.8;
}
</style>


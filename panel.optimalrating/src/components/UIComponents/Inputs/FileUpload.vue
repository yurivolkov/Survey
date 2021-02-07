<template>
  <div>
    <dropzone
      ref="myVueDropzone"
      id="dropzone"
      :options="dropzoneOptions"
      @vdropzone-sending="sendingEvent"
      @vdropzone-success="successEvent">
    </dropzone>
  </div>
</template>

<script>
export default {
  props: ['maxFiles', 'resizeSize', 'thumbnailSize', 'uploadType'],
  data: function () {
    return {
      dropzoneOptions: {
        url: this.$http.defaults.baseURL + 'file/upload',
        thumbnailWidth: 200,
        addRemoveLinks: true,
        dictDefaultMessage: "<i class='fas fa-upload' style='font-size: 30pt'></i>",
        headers: {
            'Authorization': this.$http.defaults.headers.common['Authorization'],
            'Cache-Control': '', 'X-Requested-With': ''
        },
        maxFiles:  this.maxFiles ? this.maxFiles : 1,
        resizeHeight: this.resizeSize ? this.resizeSize.height : null,
        resizeWidth: this.resizeSize ? this.resizeSize.width : null,
        thumbnailWidth: this.thumbnailSize ? this.thumbnailSize.width : null,
        thumbnailHeight: this.thumbnailSize ? this.thumbnailSize.height : null,
        resizeMethod: 'contain',
        thumbnailMethod: 'contain',
        init: function() {
          this.on("maxfilesexceeded", function(file) {
            this.removeAllFiles();
            this.addFile(file);
          });
        }
      },
      item: null
    }
  },
  methods: {
    sendingEvent (file, xhr, formData) {
      formData.append('type', this.uploadType);
      formData.append('width', this.resizeSize.width);
      formData.append('height', this.resizeSize.height);
    },
    successEvent (file, response) {
      this.$emit('uploadSuccess', response);
    }
  }
}
</script>

<style lang="css">
</style>

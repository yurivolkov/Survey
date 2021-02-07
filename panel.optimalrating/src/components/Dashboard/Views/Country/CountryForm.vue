<template>
  <div>
    <form @submit.prevent="$emit('submitAction', item)">
      <div class="form-group row">
        <label class="col-4 col-form-label">Admin e-mail :</label>
        <div class="col-8" style="line-height: 33px">
          {{item.user && item.id ? item.user.email : item.email}}
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4 col-form-label">{{$t('common.country.input.name_en')}} :</label>
        <div class="col-8">
          <input
            type="text"
            class="form-control"
            v-model="item.name_en"
            @keyup="countryAdminGenerate"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4 col-form-label">{{$t('common.country.input.name')}} :</label>
        <div class="col-8">
          <input type="text" class="form-control" v-model="item.name" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4 col-form-label">{{$t('common.country.input.code')}} :</label>
        <div class="col-8">
          <input type="text" class="form-control" v-model="item.code" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4 col-form-label">{{$t('common.country.input.sort_order')}} :</label>
        <div class="col-8">
          <input type="text" class="form-control" v-model="item.sort_order" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4 col-form-label">{{$t('common.country.input.status')}} :</label>
        <div class="col-8">
          <switches
            v-model="selectedStatus"
            :text-enabled="activeText"
            :text-disabled="passiveText"
          ></switches>
        </div>
      </div>
      <div class="from-group row">
        <label class="col-4 col-form-label">{{$t('common.country.input.flag')}} :</label>
        <div class="col-8">
          <div class="form-image-upload">
            <div v-if="item && item.flag" class="image-container">
              <img :src="`${cdnUrl}${imageUrl}`" alt />
            </div>
            <span v-else class="no-image">
              <i class="fa-2x fas fa-image"></i>
            </span>
            <div class="upload-container">
              <button
                type="button"
                class="btn btn-round btn-fill px-3 btn-xs"
                @click="$modal.show('upload-modal')"
              >
                <i class="fas fa-upload fa-lg mr-2"></i>
                {{$t('common.inputs.upload_image')}}
              </button>
              <br />
              <small
                class="text-muted"
              >Önerilen görsel boyutu : {{imageSize.width}} x {{imageSize.height}}</small>
              <modal
                name="upload-modal"
                height="auto"
                :draggable="true"
                :classes="['v--modal', 'm-modal']"
              >
                <div class="modal-body">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col">
                        <h4 class="mt-0">Flag Upload</h4>
                        <i
                          class="fas fa-times fa-2x btn-modal-close text-success"
                          slot="top-right"
                          @click="$modal.hide('upload-modal')"
                        ></i>
                        <file-upload
                          uploadType="ct"
                          :maxFiles="1"
                          @uploadSuccess="uploadSuccess"
                          :resizeSize="{width: imageSize.width, height: imageSize.height}"
                          :thumbnailSize="{width: thumbnailSize.width, height: thumbnailSize.height}"
                        ></file-upload>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-simple btn-sm px-3"
                    @click="$modal.hide('upload-modal')"
                  >{{$t('common.close')}}</button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm btn-round btn-fill px-4"
                    :class="[uploadedImage == null ? 'disabled' : '']"
                    :disabled="uploadedImage == null"
                    @click.prevent="saveImage"
                  >Save</button>
                </div>
              </modal>
            </div>
          </div>
        </div>
      </div>
      <div v-if="mode !== 'save'" style="margin-top: 20px">
        <div style="font-weight: bold; font-size: 16px">UPDATE ADMIN PASSWORD</div>
        <div class="form-group row">
          <label class="col-4 col-form-label">New Password :</label>
          <div class="col-8" style="display: flex">
            <input class="form-control" v-model="newPassword" />
            <button
              class="btn btn-xs btn-primary btn-fill"
              :disabled="!newPassword || newPassSaving"
              @click="saveNewPassword"
            >{{newPassSaving ? 'Updating' : 'Update'}}</button>
          </div>
        </div>
      </div>
      <div v-if="mode === 'save'">
        <hr />
        <div class="form-group row">
          <label class="col-4 col-form-label">{{$t('common.country.labels.country_admin')}} :</label>
          <div class="col-8">
            <input type="text" class="form-control" v-model="item.email" />
          </div>
        </div>

        <div class="form-group row">
          <label
            class="col-4 col-form-label"
          >{{$t('common.country.labels.country_admin_password')}} :</label>
          <div class="col-8">
            <input type="password" class="form-control" v-model="item.password" />
          </div>
        </div>

        <div class="form-group row">
          <label
            class="col-4 col-form-label"
          >{{$t('common.country.labels.country_admin_password_confirmation')}} :</label>
          <div class="col-8">
            <input type="password" class="form-control" v-model="item.password_confirmation" />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FileUpload from "src/components/UIComponents/Inputs/FileUpload";

export default {
  props: ["item", "mode"],
  components: {
    FileUpload
  },
  data() {
    return {
      newPassword: "",
      newPassSaving: false,
      cdnUrl: "http://server.optimalrating.com/cdn/",
      imageUrl: `images/country/${this.item.flag}`,
      uploadedImage: null,
      imageSize: {
        width: 240,
        height: 240
      },
      thumbnailSize: {
        width: 280,
        height: 280
      },
      selectedStatus: this.item.status == "active" ? true : false,
      activeText: this.$t("common.labels.active"),
      passiveText: this.$t("common.labels.passive")
    };
  },
  watch: {
    item: function() {
      this.selectedStatus = this.item.status == "active" ? true : false;

      if (this.item.flag === "no-image-icon-11.png") {
        this.imageUrl = `${this.item.flag}`;
      } else {
        this.imageUrl = `images/country/${this.item.flag}`;
      }
    },
    selectedStatus: function() {
      this.item.status = this.selectedStatus ? "active" : "passive";
    }
  },
  methods: {
    saveNewPassword() {
      this.newPassSaving = true;
      this.$store
        .dispatch("definition/updateCountryPassword", {
          id: this.item.id,
          data: {...this.item, password: this.newPassword}
        })
        .then(() => {
          this.notify("Password updated.", 'success');
          this.newPassSaving = false;
          this.newPassword = "";
        })
        .catch(() => {
          this.newPassSaving = false;
        });
    },
    uploadSuccess: function(response) {
      if (response && response.result.set) {
        this.uploadedImage = response.result.set[0];
        this.imageUrl = this.uploadedImage.name;
        //this.cdnUrl = this.uploadedImage.cdnPath;
      }
    },
    saveImage: function() {
      this.item.flag = this.uploadedImage.name;
      // this.cdnUrl = this.uploadedImage.cdnPath;
      this.imageUrl = this.uploadedImage.name;
      this.uploadedImage = null;
      this.isChanged = true;
      this.$modal.hide("upload-modal");
    },
    countryAdminGenerate() {
      let name = this.item.name_en;
      let email = name.replace(" ", "_").toLowerCase();
      this.item.email = email + "_admin@optimalrating.com";
    }
  }
};
</script>

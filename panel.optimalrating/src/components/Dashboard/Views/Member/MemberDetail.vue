<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12 mt-4">
        <h4 class="mb-4 mt-2 text-dark border-left border-warning pl-2">Member Detail</h4>
      </div>
    </div>
    <div class="card" v-if="user">
      <div class="card-body">
        <div class="col-6 float-left" style="border-right: 1px solid #ebebeb;">
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Firstname</div>
            <div class="element-value col-7 float-left">{{user.firstname}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Middlename</div>
            <div class="element-value col-7 float-left">{{user.middlename}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Lastname</div>
            <div class="element-value col-7 float-left">{{user.lastname}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Birthdate</div>
            <div class="element-value col-7 float-left">{{user.user_details.birthdate}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Gender</div>
            <div class="element-value col-7 float-left">{{user.user_details.gender}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Education</div>
            <div class="element-value col-7 float-left">{{user.user_details.education}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Country</div>
            <div
              class="element-value col-7 float-left"
            >{{user.country ? user.country.name_en : null}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">City</div>
            <div class="element-value col-7 float-left">{{user.city ? user.city.name : null}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Phone Number</div>
            <div class="element-value col-7 float-left">{{user.user_details.phone_number}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Email</div>
            <div class="element-value col-7 float-left">{{user.email}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Occupation</div>
            <div class="element-value col-7 float-left">{{user.user_details.occupation}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Marital</div>
            <div class="element-value col-7 float-left">{{user.user_details.marital_status}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">About</div>
            <div class="element-value col-7 float-left">{{user.user_details.about}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Facebook</div>
            <div class="element-value col-7 float-left">{{user.user_details.facebook_url}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Instagram</div>
            <div class="element-value col-7 float-left">{{user.user_details.instagram_url}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Twitter</div>
            <div class="element-value col-7 float-left">{{user.user_details.twitter_url}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Skype</div>
            <div class="element-value col-7 float-left">{{user.user_details.skype_url}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Website</div>
            <div class="element-value col-7 float-left">{{user.user_details.web_url}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Other</div>
            <div class="element-value col-7 float-left">{{user.user_details.another_url}}</div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12">
            <div class="element-name col-5 float-left">Status</div>
            <div class="element-value col-7 float-left">
              <form @submit.prevent="$emit('submitAction', item)">
                <select v-model="selectedStatus" class="form-control">
                  <option value="approved">Approved</option>
                  <option value="disApproved">Disapproved</option>
                  <option value="freeze">Freeze</option>
                </select>
                <!-- <treeselect
                  v-model="selectedStatus"
                  :options="optionsStatus"
                  placeholder="Status"
                  valueFormat="id"
                /> -->
              </form>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="profile-element col-12 text-center p-3">
            <button
              type="button"
              class="btn btn-primary btn-sm btn-round btn-fill px-4"
              @click="updateUser"
              :disabled="saving"
            >{{ saving ? 'Updating...' : 'Update Profile'}}</button>
          </div>
        </div>
        <div class="col-6 float-right">
          <div class="col-12">
            <div style="text-align: center;">
              <h5>Profile Image</h5>
            </div>
            <div style="text-align: center;">
              <img
                :src="cdnUrl+imageUrl+user.user_details.profile_image"
                @click="openImageModal(cdnUrl+imageUrl+user.user_details.profile_image)"
                height="100%"
                @error="brokenImage"
              />
            </div>
          </div>
          <div class="col-12 mt-2">
            <div class="col-6 float-left">
              <div style="text-align: center;">
                <h5>Valid Identity</h5>
              </div>
              <img
                :src="userNationality"
                @error="brokenImage"
                @click="openImageModal(userNationality)"
                height="235"
                style="width: 100%; cursor: pointer"
              />
            </div>
            <div class="col-6 float-right">
              <div style="text-align: center;">
                <h5>Recent Image</h5>
              </div>
              <img
                :src="userPortrait"
                @error="brokenImage"
                @click="openImageModal(userPortrait)"
                height="235"
                style="width: 100%;  cursor: pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal
      name="image-show-modal"
      height="auto"
      :draggable="true"
      :classes="['v--modal', 'm-modal']"
    >
      <div class="modal-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <img :src="imageModal" @error="brokenImage" style="width: 100%;" />
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-simple btn-sm px-3"
          @click="$modal.hide('image-show-modal')"
        >{{$t('common.close')}}</button>
      </div>
    </modal>
  </div>
</template>
<style>
.profile-element {
  border-bottom: 1px solid #ebebeb;
  padding: 5px;
}
.element-name {
  font-size: 16px;
}
.element-value {
  font-size: 16px;
}
</style>
<script>
import camera from "src/assets/img/camera.svg";
export default {
  data() {
    return {
      saving: false,
      user: null,
      cdnUrl: "https://server.optimalrating.com/cdn",
      imageUrl: `/images/user/`,
      userPortrait: null,
      userNationality: null,
      imageModal: null,
      optionsStatus: [
        {
          id: "approved",
          label: "Approved"
        },
        {
          id: "disApproved",
          label: "Disapproved"
        },
        {
          id: "freeze",
          label: "Freeze"
        }
      ],
      selectedStatus: null
    };
  },
  watch: {
    selectedStatus: function(val) {
      this.user.status = val;
    }
  },
  created() {
    let data = {
      url: "user-profile/" + this.$route.params.username,
      method: "getData"
    };
    return this.$store.dispatch("definition/getData", data).then(response => {
      this.user = response.result.set;
      this.selectedStatus = this.user.status;
      this.userPortrait = `${this.cdnUrl}/images/user_portrait/${this.user.portrait_image}`;
      this.userNationality = `${this.cdnUrl}/images/user_nationality/${this.user.national_image}`;
    });
  },
  methods: {
    brokenImage(event) {
      event.target.src = camera;
    },
    openImageModal(modal) {
      this.imageModal = modal;
      this.$modal.show("image-show-modal");
    },
    updateUser() {
      this.saving = true;
      this.$store
        .dispatch("definition/updateUser", { data: this.user })
        .then(response => {
          this.saving = false;
          if (response.code === 200) {
            this.$modal.hide("user-modal");
            this.$modal.hide("status-modal");
            this.notify(this.$t(response.message), "success");
          }
        })
        .catch(error => {
          this.saving = false;
          this.notify(this.$t(error.message), "error");
        });
    }
  }
};
</script>

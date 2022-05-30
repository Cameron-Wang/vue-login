<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item @click.native="nameVisible = true">
              修改昵称
            </el-dropdown-item>
            <el-dropdown-item @click.native="pictureVisible = true">
              上传头像
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改昵称" :visible.sync="nameVisible" width="500px">
      <el-form :model="userForm" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <span>{{ userName }}</span>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input
            v-model="userForm.nickName"
            placeholder="请输入用户昵称"
            autocomplete="off"
            style="width: 230px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nameVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateName">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传头像" :visible.sync="pictureVisible" width="500px">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" ref="uploadElement">
          <el-upload
            ref="upload"
            action="#"
            accept="image/png,image/gif,image/jpg,image/jpeg"
            list-type="picture-card"
            :limit="limitNum"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :before-upload="handleBeforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="imgChange"
            :class="{ hide: hideUpload }"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pictureVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadFile">立即上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import request from '@/utils/request'
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      nameVisible: false,
      userForm: {
        nickName: "",
      },
      rules: {
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
        ],
      },
      hideUpload: false,
      pictureVisible: false,
      dialogImageUrl: "",
      formLabelWidth: "80px",
      limitNum: 1,
      form: {},
      dialogVisible: false, //图片预览弹窗
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "nickName", "userName", 'userId']),
    // userForm: {
    //   get() {
    //     return { nickName: '' }
    //   }
    // }
  },
  watch: {
    avatar (val) {
      console.log('avatar', val)
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      // await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    handleUpdateName() {
      this.$store
        .dispatch("user/updateNickName", this.userForm.nickName)
        .then(() => {
          this.nameVisible = false
        })
        .catch(() => {
          this.nameVisible = true
        });
    },
    // 获取用户个人信息
    handleGetUserInfo() {
       this.$store
        .dispatch("user/getInfo")
        .then(() => {
          this.nameVisible = false
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 上传文件之前的钩子
    handleBeforeUpload(file) {
      if (
        !(
          file.type === "image/png" ||
          file.type === "image/gif" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg"
        )
      ) {
        this.$notify.warning({
          title: "警告",
          message:
            "请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片",
        });
      }
      let size = file.size / 1024 / 1024 / 2;
      if (size > 2) {
        this.$notify.warning({
          title: "警告",
          message: "图片大小必须小于2M",
        });
      }
      let fd = new FormData(); //通过form数据格式来传
      fd.append("profile", file); //传文件
      fd.append('userId', this.userId)
      fd.append('userName', this.userName)
      console.log(fd.get("profile"));
      request({
        url: "/api/updateUserProfile",
        method: "post",
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response) => {
        console.log(response.data)
        this.pictureVisible = false
        const { profileUrl } = response.data
        this.$store.dispatch('user/updateUserProfile', profileUrl)
        // this.$store.commit('SET_AVATAR', profileUrl)
      });
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {},
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitNum;
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadFile() {
      this.$refs.upload.submit();
    },
    imgChange(files, fileList) {
      this.hideUpload = fileList.length >= this.limitNum;
      if (fileList) {
        this.$refs.uploadElement.clearValidate();
      }
    },
    tocancel() {
      this.dialogVisible2 = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
  }
}
.avatar-container {
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.hide .el-upload--picture-card {
  display: none;
}
</style>

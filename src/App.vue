<template>
  <div class="wrap">
    <div class="menu-list-box">
      <div :class="{active : currentName === item.name}" class="list" @click="handleClick(item)" v-for="(item , index) in menuConfig" :key="index">
        <span class="name">{{item.name}}</span>
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import menuConfig from './menuConfig';
const router = useRouter();
const currentName = ref('');
const handleClick = (item: any) => {
  currentName.value = item.name;
  router.push(item.path);
}
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
}
body , html {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
.btn-box{
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10;
}
.wrap {
  display: flex;
  width: 100%;
  height: 100%;
  .menu-list-box {
    width: 300px;
    height: 100%;
    overflow: auto;
    border: 1px solid #ddd;
    .list {
      padding: 15px;
      position: relative;
      cursor: pointer;
      &.active {
        .name {
          color: #007aff;
        }
      }
      &:hover {
        .name {
          color: #007aff;
        }
      }
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ddd;
        height: 1px;
      }
      .name {
        font-size: 16px;
        color: #000 ;
      }
    }
  }
  .content {
    flex: 1;
  }
}
</style>
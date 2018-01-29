<template>
  <div>
    <div v-for='(checkb, index) in checkboxData' :key="index">
     <input type='checkbox' name='checkboxinput' class='input-checkbox' v-model="check">{{checkb.value}}
    </div>
     <button @click="click">123</button>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  methods:{
    click() {
      console.log(this.check)
      this.check = true
    }
},
watch: {//深度 watcher
},
data () {
  return {
    checkboxData:[{
      id:'1',
      value:'苹果'
    },{
      id:'2',
      value:'荔枝'
    },{
      id:'3',
      value:'香蕉'
    },{
      id:'4',
      value:'火龙果'
    }],
    check: false
  }
}
}
</script>

<style lang="stylus">

</style>
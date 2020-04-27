<template>
    <div v-if="src">
      <Name v-for="friend in friends" :key="friend" :src="friend" />
      <p>{{friends}}</p>
    </div>
</template>

<script>

const {default: data} = require('@solid/query-ldflex')

export default {
  props: (['src']),
   asyncComputed: {
        async friends(){
            let person = data[this.src]
            for await (const name of person.friends.firstName) {
              console.log("friend: " + name)
            }
        }
    }  
}
</script>

<style lang="scss" scoped>

</style>
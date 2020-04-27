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
          //todo: return list
            let person = data[this.src]
            let friends = []
            for await (const webid of person.friends) {
              console.log("friend: " + webid)
              friends.push(webid)
            }
        }
    }  
}
</script>

<style lang="scss" scoped>

</style>
<template>
    <div>
        <img class="profile" v-if="image" :src="image" alt="profile picture"/>
        <img class="profile" v-else src="@/assets/empty.png" alt="empty profile picture"/>
    </div>
</template>

<script>

const {default: data} = require('@solid/query-ldflex')

export default {
    props:['src'],
    asyncComputed: {
        async image(){
            let person = data[this.src]
            return await person.foaf_img
        }
    }  
}
</script>

<style lang="css" scoped>

.profile {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    float: left;
    padding: 10px;
    margin: 10px;
}

</style>
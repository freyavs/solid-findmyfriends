<template>
    <div>
        <span>{{ name }}</span>
    </div>
</template>

<script>

const {default: data} = require('@solid/query-ldflex')

export default {
    props:['src'],
    asyncComputed: {
        async name(){
            const person = data[this.src]
            return await person.label
        }
    }  
}
</script>

<style lang="scss" scoped>

</style>
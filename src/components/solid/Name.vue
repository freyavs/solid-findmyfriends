<template>
    <div class="name">
        <h3>{{ name }}</h3>
    </div>
</template>

<script>

const {default: data} = require('@solid/query-ldflex')

export default {
    props:['src'],
    asyncComputed: {
        async name(){
            let person = data[this.src]
            return await person.name
        }
    }  
}
</script>

<style scoped>
.name {
	width: 100%;
}

h3 {
	margin: 10px;
	text-align: left;
}
</style>

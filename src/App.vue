<template lang="pug">
	#app
		card(:msg="name" :bg="background")
		footerDown(:text="name" :bg="background")
</template>

<script>
import card from './components/card.vue'
import footerDown from './components/footer.vue'

export default {
  name: 'App',
  components: {
		card,
		footerDown
	},
	data: function() {
		return {
			name: 'Карточки дел',
			background: 'maincolor'
		}
	},
}
</script>

<style lang="scss">

body {
	margin: 0;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
.maincolor {
	background-color: #a3c1cf;
	color: white;
}
</style>

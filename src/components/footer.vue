<template lang="pug">
	footer.footer(:class="bg")
		.footer__container
			h4 {{ text }}
				span , 
				span {{ new Date().getFullYear() }}
</template>

<script>
export default {
  name: 'footerDown',
  props: {
		text: String,
		bg: String
  }
}
</script>

<style lang="scss">
$container-width: 1360px;
.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	&__container {
		max-width: $container-width;
		margin: auto;
		box-sizing: border-box;
		padding: 15px 30px;
	}
	h4 {
		margin: 0;
	}
}
</style>

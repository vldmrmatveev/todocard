<template lang="pug">
.card__body
	.card__body-block(:id='id' @click='changeInput(id)')
		.card__checkbox
			img(v-if="done" src="@/assets/check_circle_outline-24px1.svg")
			img(v-else src="@/assets/radio_button_unchecked-24px1.svg")
		h3 {{message}}
		p.card__about {{about}}
		.card__body-group(v-if="group !== ''") {{group}}
	.card__content
		.card__remove(v-if="done")
			button.card__btn(@click='removeThis(id)')
				img(src="@/assets/delete-24px.svg")
		.card__change(v-else-if="done == false && this.$store.state.groups.length > 0")
			.card__change-input(v-if="changeGroup")
				.card__change-input-block
					label(for="groupOld").modal__label Добавить в группу
					select(v-model="cardGroupOld" required)#groupOld.modal__select
						option(:value="{color: 'white', name: ''}") Без группы
						option(v-for='(group, index) in this.$store.state.groups' :key='group.id' :value='{color: group.color, name: group.name}') {{group.name}}
					span(v-if="cardGroupOldinvalid").modal__error Не забудьте выбрать группу
				button.card__btn(@click="changeCardGroup(id)")
					img(src="@/assets/check-24px.svg")
			button.card__btn.card__btn-bottom(@click="changeGroup = !changeGroup" v-if="changeGroup")
				img(src="@/assets/close-24px.svg")
			button.card__btn(@click="changeGroup = !changeGroup" v-else)
				img(src="@/assets/library_add-24px.svg")
					

</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
export default {
	name: 'item',
	data() {
		return {
			cardGroupOld: '',
			cardGroupOldinvalid: false,
			changeGroup: false
		}
	},
  props: {
		message: String,
		group: String,
		about: String,
		id: Number,
		done: Boolean
	},
	methods: {
		...mapMutations([
		'changeCard', 
		'removeThisItem',
		'changeThisGroup'
	]),
		changeInput(index) {
			return this.changeCard(index);
		},
		removeThis(index) {
			return this.removeThisItem(index);
		},
		changeCardGroup(index, group, color) {
			if (this.changeGroup == '') {
				this.cardGroupOldinvalid = true;
			} else {
				this.cardGroupOldinvalid = false;
				this.changeGroup = false;
				return this.changeThisGroup([index, this.cardGroupOld.name, this.cardGroupOld.color]);
			}
		}
	}
}
</script>
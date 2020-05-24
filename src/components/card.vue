<template lang="pug">
.application
	header.header(:class="bg")
		.header__container
			h4.header__title {{msg}}
			.btn-content
				button.header__btn(@click="modalGroup = true" v-if="this.$store.state.groups.length > 0")
					img(src="@/assets/delete_sweep-24px.svg")
				button.header__btn(@click="removeThis")
					img(src="@/assets/delete-24px.svg")
				button.header__btn(@click="showModal = true")
					img(src="@/assets/add-24px.svg")
	transition(name='fade')
		.row
			.col-3(v-if="this.$store.state.groups.length > 0")
				select(v-model="filter" required)#groupSelect.modal__select
					option(value="all") Показать всё
					option(v-for='(group, index) in this.$store.state.groups' :key='group.id' :value='group.name') {{group.name}}
			.col-3(v-if="this.$store.state.cards.length > 1")
				select(v-model="check" required)#checkSelect.modal__select
					option(value="all") Показать всё
					option(value="true") Выполненные
					option(value="false") Не выполненные
			.col-3(v-if="this.$store.state.cards.length > 1")
				input(type="text" v-model.trim="search" placeholder="Поиск по названию задачи").modal__input
	.card__container.card__container-none(v-if="this.$store.state.cards.length == 0")
		h2 Карточки еще не созданы, самое время начать
	.card__container(v-else)
		.card(v-for='(card, index) in SearchFilter' :key='card.id')
			item(:id='card.id' :done='card.done' :group='card.group' :message='card.text'  :about='card.about' :class='card.color')
	transition(name='fade')
		.modal__bg(v-if="modalGroup")
			.modal
				.modal__close(@click="modalGroup = false")
				.modal__title Для удаления группы выберите ниже:
				label(for="removeGroup").modal__label Выберите группу
				select(v-model="removeGroupParam" required)#removeGroup.modal__select
					option(v-for='(group, index) in this.$store.state.groups' :key='group.id' :value='{color: group.color, name: group.name, id: group.id}') {{group.name}}
				span(v-if="removeGroupinvalid").modal__error Не забудьте выбрать группу
				p Группа будет удалена, но карточки с задачами останутся без имени группы и заданного цвета.
				button.modal__btn(@click="removeGroup") Удалить
	transition(name='fade')
		.modal__bg(v-if="showModal")
			.modal
				.modal__close(@click="showModal = false")
				.modal__title Для создания карточки введите данные ниже:
				label(for="taskName").modal__label Имя задачи
				input(v-if="invalid" type="text" v-model.trim="cardName" v-on:keyup.enter="addTask" required)#taskName.modal__input.error
				input(v-else type="text" v-model.trim="cardName" v-on:keyup.enter="addTask" required)#taskName.modal__input
				span(v-if="invalid").modal__error Вводить не менее 4-х символов
				label(for="description").modal__label Описание задачи
				textarea(v-model.trim="cardDescription")#description.modal__textarea
				.modal__block
					input(type="radio" v-model="newGroup" value='1')#noGroup.modal__radio
					label(for="noGroup").modal__label.modal__label-radio
						span.modal__checkbox
						span Не использовать группы
				.modal__block
					input(type="radio" v-model="newGroup" value='2')#newGroupItem.modal__radio
					label(for="newGroupItem").modal__label.modal__label-radio
						span.modal__checkbox
						span Создать новую группу с задачей
				.modal__block(v-if="this.$store.state.groups.length > 0")
					input(type="radio" v-model="newGroup" value='3')#oldGroup.modal__radio
					label(for="oldGroup").modal__label.modal__label-radio
						span.modal__checkbox
						span Добавить в существующую
				.modal__row(v-if="newGroup=='1'")
				.modal__row(v-else-if="newGroup=='2'")
					.modal__col
						label(for="group").modal__label Введите имя группы
						input(type="text" v-model.trim="cardGroup" required v-if="cardGroupinvalid")#group.modal__input.error
						input(type="text" v-model.trim="cardGroup" required v-else)#group.modal__input
						span(v-if="cardGroupinvalid").modal__error Вводить не менее 4-х символов, но меньше 15
					.modal__col
						label(for="color").modal__label И цвет
						select(v-model="cardColor")#color.modal__select
							option(v-for='option in optionsColor' :value='option.value') {{ option.text }}
				.modal__row(v-else-if="newGroup=='3'")
					.modal__col-2
						label(for="groupOld").modal__label Добавить в группу
						select(v-model="cardGroupOld" required)#groupOld.modal__select
							option(v-for='(group, index) in this.$store.state.groups' :key='group.id' :value='{color: group.color, name: group.name}') {{group.name}}
						span(v-if="cardGroupOldinvalid").modal__error Не забудьте выбрать группу
				button.modal__btn(@click="addTask") Создать

</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
export default {
  name: 'Card',
  props: {
		msg: String,
		bg: String
	},
	data() {
		return {
			cardName: '',
			cardDescription: '',
			cardGroup: '',
			cardGroupOld: '',
			filter: 'all',
			check: 'all',
			search: '',
			cardColor: 'white',
			removeGroupParam: '',
			removeGroupinvalid: false,
			showModal: false,
			modalGroup: false,
			newGroup: '1',
			cardGroupinvalid: false,
			cardGroupOldinvalid: false,
			invalid: false,
			optionsColor: [
				{ text: 'Белый', value: 'white' },
				{ text: 'Бежевый', value: 'blanchedalmond' },
				{ text: 'Голубой', value: 'aliceblue' },
				{ text: 'Желтый', value: 'cornsilk' },
				{ text: 'Сиреневый', value: 'lavender' },
				{ text: 'Розовый', value: 'lavenderblush' },
				{ text: 'Зеленый', value: 'darkseagreen' }
			]
		}
	},
	methods: {
		...mapMutations([
			'removeItem',
			'addItem',
			'addGroup',
			'removeThisGroup'
		]),
		removeThis() {
			return this.removeItem();
		},
		removeGroup() {
			if (this.removeGroupParam == '') {
				this.removeGroupinvalid = true;
			} else {
				this.removeGroupinvalid = false;
				this.modalGroup = false;
				let id = this.removeGroupParam.id;
				let name = this.removeGroupParam.name;
				this.removeGroupParam = '';
				return this.removeThisGroup([id, name]);
			}
			
		},
		addTask(event) {
			if (this.cardName.length>3) {
				this.invalid = false;
				if (this.newGroup == '1') {
					this.addItem([this.cardName, this.cardDescription, '', false]);
					this.cardName = '';
					this.cardDescription = '';
					this.cardGroup = '';
					this.cardColor = 'white';
					this.showModal = false;
				}
				else if (this.newGroup == '2') {
					if (this.cardGroup.length>3 && this.cardGroup.length<15) {
						this.cardGroupinvalid = false;
						this.addGroup([this.cardGroup, this.cardColor]);
						this.addItem([this.cardName, this.cardDescription, this.cardGroup, this.cardColor]);
						this.cardName = '';
						this.cardDescription = '';
						this.cardGroup = '';
						this.cardColor = 'white';
						this.newGroup = '1';
						this.showModal = false;
					} else {
						this.cardGroupinvalid = true;
					}
				}
				else if (this.newGroup == '3') {
					if (typeof this.cardGroupOld.name !== "undefined") {
						this.cardGroupOldinvalid = false;
						this.addItem([this.cardName, this.cardDescription, this.cardGroupOld.name, this.cardGroupOld.color]);
						this.cardName = '';
						this.cardDescription = '';
						this.cardGroup = '';
						this.cardColor = 'white';
						this.newGroup = '1';
						this.showModal = false;
					} else {
						this.cardGroupOldinvalid = true;
					}
				} 
			}
			else {
				this.invalid = true;
			}
		},
	},
	computed: {
		SearchFilter() {
			if (this.filter == 'all' && this.check == 'all') {
				return this.$store.getters.filterCards.filter(item => {
					return item.text.toLowerCase().includes(this.search.toLowerCase());
				});
			}
			else if (this.filter !== 'all' && this.search == '' && this.check == 'all' && this.$store.state.groups.length > 0) {
				return this.$store.getters.filterByGroup.filter(item => {
					return item.group.includes(this.filter);
				});
			} 
			else if  (this.filter !== 'all' && this.search !== '' && this.check == 'all' && this.$store.state.groups.length > 0) {
				let new_arr = this.$store.getters.filterByGroup.filter(item => {
					return item.group.includes(this.filter);
				});
				return new_arr.filter(item => {
					return item.text.toLowerCase().includes(this.search.toLowerCase());
				});
			} 
			else if (this.check !== 'all' && this.search == '' && this.filter == 'all') {
				if (this.check == 'true') {
					return this.$store.getters.filterByDone.filter(item => {
						return item.done.toString().includes(this.check.toString());
					});
				} else {
					return this.$store.getters.filterByDoneFalse.filter(item => {
						return item.done.toString().includes(this.check.toString());
					});
				}
			}
			else if (this.check !== 'all' && this.search !== '' && this.filter == 'all') {
				if (this.check == 'true') {
					let new_arr = this.$store.getters.filterByDone.filter(item => {
						return item.done.toString().includes(this.check.toString());
					});
					return new_arr.filter(item => {
						return item.text.toLowerCase().includes(this.search.toLowerCase());
					});
				} else {
					let new_arr = this.$store.getters.filterByDoneFalse.filter(item => {
						return item.done.toString().includes(this.check.toString());
					});
					return new_arr.filter(item => {
						return item.text.toLowerCase().includes(this.search.toLowerCase());
					});
				}
			}
			else if (this.check !== 'all' && this.search == '' && this.filter !== 'all' && this.$store.state.groups.length > 0) {
				if (this.check == 'true') {
					let new_arr = this.$store.getters.filterByDone.filter(item => {
						return item.done.toString().includes(this.check.toString());
					});
					return new_arr.filter(item => {
						return item.group.includes(this.filter);
					});
				} else {
					let new_arr = this.$store.getters.filterByDoneFalse.filter(item => {
						return item.done.toString().includes(this.check.toString());
					});
					return new_arr.filter(item => {
						return item.group.includes(this.filter);
					});
				}
			}
			else if (this.check !== 'all' && this.search !== '' && this.filter !== 'all' && this.$store.state.groups.length > 0) {
				if (this.check == 'true') {
					let new_arr = this.$store.getters.filterByDone.filter(item => {
						return item.done.toString().includes(this.check.toString());
					});
					let filtered = new_arr.filter(item => {
						return item.group.includes(this.filter);
					});
					return filtered.filter(item => {
						return item.text.toLowerCase().includes(this.search.toLowerCase());
					});
				} else {
					let new_arr = this.$store.getters.filterByDoneFalse.filter(item => {
						return item.done.toString().includes(this.check.toString());
					});
					let filtered = new_arr.filter(item => {
						return item.group.includes(this.filter);
					});
					return filtered.filter(item => {
						return item.text.toLowerCase().includes(this.search.toLowerCase());
					});
				}
			}
			else if (this.$store.state.groups.length == 0) {
				this.filter = 'all';
				return this.$store.getters.filterByGroup.filter(item => {
					return item.group.includes(this.filter);
				});
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$container-width: 1360px;
@mixin large {
	@media (min-width: 1440px) {
		@content;
	}
}
@mixin tablet {
	@media (max-width: 991px) {
		@content;
	}
}
@mixin phone {
	@media (max-width: 576px) {
		@content;
	}
}
.header {
	&__container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 30px;
		max-width: $container-width;
		margin: auto;
		box-sizing: border-box;
	}
	&__title {
		margin: 0;
	}
	&__btn {
		background-color: white;
		border: none;
		border-radius: 100%;
		width: 40px;
		height: 40px;
		outline: none;
		transition: 0.2s ease all;
		cursor: pointer;
		margin: 0 10px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		@include phone() {
			width: 30px;
			height: 30px;
			margin: 0 5px;
			img {
				width: 20px;
			}
		}
		&:last-child {
			margin-right: 0;
		}
		&:hover {
			background-color: darken(white, 5%);
		}
	}
}
.card {
	background-color: white;
	border-radius: 10px;
	box-shadow: 0px 0px 20px 6px rgba(0, 0, 0, 0.1);
	width: calc(33.333% - 30px);
	margin: 0 15px 30px 15px;
	box-sizing: border-box;
	position: relative;
	transition: 0.2s ease all;
	overflow: hidden;
	&:hover {
		box-shadow: 0px 0px 20px 6px rgba(0, 0, 0, 0.15);
	}
	@include large() {
		width: calc(25% - 30px);
	}
	@include tablet() {
		width: calc(50% - 30px);
	}
	@include phone() {
		width: calc(100% - 30px);
	}
	&__content {
		padding: 0 20px 20px;
	}
	&__change {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		//margin-bottom: 25px;
		&-input {
			width: calc(100% - 60px);
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			margin-bottom: 25px;
			&-block {
				width: calc(100% - 60px);
			}
		}
	}
	&__body {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		&-block {
			padding: 20px 20px 0 20px;
			cursor: pointer;
		}
		&-group {
			position: absolute;
			right: 15px;
			bottom: 15px;
			font-style: italic;
			font-weight: bold;
		}
		p {
			margin: 0 0 15px 0;
		}
		h3 {
			margin-top: 0;
			margin-right: 15px;
		}
	}
	&__about {
		white-space: pre-line;
	}
	&__checkbox {
		position: absolute;
		right: 15px;
		top: 15px;
	}
	&__btn {
		border: none;
		background-color: white;
		width: 40px;
		height: 40px;
		border-radius: 100%;
		transition: 0.2s ease all;
		outline: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		&-bottom {
			margin-bottom: 25px;
		}
		&:hover {
			box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.1);
		}
	}
	&__container {
		margin: auto;
		max-width: $container-width;
		padding: 30px 15px;
		display: flex;
		flex-wrap: wrap;
		&-none {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: calc(100vh - 120px);
			margin: 0;
			box-sizing: border-box;
		}
	}
}
.modal {
	background-color: white;
	border-radius: 10px;
	padding: 50px 40px;
	min-width: 320px;
	position: relative;
	box-sizing: border-box;
	max-width: 500px;
	p {
		font-size: 14px;
	}
	&__close {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 20px;
		height: 20px;
		cursor: pointer;
		&:before,
		&:after {
			content: '';
			width: 100%;
			height: 3px;
			background-color: black;
			border-radius: 3px;
			transform: rotate(45deg);
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			transition: 0.2s ease all;
		}
		&:after {
			transform: rotate(-45deg);
		}
		&:hover {
			&:before,
			&:after {
				background-color: darkcyan;
			}
		}
	}
	&__bg {
		background-color: rgba(0,0,0,0.6);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	&__title {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 20px;
	}
	&__label {
		width: 100%;
		color: #212529;
		font-size: 12px;
		display: block;
		margin-bottom: 5px;
		&-radio {
			width: initial;
			display: inline-block;
		}
	}
	&__radio {
		opacity: 0;
		position: absolute;
		pointer-events: none;
	}
	&__checkbox {
		width: 10px;
		height: 10px;
		border: 1px solid lightgrey;
		display: inline-block;
		margin-right: 10px;
		position: relative;
		border-radius: 100%;
		&:before {
			content: '';
			width: 60%;
			height: 60%;
			background-color: lightgrey;
			border-radius: 100%;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			position: absolute;
			opacity: 0;
			transition: 0.2s ease all;
		}
	}
	&__error {
		color: brown;
		margin-bottom: 10px;
		font-size: 10px;
		margin-top: 4px;
		display: inline-block;
	}
	&__input {
		width: 100%;
		padding: 8px 15px;
		border: 1px solid lightgrey;
		outline: none;
		box-sizing: border-box;
		border-radius: 5px;
		margin-bottom: 10px;
		height: 31px;
		&.error {
			border: 1px solid brown;
			color: brown;
			margin-bottom: 0;
		}
	}
	&__textarea {
		width: 100%;
		height: 100px;
		resize: none;
		box-sizing: border-box;
		padding: 8px 15px;
		border: 1px solid lightgrey;
		outline: none;
		border-radius: 5px;
		margin-bottom: 15px;
	}
	&__select {
		display: block;
		width: 100%;
		padding: 8px 15px;
		line-height: 1.8;
		color: #495057;
		background-color: #fff;
		background-clip: padding-box;
		border: 1px solid #ced4da;
		border-radius: 5px;
		height: 31px;
		outline: none;
		-webkit-appearance:none;
		line-height: 1;
	}
	&__row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 10px;
		@include phone() {
			margin-bottom: 10px;
		}
	}
	&__btn {
		width: 100%;
		padding: 15px 20px;
		color: white;
		background-color: cadetblue;
		border: 1px solid cadetblue;
		transition: 0.2s ease all;
		margin-top: 10px;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
		outline: none;
		&:hover {
			background-color: darken(cadetblue, 10%);
		}
	}
	&__col {
		width: calc(50% - 15px);
		@include phone() {
			width: 100%;
			&-2 {
				width: 100%;
			}
		}
	}
}
$backgrounds: blanchedalmond, aliceblue, lavender, lavenderblush, darkseagreen, white, cornsilk;
@each $background in $backgrounds {
	.#{$background} {
		background-color: $background;
	}
}
input[type="radio"]:checked + label .modal__checkbox:before {
	opacity: 1;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.row {
	display: flex;
	flex-wrap: wrap;
	padding: 15px 15px;
	margin: 15px auto 0;
	max-width: $container-width;
}
.col-3 {
	width: calc(33.333% - 30px);
	margin: 0 15px;
	@include phone() {
		width: calc(100% - 30px);
		margin: 0 15px 15px 15px;
		&:last-child {
			margin-bottom: 0;
			.modal__input {
				margin-bottom: 0;
			}
		}
	}
}
.col-4 {
	width: calc(40% - 30px);
	margin: 0 15px;
}
.col-6 {
	width: calc(60% - 30px);
	margin: 0 15px;
}
.application {
	overflow: hidden;
}
</style>

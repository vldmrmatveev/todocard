import Vue from 'vue'
import Vuex from 'vuex'
var ID = 7;
var groupID = 3;

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		cards: [
			{ id: 1, text: 'Покормить собаку', about: 'Длинный текст описания задачи, которая необходима для проверки или не так уж необходим?', done: false, group: '', color: 'white' },
			{ id: 2, text: 'Купить еду', about: 'Длинный текст описания задачи, которая необходима', done: false, group: '', color: 'blanchedalmond' },
			{ id: 3, text: 'Помыть посуду', about: 'Длинный текст описания задачи, которая необходима', done: false, group: '', color: 'aliceblue' },
			{ id: 4, text: 'Помыть посуду и полы', about: 'Длинный текст описания задачи', done: false, group: '', color: 'cornsilk' },
			{ id: 5, text: 'Погладить', about: 'вещи', done: false, group: 'Проверка', color: 'lavenderblush' },
			{ id: 6, text: 'Проверить', about: 'почту', done: false, group: '№2', color: 'darkseagreen' },
			{ id: 7, text: 'Погладить', about: 'кота', done: false, group: 'Проверочная', color: 'lavender' }
		],
		groups: [
			{id: 1, name: 'Проверка', color: 'lavenderblush'},
			{id: 2, name: '№2', color: 'darkseagreen'},
			{id: 3, name: 'Проверочная', color: 'lavender'}
	]
	},
	getters: {
		filterCards: state => {
			return state.cards.filter(card => card.text);
		},
		filterByGroup: state => {
			return state.cards.filter(card => card.group);
		},
		filterByDone: state => {
			return state.cards.filter(card => card.done);
		},
		filterByDoneFalse: state => {
			return state.cards.filter(card => card.done == false);
		}
	},
  mutations: {
		changeCard(state, id) {
			state.cards.forEach( item => {
				if(item.id === id) item.done = !item.done;
			})
		},
		removeItem(state, getters) {
			state.cards = state.cards.filter(todo => !todo.done);
		},
		changeThisGroup(state, [id, groupName, colorName]) {
			state.cards.forEach(item => {
				if (item.id === id) {
					item.group = groupName;
					item.color = colorName;
				}
			})
			//card.group = 'dddd';
		},
		removeThisItem(state, id) {
			let index = state.cards.findIndex(card => card.id == id)
			state.cards.splice(index, 1);
		},
		removeThisGroup(state, [id, name]) {
			let index = state.groups.findIndex(group => group.id == id)
			state.groups.splice(index, 1);
			state.cards.forEach(item => {
				if (item.group === name) {
					item.group = '';
					item.color = '';
				}
			})
		},
		addItem(state, [title, abouttext, cardgroup, background]) {
			state.cards.push({
				id:ID++,
				text: title,
				about: abouttext,
				color: background,
				group:cardgroup,
				done: false});
		},
		addGroup(state, [group, color]) {
			state.groups.push({
				id: groupID++,
				name: group,
				color: color
			})
		}
  },
  actions: {
  },
  modules: {
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex);

export const store = new Vuex.Store({

    plugins: [createPersistedState()],
    state: {
        favorites: [],
    },

    mutations: {
        AddToFavorites(state, id){
            
            if(state.favorites.includes(id)){
                state.favorites = state.favorites.filter(f => f !== id)
            } else {
                state.favorites.push(id); 
            }

        }
    },

    actions: {},

    getters: {
        favorites: state => state.favorites,
    }

})

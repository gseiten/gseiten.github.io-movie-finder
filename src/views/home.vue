
<template>



    <div class="main-container has-background-black-ter">

        <nav class="navbar has-background-black">
            <div class="container">
                <div class="navbar-brand">
                    <a class="navbar-item" href="#">
                        <img class="image" src="../assets/movie2.png">
                    </a>
                    <a role="button" class="navbar-burger" @click="is_hamburger_active = !is_hamburger_active" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" :class="{'is-active': is_hamburger_active}">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                <div id="navbarBasicExample" class="navbar-menu has-background-black" :class="{'is-active': is_hamburger_active}">
                    <div class="navbar-start">
                        <div class="navbar-item field has-addons test" >

                            <div class="field has-addons">
                                <div class="control select-control">
                                    <div class="select is-black">
                                        <select class="has-background-black-ter has-text-light" v-model="search_type">
                                            <option
                                                v-for="opt in search_options" 
                                                v-bind:value="{ id: opt.id, type: opt.type }">
                                                {{ opt.type }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <p class="control has-icons-right input-control">
                                    <input 
                                        v-model="search_text"
                                        @keyup.enter="GetMovies()"
                                        class="search-input input is-black" 
                                        type="search" 
                                        placeholder="Search Movies"
                                    >
                                    <span class="icon is-right">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </p>

                            </div>

                        </div>
                    </div>
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <button class="button is-dark has-background-black-ter" @click="GetFavoriteMovies()">
                                <span class="icon">
                                <i class="fas fa-star"></i>
                                </span>
                                <span>Favorites</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="section has-background-black-ter" style="height: 100%">
            <div class="main-card-container">
               
                <square :loading="mloader" color="#808080" :key="mloader"></square>

                <div class="main-card-content">
                    
                    <div v-if="this.filteredMovies" class="article-container">
                        <div
                            class="article-content has-background-black-bis"
                            v-for="(item, index) in filteredMovies"
                            :key="index"
                        >
                            <div @click="GetMovieDetails(item.imdbID)">
                                <img class="image" v-if="item.Poster" :src="item.Poster" alt />
                                <div class="level is-marginless" >
                                    <p class="subtitle is-5 has-text-light is-marginless" >
                                        {{ item.Title }} ({{item.Year}})
                                    </p>
                                    <div class="level-right is-pulled-right">
                                        <div 
                                            @click="AddToFavorites(item.imdbID)" 
                                            @click.stop
                                            class="level-item">
                                             <div class="is-pulled-right">
                                                <i v-if="item.favorited" class="fas fa-star fa-2x"></i>
                                                <i v-else class="far fa-star fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                <div class="has-text-grey-dark is-size-5">{{ item.Type | capitalize }}</div>

                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <img class="empty-image" src="../assets/empty.png" alt=""><br>
                        <div class="subtitle is-4 has-text-grey-lighter has-text-centered">
                            No Results Found
                        </div>
                    </div>

                </div>

            </div>
        </div>

        <!-- MODAL VIEW -->

        <div class="modal" :class="{ 'is-active' : is_modal_open }">

            <div class="modal-background">
            </div>
            <div class="modal-card">

                <section class="modal-card-body has-background-black-bis">
                    <div class="article-content has-background-black-bis">
                        <img class="image" v-if="movie_details.Poster" :src="movie_details.Poster" alt />
                        <p class="title is-3 has-text-light is-marginless is-pulled-left">
                            {{ movie_details['Title'] }} ({{ movie_details['Year'] }})
                        </p>
                        <div>
                            <div class="has-text-light is-pulled-left">
                                <span class="has-text-grey">{{ movie_details['Genre'] }}</span>
                                <br>
                                <span class="has-text-grey">{{ movie_details['Runtime'] }}</span> 
                                <br><br>
                                <span class="has-text-light"> <strong>Cast:</strong>  {{ movie_details['Actors'] }}</span>
                                <br>
                                <span class="has-text-light"> <strong>Director(s):</strong> {{ movie_details['Director'] }}</span>
                                <br><br>
                                <span class="is-size-6">{{ movie_details['Plot'] }}</span>
                            </div>
                            <div class="is-pulled-right">
                                <button class="button is-warning has-text-weight-bold">
                                    {{ movie_details['imdbRating'] }} / 10
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <button class="modal-close is-large" aria-label="close" @click="is_modal_open = !is_modal_open"></button>

        </div>

    </div>

</template>

<script>

import axios from 'axios';

export default {

	name: 'home',

	components: {
	},

	data() {
		return {
            movies: [],
            movie_details: {},
            omdb_url: "https://omdbapi.com/",
            api_key: "e4e5c824",
            search_text: "",
            mloader: false,
            search_options: [
                {id: 1, type: "ID's"},
                {id: 2, type: "Name"}
            ],
            search_type: '',
            is_modal_open: false,
            is_hamburger_active: false,
		}
	},

	created: function(){

        this.search_type = this.search_options[0]; // default
        
        axios.get(this.omdb_url, {
            params: {
                s: 'superman',
                apikey: this.api_key,
                page: 1
            }
        })
        .then(response => {
            this.movies = response.data.Search;
            // this.movies = this.movies.map(v => ({...v, favorited: false}));
        })

    },
    
    methods: {

        GetMovies(){

            // tt3896198,tt0081573

            this.mloader = true;
            if(this.movies)
                this.movies.splice(0);
                this.movies = []

            if(this.search_type.id === 1){
                // ID's are selected

                let promises = []
                let id_list = this.search_text.split(",");
                id_list.forEach(element => {
                    promises.push(
                        axios.get(this.omdb_url, {
                            params: {
                                i: element,
                                apikey: this.api_key
                            }
                        })
                    )
                });
                
                axios.all(promises).then(results => {
                    results.forEach(item => {
                        if(item.data.Response == "False"){
                            alert(item.data.Error)
                        } else {
                            this.movies.push(item.data);
                            // this.movies = this.movies.map(v => ({...v, favorited: false}));
                        }
                    })
                }).catch(error => {
                    console.log(error);
                }).then(() => {
                    this.mloader = false;
                })



            } else if(this.search_type.id === 2){
                //  search by name

                axios.get(this.omdb_url, {
                    params: {
                        s: this.search_text,
                        apikey: this.api_key,
                        page: 1
                    }
                })
                .then(response => {
                    this.movies = response.data.Search;
                    // this.movies = this.movies.map(v => ({...v, favorited: false}));
                    // console.log(this.movies);
                })
                .catch(err => {
                    console.log(err)
                })
                .then(() => {
                    this.mloader = false;
                })

            }

        },

        GetMovieDetails(id){

            this.is_modal_open = true;
            this.movie_details = {};
            axios.get(this.omdb_url, {
                params: {
                    i: id,
                    apikey: this.api_key
                }
            })
            .then(response => {
                // this.movie_details = response.data.Search;
                console.log(response.data);
                this.movie_details = response.data;
            })
            .catch(err => {
                console.log(err)
            })
            .then(() => {
            })
            
        },


        AddToFavorites(id){
            this.$store.commit("AddToFavorites", id);
            // console.log(this.$store.getters.favorites);
        },

        GetFavoriteMovies() {

            this.mloader = true;
            if(this.movies)
                this.movies.splice(0);
                this.movies = []

            let promises = []
            let id_list = this.$store.getters.favorites;
            id_list.forEach(element => {
                promises.push(
                    axios.get(this.omdb_url, {
                        params: {
                            i: element,
                            apikey: this.api_key
                        }
                    })
                )
            });
            
            axios.all(promises).then(results => {
                results.forEach(item => {
                    if(item.data.Response == "False"){
                        alert(item.data.Error)
                    } else {
                        this.movies.push(item.data);
                        // this.movies = this.movies.map(v => ({...v, favorited: false}));
                    }
                })
            }).catch(error => {
                console.log(error);
            }).then(() => {
                this.mloader = false;
            })

        }

    },

    computed: {
        filteredMovies(){
            if(this.movies){
                this.movies = this.movies.map(v => ({...v, favorited: false}));
                let favorites = this.$store.getters.favorites;
                favorites.forEach(x => {
                    this.movies.forEach(y => {
                        if(y.imdbID == x){
                            y.favorited = true
                        }
                    })
                })
                return this.movies
            }
        },
    },

    filters: {
        capitalize(str){
            const lower = str.toLowerCase();
            return str.charAt(0).toUpperCase() + lower.slice(1);
        }
    },

    watch: {
        search_text(){
            if(this.search_type.id === 2){
                this.GetMovies(this.search_text)
            } else {
                return
            }
            
        }
    }




}
</script>

<style scoped>

.main-container {
    min-height: 100vh;
}

.navbar-start {
    width: 100%;
    justify-content: center;
}

.navbar-start .navbar-item, .navbar-start .navbar-item .field {
    width: 100%;
}

.input-control {
    width: 100%;
}

/* .select-control, .input-control {
    height: 100%
} */

.main-card-content {
    margin: 0 2em 0 0;
}

.article-container {
    width: 100%;
    margin: 0 10px;
    columns: 4;
    column-gap: 10px;
}

.article-content {
    width: 100%;
    margin: 0 0 10px;
    padding: 20px;
    overflow: hidden;
    break-inside: avoid;
}
.article-content:hover {
    background-color: hsl(0, 0%, 4%) !important;
}
.article-content img {
    width: 100%;
    margin-bottom: 10px;
}

@media (max-width: 1200px) {
    .article-container {
        columns: 3;
    }
}

@media (max-width: 768px) {
    .article-container {
        columns: 2;
    }
}
@media (max-width: 480px) {
    .article-container {
        columns: 1;
    }
}


.search-input {
    background-color: hsl(0, 0%, 14%) !important;
    color: whitesmoke;
}

.search-input::placeholder {
   color: hsl(0, 0%, 71%);
}

.empty-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
  filter: invert(70%);
}






</style>
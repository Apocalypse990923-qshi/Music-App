<template>
<v-sheet
    class="mx-auto"
    style="padding-bottom:100px;"
>
  <v-toolbar>
    <v-btn icon style="margin-right:20px;" @click="goBack">
        <svg-icon type="mdi" :path="backIconPath"></svg-icon>
    </v-btn>
    <span style="font-size:20pt;">{{user}}'s Library</span>
  </v-toolbar>
<v-banner shaped>
  <span style="font-size:15pt;">Albums</span>
</v-banner>
<v-slide-group
      v-model="model"
      active-class="success"
      show-arrows
    >
    <v-slide-item
        v-for="album in albums"
        :key="album.pid"
        class="album"
    >
        <v-card
            class="ma-4"
            height="300"
            width="250"
            @click="openAlbum(album)"
        >
            <div class="text-center text-truncate" style="margin:auto;">{{ album.name }}</div>
            <v-card-actions class="d-flex flex-column align-center">
                <v-img :src="`http://127.0.0.1:3000/image/${album.pid}.jpg`" alt="Album cover" height="200" width="200"/>
                <v-btn @click.stop="playAlbum(album,0)" style="margin-top:15px;">
                    <svg-icon type="mdi" :path="playIconPath"></svg-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-slide-item>
</v-slide-group>
<v-btn
    color="primary"
    elevation="5"
    x-large
    style="margin:20px;"
    @click="goBack()"
  >Explore</v-btn>
<v-divider></v-divider>

<v-banner shaped>
  <span style="font-size:15pt;">Playlists</span>
</v-banner>

<v-slide-group
      v-model="model"
      active-class="success"
      show-arrows
    >
    <v-slide-item
        v-for="playlist in playlists"
        :key="playlist.pid"
        class="album"
    >
        <v-card
            class="ma-4"
            height="300"
            width="250"
            @click="openAlbum(playlist)"
        >
            <div class="text-center text-truncate" style="margin:auto;">{{ playlist.name }}</div>
            <v-card-actions class="d-flex flex-column align-center">
                <v-img src='http://127.0.0.1:3000/image/default_playlist_image.jpg' alt="Album cover" height="200" width="200"/>
                <v-btn @click.stop="playAlbum(playlist,0)" style="margin-top:15px;">
                    <svg-icon type="mdi" :path="playIconPath"></svg-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-slide-item>
</v-slide-group>
<v-dialog
      v-model="dialog"
      width="500"
>
  <template v-slot:activator="{ on, attrs }">
    <v-btn
      color="primary"
      elevation="5"
      v-bind="attrs"
      v-on="on"
      x-large
      style="margin:20px;"
    >Create</v-btn>
  </template>
  <v-card>
        <v-card-title class="text-h5">
          Name the new Playlist
        </v-card-title>
        <v-text-field
          v-model="playlistName"
          label="name"
          required
          style="margin-left:25px;margin-right:25px;"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false;createPlaylist()"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
</v-dialog>
<v-snackbar
      v-model="snackbar"
      :timeout=2000
  >
      {{ snackbarMsg }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
  </v-snackbar>
</v-sheet>
</template>

<script>
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPlay, mdiPause, mdiArrowLeft } from '@mdi/js';

export default {
  name: 'LibraryView',

  computed: {
    user() {
      return this.$store.state.user.name;
    },
  },

  components: {
    SvgIcon,
  },

  props: ['id'],

  data() {
    return {
      snackbar: false,
      snackbarMsg: 'this is sanckbar message',
      dialog: false,
      backIconPath: mdiArrowLeft,
      playIconPath: mdiPlay,
      pauseIconPath: mdiPause,
      albums: null,
      playlists: null,
    };
  },
  methods: {
    fetchUserLibrary() {
      axios
        .get(`http://127.0.0.1:3000/user/${this.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          this.albums = response.data.albums;
          console.log(this.albums);
          this.playlists = response.data.playlists;
          console.log(this.playlists);
        })
        .catch((error) => console.error(error));
    },
    playAlbum(album, order) { // play the track of the corresponding order in the album
      const albumId = album.pid;
      console.log('Start to play album:', albumId, 'with order:', order);
      this.$store.commit('setCurAlbum', album);
      this.$store.commit('setCurOrder', order);
      const url = `http://127.0.0.1:3000/getTrackByOrder/?album_id=${albumId}&order=${order}`;
      axios
        .get(url)
        .then((response) => {
          this.$store.commit('setCurTrack', response.data);
          console.log('Got TrackInfo:', this.$store.state.curTrack);
        })
        .catch((error) => console.error(error));
    },
    openAlbum(album) {
      if (album.type === 'playlist') {
        this.$router.push({ name: 'playlist', params: { id: album.pid, playlistInfo: album } });
        return;
      }
      this.$router.push({ name: 'album', params: { id: album.pid, albumInfo: album } });
    },
    goBack() {
      this.$router.push('/explore');
    },
    createPlaylist() {
      // console.log('Create new Playlist!', this.playlistName);
      axios
        .post(`http://127.0.0.1:3000/playlist/?user_id=${this.$store.state.user.uid}&name=${this.playlistName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data.status === 0) {
            console.log('Created new playlist in User Library Success');
            this.snackbarMsg = 'Created new playlist in User Library Success';
            this.snackbar = true;
          }
        })
        .catch((error) => console.error(error));
    },
  },
  mounted() {
    this.fetchUserLibrary();
  },
};
</script>

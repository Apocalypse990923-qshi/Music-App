<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <svg-icon type="mdi" :path="musicIconPath"></svg-icon>
        <span class="mr-2">Music</span>
      </div>
      <v-spacer></v-spacer>
      <router-link to="/login" v-if="!loginFlag">
        <v-btn>
          <span class="mr-2">Login / Sign up</span>
        </v-btn>
      </router-link>
      <span class="mr-2" v-if="loginFlag">Welcome! {{user}}</span>
      <v-btn @click="logout()" v-if="loginFlag" icon>
        <svg-icon type="mdi" :path="logoutIconPath"></svg-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <div style="position: fixed; bottom: 0; width: 100%;">
        <v-audio-player
            :src="musicSrc"
            :track-title="trackTitle"
            :track-subtitle="trackSubtitle"
            allow-previous
            allow-next
            :compact="$vuetify.breakpoint.smAndDown"
            :autoplay="false"
            :album-art="albumImg"
            @next-audio="nextSrc()"
            @previous-audio="prevSrc()"
            prev-track-icon="mdi-skip-previous"
            next-track-icon="mdi-skip-next"
            back-forward-icon="mdi-rewind-5"
            fast-forward-icon="fast-forward-5"
            play-icon="mdi-play"
            pause-icon="mdi-pause"
            mute-volume-icon="mdi-volume-off"
            low-volume-icon="mdi-volume-low"
            medium-volume-icon="mdi-volume-medium"
            high-volume-icon="mdi-volume-high"
        ></v-audio-player>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLogout, mdiMusic } from '@mdi/js';

export default {
  name: 'App',

  components: {
    SvgIcon,
    VAudioPlayer: () => import('@woodydark/vuetify-audio-player'),
  },

  data: () => ({
    logoutIconPath: mdiLogout,
    musicIconPath: mdiMusic,
  }),

  computed: {
    user() {
      return this.$store.state.user.name;
    },
    loginFlag() {
      return this.$store.state.loginFlag;
    },
    musicSrc() {
      if (this.$store.state.curTrack) {
        return `http://127.0.0.1:3000/stream/${this.$store.state.curTrack.track_id}`;
      }
      return null;
    },
    trackTitle() {
      if (this.$store.state.curTrack) {
        return this.$store.state.curTrack.title;
      }
      return null;
    },
    trackSubtitle() {
      if (this.$store.state.curTrack) {
        return this.$store.state.curTrack.artist.join(', ');
      }
      return null;
    },
    albumImg() {
      if (this.$store.state.curTrack) {
        return `http://127.0.0.1:3000/image/${this.$store.state.curTrack.album_id}.jpg`;
      }
      return null;
    },
  },

  methods: {
    logout() {
      this.$store.commit('setUser', null);
      this.$store.commit('setLoginFlag', false);
      this.$router.push('/login');
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
    nextSrc() {
      console.log('Received request to next song ', 'curOrder:', this.$store.state.curOrder, 'curAlbum:', this.$store.state.curAlbum.name);
      if (this.$store.state.curOrder != null && this.$store.state.curAlbum) {
        const newOrder = (this.$store.state.curOrder + 1) % this.$store.state.curAlbum.added;
        console.log('go to next order:', newOrder);
        this.playAlbum(this.$store.state.curAlbum, newOrder);
      }
    },
    prevSrc() {
      console.log('Received request to previous song');
      if (this.$store.state.curOrder != null && this.$store.state.curAlbum) {
        // eslint-disable-next-line max-len
        const newOrder = (this.$store.state.curOrder + this.$store.state.curAlbum.added - 1) % this.$store.state.curAlbum.added;
        console.log(' go to previous order:', newOrder);
        this.playAlbum(this.$store.state.curAlbum, newOrder);
      }
    },
  },
};
</script>

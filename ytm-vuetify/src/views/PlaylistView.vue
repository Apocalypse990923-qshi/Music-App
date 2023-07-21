<template>
  <v-card
    color="grey lighten-4"
    flat
    tile
  >
    <v-toolbar
    >
      <v-btn icon style="margin-right:20px;" @click="goBack">
        <svg-icon type="mdi" :path="backIconPath"></svg-icon>
      </v-btn>
      <v-toolbar-title style="margin-left:20px;">{{playlistInfo.name}}</v-toolbar-title>
      <v-card-text style="width: auto;">{{tracks.length}} songs</v-card-text>
      <v-spacer></v-spacer>

      <v-btn @click="likePlaylist()" icon>
        <v-icon v-if="!ifLiked">mdi-heart-outline</v-icon>
        <v-icon v-if="ifLiked">mdi-heart</v-icon>
      </v-btn>

    </v-toolbar>

    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">
            #
          </th>
          <th class="text-center">
            Name
          </th>
          <th class="text-center">
            Artists
          </th>
          <th class="text-center">
            Album
          </th>
          <th class="text-center">
            Duration
          </th>
          <th class="text-center">
            Liked
          </th>
          <th class="text-center">
            Play
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(track, index) in tracks"
          :key="track.track_id"
        >
          <td class="text-center">{{ index+1 }}</td>
          <td class="text-center">{{ track.title }}</td>
          <td class="text-center">{{ track.artist.join(', ') }}</td>
          <td class="text-center">{{ track.album }}</td>
          <td class="text-center">{{ getDuration(track.length) }}</td>
          <td class="text-center">
            <v-btn @click.stop="likeTrack(track.track_id)" icon>
              <v-icon v-if="!ifTrackLiked[track.track_id]">mdi-heart-outline</v-icon>
              <v-icon v-else>mdi-heart</v-icon>
            </v-btn>
          </td>
          <td class="text-center">
            <v-btn @click="playAlbum(playlistInfo, index)" icon>
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>

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

  </v-card>
</template>

<script>
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft } from '@mdi/js';

export default {
  name: 'PlaylistView',

  components: {
    SvgIcon,
  },

  props: ['id', 'playlistInfo'],

  data() {
    return {
      snackbar: false,
      snackbarMsg: 'this is sanckbar message',
      backIconPath: mdiArrowLeft,
      tracks: [],
      userPlaylists: [],
      ifLiked: false,
      ifTrackLiked: {},
    };
  },
  methods: {
    isInUserLibrary() {
      if (this.$store.state.user) {
        axios
          .get(`http://127.0.0.1:3000/user/${this.$store.state.user.uid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((response) => {
            this.userAlbums = response.data.albums;
            console.log('Fetch user albums:', this.userAlbums);
            this.userPlaylists = response.data.playlists;
            console.log('Fetch user playlists', this.userPlaylists);
            for (let i = 0; i < this.userPlaylists.length; i += 1) {
              if (this.userPlaylists[i].pid === this.id) {
                this.ifLiked = true;
                break;
              }
            }
          })
          .catch((error) => console.error(error));
      }
    },
    likePlaylist() {
      if (this.ifLiked) {
        axios
          .delete(`http://127.0.0.1:3000/playlist/?user_id=${this.$store.state.user.uid}&pid=${this.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data.msg);
              this.ifLiked = false;
              this.snackbarMsg = response.data.msg;
              this.snackbar = true;
            }
          })
          .catch((error) => console.error(error));
      } else {
        axios
          .put(`http://127.0.0.1:3000/playlist/?user_id=${this.$store.state.user.uid}&pid=${this.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data.msg);
              this.ifLiked = true;
              this.snackbarMsg = response.data.msg;
              this.snackbar = true;
            }
          })
          .catch((error) => console.error(error));
      }
    },
    likeTrack(tid) {
      if (this.ifTrackLiked[tid]) { // track in the playlist
        axios
          .delete(`http://127.0.0.1:3000/track/?user_id=${this.$store.state.user.uid}&pid=${this.id}&tid=${tid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((response) => {
            if (response.status === 200 && response.data.status === 0) {
              this.snackbarMsg = response.data.msg;
              this.snackbar = true;
              // this.ifTrackLiked[index] = false;
              this.ifTrackLiked = { ...this.ifTrackLiked, [tid]: false };
              console.log(response.data.msg, this.ifTrackLiked);
            }
          })
          .catch((error) => console.error(error));
      } else { // track not in the playlist
        axios
          .put(`http://127.0.0.1:3000/track/?user_id=${this.$store.state.user.uid}&pid=${this.id}&tid=${tid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((response) => {
            if (response.status === 200 && response.data.status === 0) {
              this.snackbarMsg = response.data.msg;
              this.snackbar = true;
              // this.ifTrackLiked[index] = true;
              this.ifTrackLiked = { ...this.ifTrackLiked, [tid]: true };
              console.log(response.data.msg, this.ifTrackLiked);
            }
          })
          .catch((error) => console.error(error));
      }
    },
    fetchTracks() {
      axios
        .get(`http://127.0.0.1:3000/getTracksByOrder/${this.id}`)
        .then((response) => {
          this.tracks = response.data;
          console.log('fetch Tracks:', this.tracks);
          for (let i = 0; i < this.tracks.length; i += 1) {
            // this.ifTrackLiked.push(true);
            this.ifTrackLiked = { ...this.ifTrackLiked, [this.tracks[i].track_id]: true };
          }
          console.log('ifTrackLiked object:', this.ifTrackLiked);
        })
        .catch((error) => console.error(error));
    },
    getDuration(time) {
      let seconds = Math.round(time);
      const minutes = Math.floor(seconds / 60);
      seconds %= 60;
      const paddedSeconds = seconds.toString().padStart(2, '0');
      return `${minutes}:${paddedSeconds}`;
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
    goBack() {
      this.$router.push('/explore');
    },
  },
  mounted() {
    this.isInUserLibrary();
    this.fetchTracks();
  },
};
</script>

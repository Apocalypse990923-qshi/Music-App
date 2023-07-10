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
      <v-avatar>
        <v-img
          :src="`http://127.0.0.1:3000/image/${albumInfo.pid}.jpg`"
          alt="Album cover"
        />
      </v-avatar>
      <v-toolbar-title style="margin-left:20px;">{{albumInfo.name}}</v-toolbar-title>
      <v-card-text style="width: auto;">{{tracks.length}} songs</v-card-text>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
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
            <v-btn icon>
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
          </td>
          <td class="text-center">
            <v-btn @click="playAlbum(albumInfo, index)" icon>
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>

  </v-card>
</template>

<script>
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft } from '@mdi/js';

export default {
  name: 'AlbumView',

  components: {
    SvgIcon,
  },

  props: ['id', 'albumInfo'],

  data() {
    return {
      backIconPath: mdiArrowLeft,
      tracks: [],
    };
  },
  methods: {
    fetchTracks() {
      axios
        .get(`http://127.0.0.1:3000/getTracksByOrder/${this.id}`)
        .then((response) => {
          this.tracks = response.data;
          console.log(this.tracks);
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
    this.fetchTracks();
  },
};
</script>

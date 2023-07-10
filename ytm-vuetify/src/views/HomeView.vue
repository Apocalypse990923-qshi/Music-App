<template>
  <v-content>
    <hello-world />
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
  </v-content>
</template>

<script>
import HelloWorld from '../components/HelloWorld.vue';

export default {
  name: 'HomeView',

  components: {
    HelloWorld,
    VAudioPlayer: () => import('@woodydark/vuetify-audio-player'),
  },

  data: () => ({
    trackId: 'b0b1ebb6b5113c27',
    musicSrc: 'http://localhost:3000/stream/b0b1ebb6b5113c27',
    trackTitle: 'Your Music Title',
    trackSubtitle: 'Your Music Subtitle',
    albumImg: 'The url of the album image',
  }),

  methods: {
    nextSrc() {
      //
    },
    prevSrc() {
      // implement logic for the previous audio source here
    },
  },
};
</script>

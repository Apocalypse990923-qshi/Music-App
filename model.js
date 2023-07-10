import mongoose from 'mongoose';
mongoose.connect('mongodb://127.0.0.1:27017/musicAppDatabase');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB connection succeed!");
});

const Schema = mongoose.Schema;

  // Library schema
  const LibrarySchema = new Schema({
    track_id: String,
    title: String,
    artist: [String],
    album: String,
    album_id: String,
    genre: String,
    copyright: String,
    length: Number,
    track_number: Number,
    quality: String,
    file: String
  });

  // User schema
  const UserSchema = new Schema({
    uid: String,
    name: String,
    secret: String,
    subscribe: String,
    subscribe_expired: Date,
    last_login: Date,
    playing: String
  });

  // User's private Library schema
  const UserLibrarySchema = new Schema({
    type: String,
    id: String,
    added_date: Date
  });

  // Playlist index schema
  const PlaylistIndexSchema = new Schema({
    pid: String,
    author: String,
    name: String,
    description: String,
    added: Number,
    liked: Number,
    shared: Number,
    played: Number,
    public: Boolean,
    image: String,
    type: String,
    last_update: Date
  });

  // Single playlist schema
  const SinglePlaylistSchema = new Schema({
    tid: String,
    order: Number
  });

const Library = mongoose.model('Library', LibrarySchema);
const User = mongoose.model('User', UserSchema);
// const UserLibrary = mongoose.model('UserLibrary', UserLibrarySchema);
const PlaylistIndex = mongoose.model('PlaylistIndex', PlaylistIndexSchema);
// const SinglePlaylist = mongoose.model('SinglePlaylist', SinglePlaylistSchema);
export { Library, User, PlaylistIndex, SinglePlaylistSchema, UserLibrarySchema };

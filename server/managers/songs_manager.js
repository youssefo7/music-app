const { FileSystemManager } = require("./file_system_manager");
const path = require("path");

class SongsManager {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
  }

  /**
   * Retourne la liste de toutes les chansons
   * @returns {Promise<Array>}
   */
  async getAllSongs () {
    const fileBuffer = await this.fileSystemManager.readFile(this.JSON_PATH);
    return JSON.parse(fileBuffer).songs;
  }

  /**
   * DONE : Implémenter la récupération d'une chanson en fonction de son id
   * Retourne une chanson en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns chanson correspondant à l'id
   */
  async getSongById (id) {
    const songs = await this.getAllSongs();
    return songs.find(song => song.id === id);
  }

  /**
   * DONE : Implémenter l'inversement de l'état aimé d'une chanson
   * Modifie l'état aimé d'une chanson par l'état inverse
   * @param {number} id identifiant de la chanson
   * @returns {boolean} le nouveau état aimé de la chanson
   */
  async updateSongLike (id) {
    const allSongs = await this.getAllSongs();
    const songsTodelete = allSongs.find((song) => song.id === id);
    let changedSong=await this.getSongById(id);
    changedSong.liked=!changedSong.liked;
    console.log(changedSong);
    if (songsTodelete) {
      const songs = allSongs.filter((song) => song.id !== id);
      songs.push(changedSong);
      const songsToSave = JSON.stringify({ songs }, null, 2);
      await this.fileSystemManager.writeToJsonFile(this.JSON_PATH, songsToSave);
    }
    return changedSong.liked;

  }
}

module.exports = { SongsManager };

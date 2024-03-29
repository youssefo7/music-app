import { SERVER_URL } from "./consts.js";

export const HTTPInterface = {
  SERVER_URL: `${SERVER_URL}/api`,

  GET: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`);
    return await response.json();
  },

  POST: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "DELETE",
    });
    return response.status;
  },

  PATCH: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
    });
    return response.status;
  },

  PUT: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        // to be removed
        "content-type": "application/json",
      },
    });
    return response.status;
  },
};

export default class HTTPManager {
  constructor () {
    this.songs = {};
    this.playlists = {};
    this.songsBaseURL = "songs";
    this.songFileBaseURL = "player";
    this.playlistBaseURL = "playlists";
    this.songPlayer = "player";
    this.searchBaseURL = "search";
  }

  /**
   * DONE : implémenter la requête vers le serveur
   * Récupère et retourne toutes les chansons du serveur
   * @returns {Promise} Liste des chansons
   */
  async fetchAllSongs () {
    const songs = HTTPInterface.GET(`${this.songsBaseURL}`);
    return songs;
  }

  /**
   * DONE : implémenter la requête vers le serveur
   * Récupère et retourne toutes les playlists du serveur
   * @returns {Promise} Liste des playlists
   */
  async fetchAllPlaylists () {
    const playlists = HTTPInterface.GET(`${this.playlistBaseURL}`);
    return playlists;
  }

  /**
   * DONE : implémenter la requête vers le serveur
   * Récupère et retourne une chanson du serveur en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns {Promise} une chanson
   */
  async fetchSong (id) {
    const song = HTTPInterface.GET(`${this.songsBaseURL}/${id}`);// { id: -1 };
    return song;
  }

  /**
   * Récupère et retourne un fichier de musique (Blob) du serveur en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns {Promise} un URL qui représente le fichier de musique
   */
  async getSongURLFromId (id) {
    const songBlob = await fetch(`${HTTPInterface.SERVER_URL}/${this.songsBaseURL}/${this.songFileBaseURL}/${id}`);
    const url = URL.createObjectURL(await songBlob.blob());
    return url;
  }

  /**
   * DONE : implémenter la requête vers le serveur
   * Effectue une recherche de mot clé sur le serveur et retourne le résultat
   * Les paramètres sont envoyés dans la query de la requête HTTP sous le format suivant :
   * search_query=query&exact=exact
   * Si exact = true, la recherche est sensible à la case
   * @param {string} query mot clé à rechercher
   * @param {boolean} exact flag qui indique si la recherche est sensible à la case ou non
   * @returns{{playlist: [], songs:[]}} le résultat de la recherche sous la forme d'un objet {playlists : [], songs: []}
   * ou les 2 attributs sont des tableaux avec les playlists et les chansons qui correspondent à la recherche
   */
  async search (query, exact) {
    const searchResults = HTTPInterface.GET(`search?search_query=${query}&exact=${exact}`);// { playlists: [], songs: [] };
    return searchResults;
  }

  /**
   * @returns {Promise} Liste des chansons
   */
  async getAllSongs () {
    const songsPromises = new Promise((resolve, reject) => {
      try {
        const songs = this.fetchAllSongs();
        resolve(songs);
      } catch (err) {
        reject("Échec lors de la requête GET /api/songs");
      }
    });

    const songsReceived = Promise.resolve(songsPromises);
    return songsReceived;
  }

  /**
   * @returns {Promise} Liste des playlists
   */
  async getAllPlaylists () {
    const playlistsPromises = new Promise((resolve, reject) => {
      try {
        const playlists = this.fetchAllPlaylists();
        resolve(playlists);
      } catch (err) {
        reject("Échec lors de la requête GET /api/playlists");
      }
    });

    const playlistsReceived = Promise.resolve(playlistsPromises);
    return playlistsReceived;
  }

  /**
   * DONE : implémenter la requête vers le serveur
   * Récupère et retourne une playlist du serveur en fonction de son id
   * @param {number} id Id de la playlist
   * @returns {Promise} Playlist correspondant à l'id
   */
  async getPlaylistById (id) {
    try {
      const playlist = HTTPInterface.GET(`${this.playlistBaseURL}/${id}`);
      return playlist;
    } catch (err) {
      window.alert(err);
    }
  }

  /**
   * DONE : implémenter la requête vers le serveur
   * Ajoute une nouvelle playlist sur le serveur à travers une requête
   * @param {Object} playlist playlist à envoyer au serveur
   */
  async addNewPlaylist (playlist) {
    try {
      await Promise.resolve(playlist);
      HTTPInterface.POST(`${this.playlistBaseURL}`, playlist);
    } catch (err) {
      window.alert("An error has occured while adding a new playlist", err);
    }
  }

  /**
   * DONE : Implémenter la requête vers le serveur
   * Modifie une playlist en envoyant un objet avec les nouvelles valeurs au serveur
   * @param {Object} playlist playlist à envoyer au serveur
   */
  async updatePlaylist (playlist) {
    try {
      await Promise.resolve(playlist);
      HTTPInterface.PUT(`${this.playlistBaseURL}/${playlist.id}`, playlist);
    } catch (err) {
      window.alert("An error has occured while adding a new playlist", err);
    }
  }

  /**
   * DONE : Implémenter la requête vers le serveur
   * Supprime une playlist sur le serveur à travers une requête
   * @param {string} id identifiant de la playlist à supprimer
   */
  async deletePlaylist (id) {
    try {
      await Promise.resolve(id);
      HTTPInterface.DELETE(`${this.playlistBaseURL}/${id}`);
    } catch (err) {
      window.alert("An error has occured while deleting a playlist", err);
    }
  }

  /**
   * Modifie l'état aimé d'une chanson
   * @param {number} id identifiant de la chanson à modifier
   */
  async updateSong (id) {
    try {
      await HTTPInterface.PATCH(`${this.songsBaseURL}/${id}/like`);
    } catch (err) {
      window.alert("An error has occured while trying to change a song status", err);
    }
  }
}

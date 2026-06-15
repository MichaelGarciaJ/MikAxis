import { db } from '../../config/firebase';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot, updateDoc } from "firebase/firestore";
import { MediaEntity } from '../entity/media';

export type LibraryStatus = "watched" | "pending" | "watching" | "none";

/**
 * Servicio encargado de la persistencia de datos (películas/series guardadas, episodios vistos)
 * en Firebase Firestore.
 */
export const mediaService = {
    /**
     * Suscribe y obtiene en tiempo real la biblioteca de medios de un usuario.
     * @param userId - ID único del usuario autenticado
     * @param callback - Función que recibe la data actualizada
     * @returns Función para cancelar la suscripción (unsubscribe)
     */
    getMediaLibrary(userId: string, callback: (data: MediaEntity[]) => void): () => void {
        const q = query(collection(db, "user_library"), where("userId", "==", userId));
        return onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.data().tmdbId || doc.id } as MediaEntity));
            callback(items);
        }, error => console.error("[ERROR] getMediaLibrary:", error));
    },

    /**
     * Actualiza el estado (status) de un contenido en la biblioteca.
     * @param docId - ID del documento en Firestore (formato: userId_tmdbId)
     * @param newStatus - Nuevo estado ('watched', 'pending', etc.)
     */
    async updateMediaStatus(docId: string, newStatus: MediaEntity['status']): Promise<void> {
        try {
            await updateDoc(doc(db, "user_library", docId), { status: newStatus, updatedAt: serverTimestamp() });
        } catch (error) {
            console.error("[ERROR] updateMediaStatus:", error);
            throw error;
        }
    },

    /**
     * Guarda una película o serie en la biblioteca del usuario, o la actualiza si ya existe.
     * @param userId - ID del usuario
     * @param tmdbMedia - Objeto de medios obtenido de TMDB
     * @param status - Estado inicial a guardar
     */
    async saveToLibrary(userId: string, tmdbMedia: Partial<MediaEntity>, status: LibraryStatus): Promise<void> {
        try {
            const docId = `${userId}_${tmdbMedia.id}`;
            await setDoc(doc(db, "user_library", docId), {
                userId,
                tmdbId: tmdbMedia.id,
                title: tmdbMedia.title,
                type: tmdbMedia.type,
                imageUrl: tmdbMedia.imageUrl,
                status: status,
                updatedAt: serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("[ERROR] saveToLibrary:", error);
            throw error;
        }
    },

    /**
     * Obtiene el estado actual (si está en biblioteca) y la lista de episodios vistos de un medio.
     * @param userId - ID del usuario
     * @param tmdbId - ID del contenido en TMDB
     * @returns Objeto con el estado de biblioteca y un Set de los IDs de los episodios vistos
     */
    async getMediaStatus(userId: string, tmdbId: string): Promise<{ status: LibraryStatus, watchedEpisodes: Set<number> }> {
        if (!userId) return { status: 'none', watchedEpisodes: new Set() };
        try {
            const docId = `${userId}_${tmdbId}`;
            const mediaDoc = await getDoc(doc(db, "user_library", docId));
            if (!mediaDoc.exists()) return { status: 'none', watchedEpisodes: new Set() };

            const status = mediaDoc.data().status as LibraryStatus;
            const watchedEpisodes = new Set<number>();
            const epsSnapshot = await getDocs(collection(db, "user_library", docId, "watched_episodes"));
            epsSnapshot.forEach(doc => watchedEpisodes.add(parseInt(doc.id)));

            return { status, watchedEpisodes };
        } catch (error) {
            console.error("[ERROR] getMediaStatus:", error);
            return { status: 'none', watchedEpisodes: new Set() };
        }
    },

    /**
     * Elimina completamente un contenido (y todos sus episodios vistos) de la biblioteca del usuario.
     * @param userId - ID del usuario
     * @param tmdbId - ID del contenido en TMDB
     */
    async removeFromLibrary(userId: string, tmdbId: string): Promise<void> {
        try {
            const docId = `${userId}_${tmdbId}`;
            const seriesRef = doc(db, "user_library", docId);
            const epsRef = collection(db, "user_library", docId, "watched_episodes");
            const snapshot = await getDocs(epsRef);
            await Promise.all(snapshot.docs.map(episodeDoc => deleteDoc(episodeDoc.ref)));
            await deleteDoc(seriesRef);
        } catch (error) {
            console.error("[ERROR] removeFromLibrary:", error);
            throw error;
        }
    },

    /**
     * Marca o desmarca un episodio específico como visto para un contenido de tipo TV.
     * Si el contenido no estaba en la biblioteca, lo añade como 'watching'.
     * @param userId - ID del usuario
     * @param tmdbId - ID de la serie en TMDB
     * @param episodeId - ID del episodio en TMDB
     * @param isWatched - Si debe marcarse como visto (true) o desmarcarse (false)
     * @param mediaInfo - Información base de la serie (por si es la primera vez que se guarda)
     */
    async toggleEpisodeWatched(userId: string, tmdbId: string, episodeId: number, isWatched: boolean, mediaInfo: Partial<MediaEntity>): Promise<void> {
        if (!userId) return;
        try {
            const docId = `${userId}_${tmdbId}`;
            const seriesRef = doc(db, "user_library", docId);
            const epRef = doc(db, "user_library", docId, "watched_episodes", episodeId.toString());

            if (isWatched) {
                if (mediaInfo) {
                    const seriesDoc = await getDoc(seriesRef);
                    const currentStatus = seriesDoc.exists() ? seriesDoc.data().status : 'none';
                    const newStatus = (currentStatus === 'watched') ? 'watched' : 'watching';

                    await setDoc(seriesRef, {
                        userId,
                        tmdbId: mediaInfo.id,
                        title: mediaInfo.title,
                        type: mediaInfo.type,
                        imageUrl: mediaInfo.imageUrl,
                        status: newStatus,
                        updatedAt: serverTimestamp(),
                    }, { merge: true });
                }
                await setDoc(epRef, { episodeId, watchedAt: serverTimestamp() });
            } else {
                await deleteDoc(epRef);
            }
        } catch (error) {
            console.error("[ERROR] toggleEpisodeWatched:", error);
        }
    },

    async getWatchingList(userId: string): Promise<Partial<MediaEntity>[]> {
        if (!userId) return [];
        try {
            const q = query(collection(db, "user_library"), where("userId", "==", userId), where("status", "==", "watching"), orderBy("updatedAt", "desc"), limit(20));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.data().tmdbId || doc.id } as Partial<MediaEntity>));
        } catch (error) {
            console.error("[ERROR] getWatchingList:", error);
            return [];
        }
    },

    async getUserLibrary(userId: string): Promise<Partial<MediaEntity>[]> {
        if (!userId) return [];
        try {
            const q = query(collection(db, "user_library"), where("userId", "==", userId), orderBy("updatedAt", "desc"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.data().tmdbId || doc.id } as Partial<MediaEntity>));
        } catch (error) {
            console.error("[ERROR] getUserLibrary:", error);
            return [];
        }
    }
};

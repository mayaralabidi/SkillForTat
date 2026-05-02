import { create } from "zustand";
import api, { getApiErrorMessage } from "../api";

const useMatchStore = create((set, get) => ({
  offers: [],
  myOffers: [],
  matches: [],
  messagesByMatch: {},
  loading: false,
  error: null,
  fetchOffers: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.get("/offers");
      set({ offers: data, loading: false });
      return data;
    } catch (error) {
      set({ loading: false, error: getApiErrorMessage(error) });
      throw error;
    }
  },
  fetchMyOffers: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.get("/offers/mine");
      set({ myOffers: data, loading: false });
      return data;
    } catch (error) {
      set({ loading: false, error: getApiErrorMessage(error) });
      throw error;
    }
  },
  createOffer: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.post("/offers", payload);
      const refreshed = await Promise.all([
        get().fetchOffers(),
        get().fetchMyOffers(),
      ]);
      set({ loading: false });
      return { created: data.offer, refreshed };
    } catch (error) {
      set({ loading: false, error: getApiErrorMessage(error) });
      throw error;
    }
  },
  updateOffer: async (id, payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.patch(`/offers/${id}`, payload);
      set((state) => ({
        loading: false,
        myOffers: state.myOffers.map((offer) =>
          offer.id === id ? data : offer,
        ),
        offers: state.offers.map((offer) => (offer.id === id ? data : offer)),
      }));
      return data;
    } catch (error) {
      set({ loading: false, error: getApiErrorMessage(error) });
      throw error;
    }
  },
  deleteOffer: async (id) => {
    set({ loading: true, error: null });

    try {
      await api.delete(`/offers/${id}`);
      set((state) => ({
        loading: false,
        myOffers: state.myOffers.filter((offer) => offer.id !== id),
        offers: state.offers.filter((offer) => offer.id !== id),
      }));
    } catch (error) {
      set({ loading: false, error: getApiErrorMessage(error) });
      throw error;
    }
  },
  fetchMatches: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.get("/matches");
      set({ matches: data, loading: false });
      return data;
    } catch (error) {
      set({ loading: false, error: getApiErrorMessage(error) });
      throw error;
    }
  },
  acceptMatch: async (id) => {
    await api.post(`/matches/${id}/accept`);
    await get().fetchMatches();
  },
  declineMatch: async (id) => {
    await api.post(`/matches/${id}/decline`);
    await get().fetchMatches();
  },
  fetchMessages: async (matchId) => {
    set({ loading: true, error: null });

    try {
      const { data } = await api.get(`/messages/${matchId}`);
      set((state) => ({
        loading: false,
        messagesByMatch: {
          ...state.messagesByMatch,
          [matchId]: data,
        },
      }));
      return data;
    } catch (error) {
      set({ loading: false, error: getApiErrorMessage(error) });
      throw error;
    }
  },
  appendMessage: (matchId, message) => {
    set((state) => ({
      messagesByMatch: {
        ...state.messagesByMatch,
        [matchId]: [...(state.messagesByMatch[matchId] || []), message],
      },
    }));
  },
}));

export default useMatchStore;

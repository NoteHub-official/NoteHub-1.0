import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import http from "@/includes/http";

export default {
  state: {
    isAuthenticated: false,
    currentUser: null,
  },
  getters: {
    currentUser: (state) => {
      return state.currentUser;
    },
  },
  mutations: {
    toggleAuth: (state, isAuthenticated) => {
      state.isAuthenticated = isAuthenticated;
    },
    setUser: (state, user) => {
      state.currentUser = user;
    },
  },
  actions: {
    async signup({ commit }, payload) {
      const { email, password, firstName, lastName } = payload;
      try {
        // insert a new user into Database
        await http.post("user/insert-user/", {
          email,
          firstName,
          lastName,
        });
        // Firebase signup
        const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);

        commit("setUser", {
          firstName,
          lastName,
          email,
          avatarUrl: null,
          subtitle: "New User",
          credential: userCredential.user,
        });
        commit("toggleAuth", true);

        return true;
      } catch (e) {
        console.log(e);
      }
      // const idToken = await userCredential.user.getIdToken();
      return false;
    },
    async login({ commit }, payload) {
      const { email, password } = payload;
      try {
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
        const res = await http.get("user/get-user-by-email/", { email });
        const { firstName, lastName, avatarUrl, subtitle } = res.data;
        commit("setUser", {
          firstName,
          lastName,
          email,
          avatarUrl,
          subtitle,
          credential: userCredential.user,
        });
        commit("toggleAuth", true);

        return true;
      } catch (e) {
        console.log(e);
      }
      return false;
    },
    async logout({ commit }, { router, route }) {
      await signOut(getAuth());
      commit("toggleAuth", false);
      console.log(route);
      if (route.meta.requireAuth) {
        router.push({ name: "auth" });
      }
    },
    initialLogin({ commit }) {
      const user = getAuth().currentUser;
      console.log(user);
      if (user) {
        commit("toggleAuth", true);
        commit("setUser", user);
      }
    },
  },
};

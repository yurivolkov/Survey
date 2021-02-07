import store from 'store';
import actions from 'store/actions/auth';

export const getAccount = async () => {
  try {
    const response = await store.dispatch(actions.getAccount());
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (payload) => {
  try {
    const response = await store.dispatch(actions.login(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (payload) => {
  try {
    const response = await store.dispatch(actions.register(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (payload) => {
  try {
    const response = await store.dispatch(actions.forgotPassword(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (payload) => {
  try {
    const response = await store.dispatch(actions.resetPassword(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateState = async (payload) => {
  try {
    const response = await store.dispatch(actions.updateState(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await store.dispatch(actions.logout());
    return response;
  } catch (error) {
    throw error;
  }
};
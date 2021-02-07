import store from 'store';
import i18n from 'i18next';
import actions from 'store/actions/global';

export const getData = async (payload) => {
  try {
    const response = await store.dispatch(actions.getData(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const postData = async (payload) => {
  try {
    const response = await store.dispatch(actions.postData(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const putData = async (payload) => {
  try {
    const response = await store.dispatch(actions.putData(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const patchData = async (payload) => {
  try {
    const response = await store.dispatch(actions.patchData(payload));
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (payload) => {
  try {
    const response = await store.dispatch(actions.deleteData(payload));
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

export const geti18n = async () => {
  try {
    const response = await store.dispatch(actions.getData({ url: 'i18n' }));
    Object.keys(response).forEach(x => {
      i18n.addResources(x, 'translation', response[x]);
    });
    return true;
  } catch (error) {
    throw error;
  }
};
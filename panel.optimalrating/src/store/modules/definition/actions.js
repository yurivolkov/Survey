import * as types from './mutation-types';
import CategoryProxy from '@/proxies/CategoryProxy';
import CountryProxy from '@/proxies/CountryProxy';
import CityProxy from "@/proxies/CityProxy";
import UserProxy from "@/proxies/UserProxy";
import KeywordProxy from "@/proxies/KeywordProxy";
import CommentProxy from "@/proxies/CommentProxy";
import TranslationProxy from "@/proxies/TranslationProxy";
import SubjectProxy from "@/proxies/SubjectProxy";
import SurveyProxy from "@/proxies/SurveyProxy";
import InitProxy from "@/proxies/InitProxy";
import PageProxy from "@/proxies/PageProxy";
import SurveyChoiceProxy from '@/proxies/SurveyChoiceProxy';

//region category
export const getAllCategoryTree = ({ commit }, payload) => {
  return new CategoryProxy(payload && payload.filter ? payload.filter : {})
    .getTree()
    .then((response) => {
      commit(types.SET_DEFINITION, {key: 'categories', data: response.result.set});
      if (response.result.set)
        return response.result.set;
    }).catch((error) => {
    });
};

export const getSelectCategory = ({commit}, payload) => {
  return new CategoryProxy(payload && payload.filter ? payload.filter : {})
    .select()
    .then((response) => {
      return response.result.set;
    })
    .catch((error) => {
      Promise.reject(error);
    });
};

export const createCategory = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CategoryProxy()
      .create(payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateCategory = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CategoryProxy()
      .update(payload.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateCategoryStatus = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CategoryProxy()
      .updateCategoryStatus(payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteCategory = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CategoryProxy()
      .delete(payload.data.id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// endregion

// region country
export const getAllCountries = ({commit}, payload) => {
  return new CountryProxy(payload && payload.filter ? payload.filter : {})
    .all()
    .then((response) => {
      commit(types.SET_DEFINITION, {key: 'countries', data: response.result.set});
      if (response.result.set) return response.result.pagination;
      resolve(response.result.set);
    });
};

export const createCountry = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CountryProxy()
      .create(payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateCountry = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CountryProxy()
      .update(payload.data.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateCountryPassword = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CountryProxy()
      .updateCountryPassword(payload.data.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteCountry = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CountryProxy()
      .destroy(payload.data.id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// endregion

// region cities
export const getAllCities = ({commit}, payload) => {
  let id = payload.filter.id;
  return new CityProxy(payload && payload.filter ? payload.filter : {})
    .getAllCitiesWithCountryId(id)
    .then((response) => {
      commit(types.SET_DEFINITION, {key: 'cities', data: response.result.set});
      if (response.result.set) return response.result.pagination;
      resolve(response.result.set);
    });
};

export const createCity = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CityProxy()
      .create(payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateCity = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CityProxy()
      .update(payload.data.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteCity = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CityProxy()
      .destroy(payload.data.id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// endregion

// region user
export const getAllUsers= ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new UserProxy(payload && payload.filter ? payload.filter : {}).getAllUsers()
      .then((response) => {
   //     commit(types.SET_DEFINITION, {key: 'users', data: response.result.set});
        resolve(response.result);
    });
  });
};

export const getUser = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new UserProxy().getUser(payload.id)
      .then((response) => {
   //     commit(types.SET_DEFINITION, {key: 'users', data: response.result.set});
        resolve(response.result);
    });
  });
};

export const createUser = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CityProxy()
      .create(payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateUser = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new UserProxy()
      .update(payload.data.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteUser = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new UserProxy()
      .destroy(payload.data.id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const upgradeUser = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new UserProxy()
      .patch(payload.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// endregion

// region keyword
export const getAllKeywords = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new KeywordProxy(payload && payload.filter ? payload.filter : {})
      .all()
      .then((response) => {
        commit(types.SET_DEFINITION, {key: 'keywords', data: response.result.set});
        resolve(response.result);
      });
  });
};

// region comment
export const getAllComments = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CommentProxy(payload && payload.filter ? payload.filter : {})
      .all()
      .then((response) => {
        commit(types.SET_DEFINITION, {key: 'comments', data: response.result.set});
        resolve(response.result);
      });
  });
};


export const deleteComment = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CommentProxy()
      .destroy(payload.data.id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// region comment
export const changeCommentStatus = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CommentProxy(payload && payload.filter ? payload.filter : {})
      .update(payload.data.id, payload.data)
      .then((response) => {
        commit(types.SET_DEFINITION, {key: 'comments', data: response.result.set});
        resolve(response.result);
      });
  });
};

export const createKeyword = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new KeywordProxy()
      .create(payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateKeyword = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new KeywordProxy()
      .update(payload.data.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteKeyword = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new KeywordProxy()
      .destroy(payload.data.id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// endregion
export const saveTranslation = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    let model = new TranslationProxy();
    if (payload.mode ==='save') {
      return model.create(payload.data).then((response) => {
        resolve(response);
      })
        .catch((error) => {
          reject(error);
        });
    } else {
      return model.update(payload.data.id, payload.data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

// region user
export const getAllDashboardData = ({commit}) => {
  return new Promise((resolve, reject)=>{
    return new InitProxy({})
      .dashboard()
      .then((response) => {
        // commit(types.SET_DEFINITION, {key: 'waitCategories', data: response.result.set.categories});
        resolve(response.result.set);
      });
  });
};
// endregion

export const getChildren = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new CategoryProxy()
      .getChildren(payload)
      .then((response) => {
        resolve(response.result.set)
        //commit(types.SET_DEFINITION, {key: 'categories', data: response.result.set});
        //if (response.result.set) return response.result.pagination;
      }).catch((error) => {
        reject(error)
      });
  })
}

//region subject
export const getAllSubjects = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SubjectProxy(payload && payload.filter ? payload.filter : {})
      .all()
      .then(response => {
        commit(types.SET_DEFINITION, {key: 'subjects', data: response.result.set});
        resolve(response.result)
      })
  });
};

export const createSubject = ({ commit }, payload) => {

  return new Promise((resolve, reject) => {
    return new SubjectProxy()
      .create(payload.data)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
  });
};

export const updateSubject = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SubjectProxy()
      .update(payload.data.id, payload.data)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
  });
};


export const deleteSubject = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SubjectProxy()
      .destroy(payload.data.id)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
  });
};
//endregion

//region pendingChoices
export const getAllPendingChoices = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy(payload && payload.filter ? payload.filter : {})
      .pendingChoices()
      .then(response => {
        commit(types.SET_DEFINITION, {key: 'pendingChoices', data: response.result.set});
        resolve(response.result)
      })
  });
};
//endregion

//region specialSurvey
export const getAllSpecialSurvey = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy(payload && payload.filter ? payload.filter : {})
      .SpecialSurveyList()
      .then(response => {
        commit(types.SET_DEFINITION, {key: 'specialSurveys', data: response.result.set});
        resolve(response.result)
      })
  });
};
//endregion


//region specialSurvey
export const getAllSurveys = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy(payload && payload.filter ? payload.filter : {})
      .SurveyList()
      .then(response => {
        commit(types.SET_DEFINITION, {key: 'normalSurveys', data: response.result.set});
        resolve(response.result)
      })
  });
};
//endregion

//region saveSpecialSurvey
export const createSpecialSurvey = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy()
      .create(payload.data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateSurveyStatus = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy()
      .updateSurveyStatus(payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateChoiceStatus = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy()
      .updateChoiceStatus(payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateShowOnHome = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy()
      .updateShowOnHome(payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDetailSurvey = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy()
      .find(payload.id)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateSpecialSurvey = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy()
      .update(payload.data.id, payload.data)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
  });
};

export const deleteSpecialSurvey = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy()
      .destroy(payload.data.id)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
  });
};

export const fakeVote = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new SurveyProxy()
      .fakeVote(payload)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
//endregion

export const destroyChoice = ({ commit }, payload) => {
  return new Promise( (resolve, reject ) => {
    return new SurveyChoiceProxy()
      .destroy(payload.data)
      .then( response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

//region pages
export const getAllPages = ({ commit }, payload) => {
  return new PageProxy(payload && payload.filter ? payload.filter : {})
    .all()
    .then((response) => {
      commit(types.SET_DEFINITION, {key: 'pages', data: response.result.set});
      if (response.result.set)
        return response.result.pagination;
    }).catch((error) => {
    });
};



export const createPage = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    return new PageProxy()
      .create(payload.data)
      .then(response => {
        resolve(response)
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updatePage = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new PageProxy()
      .update(payload.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const deletePage = ({ commit }, payload) => {
  return new Promise( (resolve, reject ) => {
    return new PageProxy()
      .destroy(payload.data.id)
      .then( response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const translationPage = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    return new PageProxy()
      .translation(payload.id, payload.data)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
//endregion

// region user
export const specialDateRange = ({commit}) => {
  return new Promise((resolve, reject)=>{
    return new SurveyProxy({})
      .specialDateRange()
      .then((response) => {
        resolve(response.result.set);
      });
  });
};

/**
 *
 * @param commit
 * @param payload
 * @returns {Promise<any>}
 */
export const getData = ({commit}, payload) =>{
  return new Promise((resolve, reject) =>{
    let proxy = new UserProxy();
    proxy.submit('get',`/${payload.url}`)
      .then(response => resolve(response))
      .catch(error => reject(error))
  });
}
// endregion

export const deleteChoices = ({ commit }, payload) => {
  return new Promise( (resolve, reject ) => {
    return new SurveyChoiceProxy()
      .destroy(payload.id)
      .then( response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export default {
  getData,
  getAllCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,

  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  updateCountryPassword,

  getAllCities,
  createCity,
  updateCity,
  deleteCity,

  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  upgradeUser,

  getAllKeywords,
  createKeyword,
  updateKeyword,
  deleteKeyword,

  saveTranslation,
  getAllDashboardData,

  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getChildren,

  getAllSpecialSurvey,
  getAllSurveys,
  getDetailSurvey,
  createSpecialSurvey,
  updateSurveyStatus,
  updateShowOnHome,
  updateSpecialSurvey,
  deleteSpecialSurvey,
  fakeVote,
  updateChoiceStatus,
  getAllPendingChoices,

  getAllComments,
  deleteComment,
  changeCommentStatus,

  destroyChoice,

  getAllPages,
  createPage,
  updatePage,
  deletePage,
  translationPage,
  specialDateRange,


  deleteChoices
};

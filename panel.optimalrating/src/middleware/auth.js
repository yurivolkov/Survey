export default function auth ({ next, store }){
  if(store.state.auth.roles !== 'super_admin'){
    return next({
      name: 'admin.dashboard'
    })
  }
  return next()
}

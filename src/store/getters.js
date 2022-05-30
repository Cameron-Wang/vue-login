const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickName: state => state.user.nickName,
  userName: state => state.user.userName,
  secretKey: state => state.user.secretKey,
  userId: state => state.user.userId,
}
export default getters

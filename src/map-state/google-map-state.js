export default function(state) {
  return {
    message: "This is message from mapStateToProps",
    Tokens: state.token || null,
    GoogleId: state.googleId || null
  };
};

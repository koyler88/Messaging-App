exports.getDashboard = (req, res) => {
  res.json({
    message: "Welcome to the dashboard!",
    user: req.user,
  });
};

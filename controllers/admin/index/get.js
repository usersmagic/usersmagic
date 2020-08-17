module.exports = (req, res) => {
  const error = req.session.error ? req.session.error : null;
  req.session.error = null;

  res.render('admin/dashboard', {
    page: "admin/dashboard",
    title: "Admin",
    includes: {
      external: ["css", "admin_general_css", "fontawesome"]
    },
    error
  });
};

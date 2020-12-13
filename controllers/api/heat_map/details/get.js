const mongoose = require('mongoose');
const validator = require('validator');

const HeatMap = require('../../../../models/heat_map/HeatMap');

module.exports = (req, res) => {
  if (!req.query || !req.query.id || !validator.isMongoId(req.query.id))
    return res.status(400).json({ error: "bad request" });

  HeatMap.findById(mongoose.Types.ObjectId(req.query.id), (err, heat_map) => {
    if (err) return res.status(500).json({ error: "unknown" });
    if (!heat_map) return res.status(404).json({ error: "not found" });

    return res.json(200).json({
      location: heat_map.location,
      time: heat_map.time,
      clicked_objects: heat_map.clicked_objects,
      positions: heat_map.positions,
      mouse_stand_still: heat_map.mouse_stand_still,
      scrolled: heat_map.scrolled,
      browser: heat_map.browser,
      detailed_browser: heat_map.detailed_browser,
      os: heat_map.os,
      plugins: heat_map.plugins,
      coordinates: heat_map.coordinates
    });
  });
}

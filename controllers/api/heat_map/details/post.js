const mongoose = require('mongoose');
const validator = require('validator');

const HeatMap = require('../../../../models/heat_map/HeatMap');
const Test = require('../../../../models/test/Test');

module.exports = (req, res) => {
  if (!req.body || !req.body.test_id || !validator.isMongoId(req.body.test_id))
    return res.status(400).json({ error: "bad request" });

  if (req.body.heat_map_id && req.body.heat_map_id.length && !validator.isMongoId(req.body.heat_map_id))
    return res.status(400).json({ error: "bad request" });

  Test.findById(mongoose.Types.ObjectId(req.body.test_id), (err, test) => {
    if (err) return res.status(500).json({ error: "unknown" });
    if (!test) return res.status(404).json({ error: "not found" });

    if (req.body.heat_map_id && req.body.heat_map_id.length) {
      HeatMap.findById(mongoose.Types.ObjectId(req.body.heat_map_id), (err, heat_map) => {
        if (err) return res.status(500).json({ error: "unknown" });
        if (!heat_map) return res.status(404).json({ error: "not found" });

        HeatMap.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.heat_map_id), {$set: {
          test_id: req.body.test_id,
          location: req.body.location || heat_map.location,
          time: req.body.time || heat_map.time,
          clicked_objects: req.body.clicked_objects || heat_map.clicked_objects,
          positions: req.body.positions || heat_map.positions,
          mouse_stand_still: req.body.mouse_stand_still || heat_map.mouse_stand_still,
          scrolled: req.body.scrolled || heat_map.scrolled,
          browser: req.body.browser || heat_map.browser,
          detailed_browser: req.body.detailed_browser || heat_map.detailed_browser,
          os: req.body.os || heat_map.os,
          plugins: req.body.plugins || heat_map.plugins,
          coordinates: req.body.coordinates || heat_map.coordinates
        }}, {new: false}, (err, heat_map) => {
          if (err) return res.status(500).json({ error: "unknown" });

          const time = req.body.time ? parseInt(req.body.time) - heat_map.time : 0;

          Test.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.test_id), {$set: {
            time_limit: Math.max(0, test.time_limit - time),
            is_completed: (test.time_limit > time) ? false : true
          }}, {new: true}, (err, test) => {
            if (err || !test) return res.status(500).json({ error: "unknown" });
  
            if (test.time_limit > 0)
              return res.status(200).json({
                completed: false,
                heat_map_id: heat_map._id.toString()
              });
  
            return res.status(200).json({
              completed: true,
              heat_map_id: heat_map._id.toString()
            });
          });
        });
      });
    } else {
      const newHeatMapData = {
        test_id: req.body.test_id,
        location: req.body.location || null,
        time: req.body.time || null,
        clicked_objects: req.body.clicked_objects || null,
        positions: req.body.positions || null,
        mouse_stand_still: req.body.mouse_stand_still || null,
        scrolled: req.body.scrolled || null,
        browser: req.body.browser || null,
        detailed_browser: req.body.detailed_browser || null,
        os: req.body.os || null,
        plugins: req.body.plugins || null,
        coordinates: req.body.coordinates || null
      };

      const newHeatMap = new HeatMap(newHeatMapData);
      const time = req.body.time ? parseInt(req.body.time) : 0;

      newHeatMap.save((err, heat_map) => {
        if (err) return res.status(500).json({ error: "unknown" });

        Test.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.test_id), {$set: {
          time_limit: Math.max(0, test.time_limit - time),
          is_completed: (test.time_limit > time) ? false : true
        }}, {new: true}, (err, test) => {
          if (err || !test) return res.status(500).json({ error: "unknown" });

          if (test.time_limit > 0)
            return res.status(200).json({
              completed: false,
              heat_map_id: heat_map._id.toString()
            });

          return res.status(200).json({
            completed: true,
            heat_map_id: heat_map._id.toString()
          });
        });
      });
    };
  });
}

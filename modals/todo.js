var mongoose = require('mongoose');
var TodoSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, index: true },
  completed: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
}, { id: false, versionKey: 'v' });
TodoSchema.plugin(require('mongoose-aggregate-paginate'));
TodoSchema.set('toJSON', { getters: true });
module.exports = mongoose.model("Todo", TodoSchema);
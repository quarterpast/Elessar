var has = Object.prototype.hasOwnProperty;

module.exports = function getEventProperty(prop, event) {
  return has.call(event, prop) ? event[prop]
       : event.originalEvent && has.call(event.originalEvent, 'touches') ? event.originalEvent.touches[0][prop]
       : 0;
};

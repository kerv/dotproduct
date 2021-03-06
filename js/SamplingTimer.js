/**
 * @fileoverview Description of this file.
 * @author sharvil.nanavati@gmail.com (Sharvil Nanavati)
 */

goog.provide('dotprod.SamplingTimer');

goog.require('goog.asserts');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @param {number} rate
 */
dotprod.SamplingTimer = function(rate) {
  rate = Math.floor(rate);
  goog.asserts.assert(rate > 0, 'Sampling rate must be > 0.');

  /**
   * @type {!goog.debug.Logger}
   * @private
   */
  this.logger_ = goog.debug.Logger.getLogger('dotprod.SamplingTimer');

  /**
   * @type {number}
   * @private
   */
  this.sampleRate_ = rate;

  /**
   * @type {!Object.<string, !Object>}
   * @private
   */
  this.timers_ = {};
};

/**
 * @param {string} name
 */
dotprod.SamplingTimer.prototype.start = function(name) {
  var timer = this.timers_[name];
  if (!timer) {
    timer = { start: 0, sample: 0 };
  }

  if (++timer.sample == this.sampleRate_) {
    timer.sample = 0;
    timer.start = goog.now();
  }

  this.timers_[name] = timer;
};

/**
 * @param {string} name
 */
dotprod.SamplingTimer.prototype.end = function(name) {
  var timer = this.timers_[name];
  goog.asserts.assert(timer, 'No timer found matching name: ' + name);

  if (timer.start) {
    this.logger_.info('{' + name + '}: ' + (goog.now() - timer.start) + 'ms');
    delete this.timers_[name];
  }
};

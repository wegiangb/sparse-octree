(function (three,dat,Stats) {
  'use strict';

  dat = dat && dat.hasOwnProperty('default') ? dat['default'] : dat;
  Stats = Stats && Stats.hasOwnProperty('default') ? Stats['default'] : Stats;

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();





  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();







  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };











  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };



















  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var OctreeHelper = function (_Object3D) {
  		inherits(OctreeHelper, _Object3D);

  		function OctreeHelper() {
  				var octree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				classCallCheck(this, OctreeHelper);

  				var _this = possibleConstructorReturn(this, (OctreeHelper.__proto__ || Object.getPrototypeOf(OctreeHelper)).call(this));

  				_this.name = "OctreeHelper";

  				_this.octree = octree;

  				_this.update();

  				return _this;
  		}

  		createClass(OctreeHelper, [{
  				key: "createLineSegments",
  				value: function createLineSegments(octants, octantCount) {

  						var maxOctants = Math.pow(2, 16) / 8 - 1;
  						var group = new three.Object3D();

  						var material = new three.LineBasicMaterial({
  								color: 0xffffff * Math.random()
  						});

  						var result = void 0;
  						var vertexCount = void 0;
  						var length = void 0;

  						var indices = void 0,
  						    positions = void 0;
  						var octant = void 0,
  						    min = void 0,
  						    max = void 0;
  						var geometry = void 0;

  						var i = void 0,
  						    j = void 0,
  						    c = void 0,
  						    d = void 0,
  						    n = void 0;
  						var corner = void 0,
  						    edge = void 0;

  						for (i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

  								length += octantCount < maxOctants ? octantCount : maxOctants;
  								octantCount -= maxOctants;

  								vertexCount = length * 8;
  								indices = new Uint16Array(vertexCount * 3);
  								positions = new Float32Array(vertexCount * 3);

  								for (c = 0, d = 0, result = octants.next(); !result.done && i < length;) {

  										octant = result.value;
  										min = octant.min;
  										max = octant.max;

  										for (j = 0; j < 12; ++j) {

  												edge = edges[j];

  												indices[d++] = c + edge[0];
  												indices[d++] = c + edge[1];
  										}

  										for (j = 0; j < 8; ++j, ++c) {

  												corner = corners[j];

  												positions[c * 3] = corner[0] === 0 ? min.x : max.x;
  												positions[c * 3 + 1] = corner[1] === 0 ? min.y : max.y;
  												positions[c * 3 + 2] = corner[2] === 0 ? min.z : max.z;
  										}

  										if (++i < length) {

  												result = octants.next();
  										}
  								}

  								geometry = new three.BufferGeometry();
  								geometry.setIndex(new three.BufferAttribute(indices, 1));
  								geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

  								group.add(new three.LineSegments(geometry, material));
  						}

  						this.add(group);
  				}
  		}, {
  				key: "update",
  				value: function update() {

  						var depth = this.octree !== null ? this.octree.getDepth() : -1;

  						var level = 0;
  						var result = void 0;

  						this.dispose();

  						while (level <= depth) {

  								result = this.octree.findOctantsByLevel(level);

  								this.createLineSegments(result[Symbol.iterator](), typeof result.size === "number" ? result.size : result.length);

  								++level;
  						}
  				}
  		}, {
  				key: "dispose",
  				value: function dispose() {

  						var groups = this.children;

  						var group = void 0,
  						    children = void 0;
  						var i = void 0,
  						    j = void 0,
  						    il = void 0,
  						    jl = void 0;

  						for (i = 0, il = groups.length; i < il; ++i) {

  								group = groups[i];
  								children = group.children;

  								for (j = 0, jl = children.length; j < jl; ++j) {

  										children[j].geometry.dispose();
  										children[j].material.dispose();
  								}

  								while (children.length > 0) {

  										group.remove(children[0]);
  								}
  						}

  						while (groups.length > 0) {

  								this.remove(groups[0]);
  						}
  				}
  		}]);
  		return OctreeHelper;
  }(three.Object3D);

  var corners = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var edges = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  var Vector3$1 = function () {
  	function Vector3$$1() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Vector3$$1);


  		this.x = x;

  		this.y = y;

  		this.z = z;
  	}

  	createClass(Vector3$$1, [{
  		key: "set",
  		value: function set$$1(x, y, z) {

  			this.x = x;
  			this.y = y;
  			this.z = z;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;
  			this.z = v.z;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z);
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];

  			return this;
  		}
  	}, {
  		key: "toArray",
  		value: function toArray$$1() {
  			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			array[offset] = this.x;
  			array[offset + 1] = this.y;
  			array[offset + 2] = this.z;

  			return array;
  		}
  	}, {
  		key: "setFromSpherical",
  		value: function setFromSpherical(s) {

  			var sinPhiRadius = Math.sin(s.phi) * s.radius;

  			this.x = sinPhiRadius * Math.sin(s.theta);
  			this.y = Math.cos(s.phi) * s.radius;
  			this.z = sinPhiRadius * Math.cos(s.theta);

  			return this;
  		}
  	}, {
  		key: "setFromCylindrical",
  		value: function setFromCylindrical(c) {

  			this.x = c.radius * Math.sin(c.theta);
  			this.y = c.y;
  			this.z = c.radius * Math.cos(c.theta);

  			return this;
  		}
  	}, {
  		key: "setFromMatrixColumn",
  		value: function setFromMatrixColumn(m, index) {

  			return this.fromArray(m.elements, index * 4);
  		}
  	}, {
  		key: "setFromMatrixPosition",
  		value: function setFromMatrixPosition(m) {

  			var me = m.elements;

  			this.x = me[12];
  			this.y = me[13];
  			this.z = me[14];

  			return this;
  		}
  	}, {
  		key: "setFromMatrixScale",
  		value: function setFromMatrixScale(m) {

  			var sx = this.setFromMatrixColumn(m, 0).length();
  			var sy = this.setFromMatrixColumn(m, 1).length();
  			var sz = this.setFromMatrixColumn(m, 2).length();

  			this.x = sx;
  			this.y = sy;
  			this.z = sz;

  			return this;
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;
  			this.z += v.z;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;
  			this.z += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;
  			this.z = a.z + b.z;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;
  			this.z += v.z * s;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;
  			this.z -= v.z;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;
  			this.z -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;
  			this.z = a.z - b.z;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;
  			this.z *= v.z;

  			return this;
  		}
  	}, {
  		key: "multiplyScalar",
  		value: function multiplyScalar(s) {

  			this.x *= s;
  			this.y *= s;
  			this.z *= s;

  			return this;
  		}
  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

  			this.x = a.x * b.x;
  			this.y = a.y * b.y;
  			this.z = a.z * b.z;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;
  			this.z /= v.z;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			this.x /= s;
  			this.y /= s;
  			this.z /= s;

  			return this;
  		}
  	}, {
  		key: "cross",
  		value: function cross(v) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z;

  			this.x = y * v.z - z * v.y;
  			this.y = z * v.x - x * v.z;
  			this.z = x * v.y - y * v.x;

  			return this;
  		}
  	}, {
  		key: "crossVectors",
  		value: function crossVectors(a, b) {

  			var ax = a.x,
  			    ay = a.y,
  			    az = a.z;
  			var bx = b.x,
  			    by = b.y,
  			    bz = b.z;

  			this.x = ay * bz - az * by;
  			this.y = az * bx - ax * bz;
  			this.z = ax * by - ay * bx;

  			return this;
  		}
  	}, {
  		key: "applyMatrix3",
  		value: function applyMatrix3(m) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z;
  			var e = m.elements;

  			this.x = e[0] * x + e[3] * y + e[6] * z;
  			this.y = e[1] * x + e[4] * y + e[7] * z;
  			this.z = e[2] * x + e[5] * y + e[8] * z;

  			return this;
  		}
  	}, {
  		key: "applyMatrix4",
  		value: function applyMatrix4(m) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z;
  			var e = m.elements;

  			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
  			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
  			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

  			return this;
  		}
  	}, {
  		key: "applyQuaternion",
  		value: function applyQuaternion(q) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z;
  			var qx = q.x,
  			    qy = q.y,
  			    qz = q.z,
  			    qw = q.w;

  			var ix = qw * x + qy * z - qz * y;
  			var iy = qw * y + qz * x - qx * z;
  			var iz = qw * z + qx * y - qy * x;
  			var iw = -qx * x - qy * y - qz * z;

  			this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  			this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  			this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;
  			this.z = -this.z;

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z;
  		}
  	}, {
  		key: "reflect",
  		value: function reflect(n) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$$1();


  			var nx = n.x;
  			var ny = n.y;
  			var nz = n.z;

  			this.sub(n.multiplyScalar(2 * this.dot(n)));

  			n.set(nx, ny, nz);

  			return this;
  		}
  	}, {
  		key: "angleTo",
  		value: function angleTo(v) {

  			var theta = this.dot(v) / Math.sqrt(this.lengthSquared() * v.lengthSquared());

  			return Math.acos(Math.min(Math.max(theta, -1), 1));
  		}
  	}, {
  		key: "lengthManhattan",
  		value: function lengthManhattan() {

  			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.x * this.x + this.y * this.y + this.z * this.z;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  		}
  	}, {
  		key: "distanceToManhattan",
  		value: function distanceToManhattan(v) {

  			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;
  			var dz = this.z - v.z;

  			return dx * dx + dy * dy + dz * dz;
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "setLength",
  		value: function setLength(length) {

  			return this.normalize().multiplyScalar(length);
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);
  			this.z = Math.min(this.z, v.z);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);
  			this.z = Math.max(this.z, v.z);

  			return this;
  		}
  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

  			this.x = Math.max(min.x, Math.min(max.x, this.x));
  			this.y = Math.max(min.y, Math.min(max.y, this.y));
  			this.z = Math.max(min.z, Math.min(max.z, this.z));

  			return this;
  		}
  	}, {
  		key: "floor",
  		value: function floor() {

  			this.x = Math.floor(this.x);
  			this.y = Math.floor(this.y);
  			this.z = Math.floor(this.z);

  			return this;
  		}
  	}, {
  		key: "ceil",
  		value: function ceil() {

  			this.x = Math.ceil(this.x);
  			this.y = Math.ceil(this.y);
  			this.z = Math.ceil(this.z);

  			return this;
  		}
  	}, {
  		key: "round",
  		value: function round() {

  			this.x = Math.round(this.x);
  			this.y = Math.round(this.y);
  			this.z = Math.round(this.z);

  			return this;
  		}
  	}, {
  		key: "lerp",
  		value: function lerp(v, alpha) {

  			this.x += (v.x - this.x) * alpha;
  			this.y += (v.y - this.y) * alpha;
  			this.z += (v.z - this.z) * alpha;

  			return this;
  		}
  	}, {
  		key: "lerpVectors",
  		value: function lerpVectors(v1, v2, alpha) {

  			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y && v.z === this.z;
  		}
  	}]);
  	return Vector3$$1;
  }();

  var v$1 = new Vector3$1();

  var Box3$1 = function () {
  	function Box3$$1() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1(Infinity, Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1(-Infinity, -Infinity, -Infinity);
  		classCallCheck(this, Box3$$1);


  		this.min = min;

  		this.max = max;
  	}

  	createClass(Box3$$1, [{
  		key: "set",
  		value: function set$$1(min, max) {

  			this.min.copy(min);
  			this.max.copy(max);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(b) {

  			this.min.copy(b.min);
  			this.max.copy(b.max);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "makeEmpty",
  		value: function makeEmpty() {

  			this.min.x = this.min.y = this.min.z = Infinity;
  			this.max.x = this.max.y = this.max.z = -Infinity;

  			return this;
  		}
  	}, {
  		key: "isEmpty",
  		value: function isEmpty() {

  			return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  		}
  	}, {
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return !this.isEmpty() ? target.addVectors(this.min, this.max).multiplyScalar(0.5) : target.set(0, 0, 0);
  		}
  	}, {
  		key: "getSize",
  		value: function getSize() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return !this.isEmpty() ? target.subVectors(this.max, this.min) : target.set(0, 0, 0);
  		}
  	}, {
  		key: "getBoundingSphere",
  		value: function getBoundingSphere() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Sphere();


  			this.getCenter(target.center);

  			target.radius = this.getSize(v$1).length() * 0.5;

  			return target;
  		}
  	}, {
  		key: "expandByPoint",
  		value: function expandByPoint(p) {

  			this.min.min(p);
  			this.max.max(p);

  			return this;
  		}
  	}, {
  		key: "expandByVector",
  		value: function expandByVector(v) {

  			this.min.sub(v);
  			this.max.add(v);

  			return this;
  		}
  	}, {
  		key: "expandByScalar",
  		value: function expandByScalar(s) {

  			this.min.addScalar(-s);
  			this.max.addScalar(s);

  			return this;
  		}
  	}, {
  		key: "setFromPoints",
  		value: function setFromPoints(points) {

  			var i = void 0,
  			    l = void 0;

  			this.min.set(0, 0, 0);
  			this.max.set(0, 0, 0);

  			for (i = 0, l = points.length; i < l; ++i) {

  				this.expandByPoint(points[i]);
  			}

  			return this;
  		}
  	}, {
  		key: "setFromCenterAndSize",
  		value: function setFromCenterAndSize(center, size) {

  			var halfSize = v$1.copy(size).multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}
  	}, {
  		key: "clampPoint",
  		value: function clampPoint(point) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


  			return target.copy(point).clamp(this.min, this.max);
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			var clampedPoint = v$1.copy(p).clamp(this.min, this.max);

  			return clampedPoint.sub(p).length();
  		}
  	}, {
  		key: "translate",
  		value: function translate(offset) {

  			this.min.add(offset);
  			this.max.add(offset);

  			return this;
  		}
  	}, {
  		key: "intersect",
  		value: function intersect(b) {

  			this.min.max(b.min);
  			this.max.min(b.max);

  			if (this.isEmpty()) {
  				this.makeEmpty();
  			}

  			return this;
  		}
  	}, {
  		key: "union",
  		value: function union(b) {

  			this.min.min(b.min);
  			this.max.max(b.max);

  			return this;
  		}
  	}, {
  		key: "containsPoint",
  		value: function containsPoint(p) {

  			return !(p.x < this.min.x || p.x > this.max.x || p.y < this.min.y || p.y > this.max.y || p.z < this.min.z || p.z > this.max.z);
  		}
  	}, {
  		key: "containsBox",
  		value: function containsBox(b) {

  			return this.min.x <= b.min.x && b.max.x <= this.max.x && this.min.y <= b.min.y && b.max.y <= this.max.y && this.min.z <= b.min.z && b.max.z <= this.max.z;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			return !(b.max.x < this.min.x || b.min.x > this.max.x || b.max.y < this.min.y || b.min.y > this.max.y || b.max.z < this.min.z || b.min.z > this.max.z);
  		}
  	}, {
  		key: "intersectsSphere",
  		value: function intersectsSphere(s) {
  			var closestPoint = this.clampPoint(s.center, v$1);

  			return closestPoint.distanceToSquared(s.center) <= s.radius * s.radius;
  		}
  	}, {
  		key: "intersectsPlane",
  		value: function intersectsPlane(p) {

  			var min = void 0,
  			    max = void 0;

  			if (p.normal.x > 0) {

  				min = p.normal.x * this.min.x;
  				max = p.normal.x * this.max.x;
  			} else {

  				min = p.normal.x * this.max.x;
  				max = p.normal.x * this.min.x;
  			}

  			if (p.normal.y > 0) {

  				min += p.normal.y * this.min.y;
  				max += p.normal.y * this.max.y;
  			} else {

  				min += p.normal.y * this.max.y;
  				max += p.normal.y * this.min.y;
  			}

  			if (p.normal.z > 0) {

  				min += p.normal.z * this.min.z;
  				max += p.normal.z * this.max.z;
  			} else {

  				min += p.normal.z * this.max.z;
  				max += p.normal.z * this.min.z;
  			}

  			return min <= p.constant && max >= p.constant;
  		}
  	}, {
  		key: "equals",
  		value: function equals(b) {

  			return b.min.equals(this.min) && b.max.equals(this.max);
  		}
  	}]);
  	return Box3$$1;
  }();

  var box = new Box3$1();

  var Sphere = function () {
  	function Sphere() {
  		var center = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, Sphere);


  		this.center = center;

  		this.radius = radius;
  	}

  	createClass(Sphere, [{
  		key: "set",
  		value: function set$$1(center, radius) {

  			this.center.copy(center);
  			this.radius = radius;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(s) {

  			this.center.copy(s.center);
  			this.radius = s.radius;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "setFromPoints",
  		value: function setFromPoints(points) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : box.setFromPoints(points).getCenter(this.center);


  			var center = this.center;

  			var maxRadiusSq = 0;
  			var i = void 0,
  			    l = void 0;

  			for (i = 0, l = points.length; i < l; ++i) {

  				maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
  			}

  			this.radius = Math.sqrt(maxRadiusSq);

  			return this;
  		}
  	}, {
  		key: "getBoundingBox",
  		value: function getBoundingBox() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Box3$1();


  			target.set(this.center, this.center);
  			target.expandByScalar(this.radius);

  			return target;
  		}
  	}, {
  		key: "isEmpty",
  		value: function isEmpty() {

  			return this.radius <= 0;
  		}
  	}, {
  		key: "translate",
  		value: function translate(offset) {

  			this.center.add(offset);

  			return this;
  		}
  	}, {
  		key: "clampPoint",
  		value: function clampPoint(p) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();


  			var deltaLengthSq = this.center.distanceToSquared(p);

  			target.copy(p);

  			if (deltaLengthSq > this.radius * this.radius) {

  				target.sub(this.center).normalize();
  				target.multiplyScalar(this.radius).add(this.center);
  			}

  			return target;
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			return p.distanceTo(this.center) - this.radius;
  		}
  	}, {
  		key: "containsPoint",
  		value: function containsPoint(p) {

  			return p.distanceToSquared(this.center) <= this.radius * this.radius;
  		}
  	}, {
  		key: "intersectsSphere",
  		value: function intersectsSphere(s) {

  			var radiusSum = this.radius + s.radius;

  			return s.center.distanceToSquared(this.center) <= radiusSum * radiusSum;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			return b.intersectsSphere(this);
  		}
  	}, {
  		key: "intersectsPlane",
  		value: function intersectsPlane(p) {

  			return Math.abs(p.distanceToPoint(this.center)) <= this.radius;
  		}
  	}, {
  		key: "equals",
  		value: function equals(s) {

  			return s.center.equals(this.center) && s.radius === this.radius;
  		}
  	}]);
  	return Sphere;
  }();

  var Vector2$1 = function () {
  	function Vector2$$1() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, Vector2$$1);


  		this.x = x;

  		this.y = y;
  	}

  	createClass(Vector2$$1, [{
  		key: "set",
  		value: function set$$1(x, y) {

  			this.x = x;
  			this.y = y;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y);
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];

  			return this;
  		}
  	}, {
  		key: "toArray",
  		value: function toArray$$1() {
  			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			array[offset] = this.x;
  			array[offset + 1] = this.y;

  			return array;
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;

  			return this;
  		}
  	}, {
  		key: "multiplyScalar",
  		value: function multiplyScalar(s) {

  			this.x *= s;
  			this.y *= s;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			this.x /= s;
  			this.y /= s;

  			return this;
  		}
  	}, {
  		key: "applyMatrix3",
  		value: function applyMatrix3(m) {

  			var x = this.x,
  			    y = this.y;
  			var e = m.elements;

  			this.x = e[0] * x + e[3] * y + e[6];
  			this.y = e[1] * x + e[4] * y + e[7];

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y;
  		}
  	}, {
  		key: "lengthManhattan",
  		value: function lengthManhattan() {

  			return Math.abs(this.x) + Math.abs(this.y);
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.x * this.x + this.y * this.y;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y);
  		}
  	}, {
  		key: "distanceToManhattan",
  		value: function distanceToManhattan(v) {

  			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;

  			return dx * dx + dy * dy;
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "setLength",
  		value: function setLength(length) {

  			return this.normalize().multiplyScalar(length);
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);

  			return this;
  		}
  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

  			this.x = Math.max(min.x, Math.min(max.x, this.x));
  			this.y = Math.max(min.y, Math.min(max.y, this.y));

  			return this;
  		}
  	}, {
  		key: "floor",
  		value: function floor() {

  			this.x = Math.floor(this.x);
  			this.y = Math.floor(this.y);

  			return this;
  		}
  	}, {
  		key: "ceil",
  		value: function ceil() {

  			this.x = Math.ceil(this.x);
  			this.y = Math.ceil(this.y);

  			return this;
  		}
  	}, {
  		key: "round",
  		value: function round() {

  			this.x = Math.round(this.x);
  			this.y = Math.round(this.y);

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;

  			return this;
  		}
  	}, {
  		key: "angle",
  		value: function angle() {

  			var angle = Math.atan2(this.y, this.x);

  			if (angle < 0) {
  				angle += 2 * Math.PI;
  			}

  			return angle;
  		}
  	}, {
  		key: "lerp",
  		value: function lerp(v, alpha) {

  			this.x += (v.x - this.x) * alpha;
  			this.y += (v.y - this.y) * alpha;

  			return this;
  		}
  	}, {
  		key: "lerpVectors",
  		value: function lerpVectors(v1, v2, alpha) {

  			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  		}
  	}, {
  		key: "rotateAround",
  		value: function rotateAround(center, angle) {

  			var c = Math.cos(angle),
  			    s = Math.sin(angle);

  			var x = this.x - center.x;
  			var y = this.y - center.y;

  			this.x = x * c - y * s + center.x;
  			this.y = x * s + y * c + center.y;

  			return this;
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y;
  		}
  	}, {
  		key: "width",
  		get: function get$$1() {
  			return this.x;
  		},
  		set: function set$$1(value) {
  			return this.x = value;
  		}
  	}, {
  		key: "height",
  		get: function get$$1() {
  			return this.y;
  		},
  		set: function set$$1(value) {
  			return this.y = value;
  		}
  	}]);
  	return Vector2$$1;
  }();

  var v = new Vector2$1();

  var Box2 = function () {
  	function Box2() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2$1(Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector2$1(-Infinity, -Infinity);
  		classCallCheck(this, Box2);


  		this.min = min;

  		this.max = max;
  	}

  	createClass(Box2, [{
  		key: "set",
  		value: function set$$1(min, max) {

  			this.min.copy(min);
  			this.max.copy(max);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(b) {

  			this.min.copy(b.min);
  			this.max.copy(b.max);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "makeEmpty",
  		value: function makeEmpty() {

  			this.min.x = this.min.y = Infinity;
  			this.max.x = this.max.y = -Infinity;

  			return this;
  		}
  	}, {
  		key: "isEmpty",
  		value: function isEmpty() {

  			return this.max.x < this.min.x || this.max.y < this.min.y;
  		}
  	}, {
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2$1();


  			return !this.isEmpty() ? target.addVectors(this.min, this.max).multiplyScalar(0.5) : target.set(0, 0);
  		}
  	}, {
  		key: "getSize",
  		value: function getSize() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector2$1();


  			return !this.isEmpty() ? target.subVectors(this.max, this.min) : target.set(0, 0);
  		}
  	}, {
  		key: "getBoundingSphere",
  		value: function getBoundingSphere() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Sphere();


  			this.getCenter(target.center);

  			target.radius = this.getSize(v).length() * 0.5;

  			return target;
  		}
  	}, {
  		key: "expandByPoint",
  		value: function expandByPoint(p) {

  			this.min.min(p);
  			this.max.max(p);

  			return this;
  		}
  	}, {
  		key: "expandByVector",
  		value: function expandByVector(v) {

  			this.min.sub(v);
  			this.max.add(v);

  			return this;
  		}
  	}, {
  		key: "expandByScalar",
  		value: function expandByScalar(s) {

  			this.min.addScalar(-s);
  			this.max.addScalar(s);

  			return this;
  		}
  	}, {
  		key: "setFromPoints",
  		value: function setFromPoints(points) {

  			var i = void 0,
  			    l = void 0;

  			this.min.set(0, 0);
  			this.max.set(0, 0);

  			for (i = 0, l = points.length; i < l; ++i) {

  				this.expandByPoint(points[i]);
  			}

  			return this;
  		}
  	}, {
  		key: "setFromCenterAndSize",
  		value: function setFromCenterAndSize(center, size) {

  			var halfSize = v.copy(size).multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}
  	}, {
  		key: "clampPoint",
  		value: function clampPoint(point) {
  			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector2$1();


  			return target.copy(point).clamp(this.min, this.max);
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			var clampedPoint = v.copy(p).clamp(this.min, this.max);

  			return clampedPoint.sub(p).length();
  		}
  	}, {
  		key: "translate",
  		value: function translate(offset) {

  			this.min.add(offset);
  			this.max.add(offset);

  			return this;
  		}
  	}, {
  		key: "intersect",
  		value: function intersect(b) {

  			this.min.max(b.min);
  			this.max.min(b.max);

  			if (this.isEmpty()) {
  				this.makeEmpty();
  			}

  			return this;
  		}
  	}, {
  		key: "union",
  		value: function union(b) {

  			this.min.min(b.min);
  			this.max.max(b.max);

  			return this;
  		}
  	}, {
  		key: "containsPoint",
  		value: function containsPoint(p) {

  			return !(p.x < this.min.x || p.x > this.max.x || p.y < this.min.y || p.y > this.max.y);
  		}
  	}, {
  		key: "containsBox",
  		value: function containsBox(b) {

  			return this.min.x <= b.min.x && b.max.x <= this.max.x && this.min.y <= b.min.y && b.max.y <= this.max.y;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			return !(b.max.x < this.min.x || b.min.x > this.max.x || b.max.y < this.min.y || b.min.y > this.max.y);
  		}
  	}, {
  		key: "equals",
  		value: function equals(b) {

  			return b.min.equals(this.min) && b.max.equals(this.max);
  		}
  	}]);
  	return Box2;
  }();

  var Cylindrical = function () {
  	function Cylindrical() {
  		var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  		var theta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Cylindrical);


  		this.radius = radius;

  		this.theta = theta;

  		this.y = y;
  	}

  	createClass(Cylindrical, [{
  		key: "set",
  		value: function set$$1(radius, theta, y) {

  			this.radius = radius;
  			this.theta = theta;
  			this.y = y;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(c) {

  			this.radius = c.radius;
  			this.theta = c.theta;
  			this.y = c.y;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "setFromVector3",
  		value: function setFromVector3(v) {

  			this.radius = Math.sqrt(v.x * v.x + v.z * v.z);
  			this.theta = Math.atan2(v.x, v.z);
  			this.y = v.y;

  			return this;
  		}
  	}]);
  	return Cylindrical;
  }();

  var Matrix3 = function () {
  		function Matrix3() {
  				classCallCheck(this, Matrix3);


  				this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  		}

  		createClass(Matrix3, [{
  				key: "set",
  				value: function set$$1(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

  						var te = this.elements;

  						te[0] = m00;te[3] = m01;te[6] = m02;
  						te[1] = m10;te[4] = m11;te[7] = m12;
  						te[2] = m20;te[5] = m21;te[8] = m22;

  						return this;
  				}
  		}, {
  				key: "identity",
  				value: function identity() {

  						this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "copy",
  				value: function copy(matrix) {

  						var me = matrix.elements;
  						var te = this.elements;

  						te[0] = me[0];te[1] = me[1];te[2] = me[2];
  						te[3] = me[3];te[4] = me[4];te[5] = me[5];
  						te[6] = me[6];te[7] = me[7];te[8] = me[8];

  						return this;
  				}
  		}, {
  				key: "clone",
  				value: function clone() {

  						return new this.constructor().fromArray(this.elements);
  				}
  		}, {
  				key: "fromArray",
  				value: function fromArray(array) {
  						var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  						var te = this.elements;

  						var i = void 0;

  						for (i = 0; i < 9; ++i) {

  								te[i] = array[i + offset];
  						}

  						return this;
  				}
  		}, {
  				key: "toArray",
  				value: function toArray$$1() {
  						var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  						var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  						var te = this.elements;

  						var i = void 0;

  						for (i = 0; i < 9; ++i) {

  								array[i + offset] = te[i];
  						}

  						return array;
  				}
  		}, {
  				key: "multiplyMatrices",
  				value: function multiplyMatrices(a, b) {

  						var ae = a.elements;
  						var be = b.elements;
  						var te = this.elements;

  						var a11 = ae[0],
  						    a12 = ae[3],
  						    a13 = ae[6];
  						var a21 = ae[1],
  						    a22 = ae[4],
  						    a23 = ae[7];
  						var a31 = ae[2],
  						    a32 = ae[5],
  						    a33 = ae[8];

  						var b11 = be[0],
  						    b12 = be[3],
  						    b13 = be[6];
  						var b21 = be[1],
  						    b22 = be[4],
  						    b23 = be[7];
  						var b31 = be[2],
  						    b32 = be[5],
  						    b33 = be[8];

  						te[0] = a11 * b11 + a12 * b21 + a13 * b31;
  						te[3] = a11 * b12 + a12 * b22 + a13 * b32;
  						te[6] = a11 * b13 + a12 * b23 + a13 * b33;

  						te[1] = a21 * b11 + a22 * b21 + a23 * b31;
  						te[4] = a21 * b12 + a22 * b22 + a23 * b32;
  						te[7] = a21 * b13 + a22 * b23 + a23 * b33;

  						te[2] = a31 * b11 + a32 * b21 + a33 * b31;
  						te[5] = a31 * b12 + a32 * b22 + a33 * b32;
  						te[8] = a31 * b13 + a32 * b23 + a33 * b33;

  						return this;
  				}
  		}, {
  				key: "multiply",
  				value: function multiply(m) {

  						return this.multiplyMatrices(this, m);
  				}
  		}, {
  				key: "premultiply",
  				value: function premultiply(m) {

  						return this.multiplyMatrices(m, this);
  				}
  		}, {
  				key: "multiplyScalar",
  				value: function multiplyScalar(s) {

  						var te = this.elements;

  						te[0] *= s;te[3] *= s;te[6] *= s;
  						te[1] *= s;te[4] *= s;te[7] *= s;
  						te[2] *= s;te[5] *= s;te[8] *= s;

  						return this;
  				}
  		}, {
  				key: "determinant",
  				value: function determinant() {

  						var te = this.elements;

  						var a = te[0],
  						    b = te[1],
  						    c = te[2];
  						var d = te[3],
  						    e = te[4],
  						    f = te[5];
  						var g = te[6],
  						    h = te[7],
  						    i = te[8];

  						return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
  				}
  		}, {
  				key: "getInverse",
  				value: function getInverse(matrix) {

  						var me = matrix.elements;
  						var te = this.elements;

  						var n11 = me[0],
  						    n21 = me[1],
  						    n31 = me[2];
  						var n12 = me[3],
  						    n22 = me[4],
  						    n32 = me[5];
  						var n13 = me[6],
  						    n23 = me[7],
  						    n33 = me[8];

  						var t11 = n33 * n22 - n32 * n23;
  						var t12 = n32 * n13 - n33 * n12;
  						var t13 = n23 * n12 - n22 * n13;

  						var det = n11 * t11 + n21 * t12 + n31 * t13;

  						var invDet = void 0;

  						if (det !== 0) {

  								invDet = 1.0 / det;

  								te[0] = t11 * invDet;
  								te[1] = (n31 * n23 - n33 * n21) * invDet;
  								te[2] = (n32 * n21 - n31 * n22) * invDet;

  								te[3] = t12 * invDet;
  								te[4] = (n33 * n11 - n31 * n13) * invDet;
  								te[5] = (n31 * n12 - n32 * n11) * invDet;

  								te[6] = t13 * invDet;
  								te[7] = (n21 * n13 - n23 * n11) * invDet;
  								te[8] = (n22 * n11 - n21 * n12) * invDet;
  						} else {

  								console.error("Can't invert matrix, determinant is zero", matrix);

  								this.identity();
  						}

  						return this;
  				}
  		}, {
  				key: "transpose",
  				value: function transpose() {

  						var me = this.elements;

  						var t = void 0;

  						t = me[1];me[1] = me[3];me[3] = t;
  						t = me[2];me[2] = me[6];me[6] = t;
  						t = me[5];me[5] = me[7];me[7] = t;

  						return this;
  				}
  		}, {
  				key: "scale",
  				value: function scale(sx, sy) {

  						var te = this.elements;

  						te[0] *= sx;te[3] *= sx;te[6] *= sx;
  						te[1] *= sy;te[4] *= sy;te[7] *= sy;

  						return this;
  				}
  		}, {
  				key: "rotate",
  				value: function rotate(theta) {

  						var c = Math.cos(theta);
  						var s = Math.sin(theta);

  						var te = this.elements;

  						var a11 = te[0],
  						    a12 = te[3],
  						    a13 = te[6];
  						var a21 = te[1],
  						    a22 = te[4],
  						    a23 = te[7];

  						te[0] = c * a11 + s * a21;
  						te[3] = c * a12 + s * a22;
  						te[6] = c * a13 + s * a23;

  						te[1] = -s * a11 + c * a21;
  						te[4] = -s * a12 + c * a22;
  						te[7] = -s * a13 + c * a23;

  						return this;
  				}
  		}, {
  				key: "translate",
  				value: function translate(tx, ty) {

  						var te = this.elements;

  						te[0] += tx * te[2];te[3] += tx * te[5];te[6] += tx * te[8];
  						te[1] += ty * te[2];te[4] += ty * te[5];te[7] += ty * te[8];

  						return this;
  				}
  		}, {
  				key: "equals",
  				value: function equals(matrix) {

  						var te = this.elements;
  						var me = matrix.elements;

  						var result = true;
  						var i = void 0;

  						for (i = 0; result && i < 9; ++i) {

  								if (te[i] !== me[i]) {

  										result = false;
  								}
  						}

  						return result;
  				}
  		}]);
  		return Matrix3;
  }();

  var RotationOrder = {

    XYZ: "XYZ",
    YZX: "YZX",
    ZXY: "ZXY",
    XZY: "XZY",
    YXZ: "YXZ",
    ZYX: "ZYX"

  };

  var v$2 = new Vector3$1();

  var Quaternion = function () {
  	function Quaternion() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		classCallCheck(this, Quaternion);


  		this.x = x;

  		this.y = x;

  		this.z = x;

  		this.w = x;
  	}

  	createClass(Quaternion, [{
  		key: "set",
  		value: function set$$1(x, y, z, w) {

  			this.x = x;
  			this.y = y;
  			this.z = z;
  			this.w = w;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(q) {

  			this.x = q.x;
  			this.y = q.y;
  			this.z = q.z;
  			this.w = q.w;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z, this.w);
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];
  			this.w = array[offset + 3];

  			return this;
  		}
  	}, {
  		key: "toArray",
  		value: function toArray$$1() {
  			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			array[offset] = this.x;
  			array[offset + 1] = this.y;
  			array[offset + 2] = this.z;
  			array[offset + 3] = this.w;

  			return array;
  		}
  	}, {
  		key: "setFromEuler",
  		value: function setFromEuler(euler) {

  			var x = euler.x;
  			var y = euler.y;
  			var z = euler.z;

  			var cos = Math.cos;
  			var sin = Math.sin;

  			var c1 = cos(x / 2);
  			var c2 = cos(y / 2);
  			var c3 = cos(z / 2);

  			var s1 = sin(x / 2);
  			var s2 = sin(y / 2);
  			var s3 = sin(z / 2);

  			switch (euler.order) {

  				case RotationOrder.XYZ:
  					this.x = s1 * c2 * c3 + c1 * s2 * s3;
  					this.y = c1 * s2 * c3 - s1 * c2 * s3;
  					this.z = c1 * c2 * s3 + s1 * s2 * c3;
  					this.w = c1 * c2 * c3 - s1 * s2 * s3;
  					break;

  				case RotationOrder.YXZ:
  					this.x = s1 * c2 * c3 + c1 * s2 * s3;
  					this.y = c1 * s2 * c3 - s1 * c2 * s3;
  					this.z = c1 * c2 * s3 - s1 * s2 * c3;
  					this.w = c1 * c2 * c3 + s1 * s2 * s3;
  					break;

  				case RotationOrder.ZXY:
  					this.x = s1 * c2 * c3 - c1 * s2 * s3;
  					this.y = c1 * s2 * c3 + s1 * c2 * s3;
  					this.z = c1 * c2 * s3 + s1 * s2 * c3;
  					this.w = c1 * c2 * c3 - s1 * s2 * s3;
  					break;

  				case RotationOrder.ZYX:
  					this.x = s1 * c2 * c3 - c1 * s2 * s3;
  					this.y = c1 * s2 * c3 + s1 * c2 * s3;
  					this.z = c1 * c2 * s3 - s1 * s2 * c3;
  					this.w = c1 * c2 * c3 + s1 * s2 * s3;
  					break;

  				case RotationOrder.YZX:
  					this.x = s1 * c2 * c3 + c1 * s2 * s3;
  					this.y = c1 * s2 * c3 + s1 * c2 * s3;
  					this.z = c1 * c2 * s3 - s1 * s2 * c3;
  					this.w = c1 * c2 * c3 - s1 * s2 * s3;
  					break;

  				case RotationOrder.XZY:
  					this.x = s1 * c2 * c3 - c1 * s2 * s3;
  					this.y = c1 * s2 * c3 - s1 * c2 * s3;
  					this.z = c1 * c2 * s3 + s1 * s2 * c3;
  					this.w = c1 * c2 * c3 + s1 * s2 * s3;
  					break;

  			}

  			return this;
  		}
  	}, {
  		key: "setFromAxisAngle",
  		value: function setFromAxisAngle(axis, angle) {

  			var halfAngle = angle / 2.0;
  			var s = Math.sin(halfAngle);

  			this.x = axis.x * s;
  			this.y = axis.y * s;
  			this.z = axis.z * s;
  			this.w = Math.cos(halfAngle);

  			return this;
  		}
  	}, {
  		key: "setFromRotationMatrix",
  		value: function setFromRotationMatrix(m) {

  			var te = m.elements;

  			var m00 = te[0],
  			    m01 = te[4],
  			    m02 = te[8];
  			var m10 = te[1],
  			    m11 = te[5],
  			    m12 = te[9];
  			var m20 = te[2],
  			    m21 = te[6],
  			    m22 = te[10];

  			var trace = m00 + m11 + m22;

  			var s = void 0;

  			if (trace > 0) {

  				s = 0.5 / Math.sqrt(trace + 1.0);

  				this.w = 0.25 / s;
  				this.x = (m21 - m12) * s;
  				this.y = (m02 - m20) * s;
  				this.z = (m10 - m01) * s;
  			} else if (m00 > m11 && m00 > m22) {

  				s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

  				this.w = (m21 - m12) / s;
  				this.x = 0.25 * s;
  				this.y = (m01 + m10) / s;
  				this.z = (m02 + m20) / s;
  			} else if (m11 > m22) {

  				s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

  				this.w = (m02 - m20) / s;
  				this.x = (m01 + m10) / s;
  				this.y = 0.25 * s;
  				this.z = (m12 + m21) / s;
  			} else {

  				s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

  				this.w = (m10 - m01) / s;
  				this.x = (m02 + m20) / s;
  				this.y = (m12 + m21) / s;
  				this.z = 0.25 * s;
  			}

  			return this;
  		}
  	}, {
  		key: "setFromUnitVectors",
  		value: function setFromUnitVectors(vFrom, vTo) {

  			var r = vFrom.dot(vTo) + 1;

  			if (r < 1e-6) {

  				r = 0;

  				if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

  					v$2.set(-vFrom.y, vFrom.x, 0);
  				} else {

  					v$2.set(0, -vFrom.z, vFrom.y);
  				}
  			} else {

  				v$2.crossVectors(vFrom, vTo);
  			}

  			this.x = v$2.x;
  			this.y = v$2.y;
  			this.z = v$2.z;
  			this.w = r;

  			return this.normalize();
  		}
  	}, {
  		key: "invert",
  		value: function invert() {

  			return this.conjugate().normalize();
  		}
  	}, {
  		key: "conjugate",
  		value: function conjugate() {

  			this.x *= -1;
  			this.y *= -1;
  			this.z *= -1;

  			return this;
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			var l = this.length();

  			var invLength = void 0;

  			if (l === 0) {

  				this.x = 0;
  				this.y = 0;
  				this.z = 0;
  				this.w = 1;
  			} else {

  				invLength = 1.0 / l;

  				this.x = this.x * invLength;
  				this.y = this.y * invLength;
  				this.z = this.z * invLength;
  				this.w = this.w * invLength;
  			}

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  		}
  	}, {
  		key: "multiplyQuaternions",
  		value: function multiplyQuaternions(a, b) {

  			var qax = a.x,
  			    qay = a.y,
  			    qaz = a.z,
  			    qaw = a.w;
  			var qbx = b.x,
  			    qby = b.y,
  			    qbz = b.z,
  			    qbw = b.w;

  			this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
  			this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
  			this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
  			this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(q) {

  			return this.multiplyQuaternions(this, q);
  		}
  	}, {
  		key: "premultiply",
  		value: function premultiply(q) {

  			return this.multiplyQuaternions(q, this);
  		}
  	}, {
  		key: "slerp",
  		value: function slerp(q, t) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z,
  			    w = this.w;

  			var cosHalfTheta = void 0,
  			    sinHalfTheta = void 0;
  			var halfTheta = void 0,
  			    ratioA = void 0,
  			    ratioB = void 0;

  			if (t === 1) {

  				this.copy(q);
  			} else if (t > 0) {

  				cosHalfTheta = w * q.w + x * q.x + y * q.y + z * q.z;

  				if (cosHalfTheta < 0) {

  					this.w = -q.w;
  					this.x = -q.x;
  					this.y = -q.y;
  					this.z = -q.z;

  					cosHalfTheta = -cosHalfTheta;
  				} else {

  					this.copy(q);
  				}

  				if (cosHalfTheta >= 1.0) {

  					this.w = w;
  					this.x = x;
  					this.y = y;
  					this.z = z;

  					return this;
  				}

  				sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

  				if (Math.abs(sinHalfTheta) < 1e-3) {

  					this.w = 0.5 * (w + this.w);
  					this.x = 0.5 * (x + this.x);
  					this.y = 0.5 * (y + this.y);
  					this.z = 0.5 * (z + this.z);

  					return this;
  				}

  				halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
  				ratioA = Math.sin((1.0 - t) * halfTheta) / sinHalfTheta;
  				ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

  				this.w = w * ratioA + this.w * ratioB;
  				this.x = x * ratioA + this.x * ratioB;
  				this.y = y * ratioA + this.y * ratioB;
  				this.z = z * ratioA + this.z * ratioB;
  			}

  			return this;
  		}
  	}, {
  		key: "equals",
  		value: function equals(q) {

  			return q.x === this.x && q.y === this.y && q.z === this.z && q.w === this.w;
  		}
  	}], [{
  		key: "slerp",
  		value: function slerp(qa, qb) {
  			var qr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Quaternion();
  			var t = arguments[3];


  			return qr.copy(qa).slerp(qb, t);
  		}
  	}, {
  		key: "slerpFlat",
  		value: function slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {

  			var x1 = src1[srcOffset1];
  			var y1 = src1[srcOffset1 + 1];
  			var z1 = src1[srcOffset1 + 2];
  			var w1 = src1[srcOffset1 + 3];

  			var x0 = src0[srcOffset0];
  			var y0 = src0[srcOffset0 + 1];
  			var z0 = src0[srcOffset0 + 2];
  			var w0 = src0[srcOffset0 + 3];

  			var s = void 0,
  			    f = void 0;
  			var sin = void 0,
  			    cos = void 0,
  			    sqrSin = void 0;
  			var dir = void 0,
  			    len = void 0,
  			    tDir = void 0;

  			if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {

  				s = 1.0 - t;
  				cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1;

  				dir = cos >= 0 ? 1 : -1;
  				sqrSin = 1.0 - cos * cos;

  				if (sqrSin > Number.EPSILON) {

  					sin = Math.sqrt(sqrSin);
  					len = Math.atan2(sin, cos * dir);

  					s = Math.sin(s * len) / sin;
  					t = Math.sin(t * len) / sin;
  				}

  				tDir = t * dir;

  				x0 = x0 * s + x1 * tDir;
  				y0 = y0 * s + y1 * tDir;
  				z0 = z0 * s + z1 * tDir;
  				w0 = w0 * s + w1 * tDir;

  				if (s === 1.0 - t) {

  					f = 1.0 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

  					x0 *= f;
  					y0 *= f;
  					z0 *= f;
  					w0 *= f;
  				}
  			}

  			dst[dstOffset] = x0;
  			dst[dstOffset + 1] = y0;
  			dst[dstOffset + 2] = z0;
  			dst[dstOffset + 3] = w0;
  		}
  	}]);
  	return Quaternion;
  }();

  function clamp(value, min, max) {

  	return Math.max(Math.min(value, max), min);
  }

  var m = new Matrix3();

  var q = new Quaternion();

  var Euler = function () {
  	function Euler() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Euler);


  		this.x = x;

  		this.y = y;

  		this.z = z;

  		this.order = Euler.defaultOrder;
  	}

  	createClass(Euler, [{
  		key: "set",
  		value: function set$$1(x, y, z, order) {

  			this.x = x;
  			this.y = y;
  			this.z = z;
  			this.order = z;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(e) {

  			this.x = e.x;
  			this.y = e.y;
  			this.z = e.z;
  			this.order = e.order;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z, this.order);
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];
  			this.order = array[offset + 3];

  			return this;
  		}
  	}, {
  		key: "toArray",
  		value: function toArray$$1() {
  			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			array[offset] = this.x;
  			array[offset + 1] = this.y;
  			array[offset + 2] = this.z;
  			array[offset + 3] = this.order;

  			return array;
  		}
  	}, {
  		key: "toVector3",
  		value: function toVector3() {
  			var vector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return vector.set(this.x, this.y, this.z);
  		}
  	}, {
  		key: "setFromRotationMatrix",
  		value: function setFromRotationMatrix(m) {
  			var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.order;


  			var te = m.elements;
  			var m00 = te[0],
  			    m01 = te[4],
  			    m02 = te[8];
  			var m10 = te[1],
  			    m11 = te[5],
  			    m12 = te[9];
  			var m20 = te[2],
  			    m21 = te[6],
  			    m22 = te[10];

  			var THRESHOLD = 1.0 - 1e-5;

  			switch (order) {

  				case RotationOrder.XYZ:
  					{

  						this.y = Math.asin(clamp(m02, -1, 1));

  						if (Math.abs(m02) < THRESHOLD) {

  							this.x = Math.atan2(-m12, m22);
  							this.z = Math.atan2(-m01, m00);
  						} else {

  							this.x = Math.atan2(m21, m11);
  							this.z = 0;
  						}

  						break;
  					}

  				case RotationOrder.YXZ:
  					{

  						this.x = Math.asin(-clamp(m12, -1, 1));

  						if (Math.abs(m12) < THRESHOLD) {

  							this.y = Math.atan2(m02, m22);
  							this.z = Math.atan2(m10, m11);
  						} else {

  							this.y = Math.atan2(-m20, m00);
  							this.z = 0;
  						}

  						break;
  					}

  				case RotationOrder.ZXY:
  					{

  						this.x = Math.asin(clamp(m21, -1, 1));

  						if (Math.abs(m21) < THRESHOLD) {

  							this.y = Math.atan2(-m20, m22);
  							this.z = Math.atan2(-m01, m11);
  						} else {

  							this.y = 0;
  							this.z = Math.atan2(m10, m00);
  						}

  						break;
  					}

  				case RotationOrder.ZYX:
  					{

  						this.y = Math.asin(-clamp(m20, -1, 1));

  						if (Math.abs(m20) < THRESHOLD) {

  							this.x = Math.atan2(m21, m22);
  							this.z = Math.atan2(m10, m00);
  						} else {

  							this.x = 0;
  							this.z = Math.atan2(-m01, m11);
  						}

  						break;
  					}

  				case RotationOrder.YZX:
  					{

  						this.z = Math.asin(clamp(m10, -1, 1));

  						if (Math.abs(m10) < THRESHOLD) {

  							this.x = Math.atan2(-m12, m11);
  							this.y = Math.atan2(-m20, m00);
  						} else {

  							this.x = 0;
  							this.y = Math.atan2(m02, m22);
  						}

  						break;
  					}

  				case RotationOrder.XZY:
  					{

  						this.z = Math.asin(-clamp(m01, -1, 1));

  						if (Math.abs(m01) < THRESHOLD) {

  							this.x = Math.atan2(m21, m11);
  							this.y = Math.atan2(m02, m00);
  						} else {

  							this.x = Math.atan2(-m12, m22);
  							this.y = 0;
  						}

  						break;
  					}

  			}

  			this.order = order;

  			return this;
  		}
  	}, {
  		key: "setFromQuaternion",
  		value: function setFromQuaternion(q, order) {

  			m.makeRotationFromQuaternion(q);

  			return this.setFromRotationMatrix(m, order);
  		}
  	}, {
  		key: "setFromVector3",
  		value: function setFromVector3(v) {
  			var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.order;


  			return this.set(v.x, v.y, v.z, order);
  		}
  	}, {
  		key: "reorder",
  		value: function reorder(newOrder) {

  			q.setFromEuler(this);

  			return this.setFromQuaternion(q, newOrder);
  		}
  	}, {
  		key: "equals",
  		value: function equals(e) {

  			return e.x === this.x && e.y === this.y && e.z === this.z && e.order === this.order;
  		}
  	}], [{
  		key: "defaultOrder",
  		get: function get$$1() {
  			return RotationOrder.XYZ;
  		}
  	}]);
  	return Euler;
  }();

  var a = new Vector3$1();

  var b = new Vector3$1();

  var Line3 = function () {
  	function Line3() {
  		var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
  		classCallCheck(this, Line3);


  		this.start = start;

  		this.end = end;
  	}

  	createClass(Line3, [{
  		key: "set",
  		value: function set$$1(start, end) {

  			this.start.copy(start);
  			this.end.copy(end);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(l) {

  			this.start.copy(l.start);
  			this.end.copy(l.end);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  		}
  	}, {
  		key: "delta",
  		value: function delta() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.subVectors(this.end, this.start);
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.start.distanceToSquared(this.end);
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return this.start.distanceTo(this.end);
  		}
  	}, {
  		key: "at",
  		value: function at(d, target) {

  			return this.delta(target).multiplyScalar(d).add(this.start);
  		}
  	}, {
  		key: "closestPointToPointParameter",
  		value: function closestPointToPointParameter(p, clampToLine) {

  			a.subVectors(p, this.start);
  			b.subVectors(this.end, this.start);

  			var bb = b.dot(b);
  			var ba = b.dot(a);

  			var t = clampToLine ? Math.min(Math.max(ba / bb, 0), 1) : ba / bb;

  			return t;
  		}
  	}, {
  		key: "closestPointToPoint",
  		value: function closestPointToPoint(p) {
  			var clampToLine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  			var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector3$1();


  			var t = this.closestPointToPointParameter(p, clampToLine);

  			return this.delta(target).multiplyScalar(t).add(this.start);
  		}
  	}, {
  		key: "equals",
  		value: function equals(l) {

  			return l.start.equals(this.start) && l.end.equals(this.end);
  		}
  	}]);
  	return Line3;
  }();

  var a$1 = new Vector3$1();

  var b$1 = new Vector3$1();

  var c$1 = new Vector3$1();

  var Matrix4$1 = function () {
  		function Matrix4$$1() {
  				classCallCheck(this, Matrix4$$1);


  				this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  		}

  		createClass(Matrix4$$1, [{
  				key: "set",
  				value: function set$$1(n00, n01, n02, n03, n10, n11, n12, n13, n20, n21, n22, n23, n30, n31, n32, n33) {

  						var te = this.elements;

  						te[0] = n00;te[4] = n01;te[8] = n02;te[12] = n03;
  						te[1] = n10;te[5] = n11;te[9] = n12;te[13] = n13;
  						te[2] = n20;te[6] = n21;te[10] = n22;te[14] = n23;
  						te[3] = n30;te[7] = n31;te[11] = n32;te[15] = n33;

  						return this;
  				}
  		}, {
  				key: "identity",
  				value: function identity() {

  						this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "copy",
  				value: function copy(matrix) {

  						var me = matrix.elements;
  						var te = this.elements;

  						te[0] = me[0];te[1] = me[1];te[2] = me[2];te[3] = me[3];
  						te[4] = me[4];te[5] = me[5];te[6] = me[6];te[7] = me[7];
  						te[8] = me[8];te[9] = me[9];te[10] = me[10];te[11] = me[11];
  						te[12] = me[12];te[13] = me[13];te[14] = me[14];te[15] = me[15];

  						return this;
  				}
  		}, {
  				key: "clone",
  				value: function clone() {

  						return new this.constructor().fromArray(this.elements);
  				}
  		}, {
  				key: "fromArray",
  				value: function fromArray(array) {
  						var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  						var te = this.elements;

  						var i = void 0;

  						for (i = 0; i < 16; ++i) {

  								te[i] = array[i + offset];
  						}

  						return this;
  				}
  		}, {
  				key: "toArray",
  				value: function toArray$$1() {
  						var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  						var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  						var te = this.elements;

  						var i = void 0;

  						for (i = 0; i < 16; ++i) {

  								array[i + offset] = te[i];
  						}

  						return array;
  				}
  		}, {
  				key: "getMaxScaleOnAxis",
  				value: function getMaxScaleOnAxis() {

  						var te = this.elements;

  						var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
  						var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
  						var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

  						return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  				}
  		}, {
  				key: "copyPosition",
  				value: function copyPosition(matrix) {

  						var te = this.elements;
  						var me = matrix.elements;

  						te[12] = me[12];
  						te[13] = me[13];
  						te[14] = me[14];

  						return this;
  				}
  		}, {
  				key: "setPosition",
  				value: function setPosition(p) {

  						var te = this.elements;

  						te[12] = p.x;
  						te[13] = p.y;
  						te[14] = p.z;

  						return this;
  				}
  		}, {
  				key: "extractBasis",
  				value: function extractBasis(xAxis, yAxis, zAxis) {

  						xAxis.setFromMatrixColumn(this, 0);
  						yAxis.setFromMatrixColumn(this, 1);
  						zAxis.setFromMatrixColumn(this, 2);

  						return this;
  				}
  		}, {
  				key: "makeBasis",
  				value: function makeBasis(xAxis, yAxis, zAxis) {

  						this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "extractRotation",
  				value: function extractRotation(m) {

  						var te = this.elements;
  						var me = m.elements;

  						var scaleX = 1.0 / a$1.setFromMatrixColumn(m, 0).length();
  						var scaleY = 1.0 / a$1.setFromMatrixColumn(m, 1).length();
  						var scaleZ = 1.0 / a$1.setFromMatrixColumn(m, 2).length();

  						te[0] = me[0] * scaleX;
  						te[1] = me[1] * scaleX;
  						te[2] = me[2] * scaleX;

  						te[4] = me[4] * scaleY;
  						te[5] = me[5] * scaleY;
  						te[6] = me[6] * scaleY;

  						te[8] = me[8] * scaleZ;
  						te[9] = me[9] * scaleZ;
  						te[10] = me[10] * scaleZ;

  						return this;
  				}
  		}, {
  				key: "makeRotationFromEuler",
  				value: function makeRotationFromEuler(euler) {

  						var te = this.elements;

  						var x = euler.x;
  						var y = euler.y;
  						var z = euler.z;

  						var a = Math.cos(x),
  						    b = Math.sin(x);
  						var c = Math.cos(y),
  						    d = Math.sin(y);
  						var e = Math.cos(z),
  						    f = Math.sin(z);

  						var ae = void 0,
  						    af = void 0,
  						    be = void 0,
  						    bf = void 0;
  						var ce = void 0,
  						    cf = void 0,
  						    de = void 0,
  						    df = void 0;
  						var ac = void 0,
  						    ad = void 0,
  						    bc = void 0,
  						    bd = void 0;

  						switch (euler.order) {

  								case RotationOrder.XYZ:
  										{

  												ae = a * e, af = a * f, be = b * e, bf = b * f;

  												te[0] = c * e;
  												te[4] = -c * f;
  												te[8] = d;

  												te[1] = af + be * d;
  												te[5] = ae - bf * d;
  												te[9] = -b * c;

  												te[2] = bf - ae * d;
  												te[6] = be + af * d;
  												te[10] = a * c;

  												break;
  										}

  								case RotationOrder.YXZ:
  										{

  												ce = c * e, cf = c * f, de = d * e, df = d * f;

  												te[0] = ce + df * b;
  												te[4] = de * b - cf;
  												te[8] = a * d;

  												te[1] = a * f;
  												te[5] = a * e;
  												te[9] = -b;

  												te[2] = cf * b - de;
  												te[6] = df + ce * b;
  												te[10] = a * c;

  												break;
  										}

  								case RotationOrder.ZXY:
  										{

  												ce = c * e, cf = c * f, de = d * e, df = d * f;

  												te[0] = ce - df * b;
  												te[4] = -a * f;
  												te[8] = de + cf * b;

  												te[1] = cf + de * b;
  												te[5] = a * e;
  												te[9] = df - ce * b;

  												te[2] = -a * d;
  												te[6] = b;
  												te[10] = a * c;

  												break;
  										}

  								case RotationOrder.ZYX:
  										{

  												ae = a * e, af = a * f, be = b * e, bf = b * f;

  												te[0] = c * e;
  												te[4] = be * d - af;
  												te[8] = ae * d + bf;

  												te[1] = c * f;
  												te[5] = bf * d + ae;
  												te[9] = af * d - be;

  												te[2] = -d;
  												te[6] = b * c;
  												te[10] = a * c;

  												break;
  										}

  								case RotationOrder.YZX:
  										{

  												ac = a * c, ad = a * d, bc = b * c, bd = b * d;

  												te[0] = c * e;
  												te[4] = bd - ac * f;
  												te[8] = bc * f + ad;

  												te[1] = f;
  												te[5] = a * e;
  												te[9] = -b * e;

  												te[2] = -d * e;
  												te[6] = ad * f + bc;
  												te[10] = ac - bd * f;

  												break;
  										}

  								case RotationOrder.XZY:
  										{

  												ac = a * c, ad = a * d, bc = b * c, bd = b * d;

  												te[0] = c * e;
  												te[4] = -f;
  												te[8] = d * e;

  												te[1] = ac * f + bd;
  												te[5] = a * e;
  												te[9] = ad * f - bc;

  												te[2] = bc * f - ad;
  												te[6] = b * e;
  												te[10] = bd * f + ac;

  												break;
  										}

  						}

  						te[3] = 0;
  						te[7] = 0;
  						te[11] = 0;

  						te[12] = 0;
  						te[13] = 0;
  						te[14] = 0;
  						te[15] = 1;

  						return this;
  				}
  		}, {
  				key: "makeRotationFromQuaternion",
  				value: function makeRotationFromQuaternion(q) {

  						var te = this.elements;

  						var x = q.x,
  						    y = q.y,
  						    z = q.z,
  						    w = q.w;
  						var x2 = x + x,
  						    y2 = y + y,
  						    z2 = z + z;
  						var xx = x * x2,
  						    xy = x * y2,
  						    xz = x * z2;
  						var yy = y * y2,
  						    yz = y * z2,
  						    zz = z * z2;
  						var wx = w * x2,
  						    wy = w * y2,
  						    wz = w * z2;

  						te[0] = 1 - (yy + zz);
  						te[4] = xy - wz;
  						te[8] = xz + wy;

  						te[1] = xy + wz;
  						te[5] = 1 - (xx + zz);
  						te[9] = yz - wx;

  						te[2] = xz - wy;
  						te[6] = yz + wx;
  						te[10] = 1 - (xx + yy);

  						te[3] = 0;
  						te[7] = 0;
  						te[11] = 0;

  						te[12] = 0;
  						te[13] = 0;
  						te[14] = 0;
  						te[15] = 1;

  						return this;
  				}
  		}, {
  				key: "lookAt",
  				value: function lookAt(eye, target, up) {

  						var te = this.elements;
  						var x = a$1,
  						    y = b$1,
  						    z = c$1;

  						z.subVectors(eye, target);

  						if (z.lengthSquared() === 0) {
  								z.z = 1;
  						}

  						z.normalize();
  						x.crossVectors(up, z);

  						if (x.lengthSquared() === 0) {
  								if (Math.abs(up.z) === 1) {

  										z.x += 1e-4;
  								} else {

  										z.z += 1e-4;
  								}

  								z.normalize();
  								x.crossVectors(up, z);
  						}

  						x.normalize();
  						y.crossVectors(z, x);

  						te[0] = x.x;te[4] = y.x;te[8] = z.x;
  						te[1] = x.y;te[5] = y.y;te[9] = z.y;
  						te[2] = x.z;te[6] = y.z;te[10] = z.z;

  						return this;
  				}
  		}, {
  				key: "multiplyMatrices",
  				value: function multiplyMatrices(a, b) {

  						var te = this.elements;
  						var ae = a.elements;
  						var be = b.elements;

  						var a00 = ae[0],
  						    a01 = ae[4],
  						    a02 = ae[8],
  						    a03 = ae[12];
  						var a10 = ae[1],
  						    a11 = ae[5],
  						    a12 = ae[9],
  						    a13 = ae[13];
  						var a20 = ae[2],
  						    a21 = ae[6],
  						    a22 = ae[10],
  						    a23 = ae[14];
  						var a30 = ae[3],
  						    a31 = ae[7],
  						    a32 = ae[11],
  						    a33 = ae[15];

  						var b00 = be[0],
  						    b01 = be[4],
  						    b02 = be[8],
  						    b03 = be[12];
  						var b10 = be[1],
  						    b11 = be[5],
  						    b12 = be[9],
  						    b13 = be[13];
  						var b20 = be[2],
  						    b21 = be[6],
  						    b22 = be[10],
  						    b23 = be[14];
  						var b30 = be[3],
  						    b31 = be[7],
  						    b32 = be[11],
  						    b33 = be[15];

  						te[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
  						te[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
  						te[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
  						te[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

  						te[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
  						te[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
  						te[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
  						te[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

  						te[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
  						te[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
  						te[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
  						te[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

  						te[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
  						te[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
  						te[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
  						te[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

  						return this;
  				}
  		}, {
  				key: "multiply",
  				value: function multiply(m) {

  						return this.multiplyMatrices(this, m);
  				}
  		}, {
  				key: "premultiply",
  				value: function premultiply(m) {

  						return this.multiplyMatrices(m, this);
  				}
  		}, {
  				key: "multiplyScalar",
  				value: function multiplyScalar(s) {

  						var te = this.elements;

  						te[0] *= s;te[4] *= s;te[8] *= s;te[12] *= s;
  						te[1] *= s;te[5] *= s;te[9] *= s;te[13] *= s;
  						te[2] *= s;te[6] *= s;te[10] *= s;te[14] *= s;
  						te[3] *= s;te[7] *= s;te[11] *= s;te[15] *= s;

  						return this;
  				}
  		}, {
  				key: "determinant",
  				value: function determinant() {

  						var te = this.elements;

  						var n00 = te[0],
  						    n01 = te[4],
  						    n02 = te[8],
  						    n03 = te[12];
  						var n10 = te[1],
  						    n11 = te[5],
  						    n12 = te[9],
  						    n13 = te[13];
  						var n20 = te[2],
  						    n21 = te[6],
  						    n22 = te[10],
  						    n23 = te[14];
  						var n30 = te[3],
  						    n31 = te[7],
  						    n32 = te[11],
  						    n33 = te[15];

  						var n00n11 = n00 * n11,
  						    n00n12 = n00 * n12,
  						    n00n13 = n00 * n13;
  						var n01n10 = n01 * n10,
  						    n01n12 = n01 * n12,
  						    n01n13 = n01 * n13;
  						var n02n10 = n02 * n10,
  						    n02n11 = n02 * n11,
  						    n02n13 = n02 * n13;
  						var n03n10 = n03 * n10,
  						    n03n11 = n03 * n11,
  						    n03n12 = n03 * n12;

  						return n30 * (n03n12 * n21 - n02n13 * n21 - n03n11 * n22 + n01n13 * n22 + n02n11 * n23 - n01n12 * n23) + n31 * (n00n12 * n23 - n00n13 * n22 + n03n10 * n22 - n02n10 * n23 + n02n13 * n20 - n03n12 * n20) + n32 * (n00n13 * n21 - n00n11 * n23 - n03n10 * n21 + n01n10 * n23 + n03n11 * n20 - n01n13 * n20) + n33 * (-n02n11 * n20 - n00n12 * n21 + n00n11 * n22 + n02n10 * n21 - n01n10 * n22 + n01n12 * n20);
  				}
  		}, {
  				key: "getInverse",
  				value: function getInverse(matrix) {

  						var te = this.elements;
  						var me = matrix.elements;

  						var n00 = me[0],
  						    n10 = me[1],
  						    n20 = me[2],
  						    n30 = me[3];
  						var n01 = me[4],
  						    n11 = me[5],
  						    n21 = me[6],
  						    n31 = me[7];
  						var n02 = me[8],
  						    n12 = me[9],
  						    n22 = me[10],
  						    n32 = me[11];
  						var n03 = me[12],
  						    n13 = me[13],
  						    n23 = me[14],
  						    n33 = me[15];

  						var t00 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
  						var t01 = n03 * n22 * n31 - n02 * n23 * n31 - n03 * n21 * n32 + n01 * n23 * n32 + n02 * n21 * n33 - n01 * n22 * n33;
  						var t02 = n02 * n13 * n31 - n03 * n12 * n31 + n03 * n11 * n32 - n01 * n13 * n32 - n02 * n11 * n33 + n01 * n12 * n33;
  						var t03 = n03 * n12 * n21 - n02 * n13 * n21 - n03 * n11 * n22 + n01 * n13 * n22 + n02 * n11 * n23 - n01 * n12 * n23;

  						var det = n00 * t00 + n10 * t01 + n20 * t02 + n30 * t03;

  						var invDet = void 0;

  						if (det !== 0) {

  								invDet = 1.0 / det;

  								te[0] = t00 * invDet;
  								te[1] = (n13 * n22 * n30 - n12 * n23 * n30 - n13 * n20 * n32 + n10 * n23 * n32 + n12 * n20 * n33 - n10 * n22 * n33) * invDet;
  								te[2] = (n11 * n23 * n30 - n13 * n21 * n30 + n13 * n20 * n31 - n10 * n23 * n31 - n11 * n20 * n33 + n10 * n21 * n33) * invDet;
  								te[3] = (n12 * n21 * n30 - n11 * n22 * n30 - n12 * n20 * n31 + n10 * n22 * n31 + n11 * n20 * n32 - n10 * n21 * n32) * invDet;

  								te[4] = t01 * invDet;
  								te[5] = (n02 * n23 * n30 - n03 * n22 * n30 + n03 * n20 * n32 - n00 * n23 * n32 - n02 * n20 * n33 + n00 * n22 * n33) * invDet;
  								te[6] = (n03 * n21 * n30 - n01 * n23 * n30 - n03 * n20 * n31 + n00 * n23 * n31 + n01 * n20 * n33 - n00 * n21 * n33) * invDet;
  								te[7] = (n01 * n22 * n30 - n02 * n21 * n30 + n02 * n20 * n31 - n00 * n22 * n31 - n01 * n20 * n32 + n00 * n21 * n32) * invDet;

  								te[8] = t02 * invDet;
  								te[9] = (n03 * n12 * n30 - n02 * n13 * n30 - n03 * n10 * n32 + n00 * n13 * n32 + n02 * n10 * n33 - n00 * n12 * n33) * invDet;
  								te[10] = (n01 * n13 * n30 - n03 * n11 * n30 + n03 * n10 * n31 - n00 * n13 * n31 - n01 * n10 * n33 + n00 * n11 * n33) * invDet;
  								te[11] = (n02 * n11 * n30 - n01 * n12 * n30 - n02 * n10 * n31 + n00 * n12 * n31 + n01 * n10 * n32 - n00 * n11 * n32) * invDet;

  								te[12] = t03 * invDet;
  								te[13] = (n02 * n13 * n20 - n03 * n12 * n20 + n03 * n10 * n22 - n00 * n13 * n22 - n02 * n10 * n23 + n00 * n12 * n23) * invDet;
  								te[14] = (n03 * n11 * n20 - n01 * n13 * n20 - n03 * n10 * n21 + n00 * n13 * n21 + n01 * n10 * n23 - n00 * n11 * n23) * invDet;
  								te[15] = (n01 * n12 * n20 - n02 * n11 * n20 + n02 * n10 * n21 - n00 * n12 * n21 - n01 * n10 * n22 + n00 * n11 * n22) * invDet;
  						} else {

  								console.error("Can't invert matrix, determinant is zero", matrix);

  								this.identity();
  						}

  						return this;
  				}
  		}, {
  				key: "transpose",
  				value: function transpose() {

  						var te = this.elements;

  						var t = void 0;

  						t = te[1];te[1] = te[4];te[4] = t;
  						t = te[2];te[2] = te[8];te[8] = t;
  						t = te[6];te[6] = te[9];te[9] = t;

  						t = te[3];te[3] = te[12];te[12] = t;
  						t = te[7];te[7] = te[13];te[13] = t;
  						t = te[11];te[11] = te[14];te[14] = t;

  						return this;
  				}
  		}, {
  				key: "scale",
  				value: function scale(sx, sy, sz) {

  						var te = this.elements;

  						te[0] *= sx;te[4] *= sy;te[8] *= sz;
  						te[1] *= sx;te[5] *= sy;te[9] *= sz;
  						te[2] *= sx;te[6] *= sy;te[10] *= sz;
  						te[3] *= sx;te[7] *= sy;te[11] *= sz;

  						return this;
  				}
  		}, {
  				key: "makeScale",
  				value: function makeScale(x, y, z) {

  						this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeTranslation",
  				value: function makeTranslation(x, y, z) {

  						this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeRotationX",
  				value: function makeRotationX(theta) {

  						var c = Math.cos(theta),
  						    s = Math.sin(theta);

  						this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeRotationY",
  				value: function makeRotationY(theta) {

  						var c = Math.cos(theta),
  						    s = Math.sin(theta);

  						this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeRotationZ",
  				value: function makeRotationZ(theta) {

  						var c = Math.cos(theta),
  						    s = Math.sin(theta);

  						this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeRotationAxis",
  				value: function makeRotationAxis(axis, angle) {

  						var c = Math.cos(angle);
  						var s = Math.sin(angle);

  						var t = 1.0 - c;

  						var x = axis.x,
  						    y = axis.y,
  						    z = axis.z;
  						var tx = t * x,
  						    ty = t * y;

  						this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "makeShear",
  				value: function makeShear(x, y, z) {

  						this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);

  						return this;
  				}
  		}, {
  				key: "compose",
  				value: function compose(position, quaternion, scale) {

  						this.makeRotationFromQuaternion(quaternion);
  						this.scale(scale.x, scale.y, scale.z);
  						this.setPosition(position);

  						return this;
  				}
  		}, {
  				key: "decompose",
  				value: function decompose(position, quaternion, scale) {

  						var te = this.elements;

  						var n00 = te[0],
  						    n10 = te[1],
  						    n20 = te[2];
  						var n01 = te[4],
  						    n11 = te[5],
  						    n21 = te[6];
  						var n02 = te[8],
  						    n12 = te[9],
  						    n22 = te[10];

  						var det = this.determinant();

  						var sx = a$1.set(n00, n10, n20).length() * (det < 0 ? -1 : 1);
  						var sy = a$1.set(n01, n11, n21).length();
  						var sz = a$1.set(n02, n12, n22).length();

  						var invSX = 1.0 / sx;
  						var invSY = 1.0 / sy;
  						var invSZ = 1.0 / sz;

  						position.x = te[12];
  						position.y = te[13];
  						position.z = te[14];

  						te[0] *= invSX;te[1] *= invSX;te[2] *= invSX;
  						te[4] *= invSY;te[5] *= invSY;te[6] *= invSY;
  						te[8] *= invSZ;te[9] *= invSZ;te[10] *= invSZ;

  						quaternion.setFromRotationMatrix(this);

  						te[0] = n00;te[1] = n10;te[2] = n20;
  						te[4] = n01;te[5] = n11;te[6] = n21;
  						te[8] = n02;te[9] = n12;te[10] = n22;

  						scale.x = sx;
  						scale.y = sy;
  						scale.z = sz;

  						return this;
  				}
  		}, {
  				key: "makePerspective",
  				value: function makePerspective(left, right, top, bottom, near, far) {

  						var te = this.elements;
  						var x = 2 * near / (right - left);
  						var y = 2 * near / (top - bottom);

  						var a = (right + left) / (right - left);
  						var b = (top + bottom) / (top - bottom);
  						var c = -(far + near) / (far - near);
  						var d = -2 * far * near / (far - near);

  						te[0] = x;te[4] = 0;te[8] = a;te[12] = 0;
  						te[1] = 0;te[5] = y;te[9] = b;te[13] = 0;
  						te[2] = 0;te[6] = 0;te[10] = c;te[14] = d;
  						te[3] = 0;te[7] = 0;te[11] = -1;te[15] = 0;

  						return this;
  				}
  		}, {
  				key: "makeOrthographic",
  				value: function makeOrthographic(left, right, top, bottom, near, far) {

  						var te = this.elements;
  						var w = 1.0 / (right - left);
  						var h = 1.0 / (top - bottom);
  						var p = 1.0 / (far - near);

  						var x = (right + left) * w;
  						var y = (top + bottom) * h;
  						var z = (far + near) * p;

  						te[0] = 2 * w;te[4] = 0;te[8] = 0;te[12] = -x;
  						te[1] = 0;te[5] = 2 * h;te[9] = 0;te[13] = -y;
  						te[2] = 0;te[6] = 0;te[10] = -2 * p;te[14] = -z;
  						te[3] = 0;te[7] = 0;te[11] = 0;te[15] = 1;

  						return this;
  				}
  		}, {
  				key: "equals",
  				value: function equals(matrix) {

  						var te = this.elements;
  						var me = matrix.elements;

  						var result = true;
  						var i = void 0;

  						for (i = 0; result && i < 16; ++i) {

  								if (te[i] !== me[i]) {

  										result = false;
  								}
  						}

  						return result;
  				}
  		}]);
  		return Matrix4$$1;
  }();

  var a$2 = new Vector3$1();

  var b$2 = new Vector3$1();

  var Plane = function () {
  	function Plane() {
  		var normal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1(1, 0, 0);
  		var constant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, Plane);


  		this.normal = normal;

  		this.constant = constant;
  	}

  	createClass(Plane, [{
  		key: "set",
  		value: function set$$1(normal, constant) {

  			this.normal.copy(normal);
  			this.constant = constant;

  			return this;
  		}
  	}, {
  		key: "setComponents",
  		value: function setComponents(x, y, z, w) {

  			this.normal.set(x, y, z);
  			this.constant = w;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(p) {

  			this.normal.copy(p.normal);
  			this.constant = p.constant;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "setFromNormalAndCoplanarPoint",
  		value: function setFromNormalAndCoplanarPoint(n, p) {

  			this.normal.copy(n);
  			this.constant = -p.dot(this.normal);

  			return this;
  		}
  	}, {
  		key: "setFromCoplanarPoints",
  		value: function setFromCoplanarPoints(p0, p1, p2) {

  			var normal = a$2.subVectors(p2, p1).cross(b$2.subVectors(p0, p1)).normalize();

  			this.setFromNormalAndCoplanarPoint(normal, a$2);

  			return this;
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			var inverseNormalLength = 1.0 / this.normal.length();

  			this.normal.multiplyScalar(inverseNormalLength);
  			this.constant *= inverseNormalLength;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.normal.negate();
  			this.constant = -this.constant;

  			return this;
  		}
  	}, {
  		key: "distanceToPoint",
  		value: function distanceToPoint(p) {

  			return this.normal.dot(p) + this.constant;
  		}
  	}, {
  		key: "distanceToSphere",
  		value: function distanceToSphere(s) {

  			return this.distanceToPoint(s.center) - s.radius;
  		}
  	}, {
  		key: "projectPoint",
  		value: function projectPoint(p, target) {

  			return target.copy(this.normal).multiplyScalar(-this.distanceToPoint(p)).add(p);
  		}
  	}, {
  		key: "coplanarPoint",
  		value: function coplanarPoint(target) {

  			return target.copy(this.normal).multiplyScalar(-this.constant);
  		}
  	}, {
  		key: "translate",
  		value: function translate(offset) {

  			this.constant -= offset.dot(this.normal);

  			return this;
  		}
  	}, {
  		key: "intersectLine",
  		value: function intersectLine(l, target) {

  			var direction = l.delta(a$2);
  			var denominator = this.normal.dot(direction);

  			if (denominator === 0) {
  				if (this.distanceToPoint(l.start) === 0) {

  					target.copy(l.start);
  				}
  			} else {

  				var t = -(l.start.dot(this.normal) + this.constant) / denominator;

  				if (t >= 0 && t <= 1) {

  					target.copy(direction).multiplyScalar(t).add(l.start);
  				}
  			}

  			return target;
  		}
  	}, {
  		key: "intersectsLine",
  		value: function intersectsLine(l) {

  			var startSign = this.distanceToPoint(l.start);
  			var endSign = this.distanceToPoint(l.end);

  			return startSign < 0 && endSign > 0 || endSign < 0 && startSign > 0;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(b) {

  			return b.intersectsPlane(this);
  		}
  	}, {
  		key: "intersectsSphere",
  		value: function intersectsSphere(s) {

  			return s.intersectsPlane(this);
  		}
  	}, {
  		key: "equals",
  		value: function equals(p) {

  			return p.normal.equals(this.normal) && p.constant === this.constant;
  		}
  	}]);
  	return Plane;
  }();

  var Spherical$1 = function () {
  	function Spherical$$1() {
  		var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  		var phi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var theta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Spherical$$1);


  		this.radius = radius;

  		this.phi = phi;

  		this.theta = theta;
  	}

  	createClass(Spherical$$1, [{
  		key: "set",
  		value: function set$$1(radius, phi, theta) {

  			this.radius = radius;
  			this.phi = phi;
  			this.theta = theta;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(s) {

  			this.radius = s.radius;
  			this.phi = s.phi;
  			this.theta = s.theta;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "setFromVector3",
  		value: function setFromVector3(v) {

  			this.radius = v.length();

  			if (this.radius === 0) {

  				this.theta = 0;
  				this.phi = 0;
  			} else {
  				this.theta = Math.atan2(v.x, v.z);

  				this.phi = Math.acos(Math.min(Math.max(v.y / this.radius, -1), 1));
  			}

  			return this.makeSafe();
  		}
  	}, {
  		key: "makeSafe",
  		value: function makeSafe() {

  			this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi));

  			return this;
  		}
  	}]);
  	return Spherical$$1;
  }();

  var SymmetricMatrix3 = function () {
  	function SymmetricMatrix3() {
  		classCallCheck(this, SymmetricMatrix3);


  		this.elements = new Float32Array([1, 0, 0, 1, 0, 1]);
  	}

  	createClass(SymmetricMatrix3, [{
  		key: "set",
  		value: function set$$1(m00, m01, m02, m11, m12, m22) {

  			var e = this.elements;

  			e[0] = m00;
  			e[1] = m01;e[3] = m11;
  			e[2] = m02;e[4] = m12;e[5] = m22;

  			return this;
  		}
  	}, {
  		key: "identity",
  		value: function identity() {

  			this.set(1, 0, 0, 1, 0, 1);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(m) {

  			var me = m.elements;

  			this.set(me[0], me[1], me[2], me[3], me[4], me[5]);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "toMatrix3",
  		value: function toMatrix3(m) {

  			var me = m.elements;

  			m.set(me[0], me[1], me[2], me[1], me[3], me[4], me[2], me[4], me[5]);
  		}
  	}, {
  		key: "add",
  		value: function add(m) {

  			var te = this.elements;
  			var me = m.elements;

  			te[0] += me[0];
  			te[1] += me[1];te[3] += me[3];
  			te[2] += me[2];te[4] += me[4];te[5] += me[5];

  			return this;
  		}
  	}, {
  		key: "norm",
  		value: function norm() {

  			var e = this.elements;

  			var m01m01 = e[1] * e[1];
  			var m02m02 = e[2] * e[2];
  			var m12m12 = e[4] * e[4];

  			return Math.sqrt(e[0] * e[0] + m01m01 + m02m02 + m01m01 + e[3] * e[3] + m12m12 + m02m02 + m12m12 + e[5] * e[5]);
  		}
  	}, {
  		key: "off",
  		value: function off() {

  			var e = this.elements;

  			return Math.sqrt(2 * (e[1] * e[1] + e[2] * e[2] + e[4] * e[4]));
  		}
  	}, {
  		key: "applyToVector3",
  		value: function applyToVector3(v) {

  			var x = v.x,
  			    y = v.y,
  			    z = v.z;
  			var e = this.elements;

  			v.x = e[0] * x + e[1] * y + e[2] * z;
  			v.y = e[1] * x + e[3] * y + e[4] * z;
  			v.z = e[2] * x + e[4] * y + e[5] * z;

  			return v;
  		}
  	}, {
  		key: "equals",
  		value: function equals(matrix) {

  			var te = this.elements;
  			var me = matrix.elements;

  			var result = true;
  			var i = void 0;

  			for (i = 0; result && i < 6; ++i) {

  				if (te[i] !== me[i]) {

  					result = false;
  				}
  			}

  			return result;
  		}
  	}], [{
  		key: "calculateIndex",
  		value: function calculateIndex(i, j) {

  			return 3 - (3 - i) * (2 - i) / 2 + j;
  		}
  	}]);
  	return SymmetricMatrix3;
  }();

  var Vector4 = function () {
  	function Vector4() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  		classCallCheck(this, Vector4);


  		this.x = x;

  		this.y = y;

  		this.z = z;

  		this.w = w;
  	}

  	createClass(Vector4, [{
  		key: "set",
  		value: function set$$1(x, y, z, w) {

  			this.x = x;
  			this.y = y;
  			this.z = z;
  			this.w = w;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;
  			this.z = v.z;
  			this.w = v.w;

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z, this.w);
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];
  			this.w = array[offset + 3];

  			return this;
  		}
  	}, {
  		key: "toArray",
  		value: function toArray$$1() {
  			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			array[offset] = this.x;
  			array[offset + 1] = this.y;
  			array[offset + 2] = this.z;
  			array[offset + 3] = this.w;

  			return array;
  		}
  	}, {
  		key: "setAxisAngleFromQuaternion",
  		value: function setAxisAngleFromQuaternion(q) {

  			this.w = 2 * Math.acos(q.w);

  			var s = Math.sqrt(1 - q.w * q.w);

  			if (s < 1e-4) {

  				this.x = 1;
  				this.y = 0;
  				this.z = 0;
  			} else {

  				this.x = q.x / s;
  				this.y = q.y / s;
  				this.z = q.z / s;
  			}

  			return this;
  		}
  	}, {
  		key: "setAxisAngleFromRotationMatrix",
  		value: function setAxisAngleFromRotationMatrix(m) {
  			var E = 0.01;

  			var H = 0.1;

  			var me = m.elements;
  			var m00 = me[0],
  			    m01 = me[4],
  			    m02 = me[8];
  			var m10 = me[1],
  			    m11 = me[5],
  			    m12 = me[9];
  			var m20 = me[2],
  			    m21 = me[6],
  			    m22 = me[10];

  			var angle = void 0;
  			var x = void 0,
  			    y = void 0,
  			    z = void 0;
  			var xx = void 0,
  			    yy = void 0,
  			    zz = void 0;
  			var xy = void 0,
  			    xz = void 0,
  			    yz = void 0;
  			var s = void 0;

  			if (Math.abs(m01 - m10) < E && Math.abs(m02 - m20) < E && Math.abs(m12 - m21) < E) {
  				if (Math.abs(m01 + m10) < H && Math.abs(m02 + m20) < H && Math.abs(m12 + m21) < H && Math.abs(m00 + m11 + m22 - 3) < H) {
  					this.set(1, 0, 0, 0);
  				} else {
  					angle = Math.PI;

  					xx = (m00 + 1) / 2;
  					yy = (m11 + 1) / 2;
  					zz = (m22 + 1) / 2;
  					xy = (m01 + m10) / 4;
  					xz = (m02 + m20) / 4;
  					yz = (m12 + m21) / 4;

  					if (xx > yy && xx > zz) {
  						if (xx < E) {

  							x = 0;
  							y = 0.707106781;
  							z = 0.707106781;
  						} else {

  							x = Math.sqrt(xx);
  							y = xy / x;
  							z = xz / x;
  						}
  					} else if (yy > zz) {
  						if (yy < E) {

  							x = 0.707106781;
  							y = 0;
  							z = 0.707106781;
  						} else {

  							y = Math.sqrt(yy);
  							x = xy / y;
  							z = yz / y;
  						}
  					} else {
  						if (zz < E) {

  							x = 0.707106781;
  							y = 0.707106781;
  							z = 0;
  						} else {

  							z = Math.sqrt(zz);
  							x = xz / z;
  							y = yz / z;
  						}
  					}

  					this.set(x, y, z, angle);
  				}
  			} else {
  				s = Math.sqrt((m21 - m12) * (m21 - m12) + (m02 - m20) * (m02 - m20) + (m10 - m01) * (m10 - m01));

  				if (Math.abs(s) < 0.001) {
  					s = 1;
  				}

  				this.x = (m21 - m12) / s;
  				this.y = (m02 - m20) / s;
  				this.z = (m10 - m01) / s;
  				this.w = Math.acos((m00 + m11 + m22 - 1) / 2);
  			}

  			return this;
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;
  			this.z += v.z;
  			this.w += v.w;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;
  			this.z += s;
  			this.w += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;
  			this.z = a.z + b.z;
  			this.w = a.w + b.w;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;
  			this.z += v.z * s;
  			this.w += v.w * s;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;
  			this.z -= v.z;
  			this.w -= v.w;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;
  			this.z -= s;
  			this.w -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;
  			this.z = a.z - b.z;
  			this.w = a.w - b.w;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;
  			this.z *= v.z;
  			this.w *= v.w;

  			return this;
  		}
  	}, {
  		key: "multiplyScalar",
  		value: function multiplyScalar(s) {

  			this.x *= s;
  			this.y *= s;
  			this.z *= s;
  			this.w *= s;

  			return this;
  		}
  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

  			this.x = a.x * b.x;
  			this.y = a.y * b.y;
  			this.z = a.z * b.z;
  			this.w = a.w * b.w;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;
  			this.z /= v.z;
  			this.w /= v.w;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			this.x /= s;
  			this.y /= s;
  			this.z /= s;
  			this.w /= s;

  			return this;
  		}
  	}, {
  		key: "applyMatrix4",
  		value: function applyMatrix4(m) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z,
  			    w = this.w;
  			var e = m.elements;

  			this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
  			this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
  			this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
  			this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;
  			this.z = -this.z;
  			this.w = -this.w;

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  		}
  	}, {
  		key: "lengthManhattan",
  		value: function lengthManhattan() {

  			return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  		}
  	}, {
  		key: "lengthSquared",
  		value: function lengthSquared() {

  			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  		}
  	}, {
  		key: "distanceToManhattan",
  		value: function distanceToManhattan(v) {

  			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z) + Math.abs(this.w - v.w);
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;
  			var dz = this.z - v.z;
  			var dw = this.w - v.w;

  			return dx * dx + dy * dy + dz * dz + dw * dw;
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "setLength",
  		value: function setLength(length) {

  			return this.normalize().multiplyScalar(length);
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);
  			this.z = Math.min(this.z, v.z);
  			this.w = Math.min(this.w, v.w);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);
  			this.z = Math.max(this.z, v.z);
  			this.w = Math.max(this.w, v.w);

  			return this;
  		}
  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

  			this.x = Math.max(min.x, Math.min(max.x, this.x));
  			this.y = Math.max(min.y, Math.min(max.y, this.y));
  			this.z = Math.max(min.z, Math.min(max.z, this.z));
  			this.w = Math.max(min.w, Math.min(max.w, this.w));

  			return this;
  		}
  	}, {
  		key: "floor",
  		value: function floor() {

  			this.x = Math.floor(this.x);
  			this.y = Math.floor(this.y);
  			this.z = Math.floor(this.z);
  			this.w = Math.floor(this.w);

  			return this;
  		}
  	}, {
  		key: "ceil",
  		value: function ceil() {

  			this.x = Math.ceil(this.x);
  			this.y = Math.ceil(this.y);
  			this.z = Math.ceil(this.z);
  			this.w = Math.ceil(this.w);

  			return this;
  		}
  	}, {
  		key: "round",
  		value: function round() {

  			this.x = Math.round(this.x);
  			this.y = Math.round(this.y);
  			this.z = Math.round(this.z);
  			this.w = Math.round(this.w);

  			return this;
  		}
  	}, {
  		key: "lerp",
  		value: function lerp(v, alpha) {

  			this.x += (v.x - this.x) * alpha;
  			this.y += (v.y - this.y) * alpha;
  			this.z += (v.z - this.z) * alpha;
  			this.w += (v.w - this.w) * alpha;

  			return this;
  		}
  	}, {
  		key: "lerpVectors",
  		value: function lerpVectors(v1, v2, alpha) {

  			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
  		}
  	}]);
  	return Vector4;
  }();

  var c$2 = new Vector3$1();

  var Octant = function () {
  	function Octant() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
  		classCallCheck(this, Octant);


  		this.min = min;

  		this.max = max;

  		this.children = null;
  	}

  	createClass(Octant, [{
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.addVectors(this.min, this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.subVectors(this.max, this.min);
  		}
  	}, {
  		key: "split",
  		value: function split() {

  			var min = this.min;
  			var max = this.max;
  			var mid = this.getCenter(c$2);

  			var children = this.children = [null, null, null, null, null, null, null, null];

  			var i = void 0,
  			    combination = void 0;

  			for (i = 0; i < 8; ++i) {

  				combination = pattern[i];

  				children[i] = new this.constructor(new Vector3$1(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3$1(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z));
  			}
  		}
  	}]);
  	return Octant;
  }();

  var pattern = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var c = new Vector3$1();

  var CubicOctant = function () {
  	function CubicOctant() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, CubicOctant);


  		this.min = min;

  		this.size = size;

  		this.children = null;
  	}

  	createClass(CubicOctant, [{
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.min).addScalar(this.size * 0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.set(this.size, this.size, this.size);
  		}
  	}, {
  		key: "split",
  		value: function split() {

  			var min = this.min;
  			var mid = this.getCenter(c);
  			var halfSize = this.size * 0.5;

  			var children = this.children = [null, null, null, null, null, null, null, null];

  			var i = void 0,
  			    combination = void 0;

  			for (i = 0; i < 8; ++i) {

  				combination = pattern[i];

  				children[i] = new this.constructor(new Vector3$1(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize);
  			}
  		}
  	}, {
  		key: "max",
  		get: function get$$1() {
  			return this.min.clone().addScalar(this.size);
  		}
  	}]);
  	return CubicOctant;
  }();

  var IteratorResult = function () {
  	function IteratorResult() {
  		var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  		classCallCheck(this, IteratorResult);


  		this.value = value;

  		this.done = done;
  	}

  	createClass(IteratorResult, [{
  		key: "reset",
  		value: function reset() {

  			this.value = null;
  			this.done = false;
  		}
  	}]);
  	return IteratorResult;
  }();

  var b$4 = new Box3$1();

  var OctantIterator = function () {
  		function OctantIterator(octree) {
  				var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  				classCallCheck(this, OctantIterator);


  				this.octree = octree;

  				this.region = region;

  				this.cull = region !== null;

  				this.result = new IteratorResult();

  				this.trace = null;

  				this.indices = null;

  				this.reset();
  		}

  		createClass(OctantIterator, [{
  				key: "reset",
  				value: function reset() {

  						var root = this.octree.root;

  						this.trace = [];
  						this.indices = [];

  						if (root !== null) {

  								b$4.min = root.min;
  								b$4.max = root.max;

  								if (!this.cull || this.region.intersectsBox(b$4)) {

  										this.trace.push(root);
  										this.indices.push(0);
  								}
  						}

  						this.result.reset();

  						return this;
  				}
  		}, {
  				key: "next",
  				value: function next() {

  						var cull = this.cull;
  						var region = this.region;
  						var indices = this.indices;
  						var trace = this.trace;

  						var octant = null;
  						var depth = trace.length - 1;

  						var index = void 0,
  						    children = void 0,
  						    child = void 0;

  						while (octant === null && depth >= 0) {

  								index = indices[depth];
  								children = trace[depth].children;

  								++indices[depth];

  								if (index < 8) {

  										if (children !== null) {

  												child = children[index];

  												if (cull) {

  														b$4.min = child.min;
  														b$4.max = child.max;

  														if (!region.intersectsBox(b$4)) {
  																continue;
  														}
  												}

  												trace.push(child);
  												indices.push(0);

  												++depth;
  										} else {

  												octant = trace.pop();
  												indices.pop();
  										}
  								} else {

  										trace.pop();
  										indices.pop();

  										--depth;
  								}
  						}

  						this.result.value = octant;
  						this.result.done = octant === null;

  						return this.result;
  				}
  		}, {
  				key: "return",
  				value: function _return(value) {

  						this.result.value = value;
  						this.result.done = true;

  						return this.result;
  				}
  		}, {
  				key: Symbol.iterator,
  				value: function value() {

  						return this;
  				}
  		}]);
  		return OctantIterator;
  }();

  var flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

  var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

  function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

  	var entry = 0;

  	if (tx0 > ty0 && tx0 > tz0) {
  		if (tym < tx0) {
  			entry = entry | 2;
  		}
  		if (tzm < tx0) {
  			entry = entry | 1;
  		}
  	} else if (ty0 > tz0) {
  		if (txm < ty0) {
  			entry = entry | 4;
  		}
  		if (tzm < ty0) {
  			entry = entry | 1;
  		}
  	} else {
  		if (txm < tz0) {
  			entry = entry | 4;
  		}
  		if (tym < tz0) {
  			entry = entry | 2;
  		}
  	}

  	return entry;
  }

  function findNextOctant(currentOctant, tx1, ty1, tz1) {

  	var min = void 0;
  	var exit = 0;

  	if (tx1 < ty1) {

  		min = tx1;
  		exit = 0;
  	} else {

  		min = ty1;
  		exit = 1;
  	}

  	if (tz1 < min) {

  		exit = 2;
  	}

  	return octantTable[currentOctant][exit];
  }

  function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

  	var children = octant.children;

  	var currentOctant = void 0;
  	var txm = void 0,
  	    tym = void 0,
  	    tzm = void 0;

  	if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

  		if (children === null) {
  			intersects.push(octant);
  		} else {
  			txm = 0.5 * (tx0 + tx1);
  			tym = 0.5 * (ty0 + ty1);
  			tzm = 0.5 * (tz0 + tz1);

  			currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

  			do {

  				switch (currentOctant) {

  					case 0:
  						raycastOctant(children[flags[8]], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
  						break;

  					case 1:
  						raycastOctant(children[flags[8] ^ flags[1]], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
  						break;

  					case 2:
  						raycastOctant(children[flags[8] ^ flags[2]], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
  						break;

  					case 3:
  						raycastOctant(children[flags[8] ^ flags[3]], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
  						break;

  					case 4:
  						raycastOctant(children[flags[8] ^ flags[4]], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
  						break;

  					case 5:
  						raycastOctant(children[flags[8] ^ flags[5]], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
  						break;

  					case 6:
  						raycastOctant(children[flags[8] ^ flags[6]], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
  						break;

  					case 7:
  						raycastOctant(children[flags[8] ^ flags[7]], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);

  						currentOctant = 8;
  						break;

  				}
  			} while (currentOctant < 8);
  		}
  	}
  }

  var dimensions = new Vector3$1();

  var halfDimensions = new Vector3$1();

  var center = new Vector3$1();

  var min = new Vector3$1();

  var max = new Vector3$1();

  var direction = new Vector3$1();

  var origin = new Vector3$1();

  var OctreeRaycaster = function () {
  	function OctreeRaycaster() {
  		classCallCheck(this, OctreeRaycaster);
  	}

  	createClass(OctreeRaycaster, null, [{
  		key: "intersectOctree",
  		value: function intersectOctree(octree, raycaster, intersects) {

  			var invDirX = void 0,
  			    invDirY = void 0,
  			    invDirZ = void 0;
  			var tx0 = void 0,
  			    tx1 = void 0,
  			    ty0 = void 0,
  			    ty1 = void 0,
  			    tz0 = void 0,
  			    tz1 = void 0;

  			octree.getDimensions(dimensions);
  			halfDimensions.copy(dimensions).multiplyScalar(0.5);

  			min.copy(octree.min).sub(octree.min);
  			max.copy(octree.max).sub(octree.min);

  			direction.copy(raycaster.ray.direction);
  			origin.copy(raycaster.ray.origin);

  			origin.sub(octree.getCenter(center)).add(halfDimensions);

  			flags[8] = flags[0];

  			if (direction.x < 0.0) {

  				origin.x = dimensions.x - origin.x;
  				direction.x = -direction.x;
  				flags[8] |= flags[4];
  			}

  			if (direction.y < 0.0) {

  				origin.y = dimensions.y - origin.y;
  				direction.y = -direction.y;
  				flags[8] |= flags[2];
  			}

  			if (direction.z < 0.0) {

  				origin.z = dimensions.z - origin.z;
  				direction.z = -direction.z;
  				flags[8] |= flags[1];
  			}

  			invDirX = 1.0 / direction.x;
  			invDirY = 1.0 / direction.y;
  			invDirZ = 1.0 / direction.z;

  			tx0 = (min.x - origin.x) * invDirX;
  			tx1 = (max.x - origin.x) * invDirX;
  			ty0 = (min.y - origin.y) * invDirY;
  			ty1 = (max.y - origin.y) * invDirY;
  			tz0 = (min.z - origin.z) * invDirZ;
  			tz1 = (max.z - origin.z) * invDirZ;

  			if (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {
  				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);
  			}
  		}
  	}]);
  	return OctreeRaycaster;
  }();

  var b$3 = new Box3$1();

  function _getDepth(octant) {

  	var children = octant.children;

  	var result = 0;
  	var i = void 0,
  	    l = void 0,
  	    d = void 0;

  	if (children !== null) {

  		for (i = 0, l = children.length; i < l; ++i) {

  			d = 1 + _getDepth(children[i]);

  			if (d > result) {

  				result = d;
  			}
  		}
  	}

  	return result;
  }

  function _cull(octant, region, result) {

  	var children = octant.children;

  	var i = void 0,
  	    l = void 0;

  	b$3.min = octant.min;
  	b$3.max = octant.max;

  	if (region.intersectsBox(b$3)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; i < l; ++i) {

  				_cull(children[i], region, result);
  			}
  		} else {

  			result.push(octant);
  		}
  	}
  }

  function _findOctantsByLevel(octant, level, depth, result) {

  	var children = octant.children;

  	var i = void 0,
  	    l = void 0;

  	if (depth === level) {

  		result.push(octant);
  	} else if (children !== null) {

  		++depth;

  		for (i = 0, l = children.length; i < l; ++i) {

  			_findOctantsByLevel(children[i], level, depth, result);
  		}
  	}
  }

  var Octree = function () {
  	function Octree(min, max) {
  		classCallCheck(this, Octree);


  		this.root = min !== undefined && max !== undefined ? new Octant(min, max) : null;
  	}

  	createClass(Octree, [{
  		key: "getCenter",
  		value: function getCenter(target) {
  			return this.root.getCenter(target);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions(target) {
  			return this.root.getDimensions(target);
  		}
  	}, {
  		key: "getDepth",
  		value: function getDepth() {
  			return _getDepth(this.root);
  		}
  	}, {
  		key: "cull",
  		value: function cull(region) {

  			var result = [];

  			_cull(this.root, region, result);

  			return result;
  		}
  	}, {
  		key: "findOctantsByLevel",
  		value: function findOctantsByLevel(level) {

  			var result = [];

  			_findOctantsByLevel(this.root, level, 0, result);

  			return result;
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			OctreeRaycaster.intersectOctree(this, raycaster, intersects);

  			return intersects;
  		}
  	}, {
  		key: "leaves",
  		value: function leaves(region) {

  			return new OctantIterator(this, region);
  		}
  	}, {
  		key: Symbol.iterator,
  		value: function value() {

  			return new OctantIterator(this);
  		}
  	}, {
  		key: "min",
  		get: function get$$1() {
  			return this.root.min;
  		}
  	}, {
  		key: "max",
  		get: function get$$1() {
  			return this.root.max;
  		}
  	}, {
  		key: "children",
  		get: function get$$1() {
  			return this.root.children;
  		}
  	}]);
  	return Octree;
  }();

  var p = new Vector3$1();

  var PointOctant = function (_Octant) {
  	inherits(PointOctant, _Octant);

  	function PointOctant(min, max) {
  		classCallCheck(this, PointOctant);

  		var _this = possibleConstructorReturn(this, (PointOctant.__proto__ || Object.getPrototypeOf(PointOctant)).call(this, min, max));

  		_this.points = null;

  		_this.data = null;

  		return _this;
  	}

  	createClass(PointOctant, [{
  		key: "distanceToSquared",
  		value: function distanceToSquared(point) {

  			var clampedPoint = p.copy(point).clamp(this.min, this.max);

  			return clampedPoint.sub(point).lengthSquared();
  		}
  	}, {
  		key: "distanceToCenterSquared",
  		value: function distanceToCenterSquared(point) {

  			var center = this.getCenter(p);

  			var dx = point.x - center.x;
  			var dy = point.y - center.x;
  			var dz = point.z - center.z;

  			return dx * dx + dy * dy + dz * dz;
  		}
  	}, {
  		key: "contains",
  		value: function contains(point, bias) {

  			var min = this.min;
  			var max = this.max;

  			return point.x >= min.x - bias && point.y >= min.y - bias && point.z >= min.z - bias && point.x <= max.x + bias && point.y <= max.y + bias && point.z <= max.z + bias;
  		}
  	}, {
  		key: "redistribute",
  		value: function redistribute(bias) {

  			var children = this.children;
  			var points = this.points;
  			var data = this.data;

  			var i = void 0,
  			    j = void 0,
  			    il = void 0,
  			    jl = void 0;
  			var child = void 0,
  			    point = void 0,
  			    entry = void 0;

  			if (children !== null) {

  				for (i = 0, il = points.length; i < il; ++i) {

  					point = points[i];
  					entry = data[i];

  					for (j = 0, jl = children.length; j < jl; ++j) {

  						child = children[j];

  						if (child.contains(point, bias)) {

  							if (child.points === null) {

  								child.points = [];
  								child.data = [];
  							}

  							child.points.push(point);
  							child.data.push(entry);

  							break;
  						}
  					}
  				}
  			}

  			this.points = null;
  			this.data = null;
  		}
  	}, {
  		key: "merge",
  		value: function merge() {

  			var children = this.children;

  			var i = void 0,
  			    l = void 0;
  			var child = void 0;

  			if (children !== null) {

  				this.points = [];
  				this.data = [];

  				for (i = 0, l = children.length; i < l; ++i) {

  					child = children[i];

  					if (child.points !== null) {
  						var _points, _data;

  						(_points = this.points).push.apply(_points, toConsumableArray(child.points));
  						(_data = this.data).push.apply(_data, toConsumableArray(child.data));
  					}
  				}

  				this.children = null;
  			}
  		}
  	}]);
  	return PointOctant;
  }(Octant);

  var RayPointIntersection = function RayPointIntersection(distance, distanceToRay, point) {
  		var object = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  		classCallCheck(this, RayPointIntersection);


  		this.distance = distance;

  		this.distanceToRay = distanceToRay;

  		this.point = point;

  		this.object = object;
  };

  var THRESHOLD = 1e-6;

  function _countPoints(octant) {

  	var children = octant.children;

  	var result = 0;
  	var i = void 0,
  	    l = void 0;

  	if (children !== null) {

  		for (i = 0, l = children.length; i < l; ++i) {

  			result += _countPoints(children[i]);
  		}
  	} else if (octant.points !== null) {

  		result = octant.points.length;
  	}

  	return result;
  }

  function _put(point, data, octree, octant, depth) {

  	var children = octant.children;
  	var exists = false;
  	var done = false;
  	var i = void 0,
  	    l = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children === null) {

  			if (octant.points === null) {

  				octant.points = [];
  				octant.data = [];
  			} else {

  				for (i = 0, l = octant.points.length; !exists && i < l; ++i) {

  					exists = octant.points[i].equals(point);
  				}
  			}

  			if (exists) {

  				octant.data[i - 1] = data;
  				done = true;
  			} else if (octant.points.length < octree.maxPoints || depth === octree.maxDepth) {

  				octant.points.push(point.clone());
  				octant.data.push(data);
  				++octree.pointCount;
  				done = true;
  			} else {

  				octant.split();
  				octant.redistribute(octree.bias);
  				children = octant.children;
  			}
  		}

  		if (children !== null) {

  			++depth;

  			for (i = 0, l = children.length; !done && i < l; ++i) {

  				done = _put(point, data, octree, children[i], depth);
  			}
  		}
  	}

  	return done;
  }

  function _remove(point, octree, octant, parent) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0,
  	    data = void 0,
  	    last = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; result === null && i < l; ++i) {

  				result = _remove(point, octree, children[i], octant);
  			}
  		} else if (octant.points !== null) {

  			points = octant.points;
  			data = octant.data;

  			for (i = 0, l = points.length; i < l; ++i) {

  				if (points[i].equals(point)) {

  					last = l - 1;
  					result = data[i];

  					if (i < last) {
  						points[i] = points[last];
  						data[i] = data[last];
  					}

  					points.pop();
  					data.pop();

  					--octree.pointCount;

  					if (parent !== null && _countPoints(parent) <= octree.maxPoints) {

  						parent.merge();
  					}

  					break;
  				}
  			}
  		}
  	}

  	return result;
  }

  function _fetch(point, octree, octant) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; result === null && i < l; ++i) {

  				result = _fetch(point, octree, children[i]);
  			}
  		} else {

  			points = octant.points;

  			for (i = 0, l = points.length; result === null && i < l; ++i) {

  				if (point.distanceToSquared(points[i]) <= THRESHOLD) {

  					result = octant.data[i];
  				}
  			}
  		}
  	}

  	return result;
  }

  function _move(point, position, octree, octant, parent, depth) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (octant.contains(position, octree.bias)) {
  			if (children !== null) {

  				++depth;

  				for (i = 0, l = children.length; result === null && i < l; ++i) {

  					result = _move(point, position, octree, children[i], octant, depth);
  				}
  			} else {
  				points = octant.points;

  				for (i = 0, l = points.length; i < l; ++i) {

  					if (point.distanceToSquared(points[i]) <= THRESHOLD) {
  						points[i].copy(position);
  						result = octant.data[i];

  						break;
  					}
  				}
  			}
  		} else {
  			result = _remove(point, octree, octant, parent);

  			_put(position, result, octree, parent, depth - 1);
  		}
  	}

  	return result;
  }

  function _findNearestPoint(point, maxDistance, skipSelf, octant) {

  	var points = octant.points;
  	var children = octant.children;

  	var result = null;
  	var bestDist = maxDistance;

  	var i = void 0,
  	    l = void 0;
  	var p = void 0,
  	    distSq = void 0;

  	var sortedChildren = void 0;
  	var child = void 0,
  	    childResult = void 0;

  	if (children !== null) {
  		sortedChildren = children.map(function (child) {
  			return {
  				octant: child,
  				distance: child.distanceToCenterSquared(point)
  			};
  		}).sort(function (a, b) {
  			return a.distance - b.distance;
  		});

  		for (i = 0, l = sortedChildren.length; i < l; ++i) {
  			child = sortedChildren[i].octant;

  			if (child.contains(point, bestDist)) {

  				childResult = _findNearestPoint(point, bestDist, skipSelf, child);

  				if (childResult !== null) {

  					distSq = childResult.point.distanceToSquared(point);

  					if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

  						bestDist = distSq;
  						result = childResult;
  					}
  				}
  			}
  		}
  	} else if (points !== null) {

  		for (i = 0, l = points.length; i < l; ++i) {

  			p = points[i];
  			distSq = point.distanceToSquared(p);

  			if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

  				bestDist = distSq;

  				result = {
  					point: p.clone(),
  					data: octant.data[i]
  				};
  			}
  		}
  	}

  	return result;
  }

  function _findPoints(point, radius, skipSelf, octant, result) {

  	var points = octant.points;
  	var children = octant.children;
  	var rSq = radius * radius;

  	var i = void 0,
  	    l = void 0;

  	var p = void 0,
  	    distSq = void 0;
  	var child = void 0;

  	if (children !== null) {

  		for (i = 0, l = children.length; i < l; ++i) {

  			child = children[i];

  			if (child.contains(point, radius)) {

  				_findPoints(point, radius, skipSelf, child, result);
  			}
  		}
  	} else if (points !== null) {

  		for (i = 0, l = points.length; i < l; ++i) {

  			p = points[i];
  			distSq = point.distanceToSquared(p);

  			if ((!skipSelf || distSq > 0.0) && distSq <= rSq) {

  				result.push({
  					point: p.clone(),
  					data: octant.data[i]
  				});
  			}
  		}
  	}
  }

  var PointOctree = function (_Octree) {
  	inherits(PointOctree, _Octree);

  	function PointOctree(min, max) {
  		var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
  		var maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;
  		var maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;
  		classCallCheck(this, PointOctree);

  		var _this = possibleConstructorReturn(this, (PointOctree.__proto__ || Object.getPrototypeOf(PointOctree)).call(this));

  		_this.root = new PointOctant(min, max);

  		_this.bias = Math.max(0.0, bias);

  		_this.maxPoints = Math.max(1, Math.round(maxPoints));

  		_this.maxDepth = Math.max(0, Math.round(maxDepth));

  		_this.pointCount = 0;

  		return _this;
  	}

  	createClass(PointOctree, [{
  		key: "countPoints",
  		value: function countPoints(octant) {

  			return _countPoints(octant);
  		}
  	}, {
  		key: "put",
  		value: function put(point, data) {

  			return _put(point, data, this, this.root, 0);
  		}
  	}, {
  		key: "remove",
  		value: function remove(point) {

  			return _remove(point, this, this.root, null);
  		}
  	}, {
  		key: "fetch",
  		value: function fetch(point) {

  			return _fetch(point, this, this.root);
  		}
  	}, {
  		key: "move",
  		value: function move(point, position) {

  			return _move(point, position, this, this.root, null, 0);
  		}
  	}, {
  		key: "findNearestPoint",
  		value: function findNearestPoint(point) {
  			var maxDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			return _findNearestPoint(point, maxDistance, skipSelf, this.root);
  		}
  	}, {
  		key: "findPoints",
  		value: function findPoints(point, radius) {
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			var result = [];

  			_findPoints(point, radius, skipSelf, this.root, result);

  			return result;
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			var octants = get(PointOctree.prototype.__proto__ || Object.getPrototypeOf(PointOctree.prototype), "raycast", this).call(this, raycaster);

  			if (octants.length > 0) {
  				this.testPoints(octants, raycaster, intersects);
  			}

  			return intersects;
  		}
  	}, {
  		key: "testPoints",
  		value: function testPoints(octants, raycaster, intersects) {

  			var threshold = raycaster.params.Points.threshold;
  			var thresholdSq = threshold * threshold;

  			var intersectPoint = void 0;
  			var distance = void 0,
  			    distanceToRay = void 0;
  			var rayPointDistanceSq = void 0;

  			var i = void 0,
  			    j = void 0,
  			    il = void 0,
  			    jl = void 0;
  			var octant = void 0,
  			    points = void 0,
  			    point = void 0;

  			for (i = 0, il = octants.length; i < il; ++i) {

  				octant = octants[i];
  				points = octant.points;

  				if (points !== null) {

  					for (j = 0, jl = points.length; j < jl; ++j) {

  						point = points[j];
  						rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

  						if (rayPointDistanceSq < thresholdSq) {

  							intersectPoint = raycaster.ray.closestPointToPoint(point);
  							distance = raycaster.ray.origin.distanceTo(intersectPoint);

  							if (distance >= raycaster.near && distance <= raycaster.far) {

  								distanceToRay = Math.sqrt(rayPointDistanceSq);

  								intersects.push(new RayPointIntersection(distance, distanceToRay, intersectPoint, octant.data[j]));
  							}
  						}
  					}
  				}
  			}
  		}
  	}]);
  	return PointOctree;
  }(Octree);

  var OctreeUtils = function () {
  		function OctreeUtils() {
  				classCallCheck(this, OctreeUtils);
  		}

  		createClass(OctreeUtils, null, [{
  				key: "recycleOctants",
  				value: function recycleOctants(octant, octants) {

  						var a = new Vector3$1();
  						var b = new Vector3$1();
  						var c = new Vector3$1();

  						var min = octant.min;
  						var mid = octant.getCenter();
  						var halfDimensions = octant.getDimensions().multiplyScalar(0.5);

  						var children = octant.children;
  						var l = octants.length;

  						var i = void 0,
  						    j = void 0;
  						var combination = void 0,
  						    candidate = void 0;

  						for (i = 0; i < 8; ++i) {

  								combination = pattern[i];

  								b.addVectors(min, a.fromArray(combination).multiply(halfDimensions));
  								c.addVectors(mid, a.fromArray(combination).multiply(halfDimensions));

  								for (j = 0; j < l; ++j) {

  										candidate = octants[j];

  										if (candidate !== null && b.equals(candidate.min) && c.equals(candidate.max)) {

  												children[i] = candidate;
  												octants[j] = null;

  												break;
  										}
  								}
  						}
  				}
  		}]);
  		return OctreeUtils;
  }();

  var Demo = function () {
  		function Demo(renderer) {
  				classCallCheck(this, Demo);


  				this.renderer = renderer;

  				this.loadingManager = new three.LoadingManager();

  				this.assets = null;

  				this.scene = new three.Scene();
  				this.scene.fog = new three.FogExp2(0x0d0d0d, 0.0025);

  				this.camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);

  				this.controls = null;
  		}

  		createClass(Demo, [{
  				key: "load",
  				value: function load(callback) {
  						callback();
  				}
  		}, {
  				key: "initialise",
  				value: function initialise() {}
  		}, {
  				key: "render",
  				value: function render(delta) {}
  		}, {
  				key: "configure",
  				value: function configure(gui) {}
  		}, {
  				key: "reset",
  				value: function reset() {

  						var fog = this.scene.fog;

  						this.scene = new three.Scene();
  						this.scene.fog = fog;

  						if (this.controls !== null) {

  								this.controls.dispose();
  								this.controls = null;
  						}

  						return this;
  				}
  		}]);
  		return Demo;
  }();

  var mouse = new three.Vector2();

  var OctreeRaycaster$1 = function (_Raycaster) {
  		inherits(OctreeRaycaster, _Raycaster);

  		function OctreeRaycaster(octree, camera, object) {
  				classCallCheck(this, OctreeRaycaster);

  				var _this = possibleConstructorReturn(this, (OctreeRaycaster.__proto__ || Object.getPrototypeOf(OctreeRaycaster)).call(this));

  				_this.params.Points.threshold = 1e-1;

  				_this.octree = octree;

  				_this.camera = camera;

  				_this.object = object;

  				_this.enabled = true;

  				_this.delta = "";

  				_this.selectedObject = null;

  				_this.selectedPoint = new three.Mesh(new three.SphereBufferGeometry(0.2, 16, 16), new three.MeshBasicMaterial({
  						transparent: true,
  						color: 0x00ccff,
  						opacity: 0.75
  				}));

  				_this.selectedPoint.visible = false;

  				return _this;
  		}

  		createClass(OctreeRaycaster, [{
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "mousemove":
  										this.raycast(event);
  										break;

  						}
  				}
  		}, {
  				key: "raycast",
  				value: function raycast(event) {

  						var intersects = void 0;
  						var t0 = void 0,
  						    t = void 0,
  						    x = void 0;

  						mouse.x = event.clientX / window.innerWidth * 2 - 1;
  						mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  						this.setFromCamera(mouse, this.camera);

  						if (this.enabled) {
  								t0 = performance.now();
  								intersects = this.octree.raycast(this);
  								t = performance.now();
  						} else {
  								t0 = performance.now();
  								intersects = this.intersectObjects(this.object.children);
  								t = performance.now();
  						}

  						this.delta = (t - t0).toFixed(2) + " ms";

  						if (this.selectedObject !== null) {

  								this.selectedObject.material.color.setHex(0xc00000);
  								this.selectedObject = null;
  								this.selectedPoint.visible = false;
  						}

  						if (intersects.length > 0) {

  								x = intersects[0];

  								if (x.object !== undefined) {

  										this.selectedObject = x.object;
  										this.selectedObject.material.color.setHex(0xccff00);

  										this.selectedPoint.visible = x.object.parent.visible;
  										this.selectedPoint.position.copy(x.point);
  								} else {

  										console.warn(intersects);
  								}
  						}
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {

  						var folder = gui.addFolder("Raycasting");

  						folder.add(this, "enabled");
  						folder.add(this, "delta").listen();

  						folder.open();
  				}
  		}]);
  		return OctreeRaycaster;
  }(three.Raycaster);

  var matrix4 = new three.Matrix4();

  var frustum = new three.Frustum();

  var FrustumCuller = function () {
  		function FrustumCuller(octree, scene) {
  				classCallCheck(this, FrustumCuller);


  				this.octree = octree;

  				this.scene = scene;

  				this.enabled = false;

  				this.cullCamera = new three.PerspectiveCamera(20, 1.77, 0.5, 5);
  				this.cullCamera.matrixAutoUpdate = false;

  				this.s = new three.Spherical(5, Math.PI / 3, Math.PI * 1.75);

  				this.delta = "";

  				this.culledOctants = new three.Points(new three.BufferGeometry(), new three.PointsMaterial({
  						color: 0xccff00,
  						sizeAttenuation: false,
  						size: 2
  				}));

  				this.culledOctants.visible = false;

  				this.cameraHelper = new three.CameraHelper(this.cullCamera);
  				this.cameraHelper.visible = false;
  		}

  		createClass(FrustumCuller, [{
  				key: "updateCamera",
  				value: function updateCamera() {

  						var cullCamera = this.cullCamera;

  						cullCamera.position.setFromSpherical(this.s);
  						cullCamera.lookAt(this.scene.position);

  						cullCamera.updateMatrix();
  						cullCamera.updateMatrixWorld();

  						frustum.setFromMatrix(matrix4.multiplyMatrices(cullCamera.projectionMatrix, cullCamera.matrixWorldInverse));
  				}
  		}, {
  				key: "cull",
  				value: function cull() {

  						var culledOctants = this.culledOctants;

  						var t0 = void 0;
  						var i = void 0,
  						    j = void 0,
  						    l = void 0;
  						var octant = void 0,
  						    octants = void 0;
  						var positions = void 0;

  						if (this.enabled) {

  								this.updateCamera();

  								t0 = performance.now();
  								octants = this.octree.cull(frustum);

  								this.delta = (performance.now() - t0).toFixed(2) + " ms";

  								if (octants.length > 0) {

  										positions = new Float32Array(octants.length * 3 * 2);

  										for (i = 0, j = 0, l = octants.length; i < l; ++i) {

  												octant = octants[i];
  												positions[j++] = octant.min.x;
  												positions[j++] = octant.min.y;
  												positions[j++] = octant.min.z;
  												positions[j++] = octant.max.x;
  												positions[j++] = octant.max.y;
  												positions[j++] = octant.max.z;
  										}

  										culledOctants.geometry.removeAttribute("position");
  										culledOctants.geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

  										this.scene.remove(culledOctants);
  										this.scene.add(culledOctants);
  								} else {

  										this.scene.remove(culledOctants);
  								}

  								this.cameraHelper.update();
  						}
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {
  						var _this = this;

  						var folder = gui.addFolder("Frustum Culling");

  						folder.add(this, "enabled").onChange(function () {

  								_this.cameraHelper.visible = _this.culledOctants.visible = _this.enabled;
  								_this.cull();
  						});

  						folder.add(this, "delta").listen();
  						folder.open();

  						var subFolder = folder.addFolder("Camera Adjustment");

  						subFolder.add(this.s, "radius").min(0.1).max(10.0).step(0.1).onChange(function () {
  								_this.cull();
  						});
  						subFolder.add(this.s, "phi").min(1e-6).max(Math.PI - 1e-6).onChange(function () {
  								_this.cull();
  						});
  						subFolder.add(this.s, "theta").min(0.0).max(Math.PI * 2.0).onChange(function () {
  								_this.cull();
  						});
  				}
  		}]);
  		return FrustumCuller;
  }();

  var PointOctreeDemo = function (_Demo) {
  		inherits(PointOctreeDemo, _Demo);

  		function PointOctreeDemo(renderer) {
  				classCallCheck(this, PointOctreeDemo);

  				var _this = possibleConstructorReturn(this, (PointOctreeDemo.__proto__ || Object.getPrototypeOf(PointOctreeDemo)).call(this, renderer));

  				_this.points = null;

  				_this.octreeHelper = null;

  				_this.octreeRaycaster = null;

  				_this.frustumCuller = null;

  				return _this;
  		}

  		createClass(PointOctreeDemo, [{
  				key: "initialise",
  				value: function initialise() {

  						var scene = this.scene;
  						var camera = this.camera;
  						var renderer = this.renderer;

  						scene.fog = new three.FogExp2(0x0d0d0d, 0.025);

  						this.controls = new three.OrbitControls(camera, renderer.domElement);
  						this.controls.maxDistance = 60;

  						camera.near = 0.1;
  						camera.far = 200;
  						camera.position.set(10, 6, 10);
  						camera.lookAt(this.controls.target);

  						var points = function generatePoints() {

  								function createPlaneGeometry(particles, n, zBase, zBias) {

  										var geometry = new three.BufferGeometry();
  										var positions = new Float32Array(particles * 3);
  										var n2 = n / 2;

  										var x = void 0,
  										    y = void 0,
  										    z = void 0,
  										    i = void 0,
  										    l = void 0;

  										for (i = 0, l = positions.length; i < l; i += 3) {

  												x = Math.random() * n - n2;
  												y = Math.random() * n - n2;
  												z = zBase + (Math.random() * zBias * 2 - zBias);

  												positions[i] = x;
  												positions[i + 1] = y;
  												positions[i + 2] = z;
  										}

  										geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

  										return geometry;
  								}

  								var points = new three.Object3D();

  								var w = 256;
  								var h = 256;

  								var d = 8;

  								var size = 6;
  								var zStep = size / (d - 1);

  								var z = size * -0.5;
  								var p = void 0;

  								var material = new three.PointsMaterial({
  										color: 0xc00000,
  										sizeAttenuation: false,
  										size: 1
  								});

  								console.log("Generating", w * h * d, "points...");

  								while (d-- > 0) {

  										p = new three.Points(createPlaneGeometry(w * h, size, z, 0.25), material);
  										material = material.clone();
  										z += zStep;

  										points.add(p);
  								}

  								return points;
  						}();

  						this.points = points;
  						scene.add(points);

  						var octree = function createOctree(points) {

  								var v = new three.Vector3();
  								var bbox = new three.Box3();
  								bbox.setFromObject(scene);

  								var t0 = performance.now();

  								var d = void 0,
  								    p = void 0,
  								    i = void 0,
  								    l = void 0;
  								var array = void 0;

  								var octree = new PointOctree(bbox.min, bbox.max, 0.0, 8, 5);

  								for (d = points.children.length - 1; d >= 0; --d) {

  										p = points.children[d];
  										array = p.geometry.getAttribute("position").array;

  										for (i = 0, l = array.length; i < l; i += 3) {

  												octree.put(v.fromArray(array, i), p);
  										}
  								}

  								console.log("Octree:", octree, "created in", (performance.now() - t0).toFixed(2) + " ms");

  								return octree;
  						}(points);

  						var octreeHelper = function createOctreeHelper(octree) {

  								var t0 = performance.now();
  								var octreeHelper = new OctreeHelper(octree);
  								octreeHelper.visible = false;

  								console.log("OctreeHelper:", octreeHelper, "created in", (performance.now() - t0).toFixed(2) + " ms");

  								return octreeHelper;
  						}(octree);

  						this.octreeHelper = octreeHelper;
  						scene.add(octreeHelper);

  						this.raycaster = new OctreeRaycaster$1(octree, camera, points);

  						renderer.domElement.parentNode.addEventListener("mousemove", this.raycaster);
  						scene.add(this.raycaster.selectedPoint);

  						this.frustumCuller = new FrustumCuller(octree, scene);

  						scene.add(this.frustumCuller.cameraHelper);
  				}
  		}, {
  				key: "render",
  				value: function render(delta) {

  						this.renderer.render(this.scene, this.camera);
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {

  						var points = this.points;
  						var octreeHelper = this.octreeHelper;

  						this.raycaster.configure(gui);
  						this.frustumCuller.configure(gui);

  						var params = {
  								"level mask": octreeHelper.children.length
  						};

  						var folder = gui.addFolder("Points");
  						folder.add(points, "visible");
  						folder.open();

  						folder = gui.addFolder("Octree Helper");
  						folder.add(octreeHelper, "visible");

  						folder.add(params, "level mask").min(0).max(octreeHelper.children.length).step(1).onChange(function () {

  								var i = void 0,
  								    l = void 0;

  								for (i = 0, l = octreeHelper.children.length; i < l; ++i) {

  										octreeHelper.children[i].visible = params["level mask"] === octreeHelper.children.length || i === params["level mask"];
  								}
  						});

  						folder.open();
  				}
  		}]);
  		return PointOctreeDemo;
  }(Demo);

  var App = function () {
  		function App() {
  				classCallCheck(this, App);


  				this.clock = new three.Clock();

  				this.renderer = new three.WebGLRenderer({
  						logarithmicDepthBuffer: true,
  						antialias: true
  				});

  				this.renderer.setSize(window.innerWidth, window.innerHeight);
  				this.renderer.setClearColor(0x000000);
  				this.renderer.setPixelRatio(window.devicePixelRatio);

  				this.stats = function () {

  						var stats = new Stats();
  						stats.showPanel(0);
  						stats.dom.id = "stats";

  						return stats;
  				}();

  				this.demos = function (renderer) {

  						var demos = new Map();

  						demos.set("point-octree", new PointOctreeDemo(renderer));

  						return demos;
  				}(this.renderer);

  				this.key = function (demos) {

  						var key = window.location.hash.slice(1);

  						if (key.length === 0 || !demos.has(key)) {

  								key = demos.keys().next().value;
  						}

  						return key;
  				}(this.demos);
  		}

  		createClass(App, [{
  				key: "initialise",
  				value: function initialise(viewport, aside, loadingMessage) {

  						var app = this;

  						var renderer = this.renderer;
  						var clock = this.clock;
  						var stats = this.stats;
  						var demos = this.demos;

  						var demo = null;
  						var gui = null;

  						viewport.appendChild(renderer.domElement);
  						aside.appendChild(stats.dom);

  						function activateDemo() {

  								demo.initialise();

  								demo.camera.aspect = window.innerWidth / window.innerHeight;
  								demo.camera.updateProjectionMatrix();

  								gui = new dat.GUI({ autoPlace: false });
  								gui.add(app, "key", Array.from(demos.keys())).onChange(loadDemo);
  								demo.configure(gui);
  								aside.appendChild(gui.domElement);

  								loadingMessage.style.display = "none";
  								renderer.domElement.style.visibility = "visible";
  						}

  						function loadDemo() {

  								var size = renderer.getSize();

  								loadingMessage.style.display = "block";
  								renderer.domElement.style.visibility = "hidden";

  								if (gui !== null) {

  										gui.destroy();
  										aside.removeChild(gui.domElement);
  								}

  								if (demo !== null) {

  										demo.reset();
  										renderer.setSize(size.width, size.height);
  								}

  								demo = demos.get(app.key);
  								demo.load(activateDemo);
  						}

  						loadDemo();

  						document.addEventListener("keydown", function onKeyDown(event) {

  								if (event.altKey) {

  										event.preventDefault();
  										aside.style.visibility = aside.style.visibility === "hidden" ? "visible" : "hidden";
  								}
  						});

  						window.addEventListener("resize", function () {

  								var id = 0;

  								function handleResize(event) {

  										var width = event.target.innerWidth;
  										var height = event.target.innerHeight;

  										renderer.setSize(width, height);
  										demo.camera.aspect = width / height;
  										demo.camera.updateProjectionMatrix();

  										id = 0;
  								}

  								return function onResize(event) {

  										if (id === 0) {

  												id = setTimeout(handleResize, 66, event);
  										}
  								};
  						}());

  						(function render(now) {

  								var delta = clock.getDelta();

  								requestAnimationFrame(render);

  								stats.begin();

  								demo.render(delta);

  								stats.end();
  						})();
  				}
  		}]);
  		return App;
  }();

  window.addEventListener("load", function main(event) {

  	var viewport = document.getElementById("viewport");
  	var loadingMessage = viewport.children[0];
  	var aside = document.getElementById("aside");

  	var app = new App();

  	window.removeEventListener("load", main);
  	aside.style.visibility = "visible";

  	app.initialise(viewport, aside, loadingMessage);
  });

}(THREE,dat,Stats));

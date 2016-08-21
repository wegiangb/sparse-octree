import { Octant } from "../octant";

/**
 * An octant that maintains points.
 *
 * @class PointOctant
 * @submodule point
 * @extends Octant
 * @constructor
 * @param {Vector3} min - The lower bounds.
 * @param {Vector3} max - The upper bounds.
 */

export class PointOctant extends Octant {

	constructor(min, max) {

		super(min, max);

		/**
		 * The points that are inside this octant.
		 *
		 * @property points
		 * @type Array
		 */

		this.points = null;

		/**
		 * Point data.
		 *
		 * @property data
		 * @type Array
		 */

		this.data = null;

	}

	/**
	 * Counts how many points are in this octant.
	 *
	 * @method countPoints
	 * @return {Number} The amount of points.
	 */

	countPoints() {

		const heap = [this];

		let result = 0;
		let octant, children;

		while(heap.length > 0) {

			octant = heap.pop();
			children = octant.children;

			if(children !== null) {

				heap.push(...children);

			} else if(octant.points !== null) {

				result += octant.points.length;

			}

		}

		return result;

	}

	/**
	 * Computes the distance squared from this octant to the given point.
	 *
	 * @method distanceToSquared
	 * @param {Vector3} p - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToSquared(p) {

		const clampedPoint = p.clone().clamp(this.min, this.max);

		return clampedPoint.sub(p).lengthSq();

	}

	/**
	 * Computes the distance squared from the center of this octant to the given
	 * point.
	 *
	 * @method distanceToCenterSquared
	 * @param {Vector3} p - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToCenterSquared(p) {

		const center = this.center();

		const dx = p.x - center.x;
		const dy = p.y - center.x;
		const dz = p.z - center.z;

		return dx * dx + dy * dy + dz * dz;

	}

	/**
	 * Checks if the given point lies inside this octant's boundaries.
	 *
	 * This method can also be used to check if this octant intersects a sphere by
	 * providing a radius as bias.
	 *
	 * @method contains
	 * @param {Vector3} p - A point.
	 * @param {Number} bias - A padding that extends the boundaries temporarily.
	 * @return {Boolean} Whether the given point lies inside this octant.
	 */

	contains(p, bias) {

		const min = this.min;
		const max = this.max;

		return (
			p.x >= min.x - bias &&
			p.y >= min.y - bias &&
			p.z >= min.z - bias &&
			p.x <= max.x + bias &&
			p.y <= max.y + bias &&
			p.z <= max.z + bias
		);

	}

	/**
	 *
	 */


		const points = this.points;

		let i, l;




					if(dataSet.size === 0) {





						}



					}

				}

			}

		}


	}

	/**
	 * Gathers all points from the children. The children are expected to be leaf
	 * nodes and will be dropped afterwards.
	 *
	 * @method merge
	 * @private
	 */

	merge() {

		const children = this.children;

		let i, l;

		if(children !== null) {






				}

			}



	}

	/**
	 * Finds the closest point to the given one.
	 *
	 * @method findNearestPoint
	 * @param {Vector3} p - The point.
	 * @param {Number} maxDistance - The maximum distance.
	 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
	 * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
	 */

	findNearestPoint(p, maxDistance, skipSelf) {

		const points = this.points;
		const children = this.children;

		let result = null;
		let bestDist = maxDistance;

		let i, l;
		let point, distSq;

		let sortedChildren;
		let child, childResult;

		// Only consider leaf nodes.
		if(children === null) {

			for(i = 0, l = this.totalPoints; i < l; ++i) {

				point = points[i];
				distSq = p.distanceToSquared(point);

				if((!skipSelf || distSq > 0.0) && distSq <= bestDist) {

					bestDist = distSq;

					result = {
						point: point.clone(),
						data: this.dataSets[i]
					};

				}

			}

		} else {

			// Sort the children.
			sortedChildren = children.map(function(child) {

				// Precompute distances.
				return {
					octant: child,
					distance: child.distanceToCenterSquared(p)
				};

			}).sort(function(a, b) {

				// Smallest distance to p first, ASC.
				return a.distance - b.distance;

			});

			// Traverse from closest to furthest.
			for(i = 0, l = sortedChildren.length; i < l; ++i) {

				// Unpack octant.
				child = sortedChildren[i].octant;

				if(child.totalPoints > 0 && child.containsPoint(p, bestDist)) {

					childResult = child.findNearestPoint(p, bestDist, skipSelf);

					if(childResult !== null) {

						distSq = childResult.point.distanceToSquared(p);

						if((!skipSelf || distSq > 0.0) && distSq <= bestDist) {

							bestDist = distSq;
							result = childResult;

						}

					}

				}

			}

		}

		return result;

	}

	/**
	 * Finds points that are inside the specified radius around a given position.
	 *
	 * @method findPoints
	 * @param {Vector3} p - A position.
	 * @param {Number} r - A radius.
	 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
	 * @param {Array} result - An array to be filled with objects, each containing a point and a data property.
	 */

	findPoints(p, r, skipSelf, result) {

		const points = this.points;
		const children = this.children;
		const rSq = r * r;

		let i, l;

		let point, distSq;
		let child;

		// Only consider leaf nodes.
		if(children === null) {

			for(i = 0, l = this.totalPoints; i < l; ++i) {

				point = points[i];
				distSq = p.distanceToSquared(point);

				if((!skipSelf || distSq > 0.0) && distSq <= rSq) {

					result.push({
						point: point.clone(),
						data: this.dataSets[i]
					});

				}

			}

		} else {

			// The order of the children is irrelevant.
			for(i = 0, l = children.length; i < l; ++i) {

				child = children[i];

				if(child.totalPoints > 0 && child.containsPoint(p, r)) {

					child.findPoints(p, r, skipSelf, result);

				}

			}

		}

	}

}

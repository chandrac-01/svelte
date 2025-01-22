/** @import { TemplateNode, Value } from '#client' */

import { async_derived } from '../../reactivity/deriveds.js';
import { suspend } from './boundary.js';

/**
 * @param {TemplateNode} node
 * @param {Array<() => Promise<any>>} expressions
 * @param {(anchor: TemplateNode, ...deriveds: Value[]) => void} fn
 */
export function async(node, expressions, fn) {
	// TODO handle hydration

	suspend(Promise.all(expressions.map(async_derived))).then((result) => {
		fn(node, ...result.exit());
	});
}

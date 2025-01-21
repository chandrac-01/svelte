/** @import { AwaitExpression } from 'estree' */
/** @import { Context } from '../types' */

/**
 * @param {AwaitExpression} node
 * @param {Context} context
 */
export function AwaitExpression(node, context) {
	const tla = context.state.ast_type === 'instance' && context.state.function_depth === 1;
	let suspend = tla;

	if (context.state.expression) {
		// wrap the expression in `(await $.suspend(...)).exit()` if necessary,
		// i.e. whether anything could potentially be read _after_ the await
		let i = context.path.length;
		while (i--) {
			const parent = context.path[i];

			// @ts-expect-error we could probably use a neater/more robust mechanism
			if (parent.metadata?.expression === context.state.expression) {
				break;
			}

			// TODO make this more accurate — we don't need to call suspend
			// if this is the last thing that could be read
			suspend = true;
		}
	}

	if (suspend) {
		if (!context.state.analysis.runes) {
			throw new Error('TODO runes mode only');
		}

		context.state.analysis.suspenders.add(node);
	}

	if (context.state.expression) {
		context.state.expression.is_async = true;
	}

	if (tla) {
		context.state.analysis.is_async = true;
	}

	context.next();
}

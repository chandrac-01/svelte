/** @import { Expression } from 'estree' */
/** @import { AST } from '#compiler' */
/** @import { ComponentContext } from '../types' */
import { is_ignored } from '../../../../state.js';
import * as b from '../../../../utils/builders.js';

/**
 * @param {AST.HtmlTag} node
 * @param {ComponentContext} context
 */
export function HtmlTag(node, context) {
	context.state.template.push('<!>');

	const { is_async } = node.metadata.expression;

	const expression = /** @type {Expression} */ (context.visit(node.expression));
	const html = is_async ? b.call('$.get', b.id('$$html')) : expression;

	const is_svg = context.state.metadata.namespace === 'svg';
	const is_mathml = context.state.metadata.namespace === 'mathml';

	const statement = b.stmt(
		b.call(
			'$.html',
			context.state.node,
			b.thunk(html),
			is_svg && b.true,
			is_mathml && b.true,
			is_ignored(node, 'hydration_html_changed') && b.true
		)
	);

	// push into init, so that bindings run afterwards, which might trigger another run and override hydration
	if (node.metadata.expression.is_async) {
		context.state.init.push(
			b.stmt(
				b.call(
					'$.async',
					context.state.node,
					b.array([b.thunk(expression, true)]),
					b.arrow([context.state.node, b.id('$$html')], b.block([statement]))
				)
			)
		);
	} else {
		context.state.init.push(statement);
	}
}

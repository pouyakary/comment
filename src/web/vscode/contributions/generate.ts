import * as vscode 		from 'vscode';
import * as engine 		from '../../engine';
import * as tools  		from '../tools';
import * as services 	from '../services';

// ─── Register Commands ─────────────────────────────────────────────────── ✣ ─

export function registerCommandProviders(context: vscode.ExtensionContext) {
	// Registerer
	function register(
		command: 		string,
		generator: 	engine.comments.GeneratorSkeleton
	) {
		context.subscriptions.push(
			vscode.commands.registerCommand(command, () => provideGenerator(generator))
		);
	}

	// Line Comment
	register('comment.vi.makeSectionComment',
		engine.generators.generateSectionComment);

	register('comment.vi.makeLineComment',
		engine.generators.generateLineComment);
}

// ─── Replacers ─────────────────────────────────────────────────────────── ✣ ─

function provideGenerator(skeleton: engine.generators.GeneratorSkeleton) {
	try {
		const finalProduct = services.executeGenerator(skeleton);

		tools.replaceLineWithCurrentSnippet(
			finalProduct.lineNumber,
			finalProduct.result,
		);

	} catch(error) {
		tools.showError(error as Error | string);
	}
}

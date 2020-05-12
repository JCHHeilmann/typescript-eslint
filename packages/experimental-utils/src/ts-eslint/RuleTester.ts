import { RuleTester as ESLintRuleTester } from 'eslint';
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '../ts-estree';
import { ParserOptions } from './ParserOptions';
import { RuleModule } from './Rule';

interface ValidTestCase<TOptions extends Readonly<unknown[]>> {
  /**
   * Code for the test case.
   */
  code: string;
  /**
   * Environments for the test case.
   */
  env?: Record<string, boolean>;
  /**
   * The fake filename for the test case. Useful for rules that make assertion about filenames.
   */
  filename?: string;
  /**
   * The additional global variables.
   */
  globals?: Record<string, 'readonly' | 'writable' | 'off'>;
  /**
   * Options for the test case.
   */
  options?: TOptions;
  /**
   * The absolute path for the parser.
   */
  parser?: string;
  /**
   * Options for the parser.
   */
  parserOptions?: ParserOptions;
  /**
   * Settings for the test case.
   */
  settings?: Record<string, unknown>;
}

interface SuggestionOutput<TMessageIds extends string> {
  /**
   * Reported message ID.
   */
  messageId: TMessageIds;
  /**
   * The data used to fill the message template.
   */
  data?: Record<string, unknown>;
  /**
   * NOTE: Suggestions will be applied as a stand-alone change, without triggering multi-pass fixes.
   * Each individual error has its own suggestion, so you have to show the correct, _isolated_ output for each suggestion.
   */
  output: string;

  // we disallow this because it's much better to use messageIds for reusable errors that are easily testable
  // desc?: string;
}

interface InvalidTestCase<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>
> extends ValidTestCase<TOptions> {
  /**
   * Expected errors.
   */
  errors: TestCaseError<TMessageIds>[];
  /**
   * The expected code after autofixes are applied. If set to `null`, the test runner will assert that no autofix is suggested.
   */
  output?: string | null;
}

interface TestCaseError<TMessageIds extends string> {
  /**
   * The 1-based column number of the reported start location.
   */
  column?: number;
  /**
   * The data used to fill the message template.
   */
  data?: Record<string, string>;
  /**
   * The 1-based column number of the reported end location.
   */
  endColumn?: number;
  /**
   * The 1-based line number of the reported end location.
   */
  endLine?: number;
  /**
   * The 1-based line number of the reported start location.
   */
  line?: number;
  /**
   * Reported message ID.
   */
  messageId: TMessageIds;
  /**
   * Reported suggestions.
   */
  suggestions?: SuggestionOutput<TMessageIds>[] | null;
  /**
   * The type of the reported AST node.
   */
  type?: AST_NODE_TYPES | AST_TOKEN_TYPES;

  // we disallow this because it's much better to use messageIds for reusable errors that are easily testable
  // message?: string | RegExp;
}

interface RunTests<
  TMessageIds extends string,
  TOptions extends Readonly<unknown[]>
> {
  // RuleTester.run also accepts strings for valid cases
  valid: (ValidTestCase<TOptions> | string)[];
  invalid: InvalidTestCase<TMessageIds, TOptions>[];
}
interface RuleTesterConfig {
  // should be require.resolve(parserPackageName)
  parser: string;
  parserOptions?: ParserOptions;
}

// the cast on the extends is so that we don't want to have the built type defs to attempt to import eslint
class RuleTester extends (ESLintRuleTester as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: unknown[]): any;
}) {
  /**
   * Creates a new instance of RuleTester.
   * @param testerConfig extra configuration for the tester
   */
  constructor(testerConfig?: RuleTesterConfig) {
    super(testerConfig);

    // nobody will ever need watching in tests
    // so we can give everyone a perf win by disabling watching
    if (testerConfig?.parserOptions?.project) {
      testerConfig.parserOptions.noWatch =
        typeof testerConfig.parserOptions.noWatch === 'boolean' || true;
    }
  }

  /**
   * Adds a new rule test to execute.
   * @param ruleName The name of the rule to run.
   * @param rule The rule to test.
   * @param test The collection of tests to run.
   */
  run<TMessageIds extends string, TOptions extends Readonly<unknown[]>>(
    ruleName: string,
    rule: RuleModule<TMessageIds, TOptions>,
    tests: RunTests<TMessageIds, TOptions>,
  ): void {
    // this method is only defined here because we lazily type the eslint import with `any`
    super.run(ruleName, rule, tests);
  }
}

export {
  InvalidTestCase,
  SuggestionOutput,
  RuleTester,
  RuleTesterConfig,
  RunTests,
  TestCaseError,
  ValidTestCase,
};

/* eslint-disable @typescript-eslint/no-namespace */

import { ESLint as ESLintESLint } from 'eslint';
import { Linter } from './Linter';
import { RuleMetaData } from './Rule';

interface ESLint {
  /**
   * Returns a configuration object for the given file based on the CLI options.
   * This is the same logic used by the ESLint CLI executable to determine
   * configuration for each file it processes.
   * @param filePath The path of the file to retrieve a config object for.
   * @returns A configuration object for the file.
   */
  calculateConfigForFile(filePath: string): Promise<Linter.Config>;
  /**
   * Checks if a given path is ignored by ESLint.
   * @param filePath The path of the file to check.
   * @returns Whether or not the given path is ignored.
   */
  isPathIgnored(filePath: string): Promise<boolean>;
  /**
   * Executes the current configuration on an array of file and directory names.
   * @param patterns An array of file and directory names.
   * @returns The results of linting the file patterns given.
   */
  lintFiles(patterns: string[]): Promise<ESLint.LintResult[]>;
  /**
   * Executes the current configuration on text.
   * @param code A string of JavaScript code to lint.
   * @param options The options.
   * @returns The results of linting the string of code given.
   */
  lintText(
    code: string,
    options?: ESLint.LintTextOptions,
  ): Promise<ESLint.LintResult[]>;
  /**
   * Returns the formatter representing the given formatter name.
   * @param name The name of the formatter to load.
   * The following values are allowed:
   * - `undefined` ... Load `stylish` builtin formatter.
   * - A builtin formatter name ... Load the builtin formatter.
   * - A third party formatter name:
   *   - `foo` → `eslint-formatter-foo`
   *   - `@foo` → `@foo/eslint-formatter`
   *   - `@foo/bar` → `@foo/eslint-formatter-bar`
   * - A file path ... Load the file.
   * @returns A promise resolving to the formatter object.
   * This promise will be rejected if the given formatter was not found or not a function.
   */
  loadFormatter(name?: string): Promise<ESLint.Formatter>;
}

namespace ESLint {
  export interface ESLintOptions {
    /**
     * Enable or disable inline configuration comments.
     */
    allowInlineConfig?: boolean;
    /**
     * Base config object, extended by all configs used with this instance
     */
    baseConfig?: Linter.Config;
    /**
     * Enable result caching.
     */
    cache?: boolean;
    /**
     * The cache file to use instead of `.eslintcache`.
     */
    cacheLocation?: string;
    /**
     * The value to use for the current working directory.
     */
    cwd?: string;
    /**
     * If `false` then `ESLint#lintFiles()` doesn't throw even if no target files found. Defaults to `true`.
     */
    errorOnUnmatchedPattern?: boolean;
    /**
     * An array of file extensions to check.
     */
    extensions?: string[];
    /**
     * Execute in autofix mode. If a function, should return a boolean.
     */
    fix?: boolean | ((message: Linter.LintMessage) => boolean);
    /**
     * Array of rule types to apply fixes for.
     */
    fixTypes?: string[];
    /**
     * Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file.
     */
    globInputPaths?: boolean;
    /**
     * False disables use of `.eslintignore`.
     */
    ignore?: boolean;
    /**
     * The ignore file to use instead of `.eslintignore`.
     */
    ignorePath?: string;
    /**
     * Override config object, overrides all configs used with this instance
     */
    overrideConfig?: Linter.ConfigOverride;
    /**
     * The configuration file to use.
     */
    overrideConfigFile?: string;
    /**
     * An array of plugin implementations.
     */
    plugins?: Record<string, Linter.Plugin>;
    /**
     * the severity to report unused eslint-disable directives.
     */
    reportUnusedDisableDirectives?: Linter.SeverityString;
    /**
     * The folder where plugins should be resolved from, defaulting to the CWD.
     */
    resolvePluginsRelativeTo?: string;
    /**
     * An array of directories to load custom rules from.
     */
    rulePaths?: string[];
    /**
     * False disables looking for .eslintrc.* files.
     */
    useEslintrc?: boolean;
  }

  export interface DeprecatedRuleInfo {
    /**
     *  The rule ID.
     */
    ruleId: string;
    /**
     *  The rule IDs that replace this deprecated rule.
     */
    replacedBy: string[];
  }

  export interface LintResult {
    /**
     *  Number of errors for the result.
     */
    errorCount: number;
    /**
     *  The path to the file that was linted.
     */
    filePath: string;
    /**
     *  Number of fixable errors for the result.
     */
    fixableErrorCount: number;
    /**
     *  Number of fixable warnings for the result.
     */
    fixableWarningCount: number;
    /**
     *  All of the messages for the result.
     */
    messages: Linter.LintMessage[];
    /**
     * The source code of the file that was linted, with as many fixes applied as possible.
     */
    output?: string;
    /**
     * The source code of the file that was linted.
     */
    source?: string;
    /**
     *  The list of used deprecated rules.
     */
    usedDeprecatedRules: DeprecatedRuleInfo[];
    /**
     *  Number of warnings for the result.
     */
    warningCount: number;
  }

  export interface LintTextOptions {
    /**
     * The path to the file of the source code.
     */
    filePath?: string;
    /**
     * When set to true, warn if given filePath is an ignored path.
     */
    warnIgnored?: boolean;
  }

  export interface LintResultData<TMessageIds extends string> {
    rulesMeta: {
      [ruleId: string]: RuleMetaData<TMessageIds>;
    };
  }

  export type Formatter = <TMessageIds extends string>(
    results: LintResult[],
    data?: LintResultData<TMessageIds>,
  ) => string;
}

const ESLint = ESLintESLint as {
  /**
   * Creates a new instance of the main ESLint API.
   * @param options The options for this instance.
   */
  new (options?: ESLint.ESLintOptions): ESLint;

  // static members

  /**
   * Returns results that only contains errors.
   * @param results The results to filter.
   * @returns The filtered results.
   */
  getErrorResults(results: ESLint.LintResult): ESLint.LintResult;
  /**
   * Outputs fixes from the given results to files.
   * @param {LintResult[]} results The lint results.
   * @returns {Promise<void>} Returns a promise that is used to track side effects.
   */
  outputFixes(results: ESLint.LintResult): Promise<void>;
  /**
   * The version text.
   * @type {string}
   */
  readonly version: string;
};

export { ESLint };

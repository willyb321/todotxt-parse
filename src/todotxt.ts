import * as _ from "lodash";
/**
 * Parsed todo.txt string.
 *
 * @export
 * @interface parsedTask
 */
export interface parsedTask {
	complete: boolean;
	priority: string | null;
	text: Array<string>;
	origText: string;
	completionDate: string | null;
	creationDate: string | null;
	projects: Array<string> | null;
	contexts: Array<string> | null;
}
/**
 * Class to parse todo.txt strings.
 * @export
 * @class TodoTxt
 */
export class TodoTxt {
	private content: string;
	public parsed: parsedTask;
	/**
	 * Creates an instance of TodoTxt.
	 * @param {string} content Todo.txt task with anything described in https://github.com/todotxt/todo.txt
	 * @memberof TodoTxt
	 */
	constructor(content: string) {
		this.content = content;
		this.parsed = {} as parsedTask;
		this.parsed.origText = content;
	}

	/**
	 * Parse the text.
	 * Simply returns input.
	 * @memberof TodoTxt
	 */
	private parseTaskText(): void {
		this.parsed.text = _.split(this.content, ' ');
	}

	/**
	 * Parse completion
	 *
	 * @private
	 * @memberof TodoTxt
	 */
	private parseTaskCompletion(): void {
		console.log(this.content);
		const firstWord: string = [...this.content][0];
		if (firstWord === 'x') {
			this.parsed.complete = true;
		} else {
			this.parsed.complete = false;
		}
	}
	/**
	 * Parses the priority
	 * Priority will only be recognized if it is the first characters in the string.
	 * @private
	 * @memberof TodoTxt
	 */
	private parseTaskPriority(): void {
		const prioritySearch: number = this.content.search(/\([A-Z]\)\ /);
		if (prioritySearch === 0) {
			this.parsed.priority = this.content.substring(0, 3);
		} else {
			this.parsed.priority = null;
		}
	}
	/**
	 * Parses dates in the format YYYY-MM-DD
	 * eg 2017-12-31 for the last day of 2017
	 * @private
	 * @memberof TodoTxt
	 */
	private parseTaskDates(): void {
		const isoDateRegex = /\d{4}-\d{2}-\d{2}/g;
		const dates = this.content.match(isoDateRegex);
		const firstDatePos = this.content.search(isoDateRegex);

		// (A) 2011-03-02 2011-03-01 Review Tim's pull request +TodoTxtTouch @github
		if (dates && dates.length === 2 && firstDatePos === 4 && !this.parsed.complete) {
			throw new Error('Invalid data');
		}

		// x 2011-03-02 Review Tim's pull request +TodoTxtTouch @github
		if (dates && dates.length === 1 && this.parsed.complete && firstDatePos === 2) {
			console.log(`Task completion date: ${dates[0]}`);
			this.parsed.completionDate = dates[0];
		}

		// (A) 2011-03-02 Review Tim's pull request +TodoTxtTouch @github
		if (dates && dates.length === 1 && this.parsed.priority && firstDatePos === 4) {
			console.log(`Task creation date: ${dates[0]}`);
			this.parsed.creationDate = dates[0];
		}

		// 2011-03-02 Review Tim's pull request +TodoTxtTouch @github
		if (dates && dates.length === 1 && firstDatePos === 0) {
			console.log(`Task creation date: ${dates[0]}`);
			this.parsed.creationDate = dates[0];
		}

		// x 2011-03-02 2011-03-01 Review Tim's pull request +TodoTxtTouch @github
		if (dates && dates.length === 2 && firstDatePos === 2 && this.parsed.complete) {
			this.parsed.creationDate = dates[1];
			this.parsed.completionDate = dates[0];
		}

	}
	/**
	 * Parse projects eg +todotxt-parse
	 * @private
	 * @memberof TodoTxt
	 */
	private parseTaskProjects(): void {
		const projectRegex = /\ \+(?!\s)\w+/g;
		let projects = this.content.match(projectRegex);
		if (!projects) {
			this.parsed.projects = null;
		} else {
			this.parsed.projects = [];
			projects.forEach(elem => {
				if (Array.isArray(this.parsed.projects)) {
					this.parsed.projects.push(elem.toString().trim());
				}
			});
		}
	}
	/**
	 * Parse the contexts eg @dev
	 * @private
	 * @memberof TodoTxt
	 */
	private parseTaskContexts(): void {
		const contextRegex = /\ @(?!\s)\w+/g;
		let contexts = this.content.match(contextRegex);
		if (!contexts) {
			this.parsed.contexts = null;
		} else {
			this.parsed.contexts = [];
			contexts.forEach(elem => {
				if (Array.isArray(this.parsed.contexts)) {
					this.parsed.contexts.push(elem.toString().trim());
				}
			});
		}
	}
	/**
	 * Parses the string passed in the constructor
	 * Returns a parsed object.
	 * @returns {parsedTask}
	 * @memberof TodoTxt
	 */
	public parse(): parsedTask {
		try {
		this.parseTaskText();
		this.parseTaskCompletion();
		this.parseTaskPriority();
		this.parseTaskDates();
		this.parseTaskProjects();
		this.parseTaskContexts();
		} catch (err) {
			return err;
		}
		return this.parsed;
	}
}

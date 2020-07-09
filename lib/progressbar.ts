import  { bgWhite, Chalk, white } from 'chalk'

export default class ProgressBar {
    total:number
    current:number
    bar_length:number = process.stdout.columns - 30
	constructor(total:number) {
        this.bar_length = process.stdout.columns - 30
        this.total = total
		this.current = 0
		this.update(this.current)
	}

	update(current:number) {
		this.current = current
		const current_progress = this.current / this.total
		this.draw(current_progress);
	}

	draw(current_progress:number) {
		const filled_bar_length = parseInt((current_progress * this.bar_length).toFixed(0))
		const empty_bar_length = this.bar_length - filled_bar_length

		const filled_bar = this.get_bar(filled_bar_length, " ", bgWhite);
		const empty_bar = this.get_bar(empty_bar_length, "-", white);
		const percentage_progress = (current_progress * 100).toFixed(2);

		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
		process.stdout.write(
			`Current progress: [${filled_bar}${empty_bar}] | ${percentage_progress}%`
		);
	}

	get_bar(length:number, char:string, color?:Chalk) {
		let str = "";
		for (let i = 0; i < length; i++) {
			str += char;
		}
        if(typeof color == 'undefined') return color
        return color(str)
	}
}
function z(a:any) {
    return a
}
type w = typeof z
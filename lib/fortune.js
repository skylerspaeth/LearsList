const fortunes = [
	"Conquer your fears or they will conquer you.",
	"Do not say do not say!",
	"Do not fear what you don't know",
	"You are so so epic!",
	"You will have a pleasnt suprise waiting for you.",
	"Whenever possible, keep it simple.",
	"You have a secret admirer.",
	"Your love life will soon be happy and harmonious.",
	"The middle of the process is no place to determine the end of it."
]

let idx, liFortunes = "";

module.exports.clear = () => { liFortunes = ""; }
module.exports.get = (ct) => { 
	if (ct) {
		for (i=0;i<ct;i++) {
		idx = Math.floor(Math.random() * fortunes.length);
		liFortunes += `<li onclick="removeElement(this)" id="n${i}">${fortunes[idx]}</li>`;
		}
		return liFortunes;
	} else {
		idx = Math.floor(Math.random() * fortunes.length);
		return fortunes[idx];
	}
}

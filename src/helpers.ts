const STORAGE = sessionStorage;

function toTwoDigits(n:number): string {
	// n : integer, returnd 01..99
	const s = String(n).padStart(2,'0');
	return s;
}

interface RunOption {
	maxSequence: number;
	dataStorageName: string;
}

import { expect } from "./test.mjs";

let passing = true;

// potentially add tests later (little hard to test...)

if (!passing) {
	console.error("Some tests failed!");
	process.exitCode = 1;
} else {
	console.log("All tests passed!");
}

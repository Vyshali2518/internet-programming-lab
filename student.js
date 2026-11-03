
const prompt = require("prompt-sync")();

let name = prompt("Enter student name: ");
let rollNo = prompt("Enter roll number: ");
let studentClass = prompt("Enter class: ");

const subjects = [
    "English",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Social Studies",
    "Hindi",
    "Economics",
    "Environmental Science"
];

let marks = [];
let total = 0;

for (let i = 0; i < subjects.length; i++) {
    let mark;

    do {
        mark = Number(
            prompt(`Enter marks for ${subjects[i]} (0-100): `)
        );

        if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
            console.log("Enter valid marks between 0 and 100.");
        }
    } while (!Number.isFinite(mark) || mark < 0 || mark > 100);

    marks.push(mark);
    total += mark;
}

let average = total / subjects.length;

console.log("\n========== STUDENT REPORT ==========");
console.log("Student Name : " + name);
console.log("Roll Number  : " + rollNo);
console.log("Class        : " + studentClass);

console.log("\n-------------------------------------------");
console.log("| Subject                | Marks         |");
console.log("-------------------------------------------");

for (let i = 0; i < subjects.length; i++) {
    console.log(
        "| " + subjects[i].padEnd(22) +
        "| " + String(marks[i]).padEnd(14) + "|"
    );
}

console.log("-------------------------------------------");
console.log("| Total Marks            | " + total + "/1000");
console.log("| Average Marks          | " + average.toFixed(2));
console.log("-------------------------------------------");

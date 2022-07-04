const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const characterGenerator = (choice) => {
  let caractere = "";
  if (choice === 1) {
    caractere = Math.ceil(Math.random() * 9);
  } else {
    caractere = alphabet[Math.ceil(Math.random() * 25)];
  }
  return caractere;
};

export function passwordGenerator() {
  const code = [""];

  for (let i = 0; i < 13; i++) {
    const choice = Math.ceil(Math.random() * 2);
    code.push(characterGenerator(choice));
  }
  const newPassword = code.join("");

  return newPassword;
}

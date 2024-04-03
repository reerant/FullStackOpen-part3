const mongoose = require("mongoose");

//check if db url and password is given
if (process.argv.length < 3) {
  console.log("Give database url and password as an argument, please.");
  process.exit(1);
}

const name = process.argv[3];
const number = process.argv[4];
const url = process.argv[2];

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

//check if too many arguments are given
if (process.argv.length > 5) {
  console.log(
    `Too many arguments. Give only password, name and number, please.`
  );
  process.exit(1);
}
//save data
if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  });
  person.save().then((result) => {
    console.log(
      `Added name:${result.name} and number:${result.number} to the Phonebook.`
    );
    mongoose.connection.close();
  });
  //show data
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
  //check if both name and number are given
} else {
  console.log(`Give name and number as arguments, please.`);
  process.exit(1);
}

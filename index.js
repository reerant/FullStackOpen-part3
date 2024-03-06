const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  { id: 1, name: "Maija Poppanen", number: "040-81180092" },
  { id: 2, name: "Matti Meikäläinen", number: "050-92871818" },
  { id: 3, name: "Pekka Salmela", number: "051-8292727" },
  { id: 4, name: "Liisa Järvelä", number: "040-9778787" },
  { id: 5, name: "Maija Meikäläinen", number: "050-8383838" },
];

// ROUTES
//get all resources: persons and their phonenumbers
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//get app info
app.get("/info", (request, response) => {
  response.send(
    `<div><p>Phonebook has info for ${persons.length} people.
    </p><p>${new Date()} </p></div>`
  );
});

//get one resource: person's name and number
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    return response.json(person);
  }
  response.status(404).end();
});

//delete resource
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const getRandomNumber = () => Math.floor(Math.random() * 4000);

//add new resource
app.post("/api/persons", (request, response) => {
  const body = request.body;

  //check if name or number is missing,
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing!",
    });
  }

  //check if given name is already in the phonebook
  if (
    persons.find(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({
      error: "Name must be unique!",
    });
  }
  const person = {
    id: getRandomNumber(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  console.log(person);
  response.json(person);
});

// PORT 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

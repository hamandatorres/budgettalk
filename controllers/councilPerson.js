// In-memory database of council persons
const councilPersons = [
	{
		id: 1,
		name: "Sarah Johnson",
		party: "Progressive",
		seniority: 8,
	},
	{
		id: 2,
		name: "Michael Chen",
		party: "Conservative",
		seniority: 4,
	},
	{
		id: 3,
		name: "Diana Rodriguez",
		party: "Moderate",
		seniority: 6,
	},
	{
		id: 4,
		name: "James Wilson",
		party: "Independent",
		seniority: 12,
	},
	{
		id: 5,
		name: "Maria Garcia",
		party: "Green",
		seniority: 10,
	},
	{
		id: 6,
		name: "Robert Taylor",
		party: "Progressive",
		seniority: 15,
	},
	{
		id: 7,
		name: "Emily White",
		party: "Conservative",
		seniority: 9,
	},
	{
		id: 8,
		name: "David Kim",
		party: "Moderate",
		seniority: 5,
	},
	{
		id: 9,
		name: "Lisa Martinez",
		party: "Green",
		seniority: 7,
	},
	{
		id: 10,
		name: "John Thompson",
		party: "Independent",
		seniority: 11,
	},
];

// Arrays for name generation
const firstNames = [
	"James",
	"Mary",
	"John",
	"Patricia",
	"Robert",
	"Jennifer",
	"Michael",
	"Linda",
	"William",
	"Elizabeth",
	"David",
	"Barbara",
	"Richard",
	"Susan",
	"Joseph",
	"Jessica",
	"Thomas",
	"Sarah",
	"Charles",
	"Karen",
	"Christopher",
	"Nancy",
	"Daniel",
	"Lisa",
	"Matthew",
	"Betty",
	"Anthony",
	"Margaret",
	"Donald",
	"Sandra",
	"Mark",
	"Ashley",
	"Paul",
	"Kimberly",
	"Steven",
	"Emily",
	"Andrew",
	"Donna",
	"Kenneth",
	"Michelle",
	"Joshua",
	"Carol",
	"Kevin",
	"Amanda",
	"Brian",
	"Dorothy",
	"George",
	"Melissa",
	"Edward",
	"Deborah",
];

const lastNames = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Garcia",
	"Miller",
	"Davis",
	"Rodriguez",
	"Martinez",
	"Hernandez",
	"Lopez",
	"Gonzalez",
	"Wilson",
	"Anderson",
	"Thomas",
	"Taylor",
	"Moore",
	"Jackson",
	"Martin",
	"Lee",
	"Perez",
	"Thompson",
	"White",
	"Harris",
	"Sanchez",
	"Clark",
	"Ramirez",
	"Lewis",
	"Robinson",
	"Walker",
	"Young",
	"Allen",
	"King",
	"Wright",
	"Scott",
	"Torres",
	"Nguyen",
	"Hill",
	"Flores",
	"Green",
	"Adams",
	"Nelson",
	"Baker",
	"Hall",
	"Rivera",
	"Campbell",
	"Mitchell",
	"Carter",
	"Roberts",
];

// Helper function to check if a name combination already exists
function isNameUnique(fullName, currentIds) {
	return !councilPersons.some((person) => person.name === fullName);
}

// Helper function to generate a new council person with a unique ID and random name/seniority
function generateCouncilPerson(party, currentIds) {
	// Find a unique ID
	let newId = 1;
	while (currentIds.includes(newId)) {
		newId++;
	}

	// Generate a unique name combination
	let firstName, lastName, fullName;
	do {
		firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		fullName = `${firstName} ${lastName}`;
	} while (!isNameUnique(fullName, currentIds));

	// Random seniority between 1 and 50 (increased range)
	const seniority = Math.floor(Math.random() * 50) + 1;
	return {
		id: newId,
		name: fullName,
		party,
		seniority,
		wins: 0, // Initialize wins to 0 for new council members
	};
}

// Helper function to get next available ID
function getNextId() {
	return Math.max(...councilPersons.map((cp) => cp.id), 0) + 1;
}

module.exports = {
	// Create new council person
	createCouncilPerson: (req, res) => {
		const { name, party, seniority } = req.body;

		// Validate input
		if (!name || !party || seniority === undefined) {
			return res
				.status(400)
				.json({ message: "Name, party, and seniority are required" });
		}

		// Check if name is unique
		if (!isNameUnique(name)) {
			return res.status(400).json({ message: "Name must be unique" });
		}

		// Create new council person
		const newPerson = {
			id: getNextId(),
			name,
			party,
			seniority: Math.min(Math.max(1, seniority), 50), // Ensure seniority is between 1 and 50
			wins: 0,
		};

		councilPersons.push(newPerson);
		res.status(201).json(newPerson);
	},

	// Get all council persons
	getAllCouncilPersons: (req, res) => {
		console.log("GET /api/councilperson called");
		console.log("Sending council persons:", councilPersons);
		res.status(200).json(councilPersons);
	},

	// Get council person by ID
	getCouncilPersonById: (req, res) => {
		const id = parseInt(req.params.id);
		const councilPerson = councilPersons.find((cp) => cp.id === id);

		if (councilPerson) {
			res.status(200).json(councilPerson);
		} else {
			res.status(404).json({ message: "Council person not found" });
		}
	},

	// Update council person (for updating wins)
	updateCouncilPerson: (req, res) => {
		const id = parseInt(req.params.id);
		const index = councilPersons.findIndex((cp) => cp.id === id);

		if (index !== -1) {
			councilPersons[index] = { ...councilPersons[index], ...req.body };
			res.status(200).json(councilPersons[index]);
		} else {
			res.status(404).json({ message: "Council person not found" });
		}
	},

	// Delete council person and generate replacement
	deleteAndReplace: (req, res) => {
		const id = parseInt(req.params.id);
		const index = councilPersons.findIndex((cp) => cp.id === id);

		if (index !== -1) {
			const deletedPerson = councilPersons[index];
			const currentIds = councilPersons.map((cp) => cp.id);

			// Generate new council person of same party
			const newPerson = generateCouncilPerson(deletedPerson.party, currentIds);

			// Replace the deleted person with the new one
			councilPersons[index] = newPerson;

			res.status(200).json({
				deleted: deletedPerson,
				replacement: newPerson,
			});
		} else {
			res.status(404).json({ message: "Council person not found" });
		}
	},
};

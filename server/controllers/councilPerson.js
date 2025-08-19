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

// Helper function to generate a new council person with a unique ID and random name/seniority
function generateCouncilPerson(party, currentIds) {
	const names = [
		"Alex Morgan",
		"Taylor Lee",
		"Jordan Brown",
		"Casey Patel",
		"Morgan Smith",
		"Riley Davis",
		"Cameron Clark",
		"Avery Lewis",
		"Peyton Walker",
		"Quinn Hall",
	];
	// Find a unique ID
	let newId = 1;
	while (currentIds.includes(newId)) {
		newId++;
	}
	// Pick a random name
	const name = names[Math.floor(Math.random() * names.length)];
	// Random seniority between 1 and 15
	const seniority = Math.floor(Math.random() * 15) + 1;
	return {
		id: newId,
		name,
		party,
		seniority,
	};
}

module.exports = {
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

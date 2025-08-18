// In-memory database of council persons
const councilPersons = [
	{
		id: 1,
		name: "Sarah Johnson",
		party: "Democrat",
		seniority: 8,
	},
	{
		id: 2,
		name: "Michael Chen",
		party: "Republican",
		seniority: 4,
	},
	{
		id: 3,
		name: "Diana Rodriguez",
		party: "Democrat",
		seniority: 6,
	},
	{
		id: 4,
		name: "James Wilson",
		party: "Republican",
		seniority: 2,
	},
	{
		id: 5,
		name: "Maria Garcia",
		party: "Independent",
		seniority: 10,
	},
];

module.exports = {
	// Get all council persons
	getAllCouncilPersons: (req, res) => {
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

	// Update council person
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
};

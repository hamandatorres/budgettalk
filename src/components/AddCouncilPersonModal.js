import React, { useState } from "react";
import "./AddCouncilPersonModal.css";

const AddCouncilPersonModal = ({ isOpen, onClose, onSave }) => {
	const [formData, setFormData] = useState({
		name: "",
		party: "Progressive",
		seniority: 1,
	});

	const parties = [
		"Progressive",
		"Conservative",
		"Moderate",
		"Independent",
		"Green",
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
		setFormData({ name: "", party: "Progressive", seniority: 1 });
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "seniority") {
			// Ensure seniority is between 1 and 50
			const seniority = Math.min(Math.max(1, parseInt(value) || 1), 50);
			setFormData((prev) => ({ ...prev, [name]: seniority }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2>Add New Council Member</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="name">Name:</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="party">Party:</label>
						<select
							id="party"
							name="party"
							value={formData.party}
							onChange={handleChange}
							required
						>
							{parties.map((party) => (
								<option key={party} value={party}>
									{party}
								</option>
							))}
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="seniority">Years of Service (1-50):</label>
						<input
							type="number"
							id="seniority"
							name="seniority"
							min="1"
							max="50"
							value={formData.seniority}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="modal-buttons">
						<button type="submit" className="save-button">
							Save
						</button>
						<button type="button" className="cancel-button" onClick={onClose}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddCouncilPersonModal;

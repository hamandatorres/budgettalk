import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCouncilPerson } from "../store/slices/councilPersonSlice";
import { toggleModal } from "../store/slices/uiSlice";
import {
	createSuccessNotification,
	createErrorNotification,
} from "../store/slices/notificationSlice";
import { POLITICAL_ICONS } from "../data/politicalIcons";
import "./AddCouncilPersonModal.css";

const AddCouncilPersonModal = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector((state) => state.ui.isModalOpen);
	const { createLoading } = useSelector((state) => state.councilPerson);

	const [formData, setFormData] = useState({
		name: "",
		party: "Progressive",
		seniority: 1,
		avatarId: POLITICAL_ICONS[0].id,
	});

	const parties = [
		"Progressive",
		"Conservative",
		"Moderate",
		"Independent",
		"Green",
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await dispatch(createCouncilPerson(formData)).unwrap();
			dispatch(toggleModal());
			dispatch(
				createSuccessNotification(`${formData.name} has joined the council!`)
			);
			setFormData({
				name: "",
				party: "Progressive",
				seniority: 1,
				avatarId: POLITICAL_ICONS[0].id,
			});
		} catch (error) {
			console.error("Error adding council person:", error);
			dispatch(
				createErrorNotification(
					error.message || "Failed to add council member. Please try again."
				)
			);
		}
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

					<div className="form-group">
						<label htmlFor="avatarId">Avatar:</label>
						<div className="avatar-selection">
							{POLITICAL_ICONS.map((icon) => (
								<button
									key={icon.id}
									type="button"
									className={`avatar-option ${
										formData.avatarId === icon.id ? "selected" : ""
									}`}
									onClick={() =>
										setFormData((prev) => ({ ...prev, avatarId: icon.id }))
									}
								>
									<span className="icon">{icon.symbol}</span>
									<span className="icon-name">{icon.name}</span>
								</button>
							))}
						</div>
					</div>

					<div className="modal-buttons">
						<button
							type="submit"
							className="save-button"
							disabled={createLoading}
						>
							{createLoading ? "Adding..." : "Save"}
						</button>
						<button
							type="button"
							className="cancel-button"
							onClick={() => dispatch(toggleModal())}
							disabled={createLoading}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddCouncilPersonModal;

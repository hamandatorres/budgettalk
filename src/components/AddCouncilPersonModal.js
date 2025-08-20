import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddCouncilPersonModal.css";
import { createCouncilPerson } from "../store/slices/councilPersonSlice";
import { toggleModal } from "../store/slices/uiSlice";

const AddCouncilPersonModal = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isModalOpen);
    
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createCouncilPerson(formData)).unwrap();
            dispatch(toggleModal());
            setFormData({ name: "", party: "Progressive", seniority: 1 });
        } catch (error) {
            console.error("Error adding council person:", error);
            alert(error.response?.data?.message || "Error adding council person");
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

                    <div className="modal-buttons">
                        <button type="submit" className="save-button">
                            Save
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => dispatch(toggleModal())}
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

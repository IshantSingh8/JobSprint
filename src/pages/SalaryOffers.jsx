import { useState } from "react";

const STORAGE_KEY = "jobsprint-salary-offers";

const getStoredOffers = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const emptyOffer = {
    company: "",
    role: "",
    location: "",
    workMode: "Onsite",
    expectedSalary: "",
    offeredSalary: "",
    monthlyInHand: "",
    offerDate: "",
    status: "Potential",
    notes: "",
};

function SalaryOffers() {
    const [offers, setOffers] = useState(
        getStoredOffers
    );

    const [showForm, setShowForm] = useState(false);

    const [editingOffer, setEditingOffer] =
        useState(null);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [formData, setFormData] =
        useState(emptyOffer);

    const saveOffers = (updatedOffers) => {
        setOffers(updatedOffers);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedOffers)
        );
    };

    const openAddForm = () => {
        setEditingOffer(null);
        setFormData(emptyOffer);
        setShowForm(true);
    };

    const openEditForm = (offer) => {
        setEditingOffer(offer);

        setFormData({
            company: offer.company || "",
            role: offer.role || "",
            location: offer.location || "",
            workMode: offer.workMode || "Onsite",
            expectedSalary:
                offer.expectedSalary || "",
            offeredSalary:
                offer.offeredSalary || "",
            monthlyInHand:
                offer.monthlyInHand || "",
            offerDate: offer.offerDate || "",
            status: offer.status || "Potential",
            notes: offer.notes || "",
        });

        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingOffer(null);
        setFormData(emptyOffer);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.company.trim()) {
            alert("Please enter the company name.");
            return;
        }

        if (!formData.role.trim()) {
            alert("Please enter the role.");
            return;
        }

        if (editingOffer) {
            const updatedOffers = offers.map((offer) =>
                offer.id === editingOffer.id
                    ? {
                        ...offer,
                        ...formData,
                    }
                    : offer
            );

            saveOffers(updatedOffers);
        } else {
            const newOffer = {
                id: Date.now(),
                ...formData,
            };

            saveOffers([...offers, newOffer]);
        }

        closeForm();
    };

    const deleteOffer = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this salary record?"
        );

        if (!confirmed) {
            return;
        }

        const updatedOffers = offers.filter(
            (offer) => offer.id !== id
        );

        saveOffers(updatedOffers);
    };

    const filteredOffers = offers.filter((offer) => {
        const searchText = search
            .trim()
            .toLowerCase();

        const matchesSearch =
            !searchText ||
            offer.company
                ?.toLowerCase()
                .includes(searchText) ||
            offer.role
                ?.toLowerCase()
                .includes(searchText) ||
            offer.location
                ?.toLowerCase()
                .includes(searchText);

        const matchesStatus =
            statusFilter === "All" ||
            offer.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalRecords = offers.length;

    const offersReceived = offers.filter(
        (offer) => offer.status === "Offer Received"
    ).length;

    const acceptedOffers = offers.filter(
        (offer) => offer.status === "Accepted"
    ).length;

    const rejectedOffers = offers.filter(
        (offer) => offer.status === "Rejected"
    ).length;

    const numericSalaries = offers
        .map((offer) =>
            Number(
                String(offer.offeredSalary || "")
                    .replace(/[^0-9.]/g, "")
            )
        )
        .filter((salary) => salary > 0);

    const averageSalary =
        numericSalaries.length > 0
            ? (
                numericSalaries.reduce(
                    (total, salary) =>
                        total + salary,
                    0
                ) / numericSalaries.length
            ).toFixed(2)
            : "0";

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Salary & Offers</h1>

                    <p>
                        Track compensation, offers and your
                        expected salary.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={openAddForm}
                >
                    + Add Salary Record
                </button>
            </div>

            <div className="salary-stat-grid">
                <div className="salary-stat-card">
                    <span>Total Records</span>
                    <strong>{totalRecords}</strong>
                </div>

                <div className="salary-stat-card">
                    <span>Offers Received</span>
                    <strong>{offersReceived}</strong>
                </div>

                <div className="salary-stat-card">
                    <span>Accepted</span>
                    <strong>{acceptedOffers}</strong>
                </div>

                <div className="salary-stat-card">
                    <span>Average Offered CTC</span>
                    <strong>
                        {averageSalary === "0"
                            ? "—"
                            : `₹${averageSalary} LPA`}
                    </strong>
                </div>
            </div>

            <div className="salary-toolbar">
                <input
                    type="text"
                    placeholder="Search company, role or location..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >
                    <option value="All">All Statuses</option>
                    <option value="Potential">
                        Potential
                    </option>
                    <option value="Offer Received">
                        Offer Received
                    </option>
                    <option value="Accepted">
                        Accepted
                    </option>
                    <option value="Rejected">
                        Rejected
                    </option>
                </select>
            </div>

            {filteredOffers.length === 0 ? (
                <div className="salary-empty">
                    <div>💰</div>

                    <h3>No salary records found</h3>

                    <p>
                        Add your expected salary or an offer
                        to start tracking compensation.
                    </p>

                    <button
                        className="primary-button"
                        onClick={openAddForm}
                    >
                        + Add Salary Record
                    </button>
                </div>
            ) : (
                <div className="salary-list">
                    {filteredOffers.map((offer) => (
                        <div
                            className="salary-offer-card"
                            key={offer.id}
                        >
                            <div className="salary-offer-main">
                                <div>
                                    <h3>{offer.company}</h3>

                                    <p>{offer.role}</p>
                                </div>

                                <span
                                    className={`salary-status ${offer.status
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                >
                                    {offer.status}
                                </span>
                            </div>

                            <div className="salary-details-grid">
                                <div>
                                    <span>Expected</span>
                                    <strong>
                                        {offer.expectedSalary
                                            ? `₹${offer.expectedSalary} LPA`
                                            : "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Offered CTC</span>
                                    <strong>
                                        {offer.offeredSalary
                                            ? `₹${offer.offeredSalary} LPA`
                                            : "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Monthly In-Hand</span>
                                    <strong>
                                        {offer.monthlyInHand
                                            ? `₹${offer.monthlyInHand}`
                                            : "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Location</span>
                                    <strong>
                                        {offer.location || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Work Mode</span>
                                    <strong>
                                        {offer.workMode}
                                    </strong>
                                </div>

                                <div>
                                    <span>Offer Date</span>
                                    <strong>
                                        {offer.offerDate || "—"}
                                    </strong>
                                </div>
                            </div>

                            {offer.notes && (
                                <div className="salary-notes">
                                    <span>Notes</span>
                                    <p>{offer.notes}</p>
                                </div>
                            )}

                            <div className="salary-card-actions">
                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        openEditForm(offer)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="danger-button"
                                    onClick={() =>
                                        deleteOffer(offer.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal salary-modal">
                        <div className="modal-header">
                            <div>
                                <h2>
                                    {editingOffer
                                        ? "Edit Salary Record"
                                        : "Add Salary Record"}
                                </h2>

                                <p>
                                    Keep your compensation information
                                    organized.
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={closeForm}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="application-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Company *</label>

                                    <input
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="e.g. Microsoft"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Role *</label>

                                    <input
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Engineer"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Location</label>

                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Bangalore"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Work Mode</label>

                                    <select
                                        name="workMode"
                                        value={formData.workMode}
                                        onChange={handleChange}
                                    >
                                        <option value="Onsite">
                                            Onsite
                                        </option>

                                        <option value="Hybrid">
                                            Hybrid
                                        </option>

                                        <option value="Remote">
                                            Remote
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Expected Salary (LPA)
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        name="expectedSalary"
                                        value={
                                            formData.expectedSalary
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. 8"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Offered CTC (LPA)
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        name="offeredSalary"
                                        value={
                                            formData.offeredSalary
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. 7.5"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Monthly In-Hand (₹)
                                    </label>

                                    <input
                                        type="number"
                                        name="monthlyInHand"
                                        value={
                                            formData.monthlyInHand
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. 52000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Offer Date</label>

                                    <input
                                        type="date"
                                        name="offerDate"
                                        value={formData.offerDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Status</label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Potential">
                                            Potential
                                        </option>

                                        <option value="Offer Received">
                                            Offer Received
                                        </option>

                                        <option value="Accepted">
                                            Accepted
                                        </option>

                                        <option value="Rejected">
                                            Rejected
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group form-group-full">
                                    <label>Notes</label>

                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Notice period, bonus, relocation, joining date, etc."
                                        rows="4"
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={closeForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    {editingOffer
                                        ? "Update Record"
                                        : "Save Record"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalaryOffers;
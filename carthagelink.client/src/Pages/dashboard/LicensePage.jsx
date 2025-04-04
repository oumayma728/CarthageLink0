import { useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import LicensesTable from "../../components/features/licenses/LicensesTable";
import useLicenses from "../../hooks/useLicenses";
import DeleteModal from "../../components/ui/DeleteModal";
import { Link } from "react-router-dom";
export default function LicensePage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState(null);
  
  const { licenses, isLoading, error, deleteLicense, fetchLicenses } = useLicenses();

  const handleDelete = async () => {
    try {
      await deleteLicense(selectedLicenseId);
      setIsDeleteModalOpen(false);
      fetchLicenses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedLicenseId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout activePage="/licenses">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl font-semibold mb-2 sm:mb-0">Licenses</h1>
          <Link 
            to="/add-license"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Add License
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            Error: {error}
          </div>
        )}

        <LicensesTable 
          licenses={licenses}
          isLoading={isLoading}
          onDelete={openDeleteModal}
        />
      </div>

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        title="Delete License"
        message="Are you sure you want to delete this license? This action cannot be undone."
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
interface AdminHeaderProps {
  // No props needed for now, but keeping interface for future extensibility
}

const AdminHeader = ({}: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-600">Manage system settings and user access</p>
      </div>
    </div>
  );
};

export default AdminHeader;

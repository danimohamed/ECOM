import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers, deleteUser, updateUserRole } from '../../store/adminSlice';
import { HiOutlineSearch } from 'react-icons/hi';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleRoleChange = (id, role) => {
    dispatch(updateUserRole({ id, role }));
  };

  const filtered = users
    .filter((u) => {
      const matchSearch = !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const customerCount = users.filter((u) => u.role === 'customer').length;

  return (
    <div>
      <div className="admin-header">
        <h1>Users <span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>({users.length})</span></h1>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <p className="label">Total Users</p>
          <p className="value" style={{ fontSize: 24 }}>{users.length}</p>
        </div>
        <div className="stat-card">
          <p className="label">Admins</p>
          <p className="value" style={{ fontSize: 24 }}>{adminCount}</p>
        </div>
        <div className="stat-card">
          <p className="label">Customers</p>
          <p className="value" style={{ fontSize: 24 }}>{customerCount}</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiOutlineSearch size={16} />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="admin-filters">
          <div className="admin-filter-item">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: 40 }}>No users found</td></tr>
          ) : filtered.map((user) => (
            <tr key={user._id}>
              <td style={{ fontWeight: 500 }}>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`status-badge ${user.role === 'admin' ? 'shipped' : 'pending'}`}>
                  {user.role.toUpperCase()}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12 }}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                  {user.role !== 'admin' && (
                    <button onClick={() => handleDelete(user._id)} style={{ fontSize: 13, color: '#d32f2f', fontWeight: 600 }}>Delete</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
